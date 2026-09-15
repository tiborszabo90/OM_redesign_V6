<script setup>
import { computed, ref } from 'vue'
import { X } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT, MODAL_SHADOW } from '../tokens'
import {
  state, navigate, workspaceFor, workspaceRanges, workspaceKpiLabels,
  workspaceCampaignTabs, workspaceConversionGoals, campaignFeeds, formatUpdatedAt,
} from '../store'

const tab = ref('overview')
const range = ref('last_30d')
const adSetSettingsId = ref(null)
const convertOpen = ref(false)
const activateOpen = ref(false)
const activateNote = ref(null)

/** `/campaigns/:id` and `/campaigns/meta/:id` both land here; only one has the id third. */
const campaignId = computed(() => {
  const parts = state.path.split('/')
  return parts[2] === 'meta' ? parts[3] : parts[2]
})
const campaign = computed(() => workspaceFor(campaignId.value))

const kpiValues = computed(() => campaign.value?.kpis?.[range.value] ?? null)

const editingAdSet = computed(() =>
  campaign.value?.adSets.find((s) => s.id === adSetSettingsId.value) ?? null,
)

function activate() {
  activateOpen.value = false
  activateNote.value =
    'On Meta, paused. Everything starts paused, so nothing spends until you flip it on in Ads Manager.'
}
</script>

