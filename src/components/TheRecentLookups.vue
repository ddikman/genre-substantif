<script setup lang="ts">

import AppClientOnly from './AppClientOnly.vue';

import { recentFeminine, recentMasculine } from '../stores/recentWords';
import { customDictionary } from '../services/customDictionary';
import { searchTerm } from '../stores/searchTerm';

const recentlyAdded = customDictionary.slice(Math.max(0, customDictionary.length - 5));

function lookup(word: string) {
  searchTerm.value = word;
}

</script>
<template>
  <AppClientOnly>
    <div class="fullwidth contrast-background">
      <div class="section-top-spacer container">
        <div class="row py-5">
          <div class="col-md-4 p-0">
            <h1 class="mr-4">Recently</h1>
            <p>These are the words you or others have most recently looked up.</p>

            <div style="margin-top: 64px;"></div>
            <h2 class="subtitle">✎ Recently Added</h2>
            <div class="tag-cloud mt-2">
              <span @click="lookup(value.fr)" class="tag link" v-for="value in recentlyAdded" :key="value.fr">{{ value.fr }}</span>
            </div>
          </div>
          <div class="col-md-2"></div>
          <div class="col-md-6 p-0">
          <h2 class="subtitle">♀ Feminine</h2>
          <div class="tag-cloud mt-2">
            <span @click="lookup(value.french)" class="tag link" v-for="value in recentFeminine" :key="value.french">{{ value.french }}</span>
          </div>
          <div style="margin-top: 64px;"></div>
          <h2 class="subtitle">♂ Masculine</h2>
          <div class="tag-cloud mt-2">
            <span @click="lookup(value.french)" class="tag link" v-for="value in recentMasculine" :key="value.french">{{ value.french }}</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  </AppClientOnly>
</template>