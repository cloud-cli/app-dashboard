import { unref, ref, onMounted } from 'vue';
import { useSettings } from './useSettings';

export function useLogin() {
  const isLoggedIn = ref(false);
  const profile = ref({});
  const { authHost } = useSettings();

  const checkLoginStatus = async () => {
    const response = await fetch(unref(authHost) + '/profile', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });

    isLoggedIn.value = response.status === 200;

    if (isLoggedIn.value) {
      profile.value = await response.json();
    }
  };

  const logIn = () => {
    location.href = unref(authHost) + '/login?url=' + encodeURIComponent(location.href);
  };

  onMounted(checkLoginStatus);

  return { isLoggedIn, profile, logIn };
}
