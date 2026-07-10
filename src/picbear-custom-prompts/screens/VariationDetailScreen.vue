<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { state, variationList, variationProducts, products } from '../store'
import { PawPrint, ChevronRight, ArrowUpRight, ArrowRight, Search, ShoppingBag, History, X, Loader2 } from 'lucide-vue-next'

// picbear-current mirror of the variation detail page
// (app.variations.$variationId.tsx): action bar, stats, storefront preview,
// generation progress, and per-product list. Localized to the coffee demo.
const variation = computed(() =>
  variationList.find(v => v.id === state.variationDetailId) || variationList[0],
)

// Variations created via "Start generating" carry their own product list with
// live statuses; pre-existing ones fall back to an all-done list.
const detailProducts = computed(() => variation.value.products || variationProducts(variation.value.count))

const device = ref('desktop')
const selectedProductId = ref(detailProducts.value[0]?.id ?? null)
const selectedProduct = computed(() =>
  products.find(p => p.id === selectedProductId.value) || products[0],
)

const total = computed(() => detailProducts.value.length)
const generated = computed(() => detailProducts.value.filter(p => p.status === 'done').length)
const percent = computed(() => (total.value ? Math.round((generated.value / total.value) * 100) : 0))
const generating = computed(() => !!variation.value.generating && generated.value < total.value)

// Simulate live generation: complete the current product, start the next queued.
let timer = null
onMounted(() => {
  if (!variation.value.generating) return
  timer = setInterval(() => {
    const prods = variation.value.products
    if (!prods) return clearInterval(timer)
    const gen = prods.find(p => p.status === 'generating')
    if (gen) gen.status = 'done'
    const queued = prods.find(p => p.status === 'queued')
    if (queued) queued.status = 'generating'
    if (!prods.some(p => p.status === 'generating' || p.status === 'queued')) {
      variation.value.generating = false
      clearInterval(timer)
    }
  }, 1600)
})
onUnmounted(() => { if (timer) clearInterval(timer) })

const brand = 'roast-and-co'

// Per-product edit modal
const editProduct = ref(null)
const editPrompt = ref('')
function openEdit(p) {
  editProduct.value = p
  editPrompt.value = ''
}
function closeEdit() {
  editProduct.value = null
  editPrompt.value = ''
}

