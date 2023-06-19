import { createRouter, createWebHashHistory } from "vue-router";
import Help from "../components/Help.vue";
import Settings from "../components/Settings.vue";
import Apps from "../components/Apps.vue";

const routes = [
  {
    path: "/settings",
    name: "Settings",
    icon: "settings",
    component: Settings,
  },
  {
    path: "/help",
    name: "Help",
    icon: "help_outline",
    component: Help,
  },
  {
    path: "/apps",
    name: "Status",
    icon: "toc",
    command: 'dx',
    component: Apps,
  },
];

export const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});

export function useNavigation() {
  return { router, routes };
}
