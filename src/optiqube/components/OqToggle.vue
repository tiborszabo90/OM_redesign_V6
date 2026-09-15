<script setup>
import { BRAND, POPOVER_SHADOW } from '../tokens'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="props.modelValue"
    @click.prevent.stop="emit('update:modelValue', !props.modelValue)"
    class="relative inline-flex shrink-0 items-center rounded-full transition-colors"
    :style="{
      width: '40px',
      height: '22px',
      backgroundColor: props.modelValue ? BRAND.emerald : BRAND.gray300,
    }"
  >
    <span
      class="inline-block rounded-full transition-transform"
      :style="{
        width: '18px',
        height: '18px',
        background: BRAND.surface,
        boxShadow: POPOVER_SHADOW,
        transform: props.modelValue ? 'translateX(20px)' : 'translateX(2px)',
      }"
    />
  </button>
</template>
