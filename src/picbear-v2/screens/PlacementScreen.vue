<script setup>
import { computed } from 'vue'
import { state, bestseller, placementOptions, styleById } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { Info, ArrowRight, ShoppingCart, Star, Search } from 'lucide-vue-next'

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

      <!-- Live product page preview (mock storefront) -->
      <div class="pb-card overflow-hidden">
        <!-- browser chrome -->
        <div class="flex items-center gap-1.5 px-3 py-2 bg-[#f2f2f2] border-b border-[#e6e6e6]">
          <span class="w-2 h-2 rounded-full bg-[#ff5f57]"></span>
          <span class="w-2 h-2 rounded-full bg-[#febc2e]"></span>
          <span class="w-2 h-2 rounded-full bg-[#28c840]"></span>
          <div class="ml-2 flex-1 bg-white border border-[#e0e0e0] rounded-full px-2.5 py-0.5 text-[9px] text-[#8a8a8a] truncate">roast-and-co.com/products/signature-roast</div>
        </div>

        <!-- store header -->
        <div class="flex items-center justify-between px-3.5 py-2.5 border-b border-[#f0f0f0]">
          <span class="font-bold text-[13px] tracking-tight text-[#1a1a1a]">Roast &amp; Co</span>
          <nav class="flex items-center gap-3 text-[10px] font-medium text-[#616161]">
            <span>Shop</span><span>Beans</span><span>About</span>
          </nav>
          <div class="flex items-center gap-2 text-[#1a1a1a]">
            <Search :size="13" />
            <ShoppingCart :size="14" />
          </div>
        </div>

        <!-- PDP body -->
        <div class="p-3.5">
          <div class="grid grid-cols-2 gap-3">
            <!-- gallery -->
            <div>
              <div class="rounded-lg overflow-hidden aspect-square mb-1.5" :class="state.placement === 'replace' ? 'ring-2 ring-[#5548e0]' : 'border border-[#f0f0f0]'">
                <StyledImage
                  v-if="state.placement === 'replace'"
                  :src="chosenStyle.img" :overlay="chosenStyle.overlay" ai-tag enhance
                />
                <img v-else :src="bestseller.img" class="w-full h-full object-cover" />
              </div>
              <div class="flex gap-1.5">
                <div class="w-8 h-8 rounded-md overflow-hidden ring-1 ring-[#1a1a1a]"><img :src="bestseller.img" class="w-full h-full object-cover" /></div>
                <div class="w-8 h-8 rounded-md bg-[#ececec]"></div>
                <div class="w-8 h-8 rounded-md bg-[#ececec]"></div>
              </div>
            </div>

            <!-- product info -->
            <div>
              <p class="text-[9px] text-[#8a8a8a] mb-1">Home / Coffee</p>
              <p class="font-bold text-[13px] text-[#1a1a1a] leading-snug">{{ bestseller.name }}</p>
              <div class="flex items-center gap-0.5 mt-1">
                <Star v-for="i in 5" :key="i" :size="10" class="fill-[#eab308] text-[#eab308]" />
                <span class="text-[9px] text-[#8a8a8a] ml-1">412 reviews</span>
              </div>
              <p class="text-[15px] font-bold text-[#1a1a1a] mt-1.5">{{ bestseller.price }}</p>
              <p class="text-[10px] text-[#616161] mt-1.5 leading-relaxed">Smooth, full-bodied house blend with notes of cocoa and toasted nut.</p>
              <div class="flex gap-1.5 mt-2">
                <span class="text-[10px] font-semibold border border-[#1a1a1a] rounded-md px-2 py-0.5">250g</span>
                <span class="text-[10px] font-medium border border-[#dcdcdc] text-[#8a8a8a] rounded-md px-2 py-0.5">1kg</span>
              </div>
              <div class="mt-2.5 h-7 w-full bg-[#1a1a1a] rounded-lg flex items-center justify-center text-white text-[10px] font-semibold">Add to cart</div>
              <p class="text-[9px] text-[#0c6b45] mt-1.5 text-center">In stock · Free shipping over €30</p>
            </div>
          </div>

          <!-- AI image below hero (full width) -->
          <div v-if="state.placement === 'below-hero'" class="rounded-lg overflow-hidden aspect-[16/7] mt-3 ring-2 ring-[#5548e0] pb-fade-in">
            <StyledImage :src="chosenStyle.img" :overlay="chosenStyle.overlay" ai-tag enhance />
          </div>

          <!-- description -->
          <div class="mt-3">
            <p class="font-semibold text-[11px] text-[#1a1a1a] mb-1.5">Description</p>
            <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
            <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
            <div class="h-2 w-4/5 bg-[#ececec] rounded"></div>
          </div>

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
