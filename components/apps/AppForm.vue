<template>
  <form @submit.prevent="onSubmit()">
    <div class="mb-4">
      <label
        for="image"
        class="block uppercase text-xs font-medium text-gray-700"
        >Image</label
      >
      <input
        id="image"
        v-model="app.image"
        type="text"
        class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
      />
    </div>
    <div class="mb-4">
      <label
        for="host"
        class="block uppercase text-xs font-medium text-gray-700"
        >Host</label
      >
      <input
        id="host"
        v-model="app.host"
        type="text"
        class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
      />
    </div>
    <div class="mb-4">
      <label
        for="volumes"
        class="block uppercase text-xs font-medium text-gray-700"
        >Volumes</label
      >
      <input
        id="volumes"
        v-model="app.volumes"
        type="text"
        class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
      />
    </div>
    <div class="text-right">
      <button type="submit" class="py-2 px-4 bg-blue-500 text-white rounded">
        Save
      </button>
    </div>
  </form>
</template>

<script setup>
import { watch, ref } from 'vue';

const props = defineProps({
  app: { type: Object, default: null },
});

const emit = defineEmits("change");
const app = ref(props.app);

watch(() => props.app, (v) => (app.value = v), { deep: true });

function onSubmit() {
  app.value && emit("change", { ...app.value });
}
</script>
