<template>
  <div class="min-h-screen bg-om-gray-50 flex items-center justify-center p-8">
    <div class="w-full max-w-lg text-center">

      <!-- Header -->
      <div
        class="rounded-2xl p-8 mb-8 text-white shadow-[0_8px_24px_rgba(14,165,233,0.30)]"
        style="background: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)"
      >
        <div class="flex items-center justify-center gap-2 mb-3">
          <Zap :size="22" />
          <span class="text-sm font-medium uppercase tracking-wide opacity-90">ConversionLift</span>
        </div>
        <h1 class="text-3xl font-bold mb-1">Dev Start</h1>
        <p class="text-sm opacity-90">Pick a flow or view to preview.</p>
      </div>

      <!-- View grid -->
      <div class="grid grid-cols-2 gap-3">
        <Button
          v-for="view in conversionliftViews"
          :key="view.id"
          variant="secondary"
          @click="$emit('navigate', view.id)"
        >
          {{ view.label }}
        </Button>
      </div>

      <p v-if="!conversionliftViews.length" class="text-sm text-om-gray-500 mt-2">
        No ConversionLift views yet.
      </p>

      <!-- Back -->
      <button
        @click="$emit('navigate', 'apps')"
        class="flex items-center gap-1.5 mx-auto text-sm font-medium text-om-gray-500 hover:text-om-gray-700 mt-8 cursor-pointer transition-colors"
      >
        <ArrowLeft :size="15" />
        Back to apps
      </button>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeft, Zap } from 'lucide-vue-next'
import './conversionlift.css'
import Button from '../components/shared/Button.vue'
import { getProductViews } from '../registry'

defineEmits(['navigate'])

// Registry-driven list of ConversionLift views (excludes this dashboard itself).
const conversionliftViews = computed(() =>
  getProductViews('conversionlift')
    .filter(v => v.id !== 'conversionlift')
    .sort((a, b) => a.label.localeCompare(b.label))
)
</script>
