<template>
  <span :class="['oc-font inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', badgeClasses]">
    <slot name="icon"></slot>
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'neutral', 'success', 'warning', 'danger', 'info'].includes(v),
  },
})

const badgeClasses = computed(() => ({
  primary: 'bg-[var(--oc-primary-50)] text-[var(--oc-primary-700)]',
  neutral: 'bg-[var(--oc-neutral-100)] text-[var(--oc-neutral-600)]',
  success: 'bg-[var(--oc-success-soft)] text-[#047857]',
  warning: 'bg-[var(--oc-warning-soft)] text-[#B45309]',
  danger: 'bg-[var(--oc-danger-soft)] text-[#B91C1C]',
  info: 'bg-[var(--oc-info-soft)] text-[#1D4ED8]',
}[props.variant]))
</script>
