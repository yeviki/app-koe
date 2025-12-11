<!-- pages/ModulePage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Module Management</h1>

      <button
        @click="openAdd"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
      >
        Tambah Module
      </button>
    </div>

    <!-- DATATABLE -->
    <DataTable
      :theme="theme"
      :rows="items"
      :columns="columns"
      searchable
      sortable
      paginated
      v-model:search="query.search"
      v-model:page="pagination.page"
      :sort-by="sortBy"
      :sort-dir="sortDir"
      @update:sortBy="sortBy = $event"
      @update:sortDir="sortDir = $event"
      v-model:perPage="perPage"
    >

      <!-- Slot Status -->
      <template #status="{ row }">
        <span
          class="px-2 py-1 rounded text-xs font-semibold text-white"
          :class="row.id_status === 1 ? 'bg-green-500' : 'bg-yellow-500'"
        >
          {{ row.id_status === 1 ? 'Aktif' : 'Tidak Aktif' }}
        </span>
      </template>

      <template #actions="{ row }">
        <button 
          @click="openEdit(row)" 
          class="rounded-sm bg-indigo-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
        >
          Edit
        </button>
        
        <button 
          @click="confirmDelete(row.id)" 
          class="rounded-sm bg-red-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500"
        >
          Hapus
        </button>
      </template>
    </DataTable>

    <!-- MODAL CRUD -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEdit ? "Edit Module" : "Tambah Module" }}
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-200">Label Module</label>
          <input
            v-model="form.label_module"
            placeholder="Masukkan Label Module"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.label_module" class="text-red-500 text-xs mt-1">
            {{ errors.label_module }}
          </p>
        </div>

        <div>
          <label class="text-sm text-gray-200">Nama Module</label>
          <input
            v-model="form.module_name"
            placeholder="Masukkan Nama Module"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.module_name" class="text-red-500 text-xs mt-1">
            {{ errors.module_name }}
          </p>
        </div>

        <!-- Combobox Select Id Status -->
        <Dropdown
          v-model="form.id_status"
          label="Status"
          url="/master/combo-status"
          label-field="status_name"
          value-field="id"
          placeholder="-- Pilih Status --"
        />

      </div>

      <template #footer>
        <button
          @click="save"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Simpan
        </button>
      </template>
    </Modal>


    <!-- MODAL SET ROLES -->
    <Modal v-if="showAccessModal" @close="showAccessModal = false">
      <template #title> Set Hak Akses Menu </template>

      <div class="space-y-2 max-h-80 overflow-y-auto p-2">

        <template v-for="parent in menuTree" :key="parent.id_menu">

          <!-- PARENT -->
          <div class="font-semibold mt-2">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                :value="parent.id_menu"
                v-model="roleMenus"
                @change="toggleParent(parent.id_menu, parent.children)"
              />
              <span>{{ parent.title_menu }}</span>
            </label>
          </div>

          <!-- CHILDREN -->
          <div
            v-for="child in parent.children"
            :key="child.id_menu"
            class="ml-6 flex flex-col"
          >
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                :value="child.id_menu"
                v-model="roleMenus"
                @change="updateParent(child)"
              />
              <span>{{ child.title_menu }}</span>
            </label>
          </div>

        </template>

      </div>

      <template #footer>
        <button
          @click="saveAccess"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Simpan Hak Akses
        </button>
      </template>
    </Modal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
import { useCrud } from "../composables/useCrud";
import api from "../api/axios";
import Dropdown from "../components/Dropdown.vue";

const { theme } = defineProps({ theme: String });

const showAccessModal = ref(false);

// CRUD roles
const {
  items, form, errors, showModal, isEdit,
  pagination, query, openAdd, openEdit,
  save, remove, load, resetForm
} = useCrud("/module", {
  defaultForm: { id: null, module_name: "", label_module: "", id_status: "" },
  rulesCreate: { 
    module_name: ["required"], 
    label_module: ["required"], 
    id_status: ["required"] 
  },
  rulesUpdate: { 
    module_name: ["required"],
    label_module: ["required"],
    id_status: ["required"]
  },

  // ⬇ Tambahkan ini
  afterSave: () => {
    Swal.fire({
      icon: "success",
      title: isEdit.value ? "Data berhasil diupdate" : "Data berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });
  },

  beforeDelete: async (id) => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    return result.isConfirmed;
  },

  afterDelete: () => {
    Swal.fire({
      icon: "success",
      title: "Data berhasil dihapus",
      timer: 1500,
      showConfirmButton: false,
    });
  },
});

// SORT
const sortBy = ref("id");
const sortDir = ref("asc");
const perPage = ref(5);

// Table columns
const columns = [
  { key: "label_module", label: "Label Module" },
  { key: "module_name", label: "Nama Module" },
  { key: "id_status", label: "Status", slot: "status" },
  { key: "actions", label: "Action", slot: "actions" },
];

onMounted(load);

// Close modal
const closeModal = () => {
  resetForm();
  showModal.value = false;
};

// Delete
const confirmDelete = (id) => remove(id);
</script>
