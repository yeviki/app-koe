<!-- components/DataTable.vue -->
<template>
  <div>

    <!-- SEARCH + PERPAGE -->
    <div v-if="searchable" class="mb-4 flex justify-between items-center">

      <!-- PERPAGE -->
      <select
        v-model.number="localPerPage"
        :class="[
          'block w-15 rounded-full px-2 py-1 text-xs font-medium transition-colors',
          theme === 'dark'
            ? 'bg-slate-900 text-gray-200 border border-gray-700'
            : 'bg-white text-gray-700 border border-gray-300'
        ]"
      >
        <option v-for="n in [5,10,25,50,100]" :key="n" :value="n">{{ n }}</option>
      </select>

      <!-- SEARCH -->
      <input
        v-model="localSearch"
        placeholder="Cari data…"
        :class="[
          'block w-60 rounded-full px-3 py-1 text-sm outline-1 -outline-offset-1 transition-colors',
          theme === 'dark'
            ? 'bg-slate-800 text-gray-100 placeholder-gray-400 outline-gray-700 focus:outline-indigo-600'
            : 'bg-white text-gray-900 placeholder-gray-400 outline-gray-300 focus:outline-indigo-600'
        ]"
      />
    </div>

    <!-- TABLE WRAPPER -->
    <div
      :class="[
        'overflow-hidden shadow ring-1 ring-opacity-5 md:rounded-lg transition-colors',
        theme === 'dark'
          ? 'ring-gray-700 bg-slate-900'
          : 'ring-black bg-white'
      ]"
    >
      <table class="min-w-full divide-y"
        :class="theme === 'dark' ? 'divide-gray-700' : 'divide-gray-300'"
      >
        <!-- HEADER -->
        <thead
          :class="[
            'transition-colors',
            theme === 'dark'
              ? 'bg-slate-800 text-gray-100'
              : 'bg-gray-50 text-gray-900'
          ]"
        >
          <tr>
            <th
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
            >
              No
            </th>

            <th
              v-for="col in dataColumns"
              :key="col.key"
              @click="col.key !== 'actions' && toggleSort(col.key)"
              class="px-3 py-3.5 text-left text-sm font-semibold cursor-pointer select-none"
            >
              <span>{{ col.label }}</span>

              <span v-if="col.key === sortBy">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody
          :class="[
            'divide-y transition-colors',
            theme === 'dark'
              ? 'divide-gray-700 bg-slate-900'
              : 'divide-gray-200 bg-white'
          ]"
        >
          <tr
            v-for="(row, index) in paginated"
            :key="row.id"
            class="transition"
          >
            <!-- NO -->
            <td
              class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
              :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'"
            >
              {{ startIndex + index + 1 }}
            </td>

            <!-- DYNAMIC COLUMNS -->
            <td
              v-for="col in dataColumns"
              :key="col.key"
              class="whitespace-nowrap px-3 py-4 text-sm"
              :class="theme === 'dark' ? 'text-gray-300' : 'text-gray-700'"
            >
              <!-- SLOT -->
              <slot
                v-if="col.slot"
                :name="col.slot"
                :row="row"
              />

              <!-- NORMAL FIELD -->
              <span v-else>
                {{ row[col.key] }}
              </span>
            </td>
          </tr>

          <!-- NO DATA -->
          <tr v-if="filtered.length === 0">
            <td
              :colspan="dataColumns.length + 1"
              class="px-6 py-4 text-center"
              :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'"
            >
              Tidak ada data ditemukan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div v-if="paginated.length" class="flex justify-between items-center mt-6">

      <!-- INFO -->
      <div
        class="text-xs"
        :class="theme === 'dark' ? 'text-gray-300' : 'text-gray-600'"
      >
        Menampilkan {{ paginated.length }} dari {{ filtered.length }} data
      </div>

      <div class="flex items-center space-x-2">

        <!-- BUTTON TEMPLATE -->
        <template v-for="btn in paginationButtons" :key="btn.label + '-' + Math.random()">

          <!-- NORMAL BUTTON -->
          <button
            v-if="btn.type === 'button'"
            @click="btn.action && btn.action()"
            :disabled="btn.disabled"
            :class="[
              'px-3 py-1.5 rounded-full text-xs transition-all border shadow-sm active:scale-95',
              btn.disabled
                ? 'opacity-30 cursor-not-allowed'
                : '',
              theme === 'dark'
                ? btn.active
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-slate-800 text-gray-200 border-slate-700 hover:bg-slate-700 hover:shadow-md'
                : btn.active
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:shadow-md'
            ]"
          >
            {{ btn.label }}
          </button>

          <!-- DOTS -->
          <span
            v-if="btn.type === 'dots'"
            :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'"
            class="px-2 select-none"
          >
            …
          </span>

        </template>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

