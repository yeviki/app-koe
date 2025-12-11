<!-- pages/RolesPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Roles Management</h1>

      <div class="flex items-center gap-4">

        <!-- 🔥 Toggle Maintenance -->
        <label class="relative inline-flex items-center cursor-pointer select-none">

          <!-- Toggle background -->
          <div
            class="group relative inline-flex w-16 h-7 shrink-0 rounded-full p-0.5
                  bg-gray-300 transition-all duration-300
                  has-checked:bg-green-500"
          >

            <!-- Handle + Text -->
            <span
              class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md
                    ring-1 ring-black/10 flex items-center justify-center text-[9px] font-bold
                    transition-all duration-300 select-none
                    group-has-checked:translate-x-9"
            >
              <!-- OFF text -->
              <span
                class="absolute transition-opacity duration-200
                      group-has-checked:opacity-0"
              >
                OFF
              </span>

              <!-- ON text -->
              <span
                class="absolute opacity-0 text-green-600 transition-opacity duration-200
                      group-has-checked:opacity-100"
              >
                ON
              </span>
            </span>

            <!-- Checkbox -->
            <input
              type="checkbox"
              class="absolute inset-0 appearance-none"
              v-model="maintenanceMode"
              @change="toggleMaintenance"
            />
          </div>
        </label>

        <!-- Tombol Tambah -->
        <button
          @click="openAdd"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
        >
          Tambah Roles
        </button>

      </div>
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
      <template #actions="{ row }">
        <!-- Setting Role Akses Menu -->
        <button 
          @click="openDetail(row)" 
          class="rounded-sm bg-yellow-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-yellow-500"
        >
          Set Roles Menu
        </button>

        
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
    
        <!-- Setting Permission Akses Control -->
        <button 
          @click="openDetailPermission(row)" 
          class="rounded-sm bg-green-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-green-500"
        >
          Set Permission
        </button>
        
      </template>
    </DataTable>

    <!-- MODAL CRUD -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEdit ? "Edit Roles" : "Tambah Roles" }}
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-200">Nama Roles</label>
          <input
            v-model="form.roles_name"
            placeholder="Masukkan Nama Roles"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.roles_name" class="text-red-500 text-xs mt-1">
            {{ errors.roles_name }}
          </p>
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

    <!-- /////////////////////////////////////////////////////////////////////////////// -->
    <!-- Modal Roles Permission -->
    <!-- /////////////////////////////////////////////////////////////////////////////// -->
    <ModalWide v-if="showPermissionModal"
    :modelValue="showPermissionModal"
    @update:modelValue="showPermissionModal = $event"
    @close="closePermissionModal"
    >

      <!-- TITLE -->
      <template #title>
        Set Permission — Role: {{ selectedRoleName }}
      </template>

      <!-- BODY -->
      <template #default>

        <!-- FORM TAMBAH PERMISSION -->
        <form @submit.prevent="savePermission"
              class="mb-5 p-4 bg-gray-800/40 border border-white/10 rounded-xl">

          <h3 class="font-semibold text-white mb-3 text-lg">Tambah Permission</h3>

          <div class="grid grid-cols-2 gap-4">

            <!-- MODULE -->
            <div>
              <label class="text-gray-300">Module</label>
              <select
                v-model="formPermission.module_id"
                class="w-full border border-gray-500 rounded px-2 py-2 bg-white text-gray-600"
              >
                <option value="">-- Pilih Module --</option>
                <option v-for="m in moduleList" :key="m.id" :value="m.id">
                  {{ m.label_module }}
                </option>
              </select>
            </div>

            <!-- CONTROL -->
            <div>
            <label class="text-gray-300">Control</label>
              <Multiselect
                v-model="formPermission.control_id"
                :options="controlsList"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                label="label_control"
                track-by="id"
                placeholder="-- Pilih Control --"
                class="text-black"
              />
            </div>
          </div>
          <button
            class="mt-4 bg-green-600 hover:bg-green-700 px-5 py-2 text-white rounded-lg"
          >
            Simpan Permission
          </button>
        </form>

        <!-- JIKA BELUM ADA PERMISSION -->
        <div
          v-if="groupedPermissions.length === 0"
          class="p-6 mt-4 text-center border border-white/10 bg-gray-800/40 rounded-xl"
        >
          <p class="text-gray-300 text-lg font-semibold">Permission Roles Belum Diset</p>
          <p class="text-gray-400 text-sm mt-1">Silakan tambah permission baru.</p>
        </div>

        <!-- LIST PERMISSION PER MODULE -->
        <!-- Wrapper scrollable untuk list permission -->
        <div 
          v-else
          class="space-y-4 max-h-[400px] overflow-y-auto"
        >
          <div 
            v-for="module in groupedPermissions"
            :key="module.module_id"
            class="border border-white/10 rounded-xl overflow-hidden " :class="[
                  'transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-800 text-gray-100'
                      : 'bg-gray-50 text-gray-900'
                  ]"
          >
            <!-- HEADER MODULE -->
            <div class="flex justify-between items-center px-4 py-3 bg-gray-900/70 border-b border-gray-700" >
              <!-- LEFT SIDE: Checkbox & Module Title -->
              <div 
                class="flex items-center space-x-3 cursor-pointer"
                @click="toggleCheckAll(module)"
              >
                <input
                  type="checkbox"
                  :checked="isAllChecked(module)"
                  @change.stop="toggleCheckAll(module)" 
                  class="accent-indigo-600"
                />

                <h2 class="font-semibold text-white text-lg capitalize select-none">
                  {{ module.module_name }}
                </h2>
              </div>

              <!-- RIGHT SIDE: bulk actions -->
              <div class="flex items-center gap-2">
                <!-- Only show when at least one is checked -->
                <template v-if="hasChecked(module)">
                  <!-- Bulk Aktifkan -->
                  <button
                    @click="bulkSetStatus(module, 1)"
                    class="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    Aktifkan
                  </button>
                  <!-- Bulk Non-Aktifkan -->
                  <button
                    @click="bulkSetStatus(module, 0)"
                    class="px-3 py-1 bg-yellow-600 text-white rounded text-xs"
                  >
                    Nonaktifkan
                  </button>
                  <!-- Bulk Hapus -->
                  <button
                    @click="bulkDelete(module)"
                    class="px-3 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Hapus
                  </button>
                </template>
                <span class="text-gray-400 text-xs">{{ module.controls.length }} controls</span>
              </div>
            </div>

            <!-- TABEL CONTROL -->
            <table class="w-full text-gray-200">
              <thead :class="['transition-colors', theme === 'dark' ? 'bg-slate-800 text-gray-100' : 'bg-gray-50 text-gray-900']"
              >
                <tr>
                  <th class="p-2 w-10 text-left">#</th>
                  <th class="p-2 text-left">Label Control</th>
                  <th class="p-2 w-100 text-left">Control</th>
                  <th class="p-2 w-30 text-left">Status</th>
                  <!-- <th class="p-2 w-40 text-center">Aksi</th> -->
                </tr>
              </thead>

              <tbody :class="[
              'divide-y transition-colors',
              theme === 'dark'
                ? 'divide-gray-700 bg-slate-900'
                : 'divide-gray-200 bg-white'
            ]">
                <tr :class="[
                  'transition-colors',
                    theme === 'dark'
                      ? 'bg-slate-800 text-gray-100'
                      : 'bg-gray-50 text-gray-900'
                  ]"
                  v-for="ctrl in module.controls"
                  :key="`perm-${ctrl.id}`"
                  class="border-t border-gray-700 cursor-pointer hover:bg-gray-700/40"
                  @click="toggleRow(ctrl, module)"
                >
                  <td class="p-2" >
                    <input
                      type="checkbox"
                      v-model="ctrl.checked"
                      @change.stop="onControlCheck(module)"
                      @click.stop
                      class="accent-indigo-600"
                    />
                  </td>

                  <td class="p-2 capitalize">
                    {{ ctrl.label_control }}
                  </td>
                  <td class="p-2">
                    {{ ctrl.control_name }}
                  </td>

                  <!-- STATUS -->
                  <td class="p-2">
                    <span
                      :class="{
                        'text-green-400 font-semibold': ctrl.id_status == 1,
                        'text-red-400 font-semibold': ctrl.id_status != 1
                      }"
                    >
                      {{ ctrl.id_status == 0 ? 'Tidak Aktif' : 'Aktif' }}
                    </span>
                  </td>

                  <!-- AKSI TOGGLE STATUS -->
                  <!-- <td class="p-2 text-center flex gap-2 justify-center">
                    <button
                      @click.stop="toggleStatus(ctrl)"
                      class="px-3 py-1 rounded text-white text-xs"
                      :class="ctrl.id_status == 1 ? 'bg-yellow-600' : 'bg-blue-600'"
                    >
                      {{ ctrl.id_status == 1 ? 'Nonaktifkan' : 'Aktifkan' }}
                    </button>
                    <button
                      @click.stop="deletePermission(ctrl, module)"
                      class="px-3 py-1 bg-red-600 text-white text-xs rounded"
                    >
                      Hapus
                    </button>
                  </td> -->

                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- End scrollable wrapper -->

      </template>

      <!-- FOOTER -->
      <template #footer>
        <button
          @click="showPermissionModal = false"
          class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl shadow"
        >
          Tutup
        </button>
      </template>
    </ModalWide>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, nextTick, watch } from "vue";
