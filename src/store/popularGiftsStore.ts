import { defineStore } from "pinia";
import { ref } from "vue";
import { getEnv } from "../utils/getEnv";
import { PopularGift } from "../types/pupularGifts";
import { globalGet } from "../utils/networkRequests";
import defaultGift from "../assets/defaultGift.jpeg";

export const usePublicGiftStore = defineStore("publicGiftStore", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<PopularGift[] | []>([]);
  const BASE_URL = getEnv("VITE_BASE_URL");

  const getPublicGifts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const getPublicGiftsResult = await globalGet("gifts/popular");

      if (getPublicGiftsResult.error) {
        error.value = getPublicGiftsResult.error;
        throw new Error(getPublicGiftsResult.error);
      }
      data.value = getPublicGiftsResult.map((gift: PopularGift) => ({
        ...gift,
        image: gift.image ? `${BASE_URL}/${gift.image}` : defaultGift,
      }));
    } catch (err) {
      error.value = (err as Error).message || "Fetch failed";
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    error,
    getPublicGifts,
  };
});
