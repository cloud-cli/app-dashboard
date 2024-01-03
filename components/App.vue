<template>
  <div class="h-screen flex overflow-hidden bg-white">
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
        <button
          v-if="isLoggedIn"
          class="flex items-center text-gray-900 space-x-2 py-2 px-4"
          @click="signOut()"
        >
          <span class="material-icons">logout</span>
          <span class="text-base hidden md:block">Logout</span>
        </button>
        <button
          v-else
          class="flex items-center text-gray-900 space-x-2 py-2 px-4"
          @click="signIn()"
        >
          <span class="material-icons">person</span>
          <span class="text-base hidden md:block">Sign in</span>
        </button>
      </nav>
    </div>

    <div class="flex-1 overflow-y-auto shadow-lg">
      <Error v-if="error" :error="error.message" />
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "../composables/useAuth";
import { useCommands } from "../composables/useCommands";
import { useRouter } from "../composables/useRouter";
import Error from "./ui/Error.vue";

const { isLoggedIn, signOut, signIn } = useAuth();
const { error } = useCommands();
const { topPages } = useRouter();

const enabledRoutes = computed(() => {
  const auth = isLoggedIn.value;

  return topPages.filter((r) => !r.protected || auth);
});
</script>
