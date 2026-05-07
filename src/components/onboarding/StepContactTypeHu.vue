<template>
  <div>
    <div>
      <h2 class="text-xl font-semibold text-[#23262A] mb-4">Kihez tartozik ez a fiók?</h2>

      <!-- Profile Card -->
      <div class="bg-[#F9FAFB] rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#ED5A29] rounded-full flex items-center justify-center text-white font-medium">
            {{ userInitials }}
          </div>
          <div>
            <p class="text-base font-medium text-[#23262A]">{{ userName }}</p>
            <p class="text-sm text-[#8F97A4]">{{ userEmail }}</p>
          </div>
        </div>
      </div>

      <p class="text-sm text-[#8F97A4] font-light my-6">Add meg, kinek az elérhetőségeit használtad a fiók létrehozásához.</p>
    </div>

    <div class="space-y-3">
      <button
        v-for="option in options"
        :key="option.value"
        @click="handleSelect(option.value)"
        :class="[
          'w-full bg-white rounded-xl p-4 transition-all focus:outline-none text-left cursor-pointer',
          selectedValue === option.value
            ? 'border-2 border-[#ED5A29] shadow-md'
            : 'border-2 border-[#E3E5E8] hover:border-[#ED5A29] hover:shadow-md'
        ]"
      >
        <h3 class="text-base font-normal text-[#23262A] mb-1">{{ option.title }}</h3>
        <p class="text-xs text-[#8F97A4]">{{ option.description }}</p>
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
  },
  registrationData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'auto-next'])

// Get selected value from modelValue to persist selection when navigating back
const selectedValue = computed(() => props.modelValue?.contactType || null)

// Get user data from registration
const userName = computed(() => {
  const firstName = props.registrationData?.firstName || ''
  const lastName = props.registrationData?.lastName || ''
  return `${firstName} ${lastName}`.trim() || 'Felhasználó'
})

const userEmail = computed(() => {
  return props.registrationData?.email || 'user@example.com'
})

const userInitials = computed(() => {
  const firstName = props.registrationData?.firstName || ''
  const lastName = props.registrationData?.lastName || ''
  if (firstName && lastName) {
    return firstName[0].toUpperCase() + lastName[0].toUpperCase()
  }
  return userName.value.substring(0, 2).toUpperCase()
})

const options = [
  {
    value: 'client-contact',
    title: 'Ezek az ügyfelem elérhetőségei',
    description: 'Kérlek, ne küldjetek ügynökségi tartalmakat.'
  },
  {
    value: 'own-contact',
    title: 'Ezek a saját elérhetőségeim',
    description: 'Küldhettek nekem ügynökségi tartalmakat.'
  }
]

const handleSelect = (value) => {
  emit('update:modelValue', { contactType: value })
  emit('auto-next')
}
</script>
