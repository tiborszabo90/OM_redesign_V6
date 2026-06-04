<template>
  <div class="oc-font min-h-screen-safe bg-[var(--oc-bg-subtle)] flex items-center justify-center p-8">
    <div class="w-full max-w-lg text-center">

      <!-- Header -->
      <div class="oc-gradient-bg rounded-[20px] p-8 mb-8 text-white shadow-[var(--oc-shadow-glow)]">
        <div class="flex items-center justify-center gap-2 mb-3">
          <Box :size="22" />
          <span class="text-sm font-medium uppercase tracking-wide opacity-90">OptiCube</span>
        </div>
        <h1 class="text-3xl font-bold mb-1">Dev Start</h1>
        <p class="text-sm opacity-90">Pick a flow or view to preview.</p>
      </div>

      <!-- View grid -->
      <div class="grid grid-cols-2 gap-3">
        <OcButton
          v-for="view in opticubeViews"
          :key="view.id"
          variant="outline"
          @click="$emit('navigate', view.id)"
        >
          {{ view.label }}
        </OcButton>
      </div>

      <p v-if="!opticubeViews.length" class="text-sm text-[var(--oc-text-muted)] mt-2">
        No OptiCube views yet.
      </p>

      <!-- Back -->
      <button
        @click="$emit('navigate', 'apps')"
        class="flex items-center gap-1.5 mx-auto text-sm font-medium text-[var(--oc-text-muted)] hover:text-[var(--oc-neutral-700)] mt-8 cursor-pointer transition-colors"
      >
        <ArrowLeft :size="15" />
        Back to apps
      </button>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeft, Box } from 'lucide-vue-next'
import './opticube.css'
import OcButton from './components/OcButton.vue'
import { getProductViews } from '../registry'

defineProps({
  product: { type: String, default: 'opticube' },
})

defineEmits(['navigate'])

// Registry-driven list of OptiCube views (excludes this dashboard itself).
const opticubeViews = computed(() =>
  getProductViews('opticube')
    .filter(v => v.id !== 'opticube')
    .sort((a, b) => a.label.localeCompare(b.label))
)
</script>
