<script setup lang="ts">
import { Events } from "../../../types/events";

defineProps<{
  event: Events;
}>();
</script>

<template>
  <div
    class="card cursor-pointer card-compact bg-base-100 group border mb-3 shadow-md p-3"
  >
    <figure>
      <img
        crossorigin="anonymous"
        class="h-[130px] object-cover"
        :src="event.image"
        alt="Event Image"
      />
    </figure>
    <div class="card-body">
      <h2 class="card-title text-[16px]">{{ event.title }}</h2>
      <p>Event Date: {{ event.date }}</p>
      <div
        class="flex gap-2 absolute top-0 right-2 opacity-0 transition-all duration-300 group-hover:opacity-100 flex-col mt-3"
      >
        <button class="btn rounded-full btn-ghost btn-circle btn-sm">
          <img src="../../../assets/edit.svg" alt="Edit" />
        </button>

        <button class="btn rounded-full btn-ghost btn-circle btn-sm">
          <img src="../../../assets/delete.svg" alt="Delete" />
        </button>
      </div>
    </div>
  </div>
</template>
