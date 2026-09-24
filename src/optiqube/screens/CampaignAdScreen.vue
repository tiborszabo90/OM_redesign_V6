<script setup>
import { computed, ref } from 'vue'
import { Check, ChevronRight, X } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT, MODAL_SHADOW } from '../tokens'
import {
  state, navigate, workspaceFor, workspaceConversionGoals, products,
} from '../store'

const AD_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products' },
  { id: 'settings', label: 'Settings' },
]

// Sent here from a session, it opens where the rest of the products are generated.
const tab = ref(state.adTab ?? 'overview')
state.adTab = null
const reviewId = ref(null)

const ids = computed(() => {
  const parts = state.path.split('/')
  return { campaignId: parts[2], adId: parts[4] }
})

const campaign = computed(() => workspaceFor(ids.value.campaignId))

const adSet = computed(
  () => campaign.value?.adSets.find((s) => s.ads.some((a) => a.id === ids.value.adId)) ?? null,
)
const ad = computed(() => adSet.value?.ads.find((a) => a.id === ids.value.adId) ?? null)

/** Approval is per creative; the subtitle counts what is still waiting. */
const creatives = computed(() =>
  (ad.value?.creatives ?? []).map((c, i) => ({
    ...c,
    approved: c.approved ?? i % 3 !== 1,
    hidden: c.hidden ?? false,
  })),
)

const pendingCount = computed(() => creatives.value.filter((c) => !c.hidden && !c.approved).length)

const reviewing = computed(() => creatives.value.find((c) => c.id === reviewId.value) ?? null)

/**
 * The catalog rows this ad covers, and the ones it does not yet. An ad made from a
 * session knows which products were picked for it; the mock ones take the catalog's top.
 */
const covered = computed(() => {
  if (!ad.value?.productIds) return products.slice(0, creatives.value.length)
  const drawn = creatives.value.map((c) => c.productId)
  return products.filter((p) => drawn.includes(p.id))
})
const gaps = computed(() => {
  if (!ad.value?.productIds) return products.slice(creatives.value.length, creatives.value.length + 6)
  const drawn = creatives.value.map((c) => c.productId)
  return products.filter((p) => ad.value.productIds.includes(p.id) && !drawn.includes(p.id))
})
</script>

