<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['oc-font', buttonClasses]"
    @click="$emit('click', $event)"
  >
    <span :class="['flex items-center justify-center', iconOnly ? '' : 'gap-2']">
      <slot name="icon"></slot>
      <slot v-if="!iconOnly"></slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  iconOnly: { type: Boolean, default: false },
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-[10px] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--oc-primary-300)] cursor-pointer'

  const variants = {
    primary: 'oc-gradient-bg text-[var(--oc-text-on-primary)] hover:shadow-[var(--oc-shadow-glow)] active:opacity-90',
    secondary: 'bg-[var(--oc-primary-50)] text-[var(--oc-primary-700)] hover:bg-[var(--oc-primary-100)]',
    outline: 'bg-white border border-[var(--oc-border)] text-[var(--oc-neutral-700)] hover:border-[var(--oc-primary-400)] hover:text-[var(--oc-primary-600)]',
    ghost: 'bg-transparent text-[var(--oc-neutral-600)] hover:bg-[var(--oc-neutral-100)]',
  }

  const sizes = props.iconOnly
    ? { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10', lg: 'w-12 h-12 text-lg' }
    : { sm: 'px-3 h-8 text-sm', md: 'px-4 h-10 text-sm', lg: 'px-6 h-12 text-base' }

  if (props.disabled) {
    return `${base} ${sizes[props.size]} bg-[var(--oc-neutral-200)] text-[var(--oc-neutral-400)] cursor-not-allowed`
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>
