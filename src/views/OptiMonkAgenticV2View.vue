<template>
  <!-- Hero (initial) -->
  <div v-if="mode === 'hero'" class="min-h-screen-safe h-screen-safe bg-white flex flex-col px-6">
    <div class="shrink-0 flex justify-center pt-6 pb-2">
      <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
    </div>
    <div class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-180">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-semibold text-om-gray-700">What should we do?</h2>
        </div>
        <div class="relative">
          <textarea
            ref="textareaRef"
            v-model="agenticMessage"
            rows="4"
            @keydown.enter.exact.prevent="handleSubmit"
            class="w-full px-4 py-3 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 h-28 resize-none pr-12 bg-white"
            :placeholder="currentPlaceholder"
          ></textarea>
          <button class="absolute bottom-3 left-2 w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-600 hover:bg-om-gray-100 rounded-lg transition-all cursor-pointer">
            <Paperclip :size="20" />
          </button>
          <button
            @click="handleSubmit"
            :disabled="!agenticMessage?.trim()"
            :class="[
              'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              agenticMessage?.trim() ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
            ]"
          >
            <ArrowUp :size="16" />
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span class="text-sm text-om-gray-500">Start with this:</span>
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
    </div>
  </div>

  <!-- Chat-only (centered, asking for URL) -->
  <div v-else-if="mode === 'chat'" class="min-h-screen-safe h-screen-safe bg-white flex flex-col px-6">
    <div class="shrink-0 flex justify-center pt-6 pb-2">
      <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
    </div>
    <div class="flex-1 flex flex-col min-h-0 w-full max-w-180 mx-auto">
      <div ref="messagesContainer" class="flex-1 overflow-y-auto py-6 space-y-3">
        <ChatMessage v-for="(msg, i) in chatMessages" :key="i" :msg="msg" />
        <TypingDots v-if="aiTyping" />
      </div>
      <div class="shrink-0 pb-6 pt-2">
        <ChatInput
          v-model="agenticMessage"
          :placeholder="awaitingUrl ? 'Paste your website URL...' : 'Continue the conversation...'"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>

  <!-- Building: chat left, popup canvas right -->
  <div v-else class="h-screen-safe bg-white flex">
    <!-- Left chat panel -->
    <aside class="w-96 shrink-0 border-r border-om-gray-200 flex flex-col bg-white min-h-0">
      <div class="shrink-0 flex items-center gap-2 px-5 py-4 border-b border-om-gray-200">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-6" />
      </div>
      <div ref="messagesContainer" class="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        <ChatMessage v-for="(msg, i) in chatMessages" :key="i" :msg="msg" />
        <TypingDots v-if="aiTyping" />
      </div>
      <div class="shrink-0 px-5 pb-5 pt-2">
        <ChatInput
          v-model="agenticMessage"
          placeholder="Tweak the popup..."
          @submit="handleSubmit"
        />
      </div>
    </aside>

    <!-- Right canvas -->
    <main class="flex-1 flex items-center justify-center p-10 bg-om-gray-100 relative overflow-hidden">
      <div class="w-full h-full bg-[#4E686D] rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
        <!-- Popup card -->
        <transition name="popup-pop">
          <div
            v-if="buildStep >= 1"
            class="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style="width: 380px; min-height: 480px;"
          >
            <!-- Hero image area -->
            <div class="h-40 shrink-0 relative overflow-hidden">
              <transition name="fade">
                <img
                  v-if="buildStep >= 2"
                  src="/campaigns/smart-discount-popup-img.png"
                  alt=""
                  class="w-full h-full object-cover"
                />
              </transition>
              <transition name="fade">
                <div v-if="buildStep < 2" class="absolute inset-0 bg-om-gray-100 flex items-center justify-center">
                  <div class="w-6 h-6 border-2 border-om-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </transition>
            </div>

            <!-- Body -->
            <div class="flex-1 flex flex-col items-center text-center px-6 py-5 gap-3">
              <!-- Logo + headline -->
              <transition name="fade-up">
                <div v-if="buildStep >= 3" class="flex flex-col items-center gap-2 w-full">
                  <div class="w-10 h-10 rounded-full bg-om-orange-500 flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <h3 class="text-xl font-bold text-om-orange-500 leading-tight">
                    Welcome! Save 10% on your first order
                  </h3>
                </div>
              </transition>

              <!-- Subtext + email field -->
              <transition name="fade-up">
                <div v-if="buildStep >= 4" class="w-full flex flex-col gap-3 mt-2">
                  <p class="text-sm text-om-gray-500 leading-relaxed">
                    Join 10,000+ shoppers. Get exclusive deals and your welcome coupon today.
                  </p>
                  <div class="h-10 rounded-lg border border-om-gray-300 px-3 flex items-center text-sm text-om-gray-400 bg-white">
                    Enter your email
                  </div>
                </div>
              </transition>

              <!-- CTAs -->
              <transition name="fade-up">
                <div v-if="buildStep >= 5" class="w-full flex flex-col gap-2 mt-1">
                  <button class="w-full h-11 rounded-lg bg-om-orange-500 text-white font-semibold text-sm">
                    CLAIM MY 10% COUPON
                  </button>
                  <button class="w-full text-xs text-om-gray-400 underline">
                    No thanks, I'll pay full price
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </transition>

        <!-- Empty state hint -->
        <div v-if="buildStep === 0" class="text-white/70 text-sm flex items-center gap-2">
          <div class="w-3 h-3 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>
          Preparing canvas...
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, h, nextTick, onMounted, onUnmounted } from 'vue'
import { ArrowUp, Paperclip, Lightbulb, Plus, FlaskConical } from 'lucide-vue-next'

