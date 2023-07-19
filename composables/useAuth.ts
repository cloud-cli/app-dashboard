import { ref } from "vue";
import { useEnv } from "./useEnv";

const isLoggedIn = ref(false);
const auth: any = ref(null);

async function getAuthLibrary(host) {
  return await import(String(new URL("/auth.js", host)));
}

export function useAuth() {
  const { env, ready } = useEnv();
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

  async function init() {
    auth.value = await getAuthLibrary(env.value.authHost);
    refresh();
  }

  ready.then(init);

  return { isLoggedIn, signOut, signIn, refresh, profile, auth };
}
