<script setup>
import { ref, computed, watch } from 'vue'
import { state, products, abTests, variationBatches, styleById } from '../store'
import StyledImage from '../components/StyledImage.vue'
import {
  FlaskConical, Lock, Play, Plus, ArrowLeft, ChevronRight,
  Check, Trophy, StopCircle, X, Pause, Pencil, Trash2, SlidersHorizontal, ExternalLink,
} from 'lucide-vue-next'

// ── setup modal state ──
// Test type is derived from the picks: no variation selected → A/A, otherwise A/B.
const setupVariations = ref([])   // variation ids to test (one test created per variation)
const setupControl = ref(true)    // include an original-photos control group
const setupDays = ref(14)
const setupAutoStop = ref(true)
const setupMinOrders = ref(50)
const setupConfidence = ref(95)
const confidenceOptions = [90, 95, 99]
const editingId = ref(null)       // when set, the modal edits an existing draft

const currentTest = computed(() =>
  state.openAbTest && state.openAbTest !== 'new'
    ? abTests.find(t => t.id === state.openAbTest) || null
    : null
)
const isSetup = computed(() => state.openAbTest === 'new')
const editMode = computed(() => editingId.value !== null)
const modalOpen = computed(() => isSetup.value || editMode.value)
// No variation picked → A/A (original vs original); a variation picked → A/B.
const setupIsAA = computed(() => setupVariations.value.length === 0)
const modalTitle = computed(() => `${editMode.value ? 'Edit' : 'Create'} ${setupIsAA.value ? 'A/A' : 'A/B'} test`)

// All variations are selectable when creating a test.
const testableVariations = computed(() => variationBatches)

const previewProduct = computed(() => products[0])
// A few distinct product shots to preview each arm as a small gallery.
const armProducts = [products[0], products[1], products[3]]

// Chance to win, for the list: the leading arm's win probability + which arm leads.
function chanceToWin(t) {
  return Math.max(t.arms.variant.chanceToWin, t.arms.original.chanceToWin)
}
function chanceLeadsVariant(t) {
  return t.arms.variant.chanceToWin >= t.arms.original.chanceToWin
}

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
  state.openAbTest = 'new'   // the isSetup watcher initializes the rest of the form
}

function backToList() {
  state.openAbTest = null
}

// Jump to the tested variation's page on the Variations tab.
function viewVariation(test) {
  if (!test.variationId) return
  state.openAbTest = null
  state.openVariation = test.variationId
  state.appTab = 'variations'
}

// Re-open the setup modal to edit an existing draft, pre-filled with its config.
function openEdit(test) {
  setupControl.value = test.includeControl
  setupVariations.value = test.variationId ? [test.variationId] : []
  setupDays.value = test.days
  setupAutoStop.value = test.autoStop
  setupMinOrders.value = test.minOrders
  setupConfidence.value = test.stopConfidence
  editingId.value = test.id
}

function saveEdit() {
  const t = abTests.find(x => x.id === editingId.value)
  if (t) {
    const vid = setupVariations.value[0] || null
    const batch = vid ? variationBatches.find(b => b.id === vid) : null
    t.variationId = vid
    t.type = setupIsAA.value ? 'aa' : 'ab'
    t.includeControl = setupControl.value
    t.days = setupDays.value
    t.autoStop = setupAutoStop.value
    t.minOrders = setupMinOrders.value
    t.stopConfidence = setupConfidence.value
    // Keep the name in sync with the config.
    t.name = setupIsAA.value
      ? 'A/A test — Original photos'
      : (batch ? (setupControl.value ? `${batch.name} vs Original` : batch.name) : t.name)
  }
  editingId.value = null
}

// Close the modal: drop back to the list when creating, stay on the draft when editing.
function closeSetup() {
  if (editMode.value) editingId.value = null
  else backToList()
}

const emptyArms = () => ({
  original: { visitors: 0, addToCarts: 0, orders: 0, revenue: 0, chanceToWin: 50 },
  variant: { visitors: 0, addToCarts: 0, orders: 0, revenue: 0, chanceToWin: 50 },
})

