<template>
  <div v-if="error" class="bg-red-500 text-white px-4 py-2 rounded my-4">
    {{ error }}
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    default: "",
  },
});
</script>
