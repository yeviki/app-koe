<!-- layouts/DashboardLayout.vue -->
<template>
  <div
    class="h-screen overflow-hidden relative transition-colors duration-300"
    :class="theme === 'dark'
      ? 'bg-slate-900 text-gray-100'
      : 'bg-gray-50 text-gray-800'"
  >
    <!-- MOBILE OVERLAY -->
    <div
      v-if="isMobile && sidebarOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- SIDEBAR (FIXED – TIDAK IKUT FLEX) -->
    <Sidebar
      class="fixed inset-y-0 left-0 z-40 transition-all duration-300"
      :class="[
        collapsed ? 'w-20' : 'w-64',
        isMobile
          ? sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          : 'translate-x-0'
      ]"
      :collapsed="collapsed"
      :theme="theme"
      :menu="menu"
      @toggleTheme="toggleTheme"
      @toggleCollapse="toggleCollapse"
      @closeMobile="closeSidebar"
    />

    <!-- MAIN AREA -->
    <div
      class="flex flex-col h-full transition-all duration-300"
      :style="{
        marginLeft: !isMobile
          ? collapsed
            ? '5rem'   // w-20
            : '16rem'  // w-64
          : '0'
      }"
    >
      <!-- TOPBAR -->
      <Topbar
        :theme="theme"
        :user="auth.user"
        :notificationsCount="notificationsCount"
        :userNavigation="userNavigation"
        :roleName="auth.user?.roles_name"
        :isMobile="isMobile"
        @logout="logout"
        @openSidebarMobile="openSidebar"
      />

      <!-- CONTENT -->
      <main
        class="p-4 sm:p-6 lg:p-8
               h-[calc(100vh-4rem)]
               overflow-y-auto transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-900 text-gray-100'
          : 'bg-gray-50 text-gray-800'"
      >
        <router-view :theme="theme" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";

import * as Icons from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

/* ======================================
   THEME
====================================== */
const theme = ref(localStorage.getItem("theme") || "dark");
const collapsed = ref(false);

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
};

watch(
  () => theme.value,
  (val) => document.documentElement.classList.toggle("dark", val === "dark"),
  { immediate: true }
);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

/* ======================================
   RESPONSIVE
====================================== */
const isMobile = ref(false);
const sidebarOpen = ref(false);

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024;
  if (!isMobile.value) sidebarOpen.value = false;
};

const openSidebar = () => {
  if (isMobile.value) sidebarOpen.value = true;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

/* ======================================
   MENU DINAMIS
====================================== */
const resolveIcon = (name) => Icons[name] ?? Icons.Menu;

function buildTree(menuList) {
  const map = {};
  const roots = [];

  menuList.forEach((m) => {
    map[m.id_menu] = {
      id: m.id_menu,
      label: m.title_menu,
      path: m.url_menu,
      icon: resolveIcon(m.icon_menu),
      children: [],
    };
  });

  menuList.forEach((m) => {
    if (m.parent_id) {
      map[m.parent_id]?.children.push(map[m.id_menu]);
    } else {
      roots.push(map[m.id_menu]);
    }
  });

  return roots;
}

const menu = ref([]);

onMounted(async () => {
  if (!auth.user) await auth.loadToken();
  if (Array.isArray(auth.menu)) {
    menu.value = buildTree(auth.menu);
  }
});

/* ======================================
   USER
====================================== */
const notificationsCount = ref(3);

const userNavigation = [
  { name: "Profile", action: () => router.push("/profile") },
  { name: "Settings", action: () => router.push("/settings") },
];

const logout = () => auth.logout();
</script>
