<template>
  <div class="container section-top-spacer">
    <div class="row">
      <div class="col-md-6 p-0 hide-mobile">
        <img src="/eiffel.webp" class="px-4 mw-100"/>
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
        <p>Anytime words are reported missing from the dictionary, I'm adding them in one by one.</p>
        <p>
          <b>June 22, 2025</b><br/> I've added a dictionary of words as well as showing both genders of words that may have multiple genders.
        </p>
        <p>
          <b>October 15, 2023</b><br/> Good news! I've added support for lookups of plural nouns. It's not perfect but hopefully it should catch most cases.
        </p>
      </div>
      </div>
  </div>
</template>

<style scoped>

ul li:not(:last-child) {
  margin-bottom: 1rem;
}

</style>