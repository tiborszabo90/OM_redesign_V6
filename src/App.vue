<script setup>
import { ref, nextTick, watch } from 'vue'
import DevStartView from './views/DevStartView.vue'
import RegistrationView from './views/RegistrationView.vue'
import OnboardingView from './views/OnboardingView.vue'
import TaskCreationView from './views/TaskCreationView.vue'
import WizardAnalysisView from './views/WizardAnalysisView.vue'
import DesignGuideView from './views/DesignGuideView.vue'
import WizardView from './views/WizardView.vue'
import DevNavBar from './components/dev/DevNavBar.vue'

const currentView = ref('dev-start')
const registrationData = ref(null)
const onboardingRef = ref(null)
const taskCreationRef = ref(null)
const wizardAnalysisRef = ref(null)
const createdTasks = ref([])
const flowSelected = ref(false)
const registrationType = ref('email')
const sessionKey = ref(0)
const devNavOpen = ref(true)
const wizardMessage = ref('')

const handleRegistrationComplete = (data) => {
  registrationData.value = data
  currentView.value = 'onboarding'
}

const handleOnboardingComplete = () => {
  // After onboarding, go directly to task creation
  currentView.value = 'task-creation'
}

const handleGoToWizard = () => {
  // After onboarding, go to wizard
  sessionKey.value++
  currentView.value = null
  setTimeout(() => {
    currentView.value = 'wizard'
  }, 50)
}

const handleDevNavigate = (view) => {
  // Reset all state when going back to start
  if (view === 'dev-start') {
    // Force unmount current component first
    currentView.value = null
    flowSelected.value = false
    registrationType.value = 'email'
    registrationData.value = null
    createdTasks.value = []
    wizardMessage.value = '' // Clear wizard message
    // Then mount dev-start after a brief delay
    setTimeout(() => {
      currentView.value = 'dev-start'
    }, 50)
  } else if (view === 'task-creation') {
    // Going to Home - always reset for fresh state
    sessionKey.value++
    flowSelected.value = true
    wizardMessage.value = '' // Clear wizard message when navigating to home
    // Force unmount current component first
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'task-creation'
    }, 50)
  } else if (view === 'design-guide') {
    // Design guide is a standalone view
    currentView.value = 'design-guide'
  } else if (view === 'wizard-analysis') {
    // Wizard analysis - set default message to auto-start
    flowSelected.value = true
    sessionKey.value++
    if (!wizardMessage.value) {
      wizardMessage.value = 'Demo website analysis'
    }
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'wizard-style') {
    // Wizard style - go directly to style selection
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'wizard-quicktune') {
    // Wizard quicktune - go directly to quicktune
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'registration' || view === 'onboarding' || view === 'wizard') {
    // Navigating to flow views - ensure flow is selected
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else {
    currentView.value = view
  }
}

const handleDevStartSelect = (type) => {
  sessionKey.value++ // Force fresh component creation for new flow
  flowSelected.value = true
  registrationType.value = type
  // Force unmount current component first
  currentView.value = null
  // Then mount the new view after a brief delay
  setTimeout(() => {
    if (type === 'wizard') {
      // Wizard flow starts with use case input
      currentView.value = 'wizard'
    } else if (type === 'shopify') {
      // Shopify flow skips registration and goes directly to onboarding
      currentView.value = 'onboarding'
    } else {
      // Email flow starts with registration
      currentView.value = 'registration'
    }
  }, 50)
}

const handleWizardSubmit = (message) => {
  // Store the wizard message and start the wizard analysis flow
  wizardMessage.value = message
  sessionKey.value++ // Force fresh component
  currentView.value = null
  setTimeout(() => {
    currentView.value = 'wizard-analysis'
  }, 50)
}

