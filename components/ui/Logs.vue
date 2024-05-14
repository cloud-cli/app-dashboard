<template>
  <div class="relative p-4 bg-gray-800 text-white font-mono text-sm overflow-y-auto whitespace-pre-wrap rounded-lg">
    <button @click="onUpdate()" class="absolute top-0 right-0 m-2 bg-gray-800">
      <span class="material-icons text-sm text-white">refresh</span>
    </button>
    <div class="uppercase text-xs font-medium">{{ title }}</div>
    <div class="text-sm">{{ logs }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  logs: String,
});

const emit = defineEmits(['update']);
const onUpdate = () => emit('update');
</script>
