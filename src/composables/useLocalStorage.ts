import { ref, Ref, watchEffect } from 'vue';

const refs: Record<string, Ref> = {};

export function useLocalStorage(key: string, defaultValue = '') {
  if (refs[key]) {
    return refs[key];
  }

  const value = ref(localStorage.getItem(key) || defaultValue);

  watchEffect(() => {
    localStorage.setItem(key, value.value);
  });

  window.addEventListener('storage', () => {
    value.value = localStorage.getItem(key) || defaultValue;
  });

  refs[key] = value;

  return value;
}
