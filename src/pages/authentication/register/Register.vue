<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "../../../store/authStore";
import GoogleBtn from "../components/GoogleBtn.vue";
import { RoutePaths } from "../../../enums/Routes";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const name = ref("");

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());

const register = async () => {
  await authStore.register(
    email.value,
    password.value,
    confirmPassword.value,
    name.value
  );
  if (isAuthenticated && !authStore.error) {
    window.location.reload();
  }
};
</script>
<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-semibold mb-6 text-center">Register</h1>
      <div class="my-2">
        <GoogleBtn />
      </div>
      <div class="text-center">Or</div>
      <form @submit.prevent="register">
        <!-- Form fields for name, email, password, confirm password -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            v-model="name"
            id="name"
            type="text"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email *</label
          >
          <input
            v-model="email"
            id="email"
            type="email"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password *</label
          >
          <input
            v-model="password"
            id="password"
            type="password"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div class="mb-6">
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password *</label
          >
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            type="password"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          :class="
            authStore.loading
              ? 'bg-gray-500 btn-disabled'
              : 'bg-blue-500 hover:bg-blue-600'
          "
          class="w-full btn text-white flex items-center gap-2 rounded"
        >
          <span
            v-if="authStore.loading"
            class="loading loading-spinner loading-sm"
          ></span>
          <div>Register</div>
        </button>
      </form>
      <p class="my-4 text-center">
        Already have an account?
        <router-link
          :to="RoutePaths.LOGIN"
          class="text-blue-500 hover:underline"
          >Login</router-link
        >
      </p>
      <div
        v-if="authStore.error"
        class="p-4 text-red-800 bg-red-100 rounded-lg"
      >
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>
