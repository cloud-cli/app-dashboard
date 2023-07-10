import { ref, watch } from "vue";
import { useSettings } from "./useSettings";

async function getAuthLibrary(host) {
  return await import(String(new URL('/auth.js', host)));
}

export function useProperty(property: string) {
  const { authHost } = useSettings();
  const p = ref("");
  let auth;

  const set = (value) => {
    auth?.setProperty(property, value);
    p.value = value;
  };

  watch(authHost, async (value) => {
    if (!value) {
      return;
    }

    auth = await getAuthLibrary(value);
    p.value = auth.getProperty(property);
  });

  return [p, set];
}
