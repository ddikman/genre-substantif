<script setup lang="ts">

import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { dictionary } from './data/data'

const word = ref('')
const match = ref<Word>()

const stored = ref<Word[]>([])

const inLocal = localStorage.getItem('words')
if (inLocal) {
  stored.value = JSON.parse(inLocal)
}

const genders: any = {
  '1': 'male',
  '2': 'female',
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
  const matchedWord = dictionary.find((item) => toNormalForm(item.word) === value.toLocaleLowerCase())
  if (!matchedWord) {
    match.value = undefined
    return
  }
  match.value = {
      french: matchedWord.word,
      gender: genders[matchedWord.gender_id.toString()]
  }
  addMatch(match.value)
}, 500)

watch(word, (value) => {
  debounceLookup(value)
})

class Word {
  constructor(public french: string, public gender: string) {}
}

</script>

<template>
  <div>
    <label for="word">
      <span>Word</span>
      <input id="word" v-model="word" />
    </label>
    <div v-if="match">{{ match.french }} = {{ match.gender }}</div>

    <div :if="inLocal">
      <p>Previous matches</p>
      <ul>
        <li v-for="value in stored" :key="value.french">{{ value.french }} = {{ value.gender }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
#word {
  display: block;
}
</style>
