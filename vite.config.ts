import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ssr } from 'vite-plugin-ssr/plugin' // ADDED

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ssr({ prerender: true }) // ADDED
  ]
})