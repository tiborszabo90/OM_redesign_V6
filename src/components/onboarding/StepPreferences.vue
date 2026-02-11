<template>
  <div>
    <h2 class="text-2xl font-normal text-[#23262A] mb-2">Your Preferences</h2>
    <p class="text-[#505763] mb-6">Help us customize your experience</p>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-[#23262A] mb-3">
          What interests you most?
        </label>
        <div class="space-y-2">
          <label
            v-for="interest in interests"
            :key="interest"
            class="flex items-center p-3 border border-[#D5D8DD] rounded-lg hover:bg-[#F9FAFB] cursor-pointer"
          >
            <input
              type="checkbox"
              :value="interest"
              v-model="localData.interests"
              @change="updateData"
              class="w-4 h-4 text-[#ED5A29] border-[#D5D8DD] rounded focus:ring-[#ED5A29]"
            />
            <span class="ml-3 text-[#23262A]">{{ interest }}</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-[#23262A] mb-2">
          How did you hear about us?
        </label>
        <select
          v-model="localData.referralSource"
          @change="updateData"
          class="w-full px-4 py-2 border border-[#D5D8DD] rounded-lg focus:ring-2 focus:ring-[#ED5A29] focus:border-transparent text-[#23262A]"
        >
          <option value="">Select an option</option>
          <option value="search">Search Engine</option>
          <option value="social">Social Media</option>
          <option value="friend">Friend or Colleague</option>
          <option value="advertisement">Advertisement</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const interests = [
  'Technology',
  'Design',
  'Business',
  'Marketing',
  'Development'
]

const localData = reactive({
  interests: props.modelValue.interests || [],
  referralSource: props.modelValue.referralSource || ''
})

const updateData = () => {
  emit('update:modelValue', { ...localData })
}

watch(() => props.modelValue, (newVal) => {
  Object.assign(localData, newVal)
}, { deep: true })
</script>
