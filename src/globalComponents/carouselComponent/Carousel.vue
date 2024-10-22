<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import PrevButton from "./PrevButton.vue";
import NextButton from "./NextButton.vue";
// import { onMounted, onBeforeUnmount } from "vue";
import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

const props = defineProps({
  showControls: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
});

const DELAY = 1000;
const plugins = [
  Autoplay({
    delay: DELAY,
    stopOnInteraction: true,
    stopOnLastSnap: false,
    active: props.autoplay,
    stopOnMouseEnter: true,
  }),
  WheelGesturesPlugin({
    forceWheelAxis: "y",
  }),
];

const [emblaRef, emblaApi] = emblaCarouselVue(
  {
    align: "start",
    loop: true,
    containScroll: "keepSnaps",
  },
  plugins
);

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
      <div class="flex embla__container">
        <slot></slot>
      </div>
      <div
        v-if="showControls"
        class="absolute inset-1 flex justify-between pointer-events-none items-center px-5"
      >
        <PrevButton class="pointer-events-auto" @click="scrollToPrev" />
        <NextButton class="pointer-events-auto" @click="scrollToNext" />
      </div>
    </div>
  </div>
</template>
