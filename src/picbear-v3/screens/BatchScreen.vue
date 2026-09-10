<script setup>
import { ref, computed } from 'vue'
import { state, products, bestseller, styleById, placementOptions, startVariationBatch } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import GenerateLimit from '../components/GenerateLimit.vue'
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const selectedProducts = computed(() => products.filter(p => state.selected.includes(p.id)))

const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === state.placement))
// The image fine-tuned on the previous step, shown here as the sample.
const creative = computed(() => chosenStyle.value.preview || chosenStyle.value.img)

// How many of the selected products to generate now; the rest stay queued.
const batchLimit = ref(selectedProducts.value.length)

// The list is paginated so the page stays a summary, not an endless scroll.
const PAGE = 25
const page = ref(0)
const pageCount = computed(() => Math.max(1, Math.ceil(selectedProducts.value.length / PAGE)))
const pageStart = computed(() => page.value * PAGE)
const pageProducts = computed(() => selectedProducts.value.slice(pageStart.value, pageStart.value + PAGE))

function step(d) {
  page.value = Math.min(Math.max(page.value + d, 0), pageCount.value - 1)
}

// Starting the batch hands off to the new variation's page, where it renders.
function start() {
  startVariationBatch(batchLimit.value)
}
</script>

<template>
  <div class="min-h-full flex flex-col">
    <div class="flex-1 py-5">
      <div class="max-w-[960px] mx-auto px-6">
        <WizardHeader
          :step="5"
          title="Generate your images"
          subtitle="Your look is set. Pick the size of the first batch and start it."
          back-to="generate"
        />

        <div class="pb-card p-5 mb-4">
          <GenerateLimit :remaining="selectedProducts.length" v-model="batchLimit" />
        </div>

        <!-- The sample from the previous step, with the choices behind it -->
        <div class="pb-card p-5 mb-4">
          <p class="font-semibold text-[#1a1a1a] mb-3">Sample from the previous step</p>
          <div class="flex items-center gap-4 flex-wrap">
            <div class="flex items-center gap-2.5 shrink-0">
              <div class="w-16 h-16 rounded-lg overflow-hidden relative ring-1 ring-[#e3e3e3]">
                <img :src="bestseller.img" class="w-full h-full object-cover" />
                <span class="absolute bottom-1 left-1 text-[9px] font-semibold bg-white/90 rounded px-1">Before</span>
              </div>
              <ArrowRight :size="14" class="text-[#8a8a8a]" />
              <div class="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-[#f2d9c9]">
                <img :src="creative" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-[#1a1a1a] truncate">{{ bestseller.name }}</p>
              <p class="text-[12px] text-[#616161]">Every product in this batch is generated in this look.</p>
            </div>
            <div class="flex items-center gap-2 flex-wrap shrink-0">
              <span class="pb-chip">Style: {{ chosenStyle.name }}</span>
              <span class="pb-chip">Placement: {{ chosenPlacement.name }}</span>
              <span class="pb-chip">Ratio: {{ state.desktopRatio }}</span>
            </div>
          </div>
        </div>

        <!-- The prompt that goes out with the batch -->
        <div class="pb-card p-5 mb-4">
          <p class="font-semibold text-[#1a1a1a] mb-1">Additional AI instructions <span class="font-normal text-[#8a8a8a]">(optional)</span></p>
          <p class="text-[12px] text-[#616161] mb-2">These instructions are applied to every product in this variation.</p>
          <textarea
            v-model="state.instructions"
            rows="3"
            placeholder="e.g. Use a warm outdoor background with natural morning light"
            class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none resize-none"
          ></textarea>
        </div>

        <!-- What the batch runs on, in the order it runs -->
        <div class="pb-card p-5">
          <div class="flex items-center justify-between gap-3 mb-3">
            <p class="font-semibold text-[#1a1a1a]">Products in this variation</p>
            <p class="text-[12px] text-[#616161]">
              {{ batchLimit }} in this batch · {{ selectedProducts.length - batchLimit }} queued
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <div
              v-for="(p, i) in pageProducts" :key="p.id"
              class="flex items-center gap-3 rounded-lg border border-[#ececec] px-3 py-2"
            >
              <div class="w-9 h-9 rounded-md overflow-hidden ring-1 ring-[#e3e3e3] shrink-0">
                <img :src="p.img" class="w-full h-full object-cover" />
              </div>
              <p class="flex-1 min-w-0 text-[13px] text-[#1a1a1a] truncate">{{ p.name }}</p>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                :class="pageStart + i < batchLimit ? 'bg-[#fdf4ef] text-[#6b3319]' : 'bg-[#f1f1f1] text-[#616161]'"
              >{{ pageStart + i < batchLimit ? 'In this batch' : 'Queued' }}</span>
            </div>
          </div>

          <div v-if="pageCount > 1" class="flex items-center justify-center gap-2 mt-3">
            <button
              class="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-[#d4d4d4] bg-white text-[#303030] shadow-[0_1px_0_rgba(0,0,0,0.06)] hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-default cursor-pointer"
              :disabled="page === 0" @click="step(-1)" aria-label="Previous page"
            >
              <ChevronLeft :size="15" class="shrink-0" />
            </button>
            <span class="text-[12px] text-[#616161] tabular-nums px-1">
              {{ pageStart + 1 }}–{{ pageStart + pageProducts.length }} of {{ selectedProducts.length }}
            </span>
            <button
              class="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-[#d4d4d4] bg-white text-[#303030] shadow-[0_1px_0_rgba(0,0,0,0.06)] hover:bg-[#fafafa] disabled:opacity-40 disabled:cursor-default cursor-pointer"
              :disabled="page >= pageCount - 1" @click="step(1)" aria-label="Next page"
            >
              <ChevronRight :size="15" class="shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky action bar -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-white border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          The batch starts on the variation page. You can top up the rest any time.
        </p>

        <button class="pb-btn-primary shrink-0" @click="start">
          <Sparkles :size="13" /> Start generation
        </button>
      </div>
    </div>
  </div>
</template>
