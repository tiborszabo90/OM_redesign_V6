<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { state, products, abTests, variationBatches, styleById, armSplit, testVariationIds } from '../store'
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

// ── list previews ──
// A/B thumbnails rotate through real shots so the list feels alive. Arm A is always
// a plain product photo; arm B is always a lifestyle scene, so the two never match.
const armAImages = [
  '/picbear/bag-studio.jpg',
  '/picbear/beans-burlap.jpg',
  '/picbear/beans-pile.jpg',
  '/picbear/cup-espresso.jpg',
  '/picbear/cup-topview.jpg',
  '/picbear/mug-cookies.jpg',
]
const armBImages = [
  '/picbear/lattes-plants.jpg',
  '/picbear/people-kitchen.jpg',
  '/picbear/people-latte.jpg',
  '/picbear/pouring.jpg',
  '/picbear/cold-brew.jpg',
  '/picbear/machine-counter.jpg',
]
const rotateTick = ref(0)
let rotateTimer = null
onMounted(() => { rotateTimer = setInterval(() => { rotateTick.value++ }, 2600) })
onUnmounted(() => { clearInterval(rotateTimer) })
// Each row starts at a different point in its set and advances, so rows stay distinct.
function rowThumbA(i) {
  return armAImages[(rotateTick.value + i * 3) % armAImages.length]
}
function rowThumbB(i) {
  return armBImages[(rotateTick.value + i * 3) % armBImages.length]
}

// Chance to win, for the list: the leading arm's win probability + which arm leads.
// Arms are labelled A, B, C… in the order they were set up, control first.
function leadingArm(t) {
  return t.arms.reduce((best, a) => (a.chanceToWin > best.chanceToWin ? a : best), t.arms[0])
}
function chanceToWin(t) {
  return leadingArm(t).chanceToWin
}
function armInitial(t, a) {
  return String.fromCharCode(65 + t.arms.indexOf(a))
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

// A product only counts if every tested variation has an image for it —
// otherwise one arm would serve the original and the comparison would be unfair.
function testedProductCount(test) {
  const batches = test.arms.filter(a => a.variationId).map(a => variationBatches.find(b => b.id === a.variationId)).filter(Boolean)
  if (!batches.length) return 0
  return batches[0].generatedIds.filter(id => batches.every(b => b.generatedIds.includes(id))).length
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
  return t.arms.map(withRates)
})
// Everything is read against the control; without one, the first arm stands in.
const controlKpi = computed(() => kpi.value?.find(a => a.isControl) || kpi.value?.[0] || null)
// One column per arm, plus the metric-name column.
const armGrid = computed(() => `1.3fr repeat(${kpi.value?.length || 1}, 1fr)`)

// Confidence = probability the leading arm is truly better. Winner called at the
// test's auto-stop threshold (default 95%).
const SIGNIFICANCE = computed(() => currentTest.value?.stopConfidence || 95)
const leader = computed(() => kpi.value.reduce((best, a) => (a.chanceToWin > best.chanceToWin ? a : best), kpi.value[0]))
const leaderLabel = computed(() => leader.value.label)
const winProb = computed(() => leader.value.chanceToWin)
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

