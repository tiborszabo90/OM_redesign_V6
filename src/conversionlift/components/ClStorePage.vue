<template>
  <div class="rounded-2xl overflow-hidden border border-om-gray-200 shadow-[0_8px_30px_rgba(17,18,19,0.12)] bg-white">
    <!-- Browser chrome -->
    <div class="h-11 bg-om-gray-100 border-b border-om-gray-200 flex items-center gap-3 px-4">
      <div class="flex gap-1.5 shrink-0">
        <span class="w-3 h-3 rounded-full bg-om-gray-300"></span>
        <span class="w-3 h-3 rounded-full bg-om-gray-300"></span>
        <span class="w-3 h-3 rounded-full bg-om-gray-300"></span>
      </div>
      <div class="flex-1 min-w-0 flex items-center">
        <slot name="chrome">
          <div class="mx-auto flex items-center gap-2 h-6 bg-white rounded-md border border-om-gray-200 px-3 max-w-md w-full">
            <Lock :size="11" class="text-om-gray-400" />
            <span class="text-xs text-om-gray-500 truncate">{{ url }}</span>
          </div>
        </slot>
      </div>
      <div class="shrink-0"><slot name="actions" /></div>
    </div>

    <!-- ===== Store page (the "scraped" site) ===== -->
    <div class="font-sans text-[#1c1c1c]">
      <!-- Store header -->
      <header class="flex items-center gap-6 px-8 h-16 border-b border-om-gray-100">
        <span class="text-lg font-extrabold tracking-tight">PEAK<span class="text-[#15803D]">GEAR</span></span>
        <nav class="items-center gap-5 text-sm text-om-gray-600" :class="mobile ? 'hidden' : 'hidden lg:flex'">
          <span>Backpacks</span><span>Jackets</span><span>Tents</span><span>Footwear</span>
          <span class="text-[#B91C1C] font-medium">Sale</span>
        </nav>
        <div class="ml-auto flex items-center gap-4 text-om-gray-500">
          <Search :size="18" /><User :size="18" /><ShoppingBag :size="18" />
        </div>
      </header>

      <!-- Hero slot (embed, above the fold) -->
      <div v-if="list('hero').length" data-anchor="hero" class="px-8 pt-5 space-y-3">
        <ClRegion v-for="(e, i) in list('hero')" :key="e.id || 'hero' + i" :rs="e" :data-entry="e.id" :active="isActive(e, 'hero')" :preview-mode="previewMode" :hideable="hideable" :selectable="selectable" :pin-select="pinSelect" :frameless="frameless" :styleable="styleableOf(e)"
          @click="emit('region', idOr(e, 'hero'))" @hide="emit('hide', idOr(e, 'hero'))" @position="loc => emit('position', idOr(e, 'hero'), loc)">
          <ClEmbed v-if="isApplied(e)" :entry="e" />
          <div v-else class="h-24 rounded-xl bg-om-gray-50 border border-om-gray-100 flex items-center justify-center text-sm text-om-gray-400">Lifestyle hero banner</div>
        </ClRegion>
      </div>

      <!-- Breadcrumb -->
      <div class="px-8 pt-5 text-xs text-om-gray-400">Home / Backpacks / {{ product.title }}</div>

      <!-- Main -->
      <div class="px-8 py-5 grid" :class="mobile ? 'grid-cols-1 gap-5' : 'grid-cols-[1.05fr_1fr] gap-8'">
        <!-- Gallery -->
        <div>
          <template v-if="list('gallery').length">
            <ClRegion v-for="(e, i) in list('gallery')" :key="e.id || 'gallery' + i" :rs="e" :data-entry="e.id" :active="isActive(e, 'gallery')" :preview-mode="previewMode" :hideable="hideable" :selectable="selectable" :pin-select="pinSelect" :frameless="frameless"
              @click="emit('region', idOr(e, 'gallery'))" @hide="emit('hide', idOr(e, 'gallery'))" @position="loc => emit('position', idOr(e, 'gallery'), loc)">
              <img :src="isApplied(e) && e.content.image ? e.content.image : mainImage" alt="" class="w-full aspect-square object-cover rounded-2xl bg-om-gray-100" />
            </ClRegion>
          </template>
          <img v-else :src="mainImage" alt="" class="w-full aspect-square object-cover rounded-2xl bg-om-gray-100" />
          <div class="grid grid-cols-4 gap-2 mt-2">
            <button v-for="(t, i) in images.gallery" :key="i" @click="thumb = i"
              class="aspect-square rounded-lg overflow-hidden border-2 transition-colors"
              :class="thumb === i ? 'border-[#15803D]' : 'border-transparent'">
              <img :src="t" alt="" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div>
          <div data-anchor="title">
            <ClRegion v-for="(e, i) in list('title')" :key="e.id || 'title' + i" :rs="e" :data-entry="e.id" :active="isActive(e, 'title')" :preview-mode="previewMode" :hideable="hideable" :selectable="selectable" :pin-select="pinSelect" :frameless="frameless" :styleable="styleableOf(e)"
              @click="emit('region', idOr(e, 'title'))" @hide="emit('hide', idOr(e, 'title'))" @position="loc => emit('position', idOr(e, 'title'), loc)">
              <h1 class="text-2xl font-bold leading-snug" :style="cssOf(e)">{{ isApplied(e) ? e.content.text : product.title }}</h1>
            </ClRegion>
            <h1 v-if="!list('title').length" class="text-2xl font-bold leading-snug">{{ product.title }}</h1>
          </div>

          <div class="flex items-center gap-2 mt-2 text-sm">
            <span class="flex text-[#F59E0B]">
              <Star v-for="n in 5" :key="n" :size="14" :fill="n <= Math.round(product.attributes.rating) ? '#F59E0B' : 'none'" :stroke-width="n <= Math.round(product.attributes.rating) ? 0 : 1.5" />
            </span>
            <span class="text-om-gray-500">{{ product.attributes.rating.toFixed(1) }} · {{ product.attributes.reviews }} reviews</span>
          </div>

          <div class="flex items-baseline gap-2 mt-3">
            <span class="text-2xl font-bold">${{ product.attributes.price }}</span>
            <span class="text-sm text-om-gray-400 line-through">${{ product.attributes.price + 30 }}</span>
            <span class="text-xs font-semibold text-[#B91C1C] bg-[#FEE2E2] rounded px-1.5 py-0.5">Save $30</span>
          </div>

          <p class="text-sm text-om-gray-500 mt-3 leading-relaxed">
            {{ product.attributes.material }} build, {{ product.attributes.features[0].toLowerCase() }}, made for everyday trails.
          </p>

          <!-- Colour -->
          <div class="mt-4">
            <div class="text-xs font-semibold text-om-gray-500 mb-1.5">Colour</div>
            <div class="flex gap-2">
              <span v-for="(c, i) in colours" :key="c" class="w-7 h-7 rounded-full border-2 cursor-pointer"
                :class="i === 0 ? 'border-[#15803D]' : 'border-om-gray-200'" :style="{ background: c }"></span>
            </div>
          </div>

          <!-- Size -->
          <div class="mt-4">
            <div class="text-xs font-semibold text-om-gray-500 mb-1.5">Capacity</div>
            <div class="flex gap-2">
              <span v-for="(s, i) in sizes" :key="s"
                class="px-3 h-9 rounded-lg border text-sm flex items-center cursor-pointer"
                :class="i === 0 ? 'border-[#1c1c1c] font-medium' : 'border-om-gray-200 text-om-gray-500'">{{ s }}</span>
            </div>
          </div>

          <!-- ATC -->
          <div class="flex gap-2 mt-5">
            <button class="flex-1 h-12 rounded-xl bg-[#1c1c1c] text-white text-sm font-semibold">Add to cart · ${{ product.attributes.price }}</button>
            <button class="w-12 h-12 rounded-xl border border-om-gray-200 flex items-center justify-center text-om-gray-500"><Heart :size="18" /></button>
          </div>

          <!-- Below add-to-cart slot -->
          <div v-if="list('belowAtc').length" data-anchor="belowAtc" class="mt-3 space-y-2">
            <ClRegion v-for="(e, i) in list('belowAtc')" :key="e.id || 'belowAtc' + i" :rs="e" :data-entry="e.id" :active="isActive(e, 'belowAtc')" :preview-mode="previewMode" :hideable="hideable" :selectable="selectable" :pin-select="pinSelect" :frameless="frameless" :styleable="styleableOf(e)"
              @click="emit('region', idOr(e, 'belowAtc'))" @hide="emit('hide', idOr(e, 'belowAtc'))" @position="loc => emit('position', idOr(e, 'belowAtc'), loc)">
              <ClEmbed v-if="isApplied(e)" :entry="e" />
              <div v-else class="h-12"></div>
            </ClRegion>
          </div>

          <div v-else class="flex items-center gap-1.5 text-xs text-om-gray-400 mt-3">
            <Truck :size="14" /> Free shipping over $75 · Ships in 24h
          </div>
        </div>
      </div>

      <!-- Above the details tabs slot -->
      <div v-if="list('aboveTabs').length" data-anchor="aboveTabs" class="px-8 pb-1 space-y-3">
        <ClRegion v-for="(e, i) in list('aboveTabs')" :key="e.id || 'aboveTabs' + i" :rs="e" :data-entry="e.id" :active="isActive(e, 'aboveTabs')" :preview-mode="previewMode" :hideable="hideable" :selectable="selectable" :pin-select="pinSelect" :frameless="frameless" :styleable="styleableOf(e)"
          @click="emit('region', idOr(e, 'aboveTabs'))" @hide="emit('hide', idOr(e, 'aboveTabs'))" @position="loc => emit('position', idOr(e, 'aboveTabs'), loc)">
          <ClEmbed v-if="isApplied(e)" :entry="e" />
          <div v-else class="h-20 rounded-xl bg-om-gray-50 border border-om-gray-100 flex items-center justify-center text-sm text-om-gray-400">Banner above details</div>
        </ClRegion>
      </div>

      <!-- Details / description -->
      <div class="px-8 pb-6">
        <div class="flex gap-6 border-b border-om-gray-100 text-sm">
          <span class="pb-2 -mb-px border-b-2 border-[#1c1c1c] font-medium">Description</span>
          <span class="pb-2 text-om-gray-400">Specifications</span>
          <span class="pb-2 text-om-gray-400">Reviews</span>
        </div>
        <div class="pt-4" data-anchor="description">
          <div v-if="list('description').length" class="space-y-3">
            <ClRegion v-for="(e, i) in list('description')" :key="e.id || 'description' + i" :rs="e" :data-entry="e.id" :active="isActive(e, 'description')" :preview-mode="previewMode" :hideable="hideable" :selectable="selectable" :pin-select="pinSelect" :frameless="frameless" :styleable="styleableOf(e)"
              @click="emit('region', idOr(e, 'description'))" @hide="emit('hide', idOr(e, 'description'))" @position="loc => emit('position', idOr(e, 'description'), loc)">
              <ClEmbed v-if="isApplied(e)" :entry="e" />
              <p v-else class="text-sm text-om-gray-500 leading-relaxed max-w-2xl">{{ descriptionText }}</p>
            </ClRegion>
          </div>
          <p v-else class="text-sm text-om-gray-500 leading-relaxed max-w-2xl">{{ descriptionText }}</p>
        </div>
      </div>

      <!-- Related -->
      <div class="px-8 pb-8">
        <h3 class="text-sm font-semibold text-om-gray-700 mb-3">You might also like</h3>
        <div class="grid gap-4" :class="mobile ? 'grid-cols-2' : 'grid-cols-4'">
          <div v-for="r in images.related" :key="r.name">
            <img :src="r.img" alt="" class="w-full aspect-square object-cover rounded-xl bg-om-gray-100" />
            <div class="text-sm text-om-gray-700 mt-2 truncate">{{ r.name }}</div>
            <div class="text-sm font-semibold">${{ r.price }}</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="bg-om-gray-50 border-t border-om-gray-100 px-8 py-6 grid gap-4 text-xs text-om-gray-400" :class="mobile ? 'grid-cols-2' : 'grid-cols-4'">
        <div><div class="font-bold text-om-gray-700 mb-1">PEAKGEAR</div>Gear for every trail.</div>
        <div><div class="font-medium text-om-gray-600 mb-1">Shop</div>Backpacks<br />Jackets<br />Tents</div>
        <div><div class="font-medium text-om-gray-600 mb-1">Support</div>Shipping<br />Returns<br />Warranty</div>
        <div><div class="font-medium text-om-gray-600 mb-1">Company</div>About<br />Sustainability</div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Lock, Search, User, ShoppingBag, Star, Heart, Truck } from 'lucide-vue-next'
