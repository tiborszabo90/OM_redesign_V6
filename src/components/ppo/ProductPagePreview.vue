<template>
  <div class="bg-white rounded-2xl shadow-[0_4px_24px_0_rgb(0_0_0/0.08)] overflow-hidden flex flex-col">

    <!-- Iframe container (scaled to fit) -->
    <div ref="containerRef" class="relative overflow-hidden" :style="{ height: containerHeight + 'px' }">
      <div :style="{ width: iframeWidth + 'px', height: iframeHeight + 'px', transform: `scale(${scale})`, transformOrigin: 'top left' }">
        <iframe
          ref="iframeRef"
          :src="iframeSrc"
          :style="{ width: iframeWidth + 'px', height: iframeHeight + 'px' }"
          class="border-0 absolute top-0 left-0"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Lock } from 'lucide-vue-next'

const props = defineProps({
  placements: { type: Object, default: () => ({}) },
  variables: { type: Array, default: () => [] },
  activeVariableId: { type: Number, default: null },
  activeVariableType: { type: String, default: null },
  url: { type: String, default: 'https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33' },
  benefitPosition: { type: String, default: 'benefit-list-1' },
  hoveredVariableId: { type: Number, default: null },
  device: { type: String, default: 'desktop' },
  highlightAllPlacements: { type: Boolean, default: false },
  positions: { type: Object, default: () => ({}) },
  positionMeta: { type: Object, default: () => ({}) },
  generatedContent: { type: Object, default: () => ({}) },
  showAllOverlays: { type: Boolean, default: false },
})

const emit = defineEmits(['assign', 'move'])

// Iframe dimensions per device
const DESKTOP_W = 1280
const MOBILE_W = 375
const IFRAME_H = 4000
const IFRAME_W = computed(() => props.device === 'mobile' ? MOBILE_W : DESKTOP_W)
const iframeWidth = IFRAME_W
const iframeHeight = IFRAME_H

const containerRef = ref(null)
const containerWidth = ref(400)
const iframeRef = ref(null)
const iframeReady = ref(false)

// Dynamic scale based on container width
const scale = computed(() => containerWidth.value / IFRAME_W.value)
const containerHeight = computed(() => IFRAME_H * scale.value)

// Use local cached version to avoid age gate and CORS issues
const iframeSrc = '/demo-product-page.html?v=2'
const displayUrl = computed(() => props.url)

// Area metadata (no pixel positions — overlays live inside the iframe)
const AREA_META = [
  { id: 'product-image',    type: 'Image', label: 'Product Image' },
  { id: 'image-badge',      type: 'Image', label: 'Image Badge' },
  { id: 'headline',         type: 'Text',  label: 'Headline' },
  { id: 'subheadline',      type: 'Text',  label: 'Subheadline' },
  { id: 'product-sentence', type: 'Text',  label: 'Short Description' },
  { id: 'summary',          type: 'Text',  label: 'Description' },
  { id: 'benefit-list',     type: 'Text',  label: 'Benefit List' },
  { id: 'product-summary',  type: 'Image', label: 'Product Summary' },
]

const AREA_TYPES = Object.fromEntries(AREA_META.map(a => [a.id, a.type]))

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

const getVarName = (areaId) => {
  const varId = props.placements[areaId]
  if (varId === undefined) return null
  const v = props.variables.find(v => v.id === varId)
  return v ? v.name : null
}

function computeAreaStates() {
  // Determine which variable's placements to highlight
  const activeVarId = props.hoveredVariableId ?? props.activeVariableId
  // Find which areas are assigned to the active variable
  const activeAreaIds = new Set()
  if (activeVarId !== null) {
    for (const [areaId, varId] of Object.entries(props.placements)) {
      if (varId === activeVarId) activeAreaIds.add(areaId)
    }
  }

  const states = AREA_META.map(area => {
    const assigned = isAssigned(area.id)
    const isActiveArea = activeAreaIds.has(area.id)

    let state = 'hidden'
    if (props.showAllOverlays && assigned) {
      state = 'assigned'
    } else if (props.highlightAllPlacements && assigned) {
      state = isActiveArea ? 'assigned' : 'content-only'
    } else if (assigned && isActiveArea) {
      state = 'assigned'
    } else if (assigned) {
      state = 'content-only'
    }

    const varName = getVarName(area.id)
    const meta = props.positionMeta[area.id]
    return {
      id: area.id,
      state,
      label: state === 'assigned' ? (varName || '') : '',
      posLabel: meta?.label || null,
      isFirst: meta?.isFirst || false,
      isLast: meta?.isLast || false,
      content: props.generatedContent[area.id] || null,
    }
  })
  return states
}

function sendPositionToIframe() {
  if (!iframeReady.value || !iframeRef.value) return
  iframeRef.value.contentWindow.postMessage({
    type: 'ppo-benefit-position',
    position: props.benefitPosition
  }, '*')
}

function sendElementPositions() {
  if (!iframeReady.value || !iframeRef.value) return
  if (Object.keys(props.positions).length === 0) return
  iframeRef.value.contentWindow.postMessage({
    type: 'ppo-position',
    positions: JSON.parse(JSON.stringify(props.positions))
  }, '*')
}

function getActiveAreaId() {
  const activeVarId = props.activeVariableId
  if (activeVarId === null) return null
  for (const [areaId, varId] of Object.entries(props.placements)) {
    if (varId === activeVarId) return areaId
  }
  return null
}

function sendDeviceToIframe() {
  if (!iframeReady.value || !iframeRef.value) return
  iframeRef.value.contentWindow.postMessage({
    type: 'ppo-device',
    device: props.device
  }, '*')
}

function sendStateToIframe() {
  if (!iframeReady.value || !iframeRef.value) return
  sendPositionToIframe()
  sendElementPositions()
  sendDeviceToIframe()
  iframeRef.value.contentWindow.postMessage({
    type: 'ppo-update',
    areas: computeAreaStates()
  }, '*')
}

function sendScrollToActive() {
  if (!iframeReady.value || !iframeRef.value) return
  const areaId = getActiveAreaId()
  if (areaId) {
    iframeRef.value.contentWindow.postMessage({
      type: 'ppo-scroll-to',
      areaId: areaId
    }, '*')
  }
}

// Watch all relevant props and send state to iframe
watch(
  () => [props.placements, props.activeVariableId, props.activeVariableType, props.variables, props.benefitPosition, props.hoveredVariableId, props.highlightAllPlacements, props.showAllOverlays, props.positions, props.positionMeta, props.generatedContent],
  () => sendStateToIframe(),
  { deep: true }
)

// Scroll to active element when selection changes or showAllOverlays ends
watch(() => props.activeVariableId, () => {
  nextTick(() => sendScrollToActive())
})
watch(() => props.showAllOverlays, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    nextTick(() => sendScrollToActive())
  }
})

// Listen for iframe messages
function onMessage(e) {
  if (e.data?.type === 'ppo-ready') {
    iframeReady.value = true
    sendStateToIframe()
    setTimeout(() => sendScrollToActive(), 500)
  }
  if (e.data?.type === 'ppo-click') {
    const areaId = e.data.areaId.startsWith('benefit-list-') ? 'benefit-list' : e.data.areaId
    emit('assign', areaId)
  }
  if (e.data?.type === 'ppo-move') {
    emit('move', e.data.areaId, e.data.direction)
  }
}

// Watch container width with ResizeObserver
let resizeObserver = null
onMounted(() => {
  window.addEventListener('message', onMessage)
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
  window.removeEventListener('message', onMessage)
  resizeObserver?.disconnect()
})
</script>
