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
      <div class="min-h-screen-safe bg-white overflow-y-auto">
        <!-- Continue button at top right -->
        <div class="fixed top-8 right-8 z-50">
          <button
            @click="confirmQuicktune"
            class="px-5 py-2 bg-om-orange-500 text-white text-sm font-medium rounded-lg hover:bg-om-orange-600 transition-colors cursor-pointer"
          >
            Continue
          </button>
        </div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-10 lg:pt-14 pb-8 lg:pb-12">
          <!-- Header -->
          <div class="text-center mb-8 lg:mb-16">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Quick-tune your brand settings</h2>
            <p class="text-om-gray-500">Don't worry—all settings can be customized later in the editor.</p>
          </div>

          <!-- Two column layout -->
          <div class="flex flex-col lg:flex-row gap-6 lg:gap-6">
            <!-- Left side - Popup preview -->
            <div class="flex-1 flex items-start justify-center lg:justify-start">
              <div
                class="overflow-hidden border-2 border-om-gray-200 shadow-xl w-full max-w-2xl bg-white transition-all duration-300"
                :class="popupCornerClasses[brandSettings.corners]"
              >
                <div class="flex">
                  <!-- Left content side -->
                  <div class="w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                    <img src="/telekom.png" alt="Telekom Logo" class="w-10 h-10 object-contain mb-3" />
                    <h3 class="text-3xl font-bold text-om-gray-800 leading-tight mb-2" :style="{ fontFamily: brandSettings.primaryFont }">
                      {{ popupTexts[brandSettings.language].title }} {{ popupTexts[brandSettings.language].discount }}
                    </h3>
                    <p class="text-sm text-om-gray-400 mb-6" :style="{ fontFamily: brandSettings.secondaryFont }">{{ popupTexts[brandSettings.language].subtitle }}</p>
                    <button
                      class="w-full py-3 text-white text-sm font-semibold uppercase tracking-wide mb-3"
                      :class="cornerClasses[brandSettings.corners]"
                      :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                      disabled
                    >
                      {{ popupTexts[brandSettings.language].cta }}
                    </button>
                    <button
                      class="w-full py-3 bg-transparent text-sm font-medium uppercase tracking-wide border"
                      :class="cornerClasses[brandSettings.corners]"
                      :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex], borderColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                      disabled
                    >
                      {{ popupTexts[brandSettings.language].decline }}
                    </button>
                  </div>
                  <!-- Right image side -->
                  <div class="w-1/2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop"
                      alt="Popup image"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Right side - Settings -->
            <div class="w-full lg:w-80 shrink-0 space-y-4 lg:space-y-5">
              <!-- Template language + Logo row -->
              <div class="flex gap-3">
                <!-- Template language -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Language</label>
                  <div ref="languageDropdownRef" class="relative">
                    <button
                      type="button"
                      @click="isLanguageDropdownOpen = !isLanguageDropdownOpen"
                      class="dropdown-select w-full px-3 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors h-[38px]"
                      :class="isLanguageDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                    >
                      <span>{{ selectedLanguage().label }}</span>
                      <svg class="w-4 h-4 text-om-gray-600 transition-transform" :class="isLanguageDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <!-- Dropdown options -->
                    <transition name="dropdown">
                      <div
                        v-if="isLanguageDropdownOpen"
                        class="absolute z-10 w-full mt-2 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                      >
                        <button
                          v-for="option in languageOptions"
                          :key="option.value"
                          type="button"
                          @click="selectLanguage(option)"
                          class="w-full px-3 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                          :class="brandSettings.language === option.value ? 'bg-om-orange-50 text-om-orange-600' : ''"
                        >
                          {{ option.label }}
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>

                <!-- Logo -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Logo</label>
                  <div class="h-[38px] bg-[repeating-conic-gradient(#E3E5E8_0%_25%,transparent_0%_50%)_50%/12px_12px] rounded-lg flex items-center justify-center border border-om-gray-200">
                    <div class="w-7 h-7 rounded-sm overflow-hidden">
                      <img src="/telekom.png" alt="Telekom Logo" class="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colors + Corners row -->
              <div class="flex gap-3">
                <!-- Colors -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Color</label>
                  <div class="flex gap-1.5">
                    <button
                      v-for="(color, index) in brandSettings.colors"
                      :key="index"
                      class="w-8 h-8 rounded-md border-2 transition-all cursor-pointer"
                      :class="brandSettings.selectedColorIndex === index ? 'border-om-orange-500 ring-2 ring-om-orange-200' : 'border-om-gray-200'"
                      :style="{ backgroundColor: color }"
                      @click="brandSettings.selectedColorIndex = index"
                    ></button>
                  </div>
                </div>

                <!-- Corners -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Corners</label>
                  <div ref="cornersDropdownRef" class="relative">
                    <button
                      type="button"
                      @click="isCornersDropdownOpen = !isCornersDropdownOpen"
                      class="dropdown-select w-full px-3 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                      :class="isCornersDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                    >
                      <span class="flex items-center gap-2">
                        <span class="w-4 h-4 border-2 border-om-gray-400" :class="selectedCorner().class"></span>
                        <span>{{ selectedCorner().label }}</span>
                      </span>
                      <svg class="w-4 h-4 text-om-gray-600 transition-transform" :class="isCornersDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <transition name="dropdown">
                      <div
                        v-if="isCornersDropdownOpen"
                        class="absolute z-10 w-full mt-1 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                      >
                        <button
                          v-for="corner in cornerOptions"
                          :key="corner.id"
                          type="button"
                          @click="selectCorner(corner)"
                          class="w-full px-3 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer flex items-center gap-2"
                          :class="brandSettings.corners === corner.id ? 'bg-om-orange-50 text-om-orange-600' : ''"
                        >
                          <span class="w-4 h-4 border-2 shrink-0" :class="[corner.class, brandSettings.corners === corner.id ? 'border-om-orange-500' : 'border-om-gray-400']"></span>
                          <span>{{ corner.label }}</span>
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>

              <!-- Fonts -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-om-gray-700">Font</label>
                <!-- Primary and Secondary fonts in a row -->
                <div class="flex gap-2">
                  <!-- Primary font -->
                  <div class="flex-1">
                    <label class="block text-xs text-om-gray-500 mb-1">Primary</label>
                    <div ref="primaryFontDropdownRef" class="relative">
                      <button
                        type="button"
                        @click="isPrimaryFontDropdownOpen = !isPrimaryFontDropdownOpen"
                        class="dropdown-select w-full px-2.5 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                        :class="isPrimaryFontDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                      >
                        <span class="truncate">{{ selectedPrimaryFont().label }}</span>
                        <svg class="w-3.5 h-3.5 text-om-gray-600 transition-transform shrink-0 ml-1" :class="isPrimaryFontDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <transition name="dropdown">
                        <div
                          v-if="isPrimaryFontDropdownOpen"
                          class="absolute z-10 w-full mt-1 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          <button
                            v-for="option in fontOptions"
                            :key="option.value"
                            type="button"
                            @click="selectPrimaryFont(option)"
                            class="w-full px-2.5 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                            :class="brandSettings.primaryFont === option.value ? 'bg-om-orange-50 text-om-orange-600' : ''"
                          >
                            {{ option.label }}
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                  <!-- Secondary font -->
                  <div class="flex-1">
                    <label class="block text-xs text-om-gray-500 mb-1">Secondary</label>
                    <div ref="secondaryFontDropdownRef" class="relative">
                      <button
                        type="button"
                        @click="isSecondaryFontDropdownOpen = !isSecondaryFontDropdownOpen"
                        class="dropdown-select w-full px-2.5 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                        :class="isSecondaryFontDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                      >
                        <span class="truncate">{{ selectedSecondaryFont().label }}</span>
                        <svg class="w-3.5 h-3.5 text-om-gray-600 transition-transform shrink-0 ml-1" :class="isSecondaryFontDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      <transition name="dropdown">
                        <div
                          v-if="isSecondaryFontDropdownOpen"
                          class="absolute z-10 w-full mt-1 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          <button
                            v-for="option in fontOptions"
                            :key="option.value"
                            type="button"
                            @click="selectSecondaryFont(option)"
                            class="w-full px-2.5 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                            :class="brandSettings.secondaryFont === option.value ? 'bg-om-orange-50 text-om-orange-600' : ''"
                          >
                            {{ option.label }}
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
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
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-14 pb-12">
          <!-- Header -->
          <div class="text-center mb-[52px]">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Which style do you like the most?</h2>
            <p class="text-om-gray-500">You can customize colors, fonts, and other style settings in the next step.</p>
          </div>

          <!-- Popup grid - 3 columns on large screens -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <button
              v-for="(style, index) in popupStyles"
              :key="style.id"
              @click="selectStyleAndContinue(style.id)"
              class="style-card relative rounded-lg overflow-hidden border-2 border-om-gray-200 transition-transform duration-300 cursor-pointer hover:scale-105 focus:outline-none focus:ring-0"
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
import { reactive, ref, onMounted, onUnmounted } from 'vue'
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
  primaryFont: 'Inter',
  secondaryFont: 'Arial',
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
  large: 'rounded-full'
}

