<!-- pages/ControlPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Control Management</h1>

      <button
        @click="openAdd"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
      >
        Tambah Control
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
        {{ isEdit ? "Edit Control" : "Tambah Control" }}
      </template>

      <div class="space-y-4">

        <!-- Label Control -->
        <div>
          <label class="text-sm text-gray-200">Label Control</label>
          <input
            v-model="form.label_control"
            placeholder="Masukkan Label Control"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.label_control" class="text-red-500 text-xs mt-1">
            {{ errors.label_control }}
          </p>
        </div>

        <!-- Nama Control -->
        <div>
          <label class="text-sm text-gray-200">Nama Control</label>
          <input
            v-model="form.control_name"
            placeholder="Masukkan Nama Control"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.control_name" class="text-red-500 text-xs mt-1">
            {{ errors.control_name }}
          </p>
        </div>

        <Dropdown
          v-model="form.id_status"
          label="Status"
          url="/master/combo-status"
          label-field="status_name"
          value-field="id"
          placeholder="-- Pilih Status --"
        />
        <!-- <SearchableSelect
          v-model="form.id_status"
          label="Pilih User"
          url="/master/combo-status"
          label-field="status_name"
          value-field="id"
          placeholder="Cari status..."
        /> -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
import { useCrud } from "../composables/useCrud";
import Dropdown from "../components/Dropdown.vue";
import SearchableSelect from "../components/SearchableSelect.vue";

const { theme } = defineProps({ theme: String });

// CRUD roles
const {
  items, form, errors, showModal, isEdit,
  pagination, query, openAdd, openEdit,
  save, remove, load, resetForm
} = useCrud("/control", {
  defaultForm: { id: null, control_name: "", label_control: "", id_status: "" },
  rulesCreate: { 
    control_name: ["required"], 
    label_control: ["required"] 
  },
  rulesUpdate: { 
    control_name: ["required"],
    label_control: ["required"]  
  },

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
  { key: "label_control", label: "Label Control" },
  { key: "control_name", label: "Nama Control" },
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
