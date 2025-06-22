<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dictionary } from '../services/dictionary'
import { DictionaryWord } from '../models/dictionaryWord'
import AppButton from './AppButton.vue'

const route = useRoute()
const router = useRouter()

const pageSize = 100
const currentPage = ref(1)
const searchQuery = ref('')

// Initialize from URL parameters
onMounted(() => {
  const page = Number(route.query.page) || 1
  const query = (route.query.query as string) || ''
  currentPage.value = page
  searchQuery.value = query
})

// Update URL when parameters change
watch([currentPage, searchQuery], () => {
  router.push({
    query: {
      page: currentPage.value,
      query: searchQuery.value || undefined
    }
  })
})

const filteredDictionary = computed(() => {
  if (!searchQuery.value) return dictionary

  const query = searchQuery.value.toLowerCase()
  return dictionary.filter(word => 
    word.fr.toLowerCase().includes(query) || 
    word.en.toLowerCase().includes(query)
  )
})

const totalPages = computed(() => Math.ceil(filteredDictionary.value.length / pageSize))

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredDictionary.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>

<template>
  <div class="dictionary-container">
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search in French or English..."
        class="search-input"
      />
    </div>

    <div class="words-container">
      <div v-for="word in paginatedWords" :key="word.fr" class="word-item">
        <span class="french">{{ word.fr }}</span>
        <span class="gender">{{ word.gen === 'm' ? 'masculine' : 'feminine' }}</span>
        <span class="english">{{ word.en }}</span>
      </div>
    </div>

    <div class="pagination">
      <AppButton 
        @click="prevPage" 
        :disabled="currentPage === 1"
      >
        Previous
      </AppButton>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <AppButton 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
      >
        Next
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.dictionary-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  outline: none;
}

.search-input:focus {
  border-color: var(--color-accent);
}

.words-container {
  margin-bottom: 20px;
}

.word-item {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  padding: 10px;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
}

.french {
  font-weight: bold;
  color: var(--color-accent);
}

.gender {
  color: var(--color-text-light);
  font-style: italic;
}

.english {
  text-align: right;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.page-info {
  color: var(--color-text-light);
}
</style>