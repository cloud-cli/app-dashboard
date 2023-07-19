import { ref, Ref } from "vue";
import { useAuth } from "./useAuth";

const properties: Record<string, Ref<string>> = {};
type SetProperty = (value: string) => void;
type RefreshProperty = () => Promise<void>;

export async function usePreference(
  property: string
): Promise<[Ref<string>, SetProperty, RefreshProperty]> {
  const { auth } = await useAuth();
  const p = properties[property] || (properties[property] = ref<string>(""));

  const set = (value: string) => {
    p.value = value;
    auth.value?.setProperty(location.hostname + ":" + property, value);
  };

  async function refresh() {
    p.value = await auth.value?.getProperty(location.hostname + ":" + property);
  }

  refresh();

  return [p, set, refresh];
}
