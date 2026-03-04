<template>
  <!-- Collapsed tab (fixed to viewport right edge, no layout space taken) -->
  <button
    v-if="!modelValue"
    @click="emit('update:modelValue', true)"
    class="chat-tab fixed top-4 right-0 z-20 w-9 h-12 bg-om-orange-500 border border-r-0 border-transparent rounded-l-xl shadow-sm flex items-center justify-center text-white hover:bg-[#E54D1F] transition-colors cursor-pointer"
  >
    <img src="/icons/optibot24.svg" alt="OptiBot" class="w-6 h-6" />
  </button>

  <!-- Chat panel (flow element, wide column) -->
  <div
    v-if="modelValue"
    class="w-90 shrink-0 flex flex-col bg-white border-l border-[#E3E5E8] p-4 pt-6 pb-4"
  >
    <!-- Header with close button -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-sm font-semibold text-[#23262A]">Ask OptiMonk</span>
      <button
        @click="emit('update:modelValue', false)"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-[#8F97A4] hover:text-[#505763] hover:bg-[#F1F2F4] transition-colors cursor-pointer"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Empty state (outside overflow container so scale hover is not clipped) -->
    <div v-if="messages.length === 0" class="flex-1 flex flex-col mb-4">
      <!-- Robot icon in circle -->
      <div class="flex flex-col items-center pt-6">
        <div class="w-24 h-24 rounded-full bg-om-gray-100 flex items-center justify-center mb-4">
          <img src="/icons/optibot64.svg" alt="OptiBot" class="w-16 h-16" />
        </div>
        <!-- Headline -->
        <h3 class="text-base font-semibold text-om-gray-700 mb-1 text-center">How can I help you?</h3>
      </div>
      <!-- Suggestions at the bottom -->
      <div class="mt-auto pb-2">
        <p class="text-xs text-om-gray-500 mb-3">Try with an example:</p>
        <div class="flex flex-col gap-2">
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
    </div>

    <!-- Messages area (only rendered when there are messages) -->
    <div v-else ref="chatMessagesContainer" class="flex-1 overflow-y-auto space-y-3 mb-4 chat-panel-scroll">
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

    <!-- Chat input -->
    <div class="relative">
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
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { ArrowUp, X, Check, Paperclip } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
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
  }
})

const emit = defineEmits(['update:modelValue'])

const chatMessage = ref('')
const messages = ref([])
const isTyping = ref(false)

const chatMessagesContainer = ref(null)
const chatTextareaRef = ref(null)

const formatChatMessage = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
}

const sendAIResponse = (userMessage) => {
  isTyping.value = true
  scrollToBottom()
  setTimeout(() => {
    isTyping.value = false
    const response = props.aiResponses[userMessage] || 'Great question! Let me look into that for you. Based on your current campaign data, I\'d recommend reviewing your targeting settings and A/B testing your CTA copy.'
    const message = typeof response === 'object' ? response.message : response
    const followUp = typeof response === 'object' ? response.followUp : null
    messages.value.push({ type: 'ai', message })
    scrollToBottom()
    if (followUp) {
      setTimeout(() => {
        isTyping.value = true
        scrollToBottom()
        setTimeout(() => {
          isTyping.value = false
          messages.value.push({ type: 'ai', message: followUp })
          scrollToBottom()
        }, 900)
      }, 400)
    }
  }, 1200)
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
</script>

<style scoped>
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
</style>
