<template>
  <ClFlowShell title="" :steps="[]" :current="0" :back="false" @exit="$emit('navigate', 'conversionlift')">
    <div class="h-full overflow-y-auto bg-om-gray-50">
      <div class="max-w-2xl mx-auto px-6 py-10">
        <h2 class="text-2xl font-bold text-om-gray-800">Build a product segment</h2>
        <p class="text-sm text-om-gray-500 mt-1.5">Set rules and we include every matching page — each gets its own AI-written version. The segment stays in sync as the catalog changes.</p>

        <div class="mt-6 rounded-2xl border border-om-gray-200 bg-white p-5 space-y-4">
          <div class="text-xs font-semibold uppercase tracking-wide text-om-gray-400">Include products where</div>

          <div class="flex items-center gap-3">
            <span class="w-20 text-sm text-om-gray-500 shrink-0">Category</span>
            <Dropdown v-model="cat" :options="catOptions" size="sm" class="flex-1" />
          </div>

          <div class="flex items-center gap-3">
            <span class="w-20 text-sm text-om-gray-500 shrink-0">Price</span>
            <div class="flex flex-wrap gap-1.5">
              <button v-for="p in priceOptions" :key="p" @click="price = p"
                class="px-3 h-8 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
                :class="price === p ? 'border-(--cl-accent-500) bg-(--cl-accent-50) text-[#0369A1]' : 'border-om-gray-200 text-om-gray-600 hover:border-(--cl-accent-300)'">{{ p }}</button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="w-20 text-sm text-om-gray-500 shrink-0">Rating</span>
            <div class="flex flex-wrap gap-1.5">
              <button v-for="r in ratingOptions" :key="r" @click="rating = r"
                class="px-3 h-8 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
                :class="rating === r ? 'border-(--cl-accent-500) bg-(--cl-accent-50) text-[#0369A1]' : 'border-om-gray-200 text-om-gray-600 hover:border-(--cl-accent-300)'">{{ r }}</button>
            </div>
          </div>
        </div>

        <div class="mt-5 rounded-xl bg-white border border-om-gray-200 p-4">
          <div class="flex items-center gap-2.5">
            <Layers :size="18" class="text-(--cl-accent-600) shrink-0" />
            <span class="text-sm text-om-gray-600"><b class="text-om-gray-800">{{ matched.length }}</b> product page{{ matched.length === 1 ? '' : 's' }} match this segment.</span>
          </div>
          <div v-if="matched.length" class="mt-3 flex items-center gap-2">
            <img v-for="(p, i) in matched.slice(0, 7)" :key="p.id" :src="imgs[i % imgs.length]" alt="" class="w-10 h-10 rounded-lg object-cover bg-om-gray-100" :title="p.title" />
            <span v-if="matched.length > 7" class="text-xs text-om-gray-400">+{{ matched.length - 7 }} more</span>
          </div>
        </div>
      </div>
    </div>

    <Teleport defer to="#cl-topbar-end">
      <Button size="sm" variant="primary" :disabled="matched.length === 0">Next</Button>
    </Teleport>
  </ClFlowShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Layers } from 'lucide-vue-next'
import ClFlowShell from './components/ClFlowShell.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import { getCatalog } from './data/catalog.js'
import { storeImages } from './data/storeImages.js'

defineEmits(['navigate'])

const imgs = [...storeImages.gallery, ...storeImages.related.map(r => r.img)]
const catalog = getCatalog('peakgear.example')
const catOptions = ['Any category', ...[...new Set(catalog.map(p => p.attributes.category))]]
const priceOptions = ['Any', 'Under $100', '$100–$200', 'Over $200']
const ratingOptions = ['Any', '4.5★ and up']

const cat = ref('Any category')
const price = ref('Any')
const rating = ref('Any')

const matched = computed(() => catalog.filter(p => {
  const a = p.attributes
  if (cat.value !== 'Any category' && a.category !== cat.value) return false
  if (price.value === 'Under $100' && !(a.price < 100)) return false
  if (price.value === '$100–$200' && !(a.price >= 100 && a.price <= 200)) return false
  if (price.value === 'Over $200' && !(a.price > 200)) return false
  if (rating.value === '4.5★ and up' && !(a.rating >= 4.5)) return false
  return true
}))
</script>
