<script setup>
import { ref, reactive, computed } from 'vue'
import { state, products, styleOptions, styleById, placementOptions, variationBatches, abTests, openEditor } from '../store'
import StyledImage from '../components/StyledImage.vue'
import { Layers, Lock, Plus, ArrowRight, ArrowLeft, RefreshCw, Shuffle, Check, Pause, ChevronRight, Zap, Settings, SlidersHorizontal, X, FlaskConical } from 'lucide-vue-next'

const showSettings = ref(false)

const automationRows = [
  { key: 'autoAdd', title: 'Add new products automatically', desc: 'New products get an image in this look, no prompting needed.' },
  { key: 'autoPublish', title: 'Publish without review', desc: 'Skip manual review for images in this variation.' },
]

const regenerating = reactive({})
const rowStyle = reactive({})   // product id -> style id override
const paused = reactive({})     // product id -> true when paused

const liveProducts = computed(() => products.filter(p => state.selected.includes(p.id)))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))
const currentBatch = computed(() => variationBatches.find(b => b.id === state.openVariation) || null)
const batchProducts = computed(() =>
  currentBatch.value ? liveProducts.value.slice(0, currentBatch.value.count) : []
)
const liveCount = computed(() => batchProducts.value.filter(p => !paused[p.id]).length)
const allPaused = computed(() => batchProducts.value.length > 0 && batchProducts.value.every(p => paused[p.id]))

function toggleAll() {
  const target = !allPaused.value
  batchProducts.value.forEach(p => { paused[p.id] = target })
}

function toggleAuto(key) {
  if (currentBatch.value) currentBatch.value[key] = !currentBatch.value[key]
}

// Running A/B test for a variation, if any.
function runningTestFor(batchId) {
  return abTests.find(t => t.variationId === batchId && t.status === 'running') || null
}

const runningTestForBatch = computed(() =>
  currentBatch.value ? runningTestFor(currentBatch.value.id) : null
)

function goAbTest() {
  if (runningTestForBatch.value) {
    state.openAbTest = runningTestForBatch.value.id
  } else {
    state.abTestPrefill = currentBatch.value.id
    state.openAbTest = 'new'
  }
  state.appTab = 'abtests'
}

function previewImgs(batch) {
  return liveProducts.value.slice(0, 3).map(p => p.img)
}

function statusClass(status) {
  if (status === 'live') return 'text-[#0c6b45] bg-[#d7f2e4]'
  if (status === 'paused') return 'text-[#9a6a00] bg-[#fdf1e3]'
  return 'text-[#616161] bg-[#f1f1f1]'
}

function styleFor(id) {
  return styleById(rowStyle[id] || currentBatch.value?.styleId || state.style) || styleById('lifestyle')
}

function switchLook(id) {
  const current = rowStyle[id] || currentBatch.value?.styleId || 'lifestyle'
  const i = styleOptions.findIndex(s => s.id === current)
  rowStyle[id] = styleOptions[(i + 1) % styleOptions.length].id
  regenerate(id)
}

function regenerate(id) {
  regenerating[id] = true
  setTimeout(() => { regenerating[id] = false }, 1000)
}

function toggleLive(id) {
  paused[id] = !paused[id]
}

function finishSetup() {
  state.appTab = 'home'
  state.screen = state.steps.style ? 'placement' : 'style'
}
</script>

