<script lang="ts" setup>
import { useGiftsStore } from "../store/giftsStore";
import { Gift } from "../types/gifts";
import { formatNumbers } from "../utils/formatNumbers";
import { shortenText } from "../utils/textShortener";

defineProps<{ gifts: Gift; isPublic: boolean }>();

const { deleteGiftById } = useGiftsStore();

const handleDelete = async (giftId: string, eventId: string) => {
  await deleteGiftById(giftId, eventId);
};
</script>
<template>
  <div class="flex flex-row justify-center sm:flex-col mt-3 gap-5">
    <div v-for="gift in gifts.gifts"
      class="bg-white rounded-lg relative shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
      <div class="flex gap-2 flex-col sm:flex-row items-center">
        <img crossorigin="anonymous" :src="gift.image" alt="gift image"
          class="w-full h-48 object-cover rounded-lg mb-4" />
        <div class="w-full">
          <h3 class="text-lg font-semibold mb-2">
            {{ shortenText(gift.name, 25) }}
          </h3>
          <p class="text-gray-600 text-sm mb-2">
            {{ shortenText(gift.description) }}
          </p>
        </div>
      </div>
      <div>
        <!-- Reserve btn if it is public -->
        <div class="flex flex-col w-full max-w-xs sm:max-w-[170px]">
          <p class="text-xl font-bold">
            {{ formatNumbers(gift.price) }} {{ gift.currency }}
          </p>
          <label v-if="isPublic" :for="gift.id" :class="gift.reservedEmail ? 'btn-disabled' : 'btn-success'"
            class="btn rounded w-full text-white btn-sm">
            {{ gift.reservedEmail ? "reserved" : "reserve" }}
          </label>
          <a :href="gift.link" target="_blank"
            class="bg-blue-500 btn btn-sm w-full text-white rounded hover:bg-blue-600 transition-colors my-2">
            Buy in Store
          </a>
        </div>
        <!-- edit and delete -->
        <div v-if="!isPublic" class="flex gap-3 transition-all">
          <label :for="gift.id" class="btn rounded-full btn-ghost btn-circle btn-sm">
            <img src="../assets/edit.svg" alt="Edit" />
          </label>
          <button @click="handleDelete(gift.id, gift.eventId)" class="btn rounded-full btn-ghost btn-circle btn-sm">
            <img src="../assets/delete.svg" alt="Delete" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
