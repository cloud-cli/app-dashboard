import { useCommands } from "./useCommands";
import { ref, unref, onMounted, watch } from "vue";

interface App {
  id: number;
  name: string;
  image: string;
  volumes: string[];
  status: "running" | "stopped";
}

const apps = ref<App[]>([]);

export function useApps() {
  const { commands, canRunCommands } = useCommands();
  const shortenImage = (image: string) =>
    image.replace("ghcr.io/", "gh:").replace(":latest", "");
  const shortenVolumes = (volumes: string): string[] =>
    volumes
      .split(",")
      .map((volume) => volume.split(":")[0])
      .filter(Boolean);

  async function refresh() {
    if (!canRunCommands.value) return;

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

  async function addApp(name: string) {
    if (!name?.trim()) return;

    const { dx } = unref(commands);
    await dx.add({ name, image: "none" });
    await refresh();
  }

  onMounted(() => {
    if (canRunCommands.value) {
      return refresh();
    }

    const detach = watch(canRunCommands, () => {
      refresh();
      detach();
    });
  });

  return { apps, refresh, addApp };
}
