<script setup>
import { computed } from 'vue'
import { bestseller, placementOptions, galleryPositions, insertModes } from '../store'
import StyledImage from './StyledImage.vue'
import { Info, ShoppingCart, Star, Search, ImagePlus } from 'lucide-vue-next'

// Visual placement editor: option cards on the left, a live storefront preview
// on the right whose slots are clickable, so the user places the AI image by
// pointing at their real product page. Shared by onboarding and the Variations page.
const props = defineProps({
  modelValue: { type: String, required: true },       // placement id
  galleryPos: { type: String, default: 'main' },      // gallery slot when placement is 'replace'
  customSelector: { type: String, default: '' },      // CSS selector when placement is 'custom'
  customMode: { type: String, default: 'below' },     // 'above' | 'below' the selector
  styleObj: { type: Object, required: true },         // chosen style { img, overlay }
  product: { type: Object, default: () => bestseller },
  themeNote: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'update:galleryPos', 'update:customSelector', 'update:customMode'])

function select(id) {
  emit('update:modelValue', id)
}

const galleryPosProxy = computed({
  get: () => props.galleryPos,
  set: v => emit('update:galleryPos', v),
})

// Mini gallery-strip illustration per card: 4 cells standing for the product
// gallery order. 'ai' = where the AI image lands (blue), 'img' = another photo,
// 'dots' = the remaining images (always the 3rd cell).
const galleryIllustration = {
  main: ['ai', 'img', 'dots', 'img'],
  second: ['img', 'ai', 'dots', 'img'],
  last: ['img', 'img', 'dots', 'ai'],
}
const customSelectorProxy = computed({
  get: () => props.customSelector,
  set: v => emit('update:customSelector', v),
})
const customModeProxy = computed({
  get: () => props.customMode,
  set: v => emit('update:customMode', v),
})

const isGallery = computed(() => props.modelValue === 'replace')

// The 3 gallery thumbnails as 'ai' | 'orig' | 'empty'. The AI image takes the
// chosen slot; the original photo is always kept in the gallery.
const gallerySlots = computed(() => {
  if (!isGallery.value) return ['orig', 'empty', 'empty']
  if (props.galleryPos === 'second') return ['orig', 'ai', 'empty']
  if (props.galleryPos === 'last') return ['orig', 'empty', 'ai']
  return ['ai', 'orig', 'empty'] // main
})
// In a real gallery the big block shows the active image, so keep the AI photo
// in the hero for every gallery slot — only the thumbnail position changes.
const heroType = computed(() => (isGallery.value ? 'ai' : gallerySlots.value[0]))
</script>

