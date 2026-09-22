<script setup>
/**
 * One run, opened up: the three creatives, what they are doing, and what can be done
 * with them.
 *
 * No composer of its own — every run on the screen is answered from the session's one
 * input, with the run named on the turn. A box per run was what made two conversations
 * out of one.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Check, Images, Loader2, Maximize2, Package, X } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW } from '../tokens'
import {
  session, runChipBadges, runPending, setRunProducts, useRunInCampaign, dismissRun,
  expandRun, openRun, focusRun, clearRunScope, runScope, RUN_PRODUCT_SLOTS,
} from '../store'
import OqCatalogPicker from './OqCatalogPicker.vue'
import OqCampaignPicker from './OqCampaignPicker.vue'
import OqCreativeLightbox from './OqCreativeLightbox.vue'
import OqConfirm from './OqConfirm.vue'

const props = defineProps({
  run: { type: Object, required: true },
  /** The compact drawing: smaller frames, no product row. Used by V3's column. */
  dense: { type: Boolean, default: false },
  /** There is a window to open this run in — V5. Elsewhere the block is all there is. */
  openable: { type: Boolean, default: false },
  /**
   * V2: the creatives can be looked at large. V5 has the window for that, and a run in
   * a window is more than a look, so the two never appear together.
   */
  preview: { type: Boolean, default: false },
  /**
   * The pictures to draw. A block in the thread passes its own round's cells; without
   * it the run's current ones are drawn, which is what a panel or a rail wants.
   */
  cells: { type: Array, default: null },
})

/** What this drawing shows, and whether it is the round still being worked on. */
const shown = computed(() => props.cells ?? props.run.cells)
const historic = computed(() => Boolean(props.cells) && props.cells !== props.run.cells)
const focused = computed(() => runScope.runId === props.run.id)

/**
 * Click to talk about this run, click again to stop.
 *
 * The same gesture both ways, so putting the context on and taking it off are one
 * thing to learn rather than two — the chip's own ✕ is the other way round the same
 * switch. Clicks on the controls are theirs: pressing "Change products" is not a
 * statement about what the next note is about.
 */
function onBlockClick(e) {
  if (historic.value) return
  if (e.target.closest('button')) return
  if (focused.value) clearRunScope()
  else focusRun(props.run.id)
}

const pickerOpen = ref(false)
const campaignOpen = ref(false)
const lightboxOpen = ref(false)
const discardOpen = ref(false)

/** The run's own clock — two runs on screen are two clocks. */
const now = ref(Date.now())
let ticker = null
watch(
  () => props.run.startedAt,
  (startedAt) => {
    clearInterval(ticker)
    if (!startedAt) return
    now.value = Date.now()
    ticker = setInterval(() => { now.value = Date.now() }, 120)
  },
  { immediate: true },
)
onBeforeUnmount(() => clearInterval(ticker))

