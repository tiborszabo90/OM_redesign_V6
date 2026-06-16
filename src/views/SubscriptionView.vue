<template>
  <DashboardLayout active-menu-item="" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1500px] mx-auto pb-10 -mt-[10px]">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-[22px]">Subscription</h1>

        <!-- Summary + Payment -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
          <!-- Current plan summary -->
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
              <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#7C93E8] rounded-full" style="width: 0%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-om-gray-600">Active sites</span>
                <span class="text-om-gray-500">1 / 2</span>
              </div>
              <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#7C93E8] rounded-full" style="width: 50%"></div>
              </div>
            </div>
          </div>

          <!-- Payment details -->
          <div class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6">
            <h2 class="text-base font-semibold text-om-gray-700 mb-6">Payment details</h2>

            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-xs text-om-gray-400 mb-1.5">Payment method</p>
                <p class="text-sm text-om-gray-700 flex items-center gap-2">
                  <span class="inline-flex items-center justify-center h-5 px-1.5 rounded bg-[#1A1F71] text-white text-[10px] font-bold tracking-wide">VISA</span>
                  <span class="font-semibold">471527******0932. Expiry date: 03/2029</span>
                </p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Edit</button>
            </div>

            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-xs text-om-gray-400 mb-1.5">Billing address</p>
                <p class="text-sm font-semibold text-om-gray-700">University of New England, Armidale, Australia</p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Edit</button>
            </div>

            <div class="flex items-start justify-between">
              <div>
                <p class="text-xs text-om-gray-400 mb-1.5">Next payment</p>
                <p class="text-sm font-semibold text-om-gray-700">Jun 11, 2027</p>
              </div>
              <button class="text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer shrink-0">Cancel subscription</button>
            </div>
          </div>
        </div>

        <!-- Change plan -->
        <h2 class="text-xl font-semibold text-om-gray-700 mb-3">Change Plan</h2>

        <!-- Billing toggle -->
        <div class="inline-flex items-center gap-1 p-1 rounded-full bg-om-orange-100 mb-5">
          <button
            @click="billing = 'annual'"
            :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer', billing === 'annual' ? 'bg-om-orange-500 text-white' : 'text-om-orange-500']"
          >Annual (20% off)</button>
          <button
            @click="billing = 'monthly'"
            :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer', billing === 'monthly' ? 'bg-om-orange-500 text-white' : 'text-om-orange-500']"
          >Monthly billing</button>
        </div>

        <!-- Plan cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          <div v-for="plan in plans" :key="plan.id" class="bg-white rounded-2xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] flex flex-col">
            <!-- Header -->
            <div class="px-4 pt-6 pb-5 text-center border-b border-om-gray-100">
              <h3 class="text-lg font-bold text-om-gray-700 mb-2">{{ plan.name }}</h3>
              <p class="text-[13px] text-om-gray-500 leading-snug whitespace-pre-line">{{ plan.desc }}</p>
            </div>

            <!-- Body -->
            <div class="px-6 pt-6 pb-6 flex flex-col flex-1">
              <!-- Price -->
              <div class="text-center mb-5">
                <div class="flex items-baseline justify-center gap-1">
                  <span class="text-3xl font-bold text-om-gray-800">{{ billing === 'annual' ? plan.priceYear : plan.priceMonthBig }}</span>
                  <span class="text-sm text-om-gray-500">/ {{ billing === 'annual' ? 'year' : 'month' }}</span>
                </div>
                <p v-if="billing === 'annual' && plan.priceMonthSub" class="text-sm text-om-gray-500 mt-1">{{ plan.priceMonthSub }} / month</p>
                <p v-else class="text-sm text-transparent mt-1 select-none">.</p>
              </div>

              <!-- Pageviews -->
              <div class="mb-5">
                <p v-if="plan.pageviewFixed" class="text-center text-sm font-semibold text-om-gray-700 py-2">{{ plan.pageviewFixed }}</p>
                <Dropdown v-else v-model="plan.pageview" :options="plan.pageviewOptions" size="default" />
              </div>

              <!-- Features -->
              <div class="space-y-2.5 flex-1">
                <div v-for="(f, fi) in plan.features" :key="fi" class="flex items-center gap-2 text-sm text-om-gray-600">
                  <Check v-if="f.ok" :size="16" class="text-[#2CC896] shrink-0" />
                  <X v-else :size="16" class="text-om-gray-300 shrink-0" />
                  <span>{{ f.label }}</span>
                  <Info v-if="f.info" :size="15" class="text-om-gray-400 shrink-0" />
                </div>
              </div>

              <!-- CTA -->
              <div class="mt-6 flex justify-center">
                <p v-if="plan.current" class="text-sm font-semibold text-om-gray-700">Current plan</p>
                <Button v-else-if="plan.cta === 'Upgrade plan'" variant="primary">Upgrade plan</Button>
                <Button v-else variant="secondary">{{ plan.cta }}</Button>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm text-om-gray-500 mb-10">Switching from an existing plan? Don't worry, we'll save you the time-proportional price difference.</p>

        <!-- Master banner -->
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
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Check, X, Info } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'

defineEmits(['menu-click'])

const billing = ref('annual')

const plans = reactive([
  {
    id: 'free', name: 'Free', desc: 'A simple way to get\nstarted with OptiMonk',
    priceYear: '$0', priceMonthBig: '$0', priceMonthSub: null,
    pageviewFixed: '10,000 pageviews / month',
    features: [
      { label: 'Max. 1 domain', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: false },
    ],
    cta: 'Downgrade',
  },
  {
    id: 'essential', name: 'Essential', desc: 'For new brands that want to\nstart driving revenue with popups',
    priceYear: '$228', priceMonthBig: '$24', priceMonthSub: '$19',
    pageview: '20,000 pageviews / month',
    pageviewOptions: ['20,000 pageviews / month', '30,000 pageviews / month', '50,000 pageviews / month'],
    features: [
      { label: 'Max. 2 domains', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: true },
    ],
    current: true,
  },
  {
    id: 'growth', name: 'Growth', desc: 'For fast-growing brands\nto maximize sales and subscribers',
    priceYear: '$828', priceMonthBig: '$86', priceMonthSub: '$69',
    pageview: '100,000 pageviews / month',
    pageviewOptions: ['100,000 pageviews / month', '150,000 pageviews / month', '200,000 pageviews / month'],
    features: [
      { label: 'Max. 4 domains', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: true },
    ],
    cta: 'Upgrade plan',
  },
  {
    id: 'premium', name: 'Premium', desc: 'Full solution for\nhigh-performance brands',
    priceYear: '$2,148', priceMonthBig: '$224', priceMonthSub: '$179',
    pageview: '500,000 pageviews / month',
    pageviewOptions: ['500,000 pageviews / month', '750,000 pageviews / month', '1,000,000 pageviews / month'],
    features: [
      { label: 'Max. 10 domains', ok: true, info: true },
      { label: 'All features', ok: true },
      { label: 'Unlimited campaigns', ok: true },
      { label: 'Unbranded', ok: true },
    ],
    cta: 'Upgrade plan',
  },
])

const masterFeatures = ['Custom amount of pageview', 'Unlimited domains', 'Unlimited campaigns']
</script>
