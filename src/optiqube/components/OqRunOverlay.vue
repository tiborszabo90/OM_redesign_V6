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
import { ArrowUp, ImagePlus, Loader2, Minimize2, X } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT, MODAL_SHADOW } from '../tokens'
import {
  session, runOverlay, runById, runPending, runTurns, runChipBadges, runTryChips,
  runProductNames, expandRun, refineRun, setRunProducts, useRunInCampaign,
  dismissRun, minimizeRun, RUN_PRODUCT_SLOTS,
} from '../store'
import OqProductPicker from './OqProductPicker.vue'
import OqCampaignPicker from './OqCampaignPicker.vue'

const pickerOpen = ref(false)
const campaignOpen = ref(false)
const note = ref('')
const turnsEnd = ref(null)

const run = computed(() => runById(runOverlay.runId))
const busy = computed(() => run.value?.status === 'running')
const stage = computed(() => run.value?.stage ?? 'one')
const total = computed(() => run.value?.productIds.length ?? 1)

const steps = computed(() => [
  { n: 1, label: 'Concept refinement' },
  { n: 2, label: `Preview on ${total.value} ${total.value === 1 ? 'product' : 'products'}` },
  { n: 3, label: 'Use in a campaign' },
])
const headerStep = computed(() => (stage.value === 'three' ? 2 : 1))
const ctaLabel = computed(() => {
  if (stage.value === 'three') return 'I like this — use this'
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

function onCta() {
  if (!run.value || busy.value) return
  if (stage.value === 'one') expandRun(run.value.id)
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
  if (e.key !== 'Escape' || !run.value) return
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
          :disabled="busy"
          class="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-45"
          :style="{ background: BRAND.blue }"
          @click="onCta"
        >
          {{ ctaLabel }}
        </button>

        <!-- Put it down, and it is a block in the thread again — still rendering, and
             out of the way of the next direction you want to try. -->
        <button
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
          title="Let this run go"
          aria-label="Let this run go"
          @click="dismissRun(run.id)"
        >
          <X class="size-4" />
        </button>
      </header>

      <div class="flex min-h-0 min-w-0 flex-1">
        <div class="flex min-w-0 flex-1 flex-col p-6" :style="{ background: BRAND.pageBg }">
          <!-- A size container, so the square frames can measure the room they have. -->
          <div
            class="grid min-h-0 flex-1 gap-4 [container-type:size]"
            :class="run.cells.length > 1 ? 'grid-cols-3 items-center' : 'place-items-center'"
          >
            <div
              v-for="c in run.cells"
              :key="c.productId"
              class="relative"
              :class="run.cells.length > 1
                ? 'w-[min(100%,calc(100cqh-1.75rem))]'
                : 'w-[min(100%,560px,calc(100cqh-1.75rem))]'"
            >
              <div
                class="overflow-hidden rounded-2xl border"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
              >
                <div class="relative aspect-square" :style="{ background: BRAND.gray50 }">
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

          <!-- Which products the round will cover, while there is still time to say. -->
          <div
            v-if="stage === 'one'"
            class="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px]"
          >
            <span :style="{ color: BRAND.gray500 }">
              {{ runProductNames(run).length ? 'Generating on:' : 'No products picked yet.' }}
            </span>
            <span v-if="runProductNames(run).length" class="font-semibold" :style="{ color: BRAND.ink }">
              {{ runProductNames(run).join(', ') }}
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
        </div>

        <aside
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

          <div class="shrink-0 px-4 pb-2 pt-1">
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

      <OqProductPicker
        :open="pickerOpen"
        :selected="run.productIds"
        :seed-id="run.seedId"
        :max="RUN_PRODUCT_SLOTS"
        @confirm="(ids) => { setRunProducts(run.id, ids); pickerOpen = false }"
        @close="pickerOpen = false"
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