// Popup container corner classes (larger for the outer container)
const popupCornerClasses = {
  none: 'rounded-none',
  small: 'rounded-xl',
  medium: 'rounded-2xl',
  large: 'rounded-3xl'
}

// Popup text translations
const popupTexts = {
  en: {
    title: "You've got",
    discount: "10% OFF",
    subtitle: "Save it before it's gone.",
    cta: "Claim 10% Off",
    decline: "No, Thanks"
  },
  hu: {
    title: "Kaptál",
    discount: "10% KEDVEZMÉNYT",
    subtitle: "Mentsd el, mielőtt lejár.",
    cta: "Kupon igénylése",
    decline: "Nem, köszönöm"
  },
  de: {
    title: "Du hast",
    discount: "10% RABATT",
    subtitle: "Sichere es dir, bevor es weg ist.",
    cta: "10% sichern",
    decline: "Nein, danke"
  },
  fr: {
    title: "Vous avez",
    discount: "10% DE RÉDUCTION",
    subtitle: "Économisez avant qu'il ne soit trop tard.",
    cta: "Réclamer 10%",
    decline: "Non, merci"
  },
  es: {
    title: "Tienes",
    discount: "10% DE DESCUENTO",
    subtitle: "Guárdalo antes de que se acabe.",
    cta: "Reclamar 10%",
    decline: "No, gracias"
  }
}

