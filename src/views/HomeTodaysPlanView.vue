<template>
  <DashboardLayout active-menu-item="home" :right-panel-collapsed="!chatOpen" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-3xl mx-auto">
        <!-- Greeting + domain -->
        <div class="flex items-center justify-between gap-4 mb-8">
          <h1 class="text-2xl font-semibold text-om-gray-700">Hi Csaba</h1>
          <div class="w-56 shrink-0">
            <Dropdown v-model="selectedDomain" :options="domains" placeholder="Select domain">
              <template #icon>
                <img src="/demos/telekom/logo.png" alt="Domain" class="w-5 h-5 rounded-full object-cover" />
              </template>
            </Dropdown>
          </div>
        </div>

        <!-- Today's plan -->
        <div class="mb-10">
          <div class="flex items-center gap-2 mb-1">
            <h2 class="text-lg font-semibold text-om-gray-700">Today's plan</h2>
          </div>
          <!-- Agent intro -->
          <div class="flex items-start gap-2.5 mb-4">
            <div class="shrink-0 w-7 h-7 rounded-full bg-om-orange-100 text-om-orange-500 flex items-center justify-center mt-0.5">
              <Sparkles :size="15" />
            </div>
            <p class="text-sm text-om-gray-500 leading-snug pt-1">
              Based on {{ selectedDomain }}'s data, here's what I'd focus on today.
            </p>
          </div>

          <!-- Recommendation cards -->
          <div class="flex flex-col gap-3">
            <!-- New task — same bar style as the recommendations -->
            <button
              @click="openNewTaskChat"
              class="flex items-center gap-3 text-left bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-4 hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow cursor-pointer"
            >
              <div class="shrink-0 w-12 h-12 rounded-lg bg-om-peach-100 text-om-orange-500 flex items-center justify-center">
                <Plus :size="22" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-om-gray-700 mb-0.5">New task</h3>
                <p class="text-sm text-om-gray-500 leading-snug">Describe a task and the agent will take care of it.</p>
              </div>
            </button>

            <div
              v-for="r in recommendations"
              :key="r.title"
              @click="openRecommendationChat(r)"
              class="flex items-center gap-3 bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-4 hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow cursor-pointer"
            >
              <div class="shrink-0 w-12 h-12 rounded-lg bg-om-peach-100 text-om-orange-500 flex items-center justify-center">
                <component :is="r.icon" :size="22" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <h3 class="text-sm font-semibold text-om-gray-700">{{ r.title }}</h3>
                  <Tag :variant="r.impactVariant" size="sm">{{ r.impact }}</Tag>
                </div>
                <p class="text-sm text-om-gray-500 leading-snug">{{ r.reason }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Active campaigns (1 running) -->
        <div>
          <div class="flex items-center gap-2 mb-3">
            <h2 class="text-lg font-semibold text-om-gray-700">Active campaigns</h2>
            <Tag variant="gray" size="sm">1</Tag>
          </div>
          <div class="space-y-4">
            <CampaignCard
              :name="activeCampaign.name"
              :domain="activeCampaign.domain"
              :image="activeCampaign.image"
              :active="activeCampaign.active"
              @update:active="activeCampaign.active = $event"
              :selected="activeCampaign.selected"
              @update:selected="activeCampaign.selected = $event"
              :metrics="activeCampaign.metrics"
              :last-updated="activeCampaign.lastUpdated"
              variant="list"
              @click="$emit('menu-click', 'campaigns')"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Right-side chat window (opens when a plan card is clicked) -->
    <template #right-panel>
      <div v-if="chatOpen" class="flex-1 min-w-0 flex flex-col bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] my-3 mr-3 overflow-hidden">
        <!-- Header -->
        <div class="shrink-0 flex items-center justify-between px-4 h-12 border-b border-om-gray-200">
          <span class="text-sm font-semibold text-om-gray-700">{{ chatTitle }}</span>
          <button
            @click="chatOpen = false"
            class="w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Messages -->
        <div ref="chatScrollRef" class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-for="(m, i) in chatMessages" :key="i" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
            <div
              class="px-3 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed"
              :class="m.role === 'user' ? 'bg-om-peach-100 text-om-gray-700 rounded-br-md' : 'bg-om-gray-100 text-om-gray-700 rounded-bl-md'"
              v-html="fmt(m.text)"
            ></div>
          </div>
          <div v-if="aiTyping" class="flex justify-start">
            <div class="px-3 py-2 rounded-2xl rounded-bl-md bg-om-gray-100 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse"></span>
              <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></span>
              <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></span>
            </div>
          </div>
        </div>

        <!-- Decision question (shared component) -->
        <div v-if="decisionBlock" class="shrink-0 p-4 pt-0">
          <ChatDecisionQuestions :block="decisionBlock" @continue="onDecisionContinue" @skip="onDecisionSkip" />
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, nextTick, onUnmounted } from 'vue'
import { Sparkles, ShoppingCart, FlaskConical, MessageSquare, Plus, X } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Tag from '../components/shared/Tag.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import ChatDecisionQuestions from '../components/onboarding/ChatDecisionQuestions.vue'

