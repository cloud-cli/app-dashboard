import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./composables/useRouter";

createApp(App).use(router).mount("#app");
