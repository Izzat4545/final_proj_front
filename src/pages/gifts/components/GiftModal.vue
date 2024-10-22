<script setup lang="ts">
import { ref } from "vue";
import Modal from "../../../globalComponents/Modal.vue";
import { storeToRefs } from "pinia";
import { useGiftsStore } from "../../../store/giftsStore";
import { PopularGift } from "../../../types/pupularGifts";
import { Currencies } from "../../../enums/Currencies";
import { useRoute } from "vue-router";

const props = defineProps<{ gifts?: PopularGift }>();
const giftStore = useGiftsStore();
const route = useRoute();
const { postError, loading } = storeToRefs(giftStore);
const { createGift, updateGiftById } = useGiftsStore();
const name = ref(props.gifts ? props.gifts.name : "");
const price = ref(props.gifts ? props.gifts.price : "");
const currency = ref(props.gifts ? props.gifts?.currency : Currencies.USD);
const link = ref(props.gifts ? props.gifts?.link : "");
const description = ref(props.gifts ? props.gifts.description : "");
let image = ref<File | null>(null);

const handleFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    image.value = files[0];
  } else {
    image.value = null;
  }
};

const handleEvent = async () => {
  try {
    if (props.gifts) {
      await updateGiftById(
        route.params.id.toString(),
        props.gifts.id,
        name.value,
        price.value,
        currency.value,
        link.value,
        description.value,
        image.value
      );
    } else {
      await createGift(
        route.params.id.toString(),
        name.value,
        price.value,
        currency.value,
        link.value,
        description.value,
        image.value
      );
      // resettings the form
      (name.value = ""),
        (price.value = ""),
        (image.value = null),
        (link.value = ""),
        (description.value = "");
    }
  } catch (err) {
    throw new Error((err as Error).message || "Failed to create gift");
  }
};
</script>

<template>
  <Modal :name="gifts ? gifts.id : 'createGiftModal'">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">
        {{ gifts ? "Update Gift" : "Create Gift" }}
      </h2>

      <form @submit.prevent="handleEvent" enctype="multipart/form-data">
        <!-- Name (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Name <span class="text-red-600">*</span>
          </label>
          <input
            type="text"
            v-model="name"
            class="input input-bordered w-full"
            placeholder="Enter gift name"
            required
          />
        </div>

        <!-- Price (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Price <span class="text-red-600">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter gift price"
            v-model="price"
            class="input input-bordered w-full"
            required
          />
        </div>

        <!-- Currency (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Currency <span class="text-red-600">*</span>
          </label>
          <select v-model="currency" class="select select-bordered w-full">
            <option :value="Currencies.RUB">RUB</option>
            <option :value="Currencies.USD">USD</option>
            <option :value="Currencies.UZS">UZS</option>
          </select>
        </div>

        <!-- Link (Required) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Shop link <span class="text-red-600">*</span>
          </label>
          <input
            type="text"
            v-model="link"
            class="input input-bordered w-full"
            placeholder="Enter shop link"
            required
          />
        </div>

        <!-- Description (Optional) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="description"
            class="textarea textarea-bordered w-full"
            placeholder="Enter event description (optional)"
          ></textarea>
        </div>

        <!-- Image (Optional) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Event Image
          </label>
          <input
            type="file"
            @change="handleFileChange"
            class="file-input file-input-bordered w-full"
            accept="image/*"
          />
        </div>

        <!-- Submit Button -->
        <button
          v-if="!gifts"
          type="submit"
          class="btn btn-success text-white w-full flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ loading ? "Creating..." : "Create Gift" }}
        </button>

        <!-- Update Button -->
        <button
          v-if="gifts"
          type="submit"
          class="btn btn-success text-white w-full flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ loading ? "Updating..." : "Update Gift" }}
        </button>
      </form>
      <!-- Error Message -->
      <div v-if="postError" class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg">
        {{ postError }}
      </div>
    </div>
  </Modal>
</template>
