<script setup>
import { ref, computed } from 'vue'
import { state, products, bestseller, styleById, placementOptions, ratioOptions, ratioCss, startVariationBatch } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import GenerateLimit from '../components/GenerateLimit.vue'
import { ArrowRight, Pencil, RefreshCw, Check, Loader2 } from 'lucide-vue-next'

const regenerating = ref(false)

const selectedProducts = computed(() => products.filter(p => state.selected.includes(p.id)))

// Both onboarding and a live account pick how many of the selected products to
// generate now; the rest stay queued in the variation.
const batchLimit = ref(selectedProducts.value.length)
const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))

function regenerate() {
  if (regenerating.value) return
  regenerating.value = true
  setTimeout(() => { regenerating.value = false }, 1500)
}

// Wrapping up hands off to the new variation's page, where the batch renders.
function done() {
  startVariationBatch(batchLimit.value)
}

function edit(screen) {
  state.screen = screen
}
</script>

<template>
  <!-- Column layout so the action bar sits at the bottom on short pages too. -->
  <div class="min-h-full flex flex-col">
    <div class="flex-1 py-5">
      <div class="max-w-[960px] mx-auto px-6">
      <WizardHeader
        :step="4"
        title="Fine-tune your image"
        subtitle="Your bestseller is already rendered in the look you picked. Tweak it, then pick how many products to generate now."
        back-to="products"
      />

      <!-- Summary -->
      <div class="pb-card px-4 py-3 mb-4 flex items-center gap-2 flex-wrap">
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 cursor-pointer" @click="edit('style')">
          Style: {{ chosenStyle.name }} <Pencil :size="10" class="text-[#8a8a8a]" />
        </span>
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 cursor-pointer" @click="edit('placement')">
          Placement: {{ chosenPlacement.name }} <Pencil :size="10" class="text-[#8a8a8a]" />
        </span>
        <span class="text-[12px] font-semibold text-[#1a1a1a] bg-[#f1f1f1] rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 cursor-pointer" @click="edit('products')">
          {{ selectedProducts.length }} products <Pencil :size="10" class="text-[#8a8a8a]" />
        </span>
      </div>

      <!-- Image ratios -->
      <div class="pb-card p-4 mb-4">
        <p class="font-semibold text-[#1a1a1a] mb-2">Image ratios</p>
        <label class="flex items-center gap-2 text-[13px] text-[#303030] mb-3 cursor-pointer select-none">
          <input type="checkbox" v-model="state.ratioSame" class="w-4 h-4 accent-[#b2592e]" />
          Use same image for desktop and mobile
        </label>
        <div class="flex gap-3 max-w-[420px]">
          <div class="flex-1">
            <label class="text-[12px] font-medium text-[#616161] mb-1 block">Desktop ratio</label>
            <select v-model="state.desktopRatio" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none focus:border-[#b2592e]">
              <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <div class="flex-1" :class="state.ratioSame ? 'opacity-45 pointer-events-none' : ''">
            <label class="text-[12px] font-medium text-[#616161] mb-1 block">Mobile ratio</label>
            <select v-model="state.mobileRatio" :disabled="state.ratioSame" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none focus:border-[#b2592e]">
              <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- AI instructions -->
      <div class="pb-card p-4 mb-4">
        <p class="font-semibold text-[#1a1a1a] mb-1">Additional AI instructions <span class="font-normal text-[#8a8a8a]">(optional)</span></p>
        <p class="text-[12px] text-[#616161] mb-2">Applied to this image and every one after it. Tweak it, then regenerate to preview the change.</p>
        <textarea
          v-model="state.instructions"
          rows="2"
          :disabled="regenerating"
          placeholder="e.g. Use a warm outdoor background with natural morning light"
          class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none focus:border-[#b2592e] resize-none disabled:opacity-60 mb-3"
        ></textarea>

        <button class="pb-btn-secondary" :disabled="regenerating" @click="regenerate">
          <Loader2 v-if="regenerating" :size="13" class="animate-spin" />
          <RefreshCw v-else :size="13" />
          {{ regenerating ? 'Generating...' : 'Regenerate image' }}
        </button>
      </div>

      <!-- Generated image pb-card -->
      <div class="pb-card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="font-semibold text-[#1a1a1a]">{{ bestseller.name }}</p>
            <p class="text-[12px] text-[#616161]">Your bestseller in the {{ chosenStyle.name.toLowerCase() }} look. Fine-tune it before we apply the look to the rest.</p>
          </div>
          <span class="text-[11px] font-semibold text-[#6b3319] bg-[#fdf4ef] border border-[#f2d9c9] rounded-full px-2 py-0.5">Preview</span>
        </div>

        <div class="flex items-center justify-center gap-6">
          <!-- before -->
          <div class="shrink-0 text-center">
            <div class="w-56 h-56 rounded-xl overflow-hidden ring-1 ring-[#e3e3e3] relative">
              <img :src="bestseller.img" class="w-full h-full object-cover" />
              <span class="absolute bottom-1.5 left-1.5 text-[11px] font-semibold bg-white/90 rounded px-1.5 py-0.5">Before</span>
            </div>
          </div>
          <ArrowRight :size="22" class="text-[#8a8a8a] shrink-0" />
          <!-- after (already generated) -->
          <div
            class="shrink-0 w-96 rounded-xl overflow-hidden ring-1 ring-[#f2d9c9] relative"
            :style="{ aspectRatio: ratioCss(state.desktopRatio) }"
          >
            <div v-if="regenerating" class="absolute inset-0 pb-skeleton flex items-center justify-center">
              <Loader2 :size="22" class="animate-spin text-[#c9c9c9]" />
            </div>
            <div v-else class="absolute inset-0 pb-fade-in">
              <StyledImage :src="bestseller.img" :overlay="chosenStyle.overlay" ai-tag enhance />
            </div>
          </div>
        </div>
      </div>

      <!-- How many of the selected products to generate now -->
      <div class="pb-card p-5 mt-4">
        <GenerateLimit :remaining="selectedProducts.length" v-model="batchLimit" />
      </div>
      </div>
    </div>

    <!-- Sticky action bar -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-[#f1f1f1]/90 backdrop-blur border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          The batch starts on the variation page. You can top up the rest any time.
        </p>

        <div class="shrink-0">
          <button class="pb-btn-primary" @click="done">
            <Check :size="13" /> Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
