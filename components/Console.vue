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

function parseArgs(string: string) {
  const [command, ...parts] = string.split(' ');
  const args: any = {};
  let nextOption = '';

  args._ = [];
  let parseableParts = parts.slice(0);
  const start = parts.findIndex((p) => p.startsWith('--'));

  if (start !== -1) {
    args._ = parts.slice(0, start);
    parseableParts = parts.slice(start);
  }

  for (const part of parseableParts) {
    if (part.startsWith('--')) {
      if (nextOption) {
        args[nextOption] = true;
        nextOption = part.slice(2);
        continue;
      }

      nextOption = part.slice(2);
      continue;
    }

    if (nextOption) {
      args[nextOption] = part;
      nextOption = '';
      continue;
    }

    args._.push(part);
  }

  return { command, args };
}

const commandInput = ref('');
const commands = ref('');
const logs = ref('');
const { help, run } = useCommands();

async function onRun() {
  const string = commandInput.value;

  if (!string.trim()) return;

  const { args, command } = parseArgs(string);

  try {
    logs.value = await run(command, args);
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
