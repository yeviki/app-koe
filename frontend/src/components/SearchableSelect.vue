<!-- components/SearchableSelect.vue -->
<template>
  <div class="relative searchable-select">
    <!-- Label -->
    <label v-if="label" class="text-sm text-gray-200 mb-1 block">
      {{ label }}
    </label>

    <!-- Input untuk search / display value -->
    <input
      type="text"
      v-model="search"
      @focus="open = true"
      @input="onTyping"
      :placeholder="placeholder"
      class="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-300"
    />

    <!-- Dropdown -->
    <ul
      v-if="open"
      class="absolute z-20 mt-1 w-full bg-gray border border-gray-300 rounded-md max-h-52 overflow-auto shadow-lg"
    >
      <li
        v-for="item in filteredOptions"
        :key="item[valueField]"
        @click="select(item)"
        class="px-3 py-2 cursor-pointer hover:bg-indigo-600 hover:text-white"
      >
        {{ item[labelField] }}
      </li>

      <li v-if="filteredOptions.length === 0" class="px-3 py-2 text-gray-400 text-sm">
        Tidak ada data
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import api from "../api/axios";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: { type: String, default: "-- Pilih --" },
  items: { type: Array, default: () => [] },
  url: String,

  /** POTONGAN PENTING:
   *  API combo-status berisi:
   *  { id, status_name }
   *  Jadi valueField HARUS "id"
   */
  labelField: { type: String, default: "status_name" },
  valueField: { type: String, default: "id" },
});

const emit = defineEmits(["update:modelValue"]);

const options = ref([]);
const search = ref("");
const open = ref(false);
let lockWatch = false; // 🔒 mencegah watch overwrite saat select()

// Load data dropdown
const load = async () => {
  if (props.url) {
    try {
      const res = await api.get(props.url);
      options.value = res.data;
      autofill(props.modelValue);
    } catch (error) {
      console.error("Dropdown load error:", error);
    }
  } else {
    options.value = props.items;
    autofill(props.modelValue);
  }
};

onMounted(load);

// Filter list berdasarkan pencarian
const filteredOptions = computed(() => {
  if (!search.value) return options.value;
  return options.value.filter((item) =>
    item[props.labelField].toLowerCase().includes(search.value.toLowerCase())
  );
});

// Saat user mengetik manual, tetap buka dropdown
const onTyping = () => {
  open.value = true;
};

// Pilih item
const select = (item) => {
  lockWatch = true; // ⛔ blok watch agar tidak menimpa search
  search.value = item[props.labelField];

  emit("update:modelValue", item[props.valueField]);

  setTimeout(() => (lockWatch = false), 50); // buka lock
  open.value = false;
};

// Autofill saat edit atau modelValue berubah
const autofill = (val) => {
  const found = options.value.find((i) => i[props.valueField] == val);
  search.value = found ? found[props.labelField] : "";
};

// Watch perubahan modelValue
watch(
  () => props.modelValue,
  (val) => {
    if (!lockWatch) autofill(val);
  },
  { immediate: true }
);

// Tutup dropdown saat klik di luar
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchable-select")) open.value = false;
});
</script>
