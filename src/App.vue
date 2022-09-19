<script setup lang="ts">

import { ref } from 'vue'
import TheNounLookup from './components/TheNounLookup.vue'
import ThePractice from './components/ThePractice.vue';
import TheHeader from './components/TheHeader.vue';
import TheRecentLookups from './components/TheRecentLookups.vue';

</script>

<template>
  <TheHeader />
  <TheNounLookup />
  <TheRecentLookups />
  <ThePractice />
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
