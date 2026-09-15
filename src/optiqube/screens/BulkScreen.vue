<script setup>
import { computed, ref } from 'vue'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { state, navigate } from '../store'

const BULK_SIZES = [10, 50, 100]
const ASPECT_RATIOS = ['1:1', '4:5', '9:16']

const bulkSize = ref(50)
/** 1:1 is always on — the other ratios multiply the round. */
const enabled = ref(['1:1'])
const styles = 2

const campaignId = computed(() => state.path.split('/')[2])

const stills = computed(() => bulkSize.value * styles * enabled.value.length)
const baseline = computed(() => bulkSize.value * styles)
const extraPct = computed(() =>
  baseline.value ? Math.round(((stills.value - baseline.value) / baseline.value) * 100) : 0,
)

function toggle(r) {
  if (r === '1:1') return
  const i = enabled.value.indexOf(r)
  if (i >= 0) enabled.value.splice(i, 1)
  else enabled.value.push(r)
}
</script>

<template>
  <div
    class="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
    <header class="border-b px-5 py-3.5" :style="{ borderColor: BRAND.gray200 }">
      <h1 class="text-lg font-semibold tracking-tight" :style="{ color: BRAND.ink }">Bulk generation</h1>
      <p class="text-xs" :style="{ color: BRAND.gray500 }">
        Decide formats here before you spend — default is 1:1 only.
      </p>
    </header>

    <div class="mx-auto w-full max-w-lg flex-1 space-y-5 overflow-y-auto px-5 py-8">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="n in BULK_SIZES"
          :key="n"
          type="button"
          class="rounded-full border px-4 py-2 text-sm font-medium"
          :style="{
            borderColor: bulkSize === n ? BRAND.blue : BRAND.gray200,
            background: bulkSize === n ? BRAND.blueSoft : BRAND.surface,
            color: BRAND.ink,
          }"
          @click="bulkSize = n"
        >
          Top {{ n }}
        </button>
      </div>

      <div class="rounded-xl border px-3.5 py-3" :style="{ borderColor: BRAND.gray200, background: BRAND.gray50 }">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="text-xs font-semibold" :style="{ color: BRAND.ink }">Formats to generate</p>
            <p class="text-[11px]" :style="{ color: BRAND.gray500 }">
              1:1 always on. Extra ratios multiply image gens on bulk (~{{ enabled.length }}×).
            </p>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="r in ASPECT_RATIOS"
              :key="r"
              type="button"
              :disabled="r === '1:1'"
              class="rounded-full border px-3 py-1.5 text-xs font-medium"
              :class="{ 'opacity-90': r === '1:1' }"
              :style="{
                background: enabled.includes(r) ? BRAND.blueSolid : BRAND.surface,
                borderColor: enabled.includes(r) ? BRAND.blue : BRAND.gray200,
                color: enabled.includes(r) ? BRAND.onAccent : BRAND.ink,
              }"
              @click="toggle(r)"
            >
              {{ r }}{{ r === '1:1' ? ' · default' : enabled.includes(r) ? ' · on' : ' · off' }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border px-3 py-3" :style="{ borderColor: BRAND.gray200, background: BRAND.surface }">
          <p class="text-[11px]" :style="{ color: BRAND.gray500 }">Still gens</p>
          <p class="text-2xl font-semibold tabular-nums" :style="{ color: BRAND.ink }">{{ stills }}</p>
          <p class="text-[11px]" :style="{ color: BRAND.gray500 }">
            {{ bulkSize }} × {{ styles }} × {{ enabled.length }}
          </p>
        </div>
        <div class="rounded-xl border px-3 py-3" :style="{ borderColor: BRAND.gray200, background: BRAND.surface }">
          <p class="text-[11px]" :style="{ color: BRAND.gray500 }">vs 1:1-only baseline</p>
          <p class="text-2xl font-semibold tabular-nums" :style="{ color: BRAND.ink }">
            {{ stills - baseline }}
          </p>
          <p class="text-[11px]" :style="{ color: BRAND.gray500 }">
            {{ extraPct === 0 ? 'no extra cost' : `+${extraPct}%` }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white"
        :style="{ background: BRAND.blueSolid }"
        @click="navigate(`/campaigns/${campaignId}/handoff`)"
      >
        View results &amp; feed
      </button>
    </div>
  </div>
</template>
