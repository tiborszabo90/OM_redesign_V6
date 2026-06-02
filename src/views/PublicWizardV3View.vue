<template>
  <!-- Step 1: URL or prompt input -->
  <div v-if="step === 'url'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-2xl">
      <div class="flex justify-center mb-10">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
      </div>
      <h1 class="text-4xl font-semibold text-om-gray-700 text-center mb-2">Website optimization magic.</h1>
      <p class="text-om-gray-500 text-center mb-6">
        {{ inputMode === 'url' ? 'Add your website URL and get your tailored optimization ideas in 2 minutes.' : 'Tell us what you want to build and we’ll get you started.' }}
      </p>

      <!-- Input mode toggle -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex p-1.5 rounded-2xl bg-om-gray-100 border border-om-gray-200 gap-1">
          <button
            @click="inputMode = 'url'"
            :class="[
              'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer',
              inputMode === 'url' ? 'bg-white text-om-orange-500 shadow-md' : 'text-om-gray-700 hover:text-om-gray-900'
            ]"
          >
            Get recommendations
          </button>
          <button
            @click="inputMode = 'prompt'"
            :class="[
              'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer',
              inputMode === 'prompt' ? 'bg-white text-om-orange-500 shadow-md' : 'text-om-gray-700 hover:text-om-gray-900'
            ]"
          >
            I have an idea
          </button>
        </div>
      </div>

      <form @submit.prevent="handleInitialSubmit" class="flex flex-col gap-3">
        <!-- URL mode -->
        <div v-if="inputMode === 'url'" class="flex gap-2">
          <input
            v-model="url"
            type="text"
            placeholder="enter website URL"
            class="flex-1 h-12 px-4 rounded-xl border border-om-gray-200 text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:ring-2 focus:ring-om-orange-400 focus:border-transparent text-sm"
            autofocus
          />
          <button
            type="submit"
            :disabled="!url.trim()"
            class="h-12 px-6 rounded-xl bg-om-orange-500 text-white font-medium text-sm whitespace-nowrap transition-opacity disabled:opacity-40 hover:bg-om-orange-600 cursor-pointer disabled:cursor-not-allowed"
          >
            Get started
          </button>
        </div>

        <!-- Prompt mode -->
        <div v-else class="flex flex-col gap-3">
          <div class="relative">
            <textarea
              v-model="prompt"
              rows="4"
              :placeholder="animatedPlaceholder"
              class="w-full px-4 py-3 rounded-xl border border-om-gray-200 text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:ring-2 focus:ring-om-orange-400 focus:border-transparent text-sm resize-none pr-12"
              autofocus
            ></textarea>
            <button
              type="submit"
              :disabled="!prompt.trim()"
              :class="[
                'absolute bottom-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                prompt.trim() ? 'bg-om-orange-500 text-white cursor-pointer hover:bg-om-orange-600' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
              ]"
            >
              <ArrowUp :size="16" />
            </button>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-2">
            <span class="text-sm text-om-gray-500">Start with this:</span>
            <button
              v-for="ex in promptExamples"
              :key="ex.label"
              type="button"
              @click="prompt = ex.value"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-om-gray-200 text-sm text-om-gray-700 hover:scale-105 transition-transform cursor-pointer"
            >
              <component :is="ex.icon" :size="14" class="text-om-gray-500" />
              {{ ex.label }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Step 2: Analysis (scanner + discovery list) -->
  <div v-else-if="step === 'analysis'" class="h-screen-safe bg-white pl-25">
    <div class="pt-8 pl-8 pb-3">
      <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
    </div>
    <div class="flex items-start justify-center pt-12 px-4 sm:px-6 md:px-8 xl:px-12">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-6xl w-full">
        <div class="shrink-0 -mt-10">
          <WebsiteScanAnimation />
        </div>
        <div class="flex-1 w-full md:w-auto md:min-w-72 lg:min-w-80 xl:max-w-72 2xl:max-w-80 md:-mt-6">
          <div class="mb-6 text-center md:text-left">
            <h2 class="text-xl sm:text-2xl font-semibold text-om-gray-700">Analyzing your website</h2>
          </div>
          <div class="space-y-2">
            <template v-for="p in analysisPhases" :key="p.id">
              <transition name="slide-in">
                <div v-if="discoveries[p.id] || currentlyAnalyzing === p.id" class="flex items-center gap-3 py-1.5">
                  <div v-if="discoveries[p.id]" class="w-6 h-6 rounded-full bg-om-orange-500 flex items-center justify-center shrink-0">
                    <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div v-else class="w-6 h-6 rounded-full border-2 border-om-orange-500 border-t-transparent animate-spin shrink-0"></div>
                  <span class="text-sm text-om-gray-700">{{ p.label }}</span>
                </div>
              </transition>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 2b: Full-width chat (after "I have an idea" submit) -->
  <div v-else-if="step === 'chat'" class="min-h-screen-safe h-screen-safe bg-white flex flex-col px-6">
    <div class="shrink-0 flex justify-center pt-6 pb-2">
      <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
    </div>
    <div class="flex-1 flex flex-col min-h-0 w-full mx-auto transition-[max-width] duration-300" :class="chatWide ? 'max-w-6xl' : 'max-w-180'">
      <div ref="chatScrollRef" class="flex-1 overflow-y-auto py-6 space-y-3 chat-fade-mask">
        <template v-for="(m, i) in chatMessages" :key="i">
          <!-- Skip 'questions' role here — rendered as a docked block above the input -->
          <div v-if="m.role === 'questions'" class="hidden"></div>
          <!-- 4 popup version cards: 2x2 grid in wide chat (matches ChatPanel ai-images wide layout) -->
          <div v-else-if="m.role === 'popup-versions'" class="w-full">
            <div class="grid grid-cols-2 gap-4 pb-2 max-w-4xl mx-auto">
              <button
                v-for="v in m.versions"
                :key="v.id"
                @click="onPopupVersionPick(i, v)"
                :class="[
                  'bg-white rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg origin-center',
                  m.selectedId === v.id
                    ? 'border-om-orange-500 ring-2 ring-om-orange-200'
                    : 'border-om-gray-200 hover:border-om-orange-300'
                ]"
              >
                <div class="aspect-video bg-om-gray-100 overflow-hidden">
                  <img :src="v.image" :alt="v.label" class="w-full h-full object-cover object-top" />
                </div>
              </button>
            </div>
          </div>
          <!-- User / AI text bubble — stays narrow (centered) even in wide mode -->
          <div
            v-else
            class="flex mx-auto w-full"
            :class="[
              chatWide ? 'max-w-180' : '',
              m.role === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              class="px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap"
              :class="m.role === 'user'
                ? 'bg-om-peach-100 text-om-gray-700 rounded-br-md'
                : 'bg-om-gray-100 text-om-gray-700 rounded-bl-md'"
            >{{ m.text }}</div>
          </div>
        </template>
        <div v-if="aiTyping" class="flex justify-start mx-auto w-full" :class="chatWide ? 'max-w-180' : ''">
          <div class="px-4 py-2.5 rounded-2xl rounded-bl-md bg-om-gray-100 flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse"></span>
            <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></span>
            <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></span>
          </div>
        </div>
      </div>
      <div class="shrink-0 pb-6 pt-2 flex flex-col gap-1.5 w-full mx-auto" :class="chatWide ? 'max-w-180' : ''">
        <!-- When a question is active it replaces the input; otherwise show the input -->
        <ChatDecisionQuestions
          v-if="activeQuestionsBlock"
          :block="activeQuestionsBlock"
          @skip="onQuestionsSkip(activeQuestionsIdx)"
          @continue="onQuestionsContinue(activeQuestionsIdx)"
        />

        <!-- Input -->
        <div v-else class="relative">
          <textarea
            v-model="chatInput"
            rows="3"
            :placeholder="aiTyping ? 'AI is typing…' : 'Continue the conversation…'"
            :disabled="aiTyping"
            @keydown.enter.exact.prevent="handleChatSend"
            :class="[
              'w-full px-4 py-3 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 resize-none pr-12 bg-white',
              aiTyping ? 'opacity-60 cursor-not-allowed' : ''
            ]"
          ></textarea>
          <button
            @click="handleChatSend"
            :disabled="!chatInput.trim() || aiTyping"
            :class="[
              'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              (chatInput.trim() && !aiTyping) ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
            ]"
          >
            <ArrowUp :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 3: Recommendation (own duplicate, no longer shared) -->
  <PublicV3RecommendationScreen
    v-else-if="step === 'wizard'"
    :url="url"
    :brand-name="brandName"
    @select="handleSelectUseCase"
  />

  <!-- Step 4: Popup detail (steps + chat editor) -->
  <PublicV3PopupDetailScreen
    v-else
    :use-case="selectedUseCase"
    :generation-prompt="generationPrompt"
    :select-loading="selectLoading"
    :initial-chat-messages="chatMessages"
    @back="generationPrompt ? (step = 'url') : (step = 'wizard')"
  />

  <!-- Registration modal shown on the V3 chat step after picking a popup version -->
  <RegistrationModal v-model="showRegistrationModal" @register="completeChatRegistration" />
