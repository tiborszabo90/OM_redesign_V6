<script setup>
import { ref, computed, defineAsyncComponent, nextTick, watch, onMounted, onUnmounted } from 'vue'
import DevNavBar from './components/dev/DevNavBar.vue'
import { viewDefinitions, resolveView, getView, getSlugForView, isLogoHidden } from './registry'

// ============================================================================
// Component map — built from registry, lazy-loaded
// ============================================================================
const componentMap = {}
for (const def of viewDefinitions) {
  if (!componentMap[def.id]) {
    componentMap[def.id] = defineAsyncComponent(def.component)
  }
}

// ============================================================================
// URL slug <-> view name mapping (derived from registry)
// ============================================================================
const viewToSlug = {}
const slugToView = {}
for (const def of viewDefinitions) {
  if (def.slug && def.slug !== def.id) {
    viewToSlug[def.id] = def.slug
    slugToView[def.slug] = def.id
  }
}

// ============================================================================
// State
// ============================================================================
const ppoWizardState = ref({ selectedTypes: [], variableConfigs: {}, fromMvp: false })
const editorChatHistory = ref([])

const getViewFromHash = () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  if (!hash) return null
  if (slugToView[hash]) return slugToView[hash]
  const parts = hash.split('/')
  for (let len = parts.length - 1; len > 0; len--) {
    const candidate = parts.slice(0, len).join('/')
    if (slugToView[candidate]) return slugToView[candidate]
    if (candidate === hash) continue
  }
  return hash.split('/')[0] || hash
}

const viewToHash = (view) => viewToSlug[view] || view

const currentView = ref(getViewFromHash() || 'dev-start')
const previousView = ref(null)

watch(currentView, (newView, oldView) => {
  if (newView === 'new-campaign' && oldView) previousView.value = oldView
})

const registrationData = ref(null)
const createdTasks = ref([])
const flowSelected = ref(false)
const registrationType = ref('email')
const publicWizardStep = ref('url')
const wizardFlowStep = ref('url')
const selectedOpportunityId = ref(1)
const selectedLead = ref(null)
const sessionKey = ref(0)
const devNavOpen = ref(true)
const devStartShowArchive = ref(false)
const wizardMessage = ref('')
const wizardPhase = ref(null)

// View refs — keyed by refName from registry
const viewRefs = {}
const setViewRef = (el) => {
  const def = getView(currentView.value)
  if (def?.refName && el) {
    viewRefs[def.refName] = el
  }
}

// Backwards-compatible ref accessors
const onboardingRef = computed(() => viewRefs.onboardingRef)
const taskCreationRef = computed(() => viewRefs.taskCreationRef)
const wizardAnalysisRef = computed(() => viewRefs.wizardAnalysisRef)
const publicWizardRef = computed(() => viewRefs.publicWizardRef)
const homeOnboardingWizardRef = computed(() => viewRefs.homeOnboardingWizardRef)
const wizardFlowRef = computed(() => viewRefs.wizardFlowRef)
const imageWithBadgeRef = computed(() => viewRefs.imageWithBadgeRef)

const displayView = computed(() => wizardPhase.value || currentView.value || '')

// ============================================================================
// URL hash sync
// ============================================================================
let skipHashChange = false
watch(displayView, (view) => {
  if (view && view !== 'null') {
    const currentHash = window.location.hash.replace('#/', '').replace('#', '')
    const targetSlug = viewToSlug[view] || view
    if (currentHash.startsWith(targetSlug + '/') || currentHash === targetSlug) return
    skipHashChange = true
    window.location.hash = '/' + targetSlug
    skipHashChange = false
  }
})

// ============================================================================
// Logo visibility (from registry)
// ============================================================================
const showLogo = computed(() => currentView.value && !isLogoHidden(currentView.value))

// ============================================================================
// Dynamic component resolution
// ============================================================================
const resolvedComponent = computed(() => {
  const id = currentView.value
  if (!id) return null
  // Exact match
  if (componentMap[id]) return componentMap[id]
  // Prefix match (settings-ai-*, ai-texts-images-*)
  const def = resolveView(id)
  if (def) return componentMap[def.id] || null
  return null
})

const componentKey = computed(() => {
  const def = getView(currentView.value)
  if (def?.keyPrefix) return `${def.keyPrefix}-${sessionKey.value}`
  return currentView.value
})

// ============================================================================
// Props resolution
// ============================================================================
const settingsInitialSection = computed(() => {
  if (currentView.value === 'settings-ai-texts-images-v2-feedbacks-modal') return 'products-ai-texts-images-v2-feedbacks-modal'
  if (currentView.value === 'settings-ai-texts-images-v2-feedbacks') return 'products-ai-texts-images-v2-feedbacks'
  if (currentView.value?.startsWith('settings-ai-texts-images-v2')) return 'products-ai-texts-images-v2'
  if (currentView.value?.startsWith('settings-ai-texts-images-v1')) return 'products-ai-texts-images-v1'
  return 'personal-details'
})

