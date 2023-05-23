import { unref, ref, onMounted } from 'vue';
import { useSettings } from './useSettings';

export function useCommands() {
  const commands = ref({});
  const { apiSecret, apiHost } = useSettings();

  const fetchCommands = async () => {
    const response = await fetch(new URL('.help', unref(apiHost)), {
      headers: {
        Authorization: `Bearer ${unref(apiSecret)}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      commands.value = data;
    } else {
      console.error('Failed to fetch commands', response.status);
    }
  };

  onMounted(fetchCommands);

  return { commands, fetchCommands };
}
