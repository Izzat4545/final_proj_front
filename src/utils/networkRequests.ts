import { getEnv } from "./getEnv";

const BASE_URL = getEnv("VITE_BASE_URL");

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
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
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
