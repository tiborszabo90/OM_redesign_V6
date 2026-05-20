<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-5">Hi Csaba</h1>

        <!-- Onboarding Checklist -->
        <div class="space-y-3 mb-10">
          <!-- Step 1: Create first campaign -->
          <Accordion
            title="Create your first campaign"
            :open="openStep === 0"
            @toggle="openStep = openStep === 0 ? null : 0"
            icon-size="w-6 h-6"
            icon-bg="bg-[#2CC896]"
          >
            <template #icon>
              <Check :size="14" :stroke-width="3.5" class="text-white scale-75" />
            </template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~10 min</span>
            </template>
            <!-- Content -->
            <div class="flex gap-6 pt-2 -ml-6">
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-bold text-om-gray-700 leading-snug mb-3">Choose from recommended<br>campaigns for Reflexshop</h3>
                <p class="text-base text-om-gray-500 mb-6">Based on your answers, we identified the most suitable campaigns for you.</p>
                <Button variant="primary" size="md" class="self-start" @click="$emit('menu-click', 'wizard-recommendation')">Show recommendations</Button>
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
            icon-size="w-6 h-6"
            icon-bg="bg-[#2CC896]"
          >
            <template #icon>
              <Check :size="14" :stroke-width="3.5" class="text-white scale-75" />
            </template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~2 min</span>
            </template>
            <div class="flex items-stretch gap-6 -ml-6">
              <div class="flex-1 py-2 pr-96">
                <p class="text-base text-om-gray-500 mb-5">Connect your website to OptiMonk and let us make the most of your online presence.</p>
                <Button variant="primary" size="md" class="self-start">Connect my website</Button>
              </div>
              <div class="absolute top-4 right-0 bottom-4 flex items-stretch -translate-x-32">
                <MeditatingPersonSvg class="h-full w-auto" />
              </div>
            </div>
          </Accordion>

          <!-- Step 3: Activate your first campaign -->
          <Accordion
            title="Activate your first campaign"
            :open="openStep === 2"
            @toggle="openStep = openStep === 2 ? null : 2"
            icon-size="w-6 h-6"
            icon-bg="bg-[#2CC896]"
          >
            <template #icon>
              <Check :size="14" :stroke-width="3.5" class="text-white scale-75" />
            </template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~1 min</span>
            </template>
            <div class="flex items-stretch gap-6 -ml-6">
              <div class="flex-1 py-2 pr-96">
                <p class="text-base text-om-gray-500 mb-5">Activate or schedule your very first campaign to boost conversions.</p>
                <Button variant="primary" size="md" class="self-start" @click="$emit('menu-click', 'campaign-page-with-review')">Activate campaign</Button>
              </div>
              <div class="absolute top-2 right-0 bottom-2 flex items-stretch -translate-x-44">
                <img src="/monk-on.svg" alt="" class="h-full w-auto" />
              </div>
            </div>
          </Accordion>

          <!-- Step 4: Setup check -->
          <Accordion
            title="Setup check"
            :open="openStep === 3"
            @toggle="openStep = openStep === 3 ? null : 3"
            icon-size="w-6 h-6"
            icon-bg="bg-transparent border-2 border-om-gray-300"
          >
            <template #icon></template>
            <template #meta>
              <span class="text-sm text-om-gray-400">~1 min</span>
            </template>
            <div class="flex items-stretch gap-6 -ml-6">
              <div class="flex-1 py-2 pr-96">
                <p class="text-xl font-bold text-om-gray-700 mb-3">Your first campaign is live!</p>
                <p class="text-base text-om-gray-500 mb-6">Your code has been successfully installed and your first campaign is live!<br>Let us know if there's anything you need help with.</p>
                <div class="flex items-center gap-3">
                  <Button variant="primary" size="md" @click="$emit('navigate-to-review')">Everything's great</Button>
                  <Button variant="secondary" size="md">Contact support</Button>
                </div>
              </div>
              <div class="absolute top-8 right-0 bottom-8 flex items-stretch -translate-x-32">
                <img src="/monk-happy-white2.svg" alt="" class="h-full w-auto" />
              </div>
            </div>
          </Accordion>
        </div>

        <!-- Domain Selector + Heartbeat -->
        <div class="flex items-center gap-4 mb-5">
          <div class="w-56">
            <Dropdown
              v-model="selectedDomain"
              :options="domains"
              placeholder="Select domain"
            >
              <template #icon>
                <img src="/demos/telekom/logo.png" alt="Domain" class="w-5 h-5 rounded-full object-cover" />
              </template>
              <template #selected="{ label }">
                <span class="flex items-center gap-2.5 truncate">
                  <span class="truncate">{{ label }}</span>
                  <span
                    v-if="domainStatuses[label]"
                    :class="[
                      'inline-block w-1.5 h-1.5 rounded-full shrink-0',
                      domainStatuses[label] === 'green' ? 'bg-emerald-500' : 'bg-[#E4252D]'
                    ]"
                  ></span>
                </span>
              </template>
              <template #option="{ option }">
                <span class="flex items-center gap-2.5">
                  <span>{{ option.label }}</span>
                  <span
                    v-if="domainStatuses[option.value]"
                    :class="[
                      'inline-block w-1.5 h-1.5 rounded-full shrink-0',
                      domainStatuses[option.value] === 'green' ? 'bg-emerald-500' : 'bg-[#E4252D]'
                    ]"
                  ></span>
                </span>
              </template>
            </Dropdown>
          </div>
          <div class="relative">
            <HeartbeatIndicator
              :visitor-count="liveVisitors.length"
              :expanded="heartbeatOpen"
              @toggle="heartbeatOpen = !heartbeatOpen"
            />
            <div v-if="heartbeatOpen" class="absolute top-full left-0 mt-2 z-50 w-175">
              <HeartbeatPanel
                :open="heartbeatOpen"
                :visitors="liveVisitors"
                @close="heartbeatOpen = false"
                @visitor-click="(v) => $emit('visitor-click', v)"
              />
            </div>
          </div>
        </div>

        <!-- Performance chart + Father's Day promo -->
        <div class="grid grid-cols-1 min-[1100px]:grid-cols-[3fr_1fr] gap-5 mb-10 items-stretch">
          <!-- Chart card -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] px-5 flex flex-col">
            <div class="performance-chart-tabs">
              <button
                v-for="tab in performanceTabs"
                :key="tab.id"
                type="button"
                @click="performanceActiveTab = tab.id"
                :class="['performance-chart-tab', { active: performanceActiveTab === tab.id }]"
              >
                <div class="performance-chart-tab-title">{{ tab.title }}</div>
                <div class="performance-chart-stat">
                  <div class="performance-chart-value">{{ tab.value }}</div>
                  <div :class="['performance-chart-change', tab.isPositive ? 'positive' : 'negative']">
                    <TrendingUp v-if="tab.isPositive" :size="14" />
                    <TrendingDown v-else :size="14" />
                    {{ tab.change }}
                  </div>
                </div>
              </button>
            </div>
            <div class="flex-1">
              <VueApexCharts
                :key="performanceActiveTab"
                type="area"
                height="280"
                :options="performanceChartOptions"
                :series="performanceChartSeries"
              />
            </div>
          </div>

          <!-- Father's Day promo card -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 flex flex-col">
            <div class="fathers-day-thumb"></div>
            <h3 class="text-[15px] font-semibold text-om-gray-700 mt-3 mb-1">Father's Day templates</h3>
            <p class="text-sm text-om-gray-500 leading-relaxed flex-1">Celebrate dads with high-converting Father's Day popup templates that help you increase engagement and drive sales.</p>
            <div class="flex justify-end mt-3">
              <Button variant="secondary" size="sm">Show templates</Button>
            </div>
          </div>
        </div>

        <!-- Promo Blocks -->
        <div v-if="showInviteBlock || showConsultBlock" class="flex gap-4 mb-10">
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
              <Button variant="secondary" size="sm">Invite your team</Button>
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
              <Button variant="secondary" size="sm">Book now</Button>
              <Button variant="ghost" size="sm" icon-only @click="showConsultBlock = false">
                <template #icon><X :size="16" /></template>
              </Button>
            </div>
          </div>
        </div>

        <!-- Campaigns Section -->
        <div class="mt-8 mb-24">
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
              <Button variant="primary" size="sm" @click="$emit('menu-click', 'home-onboarding-wizard')">New campaign</Button>
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
import { ref, reactive, computed, watch, onMounted, onUnmounted, markRaw } from 'vue'
import { UserPlus, Signpost, X, LayoutTemplate, Plug, Star, Check, Monitor, Smartphone, Tablet, TrendingUp, TrendingDown } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Accordion from '../components/shared/Accordion.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import MeditatingPersonSvg from '../components/illustrations/MeditatingPersonSvg.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'
import HeartbeatIndicator from '../components/shared/HeartbeatIndicator.vue'
import HeartbeatPanel from '../components/shared/HeartbeatPanel.vue'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

