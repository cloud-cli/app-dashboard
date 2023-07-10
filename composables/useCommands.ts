import { unref, ref } from "vue";
import { useProperty } from "./useProperty";

interface CommandOptions {
  text?: boolean;
}

interface Command {
  (args?: any, options?: CommandOptions): Promise<any>;
}

type Commands = Record<string, Record<string, Command>>;

export function useCommands() {
  const help = ref<Record<string, string[]>>({});
  const modules = ref<string[]>([]);
  const error = ref<string>("");
  const hasCommand = (name: string) => unref(modules).includes(name);
  const clearError = () => (error.value = "");
  const [apiSecret] = useProperty("apiSecret");
  const [apiHost] = useProperty("apiHost");

  const _commands: Commands = {};
  const commands = new Proxy(_commands, {
    get(_a: any, outer: string) {
      if (!_commands[outer]) {
        const innerProxy = {};
        _commands[outer] = new Proxy(innerProxy, {
          get(_b: any, inner: string) {
            return (args?: any, options?: CommandOptions) =>
              run(`${outer}.${inner}`, args, options);
          },
        });
      }

      return _commands[outer];
    },
  });

  async function fetchCommands() {
    const secret = apiSecret.value;

    if (!secret) {
      return;
    }

    const response = await fetch(new URL(".help", apiHost.value), {
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

  async function run(name: string, args?: any, options: CommandOptions = {}) {
    const secret = apiSecret.value;

    if (!secret) {
      return Promise.reject();
    }

    const response = await fetch(new URL(name, apiHost.value), {
      headers: {
        Authorization: secret,
      },
      method: "POST",
      body: args ? JSON.stringify(args) : "{}",
    });

    if (response.ok) {
      return options.text ? response.text() : response.json();
    }

    error.value = await response.text();
  }

  return {
    help,
    commands: commands as Commands,
    modules,
    error,
    clearError,
    hasCommand,
    fetchCommands,
    run,
  };
}
