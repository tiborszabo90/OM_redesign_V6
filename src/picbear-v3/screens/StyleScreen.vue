<script setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue'
import { state, bestseller, styleOptions, styleById, variationBatches, startVariationFlowFrom } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import InspirationFeed from '../components/InspirationFeed.vue'
import { RefreshCw, Loader2 } from 'lucide-vue-next'

// All four previews land together, after one generation run.
const GENERATION_MS = 10000

const ready = reactive({})
const generating = computed(() => styleOptions.some(o => !ready[o.id]))
let revealTimer = null

function reveal() {
  clearTimeout(revealTimer)
  styleOptions.forEach(o => { ready[o.id] = false })
  revealTimer = setTimeout(() => {
    styleOptions.forEach(o => { ready[o.id] = true })
  }, GENERATION_MS)
}

onMounted(() => {
  if (state.previewsSeen) {
    styleOptions.forEach(o => { ready[o.id] = true })
  } else {
    reveal()
    state.previewsSeen = true
  }
})

onUnmounted(() => clearTimeout(revealTimer))

function regenerate() {
  reveal()
}

function pick(id) {
  if (!ready[id]) return
  state.style = id
  setTimeout(next, 260)
}

function next() {
  if (!state.style) return
  state.steps.style = true
  state.screen = 'placement'
}

function statusClass(status) {
  if (status === 'live') return 'text-[#0c6b45] bg-[#d7f2e4]'
  if (status === 'paused') return 'text-[#9a6a00] bg-[#fdf1e3]'
  return 'text-[#616161] bg-[#f1f1f1]'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <WizardHeader
      :step="1"
      title="Pick your favorite look"
      subtitle="No mockups here. This is your own bestseller, already rendered in 4 styles."
      back-to="welcome"
    />

    <!-- Your product context -->
    <div class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
      <img :src="bestseller.img" class="w-10 h-10 rounded-lg object-cover" />
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">{{ bestseller.name }}</p>
        <p class="text-[12px] text-[#616161]">Your bestseller, 412 sold in the last 30 days.</p>
      </div>
    </div>

    <!-- Style cards -->
    <div class="grid grid-cols-4 gap-4 mb-5">
      <div
        v-for="opt in styleOptions" :key="opt.id"
        class="pb-card overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        :class="!ready[opt.id]
          ? 'pb-skeleton'
          : (state.style === opt.id ? 'ring-2 ring-[#b2592e] border-transparent!' : 'hover:shadow-lg hover:border-[#e3b394]')"
        @click="pick(opt.id)"
      >
        <div class="aspect-square relative">
          <div v-if="!ready[opt.id]" class="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
            <Loader2 :size="30" class="animate-spin text-[#b2592e]" />
            <span class="text-[11px] font-medium text-[#8a8a8a]">Generating preview...</span>
          </div>
          <div v-else class="absolute inset-0 pb-fade-in">
            <img :src="opt.preview" :alt="opt.name" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>

    <!-- Start from an existing variation (only when adding to a live account) -->
    <template v-if="state.newVariationFlow && variationBatches.length">
      <div class="mt-10 pt-6 border-t border-[#e3e3e3] mb-4">
        <h2 class="text-lg font-bold text-[#1a1a1a]">Or start from an existing variation</h2>
        <p class="text-[13px] text-[#616161] mt-1">Reuse the look and instructions of a variation you already have. You pick new placement and products.</p>
      </div>
      <div class="grid grid-cols-4 gap-4 mb-5">
        <div
          v-for="b in variationBatches" :key="b.id"
          class="pb-card overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-[#e3b394]"
          @click="startVariationFlowFrom(b.id)"
        >
          <div class="aspect-square">
            <img :src="styleById(b.styleId).preview" :alt="styleById(b.styleId).name" class="w-full h-full object-cover" />
          </div>
          <div class="p-3.5">
            <div class="flex items-center gap-2">
              <p class="font-semibold text-[#1a1a1a] flex-1 min-w-0 truncate">{{ b.name }}</p>
              <span v-if="b.ctr" class="text-[12px] text-[#616161] shrink-0">CTR {{ b.ctr }}</span>
              <span class="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 capitalize" :class="statusClass(b.status)">
                {{ b.status }}
              </span>
            </div>
            <p class="text-[12px] text-[#616161] mt-0.5">{{ styleById(b.styleId).name }} · same look and instructions, you pick new placement and products.</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Footer actions -->
    <div class="flex items-center justify-between">
      <button class="pb-btn-ghost" @click="regenerate">
        <RefreshCw :size="13" /> Regenerate previews
      </button>
      <p class="text-[12px] text-[#8a8a8a]">Pick a look to continue</p>
    </div>

    <!-- Something to look at while the previews render -->
    <div class="mt-10 pt-6 border-t border-[#e3e3e3]">
      <InspirationFeed
        :note="generating
          ? 'Your previews take about 10 seconds. Have a look around while Picbear works.'
          : 'Real Picbear images from other Shopify stores.'"
      />
    </div>
  </div>
</template>
