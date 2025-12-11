<!-- components/CheckboxGroup.vue -->
<template>
  <div>
    <label v-if="label" class="text-sm text-gray-200 mb-1 block">
      {{ label }}
    </label>

    <div class="space-y-2">
      <label
        v-for="item in options"
        :key="item[valueField]"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          class="w-4 h-4 accent-indigo-600"
          :value="item[valueField]"
          :checked="modelValue.includes(item[valueField])"
          @change="toggle(item[valueField])"
        />
        <span class="text-sm text-gray-200">
          {{ item[labelField] }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },

  label: {
    type: String,
    default: "",
  },

  url: {
    type: String,
    default: null,
  },

  items: {
    type: Array,
    default: () => [],
  },

  labelField: {
    type: String,
    default: "name",
  },

  valueField: {
    type: String,
    default: "id",
  },
});

const emit = defineEmits(["update:modelValue"]);
const options = ref([]);

const load = async () => {
  try {
    if (props.url) {
      const res = await api.get(props.url);
      options.value = res.data;
    } else {
      options.value = props.items;
    }
  } catch (error) {
    console.error("CheckboxGroup Load Error:", error);
  }
};

const toggle = (value) => {
  const values = [...props.modelValue];
  const index = values.indexOf(value);

  if (index > -1) {
    values.splice(index, 1);
  } else {
    values.push(value);
  }

  emit("update:modelValue", values);
};

onMounted(load);
</script>
