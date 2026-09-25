<script setup>
/**
 * One run, opened up large — V5's window.
 *
 * The original's window, with the one thing that made it a trap taken out: it is no
 * longer where the run lives. The run lives in the thread, and this is a view of it,
 * so putting it down is a change of drawing and closing it cannot lose anything.
 *
 * And it has no chat of its own. The right-hand column is the session's own turns
 * about this run, filtered; what you type here is sent to that same thread, tagged
 * with this run. One conversation, looked at through a lens.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, ArrowUp, Check, ChevronLeft, ChevronRight, ImagePlus, Loader2, Maximize2, Minimize2, Plus, X } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT, MODAL_SHADOW } from '../tokens'
import {
  session, products, connections, runs, runOverlay, runById, openRun, runForConcept, startRun, runPending, runTurns, runChipBadges, runTryChips,
  runVersions, keepRunVersion, expandRun, refineRun, setRunProducts, useRunInCampaign,
  dismissRun, minimizeRun, runIsDraft, keepRunWithoutCatalog, RUN_PRODUCT_SLOTS,
} from '../store'
import OqCatalogPicker from './OqCatalogPicker.vue'
import OqCatalogConnect from './OqCatalogConnect.vue'
import OqCampaignPicker from './OqCampaignPicker.vue'
import OqConfirm from './OqConfirm.vue'

const props = defineProps({
  /**
   * V3: the X only closes the window. The run stays where it is, and one that is never
   * placed in a campaign costs nothing by being kept — so there is nothing to discard,
   * and nothing for the put-down button to do that the X does not.
   */
  closeOnly: { type: Boolean, default: false },
  /**
   * V3: the other directions under the header, so two can be compared at this size
   * rather than at the column's. Drafts are left out, except the one on screen.
   */
  switcher: { type: Boolean, default: false },
})

const pickerOpen = ref(false)
const campaignOpen = ref(false)
const discardOpen = ref(false)
const note = ref('')
const turnsEnd = ref(null)

const run = computed(() => runById(runOverlay.runId))
const busy = computed(() => run.value?.status === 'running')
const stage = computed(() => run.value?.stage ?? 'one')
const total = computed(() => run.value?.productIds.length ?? 1)

/** Stage one's rounds, and the one being looked at — null is the latest. */
const versions = computed(() => (run.value && stage.value === 'one' ? runVersions(run.value) : []))
const peekBlock = ref(null)
const shownCells = computed(() => peekBlock.value?.cells ?? run.value?.cells ?? [])

/** The products the round will cover, and the feed photo the single frame was drawn from. */
const runProducts = computed(() =>
  (run.value?.productIds ?? []).map((id) => products.find((p) => p.id === id)).filter(Boolean),
)
const beforeImage = computed(() =>
  shownCells.value.length === 1
    ? products.find((p) => p.id === shownCells.value[0].productId)?.imageUrl ?? null
    : null,
)
watch([() => runOverlay.runId, () => versions.value.length], () => { peekBlock.value = null })

/** One of the round's frames opened up in the window, beside the feed photo it was made from. */
const zoomAt = ref(null)
const zoomCell = computed(() => (zoomAt.value === null ? null : shownCells.value[zoomAt.value] ?? null))
const zoomBefore = computed(() => products.find((p) => p.id === zoomCell.value?.productId)?.imageUrl ?? null)
watch([() => runOverlay.runId, () => shownCells.value.length], () => { zoomAt.value = null })

function zoomStep(by) {
  const n = shownCells.value.length
  zoomAt.value = (zoomAt.value + by + n) % n
}

function keepPeeked() {
  keepRunVersion(run.value.id, peekBlock.value)
  peekBlock.value = null
}

/** What the X actually costs. The window is a lens; letting the run go is not. */
const discardBody = computed(() => {
  const n = run.value?.cells.length ?? 0
  return `${n === 1 ? 'Its creative is deleted' : `Its ${n} creatives are deleted`}. The concept stays in the thread, so you can generate a new version from it.`
})

/**
 * Step 3: which of the catalog this direction runs on. The preview's products start it
 * off; what is picked is kept on the run, so putting the window down loses nothing.
 */
