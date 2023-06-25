<template>
  <div class="container mx-auto px-4">
    <Spinner class="my-6 mx-auto" v-if="!app" />

    <template v-else>
      <h1 class="text-4xl font-bold mb-4">{{ app.name }}</h1>

      <div class="text-right mb-4">
        <Spinner :visible="loading" class="mr-4" />
        <button
          class="px-2 bg-blue-500 text-white rounded leading-4 mr-2"
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
          <button
            type="submit"
            class="py-2 px-4 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>

      <div
        v-for="(env, index) of envList"
        :key="env.key"
        class="flex gap-2 mb-3"
      >
        <div class="w-1/3">
          <span class="block uppercase text-xs font-medium text-gray-700"
            >Key</span
          >
          <span class="mt-1 p-2 block w-full rounded-md border bg-gray-100">{{
            env.key
          }}</span>
        </div>
        <div class="flex-grow">
          <label
            :for="'k' + index"
            class="block uppercase text-xs font-medium text-gray-700"
            >Value</label
          >
          <input
            :id="'k' + index"
            v-model="env.value"
            @change="updateEnv(env)"
            class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
          />
        </div>
        <button @click="removeEnv(env)" class="pt-5">
          <span class="material-icons">delete</span>
        </button>
      </div>

      <form @submit.prevent="addEnv()">
        <div class="mb-4">
          <label
            for="newkey"
            class="block uppercase text-xs font-medium text-gray-700"
            >Key</label
          >
          <input
            id="newkey"
            v-model="newKey"
            placeholder="New env variable key..."
            class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
          />
        </div>
        <div class="text-right">
          <button class="py-2 px-4 bg-blue-500 text-white rounded">
            <span>Add</span>
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, unref } from "vue";
import { useCommands } from "../composables/useCommands";
import { useRoute } from "vue-router";
import Spinner from "./ui/Spinner.vue";

const { commands } = useCommands();
const app = ref(null);
const envList = ref([]);
const route = useRoute();
const loading = ref(false);
const newKey = ref("");

const props = defineProps({
  name: { type: String, default: "" },
});

onMounted(async () => {
  const name = props.name;
  app.value = await commands.dx.get({ name });
  envList.value = await commands.env.show({ name });
});

function updateEnv(env) {
  const { name } = unref(app);
  const { key, value } = env;
  commands.env.set({ key, value, app: name });
}

function addEnv() {
  const key = unref(newKey);
  const { name } = unref(app);

  if (!key) return;

  unref(envList).push({ app: name, key, value: "" });
  newKey.value = "";
}

async function removeEnv(env) {
  const { name } = unref(app);

  if (!confirm("Sure?")) {
    return;
  }

  await commands.env.remove({ name, key: env.key });

  envList.value = envList.value.filter((next) => next.key !== env.key);
}

function updateApp() {
  loading.value = true;
  commands.dx.update(app.value);
  loading.value = false;
}

async function refreshApp() {
  const { name } = unref(app);
  loading.value = true;
  await commands.dx.refresh({ name });
  await restartApp();
}

async function restartApp() {
  const { name } = unref(app);
  loading.value = true;
  await commands.dx.stop({ name });
  await commands.dx.start({ name });
  loading.value = false;
}
</script>
