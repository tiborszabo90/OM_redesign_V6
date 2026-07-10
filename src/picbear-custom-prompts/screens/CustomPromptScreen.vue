<script setup>
import { state, customPrompts, baseLookLabels } from '../store'
import { PawPrint, ChevronRight, Sparkles } from 'lucide-vue-next'

// Custom-prompt picker — shown after choosing the "Custom prompt" style.
// Pick a saved prompt to base the variation on, or start from scratch.
function back() {
  state.screen = 'style'
}
function scratch() {
  state.customPromptId = null
  state.screen = 'placement'
}
function pick(p) {
  state.customPromptId = p.id
  state.screen = 'placement'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Breadcrumb header -->
    <div class="flex items-center gap-2 mb-5">
      <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
        <PawPrint :size="15" class="text-white" />
      </span>
      <ChevronRight :size="14" class="text-[#8a8a8a]" />
      <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="back">Back</button>
      <ChevronRight :size="14" class="text-[#8a8a8a]" />
      <h1 class="text-lg font-bold text-[#1a1a1a]">Choose a custom prompt</h1>
    </div>

    <!-- Intro -->
    <div class="pb-card p-4 mb-5">
      <p class="text-[13px] text-[#1a1a1a]">
        Pick one of your saved prompts to base this variation on, or start from scratch.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Start from scratch -->
      <div class="rounded-lg border border-[#dedbf7] bg-[#f6f5ff] p-5 flex flex-col">
        <div class="flex items-center gap-3 mb-2">
          <span class="w-10 h-10 rounded-xl bg-white border border-[#dedbf7] flex items-center justify-center shrink-0">
            <Sparkles :size="18" class="text-[#5548e0]" />
          </span>
          <div class="text-[16px] font-bold text-[#1a1a1a]">Start from scratch</div>
        </div>
        <p class="text-[13px] text-[#4a4a4a] flex-1">Write brand-new AI instructions for this variation.</p>
        <div class="mt-3">
          <button class="pb-btn-primary" @click="scratch">Start from scratch</button>
        </div>
      </div>

      <!-- Saved prompts -->
      <div
        v-for="p in customPrompts" :key="p.id"
        class="rounded-lg border border-[#e1e3e5] bg-white p-4 flex flex-col"
      >
        <div class="flex items-start gap-3 mb-2">
          <div class="w-14 h-14 rounded-lg overflow-hidden bg-[#f6f6f6] border border-[#e0e0e0] shrink-0">
            <img v-if="p.previewImg" :src="p.previewImg" alt="" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-[15px] font-bold text-[#1a1a1a]">{{ p.name }}</p>
              <span class="text-[11px] rounded-full bg-[#f1f2f4] text-[#5c5f62] px-2 py-0.5">{{ baseLookLabels[p.baseStyle] }}</span>
            </div>
            <p class="text-[12px] text-[#616161] line-clamp-2 mt-1">{{ p.instructions }}</p>
          </div>
        </div>
        <div class="mt-auto pt-2">
          <button class="pb-btn-primary" @click="pick(p)">Use this prompt</button>
        </div>
      </div>
    </div>
  </div>
</template>
