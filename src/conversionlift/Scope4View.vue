<template>
  <ClFlowShell title="" :steps="[]" :current="0" :back="false" @exit="$emit('navigate', 'conversionlift')">
    <CLScopeStep @next="$emit('navigate', 'conversionlift')" />
  </ClFlowShell>
</template>

<script setup>
import ClFlowShell from './components/ClFlowShell.vue'
import CLScopeStep from './components/CLScopeStep.vue'

defineEmits(['navigate'])
</script>
