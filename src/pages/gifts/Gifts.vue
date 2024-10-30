<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useGiftsStore } from "../../store/giftsStore";
import { useRoute } from "vue-router";
import GiftCard from "../../globalComponents/GiftCard.vue";
import { storeToRefs } from "pinia";
import GiftReserveModal from "./components/GiftReserveModal.vue";
import GiftList from "../../globalComponents/GiftList.vue";
import Pagination from "../../globalComponents/Pagination.vue";
import { PaginationConfig } from "../../enums/PaginationConfig";
import ClaimGiftModal from "../../globalComponents/ClaimGiftModal.vue";
import { RoutePaths } from "../../enums/Routes";

const { getGifsByEventId } = useGiftsStore();

const giftStore = useGiftsStore();
const { data, getError, loading } = storeToRefs(giftStore);
const isList = ref<boolean>(false);
const route = useRoute();

onMounted(async () => {
  if (route.params.id) {
    await getGifsByEventId(route.params.id.toString());
  }
});
const SHOW_AS_LIST = "Show as: list";
const SHOW_AS_CART = "Show as: cart";

const handleSelectChange = (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value;
  isList.value = selectedValue === SHOW_AS_LIST;
};
</script>
<template>
  <div v-if="!loading && !getError" class="container mx-auto">
    <div
      v-if="data.data && data.data.length > 0 && data.data[0].event"
      class="flex flex-col sm:flex-row mb-4 items-center gap-2"
    >
      <img
        class="size-[150px] object-cover rounded-md"
        crossorigin="anonymous"
        :src="data.data[0].event.image"
        alt="Event image"
      />
      <div class="text-center sm:text-start">
        <p class="text-xl font-bold">{{ data.data[0].event.title }}</p>
        <p>{{ data.data[0].event.date }}</p>
        <div class="flex gap-2">
          <p>Gifts count: {{ data.giftCount }}</p>
          <p>Gifts reserved: {{ data.giftReservedCount }}</p>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="!getError && !loading"
    class="flex container mx-auto justify-end items-center"
  >
    <select
      @change="handleSelectChange"
      :class="
        data.data && data.data.length > 0
          ? 'select-bordered'
          : 'select-disabled'
      "
      class="select select-md w-full max-w-[150px]"
    >
      <option>{{ SHOW_AS_LIST }}</option>
      <option selected>{{ SHOW_AS_CART }}</option>
    </select>
  </div>

  <div class="flex justify-center">
    <span v-if="loading" class="loading loading-infinity loading-lg"></span>
    <div
      v-if="getError"
      class="p-4 flex items-center gap-2 mt-5 text-red-800 bg-red-100 rounded-lg"
    >
      <div>{{ getError }}</div>
      <router-link :to="RoutePaths.HOME" class="underline rounded-full">
        Go back home
      </router-link>
    </div>
    <div
      class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg"
      v-if="route.params.id && !getError && !loading && data.data.length < 1"
    >
      There is no gift in this event
    </div>
  </div>
  <div
    class="container mx-auto"
    v-if="route.params.id && !getError && !loading && data.data.length > 0"
  >
    <div
      class="flex my-3 justify-center sm:justify-start items-stretch gap-5 flex-wrap"
    >
      <GiftCard
        v-for="gift in data.data"
        v-if="!isList"
        :gift="gift"
        :is-public="true"
      />
    </div>
    <div class="flex-col hidden sm:flex justify-center my-3 gap-5">
      <GiftList
        v-for="gift in data.data"
        v-if="isList"
        :gift="gift"
        :is-public="true"
      />
    </div>
    <!-- on small display I am showing the cart -->
    <div
      class="flex my-3 sm:hidden justify-center sm:justify-start items-stretch gap-5 flex-wrap"
    >
      <GiftCard
        v-for="gift in data.data"
        v-if="isList"
        :gift="gift"
        :is-public="true"
      />
    </div>
    <div
      v-if="data.meta.totalGifts > PaginationConfig.PAGE_LIMIT"
      class="flex mb-3 justify-center"
    >
      <Pagination />
    </div>
  </div>
  <div v-for="gift in data.data" :key="gift.id">
    <GiftReserveModal :gift-id="gift.id" />
  </div>
  <!-- Claim gift to my event -->
  <div v-for="gift in data.data" :key="gift.id" :gift-id="gift.id">
    <ClaimGiftModal :gift-id="gift.id" />
  </div>
</template>
