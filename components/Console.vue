<template>
  <PageLayout :title="'Available Commands'">
    <form class="flex items-center" @submit.prevent="onRun()">
      <input
        class="font-mono text-sm flex-grow w-full p-2 block rounded-l-md border border-gray-300 shadow-sm"
        v-model="commandInput"
      />
      <button class="p-2 border border-gray-300 shadow-sm rounded-r-md border-l-0">Run</button>
    </form>

    <Logs :logs="logs" class="my-4" />
    <Logs :logs="commands" @update="fetchCommands()" />
  </PageLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCommands } from '../composables/useCommands';
import PageLayout from './ui/PageLayout.vue';
import parseArgs from 'yargs';

const commandInput = ref('');
const commands = ref('');
const logs = ref('');
const { help, run } = useCommands();

async function onRun() {
  const string = commandInput.value;

  if (!string.trim()) return;

  const { argv } = parseArgs(string.split(' '));
  const { $0, _, ...args } = argv;
  const [cmd, ...rest] = _;
  const finalArgs = { ...args, _: rest };

  try {
    logs.value = await run(cmd, finalArgs);
    commandInput.value = '';
  } catch (error) {
    logs.value = String(error);
  }
}

async function fetchCommands() {
  const allCommands: Record<string, string[]> = await help();
  const tree = Object.entries(allCommands);
  const text = [];

  for (const [parent, subcommands] of tree) {
    text.push(
      parent,
      subcommands.map((s) => '  ' + s),
    );
  }

  commands.value = text.join('\n');
}

onMounted(() => {
  fetchCommands();
});
</script>