// Language dropdown
const languageDropdownRef = ref(null)
const isLanguageDropdownOpen = ref(false)
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' }
]

const selectedLanguage = () => {
  return languageOptions.find(opt => opt.value === brandSettings.language) || languageOptions[0]
}

const selectLanguage = (option) => {
  brandSettings.language = option.value
  isLanguageDropdownOpen.value = false
}

// Primary font dropdown
const primaryFontDropdownRef = ref(null)
const isPrimaryFontDropdownOpen = ref(false)
const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' }
]

const selectedPrimaryFont = () => {
  return fontOptions.find(opt => opt.value === brandSettings.primaryFont) || fontOptions[0]
}

const selectPrimaryFont = (option) => {
  brandSettings.primaryFont = option.value
  isPrimaryFontDropdownOpen.value = false
}

// Secondary font dropdown
const secondaryFontDropdownRef = ref(null)
const isSecondaryFontDropdownOpen = ref(false)

const selectedSecondaryFont = () => {
  return fontOptions.find(opt => opt.value === brandSettings.secondaryFont) || fontOptions[1]
}

const selectSecondaryFont = (option) => {
  brandSettings.secondaryFont = option.value
  isSecondaryFontDropdownOpen.value = false
}

// Corners dropdown
const cornersDropdownRef = ref(null)
const isCornersDropdownOpen = ref(false)

const selectedCorner = () => {
  return cornerOptions.find(opt => opt.id === brandSettings.corners) || cornerOptions[0]
}

const selectCorner = (corner) => {
  brandSettings.corners = corner.id
  isCornersDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target)) {
    isLanguageDropdownOpen.value = false
  }
  if (primaryFontDropdownRef.value && !primaryFontDropdownRef.value.contains(event.target)) {
    isPrimaryFontDropdownOpen.value = false
  }
  if (secondaryFontDropdownRef.value && !secondaryFontDropdownRef.value.contains(event.target)) {
    isSecondaryFontDropdownOpen.value = false
  }
  if (cornersDropdownRef.value && !cornersDropdownRef.value.contains(event.target)) {
    isCornersDropdownOpen.value = false
  }
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
  { name: 'Inter', fontFamily: '"Inter", sans-serif' },
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
  document.addEventListener('click', handleClickOutside)

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

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

/* Style cards - prevent orange border on hover */
.style-card {
  box-shadow: none !important;
}

.style-card:hover {
  border-color: #E3E5E8 !important;
  box-shadow: none !important;
}

.style-card:focus {
  border-color: #E3E5E8 !important;
  box-shadow: none !important;
  outline: none !important;
}

/* Dropdown transition */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
