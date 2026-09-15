<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowUp, Check, ImagePlus, Loader2, Pencil, Sparkles } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import {
  session, pickCampaignType, pickFocus, handleNextStep, sendRefine,
  activeBrand, styleById,
} from '../store'

const renamingTitle = ref(false)
const titleDraft = ref('')
const scrollRef = ref(null)

const subtitle = computed(
  () => `${activeBrand().domain} · ${session.busy ? 'working…' : 'ready'}`,
)

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

function commitTitle() {
  const next = titleDraft.value.trim()
  if (next) session.title = next
  renamingTitle.value = false
}

function onOption(block, opt) {
  if (block.disabled) return
  if (block.purpose === 'campaign') pickCampaignType(opt)
  else if (block.purpose === 'focus') pickFocus(opt)
  else handleNextStep(opt.id)
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
  <div
    class="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
    <header
      class="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-3.5"
      :style="{ borderColor: BRAND.gray200 }"
    >
      <div class="min-w-0">
        <div v-if="renamingTitle" class="flex items-center gap-2">
          <Sparkles class="size-4 shrink-0" :style="{ color: BRAND.blue }" />
          <input
            v-model="titleDraft"
            class="min-w-0 rounded-md border px-1.5 py-0.5 text-sm font-semibold outline-none"
            style="width: min(320px, 60vw)"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            autofocus
            @keydown.enter.prevent="commitTitle"
            @keydown.esc="renamingTitle = false"
            @blur="commitTitle"
          />
        </div>
        <button
          v-else
          type="button"
          class="group -ml-1.5 flex max-w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left transition-colors hover:bg-[var(--oq-surface-subtle)]"
          title="Rename session"
          @click="titleDraft = session.title; renamingTitle = true"
        >
          <Sparkles class="size-4 shrink-0" :style="{ color: BRAND.blue }" />
          <span class="truncate text-sm font-semibold" :style="{ color: BRAND.ink }">
            {{ session.title }}
          </span>
          <Pencil
            class="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            :style="{ color: BRAND.gray500 }"
          />
        </button>
        <p class="mt-0.5 text-xs" :style="{ color: BRAND.gray500 }">{{ subtitle }}</p>
      </div>
    </header>

    <div ref="scrollRef" class="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      <div class="mx-auto flex w-full max-w-[820px] flex-col gap-4">
        <template v-for="(b, i) in session.blocks" :key="i">
          <!-- What the merchant said -->
          <div v-if="b.kind === 'user'" class="flex justify-end">
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
          <div
            v-else-if="b.kind === 'assistant'"
            class="max-w-[92%] text-sm leading-relaxed"
            :style="{ color: BRAND.ink }"
          >
            <template v-for="(part, pi) in boldParts(b.text)" :key="pi">
              <strong v-if="part.bold">{{ part.text }}</strong>
              <span v-else>{{ part.text }}</span>
            </template>
          </div>

          <!-- The seed question: product tiles instead of pills -->
          <ul
            v-else-if="b.kind === 'options' && b.purpose === 'focus'"
            class="grid max-w-xl list-none grid-cols-3 gap-2 p-0 sm:grid-cols-4"
          >
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

          <!-- The four concepts -->
          <div v-else-if="b.kind === 'concepts'" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div
              v-for="(c, idx) in b.concepts"
              :key="c.id"
              class="overflow-hidden rounded-2xl border p-3 text-left"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
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
              </div>
              <p class="mt-3 text-sm font-semibold" :style="{ color: BRAND.ink }">{{ c.label }}</p>
              <p class="mt-0.5 text-xs leading-snug" :style="{ color: BRAND.gray500 }">
                {{ conceptSubline(c.presetId) }}
              </p>
            </div>
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
    </div>

    <div class="shrink-0 border-t px-4 py-3 sm:px-8" :style="{ borderColor: BRAND.gray200 }">
      <div class="mx-auto max-w-[820px]">
        <div
          class="rounded-2xl border px-3 py-2 transition-colors"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
        >
          <div class="flex items-end gap-2">
            <textarea
              v-model="session.input"
              rows="2"
              :placeholder="
                session.busy
                  ? 'Working on it…'
                  : session.phase === 'ask_type'
                    ? 'Or just describe what you want'
                    : 'Say what to change — “warmer light, drop the price tag”'
              "
              class="min-h-[44px] flex-1 resize-none bg-transparent py-1.5 text-sm outline-none disabled:opacity-50"
              :style="{ color: BRAND.ink }"
              @keydown.enter.exact.prevent="sendRefine"
            />
            <button
              type="button"
              class="mb-0.5 flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--oq-blue-soft)]"
              :style="{ color: BRAND.blue }"
              aria-label="Attach image"
              title="Attach image (or paste / drop)"
            >
              <ImagePlus class="size-4" />
            </button>
            <button
              type="button"
              :disabled="!session.input.trim()"
              class="mb-0.5 flex size-9 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
              :style="{ background: BRAND.blueSolid }"
              aria-label="Send"
              @click="sendRefine"
            >
              <ArrowUp class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
