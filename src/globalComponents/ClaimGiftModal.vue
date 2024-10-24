<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEventsStore } from "../store/eventsStore";
import Modal from "./Modal.vue";
import { onMounted, ref } from "vue";
import { useSettings } from "../store/settingsStore";
import { useAuthStore } from "../store/authStore";
import { useGiftsStore } from "../store/giftsStore";
const eventStore = useEventsStore();
const settingStore = useSettings();
const useAuthstore = useAuthStore();
const { data } = storeToRefs(eventStore);
const giftsStore = useGiftsStore();
const { postError, loading } = storeToRefs(giftsStore);

const props = defineProps<{ giftId: string }>();
const selectedEventId = ref<string>("");

onMounted(async () => {
  if (useAuthstore.isAuthenticated() && data.value.length < 1) {
    await eventStore.getEvents();
    await settingStore.getUserSettings();
  }
});

const submitForm = async () => {
  if (selectedEventId.value) {
    await giftsStore.claimGift(props.giftId, selectedEventId.value);
  } else {
    postError.value = "Please select an event.";
  }
};
</script>
<template>
  <Modal :name="giftId + 'claim'">
    <div v-if="data.length > 0">
      <!-- Form to select event and claim gift -->
      <form @submit.prevent="submitForm">
        <!-- Select dropdown for events -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text">Select Event</span>
          </label>
          <select
            v-model="selectedEventId"
            class="select select-bordered w-full"
          >
            <option disabled value="">Choose an event</option>
            <option v-for="event in data" :key="event.id" :value="event.id">
              {{ event.title }}
            </option>
          </select>
        </div>
        <!-- Claim button -->
        <div class="form-control">
          <button
            class="btn btn-primary w-full"
            type="submit"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            Claim Gift
          </button>
        </div>
        <!-- Display errors if any -->
        <div
          v-if="postError"
          class="p-4 mt-4 text-red-800 bg-red-100 rounded-lg"
        >
          {{ postError }}
        </div>
      </form>
    </div>

    <!-- Message when no events are available -->
    <div v-else>Please create an event before you claim this gift!</div>
  </Modal>
</template>
