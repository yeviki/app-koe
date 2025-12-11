<!-- pages/DashboardHome.vue -->
<template>
  <div>
    <!-- TITLE -->
    <h1
      class="text-3xl font-bold mb-6 transition-colors"
      :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'"
    >
      Selamat Datang
    </h1>

    <!-- 🔔 GLOBAL ANNOUNCEMENT BANNER -->
    <transition name="fade">
      <div
        v-if="appMode === 'maintenance'"
        class="mb-6 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 text-center font-semibold"
      >
        ⚠ Sistem Maintenance
        <div class="text-sm font-normal mt-1">{{ appMessage }}</div>
      </div>
    </transition>

    <!-- DASHBOARD CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- CARD 1 -->
      <div
        class="p-6 rounded-xl shadow transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-800 text-gray-100'
          : 'bg-white text-gray-900'"
      >
        <h2 class="text-xl font-semibold mb-2">Total Users</h2>
        <p class="text-3xl font-bold">{{ stats.users }}</p>
      </div>

      <!-- CARD 2 -->
      <div
        class="p-6 rounded-xl shadow transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-800 text-gray-100'
          : 'bg-white text-gray-900'"
      >
        <h2 class="text-xl font-semibold mb-2">Active Roles</h2>
        <p class="text-3xl font-bold">{{ stats.roles }}</p>
      </div>

      <!-- CARD 3 -->
      <div
        class="p-6 rounded-xl shadow transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-800 text-gray-100'
          : 'bg-white text-gray-900'"
      >
        <h2 class="text-xl font-semibold mb-2">Last Login</h2>
        <p class="text-lg">{{ stats.lastLogin }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";
import Swal from "sweetalert2";

// props
const { theme } = defineProps({
  theme: String
});

// DASHBOARD STATE
const stats = ref({
  users: 0,
  roles: 0,
  lastLogin: "-",
});

// MAINTENANCE STATE (banner)
const appMode = ref("normal");      // "maintenance" | "normal"
const appMessage = ref("");         // pesan dari DB

onMounted(async () => {
  try {
    // =====================================================
    // 1️⃣ CEK STATUS / MODE SISTEM → /system/mode
    // =====================================================
    const modeRes = await api.get("/system/mode");

    appMode.value = modeRes.data.mode;        // normal / maintenance
    appMessage.value = modeRes.data.message;  // pesan custom

    // Jika maintenance → tetap jalankan swal alert
    if (modeRes.data.mode === "maintenance") {
      Swal.fire({
        icon: "warning",
        title: "Aplikasi Dalam Mode Maintenance",
        text: modeRes.data.message || "Beberapa fitur mungkin tidak dapat digunakan.",
        confirmButtonColor: "#d33",
      });
    }

    // =====================================================
    // 2️⃣ AMBIL STATISTIK DASHBOARD
    // =====================================================
    const res = await api.get("/master/stats");
    stats.value = res.data;

  } catch (err) {
    console.error("Dashboard Error:", err);

    Swal.fire({
      icon: "error",
      title: "Gagal Memuat Dashboard",
      text: "Periksa koneksi atau hubungi admin.",
    });
  }
});
</script>
