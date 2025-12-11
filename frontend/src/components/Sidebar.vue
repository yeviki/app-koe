<!-- components/Sidebar.vue -->
<template>
  <aside
    :class="[
      'h-screen overflow-y-auto transition-all duration-300 ease-in-out select-none shadow-sm border-r',
      collapsed ? 'w-20' : 'w-64',
      theme === 'dark'
        ? 'bg-slate-900 border-gray-700/50'
        : 'bg-white border-gray-200/60'
    ]"
  >
    <!-- HEADER -->
    <div
      :class="[
        'flex items-center justify-between h-16 px-4 border-b backdrop-blur-sm',
        theme === 'dark'
          ? 'bg-slate-900/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/60'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <img
          v-if="!collapsed"
          src="../assets/logo_koe.png"
          class="h-8"
        />
        <span
          v-if="!collapsed"
          class="font-semibold text-lg"
          :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-800'"
        >
          Admin Panel
        </span>
      </div>

      <!-- Toggle -->
      <button
        @click="$emit('toggleCollapse')"
        :class="[
          'p-2 rounded-lg transition',
          theme === 'dark'
            ? 'hover:bg-slate-700/60 text-gray-200'
            : 'hover:bg-gray-200/80 text-gray-700'
        ]"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>
    </div>

    <!-- MENU -->
    <nav class="mt-4 space-y-1 px-2">
      <div v-for="m in menu" :key="m.id">
        
        <!-- PARENT WITH CHILDREN -->
        <div v-if="m.children && m.children.length" class="mb-1">
          <button
            @click="toggleParent(m.id)"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all',
              isActive(m.path)
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : theme === 'dark'
                  ? 'text-gray-300 hover:bg-slate-700/70'
                  : 'text-gray-700 hover:bg-gray-200/70'
            ]"
          >
            <div class="flex items-center space-x-3">
              <!-- Parent Icon -->
              <component
                :is="m.icon"
                class="w-5 h-5"
                :class="[
                  isActive(m.path) ? 'text-white' :
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                ]"
              />

              <!-- Label (Hide when collapsed) -->
              <span v-if="!collapsed" class="text-sm font-medium">
                {{ m.label }}
              </span>
            </div>

            <!-- COUNT + ARROW (Hide when collapsed) -->
            <div v-if="!collapsed" class="flex items-center space-x-2">
              <span class="text-xs opacity-70">{{ m.children.length }}</span>
              <ChevronDownIcon
                :class="[
                  'w-4 h-4 transition-transform duration-300',
                  expanded[m.id] ? 'rotate-180' : 'rotate-0'
                ]"
              />
            </div>
          </button>

          <!-- SUBMENU -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[500px] opacity-100"
            leave-from-class="max-h-[500px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div
              v-show="expanded[m.id]"
              class="ml-4 mt-1 space-y-1 overflow-hidden"
            >
              <div
                v-for="child in m.children"
                :key="child.id"
                @click="goChild(child, m.id)"
                :class="[
                  'flex items-center px-3 py-2 cursor-pointer rounded-lg transition-all text-sm',
                  isActive(child.path)
                    ? 'bg-indigo-500 text-white'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-700/70'
                      : 'text-gray-700 hover:bg-gray-200/70'
                ]"
              >
                <!-- Child icon (use its own; fallback to parent icon) -->
                <component
                  :is="child.icon || m.icon"
                  class="w-4 h-4 mr-3"
                />

                <!-- Hide label when collapsed -->
                <span v-if="!collapsed">{{ child.label }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- SINGLE MENU -->
        <div
          v-else
          @click="go(normalize(m.path))"
          :class="[
            'flex items-center px-3 py-2 cursor-pointer rounded-lg transition-all',
            isActive(m.path)
              ? 'bg-indigo-600 text-white'
              : theme === 'dark'
                ? 'text-gray-300 hover:bg-slate-700/70'
                : 'text-gray-700 hover:bg-gray-200/70'
          ]"
        >
          <component :is="m.icon" class="w-5 h-5" />

          <span v-if="!collapsed" class="ml-3 text-sm font-medium">
            {{ m.label }}
          </span>
        </div>
      </div>
    </nav>

    <!-- TOGGLE THEME -->
    <div class="absolute bottom-5 left-0 right-0 flex justify-center">
      <button
        @click="$emit('toggleTheme')"
        class="flex items-center justify-center rounded-lg shadow-sm"
        :class="theme === 'dark' ? 'bg-slate-700 text-gray-100' : 'bg-gray-200 text-gray-900'"
        :style="collapsed ? 'width:44px;height:44px' : ''"
      >
        <span>{{ theme === 'light' ? '🌞' : '🌙' }}</span>
        <span v-if="!collapsed" class="ml-2 text-sm">
          {{ theme === 'light' ? 'Light Mode' : 'Dark Mode' }}
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { reactive, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  collapsed: Boolean,
  theme: String,
  menu: Array,
});

const router = useRouter();
const route = useRoute();

/* Normalize path */
const normalize = (p) => (p?.startsWith("/") ? p : "/" + p);

/* Expanded state stored by parent ID */
const expanded = reactive(JSON.parse(localStorage.getItem("sidebar-expanded") || "{}"));
const saveExpanded = () =>
  localStorage.setItem("sidebar-expanded", JSON.stringify(expanded));

/* Expand according to active route */
const autoExpandRoute = () => {
  const current = normalize(route.path);

  props.menu?.forEach((m) => {
    expanded[m.id] = false;

    m.children?.forEach((c) => {
      if (current.startsWith(normalize(c.path))) {
        expanded[m.id] = true;
      }
    });
  });

  saveExpanded();
};

watch(() => route.path, autoExpandRoute);
watch(() => props.menu, autoExpandRoute, { deep: true });
onMounted(autoExpandRoute);

/* User actions */
const toggleParent = (id) => {
  expanded[id] = !expanded[id];
  saveExpanded();
};

const go = (path) => router.push(path);

const goChild = (child, parentId) => {
  expanded[parentId] = true;
  saveExpanded();
  go(normalize(child.path));
};

const isActive = (p) => route.path.startsWith(normalize(p));
</script>
