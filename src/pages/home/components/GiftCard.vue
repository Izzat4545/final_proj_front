<script lang="ts" setup>
import { PopularGift } from "../../../types/pupularGifts";
import { formatNumbers } from "../../../utils/formatNumbers";
import { shortenText } from "../../../utils/textShortener";
defineProps<{
  gift: PopularGift;
}>();

</script>
<template>
  <div class="bg-white h-full rounded-lg shadow-md p-4 flex flex-col items-start">
    <img crossorigin="anonymous" :src="gift.image" alt="gift image" class="w-full h-48 object-cover rounded-lg mb-4" />
    <h3 class="text-lg font-semibold mb-2">{{ shortenText(gift.name, 15) }}</h3>
    <p class="text-gray-600 text-sm mb-2">{{ shortenText(gift.description, 30) }}</p>
    <a :href="gift.link" target="_blank"
      class="bg-blue-500 btn btn-sm text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors mb-2">
      Buy in Store
    </a>
    <p class="text-xl font-bold">{{ formatNumbers(gift.price) }} {{ gift.currency }}</p>
  </div>
</template>
