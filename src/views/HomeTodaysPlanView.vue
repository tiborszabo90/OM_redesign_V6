<template>
  <!-- The full popup editor (public-wizard-v2 editor screen) opens over everything after Continue -->
  <PublicV3PopupDetailScreen
    v-if="showEditor"
    :use-case="reviewItem?.useCase || {}"
    :generation-prompt="reviewItem?.title || ''"
    :initial-chat-messages="editorChat"
    :coupon-code="discountCode"
    :targeting="campaignSettings"
    embedded
    @back="showEditor = false"
    @published="onPublished"
  />
  <DashboardLayout v-else active-menu-item="home" :nav-items="sidebarMenu" wide-sidebar :right-panel-collapsed="!chatOpen" :no-content-padding="!!reviewItem" @menu-click="onSidebarMenu">
    <!-- Domain switcher at the top of the sidebar -->
    <template #sidebar-top>
      <div class="relative mb-4">
        <button
          @click="domainMenuOpen = !domainMenuOpen"
          class="w-full flex items-center gap-2 px-2 py-2 rounded-lg border border-om-gray-200 hover:bg-om-gray-50 transition-colors cursor-pointer"
          title="Switch domain"
        >
          <img src="/demos/telekom/logo.png" alt="Domain" class="w-6 h-6 rounded-full object-cover shrink-0" />
          <span class="flex-1 min-w-0 text-sm text-om-gray-700 truncate text-left">{{ selectedDomain }}</span>
          <ChevronDown :size="14" class="text-om-gray-400 shrink-0" />
        </button>
        <template v-if="domainMenuOpen">
          <div class="fixed inset-0 z-30" @click="domainMenuOpen = false"></div>
          <div class="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-om-gray-200 py-1 z-40">
            <button
              v-for="d in domains"
              :key="d"
              @click="selectedDomain = d; domainMenuOpen = false"
              :class="['w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2', selectedDomain === d ? 'bg-om-orange-50 text-om-orange-600 font-semibold' : 'text-om-gray-700 hover:bg-om-gray-50']"
            >
              <img v-if="!d.startsWith('+')" src="/demos/telekom/logo.png" class="w-4 h-4 rounded-full object-cover shrink-0" />
              <Plus v-else :size="14" class="text-om-gray-400 shrink-0" />
              <span class="truncate">{{ d }}</span>
            </button>
          </div>
        </template>
      </div>
    </template>
    <template #content>
      <!-- Expanded review, presented as a full-screen chat (no app-bar; back link sits with the content) -->
      <div v-if="reviewItem" class="h-full flex flex-col bg-white">
        <!-- Success screen (after the plan is approved) -->
        <div v-if="flowStep === 'success'" class="flex-1 flex items-center justify-center px-6">
          <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <!-- Popup preview -->
            <img :src="(selectedStyle && selectedStyle.image) || reviewItem.image" :alt="reviewItem.title" class="w-full rounded-xl border border-om-gray-200 shadow-[0_8px_30px_rgb(0_0_0/0.12)]" />
            <!-- Page content, beside the popup -->
            <div class="text-left">
              <div class="w-14 h-14 rounded-full bg-[#D6F5EC] text-[#2CC896] flex items-center justify-center mb-4">
                <Check :size="28" />
              </div>
              <h2 class="text-2xl font-semibold text-om-gray-700 mb-2">{{ reviewItem.title }} is ready</h2>
              <p class="text-sm text-om-gray-500 leading-snug mb-6">
                Approved and built.
                {{ activated ? `It's now active and showing to visitors on ${selectedDomain}.` : `Activate it to start showing it to visitors on ${selectedDomain}.` }}
              </p>
              <div v-if="!activated" class="flex items-center gap-2">
                <Button variant="secondary" @click="backToPlan">Save as Draft</Button>
                <Button variant="primary" @click="activateCampaign">Activate campaign</Button>
              </div>
              <div v-else class="flex flex-col items-start gap-3">
                <span class="inline-flex items-center gap-1.5 text-sm font-medium text-[#2CC896]"><Check :size="16" /> Campaign is active</span>
                <Button variant="primary" @click="backToPlan">Back to plan</Button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex-1 flex flex-col min-h-0 bg-white">
            <!-- Messages -->
            <div ref="reviewScrollRef" class="flex-1 overflow-y-auto px-6 py-8">
              <div class="max-w-2xl mx-auto">
                <button
                  @click="backToPlan"
                  class="flex items-center gap-1 text-sm text-om-gray-500 hover:text-om-gray-700 transition-colors mb-6 cursor-pointer"
                >
                  <ChevronLeft :size="16" /> Today's plan
                </button>
                <div class="space-y-4">
                <!-- Recommendation + why -->
                <div class="bg-om-gray-50 rounded-2xl px-4 py-3">
                  <p class="text-sm text-om-gray-600 leading-relaxed mb-2">Hi Csaba, I looked through {{ selectedDomain }}'s last 30 days and one thing really stood out, so I'd suggest this:</p>
                  <h2 class="text-base font-semibold text-om-gray-700 mb-1">{{ reviewItem.title }}</h2>
                  <p class="text-sm text-om-gray-600 leading-relaxed">{{ reviewItem.reasoning }}</p>
                </div>

                <!-- The data behind it -->
                <div class="bg-om-gray-50 rounded-2xl px-4 py-3">
                  <p class="text-sm text-om-gray-600 mb-3">Here's where visitors drop off:</p>
                  <!-- Funnel: left-aligned bars on a shared baseline, narrowing top to bottom -->
                  <div class="space-y-2">
                    <div v-for="(s, i) in funnelWithDrops(reviewItem.funnel.stages)" :key="s.label">
                      <div class="flex items-baseline justify-between gap-2 mb-1">
                        <span class="text-xs text-om-gray-500">{{ s.label }}</span>
                        <span class="flex items-baseline gap-2">
                          <span class="text-sm font-semibold text-om-gray-700">{{ s.value }}</span>
                          <span v-if="s.drop != null" class="inline-flex items-center text-[11px] font-medium text-om-orange-600"><ArrowDown :size="10" />{{ s.drop }}%</span>
                        </span>
                      </div>
                      <div class="h-2.5 rounded-full bg-om-gray-100 overflow-hidden">
                        <div class="h-full rounded-full bg-om-orange-500" :style="{ width: Math.max(3, s.percent) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  <!-- Key takeaway: the headline number stands out -->
                  <p v-if="reviewItem.funnel.takeaway" class="mt-3 text-sm text-om-gray-700 leading-snug">
                    <span class="font-semibold text-om-orange-600">{{ reviewItem.funnel.takeaway.highlight }}</span> {{ reviewItem.funnel.takeaway.text }}
                  </p>
                </div>

                <!-- Expected impact -->
                <div class="bg-om-gray-50 rounded-2xl px-4 py-3">
                  <p class="text-sm text-om-gray-600 mb-2">If we ship this, here's the expected impact:</p>
                  <div class="flex items-center flex-wrap gap-2 mb-2">
                    <span class="text-lg font-semibold text-om-gray-700">{{ reviewItem.impact }}</span>
                    <Tag :variant="confidenceVariant(reviewItem.confidence)" size="sm">{{ confidenceLabel(reviewItem.confidence) }}</Tag>
                  </div>
                  <p class="text-sm text-om-gray-600 leading-relaxed">{{ reviewItem.impactReasoning }}</p>
                </div>

                <!-- Conversation: the user's choices and the agent's replies as they unfold -->
                <template v-for="(m, mi) in trail" :key="mi">
                  <div v-if="m.role === 'user'" class="flex justify-end">
                    <div class="bg-om-peach-100 text-om-gray-700 rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[85%]">{{ m.text }}</div>
                  </div>
                  <div v-else-if="m.role === 'popup-versions'" class="grid grid-cols-2 gap-3">
                    <div
                      v-for="v in m.versions"
                      :key="v.id"
                      :class="[
                        'bg-white rounded-xl border overflow-hidden',
                        m.selectedId === v.id ? 'border-om-orange-500 ring-2 ring-om-orange-200' : 'border-om-gray-200 opacity-60'
                      ]"
                    >
                      <div class="aspect-video bg-om-gray-100 overflow-hidden">
                        <img :src="v.image" :alt="v.label" class="w-full h-full object-cover object-top" />
                      </div>
                    </div>
                  </div>
                  <div v-else class="bg-om-gray-50 rounded-2xl px-4 py-3 text-sm text-om-gray-600 leading-relaxed">{{ m.text }}</div>
                </template>

                <!-- Final summary: the popup itself + its setup, consolidated like the settings page -->
                <div v-if="flowStep === 'summary'" class="bg-om-gray-50 rounded-2xl px-4 py-3">
                  <img :src="(selectedStyle && selectedStyle.image) || reviewItem.image" :alt="reviewItem.title" class="w-full max-w-xs rounded-xl border border-om-gray-200 shadow-[0_8px_30px_rgb(0_0_0/0.12)] mb-4" />
                  <div class="space-y-3">
                    <div v-for="sec in settingsSummary" :key="sec.label">
                      <p class="text-[11px] font-semibold uppercase tracking-wide text-om-gray-400 mb-1">{{ sec.label }}</p>
                      <ul class="space-y-0.5">
                        <li v-for="(it, j) in sec.items" :key="j" class="flex items-start gap-1.5 text-sm text-om-gray-600">
                          <span class="mt-1.5 w-1 h-1 rounded-full bg-om-orange-500 shrink-0"></span>{{ it }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Style picker: 4 popup styles (like the public wizard chat) -->
                <div v-if="flowStep === 'style'" class="grid grid-cols-2 gap-3">
                  <button
                    v-for="st in popupStyles"
                    :key="st.id"
                    @click="pickStyle(st)"
                    :class="[
                      'bg-white rounded-xl border overflow-hidden text-left transition-all cursor-pointer hover:shadow-md',
                      selectedStyle && selectedStyle.id === st.id ? 'border-om-orange-500 ring-2 ring-om-orange-200' : 'border-om-gray-200 hover:border-om-orange-300'
                    ]"
                  >
                    <div class="aspect-video bg-om-gray-100 overflow-hidden">
                      <img :src="st.image" :alt="st.label" class="w-full h-full object-cover object-top" />
                    </div>
                  </button>
                </div>

                </div>
              </div>
            </div>

            <!-- Docked answer box: stays pinned at the bottom for every step -->
            <div class="shrink-0 px-6 pb-5 pt-1">
              <div class="max-w-2xl mx-auto">
                <!-- Step 1: the commitment question + buttons, in one block -->
                <div v-if="flowStep === 'decide'" class="bg-white rounded-2xl border border-om-gray-200 shadow-sm px-4 py-3 flex items-center justify-between gap-3">
                  <p class="text-sm font-medium text-om-gray-700">{{ reviewItem.decidePrompt }}</p>
                  <div class="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" @click="backToPlan">Maybe later</Button>
                    <Button variant="primary" @click="proceedToOffer">Continue</Button>
                  </div>
                </div>
                <!-- Final summary: approve the whole plan -->
                <div v-else-if="flowStep === 'summary'" class="bg-white rounded-2xl border border-om-gray-200 shadow-sm px-3 py-2.5 flex items-center justify-end gap-2">
                  <Button variant="ghost" @click="backToPlan">Not yet</Button>
                  <Button variant="primary" @click="approvePlan">Approve</Button>
                </div>
                <!-- Style step: pick a style (clicking one opens the editor straight away) -->
                <div v-else-if="flowStep === 'style'" class="bg-white rounded-2xl border border-om-gray-200 shadow-sm px-3 py-2.5 flex items-center justify-between gap-2">
                  <Button variant="ghost" @click="backToOffer">Back</Button>
                  <span class="text-xs text-om-gray-400">Pick a style to open the editor</span>
                </div>
                <!-- Offer / discount-code question -->
                <ChatDecisionQuestions v-else-if="flowStep === 'offer' || flowStep === 'code'" :block="adjustBlock" @continue="onAdjustContinue" @skip="onAdjustSkip" />
              </div>
            </div>
        </div>
      </div>

      <!-- Dashboard (default) -->
      <div v-else class="w-full max-w-3xl mx-auto">
        <!-- Greeting + domain -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-semibold text-om-gray-700">Welcome back, Csaba. What should we work on today?</h1>
        </div>

        <!-- New task composer (top of page): launches the full OptiMonk Agentic flow (#/agentic) -->
        <div class="mb-10">
          <div class="relative">
            <textarea
              v-model="homePrompt"
              rows="3"
              @keydown.enter.exact.prevent="startTask(homePrompt)"
              placeholder="Describe a task and the agent will take care of it..."
              class="w-full px-4 py-3 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:ring-2 focus:ring-om-orange-400 focus:border-transparent text-sm resize-none pr-12"
            ></textarea>
            <button
              @click="startTask(homePrompt)"
              :disabled="!homePrompt.trim()"
              :class="['absolute bottom-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center transition-colors', homePrompt.trim() ? 'bg-om-orange-500 text-white cursor-pointer hover:bg-om-orange-600' : 'bg-om-gray-200 text-om-gray-500 cursor-default']"
            >
              <ArrowUp :size="16" />
            </button>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span class="text-sm text-om-gray-500">Start with this:</span>
            <button
              v-for="ex in promptExamples"
              :key="ex.label"
              type="button"
              @click="homePrompt = ex.value"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-om-gray-200 text-sm text-om-gray-700 hover:border-om-orange-300 hover:bg-om-orange-50 transition-colors cursor-pointer"
            >
              <component :is="ex.icon" :size="14" class="text-om-gray-500" />
              {{ ex.label }}
            </button>
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

          <!-- Recommendation cards (ranked: top = #1 tip) -->
          <div class="flex flex-col gap-3">
            <div
              v-for="(r, i) in recommendations"
              :key="r.id"
              @click="openReview(r)"
              class="relative bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow cursor-pointer"
            >
              <!-- Confidence: top-right corner -->
              <Tag :variant="confidenceVariant(r.confidence)" size="sm" class="absolute top-4 right-4">{{ confidenceLabel(r.confidence) }}</Tag>
              <div class="flex items-start gap-3">
                <!-- Rank: far left so the eye starts on the #1 tip -->
                <div class="shrink-0 w-7 h-7 rounded-full bg-om-peach-100 text-om-orange-500 flex items-center justify-center text-sm font-semibold">
                  {{ i + 1 }}
                </div>
                <!-- Decision text: what (bold) leads, why supports, impact anchors the bottom -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-om-gray-700 leading-snug pr-28">{{ r.what }}</h3>
                  <p class="text-sm text-om-gray-500 leading-snug mt-1">{{ r.why }}</p>
                  <div class="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-2.5">
                    <span class="text-sm font-medium text-om-gray-700">Est. {{ r.impact }}</span>
                  </div>
                </div>
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
              @click="openTopic(topicChats.campaign)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Right-side chat window (active campaign + new task) -->
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

        <!-- Free-text composer (other conversational topics) -->
        <div v-if="composerOpen" class="shrink-0 p-4 pt-0">
          <div class="relative">
            <textarea
              v-model="composerText"
              rows="2"
              @keydown.enter.exact.prevent="sendComposer"
              class="w-full px-4 py-3 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 resize-none pr-12 text-sm"
              placeholder="Describe a task..."
            ></textarea>
            <button
              @click="sendComposer"
              :disabled="!composerText.trim()"
              :class="[
                'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                composerText.trim() ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
              ]"
            >
              <ArrowUp :size="16" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch, onMounted, onUnmounted, markRaw } from 'vue'
