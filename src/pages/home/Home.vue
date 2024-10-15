<script setup lang="ts">
import { INSTRCTIONS } from "./info/instructions";
import { useAuthStore } from "../../store/authStore";
import { computed } from "vue";
import PopularGiftCarousel from "./components/carouselStuff/PopularGiftCarousel.vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());
</script>
<template>
  <!-- INSTRUCTIONS -->
  <div class="container m-auto">
    <div class="bg-white p-5 rounded-lg mt-10">
      <div class="font-bold text-center mb-2 text-xl">
        How to receive a good gift?
      </div>
      <div class="flex flex-col md:flex-row justify-around gap-4 items-start">
        <div v-for="instructions in INSTRCTIONS">
          <div class="flex flex-col md:flex-row items-center mb-2 gap-2">
            <img :src="instructions.icon" alt="icon" />
            <div class="text-xl font-bold">{{ instructions.title }}</div>
          </div>
          <p class="text-center text-gray-500 md:text-start md:w-[70%]">
            {{ instructions.description }}
          </p>
        </div>
      </div>
    </div>
    <!-- CREATE WISHLIST BTN -->
    <div class="flex justify-center mt-5">
      <router-link
        :to="isAuthenticated ? '/events' : '/register'"
        class="text-gray-700 hover:text-blue-500"
        ><button
          class="bg-red-500 text-white p-3 scale-button rounded-md text-lg"
        >
          Create my wishlist
        </button></router-link
      >
    </div>
    <!-- POPULAR GIFTS -->
    <div class="text-center my-10 text-2xl font-bold">Most Popular Gifts</div>
    <div class="relative">
      <PopularGiftCarousel />
    </div>
  </div>
</template>

<style scoped>
.scale-button {
  transition: transform 0.5s ease;
  animation: scaleAnimation 2s infinite ease-in-out;
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
