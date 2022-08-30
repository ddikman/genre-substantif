<script setup lang="ts">

import { ref } from 'vue'
import NounLookup from './components/NounLookup.vue'
import { recentFeminine, recentMasculine } from './stores/lookups';

</script>

<template>
  <NounLookup />
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
  <div class="container section-top-spacer">
    <div class="row">
      <div class="col-md-6 p-0 hide-mobile">
        <img src="/eiffel.png" />
      </div>
      <div class="col-md-6 p-0">
        <h2 id="other-resources">Other resources</h2>
        <p>Learning how to figure out the one from the other is also possible, check out these sites:</p>
        <ul>
          <li><a href="https://frenchtogether.com/french-nouns-gender/" target="_blank">How to easily guess the gender of French nouns with 80% accuracy</a></li>
          <li><a href="https://grammar.collinsdictionary.com/french-easy-learning/how-do-you-work-out-the-gender-of-french-nouns" target="_blank">How do you work out the gender of French nouns?</a></li>
        </ul>
        <h2 id="about" class="top-margin-large">About this project</h2>
        <p>I started learning French using Duolingo but found that I didn’t clearly understand or kept stumbling on the gender of several nouns. </p>
        <p>I built this page to help me remember it.</p>
        <p>It’s all open source and you can fork this or contribute at our <a href="https://github.com/ddikman/genre-substantif" target="_blank">github page</a></p>
      </div>
      </div>
  </div>
  <footer>
    <hr />
    <div>Copyright 2022 <a href="https://www.greycastle.se">Greycastle</a></div>
  </footer>
</template>

<style scoped>
#word {
  display: block;
}
</style>
