<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useGiftsStore } from "../../store/giftsStore";
import { useRoute } from "vue-router";
import GiftCard from "../../globalComponents/GiftCard.vue";
import { storeToRefs } from "pinia";
import GiftReserveModal from "./components/GiftReserveModal.vue";
import GiftList from "../../globalComponents/GiftList.vue";

const { getGifsByEventId } = useGiftsStore();

const giftStore = useGiftsStore();
const { data, getError, loading } = storeToRefs(giftStore);
const isList = ref<boolean>(false);
const route = useRoute();

onMounted(async () => {
  if (route.params.eventId) {
    await getGifsByEventId(route.params.eventId.toString());
  }
});
const SHOW_AS_LIST = "Show as: list"
const SHOW_AS_CART = "Show as: cart"

const handleSelectChange = (event: Event) => {
  const selectedValue = (event.target as HTMLSelectElement).value;
  isList.value = selectedValue === SHOW_AS_LIST;
};
</script>
<template>
  <div v-if="getError" class="p-4 mb-4 mx-auto container text-red-800 bg-red-100 rounded-lg">
    {{ getError }}
  </div>
  <div v-if="!loading && !getError" class="container mx-auto">
    <div v-if="data.gifts && data.gifts.length > 0 && data.gifts[0].event"
      class="flex flex-col sm:flex-row mb-4 items-center gap-2">
      <img class="size-[150px]" crossorigin="anonymous" :src="data.gifts[0].event.image" alt="Event image" />
      <div class="text-center sm:text-start">
        <p class="text-xl font-bold">{{ data.gifts[0].event.title }}</p>
        <p>{{ data.gifts[0].event.date }}</p>
        <div class="flex gap-2">
          <p>Gifts count: {{ data.giftCount }}</p>
          <p>Gifts reserved: {{ data.giftReservedCount }}</p>
        </div>
      </div>
    </div>
    <div class="flex justify-end items-center">
      <select @change="handleSelectChange" :class="data.gifts && data.gifts.length > 0
          ? 'select-bordered'
          : 'select-disabled'
        " class="select select-md w-full max-w-[150px]">
        <option>{{ SHOW_AS_LIST }}</option>
        <option selected>{{ SHOW_AS_CART }}</option>
      </select>
    </div>
    <GiftCard v-if="!isList" :gifts="data" :is-public="true" />
    <GiftList v-if="isList" :gifts="data" :is-public="true" />
  </div>
  <div v-for="gift in data.gifts">
    <GiftReserveModal :gift-id="gift.id" />
  </div>
</template>
