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
import Pagination from "../../globalComponents/Pagination.vue";
import { PaginationConfig } from "../../enums/PaginationConfig";
import { useSettings } from "../../store/settingsStore";
import GiftCategoryFilter from "../../globalComponents/GiftCategoryFilter.vue";

const eventStore = useEventsStore();
const giftsStore = useGiftsStore();
const settingStore = useSettings();
const route = useRoute();
const isList = ref<boolean>(false);
const {
  data: giftData,
  getError: giftGetError,
  loading: giftLoading,
} = storeToRefs(giftsStore);
const { getError, data, loading } = storeToRefs(eventStore);
const SHOW_AS_LIST = "Show as: list";
const SHOW_AS_CART = "Show as: cart";

onMounted(async () => {
  await eventStore.getEvents();
  await settingStore.getUserSettings();
});

const handleSelectChange = (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value;
  isList.value = selectedValue === SHOW_AS_LIST;
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
      <div v-if="data.length < 1 && !getError && !loading" class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg">
        No events has been added
      </div>
    </div>
    <Carousel :autoplay="false" :loop="false" :show-controls="data.length > 5" v-if="data.length > 0 && !getError">
      <div v-for="event in data" class="flex shrink-0 mx-3" :key="event.id">
        <EventCard :event="event" />
      </div>
    </Carousel>
    <!-- Gifts related to the event -->
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <div class="text-2xl my-3 font-bold">Gifts</div>
        <div class="flex items-center gap-2">
          <GiftCategoryFilter default-route="/events/" />
          <select @change="handleSelectChange" :class="route.params.id ? 'select-bordered' : 'select-disabled'"
            class="select select-md w-full max-w-xs">
            <option>{{ SHOW_AS_LIST }}</option>
            <option selected>{{ SHOW_AS_CART }}</option>
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
        <div class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg" v-if="
          route.params.id &&
          !giftGetError &&
          !giftLoading &&
          giftData.data.length < 1
        ">
          There is no gift in this event
        </div>
      </div>
      <div v-if="
        route.params.id &&
        !giftGetError &&
        giftData.data.length > 0 && !giftLoading
      ">
        <div v-auto-animate
          class="grid mx-auto max-sm:max-w-[300px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-3 justify-items-center">
          <GiftCard v-for="gift in giftData.data" v-if="!isList" :gift="gift" :is-public="false" :key="gift.id" />
        </div>
        <div v-auto-animate class="flex-col hidden sm:flex justify-center my-3 gap-5">
          <GiftList v-for="gift in giftData.data" v-if="isList" :gift="gift" :is-public="false" :key="gift.id" />
        </div>
        <div v-auto-animate :class="isList && 'grid sm:hidden'"
          class="mx-auto max-sm:max-w-[300px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-3 justify-items-center">
          <GiftCard v-for="gift in giftData.data" v-if="isList" :key="gift.id" :gift="gift" :is-public="false" />
        </div>
        <div v-if="giftData.meta.totalGifts > PaginationConfig.PAGE_LIMIT" class="flex mb-3 justify-center">
          <Pagination />
        </div>
      </div>
      <!-- update modal -->
      <div v-for="event in data" :key="event.id">
        <EventModal :event="event" />
      </div>
    </div>
    <!-- create modal -->
    <EventModal />
    <!-- Gift Modal for creating -->
    <GiftModal />
    <!-- update modal for the gift modal -->
    <div v-for="gift in giftData.data" :key="gift.id">
      <GiftModal :gifts="gift" />
    </div>
  </div>
</template>
