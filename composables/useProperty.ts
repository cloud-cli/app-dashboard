import { ref, watch } from "vue";
import { useSettings } from "./useSettings";

async function getAuthLibrary(host) {
  return await import(String(new URL("/auth.js", host)));
}

export function useProperty(property: string) {
  const { authHost } = useSettings();
  const p = ref("");
  let auth;

  const set = (value: string) => {
    auth?.setProperty(property, value);
    p.value = value;
  };

  async function loadAuth(host: string) {
    if (!host) {
      return;
    }

    auth = await getAuthLibrary(host);
    p.value = auth.getProperty(property);
  }

  watch(authHost, loadAuth);

  if (authHost.value) {
    loadAuth(authHost.value);
  }

  return [p, set];
}
