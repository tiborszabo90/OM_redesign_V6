<template>
  <ClFlowShell title="" :steps="[]" :current="0" :back="false" @exit="$emit('navigate', 'conversionlift')">
    <div class="h-full flex flex-col bg-om-gray-50">
      <div class="max-w-4xl w-full mx-auto px-6 pt-8 pb-3 shrink-0">
        <h2 class="text-2xl font-bold text-om-gray-800">Which product pages?</h2>
        <p class="text-sm text-om-gray-500 mt-1.5">Browse and tap the products to include — each gets its own AI-written version.</p>

        <div class="mt-5 flex items-center gap-2 flex-wrap">
          <button v-for="f in filters" :key="f" @click="filter = f"
            class="px-3 h-8 rounded-full text-sm font-medium border transition-colors cursor-pointer"
            :class="filter === f ? 'border-(--cl-accent-500) bg-(--cl-accent-50) text-[#0369A1]' : 'border-om-gray-200 text-om-gray-600 hover:border-(--cl-accent-300)'">{{ f }}</button>
          <button class="ml-auto text-sm font-medium text-(--cl-accent-600) hover:text-(--cl-accent-700) cursor-pointer" @click="toggleVisible(!allVisibleSelected)">
            {{ allVisibleSelected ? 'Clear all' : 'Select all' }}
          </button>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <div class="max-w-4xl w-full mx-auto px-6 pb-6 grid grid-cols-4 gap-3">
          <button v-for="(p, i) in visible" :key="p.id" @click="toggle(p.id)"
            class="relative text-left rounded-xl overflow-hidden border-2 bg-white transition-all cursor-pointer"
            :class="selected.has(p.id) ? 'border-(--cl-accent-500) shadow-[0_4px_14px_rgba(14,165,233,0.18)]' : 'border-om-gray-200 hover:border-(--cl-accent-300)'">
            <div class="relative aspect-4/3">
              <img :src="imgs[i % imgs.length]" alt="" class="w-full h-full object-cover" />
              <span class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors"
                :class="selected.has(p.id) ? 'bg-(--cl-accent-500) border-(--cl-accent-500) text-white' : 'bg-white/80 border-white/90 text-transparent'"><Check :size="12" /></span>
            </div>
            <div class="px-2.5 py-2">
              <div class="text-xs font-medium text-om-gray-800 truncate">{{ p.title }}</div>
              <div class="text-xs text-om-gray-400 mt-0.5">${{ p.attributes.price }}</div>
            </div>
          </button>
        </div>
      </div>

      <div class="border-t border-om-gray-200 bg-white shrink-0">
        <div class="max-w-4xl w-full mx-auto px-6 py-3 text-sm text-om-gray-600"><b class="text-om-gray-800">{{ selected.size }}</b> of {{ catalog.length }} products selected</div>
      </div>
    </div>

    <Teleport defer to="#cl-topbar-end">
      <Button size="sm" variant="primary" :disabled="selected.size === 0">Next</Button>
    </Teleport>
  </ClFlowShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check } from 'lucide-vue-next'
import ClFlowShell from './components/ClFlowShell.vue'
import Button from '../components/shared/Button.vue'
import { getCatalog } from './data/catalog.js'
import { storeImages } from './data/storeImages.js'

defineEmits(['navigate'])

const imgs = [...storeImages.gallery, ...storeImages.related.map(r => r.img)]
const catalog = getCatalog('peakgear.example')
const filters = ['All', ...[...new Set(catalog.map(p => p.attributes.category))]]
const filter = ref('All')
const visible = computed(() => filter.value === 'All' ? catalog : catalog.filter(p => p.attributes.category === filter.value))

const selected = ref(new Set())
function toggle(id) {
  const next = new Set(selected.value)
  next.has(id) ? next.delete(id) : next.add(id)
  selected.value = next
}
const allVisibleSelected = computed(() => visible.value.length > 0 && visible.value.every(p => selected.value.has(p.id)))
function toggleVisible(on) {
  const next = new Set(selected.value)
  visible.value.forEach(p => on ? next.add(p.id) : next.delete(p.id))
  selected.value = next
}
</script>
