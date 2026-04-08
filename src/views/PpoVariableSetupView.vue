<template>
  <div class="h-screen flex flex-col bg-om-gray-50">
    <!-- Header bar -->
    <div class="flex items-center justify-between border-b border-om-gray-200 shrink-0 px-8 py-4 bg-white">
      <div class="flex items-center gap-3">
        <button @click="handleBack" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
          <ArrowLeft :size="18" />
        </button>
        <div class="h-5 w-px bg-om-gray-200" />
        <span class="font-semibold text-om-gray-700 text-lg">Product Page Optimizer</span>
      </div>
      <!-- Stepper (centered) -->
      <div class="flex items-center gap-2">
        <template v-for="(type, i) in types" :key="type.id">
          <div
            class="flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all cursor-pointer shrink-0"
            :class="[
              i === currentStep
                ? 'border-om-orange-500 bg-om-orange-50 shadow-[0_2px_8px_rgba(237,90,41,0.15)]'
                : stepStates[type.id]?.generated
                  ? 'border-[#2CC896] bg-[#EDFDF7]'
                  : 'border-om-gray-200 bg-white hover:border-om-gray-300'
            ]"
            @click="currentStep = i"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
              :class="[
                i === currentStep
                  ? 'bg-om-orange-500 text-white'
                  : stepStates[type.id]?.generated
                    ? 'bg-[#2CC896] text-white'
                    : 'bg-om-gray-200 text-om-gray-500'
              ]"
            >
              <CheckIcon v-if="stepStates[type.id]?.generated && i !== currentStep" :size="12" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span
              class="text-xs font-medium whitespace-nowrap"
              :class="i === currentStep ? 'text-om-orange-600' : stepStates[type.id]?.generated ? 'text-[#2CC896]' : 'text-om-gray-500'"
            >
              {{ type.label }}
            </span>
          </div>
        </template>
      </div>
      <!-- Actions (right-aligned) -->
      <div class="flex items-center gap-2">
        <Button v-if="currentStep > 0" variant="outline" size="sm" @click="currentStep--">Previous</Button>
        <Button variant="primary" size="sm" @click="handleNext">
          {{ isLastStep ? 'Continue to Preview' : 'Next' }}
        </Button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-[1400px] mx-auto px-8 py-8">

        <!-- Two columns: Original + AI Preview -->
        <div class="grid grid-cols-[380px_1fr] gap-4 mb-4 items-stretch" style="height: 500px;">
          <!-- Left: Original Product -->
          <div class="flex flex-col min-h-0">
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Original Product</p>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col">
              <div class="aspect-square bg-om-gray-100 overflow-hidden">
                <img src="/whisky.png" class="w-full h-full object-contain" />
              </div>
              <div class="p-4 border-t border-om-gray-100">
                <h3 class="text-sm font-semibold text-om-gray-700 mb-3">Shanky's Whip Black Ír whiskeylikőr</h3>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-om-gray-400">SKU: WLI-11588</span>
                  <span class="text-sm font-semibold text-om-gray-700">10 990 Ft</span>
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
                <div class="flex items-center gap-1.5 mt-3 text-sm font-medium text-om-orange-500">
                  <Coins :size="16" />
                  Costs {{ 20 * props.selectedTypes.length }} credits
                </div>
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
                <template v-if="currentType.id === 'product-summary'">
                  <div class="p-6 w-full flex items-center justify-center transition-all duration-300" :class="promptChanged ? 'blur-sm scale-105' : ''">
                    <div class="flex w-full rounded-xl overflow-hidden border border-om-gray-200 shadow-sm">
                      <!-- Left: product image (1:1 square) -->
                      <div class="aspect-square bg-om-gray-50 shrink-0 w-80 overflow-hidden">
                        <img src="/image-with-badge/whisky2.png" class="w-full h-full object-cover" />
                      </div>
                      <!-- Right: orange info block -->
                      <div class="flex-1 bg-[#E8611A] flex flex-col justify-center px-6 py-6 text-white">
                        <div class="space-y-5">
                          <div class="flex items-start gap-3">
                            <div class="w-7 h-7 shrink-0 mt-0.5 relative flex items-center justify-center">
                              <img src="/badge-1.svg" class="absolute inset-0 w-full h-full text-white opacity-20" style="filter: brightness(0) invert(1);" />
                              <CheckIcon :size="14" class="text-white relative z-10" stroke-width="3" />
                            </div>
                            <span class="text-base leading-relaxed">Egyedülálló ír whiskey és vanília keverék, prémium minőségű természetes összetevőkkel</span>
                          </div>
                          <div class="flex items-start gap-3">
                            <div class="w-7 h-7 shrink-0 mt-0.5 relative flex items-center justify-center">
                              <img src="/badge-1.svg" class="absolute inset-0 w-full h-full text-white opacity-20" style="filter: brightness(0) invert(1);" />
                              <CheckIcon :size="14" class="text-white relative z-10" stroke-width="3" />
                            </div>
                            <span class="text-base leading-relaxed">Selymesen lágy, tökéletes jéggel, koktélokban vagy önmagában fogyasztva</span>
                          </div>
                          <div class="flex items-start gap-3">
                            <div class="w-7 h-7 shrink-0 mt-0.5 relative flex items-center justify-center">
                              <img src="/badge-1.svg" class="absolute inset-0 w-full h-full text-white opacity-20" style="filter: brightness(0) invert(1);" />
                              <CheckIcon :size="14" class="text-white relative z-10" stroke-width="3" />
                            </div>
                            <span class="text-base leading-relaxed">Díjnyertes kézműves likőr, amelyet hagyományos ír módszerekkel készítenek</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="isImageType">
                  <img src="/image-with-badge/whisky2.png" class="max-h-full w-auto object-contain transition-all duration-300" :class="promptChanged ? 'blur-sm scale-105' : ''" />
                </template>
                <template v-else>
                  <div class="p-6 w-full transition-all duration-300" :class="promptChanged ? 'blur-sm' : ''">
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
                <!-- Regenerate overlay -->
                <Transition name="modal-fade">
                  <div v-if="promptChanged" class="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                    <Button variant="primary" size="md" @click="startGeneration">
                      <template #icon><Sparkles :size="14" /></template>
                      Regenerate
                    </Button>
                    <div class="flex items-center gap-1.5 mt-3 text-sm font-medium text-white">
                      <Coins :size="16" />
                      Costs {{ 20 * props.selectedTypes.length }} credits
                    </div>
                  </div>
                </Transition>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import Button from '../components/shared/Button.vue'
