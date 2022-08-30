import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueGtag from "vue-gtag";

createApp(App).use(VueGtag, { config: { 'id': 'G-41C4FMPZX4' } }).mount('#app')
