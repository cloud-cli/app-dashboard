import { ref, Ref, watchEffect } from "vue";

const refs: Record<string, Ref> = {};

export function useLocalStorage(key: string, defaultValue = "") {
  if (refs[key]) {
    return refs[key];
  }

  const readValue = () => {
    const v = localStorage.getItem(key);
    value.value = v !== null ? v : defaultValue;
  };

  const value = ref(null);
  readValue();

  window.addEventListener("storage", readValue);
  watchEffect(() => localStorage.setItem(key, value.value));

  refs[key] = value;

  return value;
}
