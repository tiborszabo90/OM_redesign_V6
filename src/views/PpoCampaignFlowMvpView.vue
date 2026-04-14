<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="relative h-full">
        <button
          class="absolute top-0 left-0 z-10 flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 transition-colors cursor-pointer"
          @click="$emit('back')"
        >
          <ChevronLeft :size="18" />
          Back
        </button>

      <div class="flex flex-col items-center justify-center h-full py-16 -translate-y-[5%]">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-2 text-center">Which content blocks would you like to add to your product pages?</h2>
        <p class="text-sm text-om-gray-500 mb-8 text-center">Choose one or more — AI will generate them for each of your products.</p>

        <!-- Cards grid -->
        <div class="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div
            v-for="type in contentTypes"
            :key="type.id"
            class="bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer"
            :class="[
              selectedType === type.id
                ? 'border-om-orange-500 shadow-[0_4px_14px_rgba(237,90,41,0.4)] scale-[1.03]'
                : type.comingSoon
                  ? 'border-om-gray-100 opacity-60 cursor-default'
                  : 'border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03]'
            ]"
            @click="!type.comingSoon && selectType(type.id)"
          >
            <!-- Image placeholder -->
            <div class="w-full flex items-center justify-center relative overflow-hidden pt-4">
              <!-- Product image: two squares with arrow -->
              <div v-if="type.id === 'product-image'" class="flex items-center bg-white w-full h-full justify-center">
                <div class="w-32 h-32 rounded-xl border-2 border-om-gray-200 bg-white flex items-center justify-center p-3">
                  <img src="/Prod1.png" class="max-w-full max-h-full object-contain" />
                </div>
                <ArrowRight :size="18" class="text-om-gray-400 mx-1 shrink-0 relative z-10" />
                <img src="/prod2.jpg" class="w-32 h-32 object-cover rounded-xl border-2 border-om-gray-200" />
              </div>
              <!-- Image with badge / Product summary: mini dummy page -->
              <div v-else-if="type.id === 'image-badge' || type.id === 'product-summary'" class="w-full h-full bg-white overflow-hidden flex items-center justify-center p-0">
                <img :src="type.id === 'image-badge' ? '/badge.svg' : '/summary.svg'" class="max-w-full max-h-full object-contain" />
              </div>
              <!-- Product sentence -->
              <div v-else-if="type.id === 'product-sentence'" class="w-full h-full bg-white overflow-hidden flex gap-2.5 px-3 py-2">
                <div class="w-[40%] shrink-0">
                  <div class="aspect-square bg-om-gray-100 rounded" />
                </div>
                <div class="flex-1 flex flex-col gap-1.5 pt-0.5">
                  <div class="w-full h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-2/3 h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-8 h-2 bg-om-gray-100 rounded" />
                  <div class="rounded-md bg-om-orange-50 border border-om-orange-200 px-2 py-1.5 mt-0.5">
                    <div class="w-full h-1.5 bg-om-orange-200 rounded mb-1" />
                    <div class="w-4/5 h-1.5 bg-om-orange-200 rounded" />
                  </div>
                  <div class="space-y-1 mt-0.5">
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-3/4 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-5/6 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-2/3 h-1.5 bg-om-gray-100 rounded" />
                  </div>
                  <div class="flex gap-1.5 mt-0.5">
                    <div class="w-12 h-3 bg-om-gray-200 rounded" />
                    <div class="w-12 h-3 bg-om-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <!-- Benefit list -->
              <div v-else-if="type.id === 'benefit-list'" class="w-full h-full bg-white overflow-hidden flex gap-2.5 px-3 py-2">
                <div class="w-[40%] shrink-0">
                  <div class="aspect-square bg-om-gray-100 rounded" />
                </div>
                <div class="flex-1 flex flex-col gap-1.5 pt-0.5">
                  <div class="w-full h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-2/3 h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-8 h-2 bg-om-gray-100 rounded" />
                  <div class="rounded-md bg-om-orange-50 border border-om-orange-200 px-2 py-1.5 mt-0.5 space-y-1.5">
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-om-orange-400 shrink-0" />
                      <div class="h-1.5 bg-om-orange-200 rounded flex-1" />
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-om-orange-400 shrink-0" />
                      <div class="h-1.5 bg-om-orange-200 rounded w-4/5" />
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-om-orange-400 shrink-0" />
                      <div class="h-1.5 bg-om-orange-200 rounded w-3/5" />
                    </div>
                  </div>
                  <div class="space-y-1 mt-0.5">
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-3/4 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-5/6 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-2/3 h-1.5 bg-om-gray-100 rounded" />
                  </div>
                  <div class="flex gap-1.5 mt-0.5">
                    <div class="w-12 h-3 bg-om-gray-200 rounded" />
                    <div class="w-12 h-3 bg-om-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center gap-2">
                <ImageIcon v-if="type.isImage || type.isMixed" :size="28" class="text-om-gray-300" />
                <Type v-else :size="28" class="text-om-gray-300" />
              </div>
              <!-- Selected checkmark -->
              <div
                v-if="selectedType === type.id"
                class="absolute top-3 right-3 w-6 h-6 rounded-full bg-om-orange-500 flex items-center justify-center"
              >
                <Check :size="14" class="text-white" stroke-width="3" />
              </div>
            </div>
            <!-- Card body -->
            <div class="px-4 pt-2 pb-5">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg font-semibold text-om-gray-700">{{ type.label }}</span>
                <Tag v-if="type.comingSoon" variant="gray-muted">Coming soon</Tag>
              </div>
              <p class="text-sm text-om-gray-400 leading-relaxed">{{ type.description }}</p>
            </div>
          </div>
        </div>

      </div>
      </div>

      <!-- Domain selector modal -->
      <transition name="fade">
        <div v-if="showDomainModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="closeDomainModal">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col">
            <!-- Header -->
            <div class="px-6 pt-6 pb-4 flex items-start justify-between shrink-0 relative z-10"
              :style="headerShadowStyle"
            >
              <div>
                <h3 class="text-lg font-semibold text-om-gray-700 mb-1">Select a domain</h3>
                <p class="text-sm text-om-gray-400">Choose which store to optimize with Smart Product Pages.</p>
              </div>
              <Button variant="ghost" size="sm" icon-only @click="closeDomainModal" class="shrink-0 mt-0.5">
                <template #icon><X :size="16" /></template>
              </Button>
            </div>

            <!-- Domain list with bottom shadow -->
            <div>
              <div ref="domainListRef" :class="['px-6 max-h-96 overflow-y-auto', isScrolledToBottom ? '' : 'domain-list-scroll']" @scroll="onDomainListScroll">
                <div class="space-y-2 pt-2 pb-4">
                  <div
                    v-for="domain in domains"
                    :key="domain.url"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-150 cursor-pointer"
                    :class="[
                      syncingDomain === domain.url ? 'border-om-gray-200 bg-om-gray-50' :
                      selectedDomain === domain.url ? 'border-om-orange-500 bg-om-orange-50/50' :
                      'border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03]'
                    ]"
                    @click="handleDomainClick(domain)"
                  >
                    <!-- Domain + catalog status -->
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-om-gray-700 truncate">{{ domain.url }}</div>
                      <div v-if="syncingDomain === domain.url" class="flex items-center gap-1.5 text-xs text-om-gray-500 mt-0.5">
                        <Loader2 :size="11" class="animate-spin" />
                        Synchronizing product catalog...
                      </div>
                      <div v-else-if="domain.hasCatalog" class="text-xs text-om-gray-400 mt-0.5">
                        {{ domain.productCount.toLocaleString() }} products
                      </div>
                      <div v-else class="flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                        <AlertCircle :size="11" />
                        No catalog — click to sync
                      </div>
                    </div>
                    <ChevronRight v-if="syncingDomain !== domain.url" :size="16" class="text-om-gray-300 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Sticky add domain -->
            <div class="px-6 py-6 border-t border-om-gray-100 shrink-0">
              <button @click="showDomainModal = false; showAddDomainModal = true" class="flex items-center gap-2 text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer transition-colors">
                <Plus :size="16" />
                Add new domain
              </button>
            </div>
          </div>
        </div>
      </transition>
    </template>
    <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Tag from '../components/shared/Tag.vue'
