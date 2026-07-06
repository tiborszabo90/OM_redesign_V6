<template>
  <DashboardLayout active-menu-item="" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1500px] mx-auto pb-10 -mt-[10px]">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6">Subscription</h1>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
          <!-- Left: single unified plan card (Conversion Lift is part of the OptiMonk plan) -->
          <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6">
            <!-- Plan header -->
            <div class="flex items-start justify-between gap-4 mb-6">
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-om-gray-700">Conversion Lift</h2>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-semibold text-om-gray-700">{{ plan.total }} <span class="text-xs font-normal text-om-gray-400">/ year</span></p>
              </div>
            </div>

            <!-- Usage -->
            <div class="space-y-4 mb-4">
              <div v-for="m in meters" :key="m.label">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-om-gray-600">
                    {{ m.label }}<span v-if="m.reset" class="text-om-gray-400"> (resets {{ m.reset }})</span>
                  </span>
                  <span class="text-om-gray-500">{{ m.used }} / {{ m.total }}</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-[#7C93E8] rounded-full" :style="{ width: m.pct + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" @click="historyOpen = true">
                <template #icon><History :size="14" /></template>
                Credit history
              </Button>
              <Button variant="primary" size="sm">Buy credits</Button>
            </div>
          </div>

          <!-- Right: payment details -->
          <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6">
            <h2 class="text-base font-semibold text-om-gray-700 mb-6">Payment details</h2>
            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-sm text-om-gray-600 mb-1.5">Payment method</p>
                <p class="text-sm text-om-gray-700 flex items-center gap-2">
                  <span class="inline-flex items-center justify-center h-5 px-1.5 rounded bg-[#1A1F71] text-white text-[10px] font-bold tracking-wide">VISA</span>
                  <span class="font-semibold">471527******0932. Expiry date: 03/2029</span>
                </p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Edit</button>
            </div>
            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-sm text-om-gray-600 mb-1.5">Billing address</p>
                <p class="text-sm font-semibold text-om-gray-700">University of New England, Armidale, Australia</p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Edit</button>
            </div>
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-om-gray-600 mb-1.5">Next payment</p>
                <p class="text-sm font-semibold text-om-gray-700">Jun 11, 2027</p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Cancel subscription</button>
            </div>
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
            <p class="text-xs text-om-gray-400 mt-0.5">Resets to {{ credits.total.toLocaleString() }} credits on {{ creditsResetDate }}</p>
          </div>
          <Button variant="primary" size="sm">Buy credits</Button>
        </div>
        <div>
          <div v-for="(h, i) in creditHistory" :key="i" class="flex items-center justify-between gap-4 py-3 border-b border-om-gray-100 last:border-0">
            <div class="flex items-center gap-3 min-w-0">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="h.amount > 0 ? 'bg-[#D6F5EC]' : 'bg-om-gray-100'">
                <component :is="h.amount > 0 ? Plus : Minus" :size="15" :class="h.amount > 0 ? 'text-[#2CC896]' : 'text-om-gray-500'" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-om-gray-700 truncate">{{ h.desc }}</p>
                <p class="text-xs text-om-gray-400">{{ h.date }}</p>
              </div>
            </div>
            <span :class="['text-sm font-semibold shrink-0', h.amount > 0 ? 'text-[#2CC896]' : 'text-om-gray-700']">{{ h.amount > 0 ? '+' : '' }}{{ h.amount.toLocaleString() }}</span>
          </div>
        </div>
      </Modal>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Info, History, Plus, Minus } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Modal from '../components/shared/Modal.vue'

defineEmits(['menu-click'])

// One subscription, branded as Conversion Lift (OptiMonk is part of it).
const plan = {
  total: '$1,656',
}

// Usage across the whole plan. Reset cycles can differ per metric.
const meters = [
  { label: 'Active sites', reset: null, used: '1', total: '2', pct: 50 },
  { label: 'Visitors', reset: '2026-07-01', used: '31,200', total: '50,000', pct: 62 },
  { label: 'Conversion Lift credits', reset: '2026-07-01', used: '2,300', total: '5,000', pct: 46 },
]

const credits = { available: 2700, total: 5000 }
const creditsResetDate = '2026-07-01'

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
