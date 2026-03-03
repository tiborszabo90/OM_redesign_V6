<template>
  <label :class="['flex items-center gap-2', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']">
    <input
      type="radio"
      :value="value"
      :checked="modelValue === value"
      :disabled="disabled"
      @change="$emit('update:modelValue', value)"
      :class="['custom-radio', disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
    />
    <span v-if="label" class="text-sm text-om-gray-700">{{ label }}</span>
    <slot />
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  value: {
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #D5D8DD;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  position: relative;
  background-color: white;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.custom-radio:checked {
  border-color: #ED5A29;
  background-color: white;
}

.custom-radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ED5A29;
}

.custom-radio:hover:not(:disabled) {
  border-color: #C44D24;
}

.custom-radio:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(237, 90, 41, 0.1);
}
</style>
