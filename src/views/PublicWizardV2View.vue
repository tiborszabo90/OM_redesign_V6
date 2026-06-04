<template>
  <!-- Step 1: Prompt input (URL flow removed) -->
  <div v-if="step === 'url'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4 relative">
    <!-- Login (top-right) -->
    <div class="absolute top-5 right-5 flex items-center gap-2">
      <Button variant="ghost" size="sm" @click="goToHome">Log in</Button>
    </div>
    <div class="w-full max-w-2xl">
      <div class="flex justify-center mb-10">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
      </div>
      <h1 class="text-4xl font-semibold text-om-gray-700 text-center mb-2">Website optimization magic.</h1>
      <p class="text-om-gray-500 text-center mb-6">
        Tell us what you want to build and we’ll get you started.
      </p>

      <form @submit.prevent="handleInitialSubmit" class="flex flex-col gap-3">
        <div class="flex flex-col gap-3">
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
              @click="prompt = ex.value; recommendationMode = ex.recommendation === true"
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

  <!-- Step 2: Full-width chat -->
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
          <!-- 4 recommended use cases (numbered cards, like the home chat) -->
          <div v-else-if="m.role === 'usecase-cards'" class="w-full">
            <div class="grid grid-cols-2 gap-3 pb-2 max-w-3xl mx-auto">
              <button
                v-for="c in m.cards"
                :key="c.id"
                @click="onUseCasePick(i, c)"
                :class="[
                  'flex items-center gap-4 text-left bg-white rounded-xl border p-4 transition-all cursor-pointer',
                  m.selectedId === c.id
                    ? 'border-om-orange-500 ring-2 ring-om-orange-200'
                    : 'border-om-gray-200 hover:border-om-orange-300 hover:shadow-md'
                ]"
              >
                <div class="shrink-0 w-12 h-12 rounded-lg bg-om-gray-100 flex items-center justify-center text-xl font-bold text-om-gray-700">{{ c.number }}</div>
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-om-gray-700">{{ c.label }}</div>
                  <div class="text-xs text-om-gray-500 leading-snug mt-0.5">{{ c.reason }}</div>
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
            <div class="group flex flex-col max-w-[80%]" :class="m.role === 'user' ? 'items-end' : 'items-start'">
              <div
                class="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                :class="m.role === 'user'
                  ? 'bg-om-peach-100 text-om-gray-700 rounded-br-md'
                  : 'bg-om-gray-100 text-om-gray-700 rounded-bl-md'"
              >{{ m.text }}</div>
              <!-- Hover meta: submission time -->
              <div v-if="m.role === 'user' && m.time" class="opacity-0 group-hover:opacity-100 transition-opacity mt-1 px-1 text-[11px] text-om-gray-400">{{ m.time }}</div>
            </div>
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

  <!-- Step 3: Popup detail (steps + chat editor) -->
  <PublicV3PopupDetailScreen
    v-else
    :use-case="selectedUseCase"
    :generation-prompt="generationPrompt"
    :select-loading="selectLoading"
    :initial-chat-messages="chatMessages"
    :coupon-code="discountCode"
    embedded
    @back="step = 'url'"
    @published="onEditorDone"
  />

  <!-- Registration modal shown on the chat step after picking a popup version -->
  <RegistrationModal v-model="showRegistrationModal" @register="completeChatRegistration" />
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted, markRaw } from 'vue'
import { ArrowUp, Mail, ShoppingCart, Sparkles } from 'lucide-vue-next'
import PublicV3PopupDetailScreen from '../components/onboarding/PublicV3PopupDetailScreen.vue'
import RegistrationModal from '../components/onboarding/RegistrationModal.vue'
import ChatDecisionQuestions from '../components/onboarding/ChatDecisionQuestions.vue'
import Button from '../components/shared/Button.vue'

const promptExamples = [
  { label: 'Discount Popup', value: 'Create a Discount Popup to capture more leads.', icon: markRaw(Mail) },
  { label: 'Cart Abandonment Stopper', value: 'Help me recover cart abandoners with a popup.', icon: markRaw(ShoppingCart) },
  { label: 'Get recommendation', value: 'Analyze my website and recommend the best opportunity for me.', icon: markRaw(Sparkles), recommendation: true },
]

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  },
  // When launched with a prompt (e.g. Today's plan "New task"), auto-start the flow
  initialMessage: {
    type: String,
    default: ''
  },
  // Launched from inside the app (already logged in) → skip the registration modal
  skipRegistration: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['task-created', 'navigate-to', 'phase-changed', 'menu-click', 'registration-completed'])

const step = ref('url')

// Each phase of the flow drives its own route (handled in App.vue via a hash subpath)
watch(step, (s) => emit('phase-changed', s), { immediate: true })
const prompt = ref('')
const discountCode = ref('') // captured in the discount flow, passed to the editor
const recommendationMode = ref(false) // "Get recommendation" → only ask for the URL
const selectedUseCase = ref(null)
const generationPrompt = ref('')
const selectLoading = ref(false)

