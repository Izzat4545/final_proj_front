<script setup lang="ts">
import { Event as EventType } from "../../../types/events";
import { useEventsStore } from "../../../store/eventsStore";
import ShareEvent from "./ShareEvent.vue";
import { useRouter, useRoute } from "vue-router";
import { useGiftsStore } from "../../../store/giftsStore";
import { onMounted } from "vue";
import { shortenText } from "../../../utils/textShortener";
import { RoutePaths } from "../../../enums/Routes";
import defaultEventImage from "../../../assets/defaultEventImage.png";

const props = defineProps<{
  event: EventType;
}>();
const router = useRouter();
const eventsStore = useEventsStore();
const route = useRoute();
const EVENT_NAME_LIMIT = 15;
const EVENT_DESC_LIMIT = 18;

const handleDelete = async () => {
  try {
    await eventsStore.deleteEventById(props.event.id);

    await router.push(RoutePaths.EVENTS);
  } catch (error) {
    throw (error as Error).message;
  }
};

const getGiftByParams = async () => {
  try {
    if (route.params.id === props.event.id.toString()) {
      return;
    }
    await router.push(`${RoutePaths.EVENTS}/${props.event.id}`);
    if (route.params.id) {
      await useGiftsStore().getGifsByEventId(route.params.id.toString());
    }
  } catch (error) {
    throw error as Error;
  }
};

onMounted(async () => {
  if (route.params.id) {
    const eventExists = eventsStore.data.some(
      (event) => event.id.toString() === route.params.id?.toString()
    );

    if (eventExists) {
      await useGiftsStore().getGifsByEventId(route.params.id.toString());
    } else {
      await router.push(RoutePaths.EVENTS);
    }
  }
});

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = defaultEventImage;
};
</script>

<template>
  <div
    @click="getGiftByParams"
    :class="route.params.id === event.id && 'border-success'"
    class="card tooltip tooltip-right tooltip-info text-start cursor-pointer card-compact bg-base-100 border mb-4 shadow-md p-3"
    :data-tip="event.description"
  >
    <figure>
      <img
        crossorigin="anonymous"
        class="h-[130px] object-cover"
        :src="event.image"
        alt="Event Image"
        @error="handleImageError"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-[16px]">
        {{ shortenText(event.title, EVENT_NAME_LIMIT) }}
      </h2>
      <p>Event Date: {{ event.date }}</p>
      <p v-if="event.description">
        {{ shortenText(event.description, EVENT_DESC_LIMIT) }}
      </p>
      <div
        @click.stop
        class="flex gap-2 absolute top-0 right-2 transition-all flex-col mt-3"
      >
        <label :for="event.id" class="btn rounded-full btn-circle btn-sm">
          <img src="../../../assets/edit.svg" alt="Edit" />
        </label>

        <button
          @click="handleDelete"
          class="btn rounded-full btn-circle btn-sm"
        >
          <img src="../../../assets/delete.svg" alt="Delete" />
        </button>
        <!-- share -->
        <ShareEvent :event="event" />
      </div>
    </div>
  </div>
</template>
