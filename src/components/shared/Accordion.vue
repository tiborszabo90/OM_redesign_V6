<template>
  <div :class="['relative bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] transition-shadow duration-300 ease-in-out overflow-hidden', disabled ? 'opacity-50' : 'hover:shadow-[0_2px_8px_2px_rgb(0_0_0/0.07)]']">
    <button
      @click="!disabled && $emit('toggle')"
      :class="['w-full px-5 py-4 flex items-center justify-between text-left transition-colors rounded-lg', disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
    >
      <div class="flex items-center gap-3">
        <div class="accordion-icon">
          <div :class="['rounded-full flex items-center justify-center shrink-0', iconSize, iconBg]">
            <slot name="icon" />
          </div>
        </div>
        <span :class="['text-base font-semibold', disabled ? 'text-om-gray-500' : 'text-om-gray-700']">{{ title }}</span>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <slot name="meta" />
        <ChevronDown
          :size="20"
          class="text-om-gray-600 transition-transform"
          :class="{ 'rotate-180': open }"
        />
      </div>
    </button>
    <div v-if="open" class="pl-5 pr-5 pb-12 pt-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    default: false
  },
  iconBg: {
    type: String,
    default: 'bg-om-orange-100'
  },
  iconSize: {
    type: String,
    default: 'w-10 h-10'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.accordion-icon :deep(svg) {
  width: 24px;
  height: 24px;
}
</style>
