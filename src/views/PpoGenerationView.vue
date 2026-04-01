<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3" @click="showGenMenu = false">

        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('back')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
            <span>Product Page Optimizer</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Generation</span>
          </nav>
        </div>

        <!-- Title + create button -->
        <div class="flex items-center justify-between mb-1">
          <h1 class="text-2xl font-semibold text-om-gray-700">Product Generation</h1>
          <Button variant="primary" size="md" @click="emit('create')">Create Campaign</Button>
        </div>
        <p class="text-sm text-om-gray-500 mb-6">Generate AI content for your products. Each row shows the status for all selected variable types.</p>

        <!-- Tabs -->
        <div class="flex items-center border-b border-om-gray-200 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer"
            :class="activeTab === tab.value ? 'text-om-orange-500' : 'text-om-gray-500 hover:text-om-gray-700'"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
            <span v-if="activeTab === tab.value" class="absolute bottom-0 left-0 right-0 h-0.5 bg-om-orange-500" />
          </button>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-700" />
              <input v-model="searchQuery" type="text" placeholder="Search products..." class="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 w-44" />
            </div>
            <Button variant="secondary" size="sm">
              <template #icon><SlidersHorizontal :size="15" /></template>
              Filters
            </Button>
            <Button variant="secondary" size="sm">
              <template #icon><Upload :size="15" /></template>
              Import CSV
            </Button>
            <Button variant="secondary" size="sm">
              <template #icon><ArrowDownAZ :size="15" /></template>
              Popularity
            </Button>
          </div>
          <!-- Generate dropdown -->
          <div class="relative">
            <Button variant="primary" size="md" @click.stop="showGenMenu = !showGenMenu">
              Generate
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </Button>
            <div
              v-if="showGenMenu"
              class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[360px] overflow-hidden"
            >
              <button
                class="w-full flex items-center justify-between px-4 py-3 text-sm border-b border-om-gray-100 transition-colors"
                :class="selectedProducts.length > 0 ? 'hover:bg-om-gray-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                :disabled="selectedProducts.length === 0"
                @click="generateForIds(selectedProducts)"
              >
                <span class="text-om-gray-700 text-left">Generate for selected ({{ selectedProducts.length }})</span>
                <span class="flex items-center gap-1.5 font-medium ml-8 tabular-nums whitespace-nowrap" :class="selectedProducts.length > 0 ? 'text-om-orange-500' : 'text-om-gray-400'">
                  <Coins :size="13" />
                  {{ (selectedProducts.length * 20 * variableTypes.length).toLocaleString() }} credits
                </span>
              </button>
              <button
                v-for="opt in genMenuOptions"
                :key="opt.count"
                class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer border-b border-om-gray-100 last:border-b-0"
                @click="generateForCount(opt.count)"
              >
                <span class="text-om-gray-700 text-left">Generate for {{ opt.count }} products</span>
                <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-8 tabular-nums whitespace-nowrap">
                  <Coins :size="13" />
                  {{ (opt.count * 20 * variableTypes.length).toLocaleString() }} credits
                </span>
              </button>
              <button class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer"
                @click="generateAllRemaining"
              >
                <span class="text-om-gray-700 text-left">Generate all remaining ({{ products.filter(p => p.status !== 'generated').length }})</span>
                <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-8 tabular-nums whitespace-nowrap">
                  <Coins :size="13" />
                  {{ (products.filter(p => p.status !== 'generated').length * 20 * variableTypes.length).toLocaleString() }} credits
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Product list -->
        <div class="flex flex-col gap-3">
          <div
            v-for="product in pagedProducts"
            :key="product.id"
            class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
          >
            <!-- Checkbox -->
            <div class="flex items-center pr-3 shrink-0 self-start pt-1" @click.stop>
              <Checkbox :model-value="selectedProducts.includes(product.id)" @update:model-value="v => toggleSelect(product.id, v)" />
            </div>
            <!-- Left half: product thumbnail + info -->
            <div class="flex items-center gap-3 w-1/2 pr-4 self-start">
              <div class="aspect-square h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                <img src="/whisky.png" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-om-gray-700">{{ product.name }}</p>
                <p class="text-xs text-om-gray-400 mt-0.5">{{ product.desc }}</p>
              </div>
            </div>

            <!-- Divider -->
            <div class="w-px bg-om-gray-100 shrink-0 self-stretch"></div>

            <!-- Right half: all variable types stacked with individual badges -->
            <div class="w-1/2 pl-4 flex flex-col gap-3">
              <!-- Image type: Product image -->
              <div v-if="hasImageType('product-image')" class="flex flex-col gap-1.5">
                <div class="flex items-center gap-1.5">
                  <ImageIcon :size="12" class="text-om-gray-400 shrink-0" />
                  <span class="text-[11px] font-semibold text-om-gray-400 uppercase tracking-wider flex-1">Product image</span>
                  <span v-if="product.status === 'generated'" class="ready-badge shrink-0 flex items-center justify-center gap-0 bg-[#D6F5EC] text-[#2CC896] rounded-full p-1 cursor-default transition-all duration-200 overflow-hidden">
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-width="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 12l3 3 5-5" /></svg>
                    <span class="ready-label text-[11px] font-medium whitespace-nowrap max-w-0 opacity-0 transition-all duration-200">Ready to use</span>
                  </span>
                  <Tag v-else-if="product.status === 'generating'" variant="orange" class="shrink-0">
                    <template #icon><svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></template>
                    Generating
                  </Tag>
                </div>
                <div
                  class="rounded-lg overflow-hidden"
                  style="aspect-ratio: 1/1; width: 96px;"
                  :class="product.status === 'generated' ? '' : 'border-2 border-dashed border-om-gray-200 flex items-center justify-center'"
                >
                  <img v-if="product.status === 'generated'" src="/image-with-badge/whisky2.png" class="w-full h-full object-cover" />
                  <svg v-else class="w-5 h-5 text-om-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>

              <!-- Text types with individual badges -->
              <template v-if="hasTextTypes">
                <div v-for="type in textTypes" :key="type.id" class="border-t border-om-gray-100 pt-2.5 flex flex-col gap-1.5">
                  <div class="flex items-center gap-1.5">
                    <Type :size="12" class="text-om-gray-400 shrink-0" />
                    <span class="text-[11px] font-semibold text-om-gray-400 uppercase tracking-wider flex-1">{{ type.label }}</span>
                    <span v-if="product.status === 'generated'" class="ready-badge shrink-0 flex items-center justify-center gap-0 bg-[#D6F5EC] text-[#2CC896] rounded-full p-1 cursor-default transition-all duration-200 overflow-hidden">
                      <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-width="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 12l3 3 5-5" /></svg>
                      <span class="ready-label text-[11px] font-medium whitespace-nowrap max-w-0 opacity-0 transition-all duration-200">Ready to use</span>
                    </span>
                    <Tag v-else-if="product.status === 'generating'" variant="orange" class="shrink-0">
                      <template #icon><svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></template>
                      Generating
                    </Tag>
                  </div>
                  <!-- Generated content -->
                  <template v-if="product.status === 'generated'">
                    <p v-if="type.id === 'product-sentence'" class="text-sm text-om-gray-600 leading-relaxed">
                      A unique blend of Irish whiskey with vanilla and roasted malt — silky smooth, perfect neat or in cocktails.
                    </p>
                    <ul v-else-if="type.id === 'benefit-list'" class="flex flex-col gap-1">
                      <li class="flex items-start gap-2 text-sm text-om-gray-600">
                        <span class="mt-1 w-1.5 h-1.5 rounded-full bg-om-gray-400 shrink-0"></span>
                        Unique Irish whiskey & vanilla blend
                      </li>
                      <li class="flex items-start gap-2 text-sm text-om-gray-600">
                        <span class="mt-1 w-1.5 h-1.5 rounded-full bg-om-gray-400 shrink-0"></span>
                        Silky smooth, perfect neat or on ice
                      </li>
                      <li class="flex items-start gap-2 text-sm text-om-gray-600">
                        <span class="mt-1 w-1.5 h-1.5 rounded-full bg-om-gray-400 shrink-0"></span>
                        Award-winning craft liqueur
                      </li>
                    </ul>
                  </template>
                  <!-- Skeleton -->
                  <template v-else>
                    <div v-if="type.id === 'product-sentence'" class="flex flex-col gap-2">
                      <div class="h-3 bg-om-gray-200 rounded w-full"></div>
                      <div class="h-3 bg-om-gray-200 rounded w-3/4"></div>
                    </div>
                    <div v-else-if="type.id === 'benefit-list'" class="flex flex-col gap-2">
                      <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-om-gray-200 shrink-0"></div>
                        <div class="h-3 bg-om-gray-200 rounded w-4/5"></div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-om-gray-200 shrink-0"></div>
                        <div class="h-3 bg-om-gray-200 rounded w-3/5"></div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-om-gray-200 shrink-0"></div>
                        <div class="h-3 bg-om-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>

              <!-- Image badge type -->
              <div v-if="hasImageType('image-badge')" class="border-t border-om-gray-100 pt-2.5">
                <div class="flex items-center gap-1.5 mb-1.5">
                  <ImageIcon :size="12" class="text-om-gray-400 shrink-0" />
                  <span class="text-[11px] font-semibold text-om-gray-400 uppercase tracking-wider flex-1">Kép badge-el</span>
                  <span v-if="product.status === 'generated'" class="ready-badge shrink-0 flex items-center justify-center gap-0 bg-[#D6F5EC] text-[#2CC896] rounded-full p-1 cursor-default transition-all duration-200 overflow-hidden">
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-width="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 12l3 3 5-5" /></svg>
                    <span class="ready-label text-[11px] font-medium whitespace-nowrap max-w-0 opacity-0 transition-all duration-200">Ready to use</span>
                  </span>
                  <Tag v-else-if="product.status === 'generating'" variant="orange" class="shrink-0">
                    <template #icon><svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></template>
                    Generating
                  </Tag>
                </div>
                <div
                  class="rounded-lg shrink-0 overflow-hidden h-16 w-full"
                  :class="product.status === 'generated' ? '' : 'border-2 border-dashed border-om-gray-200 flex items-center justify-center'"
                >
                  <img v-if="product.status === 'generated'" src="/image-with-badge/whisky2.png" class="w-full h-full object-cover" />
                  <svg v-else class="w-5 h-5 text-om-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="sticky bottom-0 bg-white border-t border-om-gray-100 flex items-center justify-between px-1 py-4 mt-2 rounded-b-xl">
          <span class="text-sm text-om-gray-400">{{ products.length }} products</span>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm" :disabled="page === 1" @click="page--">Previous</Button>
            <template v-for="p in totalPages" :key="p">
              <Button v-if="p <= 3 || p === totalPages" variant="ghost" size="sm" :active="p === page" @click="page = p">{{ p }}</Button>
              <span v-else-if="p === 4 && totalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
            </template>
            <Button variant="ghost" size="sm" :disabled="page === totalPages" @click="page++">Next</Button>
          </div>
        </div>

      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Tag from '../components/shared/Tag.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import { ArrowLeft, Search, SlidersHorizontal, Upload, ArrowDownAZ, Coins, ImageIcon, Type } from 'lucide-vue-next'