<template>
  <div class="grid grid-cols-[1fr_1.15fr] gap-4">
    <!-- Options -->
    <div class="flex flex-col gap-3">
      <template v-for="opt in placementOptions" :key="opt.id">
        <div
          class="pb-card p-3.5 cursor-pointer"
          :class="modelValue === opt.id ? 'ring-2 ring-[#5548e0] border-transparent!' : 'hover:shadow-md'"
          @click="select(opt.id)"
        >
          <div class="flex items-start gap-3">
            <span
              class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
              :class="modelValue === opt.id ? 'border-[#5548e0]' : 'border-[#c9c9c9]'"
            >
              <span v-if="modelValue === opt.id" class="w-2 h-2 rounded-full bg-[#5548e0]"></span>
            </span>
            <div class="flex-1">
              <p class="font-semibold text-[#1a1a1a] flex items-center gap-2">
                {{ opt.name }}
                <span v-if="opt.recommended" class="text-[10px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-1.5 py-0.5">Recommended</span>
              </p>
              <p class="text-[12px] text-[#616161] mt-0.5">{{ opt.desc }}</p>
            </div>
          </div>

          <!-- Gallery slot selector, part of the Replace card -->
          <div v-if="opt.id === 'replace' && isGallery" class="mt-3.5 pt-3.5 border-t border-[#ececec] pb-fade-in" @click.stop>
            <p class="text-[12px] font-medium text-[#616161] mb-2">Image placement</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="o in galleryPositions" :key="o.value"
                class="rounded-lg border p-2 flex flex-col items-center gap-1.5 cursor-pointer transition-colors"
                :class="galleryPos === o.value ? 'border-[#5548e0] ring-1 ring-[#5548e0] bg-[#f6f5ff]' : 'border-[#ececec] bg-white hover:border-[#c4bdf0]'"
                @click="galleryPosProxy = o.value"
              >
                <div class="w-full rounded-md bg-[#f4f4f5] border border-[#e8e8ec] p-1.5">
                  <div class="flex gap-1">
                    <div
                      v-for="(cell, i) in galleryIllustration[o.value]" :key="i"
                      class="flex-1 aspect-square rounded-[3px] flex items-center justify-center"
                      :class="cell === 'ai' ? 'bg-[#5548e0]' : cell === 'dots' ? 'bg-[#eeeef2]' : 'bg-[#d8d8de]'"
                    >
                      <span v-if="cell === 'dots'" class="flex gap-[2px]">
                        <span class="w-[3px] h-[3px] rounded-full bg-[#9a9aa2]"></span>
                        <span class="w-[3px] h-[3px] rounded-full bg-[#9a9aa2]"></span>
                        <span class="w-[3px] h-[3px] rounded-full bg-[#9a9aa2]"></span>
                      </span>
                    </div>
                  </div>
                </div>
                <span class="text-[11px] font-medium text-center leading-tight" :class="galleryPos === o.value ? 'text-[#3a3468]' : 'text-[#616161]'">{{ o.label }}</span>
              </button>
            </div>
            <p class="text-[12px] text-[#616161] mt-2">Your original product image is always kept.</p>
          </div>

          <!-- Custom CSS selector, part of the Custom card -->
          <div v-if="opt.id === 'custom' && modelValue === 'custom'" class="mt-3.5 pt-3.5 border-t border-[#ececec] pb-fade-in" @click.stop>
            <label class="text-[12px] font-medium text-[#616161] block mb-1">CSS selector</label>
            <input
              v-model="customSelectorProxy"
              type="text"
              placeholder="e.g. .product__description"
              class="pb-field w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none"
            />
            <label class="text-[12px] font-medium text-[#616161] block mt-2.5 mb-1">Insert mode</label>
            <select
              v-model="customModeProxy"
              class="pb-field w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none"
            >
              <option v-for="m in insertModes" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
        </div>
      </template>

      <div v-if="themeNote" class="rounded-xl bg-[#f7f7f7] border border-[#ececec] px-3.5 py-2.5 flex items-center gap-2 text-[12px] text-[#616161]">
        <Info :size="13" class="shrink-0" />
        Click a spot on the preview to place the image, or target any element with a custom selector.
      </div>
    </div>

    <!-- Live product page preview (mock storefront) -->
    <div class="pb-card overflow-hidden self-start">
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
            <div
              class="rounded-lg overflow-hidden aspect-square mb-1.5 relative group cursor-pointer"
              :class="isGallery ? 'ring-2 ring-[#5548e0]' : 'border border-[#f0f0f0]'"
              @click="select('replace')"
            >
              <StyledImage
                v-if="heroType === 'ai'"
                :src="styleObj.img" :overlay="styleObj.overlay" ai-tag enhance
              />
              <template v-else>
                <img :src="product.img" class="w-full h-full object-cover" />
                <div v-if="!isGallery" class="absolute inset-0 flex items-center justify-center bg-[#5548e0]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="text-[10px] font-semibold text-white bg-[#5548e0] rounded-md px-2 py-1 flex items-center gap-1">
                    <ImagePlus :size="12" /> Replace with AI
                  </span>
                </div>
              </template>
            </div>
            <div class="flex gap-1.5">
              <div
                v-for="(slot, i) in gallerySlots" :key="i"
                class="w-8 h-8 rounded-md overflow-hidden relative"
                :class="slot === 'ai' ? 'ring-2 ring-[#5548e0]' : slot === 'orig' ? 'ring-1 ring-[#1a1a1a]' : 'bg-[#ececec]'"
              >
                <StyledImage v-if="slot === 'ai'" :src="styleObj.img" :overlay="styleObj.overlay" enhance compact />
                <img v-else-if="slot === 'orig'" :src="product.img" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- product info -->
          <div>
            <p class="text-[9px] text-[#8a8a8a] mb-1">Home / Coffee</p>
            <p class="font-bold text-[13px] text-[#1a1a1a] leading-snug">{{ product.name }}</p>
            <div class="flex items-center gap-0.5 mt-1">
              <Star v-for="i in 5" :key="i" :size="10" class="fill-[#eab308] text-[#eab308]" />
              <span class="text-[9px] text-[#8a8a8a] ml-1">412 reviews</span>
            </div>
            <p class="text-[15px] font-bold text-[#1a1a1a] mt-1.5">{{ product.price }}</p>
            <p class="text-[10px] text-[#616161] mt-1.5 leading-relaxed">Smooth, full-bodied house blend with notes of cocoa and toasted nut.</p>
            <div class="flex gap-1.5 mt-2">
              <span class="text-[10px] font-semibold border border-[#1a1a1a] rounded-md px-2 py-0.5">250g</span>
              <span class="text-[10px] font-medium border border-[#dcdcdc] text-[#8a8a8a] rounded-md px-2 py-0.5">1kg</span>
            </div>
            <div class="mt-2.5 h-7 w-full bg-[#1a1a1a] rounded-lg flex items-center justify-center text-white text-[10px] font-semibold">Add to cart</div>
            <p class="text-[9px] text-[#0c6b45] mt-1.5 text-center">In stock · Free shipping over €30</p>
          </div>
        </div>

        <!-- Below-hero slot -->
        <div
          v-if="modelValue === 'below-hero'"
          class="rounded-lg overflow-hidden aspect-[16/7] mt-3 ring-2 ring-[#5548e0] pb-fade-in cursor-pointer"
          @click="select('below-hero')"
        >
          <StyledImage :src="styleObj.img" :overlay="styleObj.overlay" ai-tag enhance />
        </div>

        <!-- description -->
        <div class="mt-3">
          <p class="font-semibold text-[11px] text-[#1a1a1a] mb-1.5">Description</p>
          <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
          <div class="h-2 w-full bg-[#ececec] rounded mb-1"></div>
          <div class="h-2 w-4/5 bg-[#ececec] rounded"></div>
        </div>

        <!-- Below-description slot -->
        <div
          v-if="modelValue === 'below-desc'"
          class="rounded-lg overflow-hidden aspect-[16/7] mt-2 ring-2 ring-[#5548e0] pb-fade-in cursor-pointer"
          @click="select('below-desc')"
        >
          <StyledImage :src="styleObj.img" :overlay="styleObj.overlay" ai-tag enhance />
        </div>

        <!-- Custom-selector slot -->
        <template v-if="modelValue === 'custom'">
          <div class="rounded-lg overflow-hidden aspect-[16/7] mt-2 ring-2 ring-[#5548e0] pb-fade-in">
            <StyledImage :src="styleObj.img" :overlay="styleObj.overlay" ai-tag enhance />
          </div>
          <p class="text-[9px] text-[#8a8a8a] mt-1 text-center">
            Inserted {{ customMode }}
            <span class="font-mono text-[#5548e0]">{{ customSelector || '.your-selector' }}</span>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