const handleDevGoToStep = async (step) => {
  // Ensure flow is selected when navigating to onboarding steps
  flowSelected.value = true

  if (currentView.value !== 'onboarding') {
    // Force fresh component if coming from a different view
    sessionKey.value++
    currentView.value = null
    await nextTick()
    setTimeout(() => {
      currentView.value = 'onboarding'
      // Wait for the component to mount and transition to complete
      setTimeout(() => {
        if (onboardingRef.value) {
          onboardingRef.value.devGoToStep(step)
        }
      }, 350)
    }, 50)
  } else {
    if (onboardingRef.value) {
      onboardingRef.value.devGoToStep(step)
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
  // Navigate to task creation view
  if (currentView.value !== 'task-creation') {
    currentView.value = 'task-creation'
    await nextTick()
    setTimeout(() => {
      if (taskCreationRef.value && taskCreationRef.value.resetToPhase) {
        taskCreationRef.value.resetToPhase(phase)
      }
    }, 350)
  } else {
    if (taskCreationRef.value && taskCreationRef.value.resetToPhase) {
      taskCreationRef.value.resetToPhase(phase)
    }
  }
}

const handleGoHome = () => {
  sessionKey.value++
  flowSelected.value = true
  wizardMessage.value = '' // Clear wizard message
  currentView.value = 'task-creation'
}

const handleGoDesignGuide = () => {
  currentView.value = 'design-guide'
}

// Update CSS variable for dev nav height
const updateNavHeight = (isOpen) => {
  document.documentElement.style.setProperty('--dev-nav-height', isOpen ? '48px' : '0px')
}

// Use immediate watcher to set CSS variable on initial load and on changes
watch(devNavOpen, updateNavHeight, { immediate: true })
</script>

<template>
  <div class="min-h-screen-safe">
    <transition name="fade" mode="out-in">
      <DevStartView
        v-if="currentView === 'dev-start'"
        @select="handleDevStartSelect"
        @go-home="handleGoHome"
        @go-design-guide="handleGoDesignGuide"
      />
      <RegistrationView
        v-else-if="currentView === 'registration'"
        :key="'reg-' + sessionKey"
        :registration-type="registrationType"
        @complete="handleRegistrationComplete"
      />
      <OnboardingView
        v-else-if="currentView === 'onboarding'"
        :key="'onb-' + sessionKey"
        ref="onboardingRef"
        :registration-data="registrationData"
        :registration-type="registrationType"
        @onboarding-complete="handleOnboardingComplete"
        @go-to-wizard="handleGoToWizard"
      />
      <TaskCreationView
        v-else-if="currentView === 'task-creation'"
        :key="'task-' + sessionKey"
        ref="taskCreationRef"
        :registration-data="registrationData"
        @task-created="handleTaskCreated"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-analysis'"
        :key="'wizard-analysis-' + sessionKey"
        ref="wizardAnalysisRef"
        :registration-data="registrationData"
        :initial-message="wizardMessage"
        @task-created="handleTaskCreated"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-style'"
        :key="'wizard-style-' + sessionKey"
        :registration-data="registrationData"
        :start-at-style="true"
        @task-created="handleTaskCreated"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-quicktune'"
        :key="'wizard-quicktune-' + sessionKey"
        :registration-data="registrationData"
        :start-at-quicktune="true"
        @task-created="handleTaskCreated"
      />
      <DesignGuideView
        v-else-if="currentView === 'design-guide'"
      />
      <WizardView
        v-else-if="currentView === 'wizard'"
        :key="'wizard-' + sessionKey"
        @submit="handleWizardSubmit"
      />
    </transition>
  </div>

  <DevNavBar
    :current-view="currentView"
    :current-step="onboardingRef?.currentStep || 1"
    :total-steps="onboardingRef?.totalStepsCount || 4"
    :created-tasks="createdTasks"
    :current-task-phase="taskCreationRef?.stepDashboardRef?.currentPhase || 'analysis'"
    :flow-selected="flowSelected"
    :registration-type="registrationType"
    @navigate="handleDevNavigate"
    @go-to-step="handleDevGoToStep"
    @go-to-task-phase="handleTaskPhaseNavigate"
    @select-flow="handleDevStartSelect"
    @update:is-open="devNavOpen = $event"
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
