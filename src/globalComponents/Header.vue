<script setup lang="ts">
import { useAuthStore } from "../store/authStore";
import { computed } from "vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());
const user = computed(() => authStore.user);

const logout = () => {
  authStore.logout();
  window.location.reload();
};
</script>
<template>
  <header class="bg-white shadow">
    <div class="container mx-auto flex justify-between items-center p-4">
      <div class="flex items-center">
        <router-link to="/" class="flex items-center">
          <span class="text-2xl font-bold"
            >Gift<span class="text-red-500">Me</span></span
          >
        </router-link>
      </div>
      <nav class="flex items-center space-x-4">
        <template v-if="!isAuthenticated">
          <router-link to="/login" class="text-gray-700 hover:text-blue-500"
            >Login</router-link
          >
          <router-link to="/register" class="text-gray-700 hover:text-blue-500"
            >Register</router-link
          >
        </template>
        <template v-else>
          <span class="text-gray-700">{{ user?.name }}</span>
          <router-link to="/events" class="text-gray-700 hover:text-blue-500"
            >Events</router-link
          >
          <router-link to="/settings" class="text-gray-700 hover:text-blue-500"
            >Settings</router-link
          >
          <button @click="logout" class="text-gray-700 hover:text-blue-500">
            Logout
          </button>
        </template>
      </nav>
    </div>
  </header>
</template>
