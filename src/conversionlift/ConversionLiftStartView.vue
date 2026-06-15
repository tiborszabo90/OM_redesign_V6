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

      <!-- Home: the assistant landing page -->
      <button
        v-if="home"
        @click="$emit('navigate', home.id)"
        class="w-full mb-3 rounded-xl border border-om-gray-200 bg-white p-4 flex items-center gap-3 text-left cursor-pointer hover:border-(--cl-accent-400) hover:bg-(--cl-accent-50) transition-colors"
      >
        <div class="w-9 h-9 rounded-lg bg-(--cl-accent-100) text-(--cl-accent-600) flex items-center justify-center shrink-0"><House :size="18" /></div>
        <div class="min-w-0 flex-1">
          <span class="text-sm font-semibold text-om-gray-800">{{ home.label }}</span>
          <p class="text-xs text-om-gray-500 mt-0.5">The assistant landing page.</p>
        </div>
        <ArrowRight :size="16" class="text-om-gray-400 shrink-0" />
      </button>

      <!-- Featured: Flow F (the full end-to-end flow) -->
      <button
        v-if="featured"
        @click="$emit('navigate', featured.id)"
        class="w-full mb-4 rounded-xl border border-om-gray-200 bg-white p-4 flex items-center gap-3 text-left cursor-pointer hover:border-(--cl-accent-400) hover:bg-(--cl-accent-50) transition-colors"
      >
        <div class="w-9 h-9 rounded-lg bg-(--cl-accent-100) text-(--cl-accent-600) flex items-center justify-center shrink-0"><Sparkles :size="18" /></div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-om-gray-800">{{ featured.label }}</span>
          </div>
          <p class="text-xs text-om-gray-500 mt-0.5">The full end-to-end flow.</p>
        </div>
        <ArrowRight :size="16" class="text-om-gray-400 shrink-0" />
      </button>

      <!-- Archive: every other view, collapsed by default -->
      <div v-if="rest.length" class="mt-2">
        <button
          @click="showArchive = !showArchive"
          class="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-om-gray-500 hover:text-om-gray-700 cursor-pointer transition-colors"
        >
          <Archive :size="15" />
          Archive
          <span class="text-om-gray-400">({{ rest.length }})</span>
          <ChevronDown :size="15" class="transition-transform" :class="showArchive ? 'rotate-180' : ''" />
        </button>

        <div v-if="showArchive" class="grid grid-cols-2 gap-3 mt-4">
          <Button
            v-for="view in rest"
            :key="view.id"
            variant="secondary"
            @click="$emit('navigate', view.id)"
          >
            {{ view.label }}
          </Button>
        </div>
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
import { ref, computed } from 'vue'
import { ArrowLeft, Zap, Sparkles, ArrowRight, Archive, ChevronDown, House } from 'lucide-vue-next'
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
// Home (B) is the landing page; Flow F is the current full flow — both pinned above the archive.
const home = computed(() => conversionliftViews.value.find(v => v.id === 'cl-home-b'))
const featured = computed(() => conversionliftViews.value.find(v => v.id === 'cl-flow-6'))
const rest = computed(() => conversionliftViews.value.filter(v => v.id !== 'cl-flow-6' && v.id !== 'cl-home-b'))
const showArchive = ref(false)
</script>