const choosing = ref(false)

function startChoosing() {
  if (!run.value.catalogIds) run.value.catalogIds = [...run.value.productIds]
  zoomAt.value = null
  choosing.value = true
}

watch(
  () => runOverlay.runId,
  () => {
    choosing.value = false
    if (runOverlay.choose && run.value) startChoosing()
    runOverlay.choose = false
  },
)
const catalogCount = computed(() => run.value?.catalogIds?.length ?? 0)

/** No catalog yet: the step asks for one before there is anything to choose from. */
const needsCatalog = computed(() => !connections.catalog.connected)
/** Said once, over the picker, the moment the catalog lands. */
const justConnected = ref(false)
watch(() => runOverlay.runId, () => { justConnected.value = false })

const steps = computed(() => [
  { n: 1, label: 'Concept refinement' },
  { n: 2, label: `Preview on ${total.value} ${total.value === 1 ? 'product' : 'products'}` },
  { n: 3, label: 'Choose products' },
  { n: 4, label: 'Use in a campaign' },
])
const headerStep = computed(() => (choosing.value ? 3 : stage.value === 'three' ? 2 : 1))
const ctaLabel = computed(() => {
  if (choosing.value && needsCatalog.value) return 'Connect a catalog first'
  if (choosing.value) return `Use on ${catalogCount.value} ${catalogCount.value === 1 ? 'product' : 'products'}`
  if (stage.value === 'three') return 'I like this — choose products'
  return `I like this — generate it on ${total.value} ${total.value === 1 ? 'product' : 'products'}`
})

/** The run's clock, read off the run so the thread block and this agree. */
const now = ref(Date.now())
let ticker = null
watch(
  () => run.value?.startedAt ?? null,
  (startedAt) => {
    clearInterval(ticker)
    if (!startedAt) return
    now.value = Date.now()
    ticker = setInterval(() => { now.value = Date.now() }, 120)
  },
  { immediate: true },
)
onBeforeUnmount(() => clearInterval(ticker))

const elapsedMs = computed(() => (run.value?.startedAt ? now.value - run.value.startedAt : 0))
const percent = computed(() => Math.min(96, Math.round((elapsedMs.value / 6000) * 100)))
const elapsedLabel = computed(() => {
  const total = Math.floor(elapsedMs.value / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
})

/** `**bold**` is the only markup the thread carries. */
function boldParts(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? { bold: true, text: part.slice(2, -2) }
        : { bold: false, text: part },
    )
}

const switchRuns = computed(() =>
  props.switcher ? runs.filter((r) => r.id === runOverlay.runId || !runIsDraft(r)) : [],
)

/**
 * The latest round's concepts that are not a run yet — or only an untouched draft —
 * so the next direction can be tried from here instead of scrolling back to the grid.
 */
const switchConcepts = computed(() => {
  if (!props.switcher) return []
  const block = [...session.blocks].reverse().find((b) => b.kind === 'concepts')
  return (block?.concepts ?? []).filter((c) => {
    const r = runForConcept(c.id)
    return !r || (runIsDraft(r) && r.id !== runOverlay.runId)
  })
})

function tryConcept(concept) {
  startRun(concept, { stage: 'one', open: true })
}

/** A note half-typed about one direction is not a note about the next one. */
watch(() => runOverlay.runId, () => { note.value = '' })


function onClose() {
  if (props.closeOnly) minimizeRun()
  else discardOpen.value = true
}

function onCta() {
  if (!run.value || busy.value) return
  if (stage.value === 'one') expandRun(run.value.id)
  else if (!choosing.value) startChoosing()
  else campaignOpen.value = true
}

/** Sent from here, kept in the session — the thread is the only conversation. */
function send() {
  const text = note.value.trim()
  if (!text || !run.value || busy.value) return
  note.value = ''
  refineRun(run.value.id, text)
}

watch(
  () => (run.value ? runTurns(run.value).length : 0),
  () => requestAnimationFrame(() => turnsEnd.value?.scrollIntoView({ block: 'end' })),
)

