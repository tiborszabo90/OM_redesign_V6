<template>
  <div class="h-screen flex flex-col">
    <!-- Header bar -->
    <div class="flex items-center border-b border-om-gray-200 shrink-0">
      <div class="w-[360px] shrink-0 flex items-center gap-3 px-5 py-3 border-r border-om-gray-200">
        <button @click="$emit('back')" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
          <ArrowLeft :size="18" />
        </button>
        <div class="h-5 w-px bg-om-gray-200" />
        <span class="font-semibold text-om-gray-700 text-[15px]">Setup Preview</span>
      </div>
      <div class="flex-1 flex items-center justify-between px-6 py-3 gap-3">
        <Dropdown v-if="showProductDropdown" v-model="selectedProductPage" :options="productPageOptions" size="sm" class="min-w-0" />
        <div v-else />
        <div class="flex items-center gap-3 shrink-0">
          <div class="flex items-center bg-om-gray-100 rounded-lg p-0.5">
            <button
              class="flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer"
              :class="previewMode === 'desktop' ? 'bg-white shadow-sm text-om-gray-700' : 'text-om-gray-400 hover:text-om-gray-600'"
              @click="previewMode = 'desktop'"
            >
              <Monitor :size="16" />
            </button>
            <button
              class="flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer"
              :class="previewMode === 'mobile' ? 'bg-white shadow-sm text-om-gray-700' : 'text-om-gray-400 hover:text-om-gray-600'"
              @click="previewMode = 'mobile'"
            >
              <Smartphone :size="16" />
            </button>
          </div>
          <Button variant="primary" size="sm" @click="$emit('next')">
            Next
          </Button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 min-h-0">
      <!-- Left sidebar: variable cards with typography settings -->
      <div class="w-[360px] bg-white flex flex-col shrink-0 border-r border-om-gray-200">
        <div class="flex-1 overflow-y-auto px-3 pt-3 pb-3">
          <div class="flex flex-col gap-3">
            <div
              v-for="type in contentTypes"
              :key="type.id"
              class="rounded-xl border transition-all duration-150 overflow-hidden"
              :class="[
                activeCard === type.id
                  ? 'border-om-orange-500 bg-white shadow-sm'
                  : 'border-om-gray-200 bg-white hover:border-om-gray-300'
              ]"
              @click="activeCard = type.id"
            >
              <!-- Card header -->
              <div class="flex items-center gap-3 p-3 cursor-pointer">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="type.isImage ? 'bg-purple-50' : 'bg-blue-50'">
                  <ImageIcon v-if="type.isImage" :size="16" class="text-purple-500" />
                  <Type v-else :size="16" class="text-blue-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="text-sm font-medium text-om-gray-700">{{ type.label }}</span>
                  <p class="text-xs text-om-gray-400 mt-0.5">{{ type.description }}</p>
                </div>
                <ChevronDown :size="14" class="text-om-gray-400 shrink-0 transition-transform" :class="activeCard === type.id ? 'rotate-180' : ''" />
              </div>

              <!-- Typography settings (expanded, only for text types) -->
              <transition name="expand">
                <div v-if="activeCard === type.id && !type.isImage" class="px-3 pb-3 border-t border-om-gray-100">
                  <div class="pt-3 space-y-3">
                    <!-- Font family -->
                    <div>
                      <label class="text-xs font-medium text-om-gray-500 mb-1 block">Font family</label>
                      <Dropdown v-model="typeSettings[type.id].fontFamily" :options="fontFamilyOptions" size="sm" />
                    </div>
                    <!-- Font size + weight row -->
                    <div class="flex gap-2">
                      <div class="flex-1">
                        <label class="text-xs font-medium text-om-gray-500 mb-1 block">Size</label>
                        <Dropdown v-model="typeSettings[type.id].fontSize" :options="fontSizeOptions" size="sm" />
                      </div>
                      <div class="flex-1">
                        <label class="text-xs font-medium text-om-gray-500 mb-1 block">Weight</label>
                        <Dropdown v-model="typeSettings[type.id].fontWeight" :options="fontWeightOptions" size="sm" />
                      </div>
                    </div>
                    <!-- Color -->
                    <div>
                      <label class="text-xs font-medium text-om-gray-500 mb-1 block">Color</label>
                      <div class="flex items-center gap-2">
                        <input type="color" v-model="typeSettings[type.id].color" class="w-8 h-8 rounded border border-om-gray-200 cursor-pointer" />
                        <span class="text-xs text-om-gray-500 font-mono">{{ typeSettings[type.id].color }}</span>
                      </div>
                    </div>
                    <!-- Line height -->
                    <div>
                      <label class="text-xs font-medium text-om-gray-500 mb-1 block">Line height</label>
                      <Dropdown v-model="typeSettings[type.id].lineHeight" :options="lineHeightOptions" size="sm" />
                    </div>
                  </div>
                </div>
              </transition>

              <!-- Image settings (expanded, only for image types) -->
              <transition name="expand">
                <div v-if="activeCard === type.id && type.isImage" class="px-3 pb-3 border-t border-om-gray-100">
                  <div class="pt-3 space-y-3">
                    <div>
                      <label class="text-xs font-medium text-om-gray-500 mb-1 block">Border radius</label>
                      <Dropdown v-model="typeSettings[type.id].borderRadius" :options="borderRadiusOptions" size="sm" />
                    </div>
                    <div>
                      <label class="text-xs font-medium text-om-gray-500 mb-1 block">Aspect ratio</label>
                      <Dropdown v-model="typeSettings[type.id].aspectRatio" :options="aspectRatioOptions" size="sm" />
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Product page preview with iframe -->
      <div class="flex-1 min-h-0 min-w-0 bg-om-gray-200 flex flex-col">
        <!-- Device diff info banner -->
        <div v-if="anyDeviceDiff" class="flex items-center gap-2 px-6 py-2.5 bg-om-orange-50 border-b border-om-orange-100 shrink-0">
          <Monitor v-if="previewMode === 'desktop'" :size="14" class="text-om-orange-400 shrink-0" />
          <Smartphone v-else :size="14" class="text-om-orange-400 shrink-0" />
          <span class="text-xs text-om-orange-600">
            Position and styling can be set separately for {{ previewMode === 'desktop' ? 'mobile' : 'desktop' }}
          </span>
        </div>
        <div class="flex-1 min-h-0 p-6 flex justify-center" :class="previewMode === 'mobile' ? 'items-start overflow-hidden' : 'overflow-y-auto'">
        <div :class="previewMode === 'mobile' ? 'w-[360px] h-full overflow-hidden rounded-2xl shadow-[0_4px_24px_0_rgb(0_0_0/0.08)]' : 'w-full'" class="transition-all duration-300">
          <ProductPagePreview
            :placements="previewPlacements"
            :variables="previewVariables"
            :active-variable-id="activeVariableId"
            :active-variable-type="activeVariableType"
            :url="selectedProductPage"
            :device="previewMode"
            :highlight-all-placements="true"
            :positions="positions"
            :position-meta="positionMeta"
            :generated-content="iframeGeneratedContent"
            :class="previewMode === 'mobile' ? '!rounded-none !shadow-none' : ''"
            @move="handleMove"
          />
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ProductPagePreview from '../components/ppo/ProductPagePreview.vue'
import { ArrowLeft, Monitor, Smartphone, ChevronDown, ImageIcon, Type } from 'lucide-vue-next'