const props = defineProps({
  selectedTypes: { type: Array, default: () => [] },
})
const emit = defineEmits(['menu-click', 'back', 'create'])

// Variable types from selected
const allTypes = [
  { id: 'product-image',    label: 'Product Image' },
  { id: 'image-badge',      label: 'Image Badge' },
  { id: 'headline',         label: 'Headline' },
  { id: 'subheadline',      label: 'Subheadline' },
  { id: 'benefit-list',     label: 'Benefit List' },
  { id: 'product-sentence', label: 'Product Sentence' },
  { id: 'summary',          label: 'Summary' },
]

const variableTypes = computed(() => allTypes.filter(t => props.selectedTypes.includes(t.id)))

const isImageTypeId = (id) => id === 'product-image' || id === 'image-badge'
const textTypes = computed(() => variableTypes.value.filter(t => !isImageTypeId(t.id)))
const hasTextTypes = computed(() => textTypes.value.length > 0)
const hasImageType = (id) => variableTypes.value.some(t => t.id === id)

// Product image aspect ratio — 1:1 square or 16:9 default
const productImageRatio = computed(() => {
  const imgType = variableTypes.value.find(t => t.id === 'product-image')
  return imgType ? '1/1' : '16/9'
})

// Tabs
const activeTab = ref('selected')
const tabs = [
  { value: 'selected', label: 'Selected' },
  { value: 'generated', label: 'Generated' },
]

