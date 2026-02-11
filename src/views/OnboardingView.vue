<template>
  <!-- Regular Onboarding Layout -->
  <MainLayout :has-progress="true" :is-exiting="isExitingToWizard">
    <template #content>
      <div class="w-full" @wheel="handleWheel">
        <transition :name="transitionName" mode="out-in">
          <div :key="currentStep" :class="['w-full', isExitingToWizard ? 'exit-animation' : '']">
            <!-- Content -->
            <div :class="showButtons ? 'mb-4' : ''">
              <component
                :is="currentStepComponent"
                v-model="formData[currentStepKey]"
                :data="formData"
                :registration-data="props.registrationData"
                :registration-type="props.registrationType"
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
                class="px-6 py-2.5 border border-[#D5D8DD] rounded-xl text-base text-[#23262A] hover:bg-[#F9FAFB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2 cursor-pointer"
              >
                Previous
              </button>

              <button
                @click="handleNext"
                class="px-6 py-2.5 bg-[#ED5A29] text-white text-base rounded-xl hover:bg-[#E54D1F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2 cursor-pointer"
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
import StepWelcome from '../components/onboarding/StepWelcome.vue'
import StepReferralSource from '../components/onboarding/StepReferralSource.vue'
import StepRelationship from '../components/onboarding/StepRelationship.vue'
import StepContactType from '../components/onboarding/StepContactType.vue'
import StepAgencyDetails from '../components/onboarding/StepAgencyDetails.vue'
import StepUseCase from '../components/onboarding/StepUseCase.vue'

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  },
  registrationType: {
    type: String,
    default: 'email'
  }
})

const emit = defineEmits(['onboarding-complete', 'go-to-wizard'])

const transitionName = ref('slide-up')
const isScrolling = ref(false)
const scrollDebounceTimeout = ref(null)

// Base steps - same for both Email and Shopify registration (BusinessType step removed)
const baseSteps = computed(() => {
  const steps = [
    { component: StepWelcome, key: 'welcome', showButtons: true },
    { component: StepReferralSource, key: 'referralSource', showButtons: false },
    { component: StepRelationship, key: 'relationship', showButtons: false }
  ]

  return steps
})

const useCaseStep = { component: StepUseCase, key: 'useCase', showButtons: false }

const contactTypeStep = { component: StepContactType, key: 'contactType', showButtons: false }
const agencyDetailsStep = { component: StepAgencyDetails, key: 'agencyDetails', showButtons: false }

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
  const allSteps = [...baseSteps.value]
  // Add contact type step if user selected "client" in relationship step
  if (formData.value.relationship?.relationship === 'client') {
    allSteps.push(contactTypeStep)
    // Add agency details step if user selected "client-contact" in contact type step
    if (formData.value.contactType?.contactType === 'client-contact') {
      allSteps.push(agencyDetailsStep)
    }
  }
  // Always add use case step as the last step
  allSteps.push(useCaseStep)
  return allSteps
})

// Update total steps for navigation but keep display at 4
watch([() => formData.value.relationship?.relationship, () => formData.value.contactType?.contactType], () => {
  setTotalSteps(steps.value.length)
}, { immediate: true })

// Display step number - always show 4 steps, client sub-steps count as step 3
const displayStep = computed(() => {
  const isClientPath = formData.value.relationship?.relationship === 'client'

  if (!isClientPath) {
    return Math.min(currentStep.value, 4)
  }

  // Client path: steps 1-3 show as 1-3, sub-steps show as 3, last step shows as 4
  if (currentStep.value <= 3) {
    return currentStep.value
  }
  if (currentStep.value === steps.value.length) {
    return 4
  }
  return 3
})
const displayTotalSteps = computed(() => 4)
const displayProgress = computed(() => (displayStep.value / displayTotalSteps.value) * 100)

const currentStepComponent = computed(() => {
  return steps.value[currentStep.value - 1].component
})

const currentStepKey = computed(() => {
  return steps.value[currentStep.value - 1].key
})

const showButtons = computed(() => {
  return steps.value[currentStep.value - 1].showButtons
})

const handleNext = () => {
  transitionName.value = 'slide-up'
  if (isLastStep.value) {
    // Onboarding completed - emit event to navigate to task creation
    console.log('Onboarding completed with data:', formData.value)
    emit('onboarding-complete')
  } else {
    nextStep()
  }
}

const handlePrev = () => {
  transitionName.value = 'slide-down'
  prevStep()
}

// Track if we're exiting to wizard (to trigger exit animation)
const isExitingToWizard = ref(false)

const handleAutoNext = () => {
  transitionName.value = 'slide-up'
  // Use nextTick to ensure total steps are updated before navigating
  nextTick(() => {
    setTotalSteps(steps.value.length)
    if (isLastStep.value) {
      // Last step - trigger exit animation first, then go to wizard
      isExitingToWizard.value = true
      // Wait for animation to complete (500ms transition duration)
      setTimeout(() => {
        emit('go-to-wizard', formData.value.useCase?.useCase || '')
      }, 500)
    } else {
      nextStep()
    }
  })
}

// Expose for DevNavBar
const totalStepsCount = computed(() => steps.value.length)

// Display step for DevNavBar - maps actual step to visual step (1-4)
// Extra client steps (ContactType, AgencyDetails) are sub-steps of step 3
const displayStepForNav = computed(() => {
  const isClientPath = formData.value.relationship?.relationship === 'client'

  if (!isClientPath) {
    // No extra steps, direct mapping (max 4)
    return Math.min(currentStep.value, 4)
  }

  // Client path has extra steps
  // Steps 1-3: Show as 1-3
  // Step 4+ (ContactType, AgencyDetails): Show as 3 (sub-steps of step 3)
  // Last step (UseCase): Show as 4

  if (currentStep.value <= 3) {
    return currentStep.value
  }

  // Check if we're on the last step (UseCase)
  if (currentStep.value === steps.value.length) {
    return 4
  }

  // Otherwise, we're on an extra client step (ContactType/AgencyDetails), show as 3
  return 3
})

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
  displayStepForNav,
  devGoToStep
})

const handleWheel = (event) => {
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

/* Exit animation for wizard transition */
.exit-animation {
  animation: slideUpExit 0.5s ease-in-out forwards;
}

@keyframes slideUpExit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
