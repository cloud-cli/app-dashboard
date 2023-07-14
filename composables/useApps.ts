import { useCommands } from "./useCommands";
import { ref, unref, onMounted } from "vue";

interface App {
  id: number;
  name: string;
  image: string;
  volumes: string[];
  status: "running" | "stopped";
}

const apps = ref<App[]>([]);

export function useApps() {
  const { commands } = useCommands();
  const shortenImage = (image: string) => image.replace('ghcr.io/', 'gh:').replace(':latest', '')
  const shortenVolumes = (volumes: string): string[] => volumes.split(',').map(volume => volume.split(':')[0]).filter(Boolean)

  async function refresh() {
    const { dx } = unref(commands);
    const list: Array<any> = await dx.list();
    const running: string[] = await dx.ps();

    apps.value = list.map((app) => ({
      ...app,
      image: shortenImage(app.image),
      volumes: shortenVolumes(app.volumes),
      status: running.includes(app.name) ? "running" : "stopped",
    })) as App[];
  }

  onMounted(refresh);

  return { apps, refresh };
}
