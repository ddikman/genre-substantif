<script setup lang="ts">

import { ref, watch, computed, onMounted } from 'vue'

import { useDebounceFn } from '@vueuse/core'
import { FEMININE, Word } from '../models/word';
import { addRecentWord, getMostRecentWord } from '../stores/recentWords';
import { lookupWord, groupWordsByGender, GenderGroup } from '../services/lookupWord';
import { dictionary } from '../services/dictionary';
import TheNotFoundNotice from './TheNotFoundNotice.vue';
import AppClientOnly from './AppClientOnly.vue';
import { searchTerm } from '../stores/searchTerm';
import { getSingularForm } from '../services/getSingularForm';
import { logEvent } from '../services/logEvent';

const matches = ref<Word[]>([])
const genderGroups = ref<GenderGroup[]>([])
const singularForm = ref<string | null>()
const isSearching = ref(false)

function addMatch(match: Word) {
  addRecentWord(match)
}

const lookupAndReplace = (value: string) => {
  try {
    matches.value = lookupWord(value)
    genderGroups.value = groupWordsByGender(matches.value)
    singularForm.value = null;
    logEvent('lookupWord', { word: value })

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
          genderGroups.value = groupWordsByGender(matches.value)
        } else {
          singularForm.value = null
        }
      }
    }
  } finally {
    isSearching.value = false
  }
}

const WAIT_MS_UNTIL_NEXT_LOOKUP = 500
const debounceLookup = useDebounceFn(lookupAndReplace, WAIT_MS_UNTIL_NEXT_LOOKUP)

watch(searchTerm, () => {
  isSearching.value = true
  debounceLookup(searchTerm.value)
})

function loadPreviousLookup() {
  matches.value = [ getMostRecentWord(new Word('femme', FEMININE)) ]
  genderGroups.value = groupWordsByGender(matches.value)
  searchTerm.value = matches.value[0]?.french || 'femme'
}

const english = computed(() => {
  if (matches.value.length > 0) {
    // Get English translations for all matches
    const allTranslations = new Set<string>()
    matches.value.forEach(word => {
      dictionary.filter((entry) => entry.fr === word.french)
        .forEach((entry) => allTranslations.add(entry.en))
    })
    return Array.from(allTranslations).join(', ')
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

                <!-- Primary gender group -->
                <div v-if="genderGroups.length > 0">
                  <div v-for="group in genderGroups.filter(g => g.isPrimary)" :key="group.gender" class="primary-gender-group">
                    <div class="accent subtitle gender" v-bind:class="group.gender">{{ group.gender }}</div>
                    <div v-if="group.words.length > 1" class="word-list">
                      <span v-for="(word, index) in group.words" :key="word.french" class="word-item">
                        {{ word.french }}<span v-if="index < group.words.length - 1">, </span>
                      </span>
                    </div>
                  </div>

                  <!-- Secondary gender groups -->
                  <div v-for="group in genderGroups.filter(g => !g.isPrimary)" :key="group.gender" class="secondary-gender-group mt-2">
                    <p class="secondary-header">
                      also <span class="accent-text">{{ group.gender }}</span>:
                      <span v-for="(word, index) in group.words" :key="word.french">
                        {{ word.french }}<span v-if="index < group.words.length - 1">, </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div v-else-if="isSearching">
                <p>Searching...</p>
              </div>
              <div v-else-if="searchTerm.trim().length === 0">
                <p>Enter a french noun.</p>
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

.word-list {
  font-size: 14px;
  margin-top: 8px;
  color: #666;
  font-style: italic;
}

.word-item {
  font-weight: 500;
  color: #444;
}

.secondary-gender-group {
  margin-top: 12px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid var(--color-accent);
}

.secondary-header {
  font-size: 13px;
  margin-bottom: 0;
  color: #555;
  font-weight: 400;
}

.primary-gender-group {
  text-align: center;
}

</style>