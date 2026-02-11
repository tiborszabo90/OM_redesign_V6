<template>
  <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] hover:shadow-[0_2px_8px_2px_rgb(0_0_0/0.07)] transition-shadow duration-300 ease-in-out">
    <button
      @click="$emit('toggle')"
      class="w-full px-5 py-4 flex items-center justify-between text-left transition-colors rounded-lg cursor-pointer"
    >
      <div class="flex items-center gap-3">
        <div class="accordion-icon">
          <div class="w-10 h-10 rounded-full bg-om-gray-100 flex items-center justify-center shrink-0">
            <slot name="icon" />
          </div>
        </div>
        <span class="text-base font-semibold text-om-gray-700">{{ title }}</span>
      </div>
      <ChevronDown
        :size="20"
        class="text-om-gray-600 transition-transform"
        :class="{ 'rotate-180': open }"
      />
    </button>
    <div v-if="open" class="pl-5 pr-5 pb-5 pt-2">
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
