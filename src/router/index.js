import { createRouter, createWebHistory } from 'vue-router';

import AnfragenView from '../views/AnfragenView.vue';
import AnfrageDetail from '../views/AnfrageDetail.vue';
import AnfragenFilter from '../views/AnfragenFilter.vue';
import Startseite from '../views/Startseite.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  {
    path: '/',
    component: Startseite
  },
  {
    path: '/anfragen',
    name: 'anfragen',
    component: AnfragenView
  },
  {
    path: '/filter',
    name: 'anfragen-filter',
    component: AnfragenFilter
  },
  {
    path: '/anfrage/:id',
    name: 'anfrage-detail',
    component: AnfrageDetail
  },
  {
    path:'/login',
    name: 'login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
