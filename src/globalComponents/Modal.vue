<script lang="ts" setup>
defineProps<{ name: string }>();
</script>
<template>
  <input type="checkbox" :id="name" class="modal-toggle" />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <slot></slot>
      <div class="modal-action">
        <label
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          :for="name"
          >✕</label
        >
      </div>
    </div>
  </div>
</template>
