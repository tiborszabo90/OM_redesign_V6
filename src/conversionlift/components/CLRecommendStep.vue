<template>
  <div class="h-full flex">
    <!-- LEFT: itemized recommendations to choose from -->
    <aside class="w-96 shrink-0 border-r border-om-gray-200 bg-white flex flex-col h-full">
      <div class="px-5 pt-5 pb-3 border-b border-om-gray-100">
        <h2 class="text-lg font-bold text-om-gray-800">We found {{ items.length }} ways to lift conversion</h2>
        <p class="text-sm text-om-gray-500 mt-0.5">Pick the numbered pin you want to set up first — the rest stay here for later.</p>

        <!-- Combined potential, captured one recommendation at a time -->
        <div class="mt-3 flex items-center gap-3">
          <svg width="60" height="60" viewBox="0 0 72 72" class="shrink-0">
            <circle cx="36" cy="36" r="28" fill="none" stroke="#E5E7EB" stroke-width="8" />
            <circle cx="36" cy="36" r="28" fill="none" stroke="#0EA5E9" stroke-width="8" stroke-linecap="round"
              stroke-dasharray="176" :stroke-dashoffset="176 - 176 * (selectedId ? 0.25 : 0)" transform="rotate(-90 36 36)" style="transition: stroke-dashoffset .3s" />
            <text x="36" y="34" text-anchor="middle" font-size="15" font-weight="700" fill="#1c1c1c">{{ selectedId ? 1 : 0 }}/{{ items.length }}</text>
            <text x="36" y="48" text-anchor="middle" font-size="9" fill="#9ca3af">set up</text>
          </svg>
          <div class="min-w-0">
            <div class="text-base font-bold text-[#0369A1] leading-tight">Capture up to {{ POTENTIAL_LIFT }}</div>
            <div class="text-xs text-om-gray-500 mt-0.5">Set up one at a time to capture more of it.</div>
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-2.5">
        <button
          v-for="it in items"
          :key="it.id"
          @click="toggle(it.id)"
          class="w-full text-left rounded-xl border p-3 transition-all cursor-pointer"
          :class="selectedId === it.id
            ? 'border-(--cl-accent-500) bg-(--cl-accent-50) shadow-[0_2px_10px_rgba(14,165,233,0.12)]'
            : 'border-om-gray-200 hover:border-(--cl-accent-300)'"
        >
          <div class="flex items-start gap-3">
            <span class="mt-0.5 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors"
              :class="selectedId === it.id ? 'bg-(--cl-accent-600) text-white' : 'bg-white text-(--cl-accent-600) ring-2 ring-(--cl-accent-400)'">
              <Check v-if="selectedId === it.id" :size="14" />
              <template v-else>{{ it.pinNo }}</template>
            </span>
            <div class="min-w-0 flex-1">
              <span class="text-sm font-semibold text-om-gray-800">{{ it.card.location }}</span>
              <p class="text-xs text-om-gray-500 mt-1 leading-snug">{{ it.card.diagnosis }}</p>
            </div>
          </div>
        </button>
      </div>
    </aside>

    <!-- RIGHT: the product page with every recommendation pinned (preview) -->
    <div class="flex-1 min-w-0 relative">
      <div ref="pageScroll" class="absolute inset-0 overflow-y-auto bg-om-gray-100 px-6 py-5">
        <div :class="device === 'mobile' ? 'w-[400px] max-w-full mx-auto' : 'max-w-5xl mx-auto'">
          <ClStorePage :product="product" :regions="regions" :focused-id="selectedId" preview-mode="variant" selectable pin-select :device="device" @region="toggle" />
        </div>
      </div>
    </div>

    <!-- Continue + device toggle live in the top-right of the flow header -->
    <Teleport to="#cl-topbar-end">
      <div class="inline-flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
        <button v-for="d in ['desktop', 'mobile']" :key="d" @click="device = d" :title="d === 'desktop' ? 'Desktop' : 'Mobile'"
          class="px-2 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer"
          :class="device === d ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700'">
          <component :is="d === 'desktop' ? Monitor : Smartphone" :size="14" />
        </button>
      </div>
      <Button size="sm" variant="primary" :disabled="!selectedId" @click="proceed">Continue</Button>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { Check, Monitor, Smartphone } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import ClStorePage from './ClStorePage.vue'
import { getScan, genContent, representativeProduct, POTENTIAL_LIFT } from '../flowDemo.js'

const emit = defineEmits(['next'])

const product = ref(representativeProduct())
const ANCHOR = {
  'Product title': 'title',
  'Below add-to-cart': 'belowAtc',
  'Description bullets': 'description',
  'Image with badge': 'hero',
  'Above the details': 'aboveTabs',
  'Gallery': 'gallery',
}
const items = getScan().map((card, i) => ({
  id: card.id,
  card,
  pinNo: i + 1,
  // Image-with-badge sits above the Description/Specifications/Reviews tabs by default.
  location: card.id === 'opt-pg-hero' ? 'Above the details' : card.location,
  content: genContent(card, product.value),
}))

// Every recommendation is embedded on the page (preview), so the user can see them.
const regions = computed(() => {
  const out = {}
  for (const it of items) {
    const anchor = ANCHOR[it.location] || 'belowAtc'
    ;(out[anchor] ||= []).push({ id: it.id, state: 'applied', content: it.content, location: it.location, pinNo: it.pinNo })
  }
  return out
})

const selectedId = ref(null) // only one recommendation can be selected
const device = ref('desktop') // desktop | mobile preview of the store page
const pageScroll = ref(null)

async function scrollToEntry(id) {
  await nextTick()
  const el = pageScroll.value?.querySelector(`[data-entry="${id}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
// Selecting a recommendation (from the right list OR by clicking it on the page):
// single-select, highlight it on the page, and scroll to it.
function toggle(id) {
  selectedId.value = selectedId.value === id ? null : id
  scrollToEntry(id)
}
function proceed() {
  emit('next', selectedId.value ? [selectedId.value] : [])
}
</script>
