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
      <!-- Flow type indicator -->
      <span v-if="flowSelected" class="text-xs text-[#8F97A4] capitalize">
        {{ registrationType }}:
      </span>

      <!-- Flow-specific breadcrumb steps -->
      <template v-if="flowSelected">
        <!-- Public Wizard flow -->
        <template v-if="registrationType === 'public-wizard'">
          <button v-for="step in publicWizardSteps" :key="step.id"
            @click="$emit('navigate', step.id)"
            :class="stepClass(publicWizardStep === step.id)"
          >{{ step.label }}</button>
          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Wizard flow -->
        <template v-else-if="registrationType === 'wizard'">
          <button v-for="step in wizardSteps" :key="step.id"
            @click="$emit('navigate', step.id)"
            :class="stepClass(wizardFlowStep === step.id)"
          >{{ step.label }}</button>
          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Image with Badge flow -->
        <template v-else-if="registrationType === 'image-with-badge'">
          <!-- Version selector dropdown -->
          <div class="relative">
            <button
              @click="sectionDropdownOpen = !sectionDropdownOpen"
              :class="[stepClass(true), 'flex items-center gap-1']"
            >
              Image with Badge
              <ChevronUp :size="12" :class="{ 'rotate-180': sectionDropdownOpen }" />
            </button>
            <transition name="fade">
              <div v-if="sectionDropdownOpen" class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-32">
                <button v-for="item in imageBadgeVersions" :key="item.view"
                  @click="selectSection(item.view)"
                  :class="dropdownItemClass(currentView === item.view)"
                >{{ item.label }}</button>
              </div>
            </transition>
          </div>
          <!-- Steps -->
          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Steps:</span>
            <button
              v-for="step in imageBadgeStepCount"
              :key="step"
              @click="$emit('go-to-image-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                currentImageStep === step ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >{{ step }}</button>
          </div>
          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Email/Shopify flow (only on registration/onboarding/task views) -->
        <template v-else-if="['registration', 'onboarding', 'task-creation'].includes(currentView)">
          <button
            v-if="registrationType === 'email'"
            @click="$emit('navigate', 'registration')"
            :class="stepClass(currentView === 'registration')"
          >Registration</button>
          <!-- Onboarding steps -->
          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Onboarding:</span>
            <button
              v-for="step in 4"
              :key="step"
              @click="$emit('go-to-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                currentView === 'onboarding' && currentStep === step ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >{{ step }}</button>
          </div>
          <span class="text-[#505763] mx-1">|</span>

          <!-- Task phases -->
          <template v-if="createdTasks.length > 0">
            <div class="flex items-center gap-2">
              <span class="text-xs text-[#8F97A4] mr-1">{{ createdTasks[0].message }}:</span>
              <button
                v-for="(task, index) in createdTasks"
                :key="index"
                @click="$emit('go-to-task-phase', task.phase)"
                :class="[
                  'px-3 py-1 text-sm rounded transition-colors cursor-pointer capitalize',
                  currentView === 'task-creation' && currentTaskPhase === task.phase ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
                ]"
              >{{ task.phase }}</button>
            </div>
            <span class="text-[#505763] mx-1">|</span>
          </template>
        </template>
      </template>

      <!-- Context-aware section dropdown (only when current view has variants) -->
      <div v-if="activeSection && activeSection.length > 1" class="relative">
        <button
          @click="sectionDropdownOpen = !sectionDropdownOpen"
          :class="[stepClass(true), 'flex items-center gap-1']"
        >
          {{ activeSectionLabel }}
          <ChevronUp :size="12" :class="{ 'rotate-180': sectionDropdownOpen }" />
        </button>
        <transition name="fade">
          <div v-if="sectionDropdownOpen" class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-48">
            <button v-for="item in activeSection" :key="item.view"
              @click="selectSection(item.view)"
              :class="dropdownItemClass(currentView === item.view)"
            >{{ item.label }}</button>
          </div>
        </transition>
      </div>

      <!-- Archive Dropdown (only when on an archived view) -->
      <div v-if="archiveViews.includes(currentView)" class="relative">
        <button
          @click="archiveDropdownOpen = !archiveDropdownOpen"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
            archiveViews.includes(currentView) ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
          ]"
        >
          Archive
          <ChevronUp :size="12" :class="{ 'rotate-180': archiveDropdownOpen }" />
        </button>
        <transition name="fade">
          <div v-if="archiveDropdownOpen" class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-40 max-h-80 overflow-y-auto">
            <button v-for="item in archiveItems" :key="item.view"
              @click="selectArchive(item.view)"
              :class="dropdownItemClass(currentView === item.view)"
            >{{ item.label }}</button>
          </div>
        </transition>
      </div>

      <!-- Reset button -->
      <button
        @click="$emit('navigate', 'dev-start')"
        class="px-3 py-1 text-sm rounded transition-colors cursor-pointer bg-red-500/80 hover:bg-red-500 text-white"
      >
        Reset
      </button>

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
  currentView: { type: String, required: true },
  currentStep: { type: Number, default: 1 },
  totalSteps: { type: Number, default: 4 },
  currentImageStep: { type: Number, default: 1 },
  createdTasks: { type: Array, default: () => [] },
  currentTaskPhase: { type: String, default: 'analysis' },
  flowSelected: { type: Boolean, default: false },
  registrationType: { type: String, default: 'email' },
  publicWizardStep: { type: String, default: 'url' },
  wizardFlowStep: { type: String, default: 'url' },
})

