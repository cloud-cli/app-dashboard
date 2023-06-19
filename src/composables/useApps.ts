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
    const list = await _.dx.list();
    const running = await _.dx.ps();

    apps.value = (list as any).map((app) => ({
      ...app,
      status: running.includes(app.name) ? "running" : "stopped",
    }));
  }

  const restart = async (name) => {
    await _.dx.stop({ name });
    await _.dx.start({ name });
  };

  onMounted(refresh);

  return { apps, restart };
}
