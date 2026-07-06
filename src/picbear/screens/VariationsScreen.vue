<script setup>
import { state, styleOptions } from '../store'
import StyledImage from '../components/StyledImage.vue'
import { Layers, Lock, Plus } from 'lucide-vue-next'

function finishSetup() {
  state.appTab = 'home'
  state.screen = state.steps.style ? 'placement' : 'style'
}
</script>

<template>
  <div class="max-w-[760px] mx-auto px-6 py-10">
    <div class="pb-card p-8 text-center">
      <span class="w-12 h-12 rounded-xl bg-[#f6f5ff] border border-[#dedbf7] inline-flex items-center justify-center mb-4">
        <Layers :size="22" class="text-[#5548e0]" />
      </span>
      <h1 class="text-xl font-bold text-[#1a1a1a] mb-1.5">Try different looks per product</h1>
      <p class="text-[13px] text-[#616161] max-w-md mx-auto mb-5">
        A variation is a batch of AI images with its own style and instructions.
        Give your bestsellers a lifestyle look and your accessories a clean badge, then compare.
      </p>

      <div class="flex justify-center gap-2 mb-6">
        <div v-for="opt in styleOptions" :key="opt.id" class="w-20 h-14 rounded-lg overflow-hidden border border-[#ececec]">
          <StyledImage :src="opt.img" :overlay="opt.overlay" compact />
        </div>
      </div>

      <button v-if="state.published" class="pb-btn-primary"><Plus :size="13" /> Create a variation</button>
      <button v-else class="pb-btn-secondary" @click="finishSetup">
        <Lock :size="13" /> Finish setup first, about 2 minutes left
      </button>
    </div>
  </div>
</template>
