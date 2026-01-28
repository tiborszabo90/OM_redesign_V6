<template>
  <div>
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-[#23262A] mb-3">Who are you optimizing this website for?</h2>
      <p class="text-base text-[#8F97A4] font-light">Please choose the option which best describes your relationship with {{ websiteName || 'the website' }}.</p>
    </div>

    <div class="space-y-4">
      <button
        v-for="option in options"
        :key="option.value"
        @click="handleSelect(option.value)"
        :class="[
          'w-full bg-white rounded-xl p-4 transition-all focus:outline-none text-left flex items-center gap-4 cursor-pointer',
          selectedValue === option.value
            ? 'border-2 border-[#ED5A29] shadow-md'
            : 'border-2 border-[#E3E5E8] hover:border-[#ED5A29] hover:shadow-md'
        ]"
      >
        <!-- Icon -->
        <div class="text-[#ED5A29] flex-shrink-0">
          <div v-html="option.icon"></div>
        </div>

        <!-- Content -->
        <div>
          <h3 class="text-base font-normal text-[#23262A] mb-1">{{ option.title }}</h3>
          <p class="text-xs text-[#8F97A4]">{{ option.description }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

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

// Get selected value from modelValue to persist selection when navigating back
const selectedValue = computed(() => props.modelValue?.relationship || null)

const websiteName = computed(() => {
  return props.data?.welcome?.websiteName || ''
})

const options = [
  {
    value: 'my-business',
    title: 'My business',
    description: 'This is a website of mine or my business',
    // uil-user
    icon: `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/>
    </svg>`
  },
  {
    value: 'company-employee',
    title: 'A company I work for',
    description: "I'm an employee of this company",
    // uil-building
    icon: `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,8h1a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2Zm0,4h1a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2ZM9,8h1a1,1,0,0,0,0-2H9A1,1,0,0,0,9,8Zm0,4h1a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm12,8H18V3a1,1,0,0,0-1-1H7A1,1,0,0,0,6,3V20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm-5,0H13V16a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v4H8V4h8Z"/>
    </svg>`
  },
  {
    value: 'client',
    title: 'A client',
    description: "I'm an agency/freelancer working for this client",
    // uil-briefcase-alt
    icon: `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H3A1,1,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A1,1,0,0,0,21,6ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10ZM20,19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12.39l5.69,1.9A1.17,1.17,0,0,0,10,14.3a1,1,0,0,0,.31-.05L12,13.72l1.69.53A1,1,0,0,0,14,14.3a1.17,1.17,0,0,0,.31-.01L20,12.39Zm0-8.62-6.15,2.05L12,11.88l-1.85.55L4,10.38V8H20Z"/>
    </svg>`
  }
]

const handleSelect = (value) => {
  emit('update:modelValue', { relationship: value })
  // Emit auto-next event to trigger automatic progression
  emit('auto-next')
}
</script>
