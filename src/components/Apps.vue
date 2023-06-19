<template>
  <div class="container mx-auto px-4">
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th>Status</th>
          <th>Name</th>
          <th>Host</th>
          <th>Image</th>
          <th>Ports</th>
          <th>Volumes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in apps" :key="app.name">
          <td>
            <span class="material-icons" :class="app.status === 'running' ? 'text-green-500' : 'text-red-500'">
              {{ app.status === 'running' ? 'check_circle' : 'error' }}
            </span>
          </td>
          <td>{{ app.name }}</td>
          <td>{{ app.host }}</td>
          <td>{{ app.image }}</td>
          <td>{{ app.ports }}</td>
          <td>{{ app.volumes }}</td>
          <td>
            <button class="py-1 px-3 bg-blue-500 text-white rounded" @click="restartApp(app)">Restart</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { apps, restart } from '../composables/useApps';

const restartApp = (app) => restart(app.name);
</script>
