<template>
  <div class="h-screen flex flex-col">
    <!-- Header bar -->
    <div class="flex items-center border-b border-om-gray-200 shrink-0">
      <div class="w-[320px] shrink-0 flex items-center gap-3 px-5 py-3 border-r border-om-gray-200">
        <button @click="$emit('back')" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
          <ArrowLeft :size="18" />
        </button>
        <div class="h-5 w-px bg-om-gray-200" />
        <span class="font-semibold text-om-gray-700 text-[15px]">Product Page Optimizer</span>
      </div>
      <div class="flex-1 flex items-center justify-between px-6 py-3 gap-8 min-w-0">
        <Dropdown v-model="selectedProductPage" :options="productPageOptions" size="sm" class="min-w-0" />
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
          <Button variant="primary" size="sm" :disabled="selectedTypes.length === 0" @click="$emit('next', selectedTypes)">
            Next
          </Button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 min-h-0">
      <!-- Left sidebar: checkbox list -->
      <div class="w-[320px] bg-white flex flex-col shrink-0 border-r border-om-gray-200">
        <div class="flex-1 overflow-y-auto px-3 pt-3">
          <div class="flex flex-col gap-2">
            <div
              v-for="type in contentTypes"
              :key="type.id"
              class="flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-150"
              :class="[
                focusedType === type.id
                  ? 'border-om-orange-500 bg-om-orange-50'
                  : selectedTypes.includes(type.id)
                    ? 'border-om-orange-300 bg-om-orange-50/50'
                    : type.comingSoon
                      ? 'border-om-gray-100 bg-om-gray-50 opacity-60'
                      : 'border-om-gray-200 bg-white hover:border-om-gray-300 cursor-pointer'
              ]"
              @click="!type.comingSoon && selectType(type.id)"
            >
              <Checkbox
                :model-value="selectedTypes.includes(type.id)"
                :disabled="type.comingSoon"
                size="sm"
                @click.stop
                @update:model-value="toggleType(type.id)"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-om-gray-700">{{ type.label }}</span>
                  <Tag v-if="type.comingSoon" variant="gray-muted">Hamarosan</Tag>
                </div>
                <p class="text-xs text-om-gray-400 mt-0.5">{{ type.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer: selection count -->
        <div class="px-4 py-3 border-t border-om-gray-200 bg-om-gray-50 shrink-0">
          <p class="text-xs text-om-gray-400">{{ selectedTypes.length }} típus kiválasztva</p>
        </div>
      </div>

      <!-- Right: Product page preview -->
      <div class="flex-1 min-h-0 min-w-0 p-6 bg-om-gray-200 flex justify-center" :class="previewMode === 'mobile' ? 'items-start overflow-hidden' : 'overflow-y-auto'">
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
            :class="previewMode === 'mobile' ? '!rounded-none !shadow-none' : ''"
            @move="handleMove"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from '../components/shared/Button.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Tag from '../components/shared/Tag.vue'
import ProductPagePreview from '../components/ppo/ProductPagePreview.vue'
import { ArrowLeft, Monitor, Smartphone } from 'lucide-vue-next'

defineEmits(['back', 'next', 'menu-click'])

const selectedTypes = ref([])
const previewMode = ref('desktop')

const productPageOptions = [
  { value: 'https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33', label: "Shanky's Whip Black Ír whiskeylikőr" },
  { value: 'https://www.whiskynet.hu/jameson-ír-whiskey-07l-40', label: 'Jameson Ír Whiskey' },
  { value: 'https://www.whiskynet.hu/jack-daniels-tennessee-whiskey-07l-40', label: "Jack Daniel's Tennessee Whiskey" },
]
const selectedProductPage = ref(productPageOptions[0].value)

const contentTypes = [
  { id: 'product-image',    label: 'Termékkép',          description: 'AI-generált termékkép lifestyle háttérrel.',             comingSoon: false },
  { id: 'product-sentence', label: 'Product sentence',  description: 'Egyetlen összefoglaló mondat a termékről.',              comingSoon: false },
  { id: 'benefit-list',     label: 'Benefit list',       description: 'Felsorolás a termék legfontosabb előnyeiről.',           comingSoon: false },
  { id: 'image-badge',      label: 'Kép badge-el',       description: 'Termékkép akciós vagy egyéb badge-dzsel.',               comingSoon: false },
  { id: 'product-summary',  label: 'Termékösszefoglaló',description: 'Kép és szöveg együtt — teljes termékblokk.',             comingSoon: true  },
]

const focusedType = ref(null)

const toggleType = (id) => {
  const idx = selectedTypes.value.indexOf(id)
  if (idx === -1) {
    selectedTypes.value.push(id)
    focusedType.value = id
  } else {
    selectedTypes.value.splice(idx, 1)
    if (focusedType.value === id) focusedType.value = null
  }
}

const selectType = (id) => {
  if (!selectedTypes.value.includes(id)) {
    selectedTypes.value.push(id)
  }
  focusedType.value = id
}

// Map selected types to fake variable ids for ProductPagePreview
const typeToVarId = Object.fromEntries(contentTypes.map((t, i) => [t.id, i]))

const previewVariables = computed(() =>
  selectedTypes.value.map(id => {
    const ct = contentTypes.find(t => t.id === id)
    return { id: typeToVarId[id], name: ct?.label || id, type: id === 'product-image' || id === 'image-badge' ? 'Image' : 'Text' }
  })
)

const previewPlacements = computed(() => {
  const p = {}
  for (const id of selectedTypes.value) {
    if (typeToVarId[id] !== undefined) p[id] = typeToVarId[id]
  }
  return p
})

const activeVariableId = computed(() => focusedType.value !== null ? typeToVarId[focusedType.value] ?? null : null)
const activeVariableType = computed(() => {
  if (!focusedType.value) return null
  return focusedType.value === 'product-image' || focusedType.value === 'image-badge' ? 'Image' : 'Text'
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

const canReposition = (id) => repositionableTypes.includes(id)

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

const showPositionControls = computed(() => {
  if (!focusedType.value) return false
  if (!canReposition(focusedType.value)) return false
  if (!selectedTypes.value.includes(focusedType.value)) return false
  return true
})

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
