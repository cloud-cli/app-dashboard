<template >
  <template v-if="isLoggedIn">
    <!-- Sticky header -->
    <div class="sticky top-0 z-50 bg-white flex justify-between items-center px-4 py-2 shadow-md">
      <h1 class="text-2xl font-bold">Cloudy</h1>
      <div>Hi, {{ profile.name }}</div>
    </div>

    <!-- Sidebar -->
    <div class="h-screen flex overflow-hidden bg-white">
      <div class="flex flex-col w-64 border-r border-gray-200 pb-4 bg-white">
        <nav class="mt-5 flex-1 space-y-1">
          <router-link v-for="route in routes"
            :to="route.path"
            class="flex items-center text-gray-900 space-x-2 py-2 px-4"
            active-class="text-blue-500 bg-gray-200">
            <span class="material-icons text-base">{{ route.icon }}</span>
            <span class="text-base">{{ route.name }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Main area -->
      <div class="flex-1 overflow-auto pt-4">
        <router-view></router-view>
        <Error v-if="error" :error="error.message" />
      </div>
    </div>
  </template>
</template>

<script setup>
import { defineComponent, ref } from 'vue';
import routes from '../routes';
import Error from './components/ui/Error.vue';
import { useLogin } from '../composables/useLogin';
import { useCommands } from './composables/useCommands';

const { isLoggedIn, profile } = useLogin();
const { routes } = useRouter();
const { error, hasCommand } = useCommands();
const enabledRoutes = ref(routes.filter(r => (!r.command || hasCommand(r.command))));

return { isLoggedIn, profile, routes: enabledRoutes };
</script>
