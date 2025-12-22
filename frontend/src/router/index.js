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
// let isDynamicRouteLoaded = false;

// ====================================================
// ROUTER GUARD
// ====================================================
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // =========================
  // LOAD TOKEN & MENU (REFRESH SAFE)
  // =========================
  if (auth.token && !auth.user) {
    try {
      await auth.loadToken();
    } catch (e) {
      auth.logout();
      return next("/login");
    }
  }

  // =========================
  // LOAD DYNAMIC ROUTES
  // =========================
  if (auth.isLoggedIn && !auth.routesLoaded) {
    const routes = auth.generateRoutesFromMenu(auth.menuTree);

    routes.forEach((r) => {
      if (!router.hasRoute(r.name)) {
        router.addRoute("DashboardRoot", r);
      }
    });

    auth.routesLoaded = true;

    // ⚠️ PENTING: ulangi navigasi
    return next({ ...to, replace: true });
  }

  // =========================
  // AUTH GUARD
  // =========================
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  if (to.meta.guest && auth.isLoggedIn) {
    return next("/dashboard");
  }

  next();
});


export default router;
