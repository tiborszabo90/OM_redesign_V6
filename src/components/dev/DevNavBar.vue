<template>
  <!-- Toggle button when closed -->
  <button
    v-if="!isOpen"
    @click="toggleOpen(true)"
    class="fixed bottom-4 right-4 z-50 w-10 h-10 bg-[#23262A] text-white rounded-lg flex items-center justify-center hover:bg-[#505763] transition-colors cursor-pointer shadow-lg"
  >
    <ChevronUp :size="20" />
  </button>

  <!-- Full navbar when open -->
  <transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed bottom-0 left-0 right-0 bg-[#23262A] text-white py-2 px-4 z-50 flex items-center justify-center gap-2"
    >
      <!-- Design Guide button -->
      <button
        @click="goToDesignGuide"
        :class="[
          'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
          currentView === 'design-guide'
            ? 'bg-[#ED5A29] text-white'
            : 'bg-[#505763] hover:bg-[#8F97A4]'
        ]"
      >
        Design Guide
      </button>

      <!-- Select Flow Dropdown -->
      <div class="relative">
        <button
          @click="flowDropdownOpen = !flowDropdownOpen"
          class="px-3 py-1 text-sm rounded transition-colors cursor-pointer bg-[#505763] hover:bg-[#8F97A4] flex items-center gap-1"
        >
          Select flow
          <ChevronUp :size="12" :class="{ 'rotate-180': flowDropdownOpen }" />
        </button>
        <transition name="fade">
          <div
            v-if="flowDropdownOpen"
            class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-40"
          >
            <button
              @click="selectFlow('email')"
              class="w-full px-4 py-2 text-sm text-left hover:bg-[#505763] transition-colors cursor-pointer"
            >
              Email Registration
            </button>
            <button
              @click="selectFlow('shopify')"
              class="w-full px-4 py-2 text-sm text-left hover:bg-[#505763] transition-colors cursor-pointer"
            >
              Shopify Registration
            </button>
            <button
              @click="selectFlow('wizard')"
              class="w-full px-4 py-2 text-sm text-left hover:bg-[#505763] transition-colors cursor-pointer"
            >
              Wizard
            </button>
            <button
              @click="goToHome"
              class="w-full px-4 py-2 text-sm text-left hover:bg-[#505763] transition-colors cursor-pointer border-t border-[#505763]"
            >
              Home
            </button>
            <button
              @click="goToDesignGuide"
              class="w-full px-4 py-2 text-sm text-left hover:bg-[#505763] transition-colors cursor-pointer border-t border-[#505763]"
            >
              Design Guide
            </button>
          </div>
        </transition>
      </div>

      <!-- Flow type indicator -->
      <span v-if="flowSelected" class="text-xs text-[#8F97A4] capitalize">
        {{ registrationType }}:
      </span>

      <template v-if="flowSelected">
        <!-- Wizard-only flow -->
        <template v-if="registrationType === 'wizard'">
          <button
            @click="$emit('navigate', 'wizard-analysis')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              currentView === 'wizard-analysis'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Wizard Analysis
          </button>

          <button
            @click="$emit('navigate', 'wizard-style')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              currentView === 'wizard-style'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Wizard Style
          </button>

          <button
            @click="$emit('navigate', 'wizard-quicktune')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              currentView === 'wizard-quicktune'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Wizard Quicktune
          </button>

          <!-- Recommendation Dropdown -->
          <div class="relative">
            <button
              @click="recommendationDropdownOpen = !recommendationDropdownOpen"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
                ['wizard-recommendation', 'wizard-recommendation-v2', 'wizard-recommendation-v3', 'wizard-recommendation-v4', 'wizard-recommendation-v5'].includes(currentView)
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              Recommendation
              <ChevronUp :size="12" :class="{ 'rotate-180': recommendationDropdownOpen }" />
            </button>
            <transition name="fade">
              <div
                v-if="recommendationDropdownOpen"
                class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-32"
              >
                <button
                  @click="selectRecommendation('wizard-recommendation')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'wizard-recommendation'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V1
                </button>
                <button
                  @click="selectRecommendation('wizard-recommendation-v2')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'wizard-recommendation-v2'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V2
                </button>
                <button
                  @click="selectRecommendation('wizard-recommendation-v3')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'wizard-recommendation-v3'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V3
                </button>
                <button
                  @click="selectRecommendation('wizard-recommendation-v4')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'wizard-recommendation-v4'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V4
                </button>
                <button
                  @click="selectRecommendation('wizard-recommendation-v5')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'wizard-recommendation-v5'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V5
                </button>
              </div>
            </transition>
          </div>

          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Email/Shopify flow with onboarding + wizard -->
        <template v-else>
          <!-- Registration button only for email flow -->
          <button
            v-if="registrationType === 'email'"
            @click="$emit('navigate', 'registration')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              currentView === 'registration'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Registration
          </button>

          <!-- Onboarding steps -->
          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Onboarding:</span>
            <button
              v-for="step in onboardingStepsCount"
              :key="step"
              @click="$emit('go-to-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                currentView === 'onboarding' && currentStep === step
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              {{ step }}
            </button>
          </div>

          <span class="text-[#505763] mx-1">|</span>
        </template>

        <button
          @click="$emit('navigate', 'task-creation')"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
            currentView === 'task-creation'
              ? 'bg-[#ED5A29] text-white'
              : 'bg-[#505763] hover:bg-[#8F97A4]'
          ]"
        >
          Home
        </button>

        <button
          @click="$emit('navigate', 'campaigns2')"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
            currentView === 'campaigns2'
              ? 'bg-[#ED5A29] text-white'
              : 'bg-[#505763] hover:bg-[#8F97A4]'
          ]"
        >
          Campaigns
        </button>

        <button
          @click="$emit('navigate', 'campaigns')"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
            currentView === 'campaigns'
              ? 'bg-[#ED5A29] text-white'
              : 'bg-[#505763] hover:bg-[#8F97A4]'
          ]"
        >
          Campaign Page
        </button>

        <template v-if="createdTasks.length > 0">
          <span class="text-[#505763] mx-1">|</span>

          <div class="flex items-center gap-2">
            <span class="text-xs text-[#8F97A4] mr-1">{{ createdTasks[0].message }}:</span>
            <button
              v-for="(task, index) in createdTasks"
              :key="index"
              @click="$emit('go-to-task-phase', task.phase)"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors cursor-pointer capitalize',
                currentView === 'task-creation' && currentTaskPhase === task.phase
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              {{ task.phase }}
            </button>
          </div>
        </template>

        <span class="text-[#505763] mx-1">|</span>
      </template>

      <!-- Close button -->
      <button
        @click="toggleOpen(false)"
        class="px-2 py-1 text-sm rounded transition-colors cursor-pointer bg-[#505763] hover:bg-[#8F97A4]"
      >
        <X :size="16" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronUp, X } from 'lucide-vue-next'

