import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import router from './router/index'
import axios from 'axios'
import store from './store' // Import the CSS

axios.defaults.baseURL = 'http://127.0.0.1:8000'

createApp(App).use(store).use(router, axios).mount('#app')
