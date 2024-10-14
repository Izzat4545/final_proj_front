<!-- AuthCallback.vue -->
<template>
    <div>Loading...</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../../../store/authStore';

const authStore = useAuthStore();

onMounted(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    if (token) {
        authStore.setToken(token);
        window.location.href = '/';
    }
});
</script>
