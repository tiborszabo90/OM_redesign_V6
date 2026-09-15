<script setup>
import { computed, ref } from 'vue'
import { ArrowUp, ImagePlus, PackageSearch, Stamp, X } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import {
  activeBrand, connections, inspirationCatalog, navigate, products, resetSession,
} from '../store'

/** The four starters, from `shared/brands.ts`. Clicking one fills the composer. */
const CAMPAIGN_TYPE_CHIPS = [
  {
    id: 'general',
    label: 'General catalog ad',
    intent: 'I want a general catalog ad campaign — strong on-brand creatives across my products.',
  },
  {
    id: 'seasonal',
    label: 'Seasonal campaign',
    intent:
      'I want a seasonal catalog ad campaign — festive, time-limited creatives that feel on-brand for my products.',
  },
  {
    id: 'video',
    label: 'Video ad',
    intent: 'I want video ads — help me pick a direction, then craft short video creatives.',
  },
  {
    id: 'copy_ad',
    label: 'Copy this ad',
    intent:
      'I want to copy an ad I like — upload a reference and draft two lookalike catalog directions from it.',
  },
]

const composer = ref('')
const overlayLogo = ref(false)
const pickedProducts = ref([])
const pickerOpen = ref(false)

const greeting = computed(() => `What should we create for ${activeBrand().name}?`)
const canSubmit = computed(() => Boolean(composer.value.trim() || pickedProducts.value.length))

/** The strip under the composer — the gallery's first eight. */
const strip = computed(() => inspirationCatalog.slice(0, 8))

function submit() {
  if (!canSubmit.value) return
  resetSession()
  navigate('/session')
}

function togglePick(p) {
  const i = pickedProducts.value.findIndex((x) => x.id === p.id)
  if (i >= 0) pickedProducts.value.splice(i, 1)
  else pickedProducts.value.push(p)
}
</script>

