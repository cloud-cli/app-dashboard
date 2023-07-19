import { ref } from "vue";

let loader: Promise<any>;
let env: Record<string, string>;

export async function useEnv() {
  const ready = new Promise((resolve, reject) => {
    if (env) {
      return resolve(env);
    }

    if (!loader) {
      loader = fetch("/.env")
        .then((r) => r.json())
        .then((v) => resolve((env = v)))
        .catch(reject);
    }
  });

  await ready;

  return env;
}
