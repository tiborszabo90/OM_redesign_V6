<template>
  <div class="h-screen flex flex-col">
    <!-- Header bar -->
    <div class="flex items-center h-12 border-b border-gray-200 px-3 shrink-0 bg-white">
      <!-- Left: back + campaign info -->
      <div class="flex items-center gap-2 flex-1">
        <button class="flex items-center text-gray-500 hover:text-gray-800 -ml-1" @click="$emit('back')">
          <ChevronLeft :size="18" />
        </button>
        <div class="flex flex-col leading-tight">
          <span class="text-sm font-semibold text-gray-900">Product Summary 1</span>
          <span class="text-xs text-gray-400">Product summary 1</span>
        </div>
      </div>

      <!-- Center: device toggle -->
      <div class="flex items-center gap-1">
        <button
          class="p-1.5 rounded transition-colors"
          :class="previewMode === 'desktop' ? 'text-[#FF4D00]' : 'text-gray-400 hover:text-gray-600'"
          @click="previewMode = 'desktop'"
        >
          <Monitor :size="18" />
        </button>
        <button
          class="p-1.5 rounded transition-colors"
          :class="previewMode === 'mobile' ? 'text-[#FF4D00]' : 'text-gray-400 hover:text-gray-600'"
          @click="previewMode = 'mobile'"
        >
          <Smartphone :size="18" />
        </button>
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-2 flex-1 justify-end">
        <Button variant="primary" size="sm" @click="$emit('next')">Done</Button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 min-h-0">
      <!-- Left: Product page preview with iframe -->
      <div class="flex-1 min-h-0 min-w-0 bg-om-gray-200 flex flex-col">
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
            :show-all-overlays="showAllBorders"
            :positions="positions"
            :position-meta="positionMeta"
            :generated-content="iframeGeneratedContent"
            :class="previewMode === 'mobile' ? '!rounded-none !shadow-none' : ''"
            @move="handleMove"
          />
        </div>
        </div>
      </div>

      <!-- Right sidebar -->
      <div class="w-[300px] bg-white flex flex-col shrink-0 border-l border-om-gray-200 min-h-0 overflow-hidden">
        <!-- Visual / AI tabs -->
        <div class="px-3 py-2 shrink-0">
          <div class="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="rightTab === 'visual' ? 'text-om-orange-500 bg-white shadow-sm' : 'text-gray-400 hover:text-gray-500'"
              @click="rightTab = 'visual'"
            >
              <Brush :size="14" /> Visual
            </button>
            <button
              class="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="rightTab === 'ai' ? 'text-om-orange-500 bg-white shadow-sm' : 'text-gray-400 hover:text-gray-500'"
              @click="rightTab = 'ai'"
            >
              <Sparkles :size="14" /> AI
            </button>
          </div>
        </div>

        <!-- Visual tab: settings -->
        <div v-if="rightTab === 'visual'" class="flex-1 overflow-y-auto px-4 pt-2 pb-4">
          <div class="space-y-3">
            <!-- Product dropdown -->
            <div v-if="showProductDropdown">
              <label class="text-xs font-medium text-om-gray-500 mb-1 block">Product page</label>
              <Dropdown v-model="selectedProductPage" :options="productPageOptions" size="sm" />
            </div>
            <!-- Position -->
            <div>
              <label class="text-xs font-medium text-om-gray-500 mb-1 block">Position</label>
              <Dropdown :model-value="positions['product-summary']" :options="positionOptionsFor('product-summary')" size="sm" @update:model-value="val => positions['product-summary'] = typeof val === 'object' ? val.value : val" />
            </div>
            <!-- Title font -->
            <div>
              <label class="text-xs font-medium text-om-gray-500 mb-1 block">Title font</label>
              <Dropdown v-model="typeSettings['product-summary'].titleFontFamily" :options="fontFamilyOptions" size="sm" />
            </div>
            <div class="flex gap-2">
              <div class="flex-1">
                <label class="text-xs font-medium text-om-gray-500 mb-1 block">Title size</label>
                <Dropdown v-model="typeSettings['product-summary'].titleFontSize" :options="fontSizeOptions" size="sm" />
              </div>
              <div class="flex-1">
                <label class="text-xs font-medium text-om-gray-500 mb-1 block">Title weight</label>
                <Dropdown v-model="typeSettings['product-summary'].titleFontWeight" :options="fontWeightOptions" size="sm" />
              </div>
            </div>
            <!-- List font -->
            <div>
              <label class="text-xs font-medium text-om-gray-500 mb-1 block">List font</label>
              <Dropdown v-model="typeSettings['product-summary'].listFontFamily" :options="fontFamilyOptions" size="sm" />
            </div>
            <div class="flex gap-2">
              <div class="flex-1">
                <label class="text-xs font-medium text-om-gray-500 mb-1 block">List size</label>
                <Dropdown v-model="typeSettings['product-summary'].listFontSize" :options="fontSizeOptions" size="sm" />
              </div>
              <div class="flex-1">
                <label class="text-xs font-medium text-om-gray-500 mb-1 block">List weight</label>
                <Dropdown v-model="typeSettings['product-summary'].listFontWeight" :options="fontWeightOptions" size="sm" />
              </div>
            </div>
            <!-- Check style -->
            <div>
              <label class="text-xs font-medium text-om-gray-500 mb-1 block">Check style</label>
              <Dropdown v-model="typeSettings['product-summary'].checkStyle" :options="checkStyleOptions" size="sm" />
            </div>
            <!-- Colors -->
            <div class="flex gap-2">
              <div class="flex-1">
                <label class="text-xs font-medium text-om-gray-500 mb-1 block">Background</label>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-md border-2 border-om-gray-200 shrink-0" :style="{ backgroundColor: typeSettings['product-summary'].bgColor }"></div>
                  <span class="text-xs text-om-gray-500 font-mono">{{ typeSettings['product-summary'].bgColor }}</span>
                </div>
              </div>
              <div class="flex-1">
                <label class="text-xs font-medium text-om-gray-500 mb-1 block">Text color</label>
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-md border-2 border-om-gray-200 shrink-0" :style="{ backgroundColor: typeSettings['product-summary'].textColor }"></div>
                  <span class="text-xs text-om-gray-500 font-mono">{{ typeSettings['product-summary'].textColor }}</span>
                </div>
              </div>
            </div>
            <!-- Device diff info (inline, after last input) -->
            <div v-if="anyDeviceDiff" class="flex items-center gap-2 mt-2 px-3 py-2 bg-om-orange-50 rounded-lg">
              <Monitor v-if="previewMode === 'desktop'" :size="14" class="text-om-orange-400 shrink-0" />
              <Smartphone v-else :size="14" class="text-om-orange-400 shrink-0" />
              <span class="text-xs text-om-orange-600">
                Position and styling can be set separately for {{ previewMode === 'desktop' ? 'mobile' : 'desktop' }}
              </span>
            </div>
          </div>
        </div>

        <!-- AI tab: chat -->
        <ChatPanel
          v-if="rightTab === 'ai'"
          v-model="chatOpen"
          :inline="true"
          :suggestions="chatSuggestions"
          :ai-responses="chatAiResponses"
          class="flex-1 min-h-0"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ProductPagePreview from '../components/ppo/ProductPagePreview.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import { ChevronLeft, Monitor, Smartphone, ChevronDown, ImageIcon, Type, Brush, Sparkles } from 'lucide-vue-next'