const emit = defineEmits(['navigate', 'go-to-step', 'go-to-image-step', 'go-to-task-phase', 'select-flow', 'update:isOpen'])

// --- State ---
const isOpen = ref(true)
const sectionDropdownOpen = ref(false)
const archiveDropdownOpen = ref(false)

onMounted(() => { emit('update:isOpen', isOpen.value) })

const toggleOpen = (value) => {
  isOpen.value = value
  emit('update:isOpen', value)
}

// --- Flow step data ---
const publicWizardSteps = [
  { id: 'public-wizard-url', label: 'URL Input' },
  { id: 'public-wizard-chat', label: 'Goal Input' },
  { id: 'wizard-analysis', label: 'Analysis' },
  { id: 'wizard-style', label: 'Style' },
  { id: 'wizard-quicktune', label: 'Quicktune' },
  { id: 'wizard-recommendation-v4', label: 'Recommendation' },
]

const wizardSteps = [
  { id: 'wizard-analysis', label: 'Analysis' },
  { id: 'wizard-style', label: 'Style' },
  { id: 'wizard-quicktune', label: 'Quicktune' },
  { id: 'wizard-recommendation-v4', label: 'Recommendation' },
]

const imageBadgeVersions = [
  { view: 'image-with-badge', label: 'V1' },
  { view: 'image-with-badge-v2', label: 'V2' },
  { view: 'image-with-badge-v3', label: 'V3' },
]

const imageBadgeStepCount = computed(() => {
  if (props.currentView === 'image-with-badge') return 7
  if (props.currentView === 'image-with-badge-v2') return 2
  return 3
})

// --- Section groups (context-aware dropdown) ---
const sectionGroups = {
  home: {
    label: 'Home',
    views: ['home-old', 'home-onboarding', 'home-onboarding-with-reco', 'home-onboarding-review'],
    items: [
      { view: 'home-old', label: 'Home (Active Campaigns)' },
      { view: 'home-onboarding', label: 'Home Onboarding' },
      { view: 'home-onboarding-with-reco', label: 'Home Onboarding + Reco' },
      { view: 'home-onboarding-review', label: 'Home Onboarding Review' },
    ],
  },
  campaigns: {
    label: 'Campaigns',
    views: ['campaigns-v3', 'campaigns-empty'],
    items: [
      { view: 'campaigns-v3', label: 'Campaigns' },
      { view: 'campaigns-empty', label: 'Campaigns (Empty)' },
    ],
  },
  campaignPage: {
    label: 'Campaign Page',
    views: ['campaign-page-v1', 'campaign-page-with-review'],
    items: [
      { view: 'campaign-page-v1', label: 'Campaign Page' },
      { view: 'campaign-page-with-review', label: 'Campaign Page + Review' },
    ],
  },
  analytics: {
    label: 'Analytics',
    views: ['analytics-v4', 'analytics-v4-purchase', 'analytics-v4-add-to-cart', 'analytics-v4-email-capture', 'analytics-v4-phone-capture', 'analytics-empty'],
    items: [
      { view: 'analytics-v4', label: 'Analytics' },
      { view: 'analytics-empty', label: 'Analytics (Empty)' },
    ],
  },
  ppo: {
    label: 'PPO v2',
    views: ['ppo-campaign-detail', 'ppo-campaign-flow', 'ppo-campaign-flow-v2', 'ppo-placement', 'ppo-variant-detail-v1', 'ppo-variant-detail-v2', 'ppo-variable-setup', 'ppo-campaign-setup-preview', 'ppo-generation'],
    items: [
      { view: 'ppo-campaign-detail', label: 'Campaign Detail' },
      { view: 'ppo-campaign-flow', label: 'Campaign Flow' },
      { view: 'ppo-campaign-flow', label: 'Campaign Flow' },
      { view: 'ppo-variable-setup', label: 'Variable Setup' },
      { view: 'ppo-campaign-setup-preview', label: 'Setup Preview' },
      { view: 'ppo-generation', label: 'Generation' },
    ],
  },
  ppoV1: {
    label: 'PPO v1',
    views: ['ppo-v1-campaign-detail', 'ppo-v1-campaign-flow', 'ppo-v1-placement', 'ppo-v1-variant-detail-v1', 'ppo-v1-variant-detail-v2', 'ppo-v1-variable-setup', 'ppo-v1-generation'],
    items: [
      { view: 'ppo-v1-campaign-detail', label: 'Campaign Detail' },
      { view: 'ppo-v1-campaign-flow', label: 'Campaign Flow' },
      { view: 'ppo-v1-variable-setup', label: 'Variable Setup' },
      { view: 'ppo-v1-generation', label: 'Generation' },
    ],
  },
  aiContent: {
    label: 'AI Content',
    views: null, // uses startsWith matching
    items: [
      { view: 'ai-texts-images', label: 'AI Texts & Images V1' },
      { view: 'ai-texts-images-v2', label: 'AI Texts & Images V2' },
    ],
  },
}

