<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../store/authStore';
import { computed } from 'vue';

const email = ref('');
const password = ref('');

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated())

const login = async () => {
    await authStore.login(email.value, password.value);
    if (isAuthenticated) {
        window.location.reload()
    }
};
</script>

<template>
    <div class="min-h-screen flex justify-center items-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 class="text-2xl font-semibold mb-6 text-center">Login</h1>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input v-model="email" id="email" type="email"
                        class="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" id="password" type="password"
                        class="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Login
                </button>
            </form>
            <p class="mt-4 text-center">
                Don't have an account?
                <router-link to="/register" class="text-blue-500 hover:underline">Register</router-link>
            </p>
            <div v-if="authStore.error" class="text-red-500">{{ authStore.error }}</div>
        </div>
    </div>
</template>