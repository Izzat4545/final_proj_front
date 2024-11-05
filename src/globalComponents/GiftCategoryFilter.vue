<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { useGiftsStore } from "../store/giftsStore";
import { onMounted } from "vue";
import { CATEGORIES } from "../constants/constants";

const route = useRoute();
const router = useRouter();
const DEFAULT_CATEGORY = "All";
const props = defineProps<{ defaultRoute: "/events/" | "/gifts/" }>();

const handleCategoryChange = async (event?: Event) => {
  const selectedCategory = event
    ? (event.target as HTMLSelectElement).value
    : route.query.category?.toString() || DEFAULT_CATEGORY;

  if (!route.params.id) return;

  if (selectedCategory === DEFAULT_CATEGORY) {
    await router.push({ path: props.defaultRoute + route.params.id });
  } else {
    await router.push({ query: { category: selectedCategory } });
  }

  await useGiftsStore().getGifsByEventId(
    route.params.id.toString(),
    selectedCategory !== DEFAULT_CATEGORY ? selectedCategory : undefined
  );
};

onMounted(async () => {
  if (route.params.id) {
    await handleCategoryChange();
  }
});
</script>

<template>
  <select
    :class="route.params.id ? 'select-bordered' : 'select-disabled'"
    class="select select-md w-[100px]"
    @change="handleCategoryChange"
  >
    <option
      v-for="category in CATEGORIES"
      :key="category.value"
      :selected="
        route.query.category === category.value ||
        (!route.query.category && category.value === DEFAULT_CATEGORY)
      "
      :value="category.value"
    >
      {{ category.label }}
    </option>
  </select>
</template>
