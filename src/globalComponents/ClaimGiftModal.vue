<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEventsStore } from "../store/eventsStore";
import Modal from "./Modal.vue";
import { onMounted } from "vue";
import { useSettings } from "../store/settingsStore";
const eventStore = useEventsStore();
const { data } = storeToRefs(eventStore);
const settingStore = useSettings();

defineProps<{ giftId: string }>();
onMounted(async () => {
  if (data.value.length < 1) {
    await eventStore.getEvents();
  }
  await settingStore.getUserSettings();
});
</script>
<template>
  <Modal :name="giftId + 'claim'">
    <div v-if="data.length > 0">
      This is what you will see when you have an event to select
    </div>
    <div v-if="data.length < 1">
      Please create an event first before you claim this gift
    </div>
  </Modal>
</template>
