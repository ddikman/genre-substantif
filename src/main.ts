import { createSSRApp } from 'vue'
import './style.css'
import Index from './pages/Index.vue'

export function createApp() {
  return createSSRApp(Index)
}
