<!-- pages/UsersPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Users</h1>

      <button
        @click="openAdd"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
      >
        Tambah User
      </button>
    </div>

    <div
      v-if="appStore.maintenance"
      class="bg-red-600 text-white p-3 rounded mb-3"
    >
      {{ appStore.maintenanceMessage }}
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
    <!-- Slot Roles -->
    <!-- Slot Roles -->
    <template #roles="{ row }">
      <ul class="list-disc pl-5 space-y-1">
        <li v-for="(role, i) in row.roles_name_list" :key="i">
          {{ role }}
        </li>
      </ul>
    </template>


      <!-- Slot Blokir -->
      <template #blokir="{ row }">
        <span
          class="px-2 py-1 rounded text-xs font-semibold text-white"
          :class="row.blokir === 'Ya' ? 'bg-red-500' : 'bg-green-500'"
        >
          {{ row.blokir === 'Ya' ? 'Ya' : 'Tidak' }}
        </span>
      </template>

      <!-- Slot Status -->
      <template #status="{ row }">
        <span
          class="px-2 py-1 rounded text-xs font-semibold text-white"
          :class="row.id_status === 'Aktif' ? 'bg-green-500' : 'bg-yellow-500'"
        >
          {{ row.id_status === 'Aktif' ? 'Aktif' : 'Tidak Aktif' }}
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

    <!-- MODAL -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEdit ? "Edit User" : "Tambah User" }}
      </template>

      <div class="space-y-4">
        <!-- FULLNAME -->
        <div>
          <label class="text-sm text-gray-200">Nama Lengkap</label>
          <input
            v-model="form.fullname"
            placeholder="Masukkan fullname"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.fullname" class="text-red-500 text-xs mt-1">
            {{ errors.fullname }}
          </p>
        </div>

        <!-- USERNAME -->
        <div>
          <label class="text-sm text-gray-200">Username</label>
          <input
            v-model="form.username"
            placeholder="Masukkan username"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">
            {{ errors.username }}
          </p>
        </div>

        <!-- EMAIL -->
        <div>
          <label class="text-sm text-gray-200">Email</label>
          <input
            v-model="form.email"
            placeholder="Masukkan email"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="text-sm text-gray-200">Password</label>
          <input
            v-model="form.password"
            :placeholder="isEdit ? 'Kosongkan jika tidak ingin mengubah' : 'Password'"
            type="password"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">
            {{ errors.password }}
          </p>
        </div>

        <CheckboxGroup
          v-model="form.roles_id"
          label="Pilih Hak Akses"
          url="/master/combo-roles"
          label-field="roles_name"
          value-field="id"
        />

        <!-- BLOKIR -->
        <div>
          <label class="text-sm text-gray-200">Blokir</label>
          <select
            v-model="form.blokir"
            class="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-300"
          >
            <option value="Ya">Ya</option>
            <option value="Tidak">Tidak</option>
          </select>
        </div>

        <!-- STATUS -->
        <div>
          <label class="text-sm text-gray-200">Status</label>
          <select
            v-model="form.id_status"
            class="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-300"
          >
            <option value="Tidak Aktif">Tidak Aktif</option>
            <option value="Aktif">Aktif</option>
          </select>
        </div>
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
import { ref, computed, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
import { useCrud } from "../composables/useCrud";
import CheckboxGroup from "../components/CheckboxGroup.vue";
import { useAuthStore } from "../stores/auth";

const appStore = useAuthStore();

const { theme } = defineProps({
  theme: String
});

const {
  items,
  form,
  errors,
  showModal,
  isEdit,
  pagination,
  query,
  openAdd,
  openEdit,
  save,
  remove,
  load,
  resetForm,
} = useCrud("/users", {
  defaultForm: {
    id: null,
    fullname: "",
    username: "",
    email: "",
    password: "",
    // roles_id: "", //jika menggunakan combobox dropdown biasa
    roles_id: [],   // ✅ harus array
    blokir: "Tidak",
    id_status: "Aktif",
  },
    mapResponse: (rows) => {
    return rows.map((r) => ({
      ...r,

      // untuk FORM checkbox (ID)
      roles_id: r.roles_ids
        ? r.roles_ids.split(",").map(x => parseInt(x))
        : [],

      // untuk TAMPILAN di tabel (Nama Role)
      roles_name_list: r.roles_name
        ? r.roles_name.split(",").map(x => x.trim())
        : []
    }));
  },
  rulesCreate: {
    username: ["required"],
    email: ["required"],
    password: ["required", "min:6"],   // wajib saat tambah
  },

  rulesUpdate: {
    username: ["required"],
    email: ["required"],
    password: [],                     // tidak wajib saat edit
  },

  transformForm: (f) => {
    const payload = { ...f };

    // ✅ normalize roles_id ke array int
    if (Array.isArray(payload.roles_id)) {
      payload.roles_id = payload.roles_id.map(r => parseInt(r));
    }

    // HANYA kirim password jika benar-benar diisi
    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }

    return payload;
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
      title: "User berhasil dihapus",
      timer: 1500,
      showConfirmButton: false,
    });
  },
});

// SORT
const sortBy = ref("id");
const sortDir = ref("asc");

// ADD perPage default = 5
const perPage = ref(5);

// Kolom tabel
const columns = [
  { key: "fullname", label: "Nama Lengkap" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "roles_name_list", label: "Roles", slot: "roles" },
  { key: "blokir", label: "Blokir", slot: "blokir" },
  { key: "id_status", label: "Status", slot: "status" },
  { key: "actions", label: "Action", slot: "actions" },
];

onMounted(load);

// Tutup modal
const closeModal = () => {
  resetForm();
  showModal.value = false;
};

// Hapus user
const confirmDelete = (id) => remove(id);
</script>
