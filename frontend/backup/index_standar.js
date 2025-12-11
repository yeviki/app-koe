import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginPage from "../pages/LoginPage.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import UsersPage from "../pages/UsersPage.vue";
import MenuPage from "../pages/MenuPage.vue";
import RolesPage from "../pages/RolesPage.vue";

const routes = [
  { path: "/", redirect: "/login" },

  {
    path: "/login",
    component: LoginPage,
    meta: { guest: true },
  },

  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", component: () => import("../pages/DashboardHome.vue") },
      { path: "users", component: UsersPage },
      { path: "menu", component: MenuPage },
      { path: "roles", component: RolesPage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// MIDDLEWARE
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // FIX: Pastikan axios punya token setelah refresh
  await auth.loadToken();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  if (to.meta.guest && auth.isLoggedIn) {
    return next("/dashboard");
  }

  next();
});

export default router;
