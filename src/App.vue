<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import DevStartView from './views/DevStartView.vue'
import RegistrationView from './views/RegistrationView.vue'
import OnboardingView from './views/OnboardingView.vue'
import TaskCreationView from './views/TaskCreationView.vue'
import WizardAnalysisView from './views/WizardAnalysisView.vue'
import DesignGuideView from './views/DesignGuideView.vue'
import WizardView from './views/WizardView.vue'
import CampaignsView from './views/CampaignsView.vue'
import CampaignsV3View from './views/CampaignsV3View.vue'
import CampaignPageV1View from './views/CampaignPageV1View.vue'
import AnalyticsV1View from './views/AnalyticsV1View.vue'
import AnalyticsV2View from './views/AnalyticsV2View.vue'
import AnalyticsV3View from './views/AnalyticsV3View.vue'
import TemplatesViewV1 from './views/TemplatesViewV1.vue'
import TemplatesViewV2 from './views/TemplatesViewV2.vue'
import TemplatesViewV3 from './views/TemplatesViewV3.vue'
import ImageWithBadgeView from './views/ImageWithBadgeView.vue'
import ImageWithBadgeV2View from './views/ImageWithBadgeV2View.vue'
import ImageWithBadgeV3View from './views/ImageWithBadgeV3View.vue'
import HomeOldView from './views/HomeOldView.vue'
import HomeOnboardingView from './views/HomeOnboardingView.vue'
import HomeOnboardingWithRecoView from './views/HomeOnboardingWithRecoView.vue'
import HomeOnboardingWizardView from './views/HomeOnboardingWizardView.vue'
import PublicWizardView from './views/PublicWizardView.vue'
import WizardFlowView from './views/WizardFlowView.vue'
import OptimizationOpportunityDetailView from './views/OptimizationOpportunityDetailView.vue'
import OptimizationOpportunitiesAllView from './views/OptimizationOpportunitiesAllView.vue'
import SettingsView from './views/SettingsView.vue'
import DevNavBar from './components/dev/DevNavBar.vue'

// URL slug <-> view name mapping
const viewToSlug = { 'home-old': 'home', 'task-creation': 'task-creation', 'campaign-page-v1': 'campaign-detail', 'opportunity-detail': 'opportunity-detail' }
const slugToView = { 'home': 'home-old', 'task-creation': 'task-creation', 'campaign-detail': 'campaign-page-v1', 'opportunity-detail': 'opportunity-detail' }

const getViewFromHash = () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  if (!hash) return null
  return slugToView[hash] || hash
}

const viewToHash = (view) => viewToSlug[view] || view

const currentView = ref(getViewFromHash() || 'dev-start')
const registrationData = ref(null)
const onboardingRef = ref(null)
const taskCreationRef = ref(null)
const wizardAnalysisRef = ref(null)
const publicWizardRef = ref(null)
const homeOnboardingWizardRef = ref(null)
const wizardFlowRef = ref(null)
const imageWithBadgeRef = ref(null)
const createdTasks = ref([])
const flowSelected = ref(false)
const registrationType = ref('email')
const publicWizardStep = ref('url')
const wizardFlowStep = ref('url')
const selectedOpportunityId = ref(1)
const sessionKey = ref(0)
const devNavOpen = ref(true)
const wizardMessage = ref('')
const wizardPhase = ref(null) // Tracks internal wizard phase for DevNavBar + URL

// The view name shown in DevNavBar and URL (wizardPhase overrides currentView when set)
const displayView = computed(() => wizardPhase.value || currentView.value || '')

// Sync URL hash with displayView
let skipHashChange = false
watch(displayView, (view) => {
  if (view && view !== 'null') {
    skipHashChange = true
    window.location.hash = '/' + viewToHash(view)
    skipHashChange = false
  }
})

const handlePhaseChanged = (phase) => {
  wizardPhase.value = phase
}

const handleRegistrationComplete = (data) => {
  registrationData.value = data
  currentView.value = 'onboarding'
}

