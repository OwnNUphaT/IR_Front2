import { createRouter, createWebHistory } from 'vue-router';
import Search from '../views/Search.vue';
import RecipeDetail from '../views/RecipeDetail.vue';
import Auth from '../views/Auth.vue';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetail,
    props: true,
  },
  {
    path: '/login',
    name: 'Auth',
    component: Auth,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
