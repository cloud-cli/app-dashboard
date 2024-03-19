import { computed } from "vue";
import { usePreference } from "./usePreference";
import { useEnv } from "./useEnv";
import { useAuth } from "./useAuth";

let remote: Promise<any> | null = null;
let all: any = null;

async function loadRemote(host: string, key: string) {
  const mod = await import(new URL("/index.mjs", host).toString());
  const { auth, run, default: cloud } = mod;
  remote = new Promise(r => r({ run, cloud }));

  all = cloud;
  await auth(key);
}

export function useCommands() {
  const { env } = useEnv();

  const { isLoggedIn } = useAuth();
  const [apiSecret] = usePreference("apiSecret");
  const canRunCommands = computed(() => isLoggedIn.value && apiSecret.value);

  async function run(name: string, args?: any) {
    if (!isLoggedIn.value) {
      return Promise.reject(new Error("Log in first"));
    }

    if (!apiSecret.value) {
      return Promise.reject(new Error("API key not found"));
    }

    if (!remote) {
      loadRemote(env.value.API_HOST, apiSecret.value);
    }

    return remote!.then(c => c.run(name, args));
  }

  async function help() {
    return run(".help");
  }

  const commands = new Proxy({}, {
    get(_target, p) {
      if (all) {
        return all[p]
      }

      return null;
    }
  });

  return {
    help,
    run,
    canRunCommands,
    commands,
  };
}
