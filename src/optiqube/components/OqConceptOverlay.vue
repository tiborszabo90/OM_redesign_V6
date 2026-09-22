<script setup>
/**
 * The window a concept card opens — the product's `ConceptOverlay`.
 *
 * Three drawings of one thing: the panel, the product picker it can open, and the
 * card it becomes when it is put down in the corner. Everything it shows lives in
 * `conceptOverlay` in the store, so putting it down and picking it up cannot lose a
 * word of the conversation — which is the whole reason that state is not here.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowUp, Check, ImagePlus, Loader2, Maximize2, Minimize2, X } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT, MODAL_SHADOW, POPOVER_SHADOW } from '../tokens'
import OqCatalogPicker from './OqCatalogPicker.vue'
import {
  conceptOverlay, overlaySteps, overlayHeaderStep, overlayCta, overlayTryChips,
  overlayChipBadges, overlayCompanions, overlayGenerateMore,
  sendOverlayNote, fillOverlayChip, answerOverlayWait, overlayCreateCampaign,
  minimizeOverlay, restoreOverlay, closeConceptOverlay, setOverlayCompanions,
  peekOverlayVersion, keepOverlayVersion,
} from '../store'

const threadEnd = ref(null)
const composer = ref(null)

const steps = computed(() => overlaySteps())
const headerStep = computed(() => overlayHeaderStep())
const interactive = computed(() => !conceptOverlay.busy && !conceptOverlay.closing)
const companionNames = computed(() => overlayCompanions().map((p) => p.name))
const newestVersionId = computed(
  () => conceptOverlay.versions[conceptOverlay.versions.length - 1]?.id ?? null,
)
const viewingOlder = computed(
  () => conceptOverlay.activeVersionId !== newestVersionId.value,
)

/**
 * The round's own clock.
 *
 * Counted from `roundStartedAt` in the store rather than from a timer of its own: the
 * card in the corner and the panel are the same round, and a clock per drawing would
 * restart at 0:00 every time the window came back up.
 */
const now = ref(Date.now())
let ticker = null
watch(
  () => conceptOverlay.roundStartedAt,
  (startedAt) => {
    clearInterval(ticker)
    if (!startedAt) return
    now.value = Date.now()
    ticker = setInterval(() => { now.value = Date.now() }, 120)
  },
  { immediate: true },
)
onBeforeUnmount(() => clearInterval(ticker))

