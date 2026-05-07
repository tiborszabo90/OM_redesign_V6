<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="close">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col">
        <!-- Header -->
        <div class="px-6 pt-6 pb-4 flex items-start justify-between shrink-0 relative z-10" :style="headerShadowStyle">
          <div>
            <h3 class="text-lg font-semibold text-om-gray-700 mb-1">Select a domain</h3>
            <p class="text-sm text-om-gray-400">Choose which store to optimize with Smart Product Pages.</p>
          </div>
          <Button variant="ghost" size="sm" icon-only @click="close" class="shrink-0 mt-0.5">
            <template #icon><X :size="16" /></template>
          </Button>
        </div>

        <!-- Domain list -->
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

        <!-- Add domain footer -->
        <div class="px-6 py-6 border-t border-om-gray-100 shrink-0">
          <button @click="$emit('update:modelValue', false); showAddDomainModal = true" class="flex items-center gap-2 text-sm font-medium text-om-orange-500 hover:text-om-orange-600 cursor-pointer transition-colors">
            <Plus :size="16" />
            Add new domain
          </button>
        </div>
      </div>
    </div>
  </transition>
  <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Button from './Button.vue'
import AddDomainModal from './AddDomainModal.vue'
import { ChevronRight, X, Plus, Loader2, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'select'])

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
const isScrolled = ref(false)
const isScrolledToBottom = ref(false)
const domainListRef = ref(null)

const headerShadowStyle = computed(() => ({
  boxShadow: isScrolled.value ? '0 4px 16px rgba(0,0,0,0.15)' : '0 0 0 rgba(0,0,0,0)',
  transition: 'box-shadow 0.3s ease',
}))

function onDomainListScroll(e) {
  isScrolled.value = e.target.scrollTop > 0
  isScrolledToBottom.value = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10
}

function handleDomainClick(domain) {
  if (syncingDomain.value) return
  if (domain.hasCatalog) {
    selectedDomain.value = domain.url
    emit('update:modelValue', false)
    emit('select', domain.url)
  }
}

function close() {
  emit('update:modelValue', false)
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