const activeSection = computed(() => {
  const view = props.currentView
  if (!view) return null
  for (const group of Object.values(sectionGroups)) {
    if (group.views) {
      if (group.views.includes(view)) return group.items
    } else {
      // startsWith matching for ai-texts-images and settings-ai-texts-images
      if (group.items.some(item => view.startsWith(item.view) || view.startsWith('settings-' + item.view))) return group.items
    }
  }
  return null
})

const activeSectionLabel = computed(() => {
  const view = props.currentView
  if (!view) return ''
  for (const group of Object.values(sectionGroups)) {
    if (group.views) {
      if (group.views.includes(view)) return group.label
    } else {
      if (group.items.some(item => view.startsWith(item.view) || view.startsWith('settings-' + item.view))) return group.label
    }
  }
  return ''
})

// --- Archive ---
const archiveItems = ref([
  { view: 'home-old-v2', label: 'Home Old' },
  { view: 'home-chat-versions', label: 'Chat Versions' },
  { view: 'home-chat-left', label: 'Chat Left' },
  { view: 'task-creation', label: 'Home Agentic' },
  { view: 'analytics-v1', label: 'Analytics V1' },
  { view: 'analytics-v2', label: 'Analytics V2' },
  { view: 'analytics-v3', label: 'Analytics V3' },
  { view: 'templates-v1', label: 'Templates V1' },
  { view: 'templates-v3', label: 'Templates V3' },
  { view: 'wizard-recommendation', label: 'Recommendation V1' },
  { view: 'wizard-recommendation-v2', label: 'Recommendation V2' },
  { view: 'wizard-recommendation-v3', label: 'Recommendation V3' },
  { view: 'wizard-recommendation-v5', label: 'Recommendation V5' },
  { view: 'wizard-analysis', label: 'Wizard Flow' },
  { view: 'wizard-analysis-no-chat', label: 'Wizard Flow (no chat)' },
  { view: 'settings-ai-texts-images-v1', label: 'AI Texts & Images V1' },
  { view: 'registration-v1', label: 'Registration V1' },
  { view: 'registration-v2', label: 'Registration V2' },
  { view: 'ppo-v1-campaign-flow', label: 'PPO V1' },
  { view: 'ppo-campaign-flow-v2', label: 'PPO Campaign Flow (tiles)' },
  { view: 'home-onboarding-v1', label: 'Home Onboarding V1' },
  { view: 'home-onboarding-with-reco-v1', label: 'Home Onboarding + Reco V1' },
  { view: 'home-with-review', label: 'Home (Review)' },
])

const archiveViews = computed(() => archiveItems.value.map(item => item.view))

// --- Helpers ---
const stepClass = (isActive) => [
  'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
  isActive ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
]

const dropdownItemClass = (isActive) => [
  'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
  isActive ? 'bg-[#ED5A29] text-white' : 'hover:bg-[#505763]'
]

const selectSection = (view) => {
  emit('navigate', view)
  sectionDropdownOpen.value = false
}

const selectArchive = (view) => {
  emit('navigate', view)
  archiveDropdownOpen.value = false
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
