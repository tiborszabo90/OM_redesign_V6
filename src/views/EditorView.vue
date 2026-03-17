<template>
  <div class="flex h-screen-safe bg-white overflow-hidden">

    <!-- Left sidebar -->
    <div class="sidebar-enter w-19 border-r border-om-gray-200 flex flex-col items-center pt-3 pb-4 shrink-0 bg-white">
      <div class="w-7 h-7 mb-5 flex items-center justify-center shrink-0">
        <img src="/icons/optimonk-logo.svg" alt="OptiMonk" class="w-full h-full" />
      </div>
      <nav class="flex-1 flex flex-col w-full px-1 gap-1">
        <!-- Theme -->
        <button
          class="w-full py-2 flex flex-col items-center gap-0.5 rounded-xl transition-colors"
          :class="activeSidebarItem === 'theme' ? 'bg-om-orange-100 text-om-orange-500' : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'"
          @click="activeSidebarItem = 'theme'"
        >
          <Brush :size="20" />
          <span class="text-[10px] font-medium leading-tight text-center">Theme</span>
        </button>
        <!-- Display -->
        <button
          class="w-full py-2 flex flex-col items-center gap-0.5 rounded-xl transition-colors"
          :class="activeSidebarItem === 'display' ? 'bg-om-orange-100 text-om-orange-500' : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'"
          @click="activeSidebarItem = 'display'"
        >
          <Monitor :size="20" />
          <span class="text-[10px] font-medium leading-tight text-center">Display</span>
        </button>
        <!-- Add elements -->
        <button
          class="w-full py-2 flex flex-col items-center gap-0.5 rounded-xl transition-colors"
          :class="activeSidebarItem === 'add' ? 'bg-om-orange-100 text-om-orange-500' : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'"
          @click="activeSidebarItem = 'add'"
        >
          <PlusCircle :size="20" />
          <span class="text-[10px] font-medium leading-tight text-center whitespace-pre-line">Add&#10;elements</span>
        </button>
        <!-- Code -->
        <button
          class="w-full py-2 flex flex-col items-center gap-0.5 rounded-xl transition-colors"
          :class="activeSidebarItem === 'code' ? 'bg-om-orange-100 text-om-orange-500' : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'"
          @click="activeSidebarItem = 'code'"
        >
          <Code2 :size="20" />
          <span class="text-[10px] font-medium leading-tight text-center">Code</span>
        </button>
      </nav>
    </div>

    <!-- Right side: top bar + content -->
    <div class="flex flex-col flex-1 min-w-0">

    <!-- Top Bar -->
    <div class="flex items-center h-12 border-b border-gray-200 px-3 shrink-0 bg-white">
      <!-- Left: back + campaign info -->
      <div class="flex items-center gap-2 flex-1">
        <button class="flex items-center text-gray-500 hover:text-gray-800" @click="$emit('go-back')">
          <ChevronLeft :size="18" />
        </button>
        <div class="flex flex-col leading-tight">
          <span class="text-sm font-semibold text-gray-900">Campaign #182</span>
          <span class="text-xs text-gray-400">Variant 1</span>
        </div>
      </div>

      <!-- Center: device toggle + preview -->
      <div class="flex items-center gap-1">
        <button
          class="p-1.5 rounded transition-colors"
          :class="device === 'desktop' ? 'text-[#FF4D00]' : 'text-gray-400 hover:text-gray-600'"
          @click="device = 'desktop'"
        >
          <Monitor :size="18" />
        </button>
        <button
          class="p-1.5 rounded transition-colors"
          :class="device === 'mobile' ? 'text-[#FF4D00]' : 'text-gray-400 hover:text-gray-600'"
          @click="device = 'mobile'"
        >
          <Smartphone :size="18" />
        </button>
        <span class="text-sm text-gray-500 ml-1">Preview</span>
      </div>

      <!-- Right: undo/redo + actions -->
      <div class="flex items-center gap-2 flex-1 justify-end">
        <button class="p-1.5 text-gray-300 cursor-not-allowed" disabled><Undo2 :size="16" /></button>
        <button class="p-1.5 text-gray-300 cursor-not-allowed" disabled><Redo2 :size="16" /></button>
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="outline" size="sm">Save</Button>
        <Button variant="primary" size="sm">Save &amp; Exit</Button>
      </div>
    </div>

    <!-- Main layout -->
    <div class="flex flex-1 min-h-0">

      <!-- Canvas area -->
      <div class="flex-1 flex flex-col min-w-0 bg-[#e8e8e8]">
        <!-- Canvas -->
        <div class="flex-1 overflow-auto min-h-0 p-10">
          <!-- Website overlay (dark background) -->
          <div class="relative w-full h-full bg-[#4E686D] rounded shadow-xl flex items-center justify-center">
            <!-- Popup placeholder -->
            <div class="bg-white rounded shadow-2xl" style="width: 620px; height: 360px;"></div>
            <!-- OptiMonk footer -->
            <div class="absolute bottom-2 left-3 flex items-center gap-1 text-white text-xs">
              Made with <span class="text-red-400 mx-0.5">♥</span> by OptiMonk
            </div>
          </div>
        </div>

        <!-- Bottom page tabs strip -->
        <div class="shrink-0 flex justify-center bg-[#e8e8e8] relative">
        <div class="bg-white border-t border-l border-r border-gray-200 rounded-t-xl relative">
          <!-- Chevron up handle -->
          <div class="absolute -top-5 left-1/2 -translate-x-1/2">
            <button class="w-25 h-7 bg-white rounded-t-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronUp :size="18" class="text-gray-400" />
            </button>
          </div>
          <div class="flex items-center h-10 w-fit">
            <!-- Main page (active) -->
            <button class="w-40 h-full flex items-center justify-center text-xs font-medium text-om-orange-500 hover:bg-gray-50 transition-colors">
              Main page
            </button>
            <div class="w-px h-5 bg-gray-200" />
            <!-- Thank you -->
            <button class="w-40 h-full flex items-center justify-center text-xs text-om-gray-500 hover:bg-gray-50 transition-colors">
              Thank you
            </button>
            <div class="w-px h-5 bg-gray-200" />
            <!-- Teaser -->
            <button class="w-40 h-full flex items-center justify-center text-xs text-om-gray-500 hover:bg-gray-50 transition-colors">
              Teaser
            </button>
            <div class="w-px h-5 bg-gray-200" />
            <!-- Add new page -->
            <button class="w-40 h-full flex items-center justify-center gap-1.5 text-xs text-om-gray-500 hover:bg-gray-50 transition-colors">
              <PlusCircle :size="16" />
              Add new page
            </button>
          </div>
        </div>
        </div>
      </div>

      <!-- Right panel -->
      <div class="w-72 border-l border-gray-200 flex flex-col shrink-0 bg-white">
        <!-- Visual / AI tabs -->
        <div class="px-3 py-2 shrink-0">
          <div class="flex bg-gray-100 rounded-xl p-1 gap-1">
            <!-- Visual tab: not clickable -->
            <div class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium text-gray-400 cursor-pointer hover:text-gray-500 transition-colors">
              <Brush :size="14" /> Visual
            </div>
            <!-- AI tab: always active -->
            <div class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium text-om-orange-500 bg-white shadow-sm">
              <Sparkles :size="14" /> AI
            </div>
          </div>
        </div>

        <!-- Chat: empty state -->
        <div v-if="chatMessages.length === 0" class="flex-1 flex flex-col p-4 min-h-0">
          <div class="flex flex-col items-center pt-6">
            <div class="w-24 h-24 rounded-full bg-om-gray-100 flex items-center justify-center mb-4">
              <img src="/icons/optibot64.svg" alt="OptiBot" class="w-16 h-16" />
            </div>
            <h3 class="text-base font-semibold text-om-gray-700 mb-1 text-center">How can I help you?</h3>
          </div>
          <div class="mt-auto pb-2">
            <p class="text-xs text-om-gray-500 mb-3">Try with an example:</p>
            <div class="flex flex-col gap-2">
              <button
                v-for="suggestion in chatSuggestions"
                :key="suggestion"
                @click="handleSuggestionClick(suggestion)"
                class="w-full text-left px-3 py-1.5 rounded-lg bg-white border border-om-gray-200 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>

        <!-- Chat: messages -->
        <div v-else ref="chatMessagesContainer" class="flex-1 overflow-y-auto space-y-3 p-4 min-h-0 chat-scroll">
          <div v-for="(msg, index) in chatMessages" :key="index" class="flex" :class="msg.type === 'user' ? 'justify-end' : 'justify-start'">
            <div v-if="msg.type === 'user'" class="bg-om-peach-100 text-om-gray-700 px-3 py-2 rounded-2xl rounded-br-md max-w-[90%] text-sm">
              {{ msg.message }}
            </div>
            <div v-else class="bg-om-gray-100 text-om-gray-700 px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm leading-relaxed" v-html="formatMessage(msg.message)" />
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
        <div class="p-3 shrink-0">
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
              class="absolute bottom-3 left-1.5 w-8 h-8 rounded-lg flex items-center justify-center text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600 transition-colors"
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
      </div>

    </div>
    </div><!-- end right side -->
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Button from '../components/shared/Button.vue'
import {
  ChevronLeft, ChevronUp, Monitor, Smartphone,
  Undo2, Redo2, X, Plus,
  Brush, PlusCircle, Code2,
  Sparkles, Paperclip, ArrowUp
} from 'lucide-vue-next'

