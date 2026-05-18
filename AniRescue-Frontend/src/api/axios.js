import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

let refreshRequest = null;

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        refreshRequest =
          refreshRequest ||
          axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            {},
            {
              withCredentials: true,
            },
          );
        const { data } = await refreshRequest;
        refreshRequest = null;
        const nextToken = data?.token || data?.accessToken;
        if (nextToken) {
          useAuthStore.getState().setToken(nextToken);
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        refreshRequest = null;
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
