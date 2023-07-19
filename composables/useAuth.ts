import { ref } from "vue";
import { useEnv } from "./useEnv";

const isLoggedIn = ref(false);

async function getAuthLibrary(host) {
  return await import(String(new URL("/auth.js", host)));
}

export async function useAuth() {
  const profile = ref(null);
  const env = await useEnv();
  const auth = await getAuthLibrary(env.authHost);

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

  refresh();

  return { isLoggedIn, signOut, signIn: auth.signIn, refresh, profile, auth };
}