/** Esc closes the topmost thing: the picker first, then the window itself. */
function onKeydown(e) {
  if (e.key !== 'Escape' || !conceptOverlay.open || conceptOverlay.minimized) return
  if (conceptOverlay.pickerOpen) conceptOverlay.pickerOpen = false
  else closeConceptOverlay()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const elapsedMs = computed(() =>
  conceptOverlay.roundStartedAt ? now.value - conceptOverlay.roundStartedAt : 0,
)
/** Never 100 while it is still drawing — the picture landing is what says it is done. */
const percent = computed(() => Math.min(96, Math.round((elapsedMs.value / 3000) * 100)))
const elapsedLabel = computed(() => {
  const total = Math.floor(elapsedMs.value / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
})

const pendingCount = computed(
  () => conceptOverlay.creatives.filter((c) => c.status === 'pending').length,
)
const dockStatus = computed(() => {
  if (conceptOverlay.busy) return 'working'
  return conceptOverlay.sawRound ? 'landed' : 'idle'
})

/** Stay pinned to the newest line as the conversation grows. */
watch(
  () => conceptOverlay.thread.length,
  () => {
    requestAnimationFrame(() => threadEnd.value?.scrollIntoView({ block: 'end' }))
  },
)

function onTryChip(id) {
  fillOverlayChip(id)
  requestAnimationFrame(() => composer.value?.focus())
}

function onCta() {
  if (conceptOverlay.stage === 'one') overlayGenerateMore()
  else overlayCreateCampaign()
}

</script>

<template>
  <!-- The card in the corner. Deliberately not a modal: the page underneath is what
       putting the window down gave back. -->
  <div
    v-if="conceptOverlay.open && conceptOverlay.minimized"
    class="fixed bottom-4 right-4 z-40 w-[21rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border"
    :style="{
      fontFamily: FONT,
      background: BRAND.surfaceRaised,
      borderColor: dockStatus === 'landed' ? BRAND.successLine : BRAND.gray200,
      boxShadow: POPOVER_SHADOW,
    }"
  >
    <div class="flex items-center gap-2.5 py-2.5 pl-3 pr-2.5">
      <div class="flex shrink-0 gap-1" aria-hidden="true">
        <span
          v-for="c in conceptOverlay.creatives.slice(0, 3)"
          :key="c.productId"
          class="relative size-8 shrink-0 overflow-hidden rounded-md border"
          :style="{ borderColor: BRAND.gray200, background: BRAND.mediaMat }"
        >
          <img v-if="c.imageUrl" :src="c.imageUrl" alt="" class="size-full object-cover" />
          <span
            v-if="conceptOverlay.busy && c.status === 'pending'"
            class="oq-shimmer-sweep absolute inset-0"
          />
        </span>
      </div>

      <!-- The card itself opens the window; the icon beside it is for anyone who
           reads a corner card as a notification rather than a thing to press. -->
      <button type="button" class="min-w-0 flex-1 text-left" @click="restoreOverlay">
        <span class="block truncate text-[13px] font-semibold" :style="{ color: BRAND.ink }">
          {{ conceptOverlay.label }}
        </span>
        <span class="block truncate text-[11.5px]" :style="{ color: BRAND.gray500 }">
          Step {{ headerStep }} · {{ steps[headerStep - 1].label }}
        </span>
      </button>

      <button
        type="button"
        class="flex size-7 shrink-0 items-center justify-center rounded-lg border"
        :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
        title="Open it again"
        aria-label="Open it again"
        @click="restoreOverlay"
      >
        <Maximize2 class="size-3.5" />
      </button>
      <button
        type="button"
        class="flex size-7 shrink-0 items-center justify-center rounded-lg border"
        :style="{ borderColor: BRAND.gray200, color: BRAND.gray500 }"
        title="Let it go"
        aria-label="Let it go"
        @click="closeConceptOverlay"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <template v-if="dockStatus !== 'idle'">
      <div class="h-[3px] w-full" :style="{ background: BRAND.gray100 }">
        <div
          class="h-full transition-[width] duration-300"
          :style="{
            width: conceptOverlay.busy ? `${percent}%` : '100%',
            background: dockStatus === 'landed' ? BRAND.emerald : BRAND.blue,
          }"
        />
      </div>
      <!-- Announced, because the whole reason this card exists is that nobody is
           looking at it. -->
      <div
        class="flex items-center gap-2 border-t px-3 py-2 text-[11.5px]"
        :style="{
          borderColor: BRAND.gray200,
          color: dockStatus === 'landed' ? BRAND.emeraldText : BRAND.gray500,
        }"
        role="status"
        aria-live="polite"
      >
        <template v-if="dockStatus === 'landed'">
          <Check class="size-3.5 shrink-0" />
          <span class="font-semibold">Ready — open it</span>
        </template>
        <template v-else>
          <Loader2 class="size-3.5 shrink-0 animate-spin" :style="{ color: BRAND.blue }" />
          <span class="font-semibold tabular-nums" :style="{ color: BRAND.ink }">{{ percent }}%</span>
          <span class="tabular-nums">{{ elapsedLabel }}</span>
          <span class="truncate">
            {{ conceptOverlay.creatives.length > 1 ? `${pendingCount} of ${conceptOverlay.creatives.length} rendering` : 'Rendering' }}
          </span>
        </template>
      </div>
    </template>
  </div>

  <div
    v-else-if="conceptOverlay.open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    role="dialog"
    aria-modal="true"
    :aria-label="conceptOverlay.label"
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

        <button
          type="button"
          :disabled="!interactive"
          class="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-45"
          :style="{ background: BRAND.blue }"
          @click="onCta"
        >
          {{ overlayCta() }}
        </button>

        <!-- Put it down, then let it go: two endings, two controls, side by side so
             the difference between them is something you can see rather than learn. -->
        <button
          type="button"
          :disabled="conceptOverlay.closing"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border disabled:opacity-45"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          title="Put it down — keep working"
          aria-label="Put it down — keep working"
          @click="minimizeOverlay"
        >
          <Minimize2 class="size-4" />
        </button>
        <button
          type="button"
          :disabled="conceptOverlay.closing"
          class="flex size-9 shrink-0 items-center justify-center rounded-full border disabled:opacity-45"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          aria-label="Close"
          @click="closeConceptOverlay"
        >
          <X class="size-4" />
        </button>
      </header>

      <div class="flex min-h-0 min-w-0 flex-1">
        <div class="flex min-w-0 flex-1 flex-col p-6" :style="{ background: BRAND.pageBg }">
          <!-- A size container, so the square frames below can measure the room they
               have: `cqh` is this grid's height. -->
          <div
            class="grid min-h-0 flex-1 gap-4 [container-type:size]"
            :class="conceptOverlay.stage === 'three' ? 'grid-cols-3 items-center' : 'place-items-center'"
          >
            <div
              v-for="c in conceptOverlay.creatives"
              :key="c.productId"
              class="relative"
              :class="conceptOverlay.stage === 'three'
                ? 'w-[min(100%,calc(100cqh-1.75rem))]'
                : 'w-[min(100%,560px,calc(100cqh-1.75rem))]'"
            >
              <div
                class="overflow-hidden rounded-2xl border transition-opacity"
                :class="c.status === 'pending' ? 'opacity-50' : 'opacity-100'"
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
                  <div
                    v-if="c.status === 'pending'"
                    class="absolute inset-0"
                    aria-busy="true"
                    :aria-label="`Generating… ${percent}%`"
                  >
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
                  <!-- What the notes so far have asked for, on the finished picture. -->
                  <div
                    v-else-if="overlayChipBadges().length"
                    class="absolute left-2 top-2 flex flex-wrap gap-1"
                  >
                    <span
                      v-for="b in overlayChipBadges()"
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

          <!-- Which products step 2 will cover, while there is still time to change
               them — after the round they are pictures someone has paid for. -->
          <div
            v-if="conceptOverlay.stage === 'one'"
            class="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px]"
          >
            <span :style="{ color: BRAND.gray500 }">
              {{ companionNames.length ? 'Also generating on:' : 'No other products yet.' }}
            </span>
            <span v-if="companionNames.length" class="font-semibold" :style="{ color: BRAND.ink }">
              {{ companionNames.join(', ') }}
            </span>
            <button
              type="button"
              :disabled="!interactive"
              class="font-semibold hover:underline disabled:opacity-40"
              :style="{ color: BRAND.blue }"
              @click="conceptOverlay.pickerOpen = true"
            >
              Change
            </button>
          </div>

          <!-- Thumbnails rather than a list of sentences: what this answers is "was it
               better before", and that question is settled by looking. -->
          <div
            v-if="conceptOverlay.stage === 'one' && conceptOverlay.versions.length > 1"
            class="mt-4 flex shrink-0 flex-wrap items-center gap-3"
          >
            <span class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
              History
            </span>
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="(v, i) in conceptOverlay.versions"
                :key="v.id"
                type="button"
                :disabled="!interactive"
                :title="i === 0 ? 'Original' : v.ask"
                :aria-current="v.id === conceptOverlay.activeVersionId ? 'true' : undefined"
                class="flex items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition-colors disabled:opacity-60"
                :style="{
                  borderColor: v.id === conceptOverlay.activeVersionId ? BRAND.blue : BRAND.gray200,
                  background: BRAND.surface,
                }"
                @click="peekOverlayVersion(v.id)"
              >
                <span class="size-8 shrink-0 overflow-hidden rounded-lg" :style="{ background: BRAND.gray100 }">
                  <img v-if="v.imageUrl" :src="v.imageUrl" alt="" class="size-full object-cover" />
                </span>
                <span class="max-w-[150px] truncate text-[12px]" :style="{ color: BRAND.ink }">
                  {{ i === 0 ? 'Original' : v.ask }}
                </span>
              </button>
            </div>
            <template v-if="viewingOlder">
              <button
                type="button"
                :disabled="!interactive"
                class="rounded-xl px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-45"
                :style="{ background: BRAND.blue }"
                @click="keepOverlayVersion"
              >
                Keep this version
              </button>
              <span class="text-[12px]" :style="{ color: BRAND.gray500 }">Looking at an earlier version.</span>
            </template>
          </div>
        </div>

        <aside
          class="flex w-[min(380px,36%)] shrink-0 flex-col border-l"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
        >
          <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div class="flex flex-col gap-3">
              <div
                v-for="m in conceptOverlay.thread"
                :key="m.id"
                class="flex flex-col"
                :class="m.role === 'user' ? 'items-end' : 'items-start'"
              >
                <div
                  class="whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  :class="m.role === 'user' ? 'max-w-[85%] rounded-br-md' : 'max-w-[92%] rounded-bl-md'"
                  :style="{
                    background: m.role === 'user' ? BRAND.blueSoft : BRAND.gray100,
                    color: BRAND.ink,
                    overflowWrap: 'anywhere',
                  }"
                >
                  {{ m.text }}
                </div>
                <div v-if="m.options" class="mt-2 flex w-full flex-col gap-2">
                  <button
                    v-for="opt in m.options"
                    :key="opt.id"
                    type="button"
                    class="w-full rounded-full border px-3.5 py-2.5 text-left text-sm leading-none"
                    :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
                    @click="answerOverlayWait(m.id, opt.id)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
              <div ref="threadEnd" />
            </div>
          </div>

          <div class="shrink-0 px-4 pb-2 pt-1">
            <p class="mb-2 text-xs font-medium" :style="{ color: BRAND.gray500 }">Try:</p>
            <div class="flex flex-col gap-2">
              <button
                v-for="chip in overlayTryChips()"
                :key="chip.id"
                type="button"
                :disabled="!interactive"
                class="w-full whitespace-nowrap rounded-full border px-3.5 py-2.5 text-left text-sm leading-none transition-colors hover:enabled:bg-[var(--oq-blue-soft)] disabled:opacity-45"
                :style="{
                  borderColor: conceptOverlay.chips[chip.id] ? BRAND.blue : BRAND.gray200,
                  background: conceptOverlay.chips[chip.id] ? BRAND.blueSoft : BRAND.surface,
                  color: BRAND.ink,
                }"
                @click="onTryChip(chip.id)"
              >
                {{ chip.chip }}
              </button>
            </div>
          </div>

          <div class="shrink-0 px-4 pb-4 pt-2">
            <div class="relative rounded-xl border" :style="{ borderColor: BRAND.gray200, background: BRAND.surface }">
              <textarea
                ref="composer"
                v-model="conceptOverlay.input"
                rows="3"
                :disabled="!interactive"
                placeholder="Describe what to change…"
                class="min-h-[4.5rem] w-full resize-none bg-transparent px-3.5 py-2.5 pr-[5.25rem] text-sm leading-relaxed outline-none disabled:opacity-50"
                :style="{ color: BRAND.ink }"
                @keydown.enter.exact.prevent="sendOverlayNote"
              />
              <button
                type="button"
                :disabled="!interactive"
                class="absolute bottom-2 right-11 flex size-8 items-center justify-center rounded-full transition-colors hover:enabled:bg-[var(--oq-blue-soft)] disabled:opacity-45"
                :style="{ color: BRAND.blue }"
                title="Attach image"
                aria-label="Attach image"
              >
                <ImagePlus class="size-4" />
              </button>
              <button
                type="button"
                :disabled="!interactive || !conceptOverlay.input.trim()"
                class="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full text-white disabled:opacity-45"
                :style="{ background: conceptOverlay.input.trim() ? BRAND.blue : BRAND.gray200 }"
                aria-label="Send"
                @click="sendOverlayNote"
              >
                <ArrowUp class="size-4" :stroke-width="2.4" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      <!-- The two slots step 2 has, over the catalog it can fill them from. -->
      <OqCatalogPicker
        :open="conceptOverlay.pickerOpen"
        :selected="conceptOverlay.companionIds"
        :seed-id="conceptOverlay.seed?.id ?? ''"
        :locked-id="conceptOverlay.seed?.id ?? ''"
        @confirm="setOverlayCompanions"
        @close="conceptOverlay.pickerOpen = false"
      />
    </div>
  </div>
</template>
