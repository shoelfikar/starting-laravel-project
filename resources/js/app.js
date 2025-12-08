import './bootstrap';
import { createApp } from 'vue';

// Import root component dan router
import App from './App.vue';
import router from './router';

// Buat instance Vue dengan router
const app = createApp(App);

app.use(router);

app.mount('#app');
