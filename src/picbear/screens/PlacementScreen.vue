<script setup>
import { computed } from 'vue'
import { state, bestseller, placementOptions, styleById } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { Info, ArrowRight } from 'lucide-vue-next'

const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))

function next() {
  state.steps.placement = true
  state.screen = 'products'
}

function skip() {
  state.placement = 'below-hero'
  next()
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <WizardHeader
      :step="2"
      title="Choose where the image appears"
      subtitle="The preview on the right shows your product page as customers will see it."
      back-to="style"
      skip-label="Use recommended"
      @skip="skip"
    />

    <div class="grid grid-cols-[1fr_1.15fr] gap-4 mb-5">
      <!-- Options -->
      <div class="flex flex-col gap-3">
        <div
          v-for="opt in placementOptions" :key="opt.id"
          class="pb-card p-3.5 cursor-pointer flex items-start gap-3"
          :class="state.placement === opt.id ? 'ring-2 ring-[#5548e0] border-transparent!' : 'hover:shadow-md'"
          @click="state.placement = opt.id"
        >
          <span
            class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
            :class="state.placement === opt.id ? 'border-[#5548e0]' : 'border-[#c9c9c9]'"
          >
            <span v-if="state.placement === opt.id" class="w-2 h-2 rounded-full bg-[#5548e0]"></span>
          </span>
          <div class="flex-1">
            <p class="font-semibold text-[#1a1a1a] flex items-center gap-2">
              {{ opt.name }}
              <span v-if="opt.recommended" class="text-[10px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-1.5 py-0.5">Recommended</span>
            </p>
            <p class="text-[12px] text-[#616161] mt-0.5">{{ opt.desc }}</p>
          </div>
        </div>

        <div class="rounded-xl bg-[#f7f7f7] border border-[#ececec] px-3.5 py-2.5 flex items-center gap-2 text-[12px] text-[#616161]">
          <Info :size="13" class="shrink-0" />
          Current theme: Horizon. All three placements work with it.
        </div>
      </div>

      <!-- Live product page preview -->
      <div class="pb-card p-4">
        <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-3">Live preview · {{ bestseller.name }}</p>
        <div class="rounded-lg border border-[#ececec] p-3 bg-white">
          <!-- hero -->
          <div class="rounded-lg overflow-hidden aspect-[16/8] mb-2" :class="state.placement === 'replace' ? 'ring-2 ring-[#5548e0]' : ''">
            <StyledImage
              v-if="state.placement === 'replace'"
              :src="chosenStyle.img" :overlay="chosenStyle.overlay" ai-tag enhance
            />
            <img v-else :src="bestseller.img" class="w-full h-full object-cover" />
          </div>
          <!-- thumbs -->
          <div class="flex gap-1.5 mb-2">
            <div class="w-10 h-10 rounded-md overflow-hidden"><img :src="bestseller.img" class="w-full h-full object-cover" /></div>
            <div class="w-10 h-10 rounded-md bg-[#ececec]"></div>
            <div class="w-10 h-10 rounded-md bg-[#ececec]"></div>
          </div>
          <!-- AI image below hero -->
          <div v-if="state.placement === 'below-hero'" class="rounded-lg overflow-hidden aspect-[16/7] mb-2 ring-2 ring-[#5548e0] pb-fade-in">
            <StyledImage :src="chosenStyle.img" :overlay="chosenStyle.overlay" ai-tag enhance />
          </div>
          <!-- title / price / cta -->
          <div class="h-3 w-2/3 bg-[#e3e3e3] rounded mb-1.5"></div>
          <div class="h-3 w-16 bg-[#e3e3e3] rounded mb-2.5"></div>
          <div class="h-8 w-full bg-[#1a1a1a] rounded-lg mb-3 flex items-center justify-center text-white text-[11px] font-semibold">Add to cart</div>
          <!-- description -->
          <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
          <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
          <div class="h-2 w-3/4 bg-[#ececec] rounded"></div>
          <!-- AI image below description -->
          <div v-if="state.placement === 'below-desc'" class="rounded-lg overflow-hidden aspect-[16/7] mt-2 ring-2 ring-[#5548e0] pb-fade-in">
            <StyledImage :src="chosenStyle.img" :overlay="chosenStyle.overlay" ai-tag enhance />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button class="pb-btn-primary" @click="next">Continue <ArrowRight :size="13" /></button>
    </div>
  </div>
</template>
