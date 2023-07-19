import { unref, ref, onMounted } from "vue";
import { useProperty } from "./usePreference";
import { useEnv } from "./useEnv";

interface CommandOptions {
  text?: boolean;
}

interface Command {
  (args?: any, options?: CommandOptions): Promise<any>;
}

type Commands = Record<string, Record<string, Command>>;
const help = ref<Record<string, string[]>>({});

export async function useCommands() {
  const env = await useEnv();
  const { API_KEY: apiKey = "", API_HOST: apiHost = "" } = env;
  const modules = ref<string[]>([]);
  const error = ref<string>("");
  const hasCommand = (name: string) => unref(modules).includes(name);
  const clearError = () => (error.value = "");

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
    if (!apiKey) {
      return;
    }

    const response = await fetch(new URL(".help", apiHost), {
      headers: {
        Authorization: apiKey,
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
    if (!apiKey) {
      console.log("Secret is missing", apiHost, apiKey);
      return Promise.reject(new Error("Secret is missing"));
    }

    const response = await fetch(new URL(name, apiHost), {
      headers: {
        Authorization: apiKey,
      },
      method: "POST",
      body: args ? JSON.stringify(args) : "{}",
    });

    if (response.ok) {
      return options.text ? response.text() : response.json();
    }

    error.value = await response.text();
  }

  onMounted(fetchCommands);

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
