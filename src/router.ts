import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import Index from './pages/Index.vue'
import Dictionary from './pages/Dictionary.vue'

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/dictionary',
    component: Dictionary
  }
]

export function createAppRouter() {
  const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth'
        }
      }
      return { top: 0 }
    }
  })

  return router
}