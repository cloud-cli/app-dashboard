<template>
  <div class="text-red-500">
    <p class="font-bold">Unable to start the app!</p>
    <pre>{{ error }}</pre>
  </div>
</template>

<script setup>
defineProps({ error: { type: String } });
</script>
