<template>
  <!-- Dashboard Layout for final step -->
  <DashboardLayout v-if="isDashboardStep" @logo-click="handleLogoClick">
    <template #content>
      <component
        :is="currentStepComponent"
        ref="dashboardComponentRef"
        v-model="formData[currentStepKey]"
        :data="formData"
        :registration-data="props.registrationData"
        @auto-next="handleAutoNext"
        @skip-to-dashboard="handleSkipToDashboard"
        @task-created="(task) => emit('task-created', task)"
      />
    </template>
  </DashboardLayout>

  <!-- Regular Onboarding Layout -->
  <MainLayout v-else :has-progress="true">
    <template #content>
      <div class="w-full" @wheel="handleWheel">
        <transition :name="transitionName" mode="out-in">
          <div :key="currentStep" class="w-full">
            <!-- Content -->
            <div :class="showButtons ? 'mb-4' : ''">
              <component
                :is="currentStepComponent"
                v-model="formData[currentStepKey]"
                :data="formData"
                :registration-data="props.registrationData"
                @auto-next="handleAutoNext"
                @skip-to-dashboard="handleSkipToDashboard"
                @task-created="(task) => emit('task-created', task)"
              />
            </div>

            <!-- Navigation Buttons -->
            <div v-if="showButtons" class="flex justify-start gap-4">
              <button
                v-if="!isFirstStep"
                @click="handlePrev"
                class="px-6 py-2.5 border border-[#D5D8DD] rounded-xl text-base text-[#23262A] hover:bg-[#F7F7F8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2"
              >
                Previous
              </button>

              <button
                @click="handleNext"
                class="px-6 py-2.5 bg-[#ED5A29] text-white text-base rounded-xl hover:bg-[#E54D1F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2"
              >
                {{ isLastStep ? 'Complete' : 'Next' }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </template>

    <template #illustration>
      <div class="w-full h-full">
        <img
          src="/monk1.png"
          alt="OptiMonk Mascot"
          class="w-full h-full object-contain"
        />
      </div>
    </template>

    <template #progress>
      <div class="flex items-center gap-4">
        <p class="text-sm text-[#505763] whitespace-nowrap">
          Step {{ displayStep }} of {{ displayTotalSteps }}
        </p>
        <div class="w-[200px] h-2 bg-[#E3E5E8] rounded-full overflow-hidden flex-shrink-0">
          <div
            class="h-full bg-[#ED5A29] transition-all duration-300 ease-in-out"
            :style="{ width: `${displayProgress}%` }"
          ></div>
        </div>
      </div>
    </template>
  </MainLayout>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useOnboarding } from '../composables/useOnboarding'
import MainLayout from '../components/layouts/MainLayout.vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import StepWelcome from '../components/onboarding/StepWelcome.vue'
import StepReferralSource from '../components/onboarding/StepReferralSource.vue'
import StepBusinessType from '../components/onboarding/StepBusinessType.vue'
import StepRelationship from '../components/onboarding/StepRelationship.vue'
import StepContactType from '../components/onboarding/StepContactType.vue'
import StepAgencyDetails from '../components/onboarding/StepAgencyDetails.vue'
import StepDashboard from '../components/onboarding/StepDashboard.vue'

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['task-created', 'dashboard-mounted'])

const transitionName = ref('slide-up')
const isScrolling = ref(false)
const scrollDebounceTimeout = ref(null)
const dashboardComponentRef = ref(null)

const baseSteps = [
  { component: StepWelcome, key: 'welcome', showButtons: true },
  { component: StepReferralSource, key: 'referralSource', showButtons: false },
  { component: StepBusinessType, key: 'businessType', showButtons: false },
  { component: StepRelationship, key: 'relationship', showButtons: false }
]

const contactTypeStep = { component: StepContactType, key: 'contactType', showButtons: false }
const agencyDetailsStep = { component: StepAgencyDetails, key: 'agencyDetails', showButtons: false }
const dashboardStep = { component: StepDashboard, key: 'dashboard', showButtons: false }

const {
  currentStep,
  maxReachedStep,
  formData,
  isFirstStep,
  isLastStep,
  progress,
  nextStep,
  prevStep,
  goToStep,
  totalSteps,
  setTotalSteps
} = useOnboarding(4)