// Search
const searchQuery = ref('')

// Generate menu
const showGenMenu = ref(false)
const genMenuOptions = [
  { count: 1 },
  { count: 10 },
  { count: 25 },
  { count: 100 },
]

// Selection
const selectedProducts = ref([])
const toggleSelect = (id, selected) => {
  if (selected) selectedProducts.value.push(id)
  else selectedProducts.value.splice(selectedProducts.value.indexOf(id), 1)
}

// Demo products
const products = ref([
  { id: 1, name: 'Premium Wireless Headphones', desc: 'Noise-cancelling over-ear headphones with 30-hour battery life.', status: 'generated' },
  { id: 2, name: 'Minimalist Ceramic Mug', desc: 'Handcrafted 12oz ceramic mug with matte finish.', status: 'queued' },
  { id: 3, name: 'Ergonomic Office Chair', desc: 'Adjustable lumbar support and breathable mesh back.', status: 'queued' },
  { id: 4, name: 'Smart Fitness Watch', desc: 'Heart rate monitor, GPS, and water-resistant design.', status: 'queued' },
  { id: 5, name: 'Organic Cotton T-Shirt', desc: '100% organic cotton, ethically sourced and manufactured.', status: 'queued' },
  { id: 6, name: 'Noise-Cancelling Earbuds', desc: 'True wireless earbuds with active noise cancellation.', status: 'queued' },
  { id: 7, name: 'Bamboo Cutting Board', desc: 'Eco-friendly bamboo cutting board with juice groove.', status: 'queued' },
  { id: 8, name: 'Stainless Steel Water Bottle', desc: 'Double-walled insulated bottle, keeps drinks cold 24h.', status: 'queued' },
  { id: 9, name: 'Leather Wallet', desc: 'Slim bifold wallet crafted from genuine full-grain leather.', status: 'queued' },
  { id: 10, name: 'Portable Bluetooth Speaker', desc: 'Waterproof speaker with 360 sound and 12-hour battery.', status: 'queued' },
  { id: 11, name: 'Yoga Mat Pro', desc: 'Non-slip 6mm thick mat with alignment lines.', status: 'queued' },
  { id: 12, name: 'Scented Soy Candle Set', desc: 'Set of 3 hand-poured soy candles, 40-hour burn time each.', status: 'queued' },
  { id: 13, name: 'Mechanical Keyboard', desc: 'Compact TKL layout with Cherry MX switches.', status: 'queued' },
  { id: 14, name: 'Ceramic Plant Pot', desc: 'Handmade ceramic pot with drainage hole, 15cm diameter.', status: 'queued' },
  { id: 15, name: 'Merino Wool Beanie', desc: 'Super-soft 100% merino wool, one size fits all.', status: 'queued' },
  { id: 16, name: 'Wooden Desk Organizer', desc: 'Modular bamboo organizer with removable dividers.', status: 'queued' },
  { id: 17, name: 'Glass Food Storage Set', desc: 'Set of 5 borosilicate glass containers with locking lids.', status: 'queued' },
  { id: 18, name: 'Running Shoes', desc: 'Lightweight mesh upper with responsive foam midsole.', status: 'queued' },
  { id: 19, name: 'Aromatherapy Diffuser', desc: 'Ultrasonic diffuser with 7-color LED and timer.', status: 'queued' },
  { id: 20, name: 'Cast Iron Skillet', desc: '10-inch pre-seasoned cast iron pan for stovetop and oven.', status: 'queued' },
].map(p => ({
  ...p,
  variables: Object.fromEntries(
    (props.selectedTypes || []).map(t => [t, p.status === 'generated' ? 'generated' : 'queued'])
  ),
})))

