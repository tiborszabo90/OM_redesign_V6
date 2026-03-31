<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen" >
    <template #content>
      <!-- Review thank you screen -->
      <div v-if="showReviewScreen" class="flex items-center justify-center h-full bg-white">
        <div class="flex items-center gap-16 px-8">
          <img src="/review_img.png" alt="" class="h-80 shrink-0" />
          <div>
          <h2 class="text-xl font-bold text-om-gray-700 mb-4">Share your feedback</h2>
          <p class="text-sm text-om-gray-500 leading-relaxed mb-6">Happy to hear you had a great experience!<br>As a small team we really value your opinion.<br>Please take a minute to leave us a review.</p>
          <div class="flex items-center gap-2 mb-4" @mouseleave="hoveredStar = 0">
            <svg
              v-for="i in 5"
              :key="i"
              width="36" height="36" viewBox="0 0 24 24"
              :fill="i <= (hoveredStar || selectedStar) ? 'var(--color-om-yellow-400)' : 'none'"
              stroke="var(--color-om-yellow-400)"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              class="cursor-pointer transition-all duration-100"
              @mouseenter="hoveredStar = i"
              @click="selectedStar = i"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <Button variant="ghost" size="sm" class="text-om-gray-400" @click="showReviewScreen = false">Maybe later</Button>
          </div>
        </div>
      </div>

      <div v-else class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-4">Hi Csaba</h1>

        <!-- Onboarding success info box -->
        <div v-if="showSuccessBox" class="bg-white border border-om-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4 mb-5">
          <div class="w-9 h-9 rounded-full bg-[#2CC896]/15 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CC896" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-om-gray-700">Your first campaign is live!</p>
            <p class="text-sm text-om-gray-500">You've successfully launched your first campaign. Let us know if there's anything you need help with.</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm">Contact support</Button>
            <Button variant="primary" size="sm" @click="$emit('navigate-to-review')">Everything's great</Button>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="flex items-center justify-between mb-5 gap-4 max-960:flex-col max-960:items-start">
          <!-- Domain Selector -->
          <div class="w-56">
            <Dropdown
              v-model="selectedDomain"
              :options="domains"
              placeholder="Select domain"
            >
              <template #icon>
                <img src="/demos/telekom/logo.png" alt="Domain" class="w-5 h-5 rounded-full object-cover" />
              </template>
            </Dropdown>
          </div>

          <!-- Right-aligned filters -->
          <div class="flex items-center gap-3">
            <!-- Period Dropdown -->
            <div class="w-56">
              <Dropdown
                v-model="selectedPeriod"
                :options="periods"
                placeholder="Select period"
              >
                <template #icon>
                  <Calendar :size="20" class="text-om-gray-400" />
                </template>
              </Dropdown>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-6 gap-4 mb-5">
          <div
            v-for="tab in trendTabs"
            :key="tab.id"
            class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] px-5 py-4"
          >
            <div class="text-xs text-om-gray-400 font-medium mb-2">{{ tab.title }}</div>
            <div class="flex items-baseline gap-2">
              <div class="text-xl font-semibold text-om-gray-700">{{ tab.value }}</div>
              <div :class="['flex items-center gap-0.5 text-xs font-medium', tab.isPositive ? 'text-[#239E77]' : 'text-[#E4252D]']">
                <TrendingUp v-if="tab.isPositive" :size="12" />
                <TrendingDown v-else :size="12" />
                {{ tab.change }}
              </div>
            </div>
          </div>
        </div>

        <!-- Promo Blocks -->
        <div v-if="showInviteBlock || showConsultBlock" class="flex gap-4 mb-8">
          <!-- Invite block -->
          <div v-if="showInviteBlock" class="flex-1 bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-om-orange-100 flex items-center justify-center shrink-0">
              <UserPlus :size="20" class="text-om-orange-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-om-gray-700">Invite your teammates</p>
              <p class="text-xs text-om-gray-400 mt-0.5">Get more out of OptiMonk by inviting your team for free</p>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <Button variant="outline" size="sm">Invite your team</Button>
              <Button variant="ghost" size="sm" icon-only @click="showInviteBlock = false">
                <template #icon><X :size="16" /></template>
              </Button>
            </div>
          </div>

          <!-- Consultation block -->
          <div v-if="showConsultBlock" class="flex-1 bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-om-orange-100 flex items-center justify-center shrink-0">
              <Signpost :size="20" class="text-om-orange-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-om-gray-700">Free consultation / demo</p>
              <p class="text-xs text-om-gray-400 mt-0.5">Discover OptiMonk with expert guidance</p>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <Button variant="outline" size="sm">Book now</Button>
              <Button variant="ghost" size="sm" icon-only @click="showConsultBlock = false">
                <template #icon><X :size="16" /></template>
              </Button>
            </div>
          </div>
        </div>

        <!-- Campaigns Section -->
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-om-gray-700 mb-4">Campaigns</h2>
          <div class="flex items-center justify-between mb-4">
            <div class="flex">
              <button
                v-for="tab in ['Top', 'Latest']"
                :key="tab"
                @click="campaignTab = tab.toLowerCase()"
                :class="['px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer', campaignTab === tab.toLowerCase() ? 'text-om-orange-500' : 'text-om-gray-600 hover:text-om-gray-700']"
              >
                {{ tab }}
                <span v-if="campaignTab === tab.toLowerCase()" class="absolute bottom-0 left-0 right-0 h-0.5 bg-om-orange-500"></span>
              </button>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="sm">All campaigns</Button>
              <Button variant="primary" size="sm">New campaign</Button>
            </div>
          </div>

          <div class="space-y-4">
            <CampaignCard
              v-for="campaign in homeCampaigns"
              :key="campaign.id"
              :name="campaign.name"
              :domain="campaign.domain"
              :image="campaign.image"
              :active="campaign.active"
              @update:active="campaign.active = $event"
              :selected="campaign.selected"
              @update:selected="campaign.selected = $event"
              :metrics="campaign.metrics"
              :last-updated="campaign.lastUpdated"
              variant="list"
              @click="$emit('menu-click', 'campaigns')"
            />
          </div>
        </div>
      </div>
    </template>
    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
    <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { TrendingUp, TrendingDown, Target, Calendar, UserPlus, Signpost, X } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

