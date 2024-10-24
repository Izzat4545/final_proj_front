import { defineStore } from "pinia";
import { ref } from "vue";
import { getEnv } from "../utils/getEnv";
import { Gift } from "../types/gifts";
import {
  globalDelete,
  globalGet,
  globalPost,
  globalPut,
} from "../utils/networkRequests";
import { PopularGift } from "../types/pupularGifts";
import defaultGift from "../assets/defaultGift.jpeg";
import defaultEventImage from "../assets/defaultEventImage.png";
import { filterDate } from "../utils/filterDate";
import { PaginationConfig } from "../enums/PaginationConfig";

export const useGiftsStore = defineStore("gifts", () => {
  const loading = ref(false);
  const getError = ref<string | null>(null);
  const postError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);
  const data = ref<Gift>({
    giftCount: 0,
    giftReservedCount: 0,
    meta: { limit: 10, page: 1, totalGifts: 0, totalPages: 1 },
    data: [],
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

  const getGifsByEventId = async (
    eventId: string,
    page: number = PaginationConfig.INITIAL_PAGE,
    limit: number = PaginationConfig.PAGE_LIMIT
  ) => {
    loading.value = true;
    getError.value = null;

    try {
      const getGifts = await globalGet(`gifts/${eventId}`, { page, limit });

      if (!getGifts || getGifts.error) {
        throw new Error(getGifts.error || "Failed to fetch gifts");
      }

      data.value = {
        giftCount: getGifts.giftCount,
        giftReservedCount: getGifts.giftReservedCount,
        meta: getGifts.meta,
        data: getGifts.data.map((gift: PopularGift) => ({
          ...gift,
          image: gift.image ? `${BASE_URL}/${gift.image}` : defaultGift,
          event: {
            ...gift.event,
            image: gift.event.image
              ? `${BASE_URL}/${gift.image}`
              : defaultEventImage,
            date: filterDate(gift.event.date),
          },
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
      const deleteGift = await globalDelete("gifts/" + giftId);
      if (!deleteGift || deleteGift.error) {
        throw new Error(deleteGift.error || "Failed to delete gift");
      }
      await getGifsByEventId(eventId);
    } catch (err) {
      deleteError.value = err instanceof Error ? err.message : "Fetch failed";
      console.error("Delete Gift Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const reserveGiftByEmail = async (
    email: string,
    giftId: string,
    eventId: string
  ) => {
    loading.value = true;
    postError.value = null;
    try {
      const reserveGift = await globalPut("gifts/reservation/" + giftId, {
        email,
      });
      if (!reserveGift || reserveGift.error) {
        throw new Error(reserveGift.error || "Failed to update gift");
      }
      await getGifsByEventId(eventId);
    } catch (err) {
      postError.value = err instanceof Error ? err.message : "Fetch failed";
      console.error("Update Gift Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const claimGift = async (giftId: string, targetEventId: string) => {
    loading.value = true;
    postError.value = null;
    try {
      const addedGift = await globalPost("gifts/popular", {
        giftId,
        targetEventId,
      });
      if (!addedGift || addedGift.error) {
        throw new Error(addedGift.error || "Failed to add gift to an event");
      }
    } catch (err) {
      postError.value = err instanceof Error ? err.message : "Post failed";
      console.error("Post Gift Error:", err);
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
    claimGift,
    deleteGiftById,
    createGift,
    getGifsByEventId,
    updateGiftById,
    reserveGiftByEmail,
  };
});
