<template>
  <PageLayout :title="'Available Commands'">
    <div class="text-right">
      <button class="p-2 bg-gray-300 leading-4 rounded" @click="fetchCommands()">
        <span class="material-icons">refresh</span>
      </button>

      <form class="flex items-center" @submit.prevent="onRun()">
        <input class="font-mono text-sm p-4 flex-grow w-full" v-model="commandInput" />
        <button class="p-4">Run</button>
      </form>

      <Logs @update="updateLogs()" :logs="logs" />
    </div>
    <template v-for="(subcommands, parent) in commands" :key="parent">
      <div v-if="subcommands.length" class="mb-4">
        <h2 class="text-lg font-semibold mb-2">{{ parent }}</h2>
        <ul class="pl-4">
          <li v-for="command in subcommands" :key="command">{{ command }}</li>
        </ul>
      </div>
    </template>
  </PageLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useCommands } from '../composables/useCommands';
import PageLayout from './ui/PageLayout.vue';
import Spinner from './ui/Logs.vue';
import minimistString from 'minimist-string';

const commandInput = ref('');
const commands = ref();
const logs = ref('');
const { help, run } = useCommands();

async function onRun() {
  const string = commandInput.value;

  if (!string.trim()) return;

  const { _: cmd, ...args } = minimistString(string);
  logs.value = await run(cmd, args);
}
onMounted(async () => {
  commands.value = await help();
});
</script>
