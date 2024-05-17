import { ref, onMounted } from 'vue';

const isLoggedIn = ref(false);
const profile = ref(null);
const auth: any = ref(null);

function setProfile(p) {
  profile.value = p;
  isLoggedIn.value = !!p;
}

export function useAuth() {
  async function refresh() {
    try {
      setProfile(await auth.value.getProfile());
    } catch {
      setProfile(null);
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
    return auth.value.signIn(true);
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
  const lib = await import(String(new URL('/auth.js', env.AUTH_HOST)));
  auth.value = lib;
  lib.events.addEventListener('signin', (e: CustomEvent) => setProfile(e.detail));
}
