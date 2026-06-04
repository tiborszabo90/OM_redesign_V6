<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="['oc-font relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--oc-primary-300)]', trackClass]"
    @click="toggle"
  >
    <span
      :class="['inline-block h-5 w-5 transform rounded-full bg-white shadow-[var(--oc-shadow-sm)] transition-transform', modelValue ? 'translate-x-5' : 'translate-x-0.5']"
    ></span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const trackClass = computed(() => {
  if (props.disabled) return 'bg-[var(--oc-neutral-200)] cursor-not-allowed'
  return props.modelValue
    ? 'oc-gradient-bg cursor-pointer'
    : 'bg-[var(--oc-neutral-300)] cursor-pointer'
})

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>
