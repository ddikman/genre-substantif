import { createRouter, createMemoryHistory, createWebHistory, RouteLocationNormalized, RouterScrollBehavior } from 'vue-router'
import Index from './pages/Index.vue'
import Dictionary from './pages/Dictionary.vue'

export function createAppRouter() {
  const router = createRouter({
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
    ],
    scrollBehavior: ((to: RouteLocationNormalized, from: RouteLocationNormalized, savedPosition: { left: number, top: number } | null) => {
      if (savedPosition) {
        return savedPosition
      }
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth' as const
        }
      }
      return { top: 0 }
    }) as RouterScrollBehavior
  })

  return router
}