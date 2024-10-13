<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";

defineProps<{ msg: string }>();

onMounted(() => {
  console.log("nice");
});

const name = ref("");
</script>

<template>
  <div>Input {{ name }}</div>
  <input class="border border-red-500" v-model="name" type="text" />
</template>
