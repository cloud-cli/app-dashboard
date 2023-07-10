import { useLocalStorage } from "./useLocalStorage.js";

export function useSettings() {
  const authHost = useLocalStorage("authHost", "");

  return { authHost };
}
