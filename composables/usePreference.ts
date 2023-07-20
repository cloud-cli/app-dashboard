import { ref, Ref } from "vue";
import { useAuth } from "./useAuth";
import { useEnv } from "./useEnv";

const properties: Record<string, Ref<string>> = {};
type SetProperty = (value: string) => void;
type RefreshProperty = () => Promise<void>;

export function usePreference(
  property: string
): [Ref<string>, SetProperty, RefreshProperty] {
  const { whenReady } = useEnv();
  const { setProperty, getProperty } = useAuth();
  const p = properties[property] || (properties[property] = ref<string>(""));

  const set = (value: string) => {
    p.value = value;
    setProperty(location.hostname + ":" + property, value);
  };

  async function refresh() {
    p.value = await getProperty(location.hostname + ":" + property);
  }

  whenReady(refresh);

  return [p, set, refresh];
}