const settingsScreenMap = {
  'new': 'new', 'presets': 'image-presets', 'preview': 'image-preview',
  'choose-products': 'choose-products', 'generation': 'generation',
  'generation-product': 'generation-product', 'add-products': 'add-products',
  'text-presets': 'text-presets', 'text-preview': 'text-preview', 'text-generation': 'text-generation',
}

function resolveAiScreen(viewId, prefix) {
  if (viewId === prefix) return 'list'
  const suffix = viewId.slice(prefix.length + 1) // +1 for the '-'
  return settingsScreenMap[suffix] || 'list'
}

const activeProps = computed(() => {
  const id = currentView.value
  if (!id) return {}

  // Per-view props configuration
  const propsConfig = {
    'dev-start': { initialShowArchive: devStartShowArchive.value },
    'registration-v1': { registrationType: registrationType.value },
    'onboarding': { registrationData: registrationData.value, registrationType: registrationType.value },
    'task-creation': { registrationData: registrationData.value },
    'home-old': { registrationData: registrationData.value },
    'chat-create-popup-v1': { registrationData: registrationData.value },
    'chat-create-popup-v3': { registrationData: registrationData.value },
    'chat-create-popup-v2': { registrationData: registrationData.value },
    'home-old-v2': {},
    'home-with-review': { registrationData: registrationData.value },
    'home-chat-versions': { registrationData: registrationData.value },
    'home-chat-left': { registrationData: registrationData.value },
    'home-onboarding': { registrationData: registrationData.value },
    'first-campaign-created': { registrationData: registrationData.value },
    'home-onboarding-v1': { registrationData: registrationData.value },
    'home-onboarding-with-reco': { registrationData: registrationData.value },
    'home-onboarding-with-reco-v1': { registrationData: registrationData.value },
    'home-agentic': { registrationData: registrationData.value },
    'home-onboarding-wizard': { registrationData: registrationData.value },
    'public-wizard': { registrationData: registrationData.value, initialMessage: wizardMessage.value },
    'wizard-flow': { registrationData: registrationData.value },
    'ppo-variable-setup': { selectedTypes: ppoWizardState.value.selectedTypes },
    'ppo-campaign-setup-preview': { selectedTypes: ppoWizardState.value.selectedTypes, variableConfigs: ppoWizardState.value.variableConfigs },
    'ppo-campaign-setup-preview-v2': { selectedTypes: ['product-summary'] },
    'ppo-campaign-setup-preview-v3': { selectedTypes: ['product-summary'] },
    'ppo-generation': { selectedTypes: ppoWizardState.value.selectedTypes },
    'ppo-campaign-detail': { showPlacement: false },
    'ppo-placement': { showPlacement: true },
    'ppo-variant-detail-v1': { showProductDropdown: true },
    'ppo-variant-detail-v2': { showProductDropdown: true, selectedTypes: ['product-summary'] },
    'ppo-v1-variable-setup': { selectedTypes: ppoWizardState.value.selectedTypes },
    'ppo-v1-generation': { selectedTypes: ppoWizardState.value.selectedTypes },
    'ppo-v1-campaign-detail': { showPlacement: false },
    'ppo-v1-placement': { showPlacement: true },
    'ppo-v1-variant-detail-v1': { variant: 'variant1' },
    'ppo-v1-variant-detail-v2': { variant: 'variant2' },
    'analytics-v4': { goal: 'submits' },
    'analytics-v4-purchase': { goal: 'purchase' },
    'analytics-v4-add-to-cart': { goal: 'add-to-cart' },
    'analytics-v4-email-capture': { goal: 'email-capture' },
    'analytics-v4-phone-capture': { goal: 'phone-capture' },
    'editor': { chatHistory: editorChatHistory.value },
    'opportunity-detail': { opportunityId: selectedOpportunityId.value },
    'audience-profile': { lead: selectedLead.value },
    'templates-v2-essential-theme': { initialFamily: 'essential' },
    'wizard-analysis': { registrationData: registrationData.value, initialMessage: wizardMessage.value },
    'wizard-analysis-no-chat': { registrationData: registrationData.value, initialMessage: wizardMessage.value, noChat: true },
    'wizard-style': { registrationData: registrationData.value, startAtStyle: true },
    'wizard-recommendation': { registrationData: registrationData.value, startAtRecommendation: true },
    'wizard-recommendation-v2': { registrationData: registrationData.value, startAtRecommendationV2: true },
    'wizard-recommendation-v3': { registrationData: registrationData.value, startAtRecommendationV3: true },
    'wizard-recommendation-v4': { registrationData: registrationData.value, startAtRecommendationV4: true },
    'wizard-recommendation-v5': { registrationData: registrationData.value, startAtRecommendationV5: true },
    'settings': { initialSection: settingsInitialSection.value, initialScreen: 'list' },
  }

  // Exact match
  if (propsConfig[id] !== undefined) return propsConfig[id]

  // Settings sub-views
  if (id === 'settings-ai-texts-images-v2-feedbacks') {
    return {
      initialSection: settingsInitialSection.value,
      initialScreen: 'generation',
    }
  }
  if (id === 'settings-ai-texts-images-v2-feedbacks-modal') {
    return {
      initialSection: settingsInitialSection.value,
      initialScreen: 'generation',
    }
  }
  if (id.startsWith('settings-ai')) {
    return {
      initialSection: settingsInitialSection.value,
      initialScreen: resolveAiScreen(id, id.startsWith('settings-ai-texts-images-v2') ? 'settings-ai-texts-images-v2' : id.startsWith('settings-ai-texts-images-v1') ? 'settings-ai-texts-images-v1' : 'settings-ai-texts-images'),
    }
  }

  // AI texts standalone sub-views
  if (id.startsWith('ai-texts-images-v2')) {
    return { screen: resolveAiScreen(id, 'ai-texts-images-v2') }
  }
  if (id.startsWith('ai-texts-images')) {
    return { screen: resolveAiScreen(id, 'ai-texts-images') }
  }

  return {}
})

