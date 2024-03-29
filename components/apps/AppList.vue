<template>
  <div class="container mx-auto">
    <div v-if="!canRunCommands" class="p-4">
      Loading...

      <button
        @click="refresh()"
        class="px-4 py-2 bg-gray-200 leading-4 rounded mx-auto flex"
      >
        <span class="material-icons">refresh</span>
        <span>Reload list</span>
      </button>
    </div>
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
      <button @click="refresh()" class="p-2 bg-gray-300 leading-4 rounded-r">
        <span class="material-icons">refresh</span>
      </button>
      <span class="border-l border-gray-400 mx-2 my-1"></span>
      <button
        @click="addAppPrompt()"
        class="p-2 bg-blue-500 text-white rounded leading-4"
      >
        <span class="material-icons">add_box</span>
      </button>
    </div>

    <div v-if="!showGrid" class="grid gap-0 grid-cols-1 p-4">
      <div
        class="rounded shadow flex p-2 items-center"
        v-for="app in filteredList"
        :key="app.name"
      >
        <span
          class="material-icons text-sm mr-2"
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
          <span
            class="inline-block px-1 mr-1 bg-gray-100"
            v-for="v of app.volumes"
            >{{ v }}</span
          >
        </div>
      </div>
    </div>
    <div
      v-if="showGrid"
      class="grid justify-items-stretch gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4"
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
import { useApps } from "../../composables/useApps";
import { useCommands } from "../../composables/useCommands";
import { usePreference } from "../../composables/usePreference";

const search = ref("");
const { apps, refresh, addApp } = useApps();
const { canRunCommands } = useCommands();
const [showGrid, setShowGrid] = usePreference("showGrid");

function toggleView() {
  setShowGrid(Number(showGrid.value) ? 0 : 1);
}

const filteredList = computed(() => {
  const filter = unref(search);
  const list = unref(apps);

  if (!filter) {
    return list;
  }

  return list.filter((app) => app.name.includes(filter));
});

function addAppPrompt() {
  const name = prompt("App name", "");
  addApp(name);
}
</script>
