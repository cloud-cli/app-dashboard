import { ref, watch, Ref } from "vue";
import { useSettings } from "./useSettings";

async function getAuthLibrary(host) {
  return await import(String(new URL("/auth.js", host)));
}

const properties: Record<string, Ref<string>> = {};

export function useProperty(
  property: string
): [Ref<string>, (value: string) => void] {
  const { authHost } = useSettings();
  const p = properties[property] || (properties[property] = ref<string>(""));

  let auth: any;

  const set = (value: string) => {
    auth?.setProperty(property, value);
    p.value = value;
  };

  async function loadAuth(host: string) {
    if (!host) {
      return;
    }

    auth = await getAuthLibrary(host);
    p.value = await auth.getProperty(property);
  }

  watch(authHost, loadAuth);
  if (authHost.value) {
    loadAuth(authHost.value);
  }

  return [p, set];
}
