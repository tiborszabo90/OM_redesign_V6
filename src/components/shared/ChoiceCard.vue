<template>
  <button
    type="button"
    @click="$emit('click', $event)"
    :class="[
      'w-full bg-white rounded-xl p-4 transition-all focus:outline-none text-left flex items-center gap-4 cursor-pointer',
      selected
        ? 'border-2 border-om-orange-500 shadow-md'
        : 'border-2 border-om-gray-200 hover:border-om-orange-500 hover:shadow-md'
    ]"
  >
    <div v-if="$slots.icon" class="w-12 h-12 rounded-full bg-om-peach-50 flex items-center justify-center shrink-0 text-om-orange-500">
      <slot name="icon" />
    </div>
    <div class="min-w-0">
      <h3 class="text-base font-normal text-om-gray-700 mb-1">{{ title }}</h3>
      <p v-if="description" class="text-xs text-om-gray-500">{{ description }}</p>
    </div>
  </button>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  selected: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>
