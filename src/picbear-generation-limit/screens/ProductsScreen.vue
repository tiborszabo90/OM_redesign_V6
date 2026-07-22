<script setup>
import { ref, computed } from 'vue'
import { state, products } from '../store'
import { PawPrint, ChevronRight, Check } from 'lucide-vue-next'

// picbear-current mirror of the currently-live product-select step
// (app.onboarding.products.tsx): style/limit line, search + collection filter,
// select all, and a selectable product grid. Localized to the coffee demo.
const LIMIT = 10

const query = ref('')
const search = ref('')
const selected = ref(new Set())

const collectionsOpen = ref(false)
const collectionSearch = ref('')
const selectedCollections = ref(new Set())
const collections = [
  { id: 'c1', title: 'Bestsellers', count: 8 },
  { id: 'c2', title: 'Home page', count: 1 },
  { id: 'c3', title: 'Beans & blends', count: 12 },
]
const visibleCollections = computed(() =>
  collections.filter(c => c.title.toLowerCase().includes(collectionSearch.value.toLowerCase())),
)

const filtered = computed(() =>
  products.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase())),
)

const newSelectedCount = computed(() => selected.value.size)
const allSelected = computed(() => filtered.value.length > 0 && filtered.value.every(p => selected.value.has(p.id)))

function runSearch() {
  search.value = query.value
}
function toggleProduct(id) {
  const s = new Set(selected.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selected.value = s
}
function toggleAll() {
  if (allSelected.value) {
    selected.value = new Set()
  } else {
    selected.value = new Set(filtered.value.map(p => p.id))
  }
}
function toggleCollection(id) {
  const s = new Set(selectedCollections.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selectedCollections.value = s
}

function back() {
  state.screen = 'placement'
}
function cont() {
  if (!selected.value.size) return
  state.steps.products = true
  state.screen = 'generate'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Breadcrumb header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
          <PawPrint :size="15" class="text-white" />
        </span>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="back">Back</button>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">Select products to upgrade</h1>
      </div>
      <div class="flex items-center gap-2">
        <button v-if="selected.size" class="pb-btn-primary" @click="cont">
          Continue with {{ selected.size }} product{{ selected.size !== 1 ? 's' : '' }}
        </button>
      </div>
    </div>

    <!-- Style / limit line -->
    <div class="pb-card p-4 mb-4 flex items-center gap-3">
      <span class="text-[13px] font-semibold text-[#1a1a1a]">Style: {{ state.style || 'people' }}</span>
      <span class="text-[13px] text-[#616161]">Selecting {{ newSelectedCount }} new of {{ LIMIT }} remaining (free tier)</span>
    </div>

    <!-- Search + collection filter -->
    <div class="pb-card p-4 mb-4 relative">
      <div class="flex items-center gap-3">
        <input
          v-model="query"
          type="text"
          placeholder="Search products..."
          class="flex-1 px-3 py-2 border border-[#ccc] rounded text-[14px] focus:outline-none focus:border-[#5548e0]"
          @keyup.enter="runSearch"
        />
        <button class="pb-btn-secondary" @click="runSearch">Search</button>
        <button
          class="pb-btn-secondary flex items-center gap-1"
          :class="{ 'border-[#008060]! text-[#008060]! bg-[#f1f8f5]!': selectedCollections.size }"
          @click="collectionsOpen = !collectionsOpen"
        >
          {{ selectedCollections.size ? `Collections (${selectedCollections.size})` : 'Collections: All' }} ▾
        </button>
      </div>

      <!-- Collections popover -->
      <div
        v-if="collectionsOpen"
        class="absolute right-4 top-16 z-50 w-[260px] max-h-80 overflow-y-auto bg-white border border-[#e1e3e5] rounded-lg shadow-lg p-2"
      >
        <input
          v-model="collectionSearch"
          type="text"
          placeholder="Search collections..."
          class="w-full px-2 py-1.5 border border-[#ccc] rounded text-[13px] mb-2 focus:outline-none"
        />
        <label
          v-for="c in visibleCollections" :key="c.id"
          class="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-[14px] hover:bg-[#f6f6f7]"
        >
          <input type="checkbox" :checked="selectedCollections.has(c.id)" class="accent-[#008060]" @change="toggleCollection(c.id)" />
          <span class="flex-1 truncate">{{ c.title }}</span>
          <span class="text-[#6d7175] text-[12px]">{{ c.count }}</span>
        </label>
        <div v-if="!visibleCollections.length" class="px-2 py-1.5 text-[#6d7175] text-[13px]">No collections found</div>
      </div>
    </div>

    <!-- Select all -->
    <div class="pb-card p-4 mb-4">
      <button class="pb-btn-ghost" @click="toggleAll">{{ allSelected ? 'Deselect all' : 'Select all' }}</button>
    </div>

    <!-- Product grid -->
    <div class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))">
      <div
        v-for="p in filtered" :key="p.id"
        class="rounded-lg p-3 cursor-pointer transition-colors"
        :class="selected.has(p.id) ? 'border-2 border-[#008060] bg-[#f1f8f5]' : 'border border-[#e1e3e5] hover:border-[#c9c9c9]'"
        @click="toggleProduct(p.id)"
      >
        <img :src="p.img" :alt="p.name" class="w-full h-[140px] object-cover rounded mb-2" />
        <p class="text-[13px] text-[#1a1a1a]" :class="{ 'font-semibold': selected.has(p.id) }">{{ p.name }}</p>
        <p class="text-[13px] text-[#6d7175] mt-0.5">{{ p.price }}</p>
        <p v-if="selected.has(p.id)" class="text-[13px] font-semibold text-[#008060] mt-1 flex items-center gap-1">
          <Check :size="13" /> Selected
        </p>
      </div>
    </div>
  </div>
</template>
