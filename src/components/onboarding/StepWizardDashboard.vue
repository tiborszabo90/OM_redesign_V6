<template>
  <div class="w-full h-full relative">
    <!-- Logo at top left corner -->
    <div class="fixed top-8 left-8 z-50">
      <img
        src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
        alt="OptiMonk"
        class="h-8"
      />
    </div>

    <!-- White screen after analysis complete -->
    <div v-if="analysisComplete" class="h-screen-safe bg-white"></div>

    <!-- Style selection screen -->
    <transition v-else-if="showStyleSelection" name="fade" appear>
      <div class="min-h-screen-safe bg-om-gray-50 overflow-y-auto">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-12">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Which style do you like the most?</h2>
            <p class="text-om-gray-500">You can customize colors, fonts, and other style settings in the next step.</p>
          </div>

          <!-- Popup grid - 2 columns -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <button
              v-for="(style, index) in popupStyles"
              :key="style.id"
              @click="selectStyle(style.id)"
              :class="[
                'relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group',
                selectedStyle === style.id
                  ? 'border-om-orange-500 ring-2 ring-om-orange-200'
                  : 'border-om-gray-200 hover:border-om-gray-300'
              ]"
            >
              <!-- Popup preview image -->
              <div class="aspect-video bg-om-gray-100 flex items-center justify-center relative overflow-hidden">
                <img :src="style.image" :alt="style.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>

              <!-- Selection indicator -->
              <div
                v-if="selectedStyle === style.id"
                class="absolute top-3 right-3 w-6 h-6 bg-om-orange-500 rounded-full flex items-center justify-center"
              >
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
                </svg>
              </div>
            </button>
          </div>

          <!-- Continue button -->
          <div class="mt-8">
            <button
              v-if="selectedStyle"
              @click="confirmStyleSelection"
              class="px-8 py-3 bg-om-orange-500 text-white font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success message screen -->
    <transition v-else-if="showSuccessMessage" name="fade" appear>
      <div class="h-screen-safe bg-white flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 bg-[#239E77] rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,7.21a1,1,0,0,0-1.42,0L9.84,14.67,6.71,11.53A1,1,0,1,0,5.29,13l3.84,3.84a1,1,0,0,0,1.42,0l8.16-8.16A1,1,0,0,0,18.71,7.21Z"/>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-[#23262A]">Analysis successful</h2>
        </div>
      </div>
    </transition>

    <!-- Analysis screen - two column layout (responsive) -->
    <transition v-else-if="submitted && showAnalysisContent" name="fade">
      <div class="h-screen-safe bg-white flex items-center justify-center px-4 sm:px-6 md:px-8 xl:px-12">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-6xl w-full">
        <!-- Left side - Scanner animation -->
        <div class="shrink-0">
          <WebsiteScanAnimation />
        </div>

        <!-- Right side - Discovered items list -->
        <div class="flex-1 w-full md:w-auto md:min-w-72 lg:min-w-80 xl:max-w-72 2xl:max-w-80">
          <!-- Title -->
          <div class="mb-6 text-center md:text-left">
            <h2 class="text-xl sm:text-2xl font-semibold text-[#23262A]">Analyzing your website</h2>
          </div>

          <!-- Discovered items - vertical list -->
          <div class="space-y-3">
            <!-- Logo item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.logo" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Logo</p>
                </div>
                <div class="w-14 h-14 rounded-lg overflow-hidden bg-white border border-[#E3E5E8] flex items-center justify-center shrink-0">
                  <img src="/telekom.png" alt="Logo" class="w-full h-full object-cover" />
                </div>
              </div>
            </transition>

            <!-- Colors item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.colors" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Colors</p>
                </div>
                <div class="flex gap-1.5 shrink-0">
                  <div v-for="color in brandColors" :key="color"
                       class="w-6 h-6 rounded-full border border-white shadow-sm"
                       :style="{ backgroundColor: color }"></div>
                </div>
              </div>
            </transition>

            <!-- Fonts item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.fonts" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Fonts</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    v-for="(font, index) in discoveredFonts"
                    :key="font.name"
                    class="text-base text-om-gray-600"
                    :style="{ fontFamily: font.fontFamily }"
                  >{{ font.name }}{{ index < discoveredFonts.length - 1 ? ',' : '' }}</span>
                </div>
              </div>
            </transition>

            <!-- Language item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.language" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Language</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-lg">🇬🇧</span>
                  <span class="text-sm text-om-gray-600">English</span>
                </div>
              </div>
            </transition>

            <!-- Currently analyzing message - shows below discovered items -->
            <transition name="fade-message">
              <div v-if="currentlyAnalyzing" class="flex items-center gap-2 py-2">
                <div class="w-4 h-4 border-2 border-om-gray-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
                <p class="text-sm text-om-gray-500">{{ analyzingMessages[currentlyAnalyzing] }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    </transition>

    <!-- Initial state - should not be visible as we auto-start -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-semibold text-[#23262A]">Wizard analysis</h2>
        <p class="text-[#505763] mt-2">Starting analysis based on your use case...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import WebsiteScanAnimation from '../illustrations/WebsiteScanAnimation.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  initialMessage: {
    type: String,
    default: ''
  },
  startAtStyle: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'task-created'])

