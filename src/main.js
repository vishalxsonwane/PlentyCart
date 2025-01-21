// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/vueRouter'
import store from './store'
import './assets/styles/main.css'
import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
import "@mdi/font/scss/materialdesignicons.scss"
import './plugins/axios' // Add this line

const app = createApp(App)

app.use(Toast, {
  position: "top-right",
  duration: 3000,
  dismissible: true,
  pauseOnHover: true,
  queue: true
})

// Make toast globally available
window.$toast = app.config.globalProperties.$toast

app.use(router)
app.use(store)
app.use(Toast)

app.mount('#app')