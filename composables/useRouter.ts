import { createRouter, createWebHashHistory } from "vue-router";
import Help from "../components/Help.vue";
import Settings from "../components/Settings.vue";
import Apps from "../components/Apps.vue";
import AppDetails from "../components/AppDetails.vue";

const topPages = [
  {
    path: "/apps",
    name: "Apps",
    icon: "toc",
    command: "dx",
    protected: true,
    component: Apps,
  },
  {
    path: "/help",
    name: "Help",
    icon: "help_outline",
    protected: true,
    component: Help,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "settings",
    component: Settings,
  },
];

const routes = [
  ...topPages,
  {
    path: "/apps/:name",
    name: "AppDetails",
    protected: true,
    props: true,
    component: AppDetails,
  },
];

export const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});

export function useRouter() {
  return { router, routes, topPages };
}
