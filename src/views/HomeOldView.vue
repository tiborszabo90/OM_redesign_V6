<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-5">Hi Csaba</h1>

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
            <Button variant="outline" size="sm">Invite your team</Button>
            <button @click="showInviteBlock = false" class="text-om-gray-400 hover:text-om-gray-600 transition-colors cursor-pointer shrink-0">
              <X :size="16" />
            </button>
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
            <Button variant="outline" size="sm">Book now</Button>
            <button @click="showConsultBlock = false" class="text-om-gray-400 hover:text-om-gray-600 transition-colors cursor-pointer shrink-0">
              <X :size="16" />
            </button>
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
              <Button variant="primary" size="sm" @click="$emit('new-campaign')">New campaign</Button>
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
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

defineEmits(['task-created', 'menu-click'])

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
