// composables/useCrud.js
import { ref, reactive, onUnmounted } from "vue";
import api from "../api/axios";
import { validate } from "../utils/validator";
import Swal from "sweetalert2";

/**
 * Composable global CRUD untuk API endpoints
 * options:
 * - defaultForm: object default form
 * - rules: validation rules umum
 * - rulesCreate: validation khusus saat create
 * - rulesUpdate: validation khusus saat edit
 * - mapResponse: mapping response list
 * - transformForm: transform form sebelum dikirim
 * - beforeSave / afterSave: hooks
 * - beforeDelete / afterDelete: hooks
 * - idField: nama field id di form (default 'id')
 */
export function useCrud(endpoint, options = {}) {

  // ===============================
  // LIFECYCLE GUARD (🔥 TAMBAHAN AMAN)
  // ===============================
  let isActive = true;
  onUnmounted(() => {
    isActive = false;
  });

  // --- Config ---
  const defaultForm = options.defaultForm || {};
  const mapResponse = options.mapResponse || ((res) => res);
  const transformForm = options.transformForm || ((form) => form);
  const idField = options.idField || "id";

  const rules = options.rules || {};
  const rulesCreate = options.rulesCreate || {};
  const rulesUpdate = options.rulesUpdate || {};

  const beforeSave = options.beforeSave || null;
  const afterSave = options.afterSave || null;
  const beforeDelete = options.beforeDelete || null;
  const afterDelete = options.afterDelete || null;

  // --- State ---
  const items = ref([]);
  const loading = ref(false);
  const form = reactive(structuredClone(defaultForm));
  const errors = reactive({});
  const isEdit = ref(false);
  const showModal = ref(false);
  const query = reactive({});
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  // --- Fungsi reset form ---
  const resetForm = () => {
    Object.keys(defaultForm).forEach((key) => {
      form[key] = defaultForm[key];
    });
    Object.keys(errors).forEach((k) => delete errors[k]);
  };

  // --- Extract list dari response API ---
  const extractList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.result)) return data.result;
    return [];
  };

  // --- Extract pagination dari response API ---
  const extractPagination = (data) => ({
    total: data.total || 0,
    lastPage: data.last_page || 1,
  });

  // --- Load data list dari API ---
  const load = async () => {
    loading.value = true;
    try {
      const { data } = await api.get(endpoint, {
        params: { page: pagination.page, per_page: pagination.perPage, ...query },
      });

      if (!isActive) return;

      items.value = mapResponse(extractList(data));
      const pg = extractPagination(data);
      pagination.total = pg.total;
      pagination.lastPage = pg.lastPage;
    } finally {
      if (isActive) loading.value = false;
    }
  };

  // --- Fetch single record by ID ---
  const fetchOne = async (id, assignToForm = false) => {
    loading.value = true;
    try {
      const { data } = await api.get(`${endpoint}/${id}`);

      if (!isActive) return null;

      if (assignToForm) Object.assign(form, data);
      return data;
    } finally {
      if (isActive) loading.value = false;
    }
  };

  // --- Open modal untuk tambah data ---
  const openAdd = () => {
    resetForm();
    isEdit.value = false;
    showModal.value = true;
  };

  // --- Open modal untuk edit data ---
  const openEdit = async (rowOrId) => {
    resetForm();
    isEdit.value = true;

    if (typeof rowOrId === "object") {
      Object.assign(form, rowOrId);
    } else {
      await fetchOne(rowOrId, true);
    }

    // 🔥 WAJIB: Pastikan password kosong saat edit
    if ("password" in form) form.password = "";

    if (typeof form.roles_id === "string") {
      form.roles_id = form.roles_id.split(",").map(x => parseInt(x));
    }

    showModal.value = true;
  };

  // --- Validasi unik di client-side ---
  const validateUnique = (key, value) => {
    return !items.value.some(
      (i) => i[key] === value && (!isEdit.value || i[idField] !== form[idField])
    );
  };

  // --- Save data (create / update) ---
  const save = async () => {
    loading.value = true;
    Object.keys(errors).forEach((k) => delete errors[k]);

    try {
      const activeRules = isEdit.value
        ? { ...rules, ...rulesUpdate }
        : { ...rules, ...rulesCreate };

      const validation = validate(form, activeRules);

      for (const key in activeRules) {
        if (activeRules[key].includes("unique") && !validateUnique(key, form[key])) {
          validation[key] = `${key} sudah digunakan`;
        }
      }

      if (Object.keys(validation).length > 0) {
        Object.assign(errors, validation);
        loading.value = false;
        return false;
      }

      if (beforeSave) await beforeSave(form);

      let payload = transformForm(form);
      const method = isEdit.value ? "put" : "post";
      const url = isEdit.value ? `${endpoint}/${form[idField]}` : endpoint;

      if (hasFile(payload)) {
        payload = toFormData(payload);
      }

      await api[method](url, payload);

      if (!isActive) return false;

      await load();
      showModal.value = false;
      resetForm();

      if (afterSave) afterSave();
      return true;
    } catch (e) {
      if (!isActive) return false;

      if (e.response?.status === 403 || e.response?.status === 440) {
        Swal.fire({
          icon: "error",
          title: "Akses Ditolak!",
          text: e.response.data.message || "Akses ditutup untuk aksi ini",
          confirmButtonColor: "#d33",
        });
        loading.value = false;
        return false;
      }

      if (e.response?.data?.fields) {
        Object.assign(errors, e.response.data.fields);
      } else if (e.response?.data?.errors) {
        Object.assign(errors, e.response.data.errors);
      } else if (e.response?.data?.message) {
        errors.general = e.response.data.message;
      }

      return false;
    } finally {
      if (isActive) loading.value = false;
    }
  };

  // --- Delete data ---
  const remove = async (id) => {
    if (beforeDelete) {
      const ok = await beforeDelete(id);
      if (!ok) return;
    }

    loading.value = true;
    try {
      await api.delete(`${endpoint}/${id}`);

      if (!isActive) return;

      await load();
      if (afterDelete) afterDelete();
    } finally {
      if (isActive) loading.value = false;
    }
  };

  // helper: cek apakah object mengandung File / Blob (deep)
  const hasFile = (obj) => {
    if (!obj || typeof obj !== "object") return false;

    return Object.values(obj).some((v) => {
      if (v instanceof File || v instanceof Blob) return true;
      if (Array.isArray(v)) return v.some(i => i instanceof File || i instanceof Blob);
      if (typeof v === "object") return hasFile(v);
      return false;
    });
  };

  // helper: convert object ke FormData (GLOBAL)
  const toFormData = (obj) => {
    const fd = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      if (key.endsWith("_url")) return;
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((v) => fd.append(`${key}[]`, v));
        return;
      }

      if (value instanceof File || value instanceof Blob) {
        fd.append(key, value);
        return;
      }

      if (typeof value === "object") {
        fd.append(key, JSON.stringify(value));
        return;
      }

      fd.append(key, value);
    });

    return fd;
  };

  // --- Ganti page pagination ---
  const changePage = (page) => {
    pagination.page = page;
    load();
  };

  return {
    items,
    loading,
    form,
    errors,
    isEdit,
    showModal,
    pagination,
    query,
    load,
    fetchOne,
    openAdd,
    openEdit,
    save,
    remove,
    changePage,
    resetForm,
  };
}