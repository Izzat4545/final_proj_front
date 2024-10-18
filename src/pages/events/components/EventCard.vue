<script setup lang="ts">
import { Events } from "../../../types/events";
import { useEventsStore } from "../../../store/eventsStore";
import ShareEvent from "./ShareEvent.vue";

const props = defineProps<{
  event: Events;
}>();

const eventsStore = useEventsStore();
const handleDelete = async () => {
  try {
    await eventsStore.deleteEventById(props.event.id);
  } catch (error) {
    throw (error as Error).message;
  }
};
</script>

<template>
  <div
    class="card cursor-pointer card-compact bg-base-100 border mb-3 shadow-md p-3"
  >
    <figure>
      <img
        crossorigin="anonymous"
        class="h-[130px] object-cover"
        :src="event.image"
        alt="Event Image"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-[16px]">{{ event.title }}</h2>
      <p>Event Date: {{ event.date }}</p>
      <div
        class="flex gap-2 absolute top-0 right-2 transition-all flex-col mt-3"
      >
        <label
          :for="event.id"
          class="btn rounded-full btn-ghost btn-circle btn-sm"
        >
          <img src="../../../assets/edit.svg" alt="Edit" />
        </label>

        <button
          @click="handleDelete"
          class="btn rounded-full btn-ghost btn-circle btn-sm"
        >
          <img src="../../../assets/delete.svg" alt="Delete" />
        </button>
        <!-- share -->
        <ShareEvent :event="event" />
      </div>
    </div>
  </div>
</template>
