<script setup lang="ts">
import EventCard from "./components/EventCard.vue";
import Carousel from "../../globalComponents/carouselComponent/Carousel.vue";
import EventModal from "./components/EventModal.vue";
import { useEventsStore } from "../../store/eventsStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGiftsStore } from "../../store/giftsStore";
import GiftCard from "../../globalComponents/GiftCard.vue";
import GiftModal from "../gifts/components/GiftModal.vue";


const eventStore = useEventsStore();
const giftsStore = useGiftsStore()
const route = useRoute()

const { data: giftData, getError: giftGetError, loading: giftLoading } = storeToRefs(giftsStore)
const { getError, data, loading } = storeToRefs(eventStore);

onMounted(async () => {
  await eventStore.getEvents();
});

</script>
<template>
  <div class="container mx-auto">
    <div class="flex justify-between">
      <div class="text-2xl mb-3 font-bold">Events</div>
      <label for="createModal" class="text-md btn btn-success mb-3 text-white">Add event</label>
    </div>

    <!-- Events -->
    <div class="flex justify-center">
      <span v-if="loading" class="loading loading-infinity loading-lg"></span>
      <div v-if="getError" class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg">
        {{ getError }}
      </div>
      <div v-if="data.length < 1 && !getError" class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg">
        No events has been added
      </div>
    </div>
    <Carousel v-if="!loading && data.length > 0 && !getError">
      <div v-for="event in data" class="embla__slide">
        <EventCard :event="event" />
      </div>
    </Carousel>
    <!-- Gifts related to the event -->
    <div>
      <div class="flex justify-between items-center">
        <div class="text-2xl my-3 font-bold">Gifts</div>
        <label for="createGiftModal" :class="route.params.id ? 'btn-success' : 'btn-disabled'"
          class="text-md btn btn-md btn-success mb-3 text-white">Add Gift</label>
      </div>
      <div class="flex justify-center">
        <span v-if="giftLoading" class="loading loading-infinity loading-lg"></span>
        <div v-if="giftGetError" class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg">
          {{ giftGetError }}
        </div>
        <div v-if="!route.params.id && !giftGetError" class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg">
          Select event
        </div>
        <div class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg"
          v-if="route.params.id && !giftGetError && !giftLoading && giftData.gifts.length < 1">There is no gift in this
          event</div>
      </div>
      <div v-if="!giftGetError && !giftLoading && giftData.gifts.length > 0">
        <GiftCard :is-list="false" :gifts="giftData" :is-public="false" />
      </div>
    </div>
    <!-- update modal -->
    <div v-for="event in data">
      <EventModal :event="event" />
    </div>
    <!-- create modal -->
    <EventModal />
    <!-- Gift Modal for creating -->
    <GiftModal />
    <!-- Gift modal for updating -->
    <div v-for="gift in giftData.gifts">
      <GiftModal :gifts="gift" />
    </div>
  </div>
</template>

<style scoped>
.embla__slide {
  flex: 0 0 230px;
  margin: 0 10px;
}
</style>