</template>

<script setup>
import { computed, ref, reactive, onMounted, onUnmounted, markRaw } from 'vue'
import { ArrowUp, Mail, ShoppingCart, CircleDot } from 'lucide-vue-next'

const promptExamples = [
  { label: 'Discount Popup', value: 'Create a Discount Popup to capture more leads.', icon: markRaw(Mail) },
  { label: 'Cart Abandonment Stopper', value: 'Help me recover cart abandoners with a popup.', icon: markRaw(ShoppingCart) },
  { label: 'Lucky Wheel', value: 'Create a Lucky Wheel to gamify email signups.', icon: markRaw(CircleDot) },
]
import PublicV3RecommendationScreen from '../components/onboarding/PublicV3RecommendationScreen.vue'
import PublicV3PopupDetailScreen from '../components/onboarding/PublicV3PopupDetailScreen.vue'
import RegistrationModal from '../components/onboarding/RegistrationModal.vue'
import ChatDecisionQuestions from '../components/onboarding/ChatDecisionQuestions.vue'
import WebsiteScanAnimation from '../components/illustrations/WebsiteScanAnimation.vue'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

defineEmits(['task-created', 'navigate-to', 'phase-changed', 'menu-click', 'registration-completed'])

const step = ref('url')
const inputMode = ref('url') // 'url' | 'prompt'
const url = ref('')
const prompt = ref('')
const selectedUseCase = ref(null)
const generationPrompt = ref('')
const selectLoading = ref(false)

