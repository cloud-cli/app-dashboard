import { useCommands } from "./useCommands";
import { ref, unref, onMounted } from "vue";

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

  const shortenImage = (image: string) => image.replace('ghcr.io/', 'gh:').replace(':latest', '')

  async function refresh() {
    const { dx } = unref(commands);
    const list: Array<Omit<App, "status">> = await dx.list();
    const running: string[] = await dx.ps();

    apps.value = list.map((app) => ({
      ...app,
      image: shortenImage(app.image),
      status: running.includes(app.name) ? "running" : "stopped",
    })) as App[];
  }

  onMounted(refresh);

  return { apps };
}