function backToList() {
  state.variationDetailId = null
}
function activate() {
  variationList.forEach(v => { v.status = 'inactive' })
  variation.value.status = 'active'
}
function del() {
  if (!confirm('Delete this variation and its upgraded products?')) return
  const i = variationList.indexOf(variation.value)
  if (i !== -1) variationList.splice(i, 1)
  state.variationDetailId = null
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
        <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="backToList">Variations</button>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">{{ variation.name }}</h1>
      </div>
    </div>

    <!-- Action bar -->
    <div class="pb-card p-4 mb-4 flex items-center gap-3 flex-wrap">
      <span
        class="text-[12px] font-semibold rounded-full px-2.5 py-0.5"
        :class="variation.status === 'active' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#fff3cd] text-[#856404]'"
      >{{ variation.status === 'active' ? 'Active' : 'Inactive' }}</span>
      <button v-if="variation.status !== 'active'" class="pb-btn-secondary" @click="activate">Activate</button>
      <button v-else class="pb-btn-secondary" @click="variation.status = 'inactive'">Deactivate</button>
      <button class="pb-btn-secondary">Edit placement</button>
      <button class="pb-btn-secondary">Rename</button>
      <button class="text-[13px] font-semibold text-[#d72c0d] hover:underline cursor-pointer ml-1" @click="del">Delete</button>
    </div>

    <!-- Stats row -->
    <div class="pb-card p-4 mb-4">
      <div class="grid grid-cols-5 gap-3">
        <div class="rounded-lg border border-[#e3e3e3] p-3">
          <p class="text-[12px] text-[#6d7175] mb-1">Mode</p>
          <p class="text-[14px] font-medium text-[#1a1a1a]">{{ variation.mode }}</p>
        </div>
        <div class="rounded-lg border border-[#e3e3e3] p-3">
          <p class="text-[12px] text-[#6d7175] mb-1">Position</p>
          <p class="text-[14px] font-medium text-[#1a1a1a]">{{ variation.position }}</p>
        </div>
        <div class="rounded-lg border border-[#e3e3e3] p-3">
          <p class="text-[12px] text-[#6d7175] mb-1">Products</p>
          <p class="text-[14px] font-medium text-[#1a1a1a]">{{ variation.count }} / 10</p>
        </div>
        <div class="rounded-lg border border-[#e3e3e3] p-3">
          <p class="text-[12px] text-[#6d7175] mb-1">Status</p>
          <span
            class="inline-block text-[12px] font-semibold rounded-full px-2.5 py-0.5"
            :class="variation.status === 'active' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#fff3cd] text-[#856404]'"
          >{{ variation.status === 'active' ? 'Active' : 'Inactive' }}</span>
        </div>
        <div class="rounded-lg border border-[#e3e3e3] p-3">
          <p class="text-[12px] text-[#6d7175] mb-1">A/B Test</p>
          <p class="text-[14px] font-medium text-[#1a1a1a]">None</p>
        </div>
      </div>
    </div>

    <!-- Storefront preview -->
    <div class="pb-card p-4 mb-4">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-[13px] text-[#616161] shrink-0">Preview on storefront</span>
        <select v-model="selectedProductId" class="text-[13px] border border-[#d4d4d4] rounded-lg px-2.5 py-1.5 bg-white text-[#1a1a1a] cursor-pointer">
          <option v-for="p in detailProducts" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <div class="flex items-center justify-between border-b border-[#ececec] mb-0">
        <div class="flex items-center gap-4">
          <button
            class="text-[14px] pb-2.5 -mb-px border-b-[3px] cursor-pointer"
            :class="device === 'desktop' ? 'border-[#008060] text-[#202223] font-bold' : 'border-transparent text-[#6d7175] font-medium'"
            @click="device = 'desktop'"
          >Desktop</button>
          <button
            class="text-[14px] pb-2.5 -mb-px border-b-[3px] cursor-pointer"
            :class="device === 'mobile' ? 'border-[#008060] text-[#202223] font-bold' : 'border-transparent text-[#6d7175] font-medium'"
            @click="device = 'mobile'"
          >Mobile</button>
        </div>
        <div class="flex items-center gap-3 text-[12px] text-[#6d7175]">
          <span>{{ device === 'desktop' ? '1280 × 960' : '430 × 932' }}</span>
          <a href="#" class="flex items-center gap-0.5 text-[#008060] font-semibold">Live preview <ArrowUpRight :size="12" /></a>
        </div>
      </div>

      <!-- Storefront mock -->
      <div class="border border-[#ececec] border-t-0 rounded-b-lg overflow-hidden" :class="device === 'mobile' ? 'max-w-[390px] mx-auto' : ''">
        <div class="bg-[#1a1a1a] text-white flex items-center px-4 h-11 text-[13px]">
          <div class="flex items-center gap-4">
            <span>Home</span><span>Catalog</span><span>Contact</span>
          </div>
          <span class="flex-1 text-center font-semibold">{{ brand }}</span>
          <div class="flex items-center gap-3">
            <Search :size="15" /><ShoppingBag :size="15" />
          </div>
        </div>
        <div class="flex gap-6 p-6 bg-white" :class="device === 'mobile' ? 'flex-col' : ''">
          <div class="rounded-lg overflow-hidden bg-[#f6f6f6]" :class="device === 'mobile' ? 'w-full' : 'w-1/2 shrink-0'">
            <img :src="selectedProduct.img" alt="" class="w-full h-full object-cover" :class="device === 'mobile' ? 'aspect-square' : 'aspect-[4/5]'" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-[26px] font-bold leading-tight text-[#1a1a1a] mb-2">{{ selectedProduct.name }}</h2>
            <p class="text-[13px] text-[#616161] mb-3">{{ brand }}</p>
            <p class="text-[18px] font-semibold text-[#1a1a1a]">{{ selectedProduct.price }}</p>
            <p class="text-[12px] text-[#8a8a8a] mb-4">Tax included.</p>
            <button class="w-full border border-[#1a1a1a] rounded-lg py-2.5 text-[13px] font-semibold mb-2 cursor-pointer hover:bg-[#f6f6f6]">Add to cart</button>
            <button class="w-full bg-[#1a1a1a] text-white rounded-lg py-2.5 text-[13px] font-semibold mb-4 cursor-pointer hover:bg-[#333]">Buy it now</button>
            <p class="text-[15px] font-bold text-[#1a1a1a] mb-2 leading-snug">Slow-roasted in small batches — the flavour you keep coming back for</p>
            <p class="text-[13px] text-[#4a4a4a] leading-relaxed">
              Get this <strong>signature blend</strong> fresh from our roastery. Balanced, smooth and endlessly
              drinkable, it works just as well in your morning pour-over as it does in an afternoon espresso.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Generation progress -->
    <div class="pb-card p-4 mb-4">
      <p class="text-[13px] text-[#1a1a1a] mb-2">
        <span class="font-semibold">{{ generated }} / {{ total }} generated</span>
        <span class="text-[#6d7175]"> ({{ percent }}%)</span>
        <span v-if="generating" class="text-[#6d7175]"> Generating...</span>
      </p>
      <div class="h-2 bg-[#e1e3e5] rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="generating ? 'bg-[#5c6ac4]' : 'bg-[#008060]'"
          :style="{ width: percent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Products -->
    <div class="pb-card p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-[16px] font-semibold text-[#1a1a1a]">Products</h3>
        <button class="pb-btn-primary">Add Products</button>
      </div>
      <div class="flex flex-col">
        <div
          v-for="p in detailProducts" :key="p.id"
          class="flex items-center gap-4 py-3 border-b border-[#ececec] last:border-0"
        >
          <div class="flex items-center gap-2 shrink-0">
            <div class="w-12 h-12 rounded-md overflow-hidden border border-[#e0e0e0] bg-[#f6f6f6]">
              <img :src="p.before" alt="" class="w-full h-full object-cover" />
            </div>
            <ArrowRight :size="16" class="text-[#999]" />
            <div class="w-12 h-12 rounded-md overflow-hidden border border-[#e0e0e0] bg-[#f6f6f6]">
              <img :src="p.after" alt="" class="w-full h-full object-cover transition-opacity" :class="p.status === 'done' ? 'opacity-100' : 'opacity-40'" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[13px] font-semibold text-[#2c6ecb] truncate">{{ p.name }}</p>
            <p v-if="p.status === 'done'" class="text-[12px] text-[#008060] mt-1">Done</p>
            <p v-else-if="p.status === 'generating'" class="text-[12px] text-[#6d7175] mt-1 flex items-center gap-1">
              <Loader2 :size="12" class="animate-spin" /> Generating...
            </p>
            <p v-else class="text-[12px] text-[#6d7175] mt-1">Queued</p>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <button v-if="p.status === 'done'" class="text-[13px] text-[#2c6ecb] hover:underline cursor-pointer" @click="openEdit(p)">Edit</button>
            <span
              class="text-[12px] font-semibold rounded-full px-2.5 py-0.5"
              :class="variation.status === 'active' ? 'bg-[#d4edda] text-[#155724]' : 'bg-[#fff3cd] text-[#856404]'"
            >{{ variation.status === 'active' ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Per-product Edit modal (teleported to body so `fixed` anchors to the
         viewport, not a transformed ancestor in the app layout) -->
    <Teleport to="body">
    <div
      v-if="editProduct"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40"
      style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif"
      @click.self="closeEdit"
    >
      <div class="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-3.5 bg-[#f6f6f7] border-b border-[#e3e3e3]">
          <p class="text-[14px] font-semibold text-[#1a1a1a]">Edit: {{ editProduct.name }}</p>
          <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="closeEdit"><X :size="18" /></button>
        </div>

        <!-- Body -->
        <div class="p-6 flex flex-col gap-4">
          <div class="flex gap-4 items-start">
            <div class="flex-1">
              <p class="text-[13px] font-semibold text-[#1a1a1a] mb-2">Original</p>
              <img :src="editProduct.before" alt="Original" class="w-full max-h-[280px] object-contain rounded-lg border border-[#e0e0e0]" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-2 mb-2">
                <p class="text-[13px] font-semibold text-[#1a1a1a]">Current upgraded</p>
                <button
                  class="flex items-center gap-1 text-[13px] text-[#8a8f96] cursor-default"
                  disabled
                >
                  <History :size="16" /> History
                </button>
              </div>
              <img :src="editProduct.after" alt="Upgraded" class="w-full max-h-[280px] object-contain rounded-lg border border-[#e0e0e0]" />
            </div>
          </div>

          <div>
            <p class="text-[13px] mb-1">
              <span class="font-semibold text-[#1a1a1a]">Extra instructions (only for this product)</span>
              <span class="text-[#6d7175]">Add context to improve the generated image. The variation's base prompt stays unchanged.</span>
            </p>
            <textarea
              v-model="editPrompt"
              rows="3"
              placeholder="e.g. Remove the red badge, show on a beach background..."
              class="w-full mt-1 px-3 py-2 rounded-md border border-[#c9cccf] text-[14px] resize-y focus:outline-none focus:border-[#5548e0]"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end px-6 py-4 border-t border-[#e3e3e3]">
          <button class="pb-btn-primary disabled:opacity-45 disabled:cursor-default" :disabled="!editPrompt.trim()">
            Regenerate image
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>
