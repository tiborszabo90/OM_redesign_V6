<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen || chatWideMode" :content-hidden="chatWideMode">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
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
              <!-- Heartbeat indicator — no signal / code not detected -->
              <button
                type="button"
                class="flex items-center gap-2 cursor-pointer select-none group"
                @click="heartbeatOpen = !heartbeatOpen"
              >
                <span class="relative flex h-2.5 w-2.5">
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E4252D]"></span>
                </span>
                <span class="text-sm font-medium text-om-gray-600 whitespace-nowrap group-hover:text-om-gray-700 transition-colors">
                  No signal
                </span>
                <ChevronDown
                  :size="14"
                  :class="['text-om-gray-400 transition-transform duration-200', heartbeatOpen ? 'rotate-180' : '']"
                />
              </button>

              <!-- Status panel -->
              <transition name="panel">
                <div
                  v-if="heartbeatOpen"
                  class="absolute top-full left-0 mt-2 z-50 w-150 bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] border border-gray-100 overflow-hidden"
                >
                  <div class="absolute top-2 right-2">
                    <Button variant="ghost" size="sm" icon-only @click="heartbeatOpen = false">
                      <template #icon><X :size="16" /></template>
                    </Button>
                  </div>

                  <div class="px-6 py-10 text-center">
                    <div class="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-3">
                      <AlertCircle :size="22" class="text-[#E4252D]" />
                    </div>
                    <h3 class="text-base font-semibold text-om-gray-700 mb-1">Connect your website to make your campaigns live</h3>
                    <p class="text-sm text-om-gray-500 leading-relaxed max-w-sm mx-auto mb-5">
                      OptiMonk should be alive and reporting from <span class="font-medium text-om-gray-700">{{ selectedDomain }}</span>, but we haven't received a signal yet. Until the code is in place, your campaigns can't run, we can't show live data, and CRO analysis stays unavailable.
                    </p>
                    <Button variant="primary" size="sm">Install OptiMonk</Button>
                  </div>
                </div>
              </transition>
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

        <!-- Performance chart + Father's Day promo -->
        <div class="grid grid-cols-1 min-[1100px]:grid-cols-[3fr_1fr] gap-5 mb-10 items-stretch">
          <!-- Chart card -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] px-5 flex flex-col">
            <div class="relative flex-1 min-h-70">
              <!-- Skeleton chart -->
              <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" preserveAspectRatio="none">
                <!-- Horizontal gridlines -->
                <line x1="0" y1="60" x2="800" y2="60" stroke="#F3F4F6" stroke-width="1"/>
                <line x1="0" y1="120" x2="800" y2="120" stroke="#F3F4F6" stroke-width="1"/>
                <line x1="0" y1="180" x2="800" y2="180" stroke="#F3F4F6" stroke-width="1"/>
                <line x1="0" y1="240" x2="800" y2="240" stroke="#F3F4F6" stroke-width="1"/>
                <!-- Dummy area fill -->
                <path
                  d="M 0,180 C 80,160 140,200 220,170 S 360,120 440,150 S 580,210 660,170 S 760,140 800,160 L 800,280 L 0,280 Z"
                  fill="#F3F4F6"
                  opacity="0.15"
                />
                <!-- Dummy line -->
                <path
                  d="M 0,180 C 80,160 140,200 220,170 S 360,120 440,150 S 580,210 660,170 S 760,140 800,160"
                  fill="none"
                  stroke="#F1F2F4"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <!-- Empty state overlay -->
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                <BarChart3 :size="36" class="text-om-gray-300" />
                <p class="text-sm text-om-gray-400 text-center max-w-xs">Your statistics will be seen here right after you installed OptiMonk.</p>
              </div>
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
            <Button variant="primary" size="sm" @click="$emit('new-campaign')">New campaign</Button>
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
      <ChatPanel ref="chatPanelRef" v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" :message-matchers="chatMessageMatchers" :expanded-width="chatExpandedWidth" :wide-compact="true" @action="handleChatAction" @toggle-expand="chatExpandedWidth = chatExpandedWidth > 0 ? 0 : 9999" />
    </template>
    <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { TrendingUp, TrendingDown, Target, Calendar, UserPlus, Signpost, X, Monitor, Smartphone, MessageCircle, MousePointerClick, Filter, FlaskConical, Clock, RotateCw, Facebook, Search, Route, Tag, Sparkles, LayoutGrid, Layers, Info, ClipboardList, ShieldAlert, Eye, Wand2, ArrowDown, BarChart3, ShieldCheck, Globe, Truck, Lightbulb, ArrowUpRight, ChevronRight, ChevronDown, AlertCircle } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'
