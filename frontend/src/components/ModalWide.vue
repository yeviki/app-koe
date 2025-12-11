<!-- components/ModalWide.vue -->
<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog class="relative z-50" @close="closeModal">

      <!-- BACKDROP -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>
      </TransitionChild>

      <div class="fixed inset-0 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >

          <!-- MAIN PANEL (Large Modal) -->
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="
                relative w-full max-w-5xl 
                rounded-2xl shadow-2xl border border-white/10
                bg-gradient from-gray-900/70 via-gray-900/60 to-gray-900/40
                backdrop-blur-xl p-8 text-left transition-all
              "
            >
              <!-- CLOSE BTN -->
              <button
                @click="closeModal"
                class="absolute top-4 right-5 text-gray-300 hover:text-white text-xl"
              >
                ✕
              </button>

              <!-- TITLE -->
              <h2 class="text-3xl font-bold text-white mb-6">
                <slot name="title" />
              </h2>

              <!-- BODY -->
              <div class="text-gray-200 max-h-[70vh] overflow-y-auto pr-2 space-y-4 custom-scroll">
                <slot />
              </div>

              <!-- FOOTER -->
              <div class="mt-6 pt-5 border-t border-white/10 flex justify-end gap-3">
                <slot name="footer" />
              </div>

            </DialogPanel>
          </TransitionChild>

        </div>
      </div>

    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits(["update:modelValue", "close"]);

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #777;
  border-radius: 8px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>
