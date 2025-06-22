<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="container header mt-2 mb-4">
    <div class="header-contents">
      <router-link to="/">
        <img src="/logo.svg" alt="le genre des substantifs logo" />
      </router-link>
      <ul>
        <li><router-link to="/dictionary">Dictionary</router-link></li>
        <li><router-link to="/#other-resources">Resources</router-link></li>
        <li><router-link to="/#about">About</router-link></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--color-border);
}

.header-contents {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-contents img {
  height: 40px;
}

ul {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  color: var(--color-text);
  text-decoration: none;
}

a:hover {
  color: var(--color-accent);
}

a.router-link-active {
  color: var(--color-accent);
}
</style>