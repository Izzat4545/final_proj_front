<script setup lang="ts">
import { getEnv } from "../../../utils/getEnv";

const googleSignIn = () => {
  const googleAuthUrl = `${getEnv("VITE_BASE_URL")}/auth/google`;
  window.location.href = googleAuthUrl;
};
</script>
<template>
  <button
    @click="googleSignIn"
    class="w-full flex items-center justify-center gap-2 border rounded-lg py-2"
  >
    <img class="size-8" src="../../../assets/google.svg" alt="" />
    Sign in with Google
  </button>
</template>
