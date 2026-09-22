<script setup>
/**
 * The session thread, as the V2–V4 screens read it.
 *
 * The one thing they disagree about is where a run is drawn: V2 keeps it inline, in
 * the order it was started; V3 stacks them in a column beside it and V4 in a rail, and
 * both skip the marker block here. Everything else on screen is the same conversation, which is
 * why it is one component rather than three copies.
 */
import { nextTick, ref, watch } from 'vue'
import { Check, Crosshair, Loader2, Search } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW } from '../tokens'
import {
  session, pickCampaignType, pickFocus, styleById,
  runById, runForConcept, startRun, products, clarifyPick,
} from '../store'
import OqRunDetail from './OqRunDetail.vue'
import OqCatalogPicker from './OqCatalogPicker.vue'

const props = defineProps({
  /** Draw each run where it was started. False leaves that to the screen. */
  inlineRuns: { type: Boolean, default: false },
  /**
   * V5: a concept opens the window on its run, the way the original does, and the
   * block in the thread is what the window is put down to.
   */
  overlayRuns: { type: Boolean, default: false },
  /** V2: a run's creatives can be opened large, since there is no window here. */
  preview: { type: Boolean, default: false },
})

/** V5 starts on the seed alone and opens the window; the others go straight to three. */
function openConcept(concept) {
  startRun(concept, props.overlayRuns ? { stage: 'one', open: true } : {})
}

const scrollRef = ref(null)

/** The catalog browser behind "something else" on the seed question. */
const seedPicker = ref(false)

function pickFromCatalog(ids) {
  const p = products.find((x) => x.id === ids[0])
  seedPicker.value = false
  if (p) pickFocus({ id: p.id, label: p.name, productId: p.id })
}

/** The grid's letter badges: A, B, C, D. */
function letterFor(i) {
  return String.fromCharCode(65 + i)
}

function conceptSubline(presetId) {
  return styleById(presetId)?.description ?? ''
}

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

function onOption(block, opt) {
  if (block.disabled) return
  if (block.purpose === 'campaign') pickCampaignType(opt)
  else if (block.purpose === 'focus') pickFocus(opt)
  // The answer to "which one" starts that direction the way a click on its card would.
  else if (block.purpose === 'clarify') {
    const concept = clarifyPick(opt)
    if (concept) openConcept(concept)
  }
}

/** Stay pinned to the newest turn as the thread grows. */
watch(
  () => session.blocks.length,
  async () => {
    await nextTick()
    const el = scrollRef.value
    if (el) el.scrollTop = el.scrollHeight
  },
)
</script>

