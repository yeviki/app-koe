<!-- components/Modal.vue -->
<template>
  <TransitionRoot as="template" :show="true">
    <Dialog class="relative z-50" @close="$emit('close')">

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

      <div class="fixed inset-0 w-screen overflow-y-auto z-50">
        <div class="flex min-h-full items-center justify-center p-4 text-center">

          <!-- PANEL -->
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
              class="relative w-96 rounded-2xl shadow-xl border border-white/10
                     bg-white/15 backdrop-blur-xl p-6 text-left transition-all"
            >

              <!-- CLOSE BUTTON -->
              <button
                @click="$emit('close')"
                class="absolute top-3 right-3 text-white/80 hover:text-white transition p-1"
              >
                ✕
              </button>

              <!-- TITLE -->
              <h2 class="text-2xl font-semibold text-white mb-5">
                <slot name="title" />
              </h2>

              <!-- BODY -->
              <div class="text-gray-100 space-y-3">
                <slot />
              </div>

              <!-- FOOTER -->
              <div class="mt-6 pt-4 border-t border-white/10 text-right">
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
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
</script>
