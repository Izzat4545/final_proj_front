import { defineStore } from "pinia";
import { ref } from "vue";
import { getEnv } from "../utils/getEnv";
import { globalGet, globalPost } from "../utils/networkRequests";
import { Events } from "../types/events";
import { filterDate } from "../utils/filterDate";

export const useEventsStore = defineStore("events", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
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
    error.value = null;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("visibility", visibility);

      if (description) formData.append("description", description);

      if (image) formData.append("image", image);

      const postEvents = await globalPost("events", formData, true);

      if (postEvents.error) {
        error.value = postEvents.error;
        throw new Error(postEvents.error);
      }

      data.value = postEvents.map((event: Events) => ({
        ...event,
        image: event.image
          ? `${BASE_URL}/${event.image}`
          : `src/assets/defaultEventImage.png`,
      }));
    } catch (err) {
      error.value = (err as Error).message || "Failed to create event";
    } finally {
      loading.value = false;
    }
  };

  const getEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      const getEvents = await globalGet("events");

      if (getEvents.error) {
        error.value = getEvents.error;
        throw new Error(getEvents.error);
      }
      data.value = getEvents.map((event: Events) => ({
        ...event,
        image: event.image
          ? `${BASE_URL}/${event.image}`
          : `src/assets/defaultEventImage.png`,
        date: filterDate(event.date),
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
    getEvents,
    createEvents,
  };
});
