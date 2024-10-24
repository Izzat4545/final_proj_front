<script setup lang="ts">
import { ref } from "vue";
import Modal from "../../../globalComponents/Modal.vue";
import { useEventsStore } from "../../../store/eventsStore";
import { EventVisibilities } from "../../../enums/EventVisibilities";
import { storeToRefs } from "pinia";
import { Event as EventType } from "../../../types/events";

const props = defineProps<{ event?: EventType }>();
const eventStore = useEventsStore();

const { postError, loading } = storeToRefs(eventStore);

const { createEvents, updateEventById } = useEventsStore();

const title = ref(props.event ? props.event.title : "");
const date = ref(props.event ? props.event.date : "");
const visibility = ref(
  props.event ? props.event.visibility : EventVisibilities.PRIVATE
);
const description = ref(props.event ? props.event.description : "");
let image = ref<File | null>(null);

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    image.value = files[0];
  } else {
    image.value = null;
  }
};

const handleEvent = async () => {
  try {
    if (props.event) {
      await updateEventById(
        props.event.id,
        title.value,
        date.value,
        visibility.value,
        description.value,
        image.value
      );
    } else {
      await createEvents(
        title.value,
        date.value,
        visibility.value,
        description.value,
        image.value
      );
      // resettings the form
      (title.value = ""), (date.value = ""), (description.value = "");
    }
  } catch (err) {
    throw new Error((err as Error).message || "Failed to create event");
  }
};
</script>

<template>
  <Modal :name="event ? event.id : 'createModal'">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">
        {{ event ? "Update Event" : "Create Event" }}
      </h2>

      <form @submit.prevent="handleEvent" enctype="multipart/form-data">
        <!-- Title (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-600">*</span>
          </label>
          <input type="text" v-model="title" class="input input-bordered w-full" placeholder="Enter event title"
            required />
        </div>

        <!-- Date (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date <span class="text-red-600">*</span>
          </label>
          <input type="date" v-model="date" class="input input-bordered w-full" required />
        </div>

        <!-- Visibility (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Visibility <span class="text-red-600">*</span>
          </label>
          <select v-model="visibility" class="select select-bordered w-full">
            <option :value="EventVisibilities.PUBLIC">Public</option>
            <option :value="EventVisibilities.PRIVATE">Private</option>
            <option :value="EventVisibilities.BY_URL">By url</option>
          </select>
        </div>

        <!-- Description (Optional) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea v-model="description" class="textarea textarea-bordered w-full"
            placeholder="Enter event description (optional)" />
        </div>

        <!-- Image (Optional) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>
          <input type="file" @change="handleFileChange" class="file-input file-input-bordered w-full"
            accept="image/*" />
        </div>

        <!-- Submit Button -->
        <button v-if="!event" type="submit"
          class="btn btn-success text-white w-full flex justify-center items-center gap-2" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          {{ loading ? "Creating..." : "Create Event" }}
        </button>

        <!-- Update Button -->
        <button v-if="event" type="submit"
          class="btn btn-success text-white w-full flex justify-center items-center gap-2" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          {{ loading ? "Updating..." : "Update Event" }}
        </button>
      </form>
      <!-- Error Message -->
      <div v-if="postError" class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg">
        {{ postError }}
      </div>
    </div>
  </Modal>
</template>
