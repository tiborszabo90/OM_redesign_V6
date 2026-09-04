<script setup>
import { ref, computed } from 'vue'
import { state, products, bestseller, styleById, placementOptions, ratioOptions } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { Pencil, RefreshCw, ArrowRight, Loader2 } from 'lucide-vue-next'

const regenerating = ref(false)

const selectedProducts = computed(() => products.filter(p => state.selected.includes(p.id)))

const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))
// The generated image is the creative picked on the style step.
const creative = computed(() => chosenStyle.value.preview || chosenStyle.value.img)

function regenerate() {
  if (regenerating.value) return
  regenerating.value = true
  setTimeout(() => { regenerating.value = false }, 1500)
}

function next() {
  state.screen = 'batch'
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

      <!-- Summary: what is being fine-tuned, and the choices behind it -->
      <div class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-lg overflow-hidden ring-1 ring-[#e3e3e3] shrink-0">
          <img :src="bestseller.img" class="w-full h-full object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-[#1a1a1a] truncate">{{ bestseller.name }}</p>
          <p class="text-[12px] text-[#616161] truncate">Your bestseller in the {{ chosenStyle.name.toLowerCase() }} look.</p>
        </div>
        <div class="flex items-center gap-2 shrink-0 flex-wrap justify-end">
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
      </div>

      <!-- The generated image on the left, everything you can change on the right -->
      <div class="grid grid-cols-[1fr_360px] gap-4 items-start">

        <!-- Generated image -->
        <div class="pb-card overflow-hidden">
          <!-- The creative picked on the style step, full column width and whole. -->
          <div v-if="regenerating" class="pb-skeleton w-full aspect-square flex items-center justify-center">
            <Loader2 :size="22" class="animate-spin text-[#c9c9c9]" />
          </div>
          <img v-else :src="creative" class="w-full block pb-fade-in" />
        </div>

        <!-- Options -->
        <div class="flex flex-col gap-4">
          <!-- Image ratios -->
          <div class="pb-card p-4">
            <p class="font-semibold text-[#1a1a1a] mb-2">Image ratios</p>
            <label class="flex items-center gap-2 text-[13px] text-[#303030] mb-3 cursor-pointer select-none">
              <input type="checkbox" v-model="state.ratioSame" class="w-4 h-4 accent-[#1a1a1a]" />
              Use same image for desktop and mobile
            </label>
            <div class="flex gap-3">
              <div class="flex-1 min-w-0">
                <label class="text-[12px] font-medium text-[#616161] mb-1 block">Desktop ratio</label>
                <select v-model="state.desktopRatio" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none">
                  <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
              <div class="flex-1 min-w-0" :class="state.ratioSame ? 'opacity-45 pointer-events-none' : ''">
                <label class="text-[12px] font-medium text-[#616161] mb-1 block">Mobile ratio</label>
                <select v-model="state.mobileRatio" :disabled="state.ratioSame" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none">
                  <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- AI instructions -->
          <div class="pb-card p-4">
            <p class="font-semibold text-[#1a1a1a] mb-1">Additional AI instructions <span class="font-normal text-[#8a8a8a]">(optional)</span></p>
            <p class="text-[12px] text-[#616161] mb-2">Applied to this image and every one after it. Tweak it, then regenerate to preview the change.</p>
            <textarea
              v-model="state.instructions"
              rows="3"
              :disabled="regenerating"
              placeholder="e.g. Use a warm outdoor background with natural morning light"
              class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none resize-none disabled:opacity-60 mb-3"
            ></textarea>

            <button class="pb-btn-secondary" :disabled="regenerating" @click="regenerate">
              <Loader2 v-if="regenerating" :size="13" class="animate-spin" />
              <RefreshCw v-else :size="13" />
              {{ regenerating ? 'Generating...' : 'Regenerate image' }}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Sticky action bar -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-white border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          The look applies to every product in this variation.
        </p>

        <div class="shrink-0">
          <button class="pb-btn-primary" @click="next">
            Continue <ArrowRight :size="13" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
