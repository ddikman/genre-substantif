<script setup lang="ts">

import { onKeyStroke } from '@vueuse/core';
import { ref } from 'vue';
import { FEMININE, MASCULINE } from '../models/word';
import AppArrowLeft from './AppArrowLeft.vue';
import AppArrowRight from './AppArrowRight.vue';
import AppButton from './AppButton.vue';
import AppClientOnly from './AppClientOnly.vue';
import { logEvent } from '../services/logEvent';

interface WordExample {
  word: string;
  tip: string;
  gender: string;
}

const FEMININE_ENDINGS = 'Feminine words typically end in -e or -ion, except -age, -ege, -é or -isme'
const MASCULINE_ENDINGS = 'Masculine words are typically not ending in -e or -ion'
const MASCULINE_ENDING_ACCENT = 'Words ending with -é are typically masculine as it is an exceptio to the rule of feminine words'
const EXCEPTION_E_ENDING = 'This is an exception, despite ending in -e it is masculine'

let words: WordExample[] = [
  { word: 'legume', 'tip': EXCEPTION_E_ENDING, gender: MASCULINE },
  { word: 'livre', 'tip': EXCEPTION_E_ENDING, gender: MASCULINE },
  { word: 'fenêtre', 'tip': FEMININE_ENDINGS, gender: FEMININE },
  { word: 'zoo', 'tip': MASCULINE_ENDINGS, gender: MASCULINE },
  { word: 'chat', 'tip': MASCULINE_ENDINGS, gender: MASCULINE },
  { word: 'cheval', 'tip': MASCULINE_ENDINGS, gender: MASCULINE },
  { word: 'plage', 'tip': FEMININE_ENDINGS, gender: FEMININE },
  { word: 'banque', 'tip': FEMININE_ENDINGS, gender: FEMININE },
  { word: 'maison', 'tip': FEMININE_ENDINGS, gender: FEMININE },
  { word: 'appartement', 'tip': MASCULINE_ENDINGS, gender: MASCULINE },
  { word: 'thé', 'tip': MASCULINE_ENDINGS, gender: MASCULINE },
  { word: 'chauffeur', 'tip': MASCULINE_ENDINGS, gender: MASCULINE },
  { word: 'café', 'tip': MASCULINE_ENDING_ACCENT, gender: MASCULINE },
  { word: 'salon', 'tip': MASCULINE_ENDINGS, gender: MASCULINE },
  { word: 'addition', 'tip': FEMININE_ENDINGS, gender: FEMININE },
  { word: 'musique', 'tip': FEMININE_ENDINGS, gender: FEMININE },
  { word: 'verre', 'tip': FEMININE_ENDINGS, gender: FEMININE },
  { word: 'banque', 'tip': FEMININE_ENDINGS, gender: FEMININE },
]

let triedWords: WordExample[] = []

const randomWord = () => {
  const index = Math.floor(Math.random() * words.length);
  const selectedWord = words.splice(index, 1)[0]
  triedWords.push(selectedWord)
  if (words.length === 0) {
    words = triedWords
    triedWords = []
  }
  return selectedWord;
}

const word = ref(randomWord())
const previousWord = ref(word.value)
const answered = ref(false);

const correctAnswer = ref(false);
const tip = ref('');

const answer = (gender: string) => {
  answered.value = true;
  correctAnswer.value = gender == word.value.gender;
  tip.value = word.value.tip;
  previousWord.value = word.value;
  word.value = randomWord();
  logEvent('practiceAnswer', { result: correctAnswer.value, word: previousWord.value.word })
}

onKeyStroke('ArrowLeft', () => answer(FEMININE))
onKeyStroke('ArrowRight', () => answer(MASCULINE))

</script>

<template>
  <AppClientOnly>
    <section class="section-top-spacer">
      <div class="content container">
        <div class="row">
          <div class="col-md-6 section-text text-start p-0">
            <h1 id="find-gender"><span class="accent">Practise</span> makes perfect</h1>
            <div style="max-width: 70%;">
              <p>Try a few words, even if you don’t know them, and see if you can guess which it is.</p>
              <p>We will give you tips along the way!</p>
            </div>
          </div>
          <div class="col-md-6 p-0">
              <div class="card text-center">
                <h2 class="subtitle">{{ word.word }}</h2>
                <div class="button-choices">
                  <AppButton @click="answer(FEMININE)"><AppArrowLeft/> Feminine</AppButton>
                  <span>or</span>
                  <AppButton @click="answer(MASCULINE)">Masculine <AppArrowRight/></AppButton>
                </div>
                <div v-if="answered">
                  <hr/>
                  <div v-if="correctAnswer">That's right!<br/> <span class="the-word">{{ previousWord.word }}</span> is {{ previousWord.gender }}!</div>
                  <div v-else>
                    <p>I'm sorry. <span class="the-word">{{ previousWord.word }}</span> is {{ previousWord.gender }}</p>
                    <p>{{ tip }}</p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  </AppClientOnly>
</template>

<style scoped>

.the-word {
  font-weight: bold;
  color: var(--color-accent);
}
.button-choices {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  gap: 0.5rem;
}

@media only screen and (max-width: 768px) {
  .button-choices span, .button-choices button svg {
    display: none
  }
}

</style>