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
  >
    <div class="modal-box">
      <slot />
    </div>
    <label class="modal-backdrop" :for="name">Close</label>
  </div>
</template>
