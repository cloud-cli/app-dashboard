import { createApp } from "vue";
import App from "./components/App.vue";
import AppError from "./components/AppError.vue";
import { router } from "./composables/useRouter.js";
import { setEnv } from "./composables/useEnv.js";
import { load } from "./composables/useAuth";

fetch("/.env")
  .then((x) => x.json())
  .then(async (env) => {
    setEnv(env);
    return await load(env);
  })
  .then(() => createApp(App).use(router).mount("#app"))
  .catch((error) => {
    createApp(AppError, { error: String(error) }).mount("#app");
  });
