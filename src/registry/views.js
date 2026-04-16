// ============================================================================
// View Registry — Single source of truth for all views
// ============================================================================
// To add a new view:
//   1. Create the .vue file in src/views/
//   2. Add an entry below
//   3. (Optional) Add props/events config in App.vue's viewPropsConfig/viewEventsConfig
//
// Fields:
//   id            — unique view identifier (matches currentView value)
//   component     — dynamic import function
//   label         — display name in DevNavBar/archive
//   status        — 'active' | 'archived' | 'system'
//   section       — DevNavBar section key (see sections.js) or null
//   hideLogo      — true = hide global logo (default true; most views hide it)
//   slug          — URL hash slug if different from id
//   keyPrefix     — if set, component :key = `${keyPrefix}-${sessionKey}`
//   refName       — template ref name (for views with internal navigation)
//   nav           — navigation behavior in handleDevNavigate (null = simple assignment)
//   matchPrefix   — for prefix-based component resolution (e.g. 'settings-ai')
// ============================================================================

// -- Helpers for generating sub-view entries ---------------------------------

const aiScreenSuffixes = [
  '', '-new', '-presets', '-preview', '-choose-products',
  '-generation', '-add-products', '-text-presets', '-text-preview', '-text-generation',
]

const aiV2ScreenSuffixes = [
  ...aiScreenSuffixes, '-generation-product',
]

function generateAiSubViews(baseId, component, label, section) {
  const suffixes = baseId.includes('-v2') ? aiV2ScreenSuffixes : aiScreenSuffixes
  return suffixes.map(suffix => ({
    id: `${baseId}${suffix}`,
    component,
    label: suffix ? `${label} (${suffix.slice(1)})` : label,
    status: 'active',
    section,
    hideLogo: true,
  }))
}

function generateSettingsAiSubViews(baseId) {
  const suffixes = baseId.includes('-v2') ? aiV2ScreenSuffixes : aiScreenSuffixes
  return suffixes.map(suffix => ({
    id: `${baseId}${suffix}`,
    component: () => import('../views/SettingsView.vue'),
    label: `Settings AI ${suffix || 'list'}`,
    status: 'active',
    section: null,
    hideLogo: true,
    matchPrefix: baseId,
  }))
}

// -- View definitions --------------------------------------------------------

// System views
const systemViews = [
  {
    id: 'dev-start',
    component: () => import('../views/DevStartView.vue'),
    label: 'Dev Start',
    status: 'system',
    section: null,
    hideLogo: true,
  },
  {
    id: 'design-guide',
    component: () => import('../views/DesignGuideView.vue'),
    label: 'Design Guide',
    status: 'system',
    section: null,
    hideLogo: true,
  },
  {
    id: 'editor',
    component: () => import('../views/EditorView.vue'),
    label: 'Editor',
    status: 'system',
    section: null,
    hideLogo: true,
  },
  {
    id: 'settings',
    component: () => import('../views/SettingsView.vue'),
    label: 'Settings',
    status: 'system',
    section: null,
    hideLogo: true,
    matchPrefix: 'settings',
  },
]

// Registration & Onboarding
const registrationViews = [
  {
    id: 'registration',
    component: () => import('../views/RegistrationView.vue'),
    label: 'Registration',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'reg',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'registration-v1',
    component: () => import('../views/RegistrationV1View.vue'),
    label: 'Registration V1',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'reg-v1',
  },
  {
    id: 'registration-v2',
    component: () => import('../views/RegistrationV2View.vue'),
    label: 'Registration V2',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'reg-v2',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'onboarding',
    component: () => import('../views/OnboardingView.vue'),
    label: 'Onboarding',
    status: 'active',
    section: null,
    hideLogo: false, // Logo IS shown for onboarding
    keyPrefix: 'onb',
    refName: 'onboardingRef',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'task-creation',
    component: () => import('../views/TaskCreationView.vue'),
    label: 'Home Agentic',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'task',
    refName: 'taskCreationRef',
    nav: { sessionReset: true, flowSelected: true, clearWizardMessage: true },
  },
]

