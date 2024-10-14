<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../store/authStore";
import { computed } from "vue";
import GoogleBtn from "../components/GoogleBtn.vue";

const email = ref("");
const password = ref("");

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());

const login = async () => {
  await authStore.login(email.value, password.value);
  if (isAuthenticated && !authStore.error) {
    window.location.reload();
  }
};
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-semibold mb-6 text-center">Login</h1>
      <div class="my-2">
        <GoogleBtn />
      </div>
      <div class="text-center">Or</div>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="email"
            id="email"
            type="email"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <router-link to="/auth/reset" class="text-blue-500 hover:underline"
              >Forgot password</router-link
            >
          </div>
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          :disabled="authStore.loading"
          type="submit"
          :class="
            authStore.loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
          "
          class="w-full text-white py-2 px-4 rounded"
        >
          <div v-if="authStore.loading">Loading..</div>
          <div v-if="!authStore.loading">Login</div>
        </button>
      </form>
      <p class="mt-4 text-center">
        Don't have an account?
        <router-link to="/register" class="text-blue-500 hover:underline"
          >Register</router-link
        >
      </p>
      <div v-if="authStore.error" class="text-red-500">
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>
