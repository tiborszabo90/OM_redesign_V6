<template>
  <div class="xl:pr-16">
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-[#23262A] mb-3">Kinek a számára optimalizálod ezt a weboldalt?</h2>
      <p class="text-base text-[#8F97A4] font-light">Válaszd ki azt az opciót, amely a legjobban leírja a kapcsolatodat ezzel: {{ websiteName || 'a weboldal' }}.</p>
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
          <component :is="option.iconComponent" :size="24" />
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
import { User, Building, Briefcase } from 'lucide-vue-next'

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
    title: 'A saját vállalkozásom',
    description: 'Ez az én vagy a vállalkozásom weboldala',
    iconComponent: User
  },
  {
    value: 'company-employee',
    title: 'Egy cég, ahol dolgozom',
    description: 'Ennek a cégnek vagyok az alkalmazottja',
    iconComponent: Building
  },
  {
    value: 'client',
    title: 'Egy ügyfél',
    description: 'Ügynökségként/szabadúszóként dolgozom ennek az ügyfélnek',
    iconComponent: Briefcase
  }
]

const handleSelect = (value) => {
  emit('update:modelValue', { relationship: value })
  // Emit auto-next event to trigger automatic progression
  emit('auto-next')
}
</script>