// Create the test(s) as a DRAFT — the user starts them from the detail page.
// No variation selected → a single A/A test; otherwise one A/B test per variation.
function createTests() {
  if (!setupVariations.value.length && !setupControl.value) return

  const base = {
    status: 'draft',
    day: 0, days: setupDays.value,
    winner: null,
    applied: false,
    confidence: 0,
    uplift: null,
    includeControl: setupControl.value,
    autoStop: setupAutoStop.value,
    minOrders: setupMinOrders.value,
    stopConfidence: setupConfidence.value,
  }

  // A/A test: control group only, no variation.
  if (setupIsAA.value) {
    const id = `aa-test-${abTests.length + 1}`
    abTests.unshift({ id, variationId: null, type: 'aa', name: 'A/A test — Original photos', ...base, arms: emptyArms() })
    state.openAbTest = id
    return
  }

  // A/B test: one per selected variation, each against the original photos.
  let firstId = null
  setupVariations.value.forEach((vid) => {
    const batch = variationBatches.find(b => b.id === vid)
    if (!batch) return
    const id = `${batch.id}-test-${abTests.length + 1}`
    if (!firstId) firstId = id
    abTests.unshift({
      id,
      variationId: batch.id,
      type: 'ab',
      name: setupControl.value ? `${batch.name} vs Original` : batch.name,
      ...base,
      arms: emptyArms(),
    })
  })
  state.openAbTest = firstId
}

// Start a draft or resume a paused test.
function runTest(test) {
  if (test.day === 0) test.day = 1
  test.status = 'running'
  state.abTestRunning = true
}

function stopTest(test) {
  test.status = 'completed'
  test.winner = 'variant'
  state.abTestRunning = abTests.some(t => t.status === 'running')
}

function pauseTest(test) {
  test.status = 'paused'
  state.abTestRunning = abTests.some(t => t.status === 'running')
}

function deleteTest(test) {
  const i = abTests.indexOf(test)
  if (i >= 0) abTests.splice(i, 1)
  state.abTestRunning = abTests.some(t => t.status === 'running')
  backToList()
}

function applyWinner(test) {
  test.applied = true
}

// A/A test = original photos vs a default AI-generated image (no named variation).
const isAA = computed(() => currentTest.value?.type === 'aa')
const armLabels = computed(() => isAA.value
  ? { orig: 'Original', origSub: 'Control', variant: 'Generated', variantSub: 'AI' }
  : { orig: 'Original', origSub: 'Control', variant: 'AI variation', variantSub: 'Variant' })

// ── rename ──
const renaming = ref(false)
const renameDraft = ref('')
const confirmDelete = ref(false)
function startRename() {
  renameDraft.value = currentTest.value?.name || ''
  renaming.value = true
}
function saveRename() {
  const v = renameDraft.value.trim()
  if (v && currentTest.value) currentTest.value.name = v
  renaming.value = false
}
function cancelRename() {
  renaming.value = false
}
watch(() => state.openAbTest, () => { renaming.value = false; confirmDelete.value = false })

