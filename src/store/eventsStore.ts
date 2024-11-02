import { defineStore } from "pinia";
import { ref } from "vue";
import { getEnv } from "../utils/getEnv";
import {
  globalDelete,
  globalGet,
  globalPost,
  globalPut,
} from "../utils/networkRequests";
import { Event } from "../types/events";
import { filterDate } from "../utils/filterDate";
import defaultEventImage from "../assets/defaultEventImage.png";
import { notify } from "@kyvg/vue3-notification";

export const useEventsStore = defineStore("events", () => {
  const loading = ref(false);
  const getError = ref<string | null>(null);
  const postError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);
  const data = ref<Event[] | []>([]);
  const singleEvent = ref<Event | null>(null);
  const BASE_URL = getEnv("VITE_BASE_URL");

  const createEvent = async (
    title: string,
    date: string,
    visibility: string,
    description?: string,
    image?: File | null
  ) => {
    postError.value = null;
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("visibility", visibility);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      const postEvent = await globalPost("events", formData, true);

      if (!postEvent || postEvent.error) {
        throw new Error(postEvent.error || "Unknown error occurred");
      }
      await getEvents();

      notify({
        title: "Event has been created",
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

      data.value = getEvents.reverse().map((event: Event) => ({
        ...event,
        image: event.image ? `${BASE_URL}/${event.image}` : defaultEventImage,
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

  const getEventById = async (id: string) => {
    loading.value = true;
    getError.value = null;
    try {
      const getEvent = await globalGet("events/" + id);

      if (!getEvent || getEvent.error) {
        throw new Error(getEvent.error || "Failed to fetch event");
      }

      singleEvent.value = {
        ...getEvent,
        image: getEvent.image
          ? `${BASE_URL}/${getEvent.image}`
          : defaultEventImage,
        date: filterDate(getEvent.date),
      };
    } catch (err) {
      getError.value = err instanceof Error ? err.message : "Fetch failed";
      console.error("Fetch Events Error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateEventById = async (
    id: string,
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

      const updateEvent = await globalPut("events/" + id, formData, true);

      if (!updateEvent || updateEvent.error) {
        throw new Error(updateEvent.error || "Unknown error occurred");
      }
      await getEvents();

      notify({
        title: "Event has been updated",
        type: "success",
      });
    } catch (err) {
      postError.value =
        err instanceof Error ? err.message : "Failed to update event";
      notify({
        title: postError.value,
        type: "error",
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteEventById = async (id: string) => {
    deleteError.value = null;
    try {
      const deleteEvent = await globalDelete("events/" + id);

      if (!deleteEvent || deleteEvent.error) {
        throw new Error(deleteEvent.error || "Failed to delete events");
      }
      data.value = data.value.filter((event) => event.id !== id);
      notify({
        title: "Event has been deleted",
        type: "success",
      });
    } catch (err) {
      deleteError.value = err instanceof Error ? err.message : "Fetch failed";
      notify({
        title: deleteError.value,
        type: "success",
      });
      throw err;
    }
  };

  return {
    data,
    singleEvent,
    loading,
    getError,
    postError,
    getEventById,
    deleteEventById,
    updateEventById,
    getEvents,
    createEvents: createEvent,
  };
});
