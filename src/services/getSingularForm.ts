export function getSingularForm(word: string): string | null {
  // Define some common pluralization patterns in French
  const pluralPatterns: [RegExp, string][] = [
    [/eaux$/, 'eau'],      // Replace 'eaux' with 'eau'
    [/aux$/, 'al'],        // Replace 'aux' with 'al'
    [/s$/, ''],            // Remove 's' at the end
    [/x$/, ''],            // Remove 'x' at the end
  ];

  // Apply the patterns in order until a match is found
  for (const [pattern, replacement] of pluralPatterns) {
    if (pattern.test(word)) {
      return word.replace(pattern, replacement);
    }
  }

  // If no match is found, return the original word
  return null;
}