const handleSelectUseCase = (useCase) => {
  selectedUseCase.value = useCase
  generationPrompt.value = ''
  selectLoading.value = true
  step.value = 'detail'
}

// ── Animated placeholder for prompt mode ──
const placeholderSuggestions = [
  'I want to capture more emails from first-time visitors...',
  'Reduce cart abandonment on my checkout page...',
  'Create a popup that boosts mobile conversion...',
  'Offer a 10% welcome discount for new visitors...',
  'Surface social proof on product pages...',
]
const placeholderIdx = ref(0)
const placeholderText = ref('')
let placeholderTimeout = null
const animatedPlaceholder = computed(() => placeholderText.value || 'Describe your goal...')

const typePlaceholder = (text, i = 0) => {
  if (i <= text.length) {
    placeholderText.value = text.slice(0, i)
    placeholderTimeout = setTimeout(() => typePlaceholder(text, i + 1), 45)
  } else {
    placeholderTimeout = setTimeout(() => erasePlaceholder(text, text.length), 1800)
  }
}
const erasePlaceholder = (text, i) => {
  if (i >= 0) {
    placeholderText.value = text.slice(0, i)
    placeholderTimeout = setTimeout(() => erasePlaceholder(text, i - 1), 25)
  } else {
    placeholderIdx.value = (placeholderIdx.value + 1) % placeholderSuggestions.length
    placeholderTimeout = setTimeout(() => typePlaceholder(placeholderSuggestions[placeholderIdx.value]), 250)
  }
}

onMounted(() => {
  typePlaceholder(placeholderSuggestions[0])
})

const brandName = computed(() => {
  if (!url.value) return 'Telekom'
  try {
    const u = url.value.startsWith('http') ? url.value : `https://${url.value}`
    const host = new URL(u).hostname.replace(/^www\./, '')
    const root = host.split('.')[0]
    return root ? root.charAt(0).toUpperCase() + root.slice(1) : 'Telekom'
  } catch {
    return 'Telekom'
  }
})

// ── Analysis state ──
const analysisPhases = [
  { id: 'dom', label: 'Reading your DOM…' },
  { id: 'brand', label: 'Detecting your brand style…' },
  { id: 'traffic', label: 'Analyzing your traffic sources…' },
  { id: 'opportunities', label: 'Finding conversion opportunities…' },
]
const currentlyAnalyzing = ref(null)
const discoveries = reactive({ dom: false, brand: false, traffic: false, opportunities: false })
const analysisTimeouts = []

