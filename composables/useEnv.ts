import { ref } from "vue";
import { useQueue } from "./useQueue";

const env = ref<Record<string, string>>(null as any);
const { whenReady, run } = useQueue();

fetch("/.env")
  .then((r) => r.json())
  .then((v) => {
    env.value = v;
    run(v);
  });

export function useEnv() {
  return { env, whenReady };
}
