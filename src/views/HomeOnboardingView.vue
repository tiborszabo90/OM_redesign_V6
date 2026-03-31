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

        </div>

        <!-- Onboarding Checklist -->
        <div class="space-y-3 mb-5">
          <!-- Step 1: Create first campaign -->
          <Accordion
            title="Create your first campaign"
            :open="openStep === 0"
            @toggle="openStep = openStep === 0 ? null : 0"
          >
            <template #icon>
              <LayoutTemplate :size="20" class="text-om-orange-500" />
            </template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~10 min</span>
            </template>
            <!-- Content -->
            <div class="flex gap-6 pt-2">
              <!-- Left: wizard launcher -->
              <div class="flex flex-col justify-between flex-1 min-w-0 pl-13">
                <div>
                  <h3 class="text-2xl font-bold text-om-gray-700 leading-snug mb-3">Launch the<br>Popup Wizard</h3>
                  <p class="text-base text-om-gray-500 mb-5">Answer a few questions and get<br>personalized campaigns in minutes.</p>
                </div>
                <Button variant="primary" size="lg" class="self-start" @click="$emit('menu-click', 'home-onboarding-wizard')">Get started</Button>
              </div>

              <!-- Illustration -->
              <div class="flex items-center justify-center shrink-0 w-56">
                <img src="/monk-wizard.svg" alt="" class="w-48 h-48 object-contain" />
              </div>

              <!-- Divider -->
              <div class="flex flex-col items-center gap-2 self-stretch">
                <div class="flex-1 w-px bg-om-gray-200"></div>
                <span class="text-sm text-om-gray-400 italic">or</span>
                <div class="flex-1 w-px bg-om-gray-200"></div>
              </div>

              <!-- Right: quick links -->
              <div class="flex flex-col justify-around flex-1 min-w-0 gap-4">
                <div class="cursor-pointer group" @click="$emit('menu-click', 'templates')">
                  <p class="text-sm font-semibold text-om-orange-500 group-hover:underline">Browse templates ›</p>
                  <p class="text-xs text-om-gray-500 mt-0.5">Browse 300+ ready-made templates tailored to your business goals</p>
                </div>
                <div class="border-t border-om-gray-100"></div>
                <div class="cursor-pointer group" @click="$emit('menu-click', 'ab-test')">
                  <p class="text-sm font-semibold text-om-orange-500 group-hover:underline">Optimize your website ›</p>
                  <p class="text-xs text-om-gray-500 mt-0.5">Run A/B tests, personalize, and more</p>
                </div>
                <div class="border-t border-om-gray-100"></div>
                <div class="cursor-pointer group" @click="$emit('menu-click', 'tactics')">
                  <p class="text-sm font-semibold text-om-orange-500 group-hover:underline">Pick a proven Tactic ›</p>
                  <p class="text-xs text-om-gray-500 mt-0.5">Get inspired by 50+ proven tactics!</p>
                </div>
              </div>
            </div>
          </Accordion>

          <!-- Step 2: Install OptiMonk -->
          <Accordion
            title="Install OptiMonk"
            :open="openStep === 1"
            @toggle="openStep = openStep === 1 ? null : 1"
          >
            <template #icon>
              <Plug :size="20" class="text-om-orange-500" />
            </template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~2 min</span>
            </template>
            <div class="flex items-stretch gap-6">
              <div class="pl-13 flex-1 py-2 pr-96">
                <p class="text-base text-om-gray-500 mb-5">Connect your website to OptiMonk and let us make the most of your online presence.</p>
                <Button variant="primary" size="lg" class="self-start">Connect my website</Button>
              </div>
              <div class="absolute top-10 right-0 bottom-10 flex items-stretch -translate-x-20">
                <MeditatingPersonSvg class="h-full w-auto" />
              </div>
            </div>
          </Accordion>
        </div>

        <!-- Trend Chart Section (hidden) -->
        <div v-if="false" class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 px-5">
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
            <h2 class="text-lg font-semibold text-om-gray-700">Campaigns</h2>
            <Button variant="primary" size="sm" @click="$emit('menu-click', 'wizard')">New campaign</Button>
          </div>

          <!-- Skeleton rows -->
          <div class="relative bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] overflow-hidden">
            <svg viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg" class="w-full opacity-80">
              <!-- Row 1 -->
              <rect x="16" y="20" width="40" height="40" rx="8" fill="#E5E7EB"/>
              <rect x="68" y="24" width="160" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="68" y="42" width="100" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="340" y="24" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="340" y="42" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="500" y="24" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="500" y="42" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="680" y="26" width="60" height="16" rx="8" fill="#E5E7EB"/>
              <rect x="752" y="26" width="32" height="16" rx="8" fill="#F3F4F6"/>
              <!-- Divider -->
              <line x1="16" y1="74" x2="784" y2="74" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 2 -->
              <rect x="16" y="83" width="40" height="40" rx="8" fill="#E5E7EB"/>
              <rect x="68" y="87" width="140" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="68" y="105" width="110" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="340" y="87" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="340" y="105" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="500" y="87" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="500" y="105" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="680" y="89" width="60" height="16" rx="8" fill="#E5E7EB"/>
              <rect x="752" y="89" width="32" height="16" rx="8" fill="#F3F4F6"/>
              <!-- Divider -->
              <line x1="16" y1="137" x2="784" y2="137" stroke="#F3F4F6" stroke-width="1"/>
              <!-- Row 3 -->
              <rect x="16" y="146" width="40" height="40" rx="8" fill="#E5E7EB"/>
              <rect x="68" y="150" width="180" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="68" y="168" width="90" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="340" y="150" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="340" y="168" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="500" y="150" width="80" height="10" rx="5" fill="#E5E7EB"/>
              <rect x="500" y="168" width="50" height="8" rx="4" fill="#F3F4F6"/>
              <rect x="680" y="152" width="60" height="16" rx="8" fill="#E5E7EB"/>
              <rect x="752" y="152" width="32" height="16" rx="8" fill="#F3F4F6"/>
            </svg>
            <!-- Empty state overlay -->
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60">
              <LayoutGrid :size="40" class="text-om-gray-300" />
              <p class="text-sm text-om-gray-400 text-center">Your campaigns will appear here<br>once you've created your first one.</p>
            </div>
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
import { ref, computed, reactive, watch } from 'vue'
import { TrendingUp, TrendingDown, Target, Calendar, UserPlus, Signpost, X, LayoutTemplate, LayoutGrid, Zap, Plug } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Accordion from '../components/shared/Accordion.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import MeditatingPersonSvg from '../components/illustrations/MeditatingPersonSvg.vue'
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
  'What campaign should I create first?',
  'How do I install OptiMonk?',
  'What results can I expect?',
  'Help me choose a use case',
]

