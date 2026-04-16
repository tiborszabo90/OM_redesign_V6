<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen || chatWideMode" :content-hidden="chatWideMode && !['usecase', 'template', 'branding', 'editor'].includes(welcomeFlowStep)">
    <template #content>
      <!-- Use case picker -->
      <div v-if="welcomeFlowStep === 'usecase'" class="w-full pt-8 px-8">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6">Based on your data, these would drive the most results</h1>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="card in usecaseCards"
            :key="card.id"
            class="cursor-pointer image-card rounded-xl border border-om-gray-200 overflow-hidden transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
            @click="handleUsecasePickFromContent(card)"
          >
            <div class="aspect-video overflow-hidden bg-om-peach-100">
              <img :src="card.image" :alt="card.label" class="w-full h-full object-cover object-top" />
            </div>
            <div class="px-3 py-2.5">
              <div class="text-sm font-semibold text-om-gray-700">{{ card.label }}</div>
              <div v-if="card.subtitle" class="text-xs text-om-gray-400 mt-0.5 leading-snug">{{ card.subtitle }}</div>
              <div v-if="card.reason" class="text-xs text-om-gray-500 mt-1.5 leading-snug italic">{{ card.reason }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Template picker -->
      <div v-else-if="welcomeFlowStep === 'template'" class="w-full pt-8 px-8">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6">{{ usecaseLabels[welcomeFlowData.usecase] }}</h1>
        <div class="grid grid-cols-3 gap-5">
          <div
            v-for="card in (templateCards[welcomeFlowData.usecase] || [])"
            :key="card.id"
            class="cursor-pointer group"
            @click="handleTemplatePickFromContent(card)"
          >
            <div class="aspect-[3/2] rounded-xl bg-om-gray-200 overflow-hidden" :class="selectedTemplateId === card.id ? 'ring-2 ring-om-gray-600' : ''">
            </div>
          </div>
        </div>
      </div>

      <!-- Branding picker -->
      <div v-else-if="welcomeFlowStep === 'branding' || welcomeFlowStep === 'editor'" class="w-full pt-8 px-8">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-2">Should we auto-personalize the branding?</h1>
        <p class="text-sm text-om-gray-400 mb-6">Choose how your popup should look</p>
        <div class="grid grid-cols-2 gap-5">
          <div
            v-for="card in brandingCards"
            :key="card.id"
            class="cursor-pointer group"
            @click="handleBrandingPickFromContent(card)"
          >
            <div class="aspect-[3/2] rounded-xl bg-om-gray-200 overflow-hidden" :class="selectedBrandingId === card.id ? 'ring-2 ring-om-gray-600' : ''">
            </div>
            <div class="text-sm font-medium text-om-gray-700 mt-2.5">{{ card.label }}</div>
          </div>
        </div>
      </div>

      <!-- Normal home content -->
      <div v-else class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-5">Hi Csaba</h1>

        <!-- Filters Section -->
        <div class="flex items-center justify-between mb-5 gap-4 max-960:flex-col max-960:items-start">
          <!-- Domain Selector + Heartbeat -->
          <div class="flex items-center gap-4">
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
                />
              </div>
            </div>
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
      <ChatPanel ref="chatPanelRef" v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" :message-matchers="chatMessageMatchers" :expanded-width="chatExpandedWidth" @action="handleChatAction" @toggle-expand="chatExpandedWidth = chatExpandedWidth > 0 ? 0 : 9999" />
    </template>
    <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, markRaw } from 'vue'
import { TrendingUp, TrendingDown, Target, Calendar, UserPlus, Signpost, X, Monitor, Smartphone, Tablet } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'
import HeartbeatIndicator from '../components/shared/HeartbeatIndicator.vue'
import HeartbeatPanel from '../components/shared/HeartbeatPanel.vue'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['task-created', 'menu-click'])

const handleLogoClick = () => {
  // No-op for now
}

const chatPanelRef = ref(null)
const isChatOpen = ref(false)
const selectedTemplateId = ref(null)
const selectedBrandingId = ref(null)
const chatExpandedWidth = ref(0)
const chatWideMode = computed(() => chatExpandedWidth.value > 0)