// Pagination
const page = ref(1)
const perPage = 10
const filteredProducts = computed(() => {
  let list = products.value
  if (activeTab.value === 'generated') list = list.filter(p => p.status === 'generated')
  if (searchQuery.value) list = list.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  return list
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)))
const pagedProducts = computed(() => filteredProducts.value.slice((page.value - 1) * perPage, page.value * perPage))

// Status helpers
const productStatus = (product) => {
  if (product.status === 'generated') return 'green'
  if (product.status === 'generating') return 'orange'
  return 'gray-muted'
}
const productStatusLabel = (product) => {
  if (product.status === 'generated') return 'Ready to use'
  if (product.status === 'generating') return 'Generating'
  return 'Queued'
}

// Generation logic
const generateForIds = (ids) => {
  showGenMenu.value = false
  const targets = products.value.filter(p => ids.includes(p.id) && p.status !== 'generated')
  targets.forEach((p, i) => {
    p.status = 'generating'
    setTimeout(() => { p.status = 'generated' }, 1500 + i * 800)
  })
}

const generateForCount = (count) => {
  showGenMenu.value = false
  const targets = products.value.filter(p => p.status !== 'generated').slice(0, count)
  targets.forEach((p, i) => {
    p.status = 'generating'
    setTimeout(() => { p.status = 'generated' }, 1500 + i * 800)
  })
}

const generateAllRemaining = () => {
  showGenMenu.value = false
  const targets = products.value.filter(p => p.status !== 'generated')
  targets.forEach((p, i) => {
    p.status = 'generating'
    setTimeout(() => { p.status = 'generated' }, 1500 + i * 800)
  })
}
</script>

<style scoped>
.ready-badge:hover {
  gap: 4px;
  padding-right: 8px;
}
.ready-badge:hover .ready-label {
  max-width: 80px;
  opacity: 1;
}
</style>
