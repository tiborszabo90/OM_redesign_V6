<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">

        <!-- Back + step indicator -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="handleBack">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
            <span>Product Page Optimizer</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">{{ currentStep + 1 }} / {{ types.length }} — {{ currentType.label }}</span>
          </nav>
        </div>

        <!-- Title + action -->
        <div class="flex items-center justify-between mb-1">
          <h1 class="text-2xl font-semibold text-om-gray-700">Preview Generation</h1>
          <div class="flex items-center gap-2">
            <Button v-if="currentStep > 0" variant="outline" size="md" @click="currentStep--">Previous</Button>
            <Button variant="primary" size="md" @click="handleNext">
              {{ isLastStep ? 'Continue to Generation' : 'Next' }}
            </Button>
          </div>
        </div>
        <p class="text-sm text-om-gray-500 mb-6">Test your selected preset and adjust the prompt before applying to your catalogue.</p>

        <!-- Step dots -->
        <div class="flex items-center gap-2 mb-6">
          <div
            v-for="(type, i) in types"
            :key="type.id"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
            :class="i === currentStep ? 'bg-om-orange-500 text-white' : i < currentStep ? 'bg-[#D6F5EC] text-[#2CC896]' : 'bg-om-gray-100 text-om-gray-500'"
            @click="currentStep = i"
          >
            <CheckIcon v-if="i < currentStep" :size="12" />
            {{ type.label }}
          </div>
        </div>

        <!-- Two columns: Original + AI Preview -->
        <div class="grid grid-cols-[380px_1fr] gap-4 mb-4 items-stretch" style="height: 500px;">
          <!-- Left: Original Product -->
          <div class="flex flex-col min-h-0">
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Original Product</p>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col">
              <div v-if="isImageType" class="aspect-square bg-om-gray-100 overflow-hidden">
                <img src="/product1.jpg" class="w-full h-full object-cover" />
              </div>
              <div v-else class="flex-1 bg-om-gray-50 p-5 flex flex-col gap-3">
                <div class="h-4 bg-om-gray-200 rounded w-4/5" />
                <div class="h-3 bg-om-gray-200 rounded w-3/5" />
                <div class="h-3 bg-om-gray-200 rounded w-full" />
                <div class="h-3 bg-om-gray-200 rounded w-4/5" />
                <div class="h-3 bg-om-gray-200 rounded w-2/3" />
              </div>
              <div class="p-4 border-t border-om-gray-100">
                <h3 class="text-sm font-semibold text-om-gray-700 mb-3">DJI Osmo Mobile 7 mobil gimbal</h3>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-om-gray-400">SKU: OM-7-SE</span>
                  <span class="text-sm font-semibold text-om-gray-700">$159.00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: AI Generated Preview -->
          <div class="flex flex-col min-h-0">
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <Wand2 :size="16" class="text-om-orange-400" />
              AI Generated Preview — {{ currentType.label }}
            </p>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col items-center justify-center overflow-hidden flex-1 relative">
              <template v-if="!stepStates[currentType.id]?.generating && !stepStates[currentType.id]?.generated">
                <div class="w-14 h-14 rounded-full bg-om-orange-100 flex items-center justify-center mb-4">
                  <ImageIcon v-if="isImageType" :size="22" class="text-om-orange-400" />
                  <Type v-else :size="22" class="text-om-orange-400" />
                </div>
                <h3 class="text-base font-semibold text-om-gray-700 mb-2">Ready to Generate</h3>
                <p class="text-sm text-om-gray-500 text-center mb-6 max-w-xs">Click generate to see how "{{ currentType.label }}" looks applied to this product.</p>
                <Button variant="primary" size="md" @click="startGeneration">
                  <template #icon><Sparkles :size="14" /></template>
                  Generate Preview
                </Button>
              </template>
              <template v-else-if="stepStates[currentType.id]?.generating">
                <svg class="animate-spin w-10 h-10 text-om-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p class="text-sm text-om-gray-500">Generating preview...</p>
              </template>
              <template v-else>
                <!-- Generated preview -->
                <template v-if="isImageType">
                  <img src="/product2.png" class="max-h-full w-auto object-contain" />
                </template>
                <template v-else>
                  <div class="p-6 w-full">
                    <div v-if="currentType.id === 'headline'" class="text-xl font-bold text-om-gray-700">Transform Your Mobile Videos Into Cinematic Masterpieces</div>
                    <div v-else-if="currentType.id === 'subheadline'" class="text-base text-om-gray-500">Professional-grade stabilization meets intuitive gesture control — capture smooth, stunning footage every time.</div>
                    <div v-else-if="currentType.id === 'benefit-list'" class="space-y-2">
                      <div class="flex items-start gap-2"><span class="text-[#2CC896] mt-0.5">✓</span><span class="text-sm text-om-gray-700">3-axis stabilization eliminates shaky footage</span></div>
                      <div class="flex items-start gap-2"><span class="text-[#2CC896] mt-0.5">✓</span><span class="text-sm text-om-gray-700">Gesture control for hands-free recording</span></div>
                      <div class="flex items-start gap-2"><span class="text-[#2CC896] mt-0.5">✓</span><span class="text-sm text-om-gray-700">12-hour battery for all-day shooting</span></div>
                    </div>
                    <div v-else-if="currentType.id === 'product-sentence'" class="text-sm text-om-gray-700">The DJI Osmo Mobile 7 is a compact, intelligent gimbal that transforms your smartphone into a professional filmmaking tool.</div>
                    <div v-else class="text-sm text-om-gray-600 leading-relaxed">The DJI Osmo Mobile 7 brings professional-grade stabilization to your smartphone. With 3-axis mechanical stabilization, ActiveTrack 6.0, and gesture control, capturing smooth cinematic footage has never been easier. The compact, foldable design fits in your pocket while delivering up to 12 hours of battery life.</div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>

        <!-- Prompt Editor -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-om-gray-700">Prompt Editor</h3>
          </div>
          <textarea
            v-model="currentPrompt"
            rows="3"
            class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
          />
          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-om-gray-400">Edit the prompt above to customize the generation. Changes will require regenerating the preview.</p>
            <Button v-if="!showAdvanced" variant="ghost" size="sm" class="shrink-0 ml-4" @click="showAdvanced = true">Advanced Settings <ChevronDown :size="14" /></Button>
          </div>

          <!-- Advanced Settings -->
          <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">
            <div class="grid grid-cols-2 gap-3 items-stretch">
              <template v-if="isImageType">
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 min-w-0 flex items-end gap-3">
                  <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <p class="text-xs text-om-gray-500">Model</p>
                    <Dropdown v-model="promptModel" :options="modelOptions" size="sm" />
                  </div>
                  <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <p class="text-xs text-om-gray-500">Ratio</p>
                    <Dropdown v-model="promptRatio" :options="ratioOptions" size="sm" />
                  </div>
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <p class="text-xs text-om-gray-500">Usage location</p>
                  <div class="flex gap-4 mt-0.5">
                    <label class="flex items-center gap-2 text-sm text-om-gray-700 cursor-pointer">
                      <input type="radio" v-model="pageType" value="product" class="accent-om-orange-500" /> Product page
                    </label>
                    <label class="flex items-center gap-2 text-sm text-om-gray-700 cursor-pointer">
                      <input type="radio" v-model="pageType" value="popup" class="accent-om-orange-500" /> Popup/Embedded
                    </label>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Use product image as context</span>
                  <ToggleSwitch v-model="useProductImage" class="shrink-0" />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                  <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 transition-all text-right bg-white shrink-0" />
                </div>
              </template>
            </div>
            <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
              <p class="text-xs text-om-gray-500">Available data sources</p>
              <div class="flex flex-wrap gap-1.5">
                <Tag v-for="src in dataSources" :key="src" variant="orange">{{ src }}</Tag>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 items-stretch">
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 transition-all text-right bg-white shrink-0" />
              </div>
            </div>
            <div class="flex justify-end">
              <Button variant="ghost" size="sm" @click="showAdvanced = false">Basic Settings <ChevronUp :size="14" /></Button>
            </div>
          </div>
        </div>

      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Tag from '../components/shared/Tag.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import { ArrowLeft, ChevronDown, ChevronUp, Wand2, Sparkles, ImageIcon, Type, Check as CheckIcon } from 'lucide-vue-next'

