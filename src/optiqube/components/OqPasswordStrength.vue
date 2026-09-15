<script setup>
import { computed } from 'vue'
import { BRAND } from '../tokens'

const props = defineProps({ password: { type: String, default: '' } })

/**
 * A rough stand-in for the product's zxcvbn assessment — enough to drive the four
 * bars and the label, which is what the screen is showing.
 */
const score = computed(() => {
  const p = props.password
  if (!p) return -1
  let s = 0
  if (p.length >= 8) s += 1
  if (p.length >= 12) s += 1
  if (/[^a-zA-Z0-9]/.test(p) && /\d/.test(p)) s += 1
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s += 1
  return Math.min(4, s)
})

const TONES = [BRAND.red, BRAND.red, BRAND.warningText, BRAND.emeraldText, BRAND.emeraldText]
const LABELS = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong']
const HINTS = [
  'Use at least 8 characters',
  'Add length — a few unrelated words work well',
  'Mix in a number or a symbol',
  '',
  '',
]

const tone = computed(() => TONES[Math.max(0, score.value)])
</script>

<template>
  <div v-if="score >= 0" class="mt-2">
    <div class="flex gap-1.5" aria-hidden="true">
      <span
        v-for="i in 4"
        :key="i"
        class="h-1 flex-1 rounded-full transition-colors"
        :style="{ background: i <= score ? tone : BRAND.gray200 }"
      />
    </div>
    <p class="mt-1.5 text-xs leading-relaxed" role="status" :style="{ color: BRAND.gray600 }">
      <span :style="{ color: tone, fontWeight: 600 }">{{ LABELS[score] }}</span>
      <span v-if="HINTS[score]"> — {{ HINTS[score] }}</span>
    </p>
  </div>
</template>
