<script setup>
import { state } from '../store'
import { PawPrint, ChevronRight } from 'lucide-vue-next'

// picbear-current mirror of the currently-live onboarding position step
// (app.onboarding.position.tsx): "Choose where to show your image".
const options = [
  {
    value: 'replace_hero',
    label: 'Replace Main Image',
    description: 'Swap the hero product photo with your AI-enhanced version',
    img: '/picbear/onboarding-position-replace-main.png',
  },
  {
    value: 'below_hero',
    label: 'Below the Hero',
    description: 'Add your AI image below the main product photos',
    img: '/picbear/onboarding-position-below-hero.png',
  },
  {
    value: 'below_description',
    label: 'Below the Description',
    description: 'Add your AI image below the product description text',
    img: '/picbear/onboarding-position-below-description.png',
  },
]

function selectPosition(value) {
  state.placement = value
  state.steps.placement = true
  state.screen = 'products'
}

function back() {
  state.screen = 'style'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Breadcrumb header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
          <PawPrint :size="15" class="text-white" />
        </span>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="back">Back</button>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">Choose where to show your image</h1>
      </div>
    </div>

    <!-- Intro -->
    <div class="pb-card p-4 mb-5">
      <p class="text-[13px] text-[#1a1a1a]">
        Select where the AI-upgraded image should appear on your product pages.
      </p>
    </div>

    <!-- Position cards -->
    <div class="pb-card p-5 mb-5">
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="opt in options" :key="opt.value"
          class="rounded-lg border border-[#e1e3e5] p-5 flex flex-col bg-white"
        >
          <div class="min-h-[140px] flex items-center justify-center mb-3 bg-[#f6f6f7] rounded-md overflow-hidden">
            <img :src="opt.img" :alt="opt.label" class="block w-full h-auto" />
          </div>
          <div class="text-[20px] font-bold leading-7 text-[#1a1a1a]">{{ opt.label }}</div>
          <p class="text-[13px] text-[#4a4a4a] mt-2 flex-1">{{ opt.description }}</p>
          <div class="mt-3">
            <button class="pb-btn-primary" @click="selectPosition(opt.value)">Select {{ opt.label }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Current theme -->
    <div class="pb-card p-4">
      <p class="text-[13px] text-[#6d7175]">Current theme: Test data</p>
    </div>
  </div>
</template>
