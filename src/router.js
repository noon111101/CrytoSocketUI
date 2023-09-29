import { createRouter, createWebHistory } from 'vue-router'

import Chat from './pages/Market.vue'
import Error from "./pages/Error.vue";
import Home from "./pages/Home.vue";
import MarketProduct from "./components/product/marketProduct.vue";

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/market',
        component: Chat
    },
    {
        path: '/:pathMatch(.*)*',
        component: Error
    },
    { path: '/product/:id', component: MarketProduct },

]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
