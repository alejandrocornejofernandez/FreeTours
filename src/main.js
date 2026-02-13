import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar';

// importamos Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// importamos bootstrap-icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// importamos v-calendar, para mejorar los input de tipo date
import 'v-calendar/style.css';

// importamos leaflet
import "leaflet/dist/leaflet.css";

const app = createApp(App)

// para que la app use las rutas URL
app.use(router)

// para que la app use la libreria VCalendar
app.use(VCalendar, {})

app.mount('#app')
