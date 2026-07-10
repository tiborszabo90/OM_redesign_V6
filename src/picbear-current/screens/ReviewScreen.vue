<script setup>
import { ref, computed } from 'vue'
import { state, products, createGeneratingVariation } from '../store'
import { PawPrint, ChevronRight, MoreHorizontal, ArrowRight, Check } from 'lucide-vue-next'

// picbear-current mirror of the currently-live Generate images step
// (app.onboarding.generate.tsx): summary line, sample preview, shared AI
// instructions, and a per-product queue. Localized to the coffee demo.
const instructions = ref('')

// 5 products, 1 already generated (matches the reference snapshot).
const list = products.slice(0, 5).map((p, i) => ({
  id: p.id,
  name: p.name,
  img: p.img,
  hasUpgrade: i === 1,
}))
const doneCount = computed(() => list.filter(p => p.hasUpgrade).length)
const queuedCount = computed(() => list.filter(p => !p.hasUpgrade).length)

const sample = { before: products[0].img, after: '/picbear/people-latte.jpg' }

function back() {
  state.screen = 'generate'
}
function startGenerating() {
  state.steps.generate = true
  const id = createGeneratingVariation()
  state.appTab = 'variations'
  state.variationDetailId = id
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
        <h1 class="text-lg font-bold text-[#1a1a1a]">Generate images</h1>
      </div>
      <MoreHorizontal :size="16" class="text-[#616161]" />
    </div>

    <!-- Summary bar -->
    <div class="pb-card p-4 mb-4 flex items-center justify-between gap-3 flex-wrap">
      <div class="flex items-center gap-4 flex-wrap text-[13px]">
        <span class="font-semibold text-[#1a1a1a]">{{ list.length }} product{{ list.length !== 1 ? 's' : '' }} selected</span>
        <span class="text-[#6d7175]">Style: {{ state.style || 'people' }}</span>
        <span class="text-[#6d7175]">Image output: shared (1:1)</span>
        <span v-if="doneCount" class="text-[#6d7175]">{{ doneCount }} already generated</span>
      </div>
      <button class="pb-btn-primary" @click="startGenerating">Start generating ({{ queuedCount }} products)</button>
    </div>

    <!-- Sample + shared instructions -->
    <div class="pb-card p-5 mb-4">
      <div class="rounded-lg border border-[#e1e3e5] p-4 mb-4">
        <p class="text-[13px] font-semibold text-[#1a1a1a] mb-2">Previously generated sample</p>
        <div class="flex items-center gap-3">
          <img :src="sample.before" alt="Original" class="w-20 h-20 object-cover rounded-md border border-[#e0e0e0]" />
          <ArrowRight :size="20" class="text-[#999] shrink-0" />
          <img :src="sample.after" alt="Upgraded" class="w-20 h-20 object-cover rounded-md border border-[#e0e0e0]" />
        </div>
      </div>

      <div class="rounded-lg border border-[#e1e3e5] p-4">
        <p class="text-[13px] font-semibold text-[#1a1a1a] mb-1">Additional AI instructions</p>
        <p class="text-[12px] text-[#6d7175] mb-2">These instructions will be applied to all products in this variation.</p>
        <textarea
          v-model="instructions"
          rows="3"
          placeholder="e.g. Use a warm outdoor background with natural lighting..."
          class="w-full px-3 py-2 rounded-md border border-[#c9cccf] text-[13px] resize-y focus:outline-none focus:border-[#5548e0]"
        ></textarea>
      </div>
    </div>

    <!-- Product queue -->
    <div class="flex flex-col gap-3">
      <div
        v-for="p in list" :key="p.id"
        class="rounded-lg border border-[#e1e3e5] p-4 flex items-center gap-4"
        :class="p.hasUpgrade ? 'bg-[#f6f6f7]' : 'bg-white'"
      >
        <img :src="p.img" :alt="p.name" class="w-[60px] h-[60px] object-cover rounded" :class="p.hasUpgrade ? 'opacity-100' : 'opacity-50'" />
        <div class="flex-1 min-w-0">
          <p class="text-[13px] font-semibold text-[#1a1a1a] flex items-center gap-1.5">
            {{ p.name }}
            <Check v-if="p.hasUpgrade" :size="14" class="text-[#1a1a1a]" />
          </p>
          <p class="text-[13px] text-[#6d7175] mt-0.5">{{ p.hasUpgrade ? 'Already generated' : 'Queued' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
