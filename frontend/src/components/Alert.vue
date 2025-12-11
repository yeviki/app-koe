<!-- components/Alert.vue -->
<template>
  <div
    v-if="message"
    :class="[
      'p-3 rounded-lg font-medium text-white flex items-center gap-2 mb-4',
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    ]"
  >
    <i :class="icon"></i>
    <span>{{ message }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

defineProps({
  message: String,
  type: {
    type: String,
    default: "success",
  },
});

const icon = computed(() =>
  ({
    error: "fas fa-exclamation-circle",
    success: "fas fa-check-circle",
  }[type])
);
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");
</style>