// ============================================================================
// Events resolution
// ============================================================================
const handlePhaseChanged = (phase) => {
  wizardPhase.value = phase
}

const handleRegistrationComplete = (data) => {
  registrationData.value = data
  currentView.value = 'onboarding'
}

const handleOnboardingComplete = () => {
  sessionKey.value++
  currentView.value = null
  setTimeout(() => { currentView.value = 'wizard-flow' }, 50)
}

const handleGoToWizard = () => {
  sessionKey.value++
  currentView.value = null
  setTimeout(() => { currentView.value = 'wizard-flow' }, 50)
}

const handlePublicWizardRegistrationCompleted = () => {
  sessionKey.value++
  currentView.value = null
  setTimeout(() => {
    currentView.value = 'wizard-flow'
    setTimeout(() => {
      viewRefs.wizardFlowRef?.navigateToPhase('wizard-recommendation-v4')
      wizardFlowStep.value = 'wizard-recommendation-v4'
    }, 200)
  }, 50)
}

const handleTaskCreated = (taskData) => {
  const existingTask = createdTasks.value.find(t => t.phase === taskData.phase)
  if (!existingTask) createdTasks.value.push(taskData)
}

const handleNavigateToOpportunity = (id) => {
  selectedOpportunityId.value = id
  handleDevNavigate('opportunity-detail')
}

const handleNavigateToOpportunities = () => {
  handleDevNavigate('opportunities-all')
}

const handleNavigateToGoal = (g) => {
  handleDevNavigate('analytics-v4' + (g === 'submits' ? '' : '-' + g))
}

const handleVisitorClick = (visitor) => {
  const now = new Date()
  const hasEmail = visitor.submitted && visitor.email
  selectedLead.value = {
    ...visitor,
    name: '',
    email: hasEmail ? visitor.email : '',
    initials: visitor.city?.[0] || 'V',
    avatarColor: hasEmail ? '#81C784' : '#64B5F6',
    syncStatus: visitor.submitted ? 'Completed' : 'Browsing',
    campaign: visitor.submitted ? 'Welcome Popup for New Visitors' : '',
    domain: 'shop.example.com',
    date: now,
    dateFormatted: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeFormatted: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    phone: '',
    flag: visitor.flag || '',
    city: visitor.city || '',
    language: '',
    source: visitor.referrer || 'Direct',
    pageViews: visitor.pagesViewed || 1,
    totalVisits: visitor.returning ? 3 : 1,
    orders: 0,
    lifetimeValue: '$0',
    lastVisit: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    couponCode: '',
    region: '',
    industry: '',
    birthday: '',
    os: visitor.device === 'mobile' ? 'iOS 17' : visitor.device === 'tablet' ? 'iPadOS 17' : 'Windows 11',
    browser: visitor.browser || 'Chrome 120',
    device: visitor.device ? visitor.device.charAt(0).toUpperCase() + visitor.device.slice(1) : 'Desktop',
  }
  currentView.value = 'audience-profile'
}

const handleWizardSubmit = (message) => {
  wizardMessage.value = message
  sessionKey.value++
  currentView.value = null
  setTimeout(() => { currentView.value = 'wizard-analysis' }, 50)
}

