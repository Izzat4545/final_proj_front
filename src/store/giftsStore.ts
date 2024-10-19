import { defineStore } from "pinia";
import { ref } from "vue";
import { getEnv } from "../utils/getEnv";
import { Gifts } from "../types/gifts";
import {
  globalDelete,
  globalGet,
  globalPost,
  globalPut,
} from "../utils/networkRequests";
import { PopularGifts } from "../types/pupularGifts";
import defaultGift from "../assets/defaultGift.jpeg";

export const useGiftsStore = defineStore("gifts", () => {
  const loading = ref(false);
  const getError = ref<string | null>(null);
  const postError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);
  const data = ref<Gifts>({
    giftCount: 0,
    giftReservedCount: 0,
    gifts: [],
  });
  const BASE_URL = getEnv("VITE_BASE_URL");

  const createGift = async (
    eventId: string,
    name: string,
    price: string,
    currency: string,
    link: string,
    description?: string,
    image?: File | null
  ) => {
    loading.value = true;
    postError.value = null;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("currency", currency);
      formData.append("link", link);
      formData.append("price", price);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      const postGift = await globalPost("gifts/" + eventId, formData, true);

      if (!postGift || postGift.error) {
        throw new Error(postGift.error || "Unknown error occurred");
      }
      await getGifsByEventId(eventId);
    } catch (err) {
      postError.value =
        err instanceof Error ? err.message : "Failed to create event";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getGifsByEventId = async (eventId: string) => {
    loading.value = true;
    getError.value = null;

    try {
      const getGifts = await globalGet(`gifts/${eventId}`);

      if (!getGifts || getGifts.error) {
        throw new Error(getGifts.error || "Failed to fetch gifts");
      }

      data.value = {
        giftCount: getGifts.giftCount,
        giftReservedCount: getGifts.giftReservedCount,
        gifts: getGifts.gifts.map((gift: PopularGifts) => ({
          ...gift,
          image: gift.image ? `${BASE_URL}/${gift.image}` : defaultGift,
        })),
      };
    } catch (err) {
      getError.value = err instanceof Error ? err.message : "Fetch failed";
      console.error("Fetch Gifts Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateGiftById = async (
    eventId: string,
    giftId: string,
    name: string,
    price: string,
    currency: string,
    link: string,
    description?: string,
    image?: File | null
  ) => {
    loading.value = true;
    postError.value = null;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("currency", currency);
      formData.append("link", link);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      const updateGift = await globalPut("gifts/" + giftId, formData, true);

      if (!updateGift || updateGift.error) {
        throw new Error(updateGift.error || "Unknown error occurred");
      }
      await getGifsByEventId(eventId);
    } catch (err) {
      postError.value =
        err instanceof Error ? err.message : "Failed to update gift";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteGiftById = async (giftId: string, eventId: string) => {
    loading.value = true;
    deleteError.value = null;
    try {
      const deleteEvents = await globalDelete("gifts/" + giftId);
      if (!deleteEvents || deleteEvents.error) {
        throw new Error(deleteEvents.error || "Failed to delete events");
      }
      await getGifsByEventId(eventId);
    } catch (err) {
      deleteError.value = err instanceof Error ? err.message : "Fetch failed";
      console.error("Fetch Events Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    loading,
    postError,
    getError,
    deleteGiftById,
    createGift,
    getGifsByEventId,
    updateGiftById,
  };
});
