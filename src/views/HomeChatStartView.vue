<template>
  <div class="h-screen-safe flex min-h-0 bg-white">
    <!-- Left app sidebar -->
    <Sidebar :show-ai-button="false" />

    <!-- Content: prompt input (same as the public-wizard-v2 start page) -->
    <div class="flex-1 flex flex-col items-center justify-center px-4 min-w-0">
      <div class="w-full max-w-2xl">
        <!-- Domain selector (above the title) -->
        <div class="w-56 mx-auto mb-6">
          <Dropdown v-model="selectedDomain" :options="domains" placeholder="Select domain">
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

        <h1 class="text-4xl font-semibold text-om-gray-700 text-center mb-6">Hi Csaba, what can I do for you?</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
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
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, markRaw } from 'vue'
import { ArrowUp, Mail, ShoppingCart, Sparkles } from 'lucide-vue-next'
import Sidebar from '../components/shared/Sidebar.vue'
import Dropdown from '../components/shared/Dropdown.vue'

const selectedDomain = ref('reflexshop.hu')
const domains = ref(['reflexshop.hu', 'telekom.hu', '+ Add new domain'])
const domainStatuses = {
  'reflexshop.hu': 'green',
  'telekom.hu': 'green',
}

const promptExamples = [
  { label: 'Discount Popup', value: 'Create a Discount Popup to capture more leads.', icon: markRaw(Mail) },
  { label: 'Cart Abandonment Stopper', value: 'Help me recover cart abandoners with a popup.', icon: markRaw(ShoppingCart) },
  { label: 'Get recommendation', value: 'Analyze my website and recommend the best opportunity for me.', icon: markRaw(Sparkles) },
]

const prompt = ref('')

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
})
onUnmounted(() => {
  if (placeholderTimeout) clearTimeout(placeholderTimeout)
})

// For now, sending the prompt kicks off the public-wizard-v2 flow
const handleSubmit = () => {
  if (!prompt.value.trim()) return
  window.location.hash = '#/public-wizard-v2'
}
</script>
