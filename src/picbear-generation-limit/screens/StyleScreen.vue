<script setup>
import { state } from '../store'
import { PawPrint, ChevronRight } from 'lucide-vue-next'

// picbear-current mirror of the currently-live onboarding style step
// (app.onboarding.style.tsx): "Choose image upgrade style" with 4 mode cards.
const modes = [
  {
    value: 'lifestyle',
    label: 'Lifestyle Background',
    img: '/picbear/onboarding-style-lifestyle.png',
    description: 'Replace the plain white background with a realistic lifestyle scene. Your product stays the hero — the AI adds context, lighting, and environment.',
  },
  {
    value: 'badge',
    label: 'Badge Overlay',
    img: '/picbear/onboarding-style-badge.png',
    description: 'Keep the clean background but add a single tasteful badge — Best Seller, New Arrival, Eco-Friendly, or a custom label that fits your product.',
  },
  {
    value: 'valueprop',
    label: 'Value Prop Callouts',
    img: '/picbear/onboarding-style-valueprop.png',
    description: 'Add 1–3 key benefit callouts around your product — extracted automatically from your product title, description, and tags.',
  },
  {
    value: 'people',
    label: 'People Using Product',
    img: '/picbear/onboarding-style-people-use.png',
    description: 'Show your product in active, realistic use by one or a few people in an authentic everyday setting. The product stays the focal point; people provide context.',
  },
]

function selectStyle(value) {
  state.style = value
  state.steps.style = true
  state.screen = 'placement'
}

function back() {
  state.screen = 'home'
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
        <h1 class="text-lg font-bold text-[#1a1a1a]">Choose image upgrade style</h1>
      </div>
    </div>

    <!-- Intro -->
    <div class="pb-card p-4 mb-5">
      <p class="text-[13px] text-[#1a1a1a]">
        Choose how you want your product images to look. You can always change this later.
      </p>
    </div>

    <!-- Style cards -->
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="mode in modes" :key="mode.value"
        class="rounded-lg border border-[#e1e3e5] p-5 flex flex-col bg-white"
      >
        <div class="h-[180px] flex items-center justify-center mb-3 bg-[#f6f6f7] rounded-md overflow-hidden">
          <img :src="mode.img" :alt="mode.label" class="block max-w-full max-h-full" />
        </div>
        <div class="text-[20px] font-bold leading-7 text-[#1a1a1a]">{{ mode.label }}</div>
        <p class="text-[13px] text-[#4a4a4a] mt-2">{{ mode.description }}</p>
        <div class="mt-3">
          <button class="pb-btn-primary" @click="selectStyle(mode.value)">Select this style</button>
        </div>
      </div>
    </div>
  </div>
</template>
