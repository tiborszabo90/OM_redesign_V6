<script setup>
import { ref, computed } from 'vue'
import { state, products, bestseller } from '../store'
import { PawPrint, ChevronRight, ArrowUpRight, Search, ShoppingBag } from 'lucide-vue-next'

// picbear-current mirror of the currently-live first-upgrade Preview step
// (app.onboarding.preview.tsx): Content / Placement tabs on the left, a live
// storefront preview on the right, and a ratio summary. Localized to the coffee demo.
const brand = 'roast-and-co'

// Lifestyle "generated" previews cycled per product so switching products shows
// a different AI image would be produced.
const generatedPool = [
  '/picbear/people-latte.jpg', '/picbear/people-kitchen.jpg', '/picbear/lattes-plants.jpg',
  '/picbear/pouring.jpg', '/picbear/machine-counter.jpg', '/picbear/cold-brew.jpg',
]

// Product switcher: preview what image would be generated for any catalog product.
const selectedId = ref(bestseller.id)
const product = computed(() => products.find(p => p.id === selectedId.value) || bestseller)
const generatedImg = computed(() => {
  const idx = products.findIndex(p => p.id === selectedId.value)
  return generatedPool[(idx < 0 ? 0 : idx) % generatedPool.length]
})

const panel = ref('content')     // content | placement
const device = ref('desktop')

const instructions = ref('')
const sameImage = ref(true)
const desktopRatio = ref('1:1')
const mobileRatio = ref('1:1')
const ratios = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9']

const position = ref('below_hero')
const positions = [
  { value: 'replace_hero', label: 'Replace hero', helper: 'Swap the existing hero image' },
  { value: 'below_hero', label: 'Below hero', helper: 'Insert under the product gallery' },
  { value: 'below_description', label: 'Below description', helper: 'Insert under the product description' },
  { value: 'custom', label: 'Custom', helper: 'Specify a CSS selector manually' },
]

const features = [
  'Slow-roasted in small batches for a balanced, smooth cup',
  'Single-origin beans, ethically sourced from family farms',
  'Freshly roasted to order and shipped within 24 hours',
  'Works for pour-over, espresso, and everything in between',
]

