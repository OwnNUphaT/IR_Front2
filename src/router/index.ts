import { createRouter, createWebHistory } from 'vue-router';
import Search

const routes = [
  {
    path: '/',
    name: 'Search',
    component: Search,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
