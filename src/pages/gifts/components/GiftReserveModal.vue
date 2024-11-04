<script lang="ts" setup>
import { ref } from "vue";
import { useGiftsStore } from "../../../store/giftsStore";
import { useRoute } from "vue-router";
import Modal from "../../../globalComponents/Modal.vue";

const { reserveGiftByEmail, postError, loading } = useGiftsStore();
const route = useRoute();
const email = ref("");

const props = defineProps<{ giftId: string }>();

const handleReservation = async () => {
  try {
    await reserveGiftByEmail(
      email.value,
      props.giftId,
      route.params.id.toString()
    );
  } catch (err) {
    throw new Error((err as Error).message || "Failed to create gift");
  }
};
</script>
<template>
  <Modal :name="giftId">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">Reserve Gift</h2>

      <form @submit.prevent="handleReservation" enctype="multipart/form-data">
        <!-- Name (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email <span class="text-red-600">*</span>
          </label>
          <input
            type="email"
            v-model="email"
            class="input input-bordered w-full"
            placeholder="Enter email"
            required
          />
        </div>
        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-success text-white w-full flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ loading ? "Creating..." : "Create reservation" }}
        </button>
      </form>
    </div>
    <!-- Error Message -->
    <div v-if="postError" class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg">
      {{ postError }}
    </div>
  </Modal>
</template>
