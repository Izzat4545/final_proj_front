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
import { PaginationConfig } from "../enums/PaginationConfig";
import { notify } from "@kyvg/vue3-notification";

export const useGiftsStore = defineStore("gifts", () => {
  const loading = ref(false);
  const getError = ref<string | null>(null);
  const postError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);
  const data = ref<Gift>({
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
    category: string,
    description?: string,
    image?: File | null
  ) => {
    postError.value = null;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("currency", currency);
      formData.append("link", link);
      formData.append("price", price);
      formData.append("category", category);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      const postGift = await globalPost("gifts/" + eventId, formData, true);

      if (!postGift || postGift.error) {
        throw new Error(postGift.error || "Unknown error occurred");
      }
      await getGifsByEventId(eventId);

      notify({
        title: "Gift has been created",
        type: "success",
      });
    } catch (err) {
      postError.value =
        err instanceof Error ? err.message : "Failed to create event";

      notify({
        title: postError.value,
        type: "error",
      });
      throw err;
    }
  };

  const getGifsByEventId = async (
    eventId: string,
    category?: string,
    page: number = PaginationConfig.INITIAL_PAGE,
    limit: number = PaginationConfig.PAGE_LIMIT
  ) => {
    loading.value = true;
    getError.value = null;

    try {
      const getGifts = await globalGet(`gifts/${eventId}`, {
        page,
        limit,
        ...(category ? { category } : {}),
      });

      if (!getGifts || getGifts.error) {
        throw new Error(getGifts.error || "Failed to fetch gifts");
      }

      data.value = {
        meta: getGifts.meta,
        data: getGifts.data.reverse().map((gift: PopularGift) => ({
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
    category: string,
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
      formData.append("category", category);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      const updateGift = await globalPut("gifts/" + giftId, formData, true);

      if (!updateGift || updateGift.error) {
        throw new Error(updateGift.error || "Unknown error occurred");
      }
      await getGifsByEventId(eventId);

      notify({
        title: "Gift has been updated",
        type: "success",
      });
    } catch (err) {
      postError.value =
        err instanceof Error ? err.message : "Failed to update gift";

      notify({
        title: postError.value,
        type: "error",
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteGiftById = async (giftId: string) => {
    deleteError.value = null;
    try {
      const deleteGift = await globalDelete("gifts/" + giftId);
      if (!deleteGift || deleteGift.error) {
        throw new Error(deleteGift.error || "Failed to delete gift");
      }
      data.value.data = data.value.data.filter((gift) => gift.id !== giftId);
      notify({
        title: "Gift has been deleted",
        type: "success",
      });
    } catch (err) {
      deleteError.value = err instanceof Error ? err.message : "Fetch failed";
      notify({
        title: deleteError.value,
        type: "error",
      });
      throw err;
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

      notify({
        title: "Gift has been reserved",
        type: "success",
      });
    } catch (err) {
      postError.value = err instanceof Error ? err.message : "Fetch failed";

      notify({
        title: postError.value,
        type: "error",
      });
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

      notify({
        title: "Gift has been claimed",
        type: "success",
      });
    } catch (err) {
      postError.value = err instanceof Error ? err.message : "Post failed";

      notify({
        title: postError.value,
        type: "success",
      });
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
