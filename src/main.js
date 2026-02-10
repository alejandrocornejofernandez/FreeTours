import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// importamos Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// importamos bootstrap-icons
import 'bootstrap-icons/font/bootstrap-icons.css'


const app = createApp(App)

app.use(router)

app.mount('#app')
