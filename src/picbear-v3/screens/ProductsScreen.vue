<script setup>
import { ref, computed, watch } from 'vue'
import { state, products, variationBatches, productCategories } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import { Check, Star, ArrowRight, Search, X, ChevronDown } from 'lucide-vue-next'

// Onboarding and a live account both pick freely from the whole catalog; the
// next step decides how many of them to generate right away.
const capped = computed(() => !state.published)

const count = computed(() => state.selected.length)

// ── catalog filters (live account) ──
const query = ref('')
const filter = ref('all')       // all | bestsellers | no-image | has-image, or null after Clear selection
const categories = ref([])      // storefront collections; empty means the whole catalog
const catOpen = ref(false)      // the category picker; a real store can have dozens
const catQuery = ref('')

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
    if (categories.value.length && !categories.value.includes(p.category)) return false
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
watch([query, filter, categories], () => { shown.value = PAGE }, { deep: true })

function categoryCount(c) {
  return products.filter(p => p.category === c).length
}

const catMatches = computed(() => {
  const q = catQuery.value.trim().toLowerCase()
  return q ? productCategories.filter(c => c.toLowerCase().includes(q)) : productCategories
})

const categoryLabel = computed(() => {
  if (!categories.value.length) return 'All categories'
  if (categories.value.length === 1) return categories.value[0]
  return `${categories.value.length} categories`
})

const allVisibleSelected = computed(() =>
  visible.value.length > 0 && visible.value.every(p => state.selected.includes(p.id))
)

function toggle(id) {
  const i = state.selected.indexOf(id)
  if (i >= 0) state.selected.splice(i, 1)
  else state.selected.push(id)
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

// What you filter to is what you pick: no filter means the whole catalog, and
// choosing categories selects those categories. Single products stay togglable.
function syncSelection() {
  state.selected = visible.value.map(p => p.id)
}

// The chips and the categories are two ways to pick the same thing, so they
// never stay lit at once: one takes over, the other clears.
function pickFilter(id) {
  filter.value = id
  categories.value = []
  syncSelection()
}

function toggleCategory(c) {
  const i = categories.value.indexOf(c)
  if (i >= 0) categories.value.splice(i, 1)
  else categories.value.push(c)
  // No category left means the whole catalog again, which is what "All products" is.
  filter.value = categories.value.length ? null : 'all'
  syncSelection()
}

function allCategories() {
  categories.value = []
  filter.value = 'all'
  syncSelection()
}

function keepTop10() {
  state.selected = products.slice(0, 10).map(p => p.id)
  next()
}

// Clearing drops the filters too, back to the untouched full catalog: no chip
// active, not even "All products".
const filtersActive = computed(() => !!query.value.trim() || categories.value.length > 0 || filter.value !== null)
const canClear = computed(() => count.value > 0 || filtersActive.value)

function clearAll() {
  state.selected = []
  query.value = ''
  categories.value = []
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
        subtitle="Your whole catalog is selected. Narrow it to categories, or unpick single products; the next step decides how many to generate now."
        back-to="placement"
        :skip-label="capped ? 'Keep top 10' : ''"
        @skip="keepTop10"
      />

      <!-- Catalog filters -->
      <div class="pb-card p-3 mb-4 flex items-center gap-3 flex-wrap">
        <div class="relative flex-1 min-w-[220px]">
          <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
          <input
            v-model="query"
            type="text"
            placeholder="Search products"
            class="w-full rounded-lg border border-[#d4d4d4] pl-9 pr-8 py-2 text-[13px] outline-none"
          />
          <button v-if="query" class="absolute right-2 top-1/2 -translate-y-1/2 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer" @click="query = ''">
            <X :size="14" />
          </button>
        </div>
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="f in filters" :key="f.id"
            class="rounded-lg border px-3 py-1.5 text-[13px] cursor-pointer transition-colors"
            :class="filter === f.id ? 'border-[#b2592e] bg-[#fdf4ef] text-[#6b3319] font-semibold' : 'border-[#d4d4d4] text-[#303030] hover:border-[#a0a0a0]'"
            @click="pickFilter(f.id)"
          >{{ f.label }} <span class="text-[#8a8a8a] font-normal">{{ f.count }}</span></button>
        </div>

        <!-- Whole categories, one or several at a time. A store can have dozens,
             so they live in a searchable list rather than a chip row. -->
        <div class="relative">
          <button
            class="rounded-lg border px-3 py-1.5 text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5"
            :class="categories.length ? 'border-[#b2592e] bg-[#fdf4ef] text-[#6b3319] font-semibold' : 'border-[#d4d4d4] text-[#303030] hover:border-[#a0a0a0]'"
            @click="catOpen = !catOpen"
          >
            {{ categoryLabel }} <span class="text-[#8a8a8a] font-normal">{{ visible.length }}</span>
            <ChevronDown :size="14" :class="catOpen ? 'rotate-180 transition-transform' : 'transition-transform'" />
          </button>

          <div v-if="catOpen" class="fixed inset-0 z-20" @click="catOpen = false"></div>
          <div v-if="catOpen" class="pb-menu left-0 right-auto w-[260px] p-2 z-30">
            <input
              v-model="catQuery"
              type="text"
              placeholder="Search categories"
              class="w-full rounded-lg border border-[#d4d4d4] px-2.5 py-1.5 text-[13px] outline-none mb-1"
            />
            <button class="pb-menu-item" @click="allCategories()">
              <span class="flex-1 text-left">All categories</span>
              <span class="text-[12px] text-[#8a8a8a]">{{ products.length }}</span>
            </button>
            <div class="max-h-[240px] overflow-y-auto">
              <label
                v-for="c in catMatches" :key="c"
                class="pb-menu-item cursor-pointer"
              >
                <input
                  type="checkbox" class="w-4 h-4 accent-[#1a1a1a]"
                  :checked="categories.includes(c)"
                  @change="toggleCategory(c)"
                />
                <span class="flex-1 text-left truncate">{{ c }}</span>
                <span class="text-[12px] text-[#8a8a8a]">{{ categoryCount(c) }}</span>
              </label>
              <p v-if="!catMatches.length" class="px-2 py-3 text-[12px] text-[#8a8a8a] text-center">No category matches.</p>
            </div>
          </div>
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
          :class="state.selected.includes(p.id) ? 'ring-2 ring-[#b2592e] border-transparent!' : 'hover:shadow-md'"
          @click="toggle(p.id)"
        >
          <div class="aspect-square relative">
            <img :src="p.img" class="w-full h-full object-cover" />
            <span
              class="absolute top-2 left-2 w-5 h-5 rounded-md flex items-center justify-center"
              :class="state.selected.includes(p.id) ? 'bg-[#b2592e]' : 'bg-white/95 border border-[#c9c9c9]'"
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
    <div class="sticky bottom-[var(--dev-nav-height,0px)] px-6 py-3 bg-white border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          {{ count }} products selected
        </p>
        <button class="pb-btn-primary" :disabled="!count" @click="next">
          Continue <ArrowRight :size="13" />
        </button>
      </div>
    </div>
  </div>
</template>