const elapsedMs = computed(() => (props.run.startedAt ? now.value - props.run.startedAt : 0))
const percent = computed(() => Math.min(96, Math.round((elapsedMs.value / 6000) * 100)))
const elapsedLabel = computed(() => {
  const total = Math.floor(elapsedMs.value / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
})
const productIds = computed(() => props.run.productIds)

/** What the X actually costs, said in the terms the block is drawn in. */
const discardBody = computed(() => {
  const n = shown.value.length
  return `${n === 1 ? 'Its creative is deleted' : `Its ${n} creatives are deleted`}. The concept stays in the thread, so you can generate a new version from it.`
})
</script>

<template>
  <!-- Clicking the run is how the composer below is told what the next note is about:
       the chip appears, and the block says so with its border. -->
  <div
    class="relative overflow-hidden rounded-2xl border"
    :class="historic ? '' : 'cursor-pointer'"
    :style="{
      borderColor: !historic && focused ? BRAND.blue : BRAND.gray200,
      background: BRAND.surface,
    }"
    :title="historic
      ? undefined
      : (focused ? 'Click to stop talking about this run' : 'Click to talk about this run')"
    @click="onBlockClick"
  >
    <div
      class="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-3.5 py-2.5"
      :style="{ borderColor: BRAND.gray200 }"
    >
      <button
        v-if="openable && !historic"
        type="button"
        class="-mx-1 rounded-md px-1 text-sm font-semibold transition-colors hover:bg-[var(--oq-hover)]"
        :style="{ color: BRAND.ink }"
        title="Open it large"
        @click="openRun(run.id)"
      >
        {{ run.label }}
      </button>
      <span v-else class="text-sm font-semibold" :style="{ color: historic ? BRAND.gray500 : BRAND.ink }">{{ run.label }}</span>
      <span class="text-xs" :style="{ color: BRAND.gray500 }">
        {{ shown.length }} {{ shown.length === 1 ? 'product' : 'products' }}
      </span>

      <span v-if="historic" class="text-xs" :style="{ color: BRAND.gray500 }">· earlier version</span>
      <span v-else-if="run.status === 'running'" class="flex items-center gap-1.5 text-xs" :style="{ color: BRAND.gray500 }">
        <Loader2 class="size-3.5 animate-spin" :style="{ color: BRAND.blue }" />
        <span class="font-semibold tabular-nums" :style="{ color: BRAND.ink }">{{ percent }}%</span>
        <span class="tabular-nums">{{ elapsedLabel }}</span>
        <span>· {{ runPending(run) }} of {{ run.cells.length }} rendering</span>
      </span>
      <span v-else-if="!historic" class="flex items-center gap-1.5 text-xs font-semibold" :style="{ color: BRAND.emeraldText }">
        <Check class="size-3.5" :stroke-width="2.5" />
        Ready
      </span>

      <span class="flex-1" />

      <button
        v-if="!historic"
        type="button"
        class="rounded-md p-1 transition-colors hover:bg-[var(--oq-hover)]"
        title="Dismiss this run"
        aria-label="Dismiss this run"
        @click="discardOpen = true"
      >
        <X class="size-3.5" :style="{ color: BRAND.gray500 }" />
      </button>
    </div>

    <div class="grid gap-2.5 p-3" :class="shown.length > 1 ? 'grid-cols-3' : 'grid-cols-1 max-w-[260px]'">
      <div v-for="c in shown" :key="c.productId">
        <div
          class="relative overflow-hidden rounded-xl border"
          :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }"
        >
          <div class="relative aspect-square">
            <img
              v-if="c.imageUrl"
              :src="c.imageUrl"
              :alt="c.name"
              class="size-full object-cover transition-opacity"
              :class="c.status === 'pending' ? 'opacity-50' : 'opacity-100'"
            />
            <div v-if="c.status === 'pending'" class="absolute inset-0" aria-busy="true">
              <div class="oq-shimmer-sweep absolute inset-0" />
              <div
                class="absolute bottom-0 left-0 h-1 transition-[width] duration-300"
                :style="{ width: `${percent}%`, background: BRAND.blue }"
              />
            </div>
            <div
              v-else-if="runChipBadges(run).length"
              class="absolute left-1.5 top-1.5 flex flex-wrap gap-1"
            >
              <span
                v-for="b in runChipBadges(run)"
                :key="b"
                class="rounded-full px-1.5 py-0.5 text-[9px] font-semibold text-white"
                style="background: rgb(35 38 42 / 0.72)"
              >
                {{ b }}
              </span>
            </div>
          </div>
        </div>
        <p
          v-if="!dense"
          class="mt-1.5 truncate text-[11px] font-medium"
          :style="{ color: BRAND.ink }"
          :title="c.name"
        >
          {{ c.name }}
        </p>
      </div>
    </div>

    <div v-if="!historic" class="flex flex-wrap items-center gap-2 px-3 pb-3">
      <button
        v-if="openable"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
        :style="{ borderColor: BRAND.gray200, color: BRAND.ink, background: BRAND.surface }"
        @click="openRun(run.id)"
      >
        <Maximize2 class="size-3.5" />
        Open large
      </button>
      <button
        v-if="preview"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
        :style="{ borderColor: BRAND.gray200, color: BRAND.ink, background: BRAND.surface }"
        title="See the creatives large"
        @click="lightboxOpen = true"
      >
        <Images class="size-3.5" />
        Preview
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
        :style="{ borderColor: BRAND.gray200, color: BRAND.ink, background: BRAND.surface }"
        @click="pickerOpen = true"
      >
        <Package class="size-3.5" />
        Change products
      </button>
      <!-- Before the round the primary action is the round; after it, the campaign. -->
      <button
        v-if="run.stage === 'one'"
        type="button"
        class="rounded-full px-3 py-1.5 text-xs font-semibold text-white"
        :style="{ background: BRAND.blue }"
        @click="expandRun(run.id)"
      >
        Generate on {{ run.productIds.length }} products
      </button>
      <button
        v-else
        type="button"
        :disabled="run.status === 'running'"
        class="rounded-full px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-45"
        :style="{ background: BRAND.blue }"
        @click="campaignOpen = true"
      >
        Use this
      </button>
    </div>

    <OqCatalogPicker
      :open="pickerOpen"
      :selected="productIds"
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

    <OqCreativeLightbox
      :open="lightboxOpen"
      :cells="shown"
      :label="run.label"
      @close="lightboxOpen = false"
    />

    <OqCampaignPicker
      :open="campaignOpen"
      :run-label="run.label"
      :default-name="session.title"
      @confirm="(choice) => { useRunInCampaign(run.id, choice); campaignOpen = false }"
      @close="campaignOpen = false"
    />
  </div>
</template>
