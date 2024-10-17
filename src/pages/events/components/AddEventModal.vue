<script setup lang="ts">
import { ref } from "vue";
import Modal from "../../../globalComponents/Modal.vue";
import { useEventsStore } from "../../../store/eventsStore";
import { EventVisibility } from "../../../enums/EventVisibility";

const { error, loading, createEvents, getEvents } = useEventsStore();

const title = ref("");
const date = ref("");
const visibility = ref(EventVisibility.PUBLIC);
const description = ref("");
const image = ref<File | null>(null);

const handleCreateEvent = async () => {
  try {
    await createEvents(
      title.value,
      date.value,
      visibility.value,
      description.value,
      image.value
    );
    if (!error) await getEvents();
  } catch (err) {
    throw new Error((err as Error).message || "Failed to create event");
  }
};
</script>

<template>
  <Modal>
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">Create Event</h2>

      <form @submit.prevent="handleCreateEvent" enctype="multipart/form-data">
        <!-- Title (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-600">*</span>
          </label>
          <input
            type="text"
            v-model="title"
            class="input input-bordered w-full"
            placeholder="Enter event title"
            required
          />
        </div>

        <!-- Date (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Date <span class="text-red-600">*</span>
          </label>
          <input
            type="date"
            v-model="date"
            class="input input-bordered w-full"
            required
          />
        </div>

        <!-- Visibility (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Visibility <span class="text-red-600">*</span>
          </label>
          <select v-model="visibility" class="select select-bordered w-full">
            <option :value="EventVisibility.PUBLIC">Public</option>
            <option :value="EventVisibility.PRIVATE">Private</option>
            <option :value="EventVisibility.BY_URL">By url</option>
          </select>
        </div>

        <!-- Description (Optional) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="description"
            class="textarea textarea-bordered w-full"
            placeholder="Enter event description (optional)"
          ></textarea>
        </div>

        <!-- Image (Optional) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>
          <input
            type="file"
            @change="(e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          image = files[0];
        } else {
          image = null;
        }
      }"
            class="file-input file-input-bordered w-full"
            accept="image/*"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary w-full flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ loading ? "Creating..." : "Create Event" }}
        </button>
      </form>
      <!-- Error Message -->
      <div v-if="error" class="text-red-600 mb-4">{{ error }}</div>
    </div>
  </Modal>
</template>
