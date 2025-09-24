import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth } from './utility/firebaseConfig'
import App from './App.vue'
import router from './router/routes'
// CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// JS
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap

let app

onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.mount('#app')
  }
})
