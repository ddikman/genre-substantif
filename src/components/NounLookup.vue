<script setup lang="ts">

import { ref } from 'vue'

import { useDebounceFn } from '@vueuse/core'
import { dictionary } from '../data/data'
import { Word, FEMININE, MASCULINE } from '../models/word';
import { addWord } from '../stores/lookups';

const word = ref('')
const match = ref<Word>()

const lastLookup = localStorage.getItem('lastLookup')
if (lastLookup) {
  match.value = JSON.parse(lastLookup)
  word.value = match.value?.french ?? 'homme'
}

const LAST_LOOKUP_KEY = 'last_word'

const genders: any = {
  '1': MASCULINE,
  '2': FEMININE,
  '3': 'unisex'
}

function toNormalForm(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function addMatch(match: Word) {
  addWord(match)
  localStorage.setItem(LAST_LOOKUP_KEY, JSON.stringify(word))
}

const debounceLookup = useDebounceFn((value: string) => {
  const matchedWord = dictionary.find((item) => item.word === value.toLowerCase() || toNormalForm(item.word) === value.toLowerCase())
  if (!matchedWord) {
    match.value = undefined
    return
  }
  match.value = new Word(matchedWord.word, genders[matchedWord.gender_id.toString()])
  word.value = matchedWord.word
  addMatch(match.value)
}, 500)

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