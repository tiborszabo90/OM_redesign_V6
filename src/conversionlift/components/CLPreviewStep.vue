<template>
  <div class="h-full flex">
    <div class="flex-1 min-h-0 overflow-y-auto bg-om-gray-100">
      <div class="max-w-3xl mx-auto px-6 py-5">
        <div class="flex items-end justify-between mb-3">
          <div>
            <h2 class="text-lg font-semibold text-om-gray-800">Live preview</h2>
            <p class="text-sm text-om-gray-500">Your changes, applied to the page. Refine in chat.</p>
          </div>
          <div class="inline-flex rounded-lg border border-om-gray-200 bg-white p-0.5">
            <button v-for="m in modes" :key="m.key" @click="mode = m.key"
              class="px-3 h-8 rounded-md text-sm font-medium transition-colors cursor-pointer"
              :class="mode === m.key ? 'bg-(--cl-accent-500) text-white' : 'text-om-gray-500 hover:text-om-gray-700'">{{ m.label }}</button>
          </div>
        </div>

        <ClStorePage :regions="regions" :preview-mode="mode" />

        <div class="mt-5 flex items-center justify-between">
          <Button variant="ghost" @click="$emit('back')"><template #icon><ArrowLeft :size="16" /></template>Back</Button>
          <div class="flex items-center gap-2">
            <Button variant="secondary" @click="$emit('restart')">Start over</Button>
            <Button @click="saved = true"><template #icon><Check :size="16" /></template>Save draft</Button>
          </div>
        </div>

        <div v-if="saved" class="mt-4 rounded-xl border border-(--cl-accent-200) bg-(--cl-accent-50) px-4 py-3 text-sm text-[#0369A1] flex items-center gap-2">
          <CheckCircle2 :size="16" /> Draft saved. Launching as an experiment requires connecting your store (handled at launch).
        </div>
      </div>
    </div>

    <ClChatRail :messages="messages" :suggestions="suggestions" intro="Refine your changes in plain language." @send="onChat" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import ClStorePage from './ClStorePage.vue'
import ClChatRail from './ClChatRail.vue'
import { chatReply } from '../flowDemo.js'
import { storeImages } from '../data/storeImages.js'

const props = defineProps({
  // One or more applied changes: [{ location, content_type, content }]
  items: { type: Array, default: () => [] },
})
defineEmits(['back', 'restart'])

const ANCHOR = {
  'Product title': 'title',
  'Below add-to-cart': 'belowAtc',
  'Description bullets': 'description',
  'Image with badge': 'hero',
  'Gallery': 'gallery',
}

const mode = ref('variant')
const modes = [{ key: 'control', label: 'Control' }, { key: 'variant', label: 'Variable' }]
const saved = ref(false)

// Editable copy so chat can refine the content.
const items = ref(props.items.map(it => ({ ...it, content: { ...it.content } })))
const messages = ref([])

const suggestions = computed(() => {
  const s = ['Make it shorter']
  if (items.value.some(it => it.content?.image)) s.push('Try another image')
  s.push('Make it bolder')
  return s
})

const regions = computed(() => {
  const out = {}
  for (const it of items.value) {
    if (!it || !it.location) continue
    out[ANCHOR[it.location] || 'belowAtc'] = { state: 'applied', content: it.content, location: it.location }
  }
  return out
})

// --- Chat-driven refinement ---
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
  items.value = items.value.map(it => {
    const c = { ...it.content }
    if (/(short|rövid|rovid)/.test(t) && c.text) c.text = shorten(c.text)
    else if (/(image|kép|kep|lifestyle|photo|másik|masik)/.test(t) && c.image) c.image = nextImage()
    else if (/(bold|merész|meresz|punch)/.test(t) && c.text) c.text = c.text.replace(/[.!]+$/, '') + ' — guaranteed.'
    return { ...it, content: c }
  })
}
</script>
