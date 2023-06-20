<template>
  <div class="container mx-auto px-4">
    <div>
      <input
        v-model="search"
        type="text"
        placeholder="Filter..."
        class="px-3 py-2 border rounded w-full mb-4"
      />
    </div>

    <template v-if="mode == 'list'">
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
    <template v-else>
      <div class="flex gap-2 justify-items-stretch">
        <div
          class="relative border border-gray-300 round w-1/5 bg-white shadow p-2"
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
            <route-link :path="'/apps/' + app.name">
              {{ app.name }}
            </route-link>
          </h2>
          <a :href="'https://' + app.host" target="_blank">{{ app.host }}</a>
          <p>{{ app.image }}</p>
          <p>{{ app.volumes }}</p>
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
const mode = ref("");

const filteredList = computed(() => {
  const filter = unref(search);
  const list = unref(apps);

  if (!filter) {
    return list;
  }

  return list.filter((app) => app.name.includes(filter));
});
</script>
