<template>
  <button
    class="chip flex items-center gap-1.5 cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]"
    :class="[sizeClasses, active ? 'bg-om-orange-50 border-2 border-om-orange-500 text-om-gray-700' : 'bg-white border border-om-gray-200 text-om-gray-700']"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
  size: { type: String, default: 'md' }, // 'md' | 'sm'
})

const sizeClasses = computed(() =>
  props.size === 'sm'
    ? 'px-3 py-1.5 rounded-full text-sm'
    : 'pl-2.5 pr-4 py-2.5 rounded-xl text-base'
)
</script>
