if (!valid) {
    // simpan login gagal
    await User.saveLoginHistory(user.id, "failed", req, identifier);

    const now = new Date();
    const resetMinutes = 10;       // reset total gagal setelah 10 menit
    const baseLockMinutes = 5;     // durasi blokir dasar per percobaan mulai dari 5 menit

    // ambil waktu login gagal terakhir
    const [lastRow] = await User.getLastFailedLogin(user.id);
    const lastFailTime = lastRow[0] ? new Date(lastRow[0].login_time) : null;

    let failCount = 0;

    if (lastFailTime && (now - lastFailTime) / 1000 / 60 > resetMinutes) {
      // reset total gagal karena sudah lewat X menit
      failCount = 1; // hitungan percobaan saat ini
    } else {
      // hitung total gagal login seperti biasa
      const [rows] = await User.countFailedLogins(identifier, user.id);
      failCount = rows[0].failCount || 0;
    }

    const sisaKesempatan = 10 - failCount;

    // --- BLOKIR PERMANEN ---
    if (failCount >= 10) {
      await User.blockUser(user.id);
      return res.status(403).json({ 
        message: "Akun diblokir karena terlalu banyak percobaan login gagal!, silahkan hubungi admin!" 
      });
    }

    // --- BLOKIR SEMENTARA DARI FAIL 5 KE 9 ---
    if (failCount >= 5 && failCount < 10 && lastFailTime) {
      const blockedMinutes = baseLockMinutes * (failCount - 4); 
      const blockedUntil = new Date(lastFailTime.getTime() + blockedMinutes * 60 * 1000);

      if (now < blockedUntil) {
        // tampilkan countdown sisa waktu
        const remainingSeconds = Math.ceil((blockedUntil - now) / 1000);
        return res.status(403).json({
          message: `Akun sementara terkunci. Silahkan tunggu sampai ${blockedUntil.toLocaleTimeString()} (${blockedMinutes} menit).`,
          blockedUntil: blockedUntil.toISOString(),
          remainingSeconds
        });
      }
    }

    // --- PESAN GAGAL PASSWORD ---
    if (failCount >= 5) {
      return res.status(401).json({ 
        message: `Password salah. Anda sudah ${failCount} kali gagal. Kesempatan tinggal ${sisaKesempatan} kali lagi.` 
      });
    }

    return res.status(400).json({ message: "Password salah!" });
  }

  <script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

// countdown
const blockedUntil = ref(null);
const countdown = ref(0);
let countdownInterval = null;

// toggle password
const showPassword = ref(false);
const togglePassword = () => showPassword.value = !showPassword.value;

const auth = useAuthStore();
const router = useRouter();

// format mm:ss
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// progress bar %
const progressBarWidth = computed(() => {
  if (!blockedUntil.value || countdown.value <= 0) return 0;
  return (countdown.value / totalCountdown.value) * 100;
});

// progress bar color: hijau → kuning → merah
const progressBarColor = computed(() => {
  if (countdown.value / totalCountdown.value > 0.6) return "#16a34a"; // hijau
  if (countdown.value / totalCountdown.value > 0.3) return "#facc15"; // kuning
  return "#dc2626"; // merah
});

// totalCountdown = total detik yang diterima dari backend
const totalCountdown = ref(0);

watch(blockedUntil, (newVal) => {
  clearInterval(countdownInterval);
  if (newVal) {
    totalCountdown.value = Math.floor((new Date(blockedUntil.value) - new Date()) / 1000);
    countdown.value = totalCountdown.value;

    countdownInterval = setInterval(() => {
      const now = new Date();
      const remaining = Math.floor((new Date(blockedUntil.value) - now) / 1000);
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        countdown.value = 0;
        blockedUntil.value = null;
      } else {
        countdown.value = remaining;
      }
    }, 1000);
  }
});

const login = async () => {
  if (countdown.value > 0) {
    error.value = `Akun sementara terkunci. Silakan tunggu ${formatTime(countdown.value)}`;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await auth.login({ email: email.value, password: password.value });
    router.push("/dashboard");
  } catch (err) {
    if (err.response && err.response.data) {
      error.value = err.response.data.message || "Login gagal";
      if (err.response.data.blockedUntil) {
        blockedUntil.value = err.response.data.blockedUntil;
      }
    } else {
      error.value = "Login gagal, silakan coba lagi!";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style>
/* shimmer animasi untuk progress bar */
.shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>