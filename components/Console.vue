<template>
  <PageLayout :title="'Available Commands'">
    <form class="flex items-center space-x-2" @submit.prevent="onRun()">
      <input
        class="font-mono text-sm flex-grow w-full p-2 block rounded-md border border-gray-300 shadow-sm"
        v-model="commandInput"
      />
      <button class="p-2 border border-gray-300 shadow-sm">Run</button>
    </form>

    <Logs :logs="logs" class="mt-4" />

    <div class="text-right">
      <button class="p-2 bg-gray-300 leading-4 rounded" @click="fetchCommands()">
        <span class="material-icons">help</span>
      </button>
    </div>
    <div class="text-sm p-2 mt-4 border border-gray-100">
      <template v-for="(subcommands, parent) in commands" :key="parent">
        <div v-if="subcommands.length" class="mb-4">
          <h2 class="font-semibold mb-1">{{ parent }}</h2>
          <ul class="pl-4">
            <li v-for="command in subcommands" :key="command">{{ command }}</li>
          </ul>
        </div>
      </template>
    </div>
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
  console.log(cmd, args);
  logs.value = await run(cmd, args);
}

async function fetchCommands() {
  commands.value = await help();
}

onMounted(() => {
  fetchCommands();
});
</script>
