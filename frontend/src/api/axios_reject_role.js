// api/axios.js
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// ===========================================
// REQUEST INTERCEPTOR
// ===========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===================================================
// RESPONSE INTERCEPTOR
// ===================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const auth = useAuthStore();

    // Pastikan kondisi 401/403 benar
    if (status === 401 || status === 403) {
      
      // bersihkan token melalui Pinia (lebih aman daripada localStorage saja)
      auth._clearAuthState();

      // hindari redirect duplikat
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
