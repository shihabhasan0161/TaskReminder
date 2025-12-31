import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constants";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  async (e) => {
    const originalRequest = e.config;

    if (e.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const response = await axios.post(
            `http://localhost:8000/api/auth/token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const { access } = response.data;
          localStorage.setItem(ACCESS_TOKEN, access);
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return api(originalRequest);
        } catch {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(e);
  }
);

export default api;