defineProps({
  registrationData: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['navigate-to', 'phase-changed', 'registration-completed'])

// ── State ──
const mode = ref('hero') // 'hero' | 'chat' | 'building'
const textareaRef = ref(null)
const messagesContainer = ref(null)
const agenticMessage = ref('')
const chatMessages = ref([])
const aiTyping = ref(false)
const awaitingUrl = ref(false)
const collectedUrl = ref('')
const buildStep = ref(0)
const buildTimeouts = []

// ── URL detection ──
const urlRegex = /(?:https?:\/\/\S+|(?:www\.)?[a-z0-9][a-z0-9-]*\.[a-z]{2,}(?:\/\S*)?)/i
const extractUrl = (text) => {
  const match = text.match(urlRegex)
  return match ? match[0] : null
}

const scrollChatToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const pushAi = (text, delay = 700) => new Promise((resolve) => {
  aiTyping.value = true
  scrollChatToBottom()
  const t = setTimeout(() => {
    aiTyping.value = false
    chatMessages.value.push({ role: 'ai', text })
    scrollChatToBottom()
    resolve()
  }, delay)
  buildTimeouts.push(t)
})

const startBuilding = async (url) => {
  mode.value = 'building'
  buildStep.value = 0

  await pushAi(`Got it. Analyzing ${url} now...`, 600)
  await wait(900)

  await pushAi('Picking the right popup type. A welcome offer with email capture looks best for first-time visitors.', 700)
  buildStep.value = 1
  await wait(1100)

  await pushAi('Adding a hero image to grab attention.', 700)
  buildStep.value = 2
  await wait(1100)

  await pushAi('Applying your brand colors and logo.', 700)
  buildStep.value = 3
  await wait(1100)

  await pushAi('Writing the value prop and adding an email field.', 700)
  buildStep.value = 4
  await wait(1100)

  await pushAi('Finishing with a strong CTA and a soft opt-out.', 700)
  buildStep.value = 5
  await wait(700)

  await pushAi("All set! Here's your first popup. Tell me what you'd like to tweak — copy, colors, image, anything.", 700)
}

const wait = (ms) => new Promise((resolve) => {
  const t = setTimeout(resolve, ms)
  buildTimeouts.push(t)
})

// ── Submit ──
const handleSubmit = () => {
  const text = agenticMessage.value?.trim()
  if (!text) return

  chatMessages.value.push({ role: 'user', text })
  agenticMessage.value = ''
  scrollChatToBottom()

  const url = extractUrl(text)

  if (mode.value === 'building') {
    // In-editor tweak chat — just acknowledge for now
    pushAi("Got it — I'll work that into the popup. (Mock response for now.)", 700)
    return
  }

  if (url) {
    collectedUrl.value = url
    awaitingUrl.value = false
    startBuilding(url)
    return
  }

  if (mode.value === 'hero') mode.value = 'chat'

  if (awaitingUrl.value) {
    pushAi("I still don't see a website URL in your message. Could you paste it like https://example.com so I can take a look?", 700)
    return
  }

  awaitingUrl.value = true
  pushAi("Happy to help with that. Before I can suggest anything specific, could you share the URL of your website? I need to analyze it to give you tailored recommendations.", 700)
}

// ── Placeholder typewriter ──
const currentPlaceholderIndex = ref(0)
const displayedText = ref('')
let typingTimeout = null

const placeholderSuggestions = [
  'how to collect more emails',
  'to create a welcome popup',
  'for cart abandonment tips',
  'to boost conversions',
  'about exit-intent popups',
]

const currentPlaceholder = computed(() => `Ask OptiMonk ${displayedText.value}`)

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

// ── Local components ──
const ChatMessage = (props) => h('div', {
  class: ['flex', props.msg.role === 'user' ? 'justify-end' : 'justify-start'],
}, [
  h('div', {
    class: [
      'px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap',
      props.msg.role === 'user'
        ? 'bg-om-peach-100 text-om-gray-700 rounded-br-md'
        : 'bg-om-gray-100 text-om-gray-700 rounded-bl-md',
    ],
  }, props.msg.text),
])
ChatMessage.props = ['msg']

const TypingDots = () => h('div', { class: 'flex justify-start' }, [
  h('div', { class: 'px-4 py-2.5 rounded-2xl rounded-bl-md bg-om-gray-100 flex items-center gap-1' }, [
    h('span', { class: 'w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse' }),
    h('span', { class: 'w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse', style: { animationDelay: '0.2s' } }),
    h('span', { class: 'w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-pulse', style: { animationDelay: '0.4s' } }),
  ]),
])

const ChatInput = (props, { emit: cEmit }) => h('div', { class: 'relative' }, [
  h('textarea', {
    rows: 3,
    value: props.modelValue,
    onInput: (e) => cEmit('update:modelValue', e.target.value),
    onKeydown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        cEmit('submit')
      }
    },
    placeholder: props.placeholder,
    class: 'w-full px-4 py-3 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 resize-none pr-12 bg-white text-sm',
  }),
  h('button', {
    class: 'absolute bottom-3 left-2 w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-600 hover:bg-om-gray-100 rounded-lg transition-all cursor-pointer',
  }, h(Paperclip, { size: 18 })),
  h('button', {
    onClick: () => cEmit('submit'),
    disabled: !props.modelValue?.trim(),
    class: [
      'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
      props.modelValue?.trim() ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default',
    ],
  }, h(ArrowUp, { size: 16 })),
])
ChatInput.props = ['modelValue', 'placeholder']
ChatInput.emits = ['update:modelValue', 'submit']

onMounted(() => {
  typeText(placeholderSuggestions[0] + '...')
})

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout)
  buildTimeouts.forEach((t) => clearTimeout(t))
})
</script>

<style scoped>
.popup-pop-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
}
.popup-pop-enter-from {
  transform: scale(0.85);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.fade-up-enter-from {
  transform: translateY(8px);
  opacity: 0;
}
</style>
