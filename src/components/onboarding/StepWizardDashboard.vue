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

    <!-- White screen after quicktune complete -->
    <div v-if="quicktuneComplete" class="h-screen-safe bg-white"></div>

    <!-- Quicktune screen -->
    <transition v-else-if="showQuicktune" name="fade" appear>
      <div class="min-h-screen-safe bg-om-gray-50 overflow-y-auto">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-24 pb-12">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Quick-tune your brand settings</h2>
            <p class="text-om-gray-500">Don't worry—all settings can be customized later in the editor.</p>
          </div>

          <!-- Two column layout -->
          <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <!-- Left side - Settings -->
            <div class="w-full lg:w-80 shrink-0 space-y-6">
              <!-- Template language -->
              <div>
                <label class="block text-sm font-medium text-om-gray-700 mb-2">Template language</label>
                <select
                  v-model="brandSettings.language"
                  class="w-full px-4 py-2.5 border border-om-gray-200 rounded-xl bg-white text-om-gray-700 focus:outline-none focus:ring-2 focus:ring-om-orange-200 focus:border-om-orange-500 cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hu">Hungarian</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <!-- Logo -->
              <div>
                <label class="block text-sm font-medium text-om-gray-700 mb-2">Logo</label>
                <div class="flex items-center gap-3">
                  <div class="flex-1 h-16 bg-[repeating-conic-gradient(#E3E5E8_0%_25%,transparent_0%_50%)_50%/16px_16px] rounded-xl flex items-center justify-center border border-om-gray-200">
                    <div class="w-12 h-12 bg-[#E20074] rounded-lg flex items-center justify-center">
                      <span class="text-white text-2xl font-bold">T</span>
                    </div>
                  </div>
                  <button class="w-10 h-10 border border-om-gray-200 rounded-xl flex items-center justify-center text-om-gray-400 hover:text-om-gray-600 hover:border-om-gray-300 transition-colors cursor-pointer">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,6H17.5l-1.71-1.71A1,1,0,0,0,15.08,4H8.92a1,1,0,0,0-.71.29L6.5,6H3A1,1,0,0,0,2,7V19a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V7A1,1,0,0,0,21,6Zm-1,12H4V8H7.08l1.71-1.71h6.42L16.92,8H20Z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Colors -->
              <div>
                <label class="block text-sm font-medium text-om-gray-700 mb-2">Color</label>
                <div class="flex gap-2">
                  <button
                    v-for="(color, index) in brandSettings.colors"
                    :key="index"
                    class="w-10 h-10 rounded-lg border-2 transition-all cursor-pointer"
                    :class="brandSettings.selectedColorIndex === index ? 'border-om-orange-500 ring-2 ring-om-orange-200' : 'border-om-gray-200'"
                    :style="{ backgroundColor: color }"
                    @click="brandSettings.selectedColorIndex = index"
                  ></button>
                </div>
              </div>

              <!-- Fonts -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-om-gray-700">Font</label>
                <div>
                  <label class="block text-xs text-om-gray-500 mb-1">Primary font</label>
                  <div class="flex items-center gap-2">
                    <select
                      v-model="brandSettings.primaryFont"
                      class="flex-1 px-4 py-2.5 border border-om-gray-200 rounded-xl bg-white text-om-gray-700 focus:outline-none focus:ring-2 focus:ring-om-orange-200 focus:border-om-orange-500 cursor-pointer"
                    >
                      <option value="Arial Regular">Arial Regular</option>
                      <option value="TeleNeo">TeleNeo</option>
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                    </select>
                    <button class="w-10 h-10 border border-om-gray-200 rounded-xl flex items-center justify-center text-om-gray-400 hover:text-om-gray-600 hover:border-om-gray-300 transition-colors cursor-pointer">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-om-gray-500 mb-1">Secondary font</label>
                  <div class="flex items-center gap-2">
                    <select
                      v-model="brandSettings.secondaryFont"
                      class="flex-1 px-4 py-2.5 border border-om-gray-200 rounded-xl bg-white text-om-gray-700 focus:outline-none focus:ring-2 focus:ring-om-orange-200 focus:border-om-orange-500 cursor-pointer"
                    >
                      <option value="Arial Light">Arial Light</option>
                      <option value="TeleNeo Light">TeleNeo Light</option>
                      <option value="Inter Light">Inter Light</option>
                      <option value="Roboto Light">Roboto Light</option>
                    </select>
                    <button class="w-10 h-10 border border-om-gray-200 rounded-xl flex items-center justify-center text-om-gray-400 hover:text-om-gray-600 hover:border-om-gray-300 transition-colors cursor-pointer">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Corners -->
              <div>
                <label class="block text-sm font-medium text-om-gray-700 mb-2">Corners</label>
                <div class="flex gap-2">
                  <button
                    v-for="corner in cornerOptions"
                    :key="corner.id"
                    @click="brandSettings.corners = corner.id"
                    :class="[
                      'flex-1 py-3 px-2 border-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer',
                      brandSettings.corners === corner.id
                        ? 'border-om-orange-500 bg-om-orange-50'
                        : 'border-om-gray-200 hover:border-om-gray-300'
                    ]"
                  >
                    <div
                      class="w-6 h-6 border-2 border-om-gray-400"
                      :class="corner.class"
                    ></div>
                    <span class="text-xs text-om-gray-600">{{ corner.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Continue button -->
              <div class="pt-4">
                <button
                  @click="confirmQuicktune"
                  class="w-full px-8 py-3 bg-om-orange-500 text-white font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>

            <!-- Right side - Popup preview -->
            <div class="flex-1 flex items-start justify-center">
              <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <!-- Popup preview content -->
                <div class="flex flex-col items-center text-center">
                  <!-- Logo -->
                  <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4" :style="{ backgroundColor: brandSettings.colors[0] }">
                    <span class="text-white text-3xl font-bold">T</span>
                  </div>
                  <!-- Headline -->
                  <h3 class="text-xl font-semibold text-om-gray-700 mb-2" :style="{ fontFamily: brandSettings.primaryFont }">
                    Get 10% off your first order
                  </h3>
                  <!-- Subtext -->
                  <p class="text-sm text-om-gray-500 mb-6" :style="{ fontFamily: brandSettings.secondaryFont }">
                    Subscribe to our newsletter and receive exclusive offers.
                  </p>
                  <!-- Email input -->
                  <input
                    type="email"
                    placeholder="Enter your email"
                    class="w-full px-4 py-3 border border-om-gray-200 mb-3 text-sm"
                    :class="cornerClasses[brandSettings.corners]"
                    disabled
                  />
                  <!-- Button -->
                  <button
                    class="w-full py-3 text-white font-medium text-sm"
                    :class="cornerClasses[brandSettings.corners]"
                    :style="{ backgroundColor: brandSettings.colors[0] }"
                    disabled
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

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
              @click="selectStyleAndContinue(style.id)"
              class="relative rounded-2xl overflow-hidden border-2 border-om-gray-200 transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <!-- Popup preview image -->
              <div class="aspect-video bg-om-gray-100 flex items-center justify-center relative overflow-hidden">
                <img :src="style.image" :alt="style.name" class="w-full h-full object-cover" />
              </div>
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
  },
  startAtQuicktune: {
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
const showQuicktune = ref(false)
const quicktuneComplete = ref(false)

// Brand settings for quicktune
const brandSettings = reactive({
  language: 'en',
  colors: ['#E20074', '#18214D', '#5D6482'],
  selectedColorIndex: 0,
  primaryFont: 'Arial Regular',
  secondaryFont: 'Arial Light',
  corners: 'none'
})

const cornerOptions = [
  { id: 'none', label: 'None', class: 'rounded-none' },
  { id: 'small', label: 'Small', class: 'rounded-sm' },
  { id: 'medium', label: 'Medium', class: 'rounded-md' },
  { id: 'large', label: 'Large', class: 'rounded-lg' }
]

const cornerClasses = {
  none: 'rounded-none',
  small: 'rounded-lg',
  medium: 'rounded-xl',
  large: 'rounded-2xl'
}

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

const selectStyleAndContinue = (styleId) => {
  selectedStyle.value = styleId
  showStyleSelection.value = false
  showQuicktune.value = true
}

const confirmStyleSelection = () => {
  showStyleSelection.value = false
  showQuicktune.value = true
}

const confirmQuicktune = () => {
  showQuicktune.value = false
  quicktuneComplete.value = true
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
  showQuicktune.value = false
  quicktuneComplete.value = false
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

// Auto-start if initialMessage is provided or start at style selection or quicktune
onMounted(() => {
  if (props.startAtQuicktune) {
    // Start directly at quicktune
    submitted.value = true
    showAnalysisContent.value = false
    showQuicktune.value = true
  } else if (props.startAtStyle) {
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
