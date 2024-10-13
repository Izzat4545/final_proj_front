<script setup lang="ts">

</script>

<template>
    <div>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/register">Register</router-link>
            <router-link to="/login">Login</router-link>
        </nav>
        <router-view />
    </div>
</template>
