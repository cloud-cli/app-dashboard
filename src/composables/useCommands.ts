import { unref, ref } from "vue";
import { useSettings } from "./useSettings";

export function useCommands() {
  const help = ref<Record<string, string[]>>({});
  const modules = ref<string[]>([]);
  const error = ref<string>("");
  const hasCommand = (name: string) => unref(modules).includes(name);
  const clearError = () => (error.value = "");
  const { apiSecret, apiHost } = useSettings();

  const _commands: any = {};
  const commands = ref<any>(
    new Proxy(_commands, {
      get(_a: any, outer: string) {
        if (!_commands[outer]) {
          const innerProxy = {};
          _commands[outer] = new Proxy(innerProxy, {
            get(_b: any, inner: string) {
              return (args: any) => run(`${outer}.${inner}`, args);
            },
          });
        }

        return _commands[outer];
      },
    })
  );

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
      return;
    }

    error.value = "Failed to fetch commands: " + response.status;
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
      method: "POST",
      body: args ? JSON.stringify(args) : "{}",
    });

    if (response.ok) {
      return response.json();
    }

    error.value = await response.text();
  }

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
