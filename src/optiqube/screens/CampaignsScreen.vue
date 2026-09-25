<script setup>
import { computed, ref, reactive } from 'vue'
import { ExternalLink, Plus, Search, Trash2 } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import {
  campaigns, campaignStatusFilters, filterCampaigns, navigate,
  formatMoney, formatInt, formatPct, formatRoi, formatUpdatedAt,
} from '../store'
import OqCampaignThumb from '../components/OqCampaignThumb.vue'
import OqStatusChip from '../components/OqStatusChip.vue'
import OqToggle from '../components/OqToggle.vue'

const statusFilter = ref('all')
const query = ref('')
const deleteTarget = ref(null)

/** The list toggle is local in the product too — it never writes to the server. */
const overrides = reactive({})

const rows = computed(() =>
  campaigns.map((c) => {
    const o = overrides[c.id]
    return o ? { ...c, active: o.active, status: o.status } : c
  }),
)

const filtered = computed(() => filterCampaigns(rows.value, statusFilter.value, query.value))
const liveCount = computed(() => rows.value.filter((c) => c.status === 'active').length)

function setToggle(c, next) {
  overrides[c.id] = {
    active: next,
    status: next ? 'active' : c.status === 'draft' ? 'draft' : 'paused',
  }
}

function openCampaign(c) {
  navigate(c.adsManagerUrl ? `/campaigns/meta/${c.id}` : `/campaigns/${c.id}`)
}
</script>