const props = defineProps({
  selectedTypes: { type: Array, default: () => [] },
  showProductDropdown: { type: Boolean, default: false },
  variableConfigs: { type: Object, default: () => ({}) },
})

// Generated content for iframe
const baseUrl = window.location.origin
const generatedContent = {
  'product-image': { image: baseUrl + '/image-with-badge/whisky2.png' },
  'product-sentence': { text: 'A unique blend of Irish whiskey with vanilla and roasted malt — silky smooth, perfect neat or in cocktails.' },
  'benefit-list': { items: ['Unique Irish whiskey & vanilla blend', 'Silky smooth, perfect neat or on ice', 'Award-winning craft liqueur'] },
  'image-badge': { image: baseUrl + '/image-with-badge/whisky2.png' },
}

const iframeGeneratedContent = computed(() => {
  const content = {}
  for (const type of contentTypes.value) {
    if (generatedContent[type.id]) {
      content[type.id] = generatedContent[type.id]
    }
  }
  return content
})

defineEmits(['back', 'next', 'menu-click'])

const previewMode = ref('desktop')

const productPageOptions = [
  { value: 'https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33', label: "Shanky's Whip Black Ír whiskeylikőr" },
  { value: 'https://www.whiskynet.hu/jameson-ír-whiskey-07l-40', label: 'Jameson Ír Whiskey' },
  { value: 'https://www.whiskynet.hu/jack-daniels-tennessee-whiskey-07l-40', label: "Jack Daniel's Tennessee Whiskey" },
]
const selectedProductPage = ref(productPageOptions[0].value)

