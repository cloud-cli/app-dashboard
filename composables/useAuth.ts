import { ref, onMounted } from "vue";

const isLoggedIn = ref(false);
const auth: any = ref(null);

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
      await auth.value.signOut();
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
  auth.value = await import(String(new URL("/auth.js", env.AUTH_HOST)));
}