import { Sparkles, Plus, X, ArrowUp, ArrowDown, ChevronLeft, ChevronDown, Check, Mail, ShoppingCart, Home, LayoutGrid, Users, TrendingUp } from 'lucide-vue-next'

// Sidebar menu for the agentic home (Projects/Audience/Analytics are placeholders for now)
const sidebarMenu = [
  { id: 'home', label: 'Home', iconComponent: markRaw(Home) },
  { id: 'projects', label: 'Projects', iconComponent: markRaw(LayoutGrid) },
  { id: 'audience', label: 'Audience', iconComponent: markRaw(Users) },
  { id: 'analytics', label: 'Analytics', iconComponent: markRaw(TrendingUp) },
]
// Home navigates to #/agentic/home; the others are no-ops for now
const onSidebarMenu = (id) => { if (id === 'home') window.location.hash = '#/agentic/home' }

const emit = defineEmits(['start-task'])

// New-task composer suggestions — same as the OptiMonk Agentic start page (#/agentic/start)
const promptExamples = [
  { label: 'Discount Popup', value: 'Create a Discount Popup to capture more leads.', icon: markRaw(Mail) },
  { label: 'Cart Abandonment Stopper', value: 'Help me recover cart abandoners with a popup.', icon: markRaw(ShoppingCart) },
  { label: 'Get recommendation', value: 'Analyze my website and recommend the best opportunity for me.', icon: markRaw(Sparkles) },
]
const homePrompt = ref('')
// Launch the full-screen agentic flow with the given prompt (App handles the nav + message)
const startTask = (text) => {
  const msg = (text || '').trim()
  if (!msg) return
  emit('start-task', msg)
}
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Tag from '../components/shared/Tag.vue'
import Button from '../components/shared/Button.vue'
import CampaignCard from '../components/shared/CampaignCard.vue'
import ChatDecisionQuestions from '../components/onboarding/ChatDecisionQuestions.vue'
import PublicV3PopupDetailScreen from '../components/onboarding/PublicV3PopupDetailScreen.vue'

