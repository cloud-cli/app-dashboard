import { ref, Ref, onMounted } from "vue";
import { useAuth } from "./useAuth";

const properties: Record<string, Ref<string>> = {};
type SetProperty = (value: string) => void;
type RefreshProperty = () => Promise<void>;

export function usePreference(
  property: string
): [Ref<string>, SetProperty, RefreshProperty] {
  const { setProperty, getProperty } = useAuth();
  const p = properties[property] || (properties[property] = ref<string>(""));

  const set = (value: string) => {
    p.value = value;
    setProperty(location.hostname + ":" + property, value);
  };

  async function refresh() {
    p.value = await getProperty(location.hostname + ":" + property);
  }

  onMounted(refresh);

  return [p, set, refresh];
}
