<template>
  <div class="h-screen flex bg-om-gray-50">
    <ClSidebar active="home" @navigate="$emit('navigate', $event)" />

    <main class="flex-1 min-w-0 flex flex-col">
      <!-- Top bar -->
      <div class="h-14 shrink-0 border-b border-om-gray-200 bg-white flex items-center justify-between px-6">
        <div class="flex items-center gap-1.5 text-sm">
          <button @click="$emit('navigate', 'cl-home-b')" class="text-om-gray-500 hover:text-om-gray-700 cursor-pointer">Home</button>
          <ChevronRight :size="14" class="text-om-gray-300" />
          <span class="font-medium text-om-gray-800">{{ rec.location }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="secondary" size="sm" @click="startTest"><template #icon><FlaskConical :size="15" /></template>Start A/B test</Button>
          <Button variant="primary" size="sm" @click="apply"><template #icon><Sparkles :size="15" /></template>Apply directly</Button>
        </div>
      </div>

      <!-- Body: persuasion panel + large store preview -->
      <div class="flex-1 min-h-0 flex">
        <!-- Left: why you should apply it -->
        <div class="w-100 shrink-0 border-r border-om-gray-200 bg-white overflow-y-auto">
          <div class="p-6 space-y-5">
            <div>
              <div class="flex items-center gap-2.5 mb-1.5">
                <div class="w-9 h-9 rounded-lg bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center shrink-0"><component :is="recIcon(rec.location)" :size="18" /></div>
                <h1 class="text-lg font-bold text-om-gray-800">{{ rec.location }}</h1>
              </div>
              <span class="text-[11px] font-medium uppercase tracking-wide text-[#0284C7] bg-(--cl-accent-50) rounded px-2 py-0.5">{{ rec.priority }}</span>
            </div>

            <section>
              <h4 class="text-sm font-semibold text-om-gray-800 mb-1">The problem on your store</h4>
              <p class="text-sm text-om-gray-700 leading-snug">{{ rec.diagnosis }}</p>
              <p class="text-xs text-om-gray-500 mt-1 leading-snug">{{ rec.metric }}</p>
            </section>

            <section>
              <h4 class="text-sm font-semibold text-om-gray-800 mb-1">What we'll change</h4>
              <p class="text-sm text-om-gray-600 leading-snug">{{ rec.brief }}</p>
            </section>

            <section>
              <h4 class="text-sm font-semibold text-om-gray-800 mb-1">Why it works</h4>
              <p class="text-sm text-om-gray-600 leading-snug">{{ rec.benchmark }}</p>
            </section>

            <div class="rounded-xl border border-om-gray-200 divide-y divide-om-gray-100">
              <div class="flex items-center justify-between px-3.5 py-2.5"><span class="text-xs text-om-gray-500">Projected revenue</span><span class="text-sm font-semibold text-om-gray-800">{{ rec.revenue }}</span></div>
              <div class="flex items-center justify-between px-3.5 py-2.5"><span class="text-xs text-om-gray-500">Confidence</span><span class="text-sm font-semibold text-om-gray-800">{{ Math.round(rec.confidence * 100) }}%</span></div>
            </div>

            <section class="space-y-2 text-xs text-om-gray-600">
              <div class="flex items-start gap-2"><Target :size="14" class="text-om-gray-400 mt-0.5 shrink-0" />{{ rec.reach }} · 1 click, no developer.</div>
              <div class="flex items-start gap-2"><ShieldCheck :size="14" class="text-[#1F9D6B] mt-0.5 shrink-0" />Launched as an A/B test against the original, reversible anytime, with revenue guardrails.</div>
            </section>
          </div>
        </div>

        <!-- Right: the suggestion previewed on the store -->
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="h-12 shrink-0 border-b border-om-gray-200 bg-white flex items-center justify-between px-6">
            <span class="text-xs font-medium text-om-gray-500">Preview on your store</span>
            <div class="flex items-center gap-0.5 rounded-lg bg-om-gray-100 p-0.5">
              <button @click="previewMode = 'control'" class="text-xs px-2.5 h-7 rounded-md cursor-pointer" :class="previewMode === 'control' ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500'">Original</button>
              <button @click="previewMode = 'variant'" class="text-xs px-2.5 h-7 rounded-md cursor-pointer" :class="previewMode === 'variant' ? 'bg-white text-[#0369A1] shadow-sm font-medium' : 'text-om-gray-500'">Suggested</button>
            </div>
          </div>
          <div class="flex-1 min-h-0 overflow-y-auto bg-om-gray-100 p-6">
            <div class="max-w-4xl mx-auto">
              <ClStorePage :product="previewProduct" :regions="previewRegions" :focused-id="previewMode === 'variant' ? rec.id : null" :preview-mode="previewMode" url="peakgear.example" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronRight, Sparkles, FlaskConical, Target, ShieldCheck, Type, List, Image } from 'lucide-vue-next'
import './conversionlift.css'
import ClSidebar from './components/ClSidebar.vue'
import ClStorePage from './components/ClStorePage.vue'
import Button from '../components/shared/Button.vue'
import { getOptimizations } from './data/optimizations.js'
import { DEMO_DOMAIN, genContent, representativeProduct } from './flowDemo.js'

const emit = defineEmits(['navigate'])

const recs = getOptimizations(DEMO_DOMAIN)
function readId() {
  const parts = window.location.hash.replace('#/', '').replace('#', '').split('/')
  return parts[0] === 'cl-recommendation' ? (parts[1] || null) : null
}
const recId = ref(readId())
const rec = computed(() => recs.find(r => r.id === recId.value) || recs[0])
function onHash() { recId.value = readId() }
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))

function recIcon(loc) {
  return { 'Product title': Type, 'Below add-to-cart': ShieldCheck, 'Description bullets': List, 'Image with badge': Image }[loc] || Sparkles
}

const ANCHOR = { 'Product title': 'title', 'Below add-to-cart': 'belowAtc', 'Description bullets': 'description', 'Image with badge': 'aboveTabs' }
const previewProduct = representativeProduct()
const previewMode = ref('variant')
const previewRegions = computed(() => {
  const r = rec.value
  const anchor = ANCHOR[r.location] || 'belowAtc'
  return { [anchor]: [{ id: r.id, state: 'applied', content: genContent(r, previewProduct), location: r.location }] }
})

function apply() { window.location.hash = '/cl-flow-6/recommendations' }
function startTest() { emit('navigate', 'cl-abtest-setup') }
</script>
