<template>
  <ClFlowShell title="" :steps="[]" :current="0" :back="false" @exit="$emit('navigate', 'conversionlift')">
    <CLAudienceStep @next="$emit('navigate', 'conversionlift')" />
  </ClFlowShell>
</template>

<script setup>
import ClFlowShell from './components/ClFlowShell.vue'
import CLAudienceStep from './components/CLAudienceStep.vue'

defineEmits(['navigate'])
</script>
