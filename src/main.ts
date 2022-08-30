import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

setInterval(() => {
  createApp(App).mount('#app')
}, 5000)
