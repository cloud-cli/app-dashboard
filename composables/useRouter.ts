import { createRouter, createWebHashHistory } from 'vue-router';
import Console from '../components/Console.vue';
import Settings from '../components/Settings.vue';
import AppList from '../components/apps/AppList.vue';
import AppDetails from '../components/apps/AppDetails.vue';
import AppRoutes from '../components/Routes.vue';

const topPages = [
  {
    path: '/apps',
    name: 'Apps',
    icon: 'toc',
    command: 'dx',
    protected: true,
    component: AppList,
  },
  {
    path: '/routes',
    name: 'Routes',
    icon: 'language',
    protected: true,
    component: AppRoutes,
  },
  {
    path: '/console',
    name: 'Console',
    icon: 'terminal',
    protected: true,
    component: Console,
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: 'settings',
    protected: true,
    component: Settings,
  },
];

const routes = [
  ...topPages,
  {
    path: '/apps/:name',
    name: 'AppDetails',
    protected: true,
    props: true,
    component: AppDetails,
  },
];

export const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
});

export function useRouter() {
  return { router, routes, topPages };
}
