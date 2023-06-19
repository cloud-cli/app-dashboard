import { unref, ref, onMounted } from "vue";
import { useSettings } from "./useSettings";

export function useCommands() {
  const help = ref({});
  const modules = ref([]);
  const error = ref([]);
  const commands = ref({});
  const hasCommand = (name) => modules.includes(name);
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
      commands.value = await response.json();
      modules.value = Object.keys(tree);
      updateCommandTree();
      return;
    }

    error.value = "Failed to fetch commands: " + response.status;
  }

  function updateCommandTree() {
    const tree = (commands.value = {});

    Object.entries(unref(help)).forEach(([parent, commands]) => {
      tree[parent] = {};
      commands.forEach((cmd) => {
        tree[cmd] = (args) => run(`${parent}.${cmd}`, args);
      });
    });
  }

  async function run(name, args) {
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
