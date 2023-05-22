import { createApp } from 'vue'
// import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles/global.css'
import router from './router/router'

// const pinia = createPinia()
//  .use(createPinia())
createApp(App)
  .use(router)
  .mount('#app')
