<template>
  <div class="container mx-auto px-4">
    <h1 class="text-2xl font-bold mb-4">Configure Web Client</h1>
    <form>
      <div class="mb-4">
        <label
          for="apiHost"
          class="block uppercase text-xs font-medium text-gray-700"
          >API Host</label
        >
        <input
          id="apiHost"
          v-model="apiHost"
          type="text"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
        />
      </div>

      <div class="mb-4">
        <label
          for="apiSecret"
          class="block uppercase text-xs font-medium text-gray-700"
          >API Key</label
        >
        <input
          id="apiSecret"
          v-model="apiSecret"
          type="text"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
        />
      </div>

      <div class="mb-4">
        <label
          for="authHost"
          class="block uppercase text-xs font-medium text-gray-700"
          >Authentication host</label
        >
        <input
          id="authHost"
          v-model="authHost"
          type="text"
          class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { useSettings } from "../composables/useSettings";

const { apiSecret, apiHost, authHost } = useSettings();
</script>
