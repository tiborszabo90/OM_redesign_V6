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

      <!-- Archive Dropdown -->
      <div class="relative">
        <button
          @click="archiveDropdownOpen = !archiveDropdownOpen"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
            archiveViews.includes(currentView)
              ? 'bg-[#ED5A29] text-white'
              : 'bg-[#505763] hover:bg-[#8F97A4]'
          ]"
        >
          Archive
          <ChevronUp :size="12" :class="{ 'rotate-180': archiveDropdownOpen }" />
        </button>
        <transition name="fade">
          <div
            v-if="archiveDropdownOpen"
            class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-40"
          >
            <div v-if="archiveItems.length === 0" class="px-4 py-3 text-sm text-[#8F97A4] italic">
              No archived items
            </div>
            <button
              v-for="item in archiveItems"
              :key="item.view"
              @click="selectArchive(item.view)"
              :class="[
                'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                currentView === item.view
                  ? 'bg-[#ED5A29] text-white'
                  : 'hover:bg-[#505763]'
              ]"
            >
              {{ item.label }}
            </button>
          </div>
        </transition>
      </div>

      <!-- Flow type indicator -->
      <span v-if="flowSelected" class="text-xs text-[#8F97A4] capitalize">
        {{ registrationType }}:
      </span>

      <template v-if="flowSelected">
        <!-- Public Wizard flow -->
        <template v-if="registrationType === 'public-wizard'">
          <button
            @click="$emit('navigate', 'public-wizard-url')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              publicWizardStep === 'url'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            URL Input
          </button>

          <button
            @click="$emit('navigate', 'public-wizard-chat')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              publicWizardStep === 'chat'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Goal Input
          </button>

          <button
            @click="$emit('navigate', 'wizard-analysis')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              publicWizardStep === 'wizard-analysis'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Analysis
          </button>

          <button
            @click="$emit('navigate', 'wizard-style')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              publicWizardStep === 'wizard-style'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Style
          </button>

          <button
            @click="$emit('navigate', 'wizard-quicktune')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              publicWizardStep === 'wizard-quicktune'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Quicktune
          </button>

          <button
            @click="$emit('navigate', 'wizard-recommendation-v4')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              publicWizardStep === 'wizard-recommendation-v4'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Recommendation
          </button>

          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Wizard flow -->
        <template v-else-if="registrationType === 'wizard'">
          <button
            @click="$emit('navigate', 'wizard-analysis')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              wizardFlowStep === 'wizard-analysis'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Analysis
          </button>

          <button
            @click="$emit('navigate', 'wizard-style')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              wizardFlowStep === 'wizard-style'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Style
          </button>

          <button
            @click="$emit('navigate', 'wizard-quicktune')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              wizardFlowStep === 'wizard-quicktune'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Quicktune
          </button>

          <button
            @click="$emit('navigate', 'wizard-recommendation-v4')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              wizardFlowStep === 'wizard-recommendation-v4'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Recommendation
          </button>

          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Image with Badge flow -->
        <template v-else-if="registrationType === 'image-with-badge'">
          <!-- Image with Badge Dropdown -->
          <div class="relative">
            <button
              @click="imageWithBadgeDropdownOpen = !imageWithBadgeDropdownOpen"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
                ['image-with-badge', 'image-with-badge-v2', 'image-with-badge-v3'].includes(currentView)
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              Image with Badge
              <ChevronUp :size="12" :class="{ 'rotate-180': imageWithBadgeDropdownOpen }" />
            </button>
            <transition name="fade">
              <div
                v-if="imageWithBadgeDropdownOpen"
                class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-32"
              >
                <button
                  @click="selectImageWithBadge('image-with-badge')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'image-with-badge'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V1
                </button>
                <button
                  @click="selectImageWithBadge('image-with-badge-v2')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'image-with-badge-v2'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V2
                </button>
                <button
                  @click="selectImageWithBadge('image-with-badge-v3')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'image-with-badge-v3'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  V3
                </button>
              </div>
            </transition>
          </div>

          <!-- Image with Badge steps -->
          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Steps:</span>
            <button
              v-for="step in (currentView === 'image-with-badge-v2' ? 2 : currentView === 'image-with-badge' ? 7 : 3)"
              :key="step"
              @click="$emit('go-to-image-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                ['image-with-badge', 'image-with-badge-v2', 'image-with-badge-v3'].includes(currentView) && currentImageStep === step
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              {{ step }}
            </button>
          </div>

          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Email/Shopify flow with onboarding + wizard -->
        <template v-else>
          <!-- Registration button only for email flow -->
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

          <!-- Onboarding steps -->
          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Onboarding:</span>
            <button
              v-for="step in onboardingStepsCount"
              :key="step"
              @click="$emit('go-to-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                currentView === 'onboarding' && currentStep === step
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              {{ step }}
            </button>
          </div>

          <span class="text-[#505763] mx-1">|</span>
        </template>

        <template v-if="registrationType !== 'image-with-badge' && registrationType !== 'public-wizard' && registrationType !== 'wizard'">
          <!-- Home Dropdown -->
          <div class="relative">
            <button
              @click="homeDropdownOpen = !homeDropdownOpen"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
                ['home-old', 'home-with-review', 'home-onboarding', 'home-onboarding-with-reco'].includes(currentView)
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              Home
              <ChevronUp :size="12" :class="{ 'rotate-180': homeDropdownOpen }" />
            </button>
            <transition name="fade">
              <div
                v-if="homeDropdownOpen"
                class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-40"
              >
                <button
                  @click="selectHome('home-old')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'home-old'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  Home with Active Campaigns
                </button>
                <button
                  @click="selectHome('home-with-review')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'home-with-review'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  Home with Review
                </button>
                <button
                  @click="selectHome('home-onboarding')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'home-onboarding'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  Home Onboarding
                </button>
                <button
                  @click="selectHome('home-onboarding-with-reco')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'home-onboarding-with-reco'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  Home Onboarding with Reco
                </button>
              </div>
            </transition>
          </div>

          <!-- Campaigns List Dropdown -->
          <div class="relative">
            <button
              @click="campaignsDropdownOpen = !campaignsDropdownOpen"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
                ['campaigns-v3', 'campaigns-empty'].includes(currentView)
                  ? 'bg-[#ED5A29] text-white'
                  : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >
              Campaigns List
              <ChevronUp :size="12" :class="{ 'rotate-180': campaignsDropdownOpen }" />
            </button>
            <transition name="fade">
              <div
                v-if="campaignsDropdownOpen"
                class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-40"
              >
                <button
                  @click="selectCampaigns('campaigns-v3')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'campaigns-v3'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  With Campaigns
                </button>
                <button
                  @click="selectCampaigns('campaigns-empty')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'campaigns-empty'
                      ? 'bg-[#ED5A29] text-white'
                      : 'hover:bg-[#505763]'
                  ]"
                >
                  Empty State
                </button>
              </div>
            </transition>
          </div>

          <!-- Campaign Page Dropdown -->
          <div class="relative">
            <button
              @click="campaignPageDropdownOpen = !campaignPageDropdownOpen"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
                ['campaign-page-v1', 'campaign-page-with-review'].includes(currentView)
                  ? 'bg-om-orange-500 text-white'
                  : 'bg-om-gray-600 hover:bg-om-gray-500'
              ]"
            >
              Campaign Page
              <ChevronUp :size="12" :class="{ 'rotate-180': campaignPageDropdownOpen }" />
            </button>
            <transition name="fade">
              <div
                v-if="campaignPageDropdownOpen"
                class="absolute bottom-full left-0 mb-2 bg-om-gray-700 border border-om-gray-600 rounded-lg shadow-lg overflow-hidden min-w-40"
              >
                <button
                  @click="selectCampaignPage('campaign-page-v1')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'campaign-page-v1'
                      ? 'bg-om-orange-500 text-white'
                      : 'hover:bg-om-gray-600'
                  ]"
                >
                  Campaign Page
                </button>
                <button
                  @click="selectCampaignPage('campaign-page-with-review')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'campaign-page-with-review'
                      ? 'bg-om-orange-500 text-white'
                      : 'hover:bg-om-gray-600'
                  ]"
                >
                  With Review
                </button>
              </div>
            </transition>
          </div>

          <!-- Analytics Dropdown -->
          <div class="relative">
            <button
              @click="analyticsDropdownOpen = !analyticsDropdownOpen"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
                ['analytics-v3', 'analytics-empty'].includes(currentView)
                  ? 'bg-om-orange-500 text-white'
                  : 'bg-om-gray-600 hover:bg-om-gray-500'
              ]"
            >
              Analytics
              <ChevronUp :size="12" :class="{ 'rotate-180': analyticsDropdownOpen }" />
            </button>
            <transition name="fade">
              <div
                v-if="analyticsDropdownOpen"
                class="absolute bottom-full left-0 mb-2 bg-om-gray-700 border border-om-gray-600 rounded-lg shadow-lg overflow-hidden min-w-40"
              >
                <button
                  @click="selectAnalytics('analytics-v3')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'analytics-v3'
                      ? 'bg-om-orange-500 text-white'
                      : 'hover:bg-om-gray-600'
                  ]"
                >
                  With Data
                </button>
                <button
                  @click="selectAnalytics('analytics-empty')"
                  :class="[
                    'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
                    currentView === 'analytics-empty'
                      ? 'bg-om-orange-500 text-white'
                      : 'hover:bg-om-gray-600'
                  ]"
                >
                  Empty State
                </button>
              </div>
            </transition>
          </div>

          <!-- Templates Button -->
          <button
            @click="$emit('navigate', 'templates-v3')"
            :class="[
              'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
              currentView === 'templates-v3'
                ? 'bg-[#ED5A29] text-white'
                : 'bg-[#505763] hover:bg-[#8F97A4]'
            ]"
          >
            Templates
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
      </template>

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
  currentImageStep: {
    type: Number,
    default: 1
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
  },
  publicWizardStep: {
    type: String,
    default: 'url'
  },
  wizardFlowStep: {
    type: String,
    default: 'url'
  }
})

