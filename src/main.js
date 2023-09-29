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
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const app = createApp(App);
app.use(router);
app.use(VueSweetalert2);
app.use(ElementPlus);
app.mount('#app');
