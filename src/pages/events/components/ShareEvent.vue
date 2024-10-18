<script setup lang="ts">
import { EventVisibility } from "../../../enums/EventVisibility";
import { Events } from "../../../types/events";

defineProps<{
  event: Events;
}>();

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<template>
  <div
    v-if="
      [EventVisibility.BY_URL, EventVisibility.PUBLIC].includes(
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
      class="dropdown-content card card-compact bg-success text-primary-content z-[1] w-64 p-2 shadow"
    >
      <div class="card-body">
        <h5 class="card-title">Copy share link</h5>

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
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
