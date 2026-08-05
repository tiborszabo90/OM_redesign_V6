<script setup>
import { ref, computed } from 'vue'
import { state, products, styleById, placementOptions, ratioOptions, variationBatches } from '../store'
import StyledImage from '../components/StyledImage.vue'
import PlacementEditor from '../components/PlacementEditor.vue'
import { ArrowLeft, ArrowRight, Check, RefreshCw, Loader2, Star, SlidersHorizontal, LayoutTemplate, Tag, Zap } from 'lucide-vue-next'

// Variation settings, opened from the Edit settings button: a menu on the left,
// one sub-page per entry (own URL). Fine-tune is first and the default entry.
const menu = [
  { section: 'image', label: 'Fine-tune', icon: SlidersHorizontal },
  { section: 'placement', label: 'Placement', icon: LayoutTemplate },
  { section: 'products', label: 'Products', icon: Tag },
  { section: 'automation', label: 'Automation', icon: Zap },
]

const batch = computed(() => variationBatches.find(b => b.id === state.openVariation) || null)
const batchProducts = computed(() => (batch.value ? products.filter(p => batch.value.productIds.includes(p.id)) : []))
const hero = computed(() => batchProducts.value[0] || products[0])
const currentStyle = computed(() => styleById(batch.value?.styleId) || styleById('lifestyle'))
const chosenPlacement = computed(() => placementOptions.find(o => o.id === batch.value?.placement))
const autoCount = computed(() => [batch.value?.autoAdd, batch.value?.autoPublish].filter(Boolean).length)
const activeItem = computed(() => menu.find(m => m.section === state.editSection) || menu[0])

const regenerating = ref(false)
const ranked = computed(() => [...products].sort((a, b) => b.sales - a.sales))

function regenerateAll() {
  if (regenerating.value) return
  regenerating.value = true
  setTimeout(() => { regenerating.value = false }, 1600)
}

function go(section) {
  state.editSection = section
}

function toggleProduct(id) {
  const ids = batch.value.productIds
  const i = ids.indexOf(id)
  if (i >= 0) {
    if (ids.length > 1) ids.splice(i, 1)
  } else {
    ids.push(id)
  }
}

function backToVariation() {
  state.editSection = null
}
</script>

