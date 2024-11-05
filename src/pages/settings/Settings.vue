<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSettings } from "../../store/settingsStore";
import { Currencies } from "../../enums/Currencies";
import { storeToRefs } from "pinia";
import { CURRENCY_OPTIONS } from "../../constants/constants";

const settingsStore = useSettings();

const { loading, error, data } = storeToRefs(settingsStore);

const oldPassword = ref<string | undefined>();
const newPassword = ref<string | undefined>();
const newEmail = ref<string | undefined>();
const newName = ref<string | undefined>();
const currency = ref<Currencies | undefined>();

const handleUpdate = async () => {
  try {
    await settingsStore.updateSettings(
      oldPassword.value,
      newPassword.value,
      newEmail.value,
      newName.value,
      currency.value
    );
  } catch {
    throw new Error(error.value || "Something went wrong!");
  }
};

onMounted(async () => {
  try {
    await settingsStore.getUserSettings();
    if (data.value) {
      newEmail.value = data.value.email || "";
      newName.value = data.value.name || "";
      currency.value = data.value.currency;
    }
  } catch (err) {
    throw new Error(error.value || "Something went wrong!");
  }
});
</script>

<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="w-full max-w-xl p-6 bg-white shadow-md rounded-lg">
      <form @submit.prevent="handleUpdate">
        <h2 class="text-2xl font-semibold text-center mb-6">Update Settings</h2>
        <div v-if="error" class="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
          {{ error }}
        </div>

        <div class="mb-4">
          <label
            for="newEmail"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="newEmail"
            v-model="newEmail"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
            placeholder="Enter your new email"
          />
        </div>

        <div class="mb-4">
          <label
            for="newName"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="newName"
            v-model="newName"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your new name"
          />
        </div>

        <div class="mb-6">
          <label
            for="currency"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Currency
          </label>
          <select
            id="currency"
            v-model="currency"
            class="select select-bordered w-full"
          >
            <option
              v-for="option in CURRENCY_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label
            for="oldPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            v-model="oldPassword"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your old password"
          />
        </div>

        <div class="mb-4">
          <label
            for="newPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your new password"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          :class="loading && 'btn-disabled'"
          class="w-full py-2 px-4 bg-blue-500 btn text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          <span
            v-if="loading"
            class="loading loading-spinner text-neutral"
          ></span>
          Update Settings
        </button>
      </form>
    </div>
  </div>
</template>
