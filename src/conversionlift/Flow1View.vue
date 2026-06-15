<template>
  <ClFlowShell
    title="Flow A · Assistant-led"
    :steps="['Site', 'Optimize', 'Preview']"
    :current="step"
    @exit="$emit('navigate', 'conversionlift')"
  >
    <CLAddDomainStep v-if="step === 0" :key="'site'" cta-label="Analyze" @done="step = 1" />
    <CLOptimizeStep v-else-if="step === 1" :key="'opt'" @next="onResult" @back="step = 0" />
    <CLPreviewStep v-else :key="'prev'" :items="items" @back="step = 1" @restart="restart" />
  </ClFlowShell>
</template>

<script setup>
import { ref } from 'vue'
import ClFlowShell from './components/ClFlowShell.vue'
import CLAddDomainStep from './components/CLAddDomainStep.vue'
import CLOptimizeStep from './components/CLOptimizeStep.vue'
import CLPreviewStep from './components/CLPreviewStep.vue'

defineEmits(['navigate'])

const step = ref(0)
const items = ref([]) // applied enhancements: [{ location, content_type, content }]

function onResult(arr) { items.value = arr; step.value = 2 }
function restart() { items.value = []; step.value = 0 }
</script>
