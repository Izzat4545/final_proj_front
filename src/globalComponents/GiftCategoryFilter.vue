<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { GiftCategories } from "../enums/GiftCategories";
import { useGiftsStore } from "../store/giftsStore";
import { onMounted } from "vue";
const route = useRoute();
const router = useRouter();
const DEFAULT_CATEGORY = "All";
const props = defineProps<{ defaultRoute: "/events/" | "/gifts/" }>();

const handleCategoryChange = async (event?: Event) => {
  const selectedCategory = event
    ? (event.target as HTMLSelectElement).value
    : route.query.category?.toString() || DEFAULT_CATEGORY;

  if (!route.params.id) return; // Add this check to prevent execution if params.id is missing

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

onMounted(async () => {
  await handleCategoryChange();
});
</script>
<template>
  <select
    :class="route.params.id ? 'select-bordered' : 'select-disabled'"
    class="select select-md w-[100px]"
    @change="handleCategoryChange"
  >
    <option
      :selected="
        route.query.category === undefined ||
        route.query.category === DEFAULT_CATEGORY
      "
      :value="DEFAULT_CATEGORY"
    >
      {{ DEFAULT_CATEGORY }}
    </option>
    <option
      :selected="route.query.category === GiftCategories.FAMILY"
      :value="GiftCategories.FAMILY"
    >
      Family
    </option>
    <option
      :selected="route.query.category === GiftCategories.IT"
      :value="GiftCategories.IT"
    >
      IT
    </option>
    <option
      :selected="route.query.category === GiftCategories.KIDS"
      :value="GiftCategories.KIDS"
    >
      Kids
    </option>
    <option
      :selected="route.query.category === GiftCategories.LUXURY"
      :value="GiftCategories.LUXURY"
    >
      Luxury
    </option>
    <option
      :selected="route.query.category === GiftCategories.PETS"
      :value="GiftCategories.PETS"
    >
      Pets
    </option>
  </select>
</template>