const allContentTypes = [
  { id: 'product-image',    label: 'Product image',         description: 'AI-generált termékkép lifestyle háttérrel.', isImage: true },
  { id: 'product-sentence', label: 'Product sentence',  description: 'Egyetlen összefoglaló mondat a termékről.',  isImage: false },
  { id: 'benefit-list',     label: 'Benefit list',      description: 'Felsorolás a termék legfontosabb előnyeiről.', isImage: false },
  { id: 'image-badge',      label: 'Kép badge-el',      description: 'Termékkép akciós vagy egyéb badge-dzsel.',   isImage: true },
]

const contentTypes = computed(() =>
  props.selectedTypes.length > 0
    ? allContentTypes.filter(t => props.selectedTypes.includes(t.id))
    : allContentTypes
)

const activeCard = ref(null)
// Set initial active card after content types are resolved
const initActiveCard = () => {
  const types = contentTypes.value
  if (types.length > 0 && !activeCard.value) {
    activeCard.value = types[0].id
  }
}
initActiveCard()

// Typography / style options
const fontFamilyOptions = ['Inherit', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins']
const fontSizeOptions = ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '24px']
const fontWeightOptions = ['Regular', 'Medium', 'Semibold', 'Bold']
const lineHeightOptions = ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0']
const borderRadiusOptions = ['0px', '4px', '8px', '12px', '16px', '24px']
const aspectRatioOptions = ['Auto', '1:1', '4:3', '16:9', '3:4']

// Per-type, per-device settings
const desktopSettings = reactive({
  'product-image':    { borderRadius: '8px', aspectRatio: 'Auto' },
  'product-sentence': { fontFamily: 'Inherit', fontSize: '15px', fontWeight: 'Medium', color: '#23262A', lineHeight: '1.5' },
  'benefit-list':     { fontFamily: 'Inherit', fontSize: '14px', fontWeight: 'Regular', color: '#505763', lineHeight: '1.6' },
  'image-badge':      { borderRadius: '12px', aspectRatio: '1:1' },
})
const mobileSettings = reactive({
  'product-image':    { borderRadius: '8px', aspectRatio: 'Auto' },
  'product-sentence': { fontFamily: 'Inherit', fontSize: '14px', fontWeight: 'Medium', color: '#23262A', lineHeight: '1.4' },
  'benefit-list':     { fontFamily: 'Inherit', fontSize: '13px', fontWeight: 'Regular', color: '#505763', lineHeight: '1.5' },
  'image-badge':      { borderRadius: '8px', aspectRatio: '1:1' },
})

