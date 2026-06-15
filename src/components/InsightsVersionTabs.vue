<template>
  <div class="flex items-center gap-0.5 bg-om-gray-100 rounded-lg p-0.5">
    <a
      v-for="v in versions"
      :key="v.id"
      :href="v.href"
      :class="['px-2.5 py-1 rounded-md text-xs font-medium transition-colors', current === v.id ? 'bg-white text-om-gray-700 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700']"
    >{{ v.label }}</a>
  </div>
</template>

<script setup>
defineProps({ current: { type: String, required: true } })
const versions = [
  { id: 'v1', label: 'Version 1', href: '#/agentic/insights' },
  { id: 'v2', label: 'Version 2', href: '#/agentic/insights-v2' },
  { id: 'v3', label: 'Version 3', href: '#/agentic/insights-v3' },
]
</script>
