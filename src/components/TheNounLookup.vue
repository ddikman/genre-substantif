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
import { getSingularForm } from '../services/getSingularForm';

const matches = ref<Word[]>([])
const singularForm = ref<string | null>()

function addMatch(match: Word) {
  addRecentWord(match)
}

const lookupAndReplace = (value: string) => {
  matches.value = lookupWord(value)
  singularForm.value = null;

  // if all matches are the same, replace the search term with the actual word
  const uniqueFrenchMatches = new Set(matches.value.map(w => w.french))
  if (uniqueFrenchMatches.size === 1) {
    // correct search term to add accents or so to match the actual word
    searchTerm.value = matches.value[0].french
    addMatch(matches.value[0])
  } else if (uniqueFrenchMatches.size === 0) {
    singularForm.value = getSingularForm(value)
    if (singularForm.value) {
      const singularMatches = lookupWord(singularForm.value)
      if (singularMatches.length > 0) {
        matches.value = singularMatches
      } else {
        singularForm.value = null
      }
    }
  }
}

const WAIT_MS_UNTIL_NEXT_LOOKUP = 500
const debounceLookup = useDebounceFn(lookupAndReplace, WAIT_MS_UNTIL_NEXT_LOOKUP)

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
                <p v-if="singularForm" class="mb-0">plural of <span class="accent-text">{{singularForm}}</span> which</p>
                <p class="mb-2">means <span class="accent-text">{{ english }}</span> (EN) and is</p>
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

.accent-text {
  font-style: italic;
  color: var(--color-accent);
}

</style>