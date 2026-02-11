<template>
  <button
    @click="!disabled && $emit('update:modelValue', !modelValue)"
    :class="[
      'w-11 h-6 rounded-full relative transition-colors',
      disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer',
      modelValue ? 'bg-[#2CC896]' : 'bg-om-gray-300'
    ]"
  >
    <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', modelValue ? 'right-1' : 'left-1']"></div>
  </button>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>
