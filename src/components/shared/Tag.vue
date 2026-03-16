<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit"
    :class="variantClasses"
  >
    <slot name="icon" />
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'gray',
    // 'gray' | 'gray-muted' | 'orange' | 'green'
  },
})

const variantMap = {
  'gray':       'bg-om-gray-100 text-om-gray-700',
  'gray-muted': 'bg-om-gray-100 text-om-gray-500',
  'orange':     'bg-om-orange-100 text-om-orange-600',
  'green':      'bg-[#2CC896] text-white',
  'outlined':   'bg-white border border-om-gray-200 text-om-gray-600',
}

const variantClasses = computed(() => variantMap[props.variant] ?? variantMap['gray'])
</script>
