<template>
  <div class="min-h-screen-safe bg-white flex flex-col items-center justify-center px-6 text-center">
    <div
      class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
      :style="{ backgroundColor: accent + '1A', color: accent }"
    >
      <Rocket :size="30" />
    </div>

    <h1 class="text-3xl font-semibold text-om-gray-900">{{ label }}</h1>
    <p class="text-lg text-om-gray-500 mt-3">Coming soon</p>

    <button
      @click="$emit('navigate', 'apps')"
      class="flex items-center gap-1.5 text-sm font-medium text-om-gray-500 hover:text-om-gray-700 mt-8 cursor-pointer transition-colors"
    >
      <ArrowLeft :size="15" />
      Back to apps
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Rocket, ArrowLeft } from 'lucide-vue-next'
import { productDefinitions } from '../registry'

const props = defineProps({
  product: { type: String, required: true },
})

defineEmits(['navigate'])

const def = computed(() => productDefinitions[props.product] || {})
const label = computed(() => def.value.label || 'Coming soon')
const accent = computed(() => def.value.accent || '#6366F1')
</script>
