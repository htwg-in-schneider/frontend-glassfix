import { createRouter, createWebHistory } from 'vue-router';

import AnfragenView from '../views/AnfragenView.vue';
import AnfrageDetail from '../views/AnfrageDetail.vue';
import AnfragenFilter from '../views/AnfragenFilter.vue';
import Startseite from '../views/Startseite.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import CreateAnfrageSchritt1 from '../views/CreateAnfrageSchritt1.vue';
import CreateAnfrageSchritt2 from '../views/CreateAnfrageSchritt2.vue';
import CreateAnfrageSchritt3 from '../views/CreateAnfrageSchritt3.vue';


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
  },
  {
    path: '/create-anfrage/schritt-1',
    name: 'CreateAnfrageSchritt1',
    component: CreateAnfrageSchritt1
  },
  {
    path: '/create-anfrage/schritt-2',
    name: 'CreateAnfrageSchritt2',
    component: CreateAnfrageSchritt2
  },
  {
    path: '/create-anfrage/schritt-3',
    name: 'CreateAnfrageSchritt3',
    component: CreateAnfrageSchritt3
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
