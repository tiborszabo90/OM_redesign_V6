<script setup>
import { computed } from 'vue'
import { state } from '../store'

// The AI-disclosure label the EU AI Act (Art. 50(4)) asks for, drawn in the
// corner of every generated image exactly as the storefront renders it.
const props = defineProps({
  // Force a look regardless of the saved setting (used by the Settings preview).
  icon: { type: String, default: null },
  text: { type: String, default: null },
  compact: { type: Boolean, default: false },
})

const icon = computed(() => props.icon ?? state.disclosure.icon)
const text = computed(() => (props.text ?? state.disclosure.text).trim())
const wordmark = computed(() => (icon.value === 'ai-generated' ? 'AI GENERATED' : icon.value === 'ai-modified' ? 'AI MODIFIED' : null))
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 bg-black/55 text-white rounded-md backdrop-blur-[2px]"
    :class="compact ? 'px-1 py-0.5' : 'px-2 py-1'"
  >
    <!-- The official set is a disc for the plain mark and a boxed wordmark for
         the two longer ones; both keep the same 1px stroke. -->
    <svg v-if="!wordmark" :width="compact ? 10 : 13" :height="compact ? 10 : 13" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.4" />
      <text x="8" y="11.2" text-anchor="middle" font-size="7.5" font-weight="700" font-family="inherit" fill="currentColor">AI</text>
    </svg>
    <span
      v-else
      class="inline-flex items-center border border-current rounded-[3px] font-bold leading-none"
      :class="compact ? 'px-1 py-[2px] text-[6px]' : 'px-1.5 py-[3px] text-[8px]'"
      style="letter-spacing: .06em"
    >{{ wordmark }}</span>
    <span v-if="text" class="font-semibold leading-none" :class="compact ? 'text-[8px]' : 'text-[11px]'">{{ text }}</span>
  </span>
</template>
