<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { state, products, styleById, placementOptions, variationBatches, abTests, batchRun, stopBatch, generateMore, isApproved as approvedFor, isImageLive, toggleImageLive, openEditor, startVariationFlow, startVariationFlowFrom, deleteVariation } from '../store'
import StyledImage from '../components/StyledImage.vue'
import { Layers, Lock, Plus, ArrowRight, ArrowLeft, Check, Pause, ChevronRight, FlaskConical, Settings, CopyPlus, Sparkles, Trash2, MoreVertical, Play, Square, Loader2 } from 'lucide-vue-next'

// Variation-level settings live on their own sub-pages (VariationEditScreen),
// entered through the Edit settings button; fine-tune is the default entry.
function openEdit(section = 'image') {
  state.editSection = section
}


const chosenPlacement = computed(() =>
  placementOptions.find(o => o.id === currentBatch.value?.placement)
    || placementOptions.find(o => o.id === state.placement),
)
const currentBatch = computed(() => variationBatches.find(b => b.id === state.openVariation) || null)
// Products picked for the variation, split by whether they already have an image.
const batchProducts = computed(() =>
  currentBatch.value ? products.filter(p => currentBatch.value.generatedIds.includes(p.id)) : []
)
// Products picked but without an image yet: the current batch is rendering,
// the rest sit queued until the next one.
const ungenerated = computed(() =>
  currentBatch.value
    ? products.filter(p => currentBatch.value.productIds.includes(p.id) && !currentBatch.value.generatedIds.includes(p.id))
    : []
)
const renderingProducts = computed(() => ungenerated.value.filter(p => state.generated[p.id] === 'pending'))
const waitingProducts = computed(() => ungenerated.value.filter(p => state.generated[p.id] !== 'pending'))
// Everything picked for the variation is listed, so a batch of 5 out of 40
// still shows the other 35 as waiting for their turn.
// Whether an image is served, tracked per variation so two variations covering
// the same product don't share it.

// Nothing goes live on its own: every generated image waits for a person to
// approve it, and only an approved image can be switched live.
function isApproved(id) {
  return approvedFor(state.openVariation, id)
}
const pendingApproval = computed(() => batchProducts.value.filter(p => !isApproved(p.id)))
function isLive(id) {
  return isApproved(id) && isImageLive(state.openVariation, id)
}

// How many of the waiting products the next run should cover.
const moreCount = ref(0)
const moreOptions = computed(() => {
  const left = waitingProducts.value.length
  return [...[5, 10, 25, 100].filter(n => n < left), left]
})
watch(moreOptions, opts => {
  if (!opts.includes(moreCount.value)) moreCount.value = opts[opts.length - 1]
}, { immediate: true })

function generateNext() {
  if (currentBatch.value) generateMore(currentBatch.value.id, moreCount.value)
}

// Progress of the run that is generating into this variation right now.
const runHere = computed(() => batchRun.running && batchRun.batchId === currentBatch.value?.id)
const runPct = computed(() => batchRun.ids.length ? Math.round((batchRun.done / batchRun.ids.length) * 100) : 0)

const approvedProducts = computed(() => batchProducts.value.filter(p => isApproved(p.id)))
const liveCount = computed(() => batchProducts.value.filter(p => isLive(p.id)).length)

// The header toggle shows the same status as the list row, draft included.
const statusLabel = computed(() => {
  const s = currentBatch.value?.status
  return s === 'draft' ? 'Draft' : s === 'paused' ? 'Paused' : 'Live'
})

// The variation's own status. It says whether Picbear serves this batch at all;
// the per-image switches are a separate decision and stay where they are.
function startVariation() {
  currentBatch.value.status = 'live'
}

function toggleAll() {
  currentBatch.value.status = currentBatch.value.status === 'live' ? 'paused' : 'live'
}

// Running A/B test for a variation, if any.
function runningTestFor(batchId) {
  return abTests.find(t => t.variationId === batchId && t.status === 'running') || null
}

const runningTestForBatch = computed(() =>
  currentBatch.value ? runningTestFor(currentBatch.value.id) : null
)

// ── actions menu ──
// Every variation-level action lives in the kebab next to the Live toggle,
// so the destructive one is never a stray click away.
const menuOpen = ref(false)
const confirmDelete = ref(false)
watch(() => state.openVariation, () => { menuOpen.value = false; confirmDelete.value = false })

function runAction(fn) {
  menuOpen.value = false
  fn()
}

const testsForBatch = computed(() =>
  currentBatch.value ? abTests.filter(t => t.variationId === currentBatch.value.id) : []
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
  return products.filter(p => batch.generatedIds.includes(p.id)).slice(0, 3).map(p => p.img)
}

