<template>
  <div class="container mx-auto px-4">
    <div class="flex">
      <input
        v-model="search"
        type="text"
        placeholder="Filter..."
        class="px-3 py-2 border rounded w-full mb-4 flex-grow"
      />
      <button @click="toggleView()">
        <span class="material-icons" v-if="viewMode.grid">apps</span>
        <span class="material-icons" v-if="viewMode.list">table_rows</span>
      </button>
    </div>

    <template v-if="viewMode.list">
      <table class="table-auto w-full">
        <thead class="sr-only">
          <tr>
            <th class="px-2">&nbsp;</th>
            <th class="px-2">Name</th>
            <th class="px-2">Host</th>
            <th class="px-2">Image</th>
            <th class="px-2">Volumes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in filteredList" :key="app.name">
            <td class="leading-3">
              <span
                class="material-icons text-sm"
                :class="[
                  app.status === 'running' ? 'text-green-500' : 'text-red-500',
                ]"
                >circle</span
              >
            </td>
            <td>
              <route-link :path="'/apps/' + app.name">
                {{ app.name }}
              </route-link>
            </td>
            <td>
              <a :href="'https://' + app.host" target="_blank">{{
                app.host
              }}</a>
            </td>
            <td>{{ app.image }}</td>
            <td>{{ app.volumes }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="viewMode.grid">
      <div class="grid justify-items-stretch gap-4 grid-cols-3">
        <div
          class="relative border border-gray-300 round bg-white shadow p-3 rounded-md h-30"
          v-for="app in filteredList"
          :key="app.name"
        >
          <div class="absolute top-2 right-2 leading-3">
            <span
              class="material-icons text-sm"
              :class="
                app.status === 'running' ? 'text-green-500' : 'text-red-500'
              "
              >circle</span
            >
          </div>

          <h2 class="text-md font-bold">
            <router-link :path="'/apps/' + app.name">
              {{ app.name }}
            </router-link>
          </h2>
          <a
            class="text-blue-500 underline"
            :href="'https://' + app.host"
            target="_blank"
            >{{ app.host }}</a
          >
          <p class="text-gray-400 text-sm">{{ app.image }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, unref } from "vue";
import { useApps } from "../composables/useApps";

const { apps, restart } = useApps();
const restarting = ref({});
const search = ref("");
const showGrid = ref("");
const viewMode = computed(() => ({
  grid: showGrid.value,
  list: !showGrid.value,
}));

function toggleView() {
  showGrid.value = !showGrid.value;
}

const filteredList = computed(() => {
  const filter = unref(search);
  const list = unref(apps);

  if (!filter) {
    return list;
  }

  return list.filter((app) => app.name.includes(filter));
});
</script>
