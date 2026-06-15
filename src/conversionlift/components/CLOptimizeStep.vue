<template>
  <div class="h-full flex">
    <!-- The "scraped" store page with in-context suggestion pins -->
    <div class="flex-1 min-h-0 overflow-y-auto bg-om-gray-100 px-6 py-5">
      <div class="max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" @click="$emit('back')">
            <template #icon><ArrowLeft :size="15" /></template>Back
          </Button>
          <span class="text-sm text-om-gray-500">
            <b class="text-om-gray-700">{{ appliedCount }}</b> added · {{ openCount }} {{ openCount === 1 ? 'suggestion' : 'suggestions' }} left
          </span>
        </div>
        <ClStorePage :regions="regions" :active-anchor="activeAnchor" @region="onRegion" />
      </div>
    </div>

    <!-- Suggestions panel -->
    <aside class="w-80 shrink-0 border-l border-om-gray-200 bg-white flex flex-col h-full">
      <div class="px-4 h-12 flex items-center justify-between border-b border-om-gray-100 shrink-0">
        <span class="text-sm font-semibold text-om-gray-700">Suggestions</span>
        <span class="text-xs text-om-gray-400">Add as many as you like</span>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5">
        <div
          v-for="(c, i) in cards"
          :key="c.id"
          @click="toggle(c)"
          class="rounded-xl border-2 p-3 transition-all cursor-pointer"
          :class="[
            accepted[c.id] ? 'border-[#2CC896] bg-[#F2FBF8]'
              : activeAnchor === anchorFor(c.location) ? 'border-(--cl-accent-500) bg-(--cl-accent-50)'
              : 'border-om-gray-200 hover:border-(--cl-accent-300)'
          ]"
        >
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
              :class="accepted[c.id] ? 'bg-[#2CC896]' : 'bg-(--cl-accent-500)'">
              <Check v-if="accepted[c.id]" :size="12" /><template v-else>{{ i + 1 }}</template>
            </span>
            <Tag :variant="c.type === 'replace' ? 'gray' : 'green-light'" size="sm">{{ c.type }}</Tag>
            <span class="ml-auto text-[11px] text-om-gray-400">{{ Math.round((c.confidence || 0.7) * 100) }}%</span>
          </div>
          <div class="text-sm font-semibold text-om-gray-800">{{ c.location }}</div>
          <p class="text-xs text-om-gray-500 mt-1 leading-snug">{{ c.rationale }}</p>

          <div class="mt-2.5">
            <div v-if="generating[c.id]" class="flex items-center gap-2 text-xs text-om-gray-500">
              <Loader2 :size="14" class="animate-spin text-[#0EA5E9]" /> Generating…
            </div>
            <Tag v-else-if="accepted[c.id]" variant="green-light" size="sm"><template #icon><Check :size="11" /></template>Added · click to remove</Tag>
            <span v-else class="text-xs text-om-gray-400">Click to add</span>
          </div>
        </div>

        <p v-if="!cards.length" class="text-sm text-om-gray-400 text-center py-6">No suggestions for this type.</p>
      </div>

      <!-- Footer: continue with everything added -->
      <div class="px-3 py-3 border-t border-om-gray-100 shrink-0">
        <Button class="w-full" :disabled="!appliedCount" @click="proceed">
          Continue to preview<span v-if="appliedCount"> ({{ appliedCount }})</span>
          <template #icon><ArrowRight :size="15" /></template>
        </Button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import Tag from '../../components/shared/Tag.vue'
import ClStorePage from './ClStorePage.vue'
import { placeholderImage } from '../data/placeholder.js'
import { getScan, genContent, cardMatchesType, representativeProduct } from '../flowDemo.js'

const props = defineProps({ typeFilter: { type: String, default: null } })
const emit = defineEmits(['next', 'back'])

const product = representativeProduct()

const cards = ref(getScan().filter(c => cardMatchesType(c, props.typeFilter)))
const activeAnchor = ref('')
const accepted = ref({})   // card.id -> { location, content_type, content }
const generating = ref({}) // card.id -> true

const ANCHOR = {
  'Product title': 'title',
  'Below add-to-cart': 'belowAtc',
  'Description bullets': 'description',
  'Image with badge': 'hero',
  'Gallery': 'gallery',
}
function anchorFor(location) { return ANCHOR[location] || 'belowAtc' }

const appliedCount = computed(() => Object.keys(accepted.value).length)
const openCount = computed(() => cards.value.length - appliedCount.value)

const regions = computed(() => {
  const out = {}
  cards.value.forEach((c, i) => {
    const a = anchorFor(c.location)
    if (accepted.value[c.id]) out[a] = { state: 'applied', content: accepted.value[c.id].content, location: c.location }
    else out[a] = { state: 'pin', index: i + 1, location: c.location, label: c.location }
  })
  return out
})

function adjust(content, type) {
  const out = { ...content }
  if (type === 'text') { delete out.image; if (!out.text) out.text = product.title }
  else if (type === 'image') { delete out.text; if (!out.image) out.image = placeholderImage(product.title, product.id + '-img') }
  else { if (!out.text) out.text = `Discover the ${product.attributes.category.toLowerCase()}`; if (!out.image) out.image = placeholderImage(product.title, product.id + '-ti') }
  return out
}

function toggle(c) {
  if (generating.value[c.id]) return
  if (accepted.value[c.id]) undo(c)
  else accept(c)
}
function onRegion(anchor) {
  const c = cards.value.find(x => anchorFor(x.location) === anchor)
  if (c) toggle(c)
}

function accept(c) {
  activeAnchor.value = anchorFor(c.location)
  generating.value = { ...generating.value, [c.id]: true }
  setTimeout(() => {
    accepted.value = { ...accepted.value, [c.id]: { location: c.location, content_type: c.content_type, content: adjust(genContent(c, product), c.content_type) } }
    const g = { ...generating.value }; delete g[c.id]; generating.value = g
  }, 900)
}

function undo(c) {
  const a = { ...accepted.value }; delete a[c.id]; accepted.value = a
}

function proceed() {
  emit('next', Object.values(accepted.value))
}
</script>
