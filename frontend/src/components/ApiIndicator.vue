<template>
  <div class="flex items-center fade-in space-x-3">

    <!-- RIGHT SIDE (SPARKLINE CARD) -->
    <div
      v-if="pingHistory.length > 1"
      class="sparkline-card rounded-md p-2 transition-all duration-300 flex items-center justify-center"
      :class="cardThemeClass"
      style="height: 32px;"
    >
      <svg :width="70" :height="24" class="sparkline">
        <polyline
          :points="sparklinePoints"
          fill="none"
          :style="{ stroke: sparklineColor }"
          stroke-width="2"
        />
        <text
          x="44"
          y="7"
          font-size="8"
          :fill="theme === 'dark' ? '#ddd' : '#444'"
        >
          {{ bandwidth }} kbps
        </text>
      </svg>
    </div>

    <!-- LEFT SIDE (STATUS + LASTPING) -->
    <div class="flex flex-col justify-center leading-none" style="height: 28px;">

      <!-- Status Bulat -->
      <div
        class="relative w-12 h-4 rounded-full transition-all duration-300"
        :class="[statusColor, neonGlow, isDisconnected ? 'shake' : '']"
        :title="tooltipText"
      >
        <div
          class="absolute inset-0 rounded-full opacity-70"
          :class="innerGlow"
        ></div>
      </div>

      <!-- Last Ping -->
      <span
        class="text-xs mt-1 block transition-colors duration-300"
        :class="[pingTextColor, theme === 'dark' ? 'dark:text-gray-200' : '']"
        >
        {{ lastPing }} ms
      </span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios.js";

const props = defineProps({
  theme: { type: String, default: "light" },
  rgbMode: { type: Boolean, default: false }  // NEW
});

const cardThemeClass = computed(() => {
  if (props.rgbMode) {
    return `border border-transparent bg-gradient-to-r from-transparent`
  }

  return props.theme === "dark"
    ? "bg-black/30 backdrop-blur-md border border-white/10 shadow-lg"
    : "bg-white/60 backdrop-blur-md border border-gray-300 shadow";
});

const lastPing = ref(0);
const pingHistory = ref([]);
const status = ref("checking");

const pingTextColor = computed(() => ({
  connected: "text-green-400",
  slow: "text-yellow-300",
  disconnected: "text-red-400",
  checking: "text-gray-400",
}[status.value]));


let interval = 2000;
let timer = null;

// Adaptive interval
function setAdaptiveInterval() {
  clearInterval(timer);
  if (status.value === "connected") interval = 4000;
  else if (status.value === "slow") interval = 2000;
  else interval = 1000;
  timer = setInterval(checkPing, interval);
}

// Bandwidth
const lastBytes = ref(0);
const bandwidth = ref(0);

// Ping checker
async function checkPing() {
  const start = performance.now();

  try {
    const res = await api.get("/ping");
    const ping = Math.round(performance.now() - start);

    const size = JSON.stringify(res.data).length;
    const bytesPerSec = Math.abs(size - lastBytes.value);
    lastBytes.value = size;
    bandwidth.value = Math.round((bytesPerSec * 8) / 1024);

    lastPing.value = ping;
    pingHistory.value.push(ping);
    if (pingHistory.value.length > 20) pingHistory.value.shift();

    status.value = ping < 300 ? "connected" : "slow";

  } catch (e) {
    status.value = "disconnected";
    lastPing.value = 0;
    bandwidth.value = 0;
  }

  setAdaptiveInterval();
}

onMounted(() => {
  checkPing();
});

// UI Logic
const statusColor = computed(() => ({
  connected: "bg-green-500",
  slow: "bg-yellow-400",
  disconnected: "bg-red-500",
  checking: "bg-gray-400",
}[status.value]));

const neonGlow = computed(() => ({
  connected: "shadow-[0_0_4px_1px_rgba(0,255,0,0.45)]",
  slow: "shadow-[0_0_4px_1px_rgba(255,255,0,0.45)]",
  disconnected: "shadow-[0_0_4px_1px_rgba(255,0,0,0.55)]",
  checking: "shadow-none",
}[status.value]));

const innerGlow = computed(() => ({
  connected: "bg-green-400",
  slow: "bg-yellow-400",
  disconnected: "bg-red-400",
  checking: "bg-gray-400",
}[status.value]));

const tooltipText = computed(() => ({
  connected: "🟢 High Connected",
  slow: "🟡 Slow Response",
  disconnected: "🔴 Disconnected",
  checking: "Checking...",
}[status.value]));

// Sparkline
const sparklinePoints = computed(() => {
  const max = Math.max(...pingHistory.value, 50);
  return pingHistory.value
    .map((p, i) => `${i * 3},${24 - (p / max) * 20}`)
    .join(" ");
});

const isDisconnected = computed(() => status.value === "disconnected");

// =======================
// 🌈 RAINBOW RGB MODE
// =======================
const hue = ref(0);
setInterval(() => {
  hue.value = (hue.value + 2) % 360;
}, 100);

function hsvToHex(h, s, v) {
  let f = (n, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b = Math.round(f(1) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
}

// FINAL SPARKLINE COLOR
const sparklineColor = computed(() => {
  if (props.rgbMode) return hsvToHex(hue.value, 1, 1);

  return props.theme === "dark" ? "#ffffff" : "#1f2937";
});
</script>

<style scoped>
/* ==== Fade In ==== */
.fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-3px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==== Shake Animation ==== */
@keyframes shake {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 0); }
  50% { transform: translate(2px, 0); }
  75% { transform: translate(-2px, 0); }
  100% { transform: translate(0, 0); }
}
.shake {
  animation: shake 0.4s ease-in-out infinite;
}

/* Sparkline uses currentColor */
.sparkline {
  color: inherit;
}

.sparkline-card {
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
