import { ref, Ref } from "vue";
import { useAuth } from "./useAuth";

const properties: Record<string, Ref<string>> = {};
type SetProperty = (value: string) => void;

export function useProperty(property: string): [Ref<string>, SetProperty] {
  const { ready, auth } = useAuth();
  const p = properties[property] || (properties[property] = ref<string>(""));

  const set = (value: string) => {
    p.value = value;
    auth.value?.setProperty(location.hostname + ":" + property, value);
  };

  async function loadAuth() {
    p.value = await auth.value?.getProperty(location.hostname + ":" + property);
  }

  ready.then(loadAuth);

  return [p, set];
}
