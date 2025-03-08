import { createRouter, createWebHistory } from 'vue-router';
import Search from '../views/Search.vue';
import RecipeDetail from '../views/RecipeDetail.vue';

const routes = [
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetail,
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
