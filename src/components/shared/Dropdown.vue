<template>
  <div class="relative" ref="dropdownRef">
    <button
      type="button"
      @click="isOpen = !isOpen"
      :class="[
        'dropdown-select w-full text-sm text-[#23262A] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer bg-white text-left transition-colors border border-om-gray-200',
        hasIcon ? 'pl-9 pr-8 py-2 rounded-lg' : '',
        !hasIcon && size === 'default' ? 'px-4 pr-8 py-2.5 rounded-lg' : '',
        !hasIcon && size === 'sm' ? 'px-3 pr-8 py-1.5 rounded-lg' : '',
        isOpen ? 'border-om-orange-300' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'
      ]"
      :style="buttonStyle"
    >
      <slot name="selected" :option="selectedOption" :label="displayLabel">
        {{ displayLabel }}
      </slot>
    </button>

    <!-- Icon slot positioned absolutely -->
    <div v-if="hasIcon" class="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
      <slot name="icon" />
    </div>

    <!-- Chevron -->
    <div :class="['absolute inset-y-0 flex items-center pointer-events-none', size === 'sm' ? 'right-2.5' : 'right-3']">
      <ChevronDown
        :size="size === 'sm' ? 16 : 20"
        class="text-om-gray-600 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <!-- Dropdown menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="[
          'absolute z-10 w-full bg-white border border-[#D5D8DD] shadow-lg overflow-hidden',
          'mt-0 rounded-lg'
        ]"
      >
        <button
          v-for="option in normalizedOptions"
          :key="option.value"
          @click="select(option)"
          :class="[
            'w-full text-left text-sm text-[#23262A] hover:bg-[#F9FAFB] transition-colors cursor-pointer focus:outline-none focus:ring-0 focus:shadow-none active:bg-[#F9FAFB]',
            size === 'sm' && !hasIcon ? 'px-3 py-1.5' : 'px-4 py-2',
            isOptionSelected(option) ? 'bg-[#F1F2F4] font-medium' : ''
          ]"
          style="box-shadow: none !important; outline: none !important;"
        >
          <span class="flex items-center justify-between w-full">
            <slot name="option" :option="option" :selected="isOptionSelected(option)">
              <span>{{ option.label }}</span>
            </slot>
            <Check v-if="isOptionSelected(option)" :size="16" class="text-om-gray-500 shrink-0" />
          </span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, useSlots, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  size: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'sm'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()
const dropdownRef = ref(null)
const isOpen = ref(false)

const hasIcon = computed(() => !!slots.icon)

const isObjectOptions = computed(() => {
  return props.options.length > 0 && typeof props.options[0] === 'object'
})

const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })
})

const currentValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return null
  if (typeof props.modelValue === 'object') return props.modelValue.value
  return props.modelValue
})

const selectedOption = computed(() => {
  if (currentValue.value === null || currentValue.value === undefined) return null
  return normalizedOptions.value.find(opt => opt.value === currentValue.value) || null
})

const displayLabel = computed(() => {
  return selectedOption.value ? selectedOption.value.label : props.placeholder
})

const isOptionSelected = (option) => {
  return option.value === currentValue.value
}

const buttonStyle = computed(() => {
  if (isOpen.value) {
    return 'box-shadow: 0 0 0 2px #FBD9CE; outline: none;'
  }
  return 'box-shadow: none; outline: none;'
})

const select = (option) => {
  if (isObjectOptions.value) {
    emit('update:modelValue', option)
  } else {
    emit('update:modelValue', option.value)
  }
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
