<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <StepDashboard
        ref="stepDashboardRef"
        v-model="formData"
        :data="formData"
        :registration-data="props.registrationData"
        :initial-message="props.initialMessage"
        @task-created="(task) => emit('task-created', task)"
        @navigate-to="(view, message) => emit('navigate-to', view, message)"
      />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import StepDashboard from '../components/onboarding/StepDashboard.vue'

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  },
  initialMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['task-created', 'menu-click', 'navigate-to'])

const stepDashboardRef = ref(null)
const formData = ref({})

const handleLogoClick = () => {
  // Reset dashboard to initial state
  if (stepDashboardRef.value && stepDashboardRef.value.resetToInitial) {
    stepDashboardRef.value.resetToInitial()
  }
}

// Expose ref for external navigation
defineExpose({
  stepDashboardRef,
  resetToPhase: (phase) => {
    if (stepDashboardRef.value && stepDashboardRef.value.resetToPhase) {
      stepDashboardRef.value.resetToPhase(phase)
    }
  }
})
</script>