function back() {
  state.screen = 'products'
}
function generateAll() {
  state.screen = 'review'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Breadcrumb header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
          <PawPrint :size="15" class="text-white" />
        </span>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="back">Back</button>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">Preview</h1>
      </div>
      <div class="flex items-center gap-2">
        <button class="pb-btn-primary" @click="generateAll">Looks good — generate all</button>
      </div>
    </div>

    <!-- Intro + product switcher -->
    <div class="pb-card p-4 mb-4 flex items-center gap-2 flex-wrap">
      <span class="text-[13px] text-[#1a1a1a]">Editing</span>
      <select
        v-model="selectedId"
        class="text-[13px] font-semibold text-[#1a1a1a] border border-[#c9cccf] rounded-md pl-2.5 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#5548e0]"
      >
        <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <span class="text-[13px] text-[#6d7175]">— preview the image that would be generated across desktop and mobile.</span>
    </div>

    <!-- Two-column editor: controls 1/3, preview 2/3 -->
    <div class="pb-card p-5 mb-4 grid grid-cols-[1fr_2fr] gap-5">
      <!-- Left: Content / Placement -->
      <div>
        <div class="flex items-center gap-5 border-b border-[#ececec] mb-4">
          <button
            class="text-[14px] pb-2.5 -mb-px border-b-[3px] cursor-pointer"
            :class="panel === 'content' ? 'border-[#008060] text-[#202223] font-bold' : 'border-transparent text-[#6d7175] font-medium'"
            @click="panel = 'content'"
          >Content</button>
          <button
            class="text-[14px] pb-2.5 -mb-px border-b-[3px] cursor-pointer"
            :class="panel === 'placement' ? 'border-[#008060] text-[#202223] font-bold' : 'border-transparent text-[#6d7175] font-medium'"
            @click="panel = 'placement'"
          >Placement</button>
        </div>

        <!-- Content tab -->
        <div v-if="panel === 'content'">
          <h2 class="text-[20px] font-bold text-[#1a1a1a] mb-3">Image</h2>
          <p class="text-[12px] text-[#6d7175] mb-1">Additional instructions</p>
          <textarea
            v-model="instructions"
            rows="3"
            class="w-full px-3 py-2 rounded-md border border-[#c9cccf] text-[14px] resize-y focus:outline-none focus:border-[#5548e0] mb-3"
          ></textarea>
          <button class="pb-btn-secondary mb-5">Regenerate</button>

          <div class="text-[14px] font-bold text-[#1a1a1a] mb-2">Image ratios</div>
          <label class="flex items-center gap-2 text-[13px] text-[#1a1a1a] mb-3 cursor-pointer">
            <input type="checkbox" v-model="sameImage" class="accent-[#008060]" />
            Use same image for desktop and mobile
          </label>

          <p class="text-[12px] text-[#6d7175] mb-1">Desktop ratio</p>
          <select v-model="desktopRatio" class="w-full text-[14px] border border-[#c9cccf] rounded-md px-3 py-2 bg-white cursor-pointer">
            <option v-for="r in ratios" :key="r" :value="r">{{ r }}</option>
          </select>

          <template v-if="!sameImage">
            <p class="text-[12px] text-[#6d7175] mb-1 mt-3">Mobile ratio</p>
            <select v-model="mobileRatio" class="w-full text-[14px] border border-[#c9cccf] rounded-md px-3 py-2 bg-white cursor-pointer">
              <option v-for="r in ratios" :key="r" :value="r">{{ r }}</option>
            </select>
          </template>
        </div>

        <!-- Placement tab -->
        <div v-else>
          <div class="text-[13px] font-bold text-[#1a1a1a] mb-3">Image position</div>
          <div class="flex flex-col gap-2">
            <button
              v-for="p in positions" :key="p.value"
              class="text-left rounded-lg border p-3 cursor-pointer"
              :class="position === p.value ? 'border-2 border-[#008060] bg-[#f1f8f5]' : 'border-[#e1e3e5] hover:border-[#c9c9c9]'"
              @click="position = p.value"
            >
              <p class="text-[13px] font-semibold text-[#1a1a1a]">{{ p.label }}</p>
              <p class="text-[12px] text-[#6d7175] mt-0.5">{{ p.helper }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: storefront preview -->
      <div>
        <div class="flex items-center justify-between border-b border-[#ececec] mb-0">
          <div class="flex items-center gap-4">
            <button
              class="text-[14px] pb-2.5 -mb-px border-b-[3px] cursor-pointer"
              :class="device === 'desktop' ? 'border-[#008060] text-[#202223] font-bold' : 'border-transparent text-[#6d7175] font-medium'"
              @click="device = 'desktop'"
            >Desktop</button>
            <button
              class="text-[14px] pb-2.5 -mb-px border-b-[3px] cursor-pointer"
              :class="device === 'mobile' ? 'border-[#008060] text-[#202223] font-bold' : 'border-transparent text-[#6d7175] font-medium'"
              @click="device = 'mobile'"
            >Mobile</button>
          </div>
          <div class="flex items-center gap-3 text-[12px] text-[#6d7175]">
            <span>{{ device === 'desktop' ? '1280 × 960' : '430 × 932' }}</span>
            <a href="#" class="flex items-center gap-0.5 text-[#008060] font-semibold">Live preview <ArrowUpRight :size="12" /></a>
          </div>
        </div>

        <!-- Storefront mock -->
        <div class="border border-[#ececec] border-t-0 rounded-b-lg overflow-hidden max-h-[440px] overflow-y-auto" :class="device === 'mobile' ? 'max-w-[390px] mx-auto' : ''">
          <div class="bg-[#1a1a1a] text-white flex items-center px-4 h-10 text-[12px] sticky top-0">
            <div class="flex items-center gap-4"><span>Home</span><span>Catalog</span><span>Contact</span></div>
            <span class="flex-1 text-center font-semibold">{{ brand }}</span>
            <div class="flex items-center gap-3"><Search :size="14" /><ShoppingBag :size="14" /></div>
          </div>
          <div class="flex gap-5 p-5 bg-white" :class="device === 'mobile' ? 'flex-col' : ''">
            <div class="rounded-lg overflow-hidden bg-[#f6f6f6]" :class="device === 'mobile' ? 'w-full' : 'w-1/2 shrink-0'">
              <img :src="generatedImg" alt="" class="w-full object-cover aspect-square" />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-[22px] font-bold leading-tight text-[#1a1a1a] mb-1.5">{{ product.name }}</h2>
              <p class="text-[12px] text-[#616161] mb-2">{{ brand }}</p>
              <p class="text-[15px] font-semibold text-[#1a1a1a]">{{ product.price }}</p>
              <p class="text-[11px] text-[#8a8a8a] mb-3">Tax included.</p>
              <button class="w-full border border-[#1a1a1a] rounded-lg py-2 text-[12px] font-semibold mb-2 cursor-pointer hover:bg-[#f6f6f6]">Add to cart</button>
              <button class="w-full bg-[#1a1a1a] text-white rounded-lg py-2 text-[12px] font-semibold mb-4 cursor-pointer hover:bg-[#333]">Buy it now</button>
              <p class="text-[13px] font-bold text-[#1a1a1a] mb-1.5">Slow-roasted for the flavour you keep coming back for</p>
              <p class="text-[12px] text-[#4a4a4a] leading-relaxed mb-3">
                {{ product.name }} is balanced, smooth and endlessly drinkable — great in your morning
                pour-over and just as good as an afternoon espresso.
              </p>
              <p class="text-[12px] font-bold text-[#1a1a1a] mb-1">Key Features:</p>
              <ul class="text-[12px] text-[#4a4a4a] list-disc pl-4 space-y-0.5">
                <li v-for="f in features" :key="f">{{ f }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ratio summary -->
    <div class="pb-card p-4">
      <p class="text-[13px] text-[#1a1a1a]"><span class="font-semibold">Desktop ratio:</span> {{ desktopRatio }}</p>
      <p class="text-[13px] text-[#1a1a1a] mt-1"><span class="font-semibold">Mobile ratio:</span> {{ sameImage ? desktopRatio : mobileRatio }}</p>
    </div>
  </div>
</template>
