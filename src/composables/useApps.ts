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
  const { commands: _ } = useCommands();
  const apps = ref<App[]>([]);

  async function refresh() {
    const list: Array<Omit<App, "status">> = await _.dx.list();
    const running: string[] = await _.dx.ps();

    apps.value = list.map((app) => ({
      ...app,
      status: running.includes(app.name) ? "running" : "stopped",
    })) as App[];
  }

  const restart = async (name: string) => {
    await _.dx.stop({ name });
    await _.dx.start({ name });
  };

  onMounted(refresh);

  return { apps, restart };
}