/** Esc puts it down: the picker first, then the window. */
function onKeydown(e) {
  if (!run.value) return
  if (zoomAt.value !== null && !pickerOpen.value) {
    if (e.key === 'ArrowLeft') zoomStep(-1)
    else if (e.key === 'ArrowRight') zoomStep(1)
    else if (e.key === 'Escape') zoomAt.value = null
    return
  }
  if (e.key !== 'Escape') return
  if (pickerOpen.value) pickerOpen.value = false
  else minimizeRun()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    v-if="run"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    role="dialog"
    aria-modal="true"
    :aria-label="run.label"
  >
    <div
      class="relative flex flex-col overflow-hidden rounded-2xl"
      :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: MODAL_SHADOW, width: '95vw', height: '95vh' }"
    >
      <header
        class="flex shrink-0 items-center gap-3 border-b px-4 py-3"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <ol class="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
          <li v-for="(s, i) in steps" :key="s.n" class="flex min-w-0 items-center gap-2">
            <span
              v-if="i > 0"
              class="hidden h-px w-5 shrink-0 sm:block"
              :style="{ background: BRAND.gray200 }"
              aria-hidden="true"
            />
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
              :style="{
                background: s.n === headerStep ? BRAND.blue : s.n < headerStep ? BRAND.blueSoft : BRAND.gray100,
                color: s.n === headerStep ? BRAND.onAccent : s.n < headerStep ? BRAND.blue : BRAND.gray500,
              }"
            >
              {{ s.n }}
            </span>
            <span
              class="truncate text-sm font-medium"
              :style="{ color: s.n === headerStep ? BRAND.ink : BRAND.gray500 }"
              :aria-current="s.n === headerStep ? 'step' : undefined"
            >
              {{ s.label }}
            </span>
          </li>
        </ol>

        <span v-if="busy" class="flex shrink-0 items-center gap-1.5 text-xs" :style="{ color: BRAND.gray500 }">
          <Loader2 class="size-3.5 animate-spin" :style="{ color: BRAND.blue }" />
          <span class="font-semibold tabular-nums" :style="{ color: BRAND.ink }">{{ percent }}%</span>
          <span class="tabular-nums">{{ elapsedLabel }}</span>
          <span>· {{ runPending(run) }} of {{ run.cells.length }}</span>
        </span>

        <button
          type="button"
          :disabled="busy || (choosing && (needsCatalog || !catalogCount))"
          class="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-45"
          :style="{ background: BRAND.blue }"
          @click="onCta"
        >
          {{ ctaLabel }}
        </button>

        <!-- Put it down, and it is a block in the thread again — still rendering, and
             out of the way of the next direction you want to try. -->
        <button
          v-if="!closeOnly"
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          title="Back to the session — it keeps running"
          aria-label="Back to the session — it keeps running"
          @click="minimizeRun"
        >
          <Minimize2 class="size-4" />
        </button>
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          :title="closeOnly ? 'Close' : 'Let this run go'"
          :aria-label="closeOnly ? 'Close' : 'Let this run go'"
          @click="onClose"
        >
          <X class="size-4" />
        </button>
      </header>

      <nav
        v-if="switchRuns.length + switchConcepts.length > 1"
        class="flex shrink-0 items-center gap-2 overflow-x-auto border-b px-4 py-2"
        :style="{ borderColor: BRAND.gray200, background: BRAND.pageBg }"
        aria-label="Directions"
      >
        <button
          v-for="r in switchRuns"
          :key="r.id"
          type="button"
          class="relative flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold transition-colors"
          :class="r.status === 'running' ? 'oq-shimmer-sweep' : ''"
          :style="{
            borderColor: r.id === run.id ? BRAND.blue : BRAND.gray200,
            background: r.id === run.id ? BRAND.blueSoft : BRAND.surface,
            color: r.id === run.id ? BRAND.blue : BRAND.ink,
          }"
          :aria-current="r.id === run.id ? 'true' : undefined"
          @click="openRun(r.id)"
        >
          <img
            v-if="r.cells[0]?.imageUrl"
            :src="r.cells[0].imageUrl"
            alt=""
            class="size-6 rounded-full object-cover"
          />
          {{ r.label }}
          <Loader2 v-if="r.status === 'running'" class="size-3 animate-spin" :style="{ color: BRAND.blue }" />
          <Check v-else class="oq-pop size-3" :stroke-width="3" :style="{ color: BRAND.emeraldText }" />
        </button>

        <span
          v-if="switchRuns.length && switchConcepts.length"
          class="mx-1 h-5 w-px shrink-0"
          :style="{ background: BRAND.gray200 }"
          aria-hidden="true"
        />
        <button
          v-for="c in switchConcepts"
          :key="c.id"
          type="button"
          class="flex shrink-0 items-center gap-2 rounded-full border border-dashed py-1 pl-1 pr-3 text-xs font-semibold transition-colors hover:bg-[var(--oq-hover)]"
          :style="{ borderColor: BRAND.gray300, color: BRAND.gray500 }"
          :title="`Try ${c.label}`"
          @click="tryConcept(c)"
        >
          <img v-if="c.imageUrl" :src="c.imageUrl" alt="" class="size-6 rounded-full object-cover opacity-60" />
          <Plus class="size-3" />
          {{ c.label }}
        </button>
      </nav>

      <div class="flex min-h-0 min-w-0 flex-1">
        <div class="flex min-w-0 flex-1 flex-col p-6" :style="{ background: BRAND.pageBg }">
          <!-- A frame opened up: the feed photo before it, the creative after, and the
               round's other frames one arrow away. -->
          <div v-if="choosing" class="flex min-h-0 flex-1 flex-col">
            <div class="mb-4 flex shrink-0 items-start gap-3">
              <button
                type="button"
                class="flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-[var(--oq-hover)]"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
                aria-label="Back to the preview"
                @click="choosing = false"
              >
                <ArrowLeft class="size-4" />
              </button>
              <div v-if="!needsCatalog" class="min-w-0">
                <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">
                  Which products should the {{ run.label }} ad run on?
                </p>
                <p class="text-xs" :style="{ color: BRAND.gray500 }">
                  This isn’t final — you can add or remove products in the campaign any time later.
                </p>
              </div>
              <p
                v-if="justConnected && !needsCatalog"
                class="ml-auto shrink-0 rounded-full border px-3 py-1 text-xs font-semibold"
                :style="{ borderColor: BRAND.successLine, background: BRAND.successSoft, color: BRAND.emeraldText }"
              >
                Catalog connected · {{ connections.catalog.productCount }} products synced
              </p>
            </div>
            <OqCatalogConnect
              v-if="needsCatalog"
              :run-label="run.label"
              :image-url="run.cells[0]?.imageUrl ?? ''"
              @connected="justConnected = true"
              @later="keepRunWithoutCatalog(run.id); minimizeRun()"
            />
            <OqCatalogPicker
              v-else
              inline
              open
              :selected="run.catalogIds"
              :seed-id="run.seedId"
              :max="products.length"
              @change="(ids) => { run.catalogIds = ids }"
            />
          </div>

          <div v-else-if="zoomCell" class="flex min-h-0 flex-1 flex-col">
            <div class="mb-4 flex shrink-0 items-center gap-3">
              <button
                type="button"
                class="flex size-8 items-center justify-center rounded-full border transition-colors hover:bg-[var(--oq-hover)]"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
                aria-label="Back to all creatives"
                @click="zoomAt = null"
              >
                <ArrowLeft class="size-4" />
              </button>
              <span class="truncate text-sm font-semibold" :style="{ color: BRAND.ink }">{{ zoomCell.name }}</span>
              <span class="text-xs tabular-nums" :style="{ color: BRAND.gray500 }">
                {{ zoomAt + 1 }} / {{ shownCells.length }}
              </span>
            </div>
            <div class="flex min-h-0 flex-1 items-center gap-4">
              <button
                type="button"
                class="flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-[var(--oq-hover)]"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
                aria-label="Previous creative"
                @click="zoomStep(-1)"
              >
                <ChevronLeft class="size-5" />
              </button>
              <div class="flex h-full min-w-0 flex-1 items-center justify-center gap-4 [container-type:size]">
                <div class="w-[min(calc(50cqw-2.5rem),calc(100cqh-1.75rem))]">
                  <div
                    class="aspect-square overflow-hidden rounded-2xl border"
                    :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }"
                  >
                    <img v-if="zoomBefore" :src="zoomBefore" alt="" class="size-full object-cover" />
                  </div>
                  <p class="mt-2 text-xs font-medium" :style="{ color: BRAND.gray500 }">Before</p>
                </div>
                <ArrowRight class="size-5 shrink-0" :style="{ color: BRAND.gray400 }" aria-hidden="true" />
                <div class="w-[min(calc(50cqw-2.5rem),calc(100cqh-1.75rem))]">
                  <div
                    class="aspect-square overflow-hidden rounded-2xl border"
                    :style="{ borderColor: BRAND.gray200, background: BRAND.gray50, boxShadow: CARD_SHADOW }"
                  >
                    <img v-if="zoomCell.imageUrl" :src="zoomCell.imageUrl" :alt="zoomCell.name" class="size-full object-cover" />
                  </div>
                  <p class="mt-2 text-xs font-medium" :style="{ color: BRAND.ink }">After</p>
                </div>
              </div>
              <button
                type="button"
                class="flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-[var(--oq-hover)]"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
                aria-label="Next creative"
                @click="zoomStep(1)"
              >
                <ChevronRight class="size-5" />
              </button>
            </div>
          </div>

          <!-- A size container, so the square frames can measure the room they have. -->
          <div
            v-else
            class="grid min-h-0 flex-1 gap-4 [container-type:size]"
            :class="shownCells.length > 1 ? 'grid-cols-3 items-center' : 'grid-flow-col place-content-center items-center'"
          >
            <!-- Before: the feed photo, so the creative reads as what was made of it. -->
            <template v-if="beforeImage">
              <div class="w-[min(260px,26cqw)]">
                <div
                  class="aspect-square overflow-hidden rounded-xl border"
                  :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
                >
                  <img :src="beforeImage" alt="" class="size-full object-cover" />
                </div>
                <p class="mt-2 text-xs font-medium" :style="{ color: BRAND.gray500 }">Before</p>
              </div>
              <ArrowRight class="size-5" :style="{ color: BRAND.gray400 }" aria-hidden="true" />
            </template>
            <div
              v-for="(c, ci) in shownCells"
              :key="c.productId"
              class="relative"
              :class="shownCells.length > 1
                ? 'w-[min(100%,calc(100cqh-1.75rem))]'
                : beforeImage
                  ? 'w-[min(calc(100cqw-260px-5rem),560px,calc(100cqh-1.75rem))]'
                  : 'w-[min(100%,560px,calc(100cqh-1.75rem))]'"
            >
              <div
                class="group overflow-hidden rounded-2xl border"
                :class="shownCells.length > 1 && c.status === 'ready' ? 'cursor-zoom-in' : ''"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
                @click="shownCells.length > 1 && c.status === 'ready' && (zoomAt = ci)"
              >
                <div class="relative aspect-square" :style="{ background: BRAND.gray50 }">
                  <span
                    v-if="shownCells.length > 1 && c.status === 'ready'"
                    class="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-lg text-white opacity-0 transition-opacity group-hover:opacity-100"
                    style="background: rgb(35 38 42 / 0.72)"
                    aria-hidden="true"
                  >
                    <Maximize2 class="size-4" />
                  </span>
                  <img
                    v-if="c.imageUrl"
                    :src="c.imageUrl"
                    :alt="c.name"
                    class="size-full object-cover transition-opacity"
                    :class="c.status === 'pending' ? 'opacity-60' : 'opacity-100'"
                  />
                  <div v-if="c.status === 'pending'" class="absolute inset-0" aria-busy="true">
                    <div class="oq-shimmer-sweep absolute inset-0" />
                    <div
                      class="absolute bottom-0 left-0 h-1 transition-[width] duration-300"
                      :style="{ width: `${percent}%`, background: BRAND.blue }"
                    />
                    <div
                      class="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tabular-nums"
                      :style="{ background: BRAND.surface, color: BRAND.ink, boxShadow: CARD_SHADOW }"
                    >
                      <Loader2 class="size-3.5 animate-spin" :style="{ color: BRAND.blue }" />
                      {{ percent }}%
                      <span class="font-normal" :style="{ color: BRAND.gray500 }">{{ elapsedLabel }}</span>
                    </div>
                  </div>
                  <div
                    v-else-if="runChipBadges(run).length"
                    class="absolute left-2 top-2 flex flex-wrap gap-1"
                  >
                    <span
                      v-for="b in runChipBadges(run)"
                      :key="b"
                      class="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style="background: rgb(35 38 42 / 0.72)"
                    >
                      {{ b }}
                    </span>
                  </div>
                </div>
              </div>
              <p class="mt-2 truncate text-xs font-medium" :style="{ color: BRAND.ink }" :title="c.name">
                {{ c.name }}
              </p>
            </div>
          </div>

          <!-- Which products the preview covers. In step 2 a swapped product renders its own frame. -->
          <div
            v-if="!choosing && !zoomCell"
            class="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px]"
          >
            <span :style="{ color: BRAND.gray500 }">
              {{ runProducts.length ? 'Generating on:' : 'No products picked yet.' }}
            </span>
            <span
              v-for="p in runProducts"
              :key="p.id"
              class="flex max-w-[180px] items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2.5"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
              :title="p.name"
            >
              <span class="size-6 shrink-0 overflow-hidden rounded-full" :style="{ background: BRAND.gray100 }">
                <img v-if="p.imageUrl" :src="p.imageUrl" alt="" class="size-full object-cover" />
              </span>
              <span class="truncate font-semibold" :style="{ color: BRAND.ink }">{{ p.name }}</span>
            </span>
            <button
              type="button"
              :disabled="busy"
              class="font-semibold hover:underline disabled:opacity-40"
              :style="{ color: BRAND.blue }"
              @click="pickerOpen = true"
            >
              Change
            </button>
          </div>

          <!-- Thumbnails rather than a list of sentences: what this answers is "was it
               better before", and that question is settled by looking. -->
          <div v-if="versions.length > 1" class="mt-4 flex shrink-0 flex-wrap items-center gap-3">
            <span class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
              History
            </span>
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="(v, i) in versions"
                :key="i"
                type="button"
                :disabled="busy"
                :title="v.ask"
                :aria-current="(peekBlock ?? versions[versions.length - 1].block) === v.block ? 'true' : undefined"
                class="flex items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition-colors disabled:opacity-60"
                :style="{
                  borderColor: (peekBlock ?? versions[versions.length - 1].block) === v.block ? BRAND.blue : BRAND.gray200,
                  background: BRAND.surface,
                }"
                @click="peekBlock = i === versions.length - 1 ? null : v.block"
              >
                <span class="size-8 shrink-0 overflow-hidden rounded-lg" :style="{ background: BRAND.gray100 }">
                  <img v-if="v.imageUrl" :src="v.imageUrl" alt="" class="size-full object-cover" />
                </span>
                <span class="max-w-[150px] truncate text-[12px]" :style="{ color: BRAND.ink }">
                  {{ v.ask }}
                </span>
              </button>
            </div>
            <template v-if="peekBlock">
              <button
                type="button"
                :disabled="busy"
                class="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-45"
                :style="{ background: BRAND.blue }"
                @click="keepPeeked"
              >
                Keep this version
              </button>
              <span class="text-[12px]" :style="{ color: BRAND.gray500 }">Looking at an earlier version.</span>
            </template>
          </div>
        </div>

        <!-- Choosing products is not a conversation about the picture: the catalog gets the room. -->
        <aside
          v-if="!choosing"
          class="flex w-[min(380px,36%)] shrink-0 flex-col border-l"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
        >
          <p
            class="shrink-0 border-b px-4 py-2.5 text-[11.5px]"
            :style="{ borderColor: BRAND.gray200, color: BRAND.gray500 }"
          >
            What the session said about the
            <span class="font-semibold" :style="{ color: BRAND.ink }">{{ run.label }}</span> run
          </p>

          <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <p v-if="!runTurns(run).length" class="text-sm" :style="{ color: BRAND.gray500 }">
              Nothing yet. Say what to change below — it lands in the session, where you
              left it.
            </p>
            <div class="flex flex-col gap-3">
              <div
                v-for="(m, i) in runTurns(run)"
                :key="i"
                class="flex flex-col"
                :class="m.kind === 'user' ? 'items-end' : 'items-start'"
              >
                <div
                  class="whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  :class="m.kind === 'user' ? 'max-w-[85%] rounded-br-md' : 'max-w-[92%] rounded-bl-md'"
                  :style="{
                    background: m.kind === 'user' ? BRAND.blueSoft : BRAND.gray100,
                    color: BRAND.ink,
                    overflowWrap: 'anywhere',
                  }"
                >
                  <template v-for="(part, pi) in boldParts(m.text)" :key="pi">
                    <strong v-if="part.bold">{{ part.text }}</strong>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </div>
              </div>
              <div ref="turnsEnd" />
            </div>
          </div>

          <div v-if="!runTurns(run).some((m) => m.kind === 'user')" class="shrink-0 px-4 pb-2 pt-1">
            <p class="mb-2 text-xs font-medium" :style="{ color: BRAND.gray500 }">Try:</p>
            <div class="flex flex-col gap-2">
              <button
                v-for="chip in runTryChips(run)"
                :key="chip.id"
                type="button"
                :disabled="busy"
                class="w-full whitespace-nowrap rounded-full border px-3.5 py-2.5 text-left text-sm leading-none transition-colors hover:enabled:bg-[var(--oq-blue-soft)] disabled:opacity-45"
                :style="{
                  borderColor: run.chips[chip.id] ? BRAND.blue : BRAND.gray200,
                  background: run.chips[chip.id] ? BRAND.blueSoft : BRAND.surface,
                  color: BRAND.ink,
                }"
                @click="note = chip.chip"
              >
                {{ chip.chip }}
              </button>
            </div>
          </div>

          <div class="shrink-0 px-4 pb-4 pt-2">
            <div class="relative rounded-xl border" :style="{ borderColor: BRAND.gray200, background: BRAND.surface }">
              <textarea
                v-model="note"
                rows="3"
                :disabled="busy"
                placeholder="Describe what to change…"
                class="min-h-[4.5rem] w-full resize-none bg-transparent px-3.5 py-2.5 pr-[5.25rem] text-sm leading-relaxed outline-none disabled:opacity-50"
                :style="{ color: BRAND.ink }"
                @keydown.enter.exact.prevent="send"
              />
              <button
                type="button"
                :disabled="busy"
                class="absolute bottom-2 right-11 flex size-8 items-center justify-center rounded-full transition-colors hover:enabled:bg-[var(--oq-blue-soft)] disabled:opacity-45"
                :style="{ color: BRAND.blue }"
                title="Attach image"
                aria-label="Attach image"
              >
                <ImagePlus class="size-4" />
              </button>
              <button
                type="button"
                :disabled="busy || !note.trim()"
                class="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full text-white disabled:opacity-45"
                :style="{ background: note.trim() ? BRAND.blue : BRAND.gray200 }"
                aria-label="Send"
                @click="send"
              >
                <ArrowUp class="size-4" :stroke-width="2.4" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <OqCatalogPicker
        :open="pickerOpen"
        :selected="run.productIds"
        :seed-id="run.seedId"
        :max="RUN_PRODUCT_SLOTS"
        @confirm="(ids) => { setRunProducts(run.id, ids); pickerOpen = false }"
        @close="pickerOpen = false"
      />

      <OqConfirm
        :open="discardOpen"
        :title="`Discard the ${run.label} direction?`"
        :body="discardBody"
        @confirm="dismissRun(run.id)"
        @close="discardOpen = false"
      />

      <OqCampaignPicker
        :open="campaignOpen"
        :run-label="run.label"
        :default-name="session.title"
        @confirm="(choice) => { useRunInCampaign(run.id, choice); campaignOpen = false; minimizeRun() }"
        @close="campaignOpen = false"
      />
    </div>
  </div>
</template>
