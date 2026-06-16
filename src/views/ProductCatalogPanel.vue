<template>
  <div>
    <!-- Header -->
    <div v-if="!hideTitle" class="flex items-start justify-between gap-4 mb-5">
      <h1 class="text-2xl font-semibold text-om-gray-700">Product catalog</h1>
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-1.5 text-sm text-om-gray-500">
          <Coins :size="16" class="text-om-gray-400" /> Available: 0 credits
        </span>
        <Checkbox v-model="imageCatalog" label="Image Catalog" />
        <div class="w-40">
          <Dropdown v-model="columnsSel" :options="columnOptions" placeholder="Columns" size="sm" />
        </div>
        <Button variant="primary" size="sm">Export</Button>
      </div>
    </div>

    <!-- Domain + sync + search -->
    <div class="flex items-center justify-between gap-4 mb-4">
      <Dropdown v-model="selectedDomain" :options="domains" style="width: 230px">
        <template #icon>
          <div class="w-6 h-6 rounded-full bg-om-gray-900 flex items-center justify-center overflow-hidden">
            <Wine :size="13" class="text-white" />
          </div>
        </template>
      </Dropdown>
      <div class="flex items-center gap-3">
        <span class="text-sm text-om-gray-400">Last synced 2 hours ago</span>
        <button class="w-9 h-9 rounded-lg border border-om-gray-200 flex items-center justify-center text-om-gray-500 hover:bg-om-gray-50 transition-colors cursor-pointer">
          <RefreshCw :size="16" />
        </button>
        <div class="relative w-72">
          <input
            v-model="search"
            type="text"
            placeholder="Search by name and SKU"
            class="w-full h-10 pl-4 pr-10 rounded-lg border border-om-gray-200 text-sm text-om-gray-700 placeholder:text-om-gray-400 focus:outline-none focus:border-om-gray-400"
          />
          <Search :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-om-gray-400" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div>
      <div class="overflow-x-auto">
        <div class="min-w-max">
          <!-- Header row -->
          <div class="flex border-y border-om-gray-100">
            <div class="w-[400px] shrink-0 px-4 py-3 text-sm font-semibold text-om-gray-600 sticky left-0 bg-white z-10">Product</div>
            <div v-for="col in columns" :key="col.key" class="w-[360px] shrink-0 px-4 py-3 text-sm font-semibold text-om-gray-600 border-l border-om-gray-100">{{ col.label }}</div>
          </div>

          <!-- Rows -->
          <div
            v-for="(p, i) in products"
            :key="p.sku"
            class="flex border-b border-om-gray-100 last:border-0"
            :class="i % 2 === 1 ? 'bg-white' : 'bg-white'"
          >
            <!-- Product cell -->
            <div class="w-[400px] shrink-0 px-4 py-4 flex gap-3 items-start sticky left-0 bg-white z-10">
              <div class="w-14 h-16 rounded-md bg-white border border-om-gray-100 shrink-0"></div>
              <div class="min-w-0 h-16 flex flex-col justify-between">
                <p class="text-sm font-semibold text-om-gray-700 leading-snug">{{ p.name }}</p>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm font-semibold text-om-gray-700">{{ p.price }}</span>
                  <Tag v-if="p.tagged" :size="14" class="text-om-gray-300" />
                  <span class="text-xs text-om-gray-400">{{ p.sku }}</span>
                  <span class="text-xs text-om-gray-400">{{ p.stock }}</span>
                </div>
              </div>
            </div>

            <!-- SPPO cells -->
            <div v-for="col in columns" :key="col.key" class="w-[360px] shrink-0 px-4 py-4 border-l border-om-gray-100">
              <template v-if="p[col.key] && p[col.key].length">
                <p v-for="(seg, si) in p[col.key]" :key="si" class="text-[13px] italic text-om-gray-500 leading-relaxed">
                  <span class="font-semibold not-italic text-om-gray-600">{{ seg.lead }}:</span> {{ seg.text }}
                </p>
              </template>
              <span v-else class="text-sm text-om-gray-300">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-4">
      <div class="flex items-center gap-3">
        <span class="text-sm text-om-gray-500">View</span>
        <div class="w-20">
          <Dropdown v-model="pageSize" :options="pageSizes" size="sm" />
        </div>
        <span class="text-sm text-om-gray-400">1 - 10/4555</span>
      </div>
      <div class="flex items-center gap-1">
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-om-gray-400 hover:bg-om-gray-100 cursor-pointer"><ChevronLeft :size="16" /></button>
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium bg-om-gray-100 text-om-gray-700 cursor-pointer">1</button>
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-om-orange-500 hover:bg-om-gray-100 cursor-pointer">2</button>
        <span class="px-1 text-om-gray-400">…</span>
        <button class="w-9 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-om-orange-500 hover:bg-om-gray-100 cursor-pointer">456</button>
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-om-orange-500 hover:bg-om-gray-100 cursor-pointer"><ChevronRight :size="16" /></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Coins, Wine, RefreshCw, Search, Tag, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Checkbox from '../components/shared/Checkbox.vue'

