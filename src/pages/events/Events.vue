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
      <label for="createModal" class="text-md btn btn-success mb-3 text-white"
        >Add event</label
      >
    </div>

    <!-- Events -->
    <div class="flex justify-center">
      <span v-if="loading" class="loading loading-infinity loading-lg"></span>
      <div v-if="getError" class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg">
        {{ getError }}
      </div>
      <div
        v-if="data.length < 1 && !getError"
        class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg"
      >
        No events has been added
      </div>
    </div>
    <Carousel v-if="!loading && data.length > 0 && !getError">
      <div v-for="event in data" class="embla__slide">
        <EventCard :event="event" />
      </div>
    </Carousel>
    <div v-for="event in data">
      <EventModal :event="event" />
    </div>
    <EventModal />
  </div>
</template>

<style scoped>
.embla__slide {
  flex: 0 0 230px;
  margin: 0 10px;
}
</style>
