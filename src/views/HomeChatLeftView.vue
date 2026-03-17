<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="true" :left-panel-open="isChatOpen" background-color="white" :show-ai-button="true" @ai-click="isChatOpen = !isChatOpen">
    <template #content>
      <!-- Review thank you screen -->
      <div v-if="showReviewScreen" class="flex items-center justify-center h-full">
        <div class="text-center max-w-sm px-8">
          <img src="/monk-medit.svg" alt="" class="mx-auto mb-4 h-36" />
          <h2 class="text-xl font-bold text-om-gray-700 mb-4">Share your feedback</h2>
          <p class="text-sm text-om-gray-500 leading-relaxed mb-6">Happy to hear you had a great experience!<br>As a small team we really value your opinion.<br>Please take a minute to leave us a review.</p>
          <div class="flex items-center justify-center gap-2 mb-4" @mouseleave="hoveredStar = 0">
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
          <Button variant="ghost" size="sm" @click="showReviewScreen = false">Maybe later</Button>
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
          <div class="flex items-center gap-1 shrink-0">
            <Button variant="outline" size="sm">Contact support</Button>
            <Button variant="primary" size="sm" @click="showReviewScreen = true">Everything's great</Button>
            <Button variant="ghost" size="sm" icon-only @click="showSuccessBox = false">
              <template #icon><X :size="16" /></template>
            </Button>
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

        <!-- Trend Chart Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 px-5">
          <div class="trend-chart-tabs">
            <div
              v-for="tab in trendTabs"
              :key="tab.id"
              :class="['trend-chart-tab', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <div class="trend-chart-tab-title">{{ tab.title }}</div>
              <div class="trend-chart-stat">
                <div class="trend-chart-value">{{ tab.value }}</div>
                <div :class="['trend-chart-change', tab.isPositive ? 'positive' : 'negative']">
                  <TrendingUp v-if="tab.isPositive" :size="14" />
                  <TrendingDown v-else :size="14" />
                  {{ tab.change }}
                </div>
              </div>
            </div>
          </div>
          <div class="chart-canvas">
            <VueApexCharts
              :key="activeTab"
              type="area"
              height="280"
              :options="chartOptions"
              :series="chartSeries"
            />
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

        <!-- Top Campaigns Section -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-om-gray-700">Top campaigns</h2>
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
    <template #left-panel>
      <ChatPanel v-model="isChatOpen" side="left" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
    <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { TrendingUp, TrendingDown, Target, Calendar, UserPlus, Signpost, X } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
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

defineEmits(['task-created', 'menu-click'])

const handleLogoClick = () => {
  // No-op for now
}

const isChatOpen = ref(false)

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

const activeTab = ref('conversion-rate')

const trendTabs = ref([
  { id: 'conversion-rate', title: 'Conversion Rate', value: '0.57%', change: '+14.0%', isPositive: true },
  { id: 'conversions', title: 'Conversions', value: '2.2K', change: '+8.3%', isPositive: true },
  { id: 'impressions', title: 'Impressions', value: '384.4K', change: '+12.5%', isPositive: true },
  { id: 'unique-visitors', title: 'Unique Visitors', value: '168.2K', change: '+6.7%', isPositive: true },
  { id: 'supported-orders', title: 'Supported Orders', value: '286', change: '-4.2%', isPositive: false },
  { id: 'supported-revenue', title: 'Supported Rev. (HUF)', value: '8,494,963', change: '+15.8%', isPositive: true }
])

// Chart data
const conversionRateData = [
  0.52, 0.48, 0.51, 0.49, 0.53, 0.50, 0.47, 0.52, 0.55, 0.54,
  0.51, 0.53, 0.56, 0.58, 0.57, 0.59, 0.61, 0.58, 0.56, 0.60,
  0.62, 0.59, 0.57, 0.61, 0.63, 0.60, 0.58, 0.61, 0.59, 0.57
]

const conversionsData = [
  62, 58, 65, 59, 68, 61, 57, 64, 71, 69,
  65, 68, 74, 79, 76, 81, 85, 80, 77, 84,
  88, 82, 79, 86, 91, 85, 81, 87, 83, 80
]

const impressionsData = [
  11234, 10987, 11456, 10876, 11789, 11123, 10765, 11345, 12123, 11876,
  11567, 11987, 12456, 12876, 12567, 13123, 13567, 12987, 12456, 13234,
  13678, 13123, 12876, 13456, 13987, 13456, 12987, 13567, 13234, 12876
]

const uniqueVisitorsData = [
  4876, 4654, 4987, 4723, 5123, 4865, 4587, 4923, 5287, 5134,
  5023, 5234, 5456, 5687, 5523, 5876, 6123, 5876, 5543, 5987,
  6234, 5943, 5687, 6087, 6345, 6123, 5876, 6187, 5987, 5723
]

const supportedOrdersData = [
  8, 7, 9, 7, 10, 8, 7, 9, 11, 10,
  9, 10, 11, 12, 11, 13, 14, 12, 11, 13,
  14, 12, 11, 13, 15, 13, 12, 14, 13, 12
]

const supportedRevenueData = [
  234567, 223456, 256789, 218765, 267890, 239876, 215678, 248765, 289765, 278654,
  265432, 279876, 298765, 312345, 301234, 323456, 345678, 321234, 298765, 334567,
  356789, 329876, 309876, 339876, 367890, 345678, 323456, 351234, 338765, 321234
]