<template>
  <div class="flex min-h-0 w-full flex-1 flex-col overflow-y-auto" :style="{ fontFamily: FONT }">
    <div class="mx-auto flex w-full max-w-[1080px] flex-col items-stretch px-6 pb-16 pt-16">
      <!-- Composer column stays narrower than the inspiration strip -->
      <div class="mx-auto w-full max-w-[680px]">
        <h1
          class="mb-2 text-center text-[2rem] font-semibold tracking-tight sm:text-[2.4rem]"
          :style="{ color: BRAND.ink }"
        >
          {{ greeting }}
        </h1>
        <p class="mb-8 text-center text-sm" :style="{ color: BRAND.gray500 }">
          Describe a catalog campaign — we'll draft creative concepts for
          <span class="font-medium" :style="{ color: BRAND.ink }">{{ activeBrand().domain }}</span>.
        </p>

        <div
          class="rounded-2xl border p-2 transition-colors"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
        >
          <ul v-if="pickedProducts.length" class="flex flex-wrap gap-1.5 px-3 pt-2">
            <li
              v-for="p in pickedProducts"
              :key="p.id"
              class="flex max-w-[220px] items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-1"
              :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }"
            >
              <img
                :src="p.imageUrl"
                alt=""
                class="size-5 shrink-0 rounded-full object-cover"
                :style="{ background: BRAND.gray100 }"
              />
              <span class="min-w-0 flex-1 truncate text-xs" :style="{ color: BRAND.ink }" :title="p.name">
                {{ p.name }}
              </span>
              <button
                type="button"
                class="shrink-0 rounded-full p-0.5"
                :aria-label="`Remove ${p.name}`"
                @click="togglePick(p)"
              >
                <X class="size-3" :style="{ color: BRAND.gray500 }" />
              </button>
            </li>
          </ul>

          <textarea
            v-model="composer"
            rows="3"
            placeholder="e.g. Lifestyle catalog ads for our spring sale — premium, with price on the image…"
            class="w-full resize-none bg-transparent px-3 pt-2 text-[15px] outline-none"
            :style="{ color: BRAND.ink }"
            @keydown.enter.exact.prevent="submit"
          />

          <div class="flex items-center justify-between gap-2 px-2 pb-1 pt-1">
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--oq-blue-soft)]"
                :style="{ color: BRAND.blue }"
                aria-label="Attach image"
                title="Attach image (or paste / drop)"
              >
                <ImagePlus class="size-4" />
              </button>
              <button
                v-if="connections.catalog.connected"
                type="button"
                class="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium transition-colors hover:bg-[var(--oq-blue-soft)]"
                :style="{ color: BRAND.blue }"
                title="Pick products from your feed"
                @click="pickerOpen = true"
              >
                <PackageSearch class="size-4" />
                {{
                  pickedProducts.length
                    ? `${pickedProducts.length} product${pickedProducts.length > 1 ? 's' : ''}`
                    : 'Products'
                }}
              </button>
              <!-- No logo asset is known yet — the store gets scanned inside the session —
                   so this promises the stamp rather than previewing it. -->
              <button
                type="button"
                :aria-pressed="overlayLogo"
                class="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium transition-colors"
                :class="overlayLogo ? 'text-white' : 'hover:bg-[var(--oq-blue-soft)]'"
                :style="overlayLogo ? { background: BRAND.blueSolid } : { color: BRAND.blue }"
                title="Stamp your store logo onto the generated creatives"
                @click="overlayLogo = !overlayLogo"
              >
                <Stamp class="size-4" />
                Use my site logo
              </button>
            </div>
            <button
              type="button"
              :disabled="!canSubmit"
              class="flex size-9 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
              :style="{ background: BRAND.blueSolid }"
              aria-label="Start"
              @click="submit"
            >
              <ArrowUp class="size-4" />
            </button>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <button
            v-for="chip in CAMPAIGN_TYPE_CHIPS"
            :key="chip.id"
            type="button"
            class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--oq-blue-soft)]"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            @click="composer = chip.intent"
          >
            {{ chip.label }}
          </button>
        </div>
      </div>

      <div class="mt-12">
        <p class="mb-3 text-center text-sm font-medium" :style="{ color: BRAND.gray500 }">
          Or start from one of these
        </p>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            v-for="card in strip"
            :key="card.id"
            type="button"
            class="overflow-hidden rounded-xl border p-2 text-left transition-shadow hover:shadow-[var(--oq-shadow-lift)]"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
            @click="navigate('/library')"
          >
            <img
              :src="card.imageUrl"
              :alt="card.title"
              loading="lazy"
              class="aspect-square w-full rounded-lg object-cover"
              :style="{ background: BRAND.mediaMat }"
            />
            <p class="mt-2.5 truncate text-sm font-medium" :style="{ color: BRAND.ink }">{{ card.title }}</p>
            <p class="truncate text-xs" :style="{ color: BRAND.gray500 }">{{ card.brandName }}</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Product picker -->
    <div
      v-if="pickerOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgb(16 24 40 / 0.45)"
      @click="pickerOpen = false"
    >
      <div
        class="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl"
        :style="{ background: BRAND.surface, boxShadow: 'var(--oq-shadow-modal)' }"
        @click.stop
      >
        <div class="flex items-center justify-between gap-3 border-b px-5 py-3.5" :style="{ borderColor: BRAND.gray200 }">
          <h2 class="text-base font-semibold" :style="{ color: BRAND.ink }">Pick products</h2>
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-full"
            :style="{ background: BRAND.gray100, color: BRAND.gray600 }"
            aria-label="Close"
            @click="pickerOpen = false"
          >
            <X class="size-4" />
          </button>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto p-4" :style="{ background: BRAND.gray50 }">
          <ul class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(112px, 1fr))">
            <li v-for="p in products.slice(0, 24)" :key="p.id">
              <button
                type="button"
                class="w-full overflow-hidden rounded-xl border p-1.5 text-left"
                :style="{
                  borderColor: pickedProducts.some((x) => x.id === p.id) ? BRAND.blue : BRAND.gray200,
                  background: pickedProducts.some((x) => x.id === p.id) ? BRAND.blueSoft : BRAND.surface,
                }"
                @click="togglePick(p)"
              >
                <span class="grid aspect-square place-items-center" :style="{ background: BRAND.gray50 }">
                  <img v-if="p.imageUrl" :src="p.imageUrl" alt="" loading="lazy" class="max-h-full max-w-full object-contain" />
                </span>
                <span class="mt-1 block line-clamp-2 text-[10px] font-medium leading-snug" :style="{ color: BRAND.ink }">
                  {{ p.name }}
                </span>
              </button>
            </li>
          </ul>
        </div>
        <div class="flex justify-end gap-2 border-t px-5 py-3" :style="{ borderColor: BRAND.gray200 }">
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm font-semibold"
            :style="{ background: BRAND.gray100, color: BRAND.gray600 }"
            @click="pickerOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
            :style="{ background: BRAND.blueSolid }"
            @click="pickerOpen = false"
          >
            Use {{ pickedProducts.length }} selected
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