const handleMenuClick = (menuId) => {
  if (menuId === 'campaigns') {
    const onboardingViews = ['home-onboarding', 'home-onboarding-with-reco', 'home-onboarding-review', 'home-onboarding-wizard', 'wizard-flow']
    currentView.value = onboardingViews.includes(currentView.value) ? 'campaigns-empty' : 'campaigns-v3'
  } else if (menuId === 'home') {
    if (currentView.value === 'wizard-flow' || currentView.value === 'home-onboarding-wizard') {
      sessionKey.value++
      currentView.value = 'home-onboarding-with-reco'
    } else if (currentView.value === 'campaigns-empty' || currentView.value === 'analytics-empty') {
      sessionKey.value++
      currentView.value = 'home-onboarding'
    } else {
      currentView.value = 'home-old'
    }
  } else if (menuId === 'insights') {
    const onboardingViews = ['home-onboarding', 'home-onboarding-with-reco', 'home-onboarding-review', 'home-onboarding-wizard', 'wizard-flow', 'campaigns-empty', 'analytics-empty']
    currentView.value = onboardingViews.includes(currentView.value) ? 'analytics-empty' : 'analytics-v4'
  } else if (menuId === 'campaign-page') {
    currentView.value = 'campaign-page-v1'
  } else if (menuId === 'audience') {
    currentView.value = 'audience'
  } else if (menuId === 'templates' || menuId === 'library') {
    currentView.value = 'templates-v2'
  } else if (menuId === 'home-onboarding') {
    sessionKey.value++
    flowSelected.value = true
    currentView.value = null
    setTimeout(() => { currentView.value = 'home-onboarding' }, 50)
  } else if (menuId === 'home-onboarding-wizard') {
    sessionKey.value++
    flowSelected.value = true
    currentView.value = null
    setTimeout(() => { currentView.value = 'home-onboarding-wizard' }, 50)
  } else if (menuId === 'wizard-recommendation') {
    sessionKey.value++
    flowSelected.value = true
    currentView.value = null
    setTimeout(() => {
      currentView.value = 'wizard-flow'
      setTimeout(() => {
        viewRefs.wizardFlowRef?.navigateToPhase('wizard-recommendation-v4')
        wizardFlowStep.value = 'wizard-recommendation-v4'
      }, 200)
    }, 50)
  }
}

const handleShowArchive = (show) => {
  devStartShowArchive.value = show
  skipHashChange = true
  window.location.hash = show ? '/archive' : '/dev-start'
  setTimeout(() => { skipHashChange = false })
}

