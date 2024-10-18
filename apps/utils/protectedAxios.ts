import useUserStore from "@/stores/userStore";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
const BASEURL = "http://localhost:3000";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const instance = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});

export const protectedAxios = axios.create({
  baseURL: BASEURL + "/api",
  withCredentials: true,
});

protectedAxios.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().getAccessToken();

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

protectedAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: CustomAxiosRequestConfig | undefined = error.config;

    if (error?.response?.status === 401 && !originalRequest?._retry) {
      const errorData = error?.response?.data as any;
      const errorMessage = errorData?.message;
      originalRequest!._retry = true;

      try {
        await generateRefreshToken();
        const newAccessToken = useUserStore.getState().getAccessToken();
        originalRequest!.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return protectedAxios(originalRequest!);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const generateRefreshToken = async () => {
  try {
    const refreshAccessToken = useUserStore.getState().onRefresh;
    await refreshAccessToken();
  } catch (error) {
    console.error("refresh error:", error);
  }
};
