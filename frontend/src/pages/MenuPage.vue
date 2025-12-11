<template>
  <div class="transition-colors duration-300"
    :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">

    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold transition-colors"
        :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Menu</h1>

      <button
        @click="openAddMenu()"
        class="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-xs"
        :class="theme === 'dark' ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-500'"
      >
        Tambah Menu
      </button>
    </div>

    <!-- SEARCH + CONTROLS -->
    <div class="flex items-center mb-4 space-x-2">
      <input
        v-model="query.search"
        placeholder="Cari..."
        class="block rounded-full px-3 py-1 text-xs border transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-gray-800 text-gray-200 border-gray-700'
          : 'bg-white text-gray-900 border-gray-300'"
      />

      <select
        v-model="sortBy"
        class="rounded-full px-2 py-1 border text-xs transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-gray-800 text-gray-200 border-gray-700'
          : 'bg-white text-gray-900 border-gray-300'"
      >
        <option value="id_menu">ID</option>
        <option value="title_menu">Title</option>
        <option value="order_menu">Order</option>
      </select>

      <select
        v-model="sortDir"
        class="rounded-full px-2 py-1 text-xs border transition-colors"
        :class="theme === 'dark'
          ? 'bg-gray-800 text-gray-200 border-gray-700'
          : 'bg-white text-gray-900 border-gray-300'"
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>

      <select
        v-model.number="perPage"
        class="rounded-full px-2 py-1 border ml-auto text-xs font-medium transition-colors"
        :class="theme === 'dark'
          ? 'bg-gray-800 text-gray-200 border-gray-700'
          : 'bg-white text-gray-900 border-gray-300'"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
      </select>
    </div>

    <!-- NESTED TABLE -->
    <div class="overflow-x-auto rounded-md shadow-sm text-sm border transition-colors duration-300"
      :class="theme === 'dark'
        ? 'bg-gray-900 border-gray-700'
        : 'bg-white border-gray-200'"
    >
      <table class="min-w-full divide-y transition-colors"
        :class="theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'"
      >
        <thead :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Title Menu</th>
            <th class="px-4 py-2 text-left">Component</th>
            <th class="px-4 py-2 text-left">Url Menu</th>
            <th class="px-4 py-2 text-left">Icon</th>
            <th class="px-4 py-2 text-left">Order</th>
            <th class="px-4 py-2 text-left">Parent</th>
            <th class="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody class="transition-colors"
          :class="theme === 'dark'
            ? 'bg-gray-900 divide-gray-700'
            : 'bg-white divide-gray-100'"
        >
          <template v-for="(parent, idx) in paginatedParents" :key="parent.id_menu">

            <!-- parent row -->
            <tr :class="theme === 'dark' ? 'bg-gray-900' : 'bg-white'">
              <td class="px-4 py-2">{{ parentIndex(idx) }}</td>
              <td class="px-4 py-2 font-semibold">{{ parent.title_menu }}</td>
              <td class="px-4 py-2">{{ parent.component }}</td>
              <td class="px-4 py-2">{{ parent.url_menu }}</td>
              <td class="px-4 py-2">{{ parent.icon_menu }}</td>
              <td class="px-4 py-2">{{ parent.order_menu }}</td>
              <td class="px-4 py-2">—</td>
              <td class="px-4 py-2">
                <button @click="openEdit(parent)"
                  class="rounded-sm px-2 py-1 text-xs font-semibold text-white ml-2"
                  :class="theme === 'dark'
                    ? 'bg-indigo-700 hover:bg-indigo-600'
                    : 'bg-indigo-600 hover:bg-indigo-500'"
                >
                  Edit
                </button>
                <button @click="openAddSub(parent)"
                  class="rounded-sm px-2 py-1 text-xs font-semibold text-white ml-2"
                  :class="theme === 'dark'
                    ? 'bg-green-700 hover:bg-green-600'
                    : 'bg-green-600 hover:bg-green-500'"
                >
                  Tambah Sub
                </button>
                <button @click="confirmDelete(parent.id_menu)"
                  class="rounded-sm px-2 py-1 text-xs font-semibold text-white ml-2"
                  :class="theme === 'dark'
                    ? 'bg-red-700 hover:bg-red-600'
                    : 'bg-red-600 hover:bg-red-500'"
                >
                  Hapus
                </button>
              </td>
            </tr>

            <!-- children rows -->
            <tr
              v-for="child in childrenOf(parent.id_menu)"
              :key="child.id_menu"
              :class="theme === 'dark' ? 'bg-gray-900' : 'bg-white'"
            >
              <td class="px-4 py-2"></td>
              <td class="px-4 py-2 pl-8">↳ {{ child.title_menu }}</td>
              <td class="px-4 py-2">{{ child.component }}</td>
              <td class="px-4 py-2">{{ child.url_menu }}</td>
              <td class="px-4 py-2">{{ child.icon_menu }}</td>
              <td class="px-4 py-2">{{ child.order_menu }}</td>
              <td class="px-4 py-2">{{ parent.title_menu }}</td>
              <td class="px-4 py-2">
                <button @click="openEdit(child)"
                  class="rounded-sm px-2 py-1 text-xs font-semibold text-white ml-2"
                  :class="theme === 'dark'
                    ? 'bg-indigo-700 hover:bg-indigo-600'
                    : 'bg-indigo-600 hover:bg-indigo-500'"
                >
                  Edit
                </button>
                <button @click="openAddSub(child)"
                  class="rounded-sm px-2 py-1 text-xs font-semibold text-white ml-2"
                  :class="theme === 'dark'
                    ? 'bg-green-700 hover:bg-green-600'
                    : 'bg-green-600 hover:bg-green-500'">
                  Tambah Sub
                </button>
                <button @click="confirmDelete(child.id_menu)"
                  class="rounded-sm px-2 py-1 text-xs font-semibold text-white ml-2"
                  :class="theme === 'dark'
                    ? 'bg-red-700 hover:bg-red-600'
                    : 'bg-red-600 hover:bg-red-500'">
                  Hapus
                </button>
              </td>
            </tr>

          </template>

          <tr v-if="filteredParents.length === 0">
            <td colspan="7" class="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
              Tidak ada data
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-between items-center mt-3">
      <div :class="theme === 'dark' ? 'text-gray-300' : 'text-gray-600'">
        Menampilkan {{ startItem }} - {{ endItem }} dari {{ totalParentCount }} parent
      </div>

      <div class="space-x-2">
        <button
          :disabled="pagination.page === 1"
          @click="pagination.page--"
          class="px-2 py-1 border rounded transition-colors"
          :class="theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-200'
            : 'bg-white border-gray-300 text-gray-800'"
        >
          Prev
        </button>
        <button
          :disabled="pagination.page >= totalPages"
          @click="pagination.page++"
          class="px-2 py-1 border rounded transition-colors"
          :class="theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-gray-200'
            : 'bg-white border-gray-300 text-gray-800'"
        >
          Next
        </button>
      </div>
    </div>

    <!-- MODAL -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>{{ isEdit ? "Edit Menu" : "Tambah Menu" }}</template>

      <div class="space-y-4">

        <!-- parent_id -->
        <div>
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'" >Parent Menu (kosong = parent utama)</label>
          <select
            v-model="form.parent_id"
            class="block w-full rounded-md bg-white text-black dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 text-base border border-gray-300 dark:border-gray-600"
          >
            <option value="">— Tidak ada —</option>
            <option
              v-for="p in parentOptions"
              :key="p.id_menu"
              :value="p.id_menu"
            >
              {{ p.title_menu }}
            </option>
          </select>
        </div>

        <!-- title_menu -->
        <div>
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Title Menu</label>
          <input
            v-model="form.title_menu"
            placeholder="Masukkan title menu"
            class="block w-full rounded-md bg-white text-black dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 text-base border border-gray-300 dark:border-gray-600"
          />
        </div>

        <!-- url_menu -->
        <div>
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Url Menu</label>
          <input
            v-model="form.url_menu"
            placeholder="Masukkan url menu"
            class="block w-full rounded-md bg-white text-black dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 text-base border border-gray-300 dark:border-gray-600"
          />
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Contoh : /dashboard</label>
        </div>

        <!-- url_menu -->
        <div>
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Nama Pages Component</label>
          <input
            v-model="form.component"
            placeholder="Harus sesuai huruf besar dan kecil"
            class="block w-full rounded-md bg-white text-black dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 text-base border border-gray-300 dark:border-gray-600"
          />
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Contoh : UsersPage</label>
        </div>

        <!-- icon_menu -->
        <div>
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Icon Menu</label>
          <input
          v-model="form.icon_menu"
          placeholder="Masukkan icon menu"
          class="block w-full rounded-md bg-white text-black dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 text-base border border-gray-300 dark:border-gray-600"
          />
          <a href="https://lucide.dev/icons/shapes" target="_blank" :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">
            https://lucide.dev/icons/shapes
          </a>
        </div>

        <!-- order_menu -->
        <div>
          <label :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'">Order Menu</label>
          <input
            v-model="form.order_menu"
            placeholder="Masukkan order menu"
            class="block w-full rounded-md bg-white text-black dark:bg-gray-800 dark:text-gray-200 px-3 py-1.5 text-base border border-gray-300 dark:border-gray-600"
          />
        </div>

      </div>

      <template #footer>
        <button
          @click="saveMenu"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Simpan
        </button>
      </template>
    </Modal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
