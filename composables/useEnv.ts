import { ref } from "vue";

let loader: Promise<any>;
let env = ref<Record<string, string>>(null as any);

export function useEnv() {
  let ready = new Promise((resolve, reject) => {
    if (env.value) {
      return resolve(env);
    }

    if (!loader) {
      loader = fetch("/.env")
        .then((r) => r.json())
        .then((v) => resolve((env.value = v)))
        .catch(reject);
    }
  });

  function whenReady(next) {
    ready = ready.then(next);
  }

  return { env, whenReady };
}
