<template>
  <ClFlowShell title="" :steps="[]" :current="0" :back="false" @exit="$emit('navigate', 'conversionlift')">
    <CLGenerateStep @next="$emit('navigate', 'conversionlift')" @leave="$emit('navigate', 'cl-home-b')" />
  </ClFlowShell>
</template>

<script setup>
import ClFlowShell from './components/ClFlowShell.vue'
import CLGenerateStep from './components/CLGenerateStep.vue'

defineEmits(['navigate'])
</script>
