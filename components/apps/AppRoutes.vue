<template>
  <div class="container mx-auto p-4">
    <div v-for="(route, index) of routeList" :key="route.domain" class="flex gap-2 mb-3">
      <div class="w-1/3">
        <span class="block uppercase text-xs font-medium text-gray-700">Domain</span>
        <span class="mt-1 p-2 block w-full rounded-md border bg-gray-100">{{ route.domain }}</span>
      </div>

      <div class="flex-grow">
        <label :for="'k' + index" class="block uppercase text-xs font-medium text-gray-700">Target</label>
        <input
          :id="'k' + index"
          v-model="route.target"
          @change="updateRoute(route)"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
        />
      </div>

      <button @click="removeRoute(route)" class="pt-5">
        <span class="material-icons">delete</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCommands } from '../../composables/useCommands';

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
