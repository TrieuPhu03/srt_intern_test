import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "@/types/api";

export type ApiClientError = {
  success: false;
  message: string;
  error?: ApiError;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<ApiClientError>) => {
    const fallbackError: ApiClientError = {
      success: false,
      message: "Request failed. Please try again.",
      error: {
        code: "REQUEST_FAILED",
        details: error.response?.data ?? error.message,
      },
    };

    return Promise.reject(error.response?.data ?? fallbackError);
  },
);
