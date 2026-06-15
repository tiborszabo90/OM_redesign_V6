<template>
  <div class="h-full overflow-y-auto bg-om-gray-50">
    <div class="max-w-2xl mx-auto px-6 py-10">
      <h2 class="text-2xl font-bold text-om-gray-800">Target the right pages</h2>
      <p class="text-sm text-om-gray-500 mt-1.5">Define a rule to match pages in bulk — each gets its own AI-written version. Fine-tune by hand only if you need to.</p>

      <!-- Rule builder (the segment) -->
      <div class="mt-6 rounded-2xl border border-om-gray-200 bg-white p-5 space-y-3.5">
        <div class="text-xs font-semibold uppercase tracking-wide text-om-gray-400">Include products where</div>
        <div class="flex items-center gap-3">
          <span class="w-16 text-sm text-om-gray-500 shrink-0">Category</span>
          <Dropdown v-model="cat" :options="catOptions" size="sm" class="flex-1" />
        </div>
        <div class="flex items-center gap-3">
          <span class="w-16 text-sm text-om-gray-500 shrink-0">Price</span>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="p in priceOptions" :key="p" @click="price = p" class="seg-chip" :class="price === p ? 'seg-on' : 'seg-off'">{{ p }}</button>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-16 text-sm text-om-gray-500 shrink-0">Rating</span>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="r in ratingOptions" :key="r" @click="rating = r" class="seg-chip" :class="rating === r ? 'seg-on' : 'seg-off'">{{ r }}</button>
          </div>
        </div>
        <div class="pt-3 border-t border-om-gray-100 space-y-2.5">
          <label class="flex items-center gap-2.5 cursor-pointer">
            <Checkbox v-model="inStock" size="sm" /><span class="text-sm text-om-gray-700">Only in stock</span>
          </label>
          <label class="flex items-center gap-2.5 cursor-pointer">
            <Checkbox v-model="hasTraffic" size="sm" /><span class="text-sm text-om-gray-700">Only products with traffic</span>
          </label>
        </div>

        <!-- match count + sync mode (inside the rule block) -->
        <div class="pt-3.5 border-t border-om-gray-100 flex items-center gap-2.5">
          <Layers :size="18" class="text-(--cl-accent-600) shrink-0" />
          <span class="text-sm text-om-gray-600">
            <b class="text-om-gray-800">{{ finalCount }}</b>
            <template v-if="excludedCount"> targeted · {{ excludedCount }} excluded</template>
            <template v-else> product page{{ finalCount === 1 ? '' : 's' }} match this segment</template>.
          </span>
          <div class="ml-auto inline-flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
            <button v-for="m in syncModes" :key="m.key" @click="syncMode = m.key"
              class="px-2.5 h-7 rounded-md text-xs font-medium transition-colors cursor-pointer"
              :class="syncMode === m.key ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700'">{{ m.label }}</button>
          </div>
        </div>
      </div>

      <!-- Manual fine-tune: import + sort -->
      <div class="mt-5 mb-2 flex items-center gap-2">
        <span class="text-sm font-semibold text-om-gray-700">Fine-tune which pages</span>
        <span v-if="excludedCount" class="text-xs font-normal text-om-gray-400">({{ excludedCount }} excluded)</span>
        <div class="ml-auto flex items-center gap-2">
          <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="onCsv" />
          <Button size="sm" variant="secondary" @click="fileInput?.click()"><template #icon><Upload :size="14" /></template>Import CSV</Button>
          <Dropdown v-model="sort" :options="sortOptions" size="sm" class="w-40" />
        </div>
      </div>
      <div class="space-y-2">
        <label v-for="(p, i) in sortedMatched" :key="p.id"
          class="flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 cursor-pointer transition-all"
          :class="excluded.has(p.id) ? 'border-om-gray-200 opacity-55' : 'border-om-gray-200 hover:border-(--cl-accent-300)'">
          <Checkbox :model-value="!excluded.has(p.id)" size="sm" @update:model-value="v => setIncluded(p.id, v)" />
          <img :src="imgs[i % imgs.length]" alt="" class="w-10 h-10 rounded-lg object-cover bg-om-gray-100 shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-om-gray-800 truncate" :class="excluded.has(p.id) ? 'line-through' : ''">{{ p.title }}</div>
            <div class="text-xs text-om-gray-400"><span class="font-mono">{{ p.sku }}</span> · {{ p.attributes.category }}</div>
          </div>
          <span class="text-sm font-semibold text-om-gray-600 shrink-0">${{ p.attributes.price }}</span>
        </label>
        <p v-if="!matched.length" class="text-sm text-om-gray-400 text-center py-6">No products match this rule. Loosen the conditions above.</p>
      </div>
    </div>

    <Teleport defer to="#cl-topbar-end">
      <Button size="sm" variant="primary" :disabled="finalCount === 0" @click="$emit('next', targeted)">Next</Button>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Layers, Upload } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import Checkbox from '../../components/shared/Checkbox.vue'
