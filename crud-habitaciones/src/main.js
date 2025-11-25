import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

// Crear la app primero
const app = createApp(App);

// Registrar el componente globalmente
app.component('Multiselect', Multiselect);

// Montar
app.use(router).mount('#app');