const handleOnboardingComplete = () => {
  // After onboarding, go to wizard flow
  sessionKey.value++
  currentView.value = null
  setTimeout(() => {
    currentView.value = 'wizard-flow'
  }, 50)
}

const handleGoToWizard = () => {
  // After onboarding, go to wizard flow
  sessionKey.value++
  currentView.value = null
  setTimeout(() => {
    currentView.value = 'wizard-flow'
  }, 50)
}

const handlePublicWizardRegistrationCompleted = () => {
  sessionKey.value++
  currentView.value = null
  setTimeout(() => {
    currentView.value = 'wizard-flow'
    // Wait for component to mount, then navigate to recommendation
    setTimeout(() => {
      wizardFlowRef.value?.navigateToPhase('wizard-recommendation-v4')
      wizardFlowStep.value = 'wizard-recommendation-v4'
    }, 200)
  }, 50)
}

// Wizard phases that can be navigated to internally without remounting
const wizardPhases = ['wizard-analysis', 'wizard-style', 'wizard-quicktune', 'wizard-recommendation-v4']

const handleDevNavigate = (view) => {
  // If already in wizard-analysis (chat version) and navigating to a wizard phase,
  // use internal navigation to preserve chat content
  if (currentView.value === 'wizard-analysis' && wizardPhases.includes(view) && wizardAnalysisRef.value) {
    wizardAnalysisRef.value.navigateToPhase(view)
    wizardPhase.value = view === 'wizard-analysis' ? null : view
    return
  }

  if (view === 'public-wizard-url') {
    publicWizardStep.value = 'url'
    publicWizardRef.value?.navigateToStep('url')
    return
  }

  if (view === 'public-wizard-chat') {
    publicWizardStep.value = 'chat'
    publicWizardRef.value?.navigateToStep('chat')
    return
  }

  if (currentView.value === 'public-wizard' && wizardPhases.includes(view) && publicWizardRef.value) {
    publicWizardRef.value.navigateToPhase(view)
    publicWizardStep.value = view
    return
  }

  if (view === 'wizard-flow-url') {
    wizardFlowStep.value = 'url'
    wizardFlowRef.value?.navigateToStep('url')
    return
  }

  if (view === 'wizard-flow-chat') {
    wizardFlowStep.value = 'chat'
    wizardFlowRef.value?.navigateToStep('chat')
    return
  }

  if (currentView.value === 'wizard-flow' && wizardPhases.includes(view) && wizardFlowRef.value) {
    wizardFlowRef.value.navigateToPhase(view)
    wizardFlowStep.value = view
    return
  }

  if (currentView.value === 'home-onboarding-wizard' && wizardPhases.includes(view) && homeOnboardingWizardRef.value) {
    homeOnboardingWizardRef.value.navigateToPhase(view)
    return
  }

  // Reset wizard phase when navigating
  wizardPhase.value = null
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
  } else if (view === 'home-old') {
    // Home Old - reset for fresh state
    sessionKey.value++
    flowSelected.value = true
    wizardMessage.value = ''
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'home-old'
    }, 50)
  } else if (view === 'home-onboarding') {
    sessionKey.value++
    flowSelected.value = true
    wizardMessage.value = ''
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'home-onboarding'
    }, 50)
  } else if (view === 'public-wizard') {
    sessionKey.value++
    flowSelected.value = true
    registrationType.value = 'public-wizard'
    publicWizardStep.value = 'url'
    wizardMessage.value = ''
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'public-wizard'
    }, 50)
  } else if (view === 'wizard-flow') {
    sessionKey.value++
    flowSelected.value = true
    registrationType.value = 'wizard'
    wizardFlowStep.value = 'url'
    wizardMessage.value = ''
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'wizard-flow'
    }, 50)
  } else if (view === 'design-guide') {
    // Design guide is a standalone view
    currentView.value = 'design-guide'
  } else if (view === 'settings') {
    currentView.value = 'settings'
  } else if (view === 'image-with-badge') {
    // Image with badge flow
    flowSelected.value = true
    registrationType.value = 'image-with-badge'
    currentView.value = 'image-with-badge'
  } else if (view === 'image-with-badge-v2') {
    // Image with badge V2 flow
    flowSelected.value = true
    registrationType.value = 'image-with-badge'
    currentView.value = 'image-with-badge-v2'
  } else if (view === 'image-with-badge-v3') {
    // Image with badge V3 flow
    flowSelected.value = true
    registrationType.value = 'image-with-badge'
    currentView.value = 'image-with-badge-v3'
  } else if (view === 'wizard-analysis') {
    // Wizard analysis - set default message to auto-start
    flowSelected.value = true
    registrationType.value = 'wizard'
    sessionKey.value++
    if (!wizardMessage.value) {
      wizardMessage.value = 'Demo website analysis'
    }
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'wizard-analysis-no-chat') {
    // Wizard analysis without chat (archived version)
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
  } else if (view === 'wizard-recommendation') {
    // Wizard recommendation v1 - go directly to recommendation
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'wizard-recommendation-v2') {
    // Wizard recommendation v2 - go directly to recommendation v2
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'wizard-recommendation-v3') {
    // Wizard recommendation v3 - go directly to recommendation v3
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'wizard-recommendation-v4') {
    // Wizard recommendation v4 - go directly to recommendation v4
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'wizard-recommendation-v5') {
    // Wizard recommendation v5 - go directly to recommendation v5
    flowSelected.value = true
    sessionKey.value++
    currentView.value = null
    setTimeout(() => {
      currentView.value = view
    }, 50)
  } else if (view === 'campaigns-v3') {
    // Campaigns list view
    currentView.value = view
  } else if (view === 'campaign-page-v1') {
    // Campaign Page view
    currentView.value = view
  } else if (view === 'opportunity-detail' || view === 'opportunities-all') {
    currentView.value = view
  } else if (view === 'analytics-v1' || view === 'analytics-v2' || view === 'analytics-v3') {
    // Analytics views
    currentView.value = view
  } else if (view === 'templates-v1' || view === 'templates-v2' || view === 'templates-v3') {
    // Templates views
    currentView.value = view
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

// Hash-based navigation listeners (placed after handleDevNavigate)
const onHashChange = () => {
  if (skipHashChange) return
  const view = getViewFromHash()
  if (view && view !== currentView.value) {
    handleDevNavigate(view)
  }
}

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
  window.addEventListener('scroll', handleGlobalScroll, { capture: true, passive: true })
  // If page loaded with a hash, navigate to that view
  const initialView = getViewFromHash()
  if (initialView && initialView !== 'dev-start') {
    handleDevNavigate(initialView)
  }
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
  window.removeEventListener('scroll', handleGlobalScroll, { capture: true })
})

