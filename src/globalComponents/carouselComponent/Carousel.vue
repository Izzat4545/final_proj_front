<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import PrevButton from "./PrevButton.vue";
import NextButton from "./NextButton.vue";
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
  loop: {
    type: Boolean,
    default: true,
  },
});

const DELAY = 3000;
const plugins = [
  Autoplay({
    delay: DELAY,
    stopOnInteraction: true,
    stopOnLastSnap: false,
    active: props.autoplay,
  }),
  WheelGesturesPlugin({
    forceWheelAxis: "x",
  }),
];

const [emblaRef, emblaApi] = emblaCarouselVue(
  {
    align: "start",
    loop: props.loop,
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
      <div v-auto-animate class="flex">
        <slot></slot>
      </div>
      <div v-if="showControls" class="absolute inset-1 flex justify-between pointer-events-none items-center px-5">
        <PrevButton class="pointer-events-auto" @click="scrollToPrev" />
        <NextButton class="pointer-events-auto" @click="scrollToNext" />
      </div>
    </div>
  </div>
</template>