defineEmits(['task-created', 'menu-click', 'navigate-to-review', 'visitor-click'])

const handleLogoClick = () => {}

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

const openStep = ref(3)
const hoveredStar = ref(0)
const selectedStar = ref(0)

const showInviteBlock = ref(true)
const showConsultBlock = ref(true)

const selectedDomain = ref('reflexshop.hu')
const domains = ref([
  'reflexshop.hu',
  '+ Add new domain'
])
// Heartbeat status per domain — 'green' (healthy) | 'red' (no signal)
const domainStatuses = {
  'reflexshop.hu': 'green',
}
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

// ── Campaigns ──
const campaignTab = ref('top')

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
      { label: 'Impressions', value: '142' },
      { label: 'Submits', value: '8' },
      { label: 'Submit rate', value: '5.63%' },
      { label: 'Conversion uplift', value: '12.4%', trend: true },
    ],
  },
])

// ── Heartbeat ──
const heartbeatOpen = ref(false)

const visitorPool = [
  { flag: '🇺🇸', label: 'Anonymous visitor', city: 'New York', country: 'USA', currentPage: '/products/wireless-headphones', device: 'desktop', referrer: 'google', browser: 'Chrome', pagesViewed: 4, returning: false },
  { flag: '🇩🇪', label: 'Anonymous visitor', city: 'Berlin', country: 'Germany', currentPage: '/cart', device: 'mobile', referrer: 'instagram', browser: 'Safari', pagesViewed: 6, returning: true },
  { flag: '🇭🇺', label: 'Anonymous visitor', city: 'Budapest', country: 'Hungary', currentPage: '/products/yoga-mat', device: 'desktop', referrer: 'direct', browser: 'Chrome', pagesViewed: 2, returning: false },
  { flag: '🇬🇧', label: 'Anonymous visitor', city: 'London', country: 'UK', currentPage: '/checkout', device: 'desktop', referrer: 'google', browser: 'Firefox', pagesViewed: 8, returning: true },
  { flag: '🇫🇷', label: 'Anonymous visitor', city: 'Paris', country: 'France', currentPage: '/', device: 'mobile', referrer: 'facebook', browser: 'Safari', pagesViewed: 1, returning: false },
  { flag: '🇦🇹', label: 'Anonymous visitor', city: 'Vienna', country: 'Austria', currentPage: '/products/running-shoes', device: 'tablet', referrer: 'google', browser: 'Chrome', pagesViewed: 3, returning: false },
  { flag: '🇷🇴', label: 'Anonymous visitor', city: 'Bucharest', country: 'Romania', currentPage: '/products/smartwatch', device: 'mobile', referrer: 'tiktok', browser: 'Chrome', pagesViewed: 5, returning: true },
  { flag: '🇳🇱', label: 'Anonymous visitor', city: 'Amsterdam', country: 'Netherlands', currentPage: '/sale', device: 'desktop', referrer: 'email', browser: 'Chrome', pagesViewed: 3, returning: true },
  { flag: '🇵🇱', label: 'Anonymous visitor', city: 'Warsaw', country: 'Poland', currentPage: '/products/backpack', device: 'desktop', referrer: 'google', browser: 'Edge', pagesViewed: 2, returning: false },
  { flag: '🇮🇹', label: 'Anonymous visitor', city: 'Milan', country: 'Italy', currentPage: '/products/sunglasses', device: 'mobile', referrer: 'instagram', browser: 'Safari', pagesViewed: 7, returning: true },
  { flag: '🇪🇸', label: 'Anonymous visitor', city: 'Madrid', country: 'Spain', currentPage: '/products/fitness-tracker', device: 'desktop', referrer: 'direct', browser: 'Chrome', pagesViewed: 4, returning: false },
  { flag: '🇸🇪', label: 'Anonymous visitor', city: 'Stockholm', country: 'Sweden', currentPage: '/about', device: 'tablet', referrer: 'facebook', browser: 'Safari', pagesViewed: 1, returning: false },
]