<template>
  <div ref="scrollRef" class="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
    <div class="mx-auto flex w-full max-w-[820px] flex-col gap-4">
      <template v-for="(b, i) in session.blocks" :key="i">
        <!-- What the merchant said -->
        <div v-if="b.kind === 'user'" class="flex flex-col items-end">
          <!-- Which of the runs on screen this turn was about. A note typed at one of
               them is not a note about the session, and the thread has to say so. -->
          <span
            v-if="b.runLabel"
            class="mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
            :style="{ borderColor: BRAND.blue, background: BRAND.blueSoft, color: BRAND.blue }"
          >
            <Crosshair class="size-3" />
            {{ b.runLabel }} run
          </span>
          <!-- A pasted URL is one long word: without the wrap it runs out of the
               bubble instead of breaking inside it. -->
          <div
            class="max-w-[85%] break-words rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-relaxed"
            :style="{ background: BRAND.blueSoft, color: BRAND.ink, overflowWrap: 'anywhere' }"
          >
            {{ b.text }}
          </div>
        </div>

        <!-- What the agent said -->
        <div v-else-if="b.kind === 'assistant'" class="flex max-w-[92%] flex-col items-start">
          <span
            v-if="b.runLabel"
            class="mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
            :style="{ borderColor: BRAND.blue, background: BRAND.blueSoft, color: BRAND.blue }"
          >
            <Crosshair class="size-3" />
            {{ b.runLabel }} run
          </span>
          <p class="text-sm leading-relaxed" :style="{ color: BRAND.ink }">
            <template v-for="(part, pi) in boldParts(b.text)" :key="pi">
              <strong v-if="part.bold">{{ part.text }}</strong>
              <span v-else>{{ part.text }}</span>
            </template>
          </p>
        </div>

        <!-- A direction generating on three products, where it was started -->
        <OqRunDetail
          v-else-if="b.kind === 'run' && inlineRuns && runById(b.runId)"
          :run="runById(b.runId)"
          :cells="b.cells"
          :openable="overlayRuns"
          :preview="preview"
        />

        <!-- The seed question: product tiles instead of pills -->
        <div
          v-else-if="b.kind === 'options' && b.purpose === 'focus'"
          class="flex flex-col items-start gap-2"
        >
          <ul class="grid max-w-xl list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4">
            <li v-for="opt in b.options" :key="opt.id">
              <button
                type="button"
                :disabled="b.disabled"
                class="group w-full overflow-hidden rounded-xl border text-left transition-shadow disabled:opacity-50 hover:enabled:shadow-[var(--oq-shadow-lift)]"
                :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
                @click="onOption(b, opt)"
              >
                <span
                  class="relative grid aspect-square place-items-center border-b p-1.5"
                  :style="{ background: BRAND.gray50, borderColor: BRAND.gray100 }"
                >
                  <img
                    v-if="opt.imageUrl"
                    :src="opt.imageUrl"
                    alt=""
                    loading="lazy"
                    class="max-h-full max-w-full object-contain"
                  />
                </span>
                <span class="block px-2 pb-2 pt-1.5">
                  <span class="block truncate text-xs font-semibold" :style="{ color: BRAND.ink }">
                    {{ opt.label }}
                  </span>
                  <span v-if="opt.price" class="block truncate text-[11px]" :style="{ color: BRAND.gray500 }">
                    {{ opt.price }}
                  </span>
                </span>
              </button>
            </li>
          </ul>

          <!-- The four are the top of the catalog, so the rest of it has to be
               reachable from the same question. -->
          <button
            type="button"
            :disabled="b.disabled"
            class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 hover:enabled:bg-[var(--oq-blue-soft)]"
            :style="{ borderColor: BRAND.gray200, color: BRAND.ink, background: BRAND.surface }"
            @click="seedPicker = true"
          >
            <Search class="size-3.5" />
            Something else — browse all {{ products.length }} products
          </button>
        </div>

        <!-- "Which of these?" — the four answers, carrying the cards' own letters -->
        <div
          v-else-if="b.kind === 'options' && b.purpose === 'clarify'"
          class="flex flex-wrap gap-2"
        >
          <button
            v-for="opt in b.options"
            :key="opt.id"
            type="button"
            :disabled="b.disabled"
            class="flex items-center gap-2 rounded-full border py-1.5 pr-3.5 text-sm font-medium transition-colors disabled:opacity-50 hover:enabled:bg-[var(--oq-blue-soft)]"
            :class="opt.letter ? 'pl-1.5' : 'pl-3.5'"
            :style="{ borderColor: BRAND.gray200, color: BRAND.ink, background: BRAND.surface }"
            @click="onOption(b, opt)"
          >
            <span
              v-if="opt.letter"
              class="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              :style="{ background: BRAND.blueSolid, color: BRAND.onAccent }"
            >
              {{ opt.letter }}
            </span>
            {{ opt.label }}
          </button>
        </div>

        <!-- Every other question: chips -->
        <div v-else-if="b.kind === 'options'" class="flex flex-wrap gap-2">
          <button
            v-for="opt in b.options"
            :key="opt.id"
            type="button"
            :disabled="b.disabled"
            class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 hover:enabled:bg-[var(--oq-blue-soft)]"
            :style="{ borderColor: BRAND.gray200, color: BRAND.ink, background: BRAND.surface }"
            @click="onOption(b, opt)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- What the round is doing -->
        <div v-else-if="b.kind === 'progress'" class="flex flex-col gap-2">
          <div
            v-for="s in b.steps"
            :key="s.id"
            class="flex items-center gap-2 text-sm"
            :style="{ color: BRAND.gray600 }"
          >
            <Loader2 v-if="!s.done" class="size-4 shrink-0 animate-spin" :style="{ color: BRAND.blue }" />
            <Check v-else class="size-4 shrink-0" :style="{ color: BRAND.emerald }" :stroke-width="2.5" />
            <span :class="s.done ? 'font-medium' : 'oq-shimmer font-medium'">
              {{ s.done ? s.label.replace(/…$/, '') : s.label }}
            </span>
          </div>
        </div>

        <!-- The four concepts. A click starts a run rather than opening a window. -->
        <div v-else-if="b.kind === 'concepts'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            v-for="(c, idx) in b.concepts"
            :key="c.id"
            type="button"
            class="overflow-hidden rounded-2xl border p-3 text-left transition-shadow hover:shadow-[var(--oq-shadow-lift)]"
            :style="{
              borderColor: runForConcept(c.id) ? BRAND.blue : BRAND.gray200,
              background: BRAND.surface,
            }"
            @click="openConcept(c)"
          >
            <div class="relative">
              <img
                v-if="c.imageUrl"
                :src="c.imageUrl"
                :alt="c.label"
                class="aspect-square w-full rounded-xl object-cover"
                :style="{ background: BRAND.mediaMat }"
              />
              <span
                class="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
                :style="{ background: BRAND.blueSolid }"
              >
                {{ letterFor(idx) }}
              </span>
              <!-- What this direction is already doing, so a second click is never a
                   second bill. -->
              <span
                v-if="runForConcept(c.id)"
                class="absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                :style="{
                  background: BRAND.surface,
                  color: runForConcept(c.id).status === 'running' ? BRAND.ink : BRAND.emeraldText,
                  boxShadow: CARD_SHADOW,
                }"
              >
                <Loader2
                  v-if="runForConcept(c.id).status === 'running'"
                  class="size-3 animate-spin"
                  :style="{ color: BRAND.blue }"
                />
                <Check v-else class="size-3" :stroke-width="3" />
                {{ runForConcept(c.id).status === 'running' ? 'Running' : 'Ready' }}
              </span>
            </div>
            <p class="mt-3 text-sm font-semibold" :style="{ color: BRAND.ink }">{{ c.label }}</p>
            <p class="mt-0.5 text-xs leading-snug" :style="{ color: BRAND.gray500 }">
              {{ conceptSubline(c.presetId) }}
            </p>
          </button>
        </div>

        <!-- The style rolled across the catalog -->
        <div v-else-if="b.kind === 'apply'" class="space-y-2">
          <p class="text-xs font-medium" :style="{ color: BRAND.gray500 }">
            {{ styleById(b.styleId)?.label ?? b.styleId }}
          </p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              v-for="item in b.items"
              :key="item.productId"
              class="overflow-hidden rounded-xl border p-2 text-left"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
            >
              <div class="relative aspect-square overflow-hidden rounded-lg">
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="size-full object-cover"
                />
                <!-- Still rendering: the sweep is what says the round is moving. -->
                <div
                  v-else
                  class="oq-shimmer-sweep relative size-full"
                  :style="{ background: BRAND.gray100 }"
                />
              </div>
              <p
                class="mt-1.5 line-clamp-2 text-[10px] font-medium leading-snug"
                :style="{ color: BRAND.ink }"
                :title="item.name"
              >
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </div>

    <OqCatalogPicker
      :open="seedPicker"
      :max="1"
      :selected="session.seed ? [session.seed.id] : []"
      @confirm="pickFromCatalog"
      @close="seedPicker = false"
    />
  </div>
</template>
