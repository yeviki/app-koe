<!-- pages/LoginPage.vue -->
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Logo + Title -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-10 w-auto" src="../assets/logo_koe.png" alt="Your Company" />
      <h2 class="mt-1 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>
    
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <!-- GLOBAL MAINTENANCE ALERT -->
      <transition name="fade">
        <div
          v-if="maintenance"
          class="mb-4 rounded-lg bg-yellow-50 border border-yellow-400 text-yellow-800 p-3 text-center font-semibold"
        >
          ⚠ Sistem Maintenance  
          <div class="text-sm font-normal mt-1">{{ maintenanceMessage }}</div>
        </div>
      </transition>

      <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12 relative">
        <!-- ========================= -->
        <!-- API STATUS INDICATOR FIX -->
        <!-- ========================= -->
        <div class="absolute top-3 right-3 group cursor-pointer">

          <!-- BULATAN STATUS -->
          <div
            class="w-4 h-4 rounded-full shadow-md neon-glow transition-all"
            :class="{
              'api-purple': maintenance,
              'api-green': apiConnected && !apiSlow && !maintenance,
              'api-yellow': apiConnected && apiSlow && !maintenance,
              'api-red': !apiConnected && !maintenance
            }"
          ></div>

          <!-- TOOLTIP -->
          <div
            class="absolute right-0 mt-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-xl whitespace-nowrap z-50"
          >
            <!-- Saat Maintenance -->
            <span v-if="maintenance">🟣 Maintenance Mode</span>

            <!-- Normal State -->
            <span v-else-if="!apiConnected">❌ Disconnected</span>
            <span v-else-if="apiSlow">⚠ Slow ({{ pingTime }} ms)</span>
            <span v-else>✅ Connected ({{ pingTime }} ms)</span>
          </div>
        </div>


        <!-- Error Alert + Countdown -->
        <transition name="fade">
          <div v-if="error" class="mb-4 rounded-lg bg-red-50 border border-red-400 text-red-700 p-3 text-center animate-shake">
            <div class="font-medium">{{ error }}</div>

            <div v-if="countdown > 0" class="mt-2">
              <div class="flex justify-between mb-1 text-sm font-mono text-gray-700">
                <span>⏳ Waktu tersisa:</span>
                <span>{{ formatTime(countdown) }}</span>
              </div>
              <div class="w-full h-3 rounded-full overflow-hidden bg-gray-200 relative">
                <div
                  class="h-3 rounded-full absolute top-0 left-0 shimmer"
                  :style="{ width: progressBarWidth + '%', backgroundColor: progressBarColor }"
                ></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Form -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-900">Username or Email address</label>
            <div class="mt-2">
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Masukkan email"
                @keyup.enter="login"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6',
                  isSubmitted && emailError ? 'border-red-500' : 'border-gray-300'
                ]"
              />

            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900">Password</label>
            <div class="mt-2 relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Masukkan password"
                @keyup.enter="login"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-none border placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6',
                  isSubmitted && passwordError ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <button type="button" @click="togglePassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
                  <circle cx="12" cy="12" r="3" stroke-width="1.5" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 3l18 18M10.477 10.44A3 3 0 0113.5 12m4.905 1.447C17.67 16.478 15 19 12 19c-4.478 0-8.268-2.943-9.542-7a11.95 11.95 0 012.676-4.35m3.11-2.229A11.95 11.95 0 0112 5c4.478 0 8.268 2.943 9.542 7a11.93 11.93 0 01-1.38 2.78" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <button @click="login"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="text-white text-xl font-semibold animate-pulse">
      Loading...
    </div>
  </div>

  <!-- ========================= -->
  <!-- MODAL PILIH ROLE (BARU) -->
  <!-- ========================= -->
  <div
    v-if="showRoleModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-[380px]">
      <!-- INFO MESSAGE -->
      <div
        v-if="roles.length > 1"
        class="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md p-3 mb-4 text-center whitespace-pre-line"
      >
        {{ roleInfoMessage }}
      </div>

      <div class="space-y-3 max-h-[260px] overflow-y-auto">
        <div
          v-for="r in roles"
          :key="r.id"
          @click="selectedRole = r"
          class="p-3 border rounded-lg cursor-pointer transition"
          :class="selectedRole?.roles_id === r.roles_id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 hover:bg-gray-100'"
        >
          {{ r.roles_name }}
        </div>
      </div>

      <button
        @click="confirmRole"
        :disabled="!selectedRole"
        class="w-full mt-4 py-2 rounded-md font-semibold text-white shadow-sm transition"
        :class="selectedRole ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-gray-400 cursor-not-allowed'"
      >
        Pilih Group & Lanjut Login
      </button>
    </div>
  </div>

</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../api/axios";

const maintenance = ref(false);
const maintenanceMessage = ref("");

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

const blockedUntil = ref(null);
const countdown = ref(0);
const failCount = ref(0);
let countdownInterval = null;
let totalCountdown = ref(0);
const isSubmitted = ref(false);

const emailError = computed(() => !email.value.trim());
const passwordError = computed(() => !password.value.trim());

