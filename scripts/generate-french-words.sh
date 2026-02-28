#!/bin/bash
#
# Generates common French nouns with grammatical gender using the OpenAI
# Chat Completion API. Words are produced in batches within a rolling
# conversation so the model avoids repeating itself. A local seen-set
# (file-based) guarantees uniqueness on the client side as well.
#
# Requirements: curl, jq
# Usage: ./generate-french-words.sh <openai-api-key> [output-file]

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────
OPENAI_API_KEY="${1:?Usage: $0 <openai-api-key> [output-file]}"
OUTPUT_FILE="${2:-french-words.json}"

TARGET_COUNT=$((366 * 8))  # 2928
BATCH_SIZE=50
MODEL="gpt-4o-mini"
# After this many batches the conversation is reset (with the full word
# list injected into the system prompt) to stay well within the context
# window.
MAX_BATCHES_PER_CONVERSATION=20

# ── Dependency check ─────────────────────────────────────────────────
for cmd in curl jq; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "Error: '$cmd' is required but not installed." >&2
    exit 1
  fi
done

# ── Working files ────────────────────────────────────────────────────
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

MESSAGES_FILE="$WORK_DIR/messages.json"
SEEN_FILE="$WORK_DIR/seen.txt"       # one word per line
WORDS_FILE="$WORK_DIR/words.jsonl"   # one JSON object per line
BATCH_FILE="$WORK_DIR/batch.jsonl"

touch "$SEEN_FILE" "$WORDS_FILE"

# ── Helpers ──────────────────────────────────────────────────────────

init_conversation() {
  local base
  base="You are generating common French nouns for a language-learning app that teaches grammatical gender."
  base="$base For each noun provide the French word (lowercase, without article) and its grammatical gender."
  base="$base Respond with ONLY a valid JSON array of objects with keys \"fr\" (string) and \"gender\" (\"masculine\" or \"feminine\")."
  base="$base No markdown fences, no explanations, no extra text — just the raw JSON array."

  local seen_count
  seen_count=$(wc -l < "$SEEN_FILE" | tr -d ' ')

  if [ "$seen_count" -gt 0 ]; then
    local word_list
    word_list=$(paste -sd', ' "$SEEN_FILE")
    base="$base IMPORTANT: The following $seen_count words have already been generated. Do NOT repeat any of them: $word_list"
  fi

  jq -n --arg sys "$base" '[{"role":"system","content":$sys}]' > "$MESSAGES_FILE"
}

# Retry-aware wrapper around the chat completions endpoint.
call_api() {
  local request_body="$1"
  local max_retries=4
  local attempt=0
  local wait_time=4

  while [ "$attempt" -lt "$max_retries" ]; do
    attempt=$((attempt + 1))

    local response http_code body
    response=$(curl -sS -w "\n%{http_code}" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -d "$request_body" \
      https://api.openai.com/v1/chat/completions 2>&1) || true

    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "200" ]; then
      echo "$body"
      return 0
    fi

    echo "  ⚠ API error (HTTP $http_code), attempt $attempt/$max_retries" >&2

    case "$http_code" in
      429|500|502|503)
        echo "  Retrying in ${wait_time}s …" >&2
        sleep "$wait_time"
        wait_time=$((wait_time * 2))
        ;;
      *)
        echo "  Non-retryable error. Response:" >&2
        echo "$body" >&2
        return 1
        ;;
    esac
  done

  echo "  Failed after $max_retries attempts." >&2
  return 1
}

# Attempt several strategies to pull a JSON array out of the model's
# response (which may be wrapped in markdown fences or other noise).
parse_json_array() {
  local input="$1"
  local out_file="$2"

  # Strategy 1: raw response is valid JSON
  if echo "$input" | jq -c '.[]' > "$out_file" 2>/dev/null && [ -s "$out_file" ]; then
    return 0
  fi

  # Strategy 2: strip markdown code fences and retry
  local stripped
  stripped=$(echo "$input" | sed '/^```/d')
  if echo "$stripped" | jq -c '.[]' > "$out_file" 2>/dev/null && [ -s "$out_file" ]; then
    return 0
  fi

  # Strategy 3: brute-force extract the first [...] substring
  local extracted
  extracted=$(echo "$input" | tr '\n' ' ' | sed 's/.*\(\[.*\]\).*/\1/') || true
  if [ -n "$extracted" ] && echo "$extracted" | jq -c '.[]' > "$out_file" 2>/dev/null && [ -s "$out_file" ]; then
    return 0
  fi

  return 1
}

# ── Main loop ────────────────────────────────────────────────────────

echo "═══════════════════════════════════════════════"
echo " French word generator"
echo " Target:     $TARGET_COUNT unique words"
echo " Model:      $MODEL"
echo " Batch size: $BATCH_SIZE"
echo " Output:     $OUTPUT_FILE"
echo "═══════════════════════════════════════════════"
echo ""

init_conversation
conversation_batch=0
total_batch=0

