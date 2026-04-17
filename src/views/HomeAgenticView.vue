<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen || chatWideMode" :content-hidden="chatWideMode">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Agentic Input Section -->
        <div class="mt-24 mb-4">
          <!-- Domain selector + Heartbeat centered -->
          <div class="flex justify-center mb-6">
            <div class="flex items-center gap-3">
              <div class="w-[240px]">
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
                <div v-if="heartbeatOpen" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-175">
                  <HeartbeatPanel
                    :open="heartbeatOpen"
                    :visitors="liveVisitors"
                    @close="heartbeatOpen = false"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="mb-8 text-center">
            <h2 class="text-3xl font-semibold text-[#23262A]">Hi Csaba, what should we do?</h2>
          </div>

          <!-- Input area -->
          <div class="relative max-w-180 mx-auto">
            <textarea
              ref="textareaRef"
              v-model="agenticMessage"
              rows="4"
              @keydown.enter.exact.prevent="handleAgenticSubmit"
              class="w-full px-4 py-3 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#8F97A4] focus:border-transparent transition-colors text-[#23262A] h-28 resize-none pr-12 bg-white"
              :placeholder="currentPlaceholder"
            ></textarea>
            <!-- Attach button -->
            <button
              class="absolute bottom-3 left-2 w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-600 hover:bg-om-gray-100 rounded-lg transition-all cursor-pointer"
            >
              <Paperclip :size="20" />
            </button>
            <!-- Submit button -->
            <button
              @click="handleAgenticSubmit"
              :disabled="!agenticMessage?.trim()"
              :class="[
                'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                agenticMessage?.trim() ? 'bg-[#ED5A29] text-white cursor-pointer' : 'bg-[#E3E5E8] text-[#8F97A4] cursor-default'
              ]"
            >
              <ArrowUp :size="16" />
            </button>
          </div>

          <!-- Example prompts -->
          <div class="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span class="text-sm text-[#8F97A4]">Start with this:</span>
            <button
              v-for="example in examples"
              :key="example.label"
              @click="selectExample(example)"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-om-gray-200 text-sm text-om-gray-700 transition-all duration-200 ease-out cursor-pointer hover:scale-[1.02]"
            >
              <component :is="example.iconComponent" :size="16" class="text-om-gray-500" />
              <span>{{ example.label }}</span>
            </button>
          </div>
        </div>

        <div class="mt-24"></div>

        <!-- Performance Overview Section -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-semibold text-om-gray-700">Performance Overview</h3>
            <div class="flex items-center gap-3">
              <div class="w-44">
                <Dropdown
                  v-model="selectedPeriod"
                  :options="periods"
                  placeholder="Select period"
                  size="sm"
                >
                  <template #icon>
                    <Calendar :size="16" class="text-om-gray-400" />
                  </template>
                </Dropdown>
              </div>
              <button class="text-sm font-medium text-om-gray-500 hover:text-om-gray-700 transition-colors cursor-pointer">See more</button>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="tab in trendTabs"
              :key="tab.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5"
            >
              <div class="text-xs font-medium text-om-gray-400 uppercase tracking-wide mb-3">{{ tab.title }}</div>
              <div class="flex items-baseline gap-3">
                <div class="text-2xl font-semibold text-[#23262A]">{{ tab.value }}</div>
                <div v-if="tab.change" :class="['text-sm font-medium flex items-center gap-1', tab.isPositive ? 'text-[#239E77]' : 'text-[#E4252D]']">
                  <TrendingUp v-if="tab.isPositive" :size="14" />
                  <TrendingDown v-else :size="14" />
                  {{ tab.change }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Campaigns Section -->
        <div class="mt-12">
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

        <!-- Inspiration -->
        <div class="mt-12">
          <h3 class="text-lg font-semibold text-om-gray-700 mb-4">Inspiration</h3>
          <div class="grid grid-cols-6 gap-6">
            <!-- Smart Discount Popup -->
            <div class="flex flex-col cursor-pointer group">
              <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
                <div class="flex flex-col w-full h-full">
                  <div class="h-1/3 shrink-0 bg-white flex items-end justify-center rounded-t-lg">
                    <img src="/campaigns/smart-discount-popup-img.png" alt="Smart Discount" class="h-full object-contain" />
                  </div>
                  <div class="flex-1 px-4 pb-3 flex flex-col justify-center text-center">
                    <img src="/demos/telekom/logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-1 mx-auto" />
                    <h4 class="text-[13px] font-bold mb-2 leading-tight text-[#E20074]">
                      Tied a 10% KUPON
                    </h4>
                    <p class="text-[7px] text-om-gray-500 mb-2">
                      Csapj le ra, mielott eltunik!
                    </p>
                    <button class="w-full py-2 text-white text-[7px] font-bold mb-1.5 rounded-lg bg-[#E20074]">
                      KEREM A 10%-OT
                    </button>
                    <button class="w-full py-2 text-[7px] font-bold border rounded-lg text-[#E20074] border-[#E20074] bg-white">
                      NEM, KOSZI!
                    </button>
                  </div>
                </div>
              </div>
              <h4 class="text-sm font-medium text-om-gray-700">Smart Discount Popup</h4>
              <p class="text-xs text-om-gray-500 mt-1">The most effective list-building popup formula</p>
            </div>

            <!-- Cart Abandonment Stopper -->
            <div class="flex flex-col cursor-pointer group">
              <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
                <div class="relative w-full h-full flex items-center justify-center p-2" style="background-color: #6A8085">
                  <div class="flex flex-col w-full h-[90%] bg-white rounded-lg overflow-hidden shadow-lg">
                    <div class="h-2/5 shrink-0">
                      <img src="/campaigns/cart-abandonment-stopper-img.png" alt="Cart Abandonment" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 px-4 py-3 flex flex-col justify-center">
                      <p class="text-[7px] text-om-gray-500 mb-2 uppercase tracking-wide">
                        Varj
                      </p>
                      <h4 class="text-[12px] font-bold mb-3 leading-tight text-[#E20074]">
                        Szerezz egy<br>10%-os kuport!
                      </h4>
                      <div class="h-5 bg-white border border-om-gray-300 rounded text-[7px] flex items-center px-2 text-om-gray-400 mb-3">
                        Email cim
                      </div>
                      <button class="w-full py-2 text-white text-[7px] font-bold rounded bg-[#E20074]">
                        FOLYTATAS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <h4 class="text-sm font-medium text-om-gray-700">Cart Abandonment Stopper</h4>
              <p class="text-xs text-om-gray-500 mt-1">Offer a discount for cart abandoners</p>
            </div>

            <!-- Lucky Wheel -->
            <div class="flex flex-col cursor-pointer group">
              <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
                <div class="flex flex-col w-full h-full">
                  <div class="flex-1 px-4 py-3 flex flex-col justify-center text-center">
                    <img src="/demos/telekom/logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-2 mx-auto" />
                    <h4 class="text-[12px] font-bold mb-2 leading-tight text-[#E20074]">
                      Porgets, nyerj es<br>sporolj!
                    </h4>
                    <p class="text-[6px] text-om-gray-500 mb-2 leading-snug">
                      Ugy erzed, rad mosolyoghat a szerencse?<br>Add meg az email cimed, es porgets!
                    </p>
                    <div class="h-5 bg-white border border-om-gray-300 rounded text-[7px] flex items-center px-2 text-om-gray-400 mb-2">
                      Email
                    </div>
                    <button class="w-full py-2 text-white text-[7px] font-bold mb-1 rounded bg-[#E20074]">
                      PORGETEK
                    </button>
                    <button class="text-[7px] font-medium underline text-[#E20074]">
                      NEM, KOSZI!
                    </button>
                  </div>
                  <div class="h-1/3 shrink-0">
                    <img src="/campaigns/lucky-wheel-img.png" alt="Lucky Wheel" class="w-full h-full object-cover rounded-b-lg" />
                  </div>
                </div>
              </div>
              <h4 class="text-sm font-medium text-om-gray-700">Lucky Wheel</h4>
              <p class="text-xs text-om-gray-500 mt-1">Gamify popups to increase visitor engagement</p>
            </div>

            <!-- Feedback Survey -->
            <div class="flex flex-col cursor-pointer group">
              <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
                <div class="relative w-full h-full flex items-center justify-center p-2" style="background-color: #6A8085">
                  <div class="flex flex-col w-full h-1/2 bg-white rounded-lg shadow-lg justify-center px-4 py-5 text-center">
                    <img src="/demos/telekom/logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-3 mx-auto" />
                    <h4 class="text-[11px] font-bold mb-2 leading-tight text-[#E20074]">
                      Van egy perced?<br>Mondd el a velemenyed!
                    </h4>
                    <p class="text-[6px] text-om-gray-500 mb-3 leading-snug">
                      Hogyan ertekelned az altalanos<br>tapasztalatsodat velunk?
                    </p>
                    <div class="flex justify-center gap-1 mb-2">
                      <div v-for="i in 5" :key="i" class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold border-[#E20074] text-[#E20074]">
                        {{ i }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h4 class="text-sm font-medium text-om-gray-700">Feedback Survey</h4>
              <p class="text-xs text-om-gray-500 mt-1">Get real, measurable feedback on anything you want</p>
            </div>

            <!-- Product Value Spotlight -->
            <div class="flex flex-col cursor-pointer group">
              <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
                <img src="/campaigns/smart-discount-popup-img.png" alt="Product Value Spotlight" class="w-full h-full object-cover" />
              </div>
              <h4 class="text-sm font-medium text-om-gray-700">Product Value Spotlight</h4>
              <p class="text-xs text-om-gray-500 mt-1">Highlight key product benefits and drive conversions</p>
            </div>

            <!-- Product Recommendation -->
            <div class="flex flex-col cursor-pointer group">
              <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
                <img src="/campaigns/cart-abandonment-stopper-img.png" alt="Product Recommendation" class="w-full h-full object-cover" />
              </div>
              <h4 class="text-sm font-medium text-om-gray-700">Product Recommendation</h4>
              <p class="text-xs text-om-gray-500 mt-1">Show personalized product suggestions to visitors</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #right-panel>
      <ChatPanel ref="chatPanelRef" v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" @action="handleChatAction" />
    </template>
    <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, markRaw } from 'vue'
import { TrendingUp, TrendingDown, Calendar, ArrowUp, Paperclip, Lightbulb, Plus, FlaskConical, Monitor, Smartphone, Tablet } from 'lucide-vue-next'
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

const emit = defineEmits(['task-created', 'menu-click', 'new-campaign', 'navigate-to'])

const handleLogoClick = () => {}

const chatPanelRef = ref(null)
const isChatOpen = ref(false)
const chatWideMode = computed(() => false)

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
  'How can I improve my conversion rate?': 'Here are the top opportunities based on your current data:\n\n1. **A/B test your headlines** — campaigns with personalized headlines convert 2-3x better\n2. **Add exit intent triggers** to recover abandoning visitors\n3. **Optimize for mobile** — your mobile CVR is 40% lower than desktop',
}

const handleChatAction = () => {}

// ── Agentic Input ──
const textareaRef = ref(null)
const agenticMessage = ref('')
const currentPlaceholderIndex = ref(0)
const displayedText = ref('')
let typingTimeout = null

const placeholderSuggestions = [
  'how to collect more emails',
  'to create a welcome popup',
  'for cart abandonment tips',
  'to boost conversions',
  'about exit-intent popups'
]

const currentPlaceholder = computed(() => {
  return `Ask OptiMonk ${displayedText.value}`
})

const typeText = (text, index = 0) => {
  if (index <= text.length) {
    displayedText.value = text.slice(0, index)
    typingTimeout = setTimeout(() => typeText(text, index + 1), 50)
  } else {
    typingTimeout = setTimeout(() => eraseText(text, text.length), 2000)
  }
}

const eraseText = (text, index) => {
  if (index >= 0) {
    displayedText.value = text.slice(0, index)
    typingTimeout = setTimeout(() => eraseText(text, index - 1), 30)
  } else {
    currentPlaceholderIndex.value = (currentPlaceholderIndex.value + 1) % placeholderSuggestions.length
    typingTimeout = setTimeout(() => {
      typeText(placeholderSuggestions[currentPlaceholderIndex.value] + '...')
    }, 300)
  }
}

const examples = [
  { label: 'Boost conversions', prompt: 'Help increase the conversion rate', iconComponent: Lightbulb },
  { label: 'Create a popup', prompt: 'I want to create a popup', iconComponent: Plus },
  { label: 'Run A/B test', prompt: 'Help me run an A/B test', iconComponent: FlaskConical },
]

const selectExample = (example) => {
  agenticMessage.value = example.prompt
  if (textareaRef.value) textareaRef.value.focus()
}

const handleAgenticSubmit = () => {
  if (agenticMessage.value?.trim()) {
    emit('navigate-to', 'task-creation', agenticMessage.value.trim())
    agenticMessage.value = ''
  }
}

// ── Promo blocks ──
const showInviteBlock = ref(true)

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
  { id: 'active-campaigns', title: 'Active Campaigns', value: '3', change: null, isPositive: null },
  { id: 'emails-collected', title: 'Emails Collected', value: '1,542', change: '+12%', isPositive: true },
  { id: 'conversion-rate', title: 'Conversion Rate', value: '0.57%', change: '+14.0%', isPositive: true },
  { id: 'conversions', title: 'Conversions', value: '2.2K', change: '+8.3%', isPositive: true },
  { id: 'impressions', title: 'Impressions', value: '384.4K', change: '+12.5%', isPositive: true },
  { id: 'unique-visitors', title: 'Unique Visitors', value: '168.2K', change: '+6.7%', isPositive: true },
  { id: 'supported-orders', title: 'Supported Orders', value: '286', change: '-4.2%', isPositive: false },
  { id: 'supported-revenue', title: 'Supported Rev. (HUF)', value: '8,494,963', change: '+15.8%', isPositive: true }
])