<template>
  <div v-if="!ad" class="px-6 py-8 text-sm" :style="{ color: BRAND.gray500 }">That ad is gone.</div>

  <div v-else class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <nav class="flex flex-wrap items-center gap-2 text-[13px]">
      <button
        type="button"
        class="flex items-center gap-1.5"
        @click="navigate(`/campaigns/${campaign.id}`)"
      >
        <span class="text-[10px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
          Campaign
        </span>
        <span class="font-semibold hover:underline" :style="{ color: BRAND.blue }">{{ campaign.name }}</span>
      </button>
      <ChevronRight class="size-3.5" :style="{ color: BRAND.gray400 }" />
      <span class="flex items-center gap-1.5">
        <span class="text-[10px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">Ad set</span>
        <span class="font-semibold" :style="{ color: BRAND.gray600 }">{{ adSet.name }}</span>
      </span>
      <ChevronRight class="size-3.5" :style="{ color: BRAND.gray400 }" />
      <span class="flex items-center gap-1.5">
        <span class="text-[10px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">Ad</span>
        <span class="font-semibold" :style="{ color: BRAND.ink }">{{ ad.name }}</span>
      </span>
    </nav>

    <h1 class="mt-3 text-[22px] font-extrabold tracking-tight" :style="{ color: BRAND.ink }">
      {{ ad.name }}
    </h1>

    <div class="mt-4 flex flex-wrap gap-1">
      <button
        v-for="t in AD_TABS"
        :key="t.id"
        type="button"
        class="rounded-lg px-3 py-1.5 text-sm transition-colors"
        :class="tab === t.id ? 'font-semibold' : 'font-medium hover:bg-[var(--oq-hover)]'"
        :style="{
          background: tab === t.id ? BRAND.blueSoft : 'transparent',
          color: tab === t.id ? BRAND.blue : BRAND.gray600,
        }"
        @click="tab = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Overview -->
    <div v-if="tab === 'overview'" class="mt-5">
      <div class="mb-4">
        <h2 class="text-[18px] font-bold tracking-tight" :style="{ color: BRAND.ink }">
          Creatives in this ad
        </h2>
        <p class="mt-1 text-[13px]" :style="{ color: BRAND.gray500 }">
          {{ creatives.length }} creatives ·
          {{ pendingCount ? `${pendingCount} still waiting for your approval` : 'all approved' }}
        </p>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="c in creatives"
          :key="c.id"
          type="button"
          class="overflow-hidden rounded-2xl border text-left transition-shadow"
          :style="{
            borderColor: !c.hidden && !c.approved ? '#F59E0B' : BRAND.gray200,
            boxShadow: !c.hidden && !c.approved ? '0 0 0 1px #F59E0B' : CARD_SHADOW,
            background: BRAND.surface,
          }"
          @click="reviewId = c.id"
        >
          <div class="relative aspect-square" :style="{ background: BRAND.mediaMat }">
            <img
              v-if="c.imageUrl"
              :src="c.imageUrl"
              :alt="c.productName"
              class="size-full object-cover"
              :style="c.hidden ? { opacity: 0.35 } : undefined"
            />
          </div>
          <div class="flex items-center justify-between gap-2 px-3 py-2">
            <p class="truncate text-[12px] font-medium" :style="{ color: BRAND.ink }">
              {{ c.productName }}
            </p>
            <span
              class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :style="
                c.approved
                  ? { background: BRAND.successSoft, color: BRAND.emeraldText }
                  : { background: BRAND.warningSoft, color: BRAND.warningText }
              "
            >
              <Check v-if="c.approved" class="size-3" />
              {{ c.approved ? 'Approved' : 'Review' }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Products -->
    <div v-else-if="tab === 'products'" class="mt-5 space-y-6">
      <div>
        <h2 class="text-[18px] font-bold tracking-tight" :style="{ color: BRAND.ink }">In this ad</h2>
        <p class="mt-1 text-[13px]" :style="{ color: BRAND.gray500 }">
          {{ covered.length }} products have a creative in this style.
        </p>
        <ul class="mt-3 grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(112px, 1fr))">
          <li
            v-for="p in covered"
            :key="p.id"
            class="overflow-hidden rounded-xl border p-1.5"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
          >
            <span class="grid aspect-square place-items-center" :style="{ background: BRAND.gray50 }">
              <img v-if="p.imageUrl" :src="p.imageUrl" alt="" loading="lazy" class="max-h-full max-w-full object-contain" />
            </span>
            <span class="mt-1 block line-clamp-2 text-[10px] font-medium leading-snug" :style="{ color: BRAND.ink }">
              {{ p.name }}
            </span>
          </li>
        </ul>
      </div>

      <div v-if="gaps.length">
        <h2 class="text-[18px] font-bold tracking-tight" :style="{ color: BRAND.ink }">Not covered yet</h2>
        <p class="mt-1 text-[13px]" :style="{ color: BRAND.gray500 }">
          These are in the catalog but have no creative in this style. Generating them adds them
          to the ad.
        </p>
        <ul class="mt-3 grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(112px, 1fr))">
          <li
            v-for="p in gaps"
            :key="p.id"
            class="overflow-hidden rounded-xl border p-1.5 opacity-70"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
          >
            <span class="grid aspect-square place-items-center" :style="{ background: BRAND.gray50 }">
              <img v-if="p.imageUrl" :src="p.imageUrl" alt="" loading="lazy" class="max-h-full max-w-full object-contain" />
            </span>
            <span class="mt-1 block line-clamp-2 text-[10px] font-medium leading-snug" :style="{ color: BRAND.ink }">
              {{ p.name }}
            </span>
          </li>
        </ul>
        <button
          type="button"
          class="mt-3 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white"
          :style="{ background: BRAND.blue }"
        >
          Generate the missing {{ gaps.length }}
        </button>
      </div>
    </div>

    <!-- Settings -->
    <div v-else class="mt-5 max-w-md space-y-3">
      <p class="text-[12.5px]" :style="{ color: BRAND.gray500 }">
        Saved on this draft only — nothing is sent to Meta.
      </p>
      <label class="block">
        <span class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
          Ad name
        </span>
        <input
          v-model="ad.name"
          class="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
        />
      </label>
      <label class="block">
        <span class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
          Conversion goal
        </span>
        <select
          v-model="adSet.goal"
          class="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
        >
          <option v-for="g in workspaceConversionGoals" :key="g" :value="g">{{ g }}</option>
        </select>
      </label>
    </div>

    <!-- Creative review -->
    <div
      v-if="reviewing"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgb(16 24 40 / 0.45)"
      @click="reviewId = null"
    >
      <div
        class="grid w-full max-w-3xl overflow-hidden rounded-2xl sm:grid-cols-[1fr_300px]"
        :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW }"
        @click.stop
      >
        <div class="p-5" :style="{ background: BRAND.mediaMat }">
          <img
            v-if="reviewing.imageUrl"
            :src="reviewing.imageUrl"
            :alt="reviewing.productName"
            class="aspect-square w-full rounded-xl object-cover"
          />
        </div>
        <div class="flex flex-col p-5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
                Creative
              </p>
              <h2 class="mt-1 text-lg font-semibold" :style="{ color: BRAND.ink }">
                {{ reviewing.productName }}
              </h2>
            </div>
            <button type="button" class="rounded-md p-1" aria-label="Close" @click="reviewId = null">
              <X class="size-4" :style="{ color: BRAND.gray500 }" />
            </button>
          </div>
          <p class="mt-4 flex-1 text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">
            Approving puts this creative in the feed Meta reads. Hiding it keeps the product in
            the ad but drops this picture.
          </p>
          <div class="mt-4 flex gap-2">
            <button
              type="button"
              class="flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-white"
              :style="{ background: BRAND.blueSolid }"
              @click="reviewId = null"
            >
              Approve
            </button>
            <button
              type="button"
              class="rounded-lg border px-3 py-2.5 text-sm font-medium"
              :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
              @click="reviewId = null"
            >
              Hide
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
