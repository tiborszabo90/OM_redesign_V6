<script setup>
import { ref, computed, watch } from 'vue'
import { state, products, abTests, variationBatches, styleById } from '../store'
import StyledImage from '../components/StyledImage.vue'
import {
  FlaskConical, Lock, Play, TrendingUp, Plus, ArrowLeft, ChevronRight,
  Check, Loader2, Trophy, StopCircle,
} from 'lucide-vue-next'

// ── setup form state ──
const setupVariation = ref(null)
const setupDays = ref(14)
const starting = ref(false)

const currentTest = computed(() =>
  state.openAbTest && state.openAbTest !== 'new'
    ? abTests.find(t => t.id === state.openAbTest) || null
    : null
)
const isSetup = computed(() => state.openAbTest === 'new')

// Live variations that don't already have a running test.
const testableVariations = computed(() =>
  variationBatches.filter(b =>
    b.status === 'live' &&
    !abTests.some(t => t.variationId === b.id && t.status === 'running')
  )
)

const previewProduct = computed(() => products[0])

// Entering setup (from the list button or a variation sub-page deep link):
// initialize the form, honoring a preselected variation.
watch(isSetup, (v) => {
  if (!v) return
  const prefill = state.abTestPrefill
  state.abTestPrefill = null
  setupVariation.value = (prefill && testableVariations.value.some(b => b.id === prefill))
    ? prefill
    : (testableVariations.value[0]?.id || null)
  setupDays.value = 14
}, { immediate: true })

function batchFor(test) {
  return variationBatches.find(b => b.id === test.variationId)
}

function openTest(id) {
  state.openAbTest = id
}

function openSetup() {
  state.openAbTest = 'new'   // the isSetup watcher initializes the form
}

function backToList() {
  state.openAbTest = null
}

function startTest() {
  if (!setupVariation.value || starting.value) return
  starting.value = true
  setTimeout(() => {
    const batch = variationBatches.find(b => b.id === setupVariation.value)
    const id = `${batch.id}-test-${abTests.length + 1}`
    abTests.unshift({
      id,
      variationId: batch.id,
      name: `${batch.name} vs Original`,
      status: 'running',
      day: 1, days: setupDays.value,
      winner: null,
      applied: false,
      confidence: 8,
      uplift: null,
      arms: {
        original: { visitors: 41, atc: '3.8%', orders: 1, revenue: '€15' },
        variant: { visitors: 38, atc: '4.0%', orders: 1, revenue: '€14' },
      },
    })
    state.abTestRunning = true
    starting.value = false
    state.openAbTest = id
  }, 1400)
}

function stopTest(test) {
  test.status = 'completed'
  test.winner = 'variant'
  state.abTestRunning = abTests.some(t => t.status === 'running')
}

function applyWinner(test) {
  test.applied = true
}

function finishSetup() {
  state.appTab = 'home'
  state.screen = state.steps.style ? 'placement' : 'style'
}
</script>

