import { useLocalStorage } from './useLocalStorage.js';

export function useSettings() {
  const apiSecret = useLocalStorage('apiSecret', '');
  const apiHost = useLocalStorage('apiHost', '');
  const authHost = useLocalStorage('authHost', '');

  return { apiSecret, apiHost, authHost };
}