// Home views
const homeViews = [
  {
    id: 'home-old',
    component: () => import('../views/HomeOldView.vue'),
    label: 'Home',
    status: 'active',
    section: 'home',
    hideLogo: true,
    keyPrefix: 'home-old',
    slug: 'home',
    nav: { sessionReset: true, flowSelected: true, clearWizardMessage: true },
  },
  {
    id: 'home-heartbeat',
    component: () => import('../views/HomeHeartbeatView.vue'),
    label: 'Home Heartbeat',
    status: 'archived',
    section: 'home',
    hideLogo: true,
    keyPrefix: 'home-heartbeat',
  },
  {
    id: 'chat-create-popup-v1',
    component: () => import('../views/ChatCreatePopupV1View.vue'),
    label: 'Chat_Create-popup_V1',
    status: 'active',
    section: 'home',
    hideLogo: true,
    keyPrefix: 'chat-create-popup-v1',
    nav: { sessionReset: true, flowSelected: true, clearWizardMessage: true },
  },
  {
    id: 'chat-create-popup-v3',
    component: () => import('../views/ChatCreatePopupV3View.vue'),
    label: 'Chat_Create-popup_V3',
    status: 'active',
    section: 'home',
    hideLogo: true,
    keyPrefix: 'chat-create-popup-v3',
    nav: { sessionReset: true, flowSelected: true, clearWizardMessage: true },
  },
  {
    id: 'chat-create-popup-v2',
    component: () => import('../views/ChatCreatePopupV2View.vue'),
    label: 'Chat_Create-popup_V2',
    status: 'active',
    section: 'home',
    hideLogo: true,
    keyPrefix: 'chat-create-popup-v2',
    nav: { sessionReset: true, flowSelected: true, clearWizardMessage: true },
  },
  {
    id: 'home-old-v2',
    component: () => import('../views/HomeOldV2View.vue'),
    label: 'Home Old',
    status: 'archived',
    section: null,
    hideLogo: false,
  },
  {
    id: 'home-with-review',
    component: () => import('../views/HomeWithReviewView.vue'),
    label: 'Home (Review)',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'home-with-review',
    nav: { sessionReset: true, flowSelected: true, clearWizardMessage: true },
  },
  {
    id: 'home-chat-versions',
    component: () => import('../views/HomeChatVersionsView.vue'),
    label: 'Chat Versions',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
  {
    id: 'home-chat-left',
    component: () => import('../views/HomeChatLeftView.vue'),
    label: 'Chat Left',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
  {
    id: 'home-onboarding',
    component: () => import('../views/HomeOnboardingView.vue'),
    label: 'Home Onboarding',
    status: 'active',
    section: 'home',
    hideLogo: true,
    keyPrefix: 'home-onboarding',
    nav: { sessionReset: true, flowSelected: true, clearWizardMessage: true },
  },
  {
    id: 'home-onboarding-v1',
    component: () => import('../views/HomeOnboardingV1View.vue'),
    label: 'Home Onboarding V1',
    status: 'archived',
    section: null,
    hideLogo: false,
    keyPrefix: 'home-onboarding-v1',
  },
  {
    id: 'home-onboarding-with-reco',
    component: () => import('../views/HomeOnboardingWithRecoView.vue'),
    label: 'Home + Reco',
    status: 'active',
    section: 'home',
    hideLogo: true,
    keyPrefix: 'home-onboarding-with-reco',
  },
  {
    id: 'home-onboarding-with-reco-v1',
    component: () => import('../views/HomeOnboardingWithRecoV1View.vue'),
    label: 'Home Onboarding + Reco V1',
    status: 'archived',
    section: null,
    hideLogo: false,
    keyPrefix: 'home-onboarding-with-reco-v1',
  },
  {
    id: 'home-onboarding-review',
    component: () => import('../views/HomeOnboardingReviewView.vue'),
    label: 'Home Review',
    status: 'active',
    section: 'home',
    hideLogo: true,
  },
  {
    id: 'home-onboarding-wizard',
    component: () => import('../views/HomeOnboardingWizardView.vue'),
    label: 'Home Wizard',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'home-onboarding-wizard',
    refName: 'homeOnboardingWizardRef',
  },
]

// Wizard views
const wizardViews = [
  {
    id: 'public-wizard',
    component: () => import('../views/PublicWizardView.vue'),
    label: 'Public Wizard',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'public-wizard',
    refName: 'publicWizardRef',
    nav: { sessionReset: true, flowSelected: true, registrationType: 'public-wizard', clearWizardMessage: true, extraState: { publicWizardStep: 'url' } },
  },
  {
    id: 'wizard-flow',
    component: () => import('../views/WizardFlowView.vue'),
    label: 'Wizard Flow',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-flow',
    refName: 'wizardFlowRef',
    nav: { sessionReset: true, flowSelected: true, registrationType: 'wizard', clearWizardMessage: true, extraState: { wizardFlowStep: 'url' } },
  },
  {
    id: 'wizard',
    component: () => import('../views/WizardView.vue'),
    label: 'Wizard',
    status: 'active',
    section: null,
    hideLogo: false,
    keyPrefix: 'wizard',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'wizard-analysis',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Wizard Flow',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-analysis',
    refName: 'wizardAnalysisRef',
    nav: { sessionReset: true, flowSelected: true, registrationType: 'wizard', defaultWizardMessage: 'Demo website analysis' },
  },
  {
    id: 'wizard-analysis-no-chat',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Wizard Flow (no chat)',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-analysis-no-chat',
    nav: { sessionReset: true, flowSelected: true, defaultWizardMessage: 'Demo website analysis' },
  },
  {
    id: 'wizard-style',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Wizard Style',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-style',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'wizard-quicktune',
    component: () => import('../views/TemplatesV2QuicktuneView.vue'),
    label: 'Wizard Quicktune',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-quicktune',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'wizard-recommendation',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Recommendation V1',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-recommendation',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'wizard-recommendation-v2',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Recommendation V2',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-recommendation-v2',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'wizard-recommendation-v3',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Recommendation V3',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-recommendation-v3',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'wizard-recommendation-v4',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Recommendation V4',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-recommendation-v4',
    nav: { sessionReset: true, flowSelected: true },
  },
  {
    id: 'wizard-recommendation-v5',
    component: () => import('../views/WizardAnalysisView.vue'),
    label: 'Recommendation V5',
    status: 'archived',
    section: null,
    hideLogo: true,
    keyPrefix: 'wizard-recommendation-v5',
    nav: { sessionReset: true, flowSelected: true },
  },
]

// Campaigns
const campaignViews = [
  {
    id: 'campaigns',
    component: () => import('../views/CampaignsView.vue'),
    label: 'Campaigns',
    status: 'active',
    section: 'campaigns',
    hideLogo: true,
  },
  {
    id: 'campaigns-v2',
    component: () => import('../views/CampaignsV2View.vue'),
    label: 'Campaigns V2',
    status: 'active',
    section: 'campaigns',
    hideLogo: true,
  },
  {
    id: 'campaigns-v3',
    component: () => import('../views/CampaignsV3View.vue'),
    label: 'Campaigns',
    status: 'active',
    section: 'campaigns',
    hideLogo: true,
  },
  {
    id: 'campaigns-empty',
    component: () => import('../views/CampaignsEmptyView.vue'),
    label: 'Campaigns (empty)',
    status: 'active',
    section: 'campaigns',
    hideLogo: true,
  },
  {
    id: 'new-campaign',
    component: () => import('../views/NewCampaignView.vue'),
    label: 'New Campaign',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'ppo-loading',
    component: () => import('../views/PpoLoadingView.vue'),
    label: 'SPP Loading',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'campaign-page-v1',
    component: () => import('../views/CampaignPageV1View.vue'),
    label: 'Campaign Page',
    status: 'active',
    section: 'campaignPage',
    hideLogo: true,
    slug: 'campaign-detail',
  },
  {
    id: 'campaign-page-with-review',
    component: () => import('../views/CampaignPageWithReviewView.vue'),
    label: 'Campaign + Review',
    status: 'active',
    section: 'campaignPage',
    hideLogo: true,
  },
  {
    id: 'campaign-review',
    component: () => import('../views/CampaignReviewView.vue'),
    label: 'Campaign Review',
    status: 'active',
    section: null,
    hideLogo: true,
  },
]

// Analytics
const analyticsViews = [
  {
    id: 'analytics-v1',
    component: () => import('../views/AnalyticsV1View.vue'),
    label: 'Analytics V1',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
  {
    id: 'analytics-v2',
    component: () => import('../views/AnalyticsV2View.vue'),
    label: 'Analytics V2',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
  {
    id: 'analytics-v3',
    component: () => import('../views/AnalyticsV3View.vue'),
    label: 'Analytics V3',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
  {
    id: 'analytics-v4',
    component: () => import('../views/AnalyticsV4View.vue'),
    label: 'Analytics',
    status: 'active',
    section: 'analytics',
    hideLogo: true,
  },
  {
    id: 'analytics-v4-purchase',
    component: () => import('../views/AnalyticsV4View.vue'),
    label: 'Analytics (Purchase)',
    status: 'active',
    section: 'analytics',
    hideLogo: true,
  },
  {
    id: 'analytics-v4-add-to-cart',
    component: () => import('../views/AnalyticsV4View.vue'),
    label: 'Analytics (ATC)',
    status: 'active',
    section: 'analytics',
    hideLogo: true,
  },
  {
    id: 'analytics-v4-email-capture',
    component: () => import('../views/AnalyticsV4View.vue'),
    label: 'Analytics (Email)',
    status: 'active',
    section: 'analytics',
    hideLogo: true,
  },
  {
    id: 'analytics-v4-phone-capture',
    component: () => import('../views/AnalyticsV4View.vue'),
    label: 'Analytics (Phone)',
    status: 'active',
    section: 'analytics',
    hideLogo: true,
  },
  {
    id: 'analytics-empty',
    component: () => import('../views/AnalyticsEmptyView.vue'),
    label: 'Analytics (empty)',
    status: 'active',
    section: 'analytics',
    hideLogo: true,
  },
  {
    id: 'opportunity-detail',
    component: () => import('../views/OptimizationOpportunityDetailView.vue'),
    label: 'Opportunity Detail',
    status: 'active',
    section: null,
    hideLogo: true,
    slug: 'opportunity-detail',
  },
  {
    id: 'opportunities-all',
    component: () => import('../views/OptimizationOpportunitiesAllView.vue'),
    label: 'All Opportunities',
    status: 'active',
    section: null,
    hideLogo: true,
  },
]

// PPO v2
const ppoViews = [
  {
    id: 'optimize-website',
    component: () => import('../views/OptimizeWebsiteView.vue'),
    label: 'Optimize Website',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'product-page-optimizer',
    component: () => import('../views/ProductPageOptimizerView.vue'),
    label: 'Product Page Optimizer',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'ppo-campaign-flow',
    component: () => import('../views/PpoCampaignFlowView.vue'),
    label: 'Campaign Flow',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
    slug: 'ppo-campaign-flow',
  },
  {
    id: 'ppo-campaign-flow-v2',
    component: () => import('../views/PpoCampaignFlowV2View.vue'),
    label: 'Campaign Flow (tiles)',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
  {
    id: 'ppo-campaign-flow-v3',
    component: () => import('../views/PpoCampaignFlowV3View.vue'),
    label: 'Campaign Flow (cards)',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
  {
    id: 'ppo-campaign-flow-mvp',
    component: () => import('../views/PpoCampaignFlowMvpView.vue'),
    label: 'Campaign Flow (MVP)',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
  {
    id: 'ppo-variable-setup',
    component: () => import('../views/PpoVariableSetupView.vue'),
    label: 'Variable Setup',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
    slug: 'ppo-variable-setup',
  },
  {
    id: 'ppo-campaign-setup-preview',
    component: () => import('../views/PpoCampaignSetupPreviewView.vue'),
    label: 'Setup Preview',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
  {
    id: 'ppo-campaign-setup-preview-v2',
    component: () => import('../views/PpoCampaignSetupPreviewV2View.vue'),
    label: 'Setup Preview V2',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
  {
    id: 'ppo-campaign-setup-preview-v3',
    component: () => import('../views/PpoCampaignSetupPreviewV3View.vue'),
    label: 'Setup Preview V3',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
  {
    id: 'ppo-generation',
    component: () => import('../views/PpoGenerationView.vue'),
    label: 'Generation',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
    slug: 'ppo-generation',
  },
  {
    id: 'ppo-campaign-detail',
    component: () => import('../views/PpoCampaignDetailView.vue'),
    label: 'Campaign Detail',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
    slug: 'ppo-campaign-detail',
  },
  {
    id: 'ppo-placement',
    component: () => import('../views/PpoCampaignDetailView.vue'),
    label: 'Placement',
    status: 'active',
    section: null,
    hideLogo: true,
    slug: 'ppo-placement',
  },
  {
    id: 'ppo-campaign-detail-v2',
    component: () => import('../views/PpoCampaignDetailV2View.vue'),
    label: 'Campaign Detail V2',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
  {
    id: 'ppo-variant-detail-v1',
    component: () => import('../views/PpoCampaignSetupPreviewView.vue'),
    label: 'Variant Detail',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
  {
    id: 'ppo-variant-detail-v2',
    component: () => import('../views/PpoVariantDetailV2View.vue'),
    label: 'Variant Detail V2',
    status: 'active',
    section: 'ppo',
    hideLogo: true,
  },
]

// PPO V1 (archived)
const ppoV1Views = [
  {
    id: 'ppo-v1-campaign-flow',
    component: () => import('../views/PpoCampaignFlowV1View.vue'),
    label: 'PPO V1',
    status: 'archived',
    section: 'ppoV1',
    hideLogo: true,
  },
  {
    id: 'ppo-v1-variable-setup',
    component: () => import('../views/PpoVariableSetupV1View.vue'),
    label: 'Variable Setup V1',
    status: 'active',
    section: 'ppoV1',
    hideLogo: true,
  },
  {
    id: 'ppo-v1-generation',
    component: () => import('../views/PpoGenerationV1View.vue'),
    label: 'Generation V1',
    status: 'active',
    section: 'ppoV1',
    hideLogo: true,
  },
  {
    id: 'ppo-v1-campaign-detail',
    component: () => import('../views/PpoCampaignDetailV1View.vue'),
    label: 'Campaign Detail V1',
    status: 'active',
    section: 'ppoV1',
    hideLogo: true,
  },
  {
    id: 'ppo-v1-placement',
    component: () => import('../views/PpoCampaignDetailV1View.vue'),
    label: 'Placement V1',
    status: 'active',
    section: 'ppoV1',
    hideLogo: true,
  },
  {
    id: 'ppo-v1-variant-detail-v1',
    component: () => import('../views/PpoVariantDetailV1View.vue'),
    label: 'Variant V1 Detail V1',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'ppo-v1-variant-detail-v2',
    component: () => import('../views/PpoVariantDetailV1View.vue'),
    label: 'Variant V1 Detail V2',
    status: 'active',
    section: null,
    hideLogo: true,
  },
]

// Templates
const templateViews = [
  {
    id: 'templates-v1',
    component: () => import('../views/TemplatesViewV1.vue'),
    label: 'Templates V1',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
  {
    id: 'templates-v2',
    component: () => import('../views/TemplatesViewV2.vue'),
    label: 'Templates',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'templates-v2-essential-theme',
    component: () => import('../views/TemplatesViewV2.vue'),
    label: 'Templates (Essential)',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'templates-v2-branding',
    component: () => import('../views/TemplatesV2BrandingView.vue'),
    label: 'Templates Branding',
    status: 'active',
    section: null,
    hideLogo: true,
  },
  {
    id: 'templates-v3',
    component: () => import('../views/TemplatesViewV3.vue'),
    label: 'Templates V3',
    status: 'archived',
    section: null,
    hideLogo: true,
  },
]

// Image with Badge
const imageViews = [
  {
    id: 'image-with-badge',
    component: () => import('../views/ImageWithBadgeView.vue'),
    label: 'Image Badge V1',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'image-with-badge',
    refName: 'imageWithBadgeRef',
    nav: { sessionReset: true, flowSelected: true, registrationType: 'image-with-badge' },
  },
  {
    id: 'image-with-badge-v2',
    component: () => import('../views/ImageWithBadgeV2View.vue'),
    label: 'Image Badge V2',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'image-with-badge-v2',
    refName: 'imageWithBadgeRef',
    nav: { sessionReset: true, flowSelected: true, registrationType: 'image-with-badge' },
  },
  {
    id: 'image-with-badge-v3',
    component: () => import('../views/ImageWithBadgeV3View.vue'),
    label: 'Image Badge V3',
    status: 'active',
    section: null,
    hideLogo: true,
    keyPrefix: 'image-with-badge-v3',
    refName: 'imageWithBadgeRef',
    nav: { sessionReset: true, flowSelected: true, registrationType: 'image-with-badge' },
  },
]

// AI Content (standalone, not in settings)
const aiContentViews = [
  ...generateAiSubViews(
    'ai-texts-images',
    () => import('../views/AiTextsImagesView.vue'),
    'AI Texts & Images',
    'aiContent',
  ),
  ...generateAiSubViews(
    'ai-texts-images-v2',
    () => import('../views/AiTextsImagesV2View.vue'),
    'AI Texts & Images V2',
    'aiContent',
  ),
]

// Settings AI sub-views
const settingsAiViews = [
  ...generateSettingsAiSubViews('settings-ai-texts-images'),
  ...generateSettingsAiSubViews('settings-ai-texts-images-v1'),
  ...generateSettingsAiSubViews('settings-ai-texts-images-v2'),
]

// ============================================================================
// Combined export
// ============================================================================
export const viewDefinitions = [
  ...systemViews,
  ...registrationViews,
  ...homeViews,
  ...wizardViews,
  ...campaignViews,
  ...analyticsViews,
  ...ppoViews,
  ...ppoV1Views,
  ...templateViews,
  ...imageViews,
  ...aiContentViews,
  ...settingsAiViews,
]
