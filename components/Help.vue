<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-bold mb-4">Available Commands</h1>
    <template v-for="(subcommands, parent) in help"
      :key="parent">
      <div v-if="subcommands.length" class="mb-4">
        <h2 class="text-lg font-semibold mb-2">{{ parent }}</h2>
        <ul class="pl-4">
          <li v-for="command in subcommands" :key="command">{{ command }}</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCommands } from '../composables/useCommands.js';

const { help, fetchCommands } = useCommands();
onMounted(fetchCommands);
</script>
