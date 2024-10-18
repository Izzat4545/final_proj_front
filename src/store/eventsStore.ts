import { defineStore } from "pinia";
import { ref } from "vue";
import { getEnv } from "../utils/getEnv";
import { globalDelete, globalGet, globalPost } from "../utils/networkRequests";
import { Events } from "../types/events";
import { filterDate } from "../utils/filterDate";

export const useEventsStore = defineStore("events", () => {
  const loading = ref(false);
  const getError = ref<string | null>(null);
  const postError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);
  const data = ref<Events[] | []>([]);
  const BASE_URL = getEnv("VITE_BASE_URL");

  const createEvents = async (
    title: string,
    date: string,
    visibility: string,
    description?: string,
    image?: File | null
  ) => {
    loading.value = true;
    postError.value = null;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("visibility", visibility);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      const postEvents = await globalPost("events", formData, true);

      if (!postEvents || postEvents.error) {
        throw new Error(postEvents.error || "Unknown error occurred");
      }
      await getEvents();
    } catch (err) {
      postError.value =
        err instanceof Error ? err.message : "Failed to create event";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getEvents = async () => {
    loading.value = true;
    getError.value = null;
    try {
      const getEvents = await globalGet("events");

      if (!getEvents || getEvents.error) {
        throw new Error(getEvents.error || "Failed to fetch events");
      }

      data.value = getEvents.reverse().map((event: Events) => ({
        ...event,
        image: event.image
          ? `${BASE_URL}/${event.image}`
          : `src/assets/defaultEventImage.png`,
        date: filterDate(event.date),
      }));
    } catch (err) {
      getError.value = err instanceof Error ? err.message : "Fetch failed";
      console.error("Fetch Events Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteEventById = async (id: string) => {
    loading.value = true;
    deleteError.value = null;
    try {
      const deleteEvents = await globalDelete("events/" + id);

      if (!deleteEvents || deleteEvents.error) {
        throw new Error(deleteEvents.error || "Failed to delete events");
      }

      data.value = data.value.filter((event: Events) => event.id !== id);
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
    getError,
    postError,
    deleteEventById,
    getEvents,
    createEvents,
  };
});