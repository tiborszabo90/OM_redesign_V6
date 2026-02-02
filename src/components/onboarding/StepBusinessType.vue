<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-[#23262A]">What best describes {{ websiteName || 'your business' }}?</h2>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        v-for="option in mainOptions"
        :key="option.value"
        @click="handleSelect(option.value)"
        :class="[
          'chip flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ease-out text-base focus:outline-none w-fit cursor-pointer hover:scale-[1.02]',
          selectedValue === option.value
            ? 'bg-om-orange-50 border-2 border-om-orange-500 text-om-gray-700'
            : 'bg-white border border-om-gray-200 text-om-gray-700'
        ]"
      >
        <component :is="option.iconComponent" :size="20" class="text-[#ED5A29]" />
        <span>{{ option.label }}</span>
      </button>
      <button
        @click="handleOtherClick"
        :class="[
          'chip flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all duration-200 ease-out text-base focus:outline-none w-fit cursor-pointer hover:scale-[1.02]',
          showOtherInput || selectedValue === 'other'
            ? 'bg-om-orange-50 border-2 border-om-orange-500 text-om-gray-700'
            : 'bg-white border border-om-gray-200 text-om-gray-700'
        ]"
      >
        <Archive :size="20" class="text-[#ED5A29]" />
        <span>Other</span>
      </button>
    </div>

    <!-- Other input field -->
    <transition
      enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden"
      enter-from-class="opacity-0 max-h-0 -translate-y-4"
      enter-to-class="opacity-100 max-h-40 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in-out overflow-hidden"
      leave-from-class="opacity-100 max-h-40 translate-y-0"
      leave-to-class="opacity-0 max-h-0 -translate-y-4"
    >
      <div v-if="showOtherInput" class="mt-6">
        <input
          v-model="otherValue"
          type="text"
          placeholder="Please specify..."
          class="w-full px-3 py-2.5 border border-[#D5D8DD] rounded-xl text-[#23262A] placeholder-[#8F97A4] focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent bg-white"
          @keyup.enter="submitOther"
        />
        <button
          @click="submitOther"
          :disabled="!otherValue.trim()"
          :class="[
            'mt-4 px-6 py-2.5 rounded-xl transition-colors text-base focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2',
            otherValue.trim()
              ? 'bg-[#ED5A29] text-white hover:bg-[#E54D1F] cursor-pointer'
              : 'bg-[#E3E5E8] text-[#505763] cursor-not-allowed'
          ]"
        >
          Next
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { ShoppingCart, Monitor, Users, Video, Archive } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'auto-next'])

// Initialize from modelValue to persist selection when navigating back
const selectedValue = computed(() => props.modelValue?.businessType || null)
const showOtherInput = ref(props.modelValue?.businessType === 'other')
const otherValue = ref(props.modelValue?.otherText || '')

const handleOtherClick = () => {
  showOtherInput.value = true
  // Clear previous selection when clicking Other
  emit('update:modelValue', { businessType: null })
}

const websiteName = computed(() => {
  return props.data?.welcome?.websiteName || ''
})

const mainOptions = [
  {
    value: 'ecommerce',
    label: 'eCommerce',
    iconComponent: ShoppingCart
  },
  {
    value: 'saas',
    label: 'SaaS/Software',
    iconComponent: Monitor
  },
  {
    value: 'service',
    label: 'Service',
    iconComponent: Users
  },
  {
    value: 'media',
    label: 'Media',
    iconComponent: Video
  }
]

const handleSelect = (value) => {
  showOtherInput.value = false
  emit('update:modelValue', { businessType: value })
  emit('auto-next')
}

const submitOther = () => {
  if (otherValue.value.trim()) {
    emit('update:modelValue', { businessType: 'other', otherText: otherValue.value.trim() })
    emit('auto-next')
  }
}
</script>
