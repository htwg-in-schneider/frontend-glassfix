import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'

import App from './App.vue'
import './assets/styles.css'
import router from './router';

const pinia = createPinia()
const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        redirect_uri: "http://localhost:5173/frontend-glassfix/",
        audience: 'https://glassfix.api'
    },
    onRedirectCallback: (appState) => {
        router.replace(appState?.target || '/dashboard')
    }
})

createApp(App).use(router)
.use(pinia)
.use(auth0)
.mount('#app')
