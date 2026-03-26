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

        <!-- Variable type chips -->
        <div class="flex items-center gap-2 mb-4">
          <Tag v-for="type in variableTypes" :key="type.id" variant="outlined">{{ type.label }}</Tag>
        </div>

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
              >
                <span class="text-om-gray-700 text-left">Generate for {{ opt.count }} products</span>
                <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-8 tabular-nums whitespace-nowrap">
                  <Coins :size="13" />
                  {{ (opt.count * 20 * variableTypes.length).toLocaleString() }} credits
                </span>
              </button>
              <button class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer">
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
            class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-center gap-4 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
          >
            <!-- Checkbox -->
            <div @click.stop>
              <Checkbox :model-value="selectedProducts.includes(product.id)" @update:model-value="v => toggleSelect(product.id, v)" />
            </div>

            <!-- Product info -->
            <div class="flex items-center gap-3 w-[280px] shrink-0">
              <div class="w-12 h-12 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                <img src="/product1.jpg" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-om-gray-700 truncate">{{ product.name }}</p>
                <p class="text-xs text-om-gray-400 truncate">{{ product.desc }}</p>
              </div>
            </div>

            <!-- Variable columns -->
            <div class="flex-1 grid gap-3" :style="{ gridTemplateColumns: `repeat(${variableTypes.length}, 1fr)` }">
              <div v-for="type in variableTypes" :key="type.id" class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full shrink-0" :class="product.variables?.[type.id] === 'generated' ? 'bg-[#2CC896]' : product.variables?.[type.id] === 'generating' ? 'bg-om-orange-400' : 'bg-om-gray-300'" />
                <span class="text-xs text-om-gray-500 truncate">{{ type.label }}</span>
                <Tag v-if="product.variables?.[type.id] === 'generated'" variant="green" size="sm">Done</Tag>
                <Tag v-else-if="product.variables?.[type.id] === 'generating'" variant="orange" size="sm">...</Tag>
              </div>
            </div>

            <!-- Overall status -->
            <Tag :variant="productStatus(product)" size="sm" class="shrink-0">{{ productStatusLabel(product) }}</Tag>
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
import { ArrowLeft, Search, SlidersHorizontal, Upload, ArrowDownAZ, Coins } from 'lucide-vue-next'

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
</script>
