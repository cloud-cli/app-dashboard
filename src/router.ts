import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './navigation';

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

export default router;
