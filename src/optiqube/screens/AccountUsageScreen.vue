<script setup>
import { computed, ref } from 'vue'
import { BRAND } from '../tokens'
import { usageByDomain, usageRangePresets, formatCreditsUsd, formatInt } from '../store'
import OqAccountLayout from '../components/OqAccountLayout.vue'

const preset = ref('30d')

const total = computed(() => usageByDomain.reduce((sum, r) => sum + r.creditsUsd, 0))
</script>

<template>
  <OqAccountLayout title="Usage">
    <div class="mb-6 flex flex-wrap gap-1.5">
      <button
        v-for="p in usageRangePresets"
        :key="p.id"
        type="button"
        @click="preset = p.id"
        class="rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors"
        :style="{
          borderColor: preset === p.id ? BRAND.gray300 : BRAND.gray200,
          background: preset === p.id ? BRAND.gray100 : BRAND.surface,
          color: preset === p.id ? BRAND.ink : BRAND.gray600,
        }"
      >
        {{ p.label }}
      </button>
    </div>

    <p class="text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">
      {{ formatCreditsUsd(total) }}
    </p>
    <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">Total credits in this period</p>

    <div class="mt-6 overflow-x-auto">
      <table class="w-full min-w-[320px] text-left text-sm">
        <thead>
          <tr :style="{ color: BRAND.gray500 }">
            <th class="border-b pb-2 font-medium" :style="{ borderColor: BRAND.gray200 }">Domain</th>
            <th class="border-b pb-2 text-right font-medium" :style="{ borderColor: BRAND.gray200 }">Credits</th>
            <th class="border-b pb-2 text-right font-medium" :style="{ borderColor: BRAND.gray200 }">Events</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in usageByDomain" :key="row.domain">
            <td class="border-b py-2.5" :style="{ borderColor: BRAND.gray200, color: BRAND.ink }">
              {{ row.domain }}
            </td>
            <td class="border-b py-2.5 text-right tabular-nums" :style="{ borderColor: BRAND.gray200, color: BRAND.ink }">
              {{ formatCreditsUsd(row.creditsUsd) }}
            </td>
            <td class="border-b py-2.5 text-right tabular-nums" :style="{ borderColor: BRAND.gray200, color: BRAND.gray600 }">
              {{ formatInt(row.events) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </OqAccountLayout>
</template>
