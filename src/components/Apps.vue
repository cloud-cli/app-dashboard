<template>
  <div class="container mx-auto px-4">
    <table class="table-auto w-full">
      <thead class="bg-gray-200">
        <tr>
          <th class="p-2">&nbsp;</th>
          <th class="p-2">Name</th>
          <th class="p-2">Host</th>
          <th class="p-2">Image</th>
          <th class="p-2">Ports</th>
          <th class="p-2">Volumes</th>
          <th class="p-2">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in apps" :key="app.name">
          <td class="p-2">
            <span class="material-icons" :class="app.status === 'running' ? 'text-green-500' : 'text-red-500'">circle</span>
          </td>
          <td>{{ app.name }}</td>
          <td><a :href="'https://' + app.host" target="_blank">{{ app.host }}</a></td>
          <td>{{ app.image }}</td>
          <td>{{ app.ports }}</td>
          <td>{{ app.volumes }}</td>
          <td>
            <button class="p-2 bg-blue-500 text-white rounded leading-4" @click="restart(app.name)">
              <span class="material-icons">refresh</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useApps } from '../composables/useApps';

const { apps, restart } = useApps();
</script>
