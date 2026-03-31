<template>
  <DashboardLayout active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5 max-960:flex-col max-960:items-start max-960:gap-3">
          <h1 class="text-2xl max-960:text-xl font-semibold text-om-gray-700">Campaigns (32)</h1>
          <Button variant="primary" size="sm" @click="$emit('new-campaign')">New Campaign</Button>
        </div>

        <!-- Filters and Controls -->
        <div class="flex items-center justify-between mb-4 max-960:flex-col max-960:items-start max-960:gap-3">
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
                  <img src="/demos/telekom/logo.png" alt="Telekom" class="w-full h-full object-cover" />
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
            <div class="relative">
              <Button variant="ghost" size="sm" icon-only :class="sortOpen ? '!bg-[#E3E5E8]' : ''" @click="sortOpen = !sortOpen">
                <template #icon><ArrowUpDown :size="18" /></template>
              </Button>
              <div v-if="sortOpen" class="fixed inset-0 z-10" @click="sortOpen = false" />
              <div
                v-if="sortOpen"
                class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[200px]"
              >
                <button
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  @click="sortBy = opt.value; sortOpen = false"
                  class="w-full text-left text-sm text-[#23262A] px-3 py-1.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                  :class="sortBy === opt.value ? 'bg-[#F1F2F4] font-medium' : ''"
                >
                  {{ opt.label }}
                  <Check v-if="sortBy === opt.value" :size="16" class="text-om-gray-500 shrink-0" />
                </button>
              </div>
            </div>
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
            :image-position="campaign.imagePosition || 'center'"
            :active="campaign.active"
            @update:active="campaign.active = $event"
            :selected="campaign.selected"
            @update:selected="campaign.selected = $event"
            :metrics="campaign.metrics"
            :last-updated="campaign.lastUpdated"
            variant="list"
            @click="handleCampaignClick(campaign.id)"
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
            :image-position="campaign.imagePosition || 'center'"
            :active="campaign.active"
            @update:active="campaign.active = $event"
            :selected="campaign.selected"
            @update:selected="campaign.selected = $event"
            :metrics="campaign.gridMetrics || campaign.metrics"
            :last-updated="campaign.lastUpdated"
            variant="grid"
            @click="handleCampaignClick(campaign.id)"
          />
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
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import { Plus, LayoutGrid, Search, Calendar, ArrowUpDown, Check } from 'lucide-vue-next'
import Dropdown from '../components/shared/Dropdown.vue'
import Button from '../components/shared/Button.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'

const emit = defineEmits(['menu-click', 'navigate-to-campaign', 'navigate-to-ppo-detail'])

const isChatOpen = ref(false)

const sortOpen = ref(false)
const sortBy = ref('conversion-desc')
const sortOptions = [
  { value: 'conversion-desc', label: '↓ Conversion rate' },
  { value: 'conversion-asc',  label: '↑ Conversion rate' },
  { value: 'impressions-desc', label: '↓ Impressions' },
  { value: 'impressions-asc',  label: '↑ Impressions' },
  { value: 'name-asc',         label: '↓ Name A–Z' },
  { value: 'name-desc',        label: '↑ Name Z–A' },
  { value: 'newest',           label: '↓ Newest first' },
  { value: 'oldest',           label: '↑ Oldest first' },
  { value: 'status',           label: 'Status' },
]

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
    image: '/campaigns/smart-discount-popup.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Impressions', value: '1,456' },
      { label: 'Submits', value: '125' },
      { label: 'Submit rate', value: '8.37%' },
      { label: 'Conv. uplift', value: '84.23%', trend: true },
    ],
  },
  {
    id: 'campaign-ppo',
    name: 'Product Page Optimizer',
    domain: 'domain.com',
    image: '/image-with-badge/preview-1.png',
    imagePosition: 'top',
    active: true,
    selected: false,
    lastUpdated: '3 days ago',
    metrics: [
      { label: 'Visitors', value: '3,812' },
      { label: 'Add to cart', value: '294' },
      { label: 'ATC rate', value: '7.71%' },
      { label: 'Conv. uplift', value: '62.50%', trend: true },
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
    image: '/campaigns/cart-abandonment-stopper.png',
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
    image: '/campaigns/feedback-survey.png',
    active: true,
    selected: false,
    lastUpdated: '14 days ago',
    metrics: [
      { label: 'Visitors', value: '1,456' },
    ],
  },
])

const selectedDomain = ref('telekom.hu')
const domains = ref(['telekom.hu', 'myshop.com', 'example-store.com', 'demo-site.com', 'testsite.com', '+ Add new domain'])
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

const timeFilterOptions = [
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: '3months', label: 'Last 3 months' }
]
const selectedTimeFilter = ref(timeFilterOptions[0])

const handleLogoClick = () => {
  window.location.reload()
}

const handleCampaignClick = (campaignId) => {
  if (campaignId === 'campaign-ppo') {
    emit('navigate-to-ppo-detail')
  } else {
    emit('navigate-to-campaign')
  }
}
</script>

