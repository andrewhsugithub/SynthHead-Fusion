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
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// protectedAxios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     console.log("error", error);
//     const originalRequest: CustomAxiosRequestConfig | undefined = error.config;
//     console.log("originalRequest", originalRequest);

//     if (error?.response?.status === 401 && !originalRequest?._retry) {
//       const errorData = error?.response?.data as any;
//       const errorMessage = errorData?.message;
//       originalRequest!._retry = true;

//       if (errorMessage === "JwtTokenExpired") {
//         try {
//           // to avoid infinite loop if fetching refresh token fails
//           if (originalRequest?.url !== "/api/auth/refresh") {
//             await generateRefreshToken();
//             return protectedAxios(originalRequest!);
//           }
//         } catch (refreshError) {
//           console.error("Token refresh failed:", refreshError);
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const generateRefreshToken = async () => {
//   try {
//     const refreshAccessToken = useUserStore.getState().onRefresh;
//     await refreshAccessToken();
//   } catch (error: any) {
//     console.error("axios:", error);
//   }
// };
