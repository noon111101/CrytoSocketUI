import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import tệp router.js
import './style.css'
// Import Element UI
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

// Import Bootstrap CSS (Note: Bootstrap JavaScript is optional)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');
