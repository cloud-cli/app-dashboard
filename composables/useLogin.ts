import { unref, ref, onMounted } from "vue";
import { useSettings } from "./useSettings";

export function useLogin() {
  const isLoggedIn = ref(false);
  const profile = ref({});
  const { authHost } = useSettings();

  const checkLoginStatus = async () => {
    if (!unref(authHost)) return;

    const response = await fetch(new URL("/", unref(authHost)), {
      method: "GET",
      mode: "cors",
      credentials: "include",
    });

    isLoggedIn.value = response.ok && response.status === 200;

    if (isLoggedIn.value) {
      profile.value = await response.json();
      return;
    }

    goToLogin();
  };

  async function logout() {
    const response = await fetch(new URL("/", unref(authHost)), {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    });

    return response.ok;
  }

  function goToLogin() {
    location.href = String(
      new URL(
        "/login?url=" + encodeURIComponent(location.href),
        unref(authHost)
      )
    );
  }

  onMounted(checkLoginStatus);

  return { isLoggedIn, logout, goToLogin, profile };
}
