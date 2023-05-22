import { createRouter, createWebHistory } from 'vue-router';
import routes from './navigation';

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