const baseUrl = window.location.origin

const isLightColor = (hex) => {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

const getCheckIconHtml = (style, color) => {
  const c = color || '#FFFFFF'
  if (style === 'Circle') return '<div style="width:28px;height:28px;flex-shrink:0;margin-top:2px;border-radius:50%;background:' + c + '22;display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
  if (style === 'Checkmark') return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:3px;opacity:0.7;"><polyline points="20 6 9 17 4 12"/></svg>'
  if (style === 'None') return ''
  // Badge (default) — badge shape with check icon on top
  return '<div style="width:28px;height:28px;flex-shrink:0;margin-top:2px;position:relative;display:flex;align-items:center;justify-content:center;"><img src="' + baseUrl + '/badge-1.svg" style="position:absolute;inset:0;width:100%;height:100%;filter:brightness(0) invert(1);opacity:0.2;" /><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + c + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="position:relative;z-index:1;"><polyline points="20 6 9 17 4 12"/></svg></div>'
}

const props = defineProps({
  selectedTypes: { type: Array, default: () => [] },
  showProductDropdown: { type: Boolean, default: false },
  variableConfigs: { type: Object, default: () => ({}) },
})

// Generated content for iframe
const generatedContent = {
  'product-image': { image: baseUrl + '/image-with-badge/whisky2.png' },
  'product-sentence': { text: 'A unique blend of Irish whiskey with vanilla and roasted malt — silky smooth, perfect neat or in cocktails.' },
  'benefit-list': { items: ['Unique Irish whiskey & vanilla blend', 'Silky smooth, perfect neat or on ice', 'Award-winning craft liqueur'] },
}

const iframeGeneratedContent = computed(() => {
  const content = {}
  for (const type of contentTypes.value) {
    if (type.id === 'image-badge') {
      content['image-badge'] = { image: baseUrl + (previewMode.value === 'mobile' ? '/image-with-badge/image-1-mobile.jpg' : '/image-with-badge/image-1.jpg') }
    } else if (type.id === 'product-summary') {
      const s = typeSettings.value['product-summary'] || {}
      const bg = s.bgColor || '#E8611A'
      const tc = s.textColor || '#FFFFFF'
      const tff = s.titleFontFamily && s.titleFontFamily !== 'Inherit' ? s.titleFontFamily : ''
      const tfs = s.titleFontSize || '20px'
      const tfw = { Regular: '400', Medium: '500', Semibold: '600', Bold: '700' }[s.titleFontWeight] || '700'
      const lff = s.listFontFamily && s.listFontFamily !== 'Inherit' ? s.listFontFamily : ''
      const lfs = s.listFontSize || '16px'
      const lfw = { Regular: '400', Medium: '500', Semibold: '600', Bold: '700' }[s.listFontWeight] || '400'
      const checkHtml = getCheckIconHtml(s.checkStyle, tc)
      const title = "Shanky's Whip Black Irish Whiskey Likőr"
      const items = [
        'Egyedülálló ír whiskey és vanília keverék, prémium minőségű természetes összetevőkkel',
        'Selymesen lágy, tökéletes jéggel, koktélokban vagy önmagában fogyasztva',
        'Díjnyertes kézműves likőr, amelyet hagyományos ír módszerekkel készítenek',
      ]
      const titleHtml = '<h3 style="font-size:' + tfs + ';font-weight:' + tfw + ';line-height:1.3;color:' + tc + ';margin:0 0 16px 0;' + (tff ? 'font-family:' + tff + ',sans-serif;' : '') + '">' + title + '</h3>'
      const itemsHtml = items.map(t =>
        '<div style="display:flex;align-items:flex-start;gap:12px;">' + checkHtml + '<span style="font-size:' + lfs + ';font-weight:' + lfw + ';line-height:1.5;color:' + tc + ';' + (lff ? 'font-family:' + lff + ',sans-serif;' : '') + '">' + t + '</span></div>'
      ).join('')
      const isMobile = previewMode.value === 'mobile'
      content['product-summary'] = { html: isMobile
        ? '<div style="display:flex;flex-direction:column;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;margin:0;">'
          + '<div style="width:100%;aspect-ratio:4/3;background:#f9fafb;">'
          + '<img src="' + baseUrl + '/image-with-badge/whisky2.png" style="width:100%;height:100%;object-fit:cover;" />'
          + '</div>'
          + '<div style="background:' + bg + ';display:flex;flex-direction:column;padding:16px;">'
          + titleHtml + '<div style="display:flex;flex-direction:column;gap:12px;">' + itemsHtml + '</div></div></div>'
        : '<div style="display:flex;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">'
          + '<div style="width:320px;flex-shrink:0;background:#f9fafb;aspect-ratio:1/1;">'
          + '<img src="' + baseUrl + '/image-with-badge/whisky2.png" style="width:100%;height:100%;object-fit:cover;" />'
          + '</div>'
          + '<div style="flex:1;background:' + bg + ';display:flex;flex-direction:column;justify-content:center;padding:32px;">'
          + titleHtml + '<div style="display:flex;flex-direction:column;gap:20px;">' + itemsHtml + '</div></div></div>'
      }
    } else if (generatedContent[type.id]) {
      content[type.id] = generatedContent[type.id]
    }
  }
  return content
})

defineEmits(['back', 'next', 'menu-click'])

const previewMode = ref('desktop')
const rightTab = ref('visual')
const chatOpen = ref(true)

const chatSuggestions = [
  'Change the title to be more engaging',
  'Use a different background color',
  'Add more benefit items',
  'Make the text more persuasive',
]

const chatAiResponses = {
  'Change the title to be more engaging': 'Here are 3 alternative titles:\n\n**1.** "Discover the Perfect Black Irish Whiskey Experience"\n**2.** "Why Shanky\'s Whip Is Your Next Favourite Liqueur"\n**3.** "Smooth, Bold & Unforgettable — Try Shanky\'s Whip"\n\nWhich would you like to apply?',
  'Use a different background color': 'Here are some color options that work well:\n\n**1. Deep Navy** — `#1A1A2E` for a premium feel\n**2. Forest Green** — `#2D6A4F` for a natural vibe\n**3. Rich Purple** — `#5B2C6F` for luxury positioning\n\nShall I apply any of these?',
  'Add more benefit items': 'I can add these additional benefits:\n\n**4.** "Perfect base for cocktails — from Espresso Martinis to Irish Coffee"\n**5.** "Award-winning recipe since 2005 — consistently rated 90+ points"\n\nWant me to add these to the list?',
  'Make the text more persuasive': 'I\'d recommend these changes:\n\n**Title:** Add a power word → "Irresistible Irish Whiskey Likőr"\n**Benefits:** Start each with an action verb\n**Add urgency:** "Limited edition — only available while stocks last"\n\nThis typically boosts conversion by 15–20%. Apply these?',
}

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
  { id: 'image-badge',      label: 'Image with badge',   description: 'Termékkép akciós vagy egyéb badge-dzsel.',   isImage: true },
  { id: 'product-summary',  label: 'Product summary',    description: 'Image and text combined — full product block.', isImage: true },
]