const activeEvents = computed(() => {
  const id = currentView.value
  if (!id) return {}

  // Shared analytics-v4 events
  const analyticsV4Events = {
    'menu-click': handleMenuClick,
    'navigate-to-opportunity': handleNavigateToOpportunity,
    'navigate-to-opportunities': handleNavigateToOpportunities,
    'navigate-to-goal': handleNavigateToGoal,
  }

  const eventsConfig = {
    'dev-start': {
      select: handleDevStartSelect,
      'go-home': () => { sessionKey.value++; flowSelected.value = true; wizardMessage.value = ''; currentView.value = 'home-old' },
      'go-home-onboarding': () => { sessionKey.value++; flowSelected.value = true; wizardMessage.value = ''; currentView.value = 'home-onboarding' },
      'go-public-wizard': () => {
        sessionKey.value++; flowSelected.value = true; registrationType.value = 'public-wizard'; publicWizardStep.value = 'url'
        if (!wizardMessage.value) wizardMessage.value = 'Demo website analysis'
        currentView.value = null; setTimeout(() => { currentView.value = 'public-wizard' }, 50)
      },
      'go-design-guide': () => { currentView.value = 'design-guide' },
      'go-image-with-badge': () => { flowSelected.value = true; registrationType.value = 'image-with-badge'; currentView.value = 'image-with-badge' },
      'go-chat-versions': () => { currentView.value = 'home-chat-versions' },
      'go-editor': () => { currentView.value = 'editor' },
      'go-ai-texts-images': () => { currentView.value = 'ai-texts-images' },
      'go-ai-texts-images-v2': () => { currentView.value = 'settings-ai-texts-images-v2' },
      navigate: handleDevNavigate,
      'show-archive': handleShowArchive,
    },
    'registration': { complete: handleRegistrationComplete },
    'registration-v1': { complete: handleRegistrationComplete },
    'registration-v2': { complete: handleRegistrationComplete },
    'login': { complete: () => { currentView.value = 'home-old' }, 'go-to-register': () => { currentView.value = 'registration' }, 'forgot-password': () => {} },
    'onboarding': { complete: handleOnboardingComplete, 'go-to-wizard': handleGoToWizard, 'task-created': handleTaskCreated },
    'task-creation': { 'task-created': handleTaskCreated },
    'home-old': { 'menu-click': handleMenuClick, 'navigate-to': handleDevNavigate, 'new-campaign': () => { currentView.value = 'new-campaign' }, 'go-chat-left': () => { currentView.value = 'home-chat-left' }, 'navigate-to-opportunity': handleNavigateToOpportunity, 'navigate-to-opportunities': handleNavigateToOpportunities, 'open-editor-with-chat': (messages) => { editorChatHistory.value = messages; currentView.value = 'editor' }, 'visitor-click': handleVisitorClick },
    'chat-create-popup-v1': { 'menu-click': handleMenuClick, 'navigate-to': handleDevNavigate, 'new-campaign': () => { currentView.value = 'new-campaign' }, 'navigate-to-opportunity': handleNavigateToOpportunity, 'navigate-to-opportunities': handleNavigateToOpportunities, 'open-editor-with-chat': (messages) => { editorChatHistory.value = messages; currentView.value = 'editor' }, 'visitor-click': handleVisitorClick },
    'chat-create-popup-v3': { 'menu-click': handleMenuClick, 'navigate-to': handleDevNavigate, 'new-campaign': () => { currentView.value = 'new-campaign' }, 'navigate-to-opportunity': handleNavigateToOpportunity, 'navigate-to-opportunities': handleNavigateToOpportunities, 'open-editor-with-chat': (messages) => { editorChatHistory.value = messages; currentView.value = 'editor' }, 'visitor-click': handleVisitorClick },
    'chat-create-popup-v2': { 'menu-click': handleMenuClick, 'navigate-to': handleDevNavigate, 'new-campaign': () => { currentView.value = 'new-campaign' }, 'navigate-to-opportunity': handleNavigateToOpportunity, 'navigate-to-opportunities': handleNavigateToOpportunities, 'open-editor-with-chat': (messages) => { editorChatHistory.value = messages; currentView.value = 'editor' }, 'visitor-click': handleVisitorClick },
    'home-heartbeat': { 'menu-click': handleMenuClick, 'navigate-to': handleDevNavigate, 'new-campaign': () => { currentView.value = 'new-campaign' }, 'navigate-to-opportunity': handleNavigateToOpportunity, 'navigate-to-opportunities': handleNavigateToOpportunities },
    'home-old-v2': { 'menu-click': handleMenuClick },
    'home-with-review': { 'menu-click': handleMenuClick },
    'home-chat-versions': { 'menu-click': handleMenuClick },
    'home-chat-left': { 'menu-click': handleMenuClick },
    'home-onboarding': { 'menu-click': handleMenuClick },
    'first-campaign-created': { 'menu-click': handleMenuClick },
    'home-onboarding-v1': { 'menu-click': handleMenuClick },
    'home-onboarding-with-reco': { 'menu-click': handleMenuClick },
    'home-onboarding-with-reco-v1': { 'menu-click': handleMenuClick },
    'home-agentic': { 'menu-click': handleMenuClick, 'new-campaign': () => { currentView.value = 'new-campaign' }, 'navigate-to': (view, message) => { if (message) wizardMessage.value = message; handleDevNavigate(view) } },
    'home-onboarding-review': { 'menu-click': handleMenuClick, navigate: handleDevNavigate, 'visitor-click': handleVisitorClick, 'navigate-to-review': () => { currentView.value = 'campaign-review' } },
    'home-onboarding-wizard': { 'menu-click': handleMenuClick, 'phase-changed': handlePhaseChanged, 'registration-completed': handlePublicWizardRegistrationCompleted },
    'public-wizard': { 'phase-changed': handlePhaseChanged, 'registration-completed': handlePublicWizardRegistrationCompleted },
    'wizard-flow': { 'phase-changed': handlePhaseChanged, 'registration-completed': handlePublicWizardRegistrationCompleted, 'menu-click': handleMenuClick },
    'audience': { 'menu-click': handleMenuClick, 'open-profile': (lead) => { selectedLead.value = lead; currentView.value = 'audience-profile' } },
    'audience-profile': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'audience' }, 'navigate-to-campaign': () => { currentView.value = 'campaign-page-v1' } },
    'campaigns': { 'menu-click': handleMenuClick },
    'campaigns-v2': { 'menu-click': handleMenuClick, 'navigate-to-campaign': () => { currentView.value = 'campaign-page-v1' }, 'navigate-to-ppo-detail': () => { currentView.value = 'ppo-campaign-detail' }, 'new-campaign': () => { currentView.value = 'new-campaign' } },
    'campaigns-v3': { 'menu-click': handleMenuClick, 'navigate-to-campaign': () => { currentView.value = 'campaign-page-v1' }, 'navigate-to-campaign-single': () => { currentView.value = 'campaign-page-single' }, 'navigate-to-ppo-detail': () => { currentView.value = 'ppo-campaign-detail-v2' }, 'new-campaign': () => { currentView.value = 'new-campaign' } },
    'campaigns-empty': { 'menu-click': handleMenuClick },
    'new-campaign': { 'menu-click': handleMenuClick, back: () => { currentView.value = previousView.value || 'campaigns-v3' }, navigate: handleDevNavigate },
    'ppo-loading': { 'menu-click': handleMenuClick, done: () => {
      const types = ppoWizardState.value.selectedTypes
      if (types.length === 1 && types[0] === 'image-badge') {
        currentView.value = 'ppo-no-product-page'
      } else {
        currentView.value = 'ppo-campaign-setup-preview-v3'
      }
    } },
    'ppo-no-product-page': { 'menu-click': handleMenuClick, 'go-to-new-campaign': () => { currentView.value = 'new-campaign' } },
    'optimize-website': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'new-campaign' }, navigate: handleDevNavigate, select: (type) => { if (type === 'smart-product-page') currentView.value = 'ppo-campaign-flow-mvp' } },
    'product-page-optimizer': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'optimize-website' }, next: (types) => { ppoWizardState.value.selectedTypes = types; currentView.value = 'ppo-variable-setup' } },
    'ppo-campaign-flow': { back: () => { currentView.value = 'new-campaign' }, next: (types) => { ppoWizardState.value.selectedTypes = types; currentView.value = 'ppo-variable-setup' } },
    'ppo-campaign-flow-v2': { back: () => { currentView.value = 'dev-start' }, next: (types) => { ppoWizardState.value.selectedTypes = types; currentView.value = 'ppo-variable-setup' } },
    'ppo-campaign-flow-v3': { back: () => { currentView.value = 'new-campaign' }, next: (types) => { ppoWizardState.value.selectedTypes = types; currentView.value = 'ppo-variable-setup' } },
    'ppo-campaign-flow-mvp': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'new-campaign' }, next: (types) => { ppoWizardState.value.selectedTypes = types; currentView.value = 'ppo-loading' } },
    'ppo-variable-setup': { back: () => { currentView.value = 'ppo-campaign-flow' }, next: (configs) => { ppoWizardState.value.variableConfigs = configs; currentView.value = 'ppo-campaign-setup-preview' } },
    'ppo-campaign-setup-preview': { back: () => { currentView.value = 'ppo-variable-setup' }, next: () => { currentView.value = 'ppo-generation' } },
    'ppo-campaign-setup-preview-v2': { back: () => { currentView.value = 'ppo-campaign-flow-mvp' }, next: () => { currentView.value = 'ppo-campaign-detail-v2' } },
    'ppo-campaign-setup-preview-v3': { back: () => { currentView.value = 'ppo-campaign-flow-mvp' }, next: () => { currentView.value = 'ppo-campaign-detail-v2' } },
    'ppo-generation': { back: () => { currentView.value = 'ppo-campaign-setup-preview' }, create: () => { currentView.value = 'ppo-campaign-detail' } },
    'campaign-page-v1': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'campaign-page-v2-mark': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'campaign-page-single': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'campaign-page-single-v2': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'ppo-campaign-detail': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'ppo-placement': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'ppo-campaign-detail-v2': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'ppo-variant-detail-v1': { back: () => { currentView.value = 'ppo-campaign-detail' }, next: () => { currentView.value = 'ppo-campaign-detail' } },
    'ppo-variant-detail-v2': { back: () => { currentView.value = 'ppo-campaign-detail-v2' }, next: () => { currentView.value = 'ppo-campaign-detail-v2' } },
    // PPO V1
    'ppo-v1-campaign-flow': { back: () => { currentView.value = 'dev-start' }, next: (types) => { ppoWizardState.value.selectedTypes = types; currentView.value = 'ppo-v1-variable-setup' } },
    'ppo-v1-variable-setup': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'ppo-v1-campaign-flow' }, next: (configs) => { ppoWizardState.value.variableConfigs = configs; currentView.value = 'ppo-v1-generation' } },
    'ppo-v1-generation': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'ppo-v1-variable-setup' }, create: () => { currentView.value = 'ppo-v1-campaign-detail' } },
    'ppo-v1-campaign-detail': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'ppo-v1-placement': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'ppo-v1-variant-detail-v1': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'ppo-v1-campaign-detail' }, navigate: handleDevNavigate },
    'ppo-v1-variant-detail-v2': { 'menu-click': handleMenuClick, back: () => { currentView.value = 'ppo-v1-campaign-detail' }, navigate: handleDevNavigate },
    'campaign-page-with-review': { 'menu-click': handleMenuClick, 'navigate-to-review': () => { currentView.value = 'campaign-review' } },
    'campaign-review': { 'menu-click': handleMenuClick, 'go-back': () => { currentView.value = 'campaign-page-with-review' } },
    'analytics-v1': { 'menu-click': handleMenuClick },
    'analytics-v2': { 'menu-click': handleMenuClick },
    'analytics-v3': { 'menu-click': handleMenuClick, 'navigate-to-opportunity': handleNavigateToOpportunity, 'navigate-to-opportunities': handleNavigateToOpportunities },
    'analytics-v4': analyticsV4Events,
    'analytics-v4-purchase': analyticsV4Events,
    'analytics-v4-add-to-cart': analyticsV4Events,
    'analytics-v4-email-capture': analyticsV4Events,
    'analytics-v4-phone-capture': analyticsV4Events,
    'analytics-empty': { 'menu-click': handleMenuClick },
    'opportunity-detail': { 'menu-click': handleMenuClick, 'go-back': () => handleDevNavigate('analytics-v4') },
    'opportunities-all': { 'menu-click': handleMenuClick, 'go-back': () => handleDevNavigate('analytics-v4'), 'navigate-to-opportunity': handleNavigateToOpportunity },
    'templates-v1': { 'menu-click': handleMenuClick },
    'templates-v2': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'templates-v2-essential-theme': { 'menu-click': handleMenuClick, navigate: handleDevNavigate },
    'templates-v2-branding': { navigate: handleDevNavigate },
    'templates-v3': { 'menu-click': handleMenuClick },
    'wizard-analysis': { 'task-created': handleTaskCreated, 'navigate-to': handleDevNavigate, 'phase-changed': handlePhaseChanged, 'menu-click': handleMenuClick },
    'wizard-analysis-no-chat': { 'task-created': handleTaskCreated, 'navigate-to': handleDevNavigate, 'phase-changed': handlePhaseChanged },
    'wizard-style': { 'task-created': handleTaskCreated, 'menu-click': handleMenuClick },
    'wizard-quicktune': { navigate: handleDevNavigate },
    'wizard-recommendation': { 'task-created': handleTaskCreated, 'menu-click': handleMenuClick },
    'wizard-recommendation-v2': { 'task-created': handleTaskCreated, 'menu-click': handleMenuClick },
    'wizard-recommendation-v3': { 'task-created': handleTaskCreated, 'menu-click': handleMenuClick },
    'wizard-recommendation-v4': { 'task-created': handleTaskCreated, 'menu-click': handleMenuClick },
    'wizard-recommendation-v5': { 'task-created': handleTaskCreated, 'menu-click': handleMenuClick },
    'editor': { 'go-back': () => handleDevNavigate('campaign-page-v1') },
    'wizard': { submit: handleWizardSubmit },
  }

  // Exact match
  if (eventsConfig[id]) return eventsConfig[id]

  // Settings sub-views (all route to SettingsView)
  if (id === 'settings' || id.startsWith('settings-ai')) {
    return { 'menu-click': handleMenuClick, navigate: handleDevNavigate }
  }

  // AI texts sub-views
  if (id.startsWith('ai-texts-images')) {
    return { 'menu-click': handleMenuClick, navigate: handleDevNavigate }
  }

  return {}
})

