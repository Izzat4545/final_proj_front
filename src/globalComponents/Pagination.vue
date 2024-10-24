<!-- this needs fix -->
<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGiftsStore } from "../store/giftsStore";
import { PaginationConfig } from "../enums/PaginationConfig";

// Initialize store and router
const publicGiftStore = useGiftsStore();
const { getGifsByEventId, data } = publicGiftStore;
const route = useRoute();
const router = useRouter();


const currentPage = ref(Number(route.query.page) || PaginationConfig.INITIAL_PAGE);
const limit = ref(Number(route.query.limit) || PaginationConfig.PAGE_LIMIT);

const fetchGifts = async () => {
  await getGifsByEventId(route.params.id.toString(), currentPage.value, limit.value);
};

const changePage = async (page: number) => {
  if (page > 0 && page <= data.meta.totalPages) {
    currentPage.value = page
    await router.push({ query: { ...route.query, page } });
    await fetchGifts()
  }
};
</script>
<template>
  <div class="join">
    <button class="join-item btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
      Previous
    </button>
    <button v-for="page in data.meta.totalPages" :key="page" class="join-item btn"
      :class="{ 'btn-active': currentPage === page }" @click="changePage(page)">
      {{ page }}
    </button>
    <button class="join-item btn" :disabled="currentPage === data.meta.totalPages" @click="changePage(currentPage + 1)">
      Next
    </button>
  </div>
</template>