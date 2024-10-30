<script setup lang="ts">
import { RoutePaths } from "../../enums/Routes";
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4"
  >
    <!-- 404 Error Text -->
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p class="text-xl text-gray-600 mb-6">
      Oops! The page you're looking for doesn't exist.
    </p>
    <router-link
      :to="RoutePaths.HOME"
      class="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
    >
      Go Back Home
    </router-link>
  </div>
</template>
