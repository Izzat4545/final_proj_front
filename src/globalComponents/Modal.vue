<script lang="ts" setup>
defineProps<{ name: string }>();
</script>
<template>
  <!-- <dialog :id="name" class="modal">
    <div class="modal-box">
      <div class="modal-action">
        <form method="dialog">
          <button
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
      </div>
      <slot></slot>
    </div>
  </dialog> -->

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