// Reset wide mode and flow when chat is closed
watch(isChatOpen, (open) => {
  if (!open) {
    chatExpandedWidth.value = 0
    welcomeFlowStep.value = null
    welcomeFlowData.value = { usecase: null, template: null, branded: null }
  }
})

const campaignTab = ref('top')

const chatSuggestions = [
  'I want to create a welcome popup',
  'How is my account performing?',
  'Which campaigns need attention?',
  'How can I improve my conversion rate?',
]

const chatAiResponses = {
  'I want to create a welcome popup': {
    message: 'Great choice! Here are some popular use cases:\n\n**1.** Smart Discount Popup — the most effective list-building formula\n**2.** Lucky Wheel — gamify list-building to increase engagement\n**3.** Newsletter Signup — build your list in a user-friendly way\n**4.** Cart Abandonment Stopper — offer a discount for cart abandoners\n\nWhich one would you like?',
    action: 'flow-welcome-usecase',
  },
  'How is my account performing?': 'Your account is performing well overall. Conversion rate is at **5.2%**, which is above your **3.2% average**. Impressions are up **12%** compared to last month.',
  'Which campaigns need attention?': 'Based on recent data, **2 campaigns** have below-average conversion rates and may benefit from optimization:\n\n- **Summer Sale 2025** — 1.8% CVR (avg: 3.2%)\n- **Exit Intent Popup** — 2.1% CVR\n\nWould you like suggestions for improving these?',
  'How can I improve my conversion rate?': 'Here are the top opportunities based on your current data:\n\n1. **A/B test your headlines** — campaigns with personalized headlines convert 2-3x better\n2. **Add exit intent triggers** to recover abandoning visitors\n3. **Optimize for mobile** — your mobile CVR is 40% lower than desktop',
}

// ── Welcome popup flow state ──
const welcomeFlowStep = ref(null) // null | 'usecase' | 'template' | 'branding' | 'done'
const welcomeFlowData = ref({ usecase: null, template: null, branded: null })

// ── Use case definitions ──
const usecaseLabels = {
  'smart-discount': 'Smart Discount Popup',
  'lucky-wheel': 'Lucky Wheel',
  'newsletter': 'Newsletter Signup Popup',
  'cart-abandonment': 'Cart Abandonment Stopper',
}

const usecaseCards = [
  { id: 'smart-discount', label: 'Smart Discount Popup', subtitle: 'The most effective list-building popup formula', image: '/usecases/SmartDiscountPopup.png', reason: 'Your new visitors have a 12% bounce rate — a welcome discount can convert them into subscribers.' },
  { id: 'lucky-wheel', label: 'Lucky Wheel', subtitle: 'Gamify list-building popups to increase new visitor engagement', image: '/usecases/Luckywheel.png', reason: 'Gamified popups get 2x more engagement — perfect for your high-traffic pages.' },
  { id: 'newsletter', label: 'Newsletter Signup Popup', subtitle: 'Build your newsletter list in a user friendly way', image: '/usecases/NewsletterSignupPopup.png', reason: 'Your email list grew only 3% last month — a signup popup can accelerate that.' },
  { id: 'cart-abandonment', label: 'Cart Abandonment Stopper', subtitle: 'Offer a discount for cart abandoners', image: '/usecases/CartAbandonmentStopper.png', reason: '68% of your carts are abandoned — an exit offer can recover up to 15% of them.' },
]

