<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-bold mb-4">Available Commands</h1>
    <div v-for="(subcommands, parent) in commands"
      :key="parent"
      class="mb-4">
      <h2 class="text-lg font-semibold mb-2">{{ parent }}</h2>
      <ul class="pl-4">
        <li v-for="command in subcommands"
          :key="command">{{ command }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useCommands } from '../composables/useCommands';

export default defineComponent({
  setup() {
    const { commands } = useCommands();
    return { commands };
  }
});
</script>
