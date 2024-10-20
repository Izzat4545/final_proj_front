<script lang="ts" setup>
import { onMounted } from 'vue';
import { useGiftsStore } from '../../store/giftsStore';
import { useRoute } from 'vue-router';
import GiftCard from '../../globalComponents/GiftCard.vue';
import { storeToRefs } from 'pinia';
import GiftReserveModal from './components/GiftReserveModal.vue';

const { getGifsByEventId } = useGiftsStore()

const giftStore = useGiftsStore()
const { data, getError, loading } = storeToRefs(giftStore)

const route = useRoute()

onMounted(async () => {
    if (route.params.eventId) {
        await getGifsByEventId(route.params.eventId.toString())
    }
})
</script>
<template>
    <div class="flex justify-center">
        <span v-if="loading" class="loading loading-infinity loading-lg"></span>
        <div v-if="getError" class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg">
            {{ getError }}
        </div>
        <div class="p-4 mt-5 text-green-800 bg-green-100 rounded-lg"
            v-if="route.params.id && !getError && !loading && data.gifts.length < 1">There is no gift in this
            event</div>
    </div>
    <div v-if="!loading && !getError" class="container mx-auto">
        <div v-if="data.gifts && data.gifts.length > 0 && data.gifts[0].event" class="flex mb-4 items-center gap-2">
            <img class="size-[150px]" crossorigin="anonymous" :src="data.gifts[0].event.image" alt="Event image" />
            <div>
                <p class="text-xl font-bold">{{ data.gifts[0].event.title }}</p>
                <p>{{ data.gifts[0].event.date }}</p>
                <div class="flex gap-2">
                    <p>Gifts count: {{ data.giftCount }}</p>
                    <p>Gifts reserved: {{ data.giftReservedCount }}</p>
                </div>
            </div>
        </div>
        <GiftCard :gifts="data" :is-list="false" :is-public="true" />
    </div>
    <div v-for="gift in data.gifts">
        <GiftReserveModal :gift-id="gift.id" />
    </div>
</template>