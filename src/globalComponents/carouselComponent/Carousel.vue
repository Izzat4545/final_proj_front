<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import PrevButton from "./PrevButton.vue";
import NextButton from "./NextButton.vue";

defineProps({
  showControls: {
    type: Boolean,
    default: true,
  },
});

const [emblaRef, emblaApi] = emblaCarouselVue();

// Scroll functions for prev/next
const scrollToPrev = () => {
  if (emblaApi.value) {
    emblaApi.value.scrollPrev();
  }
};

const scrollToNext = () => {
  if (emblaApi.value) {
    emblaApi.value.scrollNext();
  }
};
</script>

<template>
  <div class="relative">
    <div class="overflow-hidden" ref="emblaRef">
      <div class="flex">
        <slot></slot>
      </div>
      <div v-if="showControls" class="absolute inset-1 flex justify-between pointer-events-none items-center px-5">
        <PrevButton class="pointer-events-auto" @click="scrollToPrev" />
        <NextButton class="pointer-events-auto" @click="scrollToNext" />
      </div>
    </div>
  </div>
</template>
