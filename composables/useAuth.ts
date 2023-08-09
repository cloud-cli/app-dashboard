import { ref, onMounted } from "vue";

const isLoggedIn = ref(false);
const auth: any = ref(null);

async function getAuthLibrary(host) {
  return await import(String(new URL("/auth.js", host)));
}

export function useAuth() {
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

  onMounted(refresh);

  return {
    isLoggedIn,
    signOut,
    signIn,
    refresh,
    getProperty,
    setProperty,
    profile,
  };
}

export async function load(env) {
  auth.value = await getAuthLibrary(env.AUTH_HOST);
}
