<template>
  <div class="oc-font w-full">
    <label v-if="label" class="block text-sm font-medium text-[var(--oc-neutral-700)] mb-1.5">
      {{ label }}
      <span v-if="required" class="text-[var(--oc-danger)]">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="mt-1.5 text-xs text-[var(--oc-danger)]">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-[var(--oc-text-muted)]">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
  const base = 'w-full h-10 px-3 text-sm rounded-[10px] bg-white text-[var(--oc-text)] placeholder:text-[var(--oc-neutral-400)] transition-all focus:outline-none'
  const state = props.error
    ? 'border border-[var(--oc-danger)] focus:ring-2 focus:ring-[var(--oc-danger-soft)]'
    : 'border border-[var(--oc-border)] focus:border-[var(--oc-primary-400)] focus:ring-2 focus:ring-[var(--oc-primary-100)]'
  const disabled = props.disabled ? 'bg-[var(--oc-neutral-100)] text-[var(--oc-neutral-400)] cursor-not-allowed' : ''
  return `${base} ${state} ${disabled}`
})
</script>
