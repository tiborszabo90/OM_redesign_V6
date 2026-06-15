<template>
  <div class="h-full flex">
    <!-- In-context page: block placed, other positions are clickable zones -->
    <div class="flex-1 min-h-0 overflow-y-auto bg-om-gray-100 px-6 py-5">
      <div class="max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" @click="$emit('back')"><template #icon><ArrowLeft :size="15" /></template>Back</Button>
          <span class="text-sm text-om-gray-500 hidden md:block">Click a highlighted spot to move it · refine in chat</span>
          <Button size="sm" @click="proceed">Preview<template #icon><ArrowRight :size="15" /></template></Button>
        </div>
        <ClStorePage :regions="regions" :active-anchor="currentAnchor" @region="pick" />
      </div>
    </div>

    <ClChatRail :messages="messages" :suggestions="suggestions" intro="Refine the enhancement in plain language." @send="onChat" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import ClStorePage from './ClStorePage.vue'
import ClChatRail from './ClChatRail.vue'
import { chatReply } from '../flowDemo.js'
import { storeImages } from '../data/storeImages.js'

const props = defineProps({
  location: { type: String, default: 'Below add-to-cart' },
  content: { type: Object, default: () => ({}) },
  contentType: { type: String, default: '' },
})
const emit = defineEmits(['next', 'back'])

const ANCHOR = {
  'Product title': 'title',
  'Below add-to-cart': 'belowAtc',
  'Description bullets': 'description',
  'Image with badge': 'hero',
  'Gallery': 'gallery',
}
const shortLabel = {
  'Product title': 'Title', 'Description bullets': 'Description',
  'Below add-to-cart': 'Below add-to-cart', 'Image with badge': 'Image with badge', 'Gallery': 'Gallery',
}
const CANDIDATES = {
  text: ['Product title', 'Description bullets', 'Below add-to-cart'],
  image: ['Gallery', 'Image with badge'],
  'text+image': ['Image with badge', 'Below add-to-cart', 'Gallery'],
}

const content = ref({ ...props.content })
const currentLocation = ref(props.location)
const messages = ref([])

const candidates = computed(() => {
  const list = CANDIDATES[props.contentType] || [props.location]
  return list.includes(props.location) ? list : [props.location, ...list]
})
const currentAnchor = computed(() => ANCHOR[currentLocation.value])

const suggestions = computed(() => {
  const s = ['Make it shorter']
  if (props.contentType !== 'text') s.push('Try another image')
  s.push('Make it bolder')
  return s
})

const regions = computed(() => {
  const out = {}
  for (const loc of candidates.value) {
    const a = ANCHOR[loc]
    out[a] = loc === currentLocation.value
      ? { state: 'applied', content: content.value, location: loc }
      : { state: 'zone', label: shortLabel[loc] || loc }
  }
  return out
})

function pick(anchor) {
  const loc = candidates.value.find(l => ANCHOR[l] === anchor)
  if (loc) currentLocation.value = loc
}

// --- Chat-driven refinement of the block content ---
const imgPool = [storeImages.hero, storeImages.gallery[2], storeImages.related[0].img, storeImages.gallery[1]]
let imgIdx = 0
function nextImage() { imgIdx = (imgIdx + 1) % imgPool.length; return imgPool[imgIdx] }
function shorten(s) {
  const head = s.split(' — ')[0].split('. ')[0]
  const w = head.split(/\s+/)
  return w.slice(0, Math.min(6, w.length)).join(' ')
}

function onChat(text) {
  messages.value.push({ role: 'user', text })
  const r = chatReply(text)
  messages.value.push({ role: 'assistant', text: r.text })
  const t = text.toLowerCase()
  const c = { ...content.value }
  if (/(short|rövid|rovid)/.test(t) && c.text) c.text = shorten(c.text)
  else if (/(image|kép|kep|lifestyle|photo|másik|masik)/.test(t) && props.contentType !== 'text') c.image = nextImage()
  else if (/(bold|merész|meresz|punch)/.test(t) && c.text) c.text = c.text.replace(/[.!]+$/, '') + ' — guaranteed.'
  content.value = c
}

function proceed() {
  emit('next', { location: currentLocation.value, content_type: props.contentType, content: content.value })
}
</script>
