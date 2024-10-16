<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import { storeToRefs } from "pinia";
import { usePublicGiftStore } from "../../../../store/publicGiftsStore";
import GiftCard from "../GiftCard.vue";
import PrevButton from "../carouselStuff/PrevButton.vue";
import NextButton from "../carouselStuff/NextButton.vue";
import { onMounted } from "vue";

const publicGiftStore = usePublicGiftStore();
const { error, data, loading } = storeToRefs(publicGiftStore);
const { GetPublicGifts } = publicGiftStore;

onMounted(() => {
  GetPublicGifts();
});
const [emblaRef, emblaApi] = emblaCarouselVue({ loop: false });

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
  <div class="flex justify-center">
    <span v-if="loading" class="loading loading-infinity loading-lg"></span>
    <div v-if="error">{{ error }}</div>
  </div>
  <div class="carousel-container" :class="loading ? 'hidden' : 'block'">
    <div class="embla" ref="emblaRef">
      <div class="embla__container">
        <div v-for="gift in data" :key="gift.id" class="embla__slide">
          <GiftCard :gift="gift" />
        </div>
      </div>
      <div class="button-container">
        <PrevButton @click="scrollToPrev">Prev</PrevButton>
        <NextButton @click="scrollToNext">Next</NextButton>
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
