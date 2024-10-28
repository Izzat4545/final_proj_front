<script setup lang="ts">
import { EventVisibilities } from "../../../enums/EventVisibilities";
import { Event } from "../../../types/events";
import { ref } from "vue";

defineProps<{
  event: Event;
}>();

const buttonText = ref("Copy");

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  buttonText.value = "Done";
  setTimeout(() => {
    buttonText.value = "Copy";
  }, 1000);
};
</script>

<template>
  <div
    v-if="
      [EventVisibilities.BY_URL, EventVisibilities.PUBLIC].includes(
        event.visibility
      )
    "
    class="dropdown"
  >
    <div
      tabindex="0"
      role="button"
      class="btn rounded-full btn-ghost btn-circle btn-sm"
    >
      <img src="../../../assets/share.svg" alt="Share" />
    </div>
    <div
      tabindex="0"
      class="dropdown-content card card-compact bg-white text-primary-content z-[1] w-64 p-2 shadow"
    >
      <div class="card-body">
        <h5 class="text-[16px] text-black">Copy share link</h5>

        <div class="flex items-center gap-2">
          <!-- Disabled Input for Event Link -->
          <input
            type="text"
            v-model="event.link"
            class="input input-sm input-bordered w-full"
            disabled
          />

          <!-- Copy Button -->
          <button
            @click="copyToClipboard(event.link)"
            class="btn btn-sm btn-primary"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
