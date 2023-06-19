import { useCommands } from "./useCommands";
import { ref, onMounted } from "vue";

interface App {
  id: number;
  name: string;
  image: string;
  ports: string;
  volumes: string;
  status: "running" | "stopped";
}

export function useApps() {
  const { commands } = useCommands();
  const apps = ref<App[]>([]);

  async function refresh() {
    const { dx } = unref(commands);
    const list: Array<Omit<App, "status">> = await dx.list();
    const running: string[] = await dx.ps();

    apps.value = list.map((app) => ({
      ...app,
      status: running.includes(app.name) ? "running" : "stopped",
    })) as App[];
  }

  const restart = async (name: string) => {
    const { dx } = unref(commands);
    await dx.stop({ name });
    await dx.start({ name });
  };

  onMounted(refresh);

  return { apps, restart };
}
