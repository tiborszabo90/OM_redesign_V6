<template>
  <div class="bg-white rounded-2xl shadow-[0_4px_24px_0_rgb(0_0_0/0.08)] overflow-hidden flex flex-col">

    <!-- Iframe container (scaled to fit) -->
    <div ref="containerRef" class="relative overflow-hidden" :style="{ height: containerHeight + 'px' }">
      <div :style="{ width: IFRAME_W + 'px', height: IFRAME_H + 'px', transform: `scale(${scale})`, transformOrigin: 'top left' }">
        <iframe
          ref="iframeRef"
          :src="iframeSrc"
          :style="{ width: IFRAME_W + 'px', height: IFRAME_H + 'px' }"
          class="border-0 absolute top-0 left-0"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { Lock } from 'lucide-vue-next'

const props = defineProps({
  placements: { type: Object, default: () => ({}) },
  variables: { type: Array, default: () => [] },
  activeVariableId: { type: Number, default: null },
  activeVariableType: { type: String, default: null },
  url: { type: String, default: 'https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33' },
  benefitPosition: { type: String, default: 'benefit-list-1' },
  hoveredVariableId: { type: Number, default: null },
})

const emit = defineEmits(['assign'])

// Desktop dimensions for the iframe
const IFRAME_W = 1280
const IFRAME_H = 4000

const containerRef = ref(null)
const containerWidth = ref(400)
const iframeRef = ref(null)
const iframeReady = ref(false)

// Dynamic scale based on container width
const scale = computed(() => containerWidth.value / IFRAME_W)
const containerHeight = computed(() => IFRAME_H * scale.value)

// Use local cached version to avoid age gate and CORS issues
const iframeSrc = '/demo-product-page.html'
const displayUrl = computed(() => props.url)

// Area metadata (no pixel positions — overlays live inside the iframe)
const AREA_META = [
  { id: 'product-image',    type: 'Image', label: 'Product Image' },
  { id: 'headline',         type: 'Text',  label: 'Headline' },
  { id: 'subheadline',      type: 'Text',  label: 'Subheadline' },
  { id: 'product-sentence', type: 'Text',  label: 'Short Description' },
  { id: 'summary',          type: 'Text',  label: 'Description' },
  { id: 'benefit-list',     type: 'Text',  label: 'Benefit List' },
  { id: 'product-summary',  type: 'Mixed', label: 'Related Products' },
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
    if (assigned && isActiveArea) state = 'assigned'

    const varName = getVarName(area.id)
    const iframeId = area.id === 'benefit-list' ? props.benefitPosition : area.id
    return {
      id: iframeId,
      state,
      label: state === 'assigned' ? (varName || '') : ''
    }
  })
  // Hide inactive benefit list positions
  const allPositions = ['benefit-list-1', 'benefit-list-2', 'benefit-list-3']
  allPositions.forEach(posId => {
    if (posId !== props.benefitPosition) {
      states.push({ id: posId, state: 'hidden', label: '' })
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

function sendStateToIframe() {
  if (!iframeReady.value || !iframeRef.value) return
  sendPositionToIframe()
  iframeRef.value.contentWindow.postMessage({
    type: 'ppo-update',
    areas: computeAreaStates()
  }, '*')
}

// Watch all relevant props and send state to iframe
watch(
  () => [props.placements, props.activeVariableId, props.activeVariableType, props.variables, props.benefitPosition, props.hoveredVariableId],
  () => sendStateToIframe(),
  { deep: true }
)

// Listen for iframe messages
function onMessage(e) {
  if (e.data?.type === 'ppo-ready') {
    iframeReady.value = true
    sendStateToIframe()
  }
  if (e.data?.type === 'ppo-click') {
    const areaId = e.data.areaId.startsWith('benefit-list-') ? 'benefit-list' : e.data.areaId
    emit('assign', areaId)
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
