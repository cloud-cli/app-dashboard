import { ref, Ref, watchEffect } from "vue";

const refs: Record<string, Ref> = {};

export function useLocalStorage(key: string, defaultValue = "", parser = String) {
  if (refs[key]) {
    return refs[key];
  }

  const readValue = () => {
    const v: string | null = localStorage.getItem(key);
    value.value = v !== null ? parser(v) : defaultValue;
  };

  const value = ref('');
  readValue();

  window.addEventListener("storage", readValue);
  watchEffect(() => localStorage.setItem(key, value.value));

  refs[key] = value;

  return value;
}
