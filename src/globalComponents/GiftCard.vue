<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useGiftsStore } from "../store/giftsStore";
import { PopularGift } from "../types/pupularGifts";
import { formatNumbers } from "../utils/formatNumbers";
import { shortenText } from "../utils/textShortener";
import { useAuthStore } from "../store/authStore";
import { storeToRefs } from "pinia";
import { useSettings } from "../store/settingsStore";
import defaultImage from "../assets/defaultGift.jpeg";

defineProps<{ gift: PopularGift; isPublic: boolean }>();

const { deleteGiftById } = useGiftsStore();
const useAuthstore = useAuthStore();
const handleDelete = async (giftId: string) => {
  await deleteGiftById(giftId);
};
const isAuthenticated = useAuthstore.isAuthenticated();
const route = useRoute();
const settingStore = useSettings();
const { data: settingsData } = storeToRefs(settingStore);

const GIFT_NAME_LIMIT = 15;
const GIFT_DESC_LIMIT = 30;

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = defaultImage;
};
</script>
<template>
  <div class="rounded-lg bg-white w-full relative shadow-md p-4 flex flex-col">
    <img crossorigin="anonymous" :src="gift.image || defaultImage" alt="gift image"
      class="size-[250px] mx-auto object-cover rounded-lg mb-2" @error="handleImageError" />
    <h3 class="text-lg font-semibold mb-1">
      {{ shortenText(gift.name, GIFT_NAME_LIMIT) }}
    </h3>
    <p v-if="gift.description" class="text-gray-600 mb-1 text-sm">
      {{ shortenText(gift.description, GIFT_DESC_LIMIT) }}
    </p>
    <!-- Reserve btn if it is public -->
    <label v-if="isPublic && route.params.id && settingsData?.id !== gift.userId" :for="gift.id"
      :class="gift.reservedEmail ? 'btn-disabled' : 'btn-success'" class="btn rounded mb-2 w-full text-white btn-sm">
      {{ gift.reservedEmail ? "reserved" : "reserve" }}
    </label>
    <!-- Claim btn if user is registered and doesnt own the gift -->
    <label v-if="
      isPublic &&
      isAuthenticated &&
      gift.userId &&
      settingsData?.id !== gift.userId
    " :for="gift.id + 'claim'" class="btn btn-success rounded w-full text-white btn-sm">
      Claim
    </label>
    <a :href="gift.link" target="_blank" class="w-full underline text-gray-500 my-2">
      Buy in Store
    </a>
    <p class="text-xl font-bold">
      {{ formatNumbers(gift.price) }} {{ gift.currency }}
    </p>
    <!-- edit and delete -->
    <div v-if="!isPublic" class="flex gap-2 absolute top-0 right-2 transition-all flex-col mt-3">
      <label :for="gift.id" class="btn rounded-full btn-circle btn-sm">
        <img src="../assets/edit.svg" alt="Edit" />
      </label>
      <button @click="handleDelete(gift.id)" class="btn rounded-full btn-circle btn-sm">
        <img src="../assets/delete.svg" alt="Delete" />
      </button>
    </div>
  </div>
</template>