const props = defineProps({
  currentView: {
    type: String,
    required: true
  },
  currentStep: {
    type: Number,
    default: 1
  },
  totalSteps: {
    type: Number,
    default: 4
  },
  createdTasks: {
    type: Array,
    default: () => []
  },
  currentTaskPhase: {
    type: String,
    default: 'analysis'
  },
  flowSelected: {
    type: Boolean,
    default: false
  },
  registrationType: {
    type: String,
    default: 'email'
  }
})

const emit = defineEmits(['navigate', 'go-to-step', 'go-to-task-phase', 'select-flow', 'update:isOpen'])

// Onboarding steps count - same for both Email and Shopify
// 4 steps: Welcome, ReferralSource, Relationship, UseCase
const onboardingStepsCount = computed(() => {
  return 4
})

const isOpen = ref(true)

// Emit initial state after component is mounted
onMounted(() => {
  emit('update:isOpen', isOpen.value)
})

// Watch for changes and emit
const toggleOpen = (value) => {
  isOpen.value = value
  emit('update:isOpen', value)
}
const flowDropdownOpen = ref(false)
const recommendationDropdownOpen = ref(false)

const selectFlow = (type) => {
  emit('select-flow', type)
  flowDropdownOpen.value = false
}

const selectRecommendation = (view) => {
  emit('navigate', view)
  recommendationDropdownOpen.value = false
}

const goToHome = () => {
  emit('navigate', 'task-creation')
  flowDropdownOpen.value = false
}

const goToDesignGuide = () => {
  emit('navigate', 'design-guide')
  flowDropdownOpen.value = false
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
