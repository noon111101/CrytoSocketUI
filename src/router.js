import { createRouter, createWebHistory } from 'vue-router'

import Chat from './components/Chat.vue'
import Error from "./components/Error.vue";
import Home from "./components/Home.vue";

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/chat',
        component: Chat
    },
    {
        path: '/:pathMatch(.*)*',
        component: Error
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
