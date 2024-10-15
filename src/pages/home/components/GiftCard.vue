<script lang="ts" setup>
import { PopularGifts } from "../../../types/pupularGifts";
defineProps<{
  gift: PopularGifts;
}>();
</script>
<template>
  <div class="bg-white rounded-lg shadow-md p-4 flex flex-col items-start">
    <img
      crossorigin="anonymous"
      :src="gift.image"
      alt="gift image"
      class="w-full h-48 object-cover rounded-lg mb-4"
    />
    <h3 class="text-lg font-semibold mb-2">{{ gift.name }}</h3>
    <a
      :href="gift.link"
      target="_blank"
      class="bg-blue-500 btn text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-2"
    >
      Buy in Store
    </a>
    <p class="text-gray-600 text-sm mb-2">{{ gift.description }}</p>
    <p class="text-xl font-bold">{{ gift.price }} {{ gift.currency }}</p>
  </div>
</template>
