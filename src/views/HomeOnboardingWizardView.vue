<template>
  <!-- Step 1: Use case input (same layout as last onboarding step, no stepper) -->
  <MainLayout v-if="step === 'chat'" illustration-bottom-lg>
    <template #content>
      <div class="fixed top-8 left-8 z-50 cursor-pointer" @click="emit('menu-click', 'home-onboarding')">
        <img src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg" alt="OptiMonk" class="h-8" />
      </div>
      <StepUseCase
        v-model="formData"
        skip-label="Back to homepage"
        @auto-next="handleUseCaseSubmit"
        @skip-to-dashboard="emit('menu-click', 'home-onboarding')"
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
        <!-- ThumbsUp – bottom left -->
        <div class="logo-card logo-card-3 absolute" style="bottom: 28%; left: 10%; width: 72px; height: 72px;">
          <svg viewBox="0 0 24 24" class="h-10 w-10" fill="none" stroke="#ED5A29" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>
            <path d="M7 10v12"/>
          </svg>
        </div>
      </div>
    </template>
  </MainLayout>

  <!-- Step 2: Wizard -->
  <DashboardLayout v-else-if="step === 'wizard'" no-content-padding background-color="#FFFFFF" :hide-sidebar="!isRecommendationPhase" @menu-click="handleMenuClick">
    <template #content>
      <div class="relative w-full h-full">
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
      <div v-if="!isRecommendationPhase" class="fixed top-6 right-4 z-50">
        <Button variant="ghost" size="sm" @click="emit('menu-click', 'home-onboarding')">Skip to homepage</Button>
      </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import MainLayout from '../components/layouts/MainLayout.vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import PublicStepWizardDashboard from '../components/onboarding/PublicStepWizardDashboard.vue'
import StepUseCase from '../components/onboarding/StepUseCase.vue'
import Button from '../components/shared/Button.vue'

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
const isRecommendationPhase = computed(() => currentPhase.value.includes('recommendation'))

const step = ref('chat')
const finalMessage = ref('')

const handleUseCaseSubmit = () => {
  finalMessage.value = formData.value?.useCase || ''
  step.value = 'wizard'
}

const handleMenuClick = (menuId) => {
  emit('menu-click', menuId)
}

defineExpose({
  stepWizardDashboardRef,
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
