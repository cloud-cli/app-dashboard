import { ref } from "vue";
import { usePreference } from "./usePreference";
import { useEnv } from "./useEnv";
import { useAuth } from "./useAuth";

let remote: Promise<any> | null = null;

async function loadRemote(host: string) {
  const mod = await import(new URL("/index.mjs", host).toString());
  const { auth, run } = mod;
  remote = new Promise(r => r({ run, auth }));
}

export function useCommands() {
  const { env } = useEnv();
  const { isLoggedIn } = useAuth();
  const [apiSecret] = usePreference("apiSecret");
  const canRunCommands = ref(false);

  async function verify() {
    if (!remote) {
      await loadRemote(env.value.API_HOST);
    }

    try {
      const { auth } = await remote;
      await auth(apiSecret.value);
      canRunCommands.value = true;
      return true
    } catch {
      canRunCommands.value = false;
      return false;
    }
  }

  async function run(name: string, args?: any) {
    if (!isLoggedIn.value) {
      return Promise.reject(new Error("Log in first"));
    }

    if (!apiSecret.value) {
      return Promise.reject(new Error("API key not found"));
    }

    if (!remote) {
      await loadRemote(env.value.API_HOST);
      await verify();
    }

    return remote!.then(c => c.run(name, args));
  }

  async function help() {
    return run(".help");
  }

  return {
    help,
    run,
    verify,
    canRunCommands,
  };
}