const insights = ref([
  {
    id: 'insight-1',
    title: 'Mobile conversion gap',
    badge: 'High impact',
    level: 'high',
    description: 'Mobile visitors convert at 0.31% vs 1.12% on desktop. A mobile-optimized popup could recover significant revenue.',
  },
  {
    id: 'insight-2',
    title: 'Facebook traffic underperforms',
    badge: 'High impact',
    level: 'high',
    description: 'Facebook is your #1 traffic source but converts at just 0.72%, far below the 2.17% site average.',
  },
  {
    id: 'insight-3',
    title: 'Cart abandonment rising',
    badge: 'Medium impact',
    level: 'medium',
    description: '61% of cart visitors leave without buying. No recovery campaign is active for mobile users.',
  },
])

// ── Heartbeat ──
const heartbeatOpen = ref(false)

const visitorPool = [
  { flag: '\u{1F1FA}\u{1F1F8}', label: 'Anonymous visitor', city: 'New York', country: 'USA', currentPage: '/products/wireless-headphones', device: 'desktop', referrer: 'google', browser: 'Chrome', pagesViewed: 4, returning: false },
  { flag: '\u{1F1E9}\u{1F1EA}', label: 'Anonymous visitor', city: 'Berlin', country: 'Germany', currentPage: '/cart', device: 'mobile', referrer: 'instagram', browser: 'Safari', pagesViewed: 6, returning: true },
  { flag: '\u{1F1ED}\u{1F1FA}', label: 'Anonymous visitor', city: 'Budapest', country: 'Hungary', currentPage: '/products/yoga-mat', device: 'desktop', referrer: 'direct', browser: 'Chrome', pagesViewed: 2, returning: false },
  { flag: '\u{1F1EC}\u{1F1E7}', label: 'Anonymous visitor', city: 'London', country: 'UK', currentPage: '/checkout', device: 'desktop', referrer: 'google', browser: 'Firefox', pagesViewed: 8, returning: true },
  { flag: '\u{1F1EB}\u{1F1F7}', label: 'Anonymous visitor', city: 'Paris', country: 'France', currentPage: '/', device: 'mobile', referrer: 'facebook', browser: 'Safari', pagesViewed: 1, returning: false },
  { flag: '\u{1F1E6}\u{1F1F9}', label: 'Anonymous visitor', city: 'Vienna', country: 'Austria', currentPage: '/products/running-shoes', device: 'tablet', referrer: 'google', browser: 'Chrome', pagesViewed: 3, returning: false },
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
  typeText(placeholderSuggestions[0] + '...')

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
  if (typingTimeout) clearTimeout(typingTimeout)
})
</script>

<style scoped>
/* Trend Chart Tabs */
.trend-chart-tabs {
  display: flex;
  overflow: visible;
}

.trend-chart-tab {
  padding: 1.25rem 0.75rem;
  flex: 1;
  min-width: 140px;
  position: relative;
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
</style>
