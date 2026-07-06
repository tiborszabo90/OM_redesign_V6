<template>
  <DashboardLayout active-menu-item="" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1500px] mx-auto pb-10 -mt-[10px]">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6">Subscription</h1>

        <!-- Usage meters -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div v-for="m in meters" :key="m.label" class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
            <div class="flex items-center justify-between gap-2 mb-2">
              <p class="text-sm text-om-gray-500">{{ m.label }}</p>
              <button v-if="m.action" @click="historyOpen = true" class="text-xs font-medium text-om-orange-500 hover:text-om-orange-600 inline-flex items-center gap-1 cursor-pointer shrink-0">
                <History :size="13" /> Credit history
              </button>
            </div>
            <div class="flex items-baseline gap-1.5 mb-3">
              <span class="text-2xl font-semibold text-om-gray-700">{{ m.value }}</span>
              <span class="text-sm text-om-gray-400">{{ m.unit }}</span>
            </div>
            <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden mb-2">
              <div class="h-full rounded-full" :class="m.barClass" :style="{ width: m.pct + '%' }"></div>
            </div>
            <p class="text-xs text-om-gray-400">{{ m.sub }}</p>
          </div>
        </div>

        <!-- Plans (line items) -->
        <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6 mb-8">
          <h2 class="text-base font-semibold text-om-gray-700 mb-2">Your plans</h2>

          <!-- OptiMonk -->
          <div class="flex items-center justify-between gap-4 py-4 border-b border-om-gray-100">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-om-gray-100 flex items-center justify-center shrink-0">
                <LayoutGrid :size="20" class="text-om-gray-500" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-om-gray-700">OptiMonk</p>
                <p class="text-xs text-om-gray-400">Essential 20 plan · Annual · 20,000 pageviews / month</p>
              </div>
            </div>
            <div class="flex items-center gap-5 shrink-0">
              <span class="text-sm font-semibold text-om-gray-700">$228 <span class="text-xs font-normal text-om-gray-400">/ year</span></span>
              <Button variant="secondary" size="sm">Change plan</Button>
            </div>
          </div>

          <!-- Conversion Lift -->
          <div class="flex items-center justify-between gap-4 py-4">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-om-orange-100 flex items-center justify-center shrink-0">
                <ArrowUpRight :size="20" class="text-om-orange-500" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-om-gray-700">Conversion Lift</p>
                <p class="text-xs text-om-gray-400">Annual · 50,000 visitors / month · managed by our CRO team</p>
              </div>
            </div>
            <div class="flex items-center gap-5 shrink-0">
              <span class="text-sm font-semibold text-om-gray-700">{{ clPlan.price }}</span>
              <Button variant="primary" size="sm">Buy credits</Button>
            </div>
          </div>
        </div>

        <!-- Payment method -->
        <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6 mb-8">
          <h2 class="text-base font-semibold text-om-gray-700 mb-4">Payment method</h2>
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 text-sm text-om-gray-600">
              <span class="inline-flex items-center justify-center h-6 px-1.5 rounded bg-[#1A1F71] text-white text-[10px] font-bold tracking-wide">VISA</span>
              <span class="font-semibold text-om-gray-700">•••• 0932</span>
              <span class="text-om-gray-300">·</span>
              <span>Next payment Jun 11, 2027</span>
            </div>
            <Button variant="secondary" size="sm">Manage</Button>
          </div>
        </div>

        <!-- Master upsell -->
        <div class="relative bg-om-orange-50 rounded-2xl px-10 py-9 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 items-center max-w-[820px]">
            <div>
              <h3 class="text-xl font-bold text-om-gray-800 leading-snug mb-5">Need a larger plan?<br />Ask about Master</h3>
              <Button variant="primary">Contact us</Button>
            </div>
            <div class="space-y-3">
              <div v-for="(f, i) in masterFeatures" :key="i" class="flex items-center gap-2 text-sm font-semibold text-om-gray-700">
                <Check :size="16" class="text-[#2CC896] shrink-0" />
                <span>{{ f }}</span>
                <Info :size="15" class="text-om-gray-400 shrink-0" />
              </div>
            </div>
          </div>
          <img src="/monk-hi-user.svg" alt="" class="hidden lg:block absolute -bottom-10 right-12 h-56 w-auto" />
        </div>
      </div>

      <!-- Credit history modal -->
      <Modal v-model="historyOpen" title="Credit history" size="lg">
        <div class="flex items-center justify-between gap-4 pb-4 mb-1 border-b border-om-gray-100">
          <div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-2xl font-semibold text-om-gray-700">{{ credits.available.toLocaleString() }}</span>
              <span class="text-sm text-om-gray-500">credits available</span>
            </div>
            <p class="text-xs text-om-gray-400 mt-0.5">Credits reset on {{ creditsResetDate }}</p>
          </div>
          <Button variant="primary" size="sm">Buy credits</Button>
        </div>
        <div>
          <div v-for="(hi, i) in creditHistory" :key="i" class="flex items-center justify-between gap-4 py-3 border-b border-om-gray-100 last:border-0">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="hi.amount > 0 ? 'bg-[#D6F5EC]' : 'bg-om-gray-100'">
                <component :is="hi.amount > 0 ? Plus : Minus" :size="15" :class="hi.amount > 0 ? 'text-[#2CC896]' : 'text-om-gray-500'" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-om-gray-700 truncate">{{ hi.desc }}</p>
                <p class="text-xs text-om-gray-400">{{ hi.date }}</p>
              </div>
            </div>
            <span :class="['text-sm font-semibold shrink-0', hi.amount > 0 ? 'text-[#2CC896]' : 'text-om-gray-700']">{{ hi.amount > 0 ? '+' : '' }}{{ hi.amount.toLocaleString() }}</span>
          </div>
        </div>
      </Modal>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Info, History, Plus, Minus, LayoutGrid, ArrowUpRight } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Modal from '../components/shared/Modal.vue'

defineEmits(['menu-click'])

const credits = { available: 2700, total: 5000 }
const creditsResetDate = '2026-07-11'
const clPlan = { price: '$1,656 / year' }

const meters = [
  { label: 'Pageviews', value: '0', unit: '/ 20,000', pct: 0, barClass: 'bg-[#7C93E8]', sub: 'Resets 2026-07-11' },
  { label: 'Active sites', value: '1', unit: '/ 2', pct: 50, barClass: 'bg-[#7C93E8]', sub: '1 of 2 sites used' },
  { label: 'Conversion Lift visitors', value: '31,200', unit: '/ 50,000', pct: 62, barClass: 'bg-om-orange-400', sub: 'This month · resets 2026-07-11' },
  { label: 'Conversion Lift credits', value: '2,700', unit: 'available', pct: 46, barClass: 'bg-om-orange-400', sub: '2,300 / 5,000 used · resets 2026-07-11', action: true },
]

const masterFeatures = ['Custom amount of pageview', 'Unlimited domains', 'Unlimited campaigns']

const historyOpen = ref(false)
const creditHistory = [
  { date: 'Jun 14, 2026', desc: 'AI image generation · Don Papa Baroko rum', amount: -40 },
  { date: 'Jun 12, 2026', desc: 'SPPO – Benefit List · 33 products', amount: -33 },
  { date: 'Jun 10, 2026', desc: 'Credit purchase', amount: 2000 },
  { date: 'Jun 6, 2026', desc: 'AI lifestyle image · batch run', amount: -120 },
  { date: 'Jun 2, 2026', desc: 'SPPO3 – USP · 100 products', amount: -100 },
  { date: 'Jun 1, 2026', desc: 'Monthly credit allocation', amount: 5000 },
]
</script>
