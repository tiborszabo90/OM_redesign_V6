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
      :start-at-recommendation-v3="props.startAtRecommendationV3"
      :start-at-recommendation-v4="props.startAtRecommendationV4"
      :start-at-recommendation-v5="props.startAtRecommendationV5"
      :show-chat="!props.noChat"
      @task-created="(task) => emit('task-created', task)"
      @navigate-to="(view) => emit('navigate-to', view)"
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
  },
  startAtRecommendationV3: {
    type: Boolean,
    default: false
  },
  startAtRecommendationV4: {
    type: Boolean,
    default: false
  },
  startAtRecommendationV5: {
    type: Boolean,
    default: false
  },
  noChat: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['task-created', 'navigate-to'])

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
