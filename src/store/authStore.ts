// src/stores/auth.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { authTypes } from "../types/authTypes";
import { userType } from "../types/userType";
import { getUserInfo } from "../services/getUserInfo";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<userType | null>(null); // Allows null or userType
  const token = ref<string | null>(localStorage.getItem("token") || null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const BASE_URL = "http://localhost:3000";

  // Actions
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

      const tokenResult: authTypes = await getToken.json();
      if (!getToken.ok && tokenResult.error) {
        error.value = tokenResult.error;
        throw new Error(tokenResult.error);
      }
      token.value = tokenResult.token;

      const getUser = await getUserInfo(BASE_URL, token.value);
      const userResult: userType = await getUser.json();
      user.value = userResult;

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
          repeatPassword,
        }),
      });

      const tokenResult: authTypes = await response.json();
      if (tokenResult.error) {
        error.value = tokenResult.error;
        throw new Error(tokenResult.error);
      }
      token.value = tokenResult.token;

      const getUser = await getUserInfo(BASE_URL, token.value || "");
      const userResult: userType = await getUser.json();
      user.value = userResult;

      // Store token in localStorage
      localStorage.setItem("token", token.value ?? "");
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    // Clear user and token
    user.value = null;
    token.value = null;

    // Remove token from localStorage
    localStorage.removeItem("token");
  };

  const isAuthenticated = () => {
    return !!token.value;
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
  };
});
