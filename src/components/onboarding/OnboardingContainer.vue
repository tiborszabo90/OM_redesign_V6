<template>
  <div class="w-full" @wheel="$emit('wheel', $event)">
    <!-- Content -->
    <div class="mb-6">
      <slot></slot>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-start gap-4">
      <Button
        v-if="!isFirstStep"
        variant="outline"
        @click="$emit('prev')"
      >
        Previous
      </Button>

      <Button
        variant="primary"
        @click="$emit('next')"
      >
        {{ isLastStep ? 'Complete' : 'Next' }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from '../shared/Button.vue'

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
