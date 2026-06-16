<template>
  <!-- Shared Conversion Lift → Products content: a tab selector over the three
       product entries with the real "AI Texts & Images" view embedded. -->
  <div>
    <!-- Header (title + product tabs) — hidden while a variant detail is open,
         and when tabs are suppressed (flyout subpage) -->
    <template v-if="!inDetail && showTabs">
      <h1 class="text-2xl font-semibold text-om-gray-700 mb-5">Conversion Lift</h1>
      <div class="flex gap-1 border-b border-om-gray-100 mb-6">
        <button
          v-for="t in products"
          :key="t.id"
          @click="selectTab(t.id)"
          :class="[
            'px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors cursor-pointer',
            active === t.id ? 'border-om-orange-500 text-om-orange-500' : 'border-transparent text-om-gray-500 hover:text-om-gray-700'
          ]"
        >{{ t.label }}</button>
      </div>
    </template>

    <!-- Back to the Conversion Lift main page while inside a variant -->
    <button
      v-else-if="inDetail"
      @click="screen = 'list'"
      class="flex items-center gap-1.5 text-sm font-medium text-om-gray-500 hover:text-om-gray-700 transition-colors cursor-pointer mb-5"
    >
      <ArrowLeft :size="16" /> Conversion Lift
    </button>

    <AiTextsImagesV2View v-if="active === 'ai-texts-images'" :screen="screen" :embedded="true" :hide-heading="showTabs" @navigate="onEmbeddedNavigate" />
    <ProductCatalogPanel v-else-if="active === 'product-catalog'" :hide-title="showTabs" />
    <p v-else class="text-sm text-om-gray-400">Coming soon</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import AiTextsImagesV2View from './AiTextsImagesV2View.vue'
import ProductCatalogPanel from './ProductCatalogPanel.vue'

const props = defineProps({
  // Show the product tab bar (tabs version). When false, a single product is
  // shown full-width with no tabs (flyout subpage).
  showTabs: { type: Boolean, default: true },
  // Which product to show initially / when tabs are hidden.
  product: { type: String, default: 'ai-texts-images' },
})

const products = [
  { id: 'ai-texts-images', label: 'AI Texts & Images' },
  { id: 'product-catalog', label: 'Product catalog' },
  { id: 'ai-recommendations', label: 'AI recommendations' },
]
const active = ref(props.product)

// Drive the embedded AI Texts & Images view's internal screen so its rows and
// buttons are clickable (mirrors the Settings embedding).
const screen = ref('list')
const screenMap = {
  'ai-texts-images-v2': 'list',
  'ai-texts-images-v2-new': 'new',
  'ai-texts-images-v2-presets': 'image-presets',
  'ai-texts-images-v2-preview': 'image-preview',
  'ai-texts-images-v2-choose-products': 'choose-products',
  'ai-texts-images-v2-generation': 'generation',
  'ai-texts-images-v2-generation-product': 'generation-product',
  'ai-texts-images-v2-add-products': 'add-products',
  'ai-texts-images-v2-text-presets': 'text-presets',
  'ai-texts-images-v2-text-preview': 'text-preview',
  'ai-texts-images-v2-text-generation': 'text-generation',
  'ai-texts-images-v2-workflow-presets': 'workflow-presets',
  'ai-texts-images-v2-workflow-editor': 'workflow-editor',
  'ai-texts-images-v2-workflow-generation': 'workflow-generation',
}
const onEmbeddedNavigate = (route) => { screen.value = screenMap[route] ?? 'list' }

// A variant detail is open when the AI Texts & Images view is on any screen
// other than its list.
const inDetail = computed(() => active.value === 'ai-texts-images' && screen.value !== 'list')

const selectTab = (id) => {
  active.value = id
  if (id === 'ai-texts-images') screen.value = 'list'
}
</script>