// ============================================================================
// Navigation
// ============================================================================
const wizardPhases = ['wizard-analysis', 'wizard-style', 'wizard-quicktune', 'wizard-recommendation-v4']

const handleDevNavigate = (view) => {
  // Internal wizard navigation (preserve state, no view change)
  if (currentView.value === 'wizard-analysis' && wizardPhases.includes(view) && viewRefs.wizardAnalysisRef) {
    viewRefs.wizardAnalysisRef.navigateToPhase(view)
    wizardPhase.value = view === 'wizard-analysis' ? null : view
    return
  }
  if (view === 'public-wizard-url') {
    publicWizardStep.value = 'url'
    viewRefs.publicWizardRef?.navigateToStep('url')
    return
  }
  if (view === 'public-wizard-chat') {
    publicWizardStep.value = 'chat'
    viewRefs.publicWizardRef?.navigateToStep('chat')
    return
  }
  if (currentView.value === 'public-wizard' && wizardPhases.includes(view) && viewRefs.publicWizardRef) {
    viewRefs.publicWizardRef.navigateToPhase(view)
    publicWizardStep.value = view
    return
  }
  if (view === 'wizard-flow-url') {
    wizardFlowStep.value = 'url'
    viewRefs.wizardFlowRef?.navigateToStep('url')
    return
  }
  if (view === 'wizard-flow-chat') {
    wizardFlowStep.value = 'chat'
    viewRefs.wizardFlowRef?.navigateToStep('chat')
    return
  }
  if (currentView.value === 'wizard-flow' && wizardPhases.includes(view) && viewRefs.wizardFlowRef) {
    viewRefs.wizardFlowRef.navigateToPhase(view)
    wizardFlowStep.value = view
    return
  }
  if (currentView.value === 'home-onboarding-wizard' && wizardPhases.includes(view) && viewRefs.homeOnboardingWizardRef) {
    viewRefs.homeOnboardingWizardRef.navigateToPhase(view)
    return
  }

  // Reset wizard phase when navigating to a new view
  wizardPhase.value = null

  // Archive route
  if (view === 'archive') {
    devStartShowArchive.value = true
    currentView.value = null
    flowSelected.value = false
    setTimeout(() => { currentView.value = 'dev-start' }, 50)
    return
  }
  devStartShowArchive.value = false

  // Dev-start: reset all state
  if (view === 'dev-start') {
    currentView.value = null
    flowSelected.value = false
    registrationType.value = 'email'
    registrationData.value = null
    createdTasks.value = []
    wizardMessage.value = ''
    setTimeout(() => { currentView.value = 'dev-start' }, 50)
    return
  }

  // Registry-driven navigation
  const def = getView(view)
  if (def?.nav) {
    const nav = def.nav
    if (nav.sessionReset) sessionKey.value++
    if (nav.flowSelected) flowSelected.value = true
    if (nav.registrationType) registrationType.value = nav.registrationType
    if (nav.clearWizardMessage) wizardMessage.value = ''
    if (nav.defaultWizardMessage && !wizardMessage.value) wizardMessage.value = nav.defaultWizardMessage
    if (nav.extraState) {
      for (const [key, val] of Object.entries(nav.extraState)) {
        if (key === 'publicWizardStep') publicWizardStep.value = val
        if (key === 'wizardFlowStep') wizardFlowStep.value = val
      }
    }
    // Remount pattern
    currentView.value = null
    setTimeout(() => { currentView.value = view }, 50)
  } else {
    // Simple assignment
    currentView.value = view
  }
}

