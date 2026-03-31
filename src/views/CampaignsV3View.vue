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
            v-for="campaign in pagedCampaigns"
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
            v-for="campaign in pagedCampaigns"
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

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6">
          <span class="text-sm text-om-gray-400">Showing {{ (page - 1) * perPage + 1 }} to {{ Math.min(page * perPage, campaigns.length) }} of {{ campaigns.length }} campaigns</span>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm" :disabled="page === 1" @click="page--">Previous</Button>
            <template v-for="p in totalPages" :key="p">
              <Button v-if="p <= 3 || p === totalPages" variant="ghost" size="sm" :active="p === page" @click="page = p">{{ p }}</Button>
              <span v-else-if="p === 4 && totalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
            </template>
            <Button variant="ghost" size="sm" :disabled="page === totalPages" @click="page++">Next</Button>
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
import { ref, reactive, computed, watch } from 'vue'
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
  {
    id: 'campaign5', name: 'Welcome Back Popup', domain: 'domain.com', image: '/campaigns/smart-discount-popup.png',
    active: true, selected: false, lastUpdated: '7 days ago',
    metrics: [{ label: 'Impressions', value: '2,891' }, { label: 'Submits', value: '203' }, { label: 'Submit rate', value: '7.02%' }],
  },
  {
    id: 'campaign6', name: 'Exit Intent Offer', domain: 'domain.com', image: '/campaigns/cart-abandonment-stopper.png',
    active: true, selected: false, lastUpdated: '3 days ago',
    metrics: [{ label: 'Impressions', value: '4,120' }, { label: 'Submits', value: '298' }, { label: 'Submit rate', value: '7.23%' }],
  },
  {
    id: 'campaign7', name: 'Newsletter Signup', domain: 'domain.com', image: '/campaigns/lucky-wheel.png',
    active: false, selected: false, lastUpdated: '21 days ago',
    metrics: [{ label: 'Impressions', value: '890' }, { label: 'Submits', value: '67' }, { label: 'Submit rate', value: '7.53%' }],
  },
  {
    id: 'campaign8', name: 'Free Shipping Bar', domain: 'domain.com', image: '/campaigns/feedback-survey.png',
    active: true, selected: false, lastUpdated: '1 day ago',
    metrics: [{ label: 'Impressions', value: '6,234' }, { label: 'Submits', value: '412' }, { label: 'Submit rate', value: '6.61%' }],
  },
  {
    id: 'campaign9', name: 'Black Friday Countdown', domain: 'domain.com', image: '/campaigns/smart-discount-popup.png',
    active: false, selected: false, lastUpdated: '45 days ago',
    metrics: [{ label: 'Impressions', value: '12,456' }, { label: 'Submits', value: '1,089' }, { label: 'Submit rate', value: '8.74%' }],
  },
  {
    id: 'campaign10', name: 'Seasonal Sale Banner', domain: 'domain.com', image: '/campaigns/cart-abandonment-stopper.png',
    active: true, selected: false, lastUpdated: '5 days ago',
    metrics: [{ label: 'Impressions', value: '3,567' }, { label: 'Submits', value: '245' }, { label: 'Submit rate', value: '6.87%' }],
  },
  {
    id: 'campaign11', name: 'Product Recommendation', domain: 'domain.com', image: '/image-with-badge/preview-1.png', imagePosition: 'top',
    active: true, selected: false, lastUpdated: '2 days ago',
    metrics: [{ label: 'Visitors', value: '5,210' }, { label: 'Add to cart', value: '389' }, { label: 'ATC rate', value: '7.47%' }],
  },
  {
    id: 'campaign12', name: 'Social Proof Popup', domain: 'domain.com', image: '/campaigns/lucky-wheel.png',
    active: true, selected: false, lastUpdated: '10 days ago',
    metrics: [{ label: 'Impressions', value: '1,890' }, { label: 'Submits', value: '156' }, { label: 'Submit rate', value: '8.25%' }],
  },
  {
    id: 'campaign13', name: 'Loyalty Reward Alert', domain: 'domain.com', image: '/campaigns/feedback-survey.png',
    active: false, selected: false, lastUpdated: '30 days ago',
    metrics: [{ label: 'Impressions', value: '756' }, { label: 'Submits', value: '42' }, { label: 'Submit rate', value: '5.56%' }],
  },
  {
    id: 'campaign14', name: 'Bundle Upsell Widget', domain: 'domain.com', image: '/campaigns/smart-discount-popup.png',
    active: true, selected: false, lastUpdated: '4 days ago',
    metrics: [{ label: 'Impressions', value: '2,345' }, { label: 'Submits', value: '178' }, { label: 'Submit rate', value: '7.59%' }],
  },
  {
    id: 'campaign15', name: 'Countdown Timer Bar', domain: 'domain.com', image: '/campaigns/cart-abandonment-stopper.png',
    active: true, selected: false, lastUpdated: '6 days ago',
    metrics: [{ label: 'Impressions', value: '4,567' }, { label: 'Submits', value: '312' }, { label: 'Submit rate', value: '6.83%' }],
  },
  {
    id: 'campaign16', name: 'Spin the Wheel V2', domain: 'domain.com', image: '/campaigns/lucky-wheel.png',
    active: true, selected: false, lastUpdated: '8 days ago',
    metrics: [{ label: 'Impressions', value: '3,210' }, { label: 'Submits', value: '289' }, { label: 'Submit rate', value: '9.00%' }],
  },
  {
    id: 'campaign17', name: 'VIP Early Access', domain: 'domain.com', image: '/campaigns/feedback-survey.png',
    active: false, selected: false, lastUpdated: '60 days ago',
    metrics: [{ label: 'Impressions', value: '1,120' }, { label: 'Submits', value: '95' }, { label: 'Submit rate', value: '8.48%' }],
  },
  {
    id: 'campaign18', name: 'Back in Stock Alert', domain: 'domain.com', image: '/campaigns/smart-discount-popup.png',
    active: true, selected: false, lastUpdated: '2 days ago',
    metrics: [{ label: 'Impressions', value: '1,789' }, { label: 'Submits', value: '134' }, { label: 'Submit rate', value: '7.49%' }],
  },
  {
    id: 'campaign19', name: 'Post-Purchase Survey', domain: 'domain.com', image: '/campaigns/feedback-survey.png',
    active: true, selected: false, lastUpdated: '12 days ago',
    metrics: [{ label: 'Impressions', value: '945' }, { label: 'Submits', value: '78' }, { label: 'Submit rate', value: '8.25%' }],
  },
  {
    id: 'campaign20', name: 'Holiday Gift Guide', domain: 'domain.com', image: '/campaigns/cart-abandonment-stopper.png',
    active: false, selected: false, lastUpdated: '90 days ago',
    metrics: [{ label: 'Impressions', value: '8,901' }, { label: 'Submits', value: '645' }, { label: 'Submit rate', value: '7.25%' }],
  },
  {
    id: 'campaign21', name: 'First Purchase Discount', domain: 'domain.com', image: '/campaigns/smart-discount-popup.png',
    active: true, selected: false, lastUpdated: '1 day ago',
    metrics: [{ label: 'Impressions', value: '5,678' }, { label: 'Submits', value: '423' }, { label: 'Submit rate', value: '7.45%' }],
  },
  {
    id: 'campaign22', name: 'Referral Program Popup', domain: 'domain.com', image: '/campaigns/lucky-wheel.png',
    active: true, selected: false, lastUpdated: '9 days ago',
    metrics: [{ label: 'Impressions', value: '2,100' }, { label: 'Submits', value: '168' }, { label: 'Submit rate', value: '8.00%' }],
  },
  {
    id: 'campaign23', name: 'Student Discount Offer', domain: 'domain.com', image: '/campaigns/feedback-survey.png',
    active: false, selected: false, lastUpdated: '35 days ago',
    metrics: [{ label: 'Impressions', value: '1,345' }, { label: 'Submits', value: '98' }, { label: 'Submit rate', value: '7.29%' }],
  },
  {
    id: 'campaign24', name: 'Mobile App Install', domain: 'domain.com', image: '/campaigns/cart-abandonment-stopper.png',
    active: true, selected: false, lastUpdated: '4 days ago',
    metrics: [{ label: 'Impressions', value: '3,890' }, { label: 'Submits', value: '267' }, { label: 'Submit rate', value: '6.86%' }],
  },
  {
    id: 'campaign25', name: 'Abandoned Browse Retarget', domain: 'domain.com', image: '/campaigns/smart-discount-popup.png',
    active: true, selected: false, lastUpdated: '6 days ago',
    metrics: [{ label: 'Impressions', value: '2,456' }, { label: 'Submits', value: '189' }, { label: 'Submit rate', value: '7.70%' }],
  },
  {
    id: 'campaign26', name: 'Cross-Sell Sidebar', domain: 'domain.com', image: '/image-with-badge/preview-1.png', imagePosition: 'top',
    active: true, selected: false, lastUpdated: '3 days ago',
    metrics: [{ label: 'Visitors', value: '4,100' }, { label: 'Add to cart', value: '310' }, { label: 'ATC rate', value: '7.56%' }],
  },
  {
    id: 'campaign27', name: 'Price Drop Notification', domain: 'domain.com', image: '/campaigns/lucky-wheel.png',
    active: false, selected: false, lastUpdated: '25 days ago',
    metrics: [{ label: 'Impressions', value: '678' }, { label: 'Submits', value: '51' }, { label: 'Submit rate', value: '7.52%' }],
  },
  {
    id: 'campaign28', name: 'Summer Collection Promo', domain: 'domain.com', image: '/campaigns/cart-abandonment-stopper.png',
    active: true, selected: false, lastUpdated: '2 days ago',
    metrics: [{ label: 'Impressions', value: '7,890' }, { label: 'Submits', value: '534' }, { label: 'Submit rate', value: '6.77%' }],
  },
  {
    id: 'campaign29', name: 'Wishlist Reminder', domain: 'domain.com', image: '/campaigns/feedback-survey.png',
    active: true, selected: false, lastUpdated: '11 days ago',
    metrics: [{ label: 'Impressions', value: '1,234' }, { label: 'Submits', value: '102' }, { label: 'Submit rate', value: '8.27%' }],
  },
  {
    id: 'campaign30', name: 'New Arrivals Teaser', domain: 'domain.com', image: '/campaigns/smart-discount-popup.png',
    active: true, selected: false, lastUpdated: '5 days ago',
    metrics: [{ label: 'Impressions', value: '3,456' }, { label: 'Submits', value: '256' }, { label: 'Submit rate', value: '7.41%' }],
  },
  {
    id: 'campaign31', name: 'Review Request Popup', domain: 'domain.com', image: '/campaigns/feedback-survey.png',
    active: false, selected: false, lastUpdated: '40 days ago',
    metrics: [{ label: 'Impressions', value: '890' }, { label: 'Submits', value: '72' }, { label: 'Submit rate', value: '8.09%' }],
  },
  {
    id: 'campaign32', name: 'Flash Sale Announcement', domain: 'domain.com', image: '/campaigns/cart-abandonment-stopper.png',
    active: true, selected: false, lastUpdated: '1 day ago',
    metrics: [{ label: 'Impressions', value: '9,012' }, { label: 'Submits', value: '678' }, { label: 'Submit rate', value: '7.52%' }],
  },
])

// Pagination
const page = ref(1)
const perPage = 20
const totalPages = computed(() => Math.ceil(campaigns.length / perPage))
const pagedCampaigns = computed(() => campaigns.slice((page.value - 1) * perPage, page.value * perPage))

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