const typeSettings = computed(() => previewMode.value === 'desktop' ? desktopSettings : mobileSettings)
const otherDeviceSettings = computed(() => previewMode.value === 'desktop' ? mobileSettings : desktopSettings)

const hasDeviceDiff = (typeId) => {
  const d = desktopSettings[typeId]
  const m = mobileSettings[typeId]
  if (!d || !m) return false
  return JSON.stringify(d) !== JSON.stringify(m)
}

const anyDeviceDiff = computed(() => contentTypes.value.some(t => hasDeviceDiff(t.id)))

const diffTypeLabels = computed(() =>
  contentTypes.value.filter(t => hasDeviceDiff(t.id)).map(t => t.label).join(', ')
)


// Map types to fake variable ids for ProductPagePreview
const typeToVarId = computed(() => Object.fromEntries(contentTypes.value.map((t, i) => [t.id, i])))

const previewVariables = computed(() =>
  contentTypes.value.map(ct => ({
    id: typeToVarId.value[ct.id],
    name: ct.label,
    type: ct.isImage ? 'Image' : 'Text'
  }))
)

const previewPlacements = computed(() => {
  const p = {}
  for (const ct of contentTypes.value) {
    if (typeToVarId.value[ct.id] !== undefined) p[ct.id] = typeToVarId.value[ct.id]
  }
  return p
})

const activeVariableId = computed(() => activeCard.value ? typeToVarId.value[activeCard.value] ?? null : null)
const activeVariableType = computed(() => {
  if (!activeCard.value) return null
  const ct = contentTypes.value.find(t => t.id === activeCard.value)
  return ct?.isImage ? 'Image' : 'Text'
})

// Positioning system
const positionSlots = [
  { id: 'pos-before-headline', label: 'Headline fölött' },
  { id: 'pos-after-headline', label: 'Headline alatt' },
  { id: 'pos-after-sku', label: 'Cikkszám alatt' },
  { id: 'pos-after-wishlist', label: 'Kívánságlista alatt' },
  { id: 'pos-before-description', label: 'Leírás fölött' },
  { id: 'pos-after-description', label: 'Leírás alatt' },
]

const positions = ref({
  'product-sentence': 'pos-after-headline',
  'benefit-list': 'pos-after-sku',
  'image-badge': 'pos-before-description',
})

const repositionableTypes = ['product-sentence', 'benefit-list', 'image-badge']
const fullWidthSlots = ['pos-before-description', 'pos-after-description']

const allowedSlots = {
  'product-sentence': positionSlots,
  'benefit-list': positionSlots,
  'image-badge': positionSlots.filter(s => fullWidthSlots.includes(s.id)),
}

const positionMeta = computed(() => {
  const meta = {}
  for (const id of repositionableTypes) {
    const slots = allowedSlots[id] || positionSlots
    const idx = getPositionIndex(id)
    meta[id] = {
      label: getPositionLabel(id),
      isFirst: idx === 0,
      isLast: idx === slots.length - 1,
    }
  }
  return meta
})

const handleMove = (areaId, direction) => {
  if (direction === 'up') moveUp(areaId)
  else if (direction === 'down') moveDown(areaId)
}

const getPositionLabel = (id) => {
  const slotId = positions.value[id]
  const slots = allowedSlots[id] || positionSlots
  return slots.find(s => s.id === slotId)?.label || ''
}

const getPositionIndex = (id) => {
  const slots = allowedSlots[id] || positionSlots
  return slots.findIndex(s => s.id === positions.value[id])
}

const moveUp = (id) => {
  const slots = allowedSlots[id] || positionSlots
  const idx = getPositionIndex(id)
  if (idx > 0) positions.value[id] = slots[idx - 1].id
}

const moveDown = (id) => {
  const slots = allowedSlots[id] || positionSlots
  const idx = getPositionIndex(id)
  if (idx < slots.length - 1) positions.value[id] = slots[idx + 1].id
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 300px;
}
</style>
