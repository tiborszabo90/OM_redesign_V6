<template>
  <DashboardLayout no-content-padding background-color="#FFFFFF" :hide-sidebar="!isRecommendationPhase" @menu-click="handleMenuClick">
    <template #content>
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
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import PublicStepWizardDashboard from '../components/onboarding/PublicStepWizardDashboard.vue'

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
