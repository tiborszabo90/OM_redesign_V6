<template>
  <!-- Step 1: URL input -->
  <div v-if="step === 'url'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-2xl">
      <!-- Logo -->
      <div class="flex justify-center mb-10">
        <img
          src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
          alt="OptiMonk"
          class="h-8"
        />
      </div>

      <!-- Heading -->
      <h1 class="text-4xl font-semibold text-om-gray-700 text-center mb-2">Website optimization magic.</h1>
      <p class="text-om-gray-500 text-center mb-8">Add your website URL and get your tailored optimization ideas in 2 minutes.</p>

      <!-- URL input -->
      <form @submit.prevent="handleUrlSubmit" class="flex flex-col gap-3">
        <div class="flex gap-2">
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
        <p class="text-center text-xs text-om-gray-400">No email address needed.</p>
      </form>
    </div>
  </div>

  <!-- Step 2: Chat input (like home page) -->
  <div v-else-if="step === 'chat'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-2xl">
      <!-- Logo -->
      <div class="flex justify-center mb-10">
        <img
          src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
          alt="OptiMonk"
          class="h-8"
        />
      </div>

      <!-- Heading -->
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-semibold text-om-gray-700">What should be the goal of your first campaign?</h2>
      </div>

      <!-- Chat input area (matches home page style) -->
      <div class="relative mx-auto">
        <textarea
          ref="textareaRef"
          v-model="chatMessage"
          rows="4"
          @keydown.enter.exact.prevent="handleChatSubmit"
          class="w-full px-4 py-3 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 h-28 resize-none pr-12 bg-white"
          :placeholder="currentPlaceholder"
        ></textarea>
        <!-- Attach button -->
        <button class="absolute bottom-3 left-2 w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-600 hover:bg-om-gray-100 rounded-lg transition-all cursor-pointer">
          <Paperclip :size="20" />
        </button>
        <!-- Submit button -->
        <button
          @click="handleChatSubmit"
          :disabled="!chatMessage.trim()"
          :class="[
            'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            chatMessage.trim() ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
          ]"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.71,11.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,1.42,1.42L11,9.41V17a1,1,0,0,0,2,0V9.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,17.71,11.29Z"/>
          </svg>
        </button>
      </div>

      <!-- Chips -->
      <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          v-for="chip in chips"
          :key="chip"
          @click="selectChip(chip)"
          class="px-3 py-1.5 rounded-full bg-white border border-om-gray-200 text-sm text-om-gray-700 transition-all duration-200 ease-out cursor-pointer hover:scale-[1.02] hover:border-om-gray-300"
        >
          {{ chip }}
        </button>
      </div>
    </div>
  </div>

  <!-- Step 3: Wizard (with sidebar only on recommendation) -->
  <DashboardLayout v-else no-content-padding background-color="#FFFFFF" hide-sidebar @menu-click="handleMenuClick">
    <template #content>
      <PublicStepWizardDashboard
        ref="stepWizardDashboardRef"
        :data="formData"
        :registration-data="props.registrationData"
        :initial-message="finalMessage"
        :show-chat="false"
        @task-created="(task) => emit('task-created', task)"
        @navigate-to="(view) => emit('navigate-to', view)"
        @phase-changed="(view) => { currentPhase.value = view; emit('phase-changed', view) }"
        @registration-completed="emit('registration-completed')"
      />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { Paperclip } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import PublicStepWizardDashboard from '../components/onboarding/PublicStepWizardDashboard.vue'

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['task-created', 'navigate-to', 'phase-changed', 'menu-click', 'registration-completed'])

const stepWizardDashboardRef = ref(null)
const formData = ref({})
const textareaRef = ref(null)
const currentPhase = ref('wizard-analysis')

const step = ref('url')
const url = ref('')
const chatMessage = ref('')
const finalMessage = ref('')

// Rotating placeholder
const placeholderSuggestions = [
  'Email list building...',
  'Stop cart abandonment...',
  'Collect customer feedback...',
  'Boost conversions...',
  'Grow newsletter subscribers...'
]
const currentPlaceholderIndex = ref(0)
const displayedText = ref('')
let typingTimeout = null

const currentPlaceholder = computed(() => displayedText.value)

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
      typeText(placeholderSuggestions[currentPlaceholderIndex.value])
    }, 300)
  }
}

onMounted(() => {
  typeText(placeholderSuggestions[0])
})

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout)
})

// Chips
const chips = ['Email list building', 'Stop cart abandonment', 'Collect feedback']

const selectChip = (chip) => {
  chatMessage.value = chip
  nextTick(() => textareaRef.value?.focus())
}

const handleUrlSubmit = () => {
  if (!url.value.trim()) return
  step.value = 'chat'
  nextTick(() => textareaRef.value?.focus())
}

const handleChatSubmit = () => {
  if (!chatMessage.value.trim()) return
  finalMessage.value = chatMessage.value
  step.value = 'wizard'
}

const handleMenuClick = () => {
  stepWizardDashboardRef.value?.openRegistrationModal()
}

defineExpose({
  stepWizardDashboardRef,
  navigateToStep: (s) => { step.value = s },
  navigateToPhase: (phase) => {
    step.value = 'wizard'
    currentPhase.value = phase
    nextTick(() => {
      if (stepWizardDashboardRef.value && stepWizardDashboardRef.value.navigateToPhase) {
        stepWizardDashboardRef.value.navigateToPhase(phase)
      }
    })
  }
})
</script>