const resetAnalysis = () => {
  analysisPhases.forEach((p) => { discoveries[p.id] = false })
  currentlyAnalyzing.value = null
  analysisTimeouts.splice(0).forEach((t) => clearTimeout(t))
}

const runAnalysis = () => {
  resetAnalysis()
  analysisTimeouts.push(setTimeout(() => { currentlyAnalyzing.value = 'dom' }, 400))
  analysisTimeouts.push(setTimeout(() => { discoveries.dom = true; currentlyAnalyzing.value = 'brand' }, 2200))
  analysisTimeouts.push(setTimeout(() => { discoveries.brand = true; currentlyAnalyzing.value = 'traffic' }, 4200))
  analysisTimeouts.push(setTimeout(() => { discoveries.traffic = true; currentlyAnalyzing.value = 'opportunities' }, 6200))
  analysisTimeouts.push(setTimeout(() => { discoveries.opportunities = true; currentlyAnalyzing.value = null }, 8200))
  analysisTimeouts.push(setTimeout(() => { step.value = 'wizard' }, 10200))
}

// ── Step transitions ──
const handleInitialSubmit = () => {
  if (inputMode.value === 'url') {
    if (!url.value.trim()) return
    step.value = 'analysis'
    runAnalysis()
  } else {
    if (!prompt.value.trim()) return
    // Prompt mode: enter full-width chat flow
    chatMessages.value = [{ role: 'user', text: prompt.value.trim() }]
    step.value = 'chat'
    runChatFlow()
  }
}

// ── Full-width chat flow (after "I have an idea") ──
const chatMessages = ref([])
const chatInput = ref('')
const aiTyping = ref(false)
const chatScrollRef = ref(null)
const chatTimeouts = []
let chatStage = 0

const activeQuestionsIdx = computed(() => chatMessages.value.findIndex((m) => m.role === 'questions' && !m.finalized))
const activeQuestionsBlock = computed(() => activeQuestionsIdx.value >= 0 ? chatMessages.value[activeQuestionsIdx.value] : null)
const chatWide = computed(() => chatMessages.value.some((m) => m.role === 'popup-versions'))

const waitMs = (ms) => new Promise((resolve) => {
  const t = setTimeout(resolve, ms)
  chatTimeouts.push(t)
})

const scrollChat = () => {
  setTimeout(() => {
    if (chatScrollRef.value) chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
  }, 30)
}

const streamChatAi = async (text, charDelay = 18) => {
  aiTyping.value = true
  await waitMs(400)
  aiTyping.value = false
  chatMessages.value.push({ role: 'ai', text: '' })
  const idx = chatMessages.value.length - 1
  for (let i = 0; i <= text.length; i++) {
    await waitMs(charDelay)
    chatMessages.value[idx].text = text.slice(0, i)
    scrollChat()
  }
}

const decisionQuestions = [
  {
    tabLabel: 'Lead type',
    text: 'Are you collecting emails, SMS, or both?',
    options: [
      { id: 'email', label: 'Email only', description: 'Build your email list for newsletters and offers.' },
      { id: 'sms', label: 'SMS only', description: 'Collect phone numbers for SMS marketing.' },
      { id: 'both', label: 'Both email and SMS', description: 'Capture both for multi-channel campaigns.' },
    ],
  },
  {
    tabLabel: 'Target audience',
    text: 'Who should see this popup?',
    options: [
      { id: 'new', label: 'New visitors', description: 'First-time visitors who never engaged with you yet.' },
      { id: 'returning', label: 'Returning visitors', description: 'People who already know your brand or store.' },
      { id: 'cart', label: 'Cart abandoners', description: 'Visitors who added something but did not check out.' },
      { id: 'everyone', label: 'Everyone', description: 'Show to all visitors regardless of behavior.' },
      { id: 'other', label: 'Other', description: 'Describe your own audience.', allowInput: true, inputPlaceholder: 'Describe your audience' },
    ],
  },
]

const runChatFlow = async () => {
  chatStage = 0
  scrollChat()
  await waitMs(500)
  await streamChatAi("Nice idea! Two quick questions to tailor this for you.")
  await waitMs(400)
  chatMessages.value.push({
    role: 'questions',
    activeTab: 0,
    finalized: false,
    questions: decisionQuestions.map((q) => ({ ...q, selectedId: null, otherValue: '' })),
  })
  scrollChat()
}

