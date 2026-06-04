<template>
  <div :class="['oc-font bg-white rounded-[14px] border border-[var(--oc-border)]', paddingClass, shadowClass, interactiveClass]">
    <div v-if="$slots.header" class="mb-3">
      <slot name="header"></slot>
    </div>
    <slot></slot>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-[var(--oc-border)]">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v),
  },
  shadow: {
    type: String,
    default: 'sm',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v),
  },
  interactive: { type: Boolean, default: false },
})

const paddingClass = computed(() => ({
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}[props.padding]))

const shadowClass = computed(() => ({
  none: '',
  sm: 'shadow-[var(--oc-shadow-sm)]',
  md: 'shadow-[var(--oc-shadow-md)]',
  lg: 'shadow-[var(--oc-shadow-lg)]',
}[props.shadow]))

const interactiveClass = computed(() =>
  props.interactive
    ? 'transition-all hover:-translate-y-0.5 hover:shadow-[var(--oc-shadow-lg)] hover:border-[var(--oc-primary-300)] cursor-pointer'
    : ''
)
</script>
