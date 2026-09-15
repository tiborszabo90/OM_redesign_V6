<script setup>
import { computed } from 'vue'
import { BRAND } from '../tokens'

const props = defineProps({ status: { type: String, required: true } })

const styles = {
  active: { bg: BRAND.successSoft, color: BRAND.emeraldText, showDot: true },
  draft: { bg: BRAND.gray100, color: BRAND.gray600, showDot: false },
  paused: { bg: BRAND.warningSoft, color: BRAND.warningText, showDot: false },
  archived: { bg: BRAND.gray100, color: BRAND.gray500, showDot: false },
}

const s = computed(() => styles[props.status] || styles.draft)
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize"
    :style="{ background: s.bg, color: s.color }"
  >
    <span v-if="s.showDot" class="size-1.5 rounded-full" :style="{ background: BRAND.emerald }" />
    {{ props.status }}
  </span>
</template>
