<template>
  <!-- FAB variant with hover options -->
  <div
    v-if="!modelValue && fab"
    class="fixed bottom-16 right-6 z-20 flex flex-col items-end gap-3 group"
  >
    <!-- Options panel (appear above FAB on hover) -->
    <div class="flex flex-col items-stretch gap-2
                opacity-0 group-hover:opacity-100
                translate-y-2 group-hover:translate-y-0
                pointer-events-none group-hover:pointer-events-auto
                transition-all duration-200 ease-out">
      <button
        @click="emit('update:modelValue', true)"
        class="bg-om-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#E54D1F] transition-colors cursor-pointer whitespace-nowrap"
      >
        AI assistant
      </button>
      <button
        class="bg-om-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#E54D1F] transition-colors cursor-pointer whitespace-nowrap"
      >
        Customer support
      </button>
    </div>
    <!-- FAB button -->
    <button
      class="w-14 h-14 bg-om-orange-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#E54D1F] transition-colors cursor-pointer relative"
    >
      <!-- Pulse ring -->
      <span class="absolute inset-0 rounded-full bg-om-orange-500 animate-chat-ping opacity-75"></span>
      <img src="/monkhead.svg" alt="OptiBot" class="w-9 h-9 relative z-10" />
    </button>
  </div>

  <!-- Collapsed tab (fixed to viewport right edge, no layout space taken) -->
  <button
    v-else-if="!modelValue && !fab && side === 'right'"
    @click="emit('update:modelValue', true)"
    class="chat-tab fixed top-4 right-0 z-20 w-9 h-12 bg-om-orange-500 border border-r-0 border-transparent rounded-l-xl shadow-sm flex items-center justify-center text-white hover:bg-[#E54D1F] transition-colors cursor-pointer"
  >
    <img src="/monkhead.svg" alt="OptiBot" class="w-7 h-7" />
  </button>

  <!-- Chat panel (flow element, wide column) -->
  <transition :name="panelTransitionName">
  <div
    v-if="modelValue"
    :style="inline ? {} : (isWideMode ? {} : { width: effectiveWidth + 'px' })"
    :class="[
      inline ? 'flex flex-col bg-white relative px-4 pb-4 h-full'
        : isWideMode ? 'flex-1 flex flex-col bg-white p-4 relative rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] my-3 mr-3 chat-panel-width-transition'
        : 'shrink-0 flex flex-col bg-white p-4 relative rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] my-3 mr-3 chat-panel-width-transition',
      !inline && side === 'left' ? 'ml-3 mr-0' : ''
    ]"
  >
    <!-- Resize handle (hidden in wide mode) -->
    <div
      v-if="!inline && !isWideMode"
      @mousedown="startResize"
      :class="['resize-handle absolute top-0 bottom-0 w-1 cursor-ew-resize hover:bg-om-orange-300 transition-colors z-10', side === 'left' ? 'right-0' : 'left-0']"
    ></div>
    <!-- Header with close button -->
    <div class="flex items-center justify-between" :class="inline ? 'px-4 py-2' : 'mb-4'">
      <Button variant="ghost" size="sm" @click="openConversationsModal">
        <span class="flex items-center gap-1">{{ conversationTitle }}<ChevronDown :size="14" /></span>
      </Button>
      <div v-if="!inline" class="flex items-center gap-1">
        <button
          @click="emit('toggle-expand')"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-[#8F97A4] hover:text-[#505763] hover:bg-[#F1F2F4] transition-colors cursor-pointer"
        >
          <Minimize2 v-if="isWideMode" :size="16" />
          <Maximize2 v-else :size="16" />
        </button>
        <button
          @click="closePanel"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-[#8F97A4] hover:text-[#505763] hover:bg-[#F1F2F4] transition-colors cursor-pointer"
        >
          <X :size="16" />
        </button>
      </div>
    </div>

    <!-- Conversations modal overlay -->
    <div
      v-if="showConversationsModal"
      class="absolute inset-0 z-10 bg-white flex flex-col p-4 pt-6"
    >
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-semibold text-om-gray-700">Conversations</span>
        <button
          @click="showConversationsModal = false"
          class="w-8 h-8 rounded-lg flex items-center justify-center text-[#8F97A4] hover:text-[#505763] hover:bg-[#F1F2F4] transition-colors cursor-pointer"
        >
          <X :size="16" />
        </button>
      </div>

      <div class="mb-3">
        <Button variant="primary" size="sm" @click="startNewConversation" class="w-full">New conversation</Button>
      </div>

      <div class="flex-1 overflow-y-auto chat-panel-scroll">
        <div v-if="savedConversations.length === 0" class="text-sm text-om-gray-400 text-center pt-8">
          No recent conversations
        </div>
        <div
          v-for="(conv, index) in savedConversations"
          :key="index"
          @click="loadConversation(conv)"
          class="px-3 py-2.5 rounded-lg hover:bg-om-gray-100 cursor-pointer mb-1 transition-colors"
        >
          <div class="text-sm font-medium text-om-gray-700 truncate">{{ conv.title }}</div>
          <div class="text-xs text-om-gray-400 mt-0.5">{{ conv.messageCount }} messages</div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="messages.length === 0" class="flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden">
      <div class="relative w-56 h-48 flex items-end justify-center shrink-0">
        <img src="/monk-shadow.svg" alt="" class="absolute -bottom-3 w-36 opacity-60 monk-shadow-pulse" />
        <img src="/monk-medit.2.svg" alt="OptiMonk" class="relative w-44 h-44 object-contain monk-float" />
      </div>
    </div>

    <!-- Messages area (only rendered when there are messages) -->
    <div v-else ref="chatMessagesContainer" :class="['flex-1 overflow-y-auto pb-4 chat-panel-scroll', isWideMode ? 'px-4' : '']">
      <div :class="isWideMode && wideCompact ? 'mx-auto space-y-3' : 'space-y-3'" :style="isWideMode && wideCompact ? { maxWidth: '65%' } : {}">
      <!-- Message loop -->
      <div v-for="(msg, index) in messages" :key="index" class="flex" :class="msg.type === 'user' ? 'justify-end' : 'justify-start'">
        <!-- User message -->
        <div v-if="msg.type === 'user'" class="bg-[#FFEFE5] text-[#23262A] px-3 py-2 rounded-2xl rounded-br-md max-w-[90%] text-sm">
          {{ msg.message }}
        </div>

        <!-- AI success message -->
        <div v-else-if="msg.type === 'ai-success'" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-[#239E77] rounded-full flex items-center justify-center">
              <Check :size="12" class="text-white" />
            </div>
            <span class="font-medium">{{ msg.message }}</span>
          </div>
        </div>

        <!-- AI logo message -->
        <div v-else-if="msg.type === 'ai-logo'" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
          <div class="flex items-center gap-2">
            <span>{{ msg.message }}</span>
            <div class="w-8 h-8 rounded overflow-hidden bg-white border border-[#E3E5E8] flex items-center justify-center shrink-0">
              <img src="/demos/telekom/logo.png" alt="Logo" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- AI colors message -->
        <div v-else-if="msg.type === 'ai-colors'" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
          <div class="space-y-1.5">
            <div>{{ msg.message }}</div>
            <div class="flex gap-1.5">
              <div v-for="color in msg.colors" :key="color"
                   class="w-6 h-6 rounded-full border border-white shadow-sm"
                   :style="{ backgroundColor: color }"></div>
            </div>
          </div>
        </div>

        <!-- AI image cards message -->
        <div v-else-if="msg.type === 'ai-images'" :class="isWideMode ? 'w-full text-sm mb-12' : 'w-full text-sm'">
          <div v-if="msg.message" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md mb-3 leading-relaxed" :class="isWideMode ? 'max-w-[600px]' : 'max-w-[90%]'" v-html="formatChatMessage(msg.message)"></div>
          <div :class="isWideMode ? (msg.layout === 'vertical' ? ['grid gap-4 pb-2', msg.cards?.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'] : 'grid grid-cols-2 gap-4 pb-2') : !msg.hideLabels && msg.cards?.[0]?.image ? 'flex flex-col gap-1.5 pb-2' : 'grid grid-cols-2 gap-2 pb-2'">
            <component
              :is="inline ? 'div' : 'button'"
              v-for="card in msg.cards"
              :key="card.id"
              @click="!inline && handleImageCardClick(card, msg)"
              :class="cardClasses(card, msg)"
            >
              <!-- Narrow mode: text-only list (when has labels + image) -->
              <div v-if="!isWideMode && !msg.hideLabels && card.image" class="px-3 py-2">
                <div class="font-medium text-om-gray-700 text-sm">{{ card.label }}</div>
                <div v-if="card.reason" class="text-om-gray-500 mt-0.5 leading-snug text-xs">{{ card.reason }}</div>
              </div>
              <!-- Wide mode: horizontal layout (image left, text right) — skip for vertical layout -->
              <div v-else-if="isWideMode && !msg.hideLabels && card.image && msg.layout !== 'vertical'" class="flex h-40">
                <div class="w-1/2 shrink-0 overflow-hidden" :style="{ backgroundColor: card.bgColor || '' }" :class="!card.bgColor ? 'bg-om-gray-100' : ''">
                  <img :src="card.image" :alt="card.label" :class="card.bgColor ? 'w-[88%] h-full object-contain m-auto' : 'w-full h-full object-cover object-top'" />
                </div>
                <div class="px-4 py-3 flex-1 flex flex-col justify-center">
                  <div class="font-medium text-om-gray-700 text-sm">{{ card.label }}</div>
                  <div v-if="card.description" class="text-om-gray-400 mt-0.5 leading-snug text-xs">{{ card.description }}</div>
                  <div v-if="card.reason" class="text-om-gray-500 mt-1.5 leading-snug italic text-xs">{{ card.reason }}</div>
                </div>
              </div>
              <!-- Vertical layout: image only or no labels -->
              <template v-else>
                <div class="aspect-video overflow-hidden" :style="{ backgroundColor: card.bgColor || '' }" :class="!card.bgColor ? 'bg-om-gray-100' : ''">
                  <img v-if="card.image" :src="card.image" :alt="card.label" class="w-full h-full object-cover object-top" />
                  <div v-else class="w-full h-full bg-om-gray-200"></div>
                </div>
                <div v-if="!msg.hideLabels" :class="isWideMode ? 'px-3 py-2.5' : 'px-2.5 py-2'">
                  <div class="font-medium text-om-gray-700" :class="isWideMode ? 'text-sm' : 'text-xs'">{{ card.label }}</div>
                  <div v-if="card.description" class="text-om-gray-400 mt-0.5 leading-snug" :class="isWideMode ? 'text-xs' : 'text-[11px]'">{{ card.description }}</div>
                  <div v-if="card.reason" class="text-om-gray-500 mt-1 leading-snug italic" :class="isWideMode ? 'text-xs' : 'text-[11px]'">{{ card.reason }}</div>
                </div>
              </template>
            </component>
          </div>
        </div>

        <!-- AI action link message (hidden in editor/inline) -->
        <div v-else-if="msg.type === 'ai-action-link' && !inline" class="flex justify-start">
          <button
            @click="emit('action', msg.action)"
            class="inline-flex items-center gap-1.5 text-om-orange-500 hover:text-om-orange-600 text-sm font-medium cursor-pointer transition-colors"
          >
            {{ msg.message }}
            <ArrowUp :size="14" class="rotate-90" />
          </button>
        </div>

        <!-- AI text message -->
        <div v-else class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm leading-relaxed" v-html="formatChatMessage(msg.message)">
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-om-gray-100 px-3 py-2 rounded-2xl rounded-bl-md flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-1.5 h-1.5 bg-om-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
      </div>
      </div>
    </div>

    <!-- Suggestions (sticky above input) -->
    <div v-if="suggestions.length && messages.length === 0" class="pb-2 pt-2 shrink-0" :class="isWideMode ? 'max-w-[45%] mx-auto' : ''">
      <p class="text-xs text-om-gray-500 mb-2">Try with an example:</p>
      <div class="flex flex-col gap-1.5">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="handleSuggestionClick(suggestion)"
          class="chip w-full text-left px-3 py-1.5 rounded-lg bg-white border border-om-gray-200 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Chat input -->
    <div :class="isWideMode ? 'relative mx-auto' : 'relative'" :style="isWideMode ? { width: '45%' } : {}">
      <textarea
        ref="chatTextareaRef"
        v-model="chatMessage"
        rows="3"
        @keydown.enter.exact.prevent="handleChatSubmit"
        class="w-full px-4 py-3 pb-10 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 resize-none pr-12 text-sm"
        placeholder="Ask OptiMonk..."
      ></textarea>
      <button
        class="absolute bottom-3 left-1.5 w-8 h-8 rounded-lg flex items-center justify-center text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600 active:bg-om-gray-200 transition-colors cursor-pointer"
      >
        <Paperclip :size="16" />
      </button>
      <button
        @click="handleChatSubmit"
        :disabled="!chatMessage?.trim()"
        :class="[
          'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
          chatMessage?.trim() ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
        ]"
      >
        <ArrowUp :size="16" />
      </button>
    </div>
  </div>
  </transition>

</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { ArrowUp, X, Check, Paperclip, ChevronDown, Maximize2, Minimize2 } from 'lucide-vue-next'
import Button from './Button.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  fab: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: false
  },
  side: {
    type: String,
    default: 'right' // 'right' | 'left'
  },
  suggestions: {
    type: Array,
    default: () => [
      'Which campaign has the best conversion rate?',
      'How can I improve my popup engagement?',
      'Show me campaigns with low impressions',
      'What are the best templates for Black Friday?',
      'How do I reduce cart abandonment?',
    ]
  },
  aiResponses: {
    type: Object,
    default: () => ({
      'Which campaign has the best conversion rate?': 'Your **Smart Discount Popup** is leading with an **8.37% submit rate** and **84.23% conversion uplift**. It\'s significantly outperforming your other active campaigns.\n\nWould you like tips on how to replicate this success across your other campaigns?',
      'How can I improve my popup engagement?': 'Here are the top strategies to boost engagement:\n\n**1. Timing** — Show your popup after 30–60 seconds or on exit intent, not immediately on page load.\n\n**2. Personalization** — Target by traffic source, device, or previous behavior.\n\n**3. Copy** — Use a clear value proposition and a single, specific CTA.\n\nWould you like me to audit a specific campaign?',
      'Show me campaigns with low impressions': 'Based on your current data, **Feedback Survey** has the lowest impressions with only **1,456 visitors** reached.\n\nThis is likely due to a narrow audience targeting rule. I\'d recommend reviewing the trigger settings and expanding the target URL conditions.',
      'What are the best templates for Black Friday?': 'For Black Friday, the highest-converting template types are:\n\n**1. Countdown Timer Popup** — Creates urgency\n**2. Discount Wheel** — High engagement, viral potential\n**3. Cart Abandonment Banner** — Captures last-minute saves\n\nYou can find all of these in the **Templates** section under Seasonal.',
      'How do I reduce cart abandonment?': 'Your **Cart Abandonment Stopper** campaign is already active. To improve it further:\n\n**1. Trigger earlier** — Show at 70% scroll on the cart page, not just on exit.\n**2. Offer a stronger incentive** — Free shipping converts better than % discounts.\n**3. Add urgency** — "Only 3 left in stock" messaging.\n\nWould you like me to suggest a specific template?',
    })
  },
  messageMatchers: {
    type: Array,
    default: () => []
    // Array of { keywords: string[], response: string | { message, followUp, action }, action?: string }
    // keywords: if ALL keywords are found in the user message (case-insensitive), this matcher wins
    // action: emitted via 'action' event after the AI response is shown
  },
  expandedWidth: {
    type: Number,
    default: 0
    // When > 0, overrides panelWidth with an animated transition
  },
  wideCompact: {
    type: Boolean,
    default: false
    // When true + wide mode: content is 70% centered, grid always 2 cols
  },
  initialMessages: {
    type: Array,
    default: () => []
    // Pre-populate chat with messages from a previous conversation
  }
})

