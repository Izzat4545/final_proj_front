import { getEnv } from "./getEnv";

const BASE_URL = getEnv("VITE_BASE_URL");

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = (isFormData = false) => {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

export const globalPost = async (
  endpoint: string,
  payload: any,
  isFormData = false
) => {
  try {
    const headers: Record<string, string> = {
      ...getHeaders(isFormData),
    };

    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers,
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw (error as Error).message;
  }
};

export const globalPut = async (
  endpoint: string,
  payload: any,
  isFormData = false
) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "PUT",
      headers: getHeaders(isFormData),
      body: isFormData ? payload : JSON.stringify(payload),
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
