<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { state, bestseller, styleOptions, styleById, products, variationBatches, inspirationFeed, startVariationFlowFrom } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { RefreshCw, Loader2, X } from 'lucide-vue-next'

// Feed image opened in the inspiration modal.
const preview = ref(null)

function onKeydown(e) {
  if (e.key === 'Escape') preview.value = null
}

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
  window.addEventListener('keydown', onKeydown)
  if (state.previewsSeen) {
    styleOptions.forEach(o => { ready[o.id] = true })
  } else {
    reveal()
    state.previewsSeen = true
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(revealTimer)
})

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

// Adding a variation to a live account: existing variations double as starting
// points (same look and instructions, new placement and products).
function previewImg(batch) {
  return products.find(p => batch.productIds.includes(p.id))?.img || bestseller.img
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
      <div class="grid grid-cols-2 gap-4 mb-5">
        <div
          v-for="b in variationBatches" :key="b.id"
          class="pb-card overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:border-[#e3b394]"
          @click="startVariationFlowFrom(b.id)"
        >
          <div class="aspect-[16/9]">
            <StyledImage :src="previewImg(b)" :overlay="styleById(b.styleId).overlay" enhance />
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
      <h2 class="text-lg font-bold text-[#1a1a1a]">See what other stores made</h2>
      <p class="text-[13px] text-[#616161] mt-1 mb-4">
        {{ generating
          ? 'Your previews take about 10 seconds. Have a look around while Picbear works.'
          : 'Real Picbear images from other Shopify stores.' }}
      </p>
      <div class="grid grid-cols-4 gap-3">
        <button
          v-for="item in inspirationFeed" :key="item.img"
          class="aspect-square rounded-xl overflow-hidden border border-[#e3e3e3] bg-white cursor-zoom-in"
          @click="preview = item"
        >
          <img :src="item.img" :alt="item.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.04]" />
        </button>
      </div>
    </div>

    <!-- Inspiration preview -->
    <div
      v-if="preview"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click="preview = null"
    >
      <div class="grid w-full max-w-[57.6rem] sm:grid-cols-[1fr_336px] rounded-2xl overflow-hidden bg-white shadow-xl" @click.stop>
        <div class="bg-white p-6">
          <img :src="preview.img" :alt="preview.title" class="w-full rounded-xl" />
        </div>
        <div class="flex flex-col p-5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-[12px] font-medium uppercase tracking-wide text-[#8a8a8a]">Inspiration</p>
              <h3 class="mt-1 text-lg font-semibold text-[#1a1a1a]">{{ preview.title }}</h3>
              <p class="mt-1 text-[13px] text-[#8a8a8a]">PicBear gallery · {{ preview.style }}</p>
            </div>
            <button class="rounded-md p-1 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer" aria-label="Close" @click="preview = null">
              <X :size="16" />
            </button>
          </div>
          <p class="mt-4 flex-1 text-[13px] leading-relaxed text-[#616161]">
            Start a new task for <strong class="text-[#1a1a1a]">roast-and-co.com</strong> using this
            creative as a visual reference. The image will be attached; you can refine in chat next.
          </p>
          <button
            class="mt-4 w-full rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white bg-[#b2592e] hover:bg-[#96481f] cursor-pointer"
            @click="preview = null"
          >
            Use this as Inspiration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
