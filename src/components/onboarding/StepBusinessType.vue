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
        <div class="text-[#ED5A29]" v-html="option.icon"></div>
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
        <div class="text-[#ED5A29]">
          <!-- uil-archive -->
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,13h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2ZM19,3H5A3,3,0,0,0,2,6V9a1,1,0,0,0,1,1H4v8a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V10h1a1,1,0,0,0,1-1V6A3,3,0,0,0,19,3ZM18,18a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V10H18ZM20,8H4V6A1,1,0,0,1,5,5H19a1,1,0,0,1,1,1Z"/>
          </svg>
        </div>
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
    // uil-shopping-cart
    icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.5,19A1.5,1.5,0,1,0,10,20.5,1.5,1.5,0,0,0,8.5,19ZM19,16H7a1,1,0,0,1,0-2h8.49121A3.0132,3.0132,0,0,0,18.376,11.82422L19.96143,6.2749A1.00009,1.00009,0,0,0,19,5H6.73907A3.00666,3.00666,0,0,0,3.92139,3H3A1,1,0,0,0,3,5h.92139a1.00459,1.00459,0,0,1,.96142.7251l.15552.54474L6.6792,12.01709A3.00006,3.00006,0,0,0,7,18H19a1,1,0,0,0,0-2ZM17.67432,7l-1.2212,4.27441A1.00458,1.00458,0,0,1,15.49121,12H8.75439l-.25494-.89221L7.32642,7ZM16.5,19A1.5,1.5,0,1,0,18,20.5,1.5,1.5,0,0,0,16.5,19Z"/>
    </svg>`
  },
  {
    value: 'saas',
    label: 'SaaS/Software',
    // uil-desktop
    icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19,3H5A3,3,0,0,0,2,6v8a3,3,0,0,0,3,3h6v2H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2H13V17h6a3,3,0,0,0,3-3V6A3,3,0,0,0,19,3Zm1,11a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V6A1,1,0,0,1,5,5H19a1,1,0,0,1,1,1Z"/>
    </svg>`
  },
  {
    value: 'service',
    label: 'Service',
    // uil-users-alt
    icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.3,12.22A4.92,4.92,0,0,0,14,8.5a5,5,0,0,0-10,0,4.92,4.92,0,0,0,1.7,3.72A8,8,0,0,0,1,19.5a1,1,0,0,0,2,0,6,6,0,0,1,12,0,1,1,0,0,0,2,0A8,8,0,0,0,12.3,12.22ZM9,11.5a3,3,0,1,1,3-3A3,3,0,0,1,9,11.5Zm9.74.32A5,5,0,0,0,15,3.5a1,1,0,0,0,0,2,3,3,0,0,1,3,3,3,3,0,0,1-1.5,2.59,1,1,0,0,0-.5.84,1,1,0,0,0,.45.86l.39.26.13.07a7,7,0,0,1,4,6.38,1,1,0,0,0,2,0A9,9,0,0,0,18.74,11.82Z"/>
    </svg>`
  },
  {
    value: 'media',
    label: 'Media',
    // uil-video
    icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.53,7.15a1,1,0,0,0-1,.06L17,9.14V8a3,3,0,0,0-3-3H5A3,3,0,0,0,2,8v8a3,3,0,0,0,3,3h9a3,3,0,0,0,3-3V14.86l3.51,1.93a1,1,0,0,0,1.06,0A1,1,0,0,0,22,16V8A1,1,0,0,0,21.53,7.15ZM15,16a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8A1,1,0,0,1,5,7h9a1,1,0,0,1,1,1Zm5-1.73-3-1.65V11.38l3-1.65Z"/>
    </svg>`
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
