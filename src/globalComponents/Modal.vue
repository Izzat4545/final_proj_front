<script lang="ts" setup>
defineProps<{ name: string }>();
</script>
<template>
  <input type="checkbox" :id="name" class="modal-toggle" />
  <div
    class="modal"
    :id="name"
    :aria-labelledby="`${name}-title`"
    role="dialog"
    title="modal"
  >
    <div class="modal-box">
      <slot />
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
