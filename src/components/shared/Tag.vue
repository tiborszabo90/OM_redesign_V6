<template>
  <component
    :is="clickable ? 'button' : 'span'"
    class="inline-flex items-center gap-1.5 rounded-full font-medium w-fit"
    :class="[variantClasses, clickable && 'cursor-pointer transition-colors', size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs']"
  >
    <slot name="icon" />
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'gray',
    // 'gray' | 'gray-muted' | 'orange' | 'green' | 'outlined'
  },
  size: { type: String, default: 'default' }, // 'default' | 'sm'
  clickable: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})

const variantMap = {
  'gray':       { base: 'bg-om-gray-100 text-om-gray-700', active: 'bg-om-gray-700 text-white' },
  'gray-muted': { base: 'bg-om-gray-100 text-om-gray-500', active: 'bg-om-gray-500 text-white' },
  'orange':     { base: 'bg-om-orange-100 text-om-orange-600', active: 'bg-om-orange-500 text-white' },
  'orange-solid': { base: 'bg-om-orange-500 text-white', active: 'bg-om-orange-600 text-white' },
  'green':      { base: 'bg-[#2CC896] text-white', active: 'bg-[#2CC896] text-white' },
  'green-light': { base: 'bg-[#D6F5EC] text-[#2CC896]', active: 'bg-[#2CC896] text-white' },
  'outlined':   { base: 'bg-white border border-om-gray-200 text-om-gray-600', active: 'bg-om-gray-700 border-om-gray-700 text-white' },
}

const variantClasses = computed(() => {
  const v = variantMap[props.variant] ?? variantMap['gray']
  return props.active ? v.active : v.base
})
</script>
