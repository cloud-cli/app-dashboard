<template>
  <!-- Sticky header -->
  <div class="sticky top-0 z-50 bg-white flex justify-between items-center px-4 py-2 shadow-md">
    <h1 class="text-2xl font-bold">Cloudy</h1>

    <button v-if="!isLoggedIn"
      @click="logIn()"
      class="py-2 px-4 bg-blue-500 text-white rounded">Login</button>
    <div v-else>
      Hi, {{ profile }}
      <button class="py-2 px-4 bg-red-500 text-white rounded">Logout</button>
    </div>
  </div>

  <!-- Sidebar -->
  <div class="h-screen flex overflow-hidden bg-white">
    <div class="flex flex-col w-64 border-r border-gray-200 pb-4 bg-white">
      <nav class="mt-5 flex-1 space-y-1">
        <router-link v-for="route in navigation" :to="route.path"
          class="flex items-center text-gray-900 space-x-2 py-2 px-4" active-class="text-blue-500 bg-gray-200">
          <span class="material-icons text-base">{{route.icon}}</span>
          <span class="text-base">{{route.name}}</span>
        </router-link>
      </nav>
    </div>
    <!-- Main area -->
    <div class="flex-1 overflow-auto pt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useLogin } from '../composables/useLogin';
import navigation from '../navigation';

export default defineComponent({
  setup() {
    const { isLoggedIn, profile, logIn } = useLogin();

    return { isLoggedIn, profile, logIn, navigation };
  }
});
</script>
