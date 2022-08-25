<script setup lang="ts">

import { ref, watch } from 'vue'
import { dictionary } from './data/data'

const word = ref('')
const result = ref('')
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

watch(word, (value) => {
  const matchedWord = dictionary.find((item) => item.word === value)
  if (!matchedWord) {
    match.value = undefined
    return
  }
  match.value = {
      french: value,
      gender: genders[matchedWord.gender_id.toString()]
  }
  console.log(match.value)
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
    <div v-if="match">{{ match.gender }}</div>

    <div :if="inLocal">
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
