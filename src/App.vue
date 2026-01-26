<script setup>
import { ref, nextTick } from 'vue'
import RegistrationView from './views/RegistrationView.vue'
import OnboardingView from './views/OnboardingView.vue'
import DevNavBar from './components/dev/DevNavBar.vue'

const currentView = ref('registration')
const registrationData = ref(null)
const onboardingRef = ref(null)
const createdTasks = ref([])
const dashboardComponentRef = ref(null)

const handleRegistrationComplete = (data) => {
  registrationData.value = data
  currentView.value = 'onboarding'
}

const handleDevNavigate = (view) => {
  currentView.value = view
}

const handleDevGoToStep = async (step) => {
  if (currentView.value !== 'onboarding') {
    currentView.value = 'onboarding'
    // Wait for the component to mount and transition to complete
    await nextTick()
    // Additional delay for transition completion
    setTimeout(() => {
      if (onboardingRef.value) {
        // If step is a string 'dashboard', use the actual totalSteps
        const targetStep = step === 'dashboard' ? onboardingRef.value.totalStepsCount : step
        onboardingRef.value.devGoToStep(targetStep)
      }
    }, 350)
  } else {
    if (onboardingRef.value) {
      // If step is a string 'dashboard', use the actual totalSteps
      const targetStep = step === 'dashboard' ? onboardingRef.value.totalStepsCount : step
      onboardingRef.value.devGoToStep(targetStep)
    }
  }
}

const handleTaskCreated = (taskData) => {
  // Only add task if it doesn't exist already
  const existingTask = createdTasks.value.find(t => t.phase === taskData.phase)
  if (!existingTask) {
    createdTasks.value.push(taskData)
  }
}

const handleTaskPhaseNavigate = async (phase) => {
  // Navigate to dashboard step first if not already there
  if (currentView.value !== 'onboarding') {
    currentView.value = 'onboarding'
    await nextTick()
    setTimeout(() => {
      navigateToDashboardAndPhase(phase)
    }, 350)
  } else {
    navigateToDashboardAndPhase(phase)
  }
}

const navigateToDashboardAndPhase = (phase) => {
  if (onboardingRef.value) {
    const targetStep = onboardingRef.value.totalStepsCount
    onboardingRef.value.devGoToStep(targetStep)

    // Wait for dashboard to mount, then navigate to phase
    setTimeout(() => {
      if (dashboardComponentRef.value && dashboardComponentRef.value.resetToPhase) {
        dashboardComponentRef.value.resetToPhase(phase)
      }
    }, 100)
  }
}
</script>

<template>
  <transition name="fade" mode="out-in">
    <RegistrationView
      v-if="currentView === 'registration'"
      @complete="handleRegistrationComplete"
    />
    <OnboardingView
      v-else
      ref="onboardingRef"
      :registration-data="registrationData"
      @task-created="handleTaskCreated"
      @dashboard-mounted="(ref) => dashboardComponentRef = ref"
    />
  </transition>

  <DevNavBar
    :current-view="currentView"
    :current-step="onboardingRef?.currentStep || 1"
    :total-steps="onboardingRef?.totalStepsCount || 4"
    :created-tasks="createdTasks"
    :current-task-phase="dashboardComponentRef?.currentPhase || 'analysis'"
    @navigate="handleDevNavigate"
    @go-to-step="handleDevGoToStep"
    @go-to-task-phase="handleTaskPhaseNavigate"
  />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
