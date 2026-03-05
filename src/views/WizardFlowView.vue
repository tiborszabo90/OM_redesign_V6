<template>
  <DashboardLayout no-content-padding background-color="#FFFFFF" :hide-sidebar="!isRecommendationPhase" @menu-click="handleMenuClick">
    <template #content>
      <div class="relative w-full h-full">
        <PublicStepWizardDashboard
          ref="stepWizardDashboardRef"
          :data="formData"
          :registration-data="props.registrationData"
          :initial-message="'Demo website analysis'"
          :show-chat="false"
          :hide-registration-modal="true"
          @task-created="(task) => emit('task-created', task)"
          @navigate-to="(view) => emit('navigate-to', view)"
          @phase-changed="(view) => { currentPhase.value = view; emit('phase-changed', view) }"
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
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import PublicStepWizardDashboard from '../components/onboarding/PublicStepWizardDashboard.vue'
import Button from '../components/shared/Button.vue'

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['task-created', 'navigate-to', 'phase-changed', 'menu-click'])

const stepWizardDashboardRef = ref(null)
const formData = ref({})
const currentPhase = ref('wizard-analysis')
const isRecommendationPhase = computed(() => currentPhase.value.includes('recommendation'))

const handleMenuClick = (menuId) => {
  emit('menu-click', menuId)
}

defineExpose({
  stepWizardDashboardRef,
  navigateToPhase: (phase) => {
    currentPhase.value = phase
    nextTick(() => {
      if (stepWizardDashboardRef.value && stepWizardDashboardRef.value.navigateToPhase) {
        stepWizardDashboardRef.value.navigateToPhase(phase)
      }
    })
  }
})
</script>
