<script setup lang="ts">
import { Notifications } from "@kyvg/vue3-notification";
import Header from "./globalComponents/Header.vue";
</script>

<template>
  <div>
    <Header />
    <router-view />
  </div>
  <Notifications position="top center" />
</template>
