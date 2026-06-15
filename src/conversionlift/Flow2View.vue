<template>
  <ClFlowShell
    title="Flow B · Type-first"
    :steps="['Site', 'Library', 'Place & refine', 'Preview']"
    :current="step"
    @exit="$emit('navigate', 'conversionlift')"
  >
    <CLAddDomainStep v-if="step === 0" :key="'site'" cta-label="Continue" @done="step = 1" />
    <CLBlockLibraryStep v-else-if="step === 1" :key="'lib'" @select="onLibrary" @back="step = 0" />
    <CLRefineStep v-else-if="step === 2" :key="'refine'" :location="result.location" :content="result.content" :content-type="result.content_type" @next="onRefine" @back="step = 1" />
    <CLPreviewStep v-else :key="'prev'" :items="result.location ? [result] : []" @back="step = 2" @restart="restart" />
  </ClFlowShell>
</template>

<script setup>
import { ref } from 'vue'
import ClFlowShell from './components/ClFlowShell.vue'
import CLAddDomainStep from './components/CLAddDomainStep.vue'
import CLBlockLibraryStep from './components/CLBlockLibraryStep.vue'
import CLRefineStep from './components/CLRefineStep.vue'
import CLPreviewStep from './components/CLPreviewStep.vue'

defineEmits(['navigate'])

const step = ref(0)
const result = ref({ location: '', content_type: '', content: {} })

function onLibrary(r) { result.value = r; step.value = 2 }
function onRefine(r) { result.value = { ...result.value, ...r }; step.value = 3 }
function restart() { result.value = { location: '', content_type: '', content: {} }; step.value = 0 }
</script>
