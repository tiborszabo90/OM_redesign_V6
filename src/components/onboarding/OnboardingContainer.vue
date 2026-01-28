<template>
  <div class="w-full" @wheel="$emit('wheel', $event)">
    <!-- Content -->
    <div class="mb-6">
      <slot></slot>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-start gap-4">
      <button
        v-if="!isFirstStep"
        @click="$emit('prev')"
        class="px-6 py-2 border border-[#D5D8DD] rounded-lg text-[#505763] hover:bg-[#F7F7F8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2 cursor-pointer"
      >
        Previous
      </button>

      <button
        @click="$emit('next')"
        class="px-6 py-2 bg-[#ED5A29] text-white rounded-lg hover:bg-[#E54D1F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ED5A29] focus:ring-offset-2 cursor-pointer"
      >
        {{ isLastStep ? 'Complete' : 'Next' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  totalSteps: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  isFirstStep: {
    type: Boolean,
    required: true
  },
  isLastStep: {
    type: Boolean,
    required: true
  }
})

defineEmits(['next', 'prev', 'wheel'])
</script>
