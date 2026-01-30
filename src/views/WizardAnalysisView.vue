<template>
  <div class="h-screen-safe bg-white flex overflow-auto relative">
    <StepWizardDashboard
      ref="stepWizardDashboardRef"
      v-model="formData"
      :data="formData"
      :registration-data="props.registrationData"
      :initial-message="props.initialMessage"
      :start-at-style="props.startAtStyle"
      :start-at-quicktune="props.startAtQuicktune"
      :start-at-recommendation="props.startAtRecommendation"
      :start-at-recommendation-v2="props.startAtRecommendationV2"
      @task-created="(task) => emit('task-created', task)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepWizardDashboard from '../components/onboarding/StepWizardDashboard.vue'

const props = defineProps({
  registrationData: {
    type: Object,
    default: null
  },
  initialMessage: {
    type: String,
    default: ''
  },
  startAtStyle: {
    type: Boolean,
    default: false
  },
  startAtQuicktune: {
    type: Boolean,
    default: false
  },
  startAtRecommendation: {
    type: Boolean,
    default: false
  },
  startAtRecommendationV2: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['task-created'])

const stepWizardDashboardRef = ref(null)
const formData = ref({})

// Expose ref for external navigation
defineExpose({
  stepWizardDashboardRef,
  resetToPhase: (phase) => {
    if (stepWizardDashboardRef.value && stepWizardDashboardRef.value.resetToPhase) {
      stepWizardDashboardRef.value.resetToPhase(phase)
    }
  }
})
</script>