// ============================================================================
// DevStart & DevNavBar helpers
// ============================================================================
const handleDevStartSelect = (type) => {
  sessionKey.value++
  flowSelected.value = true
  registrationType.value = type
  currentView.value = null
  setTimeout(() => {
    if (type === 'wizard') {
      wizardFlowStep.value = 'url'
      currentView.value = 'wizard-flow'
    } else if (type === 'image-with-badge') {
      registrationType.value = 'image-with-badge'
      currentView.value = 'image-with-badge'
    } else if (type === 'shopify') {
      currentView.value = 'onboarding'
    } else {
      currentView.value = 'registration'
    }
  }, 50)
}

const handleDevGoToStep = async (step) => {
  flowSelected.value = true
  if (currentView.value !== 'onboarding') {
    sessionKey.value++
    currentView.value = null
    await nextTick()
    setTimeout(() => {
      currentView.value = 'onboarding'
      setTimeout(() => { viewRefs.onboardingRef?.devGoToStep(step) }, 350)
    }, 50)
  } else {
    viewRefs.onboardingRef?.devGoToStep(step)
  }
}

const handleImageWithBadgeGoToStep = async (step) => {
  flowSelected.value = true
  registrationType.value = 'image-with-badge'
  const isImageView = currentView.value === 'image-with-badge' || currentView.value === 'image-with-badge-v2' || currentView.value === 'image-with-badge-v3'
  if (!isImageView) {
    sessionKey.value++
    currentView.value = null
    await nextTick()
    setTimeout(() => {
      currentView.value = 'image-with-badge'
      setTimeout(() => { viewRefs.imageWithBadgeRef?.devGoToStep(step) }, 350)
    }, 50)
  } else {
    viewRefs.imageWithBadgeRef?.devGoToStep(step)
  }
}

