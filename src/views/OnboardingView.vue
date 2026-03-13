<template>
  <!-- Regular Onboarding Layout -->
  <MainLayout :has-progress="true" :is-exiting="isExitingToWizard">
    <template #content>
      <div class="w-full" @wheel="handleWheel">
        <transition name="back-btn">
          <button
            v-if="currentStep > 1"
            @click="handlePrev"
            class="flex items-center gap-1.5 text-sm text-[#8F97A4] hover:text-[#23262A] transition-colors mb-6"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back
          </button>
        </transition>
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
              <Button
                v-if="!isFirstStep"
                variant="outline"
                size="md"
                @click="handlePrev"
              >
                Previous
              </Button>

              <Button
                variant="primary"
                size="md"
                @click="handleNext"
              >
                {{ isLastStep ? 'Complete' : 'Next' }}
              </Button>
            </div>
          </div>
        </transition>
      </div>
    </template>

    <template #illustration>
      <div class="w-full h-full relative">
        <!-- Always show monk composition -->
        <img src="/bamboo.svg" alt="" class="absolute inset-0 object-contain illus-bamboo" />
        <img src="/monk-shadow.svg" alt="" class="absolute w-2/5 object-contain monk-shadow-pulse illus-shadow" />
        <transition name="monk-swap">
          <img
            :key="monkImage"
            :src="monkImage"
            alt=""
            :class="['absolute object-contain monk-float illus-monk', currentStepKey === 'useCase' ? 'illus-monk--small' : '']"
          />
        </transition>

        <!-- UseCase step: Mail, ShoppingCart, ThumbsUp icons around monk -->
        <transition name="icons-fade">
        <div v-if="currentStepKey === 'useCase'" class="absolute inset-0">
          <!-- Mail – top left -->
          <div class="logo-card logo-card-1 absolute" style="top: 14%; left: 18%; width: 76px; height: 76px;">
            <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="#ED5A29" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
            </svg>
          </div>
          <!-- ShoppingCart – top right -->
          <div class="logo-card logo-card-2 absolute" style="top: 8%; right: 14%; width: 84px; height: 84px;">
            <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="#ED5A29" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </div>
          <!-- TrendingUp – bottom left -->
          <div class="logo-card logo-card-3 absolute" style="bottom: 28%; left: 10%; width: 72px; height: 72px;">
            <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="#ED5A29" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
        </div>
        </transition>

        <!-- Step 3: Relationship icons scattered around monk -->
        <transition name="icons-fade">
        <div v-if="currentStep === 3" class="absolute inset-0">
          <!-- User – top left -->
          <div class="logo-card logo-card-1 absolute" style="top: 10%; left: 26%; width: 84px; height: 84px;">
            <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="#ED5A29" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <!-- Building – top right -->
          <div class="logo-card logo-card-2 absolute" style="top: 18%; right: 8%; width: 76px; height: 76px;">
            <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="#ED5A29" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
              <path d="M8 6h.01"/><path d="M12 6h.01"/><path d="M16 6h.01"/>
              <path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/>
              <path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>
            </svg>
          </div>
          <!-- Briefcase – bottom left -->
          <div class="logo-card logo-card-3 absolute" style="bottom: 22%; left: 16%; width: 72px; height: 72px;">
            <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="#ED5A29" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
        </div>
        </transition>

        <!-- Step 2: Referral source logos scattered around monk -->
        <transition name="icons-fade">
        <div v-if="currentStep === 2" class="absolute inset-0">
            <!-- Shopify – top left -->
            <div class="logo-card logo-card-1 absolute" style="top: 40%; left: 6%; width: 72px; height: 72px;">
              <img src="/icons/shopify-logo.svg" class="h-9 w-9 object-contain" alt="Shopify" />
            </div>
            <!-- Instagram – top right -->
            <div class="logo-card logo-card-2 absolute" style="top: 8%; right: 24%; width: 68px; height: 68px;">
              <svg viewBox="0 0 24 24" class="h-9" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="ig1" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#ig1)"/></svg>
            </div>
            <!-- Facebook – top center (Google helyén) -->
            <div class="logo-card logo-card-3 absolute" style="top: 12%; left: 42%; width: 72px; height: 72px;">
              <svg viewBox="0 0 24 24" class="h-10" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>
            </div>
            <!-- YouTube – bottom left -->
            <div class="logo-card logo-card-4 absolute" style="bottom: 26%; left: 18%; width: 72px; height: 72px;">
              <svg viewBox="0 0 24 24" class="h-9" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/></svg>
            </div>
            <!-- LinkedIn – top left (ChatGPT helyén) -->
            <div class="logo-card logo-card-5 absolute" style="top: 16%; left: 14%; width: 76px; height: 76px;">
              <svg viewBox="0 0 24 24" class="h-9" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/></svg>
            </div>
        </div>
        </transition>
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
import Button from '../components/shared/Button.vue'
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

