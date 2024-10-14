import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthTypes } from "../types/authTypes";
import { UserType } from "../types/userType";
import { getEnv } from "../utils/getEnv";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<UserType | null>(null);
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const BASE_URL = getEnv("VITE_BASE_URL");

  const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const getToken = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const tokenResult: AuthTypes = await getToken.json();
      if (!getToken.ok && tokenResult.error) {
        error.value = tokenResult.error;
        throw new Error(tokenResult.error);
      }
      token.value = tokenResult.token;

      // Store token in localStorage
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
      const response = await fetch(BASE_URL + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(name ? { name } : {}),
          email,
          password,
        }),
      });

      const tokenResult: AuthTypes = await response.json();
      if (tokenResult.error) {
        error.value = tokenResult.error;
        throw new Error(tokenResult.error);
      }
      token.value = tokenResult.token;

      // Store token in localStorage
      localStorage.setItem("token", token.value ?? "");
    } catch (err) {
      error.value = (err as Error).message;
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
    console.log(error.value);
    try {
      const response = await fetch(BASE_URL + "/auth/sendCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
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

    if (newPassword !== repeatPassword) {
      error.value = "Passwords do not match.";
      loading.value = false;
      return;
    }

    try {
      const response = await fetch(BASE_URL + `/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, password: newPassword, email }),
      });

      const result = await response.json();
      if (!response.ok) {
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
