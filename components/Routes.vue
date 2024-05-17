<template>
  <div class="container mx-auto p-4">
    <div class="flex gap-2 mb-3">
      <div class="w-1/3">
        <span class="block uppercase text-xs font-medium text-gray-700">Domain</span>
      </div>
      <div class="w-full">
        <span class="block uppercase text-xs font-medium text-gray-700">Target</span>
      </div>
    </div>

    <div v-for="(route, index) of routeList" :key="route.domain" class="flex gap-2 mb-1">
      <span class="w-1/3 mt-1 p-1 block w-full rounded-md border bg-gray-100 text-sm">{{ route.domain }}</span>
      <input
        :id="'k' + index"
        v-model="route.target"
        @change="updateRoute(route)"
        class="mt-1 p-1 block w-full rounded-md border border-gray-300 shadow-sm text-sm flex-grow"
      />
      <button @click="removeRoute(route)">
        <span class="material-icons">delete</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCommands } from '../composables/useCommands';

const { run } = useCommands();
const routeList = ref([]);

onMounted(() => {
  updateList();
});

async function updateList() {
  routeList.value = await run('px.list');
}

async function updateRoute(route) {
  console.log(route);

  run('px.update', {
    domain: route.domain,
    target: route.target,
  });
}

async function removeRoute(route) {
  if (confirm('Are you sure?')) {
    await run('px.remove', { domain: route.domain });
    await updateList();
  }
}
</script>
