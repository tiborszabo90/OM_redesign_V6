<template>
  <aside class="w-60 shrink-0 border-r border-om-gray-200 bg-white flex flex-col">
    <button class="h-14 flex items-center gap-2 px-5 border-b border-om-gray-100 cursor-pointer" @click="$emit('navigate', 'conversionlift')">
      <Zap :size="18" class="text-[#0EA5E9]" />
      <span class="text-sm font-semibold text-om-gray-800">ConversionLift</span>
    </button>
    <nav class="p-3 space-y-1">
      <button v-for="m in menu" :key="m.key" @click="m.route && $emit('navigate', m.route)"
        class="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        :class="active === m.key ? 'bg-(--cl-accent-50) text-[#0369A1]' : 'text-om-gray-600 hover:bg-om-gray-50'">
        <component :is="m.icon" :size="17" />{{ m.label }}
      </button>
    </nav>

    <!-- Footer: AI credits + profile -->
    <div class="mt-auto p-3 space-y-2 border-t border-om-gray-100">
      <div class="rounded-lg border border-om-gray-200 bg-om-gray-50 px-3 py-2.5">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-xs font-medium text-om-gray-600"><Coins :size="14" class="text-[#0EA5E9]" />Credits</span>
          <span class="text-xs font-semibold text-om-gray-800 tabular-nums">{{ credits.used.toLocaleString() }} / {{ credits.total.toLocaleString() }}</span>
        </div>
        <div class="mt-2 h-1.5 rounded-full bg-om-gray-200 overflow-hidden">
          <div class="h-full rounded-full bg-[#0EA5E9]" :style="{ width: creditPct + '%' }"></div>
        </div>
        <div class="mt-1.5 flex items-center justify-between">
          <span class="text-[11px] text-om-gray-400">{{ (credits.total - credits.used).toLocaleString() }} left</span>
          <button class="text-[11px] font-medium text-[#0284C7] hover:underline cursor-pointer">Upgrade</button>
        </div>
      </div>

      <button class="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-om-gray-50 cursor-pointer">
        <span class="w-8 h-8 rounded-full bg-[#0EA5E9] text-white text-xs font-semibold flex items-center justify-center shrink-0">{{ profile.initials }}</span>
        <span class="min-w-0 text-left">
          <span class="block text-sm font-medium text-om-gray-800 truncate">{{ profile.name }}</span>
          <span class="block text-[11px] text-om-gray-400 truncate">{{ profile.email }}</span>
        </span>
        <ChevronsUpDown :size="14" class="ml-auto text-om-gray-400 shrink-0" />
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { Zap, House, LayoutGrid, FlaskConical, TrendingUp, Coins, ChevronsUpDown } from 'lucide-vue-next'

defineProps({ active: { type: String, default: '' } })
defineEmits(['navigate'])

const profile = { name: 'Tibor Szabó', email: 'tibor.szabo@optimonk.com', initials: 'TS' }
const credits = { used: 760, total: 2000 }
const creditPct = computed(() => Math.round((credits.used / credits.total) * 100))

const menu = [
  { key: 'home', label: 'Home', icon: House, route: 'cl-home-b' },
  { key: 'projects', label: 'Variables', icon: LayoutGrid, route: 'cl-projects' },
  { key: 'abtests', label: 'A/B tests', icon: FlaskConical, route: 'cl-abtests' },
  { key: 'insights', label: 'Insights', icon: TrendingUp },
]
</script>
