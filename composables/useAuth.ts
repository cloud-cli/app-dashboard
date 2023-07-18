import { unref, ref } from "vue";
import { useSettings } from "./useSettings";

const isLoggedIn = ref(false);
let auth: any = ref(null);

async function getAuthLibrary(host) {
  return await import(String(new URL("/auth.js", host)));
}

export function useAuth() {
  const profile = ref(null);
  const { authHost, ready: env } = useSettings();

  async function refresh() {
    profile.value = await auth.value.getProfile();
    isLoggedIn.value = !!profile.value;
  }

  async function logout() {
    const response = await fetch(new URL("/", unref(authHost)), {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    });

    isLoggedIn.value = !response.ok;
  }

  function goToLogin() {
    location.href = String(
      new URL(
        "/login?url=" + encodeURIComponent(location.href),
        unref(authHost)
      )
    );
  }

  const ready = env.then(async () => {
    const lib = await getAuthLibrary(authHost.value);
    auth.value = lib;
    refresh();
  });

  return { isLoggedIn, logout, goToLogin, refresh, profile, ready, auth };
}
