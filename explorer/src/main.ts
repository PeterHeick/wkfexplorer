import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/global.css'
import router from './router/router'

document.title = "Plan explorer";
createApp(App)
  .use(router)
  .mount('#app')
