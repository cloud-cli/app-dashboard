import { useCommands } from "./useCommands";

export function useApps() {
  const { commands: _ } = useCommands();
  const apps = ref([]);

  async function refresh() {
    const apps = await _.dx.list();
    const running = await _.dx.ps();

    apps.value = apps.map((app) => ({
      ...app,
      running: running.includes(app.name),
    }));
  }

  const restart = async (name) => {
    await _.dx.stop({ name });
    await _.dx.start({ name });
  };

  onMounted(refresh);

  return { apps, restart };
}
