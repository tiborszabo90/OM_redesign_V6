<script setup>
import { ref, computed, watch } from 'vue'
import { state, products, variationBatches, productCategories } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import { Check, Star, ArrowRight, Gift, Search, X } from 'lucide-vue-next'

// Onboarding runs on the free plan, so the selection is capped at the included
// image credits. A live account picks freely from the whole catalog instead and
// decides on the next step how many of them to generate right away.
const capped = computed(() => !state.published)

const limit = computed(() => state.imageLimit)
const isTrial = computed(() => state.plan === 'trial')
const count = computed(() => state.selected.length)
const atLimit = computed(() => capped.value && count.value >= limit.value)

// ── catalog filters (live account) ──
const query = ref('')
const filter = ref('all')       // all | bestsellers | no-image | has-image, or null after Clear selection
const category = ref('all')     // storefront collection

// Products that already have an AI image in some variation.
const withImage = computed(() => new Set(variationBatches.flatMap(b => b.generatedIds)))

const ranked = computed(() => [...products].sort((a, b) => b.sales - a.sales))
function rank(p) {
  return ranked.value.indexOf(p) + 1
}

const filters = computed(() => {
  const base = [
    { id: 'all', label: 'All products', count: products.length },
    { id: 'bestsellers', label: 'Bestsellers', count: Math.min(10, products.length) },
  ]
  // Nothing is generated yet during onboarding, so those two filters would be lies.
  if (capped.value) return base
  return [
    ...base,
    { id: 'no-image', label: 'No AI image yet', count: products.filter(p => !withImage.value.has(p.id)).length },
    { id: 'has-image', label: 'Already upgraded', count: withImage.value.size },
  ]
})

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  return products.filter(p => {
    if (q && !p.name.toLowerCase().includes(q)) return false
    if (category.value !== 'all' && p.category !== category.value) return false
    if (filter.value === 'bestsellers') return rank(p) <= 10
    if (filter.value === 'no-image') return !withImage.value.has(p.id)
    if (filter.value === 'has-image') return withImage.value.has(p.id)
    return true
  })
})

// The catalog is large, so the grid grows in pages instead of rendering it all.
const PAGE = 48
const shown = ref(PAGE)
const paged = computed(() => visible.value.slice(0, shown.value))
const hiddenCount = computed(() => Math.max(0, visible.value.length - paged.value.length))
watch([query, filter, category], () => { shown.value = PAGE })

function categoryCount(c) {
  return products.filter(p => p.category === c).length
}

const allVisibleSelected = computed(() =>
  visible.value.length > 0 && visible.value.every(p => state.selected.includes(p.id))
)

function toggle(id) {
  const i = state.selected.indexOf(id)
  if (i >= 0) state.selected.splice(i, 1)
  else if (!atLimit.value) state.selected.push(id)
}

function toggleVisible() {
  if (allVisibleSelected.value) {
    const ids = new Set(visible.value.map(p => p.id))
    state.selected = state.selected.filter(id => !ids.has(id))
  } else {
    const merged = new Set([...state.selected, ...visible.value.map(p => p.id)])
    state.selected = [...merged]
  }
}

// "All products" doubles as a select-all. On the free plan it fills up to the
// included credits, a live account takes the whole catalog.
function pickFilter(id) {
  filter.value = id
  if (id !== 'all') return
  const ids = visible.value.map(p => p.id)
  state.selected = capped.value ? ids.slice(0, limit.value) : ids
}

function keepTop10() {
  state.selected = products.slice(0, 10).map(p => p.id)
  next()
}

// Clearing drops the filters too, back to the untouched full catalog: no chip
// active, not even "All products".
const filtersActive = computed(() => !!query.value.trim() || category.value !== 'all' || filter.value !== null)
const canClear = computed(() => count.value > 0 || filtersActive.value)

function clearAll() {
  state.selected = []
  query.value = ''
  category.value = 'all'
  filter.value = null
}

function next() {
  if (!count.value) return
  state.steps.products = true
  state.genPhase = 'preview'
  state.screen = 'generate'
}
</script>

