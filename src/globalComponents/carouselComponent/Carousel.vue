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
  <div class="carousel-container">
    <div class="embla" ref="emblaRef">
      <div class="embla__container">
        <slot></slot>
      </div>
      <div v-if="showControls" class="button-container">
        <PrevButton @click="scrollToPrev" />
        <NextButton @click="scrollToNext" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  position: relative;
}

.embla {
  overflow: hidden;
}

.embla__container {
  display: flex;
}

.embla__slide {
  flex: 0 0 30%;
  margin: 0 10px;
}

@media (max-width: 1200px) {
  .embla__slide {
    flex: 0 0 45%;
  }
}

@media (max-width: 768px) {
  .embla__slide {
    flex: 0 0 70%;
  }
}

@media (max-width: 480px) {
  .embla__slide {
    flex: 0 0 90%;
  }
}

.button-container {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  padding: 0 20px;
}

.embla__button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>
