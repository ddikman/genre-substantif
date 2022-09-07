<script setup lang="ts">

import { ref, watch } from 'vue'

import { useDebounceFn } from '@vueuse/core'
import { dictionary } from '../data/data'
import { Word, FEMININE, MASCULINE } from '../models/word';
import { addWord } from '../stores/lookups';

const word = ref('')
const match = ref<Word>()

const LAST_LOOKUP_KEY = 'last_word'

const genders: any = {
  'm': MASCULINE,
  'f': FEMININE,
  'n': 'unisex'
}

function toNormalForm(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function addMatch(match: Word) {
  addWord(match)
  localStorage.setItem(LAST_LOOKUP_KEY, JSON.stringify(word))
}

const debounceLookup = useDebounceFn((value: string) => {
  if (!value || value.length === 0) {
    return
  }
  const matchedWord = dictionary.find((item) => item.fr && (item.fr === value.toLowerCase() || toNormalForm(item.fr) === value.toLowerCase()))
  if (!matchedWord) {
    match.value = undefined
    return
  }
  match.value = new Word(matchedWord.fr, genders[matchedWord.gen])
  word.value = matchedWord.fr
  addMatch(match.value)
}, 500)

watch(word, () => {
  debounceLookup(word.value)
})

const lastLookup = localStorage.getItem(LAST_LOOKUP_KEY)
if (lastLookup) {
  match.value = Word.fromJSON(JSON.parse(lastLookup))
  word.value = match.value?.french ?? 'homme'
} else {
  word.value = 'femme'
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
              <div class="accent subtitle gender" v-bind:class="match.gender">{{ match.gender }}</div>
            </div>
            <div v-else>This is not a noun we know.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

.gender {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 30.4px;
  line-height: 37px;
}
.masculine:before {
  content: ' ';
  display: inline-block;
  background: url('/icon-masculine.svg');
  background-repeat: no-repeat;
  width: 25px;
  height: 18px;
  background-position-y: center;
}

.feminine:before {
  content: ' ';
  display: inline-block;
  background: url('/icon-feminine.svg');
  background-repeat: no-repeat;
  width: 25px;
  height: 24px;
  background-position-y: center;
}

</style>