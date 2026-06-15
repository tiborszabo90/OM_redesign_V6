<template>
  <div class="h-screen flex bg-om-gray-50">
    <ClSidebar active="home" @navigate="$emit('navigate', $event)" />

    <main class="flex-1 min-w-0 overflow-y-auto px-6">
      <div class="w-full max-w-3xl mx-auto pt-10 pb-16">

        <!-- Header -->
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-semibold text-om-gray-800 tracking-tight">{{ greeting }}, Tibor</h1>
        </div>

        <!-- Impact band -->
        <div class="grid grid-cols-4 gap-3 mt-10">
          <div v-for="m in impact" :key="m.label" class="rounded-xl border border-om-gray-200 bg-white p-4">
            <p class="text-2xl font-bold" :class="m.tone === 'pos' ? 'text-[#1F9D6B]' : 'text-om-gray-800'">{{ m.value }}</p>
            <p class="text-xs text-om-gray-500 mt-0.5">{{ m.label }}</p>
          </div>
        </div>

        <!-- Needs your attention -->
        <section class="mt-10">
          <h2 class="text-sm font-semibold text-om-gray-800 mb-3">Needs your attention</h2>
          <div class="space-y-2.5">
            <button v-for="a in attention" :key="a.title" @click="a.go"
              class="w-full text-left rounded-xl border border-om-gray-200 bg-white p-3.5 flex items-center gap-3 hover:border-(--cl-accent-400) transition-colors cursor-pointer">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="a.tone === 'amber' ? 'bg-[#FEF3E2] text-[#B45309]' : 'bg-(--cl-accent-50) text-(--cl-accent-600)'"><component :is="a.icon" :size="17" /></div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-om-gray-800">{{ a.title }}</p>
                <p class="text-xs text-om-gray-500 mt-0.5">{{ a.sub }}</p>
              </div>
              <span class="text-xs font-medium text-[#0284C7] shrink-0">{{ a.cta }}</span>
              <ChevronRight :size="16" class="text-om-gray-300 shrink-0" />
            </button>
          </div>
        </section>

        <!-- Active A/B tests -->
        <section class="mt-10">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-om-gray-800">Active A/B tests</h2>
            <button @click="$emit('navigate', 'cl-abtests')" class="text-xs font-medium text-[#0284C7] hover:underline cursor-pointer">See all</button>
          </div>
          <div class="space-y-2.5">
            <button v-for="t in activeTests" :key="t.id" @click="openTest(t.id)"
              class="w-full text-left rounded-xl border border-om-gray-200 bg-white p-3.5 flex items-center gap-3 hover:border-(--cl-accent-400) transition-colors cursor-pointer">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-om-gray-800 truncate">{{ t.name }}</span>
                  <Tag variant="green">Running</Tag>
                </div>
                <p class="text-xs text-om-gray-500 mt-0.5">{{ t.scope }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-sm font-semibold text-[#1F9D6B]">{{ t.lift }}</p>
                <p class="text-[11px] text-om-gray-400">{{ t.sig }} significant</p>
              </div>
            </button>
          </div>
        </section>

        <!-- Recommendations -->
        <section class="mt-10">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-semibold text-om-gray-800">Recommended for your store</h2>
            <button @click="openRecs" class="text-xs font-medium text-[#0284C7] hover:underline cursor-pointer">Review all</button>
          </div>
          <div class="space-y-3">
            <button v-for="r in recommendations" :key="r.id" @click="openRec(r)"
              class="w-full text-left rounded-xl border border-om-gray-200 bg-white p-4 hover:border-(--cl-accent-400) hover:shadow-[0_4px_14px_rgba(14,165,233,0.10)] transition-all cursor-pointer">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center shrink-0 mt-0.5"><component :is="recIcon(r.location)" :size="16" /></div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-sm font-semibold text-om-gray-800">{{ r.location }}</span>
                      <span class="text-[10px] font-medium uppercase tracking-wide text-[#0284C7] bg-(--cl-accent-50) rounded px-1.5 py-0.5">{{ r.priority }}</span>
                    </div>
                    <p class="text-sm text-om-gray-600 mt-1 leading-snug">{{ r.diagnosis }}</p>
                  </div>
                </div>
                <ChevronRight :size="16" class="text-om-gray-300 shrink-0 mt-1" />
              </div>
              <div class="flex flex-wrap items-center gap-x-6 gap-y-1.5 mt-3 pl-11 text-xs">
                <span><span class="text-om-gray-400">Confidence</span> <span class="font-semibold text-om-gray-700">{{ Math.round(r.confidence * 100) }}%</span></span>
                <span><span class="text-om-gray-400">Reach</span> <span class="font-medium text-om-gray-700">{{ r.reach }}</span></span>
              </div>
            </button>
          </div>
        </section>

        <!-- Recent activity -->
        <section class="mt-10">
          <h2 class="text-sm font-semibold text-om-gray-800 mb-3">Recent activity</h2>
          <div class="rounded-xl border border-om-gray-200 bg-white divide-y divide-om-gray-100">
            <div v-for="(e, i) in activity" :key="i" class="flex items-center gap-3 px-4 py-3">
              <component :is="e.icon" :size="15" class="text-om-gray-400 shrink-0" />
              <p class="text-sm text-om-gray-700 flex-1 min-w-0">{{ e.text }}</p>
              <span class="text-xs text-om-gray-400 shrink-0">{{ e.when }}</span>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- Ask AI — floating launcher on the right -->
    <button @click="askOpen = true"
      class="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-(--cl-accent-500) text-white shadow-[0_8px_24px_rgba(14,165,233,0.40)] hover:bg-(--cl-accent-600) transition-colors cursor-pointer">
      <Sparkles :size="18" /><span class="text-sm font-semibold">Ask AI</span>
    </button>

    <!-- Ask AI — command palette overlay -->
    <Teleport to="body">
      <transition name="palette">
        <div v-if="askOpen" class="fixed inset-0 z-50 bg-om-gray-900/40 flex items-start justify-center pt-[16vh] px-4" @click.self="askOpen = false">
          <div class="w-full max-w-xl rounded-2xl bg-white shadow-[0_24px_60px_rgba(17,18,19,0.30)] border border-om-gray-200 overflow-hidden">
            <div class="flex items-center gap-3 px-4 h-14 border-b border-om-gray-100">
              <Sparkles :size="18" class="text-(--cl-accent-500) shrink-0" />
              <input ref="askInput" v-model="draft" placeholder="Ask AI anything about your store…"
                class="flex-1 text-base text-om-gray-800 placeholder:text-om-gray-400 focus:outline-none" @keyup.enter="$emit('navigate', 'cl-flow-6')" />
              <kbd class="text-[11px] font-sans text-om-gray-400 bg-om-gray-100 rounded px-1.5 py-0.5">Esc</kbd>
            </div>
            <div class="p-2">
              <p class="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-om-gray-400">Suggestions</p>
              <button v-for="c in chips" :key="c.label" @click="c.go"
                class="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-om-gray-50 text-left cursor-pointer">
                <div class="w-8 h-8 rounded-lg bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center shrink-0"><component :is="c.icon" :size="16" /></div>
                <span class="text-sm text-om-gray-800 flex-1">{{ c.label }}</span>
                <ChevronRight :size="15" class="text-om-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Sparkles, ArrowUp, FlaskConical, TrendingUp, Type, ShieldCheck, List, Image, ChevronRight, CheckCircle2, Trophy, Rocket, Pencil } from 'lucide-vue-next'
import './conversionlift.css'
import ClSidebar from './components/ClSidebar.vue'
import Tag from '../components/shared/Tag.vue'
import { getOptimizations } from './data/optimizations.js'
import { DEMO_DOMAIN } from './flowDemo.js'

const emit = defineEmits(['navigate'])

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
})

