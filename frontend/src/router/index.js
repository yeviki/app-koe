// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginPage from "../pages/LoginPage.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";

// helper: cek apakah route sudah ada
function routeExists(name) {
  return router.getRoutes().some(r => r.name === name);
}

const routes = [
  // redirect awal
  {
    path: "/",
    redirect: () => {
      const auth = useAuthStore();
      return auth.isLoggedIn ? "/dashboard" : "/login";
    }
  },

  // login
  {
    path: "/login",
    component: LoginPage,
    meta: { guest: true },
  },

  // root layout
  {
    path: "/",
    name: "DashboardRoot",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Flag agar dynamic routes hanya di-load sekali
let isDynamicRouteLoaded = false;

// ====================================================
// ROUTER GUARD
// ====================================================
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // saat refresh → cek token + load user/menu
  await auth.loadToken();

  // =====================================
  // LOAD DYNAMIC ROUTES (HANYA SEKALI)
  // =====================================
  if (auth.isLoggedIn && !isDynamicRouteLoaded) {
    const dynamicRoutes = auth.generateRoutesFromMenu(auth.menuTree);

    dynamicRoutes.forEach((r) => {
      if (!routeExists(r.name)) {
        router.addRoute("DashboardRoot", {
          ...r,
          path: r.path.startsWith("/") ? r.path : "/" + r.path,
        });
      }
    });

    isDynamicRouteLoaded = true;

    // ulangi tujuan setelah route terdaftar
    return next({ ...to, replace: true });
  }

  // =================================
  // BUTUH LOGIN
  // =================================
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  // =================================
  // SUDAH LOGIN, TAPI KE LOGIN PAGE
  // =================================
  if (to.meta.guest && auth.isLoggedIn) {
    return next("/dashboard");
  }

  next();
});

export default router;
