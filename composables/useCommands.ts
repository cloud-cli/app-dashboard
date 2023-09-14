import { unref, ref, watch } from "vue";
import { usePreference } from "./usePreference";
import { useEnv } from "./useEnv";
import { useAuth } from "./useAuth";

interface CommandOptions {
  text?: boolean;
}

interface Command {
  (args?: any, options?: CommandOptions): Promise<any>;
}

type Commands = Record<string, Record<string, Command>>;
const help = ref<Record<string, string[]>>({});

export function useCommands() {
  const { env } = useEnv();
  const { isLoggedIn } = useAuth();
  const modules = ref<string[]>([]);
  const error = ref<string>("");
  const hasCommand = (name: string) => unref(modules).includes(name);
  const clearError = () => (error.value = "");
  const apiHost = env.value.API_HOST;
  const [apiSecret] = usePreference("apiSecret");

  const _commands: Commands = {};
  const commands = new Proxy(_commands, {
    get(_a: any, outer: string) {
      if (!_commands[outer]) {
        const innerProxy = {};
        _commands[outer] = new Proxy(innerProxy, {
          get(_b: any, inner: string) {
            return (args?: any, options?: CommandOptions) => {
              return new Promise((resolve, reject) => {
                run(`${outer}.${inner}`, args, options).then(resolve, reject);
              });
            };
          },
        });
      }

      return _commands[outer];
    },
  });

  const detach = watch(
    () => apiHost + apiSecret.value,
    (v) => {
      if (v) {
        fetchCommands();
        detach();
      }
    }
  );

  async function fetchCommands() {
    const response = await fetch(new URL(".help", apiHost), {
      headers: {
        Authorization: apiSecret.value,
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
    if (!isLoggedIn.value) {
      return Promise.reject(new Error("Log in first"));
    }

    if (!apiSecret.value) {
      return Promise.reject(new Error("Secret is missing"));
    }

    const response = await fetch(new URL(name, apiHost), {
      headers: {
        Authorization: apiSecret.value,
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
    run,
  };
}
