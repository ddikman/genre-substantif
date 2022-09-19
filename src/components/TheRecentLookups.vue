<script setup lang="ts">

import { recentFeminine, recentMasculine } from '../stores/recentWords';

</script>
<template>
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
</template>