// ── Template cards per use case (grey placeholders) ──
const templateCards = {
  'smart-discount': [
    { id: 'sd-1', label: 'Classic Discount', description: '10% off with email capture' },
    { id: 'sd-2', label: 'Minimal Discount', description: 'Clean, simple form' },
    { id: 'sd-3', label: 'Image + Discount', description: 'Product image with coupon' },
    { id: 'sd-4', label: 'Countdown Discount', description: 'Urgency with timer' },
    { id: 'sd-5', label: 'Bold Offer', description: 'Full-width, high-impact design' },
    { id: 'sd-6', label: 'Welcome Gift', description: 'Friendly first-visit popup' },
    { id: 'sd-7', label: 'Seasonal Discount', description: 'Holiday-themed coupon' },
    { id: 'sd-8', label: 'VIP Discount', description: 'Exclusive offer for loyal visitors' },
    { id: 'sd-9', label: 'Flash Sale', description: 'Short-term deal with urgency' },
    { id: 'sd-10', label: 'Exit Offer', description: 'Last-chance discount on exit' },
    { id: 'sd-11', label: 'Mobile Discount', description: 'Optimized for phone visitors' },
    { id: 'sd-12', label: 'Two-step Discount', description: 'Teaser + full popup combo' },
  ],
  'lucky-wheel': [
    { id: 'lw-1', label: 'Classic Wheel', description: 'Spin-to-win with prizes' },
    { id: 'lw-2', label: 'Holiday Wheel', description: 'Seasonal themed design' },
    { id: 'lw-3', label: 'Minimal Wheel', description: 'Clean, modern look' },
    { id: 'lw-4', label: 'Bold Wheel', description: 'High contrast, eye-catching' },
    { id: 'lw-5', label: 'Neon Wheel', description: 'Vibrant, glowing colors' },
    { id: 'lw-6', label: 'Pastel Wheel', description: 'Soft, friendly tones' },
    { id: 'lw-7', label: 'Dark Wheel', description: 'Premium dark theme' },
    { id: 'lw-8', label: 'Fun Wheel', description: 'Playful, animated feel' },
    { id: 'lw-9', label: 'Elegant Wheel', description: 'Sophisticated, luxury look' },
    { id: 'lw-10', label: 'Retro Wheel', description: 'Vintage style design' },
    { id: 'lw-11', label: 'Summer Wheel', description: 'Bright, seasonal theme' },
    { id: 'lw-12', label: 'Mobile Wheel', description: 'Phone-optimized layout' },
  ],
  'newsletter': [
    { id: 'nl-1', label: 'Simple Signup', description: 'Email field with CTA' },
    { id: 'nl-2', label: 'Content Teaser', description: 'Preview what subscribers get' },
    { id: 'nl-3', label: 'Sidebar Form', description: 'Embedded style popup' },
    { id: 'nl-4', label: 'Full-screen Signup', description: 'Bold, immersive form' },
    { id: 'nl-5', label: 'Minimal Form', description: 'Clean single-field layout' },
    { id: 'nl-6', label: 'Image + Form', description: 'Photo alongside signup' },
    { id: 'nl-7', label: 'Welcome Newsletter', description: 'First-visit subscriber capture' },
    { id: 'nl-8', label: 'Blog Popup', description: 'Designed for blog readers' },
    { id: 'nl-9', label: 'Exit Newsletter', description: 'Capture on exit intent' },
    { id: 'nl-10', label: 'Floating Bar', description: 'Subtle sticky bar signup' },
    { id: 'nl-11', label: 'Two-field Form', description: 'Name + email capture' },
    { id: 'nl-12', label: 'Social Proof', description: 'With subscriber count' },
  ],
  'cart-abandonment': [
    { id: 'ca-1', label: 'Exit Discount', description: 'Last-chance coupon offer' },
    { id: 'ca-2', label: 'Cart Reminder', description: 'Show items left in cart' },
    { id: 'ca-3', label: 'Free Shipping', description: 'Shipping threshold nudge' },
    { id: 'ca-4', label: 'Countdown Exit', description: 'Timer + discount combo' },
    { id: 'ca-5', label: 'Product Spotlight', description: 'Highlight top cart item' },
    { id: 'ca-6', label: 'Social Proof Exit', description: 'Reviews + discount' },
    { id: 'ca-7', label: 'Minimal Reminder', description: 'Simple, non-intrusive' },
    { id: 'ca-8', label: 'Full-screen Exit', description: 'Bold, can\'t-miss offer' },
    { id: 'ca-9', label: 'Gift Exit', description: 'Free gift with purchase' },
    { id: 'ca-10', label: 'Bundle Saver', description: 'Bundle discount suggestion' },
    { id: 'ca-11', label: 'Mobile Exit', description: 'Phone-optimized exit popup' },
    { id: 'ca-12', label: 'Urgency Exit', description: 'Stock scarcity + timer' },
  ],
}