import TagBadge from '../components/shared/Tag.vue'
import { croInsights } from '../data/croInsights.js'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['task-created', 'menu-click', 'visitor-click', 'navigate-to-opportunity', 'navigate-to-opportunities', 'new-campaign', 'open-editor-with-chat'])

const insightIcons = {
  1: MessageCircle,
  2: MousePointerClick,
  3: Filter,
  4: FlaskConical,
  5: Monitor,
  6: Clock,
  7: RotateCw,
  8: Facebook,
  9: Target,
  10: Search,
  11: Route,
  12: Tag,
  13: Sparkles,
  14: LayoutGrid,
  15: Layers,
  16: Info,
  17: ClipboardList,
  18: ShieldAlert,
  19: Smartphone,
  20: Eye,
  21: Wand2,
  22: ArrowDown,
  23: BarChart3,
  24: ShieldCheck,
  25: Globe,
  26: Truck,
}

const insightCount = computed(() => croInsights.length)

const insightImpactPriority = { Large: 5, 'Medium to large': 4, Medium: 3, 'Small to medium': 2, Small: 1 }
const topInsights = computed(() =>
  [...croInsights]
    .sort((a, b) => (insightImpactPriority[b.value] ?? 0) - (insightImpactPriority[a.value] ?? 0) || a.id - b.id)
    .slice(0, 3)
)

const handleLogoClick = () => {
  // No-op for now
}

const chatPanelRef = ref(null)
const isChatOpen = ref(false)
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
    message: 'Based on your site\'s traffic and performance data, these use cases would have the biggest impact for you:',
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
  { id: 'smart-discount', number: 1, label: 'Smart Discount Popup', bgColor: '#FFEFE5', reason: 'Your new visitors have a 12% bounce rate — a welcome discount can convert them into subscribers.' },
  { id: 'lucky-wheel', number: 2, label: 'Lucky Wheel', bgColor: '#FFEFE5', reason: 'Gamified popups get 2x more engagement — perfect for your high-traffic pages.' },
  { id: 'newsletter', number: 3, label: 'Newsletter Signup Popup', bgColor: '#FFEFE5', reason: 'Your email list grew only 3% last month — a signup popup can accelerate that.' },
  { id: 'cart-abandonment', number: 4, label: 'Cart Abandonment Stopper', bgColor: '#FFEFE5', reason: '68% of your carts are abandoned — an exit offer can recover up to 15% of them.' },
]

// ── Template cards per use case (grey placeholders) ──
const templateCards = {
  'smart-discount': [
    { id: 'sd-1', label: 'Classic Discount', description: '10% off with email capture' },
    { id: 'sd-2', label: 'Minimal Discount', description: 'Clean, simple form' },
    { id: 'sd-3', label: 'Image + Discount', description: 'Product image with coupon' },
    { id: 'sd-4', label: 'Countdown Discount', description: 'Urgency with timer' },
  ],
  'lucky-wheel': [
    { id: 'lw-1', label: 'Classic Wheel', description: 'Spin-to-win with prizes' },
    { id: 'lw-2', label: 'Holiday Wheel', description: 'Seasonal themed design' },
    { id: 'lw-3', label: 'Minimal Wheel', description: 'Clean, modern look' },
    { id: 'lw-4', label: 'Bold Wheel', description: 'High contrast, eye-catching' },
  ],
  'newsletter': [
    { id: 'nl-1', label: 'Simple Signup', description: 'Email field with CTA' },
    { id: 'nl-2', label: 'Content Teaser', description: 'Preview what subscribers get' },
    { id: 'nl-3', label: 'Sidebar Form', description: 'Embedded style popup' },
    { id: 'nl-4', label: 'Full-screen Signup', description: 'Bold, immersive form' },
  ],
  'cart-abandonment': [
    { id: 'ca-1', label: 'Exit Discount', description: 'Last-chance coupon offer' },
    { id: 'ca-2', label: 'Cart Reminder', description: 'Show items left in cart' },
    { id: 'ca-3', label: 'Free Shipping', description: 'Shipping threshold nudge' },
    { id: 'ca-4', label: 'Countdown Exit', description: 'Timer + discount combo' },
  ],
}