defineProps({
  // Hide the "Product catalog" title (when the parent already labels it).
  hideTitle: { type: Boolean, default: false },
})

const selectedDomain = ref('whiskynet.hu')
const domains = ['whiskynet.hu']
const imageCatalog = ref(false)
const columnsSel = ref('')
const columnOptions = ['SPPO - Benefit List', 'SPPO - Benefit List (test)', 'SPPO - Headline', 'SPPO - USP']
const search = ref('')
const pageSize = ref('10')
const pageSizes = ['10', '25', '50', '100']

const columns = [
  { key: 'benefit', label: 'SPPO - Benefit List' },
  { key: 'benefitTest', label: 'SPPO - Benefit List (test)' },
  { key: 'headline', label: 'SPPO - Headline' },
  { key: 'usp', label: 'SPPO - USP' },
]

const products = [
  { name: 'H GIN Pink Heaven gin DRS (0,7L / 40%)', price: '7990 HUF', sku: 'GIN-12796', stock: 'In stock', tagged: false, benefit: [], benefitTest: [] },
  { name: 'Canerock rum DRS (0,7L / 40%)', price: '13390 HUF', sku: 'RUM-10081', stock: 'In stock', tagged: false,
    benefit: [
      { lead: 'Gazdag desszertszerű profil', text: 'kényeztesse magát a vanília, kókusz és édes karamella aromáival.' },
      { lead: 'Krémesen telt textúra', text: 'élvezze a selymes kortyokat önmagában' },
    ], benefitTest: [] },
  { name: 'Gin Mare Lantern Pack DRS (0,7L / 42,7%)', price: '18050 HUF', sku: 'GIN-4885', stock: 'In stock', tagged: false, benefit: [], benefitTest: [] },
  { name: 'Don Papa Masskara rum DRS (0,7L / 40%)', price: '11390 HUF', sku: 'RUM-13569', stock: 'In stock', tagged: true,
    benefit: [
      { lead: 'Egzotikus calamansi ízesítés', text: 'a fülöp-szigeteki citrusféle egyedülálló frissességet és különleges aromát kölcsönöz.' },
      { lead: 'Kifinomult száraz karakter', text: 'a csökkentett cukortartalom révén' },
    ], benefitTest: [] },
  { name: 'Don Papa Baroko rum DRS (0,7L / 40%)', price: '11990 HUF', sku: 'RUM-13568', stock: 'In stock', tagged: true,
    benefit: [
      { lead: 'Gazdag ízvilág', text: 'intenzív vanília és karamell jegyek uralják ezt a különleges italt.' },
      { lead: 'Tölgyfahordós érlelés', text: 'amerikai hordókban nyeri el mély borostyán színét.' },
    ],
    benefitTest: [
      { lead: 'Gazdag vaníliás karakter', text: 'az amerikai tölgyfahordós érlelésnek köszönhetően intenzív édes jegyek és bársonyos textúra jellemzi.' },
    ] },
  { name: 'Citadelle Vive le Cornichon gin Batch 2. (0,7L / 43,8%)', price: '13290 HUF', sku: 'GIN-11416', stock: 'In stock', tagged: false, benefit: [], benefitTest: [] },
  { name: 'Zacapa Centenario No.23 rum DRS (0,7L / 40%)', price: '15790 HUF', sku: 'RUM-0016', stock: 'In stock', tagged: true,
    benefit: [
      { lead: 'Különleges alapanyag használata', text: 'melasz helyett ritka cukornádmézből készül, amely selymesebb és gazdagabb ízvilágot kölcsönöz a párlatnak.' },
    ], benefitTest: [] },
  { name: 'Bumbu Original rum DRS (0,35L / 40%)', price: '8990 HUF', sku: 'RUM-12000', stock: 'In stock', tagged: false, benefit: [], benefitTest: [] },
  { name: 'Kilkerran 12 éves 2024 whisky DRS (0,7L / 46%)', price: '18990 HUF', sku: 'WSM-12844', stock: 'In stock', tagged: true, benefit: [], benefitTest: [] },
  { name: 'Old Jamaica Ginger Beer DRS (0,33L)', price: '390 HUF', sku: 'MOP-14362', stock: 'In stock', tagged: true, benefit: [], benefitTest: [] },
]
</script>
