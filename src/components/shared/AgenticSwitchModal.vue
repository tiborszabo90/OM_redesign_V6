<template>
  <Modal :model-value="modelValue" size="md" hide-close @update:model-value="$emit('update:modelValue', $event)">
    <div class="relative flex flex-col items-center text-center px-2 pt-2 pb-2">
      <Button variant="ghost" size="sm" icon-only class="absolute -top-2 -right-2" @click="$emit('update:modelValue', false)">
        <template #icon><X :size="16" /></template>
      </Button>
      <img src="/agentic.svg" alt="Agentic OptiMonk" class="w-28 h-28 object-contain mb-4" />
      <h2 class="text-lg font-semibold text-om-gray-700 mb-2">Switching to Agentic OptiMonk</h2>
      <p class="text-sm text-om-gray-500 leading-relaxed max-w-sm">
        You're about to move to a completely new interface, the agentic OptiMonk experience.
        Don't worry, you can switch back to your current OptiMonk anytime.
      </p>
    </div>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close">Stay here</Button>
      <Button variant="primary" @click="$emit('confirm')">Continue</Button>
    </template>
  </Modal>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import Modal from './Modal.vue'
import Button from './Button.vue'

defineProps({
  modelValue: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'confirm'])
</script>