function statusClass(status) {
  if (status === 'live') return 'text-[#0c6b45] bg-[#d7f2e4]'
  if (status === 'paused') return 'text-[#9a6a00] bg-[#fdf1e3]'
  return 'text-[#616161] bg-[#f1f1f1]'
}

function styleFor(id) {
  return styleById(currentBatch.value?.styleId || state.style) || styleById('lifestyle')
}

// One image is one image: switching it does not decide for the variation, that
// is what the Activate / Live control in the header is for.
function toggleLive(id) {
  toggleImageLive(state.openVariation, id)
}

function finishSetup() {
  state.appTab = 'home'
  state.screen = state.steps.style ? 'placement' : 'style'
}
</script>

<template>
  <!-- Empty state until setup is finished: the reason to finish, next to the list it unlocks -->
  <div v-if="!state.published" class="max-w-[960px] mx-auto px-6 py-5">
    <div class="rounded-[28px] bg-white border border-[#ececec] p-10 flex items-center gap-10">
      <div class="w-[300px] shrink-0">
        <span class="w-12 h-12 rounded-xl bg-[#fdf4ef] border border-[#f2d9c9] inline-flex items-center justify-center mb-4">
          <Layers :size="22" class="text-[#b2592e]" />
        </span>
        <h1 class="text-[28px] leading-[1.15] font-bold text-[#1a1a1a] mb-3">Try different looks per product</h1>
        <p class="text-[14px] text-[#616161] leading-relaxed mb-6">
          A variation is a batch of AI images with its own style and instructions.
          Give your bestsellers a lifestyle look and your accessories a clean badge, then compare.
        </p>
        <button class="pb-btn-primary" @click="finishSetup">
          <Lock :size="13" /> Finish setup first, about 2 minutes left
        </button>
      </div>

      <!-- Static preview: what the list becomes once the first variations are live -->
      <div class="flex-1 min-w-0 bg-white rounded-[20px] shadow-[0_8px_28px_rgba(0,0,0,0.10)] p-5 pointer-events-none select-none">
        <p class="text-[11px] font-medium uppercase tracking-wide text-[#8a8a8a] mb-3">Once you are live</p>
        <div class="flex flex-col gap-3">
          <div v-for="b in variationBatches.slice(0, 3)" :key="b.id" class="flex items-center gap-3">
            <div class="flex -space-x-3 shrink-0">
              <div
                v-for="i in previewImgs(b).length" :key="i"
                class="w-10 h-10 rounded-lg bg-[#f1f1f1] ring-2 ring-white"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-[#1a1a1a] truncate">{{ b.name }}</p>
              <p class="text-[11px] text-[#616161] truncate">{{ styleById(b.styleId).name }} · {{ b.productIds.length }} products</p>
            </div>
            <span v-if="b.ctr" class="text-[11px] text-[#616161] shrink-0">CTR {{ b.ctr }}</span>
            <span class="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 capitalize" :class="statusClass(b.status)">
              {{ b.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Variation detail sub-page (review-style product list) -->
  <div v-else-if="currentBatch" class="min-h-full flex flex-col">
    <div class="flex-1 max-w-[960px] w-full mx-auto px-6 py-5">
    <button class="pb-btn-ghost -ml-2 mb-3" @click="state.openVariation = null">
      <ArrowLeft :size="14" /> Variations
    </button>
    <div class="mb-3 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-xl font-bold text-[#1a1a1a]">{{ currentBatch.name }}</h1>
        <p class="text-[13px] text-[#616161] mt-1">
          {{ styleById(currentBatch.styleId).name }} · shown {{ chosenPlacement.name.toLowerCase() }} ·
          {{ currentBatch.ratioSame ? currentBatch.desktopRatio : `${currentBatch.desktopRatio} desktop, ${currentBatch.mobileRatio} mobile` }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <template v-if="statusLabel === 'Draft'">
          <span class="text-[12px] font-semibold text-[#616161] bg-[#f1f1f1] border border-[#e3e3e3] rounded-full px-2.5 py-1">Draft</span>
          <button class="pb-btn-primary h-9 px-4 text-[14px]" @click="startVariation">
            <Play :size="14" /> Activate
          </button>
        </template>
        <button
          v-else
          class="inline-flex items-center gap-1.5 rounded-lg h-9 px-4 text-[14px] font-semibold cursor-pointer"
          :class="statusLabel === 'Live' ? 'bg-[#008060] text-white' : 'bg-white border border-[#d4d4d4] text-[#303030]'"
          @click="toggleAll"
        >
          <Check v-if="statusLabel === 'Live'" :size="15" />
          <Pause v-else :size="15" />
          {{ statusLabel }}
        </button>

        <!-- Every variation-level action -->
        <div class="relative">
          <div v-if="menuOpen" class="fixed inset-0 z-20" @click="menuOpen = false"></div>
          <button
            class="relative z-30 inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#4a4a4a] hover:bg-black/5 cursor-pointer"
            @click="menuOpen = !menuOpen"
            aria-label="More actions"
          >
            <MoreVertical :size="16" />
          </button>
          <div v-if="menuOpen" class="pb-menu">
            <button v-if="!runningTestForBatch" class="pb-menu-item" @click="runAction(goAbTest)">
              <FlaskConical :size="14" /> Start A/B test
            </button>
            <button class="pb-menu-item" @click="runAction(() => startVariationFlowFrom(currentBatch.id))">
              <CopyPlus :size="14" /> New variation from this
            </button>
            <button class="pb-menu-item" @click="runAction(() => openEdit())">
              <Settings :size="14" /> Edit settings
            </button>
            <div class="pb-menu-sep"></div>
            <button class="pb-menu-item" @click="runAction(() => { confirmDelete = true })">
              <Trash2 :size="14" /> Delete variation
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Running A/B test banner -->
    <div v-if="runningTestForBatch" class="pb-card p-4 mb-4">
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-lg bg-[#b2592e] flex items-center justify-center shrink-0">
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
      <div class="h-1 bg-[#f2d9c9] rounded-full overflow-hidden mt-3">
        <div class="h-full bg-[#b2592e] rounded-full" :style="{ width: (runningTestForBatch.day / runningTestForBatch.days) * 100 + '%' }"></div>
      </div>
    </div>

    <!-- Generation in progress: how far it is, and a way out -->
    <div v-if="runHere" class="pb-card p-4 mb-4">
      <div class="flex items-center justify-between gap-4 mb-2.5">
        <div class="min-w-0">
          <p class="font-semibold text-[#1a1a1a] flex items-center gap-2">
            <Loader2 :size="14" class="animate-spin text-[#b2592e]" /> Generating images
          </p>
          <p class="text-[12px] text-[#616161] mt-0.5">
            {{ batchRun.done }} of {{ batchRun.ids.length }} products done · {{ batchRun.ids.length - batchRun.done }} to go
          </p>
        </div>
        <button class="pb-btn-secondary shrink-0" @click="stopBatch">
          <Square :size="12" /> Stop generating
        </button>
      </div>
      <div class="h-1.5 rounded-full bg-[#ececec] overflow-hidden">
        <div class="h-full bg-[#b2592e] rounded-full transition-[width] duration-500" :style="{ width: runPct + '%' }"></div>
      </div>
    </div>

    <p class="text-[12px] text-[#616161] mb-3 px-1">
      {{ liveCount }} of {{ batchProducts.length }} images live<span v-if="pendingApproval.length"> · {{ pendingApproval.length }} waiting for approval</span><span v-if="renderingProducts.length"> · {{ renderingProducts.length }} still generating</span>
    </p>

    <div class="flex flex-col gap-3">
      <div
        v-for="p in batchProducts" :key="p.id"
        class="pb-card px-4 py-3 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        @click="openEditor(p.id, 'variations')"
      >
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-[#e3e3e3] relative">
            <img :src="p.img" class="w-full h-full object-cover" />
            <span class="absolute bottom-1 left-1 text-[9px] font-semibold bg-white/90 rounded px-1">Before</span>
          </div>
          <ArrowRight :size="14" class="text-[#8a8a8a]" />
          <div class="w-24 h-24 rounded-lg overflow-hidden relative ring-1 ring-[#f2d9c9]" :class="isLive(p.id) ? '' : 'opacity-50'">
            <StyledImage :src="p.img" :overlay="styleFor(p.id).overlay" ai-tag enhance />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ p.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ styleFor(p.id).name }} · shown {{ chosenPlacement.name.toLowerCase() }}</p>
        </div>
        <span
          v-if="!isApproved(p.id)"
          class="shrink-0 text-[12px] font-semibold text-[#9a6a00] bg-[#fdf1e3] rounded-full px-2.5 py-1"
        >Needs approval</span>
        <span
          v-else
          class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer"
          :class="isLive(p.id) ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
          role="switch" :aria-checked="isLive(p.id)" :aria-label="p.name + ' live on the storefront'"
          @click.stop="toggleLive(p.id)"
        >
          <span
            class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
            :class="isLive(p.id) ? 'left-[18px]' : 'left-[2px]'"
          ></span>
        </span>
      </div>

      <!-- Images the current batch is still rendering -->
      <div v-for="p in renderingProducts" :key="'gen-' + p.id" class="pb-card px-4 py-3 flex items-center gap-4">
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-[#e3e3e3] relative">
            <img :src="p.img" class="w-full h-full object-cover" />
            <span class="absolute bottom-1 left-1 text-[9px] font-semibold bg-white/90 rounded px-1">Before</span>
          </div>
          <ArrowRight :size="14" class="text-[#8a8a8a]" />
          <div class="w-24 h-24 rounded-lg overflow-hidden relative ring-1 ring-[#ececec]">
            <div class="absolute inset-0 pb-skeleton flex items-center justify-center">
              <Loader2 :size="18" class="animate-spin text-[#c9c9c9]" />
            </div>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ p.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ styleById(currentBatch.styleId).name }} · shown {{ chosenPlacement.name.toLowerCase() }}</p>
        </div>
        <span class="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#8a8a8a]">
          <Loader2 :size="13" class="animate-spin" /> Generating...
        </span>
      </div>

      <!-- Picked for this variation, still without an image -->
      <div v-for="p in waitingProducts" :key="'waiting-' + p.id" class="pb-card px-4 py-3 flex items-center gap-4">
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-[#e3e3e3] relative">
            <img :src="p.img" class="w-full h-full object-cover" />
            <span class="absolute bottom-1 left-1 text-[9px] font-semibold bg-white/90 rounded px-1">Before</span>
          </div>
          <ArrowRight :size="14" class="text-[#8a8a8a]" />
          <div class="w-24 h-24 rounded-lg bg-[#f1f1f1] flex items-center justify-center">
            <Sparkles :size="16" class="text-[#c9c9c9]" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ p.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ styleById(currentBatch.styleId).name }} · shown {{ chosenPlacement.name.toLowerCase() }}</p>
        </div>
        <span class="shrink-0 text-[12px] font-semibold text-[#8a8a8a] bg-[#f1f1f1] rounded-full px-2.5 py-1">Not generated yet</span>
      </div>

    </div>

    <!-- Delete confirmation -->
    <div v-if="confirmDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40" @click="confirmDelete = false"></div>
      <div class="pb-card relative z-10 w-full max-w-[420px] p-5">
        <p class="text-lg font-bold text-[#1a1a1a] leading-tight mb-1.5">Delete this variation?</p>
        <p class="text-[13px] text-[#616161] mb-4">
          {{ currentBatch.name }} and its {{ batchProducts.length }} AI images are gone for good.<template v-if="testsForBatch.length"> Its {{ testsForBatch.length === 1 ? 'A/B test goes' : testsForBatch.length + ' A/B tests go' }} with it.</template>
        </p>
        <div class="flex justify-end gap-2">
          <button class="pb-btn-secondary" @click="confirmDelete = false">Cancel</button>
          <button class="inline-flex items-center gap-1.5 rounded-lg bg-[#c0392b] text-white text-[13px] font-semibold px-3 py-1.5 cursor-pointer hover:brightness-110" @click="deleteVariation(currentBatch.id)">
            <Trash2 :size="13" /> Delete variation
          </button>
        </div>
      </div>
    </div>
    </div>

    <!-- Whatever is still without an image: generate the next batch from here -->
    <div v-if="waitingProducts.length" class="sticky bottom-[var(--dev-nav-height,0px)] px-6 py-3 bg-white border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          <span class="font-semibold text-[#1a1a1a]">{{ waitingProducts.length }} products are waiting for an image.</span>
          {{ batchProducts.length }} of {{ currentBatch.productIds.length }} selected products are generated so far.
        </p>
        <div class="flex items-center gap-2 shrink-0">
          <select
            v-model.number="moreCount"
            class="rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none"
          >
            <option v-for="n in moreOptions" :key="n" :value="n">
              {{ n === waitingProducts.length ? `All ${n}` : n }}
            </option>
          </select>
          <button class="pb-btn-primary" @click="generateNext">
            <Sparkles :size="13" /> Generate
          </button>
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
      <button class="pb-btn-secondary shrink-0" @click="startVariationFlow"><Plus :size="13" /> New variation</button>
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
          <p class="text-[12px] text-[#616161]">
            {{ styleById(b.styleId).name }} · {{ b.generatedIds.length }} of {{ b.productIds.length }} products
          </p>
        </div>
        <span v-if="b.ctr" class="text-[12px] text-[#616161] shrink-0">CTR {{ b.ctr }}</span>
        <span
          v-if="runningTestFor(b.id)"
          class="text-[11px] font-semibold text-[#6b3319] bg-[#fdf4ef] border border-[#f2d9c9] rounded-full px-2 py-0.5 shrink-0 inline-flex items-center gap-1"
        >
          <FlaskConical :size="11" class="text-[#b2592e]" /> A/B test · day {{ runningTestFor(b.id).day }}
        </span>
        <span class="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 capitalize" :class="statusClass(b.status)">
          {{ b.status }}
        </span>
        <ChevronRight :size="16" class="text-[#8a8a8a] shrink-0" />
      </div>
    </div>

  </div>
</template>
