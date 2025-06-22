import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import Index from './pages/Index.vue'
import Dictionary from './pages/Dictionary.vue'

export function createAppRouter() {
  return createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      {
        path: '/',
        component: Index
      },
      {
        path: '/dictionary',
        component: Dictionary
      }
    ]
  })
}