<template>
  <div v-if="batch" class="max-w-[1200px] mx-auto px-6 py-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-1.5 text-[13px] min-w-0">
        <button class="pb-btn-ghost -ml-2" @click="backToVariation">
          <ArrowLeft :size="14" /> {{ batch.name }}
        </button>
        <span class="text-[#8a8a8a]">/</span>
        <span class="font-semibold text-[#1a1a1a] truncate">{{ activeItem.label }}</span>
      </div>
      <button class="pb-btn-primary" @click="backToVariation"><Check :size="13" /> Done</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-4 items-start">
      <!-- Settings menu -->
      <nav class="pb-card p-2 flex md:flex-col gap-1 overflow-x-auto">
        <button
          v-for="m in menu" :key="m.section"
          class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-left whitespace-nowrap cursor-pointer"
          :class="state.editSection === m.section ? 'bg-[#f6f5ff] text-[#1a1a1a]' : 'text-[#616161] hover:bg-[#f7f7f7]'"
          @click="go(m.section)"
        >
          <component
            :is="m.icon" :size="15"
            class="shrink-0"
            :class="state.editSection === m.section ? 'text-[#5548e0]' : 'text-[#8a8a8a]'"
          />
          {{ m.label }}
        </button>
      </nav>

      <!-- Placement -->
      <div v-if="state.editSection === 'placement'" class="pb-card p-5">
        <p class="font-semibold text-[#1a1a1a]">Choose where the image appears</p>
        <p class="text-[12px] text-[#616161] mb-4">
          Currently {{ chosenPlacement.name.toLowerCase() }}. Click a spot on your live product page to move it.
        </p>
        <PlacementEditor
          v-model="batch.placement"
          v-model:gallery-pos="batch.galleryPos"
          v-model:custom-selector="batch.customSelector"
          v-model:custom-mode="batch.customMode"
          :style-obj="currentStyle"
        />
      </div>

      <!-- Products -->
      <div v-else-if="state.editSection === 'products'" class="pb-card p-5">
        <p class="font-semibold text-[#1a1a1a]">Products in this variation</p>
        <p class="text-[12px] text-[#616161] mb-4">
          {{ batchProducts.length }} of {{ products.length }} products get an image in the {{ currentStyle.name.toLowerCase() }} look.
        </p>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="p in ranked" :key="p.id"
            class="rounded-xl border overflow-hidden cursor-pointer relative"
            :class="batch.productIds.includes(p.id) ? 'border-[#5548e0]' : 'border-[#ececec] hover:border-[#c3bdf5]'"
            @click="toggleProduct(p.id)"
          >
            <span
              class="absolute top-2 left-2 z-10 w-5 h-5 rounded-md flex items-center justify-center"
              :class="batch.productIds.includes(p.id) ? 'bg-[#5548e0]' : 'bg-white/90 border border-[#d4d4d4]'"
            >
              <Check v-if="batch.productIds.includes(p.id)" :size="13" class="text-white" />
            </span>
            <span v-if="p.bestseller" class="absolute top-2 right-2 z-10 text-[10px] font-semibold bg-white/90 rounded-full px-1.5 py-0.5 inline-flex items-center gap-1">
              <Star :size="9" class="text-[#eab308]" /> #1
            </span>
            <div class="aspect-square">
              <img :src="p.img" class="w-full h-full object-cover" />
            </div>
            <div class="p-2.5">
              <p class="text-[13px] font-semibold text-[#1a1a1a] truncate">{{ p.name }}</p>
              <p class="text-[12px] text-[#616161]">{{ p.price }} · {{ p.sales }} sold</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Automation -->
      <div v-else-if="state.editSection === 'automation'" class="pb-card p-5">
        <p class="font-semibold text-[#1a1a1a]">Automation</p>
        <p class="text-[12px] text-[#616161] mb-2">What Picbear does on its own for this variation.</p>
        <div class="divide-y divide-[#ececec] max-w-[560px]">
          <div class="flex items-center gap-4 py-3">
            <div class="flex-1">
              <p class="font-medium text-[#1a1a1a] text-[13px]">Add new products automatically</p>
              <p class="text-[12px] text-[#616161] mt-0.5">New products get an image in this look, no prompting needed.</p>
            </div>
            <span
              class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer"
              :class="batch.autoAdd ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
              @click="batch.autoAdd = !batch.autoAdd"
            >
              <span class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300" :class="batch.autoAdd ? 'left-[18px]' : 'left-[2px]'"></span>
            </span>
          </div>
          <div class="flex items-center gap-4 py-3">
            <div class="flex-1">
              <p class="font-medium text-[#1a1a1a] text-[13px]">Publish without review</p>
              <p class="text-[12px] text-[#616161] mt-0.5">Skip manual review for images in this variation.</p>
            </div>
            <span
              class="w-9 h-[20px] rounded-full transition-colors duration-300 relative shrink-0 cursor-pointer"
              :class="batch.autoPublish ? 'bg-[#36c98e]' : 'bg-[#d4d4d4]'"
              @click="batch.autoPublish = !batch.autoPublish"
            >
              <span class="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow transition-all duration-300" :class="batch.autoPublish ? 'left-[18px]' : 'left-[2px]'"></span>
            </span>
          </div>
        </div>
      </div>

      <!-- Fine-tune (default) -->
      <div v-else>
        <div class="mb-4">
          <h1 class="text-xl font-bold text-[#1a1a1a]">Fine-tune your image</h1>
          <p class="text-[13px] text-[#616161] mt-1">
            This variation is already rendered in the look you picked. Tweak it here, then apply the change to every product in it.
          </p>
        </div>

        <!-- Summary (read-only) -->
        <div class="pb-card px-4 py-3 mb-4 flex items-center gap-2 flex-wrap">
          <span class="pb-chip">Style: {{ currentStyle.name }}</span>
          <span class="pb-chip">Placement: {{ chosenPlacement.name }}</span>
          <span class="pb-chip">{{ batchProducts.length }} products</span>
          <span class="pb-chip">Automation: {{ autoCount ? `${autoCount} on` : 'off' }}</span>
        </div>

        <!-- AI instructions -->
        <div class="pb-card p-4 mb-4">
          <p class="font-semibold text-[#1a1a1a] mb-1">Additional AI instructions <span class="font-normal text-[#8a8a8a]">(optional)</span></p>
          <p class="text-[12px] text-[#616161] mb-2">Applied to every image in this variation. Tweak it, then regenerate to preview the change.</p>
          <textarea
            v-model="batch.instructions"
            rows="2"
            :disabled="regenerating"
            placeholder="e.g. Use a warm outdoor background with natural morning light"
            class="w-full rounded-lg border border-[#d4d4d4] px-3 py-2 text-[13px] outline-none focus:border-[#5548e0] resize-none disabled:opacity-60"
          ></textarea>
        </div>

        <!-- Generated image -->
        <div class="pb-card p-5 mb-4">
          <div class="flex items-center justify-between mb-4 gap-3">
            <div class="min-w-0">
              <p class="font-semibold text-[#1a1a1a] truncate">{{ hero.name }}</p>
              <p class="text-[12px] text-[#616161]">This variation in the {{ currentStyle.name.toLowerCase() }} look. Fine-tune it before we apply the change to the rest.</p>
            </div>
            <span class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5 shrink-0">Preview</span>
          </div>

          <div class="flex items-center justify-center gap-5 flex-wrap">
            <div class="w-48 h-48 rounded-xl overflow-hidden relative shrink-0">
              <img :src="hero.img" class="w-full h-full object-cover" />
              <span class="absolute bottom-1.5 left-1.5 text-[11px] font-semibold bg-white/90 rounded px-1.5 py-0.5">Before</span>
            </div>
            <ArrowRight :size="22" class="text-[#8a8a8a] shrink-0" />
            <div class="w-80 h-80 rounded-xl overflow-hidden ring-1 ring-[#dedbf7] relative shrink-0">
              <div v-if="regenerating" class="absolute inset-0 pb-skeleton flex items-center justify-center">
                <Loader2 :size="22" class="animate-spin text-[#c9c9c9]" />
              </div>
              <div v-else class="absolute inset-0 pb-fade-in">
                <StyledImage :src="hero.img" :overlay="currentStyle.overlay" ai-tag enhance />
              </div>
            </div>
          </div>
        </div>

        <!-- Image ratios -->
        <div class="pb-card p-4 mb-4">
          <p class="font-semibold text-[#1a1a1a] mb-2">Image ratios</p>
          <label class="flex items-center gap-2 text-[13px] text-[#303030] mb-3 cursor-pointer select-none">
            <input type="checkbox" v-model="batch.ratioSame" class="w-4 h-4 accent-[#5548e0]" />
            Use same image for desktop and mobile
          </label>
          <div class="flex gap-3 max-w-[420px]">
            <div class="flex-1">
              <label class="text-[12px] font-medium text-[#616161] mb-1 block">Desktop ratio</label>
              <select v-model="batch.desktopRatio" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none focus:border-[#5548e0]">
                <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div class="flex-1" :class="batch.ratioSame ? 'opacity-45 pointer-events-none' : ''">
              <label class="text-[12px] font-medium text-[#616161] mb-1 block">Mobile ratio</label>
              <select v-model="batch.mobileRatio" :disabled="batch.ratioSame" class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] bg-white outline-none focus:border-[#5548e0]">
                <option v-for="r in ratioOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="pb-card px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <p class="text-[12px] text-[#616161]">Regenerating applies this look to all {{ batchProducts.length }} images in the variation.</p>
          <button class="pb-btn-primary" :disabled="regenerating" @click="regenerateAll">
            <Loader2 v-if="regenerating" :size="13" class="animate-spin" />
            <RefreshCw v-else :size="13" />
            {{ regenerating ? 'Generating...' : `Regenerate all ${batchProducts.length} images` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