import Dropdown from '../../components/shared/Dropdown.vue'
import { getCatalog } from '../data/catalog.js'
import { storeImages } from '../data/storeImages.js'

defineEmits(['next'])

const imgs = [...storeImages.gallery, ...storeImages.related.map(r => r.img)]
// Deterministic mock flags (no real stock/traffic data in v1).
const catalog = getCatalog('peakgear.example').map((p, i) => ({ ...p, inStock: i % 8 !== 3, hasTraffic: i % 5 !== 0 }))
const catOptions = ['Any category', ...[...new Set(catalog.map(p => p.attributes.category))]]
const priceOptions = ['Any', 'Under $100', '$100–$200', 'Over $200']
const ratingOptions = ['Any', '4.5★ and up']
const syncModes = [{ key: 'lock', label: 'Lock at launch' }, { key: 'sync', label: 'Keep in sync' }]
const sortOptions = ['Name (A–Z)', 'Price (low to high)', 'Price (high to low)', 'Category']

const cat = ref('Any category')
const price = ref('Any')
const rating = ref('Any')
const syncMode = ref('lock')
const excluded = ref(new Set())
const inStock = ref(false)
const hasTraffic = ref(false)
const sort = ref('Name (A–Z)')
const fileInput = ref(null)
function onCsv() { /* prototype: CSV import is a no-op for now */ }

const matched = computed(() => catalog.filter(p => {
  const a = p.attributes
  if (cat.value !== 'Any category' && a.category !== cat.value) return false
  if (price.value === 'Under $100' && !(a.price < 100)) return false
  if (price.value === '$100–$200' && !(a.price >= 100 && a.price <= 200)) return false
  if (price.value === 'Over $200' && !(a.price > 200)) return false
  if (rating.value === '4.5★ and up' && !(a.rating >= 4.5)) return false
  if (inStock.value && !p.inStock) return false
  if (hasTraffic.value && !p.hasTraffic) return false
  return true
}))
const sortedMatched = computed(() => {
  const arr = [...matched.value]
  if (sort.value === 'Name (A–Z)') arr.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort.value === 'Price (low to high)') arr.sort((a, b) => a.attributes.price - b.attributes.price)
  else if (sort.value === 'Price (high to low)') arr.sort((a, b) => b.attributes.price - a.attributes.price)
  else if (sort.value === 'Category') arr.sort((a, b) => a.attributes.category.localeCompare(b.attributes.category) || a.title.localeCompare(b.title))
  return arr
})
const targeted = computed(() => matched.value.filter(p => !excluded.value.has(p.id)))
const finalCount = computed(() => targeted.value.length)
const excludedCount = computed(() => matched.value.length - targeted.value.length)

function setIncluded(id, included) {
  const next = new Set(excluded.value)
  included ? next.delete(id) : next.add(id)
  excluded.value = next
}
</script>

<style scoped>
.seg-chip { padding: 0 0.75rem; height: 2rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; border-width: 1px; cursor: pointer; transition: border-color .15s, background-color .15s; }
.seg-on { border-color: var(--cl-accent-500); background: var(--cl-accent-50); color: #0369A1; }
.seg-off { border-color: #e4e4e7; color: #52525b; }
.seg-off:hover { border-color: var(--cl-accent-300); }
</style>