const chatAiResponses = {
  'What campaign should I create first?': 'Great question! The best first campaign depends on your goal:\n\n- **Grow your email list** → try a Welcome Popup with a discount or lead magnet\n- **Reduce cart abandonment** → an Exit Intent popup works great\n- **Collect feedback** → a simple survey popup\n\nWould you like me to launch the campaign wizard for any of these?',
  'How do I install OptiMonk?': 'Installing OptiMonk takes about 2 minutes:\n\n1. **Copy your unique script** from the Install page\n2. **Paste it** into the `<head>` of your website\n3. Or use one of our **CMS plugins** (WordPress, Shopify, Wix, etc.)\n\nOnce installed, your campaigns will go live instantly. Want me to guide you to the install page?',
  'What results can I expect?': 'OptiMonk customers typically see:\n\n- **3–8% conversion rate** on email list building campaigns\n- **10–15% cart recovery** with exit intent popups\n- **2–5x ROI** within the first month\n\nResults vary by industry and traffic, but most users see their first conversions within 24 hours of launching their first campaign.',
  'Help me choose a use case': 'Here are the most popular use cases to start with:\n\n1. **Email list building** — capture leads with a discount or free resource\n2. **Cart abandonment** — recover visitors before they leave\n3. **Product promotion** — highlight offers to the right audience\n4. **Customer feedback** — learn what visitors think\n\nWhich one sounds most relevant to your business?',
}

const openStep = ref(0)

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