const usecaseListEN = 'Great choice! Here are some popular use cases:\n\n**1.** Smart Discount Popup — the most effective list-building formula\n**2.** Lucky Wheel — gamify list-building to increase engagement\n**3.** Newsletter Signup — build your list in a user-friendly way\n**4.** Cart Abandonment Stopper — offer a discount for cart abandoners\n\nWhich one would you like?'
const usecaseListHU = 'Szuper! Íme néhány népszerű use case:\n\n**1.** Smart Discount Popup — a leghatékonyabb lista-építő formula\n**2.** Lucky Wheel — játékosított feliratkozás\n**3.** Hírlevél feliratkozás — felhasználóbarát lista-építés\n**4.** Kosárelhagyás csökkentő — kedvezmény a távozóknak\n\nMelyiket választod?'

// ── Matchers per flow step ──
const chatMessageMatchers = computed(() => {
  const general = [
    { keywords: ['üdvözlő', 'popup'],   response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['welcome', 'popup'],    response: usecaseListEN, action: 'flow-welcome-usecase' },
    { keywords: ['üdvözlő', 'kampány'],  response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['welcome', 'campaign'], response: usecaseListEN, action: 'flow-welcome-usecase' },
    { keywords: ['popup', 'készít'],  response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['popup', 'szeretn'], response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['popup', 'csinál'], response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['popup', 'kell'],   response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['popup', 'létre'],  response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['create', 'popup'], response: usecaseListEN, action: 'flow-welcome-usecase' },
    { keywords: ['make', 'popup'],   response: usecaseListEN, action: 'flow-welcome-usecase' },
    { keywords: ['build', 'popup'],  response: usecaseListEN, action: 'flow-welcome-usecase' },
    { keywords: ['new', 'popup'],    response: usecaseListEN, action: 'flow-welcome-usecase' },
    { keywords: ['üdvözlő'],        response: usecaseListHU, action: 'flow-welcome-usecase' },
    { keywords: ['kampány'],         response: usecaseListHU, action: 'flow-welcome-usecase' },
  ]

  // ── Step 1: Use case selection (text-based, normal width) ──
  if (welcomeFlowStep.value === 'usecase') {
    const u = (id) => ({ response: `Great, **${usecaseLabels[id]}**! Let me show you some templates:`, action: `flow-welcome-template:${id}` })
    return [
      { keywords: ['smart discount'], ...u('smart-discount') },
      { keywords: ['discount'],  ...u('smart-discount') },
      { keywords: ['kedvezmény'],...u('smart-discount') },
      { keywords: ['kupon'],     ...u('smart-discount') },
      { keywords: ['1'],         ...u('smart-discount') },
      { keywords: ['lucky wheel'],  ...u('lucky-wheel') },
      { keywords: ['lucky'],     ...u('lucky-wheel') },
      { keywords: ['wheel'],     ...u('lucky-wheel') },
      { keywords: ['szerencse'], ...u('lucky-wheel') },
      { keywords: ['játék'],     ...u('lucky-wheel') },
      { keywords: ['2'],         ...u('lucky-wheel') },
      { keywords: ['newsletter'],...u('newsletter') },
      { keywords: ['signup'],    ...u('newsletter') },
      { keywords: ['hírlevél'],  ...u('newsletter') },
      { keywords: ['feliratkoz'],...u('newsletter') },
      { keywords: ['3'],         ...u('newsletter') },
      { keywords: ['cart'],      ...u('cart-abandonment') },
      { keywords: ['abandon'],   ...u('cart-abandonment') },
      { keywords: ['kosár'],     ...u('cart-abandonment') },
      { keywords: ['elhagyás'],  ...u('cart-abandonment') },
      { keywords: ['4'],         ...u('cart-abandonment') },
      ...general,
    ]
  }

  // ── Step 2: Template selection (visual cards, wide panel) ──
  if (welcomeFlowStep.value === 'template') {
    const cards = templateCards[welcomeFlowData.value.usecase] || []
    const t = (tplId) => ({ response: 'Should we **auto-personalize the branding**?', action: `flow-welcome-branding:${tplId}` })
    return [
      ...cards.map((card) => ({ keywords: [card.label.toLowerCase()], ...t(card.id) })),
      ...cards.map((card, i) => ({ keywords: [`${i + 1}`], ...t(card.id) })),
      ...general,
    ]
  }

  // ── Step 3: Branding choice (2 visual options) ──
  if (welcomeFlowStep.value === 'branding') {
    const b = (branded) => ({ response: brandingDoneResponse(branded), action: 'flow-welcome-editor' })
    return [
      { keywords: ['no'],       ...b(false) },
      { keywords: ['keep'],     ...b(false) },
      { keywords: ['original'], ...b(false) },
      { keywords: ['nem'],      ...b(false) },
      { keywords: ['eredeti'],  ...b(false) },
      { keywords: ['1'],        ...b(false) },
      { keywords: ['yes'],      ...b(true) },
      { keywords: ['branded'],  ...b(true) },
      { keywords: ['personali'],...b(true) },
      { keywords: ['igen'],     ...b(true) },
      { keywords: ['márká'],    ...b(true) },
      { keywords: ['2'],        ...b(true) },
      ...general,
    ]
  }

  // ── Step 4: Editor prompt ──
  if (welcomeFlowStep.value === 'editor') {
    return [
      { keywords: ['open editor'], response: 'Opening the editor now...', action: 'flow-welcome-open-editor' },
      { keywords: ['editor'],      response: 'Opening the editor now...', action: 'flow-welcome-open-editor' },
      { keywords: ['open'],        response: 'Opening the editor now...', action: 'flow-welcome-open-editor' },
      { keywords: ['continue'],    response: 'Opening the editor now...', action: 'flow-welcome-open-editor' },
      { keywords: ['tovább'],      response: 'Megnyitom az editort...', action: 'flow-welcome-open-editor' },
      { keywords: ['szerkeszt'],   response: 'Megnyitom az editort...', action: 'flow-welcome-open-editor' },
      ...general,
    ]
  }

  return general
})

