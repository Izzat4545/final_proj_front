import { defineStore } from "pinia";
import { ref } from "vue";
import { globalGet, globalPut } from "../utils/networkRequests";
import { UserType } from "../types/userType";
import { notify } from "@kyvg/vue3-notification";

export const useSettings = defineStore("settings", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<UserType | undefined>();
  const updateResult = ref<{ message: string } | undefined>();

  const updateSettings = async (
    oldPassword?: string,
    newPassword?: string,
    newEmail?: string,
    newName?: string,
    currency?: string
  ) => {
    loading.value = true;
    error.value = null;
    const dataToBeUpdated: Partial<{
      oldPassword: string;
      newPassword: string;
      newEmail: string;
      newName: string;
      currency: string;
    }> = {};
    if (oldPassword) dataToBeUpdated.oldPassword = oldPassword;
    if (newPassword) dataToBeUpdated.newPassword = newPassword;
    if (newEmail) dataToBeUpdated.newEmail = newEmail;
    if (newName) dataToBeUpdated.newName = newName;
    if (currency) dataToBeUpdated.currency = currency;
    try {
      const updateUserSettings = await globalPut("settings", dataToBeUpdated);

      if (updateUserSettings.error) {
        error.value = updateUserSettings.error;
        throw new Error(updateUserSettings.error);
      }

      updateResult.value = updateUserSettings;

      notify({
        title: "You have updated successfully",
        type: "success",
      });
    } catch (err) {
      error.value = (err as Error).message || "Fetch failed";
      notify({
        title: "Settings",
        text: error.value,
        type: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  const getUserSettings = async () => {
    loading.value = true;
    error.value = null;
    try {
      const getUserInfo = await globalGet("settings");

      if (getUserInfo.error) {
        error.value = getUserInfo.error;
        throw new Error(getUserInfo.error);
      }
      data.value = getUserInfo;
    } catch (err) {
      error.value = (err as Error).message || "Fetch failed";
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    updateResult,
    loading,
    error,
    updateSettings,
    getUserSettings,
  };
});
