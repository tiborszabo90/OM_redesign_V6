<template>
  <Modal :model-value="modelValue" size="lg" hide-close @update:model-value="$emit('update:modelValue', $event)">
    <div v-if="concept" class="relative px-2 pt-2 pb-1">
      <Button variant="ghost" size="sm" icon-only class="absolute -top-1 -right-1 z-10" @click="$emit('update:modelValue', false)">
        <template #icon><X :size="16" /></template>
      </Button>

      <div class="flex flex-col items-center text-center mb-3">
        <h2 class="text-xl font-semibold text-om-gray-700 mb-1">{{ concept.label }}</h2>
        <p class="text-sm text-om-gray-500 leading-relaxed max-w-md">
          Concept {{ index + 1 }} of {{ total }}, designed from your brand.
        </p>
      </div>

      <div class="flex items-center justify-center bg-om-gray-200 rounded-xl p-4">
        <img
          :src="concept.image"
          :alt="concept.label"
          class="max-w-full max-h-[58vh] object-contain rounded-md shadow-sm"
        />
      </div>
    </div>

    <template #footer="{ close }">
      <div class="flex items-center gap-2 pr-2">
        <Button variant="ghost" @click="close">
          <template #icon><ChevronLeft :size="16" /></template>
          Back
        </Button>
        <Button variant="primary" @click="$emit('confirm')">Make this one</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { X, ChevronLeft } from 'lucide-vue-next'
import Modal from './Modal.vue'
import Button from './Button.vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  concept: { type: Object, default: null },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
})

defineEmits(['update:modelValue', 'confirm'])
</script>
