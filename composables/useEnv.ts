import { ref } from "vue";

const env = ref<Record<string, string>>(null as any);
const queue: any[] = [];

fetch("/.env")
  .then((r) => r.json())
  .then((v) => {
    env.value = v;
    queue.forEach((f) => f(v));
  });

export function useEnv() {
  function whenReady(next) {
    if (!env.value) {
      queue.push(next);
      return;
    }

    next(env.value);
  }

  return { env, whenReady };
}
