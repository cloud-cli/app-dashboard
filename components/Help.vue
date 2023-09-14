<template>
  <PageLayout :title="'Available Commands'">
    <div class="text-right">
      <button
        class="p-2 bg-gray-300 leading-4 rounded"
        @click="fetchCommands()"
      >
        <span class="material-icons">refresh</span>
      </button>
    </div>
    <template v-for="(subcommands, parent) in help" :key="parent">
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
import { onMounted } from "vue";
import { useCommands } from "../composables/useCommands";
import PageLayout from "./ui/PageLayout.vue";

const { help, fetchCommands } = useCommands();
onMounted(fetchCommands);
</script>
