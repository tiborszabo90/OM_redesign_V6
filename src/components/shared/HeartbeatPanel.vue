<template>
  <transition name="panel">
    <div v-if="open" class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div class="flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-sm font-semibold text-om-gray-700">Live Visitors</span>
          <span class="text-xs text-om-gray-400">{{ visitors.length }} active now</span>
        </div>
        <button @click="$emit('close')" class="text-om-gray-400 hover:text-om-gray-600 transition-colors cursor-pointer">
          <X :size="16" />
        </button>
      </div>

      <!-- Visitor list -->
      <div class="max-h-85 overflow-y-auto">
        <!-- Column headers (sticky inside scroll area) -->
        <div class="grid grid-cols-[2fr_1.5fr_1fr_80px] gap-3 px-5 py-3 border-b border-[rgb(227,229,232)] text-[13px] font-normal text-om-gray-500 sticky top-0 bg-white z-10">
          <span>Visitor</span>
          <span>Current Page</span>
          <span>Source</span>
          <span class="text-right">Duration</span>
        </div>
        <TransitionGroup name="visitor" tag="div" class="divide-y divide-gray-50 relative">
          <div
            v-for="visitor in visitors"
            :key="visitor.id"
            class="visitor-row grid grid-cols-[2fr_1.5fr_1fr_80px] gap-3 items-center px-5 py-2.5 hover:bg-gray-50/50 transition-colors"
            :class="{ 'visitor-highlight': visitor.isNew }"
          >
            <!-- Col 1: Visitor identity -->
            <div class="flex items-center gap-2.5 min-w-0">
              <img
                v-if="getFlagUrl(visitor.country)"
                :src="getFlagUrl(visitor.country)"
                :alt="visitor.country"
                class="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-om-gray-200"
              />
              <div v-else class="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs">
                {{ visitor.flag }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-[13px] font-medium text-om-gray-700 truncate">{{ visitor.city }}, {{ visitor.country }}</span>
                  <transition name="badge">
                    <span v-if="visitor.isNew" class="text-[9px] font-semibold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full leading-none">new</span>
                  </transition>
                  <span v-if="visitor.returning" class="text-[9px] font-medium bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full leading-none">returning</span>
                </div>
                <div class="flex items-center gap-1 mt-0.5 text-[11px] text-om-gray-400">
                  <component :is="visitor.deviceIcon" :size="10" class="shrink-0" />
                  <span class="truncate">{{ visitor.device }} · {{ visitor.browser }}</span>
                </div>
              </div>
            </div>

            <!-- Col 2: Current page -->
            <div class="min-w-0">
              <div class="text-[13px] text-om-gray-600 truncate font-mono">{{ visitor.currentPage }}</div>
            </div>

            <!-- Col 3: Referrer source -->
            <div class="flex items-center gap-1.5">
              <div class="w-4 h-4 rounded-full flex items-center justify-center shrink-0" :class="referrerStyle(visitor.referrer).bg">
                <component :is="referrerStyle(visitor.referrer).icon" :size="10" :class="referrerStyle(visitor.referrer).text" />
              </div>
              <span class="text-[12px] text-om-gray-500 capitalize">{{ visitor.referrer }}</span>
            </div>

            <!-- Col 4: Duration -->
            <div class="text-right">
              <span class="text-[13px] font-medium text-om-gray-600 tabular-nums">{{ visitor.duration }}</span>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer -->
      <div v-if="visitors.length > 0" class="px-5 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <div class="flex items-center justify-between text-xs text-om-gray-400">
          <span>Top pages: {{ topPages.join(' · ') }}</span>
          <span class="flex items-center gap-1">
            <RefreshCw :size="10" class="animate-spin-slow" />
            Auto-refreshing
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, markRaw } from 'vue'
import { X, RefreshCw, Search, Globe, Mail, Share2, ExternalLink } from 'lucide-vue-next'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  visitors: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close'])

const countryCodeMap = {
  'USA': 'US',
  'Germany': 'DE',
  'Hungary': 'HU',
  'UK': 'GB',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Austria': 'AT',
  'Romania': 'RO',
  'Netherlands': 'NL',
  'Poland': 'PL',
  'Italy': 'IT',
  'Spain': 'ES',
  'Sweden': 'SE',
  'United States': 'US',
  'Canada': 'CA',
  'Australia': 'AU',
  'Czech Republic': 'CZ',
  'Slovakia': 'SK',
  'Switzerland': 'CH',
  'Belgium': 'BE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Portugal': 'PT',
  'Greece': 'GR',
  'Croatia': 'HR',
  'Ukraine': 'UA',
  'Serbia': 'RS',
  'Bulgaria': 'BG',
  'Turkey': 'TR',
  'Japan': 'JP',
  'Singapore': 'SG',
}
const getFlagUrl = (country) => {
  const code = countryCodeMap[country]
  return code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : null
}

const referrerIcons = {
  google: { icon: markRaw(Search), bg: 'bg-blue-50', text: 'text-blue-500' },
  direct: { icon: markRaw(Globe), bg: 'bg-gray-100', text: 'text-gray-500' },
  facebook: { icon: markRaw(Share2), bg: 'bg-indigo-50', text: 'text-indigo-500' },
  instagram: { icon: markRaw(Share2), bg: 'bg-pink-50', text: 'text-pink-500' },
  tiktok: { icon: markRaw(Share2), bg: 'bg-gray-100', text: 'text-gray-700' },
  email: { icon: markRaw(Mail), bg: 'bg-amber-50', text: 'text-amber-600' },
}
const defaultReferrer = { icon: markRaw(ExternalLink), bg: 'bg-gray-100', text: 'text-gray-400' }

function referrerStyle(ref) {
  return referrerIcons[ref] || defaultReferrer
}

const topPages = computed(() => {
  const pages = {}
  props.visitors.forEach(v => {
    pages[v.currentPage] = (pages[v.currentPage] || 0) + 1
  })
  return Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([page]) => page)
})
</script>

<style scoped>
/* ── Panel open/close ── */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.25s ease;
  transform-origin: top;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-8px);
}

/* ── Visitor row enter: slide in from left + fade + expand height ── */
.visitor-enter-active {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}
.visitor-enter-from {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  transform: translateX(-20px);
}
.visitor-enter-to {
  max-height: 80px;
}

/* ── Visitor row leave: fade out + collapse height ── */
.visitor-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.visitor-leave-from {
  max-height: 80px;
}
.visitor-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  transform: translateX(16px) scale(0.97);
}

/* ── Existing rows slide down smoothly ── */
.visitor-move {
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Green highlight flash on new visitor ── */
.visitor-highlight {
  animation: highlight-flash 1.5s ease-out;
}
@keyframes highlight-flash {
  0% { background-color: rgb(236 253 245); }
  30% { background-color: rgb(209 250 229); }
  100% { background-color: transparent; }
}

/* ── "new" badge fade ── */
.badge-enter-active {
  transition: all 0.3s ease;
}
.badge-leave-active {
  transition: all 0.25s ease;
}
.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

/* Slow spin for refresh icon */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