const emit = defineEmits(['update:modelValue', 'action', 'toggle-expand'])

const panelTransitionName = computed(() => {
  if (props.fab) return 'panel-to-fab'
  return props.side === 'left' ? 'panel-slide-left' : 'panel-slide-right'
})

function closePanel() {
  emit('update:modelValue', false)
}

const chatMessage = ref('')
const messages = ref([...props.initialMessages])
const isTyping = ref(false)
const selectedCardId = ref(null)
const showConversationsModal = ref(false)
const currentConversationSaved = ref(false)
const savedConversations = ref([
  {
    title: 'Which campaign has the best conversion rate?',
    messageCount: 4,
    messages: [
      { type: 'user', message: 'Which campaign has the best conversion rate?' },
      { type: 'ai', message: 'Your **Smart Discount Popup** is leading with an **8.37% submit rate** and **84.23% conversion uplift**. It\'s significantly outperforming your other active campaigns.\n\nWould you like tips on how to replicate this success across your other campaigns?' },
      { type: 'user', message: 'Yes, show me the tips' },
      { type: 'ai', message: 'Great! The key factors behind its success are:\n\n**1. Exit-intent trigger** — catches visitors before they leave\n**2. Personalized headline** — uses the visitor\'s browsing category\n**3. Single CTA** — one clear action reduces decision fatigue\n\nApplying these to your other campaigns could boost their performance significantly.' },
    ]
  },
  {
    title: 'How can I reduce cart abandonment?',
    messageCount: 2,
    messages: [
      { type: 'user', message: 'How can I reduce cart abandonment?' },
      { type: 'ai', message: 'Your **Cart Abandonment Stopper** campaign is already active. To improve it further:\n\n**1. Trigger earlier** — Show at 70% scroll on the cart page, not just on exit.\n**2. Offer a stronger incentive** — Free shipping converts better than % discounts.\n**3. Add urgency** — "Only 3 left in stock" messaging.\n\nWould you like me to suggest a specific template?' },
    ]
  },
  {
    title: 'Show me campaigns with low impressions',
    messageCount: 2,
    messages: [
      { type: 'user', message: 'Show me campaigns with low impressions' },
      { type: 'ai', message: 'Based on your current data, **Feedback Survey** has the lowest impressions with only **1,456 visitors** reached.\n\nThis is likely due to a narrow audience targeting rule. I\'d recommend reviewing the trigger settings and expanding the target URL conditions.' },
    ]
  },
])