import Tag from '../components/shared/Tag.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import { ArrowLeft, ChevronDown, ChevronUp, Wand2, Sparkles, ImageIcon, Type, Check as CheckIcon, Coins } from 'lucide-vue-next'

const props = defineProps({
  selectedTypes: { type: Array, default: () => [] },
})
const emit = defineEmits(['back', 'next'])

// Content type definitions
const allTypes = [
  { id: 'product-image',    label: 'Product Image',     category: 'Image' },
  { id: 'image-badge',      label: 'Image with badge',   category: 'Image' },
  { id: 'product-summary',  label: 'Product summary',    category: 'Image' },
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
    stepStates[id] = { generating: false, generated: false, prompt: getDefaultPrompt(id), generatedPrompt: null }
  }
}

const getDefaultPrompt = (id) => {
  const prompts = {
    'product-image': 'Create a lifestyle product photo with a clean, modern background. Show the product in a natural setting that highlights its use case.',
    'image-badge': 'Create a product image with an overlay badge highlighting the current promotion or key feature.',
    'product-summary': 'Create a product summary block with an image and a short text description highlighting the key features.',
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

const promptChanged = computed(() => {
  const id = currentType.value?.id
  if (!id || !stepStates[id]?.generated) return false
  return stepStates[id].prompt !== stepStates[id].generatedPrompt
})

const startGeneration = () => {
  const id = currentType.value.id
  initStepState(id)
  stepStates[id].generating = true
  stepStates[id].generated = false
  const savedPrompt = stepStates[id].prompt
  setTimeout(() => {
    stepStates[id].generating = false
    stepStates[id].generated = true
    stepStates[id].generatedPrompt = savedPrompt
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
