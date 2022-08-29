<script setup lang="ts">

import { ref, watch } from 'vue'

import { useDebounceFn } from '@vueuse/core'
import { dictionary } from '../data/data'

const word = ref('')
const match = ref<Word>()

const stored = ref<Word[]>([])

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
</template>