const conversationTitle = computed(() => {
  const typed = chatMessage.value?.trim()
  if (typed) return typed.length > 28 ? typed.slice(0, 28) + '…' : typed
  const firstUser = messages.value.find(m => m.type === 'user')
  if (firstUser) return firstUser.message.length > 28 ? firstUser.message.slice(0, 28) + '…' : firstUser.message
  return 'New conversation'
})

const chatMessagesContainer = ref(null)
const chatTextareaRef = ref(null)

// Resize logic
const panelWidth = ref(360)
const MIN_WIDTH = 280
const MAX_WIDTH = 640

// Wide mode: panel takes all available space via flex:1 instead of fixed width
const isWideMode = computed(() => props.expandedWidth > 0)

// Effective width only used in non-wide mode
const effectiveWidth = computed(() => panelWidth.value)

const startResize = (e) => {
  e.preventDefault()
  const startX = e.clientX
  const startWidth = panelWidth.value

  const onMouseMove = (e) => {
    const delta = props.side === 'left' ? e.clientX - startX : startX - e.clientX
    panelWidth.value = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta))
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  if (messages.value.length > 0) {
    scrollToBottom()
  }
})

onUnmounted(() => {
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

const cardClasses = (card, msg) => {
  const base = 'image-card group rounded-xl overflow-hidden text-left transition-all duration-200'

  if (props.inline) return `${base} opacity-70 border border-om-gray-200`

  const selected = selectedCardId.value === card.id
  const border = selected ? 'border border-om-gray-600 shadow-md' : 'border border-om-gray-200'
  return `${base} ${border} cursor-pointer hover:shadow-lg hover:scale-[1.03] focus:outline-none`
}

const formatChatMessage = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const saveCurrentConversation = () => {
  if (messages.value.length === 0 || currentConversationSaved.value) return
  const firstUserMsg = messages.value.find(m => m.type === 'user')
  const title = firstUserMsg ? firstUserMsg.message : 'Conversation'
  savedConversations.value.unshift({
    title,
    messageCount: messages.value.length,
    messages: [...messages.value]
  })
  currentConversationSaved.value = true
}

const openConversationsModal = () => {
  saveCurrentConversation()
  showConversationsModal.value = true
}

const startNewConversation = () => {
  messages.value = []
  chatMessage.value = ''
  currentConversationSaved.value = false
  showConversationsModal.value = false
}

const loadConversation = (conv) => {
  messages.value = [...conv.messages]
  chatMessage.value = ''
  currentConversationSaved.value = true
  showConversationsModal.value = false
}

const resetConversation = () => {
  messages.value = []
  chatMessage.value = ''
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
}

const findMatcherResponse = (userMessage) => {
  const lower = userMessage.toLowerCase()
  for (const matcher of props.messageMatchers) {
    const allMatch = matcher.keywords.every(kw => kw === '' || lower.includes(kw.toLowerCase()))
    if (allMatch) {
      // Support dynamic response via function: response can be (userMessage) => string | object
      if (typeof matcher.response === 'function') {
        return { ...matcher, response: matcher.response(userMessage) }
      }
      return matcher
    }
  }
  return null
}

const sendAIResponse = (userMessage) => {
  isTyping.value = true
  scrollToBottom()
  setTimeout(() => {
    isTyping.value = false

    // 1. Exact match in aiResponses
    let response = props.aiResponses[userMessage]
    let matchedAction = null

    // 2. Keyword matcher fallback
    if (!response) {
      const matcher = findMatcherResponse(userMessage)
      if (matcher) {
        response = matcher.response
        matchedAction = matcher.action || null
      }
    }

    // 3. Generic fallback
    if (!response) {
      const fallbacks = [
        'I can help you with that! Here are some things I can do:\n\n- **Create a welcome popup** to greet new visitors\n- Show you how your **campaigns are performing**\n- Suggest ways to **improve your conversion rate**\n\nWhat would you like to try?',
        'I\'m not sure I fully understood that. Could you try rephrasing? For example, you can ask me to:\n\n- **Create a popup** for your website\n- **Analyze** your campaign performance\n- Give you **optimization tips**',
        'Hmm, let me think about that... In the meantime, I can help you **create popups**, **review campaign performance**, or **suggest improvements**. Just ask!',
      ]
      response = fallbacks[Math.floor(Math.random() * fallbacks.length)]
    }

    const message = typeof response === 'object' ? response.message : response
    const followUp = typeof response === 'object' ? response.followUp : null
    const actionFromResponse = typeof response === 'object' ? response.action : null
    const action = matchedAction || actionFromResponse

    messages.value.push({ type: 'ai', message })
    scrollToBottom()

    if (followUp) {
      setTimeout(() => {
        isTyping.value = true
        scrollToBottom()
        setTimeout(() => {
          isTyping.value = false
          // followUp can be a string (text message) or object (e.g. { type: 'ai-images', ... })
          if (typeof followUp === 'object' && followUp.type) {
            messages.value.push(followUp)
          } else {
            messages.value.push({ type: 'ai', message: followUp })
          }
          scrollToBottom()
          // Emit action after followUp is shown
          if (action) {
            setTimeout(() => emit('action', action), 800)
          }
        }, 900)
      }, 400)
    } else if (action) {
      // Emit action after a short delay so user can read the message
      setTimeout(() => emit('action', action), 1500)
    }
  }, 1200)
}

const handleImageCardClick = (card, msg) => {
  selectedCardId.value = card.id
  if (!msg?.skipUserMessage) {
    messages.value.push({ type: 'user', message: card.label })
  }
  scrollToBottom()
  sendAIResponse(card.label)
}

const handleSuggestionClick = (suggestion) => {
  messages.value.push({ type: 'user', message: suggestion })
  scrollToBottom()
  sendAIResponse(suggestion)
}

const handleChatSubmit = () => {
  if (chatMessage.value?.trim()) {
    const text = chatMessage.value.trim()
    messages.value.push({ type: 'user', message: text })
    scrollToBottom()
    chatMessage.value = ''
    sendAIResponse(text)
  }
}

// Expose methods for parent to inject messages (e.g. after panel expansion)
const pushMessage = (msg) => {
  isTyping.value = true
  scrollToBottom()
  setTimeout(() => {
    isTyping.value = false
    messages.value.push(msg)
    scrollToBottom()
  }, 900)
}

defineExpose({ pushMessage, messages })
</script>

<style scoped>
/* Suggestions fade in after panel opens */
.suggestions-fade-in {
  animation: suggestionsFadeIn 0.35s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

@keyframes suggestionsFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Left panel slide animation */
.panel-slide-left-enter-active,
.panel-slide-left-leave-active {
  transition: width 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease;
  overflow: hidden;
}
.panel-slide-left-enter-from,
.panel-slide-left-leave-to {
  width: 0 !important;
  opacity: 0;
}

/* Right panel slide animation */
.panel-slide-right-enter-active,
.panel-slide-right-leave-active {
  transition: width 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s ease;
  overflow: hidden;
}
.panel-slide-right-enter-from,
.panel-slide-right-leave-to {
  width: 0 !important;
  opacity: 0;
}

/* Smooth width transition when expandedWidth changes */
.chat-panel-width-transition {
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.resize-handle::after {
  content: '';
  position: absolute;
  left: -3px;
  top: 0;
  bottom: 0;
  width: 7px;
}

/* Scrollbar styles matching wizard */
.chat-panel-scroll {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.chat-panel-scroll:hover {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
.chat-panel-scroll::-webkit-scrollbar {
  width: 6px;
}
.chat-panel-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.chat-panel-scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}
.chat-panel-scroll:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

/* Chat FAB pulse animation */
@keyframes chat-ping {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  70% {
    transform: scale(1.7);
    opacity: 0;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}
.animate-chat-ping {
  animation: chat-ping 2s cubic-bezier(0, 0, 0.2, 1) 3;
}

/* Floating monk animation */
@keyframes monk-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.monk-float {
  animation: monk-float 4s ease-in-out infinite;
}
@keyframes monk-shadow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(0.85); opacity: 0.35; }
}
.monk-shadow-pulse {
  animation: monk-shadow-pulse 4s ease-in-out infinite;
}

/* Panel collapse-to-FAB transition */
.panel-to-fab-leave-active {
  transition: width 0.5s cubic-bezier(0.55, 0, 0.15, 1),
              transform 0.5s cubic-bezier(0.55, 0, 0.15, 1),
              opacity 0.35s ease 0.15s,
              border-radius 0.3s ease;
  transform-origin: bottom right;
  overflow: hidden;
  position: relative;
  z-index: 10;
}
.panel-to-fab-leave-to {
  width: 0 !important;
  transform: scale(0.08) translateY(40vh) translateX(20px);
  opacity: 0;
  border-radius: 50%;
}
/* Enter: expand from FAB position */
.panel-to-fab-enter-active {
  transition: width 0.5s cubic-bezier(0.15, 0.85, 0.45, 1),
              transform 0.5s cubic-bezier(0.15, 0.85, 0.45, 1),
              opacity 0.3s ease,
              border-radius 0.3s ease 0.2s;
  transform-origin: bottom right;
  overflow: hidden;
}
.panel-to-fab-enter-from {
  width: 0 !important;
  transform: scale(0.08) translateY(40vh) translateX(20px);
  opacity: 0;
  border-radius: 50%;
}
</style>
