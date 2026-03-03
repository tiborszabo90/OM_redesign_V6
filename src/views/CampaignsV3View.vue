<template>
  <DashboardLayout active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-2xl font-semibold text-om-gray-700">Campaigns (32)</h1>
          <Button variant="primary" size="sm">New Campaign</Button>
        </div>

        <!-- Filters and Controls -->
        <div class="flex items-center justify-between mb-4">
          <!-- Left: Domain dropdown and Tab filters -->
          <div class="flex items-center gap-3">
            <!-- Domain dropdown -->
            <Dropdown
              v-model="selectedDomain"
              :options="domains"
              class="w-[240px]"
            >
              <template #icon>
                <div class="w-6 h-6 rounded-full overflow-hidden">
                  <img src="/telekom.png" alt="Telekom" class="w-full h-full object-cover" />
                </div>
              </template>
            </Dropdown>

            <!-- Tab filters -->
            <div class="flex items-center gap-2">
              <button class="chip px-3 py-2 rounded-lg bg-om-gray-100 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:bg-om-gray-200">
                Active
              </button>
              <button class="chip px-3 py-2 rounded-lg bg-om-gray-100 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:bg-om-gray-200">
                Archive
              </button>
              <button class="chip px-3 py-2 rounded-lg bg-om-gray-100 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:bg-om-gray-200">
                Service
              </button>
              <button class="chip w-9 h-9 flex items-center justify-center bg-om-gray-100 text-om-gray-700 rounded-lg cursor-pointer transition-all duration-200 ease-out hover:bg-om-gray-200">
                <Plus :size="16" />
              </button>
            </div>
          </div>

          <!-- Right: View controls and dropdown -->
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon-only
              :active="viewMode === 'grid'"
              @click="viewMode = viewMode === 'list' ? 'grid' : 'list'"
            >
              <template #icon><LayoutGrid :size="18" /></template>
            </Button>
            <Button variant="ghost" size="sm" icon-only>
              <template #icon><Search :size="18" /></template>
            </Button>
            <Button variant="ghost" size="sm" icon-only>
              <template #icon><ArrowUpDown :size="18" /></template>
            </Button>
            <Dropdown
              v-model="selectedTimeFilter"
              :options="timeFilterOptions"
              class="w-[240px]"
            >
              <template #icon>
                <Calendar :size="20" class="text-om-gray-600" />
              </template>
            </Dropdown>
          </div>
        </div>

        <!-- Campaign Cards List View -->
        <div v-if="viewMode === 'list'" class="space-y-4">
          <CampaignCard
            v-for="campaign in campaigns"
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
            @click="handleCampaignClick"
          />
        </div>

        <!-- Campaign Cards Grid View -->
        <div v-else class="grid grid-cols-3 gap-4">
          <CampaignCard
            v-for="campaign in campaigns"
            :key="campaign.id + '-grid'"
            :name="campaign.name"
            :domain="campaign.domain"
            :image="campaign.image"
            :active="campaign.active"
            @update:active="campaign.active = $event"
            :selected="campaign.selected"
            @update:selected="campaign.selected = $event"
            :metrics="campaign.gridMetrics || campaign.metrics"
            :last-updated="campaign.lastUpdated"
            variant="grid"
            @click="handleCampaignClick"
          />
        </div>
      </div>
    </template>
    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import { Plus, LayoutGrid, Search, Calendar, ArrowUpDown } from 'lucide-vue-next'
import Dropdown from '../components/shared/Dropdown.vue'
import Button from '../components/shared/Button.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'

const emit = defineEmits(['menu-click', 'navigate-to-campaign'])

const isChatOpen = ref(true)

const chatSuggestions = [
  'Which campaign has the best conversion rate?',
  'Show me campaigns with low impressions',
  'How can I improve my popup engagement?',
  'Which campaigns should I pause?',
  'How do I reduce cart abandonment?',
]

const chatAiResponses = {
  'Which campaign has the best conversion rate?': 'Your **Smart Discount Popup** is leading with an **8.37% submit rate** and **84.23% conversion uplift**. It\'s significantly outperforming your other active campaigns.\n\nWould you like tips on how to replicate this success across your other campaigns?',
  'Show me campaigns with low impressions': 'Based on your current data, **Feedback Survey** has the lowest impressions with only **1,456 visitors** reached.\n\nThis is likely due to a narrow audience targeting rule. I\'d recommend reviewing the trigger settings and expanding the target URL conditions.',
  'How can I improve my popup engagement?': 'Here are the top strategies to boost engagement:\n\n**1. Timing** — Show your popup after 30–60 seconds or on exit intent, not immediately on page load.\n\n**2. Personalization** — Target by traffic source, device, or previous behavior.\n\n**3. Copy** — Use a clear value proposition and a single, specific CTA.\n\nWould you like me to audit a specific campaign?',
  'Which campaigns should I pause?': 'I\'d recommend reviewing **Feedback Survey** and **Welcome Back** — both have high impression counts but below-average conversion rates.\n\n**Feedback Survey** in particular has a **0.8% conversion rate**, well below your account average of **3.2%**. Pausing or reworking it could free up audience exposure for better-performing campaigns.',
  'How do I reduce cart abandonment?': 'Your **Cart Abandonment Stopper** campaign is already active. To improve it further:\n\n**1. Trigger earlier** — Show at 70% scroll on the cart page, not just on exit.\n**2. Offer a stronger incentive** — Free shipping converts better than % discounts.\n**3. Add urgency** — "Only 3 left in stock" messaging.\n\nWould you like me to suggest a specific template?',
}

const viewMode = ref('list')

const campaigns = reactive([
  {
    id: 'campaign1',
    name: 'Smart Discount Popup',
    domain: 'domain.com',
    image: '/SmartDiscountPopup.png',
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
    image: '/LuckyWheel.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Impressions', value: '1,456' },
      { label: 'Submits', value: '125' },
      { label: 'Submit rate', value: '8.37%' },
    ],
    gridMetrics: [
      { label: 'Impressions', value: '2,341' },
      { label: 'Submits', value: '187' },
      { label: 'Submit rate', value: '7.99%' },
      { label: 'Conversion uplift', value: '92.15%', trend: true },
    ],
  },
  {
    id: 'campaign3',
    name: 'Cart Abandonment Stopper',
    domain: 'domain.com',
    image: '/CartAbandonmentStopper.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Visitors', value: '1,456' },
      { label: 'Submits', value: '125' },
      { label: 'Submit rate', value: '8.37%' },
    ],
    gridMetrics: [
      { label: 'Impressions', value: '987' },
      { label: 'Submits', value: '74' },
      { label: 'Submit rate', value: '7.50%' },
      { label: 'Conversion uplift', value: '78.90%', trend: true },
    ],
  },
  {
    id: 'campaign4',
    name: 'Feedback Survey',
    domain: 'domain.com',
    image: '/FeedbackSurvey.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Visitors', value: '1,456' },
    ],
  },
])

const selectedDomain = ref('telekom.hu')
const domains = ['telekom.hu', 'myshop.com', 'example-store.com', 'demo-site.com', 'testsite.com']

const timeFilterOptions = [
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: '3months', label: 'Last 3 months' }
]
const selectedTimeFilter = ref(timeFilterOptions[0])

const handleLogoClick = () => {
  window.location.reload()
}

const handleCampaignClick = () => {
  emit('navigate-to-campaign')
}
</script>

