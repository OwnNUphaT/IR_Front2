import { createRouter, createWebHistory } from 'vue-router';
import Search from '../views/Search.vue';
import RecipeDetail from '../views/RecipeDetail.vue';
import Auth from '../views/Auth.vue';
import Home from '../views/Home.vue';
import Folder from '../views/Folder.vue';
import DetailFolder from '../views/DetailFolder.vue';
import RecipeDetailForRec from '../views/RecipeDetailForRec.vue';

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
  },
  {
    path: '/folder',
    name: 'Folder',
    component: Folder,
  },
  {
    path: '/folderDetail',
    name: 'DetailFolder',
    component: DetailFolder,
  },
  {
    path: '/RecDetail',
    name: 'RecDetail',
    component: RecipeDetailForRec,
    props: true,
  }

  

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