import Button from '../components/shared/Button.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'
import { ChevronLeft, ChevronRight, ImageIcon, Type, Check, AlertCircle, ArrowRight, Loader2, X, Plus } from 'lucide-vue-next'

const emit = defineEmits(['back', 'next', 'menu-click'])

const selectedType = ref(null)
const isScrolled = ref(false)
const domainListRef = ref(null)

const headerShadowStyle = computed(() => ({
  boxShadow: isScrolled.value ? '0 4px 16px rgba(0,0,0,0.15)' : '0 0 0 rgba(0,0,0,0)',
  transition: 'box-shadow 0.3s ease',
}))

const isScrolledToBottom = ref(false)

function onDomainListScroll(e) {
  isScrolled.value = e.target.scrollTop > 0
  isScrolledToBottom.value = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10
}
const pendingType = ref(null)
const showDomainModal = ref(false)

const contentTypes = [
  { id: 'image-badge',      label: 'Image with badge',   description: 'A lifestyle product image with short text and icon badge overlay.',       isImage: true,  comingSoon: false },
  { id: 'product-summary',  label: 'Product summary',    description: 'A lifestyle product image, a headline and a benefit list combined into one block.',  isMixed: true,  comingSoon: false },
]

const domains = reactive([
  { url: 'whiskynet.hu', hasCatalog: true, productCount: 1284 },
  { url: 'demo-store.myshopify.com', hasCatalog: true, productCount: 356 },
  { url: 'mybrand.com', hasCatalog: true, productCount: 89 },
  { url: 'premium-spirits.eu', hasCatalog: true, productCount: 2410 },
  { url: 'craft-beer-shop.com', hasCatalog: true, productCount: 567 },
  { url: 'organic-wines.co', hasCatalog: true, productCount: 198 },
  { url: 'newbrand.com', hasCatalog: false, productCount: 0 },
  { url: 'test-store.myshopify.com', hasCatalog: false, productCount: 0 },
])

const selectedDomain = ref(null)
const syncingDomain = ref(null)

const selectedDomainObj = computed(() =>
  domains.find(d => d.url === selectedDomain.value)
)

function handleDomainClick(domain) {
  if (syncingDomain.value) return
  if (domain.hasCatalog) {
    selectedDomain.value = domain.url
    showDomainModal.value = false
    emit('next', [pendingType.value])
  }
}

function selectType(id) {
  pendingType.value = id
  showDomainModal.value = true
}

// Reset selection if modal closed without confirming
function closeDomainModal() {
  showDomainModal.value = false
  pendingType.value = null
}

const showAddDomainModal = ref(false)
function handleNewDomain(newDomain) {
  domains.push({ url: newDomain, hasCatalog: false, productCount: 0 })
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.domain-list-scroll {
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}
</style>
