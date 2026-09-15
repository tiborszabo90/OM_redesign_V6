<script setup>
import { BRAND } from '../tokens'

const props = defineProps({
  selected: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button
    type="button"
    :disabled="props.disabled"
    class="flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors"
    :class="{ 'cursor-not-allowed opacity-50': props.disabled }"
    :style="{
      borderColor: props.selected ? BRAND.blue : BRAND.gray200,
      background: props.selected ? BRAND.blueSoft : BRAND.surface,
    }"
  >
    <slot name="icon" />
    <span class="min-w-0">
      <span class="block text-sm font-semibold" :style="{ color: BRAND.ink }">{{ props.title }}</span>
      <span v-if="props.description" class="mt-0.5 block text-xs leading-relaxed" :style="{ color: BRAND.gray500 }">
        {{ props.description }}
      </span>
    </span>
  </button>
</template>
