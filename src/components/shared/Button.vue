<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="iconOnly" class="flex items-center justify-center">
      <slot name="icon"></slot>
    </span>
    <span v-else :class="['flex items-center justify-center', size === 'lg' ? 'gap-2' : 'gap-1.5']">
      <slot name="icon"></slot>
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'

  // Active state for ghost variant (selected/toggled look from campaign-page-v1)
  if (props.active && props.variant === 'ghost') {
    const activeGhost = 'bg-[#FEEFEA] text-[#ED5A29] focus:ring-[#ED5A29]'
    const sizes = props.iconOnly
      ? { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10', lg: 'w-12 h-12 text-lg' }
      : { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' }
    return `${base} ${activeGhost} ${sizes[props.size]}`
  }

  const variantBase = {
    primary: 'bg-[#ED5A29] text-white focus:ring-[#ED5A29]',
    secondary: 'bg-white border border-[#D5D8DD] text-[#505763] focus:ring-[#8F97A4]',
    outline: 'border border-[#D5D8DD] text-[#505763] focus:ring-[#ED5A29]',
    ghost: 'bg-transparent text-[#505763] focus:ring-[#ED5A29]'
  }

  const variantInteractive = {
    primary: 'hover:bg-[#E54D1F] active:bg-[#B33810]',
    secondary: 'hover:bg-[#F9FAFB] active:bg-[#E3E5E8]',
    outline: 'hover:bg-[#F9FAFB] active:bg-[#E3E5E8] active:border-[#B9BEC6]',
    ghost: 'hover:bg-[#505763]/10 active:bg-[#505763]/15'
  }

  const sizes = props.iconOnly
    ? {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10',
        lg: 'w-12 h-12 text-lg'
      }
    : {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 h-10 flex items-center',
        lg: 'px-6 py-3 text-lg'
      }

  if (props.disabled) {
    if (props.variant === 'primary') {
      return `${base} bg-[#E3E5E8] text-[#8F97A4] focus:ring-[#8F97A4] ${sizes[props.size]} cursor-not-allowed`
    }
    return `${base} ${variantBase[props.variant]} ${sizes[props.size]} opacity-50 cursor-not-allowed`
  }

  return `${base} ${variantBase[props.variant]} ${sizes[props.size]} ${variantInteractive[props.variant]}`
})
</script>