import ClRegion from './ClRegion.vue'
import ClEmbed from './ClEmbed.vue'
import { storeImages } from '../data/storeImages.js'
import { representativeProduct } from '../flowDemo.js'

const props = defineProps({
  product: { type: Object, default: null },
  // Each anchor maps to a single region object (flows A/B/C) OR an array of
  // stacked entries (Flow D). Normalised to an array by list().
  regions: { type: Object, default: () => ({}) },
  focusedId: { type: String, default: null }, // Flow D: focus by entry id
  activeAnchor: { type: String, default: '' }, // flows A/B/C: active by anchor
  previewMode: { type: String, default: 'variant' },
  hideable: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false }, // applied regions clickable to select (recommendation screen)
  pinSelect: { type: Boolean, default: false }, // applied regions show a numbered pin (recommendation screen)
  device: { type: String, default: 'desktop' }, // 'mobile' reflows the PDP to a single column
  frameless: { type: Boolean, default: false }, // preview: no rings/overlays, content shown inline
  url: { type: String, default: 'peakgear.example/products/trailblazer-28l-backpack' },
})
const emit = defineEmits(['region', 'hide', 'position'])

const product = computed(() => props.product || representativeProduct())
const mobile = computed(() => props.device === 'mobile')
const images = storeImages
const thumb = ref(0)
const colours = ['#1c1c1c', '#15803D', '#1D4ED8']
const sizes = ['28L', '45L', '60L']
const mainImage = computed(() => images.gallery[thumb.value])
const descriptionText = computed(() =>
  `The ${product.value.title} is a ${product.value.attributes.material.toLowerCase()} pack designed for everyday `
  + `performance. Featuring ${product.value.attributes.features.join(', ').toLowerCase()}, it carries comfortably `
  + `from the trailhead to the summit. Built to last, backed by our gear guarantee.`)

// Normalise an anchor to an array of entries; Control mode drops applied embeds.
function list(a) {
  const v = props.regions[a]
  const arr = Array.isArray(v) ? v : v ? [v] : []
  return props.previewMode === 'control' ? arr.filter(e => e.state !== 'applied') : arr
}
const isApplied = (e) => e.state === 'applied' && props.previewMode !== 'control'
const idOr = (e, a) => e.id ?? a
const isActive = (e, a) =>
  (props.focusedId != null && e.id === props.focusedId) || (!!props.activeAnchor && props.activeAnchor === a)
// Flow D entries are edited via the external popover, so suppress the corner toolbar.
const styleableOf = (e) => isApplied(e) && !!e.style
function cssOf(e) {
  const s = isApplied(e) ? e.style : null
  if (!s) return null
  return {
    fontFamily: s.font,
    fontSize: s.size ? s.size + 'px' : undefined,
    fontWeight: s.bold ? '700' : '400',
    textAlign: s.align,
    color: s.color || undefined,
  }
}
</script>
