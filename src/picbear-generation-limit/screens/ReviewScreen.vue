<script setup>
import { ref, computed } from 'vue'
import { state, products, createGeneratingVariation } from '../store'
import { PawPrint, ChevronRight, ArrowRight, Check } from 'lucide-vue-next'

// picbear-current mirror of the currently-live Generate images step
// (app.onboarding.generate.tsx): summary line, sample preview, shared AI
// instructions, and a per-product queue. Localized to the coffee demo.
const instructions = ref('')

// Simulate a large selected catalog so the generation-limit control is
// meaningful (a real store can have hundreds of products). Cycles the demo
// catalog; a few products are already generated so "top up the rest" reads true.
const totalSelected = 247
const generatedIds = new Set([2, 5, 9])
const selectedList = Array.from({ length: totalSelected }, (_, i) => {
  const base = products[i % products.length]
  return { id: i + 1, name: base.name, img: base.img, hasUpgrade: generatedIds.has(i + 1) }
})

// Generation only targets products that don't have an image yet.
const generatedTotal = computed(() => selectedList.filter(p => p.hasUpgrade).length)
const remaining = computed(() => selectedList.filter(p => !p.hasUpgrade))
const remainingCount = computed(() => remaining.value.length)

// How many of the remaining products to generate now: a preset, all, or custom.
const scopeOptions = computed(() => [
  { value: 5, label: 'Next 5' },
  { value: 10, label: 'Next 10' },
  { value: 25, label: 'Next 25' },
  { value: 100, label: 'Next 100' },
  { value: 'all', label: `All ${remainingCount.value}` },
  { value: 'custom', label: 'Custom' },
])
const scope = ref(25)
const customAmount = ref(50)
const limit = computed(() => {
  if (scope.value === 'all') return remainingCount.value
  if (scope.value === 'custom') {
    const n = Math.floor(Number(customAmount.value) || 0)
    return Math.min(Math.max(n, 1), remainingCount.value)
  }
  return Math.min(scope.value, remainingCount.value)
})

// The batch = the next `limit` products that still need an image.
const batch = computed(() => remaining.value.slice(0, limit.value))
const queuedCount = computed(() => batch.value.length)

// Only preview the first few rows of the batch; the rest are summarized.
const QUEUE_PREVIEW = 8
const queuePreview = computed(() => batch.value.slice(0, QUEUE_PREVIEW))
const hiddenCount = computed(() => Math.max(0, limit.value - QUEUE_PREVIEW))

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
    </div>

    <!-- Summary + generation limit -->
    <div class="pb-card p-4 mb-4">
      <!-- Summary row -->
      <div class="flex items-center justify-between gap-3 flex-wrap pb-4 border-b border-[#ececec]">
        <div class="flex items-center gap-4 flex-wrap text-[13px]">
          <span class="font-semibold text-[#1a1a1a]">{{ totalSelected }} products selected</span>
          <span class="text-[#6d7175]">Style: {{ state.style || 'people' }}</span>
          <span class="text-[#6d7175]">Image output: shared (1:1)</span>
          <span v-if="generatedTotal" class="text-[#6d7175]">{{ generatedTotal }} already generated</span>
        </div>
        <button class="pb-btn-primary" @click="startGenerating">Start generating ({{ queuedCount }} product{{ queuedCount !== 1 ? 's' : '' }})</button>
      </div>

      <!-- Limit control -->
      <div class="pt-4">
        <p class="text-[13px] font-semibold text-[#1a1a1a] mb-1">How many products to generate?</p>
        <p class="text-[12px] text-[#6d7175] mb-3">Generate images for the next products that don't have one yet. You can top up the rest later.</p>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="opt in scopeOptions" :key="opt.value"
            class="rounded-lg border px-3 py-1.5 text-[13px] cursor-pointer transition-colors"
            :class="scope === opt.value ? 'border-[#008060] bg-[#f1f8f5] text-[#008060] font-semibold' : 'border-[#d4d4d4] text-[#1a1a1a] hover:border-[#a0a0a0]'"
            @click="scope = opt.value"
          >{{ opt.label }}</button>
        </div>

        <div v-if="scope === 'custom'" class="flex items-center gap-2 mt-3">
          <input
            type="number" v-model.number="customAmount" min="1" :max="remainingCount"
            class="w-28 px-3 py-2 rounded-md border border-[#c9cccf] text-[14px] focus:outline-none focus:border-[#5548e0]"
          />
          <span class="text-[13px] text-[#6d7175]">products (max {{ remainingCount }})</span>
        </div>

        <p class="text-[12px] text-[#1a1a1a] mt-3">
          Generating the next <span class="font-semibold">{{ limit }}</span> of {{ remainingCount }} products that still need an image.
        </p>
      </div>
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

    <!-- Product queue (preview of the batch) -->
    <div class="flex flex-col gap-3">
      <div
        v-for="p in queuePreview" :key="p.id"
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
      <div v-if="hiddenCount" class="rounded-lg border border-dashed border-[#d4d4d4] p-3 text-center text-[13px] text-[#6d7175]">
        + {{ hiddenCount }} more product{{ hiddenCount !== 1 ? 's' : '' }} in this batch
      </div>
    </div>
  </div>
</template>
