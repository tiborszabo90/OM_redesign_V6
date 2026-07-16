<script setup>
import { state } from '../store'
import { PawPrint, ArrowRight, Clock } from 'lucide-vue-next'

function start() {
  state.screen = 'style'
}

function later() {
  state.screen = 'home-onboarding-fallback'
}
</script>

<template>
  <div class="min-h-full flex items-center justify-center px-6 py-10">
    <div class="pb-card w-full max-w-[520px] p-8 pb-fade-in">
      <!-- Brand + heading -->
      <span class="w-11 h-11 rounded-xl bg-[#5548e0] flex items-center justify-center mb-4">
        <PawPrint :size="22" class="text-white" />
      </span>
      <h1 class="text-2xl font-bold text-[#1a1a1a] tracking-tight">Welcome to Picbear</h1>
      <p class="text-[14px] text-[#4a4a4a] mt-2 leading-relaxed">
        We'll walk you through the whole setup in a few quick steps, and you review everything along the way.
        Each step is guided, so you can move as fast or as carefully as you like, and pick it back up any time.
      </p>

      <!-- Time -->
      <p class="text-[12px] text-[#616161] flex items-center gap-1.5 mt-3">
        <Clock :size="12" /> About 3 minutes
      </p>

      <!-- Actions -->
      <div class="flex items-center gap-3 mt-6">
        <button class="pb-btn-primary" @click="start">
          Let's start <ArrowRight :size="14" />
        </button>
        <button class="pb-btn-ghost" @click="later">I'll set this up later</button>
      </div>
    </div>
  </div>
</template>
