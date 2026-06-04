<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-[#505763] mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="inputClasses"
    />

    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-[#8F97A4]">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const base = 'w-full px-4 h-10 border rounded-lg focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent transition-colors'
  const errorClass = props.error ? 'border-red-300' : 'border-[#D5D8DD]'
  const disabledClass = props.disabled ? 'bg-[#F1F2F4] cursor-not-allowed' : ''

  return `${base} ${errorClass} ${disabledClass}`
})
</script>
