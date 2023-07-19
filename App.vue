<template>
  <div class="h-screen flex overflow-hidden bg-white">
    <Spinner class="my-6 mx-auto" v-if="loading" />
    <template v-else>
      <div class="flex flex-col md:w-64 border-r border-gray-200 pb-4 bg-white">
        <nav class="pt-2 flex-1 space-y-1">
          <router-link
            v-for="route in enabledRoutes"
            :to="route.path"
            class="flex items-center text-gray-900 space-x-2 py-2 px-4"
            active-class="text-blue-500 bg-gray-200"
          >
            <span class="material-icons">{{ route.icon }}</span>
            <span class="text-base hidden md:block">{{ route.name }}</span>
          </router-link>
        </nav>
        <button
          v-if="authHost && isLoggedIn"
          class="bg-gray-100 text-sm px-4 py-2 shadow-md flex items-center mx-auto"
          @click="logout()"
        >
          <span class="material-icons">logout</span>
          <span class="hidden md:inline">Logout</span>
        </button>
        <button
          v-if="authHost && !isLoggedIn"
          class="bg-blue-500 text-white text-sm px-4 py-2 shadow-md flex items-center mx-auto"
          @click="goToLogin()"
        >
          <span class="material-icons">person</span>
          <span class="hidden md:inline">Sign in</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto shadow-lg">
        <Error v-if="error" :error="error.message" />
        <router-view></router-view>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Error from "./components/ui/Error.vue";
import Spinner from "./components/ui/Spinner.vue";
import { useAuth } from "./composables/useAuth";
import { useCommands } from "./composables/useCommands";
import { useEnv } from "./composables/useEnv";
import { useRouter } from "./composables/useRouter";

const { isLoggedIn, logout, goToLogin, ready } = useAuth();
const { error, fetchCommands } = useCommands();
const { topPages } = useRouter();
const { authHost } = useEnv();

const enabledRoutes = computed(() => {
  const auth = isLoggedIn.value;

  return topPages.filter((r) => {
    const showProtected = !r.protected || auth;

    return showProtected;
  });
});

const loading = ref(true);

ready.then(() => {
  if (authHost.value) {
    fetchCommands();
  }

  loading.value = false;
});
</script>
