<script lang="ts" setup></script>
<template>
  <dialog id="globalModal" class="modal">
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
  </dialog>
</template>
