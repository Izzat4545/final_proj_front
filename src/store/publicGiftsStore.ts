import { defineStore } from "pinia";
import { ref } from "vue";
import { getEnv } from "../utils/getEnv";
import { PopularGifts } from "../types/pupularGifts";

export const usePublicGiftStore = defineStore("publicGiftStore", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<PopularGifts[] | null>(null);
  const BASE_URL = getEnv("VITE_BASE_URL");

  const GetPublicGifts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(BASE_URL + "/gifts/public", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const getPublicGiftsResult = await response.json();

      if (!response.ok) {
        error.value = getPublicGiftsResult.error;
        throw new Error(getPublicGiftsResult.error);
      }

      data.value = getPublicGiftsResult.map((gift: PopularGifts) => ({
        ...gift,
        image: gift.image
          ? `${BASE_URL}/${gift.image}`
          : `src/assets/defaultGift.jpeg`,
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
    GetPublicGifts,
  };
});
