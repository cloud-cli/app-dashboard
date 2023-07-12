<template>
  <div class="container mx-auto">
    <div
      class="flex p-4 bg-gray-100 border border-0 border-b-1 sticky top-0 z-10 shadow-sm"
    >
      <input
        v-model="search"
        type="text"
        placeholder="Filter..."
        class="px-3 py-2 border rounded-l w-full flex-grow"
      />
      <button @click="toggleView()" class="p-2 bg-gray-300 leading-4">
        <span class="material-icons" v-if="showGrid">apps</span>
        <span class="material-icons" v-if="!showGrid">table_rows</span>
      </button>
      <button @click="refresh()" class="p-2 bg-gray-300 rounded-r leading-4">
        <span class="material-icons">refresh</span>
      </button>
    </div>

    <div v-if="!showGrid" class="grid gap-0 grid-cols-1 p-4">
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
        <div class="w-1/4">
          <router-link :to="'/apps/' + app.name">{{ app.name }}</router-link>
        </div>
        <div class="w-1/4">
          <a
            class="underline text-blue-500 text-sm ml-4"
            :href="'https://' + app.host"
            target="_blank"
            >{{ app.host }}</a
          >
        </div>
        <div class="text-sm text-gray-500 w-1/4">
          {{ app.image }}
        </div>
        <div class="text-sm text-gray-500 w-1/4">
          {{ app.volumes }}
        </div>
      </div>
    </div>
    <div
      v-if="showGrid"
      class="grid justify-items-stretch gap-4 grid-cols-2 md:grid-cols-3 p-4"
    >
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
  </div>
</template>

<script setup>
import { computed, ref, unref } from "vue";
import { useApps } from "../composables/useApps";
import { useLocalStorage } from "../composables/useLocalStorage";

const { apps, refresh } = useApps();
const search = ref("");
const showGrid = useLocalStorage("Apps_viewMode", 1, Number);

function toggleView() {
  showGrid.value = Number(showGrid.value) ? 0 : 1;
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