defineEmits(['menu-click'])

const selectedDomain = ref('reflexshop.hu')
const domains = ref(['reflexshop.hu', 'telekom.hu', '+ Add new domain'])

// ── Right-side chat window (opens on plan card click) ──
const chatOpen = ref(false)
const chatTitle = ref('')
const chatMessages = ref([])
const aiTyping = ref(false)
const decisionBlock = ref(null)
const chatScrollRef = ref(null)
const chatTimeouts = []
let activeTopic = null

const waitMs = (ms) => new Promise((resolve) => { const t = setTimeout(resolve, ms); chatTimeouts.push(t) })
const scrollChat = () => nextTick(() => { if (chatScrollRef.value) chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight })
const fmt = (t) => (t || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\n/g, '<br>')

const pushAi = async (text) => {
  aiTyping.value = true
  scrollChat()
  await waitMs(700)
  aiTyping.value = false
  chatMessages.value.push({ role: 'ai', text })
  scrollChat()
}

const openTopic = async (topic) => {
  activeTopic = topic
  chatTitle.value = topic.title
  chatMessages.value = []
  decisionBlock.value = null
  chatOpen.value = true
  await pushAi(topic.intro)
  // Single decision question, rendered with the shared ChatDecisionQuestions component
  decisionBlock.value = reactive({
    activeTab: 0,
    questions: [{ text: topic.question, options: topic.options, selectedId: null }],
  })
  scrollChat()
}

const onDecisionContinue = async () => {
  const q = decisionBlock.value?.questions[0]
  if (!q?.selectedId) return
  const opt = q.options.find((o) => o.id === q.selectedId)
  const topic = activeTopic
  decisionBlock.value = null
  chatMessages.value.push({ role: 'user', text: opt.label })
  scrollChat()
  await pushAi(topic.responses[q.selectedId] || 'Got it.')
}

const onDecisionSkip = async () => {
  decisionBlock.value = null
  chatMessages.value.push({ role: 'user', text: 'Maybe later' })
  scrollChat()
  await pushAi("No problem, whenever you're ready.")
}

const openRecommendationChat = (r) => openTopic(topicChats[r.id])
const openNewTaskChat = () => openTopic(topicChats['new-task'])

onUnmounted(() => { chatTimeouts.forEach((t) => clearTimeout(t)) })