const finalizeQuestionsBlock = async (msgIdx) => {
  const m = chatMessages.value[msgIdx]
  m.finalized = true
  const summary = m.questions
    .map((q) => {
      const opt = q.options.find((o) => o.id === q.selectedId)
      if (!opt) return `${q.tabLabel}: Skipped`
      return `${q.tabLabel}: ${opt.allowInput ? (q.otherValue || opt.label) : opt.label}`
    })
    .join(' · ')
  chatMessages.value.push({ role: 'user', text: summary })
  scrollChat()
  await waitMs(500)
  await streamChatAi('Got it. Drop your website URL so I can take a quick look.')
}

const onQuestionsContinue = async (msgIdx) => {
  const m = chatMessages.value[msgIdx]
  if (m.finalized) return
  const current = m.questions[m.activeTab]
  if (!current.selectedId) return
  if (m.activeTab < m.questions.length - 1) {
    m.activeTab++
    return
  }
  await finalizeQuestionsBlock(msgIdx)
}

const onQuestionsSkip = async (msgIdx) => {
  const m = chatMessages.value[msgIdx]
  if (m.finalized) return
  m.questions[m.activeTab].selectedId = null
  if (m.activeTab < m.questions.length - 1) {
    m.activeTab++
    return
  }
  await finalizeQuestionsBlock(msgIdx)
}

const popupVersions = [
  { id: 'v1', label: 'Bold discount', image: '/templates/popup-style-1.png' },
  { id: 'v2', label: 'Minimal capture', image: '/templates/popup-style-2.png' },
  { id: 'v3', label: 'Classic offer', image: '/templates/popup-style-3.png' },
  { id: 'v4', label: 'Playful gift', image: '/templates/popup-style-4.png' },
]

const handleChatSend = async () => {
  const text = chatInput.value.trim()
  if (!text || aiTyping.value) return
  chatMessages.value.push({ role: 'user', text })
  chatInput.value = ''
  scrollChat()

  if (chatStage === 0) {
    chatStage = 1
    await waitMs(500)
    await streamChatAi(`Got it. Analyzing ${text} now…`)
    await waitMs(700)
    await streamChatAi('Found your brand colors, fonts and traffic patterns. Picking the right popup type…')
    await waitMs(700)
    await streamChatAi('Generated 4 popup versions tailored to your goal. Pick one to keep editing.')
    chatMessages.value.push({ role: 'popup-versions', versions: popupVersions, selectedId: null })
    scrollChat()
  } else {
    await waitMs(500)
    await streamChatAi('Got it. Working on it…')
  }
}

const onPopupVersionPick = (msgIdx, version) => {
  const m = chatMessages.value[msgIdx]
  if (!m) return
  m.selectedId = version.id
  generationPrompt.value = chatMessages.value[0]?.text || ''
  selectedUseCase.value = { id: 'newsletter', title: version.label, description: '' }
  // Open the registration modal on the chat itself — editor only loads after user passes the modal
  showRegistrationModal.value = true
}

// ── Registration modal (shown on the chat after picking a popup version) ──
const showRegistrationModal = ref(false)
const completeChatRegistration = () => {
  showRegistrationModal.value = false
  selectLoading.value = true
  step.value = 'detail'
}

onUnmounted(() => {
  analysisTimeouts.forEach((t) => clearTimeout(t))
  chatTimeouts.forEach((t) => clearTimeout(t))
  if (placeholderTimeout) clearTimeout(placeholderTimeout)
})

defineExpose({
  navigateToStep: (s) => { step.value = s },
  navigateToPhase: () => { step.value = 'wizard' },
})
</script>

<style scoped>
.slide-in-enter-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.slide-in-enter-from {
  transform: translateY(8px);
  opacity: 0;
}

.fade-message-enter-active,
.fade-message-leave-active {
  transition: opacity 0.3s ease;
}
.fade-message-enter-from,
.fade-message-leave-to {
  opacity: 0;
}

/* Fade bottom of scrollable messages so content fades behind the input (matches home ChatPanel) */
.chat-fade-mask {
  mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 32px), transparent 100%);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-step-fade-enter-active,
.modal-step-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-step-fade-enter-from,
.modal-step-fade-leave-to {
  opacity: 0;
}
</style>
