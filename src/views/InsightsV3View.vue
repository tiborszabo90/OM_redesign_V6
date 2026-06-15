<template>
  <AgenticShell active-item="analytics">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="backToInsights"
          class="inline-flex items-center gap-1 text-sm text-om-gray-500 hover:text-om-gray-700 transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft :size="15" /> Back to insights
        </button>
        <h1 class="text-2xl font-semibold text-om-gray-800 tracking-tight">Analytics</h1>
        <p class="text-sm text-om-gray-500 mt-1">Detailed breakdown for {{ domain }}, last 30 days.</p>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-4">
        <!-- Funnel -->
        <div class="col-span-2 bg-white rounded-xl border border-om-gray-200 p-4">
          <p class="text-sm font-semibold text-om-gray-700 mb-3">Conversion funnel</p>
          <div class="space-y-2.5">
            <div v-for="(s, i) in funnel" :key="s.label">
              <div class="flex items-baseline justify-between mb-1">
                <span class="text-xs text-om-gray-500">{{ s.label }}</span>
                <span class="flex items-baseline gap-2">
                  <span class="text-sm font-semibold text-om-gray-700">{{ s.value }}</span>
                  <span v-if="s.drop != null" class="inline-flex items-center text-[11px] font-medium text-om-orange-600"><ArrowDown :size="10" />{{ s.drop }}%</span>
                </span>
              </div>
              <div class="h-3 rounded-full bg-om-gray-100 overflow-hidden">
                <div class="h-full rounded-full bg-om-orange-500" :style="{ width: Math.max(4, s.percent) + '%' }"></div>
              </div>
            </div>
          </div>
          <p class="mt-4 text-sm text-om-gray-600 leading-snug">
            <span class="font-semibold text-om-orange-600">966 carts (68%)</span> are abandoned every month before purchase — the biggest leak in the funnel.
          </p>
        </div>

        <!-- Segments -->
        <div class="bg-white rounded-xl border border-om-gray-200 p-4">
          <p class="text-sm font-semibold text-om-gray-700 mb-3">Where conversions come from</p>
          <div v-for="g in segments" :key="g.title" class="mb-4 last:mb-0">
            <p class="text-xs text-om-gray-400 mb-2">{{ g.title }}</p>
            <div v-for="row in g.rows" :key="row.label" class="flex items-center gap-2 mb-1.5">
              <span class="w-16 text-xs text-om-gray-500 shrink-0">{{ row.label }}</span>
              <div class="flex-1 h-2 rounded-full bg-om-gray-100 overflow-hidden">
                <div class="h-full rounded-full" :style="{ width: row.pct + '%', backgroundColor: row.color }"></div>
              </div>
              <span class="w-9 text-right text-xs font-medium text-om-gray-600">{{ row.pct }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AgenticShell>
</template>

<script setup>
import { ArrowDown, ArrowLeft } from 'lucide-vue-next'
import AgenticShell from '../components/AgenticShell.vue'

const domain = 'reflexshop.hu'

const funnelRaw = [
  { label: 'Visitors', value: '24,800', percent: 100 },
  { label: 'Engaged (saw a popup)', value: '9,200', percent: 37 },
  { label: 'Submitted', value: '1,240', percent: 5 },
  { label: 'Purchased', value: '454', percent: 1.8 },
]
const funnel = funnelRaw.map((s, i) => ({
  ...s,
  drop: i === 0 ? null : Math.round(((funnelRaw[i - 1].percent - s.percent) / funnelRaw[i - 1].percent) * 100),
}))

const segments = [
  { title: 'Device', rows: [
    { label: 'Desktop', pct: 58, color: '#ED5A29' },
    { label: 'Mobile', pct: 36, color: '#F17E58' },
    { label: 'Tablet', pct: 6, color: '#FBD9CE' },
  ] },
  { title: 'Visitor type', rows: [
    { label: 'New', pct: 64, color: '#ED5A29' },
    { label: 'Returning', pct: 36, color: '#F17E58' },
  ] },
]

const backToInsights = () => { window.location.hash = '#/agentic/insights' }
</script>
