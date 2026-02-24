<template>
  <!-- With sidebar (chat version) -->
  <DashboardLayout v-if="!props.noChat" no-content-padding background-color="#FFFFFF" @logo-click="emit('navigate-to', 'task-creation')" @menu-click="emit('menu-click', $event)">
    <template #content>
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
        :show-chat="true"
        @task-created="(task) => emit('task-created', task)"
        @navigate-to="(view) => emit('navigate-to', view)"
        @phase-changed="(view) => emit('phase-changed', view)"
      />
    </template>
  </DashboardLayout>

  <!-- Without sidebar (no-chat / archive version) -->
  <div v-else class="h-screen-safe bg-white flex overflow-auto relative">
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
      :show-chat="false"
      @task-created="(task) => emit('task-created', task)"
      @navigate-to="(view) => emit('navigate-to', view)"
      @phase-changed="(view) => emit('phase-changed', view)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepWizardDashboard from '../components/onboarding/StepWizardDashboard.vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'

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

const emit = defineEmits(['task-created', 'navigate-to', 'phase-changed', 'menu-click'])

const stepWizardDashboardRef = ref(null)
const formData = ref({})

// Expose ref for external navigation
defineExpose({
  stepWizardDashboardRef,
  navigateToPhase: (phase) => {
    if (stepWizardDashboardRef.value && stepWizardDashboardRef.value.navigateToPhase) {
      stepWizardDashboardRef.value.navigateToPhase(phase)
    }
  }
})
</script>