<template>
  <!-- Locked until first publish -->
  <div v-if="!state.published" class="max-w-[760px] mx-auto px-6 py-10">
    <div class="pb-card p-8 text-center">
      <span class="w-12 h-12 rounded-xl bg-[#f6f5ff] border border-[#dedbf7] inline-flex items-center justify-center mb-4">
        <FlaskConical :size="22" class="text-[#5548e0]" />
      </span>
      <h1 class="text-xl font-bold text-[#1a1a1a] mb-1.5">Prove that better images sell more</h1>
      <p class="text-[13px] text-[#616161] max-w-md mx-auto mb-5">
        An A/B test shows your original photos to half of your visitors and the AI versions to the other half.
        You see clicks, add to carts and orders for both, so the decision is based on data, not taste.
      </p>
      <button class="pb-btn-secondary" @click="finishSetup">
        <Lock :size="13" /> Publish your first images to unlock
      </button>
    </div>
  </div>

  <!-- New test setup -->
  <div v-else-if="isSetup" class="max-w-[760px] mx-auto px-6 py-5">
    <button class="pb-btn-ghost -ml-2 mb-3" @click="backToList">
      <ArrowLeft :size="14" /> A/B tests
    </button>
    <div class="mb-5">
      <h1 class="text-xl font-bold text-[#1a1a1a]">New A/B test</h1>
      <p class="text-[13px] text-[#616161] mt-1">Half of your visitors see the original photos, the other half the AI variation. Nothing else changes.</p>
    </div>

    <!-- Pick a variation -->
    <div class="pb-card p-5 mb-4">
      <p class="font-semibold text-[#1a1a1a] mb-3">Which variation do you want to test?</p>
      <div class="flex flex-col gap-2.5">
        <div
          v-for="b in testableVariations" :key="b.id"
          class="rounded-xl border p-3 cursor-pointer flex items-center gap-3"
          :class="setupVariation === b.id ? 'border-[#5548e0] ring-1 ring-[#5548e0]' : 'border-[#ececec] hover:border-[#d4d4d4]'"
          @click="setupVariation = b.id"
        >
          <span class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" :class="setupVariation === b.id ? 'border-[#5548e0]' : 'border-[#c9c9c9]'">
            <span v-if="setupVariation === b.id" class="w-2 h-2 rounded-full bg-[#5548e0]"></span>
          </span>
          <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-[#ececec]">
            <StyledImage :src="previewProduct.img" :overlay="styleById(b.styleId).overlay" enhance compact />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-[#1a1a1a] truncate">{{ b.name }}</p>
            <p class="text-[12px] text-[#616161]">{{ styleById(b.styleId).name }} · {{ b.count }} products</p>
          </div>
        </div>
        <p v-if="!testableVariations.length" class="text-[12px] text-[#8a8a8a]">
          Every live variation already has a running test.
        </p>
      </div>
    </div>

    <!-- Duration -->
    <div class="pb-card p-5 mb-4">
      <p class="font-semibold text-[#1a1a1a] mb-1">How long should it run?</p>
      <p class="text-[12px] text-[#616161] mb-3">Longer tests give more reliable results. You can stop early any time.</p>
      <div class="flex gap-2">
        <button
          v-for="d in [7, 14, 28]" :key="d"
          class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium cursor-pointer"
          :class="setupDays === d ? 'border-[#5548e0] text-[#3a3468] bg-[#f6f5ff]' : 'border-[#d4d4d4] text-[#303030] bg-white hover:bg-[#fafafa]'"
          @click="setupDays = d"
        >
          <Check v-if="setupDays === d" :size="13" class="text-[#5548e0]" />
          {{ d }} days
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4">
      <p class="text-[12px] text-[#616161]">50/50 traffic split · measures image clicks, add to cart and orders.</p>
      <button class="pb-btn-primary shrink-0" :disabled="!setupVariation || starting" @click="startTest">
        <template v-if="starting"><Loader2 :size="13" class="animate-spin" /> Starting...</template>
        <template v-else><Play :size="13" /> Start test</template>
      </button>
    </div>
  </div>

  <!-- Test detail -->
  <div v-else-if="currentTest" class="max-w-[960px] mx-auto px-6 py-5">
    <button class="pb-btn-ghost -ml-2 mb-3" @click="backToList">
      <ArrowLeft :size="14" /> A/B tests
    </button>
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-[#1a1a1a]">{{ currentTest.name }}</h1>
        <p class="text-[13px] text-[#616161] mt-1">{{ batchFor(currentTest)?.count }} products · 50/50 traffic split</p>
      </div>
      <span
        class="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 mt-1"
        :class="currentTest.status === 'running' ? 'text-[#0c6b45] bg-[#d7f2e4]' : 'text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7]'"
      >
        {{ currentTest.status === 'running' ? `Running · day ${currentTest.day} of ${currentTest.days}` : 'Completed' }}
      </span>
    </div>

    <!-- Winner banner -->
    <div v-if="currentTest.status === 'completed'" class="pb-card p-4 mb-4 flex items-center gap-3 bg-[#f2fbf6]!">
      <span class="w-9 h-9 rounded-lg bg-[#36c98e] flex items-center justify-center shrink-0">
        <Trophy :size="17" class="text-white" />
      </span>
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">The AI images won with {{ currentTest.uplift }} more add-to-carts</p>
        <p class="text-[12px] text-[#616161]">{{ currentTest.confidence }}% confidence over {{ currentTest.days }} days. Safe to roll out.</p>
      </div>
      <button v-if="!currentTest.applied" class="pb-btn-primary shrink-0" @click="applyWinner(currentTest)">
        <Check :size="13" /> Apply winning images
      </button>
      <p v-else class="text-[13px] font-semibold text-[#0c6b45] flex items-center gap-1.5 shrink-0">
        <Check :size="14" /> Winner applied
      </p>
    </div>

    <!-- Progress (running) -->
    <template v-if="currentTest.status === 'running'">
      <div class="h-1.5 bg-[#ececec] rounded-full overflow-hidden mb-2">
        <div class="h-full bg-[#5548e0] rounded-full" :style="{ width: (currentTest.day / currentTest.days) * 100 + '%' }"></div>
      </div>
      <p class="text-[12px] text-[#616161] mb-4">
        Day {{ currentTest.day }} of {{ currentTest.days }} ·
        <template v-if="currentTest.confidence >= 95">statistically significant.</template>
        <template v-else>{{ currentTest.confidence }}% confidence, not yet significant. Keep it running.</template>
      </p>
    </template>

    <!-- Arms comparison -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div
        v-for="arm in ['original', 'variant']" :key="arm"
        class="pb-card p-5"
        :class="arm === 'variant' && (currentTest.winner === 'variant' || currentTest.status === 'running') ? 'ring-1 ring-[#dedbf7]' : ''"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-11 h-11 rounded-lg overflow-hidden shrink-0 ring-1 ring-[#ececec]">
            <img v-if="arm === 'original'" :src="previewProduct.img" class="w-full h-full object-cover" />
            <StyledImage v-else :src="previewProduct.img" :overlay="styleById(batchFor(currentTest)?.styleId || 'lifestyle').overlay" enhance compact />
          </div>
          <div class="flex-1">
            <p class="font-semibold text-[#1a1a1a]">{{ arm === 'original' ? 'Original photos' : 'AI variation' }}</p>
            <p class="text-[12px] text-[#616161]">{{ arm === 'original' ? 'Control, 50% of visitors' : 'Variant, 50% of visitors' }}</p>
          </div>
          <span
            v-if="arm === 'variant' && currentTest.status === 'completed' && currentTest.winner === 'variant'"
            class="text-[10px] font-semibold text-white bg-[#36c98e] rounded-full px-2 py-0.5 shrink-0"
          >Winner</span>
          <span
            v-else-if="arm === 'variant' && currentTest.status === 'running'"
            class="text-[10px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-2 py-0.5 shrink-0"
          >Leading {{ currentTest.uplift || '' }}</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-[#ececec] p-3">
            <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Visitors</p>
            <p class="text-lg font-bold text-[#1a1a1a]">{{ currentTest.arms[arm].visitors }}</p>
          </div>
          <div class="rounded-xl border border-[#ececec] p-3">
            <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Add-to-cart</p>
            <p class="text-lg font-bold text-[#1a1a1a]">{{ currentTest.arms[arm].atc }}</p>
          </div>
          <div class="rounded-xl border border-[#ececec] p-3">
            <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Orders</p>
            <p class="text-lg font-bold text-[#1a1a1a]">{{ currentTest.arms[arm].orders }}</p>
          </div>
          <div class="rounded-xl border border-[#ececec] p-3">
            <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Revenue</p>
            <p class="text-lg font-bold text-[#1a1a1a]">{{ currentTest.arms[arm].revenue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions (running) -->
    <div v-if="currentTest.status === 'running'" class="flex items-center justify-between gap-4">
      <p class="text-[12px] text-[#8a8a8a] flex items-center gap-1">
        <TrendingUp :size="12" /> We will email you when there is a statistically significant winner.
      </p>
      <button class="pb-btn-secondary shrink-0" @click="stopTest(currentTest)">
        <StopCircle :size="13" /> Stop test early
      </button>
    </div>
  </div>

  <!-- Tests main list -->
  <div v-else class="max-w-[960px] mx-auto px-6 py-5">
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-[#1a1a1a]">A/B tests</h1>
        <p class="text-[13px] text-[#616161] mt-1">Original photos vs an AI variation, on a 50/50 traffic split. Let the numbers decide.</p>
      </div>
      <button class="pb-btn-primary shrink-0" @click="openSetup"><Plus :size="13" /> New A/B test</button>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="t in abTests" :key="t.id"
        class="pb-card px-4 py-3.5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        @click="openTest(t.id)"
      >
        <span class="w-9 h-9 rounded-lg bg-[#f6f5ff] border border-[#dedbf7] flex items-center justify-center shrink-0">
          <FlaskConical :size="16" class="text-[#5548e0]" />
        </span>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ t.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ batchFor(t)?.count }} products · 50/50 split</p>
        </div>
        <span v-if="t.uplift" class="text-[12px] font-semibold shrink-0" :class="t.status === 'completed' ? 'text-[#0c6b45]' : 'text-[#616161]'">
          {{ t.uplift }} add-to-cart
        </span>
        <span
          class="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0"
          :class="t.status === 'running' ? 'text-[#0c6b45] bg-[#d7f2e4]' : 'text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7]'"
        >
          {{ t.status === 'running' ? `Running · day ${t.day} of ${t.days}` : (t.applied ? 'Completed · applied' : 'Completed') }}
        </span>
        <ChevronRight :size="16" class="text-[#8a8a8a] shrink-0" />
      </div>
    </div>
  </div>
</template>