defineEmits(['task-created', 'menu-click', 'navigate-to-review'])

const handleLogoClick = () => {
  // No-op for now
}

const isChatOpen = ref(false)
const campaignTab = ref('top')

const chatSuggestions = [
  'How is my account performing?',
  'Which campaigns need attention?',
  'How can I improve my conversion rate?',
  'Show me my top performing campaigns',
]

const chatAiResponses = {
  'How is my account performing?': 'Your account is performing well overall. Conversion rate is at **5.2%**, which is above your **3.2% average**. Impressions are up **12%** compared to last month.',
  'Which campaigns need attention?': 'Based on recent data, **2 campaigns** have below-average conversion rates and may benefit from optimization:\n\n- **Summer Sale 2025** — 1.8% CVR (avg: 3.2%)\n- **Exit Intent Popup** — 2.1% CVR\n\nWould you like suggestions for improving these?',
  'How can I improve my conversion rate?': 'Here are the top opportunities based on your current data:\n\n1. **A/B test your headlines** — campaigns with personalized headlines convert 2–3x better\n2. **Add exit intent triggers** to recover abandoning visitors\n3. **Optimize for mobile** — your mobile CVR is 40% lower than desktop',
  'Show me my top performing campaigns': 'Your top 3 campaigns this month:\n\n1. **Smart Discount** — 8.37% CVR\n2. **Black Friday 2025** — 5.2% CVR\n3. **Welcome Popup** — 4.1% CVR\n\nSmart Discount is significantly outperforming. Consider applying similar targeting to other campaigns.',
}

const showSuccessBox = ref(true)
const showReviewScreen = ref(false)
const hoveredStar = ref(0)
const selectedStar = ref(0)
const showInviteBlock = ref(true)
const showConsultBlock = ref(true)

// Domain selector
const selectedDomain = ref('reflexshop.hu')
const domains = ref([
  'reflexshop.hu',
  'telekom.hu',
  'shop.telekom.hu',
  'demo.optimonk.com',
  '+ Add new domain'
])
const showAddDomainModal = ref(false)
watch(selectedDomain, (val) => {
  if (val === '+ Add new domain') {
    selectedDomain.value = domains.value[0]
    showAddDomainModal.value = true
  }
})
const handleNewDomain = (newDomain) => {
  const insertIdx = domains.value.indexOf('+ Add new domain')
  domains.value.splice(insertIdx, 0, newDomain)
  selectedDomain.value = newDomain
}

// Goal dropdown
const selectedGoal = ref('Conversions (default)')
const goals = ref([
  'Conversions (default)',
  'browserTabReturn',
  'Buyers with cart under 100k HUF',
  'Add to cart',
  'Purchase'
])

// Period dropdown
const selectedPeriod = ref('Last 30 days')
const periods = ref([
  'Yesterday',
  'Last 7 days',
  'Last 30 days',
  'Last month',
  'Last year',
  'Custom period'
])

const homeCampaigns = reactive([
  {
    id: 'campaign1',
    name: 'Smart Discount Popup',
    domain: 'domain.com',
    image: '/campaigns/smart-discount-popup.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Impressions', value: '1,456' },
      { label: 'Submits', value: '125' },
      { label: 'Submit rate', value: '8.37%' },
      { label: 'Conversion uplift', value: '84.23%', trend: true },
    ],
  },
  {
    id: 'campaign2',
    name: 'Lucky Wheel',
    domain: 'domain.com',
    image: '/campaigns/lucky-wheel.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Impressions', value: '1,456' },
      { label: 'Submits', value: '125' },
      { label: 'Submit rate', value: '8.37%' },
    ],
  },
  {
    id: 'campaign3',
    name: 'Cart Abandonment Stopper',
    domain: 'domain.com',
    image: '/campaigns/cart-abandonment-stopper.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Visitors', value: '1,456' },
      { label: 'Submits', value: '125' },
      { label: 'Submit rate', value: '8.37%' },
    ],
  },
  {
    id: 'campaign4',
    name: 'Feedback Survey',
    domain: 'domain.com',
    image: '/campaigns/feedback-survey.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Visitors', value: '1,456' },
    ],
  },
])

const trendTabs = ref([
  { id: 'conversion-rate', title: 'Conversion Rate', value: '0.57%', change: '+14.0%', isPositive: true },
  { id: 'conversions', title: 'Conversions', value: '2.2K', change: '+8.3%', isPositive: true },
  { id: 'impressions', title: 'Impressions', value: '384.4K', change: '+12.5%', isPositive: true },
  { id: 'unique-visitors', title: 'Unique Visitors', value: '168.2K', change: '+6.7%', isPositive: true },
  { id: 'supported-orders', title: 'Supported Orders', value: '286', change: '-4.2%', isPositive: false },
  { id: 'supported-revenue', title: 'Supported Rev. (HUF)', value: '8,494,963', change: '+15.8%', isPositive: true }
])

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Filters Section */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filters-right {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}



</style>
