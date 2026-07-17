<script setup>
import { computed } from 'vue'
import { state, products, subscriptionPlans } from '../store'
import { Settings, Check, CreditCard, Bell, Store, ArrowRight } from 'lucide-vue-next'

const liveCount = computed(() => products.filter(p => state.selected.includes(p.id)).length)
const plan = computed(() => subscriptionPlans.find(p => p.id === state.plan))
const quota = computed(() => plan.value ? plan.value.images : 10)

const notificationRows = [
  { key: 'emailOnFinish', title: 'Batch finished', desc: 'Email me when a generation batch is done.' },
  { key: 'weeklyDigest', title: 'Weekly performance summary', desc: 'Image CTR, assisted orders and revenue, every Monday.' },
]

function toggle(key) {
  state.settings[key] = !state.settings[key]
}

function goPlans() {
  state.screen = 'plans'
}

function goEnable() {
  state.screen = 'enable'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Page header -->
    <div class="flex items-center gap-2 mb-5">
      <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
        <Settings :size="15" class="text-white" />
      </span>
      <h1 class="text-lg font-bold text-[#1a1a1a]">Settings</h1>
    </div>

    <!-- Notifications -->
    <div class="pb-card p-5 mb-4">
      <div class="flex items-center gap-2 mb-1">
        <Bell :size="15" class="text-[#5548e0]" />
        <p class="font-semibold text-[#1a1a1a]">Notifications</p>
      </div>
      <p class="text-[12px] text-[#616161] mb-3">Sent to the store owner email.</p>
      <div class="divide-y divide-[#ececec]">
        <div v-for="row in notificationRows" :key="row.key" class="flex items-center gap-4 py-3">
          <div class="flex-1">
            <p class="font-medium text-[#1a1a1a] text-[13px]">{{ row.title }}</p>
            <p class="text-[12px] text-[#616161] mt-0.5">{{ row.desc }}</p>
          </div>
          <span
            class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer"
            :class="state.settings[row.key] ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
            @click="toggle(row.key)"
          >
            <span
              class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
              :class="state.settings[row.key] ? 'left-[18px]' : 'left-[2px]'"
            ></span>
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Plan & usage -->
      <div class="pb-card p-5 flex flex-col">
        <div class="flex items-center gap-2 mb-1">
          <CreditCard :size="15" class="text-[#5548e0]" />
          <p class="font-semibold text-[#1a1a1a]">Plan &amp; usage</p>
        </div>
        <div class="flex items-center justify-between mt-2 mb-1.5">
          <p class="text-[13px] font-semibold text-[#1a1a1a]">
            <template v-if="plan">{{ plan.name }} plan · {{ plan.price }}/{{ plan.per }}</template>
            <template v-else>Free trial</template>
          </p>
          <span class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5">
            {{ liveCount }} of {{ quota >= 999 ? 'unlimited' : quota }} used
          </span>
        </div>
        <div class="h-1.5 bg-[#ececec] rounded-full overflow-hidden mb-3">
          <div class="h-full bg-[#5548e0] rounded-full" :style="{ width: Math.min(liveCount / Math.min(quota, 36) * 100, 100) + '%' }"></div>
        </div>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">Billed through Shopify. Cancel anytime.</p>
        <button class="pb-btn-secondary self-start" @click="goPlans">
          {{ plan ? 'Manage plan' : 'See plans' }} <ArrowRight :size="12" />
        </button>
      </div>

      <!-- Theme embed -->
      <div class="pb-card p-5 flex flex-col">
        <div class="flex items-center gap-2 mb-1">
          <Store :size="15" class="text-[#5548e0]" />
          <p class="font-semibold text-[#1a1a1a]">Theme embed</p>
        </div>
        <div class="flex items-center justify-between mt-2 mb-1.5">
          <p class="text-[13px] font-semibold text-[#1a1a1a]">Picbear AI images · Horizon theme</p>
          <span
            class="text-[11px] font-semibold rounded-full px-2 py-0.5"
            :class="state.themeEnabled ? 'text-[#0c6b45] bg-[#d7f2e4]' : 'text-[#616161] bg-[#f1f1f1]'"
          >
            {{ state.themeEnabled ? 'On' : 'Off' }}
          </span>
        </div>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">
          The app embed is what shows your AI images on the storefront. Turning it off hides every image without deleting anything.
        </p>
        <button v-if="!state.themeEnabled" class="pb-btn-secondary self-start" @click="goEnable">
          Turn on in theme editor <ArrowRight :size="12" />
        </button>
        <p v-else class="text-[12px] font-semibold text-[#0c6b45] flex items-center gap-1.5">
          <Check :size="13" /> Active on your storefront
        </p>
      </div>
    </div>
  </div>
</template>
