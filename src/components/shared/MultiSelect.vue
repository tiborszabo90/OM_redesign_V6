<template>
  <div class="relative" ref="dropdownRef">
    <button
      type="button"
      @click="isOpen = !isOpen"
      :class="[
        'dropdown-select w-full text-sm text-[#23262A] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer bg-white text-left transition-colors border border-om-gray-200',
        size === 'default' ? 'px-4 pr-8 py-2.5 rounded-lg' : '',
        size === 'sm' ? 'px-3 pr-8 py-1.5 rounded-lg' : '',
        isOpen ? 'border-om-orange-300' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'
      ]"
      :style="buttonStyle"
    >
      {{ displayLabel }}
    </button>

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
        class="absolute z-10 w-full bg-white border border-[#D5D8DD] shadow-lg overflow-hidden mt-0 rounded-lg"
      >
        <button
          v-for="option in normalizedOptions"
          :key="option.value"
          @click="toggle(option)"
          :class="[
            'w-full text-left text-sm text-[#23262A] hover:bg-[#F9FAFB] transition-colors cursor-pointer focus:outline-none focus:ring-0 focus:shadow-none active:bg-[#F9FAFB]',
            size === 'sm' ? 'px-3 py-1.5' : 'px-4 py-2',
            isOptionSelected(option) ? 'bg-[#F1F2F4] font-medium' : ''
          ]"
          style="box-shadow: none !important; outline: none !important;"
        >
          <span class="flex items-center justify-between w-full">
            <span>{{ option.label }}</span>
            <Check v-if="isOptionSelected(option)" :size="16" class="text-om-gray-500 shrink-0" />
          </span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select'
  },
  size: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'sm'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue'])

const dropdownRef = ref(null)
const isOpen = ref(false)

const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt }
    }
    return opt
  })
})

const displayLabel = computed(() => {
  const count = props.modelValue.length
  if (count === 0) return props.placeholder
  return `${count} selected`
})

const isOptionSelected = (option) => {
  return props.modelValue.includes(option.value)
}

const buttonStyle = computed(() => {
  if (isOpen.value) {
    return 'box-shadow: 0 0 0 2px #FBD9CE; outline: none;'
  }
  return 'box-shadow: none; outline: none;'
})

const toggle = (option) => {
  const value = option.value
  const current = [...props.modelValue]
  const index = current.indexOf(value)
  if (index === -1) {
    current.push(value)
  } else {
    current.splice(index, 1)
  }
  emit('update:modelValue', current)
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
