<!-- components/Topbar.vue -->
<template>
  <header
    :class="[
      'h-16 flex items-center justify-between px-6 transition-colors duration-300 border-b shadow-sm backdrop-blur-sm',
      theme === 'dark'
        ? 'bg-slate-900 text-gray-100 border-gray-700/40'
        : 'bg-white text-gray-800 border-gray-300/40'
    ]"
  >
    <!-- LEFT: MOBILE MENU BUTTON -->
    <button
      class="lg:hidden p-2 rounded-lg mr-3"
      @click="$emit('openSidebarMobile')"
      :class="theme === 'dark'
        ? 'text-gray-100 hover:bg-slate-700/50'
        : 'text-gray-800 hover:bg-gray-200/70'"
    >
      <Bars3Icon class="w-6 h-6" />
    </button>

    <!-- Title Section -->
    <div>
      <h1
        :class="[
          'text-xl font-semibold flex flex-col leading-tight',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        ]"
      >
        {{ title }}

        <!-- ★ Added: Display Role Name or Role ID -->
        <span class="text-[11px] text-indigo-500 mt-0.5">
          {{ roleLabel }}
        </span>
      </h1>
    </div>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- 🌐 API Indicator (Neon Glow + Ping Sparkline + Dark Mode) -->
      <ApiIndicator />
      
      <!-- Profile Dropdown -->
      <Menu as="div" class="relative">
        <MenuButton
          :class="[
            'flex items-center space-x-3 rounded-lg px-2 py-1 transition-colors cursor-pointer',
            theme === 'dark'
              ? 'hover:bg-gray-700/60'
              : 'hover:bg-gray-200/60'
          ]"
        >
          <img
            :src="computedAvatar"
            class="w-9 h-9 rounded-full border"
            :class="theme === 'dark' ? 'border-gray-600' : 'border-gray-300'"
          />

          <div class="hidden md:flex flex-col leading-tight text-left">
            <span
              :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'"
              class="text-sm font-medium"
            >
              {{ user?.name }}
            </span>
            <span
              :class="theme === 'dark' ? 'text-gray-300' : 'text-gray-600'"
              class="text-xs"
            >
              {{ user?.email }}
            </span>
          </div>

          <ChevronDownIcon
            class="w-5 h-5"
            :class="theme === 'dark' ? 'text-gray-300' : 'text-gray-500'"
          />
        </MenuButton>

        <!-- DROPDOWN -->
        <transition
          enter-active-class="transition ease-out duration-150"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            :class="[
              'absolute right-0 mt-2 w-48 rounded-md py-2 shadow-lg ring-1 ring-black/10 z-50',
              theme === 'dark'
                ? 'bg-slate-800 text-gray-200'
                : 'bg-white text-gray-700'
            ]"
          >
            <MenuItem
              v-for="item in userNavigation"
              :key="item.name"
              v-slot="{ active }"
            >
              <button
                @click="item.action && item.action()"
                :class="[
                  'w-full text-left px-4 py-2 text-sm',
                  active
                    ? theme === 'dark'
                      ? 'bg-slate-700'
                      : 'bg-gray-100'
                    : ''
                ]"
              >
                {{ item.name }}
              </button>
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <button
                @click="$emit('logout')"
                :class="[
                  'w-full text-left px-4 py-2 text-sm',
                  'text-red-600 dark:text-red-400',
                  active
                    ? theme === 'dark'
                      ? 'bg-slate-700'
                      : 'bg-gray-100'
                    : ''
                ]"
              >
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import ApiIndicator from "./ApiIndicator.vue";

const props = defineProps({
  user: Object,
  userNavigation: Array,
  theme: String,
  roleName: String, // ★ Added
});

/* Avatar Fallback */
const computedAvatar = computed(() =>
  props.user?.name
    ? "https://ui-avatars.com/api/?background=4f46e5&color=fff&name=" +
      encodeURIComponent(props.user.name)
    : "src/assets/logo_koe.png"
);

/* Title from Router meta */
const route = useRoute();
const title = computed(() => route.meta.title || "Dashboard");

/* ★ Generate role label */
const roleLabel = computed(() => {
  if (props.roleName) return props.roleName;
  return "Role ID: " + (props.user?.roles_id ?? "-");
});
</script>
