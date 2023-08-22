<script setup lang="ts">

import { ref, watch, computed, onMounted } from 'vue'

import { useDebounceFn } from '@vueuse/core'
import { FEMININE, Word } from '../models/word';
import { addRecentWord, getMostRecentWord } from '../stores/recentWords';
import { lookupWord } from '../services/lookupWord';
import { dictionary } from '../services/dictionary';
import TheNotFoundNotice from './TheNotFoundNotice.vue';
import AppClientOnly from './AppClientOnly.vue';
import { searchTerm } from '../stores/searchTerm';

const matches = ref<Word[]>([])

function addMatch(match: Word) {
  addRecentWord(match)
}

const WAIT_MS_UNTIL_NEXT_LOOKUP = 500
const debounceLookup = useDebounceFn((value: string) => {
  matches.value = lookupWord(value)
  if (matches.value.length === 1) {
    // correct search term to add accents or so to match the actual word
    searchTerm.value = matches.value[0].french
    addMatch(matches.value[0])
  }
}, WAIT_MS_UNTIL_NEXT_LOOKUP)

watch(searchTerm, () => debounceLookup(searchTerm.value))

function loadPreviousLookup() {
  matches.value = [ getMostRecentWord(new Word('femme', FEMININE)) ]
  searchTerm.value = matches.value[0]?.french || 'femme'
}

const english = computed(() => {
  if (matches.value.length > 0) {
    return dictionary.filter((entry) => entry.fr === matches.value[0]?.french).map((entry) => entry.en).join(', ')
  }
  return ''
})

onMounted(loadPreviousLookup)

const recentlyAdded = [ 'ridicule', 'portable' ]

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
            <AppClientOnly>
              <input type="text" id="word" v-model="searchTerm" class="mb-2" />
              <div v-if="matches.length > 0">
                <p class="mb-2">means <span class="english">{{ english }}</span> (EN) and is</p>
                <div class="accent subtitle gender" v-bind:class="matches[0].gender">{{ matches[0].gender }}</div>
              </div>
              <div v-else>
                <TheNotFoundNotice :word="searchTerm" />
              </div>
            </AppClientOnly>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#word {
  display: block;
}

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

.english {
  font-style: italic;
  color: var(--color-accent);
}

</style>