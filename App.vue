<template>
  <div class="relative">
    <div class="absolute z-50 right-0 top-0">
      <button
        v-if="authHost && isLoggedIn"
        class="bg-gray-300 text-sm px-4 py-2"
        @click="logout()"
      >
        Logout
      </button>
      <button
        v-if="authHost && !isLoggedIn"
        class="bg-blue-500 text-sm px-4 py-2"
        @click="goToLogin()"
      >
        Sign in
      </button>
    </div>

    <div class="h-screen flex overflow-hidden bg-white">
      <div class="flex flex-col md:w-64 border-r border-gray-200 pb-4 bg-white">
        <nav class="mt-5 flex-1 space-y-1">
          <router-link
            v-for="route in enabledRoutes"
            :to="route.path"
            class="flex items-center text-gray-900 space-x-2 py-2 px-4"
            active-class="text-blue-500 bg-gray-200"
          >
            <span class="material-icons text-base">{{ route.icon }}</span>
            <span class="text-base hidden md:block">{{ route.name }}</span>
          </router-link>
        </nav>
      </div>

      <div class="flex-1 overflow-auto pt-4">
        <router-view></router-view>
        <Error v-if="error" :error="error.message" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { unref, onMounted, computed } from "vue";
import Error from "./components/ui/Error.vue";
import { useLogin } from "./composables/useLogin";
import { useCommands } from "./composables/useCommands";
import { useSettings } from "./composables/useSettings";
import { useRouter } from "./composables/useRouter";

const { isLoggedIn, logout, goToLogin } = useLogin();
const { error, fetchCommands } = useCommands();
const { topPages } = useRouter();
const { authHost } = useSettings();

const enabledRoutes = computed(() => {
  const auth = unref(isLoggedIn);

  return topPages.filter((r) => {
    const showProtected = !r.protected || auth;

    return showProtected;
  });
});

onMounted(() => {
  if (unref(authHost)) {
    fetchCommands();
  }
});
</script>
