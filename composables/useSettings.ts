import { ref } from "vue";

export function useSettings() {
  const authHost = ref("");
  const ready = new Promise(async (done) => {
    const r = await fetch("/.env");
    const env = await r.json();
    authHost.value = env.AUTH_HOST;
    done(env);
  });

  return { authHost, ready };
}