// Dynamic steps based on user selection
const steps = computed(() => {
  const allSteps = [...baseSteps]
  // Add contact type step if user selected "client" in relationship step
  if (formData.value.relationship?.relationship === 'client') {
    allSteps.push(contactTypeStep)
    // Add agency details step if user selected "client-contact" in contact type step
    if (formData.value.contactType?.contactType === 'client-contact') {
      allSteps.push(agencyDetailsStep)
    }
  }
  // Always add dashboard as the final step
  allSteps.push(dashboardStep)
  return allSteps
})

// Update total steps for navigation but keep display at 4
watch([() => formData.value.relationship?.relationship, () => formData.value.contactType?.contactType], () => {
  setTotalSteps(steps.value.length)
}, { immediate: true })

// Emit dashboard ref when it mounts
watch(() => dashboardComponentRef.value, (newRef) => {
  if (newRef) {
    emit('dashboard-mounted', newRef)
  }
})

// Display step number (always max 5 for progress bar)
const displayStep = computed(() => Math.min(currentStep.value, 5))
const displayTotalSteps = 4
const displayProgress = computed(() => (displayStep.value / displayTotalSteps) * 100)

const currentStepComponent = computed(() => {
  return steps.value[currentStep.value - 1].component
})

const currentStepKey = computed(() => {
  return steps.value[currentStep.value - 1].key
})

const showButtons = computed(() => {
  return steps.value[currentStep.value - 1].showButtons
})

const isDashboardStep = computed(() => {
  return currentStepKey.value === 'dashboard'
})

const handleNext = () => {
  transitionName.value = 'slide-up'
  if (isLastStep.value) {
    // Handle completion - could navigate to dashboard or show success message
    console.log('Onboarding completed with data:', formData.value)
    // You could also emit an event or call an API here
  } else {
    nextStep()
  }
}

const handlePrev = () => {
  transitionName.value = 'slide-down'
  prevStep()
}

const handleAutoNext = () => {
  transitionName.value = 'slide-up'
  // Use nextTick to ensure total steps are updated before navigating
  nextTick(() => {
    setTotalSteps(steps.value.length)
    nextStep()
  })
}

const handleSkipToDashboard = () => {
  console.log('Skipping to dashboard with data:', formData.value)
  // Navigate to dashboard or emit completion event
  // For now, just log and complete the onboarding
}

const handleLogoClick = () => {
  // Reset dashboard to initial state
  if (dashboardComponentRef.value && dashboardComponentRef.value.resetToInitial) {
    dashboardComponentRef.value.resetToInitial()
  }
}

// Expose for DevNavBar
const totalStepsCount = computed(() => steps.value.length)

const devGoToStep = (step) => {
  // Allow navigation to any step for dev purposes
  if (step > currentStep.value) {
    transitionName.value = 'slide-up'
  } else {
    transitionName.value = 'slide-down'
  }
  // Update maxReachedStep to allow navigation
  if (step > maxReachedStep.value) {
    maxReachedStep.value = step
  }
  setTotalSteps(Math.max(steps.value.length, step))
  // Directly set currentStep for dev navigation (bypassing validation)
  currentStep.value = step
}

defineExpose({
  currentStep,
  totalStepsCount,
  devGoToStep
})

const handleWheel = (event) => {
  // Don't handle wheel on dashboard step
  if (isDashboardStep.value) {
    return
  }

  // If already scrolling, ignore this event
  if (isScrolling.value) {
    event.preventDefault()
    return
  }

  // Clear any existing timeout
  if (scrollDebounceTimeout.value) {
    clearTimeout(scrollDebounceTimeout.value)
  }

  // Determine scroll direction
  const delta = event.deltaY

  if (delta > 0) {
    // Scrolling down - go to next step if available
    if (currentStep.value < maxReachedStep.value) {
      event.preventDefault()
      transitionName.value = 'slide-up'
      isScrolling.value = true
      goToStep(currentStep.value + 1)
    }
  } else if (delta < 0) {
    // Scrolling up - go to previous step
    if (currentStep.value > 1) {
      event.preventDefault()
      transitionName.value = 'slide-down'
      isScrolling.value = true
      goToStep(currentStep.value - 1)
    }
  }

  // Set debounce timeout to allow next scroll after transition completes
  scrollDebounceTimeout.value = setTimeout(() => {
    isScrolling.value = false
  }, 600)
}
</script>

<style scoped>
/* Slide Up Transition (going forward) */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Slide Down Transition (going backward) */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
