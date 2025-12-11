// api/axios.js
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import Swal from "sweetalert2";  // kalau pakai SweetAlert2

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
    const message = error.response?.data?.message;
    const auth = useAuthStore();

    // ============================
    // 🔥 TOKEN EXPIRED / INVALID
    // ============================
    if (status === 401) {
      console.warn("Token expired atau invalid → redirect login");

      auth.logout();
      localStorage.removeItem("token");

      window.location.href = "/login";
      return; // hentikan
    }

    // ============================
    // 🚫 ROLE AKSES DITOLAK
    // ============================
    if (status === 403) {
      console.warn("Akses ditolak (403) tetapi user tetap login");

      Swal.fire({
        icon: "warning",
        title: "Akses Ditolak",
        text: message || "Anda tidak memiliki izin untuk melakukan aksi ini.",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