function fmtVal(a, def) {
  const v = a[def.key]
  if (def.type === 'money') return fmtMoney(v)
  if (def.type === 'pct') return fmtPct(v)
  return fmtInt(v)
}
// Every arm is read against the control, so the control itself carries no delta.
function deltaPct(a, def) {
  const c = controlKpi.value
  if (!c || a === c || !c[def.key]) return null
  return ((a[def.key] - c[def.key]) / c[def.key]) * 100
}
function deltaText(a, def) {
  const d = deltaPct(a, def)
  return d === null ? '' : (d >= 0 ? '+' : '') + d.toFixed(0) + '%'
}
// Which arm wins a given metric (visitors excluded — that's just the traffic
// split). A tie has no winner, so nothing is highlighted.
function bestArmKey(def) {
  if (def.key === 'visitors') return null
  const top = Math.max(...kpi.value.map(a => a[def.key]))
  const winners = kpi.value.filter(a => a[def.key] === top)
  return winners.length === 1 ? winners[0].key : null
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

// Jump to the variation an arm shows, on the Variations tab.
function viewVariationId(variationId) {
  if (!variationId) return
  state.openAbTest = null
  state.openVariation = variationId
  state.appTab = 'variations'
}

// Re-open the setup modal to edit an existing draft, pre-filled with its config.
function openEdit(test) {
  setupControl.value = test.includeControl
  setupVariations.value = testVariationIds(test)
  setupDays.value = test.days
  setupAutoStop.value = test.autoStop
  setupMinOrders.value = test.minOrders
  setupConfidence.value = test.stopConfidence
  editingId.value = test.id
}

function saveEdit() {
  const t = abTests.find(x => x.id === editingId.value)
  if (t) {
    t.variationId = setupVariations.value[0] || null
    t.type = setupIsAA.value ? 'aa' : 'ab'
    t.includeControl = setupControl.value
    t.days = setupDays.value
    t.autoStop = setupAutoStop.value
    t.minOrders = setupMinOrders.value
    t.stopConfidence = setupConfidence.value
    t.arms = buildArms()
    t.name = testName()
  }
  editingId.value = null
}

// Close the modal: drop back to the list when creating, stay on the draft when editing.
function closeSetup() {
  if (editMode.value) editingId.value = null
  else backToList()
}

const zero = () => ({ visitors: 0, addToCarts: 0, orders: 0, revenue: 0, chanceToWin: 0 })

// One arm per pick: the control first when it is included, then a variation each.
// An A/A test is the control against itself, which is how the app checks the
// split is honest before anyone trusts a real result.
function buildArms() {
  const arms = []
  if (setupIsAA.value) {
    arms.push({ key: 'control', label: 'Original photos', variationId: null, isControl: true, ...zero() })
    arms.push({ key: 'control_b', label: 'Original photos (B)', variationId: null, isControl: true, ...zero() })
  } else {
    if (setupControl.value) arms.push({ key: 'control', label: 'Original photos', variationId: null, isControl: true, ...zero() })
    setupVariations.value.forEach((vid, i) => {
      const batch = variationBatches.find(b => b.id === vid)
      if (batch) arms.push({ key: `v${i + 1}`, label: batch.name, variationId: batch.id, isControl: false, ...zero() })
    })
  }
  // Every arm starts equally likely to win.
  const even = Math.round(100 / arms.length)
  arms.forEach(a => { a.chanceToWin = even })
  return arms
}

function testName() {
  if (setupIsAA.value) return 'A/A test — Original photos'
  const names = setupVariations.value
    .map(vid => variationBatches.find(b => b.id === vid)?.name)
    .filter(Boolean)
  if (names.length > 1) return `${names.length} variations vs Original`
  return setupControl.value ? `${names[0]} vs Original` : names[0]
}

// Create the test as a DRAFT — the user starts it from the detail page. Picking
// several variations makes one test with several arms, not several tests.
function createTests() {
  if (!setupVariations.value.length && !setupControl.value) return

  const arms = buildArms()
  if (arms.length < 2) return
  const primary = arms.find(a => a.variationId)
  const id = `${primary ? primary.variationId : 'aa'}-test-${abTests.length + 1}`

  abTests.unshift({
    id,
    variationId: primary ? primary.variationId : null,
    type: setupIsAA.value ? 'aa' : 'ab',
    name: testName(),
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
    arms,
  })
  state.openAbTest = id
}

// Start a draft or resume a paused test.
function runTest(test) {
  if (test.day === 0) test.day = 1
  test.status = 'running'
  state.abTestRunning = true
}

function stopTest(test) {
  test.status = 'completed'
  test.winner = leadingArm(test).key
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

// A/A test = the original photos against themselves, to sanity-check the split.
const isAA = computed(() => currentTest.value?.type === 'aa')
// The variation an arm shows, so its thumbnails and link are the right ones.
function batchForArm(a) {
  return a.variationId ? variationBatches.find(b => b.id === a.variationId) : null
}
function armSub(a) {
  return a.isControl ? 'Control' : styleById(batchForArm(a)?.styleId || 'lifestyle').name
}

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
// The empty-state illustration keeps its rows short, whatever a test is called.
function shortName(name) {
  return name.length > 15 ? name.slice(0, 15) + '\u2026' : name
}

function statusMeta(t) {
  if (t.status === 'draft') return { label: 'Draft', cls: 'text-[#616161] bg-[#f1f1f1] border border-[#e3e3e3]' }
  if (t.status === 'running') return { label: `Running · day ${t.day} of ${t.days}`, cls: 'text-[#0c6b45] bg-[#d7f2e4]' }
  if (t.status === 'paused') return { label: 'Paused', cls: 'text-[#9a6a00] bg-[#fdf1e3]' }
  return { label: t.applied ? 'Completed · applied' : 'Completed', cls: 'text-[#6b3319] bg-[#fdf4ef] border border-[#f2d9c9]' }
}

function finishSetup() {
  state.appTab = 'home'
  state.screen = state.steps.style ? 'placement' : 'style'
}
</script>

<template>
  <!-- Locked until first publish -->
  <div v-if="!state.published" class="max-w-[960px] mx-auto px-6 py-5">
    <div class="rounded-[28px] bg-white border border-[#ececec] p-10 flex items-center gap-10">
      <div class="w-[300px] shrink-0">
        <span class="w-12 h-12 rounded-xl bg-[#fdf4ef] border border-[#f2d9c9] inline-flex items-center justify-center mb-4">
          <FlaskConical :size="22" class="text-[#b2592e]" />
        </span>
        <h1 class="text-[28px] leading-[1.15] font-bold text-[#1a1a1a] mb-3">Prove that better images sell more</h1>
        <p class="text-[14px] text-[#616161] leading-relaxed mb-6">
          An A/B test shows your original photos to half of your visitors and the AI versions to the other half.
          You see clicks, add to carts and orders for both, so the decision is based on data, not taste.
        </p>
        <button class="pb-btn-primary" @click="finishSetup">
          <Lock :size="13" /> Publish your first images to unlock
        </button>
      </div>

      <!-- Static preview: what the test list becomes once the first images are live -->
      <div class="flex-1 min-w-0 bg-white rounded-[20px] shadow-[0_8px_28px_rgba(0,0,0,0.10)] p-5 pointer-events-none select-none">
        <p class="text-[11px] font-medium uppercase tracking-wide text-[#8a8a8a] mb-3">Once you are live</p>
        <div class="flex flex-col gap-3">
          <div v-for="(t, i) in abTests.slice(0, 2)" :key="t.id" class="flex items-center gap-3">
            <div class="flex items-center gap-1.5 shrink-0">
              <div class="w-10 h-10 rounded-md bg-[#f1f1f1]"></div>
              <div class="w-10 h-10 rounded-md bg-[#f1f1f1]"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-[#1a1a1a] truncate">{{ shortName(t.name) }}</p>
              <p class="text-[11px] text-[#616161]">{{ t.arms.length }} arms</p>
            </div>
            <div v-if="t.status !== 'draft'" class="shrink-0 w-16">
              <div class="flex items-baseline justify-between gap-1 mb-1">
                <span class="text-[10px] text-[#8a8a8a] leading-none whitespace-nowrap">{{ armInitial(t, leadingArm(t)) }} wins</span>
                <span class="text-[11px] font-bold tabular-nums leading-none" :class="t.status === 'completed' ? 'text-[#0c6b45]' : 'text-[#6b3319]'">{{ chanceToWin(t) }}%</span>
              </div>
              <div class="h-1 rounded-full bg-[#ececec] overflow-hidden">
                <div class="h-full rounded-full" :class="t.status === 'completed' ? 'bg-[#36c98e]' : 'bg-[#b2592e]'" :style="{ width: chanceToWin(t) + '%' }"></div>
              </div>
            </div>
            <div class="w-[136px] flex justify-end shrink-0">
              <span class="text-[11px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap" :class="statusMeta(t).cls">
                {{ statusMeta(t).label }}
              </span>
            </div>
          </div>
        </div>
      </div>
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
            <button class="text-[#8a8a8a] hover:text-[#b2592e] cursor-pointer shrink-0" @click="startRename" aria-label="Rename">
              <Pencil :size="15" />
            </button>
          </template>
        </div>
        <p class="text-[13px] text-[#616161] mt-1">
          {{ isAA ? 'Original photos against themselves' : `${testedProductCount(currentTest)} products in every arm` }} ·
          {{ currentTest.arms.length }} arms · {{ armSplit(currentTest) }}% of traffic each
        </p>
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
        <p class="font-semibold text-[#1a1a1a]">{{ leaderLabel }} won with {{ currentTest.uplift }} more add-to-carts</p>
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
          <p class="text-3xl font-bold leading-none tabular-nums" :class="significant ? 'text-[#0c6b45]' : 'text-[#6b3319]'">{{ winProb }}%</p>
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
            :class="significant ? 'bg-[#36c98e]' : 'bg-[#b2592e]'"
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
      <!-- column headers: one per arm, control first -->
      <div class="grid items-end gap-3 pb-3 border-b border-[#ececec]" :style="{ gridTemplateColumns: armGrid }">
        <span></span>
        <div
          v-for="(a, i) in kpi" :key="a.key"
          class="flex flex-col items-start gap-2"
          :class="a.variationId ? 'group cursor-pointer' : ''"
          @click="a.variationId && viewVariationId(a.variationId)"
        >
          <div class="flex -space-x-3">
            <div
              v-for="p in armProducts" :key="p.id"
              class="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white shadow-sm transition-transform group-hover:-translate-y-0.5"
            >
              <img v-if="a.isControl" :src="p.img" class="w-full h-full object-cover" />
              <StyledImage v-else :src="p.img" :overlay="styleById(batchForArm(a)?.styleId || 'lifestyle').overlay" enhance compact />
            </div>
          </div>
          <div class="text-left">
            <p
              class="text-[13px] font-semibold leading-tight flex items-center gap-1"
              :class="a.isControl ? 'text-[#1a1a1a]' : 'text-[#6b3319] group-hover:text-[#b2592e]'"
            >
              <span class="text-[10px] font-bold text-[#8a8a8a] shrink-0">{{ String.fromCharCode(65 + i) }}</span>
              <span class="truncate">{{ a.label }}</span>
              <ExternalLink v-if="a.variationId" :size="12" class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </p>
            <p class="text-[11px] text-[#8a8a8a] flex items-center gap-1.5 justify-start">
              {{ armSub(a) }}
              <span v-if="currentTest.status === 'completed' && currentTest.winner === a.key" class="text-[10px] font-semibold text-white bg-[#36c98e] rounded-full px-1.5 py-0.5">Winner</span>
            </p>
          </div>
        </div>
      </div>

      <!-- KPI rows -->
      <div
        v-for="def in metricDefs" :key="def.key"
        class="grid items-center gap-3 py-2.5 border-b border-[#f4f4f4] last:border-0"
        :style="{ gridTemplateColumns: armGrid }"
      >
        <span class="text-[13px] text-[#616161]">{{ def.label }}</span>
        <span v-for="a in kpi" :key="a.key" class="flex items-center justify-start gap-2">
          <span
            class="text-[15px] tabular-nums"
            :class="bestArmKey(def) === a.key ? (a.isControl ? 'font-bold text-[#1a1a1a]' : 'font-bold text-[#6b3319]') : 'font-semibold text-[#8a8a8a]'"
          >{{ fmtVal(a, def) }}</span>
          <span
            v-if="def.delta && deltaText(a, def)"
            class="text-[11px] font-semibold tabular-nums shrink-0"
            :class="deltaPct(a, def) >= 0 ? 'text-[#0c6b45]' : 'text-[#c0392b]'"
          >{{ deltaText(a, def) }}</span>
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
        <p class="text-[13px] text-[#616161] mt-1">Your original photos against one or more AI variations, traffic split evenly. Let the numbers decide.</p>
      </div>
      <button class="pb-btn-primary shrink-0" @click="openSetup"><Plus :size="13" /> Create new test</button>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="(t, i) in abTests" :key="t.id"
        class="pb-card pb-card-interactive px-3 py-2.5 flex items-center gap-4 cursor-pointer"
        @click="openTest(t.id)"
      >
        <!-- A vs B rotating preview -->
        <div class="flex items-center gap-1.5 shrink-0">
          <div class="relative w-16 h-16 rounded-md overflow-hidden ring-1 ring-[#ececec]">
            <img :src="rowThumbA(i)" class="absolute inset-0 w-full h-full object-cover" />
            <span class="absolute bottom-0 left-0 z-10 text-[8px] font-bold text-white bg-black/55 px-1 rounded-tr-md">A</span>
          </div>
          <div class="relative w-16 h-16 rounded-md overflow-hidden ring-1 ring-[#f2d9c9]">
            <div class="absolute inset-0">
              <StyledImage :src="rowThumbB(i)" :overlay="styleById(batchFor(t)?.styleId || 'lifestyle').overlay" enhance compact />
            </div>
            <span class="absolute bottom-0 left-0 z-10 text-[8px] font-bold text-white bg-[#b2592e] px-1 rounded-tr-md">B</span>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ t.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ t.type === 'aa' ? 'Original photos against themselves' : `${testedProductCount(t)} products` }} · {{ t.arms.length }} arms · {{ armSplit(t) }}% each</p>
        </div>

        <!-- Chance to win -->
        <div v-if="t.status !== 'draft'" class="shrink-0 w-24">
          <div class="flex items-baseline justify-between gap-1 mb-1.5">
            <span class="text-[10px] text-[#8a8a8a] leading-none">{{ armInitial(t, leadingArm(t)) }} to win</span>
            <span class="text-[12px] font-bold tabular-nums leading-none" :class="t.status === 'completed' ? 'text-[#0c6b45]' : 'text-[#6b3319]'">{{ chanceToWin(t) }}%</span>
          </div>
          <div class="h-1 rounded-full bg-[#ececec] overflow-hidden">
            <div class="h-full rounded-full" :class="t.status === 'completed' ? 'bg-[#36c98e]' : 'bg-[#b2592e]'" :style="{ width: chanceToWin(t) + '%' }"></div>
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
        <input type="checkbox" v-model="setupControl" class="pb-field mt-0.5 w-4 h-4 accent-[#1a1a1a]" />
        <span class="text-[13px] text-[#1a1a1a] leading-snug">
          Include control group
          <span class="text-[#616161]">(show your original photos to a portion of visitors)</span>
        </span>
      </label>

      <!-- Select variations -->
      <p class="text-[12px] font-semibold text-[#616161] mb-1">Select variations</p>
      <p class="text-[12px] text-[#616161] mb-2">
        Pick more than one and they run in the same test, each against the control and
        against each other. Traffic is split evenly between the arms.
      </p>
      <div class="flex flex-col gap-2">
        <label
          v-for="b in testableVariations" :key="b.id"
          class="flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer"
          :class="setupVariations.includes(b.id) ? 'border-[#b2592e] bg-[#fdf4ef]' : 'border-[#ececec] hover:border-[#d4d4d4]'"
        >
          <input type="checkbox" :value="b.id" v-model="setupVariations" class="pb-field w-4 h-4 accent-[#1a1a1a] shrink-0" />
          <div class="w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-[#ececec]">
            <StyledImage :src="previewProduct.img" :overlay="styleById(b.styleId).overlay" enhance compact />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-medium text-[#1a1a1a] truncate">{{ b.name }} <span class="text-[#8a8a8a] font-normal">({{ b.generatedIds.length }} products)</span></p>
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
          :class="setupDays === d ? 'border-[#b2592e] text-[#6b3319] bg-[#fdf4ef]' : 'border-[#d4d4d4] text-[#303030] bg-white hover:bg-[#fafafa]'"
          @click="setupDays = d"
        >
          <Check v-if="setupDays === d" :size="13" class="text-[#b2592e]" />
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