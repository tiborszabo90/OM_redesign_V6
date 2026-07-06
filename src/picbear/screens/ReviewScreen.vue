<script setup>
import { reactive, computed } from 'vue'
import { state, products, styleById, placementOptions, openEditor } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { Check, RefreshCw, ArrowRight, SlidersHorizontal } from 'lucide-vue-next'

const regenerating = reactive({})

const selectedProducts = computed(() => products.filter(p => state.selected.includes(p.id)))
const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))
const approvedCount = computed(() => selectedProducts.value.filter(p => state.approved[p.id]).length)

function toggleApprove(id) {
  state.approved[id] = !state.approved[id]
}

function approveAll() {
  selectedProducts.value.forEach(p => { state.approved[p.id] = true })
}

function regenerate(id) {
  regenerating[id] = true
  setTimeout(() => { regenerating[id] = false }, 1000)
}

function continueToEnable() {
  if (!approvedCount.value) return
  state.steps.generate = true
  state.screen = 'enable'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5 pb-24">
    <WizardHeader
      :step="4"
      title="Review before going live"
      subtitle="Approve the images you like. Nothing is published until you say so."
      back-to="generate"
    />

    <div class="flex items-center justify-between mb-3 px-1">
      <p class="text-[12px] text-[#616161]">{{ approvedCount }} of {{ selectedProducts.length }} approved</p>
      <button class="pb-btn-ghost" @click="approveAll"><Check :size="13" /> Approve all</button>
    </div>

    <div class="flex flex-col gap-3">
      <div v-for="p in selectedProducts" :key="p.id" class="pb-card px-4 py-3 flex items-center gap-4">
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-16 h-16 rounded-lg overflow-hidden relative">
            <img :src="p.img" class="w-full h-full object-cover" />
            <span class="absolute bottom-1 left-1 text-[9px] font-semibold bg-white/90 rounded px-1">Before</span>
          </div>
          <ArrowRight :size="14" class="text-[#8a8a8a]" />
          <div class="w-24 h-24 rounded-lg overflow-hidden relative ring-1 ring-[#dedbf7]">
            <div v-if="regenerating[p.id]" class="absolute inset-0 pb-skeleton"></div>
            <StyledImage v-else :src="p.img" :overlay="chosenStyle.overlay" ai-tag enhance />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ p.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ chosenStyle.name }} · shown {{ chosenPlacement.name.toLowerCase() }}</p>
        </div>
        <button class="pb-btn-ghost shrink-0" @click="openEditor(p.id, 'review')">
          <SlidersHorizontal :size="13" /> Fine-tune
        </button>
        <button class="pb-btn-ghost shrink-0" @click="regenerate(p.id)">
          <RefreshCw :size="13" /> Regenerate
        </button>
        <button
          class="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold cursor-pointer"
          :class="state.approved[p.id] ? 'bg-[#d7f2e4] text-[#0c6b45]' : 'bg-white border border-[#d4d4d4] text-[#303030]'"
          @click="toggleApprove(p.id)"
        >
          <Check :size="13" /> {{ state.approved[p.id] ? 'Approved' : 'Approve' }}
        </button>
      </div>
    </div>

    <!-- Sticky publish bar -->
    <div class="fixed bottom-0 left-60 right-0 bg-white border-t border-[#e3e3e3] px-6 py-3">
      <div class="max-w-[912px] mx-auto flex items-center justify-between">
        <p class="text-[12px] text-[#616161]">
          One step left: turn on Picbear in your theme, then your {{ approvedCount }} approved images go live.
        </p>
        <button class="pb-btn-primary" :disabled="!approvedCount" @click="continueToEnable">
          Continue with {{ approvedCount }} approved images <ArrowRight :size="13" />
        </button>
      </div>
    </div>
  </div>
</template>