// Branding option cards (grey placeholders)
const brandingCards = [
  { id: 'original', label: 'No, keep original style' },
  { id: 'branded',  label: 'Yes, use branded version' },
]

function brandingDoneResponse(branded) {
  welcomeFlowData.value.branded = branded
  return 'Your popup is almost ready! To fine-tune it, open the editor.'
}

const handleUsecasePickFromContent = (card) => {
  welcomeFlowData.value.usecase = card.id
  welcomeFlowStep.value = 'template'
  chatPanelRef.value?.pushMessage({ type: 'ai-success', message: `Use case: ${card.label}` })
}

const handleTemplatePickFromContent = (card) => {
  selectedTemplateId.value = card.id
  welcomeFlowData.value.template = card.id
  welcomeFlowStep.value = 'branding'
  chatPanelRef.value?.pushMessage({ type: 'ai-success', message: 'Template:' })
  setTimeout(() => {
    chatPanelRef.value?.pushMessage({ type: 'ai-images', message: '', cards: [card], hideLabels: true, skipUserMessage: true })
  }, 1000)
}

const handleBrandingPickFromContent = (card) => {
  selectedBrandingId.value = card.id
  welcomeFlowData.value.branded = card.id === 'branded'
  chatPanelRef.value?.pushMessage({ type: 'ai-success', message: `Branding: ${card.label}` })
  // Save chat and go to editor (wait for message to appear)
  setTimeout(() => {
    const chatMessages = chatPanelRef.value?.messages ? [...chatPanelRef.value.messages] : []
    welcomeFlowStep.value = null
    chatExpandedWidth.value = 0
    welcomeFlowData.value = { usecase: null, template: null, branded: null }
    emit('open-editor-with-chat', chatMessages)
  }, 1500)
}

