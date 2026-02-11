<template>
  <label :class="['inline-flex items-center gap-2', disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
    <button
      type="button"
      @click="!disabled && $emit('update:modelValue', !modelValue)"
      :class="[
        'rounded flex items-center justify-center transition-all shrink-0',
        size === 'sm' ? 'w-4 h-4 border-[1.5px]' : 'w-5 h-5 border-2',
        disabled
          ? 'cursor-not-allowed bg-om-gray-100 border-om-gray-200'
          : (modelValue || indeterminate)
            ? 'bg-om-orange-500 border-om-orange-500 cursor-pointer'
            : 'bg-white border-om-gray-300 hover:border-om-orange-500 cursor-pointer'
      ]"
    >
      <Check v-if="modelValue && !indeterminate" :size="size === 'sm' ? 12 : 14" :class="disabled ? 'text-om-gray-400' : 'text-white'" stroke-width="3" />
      <svg v-else-if="indeterminate" :width="size === 'sm' ? 12 : 14" :height="size === 'sm' ? 12 : 14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6H10" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <span v-if="label" :class="['text-sm', disabled ? 'text-om-gray-400' : 'text-om-gray-700']">{{ label }}</span>
  </label>
</template>

<script setup>
import { Check } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'sm'].includes(v)
  }
})

defineEmits(['update:modelValue'])
</script>
