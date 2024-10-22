import { getEnv } from "./getEnv";
import Cookies from "js-cookie";

const BASE_URL = getEnv("VITE_BASE_URL");

const getAuthToken = () => {
  return Cookies.get("token");
};

const getHeaders = (isFormData = false) => {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
};

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

const request = async (
  method: RequestMethod,
  endpoint: string,
  payload: any = null,
  params: Record<string, any> = {},
  isFormData = false
) => {
  try {
    const url = new URL(`${BASE_URL}/${endpoint}`);

    if (method === "GET" && params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    const options: RequestInit = {
      method,
      headers: getHeaders(isFormData),
    };

    if (["POST", "PUT", "DELETE"].includes(method) && payload) {
      options.body = isFormData ? payload : JSON.stringify(payload);
    }

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error: ${data.error}`);
    }

    return data;
  } catch (error) {
    console.error(`${method} request error:`, error);
    throw error;
  }
};

export const globalGet = (endpoint: string, params = {}) =>
  request("GET", endpoint, null, params);

export const globalPost = (
  endpoint: string,
  payload: any,
  isFormData = false
) => request("POST", endpoint, payload, {}, isFormData);

export const globalPut = (endpoint: string, payload: any, isFormData = false) =>
  request("PUT", endpoint, payload, {}, isFormData);

export const globalDelete = (endpoint: string, payload?: any) =>
  request("DELETE", endpoint, payload);
