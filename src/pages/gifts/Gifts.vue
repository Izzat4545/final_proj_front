<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useGiftsStore } from '../../store/giftsStore';
import { useRoute } from 'vue-router';
import GiftCard from '../../globalComponents/GiftCard.vue';
import { storeToRefs } from 'pinia';
import GiftReserveModal from './components/GiftReserveModal.vue';
import GiftList from '../../globalComponents/GiftList.vue';

const { getGifsByEventId } = useGiftsStore()

const giftStore = useGiftsStore()
const { data, getError, loading } = storeToRefs(giftStore)
const isList = ref<boolean>(false)
const route = useRoute()

onMounted(async () => {
    if (route.params.eventId) {
        await getGifsByEventId(route.params.eventId.toString())
    }
})

const handleSelectChange = (event: Event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    isList.value = selectedValue === 'Show as: list';
};
</script>
<template>
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
            <select @change="handleSelectChange"
                :class="data.gifts && data.gifts.length > 0 ? 'select-bordered' : 'select-disabled'"
                class="select select-md w-full max-w-[150px]">
                <option>Show as: list</option>
                <option selected>Show as: cart</option>
            </select>
        </div>
        <GiftCard v-if="!isList" :gifts="data" :is-public="true" />
        <GiftList v-if="isList" :gifts="data" :is-public="true" />
    </div>
    <div v-for="gift in data.gifts">
        <GiftReserveModal :gift-id="gift.id" />
    </div>
</template>