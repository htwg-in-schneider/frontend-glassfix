import { createRouter, createWebHistory } from 'vue-router';

import AnfragenView from '../views/AnfragenView.vue';
import AnfrageDetail from '../views/AnfrageDetail.vue';

const routes = [
  {
    path: '/',
    component: AnfragenView
  },
  {
    path: '/anfrage/:id',
    name: 'anfrage-detail',
    component: AnfrageDetail
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
