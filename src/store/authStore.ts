import { defineStore } from "pinia";
import { ref } from "vue";
import { authTypes } from "../types/authTypes";
import { userType } from "../types/userType";
import { getEnv } from "../utils/getEnv";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<userType | null>(null);
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

      const tokenResult: authTypes = await getToken.json();
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

      const tokenResult: authTypes = await response.json();
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
  };
});