// Status pill label + colour, shared by the detail header and the list.
function statusMeta(t) {
  if (t.status === 'draft') return { label: 'Draft', cls: 'text-[#616161] bg-[#f1f1f1] border border-[#e3e3e3]' }
  if (t.status === 'running') return { label: `Running · day ${t.day} of ${t.days}`, cls: 'text-[#0c6b45] bg-[#d7f2e4]' }
  if (t.status === 'paused') return { label: 'Paused', cls: 'text-[#9a6a00] bg-[#fdf1e3]' }
  return { label: t.applied ? 'Completed · applied' : 'Completed', cls: 'text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7]' }
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
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <template v-if="renaming">
            <input
              v-model="renameDraft"
              @keyup.enter="saveRename" @keyup.escape="cancelRename"
              class="pb-field text-xl font-bold text-[#1a1a1a] rounded-lg border border-[#d4d4d4] px-2 py-0.5 outline-none"
            />
            <button class="pb-btn-primary shrink-0" @click="saveRename" aria-label="Save"><Check :size="14" /></button>
            <button class="pb-btn-ghost shrink-0" @click="cancelRename" aria-label="Cancel"><X :size="14" /></button>
          </template>
          <template v-else>
            <h1 class="text-xl font-bold text-[#1a1a1a] truncate">{{ currentTest.name }}</h1>
            <button class="text-[#8a8a8a] hover:text-[#5548e0] cursor-pointer shrink-0" @click="startRename" aria-label="Rename">
              <Pencil :size="15" />
            </button>
          </template>
        </div>
        <p class="text-[13px] text-[#616161] mt-1">{{ isAA ? 'Original vs generated' : `${batchFor(currentTest)?.count} products` }} · 50/50 traffic split</p>
      </div>

      <div class="flex items-center gap-2 shrink-0 mt-1">
        <span class="text-[11px] font-semibold rounded-full px-2 py-0.5" :class="statusMeta(currentTest).cls">
          {{ statusMeta(currentTest).label }}
        </span>
        <button v-if="currentTest.status === 'draft'" class="pb-btn-secondary" @click="openEdit(currentTest)">
          <SlidersHorizontal :size="14" /> Edit setup
        </button>
        <button v-if="currentTest.status === 'draft'" class="pb-btn-primary" @click="runTest(currentTest)">
          <Play :size="14" /> Start test
        </button>
        <button v-else-if="currentTest.status === 'running'" class="pb-btn-secondary" @click="pauseTest(currentTest)">
          <Pause :size="14" /> Pause
        </button>
        <button v-else-if="currentTest.status === 'paused'" class="pb-btn-primary" @click="runTest(currentTest)">
          <Play :size="14" /> Resume
        </button>
        <button
          v-if="currentTest.status === 'running' || currentTest.status === 'paused'"
          class="pb-btn-secondary" @click="stopTest(currentTest)"
        >
          <StopCircle :size="14" /> Stop test early
        </button>
      </div>
    </div>

    <!-- Result banner (completed) -->
    <div v-if="currentTest.status === 'completed'" class="pb-card p-4 mb-4 flex items-center gap-3 bg-[#f2fbf6]!">
      <span class="w-9 h-9 rounded-lg bg-[#36c98e] flex items-center justify-center shrink-0">
        <Trophy :size="17" class="text-white" />
      </span>
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">The {{ isAA ? 'generated' : 'AI' }} images won with {{ currentTest.uplift }} more add-to-carts</p>
        <p class="text-[12px] text-[#616161]">{{ currentTest.confidence }}% confidence over {{ currentTest.days }} days. Safe to roll out.</p>
      </div>
      <button v-if="!currentTest.applied" class="pb-btn-primary shrink-0" @click="applyWinner(currentTest)">
        <Check :size="13" /> Apply winning images
      </button>
      <p v-else class="text-[13px] font-semibold text-[#0c6b45] flex items-center gap-1.5 shrink-0">
        <Check :size="14" /> Winner applied
      </p>
    </div>

    <!-- Draft notice -->
    <div v-else-if="currentTest.status === 'draft'" class="rounded-xl bg-[#f7f7f7] border border-[#ececec] px-4 py-3 mb-4 text-[13px] text-[#616161]">
      This test is a draft. Review the setup, then hit <span class="font-semibold text-[#1a1a1a]">Start test</span> to launch it.
    </div>

    <!-- Time status (running / paused) -->
    <template v-else>
      <p class="text-[12px] text-[#616161] mb-4">
        <template v-if="currentTest.status === 'paused'">Paused on day {{ currentTest.day }} of {{ currentTest.days }}. Resume anytime.</template>
        <template v-else>Day {{ currentTest.day }} of {{ currentTest.days }} · {{ currentTest.days - currentTest.day }} days left</template>
      </p>
    </template>

    <!-- Confidence meter: hidden for drafts (no data yet) -->
    <div v-if="currentTest.status !== 'draft'" class="pb-card p-5 mb-4">
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

      <!-- track with a threshold marker -->
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
        <div class="flex flex-col items-start gap-2">
          <div class="flex -space-x-3">
            <div v-for="p in armProducts" :key="p.id" class="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white shadow-sm">
              <img :src="p.img" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="text-left">
            <p class="text-[13px] font-semibold text-[#1a1a1a] leading-tight">{{ armLabels.orig }}</p>
            <p class="text-[11px] text-[#8a8a8a]">{{ armLabels.origSub }}</p>
          </div>
        </div>
        <div
          class="flex flex-col items-start gap-2"
          :class="currentTest.variationId ? 'group cursor-pointer' : ''"
          @click="currentTest.variationId && viewVariation(currentTest)"
        >
          <div class="flex -space-x-3">
            <div v-for="p in armProducts" :key="p.id" class="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white shadow-sm transition-transform group-hover:-translate-y-0.5">
              <StyledImage :src="p.img" :overlay="styleById(batchFor(currentTest)?.styleId || 'lifestyle').overlay" enhance compact />
            </div>
          </div>
          <div class="text-left">
            <p class="text-[13px] font-semibold text-[#3a3468] leading-tight flex items-center gap-1 group-hover:text-[#5548e0]">
              {{ armLabels.variant }}
              <ExternalLink v-if="currentTest.variationId" :size="12" class="opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
            <p class="text-[11px] text-[#8a8a8a] flex items-center gap-1.5 justify-start">
              {{ armLabels.variantSub }}
              <span v-if="currentTest.status === 'completed' && currentTest.winner === 'variant'" class="text-[10px] font-semibold text-white bg-[#36c98e] rounded-full px-1.5 py-0.5">Winner</span>
            </p>
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
          class="text-left text-[15px] tabular-nums"
          :class="better(def) === 'original' ? 'font-bold text-[#1a1a1a]' : 'font-semibold text-[#8a8a8a]'"
        >{{ fmtVal('original', def) }}</span>
        <span class="flex items-center justify-start gap-2">
          <span
            class="text-[15px] tabular-nums"
            :class="better(def) === 'variant' ? 'font-bold text-[#3a3468]' : 'font-semibold text-[#8a8a8a]'"
          >{{ fmtVal('variant', def) }}</span>
          <span
            v-if="def.delta"
            class="text-[11px] font-semibold tabular-nums shrink-0"
            :class="deltaPct(def) >= 0 ? 'text-[#0c6b45]' : 'text-[#c0392b]'"
          >{{ deltaText(def) }}</span>
        </span>
      </div>
    </div>

    <!-- Auto-stop settings — editable while the test is not finished -->
    <div v-if="currentTest.status !== 'completed'" class="pb-card p-5 mb-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="font-semibold text-[#1a1a1a] text-[13px]">Auto-stop</p>
          <p class="text-[12px] text-[#616161] mt-0.5">End the test on its own once there is a clear winner. You can change this any time.</p>
        </div>
        <button class="flex items-center gap-2 shrink-0 cursor-pointer" @click="currentTest.autoStop = !currentTest.autoStop">
          <span class="w-9 h-[20px] rounded-full transition-colors duration-300 relative" :class="currentTest.autoStop ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'">
            <span class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300" :class="currentTest.autoStop ? 'left-[18px]' : 'left-[2px]'"></span>
          </span>
          <span class="text-[13px] font-medium text-[#303030] w-6">{{ currentTest.autoStop ? 'On' : 'Off' }}</span>
        </button>
      </div>
      <div v-if="currentTest.autoStop" class="grid grid-cols-2 gap-3 mt-3 max-w-[420px]">
        <div>
          <label class="text-[12px] font-medium text-[#616161] block mb-1">Minimum orders</label>
          <input
            v-model.number="currentTest.minOrders"
            type="number" min="1"
            class="pb-field w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none"
          />
        </div>
        <div>
          <label class="text-[12px] font-medium text-[#616161] block mb-1">Confidence threshold</label>
          <select
            v-model.number="currentTest.stopConfidence"
            class="pb-field w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none"
          >
            <option v-for="c in confidenceOptions" :key="c" :value="c">{{ c }}%</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Delete -->
    <div class="flex items-center justify-end gap-2">
      <template v-if="confirmDelete">
        <span class="text-[12px] text-[#616161]">Delete this test permanently?</span>
        <button class="pb-btn-secondary" @click="confirmDelete = false">Cancel</button>
        <button class="inline-flex items-center gap-1.5 rounded-lg bg-[#c0392b] text-white text-[13px] font-semibold px-3 py-1.5 cursor-pointer hover:brightness-110" @click="deleteTest(currentTest)">
          <Trash2 :size="13" /> Delete test
        </button>
      </template>
      <button v-else class="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#c0392b] hover:underline cursor-pointer" @click="confirmDelete = true">
        <Trash2 :size="14" /> Delete test
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
      <button class="pb-btn-primary shrink-0" @click="openSetup"><Plus :size="13" /> Create new test</button>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="t in abTests" :key="t.id"
        class="pb-card pb-card-interactive px-3 py-2.5 flex items-center gap-4 cursor-pointer"
        @click="openTest(t.id)"
      >
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ t.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ t.type === 'aa' ? 'Original vs generated' : `${batchFor(t)?.count} products` }} · 50/50 split</p>
        </div>

        <!-- Chance to win -->
        <div v-if="t.status !== 'draft'" class="shrink-0 w-24">
          <div class="flex items-baseline justify-between gap-1 mb-1.5">
            <span class="text-[10px] text-[#8a8a8a] leading-none">{{ chanceLeadsVariant(t) ? 'B' : 'A' }} to win</span>
            <span class="text-[12px] font-bold tabular-nums leading-none" :class="t.status === 'completed' ? 'text-[#0c6b45]' : 'text-[#3a3468]'">{{ chanceToWin(t) }}%</span>
          </div>
          <div class="h-1 rounded-full bg-[#ececec] overflow-hidden">
            <div class="h-full rounded-full" :class="t.status === 'completed' ? 'bg-[#36c98e]' : 'bg-[#5548e0]'" :style="{ width: chanceToWin(t) + '%' }"></div>
          </div>
        </div>

        <span class="w-32 shrink-0 ml-4 text-[12px] font-semibold" :class="t.status === 'completed' ? 'text-[#0c6b45]' : 'text-[#616161]'">
          <template v-if="t.uplift">{{ t.uplift }} add-to-cart</template>
        </span>
        <div class="w-40 flex justify-end shrink-0">
          <span class="text-[11px] font-semibold rounded-full px-2 py-0.5" :class="statusMeta(t).cls">
            {{ statusMeta(t).label }}
          </span>
        </div>
        <ChevronRight :size="16" class="text-[#8a8a8a] shrink-0" />
      </div>
    </div>
  </div>

  <!-- Create / edit test modal -->
  <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40" @click="closeSetup"></div>
    <div class="pb-card relative z-10 w-full max-w-[540px] max-h-[90vh] overflow-y-auto p-5">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div>
          <p class="text-lg font-bold text-[#1a1a1a] leading-tight">{{ modalTitle }}</p>
        </div>
        <button class="text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer shrink-0" @click="closeSetup">
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
        <button class="pb-btn-secondary" @click="closeSetup">Cancel</button>
        <button
          v-if="editMode"
          class="pb-btn-primary"
          :disabled="!setupVariations.length && !setupControl"
          @click="saveEdit"
        >
          <Check :size="13" /> Save changes
        </button>
        <button
          v-else
          class="pb-btn-primary"
          :disabled="!setupVariations.length && !setupControl"
          @click="createTests"
        >
          <Plus :size="13" /> {{ setupIsAA ? 'Create A/A test' : 'Create A/B test' }}
        </button>
      </div>
    </div>
  </div>
</template>