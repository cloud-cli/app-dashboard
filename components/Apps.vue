<template>
  <div class="container mx-auto px-4">
    <div class="flex mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Filter..."
        class="px-3 py-2 border rounded w-full flex-grow"
      />
      <button
        @click="toggleView()"
        class="p-2 bg-gray-300 rounded-sm leading-4"
      >
        <span class="material-icons" v-if="viewMode.grid">apps</span>
        <span class="material-icons" v-if="viewMode.list">table_rows</span>
      </button>
    </div>

    <template v-if="viewMode.list">
      <div class="grid gap-1 grid-cols-1">
        <div
          class="rounded shadow flex p-2"
          v-for="app in filteredList"
          :key="app.name"
        >
          <span
            class="material-icons text-sm mr-2 mt-1"
            :class="[
              app.status === 'running' ? 'text-green-500' : 'text-red-500',
            ]"
          >
            circle
          </span>
          <div class="w-1/3">
            <router-link :to="'/apps/' + app.name">{{ app.name }}</router-link>
            <a
              class="underline text-blue-500 text-sm ml-4"
              :href="'https://' + app.host"
              target="_blank"
              >{{ app.host }}</a
            >
          </div>
          <div class="text-sm text-gray-500 w-1/3">
            {{ app.image }}
          </div>
          <div class="text-sm text-gray-500 w-1/3">
            {{ app.volumes }}
          </div>
        </div>
      </div>
    </template>
    <template v-if="viewMode.grid">
      <div class="grid justify-items-stretch gap-4 grid-cols-2 md:grid-cols-3">
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
            <router-link :to="'/apps/' + app.name">
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

const { apps } = useApps();
const search = ref("");
const showGrid = ref(true);
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
