import { ref } from "vue";

const env = ref<Record<string, string>>(null as any);

export function useEnv() {
  return { env };
}

export function setEnv(value) {
  env.value = value;
}