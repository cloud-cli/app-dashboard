import { unref, ref, onMounted } from "vue";
import { useSettings } from "./useSettings";

export function useCommands() {
  const help = ref<Record<string, string[]>>({});
  const modules = ref<string[]>([]);
  const error = ref<string>("");
  const commands = ref<any>({});
  const hasCommand = (name: string) => unref(modules).includes(name);
  const clearError = () => (error.value = "");
  const { apiSecret, apiHost } = useSettings();

  async function fetchCommands() {
    const secret = unref(apiSecret);

    if (!secret) {
      return;
    }

    const response = await fetch(new URL(".help", unref(apiHost)), {
      headers: {
        Authorization: secret,
      },
    });

    if (response.ok) {
      help.value = await response.json();
      modules.value = Object.keys(commands.value);
      updateCommandTree();
      return;
    }

    error.value = "Failed to fetch commands: " + response.status;
  }

  function updateCommandTree() {
    const tree = (commands.value = {}) as any;

    Object.entries(unref(help)).forEach(([parent, commands]) => {
      tree[parent] = {} as Record<string, any>;
      commands.forEach((cmd: string) => {
        tree[cmd] = (args: any) => run(`${parent}.${cmd}`, args);
      });
    });
  }

  async function run(name: string, args: any) {
    const secret = unref(apiSecret);

    if (!secret) {
      return Promise.reject();
    }

    const response = await fetch(new URL(name, unref(apiHost)), {
      headers: {
        Authorization: secret,
      },
      body: args ? JSON.stringify(args) : undefined,
    });

    if (response.ok) {
      return response.json();
    }

    error.value = await response.text();
  }

  onMounted(fetchCommands);

  return {
    help,
    commands,
    modules,
    error,
    clearError,
    hasCommand,
    fetchCommands,
    run,
  };
}