import { useCrud } from "../composables/useCrud";

const { theme } = defineProps({
  theme: String
});

// --- USE CRUD khusus menu, pakai idField 'id_menu' ---
const {
  items,
  form,
  errors,
  showModal,
  isEdit,
  pagination,
  query,
  openAdd: crudOpenAdd,
  openEdit: crudOpenEdit,
  save,
  remove,
  load,
  resetForm,
} = useCrud("/menu", {
  idField: "id_menu",
  defaultForm: {
    id_menu: null,
    parent_id: "",
    title_menu: "",
    url_menu: "",
    icon_menu: "",
    order_menu: "",
    component: "",
  },
  rules: {
    title_menu: ["required"],
    url_menu: ["required"],
    icon_menu: ["required"],
    order_menu: ["required"],
    component: [],
  },
  afterSave: () => {
    Swal.fire({ icon: "success", title: "Berhasil!", timer: 1500, showConfirmButton: false });
  },
  beforeDelete: async (id) => {
    const result = await Swal.fire({
      title: "Hapus Menu?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    return result.isConfirmed;
  },
  afterDelete: () => {
    Swal.fire({ icon: "success", title: "Menu berhasil dihapus", timer: 1500, showConfirmButton: false });
  },
});

// --- SORT & PAGINATION ---
const sortBy = ref("id_menu");
const sortDir = ref("asc");
const perPage = ref(5);

onMounted(load);

const closeModal = () => {
  resetForm();
  showModal.value = false;
};

const confirmDelete = (id) => remove(id);

const parentOptions = computed(() => items.value.filter(i => !i.parent_id || i.parent_id === 0 || i.parent_id === ""));
const parents = computed(() => parentOptions.value);
const childrenOf = (parentId) => items.value.filter(i => String(i.parent_id) === String(parentId)).sort((a,b) => a.order_menu - b.order_menu);

// SEARCH + SORT + PAGINATION CLIENT-SIDE
const filteredParents = computed(() => {
  const s = (query.search || "").toString().toLowerCase().trim();
  let arr = parents.value.slice();
  if (s) arr = arr.filter(p => {
    const inParent = (p.title_menu || "").toLowerCase().includes(s) || (p.url_menu || "").toLowerCase().includes(s);
    const hasChild = items.value.some(c => String(c.parent_id) === String(p.id_menu) && ((c.title_menu||"").toLowerCase().includes(s) || (c.url_menu||"").toLowerCase().includes(s)));
    return inParent || hasChild;
  });
  arr.sort((a,b) => {
    const key = sortBy.value || "id_menu";
    const A = (a[key] ?? "").toString().toLowerCase();
    const B = (b[key] ?? "").toString().toLowerCase();
    return sortDir.value === "asc" ? (A>B?1:A<B?-1:0) : (A<B?1:A>B?-1:0);
  });
  return arr;
});

const totalParentCount = computed(() => filteredParents.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(filteredParents.value.length / perPage.value)));
if (!pagination.page) pagination.page = 1;
const paginatedParents = computed(() => {
  if (pagination.page > totalPages.value) pagination.page = totalPages.value;
  const start = (pagination.page-1)*perPage.value;
  return filteredParents.value.slice(start, start+perPage.value);
});
const startItem = computed(() => totalParentCount.value === 0 ? 0 : (pagination.page-1)*perPage.value+1);
const endItem = computed(() => Math.min(pagination.page*perPage.value, totalParentCount.value));
const parentIndex = (idx) => (pagination.page-1)*perPage.value + idx + 1;

// --- OPEN ADD ---
const openAddMenu = () => {
  resetForm();
  form.parent_id = "";
  isEdit.value = false;
  showModal.value = true;
};

// --- OPEN ADD SUB MENU ---
const openAddSub = (row) => {
  resetForm();
  form.parent_id = row.id_menu;
  isEdit.value = false;
  showModal.value = true;
};

// --- OPEN EDIT ---
const openEdit = (row) => {
    // pastikan parent_id kosong menjadi string ""
  const rowCopy = { ...row, parent_id: row.parent_id || "" };
  crudOpenEdit(rowCopy);// pakai composable
};

// --- SAVE MENU ---
const saveMenu = async () => {
  await save(); // pakai useCrud save
};
</script>

<style scoped>
.pl-8 { padding-left: 2rem; }
</style>
