import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/global.css'
import router from './router/router'

document.title = "Wkf App";
createApp(App)
  .use(router)
  .mount('#app')