// ----- NEW: track single error timeout -----
let errorTimeout = null;

const router = useRouter();
const auth = useAuthStore();

const togglePassword = () => (showPassword.value = !showPassword.value);

// ---- API CONNECTION STATUS ----
const apiConnected = ref(false);
const apiSlow = ref(false);
const pingTime = ref(0);

// adaptive interval
let pingInterval = 3000; 
let timer = null;

const checkApiConnection = async () => {
  const start = performance.now();

  try {
    // 1️⃣ ping
    const pingRes = await api.get("/ping");
    const end = performance.now();

    pingTime.value = Math.round(end - start);
    apiConnected.value = pingRes.status === 200;
    apiSlow.value = apiConnected.value && pingTime.value > 300;

    // interval adaptif
    pingInterval =
      !apiConnected.value ? 2000 :
      apiSlow.value ? 4000 :
      8000;

    // 2️⃣ maintenance status
    const maintenanceRes = await api.get("/system/mode");
    const maintenanceData = maintenanceRes.data;

    maintenance.value = maintenanceData.mode === "maintenance";
    maintenanceMessage.value =
    maintenanceData.message || "Aplikasi sedang dalam mode perawatan";

  } catch (e) {
    apiConnected.value = false;
    apiSlow.value = false;
    pingTime.value = 0;
    pingInterval = 2000;

    console.warn("Polling error:", e?.message || e);
  }

  clearTimeout(timer);
  timer = setTimeout(checkApiConnection, pingInterval);
};


// Bagian alert time salah password
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const progressBarWidth = computed(() => {
  if (!blockedUntil.value || countdown.value <= 0) return 0;
  return (countdown.value / totalCountdown.value) * 100;
});

const progressBarColor = computed(() => {
  if (!totalCountdown.value) return "#16a34a";
  const ratio = countdown.value / totalCountdown.value;
  if (ratio > 0.6) return "#16a34a";
  if (ratio > 0.3) return "#facc15";
  return "#dc2626";
});

// ----- NEW: helper to set error safely -----
const setError = (msg, duration = 5000) => {
  // clear previous timeout
  if (errorTimeout) {
    clearTimeout(errorTimeout);
    errorTimeout = null;
  }

  error.value = msg || "";

  if (msg && duration > 0) {
    const captured = msg;
    errorTimeout = setTimeout(() => {
      // only clear if message unchanged (prevents clearing newer messages)
      if (error.value === captured) {
        error.value = "";
      }
      errorTimeout = null;
    }, duration);
  }
};

const saveBlocked = (emailKey, blockedTime, fail) => {
  localStorage.setItem(`blockedUntil_${emailKey}`, blockedTime);
  localStorage.setItem(`failCount_${emailKey}`, fail);
};

const loadBlocked = (emailKey) => {
  const blocked = localStorage.getItem(`blockedUntil_${emailKey}`);
  const fail = localStorage.getItem(`failCount_${emailKey}`);
  return blocked ? { blocked, fail: parseInt(fail) } : null;
};

const removeBlocked = (emailKey) => {
  localStorage.removeItem(`blockedUntil_${emailKey}`);
  localStorage.removeItem(`failCount_${emailKey}`);
};

const startCountdown = (blockedTime, fail) => {
  blockedUntil.value = blockedTime;
  failCount.value = fail || failCount.value;

  // compute totalCountdown relative to now (ensure non-negative)
  totalCountdown.value = Math.max(
    0,
    Math.floor((new Date(blockedUntil.value) - new Date()) / 1000)
  );
  countdown.value = totalCountdown.value;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const remaining = Math.floor((new Date(blockedUntil.value) - new Date()) / 1000);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      countdown.value = 0;
      blockedUntil.value = null;
      removeBlocked(email.value);

      // gunakan setError (safely) agar tidak menimpa pesan baru
      setError("Akun sudah terbuka, silakan login kembali", 5000);
    } else {
      countdown.value = remaining;
    }
  }, 1000);
};

// saat email berubah: clear interval & timeout & pesan
watch(email, (newEmail) => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (errorTimeout) {
    clearTimeout(errorTimeout);
    errorTimeout = null;
  }

  countdown.value = 0;
  blockedUntil.value = null;
  failCount.value = 0;
  error.value = ""; // reset pesan error saat ganti email

  if (!newEmail) return;

  const data = loadBlocked(newEmail);
  if (data) startCountdown(data.blocked, data.fail);
});

onMounted(() => {
  if (email.value) {
    const data = loadBlocked(email.value);
    if (data) startCountdown(data.blocked, data.fail);
  }

  // cek API pertama kali
  checkApiConnection();
});