const handleDevStartSelect = (type) => {
  sessionKey.value++ // Force fresh component creation for new flow
  flowSelected.value = true
  registrationType.value = type
  // Force unmount current component first
  currentView.value = null
  // Then mount the new view after a brief delay
  setTimeout(() => {
    if (type === 'wizard') {
      // Wizard flow uses the new WizardFlowView
      wizardFlowStep.value = 'url'
      currentView.value = 'wizard-flow'
    } else if (type === 'image-with-badge') {
      // Image with Badge flow goes directly to image-with-badge V1
      registrationType.value = 'image-with-badge'
      currentView.value = 'image-with-badge'
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

const handleImageWithBadgeGoToStep = async (step) => {
  // Ensure flow is selected when navigating to image-with-badge steps
  flowSelected.value = true
  registrationType.value = 'image-with-badge'

  const isImageWithBadgeView = currentView.value === 'image-with-badge' || currentView.value === 'image-with-badge-v2' || currentView.value === 'image-with-badge-v3'

  if (!isImageWithBadgeView) {
    // Force fresh component if coming from a different view
    sessionKey.value++
    currentView.value = null
    await nextTick()
    setTimeout(() => {
      currentView.value = 'image-with-badge'
      // Wait for the component to mount and transition to complete
      setTimeout(() => {
        if (imageWithBadgeRef.value) {
          imageWithBadgeRef.value.devGoToStep(step)
        }
      }, 350)
    }, 50)
  } else {
    if (imageWithBadgeRef.value) {
      imageWithBadgeRef.value.devGoToStep(step)
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
  currentView.value = 'home-old'
}

const handleGoHomeOnboarding = () => {
  sessionKey.value++
  flowSelected.value = true
  wizardMessage.value = ''
  currentView.value = 'home-onboarding'
}

const handleGoDesignGuide = () => {
  currentView.value = 'design-guide'
}

const handleGoImageWithBadge = () => {
  flowSelected.value = true
  registrationType.value = 'image-with-badge'
  currentView.value = 'image-with-badge'
}

const handleGoPublicWizard = () => {
  sessionKey.value++
  flowSelected.value = true
  registrationType.value = 'public-wizard'
  publicWizardStep.value = 'url'
  if (!wizardMessage.value) {
    wizardMessage.value = 'Demo website analysis'
  }
  currentView.value = null
  setTimeout(() => {
    currentView.value = 'public-wizard'
  }, 50)
}

const handleNavigateToOpportunity = (id) => {
  selectedOpportunityId.value = id
  handleDevNavigate('opportunity-detail')
}

const handleNavigateToOpportunities = () => {
  handleDevNavigate('opportunities-all')
}

const handleMenuClick = (menuId) => {
  if (menuId === 'campaigns') {
    currentView.value = 'campaigns-v3'
  } else if (menuId === 'home') {
    if (currentView.value === 'wizard-flow' || currentView.value === 'home-onboarding-wizard') {
      sessionKey.value++
      currentView.value = 'home-onboarding-with-reco'
    } else {
      currentView.value = 'home-old'
    }
  } else if (menuId === 'insights') {
    currentView.value = 'analytics-v3'
  } else if (menuId === 'campaign-page') {
    currentView.value = 'campaign-page-v1'
  } else if (menuId === 'templates' || menuId === 'library') {
    currentView.value = 'templates-v3'
  } else if (menuId === 'home-onboarding') {
    sessionKey.value++
    flowSelected.value = true
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'home-onboarding'
    }, 50)
  } else if (menuId === 'home-onboarding-wizard') {
    sessionKey.value++
    flowSelected.value = true
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'home-onboarding-wizard'
    }, 50)
  } else if (menuId === 'wizard-recommendation') {
    sessionKey.value++
    flowSelected.value = true
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'wizard-flow'
      setTimeout(() => {
        wizardFlowRef.value?.navigateToPhase('wizard-recommendation-v4')
        wizardFlowStep.value = 'wizard-recommendation-v4'
      }, 200)
    }, 50)
  }
  // Add other menu items as needed
}

