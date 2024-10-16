import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthTypes } from "../types/authTypes";
import { UserType } from "../types/userType";
import { globalPost } from "../utils/networkRequests";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserType | null>(null);
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const tokenResult: AuthTypes = await globalPost("auth/login", {
        email,
        password,
      });

      if (tokenResult.error) {
        error.value = tokenResult.error;
        throw new Error(tokenResult.error);
      }

      token.value = tokenResult.token;

      localStorage.setItem("token", token.value ?? "");
    } catch (err) {
      error.value = (err as Error).message || "Login failed";
    } finally {
      loading.value = false;
    }
  };

  const register = async (
    email: string,
    password: string,
    repeatPassword: string,
    name?: string
  ) => {
    loading.value = true;
    error.value = null;

    if (password !== repeatPassword) {
      error.value = "Passwords do not match.";
      loading.value = false;
      return;
    }

    try {
      const tokenResult: AuthTypes = await globalPost("auth/register", {
        ...(name ? { name } : {}),
        email,
        password,
      });

      if (tokenResult.error) {
        error.value = tokenResult.error;
        throw new Error(tokenResult.error);
      }
      token.value = tokenResult.token;
      localStorage.setItem("token", token.value ?? "");
    } catch (err) {
      error.value = (err as Error).message || "Registration failed";
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;

    localStorage.removeItem("token");
  };

  const isAuthenticated = () => {
    return !!token.value;
  };

  const requestPasswordReset = async (email: string) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await globalPost("auth/sendCode", { email });
      if (result.error) {
        error.value = result.error || "Failed to send verification code";
        throw new Error(result.error);
      }
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
    } finally {
      loading.value = false;
    }
  };
  const resetPassword = async (
    code: string,
    newPassword: string,
    email: string,
    repeatPassword: string
  ) => {
    loading.value = true;
    error.value = null;

    // Check if passwords match
    if (newPassword !== repeatPassword) {
      error.value = "Passwords do not match.";
      loading.value = false;
      return;
    }

    try {
      const result = await globalPost("auth/resetPassword", {
        code,
        password: newPassword,
        email,
      });
      if (result.error) {
        error.value = result.error || "Failed to reset password";
        throw new Error(result.error);
      }
    } catch (err) {
      error.value = (err as Error).message || "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    setToken,
    requestPasswordReset,
    resetPassword,
  };
});
