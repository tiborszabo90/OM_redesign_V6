<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { state } from '../store'

const props = defineProps({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  backTo: { type: String, default: 'home-onboarding-fallback' },
  skipLabel: { type: String, default: '' },
})
const emit = defineEmits(['skip'])

function back() {
  state.screen = props.backTo
}
</script>

<template>
  <div class="mb-5">
    <div class="flex items-center justify-between mb-3">
      <button class="pb-btn-ghost -ml-2" @click="back">
        <ArrowLeft :size="14" /> Back
      </button>
      <div class="flex items-center gap-3">
        <span class="text-[12px] text-[#616161] font-medium">Step {{ step }} of 5 · about 3 minutes</span>
        <div class="flex gap-1">
          <span
            v-for="i in 5" :key="i"
            class="w-6 h-1 rounded-full"
            :class="i <= step ? 'bg-[#1a1a1a]' : 'bg-[#d4d4d4]'"
          ></span>
        </div>
        <button v-if="skipLabel" class="pb-btn-ghost text-[#5548e0]" @click="emit('skip')">{{ skipLabel }}</button>
      </div>
    </div>
    <h1 class="text-xl font-bold text-[#1a1a1a]">{{ title }}</h1>
    <p v-if="subtitle" class="text-[13px] text-[#616161] mt-1">{{ subtitle }}</p>
  </div>
</template>
