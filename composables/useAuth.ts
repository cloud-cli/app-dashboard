import { ref } from "vue";
import { useEnv } from "./useEnv";
import { useQueue } from "./useQueue";

const isLoggedIn = ref(false);
const auth: any = ref(null);
const { whenReady, run } = useQueue;

async function getAuthLibrary(host) {
  return await import(String(new URL("/auth.js", host)));
}

export function useAuth() {
  const { env, whenReady: envReady } = useEnv();
  const profile = ref(null);

  async function refresh() {
    try {
      profile.value = await auth.value.getProfile();
      isLoggedIn.value = !!profile.value;
    } catch {
      profile.value = null;
      isLoggedIn.value = false;
    }
  }

  async function signOut() {
    try {
      await auth.signOut();
    } finally {
      isLoggedIn.value = false;
    }
  }

  async function signIn() {
    return auth.value.signIn();
  }

  const setProperty = (...args) => auth.value?.setProperty(...args);
  const getProperty = (...args) => auth.value?.getProperty(...args);

  async function init() {
    auth.value = await getAuthLibrary(env.value.AUTH_HOST);
    refresh();
    run();
  }

  envReady(init);

  return {
    isLoggedIn,
    signOut,
    signIn,
    refresh,
    getProperty,
    setProperty,
    profile,
    whenReady,
  };
}