const props = defineProps({
  selectedTypes: { type: Array, default: () => [] },
})
const emit = defineEmits(['menu-click', 'back', 'next'])

// Content type definitions
const allTypes = [
  { id: 'product-image',    label: 'Product Image',     category: 'Image' },
  { id: 'image-badge',      label: 'Image Badge',       category: 'Image' },
  { id: 'headline',         label: 'Headline',           category: 'Text' },
  { id: 'subheadline',      label: 'Subheadline',        category: 'Text' },
  { id: 'benefit-list',     label: 'Benefit List',       category: 'Text' },
  { id: 'product-sentence', label: 'Product Sentence',   category: 'Text' },
  { id: 'summary',          label: 'Summary',            category: 'Text' },
]

const types = computed(() => allTypes.filter(t => props.selectedTypes.includes(t.id)))

const currentStep = ref(0)
const currentType = computed(() => types.value[currentStep.value] || types.value[0])
const isLastStep = computed(() => currentStep.value === types.value.length - 1)
const isImageType = computed(() => currentType.value?.category === 'Image')

// Per-step state
const stepStates = reactive({})
const initStepState = (id) => {
  if (!stepStates[id]) {
    stepStates[id] = { generating: false, generated: false, prompt: getDefaultPrompt(id) }
  }
}

