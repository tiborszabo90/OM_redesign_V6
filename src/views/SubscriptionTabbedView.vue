<template>
  <DashboardLayout active-menu-item="" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1500px] mx-auto pb-10 -mt-[10px]">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-5">Subscription</h1>

        <!-- Product tabs -->
        <div class="flex items-center gap-1 border-b border-om-gray-100 mb-8">
          <button
            v-for="t in productTabs"
            :key="t.id"
            @click="tab = t.id"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors cursor-pointer',
              tab === t.id ? 'border-om-orange-500 text-om-orange-500' : 'border-transparent text-om-gray-500 hover:text-om-gray-700'
            ]"
          >
            <component :is="t.icon" :size="16" />
            {{ t.label }}
          </button>
        </div>

        <!-- ============ OptiMonk tab ============ -->
        <div v-if="tab === 'optimonk'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6">
              <h2 class="text-base font-semibold text-om-gray-700 mb-6">Essential 20 plan (annual)</h2>
              <div class="flex items-center justify-between text-sm mb-6">
                <span class="text-om-gray-600">Basic pageview (20,000 / month)</span>
                <span class="font-semibold text-om-gray-700">$228</span>
              </div>
              <div class="mb-5">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-om-gray-600">Total pageviews (reset on 2026-07-11)</span>
                  <span class="text-om-gray-500">0 / 20,000</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden"><div class="h-full bg-[#7C93E8] rounded-full" style="width: 0%"></div></div>
              </div>
              <div>
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-om-gray-600">Active sites</span>
                  <span class="text-om-gray-500">1 / 2</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden"><div class="h-full bg-[#7C93E8] rounded-full" style="width: 50%"></div></div>
              </div>
            </div>

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

          <h2 class="text-xl font-semibold text-om-gray-700 mb-3">Change Plan</h2>
          <div class="inline-flex items-center gap-1 p-1 rounded-full bg-om-orange-100 mb-5">
            <button @click="billing = 'annual'" :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer', billing === 'annual' ? 'bg-om-orange-500 text-white' : 'text-om-orange-500']">Annual (20% off)</button>
            <button @click="billing = 'monthly'" :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer', billing === 'monthly' ? 'bg-om-orange-500 text-white' : 'text-om-orange-500']">Monthly billing</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
            <div v-for="plan in plans" :key="plan.id" class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] flex flex-col">
              <div class="px-4 pt-6 pb-5 text-center border-b border-om-gray-100">
                <h3 class="text-lg font-bold text-om-gray-700 mb-2">{{ plan.name }}</h3>
                <p class="text-[13px] text-om-gray-500 leading-snug whitespace-pre-line">{{ plan.desc }}</p>
              </div>
              <div class="px-6 pt-6 pb-6 flex flex-col flex-1">
                <div class="text-center mb-5">
                  <div class="flex items-baseline justify-center gap-1">
                    <span class="text-3xl font-bold text-om-gray-800">{{ billing === 'annual' ? plan.priceYear : plan.priceMonthBig }}</span>
                    <span class="text-sm text-om-gray-500">/ {{ billing === 'annual' ? 'year' : 'month' }}</span>
                  </div>
                  <p v-if="billing === 'annual' && plan.priceMonthSub" class="text-sm text-om-gray-500 mt-1">{{ plan.priceMonthSub }} / month</p>
                  <p v-else class="text-sm text-transparent mt-1 select-none">.</p>
                </div>
                <div class="mb-5">
                  <p v-if="plan.pageviewFixed" class="text-center text-sm font-semibold text-om-gray-700 py-2">{{ plan.pageviewFixed }}</p>
                  <Dropdown v-else v-model="plan.pageview" :options="plan.pageviewOptions" size="default" />
                </div>
                <div class="space-y-2.5 flex-1">
                  <div v-for="(f, fi) in plan.features" :key="fi" class="flex items-center gap-2 text-sm text-om-gray-600">
                    <Check v-if="f.ok" :size="16" class="text-[#2CC896] shrink-0" />
                    <X v-else :size="16" class="text-om-gray-300 shrink-0" />
                    <span>{{ f.label }}</span>
                    <Info v-if="f.info" :size="15" class="text-om-gray-400 shrink-0" />
                  </div>
                </div>
                <div class="mt-6 flex justify-center">
                  <p v-if="plan.current" class="text-sm font-semibold text-om-gray-700">Current plan</p>
                  <Button v-else-if="plan.cta === 'Upgrade plan'" variant="primary">Upgrade plan</Button>
                  <Button v-else variant="secondary">{{ plan.cta }}</Button>
                </div>
              </div>
            </div>
          </div>
          <p class="text-sm text-om-gray-500">Switching from an existing plan? Don't worry, we'll save you the time-proportional price difference.</p>
        </div>

        <!-- ============ Conversion Lift tab ============ -->
        <div v-else>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- CL plan + credits -->
            <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6">
              <h2 class="text-base font-semibold text-om-gray-700 mb-6">Conversion Lift · {{ clPlan.period }} plan</h2>
              <div class="flex items-center justify-between text-sm mb-6">
                <span class="text-om-gray-600">{{ clPlan.visitors }}</span>
                <span class="font-semibold text-om-gray-700">{{ clPlan.price }}</span>
              </div>
              <div class="mb-5">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-om-gray-600">Visitors (reset on {{ creditsResetDate }})</span>
                  <span class="text-om-gray-500">{{ visitors.used.toLocaleString() }} / {{ visitors.total.toLocaleString() }}</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden"><div class="h-full bg-[#7C93E8] rounded-full" :style="{ width: visitorsUsedPct + '%' }"></div></div>
              </div>
              <div class="mb-2">
                <div class="flex items-center justify-between text-sm mb-2">
                  <span class="text-om-gray-600">Credits (reset on {{ creditsResetDate }})</span>
                  <span class="text-om-gray-500">{{ (credits.total - credits.available).toLocaleString() }} / {{ credits.total.toLocaleString() }}</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden"><div class="h-full bg-[#7C93E8] rounded-full" :style="{ width: creditsUsedPct + '%' }"></div></div>
              </div>
              <div class="flex items-center gap-2 mt-5">
                <Button variant="primary" size="sm">Buy credits</Button>
                <Button variant="ghost" size="sm" @click="historyOpen = true">
                  <template #icon><History :size="14" /></template>
                  Credit history
                </Button>
              </div>
            </div>

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

          <!-- Managed note (sales-led, no self-serve change) -->
          <div class="relative bg-om-orange-50 rounded-2xl px-10 py-9 overflow-hidden">
            <div class="max-w-[620px]">
              <h3 class="text-xl font-bold text-om-gray-800 leading-snug mb-3">Managed by our CRO team</h3>
              <p class="text-sm text-om-gray-600 leading-relaxed mb-5">Conversion Lift is set up and optimized together with you. To change your plan or traffic tier, talk to your account manager.</p>
              <div class="flex items-center gap-3">
                <Button variant="primary">Contact your account manager</Button>
                <a href="https://conversionlift.ai/" target="_blank" rel="noopener" class="flex items-center gap-1 text-sm font-medium text-om-orange-500 hover:text-om-orange-600">Learn more <ExternalLink :size="14" /></a>
              </div>
            </div>
            <img src="/monk-hi-user.svg" alt="" class="hidden lg:block absolute -bottom-10 right-12 h-56 w-auto" />
          </div>
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
import { ref, reactive } from 'vue'
import { Check, X, Info, History, Plus, Minus, ExternalLink, LayoutGrid, ArrowUpRight } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Modal from '../components/shared/Modal.vue'

defineEmits(['menu-click'])

const tab = ref('cl')
const productTabs = [
  { id: 'optimonk', label: 'OptiMonk', icon: LayoutGrid },
  { id: 'cl', label: 'Conversion Lift', icon: ArrowUpRight },
]

const billing = ref('annual')

const credits = { available: 2700, total: 5000 }
const creditsUsedPct = Math.round(((credits.total - credits.available) / credits.total) * 100)
const creditsResetDate = '2026-07-11'
const clPlan = { period: 'Annual', price: '$1,656 / year', visitors: '50,000 visitors / month' }

// Conversion Lift monthly traffic usage against the plan's visitor allowance.
const visitors = { used: 31200, total: 50000 }
const visitorsUsedPct = Math.round((visitors.used / visitors.total) * 100)

const historyOpen = ref(false)
const creditHistory = [
  { date: 'Jun 14, 2026', desc: 'AI image generation · Don Papa Baroko rum', amount: -40 },
  { date: 'Jun 12, 2026', desc: 'SPPO – Benefit List · 33 products', amount: -33 },
  { date: 'Jun 10, 2026', desc: 'Credit purchase', amount: 2000 },
  { date: 'Jun 6, 2026', desc: 'AI lifestyle image · batch run', amount: -120 },
  { date: 'Jun 2, 2026', desc: 'SPPO3 – USP · 100 products', amount: -100 },
  { date: 'Jun 1, 2026', desc: 'Monthly credit allocation', amount: 5000 },
]

const plans = reactive([
  { id: 'free', name: 'Free', desc: 'A simple way to get\nstarted with OptiMonk', priceYear: '$0', priceMonthBig: '$0', priceMonthSub: null, pageviewFixed: '10,000 pageviews / month', features: [{ label: 'Max. 1 domain', ok: true, info: true }, { label: 'All features', ok: true }, { label: 'Unlimited campaigns', ok: true }, { label: 'Unbranded', ok: false }], cta: 'Downgrade' },
  { id: 'essential', name: 'Essential', desc: 'For new brands that want to\nstart driving revenue with popups', priceYear: '$228', priceMonthBig: '$24', priceMonthSub: '$19', pageview: '20,000 pageviews / month', pageviewOptions: ['20,000 pageviews / month', '30,000 pageviews / month', '50,000 pageviews / month'], features: [{ label: 'Max. 2 domains', ok: true, info: true }, { label: 'All features', ok: true }, { label: 'Unlimited campaigns', ok: true }, { label: 'Unbranded', ok: true }], current: true },
  { id: 'growth', name: 'Growth', desc: 'For fast-growing brands\nto maximize sales and subscribers', priceYear: '$828', priceMonthBig: '$86', priceMonthSub: '$69', pageview: '100,000 pageviews / month', pageviewOptions: ['100,000 pageviews / month', '150,000 pageviews / month', '200,000 pageviews / month'], features: [{ label: 'Max. 4 domains', ok: true, info: true }, { label: 'All features', ok: true }, { label: 'Unlimited campaigns', ok: true }, { label: 'Unbranded', ok: true }], cta: 'Upgrade plan' },
  { id: 'premium', name: 'Premium', desc: 'Full solution for\nhigh-performance brands', priceYear: '$2,148', priceMonthBig: '$224', priceMonthSub: '$179', pageview: '500,000 pageviews / month', pageviewOptions: ['500,000 pageviews / month', '750,000 pageviews / month', '1,000,000 pageviews / month'], features: [{ label: 'Max. 10 domains', ok: true, info: true }, { label: 'All features', ok: true }, { label: 'Unlimited campaigns', ok: true }, { label: 'Unbranded', ok: true }], cta: 'Upgrade plan' },
])
</script>
