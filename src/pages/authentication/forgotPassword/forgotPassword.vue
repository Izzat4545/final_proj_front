<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../store/authStore";

const authStore = useAuthStore();
const router = useRouter();

const email = ref(localStorage.getItem("email") || "");
const newPassword = ref("");
const repeatPassword = ref("");
const step = ref(1);

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    step.value = 3;
  }
});
const handleSubmit = async () => {
  try {
    if (step.value === 1) {
      // Request password reset link
      await authStore.requestPasswordReset(email.value);

      if (!authStore.error) {
        step.value = 2;
        localStorage.setItem("email", email.value);
      }
    } else if (step.value === 3) {
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
        step.value = 4;
        router.push("/login");
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
          class="w-full text-white py-2 px-4 rounded"
          :class="
            authStore.loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
          "
        >
          <div v-if="authStore.loading">Loading..</div>
          <div v-else>
            {{ step === 1 ? "Send Verification Code" : "Reset Password" }}
          </div>
        </button>
      </form>
    </div>
  </div>
</template>