/* PROPS */
const props = defineProps({
  rows: Array,
  columns: Array,
  searchable: Boolean,
  sortable: Boolean,
  paginated: Boolean,
  perPage: { type: Number, default: 5 },
  search: String,
  page: Number,
  sortBy: String,
  sortDir: String,

  /* THEME */
  theme: String
});

/* EMIT */
const emit = defineEmits([
  "update:search",
  "update:page",
  "update:sortBy",
  "update:sortDir",
  "update:perPage",
]);

/* LOCAL STATES */
const localSearch = ref(props.search ?? "");
const localPage = ref(props.page ?? 1);
const localPerPage = ref(props.perPage);

/* SYNC PARENT */
watch(localSearch, (v) => emit("update:search", v));

/* keep localPage in sync with parent props.page (parent can change page externally) */
watch(
  () => props.page,
  (v) => {
    // if parent changed page, reflect locally
    if (typeof v === "number" && v !== localPage.value) localPage.value = v;
  }
);

/* when localPage changes, notify parent */
watch(localPage, (v) => {
  // guard: avoid emitting invalid numbers
  const pageNum = Number.isFinite(v) ? v : 1;
  emit("update:page", pageNum);
});

/* perPage sync */
watch(localPerPage, (v) => {
  emit("update:perPage", v);
  // when perPage changes, reset to page 1
  localPage.value = 1;
});

/* COLUMNS */
const dataColumns = computed(() => props.columns);

/* FILTER SEARCH */
const filtered = computed(() => {
  if (!localSearch.value) return props.rows ?? [];
  return (props.rows ?? []).filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(localSearch.value.toLowerCase())
  );
});

/* SORT */
const toggleSort = (key) => {
  if (!props.sortable) return;

  const newDir =
    props.sortBy === key
      ? props.sortDir === "asc"
        ? "desc"
        : "asc"
      : "asc";

  emit("update:sortBy", key);
  emit("update:sortDir", newDir);
};

const sorted = computed(() => {
  if (!props.sortable || !props.sortBy) return filtered.value;

  return [...filtered.value].sort((a, b) => {
    let x = a[props.sortBy];
    let y = b[props.sortBy];

    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();

    if (x < y) return props.sortDir === "asc" ? -1 : 1;
    if (x > y) return props.sortDir === "asc" ? 1 : -1;
    return 0;
  });
});

/* PAGINATION */
const totalPages = computed(() =>
  Math.max(1, Math.ceil(sorted.value.length / localPerPage.value))
);

/* If parent side requests non-paginated, just return full */
const paginated = computed(() => {
  if (!props.paginated) return sorted.value;

  // ensure current localPage is within bounds
  const currentPage = Math.max(1, Math.min(localPage.value, totalPages.value));
  const start = (currentPage - 1) * localPerPage.value;
  return sorted.value.slice(start, start + localPerPage.value);
});

const startIndex = computed(
  () => (Math.max(1, localPage.value) - 1) * localPerPage.value
);

/* If totalPages decreased (e.g. after deletion), make sure we move to last available page */
watch(
  () => totalPages.value,
  (tp) => {
    // if current page exceeds total pages, set to last page
    if (localPage.value > tp) {
      localPage.value = tp === 0 ? 1 : tp;
      // watcher on localPage will emit update:page
    }
  }
);

/* BUTTON LOGIC — CLEAN */
const paginationButtons = computed(() => {
  const buttons = [];

  const total = totalPages.value;
  const current = localPage.value;

  // First
  buttons.push({
    type: "button",
    label: "«",
    action: () => (localPage.value = 1),
    disabled: current === 1,
  });

  // Prev
  buttons.push({
    type: "button",
    label: "‹",
    action: () => (localPage.value = Math.max(1, current - 1)),
    disabled: current === 1,
  });

  // Pages
  const temp = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) temp.push(i);
  } else if (current <= 3) {
    temp.push(1, 2, 3, "...", total);
  } else if (current >= total - 2) {
    temp.push(1, "...", total - 2, total - 1, total);
  } else {
    temp.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  temp.forEach((p) => {
    if (p === "...") {
      buttons.push({ type: "dots", label: "dots" });
    } else {
      buttons.push({
        type: "button",
        label: p,
        active: p === current,
        action: () => (localPage.value = p),
      });
    }
  });

  // Next
  buttons.push({
    type: "button",
    label: "›",
    action: () => (localPage.value = Math.min(total, current + 1)),
    disabled: current === total,
  });

  // Last
  buttons.push({
    type: "button",
    label: "»",
    action: () => (localPage.value = total),
    disabled: current === total,
  });

  return buttons;
});
</script>
