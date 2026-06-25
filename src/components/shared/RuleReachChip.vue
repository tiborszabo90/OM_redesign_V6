<template>
  <Tag v-if="measured" :variant="strongest ? 'orange' : 'gray'" class="shrink-0">
    <template v-if="strongest" #icon><Filter :size="12" /></template>
    {{ strongest ? `Biggest filter · keeps ${keptPercent}%` : `Keeps ${keptPercent}%` }}
  </Tag>
  <Tag v-else variant="gray-muted" class="shrink-0">Not measured</Tag>
</template>

<script setup>
import { Filter } from 'lucide-vue-next'
import Tag from './Tag.vue'

defineProps({
  // whether we have 7-day data to estimate this rule's reach
  measured: { type: Boolean, default: false },
  // share of traffic this rule keeps (0–100)
  keptPercent: { type: Number, default: 0 },
  // true for the rule that narrows traffic the most
  strongest: { type: Boolean, default: false },
})
</script>
