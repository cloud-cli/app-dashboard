<template>
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold mb-4">{{ app.name }}</h1>

    <div class="text-right mb-4">
      <button
        class="px-2 bg-blue-500 text-white rounded leading-4"
        @click="restartApp()"
      >
        <span class="material-icons">refresh</span>
      </button>
      <button
        class="px-2 bg-red-500 text-white rounded leading-4"
        @click="refreshApp()"
      >
        <span class="material-icons">cloud_download</span>
      </button>
    </div>

    <form @submit.prevent="updateApp()">
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

    <template v-for="(env, index) of envList" :key="env.key">
      <div class="mb-4">
        <span class="block uppercase text-xs font-medium text-gray-700"
          >Key</span
        >
        <span
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
          >{{ env.key }}</span
        >
      </div>
      <div class="mb-4">
        <label
          :for="'k' + index"
          class="block uppercase text-xs font-medium text-gray-700"
          >Value</label
        >
        <input
          :id="'k' + index"
          @change="updateEnv(env)"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, unref } from "vue";
import { commands } from "./composables/useCommands";
import { useRoute } from "vue-router";

const app = ref(null);
const env = ref([]);
const route = useRoute();

onMounted(async () => {
  const name = route.params.id;
  app.value = await commands.dx.get({ name });
  env.value = await commands.env.show({ name });
});

function updateEnv(env) {
  const { name } = unref(app);
  const { key, value } = env;
  commands.env.set({ key, value, app: name });
}

function updateApp() {
  commands.dx.update(app.value);
}

async function refreshApp() {
  const { name } = unref(app);
  await commands.dx.refresh({ name });
  await restartApp();
}

async function restartApp() {
  const { name } = unref(app);
  unref(restarting)[name] = true;
  await restart(name);
  unref(restarting)[name] = false;
}
</script>
