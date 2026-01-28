<template>
  <!-- Toggle button when closed -->
  <button
    v-if="!isOpen"
    @click="toggleOpen(true)"
    class="fixed bottom-4 right-4 z-50 w-10 h-10 bg-[#23262A] text-white rounded-lg flex items-center justify-center hover:bg-[#505763] transition-colors cursor-pointer shadow-lg"
  >
    <!-- uil-angle-up -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17,13.41,12.71,9.17a1,1,0,0,0-1.42,0L7.05,13.41a1,1,0,0,0,0,1.42,1,1,0,0,0,1.41,0L12,11.29l3.54,3.54a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29A1,1,0,0,0,17,13.41Z"/>
    </svg>
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
          <!-- uil-angle-up -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" :class="{ 'rotate-180': flowDropdownOpen }" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,13.41,12.71,9.17a1,1,0,0,0-1.42,0L7.05,13.41a1,1,0,0,0,0,1.42,1,1,0,0,0,1.41,0L12,11.29l3.54,3.54a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29A1,1,0,0,0,17,13.41Z"/>
          </svg>
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
        <!-- Registration button only for email flow (hidden on Home) -->
        <template v-if="currentView !== 'task-creation'">
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

          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Onboarding:</span>
            <button
              v-for="step in onboardingStepsCount"
              :key="step"
              @click="$emit('go-to-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                currentView === 'onboarding' && currentStep === step && currentStep <= onboardingStepsCount
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
        <!-- uil-times -->
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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

// Number of onboarding steps depends on registration type
const onboardingStepsCount = computed(() => props.registrationType === 'shopify' ? 3 : 4)

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

const selectFlow = (type) => {
  emit('select-flow', type)
  flowDropdownOpen.value = false
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
