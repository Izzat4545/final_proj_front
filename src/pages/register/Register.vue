<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../../store/authStore';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated())

const register = async () => {
    await authStore.register(email.value, password.value, confirmPassword.value, name.value);
    if (isAuthenticated) {
        window.location.reload()
    }
};

</script>
<template>
    <div class="min-h-screen flex justify-center items-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 class="text-2xl font-semibold mb-6 text-center">Register</h1>
            <form @submit.prevent="register">
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input v-model="name" id="name" type="text"
                        class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input v-model="email" id="email" type="email"
                        class="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="password" id="password" type="password"
                        class="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                </div>
                <div class="mb-6">
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm
                        Password</label>
                    <input v-model="confirmPassword" id="confirmPassword" type="password"
                        class="w-full mt-1 p-2 border border-gray-300 rounded-md" required />
                </div>
                <button :disabled="authStore.loading" type="submit"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    <div v-if="authStore.loading">Loading..</div>
                    <div v-if="!authStore.loading">Register</div>
                </button>
            </form>
            <p class="mt-4 text-center">
                Already have an account?
                <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
            </p>
            <div v-if="authStore.error" class="text-red-500">{{ authStore.error }}</div>
        </div>
    </div>
</template>