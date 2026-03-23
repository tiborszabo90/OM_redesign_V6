<template>
  <div class="min-h-screen-safe bg-om-gray-50 flex flex-col">
    <!-- Wizard header: logo top-left -->
    <div class="fixed top-6 left-8 z-50">
      <img
        src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
        alt="OptiMonk"
        class="h-8"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <div class="max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 pt-20 pb-8 lg:pb-12">
        <!-- Header -->
        <div class="text-center mb-12 lg:mb-20">
          <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Quick-tune your brand settings</h2>
          <p class="text-om-gray-500">Don't worry—all settings can be customized later in the editor.</p>
        </div>

        <!-- Two column layout -->
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-6">
          <!-- Left side - Popup preview -->
          <div class="flex-1 flex flex-col items-center lg:items-start -mt-10">
            <div
              class="overflow-hidden border-2 border-om-gray-200 w-full max-w-2xl bg-white transition-all duration-300"
              :class="popupCornerClasses[brandSettings.corners]"
            >
              <div class="flex">
                <!-- Left content side -->
                <div class="w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                  <img src="/demos/telekom/logo.png" alt="Telekom Logo" class="w-10 h-10 object-contain mb-3" />
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
                <Dropdown v-model="languageModel" :options="languageOptions" size="sm" />
              </div>

              <!-- Logo -->
              <div class="flex-1">
                <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Logo</label>
                <div class="h-[38px] bg-[repeating-conic-gradient(#E3E5E8_0%_25%,transparent_0%_50%)_50%/12px_12px] rounded-lg flex items-center justify-center border border-om-gray-200">
                  <div class="w-7 h-7 rounded-sm overflow-hidden">
                    <img src="/demos/telekom/logo.png" alt="Telekom Logo" class="w-full h-full object-contain" />
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
                    class="color-swatch w-8 h-8 rounded-md border-2 transition-all cursor-pointer hover:scale-110"
                    :class="brandSettings.selectedColorIndex === index ? 'border-om-gray-700 ring-2 ring-om-gray-300' : 'border-om-gray-200 hover:border-om-gray-400'"
                    :style="{ backgroundColor: color }"
                    @click="brandSettings.selectedColorIndex = index"
                  ></button>
                </div>
              </div>

              <!-- Corners -->
              <div class="flex-1">
                <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Corners</label>
                <Dropdown v-model="cornersModel" :options="cornerDropdownOptions" size="sm">
                  <template #selected="{ option }">
                    <span class="flex items-center gap-2">
                      <span class="w-4 h-4 border-2 border-om-gray-400" :class="option?.iconClass"></span>
                      <span>{{ option?.label || 'None' }}</span>
                    </span>
                  </template>
                  <template #option="{ option, selected }">
                    <span class="flex items-center gap-2">
                      <span class="w-4 h-4 border-2 shrink-0" :class="[option.iconClass, selected ? 'border-om-orange-500' : 'border-om-gray-400']"></span>
                      <span>{{ option.label }}</span>
                    </span>
                  </template>
                </Dropdown>
              </div>
            </div>

            <!-- Fonts -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-om-gray-700">Font</label>
              <div class="flex gap-2">
                <!-- Primary font -->
                <div class="flex-1">
                  <label class="block text-xs text-om-gray-500 mb-1">Primary</label>
                  <Dropdown v-model="primaryFontModel" :options="fontOptions" size="sm" />
                </div>
                <!-- Secondary font -->
                <div class="flex-1">
                  <label class="block text-xs text-om-gray-500 mb-1">Secondary</label>
                  <Dropdown v-model="secondaryFontModel" :options="fontOptions" size="sm" />
                </div>
              </div>
            </div>

            <!-- Continue button -->
            <button
              @click="emit('navigate', 'editor')"
              class="mt-4 px-6 py-2.5 bg-om-orange-500 text-white text-sm font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import Dropdown from '../components/shared/Dropdown.vue'

const emit = defineEmits(['navigate'])

const brandSettings = reactive({
  language: 'en',
  colors: ['#E20074', '#18214D', '#5D6482'],
  selectedColorIndex: 0,
  primaryFont: 'Inter',
  secondaryFont: 'Arial',
  corners: 'none'
})

const cornerClasses = {
  none: 'rounded-none',
  small: 'rounded-lg',
  medium: 'rounded-xl',
  large: 'rounded-full'
}

const popupCornerClasses = {
  none: 'rounded-none',
  small: 'rounded-xl',
  medium: 'rounded-2xl',
  large: 'rounded-3xl'
}

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

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' }
]

const languageModel = computed({
  get: () => languageOptions.find(opt => opt.value === brandSettings.language) || languageOptions[0],
  set: (val) => { brandSettings.language = val.value }
})

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' }
]

const primaryFontModel = computed({
  get: () => fontOptions.find(opt => opt.value === brandSettings.primaryFont) || fontOptions[0],
  set: (val) => { brandSettings.primaryFont = val.value }
})

const secondaryFontModel = computed({
  get: () => fontOptions.find(opt => opt.value === brandSettings.secondaryFont) || fontOptions[1],
  set: (val) => { brandSettings.secondaryFont = val.value }
})

const cornerDropdownOptions = [
  { value: 'none', label: 'None', iconClass: 'rounded-none' },
  { value: 'small', label: 'Small', iconClass: 'rounded-sm' },
  { value: 'medium', label: 'Medium', iconClass: 'rounded-md' },
  { value: 'large', label: 'Large', iconClass: 'rounded-lg' }
]

const cornersModel = computed({
  get: () => cornerDropdownOptions.find(opt => opt.value === brandSettings.corners) || cornerDropdownOptions[0],
  set: (val) => { brandSettings.corners = val.value }
})
</script>