const draft = ref('')
const askOpen = ref(false)
const askInput = ref(null)
watch(askOpen, (open) => { if (open) nextTick(() => askInput.value?.focus()) })
function onKey(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); askOpen.value = true }
  else if (e.key === 'Escape') askOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const chips = [
  { label: 'Start an A/B test', icon: FlaskConical, go: () => emit('navigate', 'cl-abtest-setup') },
  { label: 'Insights', icon: TrendingUp, go: () => {} },
]

// Impact band (demo)
const impact = [
  { label: 'Avg. conversion lift', value: '+9.4%', tone: 'pos' },
  { label: 'Added revenue (30d)', value: '$6,200', tone: 'pos' },
  { label: 'Winning tests', value: '3' },
  { label: 'Active tests', value: '2' },
]

// Needs your attention — each maps to the exact place in the flow.
const attention = [
  { icon: CheckCircle2, tone: 'accent', title: 'Generation complete', sub: 'Benefit-led headline · 1 variable across 36 pages ready to review', cta: 'Review', go: () => { window.location.hash = '/cl-project/benefit-headline' } },
  { icon: FlaskConical, tone: 'amber', title: 'Best-seller page test is ready to call', sub: 'Reached 95% significance · +4.8% lift', cta: 'Decide', go: () => { window.location.hash = '/cl-abtest/bestsellers' } },
  { icon: Pencil, tone: 'accent', title: 'Trust badges on product pages is still a draft', sub: 'Generate a variable to start testing', cta: 'Open', go: () => { window.location.hash = '/cl-project/trust-badges' } },
]

// Active tests
const activeTests = [
  { id: 'titles', name: 'Benefit-led product titles', scope: 'All product pages · titles', lift: '+12.4%', sig: '96%' },
  { id: 'bestsellers', name: 'Best-seller page polish', scope: 'Top 50 SKUs', lift: '+4.8%', sig: '95%' },
]

// Recommendations (same as the flow surfaces)
const recommendations = getOptimizations(DEMO_DOMAIN)
function recIcon(loc) {
  return { 'Product title': Type, 'Below add-to-cart': ShieldCheck, 'Description bullets': List, 'Image with badge': Image }[loc] || Sparkles
}
function openRec(r) { window.location.hash = '/cl-recommendation/' + r.id }
function openRecs() { window.location.hash = '/cl-flow-6/recommendations' }
function openTest(id) { window.location.hash = '/cl-abtest/' + id }

// Recent activity (demo)
const activity = [
  { icon: Trophy, text: 'New arrival pages won with +15.2% lift', when: '2d ago' },
  { icon: CheckCircle2, text: 'Generation complete: Benefit-led headline', when: '2h ago' },
  { icon: Rocket, text: 'Best-seller page test launched', when: '4h ago' },
]
</script>

<style scoped>
.palette-enter-active, .palette-leave-active { transition: opacity 0.16s ease; }
.palette-enter-active > div, .palette-leave-active > div { transition: opacity 0.16s ease, transform 0.16s ease; }
.palette-enter-from, .palette-leave-to { opacity: 0; }
.palette-enter-from > div, .palette-leave-to > div { opacity: 0; transform: translateY(-8px) scale(0.98); }
</style>