while true; do
  unique_count=$(wc -l < "$WORDS_FILE" | tr -d ' ')

  if [ "$unique_count" -ge "$TARGET_COUNT" ]; then
    break
  fi

  # Periodically reset the conversation to keep token usage in check.
  if [ "$conversation_batch" -ge "$MAX_BATCHES_PER_CONVERSATION" ]; then
    echo ""
    echo "── Resetting conversation (injecting seen-word list) ──"
    echo ""
    init_conversation
    conversation_batch=0
  fi

  total_batch=$((total_batch + 1))
  conversation_batch=$((conversation_batch + 1))
  remaining=$((TARGET_COUNT - unique_count))

  # Request a few extra to compensate for duplicates the model might
  # still produce despite the conversation context.
  request_count=$BATCH_SIZE
  if [ "$remaining" -lt "$((BATCH_SIZE + 10))" ]; then
    request_count=$((remaining + 10))
  fi

  echo "[Batch $total_batch]  $unique_count / $TARGET_COUNT unique words — requesting $request_count"

  if [ "$conversation_batch" -eq 1 ]; then
    user_msg="Generate exactly $request_count common French nouns with their grammatical gender. Choose well-known, everyday words covering diverse topics such as food, animals, household items, clothing, nature, body parts, professions, places, emotions, transport, and more."
  else
    user_msg="Generate exactly $request_count more common French nouns with their grammatical gender. Do NOT repeat any word from previous responses. Explore different vocabulary areas you haven't covered yet."
  fi

  # Append the user turn to the conversation history.
  jq --arg msg "$user_msg" '. + [{"role":"user","content":$msg}]' \
    "$MESSAGES_FILE" > "$WORK_DIR/tmp.json"
  mv "$WORK_DIR/tmp.json" "$MESSAGES_FILE"

  # Build the request payload.
  request_body=$(jq -n \
    --arg model "$MODEL" \
    --slurpfile msgs "$MESSAGES_FILE" \
    '{
      model: $model,
      messages: $msgs[0],
      temperature: 1.0,
      max_tokens: 4096
    }')

  # Call the API.
  api_response=$(call_api "$request_body") || {
    echo "  Skipping batch due to API error."
    # Roll back the user message so we can retry cleanly.
    jq '.[:-1]' "$MESSAGES_FILE" > "$WORK_DIR/tmp.json"
    mv "$WORK_DIR/tmp.json" "$MESSAGES_FILE"
    conversation_batch=$((conversation_batch - 1))
    sleep 5
    continue
  }

  assistant_content=$(echo "$api_response" | jq -r '.choices[0].message.content // empty')

  if [ -z "$assistant_content" ]; then
    echo "  Warning: empty response — retrying …"
    jq '.[:-1]' "$MESSAGES_FILE" > "$WORK_DIR/tmp.json"
    mv "$WORK_DIR/tmp.json" "$MESSAGES_FILE"
    conversation_batch=$((conversation_batch - 1))
    sleep 2
    continue
  fi

  # Append the assistant turn to the conversation history.
  jq --arg msg "$assistant_content" '. + [{"role":"assistant","content":$msg}]' \
    "$MESSAGES_FILE" > "$WORK_DIR/tmp.json"
  mv "$WORK_DIR/tmp.json" "$MESSAGES_FILE"

  # Parse the response into individual JSON-line objects.
  if ! parse_json_array "$assistant_content" "$BATCH_FILE"; then
    echo "  Warning: could not parse JSON from response — skipping batch."
    continue
  fi

  # De-duplicate and collect.
  added=0
  while IFS= read -r obj; do
    fr=$(echo "$obj" | jq -r '.fr // empty' | tr '[:upper:]' '[:lower:]' | xargs 2>/dev/null) || continue
    gender=$(echo "$obj" | jq -r '.gender // empty') || continue

    [ -z "$fr" ] && continue
    [ -z "$gender" ] && continue

    # Accept only valid genders.
    if [ "$gender" != "masculine" ] && [ "$gender" != "feminine" ]; then
      continue
    fi

    if ! grep -qxF "$fr" "$SEEN_FILE" 2>/dev/null; then
      echo "$fr" >> "$SEEN_FILE"
      jq -n --arg fr "$fr" --arg gender "$gender" \
        '{"fr":$fr,"gender":$gender}' >> "$WORDS_FILE"
      added=$((added + 1))
    fi
  done < "$BATCH_FILE"

  unique_count=$(wc -l < "$WORDS_FILE" | tr -d ' ')
  echo "  ✓ +$added new  →  $unique_count / $TARGET_COUNT"

  # Small pause to stay well under rate limits.
  sleep 0.5
done

# ── Build final output ───────────────────────────────────────────────
echo ""
echo "Assembling output file …"
jq -s '.' "$WORDS_FILE" > "$OUTPUT_FILE"

final_count=$(jq 'length' "$OUTPUT_FILE")
echo ""
echo "═══════════════════════════════════════════════"
echo " Done!"
echo " Unique words: $final_count"
echo " Saved to:     $OUTPUT_FILE"
echo "═══════════════════════════════════════════════"