const durations = ['0:12', '0:34', '1:07', '1:45', '2:23', '3:01', '0:08', '0:55', '4:12', '2:50']
const deviceIconMap = { desktop: markRaw(Monitor), mobile: markRaw(Smartphone), tablet: markRaw(Tablet) }

let nextId = 1
function createVisitor(isNew = false) {
  const template = visitorPool[Math.floor(Math.random() * visitorPool.length)]
  return {
    ...template,
    id: nextId++,
    duration: durations[Math.floor(Math.random() * durations.length)],
    deviceIcon: deviceIconMap[template.device],
    pagesViewed: template.pagesViewed + Math.floor(Math.random() * 3),
    isNew,
  }
}

const liveVisitors = ref(Array.from({ length: 5 }, () => createVisitor(false)))

let heartbeatInterval = null
onMounted(() => {
  heartbeatInterval = setInterval(() => {
    const action = Math.random()
    if (action < 0.4 && liveVisitors.value.length < 12) {
      liveVisitors.value = [createVisitor(true), ...liveVisitors.value]
      const addedId = liveVisitors.value[0].id
      setTimeout(() => {
        const v = liveVisitors.value.find(x => x.id === addedId)
        if (v) v.isNew = false
      }, 3000)
    } else if (action < 0.65 && liveVisitors.value.length > 2) {
      const idx = Math.floor(Math.random() * liveVisitors.value.length)
      liveVisitors.value = liveVisitors.value.filter((_, i) => i !== idx)
    } else {
      const idx = Math.floor(Math.random() * liveVisitors.value.length)
      if (liveVisitors.value[idx]) {
        const newTemplate = visitorPool[Math.floor(Math.random() * visitorPool.length)]
        liveVisitors.value[idx].currentPage = newTemplate.currentPage
        liveVisitors.value[idx].duration = durations[Math.floor(Math.random() * durations.length)]
      }
    }
  }, 3000)
})
onUnmounted(() => {
  if (heartbeatInterval) clearInterval(heartbeatInterval)
})