// Scrollbar visibility: show thumb while scrolling, hide after idle
const scrollTimers = new WeakMap()
const handleGlobalScroll = (e) => {
  const el = e.target
  if (!el || !el.classList) return
  el.classList.add('is-scrolling')
  clearTimeout(scrollTimers.get(el))
  scrollTimers.set(el, setTimeout(() => {
    el.classList.remove('is-scrolling')
  }, 1000))
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
    <!-- Global Logo - stays visible during view transitions (hidden on pages with their own logo) -->
    <div
      v-if="currentView && !['dev-start', 'design-guide', 'settings', 'image-with-badge', 'image-with-badge-v2', 'image-with-badge-v3', 'wizard-analysis', 'wizard-analysis-no-chat', 'wizard-style', 'wizard-quicktune', 'wizard-recommendation', 'wizard-recommendation-v2', 'wizard-recommendation-v3', 'wizard-recommendation-v4', 'wizard-recommendation-v5', 'task-creation', 'home-old', 'home-onboarding', 'home-onboarding-with-reco', 'home-onboarding-wizard', 'public-wizard', 'wizard-flow', 'campaigns', 'campaigns-v3', 'campaign-page-v1', 'analytics-v1', 'analytics-v2', 'analytics-v3', 'templates-v1', 'templates-v2', 'templates-v3', 'opportunity-detail', 'opportunities-all'].includes(currentView)"
      class="pt-8 pl-8"
    >
      <img
        src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
        alt="OptiMonk"
        class="h-8"
      />
    </div>

    <transition name="fade" mode="out-in">
      <DevStartView
        v-if="currentView === 'dev-start'"
        @select="handleDevStartSelect"
        @go-home="handleGoHome"
        @go-home-onboarding="handleGoHomeOnboarding"
        @go-public-wizard="handleGoPublicWizard"
        @go-design-guide="handleGoDesignGuide"
        @go-image-with-badge="handleGoImageWithBadge"
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
        @skip-to-dashboard="handleMenuClick('home-onboarding')"
      />
      <TaskCreationView
        v-else-if="currentView === 'task-creation'"
        :key="'task-' + sessionKey"
        ref="taskCreationRef"
        :registration-data="registrationData"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
        @navigate-to="(view, message) => { if (message) wizardMessage = message; handleDevNavigate(view) }"
      />
      <HomeOldView
        v-else-if="currentView === 'home-old'"
        :key="'home-old-' + sessionKey"
        :registration-data="registrationData"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <HomeOnboardingView
        v-else-if="currentView === 'home-onboarding'"
        :key="'home-onboarding-' + sessionKey"
        :registration-data="registrationData"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <HomeOnboardingWithRecoView
        v-else-if="currentView === 'home-onboarding-with-reco'"
        :key="'home-onboarding-with-reco-' + sessionKey"
        :registration-data="registrationData"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <HomeOnboardingWizardView
        v-else-if="currentView === 'home-onboarding-wizard'"
        ref="homeOnboardingWizardRef"
        :key="'home-onboarding-wizard-' + sessionKey"
        :registration-data="registrationData"
        @task-created="handleTaskCreated"
        @navigate-to="(view) => handleDevNavigate(view)"
        @menu-click="handleMenuClick"
      />
      <PublicWizardView
        v-else-if="currentView === 'public-wizard'"
        ref="publicWizardRef"
        :key="'public-wizard-' + sessionKey"
        :registration-data="registrationData"
        :initial-message="wizardMessage"
        @task-created="handleTaskCreated"
        @navigate-to="(view) => handleDevNavigate(view)"
        @menu-click="handleMenuClick"
        @registration-completed="handlePublicWizardRegistrationCompleted"
      />
      <WizardFlowView
        v-else-if="currentView === 'wizard-flow'"
        ref="wizardFlowRef"
        :key="'wizard-flow-' + sessionKey"
        :registration-data="registrationData"
        @task-created="handleTaskCreated"
        @navigate-to="(view) => handleDevNavigate(view)"
        @menu-click="handleMenuClick"
      />
      <CampaignsView
        v-else-if="currentView === 'campaigns'"
        @menu-click="handleMenuClick"
      />
      <CampaignsV3View
        v-else-if="currentView === 'campaigns-v3'"
        @menu-click="handleMenuClick"
        @navigate-to-campaign="currentView = 'campaign-page-v1'"
      />
      <CampaignPageV1View
        v-else-if="currentView === 'campaign-page-v1'"
        @menu-click="handleMenuClick"
      />
      <AnalyticsV1View
        v-else-if="currentView === 'analytics-v1'"
        @menu-click="handleMenuClick"
      />
      <AnalyticsV2View
        v-else-if="currentView === 'analytics-v2'"
        @menu-click="handleMenuClick"
      />
      <AnalyticsV3View
        v-else-if="currentView === 'analytics-v3'"
        @menu-click="handleMenuClick"
        @navigate-to-opportunity="handleNavigateToOpportunity"
        @navigate-to-opportunities="handleNavigateToOpportunities"
      />
      <OptimizationOpportunityDetailView
        v-else-if="currentView === 'opportunity-detail'"
        :opportunity-id="selectedOpportunityId"
        @menu-click="handleMenuClick"
        @go-back="handleDevNavigate('analytics-v3')"
      />
      <OptimizationOpportunitiesAllView
        v-else-if="currentView === 'opportunities-all'"
        @menu-click="handleMenuClick"
        @go-back="handleDevNavigate('analytics-v3')"
        @navigate-to-opportunity="handleNavigateToOpportunity"
      />
      <TemplatesViewV1
        v-else-if="currentView === 'templates-v1'"
        @menu-click="handleMenuClick"
      />
      <TemplatesViewV2
        v-else-if="currentView === 'templates-v2'"
        @menu-click="handleMenuClick"
      />
      <TemplatesViewV3
        v-else-if="currentView === 'templates-v3'"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-analysis'"
        :key="'wizard-analysis-' + sessionKey"
        ref="wizardAnalysisRef"
        :registration-data="registrationData"
        :initial-message="wizardMessage"
        @task-created="handleTaskCreated"
        @navigate-to="handleDevNavigate"
        @phase-changed="handlePhaseChanged"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-analysis-no-chat'"
        :key="'wizard-analysis-no-chat-' + sessionKey"
        :registration-data="registrationData"
        :initial-message="wizardMessage"
        :no-chat="true"
        @task-created="handleTaskCreated"
        @navigate-to="handleDevNavigate"
        @phase-changed="handlePhaseChanged"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-style'"
        :key="'wizard-style-' + sessionKey"
        :registration-data="registrationData"
        :start-at-style="true"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-quicktune'"
        :key="'wizard-quicktune-' + sessionKey"
        :registration-data="registrationData"
        :start-at-quicktune="true"
        @task-created="handleTaskCreated"
        @navigate-to="handleDevNavigate"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-recommendation'"
        :key="'wizard-recommendation-' + sessionKey"
        :registration-data="registrationData"
        :start-at-recommendation="true"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-recommendation-v2'"
        :key="'wizard-recommendation-v2-' + sessionKey"
        :registration-data="registrationData"
        :start-at-recommendation-v2="true"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-recommendation-v3'"
        :key="'wizard-recommendation-v3-' + sessionKey"
        :registration-data="registrationData"
        :start-at-recommendation-v3="true"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-recommendation-v4'"
        :key="'wizard-recommendation-v4-' + sessionKey"
        :registration-data="registrationData"
        :start-at-recommendation-v4="true"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <WizardAnalysisView
        v-else-if="currentView === 'wizard-recommendation-v5'"
        :key="'wizard-recommendation-v5-' + sessionKey"
        :registration-data="registrationData"
        :start-at-recommendation-v5="true"
        @task-created="handleTaskCreated"
        @menu-click="handleMenuClick"
      />
      <DesignGuideView
        v-else-if="currentView === 'design-guide'"
      />
      <SettingsView
        v-else-if="currentView === 'settings'"
        @menu-click="handleMenuClick"
      />
      <ImageWithBadgeView
        v-else-if="currentView === 'image-with-badge'"
        :key="'image-with-badge-' + sessionKey"
        ref="imageWithBadgeRef"
      />
      <ImageWithBadgeV2View
        v-else-if="currentView === 'image-with-badge-v2'"
        :key="'image-with-badge-v2-' + sessionKey"
        ref="imageWithBadgeRef"
      />
      <ImageWithBadgeV3View
        v-else-if="currentView === 'image-with-badge-v3'"
        :key="'image-with-badge-v3-' + sessionKey"
        ref="imageWithBadgeRef"
      />
      <WizardView
        v-else-if="currentView === 'wizard'"
        :key="'wizard-' + sessionKey"
        @submit="handleWizardSubmit"
      />
    </transition>
  </div>

  <DevNavBar
    :current-view="displayView"
    :current-step="onboardingRef?.displayStepForNav || 1"
    :total-steps="onboardingRef?.totalStepsCount || 4"
    :current-image-step="imageWithBadgeRef?.currentStep || 1"
    :created-tasks="createdTasks"
    :current-task-phase="taskCreationRef?.stepDashboardRef?.currentPhase || 'analysis'"
    :flow-selected="flowSelected"
    :registration-type="registrationType"
    :public-wizard-step="publicWizardStep"
    :wizard-flow-step="wizardFlowStep"
    @navigate="handleDevNavigate"
    @go-to-step="handleDevGoToStep"
    @go-to-image-step="handleImageWithBadgeGoToStep"
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
