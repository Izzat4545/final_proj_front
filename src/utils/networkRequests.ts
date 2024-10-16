import { getEnv } from "./getEnv";

const BASE_URL = getEnv("VITE_BASE_URL");

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const globalGet = async (
  endpoint: string,
  params: Record<string, any> = {}
) => {
  try {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

export const globalPost = async (endpoint: string, payload: any) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok && data.error) {
      throw new Error(`Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

export const globalPut = async (endpoint: string, payload: any) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

export const globalDelete = async (endpoint: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};
