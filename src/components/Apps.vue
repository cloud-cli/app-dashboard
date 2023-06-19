<template>
  <div class="container mx-auto px-4">
    <div>
      <input v-model="search" type="text" placeholder="Filter..." class="px-3 py-2 border rounded w-full mb-4">
    </div>
    <table class="table-auto w-full">
      <thead class="sr-only">
        <tr>
          <th class="px-2">&nbsp;</th>
          <th class="px-2">Name</th>
          <th class="px-2">Host</th>
          <th class="px-2">Image</th>
          <th class="px-2">Volumes</th>
          <th class="px-2">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in filteredList" :key="app.name">
          <td class="leading-3">
            <span v-if="!restarting[app.name]" class="material-icons text-sm" :class="[app.status === 'running' ? 'text-green-500' : 'text-red-500']">circle</span>
            <svg v-else class="animate-spin mx-auto h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </td>
          <td>{{ app.name }}</td>
          <td><a :href="'https://' + app.host" target="_blank">{{ app.host }}</a></td>
          <td>{{ app.image }}</td>
          <td>{{ app.volumes }}</td>
          <td>
            <button class="px-2 bg-blue-500 text-white rounded leading-4" @click="restartApp(app.name)">
              <span class="material-icons">refresh</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref, unref } from 'vue';
import { useApps } from '../composables/useApps';

const { apps, restart } = useApps();
const restarting = ref({});
const search = ref('');

const filteredList = computed(() => {
  const filter = unref(search);
  const list = unref(apps);

  if (!filter) {
    return list;
  }

  return list.filter(app => app.name.includes(filter));
});

const restartApp = async (name) => {
  unref(restarting)[name] = true;
  await restart(name);
  unref(restarting)[name] = false;
}

</script>
