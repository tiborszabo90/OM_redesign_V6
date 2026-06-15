<template>
  <div class="h-full overflow-y-auto bg-om-gray-100">
    <div class="max-w-3xl mx-auto px-6 py-5">
      <div class="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="sm" @click="$emit('back')"><template #icon><ArrowLeft :size="15" /></template>Back</Button>
      </div>
      <div class="flex items-end justify-between mb-3">
        <div>
          <h2 class="text-lg font-semibold text-om-gray-800">Place your option</h2>
          <p class="text-sm text-om-gray-500">Click a highlighted spot on the page. The AI suggests one.</p>
        </div>
        <Button :disabled="!selected" @click="proceed">Preview<template #icon><ArrowRight :size="15" /></template></Button>
      </div>

      <ClStorePage :regions="regions" :active-anchor="selected" @region="pick" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import ClStorePage from './ClStorePage.vue'

const props = defineProps({
  option: { type: Object, required: true },
  suggestedLocation: { type: String, default: '' },
})
const emit = defineEmits(['next', 'back'])

const ZONES = [
  { anchor: 'title', label: 'Product title', location: 'Product title' },
  { anchor: 'hero', label: 'Image with badge', location: 'Image with badge' },
  { anchor: 'belowAtc', label: 'Below add-to-cart', location: 'Below add-to-cart' },
  { anchor: 'gallery', label: 'Gallery', location: 'Gallery' },
]

const suggested = computed(() => {
  // Prefer the enhancement's own location if it maps to a zone.
  const byLoc = ZONES.find(z => z.location === props.suggestedLocation)
  if (byLoc) return byLoc.anchor
  const t = props.option.content_type
  if (t === 'image') return 'hero'
  if (t === 'text') return 'title'
  return 'belowAtc'
})

const selected = ref(suggested.value)

const regions = computed(() => {
  const out = {}
  for (const z of ZONES) {
    out[z.anchor] = selected.value === z.anchor
      ? { state: 'applied', content: props.option.content, contentType: props.option.content_type, location: z.location }
      : { state: 'zone', label: z.label, suggested: z.anchor === suggested.value }
  }
  return out
})

function pick(anchor) { if (ZONES.some(z => z.anchor === anchor)) selected.value = anchor }
function proceed() {
  const z = ZONES.find(x => x.anchor === selected.value)
  emit('next', { location: z.location, content_type: props.option.content_type, content: props.option.content })
}
</script>
