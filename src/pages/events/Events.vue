<script setup lang="ts">
import EventCard from "./components/EventCard.vue";
import Carousel from "../../globalComponents/carouselComponent/Carousel.vue";
import EventModal from "./components/EventModal.vue";
import { useEventsStore } from "../../store/eventsStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const eventStore = useEventsStore();

const { getError, data, loading } = storeToRefs(eventStore);

onMounted(async () => {
  await eventStore.getEvents();
});
</script>
<template>
  <div class="container mx-auto">
    <div class="flex justify-between">
      <div class="text-2xl mb-3 font-bold">Events</div>
      <button
        class="text-md btn btn-success mb-3 text-white"
        onclick="globalModal.showModal()"
      >
        Add event
      </button>
    </div>

    <!-- Events -->
    <div class="flex justify-center">
      <span v-if="loading" class="loading loading-infinity loading-lg"></span>
      <div class="text-red-500" v-if="getError">{{ getError }}</div>
    </div>
    <Carousel
      v-if="!loading && data.length > 0 && !getError"
      :show-controls="false"
    >
      <div v-for="event in data" class="embla__slide">
        <EventCard :event="event" />
      </div>
    </Carousel>
    <EventModal />
  </div>
</template>

<style scoped>
.embla__slide {
  flex: 0 0 230px;
  margin: 0 10px;
}
</style>