const handleChatAction = (action) => {
  if (action === 'flow-welcome-usecase') {
    welcomeFlowStep.value = 'usecase'
    chatExpandedWidth.value = 0
  } else if (action.startsWith('flow-welcome-template:')) {
    welcomeFlowData.value.usecase = action.split(':')[1]
    welcomeFlowStep.value = 'template'
    // Shrink chat back — templates show in content area
    chatExpandedWidth.value = 0
  } else if (action.startsWith('flow-welcome-branding:')) {
    // From chat text input (fallback)
    welcomeFlowData.value.template = action.split(':')[1]
    welcomeFlowStep.value = 'branding'
    setTimeout(() => {
      chatPanelRef.value?.pushMessage({
        type: 'ai-images',
        message: '',
        cards: brandingCards,
      })
    }, 500)
  } else if (action === 'flow-welcome-editor') {
    welcomeFlowStep.value = 'editor'
    // Stay wide, inject a link-style message
    setTimeout(() => {
      chatPanelRef.value?.pushMessage({
        type: 'ai-action-link',
        message: 'Open Editor',
        action: 'flow-welcome-open-editor',
      })
    }, 500)
  } else if (action === 'flow-welcome-open-editor') {
    // Save chat messages before navigating
    const chatMessages = chatPanelRef.value?.messages ? [...chatPanelRef.value.messages] : []
    emit('open-editor-with-chat', chatMessages)
    welcomeFlowStep.value = null
    chatExpandedWidth.value = 0
    welcomeFlowData.value = { usecase: null, template: null, branded: null }
  }
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
const submitsData = [
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
  642, 612, 703, 599, 734, 657, 591, 681, 794, 763,
  727, 767, 819, 856, 825, 886, 947, 880, 819, 916,
  977, 904, 849, 931, 1008, 947, 886, 962, 928, 880
]

const chartDates = [
  'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15',
  'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25',
  'Jan 26', 'Jan 27', 'Jan 28', 'Jan 29', 'Jan 30', 'Jan 31', 'Feb 1', 'Feb 2', 'Feb 3', 'Feb 4'
]

function getChartConfig() {
  function calculateRange(data, paddingPercent) {
    const rawMin = Math.min(...data)
    const rawMax = Math.max(...data)
    const range = rawMax - rawMin
    const padding = range * (paddingPercent / 100)
    const niceSteps = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]
    const rawStep = range / 4
    const niceStep = niceSteps.find(s => s >= rawStep) || rawStep
    const yMin = Math.max(0, Math.floor((rawMin - padding) / niceStep) * niceStep)
    const stepsNeeded = Math.ceil((rawMax - yMin) / niceStep)
    const steps = Math.max(4, stepsNeeded)
    const yMax = yMin + (niceStep * steps)
    return { yMin, yMax, tickAmount: steps }
  }

  const configs = {
    'conversion-rate': {
      data: conversionRateData, name: 'Submit Rate',
      ...calculateRange(conversionRateData, 15),
      formatter: (v) => `${v.toFixed(1)}%`, tooltipFormatter: (v) => `${v.toFixed(2)}%`
    },
    'conversions': {
      data: submitsData, name: 'Submits',
      ...calculateRange(submitsData, 15),
      formatter: (v) => Math.round(v), tooltipFormatter: (v) => Math.round(v)
    },
    'impressions': {
      data: impressionsData, name: 'Impressions',
      ...calculateRange(impressionsData, 15),
      formatter: (v) => `${(v / 1000).toFixed(1)}K`, tooltipFormatter: (v) => v.toLocaleString()
    },
    'unique-visitors': {
      data: uniqueVisitorsData, name: 'Visitors',
      ...calculateRange(uniqueVisitorsData, 15),
      formatter: (v) => `${(v / 1000).toFixed(1)}K`, tooltipFormatter: (v) => v.toLocaleString()
    },
    'supported-orders': {
      data: supportedOrdersData, name: 'Assisted Orders',
      ...calculateRange(supportedOrdersData, 15),
      formatter: (v) => Math.round(v), tooltipFormatter: (v) => Math.round(v)
    },
    'supported-revenue': {
      data: supportedRevenueData, name: 'Assisted Revenue',
      ...calculateRange(supportedRevenueData, 15),
      formatter: (v) => `${v.toFixed(0)} HUF`, tooltipFormatter: (v) => `${v.toLocaleString()} HUF`
    }
  }
  return configs[activeTab.value] || configs['conversion-rate']
}

const chartSeries = computed(() => {
  const config = getChartConfig()
  return [{ name: config.name, data: config.data }]
})

const chartOptions = computed(() => {
  const config = getChartConfig()
  return {
    chart: {
      type: 'area', height: 280,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2, colors: ['#ed5a29'] },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] },
      colors: ['#ed5a29']
    },
    grid: {
      borderColor: '#f1f2f4', strokeDashArray: 0,
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
        show: true, rotate: -45, rotateAlways: false, hideOverlappingLabels: true,
        style: { colors: '#9ba2ad', fontSize: '11px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      min: config.yMin, max: config.yMax, tickAmount: config.tickAmount,
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
    markers: { size: 0, hover: { size: 5 } }
  }
})

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

/* Trend Chart Tabs */
.trend-chart-tabs {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
  overflow: visible;
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
