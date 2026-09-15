<script setup>
import { computed, ref } from 'vue'
import { Check, Copy, ExternalLink } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { state, navigate, campaignFeeds, products, inspirationCatalog, formatUpdatedAt } from '../store'

const campaignId = computed(() => state.path.split('/')[2])
const copied = ref(null)

/** What the round produced, per style — the grid the merchant signs off on. */
const rows = computed(() =>
  products.slice(0, 12).map((p, i) => ({
    ...p,
    creativeUrl: inspirationCatalog[i % inspirationCatalog.length].imageUrl,
    approved: i % 4 !== 2,
  })),
)

function copy(url, id) {
  navigator.clipboard?.writeText(url)
  copied.value = id
  setTimeout(() => {
    if (copied.value === id) copied.value = null
  }, 1600)
}
</script>

<template>
  <div class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <button
      type="button"
      class="text-sm font-medium"
      :style="{ color: BRAND.blue }"
      @click="navigate(`/campaigns/${campaignId}`)"
    >
      ← Campaign
    </button>

    <h1 class="mt-4 text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">
      Results &amp; feed
    </h1>
    <p class="mt-2 max-w-2xl text-sm leading-relaxed" :style="{ color: BRAND.gray500 }">
      What the round produced, and the feed URLs that carry it to Meta. Approve what should
      ship — Meta re-reads the feed on its own schedule, so nothing has to be exported again.
    </p>

    <div class="mt-6 max-w-3xl space-y-3">
      <div
        v-for="feed in campaignFeeds"
        :key="feed.id"
        class="rounded-2xl border px-4 py-3.5"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">{{ feed.styleLabel }}</p>
          <p class="text-xs" :style="{ color: BRAND.gray500 }">{{ formatUpdatedAt(feed.lastBuiltAt) }}</p>
        </div>
        <div class="mt-2 flex items-center gap-2">
          <code
            class="min-w-0 flex-1 break-all rounded-md px-2 py-1.5 text-xs"
            :style="{ background: BRAND.gray100, color: BRAND.ink }"
          >
            {{ feed.url }}
          </code>
          <button
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
            :style="{ background: BRAND.gray100, color: BRAND.ink }"
            @click="copy(feed.url, feed.id)"
          >
            <Check v-if="copied === feed.id" class="size-3.5" :style="{ color: BRAND.emeraldText }" />
            <Copy v-else class="size-3.5" />
            {{ copied === feed.id ? 'Copied' : 'Copy' }}
          </button>
        </div>
        <p class="mt-2 text-xs" :style="{ color: BRAND.gray500 }">
          {{ feed.ready }} of {{ feed.products }} products have a creative
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-sm font-medium"
        :style="{ color: BRAND.blue }"
        @click="navigate('/help/meta-feeds')"
      >
        How to wire these into Commerce Manager
        <ExternalLink class="size-3.5" />
      </button>
    </div>

    <h2 class="mt-10 text-lg font-semibold tracking-tight" :style="{ color: BRAND.ink }">
      What was generated
    </h2>
    <ul class="mt-3 grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))">
      <li
        v-for="r in rows"
        :key="r.id"
        class="overflow-hidden rounded-xl border"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <img :src="r.creativeUrl" :alt="r.name" loading="lazy" class="aspect-square w-full object-cover" />
        <div class="flex items-center justify-between gap-2 px-2.5 py-2">
          <p class="truncate text-[12px] font-medium" :style="{ color: BRAND.ink }">{{ r.name }}</p>
          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :style="
              r.approved
                ? { background: BRAND.successSoft, color: BRAND.emeraldText }
                : { background: BRAND.warningSoft, color: BRAND.warningText }
            "
          >
            {{ r.approved ? 'In feed' : 'Review' }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