// ── Performance chart (top block) ──
const performanceActiveTab = ref('impressions')

const performanceTabs = [
  { id: 'impressions', title: 'Impressions', value: '21,034', change: '-6%', isPositive: false },
  { id: 'conversion-rate', title: 'Conversion rate', value: '3.58%', change: '+1%', isPositive: true },
  { id: 'conversions', title: 'Conversions', value: '753', change: '-5%', isPositive: false },
]

const performanceDates = ['May 07, 26', 'May 08, 26', 'May 09, 26', 'May 10, 26', 'May 11, 26', 'May 12, 26']

const performanceData = {
  impressions: [2980, 3380, 3300, 3120, 3720, 1520],
  'conversion-rate': [3.20, 3.55, 3.62, 3.45, 3.80, 3.10],
  conversions: [122, 145, 138, 128, 168, 52],
}

const performanceConfig = {
  impressions: {
    name: 'Impressions',
    formatter: (v) => `${(v / 1000).toFixed(1)}K`,
    tooltipFormatter: (v) => Math.round(v).toLocaleString(),
  },
  'conversion-rate': {
    name: 'Conversion rate',
    formatter: (v) => `${v.toFixed(1)}%`,
    tooltipFormatter: (v) => `${v.toFixed(2)}%`,
  },
  conversions: {
    name: 'Conversions',
    formatter: (v) => Math.round(v),
    tooltipFormatter: (v) => Math.round(v).toLocaleString(),
  },
}

const performanceChartSeries = computed(() => [{
  name: performanceConfig[performanceActiveTab.value].name,
  data: performanceData[performanceActiveTab.value],
}])

const performanceChartOptions = computed(() => {
  const cfg = performanceConfig[performanceActiveTab.value]
  return {
    chart: { type: 'area', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2, colors: ['#ed5a29'] },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] },
      colors: ['#ed5a29'],
    },
    grid: {
      borderColor: '#f1f2f4',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: 'category',
      categories: performanceDates.map((d, i) => i === performanceDates.length - 1 ? '' : d),
      labels: { show: true, style: { colors: '#9ba2ad', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: { formatter: cfg.formatter, style: { colors: '#9ba2ad', fontSize: '12px' } },
    },
    tooltip: {
      enabled: true,
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const value = series[seriesIndex][dataPointIndex]
        const date = performanceDates[dataPointIndex]
        return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="color: #9ba2ad; font-weight: 400; font-size: 11px; margin-bottom: 4px;">${date}</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; background: #ed5a29; border-radius: 50%; display: inline-block;"></span>
            <span style="color: #505763; font-weight: 500;">${cfg.name}: ${cfg.tooltipFormatter(value)}</span>
          </div>
        </div>`
      },
    },
    markers: { size: 0, hover: { size: 5 } },
  }
})
</script>

<style scoped>
/* Performance chart tabs */
.performance-chart-tabs {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
}

.performance-chart-tab {
  padding: 1rem 0.75rem;
  flex: 1;
  min-width: 120px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  background: none;
  transition: all 0.2s ease;
  text-align: left;
  margin-bottom: -1px;
}

.performance-chart-tab:hover {
  background: rgb(249, 250, 251);
}

.performance-chart-tab.active {
  border-bottom-color: #ed5a29;
}

.performance-chart-tab-title {
  font-size: 0.75rem;
  color: rgb(80, 87, 99);
  opacity: 0.8;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.performance-chart-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.performance-chart-value {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(35, 38, 42);
}

.performance-chart-change {
  font-size: 0.6875rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.performance-chart-change.positive {
  color: rgb(35, 158, 119);
}

.performance-chart-change.negative {
  color: rgb(228, 37, 45);
}

/* Father's Day promo thumbnail */
.fathers-day-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  background: #E5E7EB;
}
</style>