const submitted = ref(false)
const submittedMessage = ref('')
const currentlyAnalyzing = ref(null) // 'logo', 'colors', 'fonts', 'language', or null
const showAnalysisContent = ref(true)
const showSuccessMessage = ref(false)
const showStyleSelection = ref(false)
const selectedStyle = ref(null)
const analysisComplete = ref(false)

// Track which discoveries have been made
const discoveries = reactive({
  logo: false,
  colors: false,
  fonts: false,
  language: false
})

const brandColors = ['#E20074', '#18214D', '#5D6482']
const discoveredFonts = [
  { name: 'TeleNeo', fontFamily: '"TeleNeo", sans-serif' },
  { name: 'Arial', fontFamily: 'Arial, sans-serif' }
]

const popupStyles = [
  { id: 'modern', name: 'Modern', image: '/om_popup_1.png' },
  { id: 'classic', name: 'Classic', image: '/om_popup_2.png' },
  { id: 'minimal', name: 'Minimal', image: '/om_popup_3.png' },
  { id: 'bold', name: 'Bold', image: '/om_popup_4.png' },
  { id: 'elegant', name: 'Elegant', image: '/om_popup_5.png' },
  { id: 'playful', name: 'Playful', image: '/om_popup_6.png' }
]

const analyzingMessages = {
  logo: 'Looking for logo...',
  colors: 'Analyzing brand colors...',
  fonts: 'Identifying fonts...',
  language: 'Detecting language...'
}

const localData = reactive({
  message: props.modelValue.message || ''
})

// Analysis steps with timing
const runAnalysis = () => {
  // Step 1: Start analyzing logo
  setTimeout(() => {
    currentlyAnalyzing.value = 'logo'
  }, 500)

  // Logo found
  setTimeout(() => {
    discoveries.logo = true
    currentlyAnalyzing.value = 'colors'
  }, 3000)

  // Step 2: Colors found
  setTimeout(() => {
    discoveries.colors = true
    currentlyAnalyzing.value = 'fonts'
  }, 6000)

  // Step 3: Fonts found
  setTimeout(() => {
    discoveries.fonts = true
    currentlyAnalyzing.value = 'language'
  }, 9000)

  // Step 4: Language found
  setTimeout(() => {
    discoveries.language = true
    currentlyAnalyzing.value = null
  }, 11500)

  // Step 5: Fade out analysis content and show success message simultaneously
  setTimeout(() => {
    showAnalysisContent.value = false
    showSuccessMessage.value = true
  }, 12000)

  // Step 6: Fade out success message and show style selection
  setTimeout(() => {
    showSuccessMessage.value = false
    showStyleSelection.value = true
  }, 14000)
}

const selectStyle = (styleId) => {
  selectedStyle.value = styleId
}

const confirmStyleSelection = () => {
  showStyleSelection.value = false
  analysisComplete.value = true
}

const handleSubmit = () => {
  if (localData.message?.trim()) {
    submittedMessage.value = localData.message.trim()
    emit('update:modelValue', { message: submittedMessage.value })
    emit('task-created', { message: submittedMessage.value, phase: 'analysis' })
    submitted.value = true
    runAnalysis()
  }
}

const resetToInitial = () => {
  submitted.value = false
  submittedMessage.value = ''
  localData.message = ''
  currentlyAnalyzing.value = null
  showAnalysisContent.value = true
  showSuccessMessage.value = false
  showStyleSelection.value = false
  selectedStyle.value = null
  analysisComplete.value = false
  discoveries.logo = false
  discoveries.colors = false
  discoveries.fonts = false
  discoveries.language = false
}

// Start analysis with a pre-filled message (used when coming from wizard)
const startWithMessage = (message) => {
  if (message?.trim()) {
    localData.message = message.trim()
    handleSubmit()
  }
}

// Auto-start if initialMessage is provided or start at style selection
onMounted(() => {
  if (props.startAtStyle) {
    // Start directly at style selection
    submitted.value = true
    showAnalysisContent.value = false
    showStyleSelection.value = true
  } else if (props.initialMessage) {
    setTimeout(() => {
      startWithMessage(props.initialMessage)
    }, 100)
  }
})

defineExpose({
  resetToInitial,
  startWithMessage
})
</script>

<style scoped>
.slide-in-enter-active {
  transition: all 0.4s ease-out;
}

.slide-in-leave-active {
  transition: all 0.3s ease-in;
}

.slide-in-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-in-leave-to {
  opacity: 0;
}

.fade-message-enter-active {
  transition: all 0.3s ease-out;
}

.fade-message-leave-active {
  transition: all 0.2s ease-in;
}

.fade-message-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}

.fade-message-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