const usecaseListEN = 'Based on your site\'s traffic and performance data, these use cases would have the biggest impact for you:'
const usecaseListHU = 'Az oldalad forgalmi és teljesítményadatai alapján ezek a use case-ek hoznák a legnagyobb eredményt neked:'

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

  // ── Step 1: Use case selection (visual cards, wide panel) ──
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

const handleChatAction = (action) => {
  if (action === 'flow-welcome-usecase') {
    welcomeFlowStep.value = 'usecase'
    // Expand to full width
    chatExpandedWidth.value = 9999
    setTimeout(() => {
      chatPanelRef.value?.pushMessage({
        type: 'ai-images',
        message: '',
        cards: usecaseCards,
      })
    }, 500)
  } else if (action.startsWith('flow-welcome-template:')) {
    welcomeFlowData.value.usecase = action.split(':')[1]
    welcomeFlowStep.value = 'template'
    // 1. Expand panel
    chatExpandedWidth.value = 9999
    // 2. After expansion, inject template cards
    const cards = templateCards[welcomeFlowData.value.usecase] || []
    setTimeout(() => {
      chatPanelRef.value?.pushMessage({
        type: 'ai-images',
        message: '',
        cards,
        hideLabels: true,
        skipUserMessage: true,
      })
    }, 500)
  } else if (action.startsWith('flow-welcome-branding:')) {
    welcomeFlowData.value.template = action.split(':')[1]
    welcomeFlowStep.value = 'branding'
    // Stay wide, inject branding cards
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
// Heartbeat status per domain — 'green' (healthy) | 'red' (no signal)
const domainStatuses = {
  'reflexshop.hu': 'red',
  'telekom.hu': 'green',
  'shop.telekom.hu': 'red',
  'demo.optimonk.com': 'green',
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

// ── Heartbeat (no code inserted state) ──
const heartbeatOpen = ref(false)

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

/* Heartbeat setup panel open/close */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.25s ease;
  transform-origin: top;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-8px);
}

/* Slow spin for refresh icon */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

/* Metric Cards */
.metric-cards-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.metric-cards-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
}

@media (max-width: 1100px) {
  .metric-cards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .metric-cards-grid,
  .metric-cards-grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.metric-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 2px 1px rgb(0 0 0 / 0.03);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-width: 0;
}

.metric-card-title {
  font-size: 0.75rem;
  color: rgb(80, 87, 99);
  opacity: 0.8;
  font-weight: 500;
}

.metric-card-stat {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.metric-card-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(35, 38, 42);
  line-height: 1.2;
}

.metric-card-change {
  font-size: 0.6875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 2px;
}

.metric-card-change.positive {
  color: rgb(35, 158, 119);
}

.metric-card-change.negative {
  color: rgb(228, 37, 45);
}

/* Top Optimization Opportunities */
.opportunities-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-right: 20px;
  margin-bottom: 1.25rem;
}

.opportunities-title-text {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(35, 38, 42);
  padding-left: 20px;
  padding-right: 20px;
}

.opportunities-summary {
  font-size: 0.8125rem;
  color: #6B7280;
  line-height: 1.5;
  margin: 6px 20px 0;
}

.opportunities-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.opportunities-generated {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4B5563;
  background: #F1F2F4;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.view-all-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6B7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.view-all-btn:hover {
  color: #23262A;
  background: #F1F2F4;
}

.opp-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding: 0 20px;
}

.opp-card {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  padding: 16px;
  gap: 16px;
  background: white;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 0;
}

.opp-card:hover {
  border-color: #ED5A29;
  box-shadow: 0 4px 14px rgba(237, 90, 41, 0.4);
}

.opp-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #FFF0EB;
  color: #C94B14;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.opp-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.opp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.opp-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #23262A;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
}

.opp-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}

.opp-campaign {
  font-size: 0.8125rem;
  color: #3F4248;
  line-height: 1.6;
  margin: 0;
}

.opp-campaign strong {
  color: #23262A;
  font-weight: 600;
}

.opp-desc {
  font-size: 0.8125rem;
  color: #6B7280;
  line-height: 1.5;
}

.badge-high {
  background: #FFF0EB;
  color: #C94B14;
}

.badge-medium {
  background: #FFF8E6;
  color: #9A6400;
}

.badge-low {
  background: #F1F2F4;
  color: #6B7280;
}

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
