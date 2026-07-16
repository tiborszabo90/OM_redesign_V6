<script setup>
import { state } from '../store'
import { FlaskConical, Lock, Play, TrendingUp } from 'lucide-vue-next'

function finishSetup() {
  state.appTab = 'home'
  state.screen = state.steps.style ? 'placement' : 'style'
}
</script>

<template>
  <div class="max-w-[760px] mx-auto px-6 py-10">
    <!-- Not published yet: teach -->
    <div v-if="!state.published" class="pb-card p-8 text-center">
      <span class="w-12 h-12 rounded-xl bg-[#f6f5ff] border border-[#dedbf7] inline-flex items-center justify-center mb-4">
        <FlaskConical :size="22" class="text-[#5548e0]" />
      </span>
      <h1 class="text-xl font-bold text-[#1a1a1a] mb-1.5">Prove that better images sell more</h1>
      <p class="text-[13px] text-[#616161] max-w-md mx-auto mb-5">
        An A/B test shows your original photos to half of your visitors and the AI versions to the other half.
        You see clicks, add to carts and orders for both, so the decision is based on data, not taste.
      </p>
      <button class="pb-btn-secondary" @click="finishSetup">
        <Lock :size="13" /> Publish your first images to unlock
      </button>
    </div>

    <!-- Published: suggested test -->
    <div v-else>
      <h1 class="text-lg font-bold text-[#1a1a1a] mb-4">A/B tests</h1>

      <div class="pb-card p-5 mb-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-semibold text-[#1a1a1a] flex items-center gap-2 mb-1">
              Original vs AI images
              <span v-if="state.abTestRunning" class="text-[10px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-1.5 py-0.5">Running · Day 1</span>
              <span v-else class="text-[10px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-1.5 py-0.5">Suggested</span>
            </p>
            <p class="text-[12px] text-[#616161]">{{ state.selected.length }} products · 50/50 traffic split · measures image clicks, add to cart, orders</p>
          </div>
          <button v-if="!state.abTestRunning" class="pb-btn-primary" @click="state.abTestRunning = true">
            <Play :size="13" /> Start test
          </button>
        </div>

        <div v-if="state.abTestRunning" class="grid grid-cols-3 gap-3 mt-4">
          <div class="rounded-xl border border-[#ececec] p-3.5">
            <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Visitors in test</p>
            <p class="text-xl font-bold text-[#1a1a1a]">64</p>
          </div>
          <div class="rounded-xl border border-[#ececec] p-3.5">
            <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Image clicks, AI vs original</p>
            <p class="text-xl font-bold text-[#1a1a1a]">18 vs 11</p>
          </div>
          <div class="rounded-xl border border-[#ececec] p-3.5">
            <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Confidence</p>
            <p class="text-xl font-bold text-[#1a1a1a]">Collecting...</p>
          </div>
        </div>
        <p v-if="state.abTestRunning" class="text-[12px] text-[#8a8a8a] mt-3 flex items-center gap-1">
          <TrendingUp :size="12" /> First reliable read in 2 to 3 days. We will email you when there is a winner.
        </p>
      </div>
    </div>
  </div>
</template>