<template>
  <!-- Locked empty state until setup is finished -->
  <div v-if="!state.published" class="max-w-[760px] mx-auto px-6 py-10">
    <div class="pb-card p-8 text-center">
      <span class="w-12 h-12 rounded-xl bg-[#f6f5ff] border border-[#dedbf7] inline-flex items-center justify-center mb-4">
        <Layers :size="22" class="text-[#5548e0]" />
      </span>
      <h1 class="text-xl font-bold text-[#1a1a1a] mb-1.5">Try different looks per product</h1>
      <p class="text-[13px] text-[#616161] max-w-md mx-auto mb-5">
        A variation is a batch of AI images with its own style and instructions.
        Give your bestsellers a lifestyle look and your accessories a clean badge, then compare.
      </p>

      <div class="flex justify-center gap-2 mb-6">
        <div v-for="opt in styleOptions" :key="opt.id" class="w-20 h-14 rounded-lg overflow-hidden border border-[#ececec]">
          <StyledImage :src="opt.img" :overlay="opt.overlay" compact />
        </div>
      </div>

      <button class="pb-btn-secondary" @click="finishSetup">
        <Lock :size="13" /> Finish setup first, about 2 minutes left
      </button>
    </div>
  </div>

  <!-- Variation detail sub-page (review-style product list) -->
  <div v-else-if="currentBatch" class="max-w-[960px] mx-auto px-6 py-5">
    <button class="pb-btn-ghost -ml-2 mb-3" @click="state.openVariation = null">
      <ArrowLeft :size="14" /> Variations
    </button>
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-[#1a1a1a]">{{ currentBatch.name }}</h1>
        <p class="text-[13px] text-[#616161] mt-1">{{ styleFor(batchProducts[0]?.id).name }} · shown {{ chosenPlacement.name.toLowerCase() }}</p>
      </div>
      <div class="flex gap-2 shrink-0">
        <button v-if="!runningTestForBatch" class="pb-btn-secondary" @click="goAbTest">
          <FlaskConical :size="14" /> Start A/B test
        </button>
        <button class="pb-btn-secondary" @click="showSettings = true">
          <Settings :size="14" /> Settings
        </button>
      </div>
    </div>

    <!-- Running A/B test banner -->
    <div v-if="runningTestForBatch" class="pb-card p-4 mb-4 bg-[#f6f5ff]!">
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-lg bg-[#5548e0] flex items-center justify-center shrink-0">
          <FlaskConical :size="17" class="text-white" />
        </span>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] flex items-center gap-2">
            A/B test running
            <span class="text-[10px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-1.5 py-0.5">Day {{ runningTestForBatch.day }} of {{ runningTestForBatch.days }}</span>
          </p>
          <p class="text-[12px] text-[#616161]">
            This variation runs against the original photos on a 50/50 split.
            <template v-if="runningTestForBatch.uplift"> The AI variant leads with {{ runningTestForBatch.uplift }} add-to-cart.</template>
          </p>
        </div>
        <button class="pb-btn-primary shrink-0" @click="goAbTest">
          View test <ArrowRight :size="13" />
        </button>
      </div>
      <div class="h-1 bg-[#dedbf7] rounded-full overflow-hidden mt-3">
        <div class="h-full bg-[#5548e0] rounded-full" :style="{ width: (runningTestForBatch.day / runningTestForBatch.days) * 100 + '%' }"></div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-3 px-1">
      <p class="text-[12px] text-[#616161]">{{ liveCount }} of {{ batchProducts.length }} images live</p>
      <button
        class="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[14px] font-semibold cursor-pointer"
        :class="allPaused ? 'bg-white border border-[#d4d4d4] text-[#303030]' : 'bg-[#d7f2e4] text-[#0c6b45]'"
        @click="toggleAll"
      >
        <template v-if="allPaused"><Pause :size="15" /> Paused</template>
        <template v-else><Check :size="15" /> Live</template>
      </button>
    </div>

    <div class="flex flex-col gap-3">
      <div v-for="p in batchProducts" :key="p.id" class="pb-card px-4 py-3 flex items-center gap-4">
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-16 h-16 rounded-lg overflow-hidden relative">
            <img :src="p.img" class="w-full h-full object-cover" />
            <span class="absolute bottom-1 left-1 text-[9px] font-semibold bg-white/90 rounded px-1">Before</span>
          </div>
          <ArrowRight :size="14" class="text-[#8a8a8a]" />
          <div class="w-24 h-24 rounded-lg overflow-hidden relative ring-1 ring-[#dedbf7]" :class="paused[p.id] ? 'opacity-50' : ''">
            <div v-if="regenerating[p.id]" class="absolute inset-0 pb-skeleton"></div>
            <StyledImage v-else :src="p.img" :overlay="styleFor(p.id).overlay" ai-tag enhance />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ p.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ styleFor(p.id).name }} · shown {{ chosenPlacement.name.toLowerCase() }}</p>
        </div>
        <span class="relative group shrink-0">
          <button class="pb-btn-ghost" @click="openEditor(p.id, 'variations')" aria-label="Fine-tune">
            <SlidersHorizontal :size="15" />
          </button>
          <span class="pb-tip opacity-0 group-hover:opacity-100">Fine-tune</span>
        </span>
        <span class="relative group shrink-0">
          <button class="pb-btn-ghost" @click="switchLook(p.id)" aria-label="Switch look">
            <Shuffle :size="15" />
          </button>
          <span class="pb-tip opacity-0 group-hover:opacity-100">Switch look</span>
        </span>
        <span class="relative group shrink-0">
          <button class="pb-btn-ghost" @click="regenerate(p.id)" aria-label="Regenerate">
            <RefreshCw :size="15" />
          </button>
          <span class="pb-tip opacity-0 group-hover:opacity-100">Regenerate</span>
        </span>
        <button
          class="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold cursor-pointer"
          :class="paused[p.id] ? 'bg-white border border-[#d4d4d4] text-[#303030]' : 'bg-[#d7f2e4] text-[#0c6b45]'"
          @click="toggleLive(p.id)"
        >
          <template v-if="paused[p.id]"><Pause :size="13" /> Paused</template>
          <template v-else><Check :size="13" /> Live</template>
        </button>
      </div>
    </div>

    <!-- Per-variation settings modal -->
    <div v-if="showSettings" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="showSettings = false"></div>
      <div class="pb-card relative z-10 w-full max-w-[440px] p-5">
        <!-- header: which variation -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-[#ececec]">
            <StyledImage :src="batchProducts[0]?.img" :overlay="styleById(currentBatch.styleId).overlay" enhance compact />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-[#1a1a1a] leading-tight truncate">{{ currentBatch.name }}</p>
            <p class="text-[12px] text-[#616161]">Variation settings</p>
          </div>
          <button class="text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer" @click="showSettings = false">
            <X :size="18" />
          </button>
        </div>

        <div class="flex items-center gap-2 mb-1">
          <Zap :size="14" class="text-[#5548e0]" />
          <p class="font-semibold text-[#1a1a1a] text-[13px]">Automation</p>
        </div>
        <div class="divide-y divide-[#ececec]">
          <div v-for="row in automationRows" :key="row.key" class="flex items-center gap-4 py-3">
            <div class="flex-1">
              <p class="font-medium text-[#1a1a1a] text-[13px]">{{ row.title }}</p>
              <p class="text-[12px] text-[#616161] mt-0.5">{{ row.desc }}</p>
            </div>
            <span
              class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer"
              :class="currentBatch[row.key] ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
              @click="toggleAuto(row.key)"
            >
              <span
                class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                :class="currentBatch[row.key] ? 'left-[18px]' : 'left-[2px]'"
              ></span>
            </span>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button class="pb-btn-primary" @click="showSettings = false">Done</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Variations main list -->
  <div v-else class="max-w-[960px] mx-auto px-6 py-5">
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-[#1a1a1a]">Variations</h1>
        <p class="text-[13px] text-[#616161] mt-1">Each variation is a batch of AI images with its own look. Open one to manage its products.</p>
      </div>
      <button class="pb-btn-secondary shrink-0"><Plus :size="13" /> New variation</button>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="b in variationBatches" :key="b.id"
        class="pb-card px-4 py-3.5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        @click="state.openVariation = b.id"
      >
        <div class="flex -space-x-3 shrink-0">
          <div
            v-for="(img, i) in previewImgs(b)" :key="i"
            class="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-white"
          >
            <StyledImage :src="img" :overlay="styleById(b.styleId).overlay" enhance compact />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ b.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ styleById(b.styleId).name }} · {{ b.count }} products</p>
        </div>
        <span v-if="b.ctr" class="text-[12px] text-[#616161] shrink-0">CTR {{ b.ctr }}</span>
        <span
          v-if="runningTestFor(b.id)"
          class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5 shrink-0 inline-flex items-center gap-1"
        >
          <FlaskConical :size="11" class="text-[#5548e0]" /> A/B test · day {{ runningTestFor(b.id).day }}
        </span>
        <span class="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 capitalize" :class="statusClass(b.status)">
          {{ b.status }}
        </span>
        <ChevronRight :size="16" class="text-[#8a8a8a] shrink-0" />
      </div>
    </div>
  </div>
</template>