const login = async () => {
  isSubmitted.value = true;
  // clear any pending error timeout so server response is shown reliably
  if (errorTimeout) {
    clearTimeout(errorTimeout);
    errorTimeout = null;
  }

  // ---- VALIDASI INPUT ----
  if (!email.value.trim() && !password.value.trim()) {
    setError("Silahkan isi username/email dan password terlebih dahulu");
    return;
  }
  if (!email.value.trim()) {
    setError("Silahkan isi username/email terlebih dahulu");
    return;
  }
  if (!password.value.trim()) {
    setError("Silahkan isi password terlebih dahulu");
    return;
  }
  // -------------------------

  const data = loadBlocked(email.value);
  if (data && countdown.value > 0) {
    setError(`Akun sementara terkunci. Silakan tunggu ${formatTime(countdown.value)}`);
    return;
  }

  loading.value = true;
  setError(""); // clear previous error

  try {
    // PENTING: auth.login kemungkinan mengembalikan axios response
    const res = await auth.login({ email: email.value, password: password.value });

    // normalisasi response: kalau axios -> res.data, kalau store sudah unwrap -> res
    const data = res?.data ?? res;

    // Hapus block jika login sukses (backend mengirim success)
    removeBlocked(email.value);

    // ================
    // CEK MULTI ROLE
    // ================
    if (data?.needSelectRole) {
      roles.value = data.roles || [];        // pastikan roles array
      userId = data.user?.id ?? null;        // simpan user id dari payload
      showRoleModal.value = true;
      loading.value = false;
      return;
    }

    // jika hanya satu role → login langsung, backend mengirim token + user
    if (data?.token) {
      auth.setToken(data.token); // asumsi store menerima token set
      // optionally set user info in store here
    }

    // jika hanya satu role → langsung login
    router.push("/dashboard");
  } catch (err) {
    // selalu gunakan setError sehingga timeout lama tidak menghapus pesan baru
    if (err.response && err.response.data) {
      const serverMsg = err.response.data.message || "Login gagal";
      setError(serverMsg);

      if (err.response.data.blockedUntil) {
        // jika server mengirim info blocked, mulai countdown dan simpan ke localStorage
        startCountdown(err.response.data.blockedUntil, err.response.data.failCount);
        saveBlocked(email.value, err.response.data.blockedUntil, err.response.data.failCount);
      }
    } else {
      setError("Login gagal, silakan coba lagi!");
    }
  } finally {
    loading.value = false;
  }
};

const roleInfoMessage = computed(() => {
  const total = roles.value.length;

  if (total > 1) {
    return `Informasi!\nAnda memiliki ${total} group untuk bisa login, pilih salah satu untuk lanjut.`;
  }

  return "";
});


// ===========================
// Multi Roles Login (BARU)
// ===========================
const showRoleModal = ref(false);
const roles = ref([]);
const selectedRole = ref(null);
let userId = null;

const confirmRole = async () => {
  if (!selectedRole.value) return;

  loading.value = true;
  try {
    const res = await auth.selectRole({
      user_id: userId,
      roles_id: selectedRole.value.roles_id,
    });

    const data = res?.data ?? res;

    // =============================
    // CEK TIDAK ADA ROLE AKTIF
    // =============================
    if (data?.noActiveRole) {
      Swal.fire({
        icon: "warning",
        title: "Akses Ditolak",
        text: data.message || "Tidak ada izin aktif untuk akun Anda"
      });

      loading.value = false;
      return; // stop flow, jangan lanjut ke dashboard
    }

    if (!data || !data.token) {
      throw new Error("Token final tidak diterima dari server");
    }

    // simpan token final
    auth.setToken(data.token);

    // tutup modal & lanjut
    showRoleModal.value = false;
    router.push("/dashboard");
  } catch (e) {
    setError("Gagal memilih role, coba lagi");
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-6px); }
  40%,80% { transform: translateX(6px); }
}
.animate-shake { animation: shake 0.45s; }

/* ==== Indikator Shimmer Pulse ==== */
/* ===== Neon Glow Animation ===== */

/* ============================
   API INDICATOR (FULL VERSION)
   ============================ */

/* Pulse Glow Animation */
@keyframes neonPulse {
  0%   { transform: scale(0.92); filter: drop-shadow(0 0 3px rgba(255,255,255,0.4)); }
  50%  { transform: scale(1.08); filter: drop-shadow(0 0 10px rgba(255,255,255,0.8)); }
  100% { transform: scale(0.92); filter: drop-shadow(0 0 3px rgba(255,255,255,0.4)); }
}

.neon-glow {
  animation: neonPulse 1.6s infinite ease-in-out;
}

/* ===== COLOR STATES ===== */

.api-green {
  background: radial-gradient(circle at center, #4dfd7d, #009944);
  box-shadow: 0 0 3px #00ff66, 0 0 8px #00ff66;
}

.api-yellow {
  background: radial-gradient(circle at center, #ffe97a, #d1a300);
  box-shadow: 0 0 3px #facc15, 0 0 8px #facc15;
}

.api-red {
  background: radial-gradient(circle at center, #ff7a7a, #cc0000);
  box-shadow: 0 0 3px #ff4b4b, 0 0 8px #ff4b4b;
}

.api-purple {
  background: radial-gradient(circle at center, #c07aff, #6a00d1);
  box-shadow: 0 0 3px #ba55ff, 0 0 8px #ba55ff;
}



</style>


