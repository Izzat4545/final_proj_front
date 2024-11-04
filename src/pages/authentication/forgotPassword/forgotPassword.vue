<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../../store/authStore";
import { RoutePaths } from "../../../enums/Routes";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const STEP_ONE = 1;
const STEP_TWO = 2;
const STEP_THREE = 3;
const STEP_FOUR = 4;

const email = ref(localStorage.getItem("email") || "");
const newPassword = ref("");
const repeatPassword = ref("");
const step = ref(STEP_ONE);

onMounted(() => {
  const code = route.query.code;

  if (code) {
    step.value = STEP_THREE;
  }
});
const handleSubmit = async () => {
  try {
    if (step.value === STEP_ONE) {
      // Request password reset link
      await authStore.requestPasswordReset(email.value);

      if (!authStore.error) {
        step.value = STEP_TWO;
        localStorage.setItem("email", email.value);
      }
    } else if (step.value === STEP_THREE) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (!code) throw new Error("Invalid or missing code.");

      await authStore.resetPassword(
        code,
        newPassword.value,
        email.value,
        repeatPassword.value
      );

      // Proceed to step 4 if no errors are set by the store
      if (!authStore.error) {
        step.value = STEP_FOUR;
        router.push(RoutePaths.LOGIN);
        localStorage.removeItem("email");
      }
    }
  } catch (err) {
    authStore.error = (err as Error).message || "An error occurred";
  }
};
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-semibold mb-6 text-center">Forgot Password</h1>

      <form @submit.prevent="handleSubmit">
        <!-- Email Input -->
        <div v-if="step === 1" class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            v-model="email"
            id="email"
            type="email"
            class="w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <!-- Verification Code Sent Notification -->
        <div v-if="step === 2" class="mb-4 text-green-500">
          A verification code has been sent to your email.
        </div>

        <!-- New Password Inputs -->
        <div v-if="step === 3">
          <div class="mb-4">
            <label
              for="newPassword"
              class="block text-sm font-medium text-gray-700"
              >New Password</label
            >
            <input
              v-model="newPassword"
              id="newPassword"
              type="password"
              class="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="repeatPassword"
              class="block text-sm font-medium text-gray-700"
              >Repeat New Password</label
            >
            <input
              v-model="repeatPassword"
              id="repeatPassword"
              type="password"
              class="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <!-- Success -->
        <div v-if="step === 4" class="mb-4 text-green-500">
          Password has been reset successfully.
        </div>

        <!-- Submit Button -->
        <button
          v-if="step !== 2 && step !== 4"
          :disabled="authStore.loading"
          type="submit"
          class="w-full text-white flex justify-center items-center gap-2 py-2 px-4 rounded"
          :class="
            authStore.loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
          "
        >
          <span
            v-if="authStore.loading"
            class="loading loading-spinner loading-sm"
          ></span>
          <div>
            {{
              step === STEP_ONE ? "Send Verification Code" : "Reset Password"
            }}
          </div>
        </button>
      </form>
      <div
        v-if="authStore.error"
        class="p-4 mt-5 text-red-800 bg-red-100 rounded-lg"
      >
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>
