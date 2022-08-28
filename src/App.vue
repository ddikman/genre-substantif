<script setup lang="ts">

import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { dictionary } from './data/data'

const word = ref('')
const match = ref<Word>()

const stored = ref<Word[]>([])

const recentFeminine = ref<Word[]>([
  { french: 'femme', gender: '' },
  { french: 'musée', gender: '' },
  { french: 'bouchée', gender: '' },
  { french: 'fusée', gender: '' },
  { french: 'chaussée', gender: '' },
])

const recentMasculine = ref<Word[]>([
  { french: 'café', gender: '' },
  { french: 'canapé', gender: '' },
  { french: 'carré', gender: '' },
  { french: 'chapeau', gender: '' },
  { french: 'supermarché', gender: '' },
])

const inLocal = localStorage.getItem('words')
if (inLocal) {
  stored.value = JSON.parse(inLocal)
}

const genders: any = {
  '1': '♂ masculine',
  '2': '♀ femenine',
  '3': 'unisex'
}

function toNormalForm(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function addMatch(match: Word) {
  const existingIndex = stored.value.findIndex((w) => w.french == match.french)
  if (existingIndex >= 0) {
    stored.value.splice(existingIndex, 1)
  }

  stored.value.unshift(match)
  localStorage.setItem('words', JSON.stringify(stored.value))
}

const debounceLookup = useDebounceFn((value: string) => {
  const matchedWord = dictionary.find((item) => item.word === value.toLowerCase() || toNormalForm(item.word) === value.toLowerCase())
  if (!matchedWord) {
    match.value = undefined
    return
  }
  match.value = {
      french: matchedWord.word,
      gender: genders[matchedWord.gender_id.toString()]
  }
  word.value = matchedWord.word
  addMatch(match.value)
}, 500)

watch(word, (value) => {
  localStorage.setItem('lastWord', value)
  debounceLookup(value)
})

word.value = localStorage.getItem('lastWord') || 'femme'

class Word {
  constructor(public french: string, public gender: string) {}
}

</script>

<template>
  <section>
    <div class="content container">
      <div class="row">
        <div class="col-md-8 section-text text-start p-0">
          <h1 id="find-gender">Find the gender of <span class="accent d-block">French nouns</span></h1>
          <p style="max-width: 70%;">Knowing if a noun is masculine or feminine is important in French. This will help you know if you should use `le` or `la`, `au` or `à la`, `un` or `une`, etc.</p>
        </div>
        <div class="col-md-4 p-0">
          <div class="card text-center">
            <input type="text" id="word" v-model="word" class="mb-2" />
            <div v-if="match">
              <p class="mb-2">is</p>
              <div class="accent subtitle">{{ match.gender }}</div>
            </div>
            <div v-else>This is not a word we know.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="fullwidth contrast-background">
    <div class="section-top-spacer container">
      <div class="row py-5">
        <div class="col-md-4 p-0">
          <h1 class="mr-4">Recently looked up</h1>
          <p>These are the words you or others have most recently looked up.</p>
        </div>
        <div class="col-md-2"></div>
        <div class="col-md-6 p-0">
        <h2 class="subtitle">♀ Feminine</h2>
        <div class="tag-cloud mt-2">
          <span class="tag" v-for="value in recentFeminine" :key="value.french">{{ value.french }}</span>
        </div>
        <div style="margin-top: 64px;"></div>
        <h2 class="subtitle">♂ Masculine</h2>
        <div class="tag-cloud mt-2">
          <span class="tag" v-for="value in recentMasculine" :key="value.french">{{ value.french }}</span>
        </div>
      </div>
      </div>
    </div>
  </div>
  <div class="container section-top-spacer">
    <div class="row">
      <div class="col-md-6 p-0 hide-mobile">
        <img src="/eiffel.png" />
      </div>
      <div class="col-md-6 p-0">
        <h2 id="other-resources">Other resources</h2>
        <p>Learning how to figure out the one from the other is also possible, check out these sites:</p>
        <ul>
          <li><a href="https://frenchtogether.com/french-nouns-gender/" target="_blank">How to easily guess the gender of French nouns with 80% accuracy</a></li>
          <li><a href="https://grammar.collinsdictionary.com/french-easy-learning/how-do-you-work-out-the-gender-of-french-nouns" target="_blank">How do you work out the gender of French nouns?</a></li>
        </ul>
        <h2 id="about" class="top-margin-large">About this project</h2>
        <p>I started learning French using Duolingo but found that I didn’t clearly understand or kept stumbling on the gender of several nouns. </p>
        <p>I built this page to help me remember it.</p>
        <p>It’s all open source and you can fork this or contribute at our <a href="https://github.com/ddikman/genre-substantif" target="_blank">github page</a></p>
      </div>
      </div>
  </div>
  <footer>
    <hr />
    <div>Copyright 2022 <a href="https://www.greycastle.se">Greycastle</a></div>
  </footer>
</template>

<style scoped>
#word {
  display: block;
}
</style>