<template>
  <div class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-[28px] font-bold tracking-tight" :style="{ color: BRAND.ink }">
        Campaigns
        <span class="font-semibold" :style="{ color: BRAND.gray500 }">({{ liveCount }})</span>
      </h1>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid, boxShadow: '0 1px 2px rgb(0 127 255 / 0.25)' }"
      >
        <Plus class="size-4" />
        New campaign
      </button>
    </div>

    <div class="mt-5 flex flex-wrap items-center gap-2.5">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="f in campaignStatusFilters"
          :key="f.id"
          type="button"
          @click="statusFilter = f.id"
          class="rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors"
          :style="{
            borderColor: statusFilter === f.id ? BRAND.gray300 : BRAND.gray200,
            background: statusFilter === f.id ? BRAND.gray100 : BRAND.surface,
            color: statusFilter === f.id ? BRAND.ink : BRAND.gray600,
          }"
        >
          {{ f.label }}
        </button>
      </div>
      <label
        class="ml-auto flex min-w-[240px] flex-1 items-center gap-2 rounded-[10px] border px-3 py-2 sm:max-w-xs sm:flex-none"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <Search class="size-4 shrink-0" :style="{ color: BRAND.gray400 }" />
        <input
          v-model="query"
          placeholder="Search campaigns…"
          class="w-full bg-transparent text-[13px] outline-none"
          :style="{ color: BRAND.ink }"
        />
      </label>
    </div>

    <div class="mt-4 flex flex-col gap-2.5">
      <div
        v-if="!filtered.length"
        class="rounded-2xl border px-5 py-10 text-center text-sm"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.gray500, boxShadow: CARD_SHADOW }"
      >
        No campaigns match this filter.
      </div>

      <button
        v-for="c in filtered"
        :key="c.id"
        type="button"
        @click="openCampaign(c)"
        class="grid grid-cols-[72px_minmax(160px,1.2fr)_minmax(240px,1.6fr)_auto] items-center gap-4 rounded-[14px] border px-4 py-3.5 text-left transition-shadow hover:shadow-[var(--oq-shadow-lift)]"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface, boxShadow: CARD_SHADOW }"
      >
        <OqCampaignThumb :preview-url="c.previewUrl" :preset-id="c.creativePresetId" />

        <div class="min-w-0">
          <h2 class="truncate text-[15px] font-semibold" :style="{ color: BRAND.ink }">{{ c.name }}</h2>
          <div class="mt-1.5 flex flex-wrap items-center gap-2 text-[12.5px]" :style="{ color: BRAND.gray500 }">
            <OqStatusChip :status="c.status" />
            <span
              v-if="c.noCatalog"
              class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :style="{ background: BRAND.warningSoft, color: BRAND.warningText }"
            >
              No catalog
            </span>
            <span
              v-if="c.adsManagerUrl"
              class="rounded-full px-2 py-0.5 text-xs font-semibold"
              :style="{ background: BRAND.infoSoft, color: BRAND.blue }"
            >
              Meta
            </span>
            <span
              v-if="c.creativeLabel"
              class="rounded-full px-2 py-0.5 text-xs font-medium"
              :style="{ background: BRAND.gray100, color: BRAND.gray600 }"
            >
              {{ c.creativeLabel }}
            </span>
            <span>{{ c.variantSummary }}</span>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <div>
            <p class="text-[11px] font-medium" :style="{ color: BRAND.gray500 }">Spend</p>
            <p class="mt-0.5 text-sm font-semibold tabular-nums" :style="{ color: BRAND.ink }">
              {{ c.kpis ? formatMoney(c.kpis.spend) : '—' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-medium" :style="{ color: BRAND.gray500 }">Clicks</p>
            <p class="mt-0.5 text-sm font-semibold tabular-nums" :style="{ color: BRAND.ink }">
              {{ c.kpis ? formatInt(c.kpis.clicks) : '—' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-medium" :style="{ color: BRAND.gray500 }">CTR</p>
            <p class="mt-0.5 text-sm font-semibold tabular-nums" :style="{ color: BRAND.ink }">
              {{ c.kpis ? formatPct(c.kpis.ctr) : '—' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-medium" :style="{ color: BRAND.gray500 }">ROAS</p>
            <p class="mt-0.5 text-sm font-semibold tabular-nums" :style="{ color: BRAND.ink }">
              {{ c.kpis ? formatRoi(c.kpis.roi) : '—' }}
            </p>
          </div>
        </div>

        <div class="flex min-w-[120px] flex-col items-end gap-2.5">
          <div class="flex items-center gap-2">
            <span class="whitespace-nowrap text-xs" :style="{ color: BRAND.gray500 }">
              {{ formatUpdatedAt(c.updatedAt) }}
            </span>
            <button
              type="button"
              :aria-label="`Delete ${c.name}`"
              title="Delete campaign"
              @click.prevent.stop="deleteTarget = c"
              class="rounded-md p-1.5 transition-colors hover:bg-[var(--oq-danger-soft)]"
              :style="{ color: BRAND.gray400 }"
            >
              <Trash2 class="size-4" />
            </button>
          </div>
          <span
            v-if="c.adsManagerUrl"
            class="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium"
            :style="{ color: BRAND.blue }"
          >
            Details
            <ExternalLink class="size-3.5" />
          </span>
          <OqToggle
            v-else
            :model-value="c.active"
            @update:model-value="(next) => setToggle(c, next)"
          />
        </div>
      </button>
    </div>

    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgb(16 24 40 / 0.45)"
      @click="deleteTarget = null"
    >
      <div
        class="w-full max-w-md rounded-2xl p-5"
        :style="{ background: BRAND.surface, boxShadow: 'var(--oq-shadow-modal)' }"
        @click.stop
      >
        <h2 class="text-base font-semibold tracking-tight" :style="{ color: BRAND.ink }">
          Delete “{{ deleteTarget.name }}”?
        </h2>
        <p class="mt-2 text-sm" :style="{ color: BRAND.gray600 }">
          This also deletes what the campaign put on Meta: its ads and its product sets.
          Its creatives leave the OptiQube catalog on Meta's next update. Products other
          campaigns also use stay live for them.
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            @click="deleteTarget = null"
            class="rounded-lg px-3 py-2 text-sm font-medium"
            :style="{ color: BRAND.gray600 }"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="deleteTarget = null"
            class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
            :style="{ background: BRAND.redSolid }"
          >
            Delete campaign
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
