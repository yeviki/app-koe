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
          type="radio"
          class="w-4 h-4 accent-indigo-600"
          :name="name"
          :value="item[valueField]"
          :checked="modelValue == item[valueField]"
          @change="select(item[valueField])"
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
  modelValue: [String, Number],

  label: {
    type: String,
    default: "",
  },

  name: {
    type: String,
    default: "radio-group",
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
    console.error("RadioGroup Load Error:", error);
  }
};

const select = (value) => {
  emit("update:modelValue", value);
};

onMounted(load);
</script>