const handleTaskPhaseNavigate = async (phase) => {
  if (currentView.value !== 'task-creation') {
    currentView.value = 'task-creation'
    await nextTick()
    setTimeout(() => {
      if (viewRefs.taskCreationRef?.resetToPhase) viewRefs.taskCreationRef.resetToPhase(phase)
    }, 350)
  } else {
    if (viewRefs.taskCreationRef?.resetToPhase) viewRefs.taskCreationRef.resetToPhase(phase)
  }
}

// ============================================================================
// Hash-based navigation listeners
// ============================================================================
const onHashChange = () => {
  if (skipHashChange) return
  const view = getViewFromHash()
  if (view && view !== currentView.value) handleDevNavigate(view)
}

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
  window.addEventListener('scroll', handleGlobalScroll, { capture: true, passive: true })
  const initialView = getViewFromHash()
  if (initialView && initialView !== 'dev-start') handleDevNavigate(initialView)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
  window.removeEventListener('scroll', handleGlobalScroll, { capture: true })
})

// ============================================================================
// Scrollbar visibility
// ============================================================================
const scrollTimers = new WeakMap()
const handleGlobalScroll = (e) => {
  const el = e.target
  if (!el || !el.classList) return
  el.classList.add('is-scrolling')
  clearTimeout(scrollTimers.get(el))
  scrollTimers.set(el, setTimeout(() => { el.classList.remove('is-scrolling') }, 1000))
}

const updateNavHeight = (isOpen) => {
  document.documentElement.style.setProperty('--dev-nav-height', isOpen ? '48px' : '0px')
}
watch(devNavOpen, updateNavHeight, { immediate: true })
</script>

<template>
  <div class="h-screen-safe flex flex-col">
    <!-- Global Logo -->
    <div v-if="showLogo" class="pt-8 pl-8 shrink-0">
      <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
    </div>

    <div class="flex-1 min-h-0">
      <transition name="fade" mode="out-in">
        <component
          :is="resolvedComponent"
          v-if="resolvedComponent"
          :key="componentKey"
          v-bind="activeProps"
          v-on="activeEvents"
          :ref="setViewRef"
        />
      </transition>
    </div>
  </div>

  <DevNavBar
    :current-view="displayView"
    :current-step="viewRefs.onboardingRef?.displayStepForNav || 1"
    :total-steps="viewRefs.onboardingRef?.totalStepsCount || 4"
    :current-image-step="viewRefs.imageWithBadgeRef?.currentStep || 1"
    :created-tasks="createdTasks"
    :current-task-phase="viewRefs.taskCreationRef?.stepDashboardRef?.currentPhase || 'analysis'"
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
