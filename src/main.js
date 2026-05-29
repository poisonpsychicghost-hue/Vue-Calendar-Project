import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { persistPlugin } from './stores/persistPlugin.js'
const app = createApp(App)
const pinia = createPinia()
pinia.use(persistPlugin)
app.use(pinia)

createApp(App).mount('#app')
