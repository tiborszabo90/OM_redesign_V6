<script setup>
import { ref, computed, watch } from 'vue'
import { state, products, abTests, variationBatches, styleById } from '../store'
import StyledImage from '../components/StyledImage.vue'
import {
  FlaskConical, Lock, Play, TrendingUp, Plus, ArrowLeft, ChevronRight,
  Check, Loader2, Trophy, StopCircle, X,
} from 'lucide-vue-next'

// ── setup modal state ──
const setupVariations = ref([])   // variation ids to test (one test created per variation)
const setupControl = ref(true)    // include an original-photos control group
const setupDays = ref(14)
const setupAutoStop = ref(true)
const setupMinOrders = ref(50)
const setupConfidence = ref(95)
const confidenceOptions = [90, 95, 99]
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
// A few distinct product shots to preview each arm as a small gallery.
const armProducts = [products[0], products[1], products[3]]

// Entering setup (from the list button or a variation sub-page deep link):
// initialize the form, honoring a preselected variation.
watch(isSetup, (v) => {
  if (!v) return
  const prefill = state.abTestPrefill
  state.abTestPrefill = null
  const initial = (prefill && testableVariations.value.some(b => b.id === prefill))
    ? prefill
    : testableVariations.value[0]?.id
  setupVariations.value = initial ? [initial] : []
  setupControl.value = true
  setupDays.value = 14
  setupAutoStop.value = true
  setupMinOrders.value = 50
  setupConfidence.value = 95
}, { immediate: true })

function batchFor(test) {
  return variationBatches.find(b => b.id === test.variationId)
}

// ── derived KPIs for the running/completed test ──
// Raw arm counts -> full KPI set (ATC rate, conversion rate, AOV) used by the view.
function withRates(a) {
  return {
    ...a,
    atcRate: a.visitors ? (a.addToCarts / a.visitors) * 100 : 0,
    cvr: a.visitors ? (a.orders / a.visitors) * 100 : 0,
    aov: a.orders ? a.revenue / a.orders : 0,
  }
}
const kpi = computed(() => {
  const t = currentTest.value
  if (!t) return null
  return { original: withRates(t.arms.original), variant: withRates(t.arms.variant) }
})

// Confidence = probability the leading arm is truly better. Winner called at the
// test's auto-stop threshold (default 95%).
const SIGNIFICANCE = computed(() => currentTest.value?.stopConfidence || 95)
const leadsVariant = computed(() => kpi.value.variant.chanceToWin >= kpi.value.original.chanceToWin)
const leaderLabel = computed(() => (leadsVariant.value ? 'AI variation' : 'Original photos'))
const winProb = computed(() => (leadsVariant.value ? kpi.value.variant.chanceToWin : kpi.value.original.chanceToWin))
const significant = computed(() => winProb.value >= SIGNIFICANCE.value)

// Metric rows shown in each arm card, in funnel order.
const metricDefs = [
  { key: 'visitors', label: 'Visitors', type: 'int' },
  { key: 'addToCarts', label: 'Add to carts', type: 'int' },
  { key: 'atcRate', label: 'ATC rate', type: 'pct', delta: true },
  { key: 'orders', label: 'Orders', type: 'int' },
  { key: 'cvr', label: 'Conversion rate', type: 'pct', delta: true },
  { key: 'revenue', label: 'Revenue', type: 'money' },
  { key: 'aov', label: 'AOV', type: 'money', delta: true },
]