const chartDates = [
  'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15',
  'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25',
  'Jan 26', 'Jan 27', 'Jan 28', 'Jan 29', 'Jan 30', 'Jan 31', 'Feb 1', 'Feb 2', 'Feb 3', 'Feb 4'
]

const getChartConfig = () => {
  const calculateRange = (data, paddingPercent = 15) => {
    const dataMin = Math.min(...data)
    const dataMax = Math.max(...data)
    const range = dataMax - dataMin
    const padding = range * (paddingPercent / 100)
    const rawMin = dataMin - padding
    const rawMax = dataMax + padding
    const rawRange = rawMax - rawMin
    const roughStep = rawRange / 4
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
    const normalized = roughStep / magnitude
    let niceStep
    if (normalized < 1.5) niceStep = 1
    else if (normalized < 3) niceStep = 2
    else if (normalized < 7) niceStep = 5
    else niceStep = 10
    niceStep *= magnitude
    const yMin = Math.floor(rawMin / niceStep) * niceStep
    const stepsNeeded = Math.ceil((rawMax - yMin) / niceStep)
    const steps = Math.max(4, stepsNeeded)
    const yMax = yMin + (niceStep * steps)
    return { yMin, yMax, tickAmount: steps }
  }

  const configs = {
    'conversion-rate': {
      data: conversionRateData,
      name: 'Conversion Rate',
      ...calculateRange(conversionRateData, 15),
      formatter: (value) => `${value.toFixed(1)}%`,
      tooltipFormatter: (value) => `${value.toFixed(2)}%`
    },
    'conversions': {
      data: conversionsData,
      name: 'Conversions',
      ...calculateRange(conversionsData, 15),
      formatter: (value) => Math.round(value),
      tooltipFormatter: (value) => Math.round(value)
    },
    'impressions': {
      data: impressionsData,
      name: 'Impressions',
      ...calculateRange(impressionsData, 15),
      formatter: (value) => `${(value / 1000).toFixed(1)}K`,
      tooltipFormatter: (value) => value.toLocaleString()
    },
    'unique-visitors': {
      data: uniqueVisitorsData,
      name: 'Unique Visitors',
      ...calculateRange(uniqueVisitorsData, 15),
      formatter: (value) => `${(value / 1000).toFixed(1)}K`,
      tooltipFormatter: (value) => value.toLocaleString()
    },
    'supported-orders': {
      data: supportedOrdersData,
      name: 'Supported Orders',
      ...calculateRange(supportedOrdersData, 15),
      formatter: (value) => Math.round(value),
      tooltipFormatter: (value) => Math.round(value)
    },
    'supported-revenue': {
      data: supportedRevenueData,
      name: 'Supported Revenue',
      ...calculateRange(supportedRevenueData, 15),
      formatter: (value) => `HUF ${(value / 1000).toFixed(0)}K`,
      tooltipFormatter: (value) => `HUF ${value.toLocaleString()}`
    }
  }
  return configs[activeTab.value] || configs['conversion-rate']
}

const chartSeries = computed(() => {
  const config = getChartConfig()
  return [{
    name: config.name,
    data: config.data
  }]
})

const chartOptions = computed(() => {
  const config = getChartConfig()
  return {
    chart: {
      type: 'area',
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#ed5a29']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      },
      colors: ['#ed5a29']
    },
    grid: {
      borderColor: '#f1f2f4',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      type: 'category',
      categories: [
        'Jan 6', '', '', 'Jan 9', '', '', 'Jan 12', '', '', 'Jan 15',
        '', '', 'Jan 18', '', '', 'Jan 21', '', '', 'Jan 24', '',
        '', 'Jan 27', '', '', 'Jan 30', '', '', 'Feb 2', '', 'Feb 4'
      ],
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        style: { colors: '#9ba2ad', fontSize: '11px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      min: config.yMin,
      max: config.yMax,
      tickAmount: config.tickAmount,
      labels: {
        formatter: config.formatter,
        style: { colors: '#9ba2ad', fontSize: '12px' }
      }
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex]
        const date = chartDates[dataPointIndex]
        return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="color: #9ba2ad; font-weight: 400; font-size: 11px; margin-bottom: 4px;">${date}, 2026</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; background: #ed5a29; border-radius: 50%; display: inline-block;"></span>
            <span style="color: #505763; font-weight: 500;">${config.name}: ${config.tooltipFormatter(value)}</span>
          </div>
        </div>`
      }
    },
    markers: {
      size: 0,
      hover: { size: 5 }
    }
  }
})
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

.trend-chart-tabs {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
  overflow-x: auto;
}

.trend-chart-tab {
  padding: 1.25rem 0.75rem;
  flex: 1;
  min-width: 140px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.25s ease;
  position: relative;
}

.trend-chart-tab:hover {
  background: rgb(249, 250, 251);
}

.trend-chart-tab.active {
  border-bottom-color: #ed5a29;
}

.trend-chart-tab-title {
  font-size: 0.75rem;
  color: rgb(80, 87, 99);
  opacity: 0.8;
  margin-bottom: 0.625rem;
  font-weight: 500;
}

.trend-chart-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.trend-chart-value {
  font-size: 1rem;
  font-weight: 500;
  color: rgb(80, 87, 99);
}

.trend-chart-change {
  font-size: 0.6875rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-chart-change.positive {
  color: rgb(35, 158, 119);
}

.trend-chart-change.negative {
  color: rgb(228, 37, 45);
}

.chart-canvas {
  padding: 0;
}

</style>
