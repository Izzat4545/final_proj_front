<script lang="ts" setup>
import { useGiftsStore } from '../store/giftsStore';
import { Gifts } from '../types/gifts';
import { formatNumbers } from '../utils/formatNumbers';
import { shortenText } from '../utils/textShortener';

defineProps<{ gifts: Gifts, isPublic: boolean, isList: boolean }>()

const { deleteGiftById } = useGiftsStore()

const handleDelete = async (giftId: string, eventId: string,) => {
    await deleteGiftById(giftId, eventId)
}
</script>
<template>
    <div class="flex justify-center sm:justify-start items-center gap-5 flex-wrap">
        <div v-for="gift in gifts.gifts" class="bg-white rounded-lg relative shadow-md p-4 flex flex-col items-start">
            <img crossorigin="anonymous" :src="gift.image" alt="gift image"
                class="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 class="text-lg font-semibold mb-2">{{ shortenText(gift.name, 15) }}</h3>
            <!-- Reserve btn if it is public -->
            <label v-if="isPublic" :for="gift.id" :class="gift.reservedEmail ? 'btn-disabled' : 'btn-success'"
                class="btn rounded w-full text-white btn-sm">
                {{ gift.reservedEmail ? 'reserved' : 'reserve' }}
            </label>
            <p class="text-gray-600 text-sm mb-2">{{ shortenText(gift.description, 30) }}</p>
            <a :href="gift.link" target="_blank"
                class="bg-blue-500 btn btn-sm w-full text-white rounded hover:bg-blue-600 transition-colors my-2">
                Buy in Store
            </a>
            <p class="text-xl font-bold">{{ formatNumbers(gift.price) }} {{ gift.currency }}</p>
            <!-- edit and delete -->
            <div v-if="!isPublic" class="flex gap-2 absolute top-0 right-2 transition-all flex-col mt-3">
                <label :for="gift.id" class="btn rounded-full btn-ghost btn-circle btn-sm">
                    <img src="../assets/edit.svg" alt="Edit" />
                </label>
                <button @click="handleDelete(gift.id, gift.eventId)"
                    class="btn rounded-full btn-ghost btn-circle btn-sm">
                    <img src="../assets/delete.svg" alt="Delete" />
                </button>
            </div>
        </div>
    </div>
</template>