const fmtInt = n => n.toLocaleString('en-US')
const fmtPct = n => n.toFixed(2) + '%'
const fmtMoney = n => '€' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function fmtVal(arm, def) {
  const v = kpi.value[arm][def.key]
  if (def.type === 'money') return fmtMoney(v)
  if (def.type === 'pct') return fmtPct(v)
  return fmtInt(v)
}
function deltaPct(def) {
  const c = kpi.value.original[def.key]
  const v = kpi.value.variant[def.key]
  return c ? ((v - c) / c) * 100 : 0
}
function deltaText(def) {
  const d = deltaPct(def)
  return (d >= 0 ? '+' : '') + d.toFixed(0) + '%'
}
// Which arm wins a given metric (visitors excluded — that's just the traffic split).
function better(def) {
  if (def.key === 'visitors') return null
  const c = kpi.value.original[def.key]
  const v = kpi.value.variant[def.key]
  if (v === c) return null
  return v > c ? 'variant' : 'original'
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
  if (!setupVariations.value.length || starting.value) return
  starting.value = true
  setTimeout(() => {
    let firstId = null
    // One test per selected variation, each run against the original photos.
    setupVariations.value.forEach((vid) => {
      const batch = variationBatches.find(b => b.id === vid)
      if (!batch) return
      const id = `${batch.id}-test-${abTests.length + 1}`
      if (!firstId) firstId = id
      abTests.unshift({
        id,
        variationId: batch.id,
        name: setupControl.value ? `${batch.name} vs Original` : batch.name,
        status: 'running',
        day: 1, days: setupDays.value,
        winner: null,
        applied: false,
        confidence: 8,
        uplift: null,
        includeControl: setupControl.value,
        autoStop: setupAutoStop.value,
        minOrders: setupMinOrders.value,
        stopConfidence: setupConfidence.value,
        arms: {
          original: { visitors: 41, addToCarts: 2, orders: 1, revenue: 15, chanceToWin: 50 },
          variant: { visitors: 38, addToCarts: 2, orders: 1, revenue: 14, chanceToWin: 50 },
        },
      })
    })
    state.abTestRunning = true
    starting.value = false
    state.openAbTest = firstId
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
        Day {{ currentTest.day }} of {{ currentTest.days }} · {{ currentTest.days - currentTest.day }} days left
      </p>
    </template>

    <!-- Confidence meter: how sure we are of the leader, on the way to the 95% winner threshold -->
    <div class="pb-card p-5 mb-4">
      <div class="flex items-end justify-between mb-4">
        <div>
          <p class="text-[13px] font-semibold text-[#1a1a1a]">{{ significant ? `${leaderLabel} is the winner` : `${leaderLabel} is ahead` }}</p>
          <p class="text-[12px] text-[#616161] mt-0.5">
            <template v-if="significant">Confident enough to roll out. This result is statistically significant.</template>
            <template v-else>We call a winner once we are {{ SIGNIFICANCE }}% sure. Keep the test running.</template>
          </p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-3xl font-bold leading-none tabular-nums" :class="significant ? 'text-[#0c6b45]' : 'text-[#3a3468]'">{{ winProb }}%</p>
          <p class="text-[11px] text-[#8a8a8a] mt-1">sure it wins</p>
        </div>
      </div>

      <!-- track with a 95% "winner" threshold marker -->
      <div class="relative pt-4">
        <div class="absolute top-0 -translate-x-1/2 flex flex-col items-center" :style="{ left: SIGNIFICANCE + '%' }">
          <span class="text-[10px] font-semibold text-[#8a8a8a] leading-none">{{ SIGNIFICANCE }}%</span>
        </div>
        <div class="relative h-2.5 rounded-full bg-[#ececec]">
          <div
            class="h-full rounded-full transition-all duration-700"
            :class="significant ? 'bg-[#36c98e]' : 'bg-[#5548e0]'"
            :style="{ width: winProb + '%' }"
          ></div>
          <div class="absolute -top-1 -bottom-1 border-l border-dashed border-[#9a9a9a]" :style="{ left: SIGNIFICANCE + '%' }"></div>
        </div>
        <div class="flex justify-between mt-1.5 text-[10px] text-[#a0a0a0]">
          <span>Just a guess</span>
          <span>Winner</span>
        </div>
      </div>
    </div>

    <!-- Arms comparison: aligned side by side so every KPI reads on one row -->
    <div class="pb-card p-5 mb-4">
      <!-- column headers -->
      <div class="grid grid-cols-[1.3fr_1fr_1fr] items-end gap-3 pb-3 border-b border-[#ececec]">
        <span></span>
        <div class="flex flex-col items-end gap-2">
          <div class="flex gap-1.5">
            <div v-for="p in armProducts" :key="p.id" class="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-[#ececec]">
              <img :src="p.img" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="text-right">
            <p class="text-[13px] font-semibold text-[#1a1a1a] leading-tight">Original</p>
            <p class="text-[11px] text-[#8a8a8a]">Control</p>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <div class="flex gap-1.5">
            <div v-for="p in armProducts" :key="p.id" class="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-[#dedbf7]">
              <StyledImage :src="p.img" :overlay="styleById(batchFor(currentTest)?.styleId || 'lifestyle').overlay" enhance compact />
            </div>
          </div>
          <div class="text-right">
            <p class="text-[13px] font-semibold text-[#3a3468] leading-tight flex items-center gap-1.5 justify-end">
              AI variation
              <span v-if="currentTest.status === 'completed' && currentTest.winner === 'variant'" class="text-[10px] font-semibold text-white bg-[#36c98e] rounded-full px-1.5 py-0.5">Winner</span>
            </p>
            <p class="text-[11px] text-[#8a8a8a]">Variant</p>
          </div>
        </div>
      </div>

      <!-- KPI rows -->
      <div
        v-for="def in metricDefs" :key="def.key"
        class="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-3 py-2.5 border-b border-[#f4f4f4] last:border-0"
      >
        <span class="text-[13px] text-[#616161]">{{ def.label }}</span>
        <span
          class="text-right text-[15px] tabular-nums"
          :class="better(def) === 'original' ? 'font-bold text-[#1a1a1a]' : 'font-semibold text-[#8a8a8a]'"
        >{{ fmtVal('original', def) }}</span>
        <span class="text-right flex items-center justify-end gap-2">
          <span
            class="text-[15px] tabular-nums"
            :class="better(def) === 'variant' ? 'font-bold text-[#3a3468]' : 'font-semibold text-[#8a8a8a]'"
          >{{ fmtVal('variant', def) }}</span>
          <span
            v-if="def.delta"
            class="text-[11px] font-semibold tabular-nums w-11 text-right shrink-0"
            :class="deltaPct(def) >= 0 ? 'text-[#0c6b45]' : 'text-[#c0392b]'"
          >{{ deltaText(def) }}</span>
          <span v-else class="w-11 shrink-0"></span>
        </span>
      </div>
    </div>

    <!-- Actions (running) -->
    <div v-if="currentTest.status === 'running'" class="flex items-center justify-between gap-4">
      <p class="text-[12px] text-[#8a8a8a] flex items-center gap-1">
        <TrendingUp :size="12" />
        <template v-if="currentTest.autoStop">Auto-stops at {{ SIGNIFICANCE }}% confidence and {{ currentTest.minOrders }}+ orders. We'll email you.</template>
        <template v-else>We'll email you when there is a statistically significant winner.</template>
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

  <!-- Create A/B test modal -->
  <div v-if="isSetup" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="backToList"></div>
    <div class="pb-card relative z-10 w-full max-w-[540px] max-h-[90vh] overflow-y-auto p-5">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <p class="text-lg font-bold text-[#1a1a1a] leading-tight">Create A/B test</p>
          <p class="text-[12px] text-[#616161] mt-0.5">Half your visitors see the original photos, the other half the AI variation. Nothing else changes.</p>
        </div>
        <button class="text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer shrink-0" @click="backToList">
          <X :size="18" />
        </button>
      </div>

      <!-- Control group -->
      <label class="flex items-start gap-2.5 cursor-pointer mb-4">
        <input type="checkbox" v-model="setupControl" class="pb-field mt-0.5 w-4 h-4 accent-[#5548e0]" />
        <span class="text-[13px] text-[#1a1a1a] leading-snug">
          Include control group
          <span class="text-[#616161]">(show your original photos to a portion of visitors)</span>
        </span>
      </label>

      <!-- Select variations -->
      <p class="text-[12px] font-semibold text-[#616161] mb-2">Select variations</p>
      <div class="flex flex-col gap-2">
        <label
          v-for="b in testableVariations" :key="b.id"
          class="flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer"
          :class="setupVariations.includes(b.id) ? 'border-[#5548e0] bg-[#f6f5ff]' : 'border-[#ececec] hover:border-[#d4d4d4]'"
        >
          <input type="checkbox" :value="b.id" v-model="setupVariations" class="pb-field w-4 h-4 accent-[#5548e0] shrink-0" />
          <div class="w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-[#ececec]">
            <StyledImage :src="previewProduct.img" :overlay="styleById(b.styleId).overlay" enhance compact />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-[#1a1a1a] truncate">{{ b.name }} <span class="text-[#8a8a8a] font-normal">({{ b.count }} products)</span></p>
            <p class="text-[12px] text-[#616161]">{{ styleById(b.styleId).name }}</p>
          </div>
        </label>
        <p v-if="!testableVariations.length" class="text-[12px] text-[#8a8a8a]">
          Every live variation already has a running test.
        </p>
      </div>

      <!-- Test length -->
      <p class="text-[12px] font-semibold text-[#616161] mt-4 mb-2">Test length</p>
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

      <!-- Auto-stop -->
      <div class="mt-4 rounded-xl border border-[#ececec] p-3.5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-semibold text-[#1a1a1a] text-[13px]">Auto-stop</p>
            <p class="text-[12px] text-[#616161] mt-0.5">End the test on its own once there is a clear winner.</p>
          </div>
          <button class="flex items-center gap-2 shrink-0 cursor-pointer" @click="setupAutoStop = !setupAutoStop">
            <span class="w-9 h-[20px] rounded-full transition-colors duration-300 relative" :class="setupAutoStop ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'">
              <span class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300" :class="setupAutoStop ? 'left-[18px]' : 'left-[2px]'"></span>
            </span>
            <span class="text-[13px] font-medium text-[#303030] w-6">{{ setupAutoStop ? 'On' : 'Off' }}</span>
          </button>
        </div>
        <div v-if="setupAutoStop" class="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label class="text-[12px] font-medium text-[#616161] block mb-1">Minimum orders</label>
            <input
              v-model.number="setupMinOrders"
              type="number" min="1"
              class="pb-field w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none"
            />
          </div>
          <div>
            <label class="text-[12px] font-medium text-[#616161] block mb-1">Confidence threshold</label>
            <select
              v-model.number="setupConfidence"
              class="pb-field w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none"
            >
              <option v-for="c in confidenceOptions" :key="c" :value="c">{{ c }}%</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 mt-5">
        <button class="pb-btn-secondary" @click="backToList">Cancel</button>
        <button class="pb-btn-primary" :disabled="!setupVariations.length || starting" @click="startTest">
          <template v-if="starting"><Loader2 :size="13" class="animate-spin" /> Creating...</template>
          <template v-else><Play :size="13" /> Create A/B test</template>
        </button>
      </div>
    </div>
  </div>
</template>
