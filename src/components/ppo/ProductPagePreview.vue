<template>
  <div class="bg-white rounded-2xl shadow-[0_4px_24px_0_rgb(0_0_0/0.08)] overflow-hidden flex flex-col">

    <!-- Browser chrome -->
    <div class="bg-[#f0f0f0] px-3 py-1.5 flex items-center gap-2 border-b border-[#ddd] shrink-0">
      <div class="flex gap-1.5">
        <div class="w-[10px] h-[10px] rounded-full bg-[#FF5F56]" />
        <div class="w-[10px] h-[10px] rounded-full bg-[#FFBD2E]" />
        <div class="w-[10px] h-[10px] rounded-full bg-[#27C93F]" />
      </div>
      <div class="flex-1 mx-2 bg-white rounded-md px-2 py-[3px] text-[9px] text-[#999] border border-[#ccc] flex items-center gap-1 truncate">
        <Lock :size="8" class="text-[#999] shrink-0" />
        {{ displayUrl }}
      </div>
    </div>

    <!-- Iframe + overlay container (scaled to fit) -->
    <div ref="containerRef" class="relative overflow-hidden" :style="{ height: containerHeight + 'px' }">
      <!-- Scaled wrapper: iframe + overlays together so positions match -->
      <div :style="{ width: IFRAME_W + 'px', height: IFRAME_H + 'px', transform: `scale(${scale})`, transformOrigin: 'top left' }">
        <!-- The actual website -->
        <iframe
          :src="iframeSrc"
          :style="{ width: IFRAME_W + 'px', height: IFRAME_H + 'px' }"
          class="border-0 absolute top-0 left-0"
          sandbox="allow-same-origin"
        />

        <!-- Clickable overlay areas -->
        <div
          v-for="area in areas"
          :key="area.id"
          class="absolute transition-all duration-200 cursor-pointer z-10 rounded-lg"
          :class="areaClasses(area.id)"
          :style="area.style"
          @click="$emit('assign', area.id)"
        >
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
            <Tag v-if="getVarName(area.id)" variant="orange-solid" size="sm">{{ getVarName(area.id) }}</Tag>
            <span v-else-if="isEligible(area.id)" class="text-[11px] text-om-orange-500 font-medium bg-white rounded-full px-2.5 py-1 shadow-md border border-om-orange-200">{{ area.label }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import Tag from '../shared/Tag.vue'
import { Lock } from 'lucide-vue-next'

const props = defineProps({
  placements: { type: Object, default: () => ({}) },
  variables: { type: Array, default: () => [] },
  activeVariableId: { type: Number, default: null },
  activeVariableType: { type: String, default: null },
  url: { type: String, default: 'https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33' },
})

defineEmits(['assign'])

// Desktop dimensions for the iframe
const IFRAME_W = 1280
const IFRAME_H = 2400

const containerRef = ref(null)
const containerWidth = ref(400)

// Dynamic scale based on container width
const scale = computed(() => containerWidth.value / IFRAME_W)
const containerHeight = computed(() => IFRAME_H * scale.value)

// Use local cached version to avoid age gate and CORS issues
const iframeSrc = '/demo-product-page.html'
const displayUrl = computed(() => props.url)

// Watch container width with ResizeObserver
let resizeObserver = null
onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })
    resizeObserver.observe(containerRef.value)
  }
})
onUnmounted(() => {
  resizeObserver?.disconnect()
})

// Overlay area positions mapped to 1280px wide Whiskynet desktop layout
// Page structure: header ~200px, nav bar ~50px, breadcrumb ~40px = product starts ~290px
// Bootstrap grid inside container-wide (~1320px, ~12px padding each side):
//   col-lg-5 (image): left ~1% to ~42% (product image 400x400)
//   col-lg-3 (title/params): ~43% to ~67%
//   col-lg-4 (price/cart): ~68% to ~99%
// Below product section: description ~750px, params ~1050px, related ~1450px
const areas = [
  { id: 'product-image',    type: 'Image', label: 'Product Image',     style: 'top: 295px; left: 3%; width: 35%; height: 400px;' },
  { id: 'headline',         type: 'Text',  label: 'Headline',          style: 'top: 295px; left: 40%; width: 24%; height: 80px;' },
  { id: 'subheadline',      type: 'Text',  label: 'Subheadline',       style: 'top: 385px; left: 40%; width: 24%; height: 200px;' },
  { id: 'product-sentence', type: 'Text',  label: 'Short Description', style: 'top: 770px; left: 3%; width: 62%; height: 120px;' },
  { id: 'summary',          type: 'Text',  label: 'Description',       style: 'top: 910px; left: 3%; width: 62%; height: 380px;' },
  { id: 'benefit-list',     type: 'Text',  label: 'Benefit List',      style: 'top: 1310px; left: 3%; width: 62%; height: 160px;' },
  { id: 'image-badge',      type: 'Image', label: 'Banner Image',      style: 'top: 1500px; left: 3%; width: 96%; height: 200px;' },
  { id: 'product-summary',  type: 'Mixed', label: 'Related Products',  style: 'top: 1730px; left: 3%; width: 96%; height: 250px;' },
]

const AREA_TYPES = Object.fromEntries(areas.map(a => [a.id, a.type]))

const isAssigned = (areaId) => areaId in props.placements

const isEligible = (areaId) => {
  if (props.activeVariableId === null) return false
  if (isAssigned(areaId) && props.placements[areaId] === props.activeVariableId) return false
  const areaType = AREA_TYPES[areaId]
  return areaType === 'Mixed' || areaType === props.activeVariableType
}

const isIneligible = (areaId) => {
  if (props.activeVariableId === null) return false
  if (isAssigned(areaId)) return false
  const areaType = AREA_TYPES[areaId]
  return areaType !== 'Mixed' && areaType !== props.activeVariableType
}

const areaClasses = (areaId) => {
  if (isAssigned(areaId)) return 'ring-2 ring-[#2CC896] bg-[#2CC896]/8'
  if (isEligible(areaId)) return 'ring-2 ring-dashed ring-om-orange-400 bg-om-orange-500/5 animate-pulse'
  if (isIneligible(areaId)) return 'opacity-0 pointer-events-none'
  return 'hover:bg-om-orange-500/5 hover:ring-2 hover:ring-om-orange-300'
}

const getVarName = (areaId) => {
  const varId = props.placements[areaId]
  if (varId === undefined) return null
  const v = props.variables.find(v => v.id === varId)
  return v ? v.name : null
}
</script>
