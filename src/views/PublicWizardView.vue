<template>
  <!-- Step 1: URL input -->
  <div v-if="step === 'url'" class="h-screen-safe bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-2xl">
      <!-- Logo -->
      <div class="flex justify-center mb-10">
        <img
          src="/OM-Logo-primary-basic.svg"
          alt="OptiMonk"
          class="h-8"
        />
      </div>

      <!-- Heading -->
      <h1 class="text-4xl font-semibold text-om-gray-700 text-center mb-2">Website optimization magic.</h1>
      <p class="text-om-gray-500 text-center mb-8">Add your website URL and get your tailored optimization ideas in 2 minutes.</p>

      <!-- URL input -->
      <form @submit.prevent="handleUrlSubmit" class="flex flex-col gap-3">
        <div class="flex gap-2">
          <input
            v-model="url"
            type="text"
            placeholder="enter website URL"
            class="flex-1 h-12 px-4 rounded-xl border border-om-gray-200 text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:ring-2 focus:ring-om-orange-400 focus:border-transparent text-sm"
            autofocus
          />
          <button
            type="submit"
            :disabled="!url.trim()"
            class="h-12 px-6 rounded-xl bg-om-orange-500 text-white font-medium text-sm whitespace-nowrap transition-opacity disabled:opacity-40 hover:bg-om-orange-600 cursor-pointer disabled:cursor-not-allowed"
          >
            Get started
          </button>
        </div>
        <p class="text-center text-xs text-om-gray-400">No email address needed.</p>
      </form>
    </div>
  </div>

  <!-- Step 2: Goal input (same layout as home-onboarding-wizard step 1) -->
  <MainLayout v-else-if="step === 'chat'" illustration-bottom-lg>
    <template #content>
      <div class="fixed top-8 left-8 z-50">
        <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-8" />
      </div>
      <StepUseCase
        v-model="formData"
        skip-label="Back to homepage"
        @auto-next="handleUseCaseSubmit"
        @skip-to-dashboard="step = 'url'"
      />
    </template>
    <template #illustration>
      <div class="w-full h-full relative">
        <img src="/bamboo.svg" alt="" class="absolute inset-0 object-contain illus-bamboo" />
        <img src="/monk-shadow.svg" alt="" class="absolute w-2/5 object-contain monk-shadow-pulse illus-shadow" />
        <img src="/monk-medit.2.svg" alt="" class="absolute object-contain monk-float illus-monk" />
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
    </template>
  </MainLayout>

  <!-- Step 3: Wizard -->
  <DashboardLayout v-else no-content-padding background-color="#FFFFFF" hide-sidebar @menu-click="handleMenuClick">
    <template #content>
      <PublicStepWizardDashboard
        ref="stepWizardDashboardRef"
        :data="formData"
        :registration-data="props.registrationData"
        :initial-message="finalMessage"
        :show-chat="false"
        @task-created="(task) => emit('task-created', task)"
        @navigate-to="(view) => emit('navigate-to', view)"
        @phase-changed="(view) => { currentPhase.value = view; emit('phase-changed', view) }"
        @registration-completed="emit('registration-completed')"
      />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import MainLayout from '../components/layouts/MainLayout.vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import PublicStepWizardDashboard from '../components/onboarding/PublicStepWizardDashboard.vue'
import StepUseCase from '../components/onboarding/StepUseCase.vue'

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['task-created', 'navigate-to', 'phase-changed', 'menu-click', 'registration-completed'])

const stepWizardDashboardRef = ref(null)
const formData = ref({})
const currentPhase = ref('wizard-analysis')

const step = ref('url')
const url = ref('')
const finalMessage = ref('')

const handleUrlSubmit = () => {
  if (!url.value.trim()) return
  step.value = 'chat'
}

const handleUseCaseSubmit = () => {
  finalMessage.value = formData.value?.useCase || ''
  step.value = 'wizard'
}

const handleMenuClick = () => {
  stepWizardDashboardRef.value?.openRegistrationModal()
}

defineExpose({
  stepWizardDashboardRef,
  navigateToStep: (s) => { step.value = s },
  navigateToPhase: (phase) => {
    step.value = 'wizard'
    currentPhase.value = phase
    nextTick(() => {
      if (stepWizardDashboardRef.value && stepWizardDashboardRef.value.navigateToPhase) {
        stepWizardDashboardRef.value.navigateToPhase(phase)
      }
    })
  }
})
</script>

<style scoped>
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

@media (max-height: 680px) {
  .illus-bamboo {
    width: 83%;
    height: 83%;
  }
  .illus-monk {
    width: 56%;
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
</style>