const selectedDomain = ref('reflexshop.hu')
const domains = ref(['reflexshop.hu', 'telekom.hu', '+ Add new domain'])
const domainMenuOpen = ref(false)

// ── Right-side chat window (active campaign + new task) ──
const chatOpen = ref(false)
const chatTitle = ref('')
const chatMessages = ref([])
const aiTyping = ref(false)
const decisionBlock = ref(null)
const composerOpen = ref(false)
const composerText = ref('')
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

const setDecision = (text, options) => {
  decisionBlock.value = reactive({
    activeTab: 0,
    questions: [{ text, options, selectedId: null }],
  })
  scrollChat()
}

const openTopic = async (topic) => {
  activeTopic = topic
  chatTitle.value = topic.title
  chatMessages.value = []
  decisionBlock.value = null
  composerOpen.value = false
  composerText.value = ''
  reviewItem.value = null
  chatOpen.value = true
  await pushAi(topic.intro)
  // Topics with options use a decision question; free-form topics use a text composer
  if (topic.options) {
    setDecision(topic.question, topic.options)
  } else {
    composerOpen.value = true
  }
  scrollChat()
}

const sendComposer = async () => {
  const text = composerText.value.trim()
  if (!text) return
  composerText.value = ''
  chatMessages.value.push({ role: 'user', text })
  scrollChat()
  await pushAi(activeTopic?.reply || 'Got it. I\'ll get started on that and keep you posted as I make progress.')
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


onUnmounted(() => {
  chatTimeouts.forEach((t) => clearTimeout(t))
  window.removeEventListener('hashchange', onHashChange)
})

// Chat topics that still use the conversational panel
const topicChats = {
  campaign: {
    title: 'Welcome Discount Popup',
    intro: "**Welcome Discount Popup** is your only active campaign on reflexshop.hu.\n\n**Performance (last 30 days)**\n- **Status:** Active\n- **Impressions:** 1,240\n- **Submits:** 40 (**3.2%** submit rate)\n- **Conversion uplift:** **62.10%** for visitors who saw it versus those who didn't\n- **Revenue attributed:** about **HUF 410k** from popup-influenced orders\n\n**How to read it**\nThe 62% uplift means the popup is clearly earning its place: people who engage with it buy far more often than people who don't. The weak spot is the top of the funnel. A 3.2% submit rate sits below the **4.5 to 6%** benchmark, and the data shows most visitors leave within the first 2 seconds, before they've read the offer.\n\n**Where the upside is**\nThe single biggest lever is the **headline**, since it's the first thing visitors process and it's currently action-led rather than benefit-led. Second is **trigger timing**: your popup fires on a fixed 5-second delay, but exit-intent and scroll-depth triggers tend to catch higher-intent visitors with less interruption.",
    question: 'What would you like to do?',
    options: [
      { id: 'optimize', label: 'Optimize it' },
      { id: 'analytics', label: 'View analytics' },
      { id: 'pause', label: 'Pause it' },
    ],
    responses: {
      optimize: "Good call. I'd start with a headline A/B test, it's the biggest single lever and your baseline is 3.2%. Want me to draft variants and start a 50/50 test?",
      analytics: "Here's the quick read: 1,240 impressions, 3.2% submit rate, and a 62% conversion uplift over the last period. Engagement is steady, with most of the drop-off on first-time mobile visitors. Want a deeper breakdown?",
      pause: "I can pause Welcome Discount Popup so it stops showing to visitors. It keeps all its data and you can reactivate any time. Want me to pause it now?",
    },
  },
  'new-task': {
    title: 'New task',
    intro: "Sure, I'm ready. I can build new campaigns, optimize existing ones, or dig into your data. What would you like to work on?",
    reply: "Got it. I'll get started on that and keep you posted as I make progress.",
  },
}

// Ranked recommendations. Each is glanceable: what (the step), why (a concrete
// number), expected impact, and how sure we are. Opening one shows the full review.
const recommendations = ref([
  {
    id: 'cart',
    what: 'Add an exit-intent popup on cart and checkout that offers free shipping.',
    why: '68% of your carts are abandoned, with nothing in place to win them back.',
    impact: 'HUF 1.4M to 2.1M / mo',
    confidence: 'high',
    image: '/campaigns/cart-abandonment-stopper.png',
  },
  {
    id: 'email-capture',
    what: 'Add a welcome popup that asks new visitors for their email for 10% off.',
    why: "You're barely collecting emails from new visitors. Sign-up rate is just 0.9% today.",
    impact: '+120 to 180 sign-ups / mo',
    confidence: 'medium',
    image: '/campaigns/smart-discount-popup-desktop.png',
  },
  {
    id: 'ab-test',
    what: 'A/B test a benefit-led headline on your Welcome Discount Popup.',
    why: 'It converts at 3.2%, below the 4.5 to 6% benchmark for this popup type.',
    impact: '+6 to 13 sign-ups / 1,240 views',
    confidence: 'low',
    image: '/campaigns/smart-discount-popup-desktop.png',
  },
])

// Honest about uncertainty: low confidence reads as "worth testing", not a promise.
const confidenceLabel = (c) => ({ high: 'High confidence', medium: 'Medium confidence', low: 'Worth testing' }[c] || 'Worth testing')
const confidenceVariant = (c) => ({ high: 'green-light', medium: 'yellow', low: 'gray-muted' }[c] || 'gray-muted')

// ── Expanded review (the full thing) ──
// Per recommendation: the artifact's editable settings, the data behind the "why"
// (correctable), and the impact reasoning.
const reviewData = {
  cart: {
    title: 'Recover abandoned carts',
    reasoning: "68% of carts are abandoned with nothing in place to win them back. Unexpected shipping cost is the top reason visitors give (named in 49% of exit surveys), and mobile abandons worse than desktop (74% versus 58%). An exit-intent free-shipping offer addresses the number one objection at the exact moment of hesitation.",
    funnel: {
      stages: [
        { label: 'Added to cart', value: '1,420', percent: 100 },
        { label: 'Reached checkout', value: '980', percent: 69 },
        { label: 'Purchased', value: '454', percent: 32 },
      ],
      takeaway: { highlight: '966 carts (68%)', text: 'are abandoned every month before purchase.' },
    },
    impactReasoning: "Exit-intent recovery wins back 10 to 15% of abandoning carts across comparable stores. At roughly 966 abandoned carts a month that's about 96 to 145 recovered. At your HUF 14,200 average order value, that's about HUF 1.4M to 2.1M in added monthly revenue. The email fallback typically recovers another 4 to 6% over the following week.",
    decidePrompt: 'Want to tackle your 68% cart abandonment?',
    useCase: { id: 'cart-abandonment', label: 'Cart Abandonment Stopper' },
  },
  'email-capture': {
    title: 'Capture emails from new visitors',
    reasoning: "You're barely collecting emails from new visitors, just 0.9% sign up today, so most leave without you ever reaching them again. A welcome popup offering 10% off in exchange for an email is the proven way to capture first-time visitors. The benchmark for this popup type is 4.5 to 6%.",
    funnel: {
      stages: [
        { label: 'New visitors', value: '9,800', percent: 100 },
        { label: 'Email sign-ups', value: '88', percent: 0.9 },
      ],
      takeaway: { highlight: 'Only 0.9% sign up', text: 'today, far below the 4.5 to 6% benchmark for this popup type.' },
    },
    impactReasoning: "Moving from 0.9% toward a conservative 2 to 2.5% adds roughly 120 to 180 sign-ups a month at your current new-visitor volume. I'd treat the exact lift as medium confidence until we see the first week of data, since discount sensitivity varies by category.",
    decidePrompt: 'Want to start capturing emails from your new visitors?',
    useCase: { id: 'newsletter', label: 'Newsletter Signup Popup' },
  },
  'ab-test': {
    title: 'A/B test your popup headline',
    reasoning: "Your Welcome Discount Popup converts at 3.2%, below the 4.5 to 6% benchmark, and most drop-off happens in the first 2 seconds. That points to the headline: it currently leads with the action ('Sign up for our newsletter') rather than the reward. Benefit-led headlines consistently outperform action-led ones.",
    funnel: {
      stages: [
        { label: 'Popup impressions', value: '1,240', percent: 100 },
        { label: 'Submits', value: '40', percent: 3.2 },
      ],
      takeaway: { highlight: '3.2% submit rate', text: 'is below the 4.5 to 6% benchmark, and most drop-off happens in the first 2 seconds.' },
    },
    impactReasoning: "A headline test typically lifts sign-ups 15 to 30%. On a 3.2% baseline that's a move to 3.7 to 4.2%, or 6 to 13 extra sign-ups per 1,240 views. This is worth testing rather than a sure thing, so I'd run a 50/50 split and let statistical significance decide the winner.",
    decidePrompt: 'Want to test a stronger headline on your popup?',
    useCase: { id: 'newsletter', label: 'Welcome Discount Popup' },
  },
}


const reviewItem = ref(null)
const adjustBlock = ref(null)   // the current question block (reuses ChatDecisionQuestions)
const flowStep = ref('decide')  // 'decide' (commit) → 'offer' (tailor) → 'style' (pick a look)

// 4 popup styles to pick from after the offer (same as the public wizard chat)
const popupStyles = [
  { id: 'v1', label: 'Bold discount', image: '/templates/popup-style-1.png' },
  { id: 'v2', label: 'Minimal capture', image: '/templates/popup-style-2.png' },
  { id: 'v3', label: 'Classic offer', image: '/templates/popup-style-3.png' },
  { id: 'v4', label: 'Playful gift', image: '/templates/popup-style-4.png' },
]
const selectedStyle = ref(null)
const chosenOffer = ref('')    // captured once, since adjustBlock is replaced for the code step
const discountCode = ref('')   // the code given in the chat (passed to the editor so it isn't asked again)

// The unfolding conversation after the pitch: the user's choices and the agent's replies
const trail = ref([])
const pushAgent = (text) => trail.value.push({ role: 'ai', text })
const pushUser = (text) => trail.value.push({ role: 'user', text })

// Keep the chat pinned to the bottom whenever new content appears
const reviewScrollRef = ref(null)
const scrollReviewToBottom = () => nextTick(() => {
  const el = reviewScrollRef.value
  if (el) el.scrollTop = el.scrollHeight
})
watch(flowStep, (step) => { if (step !== 'decide') scrollReviewToBottom() })
watch(() => trail.value.length, scrollReviewToBottom)

// Annotate funnel stages with the relative drop from the previous stage.
const funnelWithDrops = (stages) => stages.map((s, i) => ({
  ...s,
  drop: i === 0 ? null : Math.round(((stages[i - 1].percent - s.percent) / stages[i - 1].percent) * 100),
}))

// The only tailoring question: the offer type, with a follow-up value for discounts.
const offerTypeOptions = () => [
  { id: 'percent', label: 'Percentage discount', allowInput: true, inputPlaceholder: 'How many %? e.g. 10', inputSuffix: '% off', otherValue: '' },
  { id: 'amount', label: 'Fixed amount off', allowInput: true, inputPlaceholder: 'How much off? e.g. HUF 2,000', inputSuffix: ' off', otherValue: '' },
  { id: 'free-shipping', label: 'Free shipping', optionalInput: true, inputPlaceholder: 'Over what cart value? Leave blank for no minimum', inputPrefix: 'Free shipping over ', otherValue: '' },
  { id: 'free-gift', label: 'Free gift' },
  { id: 'other', label: 'Something else', allowInput: true, inputPlaceholder: 'Type a custom offer', otherValue: '' },
]

// Step 2 (only after the user commits): the offer tailoring. No preselection.
const buildOfferBlock = () => reactive({
  activeTab: 0,
  questions: [
    { id: 'offer', tabLabel: 'Offer', text: 'What offer do you currently use?',
      options: offerTypeOptions(), selectedId: null, perOptionInput: true },
  ],
})

// Current value of a tailoring question (option label, custom text, or free-text answer).
const picked = (qId) => {
  const q = adjustBlock.value?.questions.find((x) => x.id === qId)
  if (!q) return ''
  if (q.inputOnly) return q.otherValue || ''
  const opt = q.options.find((o) => o.id === q.selectedId)
  if (!opt) return ''
  const val = q.perOptionInput ? opt.otherValue : q.otherValue
  if ((opt.allowInput || opt.optionalInput) && val) return `${opt.inputPrefix || ''}${val}${opt.inputSuffix || ''}`
  return opt.label
}

const openReview = (r) => {
  const data = reviewData[r.id]
  reviewItem.value = { ...r, ...data }
  flowStep.value = 'decide'
  adjustBlock.value = null
  selectedStyle.value = null
  chosenOffer.value = ''
  discountCode.value = ''
  showEditor.value = false
  activated.value = false
  trail.value = []
  chatOpen.value = false
}

// A discount code question, asked only after a discount-type offer
const buildCodeBlock = () => reactive({
  activeTab: 0,
  questions: [
    { id: 'code', tabLabel: 'Code', text: 'What discount code should it use?',
      options: [], inputOnly: true, inputPlaceholder: 'e.g. SAVE10', otherValue: '' },
  ],
})

let offerTrailLen = 0

// Step 1 "Continue": record the commitment in the chat, then ask the offer question
const proceedToOffer = () => {
  pushAgent(reviewItem.value.decidePrompt)
  pushUser('Yes, set it up')
  pushAgent('Great. One quick thing first — what offer do you currently run?')
  offerTrailLen = trail.value.length
  adjustBlock.value = buildOfferBlock()
  flowStep.value = 'offer'
}

const backToPlan = () => {
  reviewItem.value = null
}

const goToStyle = () => {
  pushAgent("Nice. Now pick a style you like and I'll build it.")
  flowStep.value = 'style'
}

// Offer (and, for discounts, the code) drive the next step
const onAdjustContinue = () => {
  if (flowStep.value === 'offer') {
    chosenOffer.value = picked('offer')
    pushUser(`Offer: ${chosenOffer.value}`)
    const sel = adjustBlock.value.questions[0].selectedId
    if (sel === 'percent' || sel === 'amount') {
      // Discount → ask the code right here, before the style step
      pushAgent('Got it. What discount code should it use?')
      adjustBlock.value = buildCodeBlock()
      flowStep.value = 'code'
    } else {
      discountCode.value = ''
      goToStyle()
    }
    return
  }
  // code step
  discountCode.value = picked('code')
  pushUser(`Code: ${discountCode.value}`)
  goToStyle()
}
const onAdjustSkip = () => {
  if (flowStep.value === 'offer') {
    pushUser('Use your best guess for the offer')
    goToStyle()
    return
  }
  // code step skipped — let the editor handle the coupon
  discountCode.value = ''
  pushUser('Auto-generate a code')
  goToStyle()
}

// Style chosen → record the picked design (with the 4 options) in the chat, then open the editor
const pickStyle = (st) => {
  selectedStyle.value = st
  trail.value.push({ role: 'popup-versions', versions: popupStyles, selectedId: st.id })
  pushAgent('Perfect. Opening the editor so you can fine-tune the design and settings.')
  showEditor.value = true
}

// Style step "Back" → return to the offer question, dropping everything answered after it
const backToOffer = () => {
  trail.value.splice(offerTrailLen)
  adjustBlock.value = buildOfferBlock()
  flowStep.value = 'offer'
}

// Continue from the style step: open the full popup editor (the public-wizard-v2 editor screen)
const showEditor = ref(false)
// The editor's chat continues the SAME conversation — seed it with everything so far
const editorChat = computed(() => {
  const r = reviewItem.value
  if (!r) return [...trail.value]
  const pitch = [{ role: 'ai', text: `${r.title}. ${r.reasoning}` }]
  if (r.funnel) {
    const f = r.funnel
    const flow = f.stages.map((s) => `${s.label} ${s.value}`).join(' → ')
    pitch.push({ role: 'ai', text: `Where visitors drop off: ${flow}. ${f.takeaway?.highlight || ''} ${f.takeaway?.text || ''}`.trim() })
  }
  pitch.push({ role: 'ai', text: `Expected impact: ${r.impact} (${confidenceLabel(r.confidence)}). ${r.impactReasoning}` })
  return [...pitch, ...trail.value]
})
// After finishing in the editor, come back to the chat for a final review + approval
const onPublished = () => {
  // Targeting was reviewed and confirmed inside the editor chat — go straight to success
  showEditor.value = false
  flowStep.value = 'success'
}
// Approve the whole plan → success screen, where the campaign can be activated
const activated = ref(false)
const approvePlan = () => { flowStep.value = 'success' }
const activateCampaign = () => { activated.value = true }

// Everything from the campaign settings page, consolidated for the chat summary
const settingsSummary = computed(() => [
  { label: 'Offer', items: [chosenOffer.value || '—'] },
  { label: 'Style', items: [selectedStyle.value?.label || '—'] },
  ...(discountCode.value ? [{ label: 'Discount code', items: [discountCode.value] }] : []),
  { label: 'Triggers', items: ['On exit-intent', 'After 20s of inactivity'] },
  { label: 'Frequency', items: ['Max 2 times per visitor', 'At least 1 hour between impressions', 'Stops once a visitor converts'] },
  { label: 'Audience', items: ['Visitors who spent 10s+ on the page', 'URL contains cart, checkout, or category'] },
  { label: 'Goal', items: ['Conversions (form submit)'] },
  { label: 'Integration', items: ['Mailchimp'] },
  { label: 'Schedule', items: ['Runs continuously, no end date'] },
])

// Campaign settings reviewed in the editor chat after "Done".
// Mirrors the campaign settings page (#/campaign-detail/settings, CampaignPageV1View):
// each section's title + subtitle (closed accordion) AND its configured values (open accordion).
const campaignSettings = [
  {
    title: 'Triggering',
    description: 'When would you like this campaign to show up?',
    details: [
      'On exit-intent — when a visitor is about to leave your site',
      'Or after 20 seconds of inactivity (desktop and mobile)',
    ],
  },
  {
    title: 'Frequency',
    description: 'How many times should this campaign appear?',
    details: [
      'Appears a maximum of 2 times per visitor',
      'At least 1 hour between two impressions',
      'Stops showing after a visitor has converted',
    ],
  },
  {
    title: 'Targeting',
    description: 'Who should see this campaign?',
    details: [
      'Spent on pages — at least 10 seconds on the current subpage',
      'Current page / URL — contains cart, shop_cart, shop_reg, or shop_category',
    ],
  },
  // Integrations and Email notification are NOT shown up front — they're asked as
  // questions in the editor chat and only appear once the user has answered.
]

// Dev affordance: open a review straight from the URL (?review=<id>) so any
// state can be screenshotted for review. Harmless in production (no-op without the param).
// ── Routing: each flow page gets a unique hash under #/agentic/home ──
//   #/agentic/home               → plan list
//   #/agentic/home/<id>          → recommendation review (chat)
//   #/agentic/home/<id>/editor   → popup editor
//   #/agentic/home/<id>/success  → success screen
const ROUTE_BASE = 'agentic/home'
const seedTrailToEditor = () => {
  selectedStyle.value = popupStyles[0]
  chosenOffer.value = '10% off'
  discountCode.value = 'SAVE10'
  trail.value = [
    { role: 'user', text: 'Yes, set it up' },
    { role: 'ai', text: 'Great. One quick thing first — what offer do you currently run?' },
    { role: 'user', text: 'Offer: 10% off' },
    { role: 'ai', text: 'Got it. What discount code should it use?' },
    { role: 'user', text: 'Code: SAVE10' },
    { role: 'ai', text: "Nice. Now pick a style you like and I'll build it." },
    { role: 'popup-versions', versions: popupStyles, selectedId: popupStyles[0].id },
    { role: 'ai', text: 'Perfect. Opening the editor so you can fine-tune the design and settings.' },
  ]
}

const currentRoute = computed(() => {
  if (!reviewItem.value) return ROUTE_BASE
  const id = reviewItem.value.id
  if (showEditor.value) return `${ROUTE_BASE}/${id}/editor`
  if (flowStep.value === 'success') return `${ROUTE_BASE}/${id}/success`
  return `${ROUTE_BASE}/${id}`
})

let internalNav = false
const syncRoute = () => {
  const target = '#/' + currentRoute.value
  if (window.location.hash === target) return
  internalNav = true
  window.location.hash = target
}
const applyRoute = () => {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const parts = hash.split('/') // ['agentic', 'home', '<id>', '<sub>']
  if (parts[0] !== 'agentic' || parts[1] !== 'home') return
  const id = parts[2]
  const sub = parts[3]
  if (!id) { reviewItem.value = null; return }
  const r = recommendations.value.find((x) => x.id === id)
  if (!r || !reviewData[id]) return
  if (!reviewItem.value || reviewItem.value.id !== id) openReview(r)
  if (sub === 'editor') {
    if (!trail.value.length) seedTrailToEditor()
    showEditor.value = true
  } else if (sub === 'success') {
    if (!trail.value.length) seedTrailToEditor()
    showEditor.value = false
    flowStep.value = 'success'
  } else {
    showEditor.value = false
  }
}
watch(currentRoute, syncRoute)
const onHashChange = () => {
  if (internalNav) { internalNav = false; return }
  applyRoute()
}

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
  const params = new URLSearchParams(window.location.search)
  const id = params.get('review')
  if (!id || !reviewData[id]) { applyRoute(); return }
  const r = recommendations.value.find((x) => x.id === id)
  if (r) openReview(r)
  const step = params.get('step')
  if (step === 'editor' || step === 'targeting') {
    // step=targeting opens the editor, which then jumps to the in-chat targeting review
    selectedStyle.value = popupStyles[0]
    chosenOffer.value = '10% off'
    discountCode.value = 'SAVE10'
    trail.value.push(
      { role: 'user', text: 'Yes, set it up' },
      { role: 'ai', text: 'Great. One quick thing first — what offer do you currently run?' },
      { role: 'user', text: 'Offer: 10% off' },
      { role: 'ai', text: 'Got it. What discount code should it use?' },
      { role: 'user', text: 'Code: SAVE10' },
      { role: 'ai', text: "Nice. Now pick a style you like and I'll build it." },
      { role: 'popup-versions', versions: popupStyles, selectedId: popupStyles[0].id },
      { role: 'ai', text: 'Perfect. Opening the editor so you can fine-tune the design and settings.' },
    )
    showEditor.value = true
  } else if (step === 'success') {
    selectedStyle.value = popupStyles[0]
    flowStep.value = 'success'
  } else if (step === 'code') {
    trail.value.push(
      { role: 'user', text: 'Yes, set it up' },
      { role: 'ai', text: 'Great. One quick thing first — what offer do you currently run?' },
      { role: 'user', text: 'Offer: 10% off' },
      { role: 'ai', text: 'Got it. What discount code should it use?' },
    )
    adjustBlock.value = buildCodeBlock()
    flowStep.value = 'code'
  } else if (step === 'summary') {
    // Preview the full conversation up to the published summary
    selectedStyle.value = popupStyles[0]
    chosenOffer.value = '10% off'
    discountCode.value = 'SAVE10'
    trail.value.push(
      { role: 'user', text: 'Yes, set it up' },
      { role: 'ai', text: 'Great. One quick thing first — what offer do you currently run?' },
      { role: 'user', text: 'Offer: 10% off' },
      { role: 'ai', text: 'Got it. What discount code should it use?' },
      { role: 'user', text: 'Code: SAVE10' },
      { role: 'ai', text: "Nice. Now pick a style you like and I'll build it." },
      { role: 'popup-versions', versions: popupStyles, selectedId: popupStyles[0].id },
      { role: 'ai', text: 'Perfect. Opening the editor so you can fine-tune the design and settings.' },
      { role: 'ai', text: "Here's the finished popup and everything that'll go live. Take a look and approve when you're happy:" },
    )
    flowStep.value = 'summary'
  } else if (step) {
    if (step === 'offer' || step === 'style') adjustBlock.value = buildOfferBlock()
    flowStep.value = step
  }
})

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