const contentTypes = computed(() =>
  props.selectedTypes.length > 0
    ? allContentTypes.filter(t => props.selectedTypes.includes(t.id))
    : allContentTypes
)

const activeCard = ref('product-summary')
const showAllBorders = ref(true)
onMounted(() => { setTimeout(() => { showAllBorders.value = false }, 2000) })
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
const checkStyleOptions = ['Badge', 'Circle', 'Checkmark', 'None']
const borderRadiusOptions = ['0px', '4px', '8px', '12px', '16px', '24px']
const aspectRatioOptions = ['Auto', '1:1', '4:3', '16:9', '3:4']

// Per-type, per-device settings
const desktopSettings = reactive({
  'product-image':    { borderRadius: '8px', aspectRatio: 'Auto' },
  'product-sentence': { fontFamily: 'Inherit', fontSize: '15px', fontWeight: 'Medium', color: '#23262A', lineHeight: '1.5' },
  'benefit-list':     { fontFamily: 'Inherit', fontSize: '14px', fontWeight: 'Regular', color: '#505763', lineHeight: '1.6' },
  'image-badge':      { borderRadius: '12px', aspectRatio: '1:1' },
  'product-summary':  { titleFontFamily: 'Inherit', titleFontSize: '20px', titleFontWeight: 'Bold', listFontFamily: 'Inherit', listFontSize: '16px', listFontWeight: 'Regular', checkStyle: 'Badge', bgColor: '#E8611A', textColor: '#FFFFFF' },
})
const mobileSettings = reactive({
  'product-image':    { borderRadius: '8px', aspectRatio: 'Auto' },
  'product-sentence': { fontFamily: 'Inherit', fontSize: '14px', fontWeight: 'Medium', color: '#23262A', lineHeight: '1.4' },
  'benefit-list':     { fontFamily: 'Inherit', fontSize: '13px', fontWeight: 'Regular', color: '#505763', lineHeight: '1.5' },
  'image-badge':      { borderRadius: '8px', aspectRatio: '1:1' },
  'product-summary':  { titleFontFamily: 'Inherit', titleFontSize: '18px', titleFontWeight: 'Bold', listFontFamily: 'Inherit', listFontSize: '14px', listFontWeight: 'Regular', checkStyle: 'Badge', bgColor: '#E8611A', textColor: '#FFFFFF' },
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

// Positioning system — 3 predefined positions per element type
const positionSlots = [
  { id: 'pos-before-headline', label: 'Headline fölött' },
  { id: 'pos-after-headline', label: 'Headline alatt' },
  { id: 'pos-after-sku', label: 'Cikkszám alatt' },
  { id: 'pos-after-wishlist', label: 'Kívánságlista alatt' },
  { id: 'pos-before-description', label: 'Leírás fölött' },
  { id: 'pos-after-description', label: 'Leírás alatt' },
]

const allowedSlots = {
  'product-image':    ['pos-before-headline', 'pos-before-description', 'pos-after-description'],
  'product-sentence': ['pos-after-headline', 'pos-after-sku', 'pos-before-description'],
  'benefit-list':     ['pos-after-headline', 'pos-after-sku', 'pos-after-description'],
  'image-badge':      ['pos-before-headline', 'pos-before-description', 'pos-after-description'],
  'product-summary':  ['pos-before-description', 'pos-after-description', 'pos-after-wishlist'],
}

const positionOptionsFor = (typeId) => {
  const slotIds = allowedSlots[typeId] || []
  return slotIds.map(id => {
    const slot = positionSlots.find(s => s.id === id)
    return { value: id, label: slot?.label || id }
  })
}

const positions = ref({
  'product-image': 'pos-before-headline',
  'product-sentence': 'pos-after-headline',
  'benefit-list': 'pos-after-sku',
  'image-badge': 'pos-before-description',
  'product-summary': 'pos-before-description',
})

const repositionableTypes = ['product-image', 'product-sentence', 'benefit-list', 'image-badge', 'product-summary']
const fullWidthSlots = ['pos-before-description', 'pos-after-description']

const positionMeta = computed(() => {
  const meta = {}
  for (const id of repositionableTypes) {
    const slotIds = allowedSlots[id] || []
    const idx = getPositionIndex(id)
    meta[id] = {
      label: getPositionLabel(id),
      isFirst: idx === 0,
      isLast: idx === slotIds.length - 1,
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
  return positionSlots.find(s => s.id === slotId)?.label || ''
}

const getPositionIndex = (id) => {
  const slotIds = allowedSlots[id] || []
  return slotIds.indexOf(positions.value[id])
}

const moveUp = (id) => {
  const slotIds = allowedSlots[id] || []
  const idx = getPositionIndex(id)
  if (idx > 0) positions.value[id] = slotIds[idx - 1]
}

const moveDown = (id) => {
  const slotIds = allowedSlots[id] || []
  const idx = getPositionIndex(id)
  if (idx < slotIds.length - 1) positions.value[id] = slotIds[idx + 1]
}
</script>

<style scoped>
.color-swatch:focus,
.color-swatch:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
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
