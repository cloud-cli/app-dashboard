import { unref, ref, onMounted } from 'vue';
import { useSettings } from './useSettings';

export function useCommands() {
  const commands = ref({});
  const { apiSecret, apiHost } = useSettings();

  const fetchCommands = async () => {
    const secret = unref(apiSecret);

    if (!secret) {
      return;
    }

    const response = await fetch(new URL('.help', unref(apiHost)), {
      headers: {
        Authorization: secret,
      },
    });

    if (response.ok) {
      commands.value = await response.json();
      return;
    }

    console.error('Failed to fetch commands', response.status);
  };

  onMounted(fetchCommands);

  return { commands, fetchCommands };
}