// ── Animated placeholder for the prompt input ──
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
  // Launched with a prompt (e.g. from the Today's plan "New task") → start the flow
  if (props.initialMessage && props.initialMessage.trim()) {
    prompt.value = props.initialMessage
    handleInitialSubmit()
  }
})

const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const goToHome = () => { window.location.hash = '#/agentic/home' }

// ── Step transitions ──
const handleInitialSubmit = () => {
  if (!prompt.value.trim()) return
  chatMessages.value = [{ role: 'user', text: prompt.value.trim(), time: formatTime(new Date()) }]
  step.value = 'chat'
  runChatFlow()
}

// ── Full-width chat flow ──
const chatMessages = ref([])
const chatInput = ref('')
const aiTyping = ref(false)
const chatScrollRef = ref(null)
const chatTimeouts = []

const activeQuestionsIdx = computed(() => chatMessages.value.findIndex((m) => m.role === 'questions' && !m.finalized))
const activeQuestionsBlock = computed(() => activeQuestionsIdx.value >= 0 ? chatMessages.value[activeQuestionsIdx.value] : null)
const chatWide = computed(() => chatMessages.value.some((m) => m.role === 'popup-versions' || m.role === 'usecase-cards'))

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

const targetingQuestions = [
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

const urlQuestion = {
  tabLabel: 'Website URL',
  text: 'What’s your website URL?',
  inputOnly: true,
  inputPlaceholder: 'enter website URL',
  options: [],
}

const runChatFlow = async () => {
  scrollChat()
  await waitMs(500)
  // "Get recommendation" only needs the URL; idea-driven prompts get the targeting questions too
  const questions = recommendationMode.value ? [urlQuestion] : [...targetingQuestions, urlQuestion]
  await streamChatAi(recommendationMode.value
    ? 'Great! Just drop your website URL and I’ll find the best opportunity for you.'
    : 'Nice idea! A few quick questions to tailor this for you.')
  await waitMs(400)
  chatMessages.value.push({
    role: 'questions',
    activeTab: 0,
    finalized: false,
    questions: questions.map((q) => ({ ...q, selectedId: null, otherValue: '' })),
  })
  scrollChat()
}

const finalizeQuestionsBlock = async (msgIdx) => {
  const m = chatMessages.value[msgIdx]
  m.finalized = true
  // Discount details → echo the offer + code, then show the designs
  if (m.kind === 'discount') {
    const dq = m.questions[0]
    const opt = dq.options.find((o) => o.id === dq.selectedId)
    const val = dq.otherValue?.trim() || ''
    const offerText = opt ? `${opt.inputPrefix || ''}${val}${opt.inputSuffix || ''}` : 'Discount'
    const code = m.questions[1]?.otherValue?.trim() || ''
    discountCode.value = code
    chatMessages.value.push({ role: 'user', text: code ? `${offerText} · Code: ${code}` : offerText, time: formatTime(new Date()) })
    scrollChat()
    await showPopupVersions(`Perfect. Here are 4 popup designs with ${offerText}. Pick one to keep editing.`)
    return
  }
  const urlQ = m.questions.find((q) => q.inputOnly)
  const websiteUrl = urlQ?.otherValue?.trim() || ''
  const summary = m.questions
    .map((q) => {
      if (q.inputOnly) return `${q.tabLabel}: ${q.otherValue?.trim() || 'Skipped'}`
      const opt = q.options.find((o) => o.id === q.selectedId)
      if (!opt) return `${q.tabLabel}: Skipped`
      return `${q.tabLabel}: ${opt.allowInput ? (q.otherValue || opt.label) : opt.label}`
    })
    .join(' · ')
  chatMessages.value.push({ role: 'user', text: summary, time: formatTime(new Date()) })
  scrollChat()
  if (recommendationMode.value) await runRecommendations(websiteUrl)
  else await runAnalysisAndGenerate(websiteUrl)
}

// "Get recommendation": return 4 recommended use cases first (like the home chat)
const usecaseCards = [
  { id: 'smart-discount', number: 1, label: 'Smart Discount Popup', reason: 'Your new visitors have a 12% bounce rate, so a welcome discount can convert them into subscribers.' },
  { id: 'lucky-wheel', number: 2, label: 'Lucky Wheel', reason: 'Gamified popups get 2x more engagement, perfect for your high-traffic pages.' },
  { id: 'newsletter', number: 3, label: 'Newsletter Signup Popup', reason: 'Your email list grew only 3% last month, so a signup popup can accelerate that.' },
  { id: 'cart-abandonment', number: 4, label: 'Cart Abandonment Stopper', reason: '68% of your carts are abandoned, and an exit offer can recover up to 15% of them.' },
]

const runRecommendations = async (websiteUrl) => {
  await waitMs(500)
  await streamChatAi(websiteUrl ? `Got it. Analyzing ${websiteUrl} now…` : 'Got it. Analyzing your site now…')
  await waitMs(700)
  await streamChatAi('Based on your traffic and performance data, these use cases would have the biggest impact for you:')
  chatMessages.value.push({ role: 'usecase-cards', cards: usecaseCards, selectedId: null })
  scrollChat()
}

const onUseCasePick = async (msgIdx, card) => {
  const m = chatMessages.value[msgIdx]
  if (!m || m.selectedId) return
  m.selectedId = card.id
  selectedUseCase.value = { id: card.id, title: card.label, description: '' }
  generationPrompt.value = card.label
  scrollChat()
  await waitMs(400)
  // Discount use case: ask the discount amount + coupon code before the designs
  if (card.id === 'smart-discount' || isDiscountIntent(card.label)) {
    await askDiscountDetails()
    return
  }
  await showPopupVersions(`Great pick! Here are 4 ${card.label} versions tailored to your site. Pick one to keep editing.`)
}

const runAnalysisAndGenerate = async (websiteUrl) => {
  await waitMs(500)
  await streamChatAi(websiteUrl ? `Got it. Analyzing ${websiteUrl} now…` : 'Got it. Analyzing your site now…')
  await waitMs(700)
  await streamChatAi('Found your brand colors, fonts and traffic patterns. Picking the right popup type…')
  await waitMs(700)
  // Discount popups: ask the discount amount + coupon code before the designs
  if (isDiscountIntent(chatMessages.value[0]?.text)) {
    await askDiscountDetails()
    return
  }
  await showPopupVersions('Generated 4 popup versions tailored to your goal. Pick one to keep editing.')
}

const onQuestionsContinue = async (msgIdx) => {
  const m = chatMessages.value[msgIdx]
  if (m.finalized) return
  const current = m.questions[m.activeTab]
  if (!current.selectedId && !current.inputOnly) return
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
  m.questions[m.activeTab].otherValue = ''
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

// Discount flow: ask the discount amount + coupon code before showing the designs
const isDiscountIntent = (text) => /discount|coupon|kupon/i.test(text || '')

const showPopupVersions = async (intro) => {
  await waitMs(300)
  await streamChatAi(intro)
  chatMessages.value.push({ role: 'popup-versions', versions: popupVersions, selectedId: null })
  scrollChat()
}

const askDiscountDetails = async () => {
  await streamChatAi('First, set the discount this popup should offer.')
  await waitMs(300)
  chatMessages.value.push({
    role: 'questions',
    kind: 'discount',
    activeTab: 0,
    finalized: false,
    questions: [
      {
        tabLabel: 'Discount',
        text: 'How much discount should it offer?',
        options: [
          { id: 'percent', label: 'Percentage off', allowInput: true, inputPlaceholder: 'e.g. 10', inputSuffix: '% off' },
          { id: 'amount', label: 'Fixed amount off', allowInput: true, inputPlaceholder: 'e.g. 2000', inputPrefix: 'HUF ', inputSuffix: ' off' },
        ],
        selectedId: null,
        otherValue: '',
      },
      {
        tabLabel: 'Code',
        text: 'What coupon code should it use?',
        inputOnly: true,
        inputPlaceholder: 'e.g. SAVE10',
        otherValue: '',
      },
    ],
  })
  scrollChat()
}

const handleChatSend = async () => {
  const text = chatInput.value.trim()
  if (!text || aiTyping.value) return
  chatMessages.value.push({ role: 'user', text, time: formatTime(new Date()) })
  chatInput.value = ''
  scrollChat()
  await waitMs(500)
  await streamChatAi('Got it. Working on it…')
}

const onPopupVersionPick = (msgIdx, version) => {
  const m = chatMessages.value[msgIdx]
  if (!m) return
  m.selectedId = version.id
  generationPrompt.value = chatMessages.value[0]?.text || ''
  selectedUseCase.value = { id: 'newsletter', title: version.label, description: '' }
  // Already logged in (launched from the app) → straight to the editor; otherwise register first
  if (props.skipRegistration) {
    completeChatRegistration()
  } else {
    showRegistrationModal.value = true
  }
}

// ── Registration modal (shown on the chat after picking a popup version) ──
const showRegistrationModal = ref(false)
const completeChatRegistration = () => {
  showRegistrationModal.value = false
  selectLoading.value = true
  step.value = 'detail'
}

// Editor "Done" → campaign created, land on the Today's plan home
const onEditorDone = () => {
  window.location.hash = '#/agentic/home'
}

onUnmounted(() => {
  chatTimeouts.forEach((t) => clearTimeout(t))
  if (placeholderTimeout) clearTimeout(placeholderTimeout)
})

defineExpose({
  navigateToStep: (s) => { step.value = s },
  navigateToPhase: () => { step.value = 'chat' },
})
</script>

<style scoped>
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