<template>
  <div v-if="!campaign" class="px-6 py-8 text-sm" :style="{ color: BRAND.gray500 }">
    That campaign is gone.
  </div>

  <div v-else class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <button
      type="button"
      class="text-sm font-medium"
      :style="{ color: BRAND.blue }"
      @click="navigate('/campaigns')"
    >
      ← Campaigns
    </button>

    <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-[26px] font-bold tracking-tight" :style="{ color: BRAND.ink }">
          {{ campaign.name }}
        </h1>
        <div class="mt-1.5 flex flex-wrap items-center gap-2 text-[13px]" :style="{ color: BRAND.gray500 }">
          <span
            v-if="campaign.advantagePlus"
            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
            :style="{ background: BRAND.blueSoft, color: BRAND.blue }"
          >
            Advantage+
          </span>
          <span>{{ campaign.objective }}</span>
          <span>{{ campaign.domain }}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="!campaign.advantagePlus"
          type="button"
          class="inline-flex items-center rounded-[10px] border px-4 py-2.5 text-[13.5px] font-semibold"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink, background: BRAND.surface }"
          @click="convertOpen = true"
        >
          Convert to Advantage+
        </button>
        <button
          type="button"
          :disabled="Boolean(activateNote)"
          :title="activateNote ? 'Already activated — manage it in Ads Manager.' : undefined"
          class="inline-flex items-center rounded-[10px] px-4 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-45"
          :style="{ background: BRAND.blue }"
          @click="activateOpen = true"
        >
          Activate
        </button>
      </div>
    </div>

    <p
      v-if="activateNote"
      class="mt-4 rounded-xl border px-4 py-2.5 text-[13px]"
      :style="{ borderColor: BRAND.infoLine, background: BRAND.infoSoft, color: BRAND.gray600 }"
    >
      {{ activateNote }}
    </p>

    <div class="mt-5 flex flex-wrap gap-1">
      <button
        v-for="t in workspaceCampaignTabs"
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

    <!-- Feeds -->
    <div v-if="tab === 'feeds'" class="mt-5 space-y-3">
      <p class="text-[13px] leading-relaxed" :style="{ color: BRAND.gray600 }">
        One feed per style. Paste the URL into Commerce Manager as a scheduled feed — Meta
        re-reads it, so new creatives join the catalog without another upload.
      </p>
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
        <code
          class="mt-2 block break-all rounded-md px-2 py-1.5 text-xs"
          :style="{ background: BRAND.gray100, color: BRAND.ink }"
        >
          {{ feed.url }}
        </code>
        <p class="mt-2 text-xs" :style="{ color: BRAND.gray500 }">
          {{ feed.ready }} of {{ feed.products }} products have a creative
          <span v-if="feed.ready < feed.products"> — the rest are still rendering.</span>
        </p>
      </div>
    </div>

    <!-- Overview -->
    <template v-else>
      <div
        class="mt-5 grid grid-cols-[repeat(5,1fr)_auto] items-center gap-4 rounded-2xl border px-5 py-4"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <div v-for="label in workspaceKpiLabels" :key="label">
          <p class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
            {{ label }}
          </p>
          <h3
            class="mt-1 text-[21px] font-extrabold tabular-nums"
            :style="{ color: kpiValues ? BRAND.ink : BRAND.gray400 }"
          >
            {{ kpiValues?.[label] ?? '—' }}
          </h3>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="r in workspaceRanges"
            :key="r.id"
            type="button"
            class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            :style="{
              background: range === r.id ? BRAND.blueSoft : BRAND.gray100,
              color: range === r.id ? BRAND.blue : BRAND.gray600,
            }"
            @click="range = r.id"
          >
            {{ r.label }}
          </button>
        </div>
      </div>

      <div class="mt-6 space-y-6">
        <div v-for="adSet in campaign.adSets" :key="adSet.id">
          <div
            class="flex items-center gap-3 rounded-2xl border px-4 py-3.5"
            :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
          >
            <div class="min-w-0 flex-1">
              <p class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
                Ad set
              </p>
              <p class="mt-0.5 truncate text-sm font-semibold" :style="{ color: BRAND.ink }">
                {{ adSet.name }}
              </p>
            </div>
            <p class="shrink-0 text-[12.5px]" :style="{ color: BRAND.gray500 }">{{ adSet.budget }}</p>
            <button
              type="button"
              class="text-[13px] font-semibold hover:underline"
              :style="{ color: BRAND.blue }"
              @click="adSetSettingsId = adSet.id"
            >
              Settings
            </button>
          </div>

          <div class="ml-8 mt-3 space-y-3 border-l-2 pl-4" :style="{ borderColor: BRAND.gray200 }">
            <!-- The card itself opens the ad — the row read as a header over its own
                 buttons, and every click on the thumbnails did nothing. -->
            <div
              v-for="ad in adSet.ads"
              :key="ad.id"
              role="button"
              tabindex="0"
              class="w-full cursor-pointer rounded-2xl border px-4 py-3 text-left transition-colors hover:bg-[var(--oq-blue-soft)]"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
              @click="navigate(`/campaigns/${campaign.id}/ads/${ad.id}`)"
              @keydown.enter.prevent="navigate(`/campaigns/${campaign.id}/ads/${ad.id}`)"
            >
              <p class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">Ad</p>
              <p class="mt-0.5 text-sm font-semibold" :style="{ color: BRAND.ink }">{{ ad.name }}</p>
              <div class="mt-3 flex items-center gap-4">
                <div class="flex gap-2">
                  <div
                    v-for="c in ad.creatives.slice(0, 3)"
                    :key="c.id"
                    class="size-16 shrink-0 overflow-hidden rounded-[10px] border"
                    :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }"
                    :title="c.productName"
                  >
                    <img v-if="c.imageUrl" :src="c.imageUrl" :alt="c.productName" class="size-full object-cover" />
                  </div>
                </div>
                <p class="min-w-0 text-[13px] font-semibold" :style="{ color: BRAND.ink }">
                  {{ ad.creatives.length }} creatives generated
                </p>
                <div class="ml-auto flex shrink-0 items-center gap-2" @click.stop>
                  <button
                    type="button"
                    class="inline-flex items-center rounded-lg px-3 py-1.5 text-[12px] font-semibold"
                    :style="{ background: BRAND.gray100, color: BRAND.ink }"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Ad set settings -->
    <div
      v-if="editingAdSet"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgb(16 24 40 / 0.45)"
      @click="adSetSettingsId = null"
    >
      <div
        class="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl p-5"
        :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW, fontFamily: FONT }"
        @click.stop
      >
        <div class="flex items-start justify-between gap-3">
          <h2 class="text-base font-semibold tracking-tight" :style="{ color: BRAND.ink }">
            {{ editingAdSet.name }} · Settings
          </h2>
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-full"
            :style="{ background: BRAND.gray100, color: BRAND.gray600 }"
            aria-label="Close"
            @click="adSetSettingsId = null"
          >
            <X class="size-4" />
          </button>
        </div>
        <p class="mt-1 text-[12.5px]" :style="{ color: BRAND.gray500 }">
          Saved on this draft only — nothing is sent to Meta.
        </p>
        <div class="mt-4 flex flex-col gap-3">
          <label class="block">
            <span class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
              Daily budget
            </span>
            <input
              v-model="editingAdSet.budget"
              class="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            />
          </label>
          <label class="block">
            <span class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
              Schedule
            </span>
            <input
              v-model="editingAdSet.schedule"
              class="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            />
          </label>
          <label class="block">
            <span class="text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray400 }">
              Conversion goal
            </span>
            <select
              v-model="editingAdSet.goal"
              class="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
            >
              <option v-for="g in workspaceConversionGoals" :key="g" :value="g">{{ g }}</option>
            </select>
          </label>
        </div>
        <div class="mt-5 flex justify-end">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white"
            :style="{ background: BRAND.blue }"
            @click="adSetSettingsId = null"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Convert to Advantage+ -->
    <div
      v-if="convertOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgb(16 24 40 / 0.45)"
    >
      <div
        class="w-full max-w-md rounded-2xl p-5"
        :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW, fontFamily: FONT }"
      >
        <h2 class="text-base font-semibold tracking-tight" :style="{ color: BRAND.ink }">
          Convert to Advantage+ catalog ads
        </h2>
        <p class="mt-2 text-[13px] leading-relaxed" :style="{ color: BRAND.gray600 }">
          Your campaign, ad sets and ads stay exactly where they are on Meta. What changes is
          what each ad shows: instead of the uploaded carousel, Meta renders one ad per product
          from your catalog, using the images OptiQube generated.
        </p>
        <p class="mt-2 text-[13px] leading-relaxed" :style="{ color: BRAND.gray600 }">
          The 10-image limit goes away, and new products join the ad as they are generated. Ads
          that are running keep running — they start showing the catalog version.
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-[13px] font-semibold"
            :style="{ background: BRAND.gray100, color: BRAND.gray600 }"
            @click="convertOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-[13px] font-semibold text-white"
            :style="{ background: BRAND.blue }"
            @click="campaign.advantagePlus = true; convertOpen = false"
          >
            Convert
          </button>
        </div>
      </div>
    </div>

    <!-- Activate -->
    <div
      v-if="activateOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgb(16 24 40 / 0.45)"
      @click="activateOpen = false"
    >
      <div
        class="w-full max-w-md rounded-2xl p-5"
        :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW, fontFamily: FONT }"
        @click.stop
      >
        <h2 class="text-base font-semibold tracking-tight" :style="{ color: BRAND.ink }">
          Activate on Meta
        </h2>
        <p class="mt-2 text-[13px] leading-relaxed" :style="{ color: BRAND.gray600 }">
          The campaign, its ad sets and its ads are created on Meta — all paused. Nothing spends
          until you turn them on in Ads Manager.
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-[13px] font-semibold"
            :style="{ background: BRAND.gray100, color: BRAND.gray600 }"
            @click="activateOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-[13px] font-semibold text-white"
            :style="{ background: BRAND.blue }"
            @click="activate"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