const emit = defineEmits(['onboarding-complete', 'go-to-wizard', 'skip-to-dashboard'])

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

const monkImage = computed(() => {
  const key = currentStepKey.value
  if (key === 'welcome') return '/monk-hi2%201.svg'
  if (key === 'referralSource') return '/monk-handsup.svg'
  if (key === 'relationship') return '/monk-work.svg'
  if (key === 'useCase') return '/monk-thumb.svg'
  return '/monk-medit.2.svg'
})

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

const handleSkipToDashboard = () => {
  emit('skip-to-dashboard')
}

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
.back-btn-enter-active,
.back-btn-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.back-btn-enter-from,
.back-btn-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.icons-fade-enter-active,
.icons-fade-leave-active {
  transition: opacity 0.3s ease;
}
.icons-fade-enter-from,
.icons-fade-leave-to {
  opacity: 0;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-16px); }
}

@keyframes shadow-pulse {
  0%, 100% { transform: translateX(-50%) scale(1.1); }
  50% { transform: translateX(-50%) scale(0.9); }
}

.monk-float {
  animation: float 4s ease-in-out infinite;
}

.monk-swap-enter-active,
.monk-swap-leave-active {
  transition: opacity 0.35s ease;
  position: absolute;
}
.monk-swap-enter-from,
.monk-swap-leave-to {
  opacity: 0;
}

.monk-shadow-pulse {
  transform-origin: center;
  animation: shadow-pulse 4s ease-in-out infinite;
}

.illus-bamboo {
  left: 10px;
  width: 88%;
  height: 88%;
}

.illus-shadow {
  bottom: 20px;
  left: calc(50% + 50px);
}

.illus-monk {
  width: 56%;
  bottom: calc(25% - 40px);
  left: calc(50% + 40px);
  transform: translateX(-50%);
}

.illus-monk--small {
  width: 45%;
}

@media (max-height: 680px) {
  .illus-bamboo {
    width: 83%;
    height: 83%;
  }
  .illus-monk {
    width: 56%;
  }
  .illus-monk--small {
    width: 45%;
  }
}

@media (min-height: 840px) {
  .illus-bamboo {
    top: 20px;
  }
  .illus-shadow {
    bottom: 70px;
  }
  .illus-monk {
    width: 70%;
    bottom: calc(25% - 20px);
  }
  .illus-monk--small {
    width: 60%;
  }
}

@media (min-height: 940px) {
  .illus-shadow {
    bottom: 110px;
  }
  .illus-monk {
    bottom: calc(25%);
  }
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes logo-appear {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}

.logo-card {
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.logo-card-1 { animation: logo-appear 0.4s ease forwards 0.0s, logo-float 3.8s ease-in-out infinite 0.5s; }
.logo-card-2 { animation: logo-appear 0.4s ease forwards 0.15s, logo-float 4.2s ease-in-out infinite 0.65s; }
.logo-card-3 { animation: logo-appear 0.4s ease forwards 0.3s, logo-float 3.5s ease-in-out infinite 0.8s; }
.logo-card-4 { animation: logo-appear 0.4s ease forwards 0.45s, logo-float 4.5s ease-in-out infinite 0.95s; }
.logo-card-5 { animation: logo-appear 0.4s ease forwards 0.6s, logo-float 3.9s ease-in-out infinite 1.1s; }
.logo-card-6 { animation: logo-appear 0.4s ease forwards 0.75s, logo-float 4.1s ease-in-out infinite 1.25s; }
.logo-card-7 { animation: logo-appear 0.4s ease forwards 0.9s, logo-float 3.7s ease-in-out infinite 1.4s; }

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
