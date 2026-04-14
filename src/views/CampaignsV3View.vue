<template>
  <DashboardLayout active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5 max-960:flex-col max-960:items-start max-960:gap-3">
          <h1 class="text-2xl max-960:text-xl font-semibold text-om-gray-700">Campaigns (32)</h1>
          <Button variant="primary" size="md" @click="$emit('new-campaign')">New Campaign</Button>
        </div>

        <!-- Filters and Controls -->
        <div class="flex items-center justify-between mb-4 max-960:flex-col max-960:items-start max-960:gap-3">
          <!-- Left: Domain dropdown and Tab filters -->
          <div class="flex items-center gap-3">
            <!-- Domain dropdown -->
            <Dropdown
              v-model="selectedDomain"
              :options="domains"
              style="width: 240px; min-width: 240px"
            >
              <template #icon>
                <div class="w-6 h-6 rounded-full overflow-hidden">
                  <img src="/demos/telekom/logo.png" alt="Telekom" class="w-full h-full object-cover" />
                </div>
              </template>
            </Dropdown>

            <!-- Search input -->
            <div class="relative">
              <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-400 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search campaigns..."
                class="pl-9 pr-3 h-10 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300 w-[240px]"
              />
            </div>

            <!-- Tab filters -->
            <div class="flex items-center gap-2">
              <button
                v-for="f in statusFilters"
                :key="f.value"
                @click="activeStatusFilter = f.value"
                :class="['chip px-3 h-10 flex items-center rounded-lg text-sm cursor-pointer transition-all duration-200 ease-out', activeStatusFilter === f.value ? 'bg-om-gray-200 text-om-gray-700 font-medium' : 'bg-om-gray-100 text-om-gray-700 hover:bg-om-gray-200']"
              >
                {{ f.label }}
              </button>
            </div>
          </div>

          <!-- Right: View controls and dropdown -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <Button variant="ghost" size="md" icon-only :class="sortOpen ? '!bg-[#505763]/10' : ''" @click="sortOpen = !sortOpen">
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
                  class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
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
              style="width: 240px; min-width: 240px"
            >
              <template #icon>
                <Calendar :size="20" class="text-om-gray-600" />
              </template>
            </Dropdown>
          </div>
        </div>

        <!-- Bulk Action Bar -->
        <transition
          enter-active-class="transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          enter-from-class="opacity-0 -translate-y-3 scale-y-95"
          enter-to-class="opacity-100 translate-y-0 scale-y-100"
          leave-active-class="transition-all duration-250 ease-[cubic-bezier(0.4,0,1,1)]"
          leave-from-class="opacity-100 translate-y-0 scale-y-100"
          leave-to-class="opacity-0 -translate-y-3 scale-y-95"
        >
          <div v-if="selectedCount > 0" class="flex items-center gap-3 mb-4 px-4 py-2.5 bg-om-gray-100 rounded-xl origin-top">
            <Checkbox :model-value="allSelected" :indeterminate="!allSelected && selectedCount > 0" @update:model-value="toggleSelectAll" />
            <span class="text-sm text-om-gray-600">{{ selectedCount }} selected</span>
            <div class="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="sm" @click="archiveSelected">
                <template #icon><Archive :size="16" /></template>
                Archive
              </Button>
              <Button variant="ghost" size="sm" @click="deleteSelected">
                <template #icon><Trash2 :size="16" /></template>
                Delete
              </Button>
            </div>
          </div>
        </transition>

        <!-- Campaign Cards List View -->
        <div class="space-y-4">
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
          >
            <template v-if="campaign.id === 'campaign-ppo'" #thumbnail>
              <div class="w-full h-full flex flex-col overflow-hidden bg-white px-2 pb-2">
                <div class="flex-1 bg-gray-200 rounded-sm"></div>
                <div class="py-2">
                  <img src="/SPP1.png" alt="Product Summary" class="w-full h-auto rounded-sm" />
                </div>
                <div class="flex gap-1.5 flex-1">
                  <div class="flex-1 bg-gray-200 rounded-sm"></div>
                  <div class="flex-1 bg-gray-200 rounded-sm"></div>
                  <div class="flex-1 bg-gray-200 rounded-sm"></div>
                </div>
              </div>
            </template>
          </CampaignCard>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6">
          <div class="flex items-center gap-2">
            <span class="text-sm text-om-gray-400">View</span>
            <Dropdown v-model="perPage" :options="perPageOptions" size="sm" class="w-[72px]" :drop-up="true" />
            <span class="text-sm text-om-gray-400">{{ (page - 1) * perPage + 1 }} - {{ Math.min(page * perPage, filteredCampaigns.length) }}/{{ filteredCampaigns.length }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm" icon-only :disabled="page === 1" @click="page--">
              <template #icon><ChevronLeft :size="18" /></template>
            </Button>
            <template v-for="p in totalPages" :key="p">
              <Button v-if="p <= 3 || p === totalPages" variant="ghost" size="sm" :active="p === page" @click="page = p">{{ p }}</Button>
              <span v-else-if="p === 4 && totalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
            </template>
            <Button variant="ghost" size="sm" icon-only :disabled="page === totalPages" @click="page++">
              <template #icon><ChevronRight :size="18" /></template>
            </Button>
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
import { Plus, Search, Calendar, ArrowUpDown, Check, ChevronLeft, ChevronRight, Trash2, Archive } from 'lucide-vue-next'
import Checkbox from '../components/shared/Checkbox.vue'
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
    name: 'Product Summary 1',
    domain: 'domain.com',
    image: '/image-with-badge/preview-1.png',
    imagePosition: 'top',
    active: true,
    selected: false,
    lastUpdated: '3 days ago',
    metrics: [
      { label: 'Visitors', value: '3,812' },
      { label: 'Orders', value: '294' },
      { label: 'Order rate', value: '7.71%' },
      { label: 'Conv. uplift', value: '62.50%', trend: true },
    ],
  },
  {
    id: 'campaign2',
    name: 'Lucky Wheel',
    domain: 'domain.com',
    image: '/campaigns/lucky-wheel.png',
    active: false,
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
const perPage = ref(30)
const perPageOptions = [
  { value: 30, label: '30' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]
const searchQuery = ref('')
const activeStatusFilter = ref('all')
const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archive', label: 'Archive' },
]
const filteredCampaigns = computed(() => {
  let result = [...campaigns]
  if (activeStatusFilter.value === 'active') result = result.filter(c => c.active)
  else if (activeStatusFilter.value === 'inactive') result = result.filter(c => !c.active)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(q))
  }
  return result
})
const totalPages = computed(() => Math.ceil(filteredCampaigns.value.length / perPage.value))
const pagedCampaigns = computed(() => filteredCampaigns.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

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
  { value: '7days', label: 'Last 7 days' },
  { value: '30days', label: 'Last 30 days' },
  { value: 'this-month', label: 'This month' },
  { value: 'prev-month', label: 'Previous month' },
  { value: 'custom', label: 'Custom period' }
]
const selectedTimeFilter = ref(timeFilterOptions[0])

const handleLogoClick = () => {
  window.location.reload()
}

const ppoThumbnailItems = [
  'Egyedülálló ír whiskey és vanília keverék',
  'Selymesen lágy, tökéletes jéggel',
  'Díjnyertes kézműves likőr',
]

const selectedCount = computed(() => campaigns.filter(c => c.selected).length)
const allSelected = computed(() => filteredCampaigns.value.length > 0 && filteredCampaigns.value.every(c => c.selected))
const toggleSelectAll = () => {
  const newVal = !allSelected.value
  filteredCampaigns.value.forEach(c => c.selected = newVal)
}
const archiveSelected = () => {
  campaigns.forEach(c => { if (c.selected) c.selected = false })
}
const deleteSelected = () => {
  const toDelete = campaigns.filter(c => c.selected).map(c => c.id)
  toDelete.forEach(id => {
    const idx = campaigns.findIndex(c => c.id === id)
    if (idx !== -1) campaigns.splice(idx, 1)
  })
}

const handleCampaignClick = (campaignId) => {
  if (campaignId === 'campaign-ppo') {
    emit('navigate-to-ppo-detail')
  } else {
    emit('navigate-to-campaign')
  }
}
</script>

