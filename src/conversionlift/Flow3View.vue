<template>
  <ClFlowShell
    title="Flow C · Generate-first"
    :steps="['Site', 'Library', 'Place', 'Preview']"
    :current="step"
    @exit="$emit('navigate', 'conversionlift')"
  >
    <CLAddDomainStep v-if="step === 0" :key="'site'" cta-label="Continue" @done="step = 1" />
    <CLEnhancementLibraryStep v-else-if="step === 1" :key="'lib'" @select="onPick" @back="step = 0" />
    <CLPlacementStep v-else-if="step === 2" :key="'place'" :option="option" :suggested-location="suggestedLoc" @next="onResult" @back="step = 1" />
    <CLPreviewStep v-else :key="'prev'" :items="result.location ? [result] : []" @back="step = 2" @restart="restart" />
  </ClFlowShell>
</template>

<script setup>
import { ref } from 'vue'
import ClFlowShell from './components/ClFlowShell.vue'
import CLAddDomainStep from './components/CLAddDomainStep.vue'
import CLEnhancementLibraryStep from './components/CLEnhancementLibraryStep.vue'
import CLPlacementStep from './components/CLPlacementStep.vue'
import CLPreviewStep from './components/CLPreviewStep.vue'

defineEmits(['navigate'])

const step = ref(0)
const suggestedLoc = ref('')
const option = ref(null)
const result = ref({ location: '', content: {} })

function onPick(p) {
  option.value = { content_type: p.content_type, content: p.content }
  suggestedLoc.value = p.location
  step.value = 2
}
function onResult(r) { result.value = r; step.value = 3 }
function restart() { suggestedLoc.value = ''; option.value = null; result.value = { location: '', content: {} }; step.value = 0 }
</script>