const getDefaultPrompt = (id) => {
  const prompts = {
    'product-image': 'Create a lifestyle product photo with a clean, modern background. Show the product in a natural setting that highlights its use case.',
    'image-badge': 'Create a product image with an overlay badge highlighting the current promotion or key feature.',
    'headline': 'Write a compelling, benefit-driven headline for this product. Max 10 words.',
    'subheadline': 'Write a supporting subheadline that expands on the main benefit. Max 20 words.',
    'benefit-list': 'List the top 3 benefits of this product as short, scannable bullet points.',
    'product-sentence': 'Write a single compelling sentence that summarizes why someone should buy this product.',
    'summary': 'Write a short product description (2-3 sentences) highlighting key features and benefits.',
  }
  return prompts[id] || ''
}

// Initialize states for all selected types
types.value.forEach(t => initStepState(t.id))

const currentPrompt = computed({
  get: () => {
    initStepState(currentType.value?.id)
    return stepStates[currentType.value?.id]?.prompt || ''
  },
  set: (val) => {
    initStepState(currentType.value?.id)
    stepStates[currentType.value.id].prompt = val
  },
})

const startGeneration = () => {
  const id = currentType.value.id
  initStepState(id)
  stepStates[id].generating = true
  stepStates[id].generated = false
  setTimeout(() => {
    stepStates[id].generating = false
    stepStates[id].generated = true
  }, 2000)
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  } else {
    emit('back')
  }
}

const handleNext = () => {
  if (isLastStep.value) {
    const configs = {}
    types.value.forEach(t => {
      configs[t.id] = { prompt: stepStates[t.id]?.prompt || '', generated: stepStates[t.id]?.generated || false }
    })
    emit('next', configs)
  } else {
    currentStep.value++
    initStepState(currentType.value.id)
  }
}

// Advanced settings state
const showAdvanced = ref(false)
const promptModel = ref('Flux Pro 1.1')
const promptRatio = ref('1:1')
const pageType = ref('product')
const useProductImage = ref(true)
const autoGenerate = ref(true)
const minDescLength = ref(0)

const modelOptions = ['Flux Pro 1.1', 'Flux Pro', 'SDXL', 'Dall-E 3']
const ratioOptions = ['1:1', '16:9', '9:16', '4:3']
const dataSources = ['title', 'description', 'image_url', 'price', 'category', 'brand']
</script>
