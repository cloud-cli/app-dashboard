<template>
  <div class="container mx-auto p-4 relative">
    <h1 class="text-2xl font-bold mb-4">{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({ title: { type: String } });
</script>