<template>
  <!-- Column layout so the action bar sits at the bottom on short pages too. -->
  <div class="min-h-full flex flex-col">
    <div class="flex-1 py-5">
      <div class="max-w-[960px] mx-auto px-6">
      <WizardHeader
        :step="3"
        title="Pick the products to upgrade"
        :subtitle="capped
          ? 'We preselected your 10 best sellers. Swap any of them, or just keep the list.'
          : 'Your whole catalog is here. Select as many as you like, you choose on the next step how many to generate now.'"
        back-to="placement"
        :skip-label="capped ? 'Keep top 10' : ''"
        @skip="keepTop10"
      />

      <!-- Credits framing (onboarding only; a live account is not capped here) -->
      <div v-if="capped" class="mb-5 flex items-center gap-3 rounded-xl bg-[#f6f5ff] border border-[#dedbf7] p-4">
        <span class="w-9 h-9 rounded-lg bg-[#5548e0] flex items-center justify-center shrink-0">
          <Gift :size="18" class="text-white" />
        </span>
        <div v-if="isTrial">
          <p class="text-[15px] font-bold text-[#1a1a1a]">10 free image upgrades included</p>
          <p class="text-[13px] text-[#616161] mt-0.5">Every selected product uses one, and you can add more later on a paid plan.</p>
        </div>
        <div v-else>
          <p class="text-[15px] font-bold text-[#1a1a1a] capitalize">{{ state.plan }} plan active</p>
          <p class="text-[13px] text-[#616161] mt-0.5">{{ limit >= 999 ? 'Unlimited' : limit }} AI images per month. Select as many products as you like.</p>
        </div>
      </div>

      <!-- Catalog filters -->
      <div class="pb-card p-3 mb-4 flex items-center gap-3 flex-wrap">
        <div class="relative flex-1 min-w-[220px]">
          <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            v-model="query"
            type="text"
            placeholder="Search products"
            class="w-full rounded-lg border border-[#d4d4d4] pl-9 pr-8 py-2 text-[13px] outline-none focus:border-[#5548e0]"
          />
          <button v-if="query" class="absolute right-2 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer" @click="query = ''">
            <X :size="14" />
          </button>
        </div>
        <select
          v-model="category"
          class="rounded-lg border border-[#d4d4d4] px-2.5 py-2 text-[13px] bg-white outline-none focus:border-[#5548e0]"
        >
          <option value="all">All categories ({{ products.length }})</option>
          <option v-for="c in productCategories" :key="c" :value="c">{{ c }} ({{ categoryCount(c) }})</option>
        </select>
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="f in filters" :key="f.id"
            class="rounded-lg border px-3 py-1.5 text-[13px] cursor-pointer transition-colors"
            :class="filter === f.id ? 'border-[#5548e0] bg-[#f6f5ff] text-[#3a3468] font-semibold' : 'border-[#d4d4d4] text-[#303030] hover:border-[#a0a0a0]'"
            @click="pickFilter(f.id)"
          >{{ f.label }} <span class="text-[#8a8a8a] font-normal">{{ f.count }}</span></button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center justify-between mb-3 px-1">
        <p class="text-[12px] text-[#616161]">
          Showing {{ paged.length }} of {{ visible.length }} products<span v-if="visible.length !== products.length"> (filtered from {{ products.length }})</span>
        </p>
        <div class="flex items-center gap-1">
          <button v-if="!capped" class="pb-btn-ghost" @click="toggleVisible">
            {{ allVisibleSelected ? 'Deselect these' : `Select these ${visible.length}` }}
          </button>
          <button class="pb-btn-ghost" :disabled="!canClear" @click="clearAll">Clear selection</button>
        </div>
      </div>

      <!-- Product grid -->
      <div class="grid grid-cols-4 gap-3 mb-5">
        <div
          v-for="p in paged" :key="p.id"
          class="pb-card overflow-hidden cursor-pointer relative"
          :class="state.selected.includes(p.id) ? 'ring-2 ring-[#5548e0] border-transparent!' : (atLimit ? 'opacity-60' : 'hover:shadow-md')"
          @click="toggle(p.id)"
        >
          <div class="aspect-square relative">
            <img :src="p.img" class="w-full h-full object-cover" />
            <span
              class="absolute top-2 left-2 w-5 h-5 rounded-md flex items-center justify-center"
              :class="state.selected.includes(p.id) ? 'bg-[#5548e0]' : 'bg-white/95 border border-[#c9c9c9]'"
            >
              <Check v-if="state.selected.includes(p.id)" :size="12" class="text-white" />
            </span>
            <span
              v-if="p.bestseller"
              class="absolute top-2 right-2 inline-flex items-center gap-1 bg-white/95 rounded-full px-1.5 py-0.5 text-[10px] font-semibold shadow"
            >
              <Star :size="9" class="fill-[#eab308] text-[#eab308]" /> #1
            </span>
            <span
              v-else-if="!capped && withImage.has(p.id)"
              class="absolute top-2 right-2 bg-white/95 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-[#616161] shadow"
            >Upgraded</span>
          </div>
          <div class="p-2.5">
            <p class="font-medium text-[#1a1a1a] truncate">{{ p.name }}</p>
            <p class="text-[12px] text-[#616161]">{{ p.price }} · {{ p.sales }} sold, rank #{{ rank(p) }}</p>
          </div>
        </div>
      </div>

      <div v-if="hiddenCount" class="flex justify-center mb-5">
        <button class="pb-btn-secondary" @click="shown += PAGE">Show {{ Math.min(PAGE, hiddenCount) }} more ({{ hiddenCount }} left)</button>
      </div>

      <p v-if="!visible.length" class="pb-card p-6 text-center text-[13px] text-[#616161] mb-5">
        No product matches this filter.
      </p>
    </div>

    </div>

    <!-- Full-width sticky action bar -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] px-6 py-3 bg-[#f1f1f1]/90 backdrop-blur border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          <span v-if="atLimit && isTrial">Free limit reached. Unselect a product, or subscribe to add more.</span>
          <span v-else-if="atLimit">Plan limit reached. Unselect a product to swap in another one.</span>
          <span v-else-if="capped && isTrial">{{ count }} of {{ limit }} free upgrades selected</span>
          <span v-else>{{ count }} products selected</span>
        </p>
        <button class="pb-btn-primary" :disabled="!count" @click="next">
          Continue <ArrowRight :size="13" />
        </button>
      </div>
    </div>
  </div>
</template>
