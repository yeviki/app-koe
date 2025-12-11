// stores/auth.js
import { defineStore } from "pinia";
import api from "../api/axios";
import router from "../router";

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,

    menu: [],
    menuTree: [],
  }),

  getters: {
    isLoggedIn: (state) => {
      return !!state.token && !isTokenExpired(state.token);
    },
  },

  actions: {
    // ===================================
    // LOGIN (MODIFIED for MULTI ROLES)
    // ===================================
    async login(payload) {
      const res = await api.post("/auth/login", payload);

      // Jika user memiliki banyak role:
      // backend TIDAK mengirim token final
      // tetapi mengirim:
      //    needSelectRole: true
      //    roles: [...]
      //    tempToken: "xxxx"
      if (res.data.needSelectRole) {
        return res.data; // <== LoginPage.vue yg handle modal role
      }

      // Jika user hanya punya 1 role → sama seperti sebelumnya
      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      await this.fetchProfile();
      await this.loadMenu();

      return res.data;
    },

    // ===================================
    // SET TOKEN (BARU, dipakai setelah pilih role)
    // ===================================
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    // ===================================
    // SELECT ROLE (BARU)
    // ===================================
    async selectRole(payload) {
      const res = await api.post("/auth/select-role", payload);

      // Simpan token final setelah role dipilih
      this.setToken(res.data.token);

      // Setelah token valid → ambil profile & menu
      await this.fetchProfile();
      await this.loadMenu();

      return res.data;
    },

    // ===================================
    // FETCH PROFILE
    // ===================================
    async fetchProfile() {
      const res = await api.get("/auth/me");
      this.user = res.data;
    },

    // ===================================
    // MENU TREE BUILDER
    // ===================================
    buildMenuTree(menuList) {
      const map = {};
      const roots = [];

      menuList.forEach(item => {
        map[item.id_menu] = { ...item, children: [] };
      });

      menuList.forEach(item => {
        if (item.parent_id) {
          map[item.parent_id].children.push(map[item.id_menu]);
        } else {
          roots.push(map[item.id_menu]);
        }
      });

      return roots;
    },

    // ===================================
    // GENERATE ROUTES DARI MENU
    // ===================================
    generateRoutesFromMenu(tree) {
      const routes = [];

      tree.forEach(item => {
        if (item.url_menu && item.url_menu !== "#" && item.component) {
          routes.push({
            path: item.url_menu.startsWith("/") ? item.url_menu : "/" + item.url_menu,
            name: item.component,
            component: () => import(`../pages/${item.component}.vue`)
          });
        }

        if (item.children?.length) {
          routes.push(...this.generateRoutesFromMenu(item.children));
        }
      });

      return routes;
    },

    // ===================================
    // LOAD MENU
    // ===================================
    async loadMenu() {
      if (!this.token) return;

      const res = await api.get("/auth/menu");
      this.menu = res.data.menu;

      // bentuk tree sekali saja
      this.menuTree = this.buildMenuTree(this.menu);
    },

    // ===================================
    // LOAD TOKEN (refresh halaman)
    // ===================================
    async loadToken() {
      if (!this.token) return;

      if (isTokenExpired(this.token)) {
        this.logout();
        return;
      }

      if (!this.user) {
        try {
          await this.fetchProfile();
          await this.loadMenu();
        } catch (e) {
          this.logout();
        }
      }
    },

    // ===================================
    // LOGOUT
    // ===================================
    async logout() {
      try {
        if (this.token) {
          await api.post("/auth/logout", {}, {
            headers: { Authorization: `Bearer ${this.token}` }
          });
        }
      } catch (_) {}

      this._clearAuthState();
    },

    // ===================================
    // CLEAR AUTH STATE
    // ===================================
    _clearAuthState() {
      this.user = null;
      this.token = null;
      this.menu = [];
      this.menuTree = [];

      localStorage.removeItem("token");

      // router push aman
      setTimeout(() => {
        router.push("/login");
      }, 50);
    }
  },
});