const emit = defineEmits(['navigate', 'go-to-step', 'go-to-image-step', 'go-to-task-phase', 'select-flow', 'update:isOpen'])

// Onboarding steps count - same for both Email and Shopify
// 4 steps: Welcome, ReferralSource, Relationship, UseCase
const onboardingStepsCount = computed(() => {
  return 4
})

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
const imageWithBadgeDropdownOpen = ref(false)
const archiveDropdownOpen = ref(false)
const homeDropdownOpen = ref(false)
const campaignsDropdownOpen = ref(false)

// Archive items - add views here that you want to archive
const archiveItems = ref([
  { view: 'home-old-v2', label: 'Home Old' },
  { view: 'home-chat-versions', label: 'Chat Versions' },
  { view: 'home-chat-left', label: 'Chat Left' },
  { view: 'task-creation', label: 'Home Agentic' },
  { view: 'analytics-v1', label: 'Analytics V1' },
  { view: 'analytics-v2', label: 'Analytics V2' },
  { view: 'templates-v1', label: 'Templates V1' },
  { view: 'templates-v2', label: 'Templates V2' },
  { view: 'wizard-recommendation', label: 'Recommendation V1' },
  { view: 'wizard-recommendation-v2', label: 'Recommendation V2' },
  { view: 'wizard-recommendation-v3', label: 'Recommendation V3' },
  { view: 'wizard-recommendation-v5', label: 'Recommendation V5' },
  { view: 'wizard-analysis', label: 'Wizard Flow' },
  { view: 'wizard-analysis-no-chat', label: 'Wizard Flow (no chat)' },
  { view: 'settings-ai-texts-images-v1', label: 'AI Texts & Images V1' },
])

const archiveViews = computed(() => archiveItems.value.map(item => item.view))

const selectArchive = (view) => {
  emit('navigate', view)
  archiveDropdownOpen.value = false
}


const selectHome = (view) => {
  emit('navigate', view)
  homeDropdownOpen.value = false
}

const selectCampaigns = (view) => {
  emit('navigate', view)
  campaignsDropdownOpen.value = false
}

const campaignPageDropdownOpen = ref(false)

const selectCampaignPage = (view) => {
  emit('navigate', view)
  campaignPageDropdownOpen.value = false
}

const analyticsDropdownOpen = ref(false)

const selectAnalytics = (view) => {
  emit('navigate', view)
  analyticsDropdownOpen.value = false
}

const selectImageWithBadge = (view) => {
  emit('navigate', view)
  imageWithBadgeDropdownOpen.value = false
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
