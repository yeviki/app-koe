<template>
  <div>
    <label v-if="label" class="text-sm text-gray-200 mb-1 block">
      {{ label }}
    </label>

    <div 
      @click="open = !open"
      class="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-300 cursor-pointer flex flex-wrap gap-1"
    >
      <span
        v-for="item in selectedItems"
        :key="item[valueField]"
        class="bg-indigo-600 text-white px-2 py-0.5 rounded text-xs"
      >
        {{ item[labelField] }}
      </span>

      <span v-if="modelValue.length === 0" class="text-gray-400">
        {{ placeholder }}
      </span>
    </div>

    <ul
      v-if="open"
      class="absolute z-20 mt-1 w-full bg-white shadow-lg border rounded-md max-h-52 overflow-auto"
    >
      <li
        v-for="item in filteredOptions"
        :key="item[valueField]"
        @click.stop="toggle(item)"
        class="px-3 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer flex justify-between"
      >
        {{ item[labelField] }}

        <span v-if="isSelected(item)" class="text-xs text-green-600 font-bold">
          ✔
        </span>
      </li>

      <li
        v-if="filteredOptions.length === 0"
        class="px-3 py-2 text-gray-400 text-sm"
      >
        Tidak ada data
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import api from "../api/axios";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  url: String,
  items: { type: Array, default: () => [] },
  label: String,
  placeholder: { type: String, default: "Pilih item..." },
  labelField: { type: String, default: "name" },
  valueField: { type: String, default: "id" },
});

const emit = defineEmits(["update:modelValue"]);

const options = ref([]);
const search = ref("");
const open = ref(false);

// load list
const load = async () => {
  options.value = props.items;
  if (props.url) {
    const r = await api.get(props.url);
    options.value = r.data;
  }
};

onMounted(load);

// filter hasil search
const filteredOptions = computed(() => {
  if (!search.value) return options.value;
  return options.value.filter((i) =>
    i[props.labelField].toLowerCase().includes(search.value.toLowerCase())
  );
});

// cek selected
const isSelected = (item) =>
  props.modelValue.includes(item[props.valueField]);

// toggle item
const toggle = (item) => {
  let newVal = [...props.modelValue];

  if (isSelected(item)) {
    newVal = newVal.filter((v) => v !== item[props.valueField]);
  } else {
    newVal.push(item[props.valueField]);
  }

  emit("update:modelValue", newVal);
};

// list item terpilih
const selectedItems = computed(() =>
  options.value.filter((x) => props.modelValue.includes(x[props.valueField]))
);
</script>