defineEmits(['go-back'])

const device = ref('desktop')
const activeSidebarItem = ref('elements')

// Chat
const chatMessage = ref('')
const chatMessages = ref([])
const isTyping = ref(false)
const chatMessagesContainer = ref(null)
const chatTextareaRef = ref(null)

const chatSuggestions = [
  'Change the headline to be more engaging',
  'Make the CTA button stand out more',
  'Suggest a better color scheme',
  'Add urgency to the copy',
]

const aiResponses = {
  'Change the headline to be more engaging': 'Here are 3 alternative headlines for your popup:\n\n**1.** "Claim Your Welcome Gift — 10% Off Awaits!"\n**2.** "Exclusive Offer: Save 10% on Your First Order"\n**3.** "Your Special Welcome Discount Is Ready 🎁"\n\nOption 1 creates urgency, option 2 builds exclusivity, and option 3 feels warm and personal. Which would you like to apply?',
  'Make the CTA button stand out more': 'To make your CTA more prominent:\n\n**1. Color contrast** — Try a bright yellow `#FFD600` against the green background instead of white\n**2. Text** — "GET MY 10% COUPON NOW" adds ownership and urgency\n**3. Size** — Increase padding to `py-4` for a taller button\n\nShall I apply any of these changes?',
  'Suggest a better color scheme': 'Based on your brand colors, here are 2 schemes that complement the green panel:\n\n**Option A — Warm** 🟠\n- Primary: `#FF6B35`\n- Accent: `#FFD166`\n\n**Option B — Premium** 🖤\n- Primary: `#1A1A2E`\n- Accent: `#E94560`\n\nWould you like to preview either of these?',
  'Add urgency to the copy': 'I can add urgency with these changes:\n\n**Headline:** "Last Chance: Your 10% Welcome Gift Expires Today!"\n**Subtitle:** "Only 47 coupons left — don\'t miss out!"\n**CTA:** "CLAIM MY COUPON BEFORE IT\'S GONE"\n\nThis uses scarcity + time pressure which typically boosts conversion by 15–25%. Apply these?',
}

const formatMessage = (text) => {
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
    const response = aiResponses[userMessage] || 'Great question! Based on the current popup design, I\'d recommend A/B testing your headline and CTA copy first — those typically have the biggest impact on conversion rates.'
    chatMessages.value.push({ type: 'ai', message: response })
    scrollToBottom()
  }, 1200)
}

const handleSuggestionClick = (suggestion) => {
  chatMessages.value.push({ type: 'user', message: suggestion })
  scrollToBottom()
  sendAIResponse(suggestion)
}

const handleChatSubmit = () => {
  if (chatMessage.value?.trim()) {
    const text = chatMessage.value.trim()
    chatMessages.value.push({ type: 'user', message: text })
    scrollToBottom()
    chatMessage.value = ''
    sendAIResponse(text)
  }
}
</script>

<style scoped>
.chat-scroll {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.chat-scroll:hover {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
.chat-scroll::-webkit-scrollbar { width: 6px; }
.chat-scroll::-webkit-scrollbar-track { background: transparent; }
.chat-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 3px; }
.chat-scroll:hover::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); }
</style>
