// stores/auth.js
import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(payload) {
      try {
        const res = await api.post("/auth/login", payload);

        // Simpan token
        this.token = res.data.token;
        localStorage.setItem("token", this.token);

        // Ambil user fresh dari backend (WAJIB AGAR TOPBAR UPDATE)
        await this.fetchProfile();

      } catch (err) {
        throw err;
      }
    },

    async fetchProfile() {
      const res = await api.get("/auth/me");
      this.user = res.data; // pastikan backend kirim {name, email, avatar}
    },

    async loadToken() {
      if (this.token && !this.user) {
        try {
          await this.fetchProfile();
        } catch (e) {
          this.logout();
        }
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
  },
});