import DataTable from "../components/DataTable.vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
import { useCrud } from "../composables/useCrud";
import api from "../api/axios";
import ModalWide from "../components/ModalWide.vue";
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const { theme } = defineProps({ theme: String });

// CRUD roles
const {
  items, form, errors, showModal, isEdit,
  pagination, query, openAdd, openEdit,
  save, remove, load, resetForm
} = useCrud("/roles", {
  defaultForm: { id: null, roles_name: "" },
  rulesCreate: { roles_name: ["required"] },
  rulesUpdate: { roles_name: ["required"] },

  // ⬇ Tambahkan ini
  afterSave: () => {
    Swal.fire({
      icon: "success",
      title: isEdit.value ? "Roles berhasil diupdate" : "Roles berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });
  }
});

// SORT
const sortBy = ref("id");
const sortDir = ref("asc");
const perPage = ref(5);

// Table columns
const columns = [
  { key: "roles_name", label: "Nama Roles" },
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

// ================================================================================================ //
// ================================================================================================ //
// ================================================================================================ //

// =============================================== //
//   MODAL SET ROLES MENU AKSES
// =============================================== //
const showAccessModal = ref(false);
const selectedRoleId = ref(null);
const menus = ref([]);
const roleMenus = ref([]);

// Build tree
// Build tree
const buildMenuTree = (data) => {
  const map = {};
  const roots = [];

  // mapping awal
  data.forEach(i => (map[i.id_menu] = { ...i, children: [] }));

  // loop untuk parent & child
  data.forEach(i => {
    // FIX di sini → parent null / "" juga dianggap root
    if (i.parent_id === 0 || i.parent_id === null || i.parent_id === "" || i.parent_id === undefined) {
      roots.push(map[i.id_menu]);
    } else {
      map[i.parent_id]?.children.push(map[i.id_menu]);
    }
  });

  return roots;
};

const menuTree = computed(() => buildMenuTree(menus.value));

// Toggle parent
const toggleParent = (id_menu, children) => {
  const checked = roleMenus.value.includes(id_menu);

  const setChildren = (list, value) => {
    list.forEach(c => {
      const idx = roleMenus.value.indexOf(c.id_menu);

      if (value) {
        if (idx === -1) roleMenus.value.push(c.id_menu);
      } else {
        if (idx !== -1) roleMenus.value.splice(idx, 1);
      }

      if (c.children && c.children.length) {
        setChildren(c.children, value);
      }
    });
  };

  setChildren(children, checked);
};

// Toggle child update parent
const updateParent = (child) => {
  const parent = menuTree.value.find(p => p.id_menu === child.parent_id);
  if (!parent) return;

  const parentId = parent.id_menu;

  // Jika minimal 1 child dicentang → parent harus dicentang
  const hasChecked = parent.children.some(c => roleMenus.value.includes(c.id_menu));
  const parentIndex = roleMenus.value.indexOf(parentId);

  if (hasChecked && parentIndex === -1) {
    roleMenus.value.push(parentId);
  }

  // Jika semua child uncheck → parent harus uncheck
  const allUnchecked = parent.children.every(c => !roleMenus.value.includes(c.id_menu));
  if (allUnchecked && parentIndex !== -1) {
    roleMenus.value.splice(parentIndex, 1);
  }
};

// ================================
//   OPEN DETAIL → FETCH MENU
// ================================
const openDetail = async (row) => {
  selectedRoleId.value = row.id;

  // fetch all menus
  const resMenu = await api.get("/roles/menu/all");

  menus.value = resMenu.data.map(m => ({
    id_menu: m.id_menu ?? m.id ?? m.menu_id,
    parent_id: m.parent_id ?? m.parent ?? 0,
    title_menu: m.title_menu ?? m.nama_menu ?? m.menu_name,
  }));

  // fetch menus owned by this role
  const resRoleMenu = await api.get(`/roles/${row.id}/menus`);
  roleMenus.value = resRoleMenu.data;

  showAccessModal.value = true;
};

// SAVE ACCESS
const saveAccess = async () => {
  await api.post(`/roles/${selectedRoleId.value}/menus`, {
    menu_ids: roleMenus.value,
  });

  Swal.fire({
    icon: "success",
    title: "Hak akses disimpan!",
    timer: 1500,
    showConfirmButton: false,
  });

  showAccessModal.value = false;
};

// ================================================================================================ //
// ================================================================================================ //
// ================================================================================================ //

// =============================================== //
//   MODAL SET PERMISSION ROLES MODUL & CONTROL
// =============================================== //
const selectedRoleName = ref("");
const showPermissionModal = ref(false);
const groupedPermissions = ref([]);
const moduleList = ref([]);
const controlsList = ref([]);

const closePermissionModal = () => {
  showPermissionModal.value = false;

  // Reset form dan checkbox
  formPermission.module_id = "";
  formPermission.control_id = [];
  groupedPermissions.value.forEach(m => {
    m.controls.forEach(c => (c.checked = false));
  });
};


watch(showPermissionModal, (newVal) => {
  if (!newVal) {
    formPermission.module_id = "";
    formPermission.control_id = [];
  }
});

onMounted(() => {
  loadModules();
  loadControls();
});

const loadModules = async () => {
  const r = await api.get("/module");
  moduleList.value = r.data;
};

const loadControls = async () => {
  const r = await api.get("/control");
  controlsList.value = r.data; // pastikan format seperti API kamu
};

const formPermission = reactive({
  module_id: "",
  control_id: []   // array untuk multiselect
});


// ================================
//   CUKUP KLIK TR SAJA UNTUK MENCHECKLIST
// ================================
const toggleRow = async (ctrl, module) => {
  // Toggle checkbox-nya
  ctrl.checked = !ctrl.checked;

  // Supaya event 'check all' tetap sinkron
  onControlCheck(module);
};

// ================================
//   LOAD PERMISSION LIST
// ================================
const loadPermission = async () => {
  const res = await api.get(`/roles/permission/${selectedRoleId.value}/grouped`);

  groupedPermissions.value = res.data.map(m => ({
    module_id: m.module_id,
    module_name: m.module_name,
    controls: m.controls.map(c => ({
      id: c.id,
      control_id: c.control_id,
      label_control: c.label_control,
      control_name: c.control_name,
      id_status: c.id_status,
      checked: false
    }))
  }));
};

// ================================
//   OPEN DETAIL
// ================================
const openDetailPermission = async (row) => {
  selectedRoleId.value = row.id;
  selectedRoleName.value = row.roles_name;
  await loadPermission();
  showPermissionModal.value = true;
};

// ================================
//   SIMPAN PERMISSION BARU
// ================================
const savePermission = async () => {
  try {
    // Ambil hanya id dari objek control
    const controlIds = formPermission.control_id.map(c => c.id);

    const response = await api.post("/roles/permission", {
      roles_id: selectedRoleId.value,
      module_id: formPermission.module_id,
      control_id: controlIds, // kirim array of id
      id_status: 1
    });

    const message = response.data?.message || "Permission berhasil disimpan";

    await loadPermission(); // Refresh tabel setelah tambah

    // Optional: reset form jika ada control baru yang disimpan
    if (controlIds.length > 0) {
      formPermission.control_id = [];
      formPermission.module_id = "";
    }

    Swal.fire("Info", message, "success");

  } catch (error) {
    console.error(error);

    const message =
      error.response?.data?.message || "Gagal menyimpan permission";

    Swal.fire("Gagal", message, "error");
  }
};

// ================================
//   TOGGLE STATUS CONTROL (FINAL), TOMBOL UBAH STATUS PER RECORD DATA PADA TABEL
// ================================
const toggleStatus = async (ctrl) => {
  try {
    await api.post(`/roles/permission/${ctrl.id}/status`, {
      id_status: ctrl.id_status == 1 ? 0 : 1
    });

    await loadPermission();
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Gagal update status", "error");
  }
};

// ================================
//   DELETE PERMISSION, DIPAKAI JIKA MEMBUTUHKAN DELETE PER RECORD DATA PADA TABEL
// ================================
const deletePermission = async (ctrl, module) => {
  await api.delete(`/roles/permission/${ctrl.id}`);

  // HAPUS LANGSUNG DI UI TANPA RELOAD
  const index = module.controls.findIndex(c => c.id === ctrl.id);
  if (index !== -1) {
    module.controls.splice(index, 1);
  }

  // JIKA CONTROLS DALAM MODULE HABIS, HAPUS MODULENYA
  if (module.controls.length === 0) {
    const modIndex = groupedPermissions.value.findIndex(m => m.module_id === module.module_id);
    if (modIndex !== -1) {
      groupedPermissions.value.splice(modIndex, 1);
    }
  }
};

// ================================
//   CHECKBOX LOGIC
// ================================
const hasChecked = (module) => {
  return module.controls.some(c => c.checked);
};

const bulkSetStatus = async (module, newStatus) => {
  // Ambil semua permission yang dicentang
  const selected = module.controls.filter(c => c.checked);

  if (selected.length === 0) return;

  // Jalankan update per permission
  await Promise.all(
    selected.map(ctrl =>
      api.post(`/roles/permission/${ctrl.id}/status`, { id_status: newStatus })
    )
  );

  // Update UI langsung
  selected.forEach(ctrl => (ctrl.id_status = newStatus));
};

const bulkDelete = async (module) => {
  const selected = module.controls.filter(c => c.checked);

  if (selected.length === 0) return;

  await Promise.all(
    selected.map(ctrl =>
      api.delete(`/roles/permission/${ctrl.id}`)
    )
  );

  // Hapus dari UI
  module.controls = module.controls.filter(c => !c.checked);
};


const isAllChecked = (module) => {
  return module.controls.every(c => c.checked);
};

const toggleCheckAll = (module) => {
  const newValue = !isAllChecked(module);
  module.controls.forEach(c => (c.checked = newValue));
};

const onControlCheck = () => {};


// ================================================================================================ //
// ================================================================================================ //
// ================================================================================================ //

// =============================================== //
//   SETTING TOMBOL MAINTENANCE
// =============================================== //
const maintenanceMode = ref(false);
const maintenanceMessage = ref(""); // 🔥 pesan maintenance

// Load status ketika halaman dibuka
onMounted(() => {
  loadMaintenanceStatus();
});

const loadMaintenanceStatus = async () => {
  try {
    const res = await api.get("/system/maintenance-status");

    maintenanceMode.value = res.data.status === 1;
    maintenanceMessage.value = res.data.message || ""; // 🔥 ambil message
  } catch (err) {
    console.error("Gagal mengambil status maintenance", err);
  }
};

// 🔥 Ketika toggle digerakkan
const toggleMaintenance = async () => {
  const newState = maintenanceMode.value;

  // 🔥 Jika toggle dinyalakan → tampilkan modal input message
  if (newState) {
    const { value: text } = await Swal.fire({
      title: "Pesan Maintenance",
      input: "textarea",
      inputLabel: "Pesan yang ditampilkan ke user",
      inputPlaceholder: "Contoh: Sistem sedang maintenance sampai pukul 22:00",
      inputValue: maintenanceMessage.value, // 🔥 isi otomatis jika sudah ada
      showCancelButton: true,
      confirmButtonText: "Simpan & Aktifkan",
      cancelButtonText: "Batal",
      inputAttributes: {
        "aria-label": "Pesan Maintenance"
      }
    });

    // 🔴 Jika user klik batal → kembalikan toggle ke OFF
    if (text === undefined) {
      maintenanceMode.value = false;
      return;
    }

    maintenanceMessage.value = text;
  }

  // ✅ kirim ke API
  try {
    await api.post("/system/set-maintenance", {
      status: newState ? "maintenance" : "normal",
      message: maintenanceMessage.value
    });

    Swal.fire({
      icon: newState ? "warning" : "success",
      title: newState ? "Maintenance Diaktifkan" : "Aplikasi Normal",
      text: newState
        ? "Mode maintenance aktif."
        : "Aplikasi kembali normal.",
      confirmButtonColor: newState ? "#d33" : "#3085d6",
    });

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Gagal Mengubah Mode",
      text: "Terjadi kesalahan saat mengubah mode maintenance.",
    });

    maintenanceMode.value = !newState;
  }
};

</script>

<style>
.multiselect {
  width: 100%;
}

/* Biar placeholder di tengah secara vertikal */
.multiselect__placeholder {
  display: flex;
  align-items: center;
  height: 100%;
}

/* Samakan tinggi input dengan select native */
.multiselect__tags {
  min-height: 30px; /* sesuaikan dengan py-3 pada select */
  display: flex;
  align-items: center;
  padding: 2px 12px;
}
</style>