// Detailed, topic-specific conversations — describe the goal, then a single yes/no decision
const topicChats = {
  cart: {
    title: 'Recover abandoned carts',
    intro: "**Goal:** recover abandoned carts on reflexshop.hu.\n\nRight now **68% of carts** are abandoned with nothing in place to win them back. I'd add an **exit-intent popup** on the cart and checkout pages that offers **free shipping** and captures the email as a fallback. Based on similar stores, this recovers **10 to 15%** of abandoning carts.",
    question: 'Should I set this up?',
    options: [{ id: 'yes', label: 'Yes, set it up' }, { id: 'no', label: 'Not now' }],
    responses: {
      yes: "On it. I'll build the exit-intent cart-recovery popup and open the editor so you can review it before it goes live.",
      no: "No problem, I'll leave it for now. It stays in your plan if you change your mind.",
    },
  },
  'ab-test': {
    title: 'A/B test your popup headline',
    intro: "**Goal:** lift sign-ups on your Welcome Discount Popup with a headline A/B test.\n\nIt currently converts at **3.2%**. I'd run a **50/50 test** of your current headline against a benefit-led variant, measured on submit rate over about 2 weeks. A headline test alone often lifts sign-ups by **15 to 30%**.",
    question: 'Should I start this test?',
    options: [{ id: 'yes', label: 'Yes, start the test' }, { id: 'no', label: 'Not now' }],
    responses: {
      yes: "Great. I'll launch the 50/50 headline test and let you know as soon as there's a clear winner.",
      no: "No problem, I'll hold off. It stays in your plan if you want to run it later.",
    },
  },
  sms: {
    title: 'Add SMS to your signup',
    intro: "**Goal:** add SMS capture to your Welcome Discount Popup.\n\nYou collect **email only** today. I'd add an optional **phone field** with compliant consent copy, keeping email required so your main conversion stays safe. SMS open rates run around **90%**, so this opens a strong second channel.",
    question: 'Should I add it?',
    options: [{ id: 'yes', label: 'Yes, add SMS' }, { id: 'no', label: 'Not now' }],
    responses: {
      yes: "Done deal. I'll add the optional phone field with consent copy and open the editor so you can review the placement.",
      no: "No problem, I'll leave it for now. It stays in your plan if you change your mind.",
    },
  },
  'new-task': {
    title: 'New task',
    intro: "Sure, I'm ready. I can build new campaigns, optimize existing ones, or dig into your data.",
    question: 'What would you like to work on?',
    options: [
      { id: 'create', label: 'Create a new popup' },
      { id: 'optimize', label: 'Optimize an existing campaign' },
      { id: 'analyze', label: 'Analyze my traffic' },
    ],
    responses: {
      create: "Happy to. What's the goal: more email sign-ups, recovering carts, or promoting an offer? Once I know, I'll pick the best popup type and draft it.",
      optimize: "Let's do it. Your **Welcome Discount Popup** is the only active campaign, converting at 3.2%. I'd start by testing the headline and tightening the trigger timing.",
      analyze: "On it. For reflexshop.hu I'd look at traffic sources, which pages convert, and where visitors drop off. I'll pull together the biggest opportunities from your last 30 days.",
    },
  },
}

const recommendations = [
  {
    id: 'cart',
    icon: ShoppingCart,
    title: 'Recover abandoned carts',
    impact: 'High impact',
    impactVariant: 'orange',
    reason: '68% of your carts are abandoned. An exit-intent offer could recover up to 15% of them.',
  },
  {
    id: 'ab-test',
    icon: FlaskConical,
    title: 'A/B test your popup headline',
    impact: 'Medium impact',
    impactVariant: 'gray',
    reason: 'Your Welcome Discount popup converts at 3.2%. Testing a sharper headline often lifts signups.',
  },
  {
    id: 'sms',
    icon: MessageSquare,
    title: 'Add SMS to your signup',
    impact: 'Medium impact',
    impactVariant: 'gray',
    reason: 'Collect phone numbers alongside email to build a second marketing channel.',
  },
]

const activeCampaign = reactive({
  id: 'campaign1',
  name: 'Welcome Discount Popup',
  domain: 'reflexshop.hu',
  image: '/campaigns/smart-discount-popup.png',
  active: true,
  selected: false,
  lastUpdated: '2 days ago',
  metrics: [
    { label: 'Impressions', value: '1,240' },
    { label: 'Submits', value: '40' },
    { label: 'Submit rate', value: '3.2%' },
    { label: 'Conversion uplift', value: '62.10%', trend: true },
  ],
})
</script>
