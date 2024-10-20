<script setup lang="ts">
import EventCard from "./components/EventCard.vue";
import Carousel from "../../globalComponents/carouselComponent/Carousel.vue";
import EventModal from "./components/EventModal.vue";
import { useEventsStore } from "../../store/eventsStore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useGiftsStore } from "../../store/giftsStore";
import GiftCard from "../../globalComponents/GiftCard.vue";
import GiftModal from "../gifts/components/GiftModal.vue";
import GiftList from "../../globalComponents/GiftList.vue";


const eventStore = useEventsStore();
const giftsStore = useGiftsStore()
const route = useRoute()
const isList = ref<boolean>(false)
const { data: giftData, getError: giftGetError, loading: giftLoading } = storeToRefs(giftsStore)
const { getError, data, loading } = storeToRefs(eventStore);

onMounted(async () => {
  await eventStore.getEvents();
});

const handleSelectChange = (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value;
  // Update `isList` based on the selected value
  isList.value = selectedValue === 'Show as: list';
};


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
        <div class="flex items-center gap-2">
          <select @change="handleSelectChange" :class="route.params.id ? 'select-bordered' : 'select-disabled'"
            class="select select-md w-full max-w-xs">
            <option>Show as: list</option>
            <option selected>Show as: cart</option>
          </select>
          <label for="createGiftModal" :class="route.params.id ? 'btn-success' : 'btn-disabled'"
            class="text-md btn btn-md btn-success text-white">Add Gift</label>
        </div>
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
        <GiftCard v-if="!isList" :gifts="giftData" :is-public="false" />
        <GiftList v-if="isList" :gifts="giftData" :is-public="false" />
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
