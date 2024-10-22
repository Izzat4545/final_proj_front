<script setup lang="ts">
import { INSTRUCTIONS } from "./info/instructions";
import { useAuthStore } from "../../store/authStore";
import { computed, onMounted } from "vue";
import Carousel from "../../globalComponents/carouselComponent/Carousel.vue";
import { usePublicGiftStore } from "../../store/publicGiftsStore";
import GiftCard from "./components/GiftCard.vue";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated());
const publicGiftStore = usePublicGiftStore();
const { error, data, loading } = storeToRefs(publicGiftStore);
const { getPublicGifts } = publicGiftStore;

onMounted(() => {
  getPublicGifts();
});
</script>

<template>
  <!-- INSTRUCTIONS -->
  <div class="container mx-auto">
    <div class="bg-white p-5 rounded-lg mt-10">
      <div class="font-bold text-center mb-2 text-xl">
        How to receive a good gift?
      </div>
      <div class="flex flex-col md:flex-row justify-around gap-4 items-start">
        <div v-for="instructions in INSTRUCTIONS" :key="instructions.title">
          <div class="flex flex-col md:flex-row items-center mb-2 gap-2">
            <img :src="instructions.icon" alt="icon" />
            <div class="text-xl font-bold">{{ instructions.title }}</div>
          </div>
          <p class="text-center text-gray-500 md:text-start md:w-4/6">
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
      >
        <button
          class="bg-red-500 text-white p-3 transform transition-transform duration-500 hover:scale-110 rounded-md text-lg"
        >
          Create my wishlist
        </button>
      </router-link>
    </div>

    <!-- POPULAR GIFTS -->
    <div class="text-center my-10 text-2xl font-bold">Most Popular Gifts</div>

    <div class="flex justify-center">
      <span v-if="loading" class="loading loading-infinity loading-lg"></span>
      <div class="text-red-500" v-if="error">{{ error }}</div>
    </div>

    <Carousel
      v-if="!error && !loading && data && data.length > 0"
      :show-controls="true"
    >
      <div v-for="gift in data" :key="gift.id" class="flex-none mb-4 w-72 mx-2">
        <GiftCard :gift="gift" />
      </div>
    </Carousel>

    <div
      class="text-center"
      v-if="!error && !loading && data && data.length < 1"
    >
      No popular gifts to show
    </div>
  </div>
</template>
