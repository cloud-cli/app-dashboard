<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-bold mb-4">Configure Web Client</h1>
    <form>
      <div class="mb-4">
        <label
          for="authHost"
          class="block uppercase text-xs font-medium text-gray-700"
          >Authentication URL</label
        >
        <input
          id="authHost"
          v-model="authHost"
          type="text"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
        />
      </div>
      <hr />
      <template v-if="showSettings">
        <div class="mb-4" v-for="setting in settingList">
          <label
            :for="setting.key"
            class="block uppercase text-xs font-medium text-gray-700"
            >{{ setting.label }}</label
          >
          <input
            :id="setting.key"
            v-model="setting.value"
            type="text"
            class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
          />
        </div>
      </template>
    </form>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { useSettings } from "../composables/useSettings";
import { useProperty } from "../composables/useProperty";

const { authHost } = useSettings();
const showSettings = ref(!!authHost.value);
const properties = ["apiSecret", "apiHost"];

const settingList = properties.map((key) => {
  const value = ref("");
  const label = key.replace(/[A-Z]{1}/g, (c) => " " + c);
  const [_, setProperty] = useProperty(key);
  watch(value, setProperty);

  return { value, label, key };
});

watch(
  () => authHost.value,
  (value) => {
    showSettings.value == !!value;
    console.log(value);
  }
);
</script>
