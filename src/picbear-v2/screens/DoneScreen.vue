<script setup>
import { computed } from 'vue'
import { state, products, placementOptions } from '../store'
import { Check, FlaskConical, LayoutDashboard, ExternalLink, Sparkles } from 'lucide-vue-next'

const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))
const remaining = computed(() => products.length - state.selected.length)

const confetti = Array.from({ length: 36 }, (_, i) => ({
  left: Math.random() * 100 + '%',
  background: ['#5548e0', '#36c98e', '#eab308', '#f472b6', '#60a5fa'][i % 5],
  animationDelay: Math.random() * 0.9 + 's',
  animationDuration: 2 + Math.random() * 1.4 + 's',
}))

function goHome() {
  state.screen = 'home'
}

function goPlans() {
  state.screen = 'plans'
}

function goAbTests() {
  state.screen = 'home'
  state.appTab = 'abtests'
}
</script>

<template>
  <div class="max-w-[760px] mx-auto px-6 py-10 relative">
    <div class="absolute inset-x-0 top-0 h-[420px] overflow-hidden pointer-events-none">
      <span v-for="(c, i) in confetti" :key="i" class="pb-confetti-piece" :style="c"></span>
    </div>

    <div class="pb-card p-8 text-center mb-4">
      <span class="w-14 h-14 rounded-full bg-[#36c98e] inline-flex items-center justify-center mb-4">
        <Check :size="28" class="text-white" />
      </span>
      <h1 class="text-xl font-bold text-[#1a1a1a] mb-1.5">Your product pages are live</h1>
      <p class="text-[13px] text-[#616161] max-w-md mx-auto">
        {{ state.selected.length }} AI images published, {{ chosenPlacement.name.toLowerCase() }}.
        We started measuring image clicks and assisted orders right away.
      </p>
      <button class="pb-btn-secondary mt-4">
        <ExternalLink :size="13" /> View a product on your storefront
      </button>
    </div>

    <div class="grid gap-4" :class="state.plan === 'trial' && remaining > 0 ? 'grid-cols-3' : 'grid-cols-2'">
      <div v-if="state.plan === 'trial' && remaining > 0" class="pb-card p-5 flex flex-col">
        <Sparkles :size="18" class="text-[#5548e0] mb-2" />
        <p class="font-semibold text-[#1a1a1a] mb-1">Cover your whole catalog</p>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">{{ remaining }} products are still on their original photos. Pick a plan to keep generating.</p>
        <button class="pb-btn-secondary self-start" @click="goPlans">Generate more images</button>
      </div>
      <div class="pb-card p-5 flex flex-col">
        <FlaskConical :size="18" class="text-[#5548e0] mb-2" />
        <p class="font-semibold text-[#1a1a1a] mb-1">See the real impact</p>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">Run original vs AI images side by side and let the numbers decide.</p>
        <button class="pb-btn-secondary self-start" @click="goAbTests">Start an A/B test</button>
      </div>
      <div class="pb-card p-5 flex flex-col">
        <LayoutDashboard :size="18" class="text-[#5548e0] mb-2" />
        <p class="font-semibold text-[#1a1a1a] mb-1">Watch your numbers</p>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">Upgraded products, visitors and assisted revenue, updated daily.</p>
        <button class="pb-btn-secondary self-start" @click="goHome">Go to dashboard</button>
      </div>
    </div>
  </div>
</template>
