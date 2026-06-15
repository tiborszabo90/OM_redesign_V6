<template>
  <div class="h-screen flex bg-om-gray-50">
    <ClSidebar active="projects" @navigate="$emit('navigate', $event)" />

    <!-- Main -->
    <main v-if="!reviewing" class="flex-1 min-w-0 flex flex-col">
      <!-- Top bar: breadcrumb + workflow actions -->
      <div class="h-14 shrink-0 border-b border-om-gray-200 bg-white flex items-center justify-between px-6">
        <div class="flex items-center gap-1.5 text-sm">
          <button @click="$emit('navigate', 'cl-projects')" class="text-om-gray-500 hover:text-om-gray-700 cursor-pointer">Variables</button>
          <ChevronRight :size="14" class="text-om-gray-300" />
          <span class="font-medium text-om-gray-800">{{ project.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Button v-if="phase !== 'empty'" variant="secondary" size="sm" :disabled="!pendingCount" @click="openReview()">
            <template #icon><CheckCheck :size="15" /></template>Review variable{{ pendingCount ? ` (${pendingCount})` : '' }}
          </Button>
          <Button v-if="project.test" variant="secondary" size="sm" @click="viewTest">
            <template #icon><FlaskConical :size="15" /></template>View A/B test
          </Button>
          <Button v-else variant="secondary" size="sm" @click="startTest">
            <template #icon><FlaskConical :size="15" /></template>Start A/B test
          </Button>
          <Button v-if="isLive" variant="primary" size="sm" disabled>
            <template #icon><Check :size="15" /></template>Live
          </Button>
          <Button v-else variant="primary" size="sm" :disabled="g.done.value === 0" @click="published = true">
            <template #icon><Rocket :size="15" /></template>Go live
          </Button>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <div class="max-w-3xl mx-auto px-8 py-6">

          <!-- Title block -->
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex items-center gap-2.5">
                <h1 class="text-xl font-bold text-om-gray-800">{{ project.name }}</h1>
                <Tag :variant="statusTag(statusLabel)">{{ statusLabel }}</Tag>
              </div>
              <p class="text-sm text-om-gray-500 mt-1">{{ project.note }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <Button variant="secondary" size="sm"><template #icon><Pencil :size="14" /></template>Edit</Button>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs text-om-gray-500 mt-3">
            <span class="flex items-center gap-1"><Target :size="13" />{{ project.element }}</span>
            <span class="flex items-center gap-1"><Users :size="13" />{{ project.audience }}</span>
            <span class="flex items-center gap-1"><Calendar :size="13" />Updated {{ project.updated }}</span>
          </div>

          <!-- ── Draft: nothing generated yet ── -->
          <div v-if="phase === 'empty'" class="mt-6 rounded-xl border border-dashed border-om-gray-200 bg-white px-6 py-16 text-center">
            <div class="w-12 h-12 rounded-xl bg-om-gray-100 text-om-gray-400 flex items-center justify-center mx-auto mb-3"><Sparkles :size="22" /></div>
            <h2 class="text-sm font-semibold text-om-gray-800">No variable generated yet</h2>
            <p class="text-sm text-om-gray-500 mt-1 max-w-md mx-auto">This is still a draft. Generate it to create optimized content across {{ project.element.toLowerCase() }}.</p>
            <div class="mt-4"><Button variant="primary" size="sm" @click="$emit('navigate', 'cl-flow-6')"><template #icon><Sparkles :size="14" /></template>Generate variable</Button></div>
          </div>

          <template v-else>
            <!-- Variable header -->
            <div class="flex items-center justify-between mt-6 mb-3">
              <h2 class="text-sm font-semibold text-om-gray-800">Variable</h2>
              <span class="text-xs text-om-gray-400">{{ g.total }} generated {{ unitLabel }} · 1 variable</span>
            </div>

            <!-- ── While generating: same display as the flow ── -->
            <template v-if="phase === 'generating'">
              <div class="rounded-2xl bg-(--cl-accent-50) border border-(--cl-accent-200) p-5 flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-(--cl-accent-500) text-white flex items-center justify-center shrink-0"><Loader2 :size="22" class="animate-spin" /></div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-bold text-om-gray-800">We're generating your variable</h3>
                  <p class="text-sm text-om-gray-600 mt-0.5">{{ g.total }} pages, about 30s each. Review them here as they finish, no need to wait.</p>
                </div>
              </div>

              <div class="mt-4 flex items-center gap-4">
                <div class="flex-1">
                  <div class="flex items-center justify-between text-sm mb-1.5">
                    <span class="font-medium text-om-gray-700">{{ g.done.value }} / {{ g.total }} pages</span>
                    <span class="text-om-gray-500">{{ g.pct.value }}% · {{ g.etaLabel.value }}</span>
                  </div>
                  <div class="h-2 rounded-full bg-om-gray-200 overflow-hidden"><div class="h-full bg-(--cl-accent-500) rounded-full transition-[width] duration-300" :style="{ width: g.pct.value + '%' }"></div></div>
                </div>
                <Button size="sm" variant="secondary" @click="g.togglePause()">{{ g.status.value === 'paused' ? 'Resume' : 'Pause' }}</Button>
                <Button size="sm" variant="secondary" @click="g.cancel()">Cancel</Button>
              </div>

              <div class="mt-4 space-y-2">
                <div v-for="(it, i) in g.items" :key="it.id"
                  class="flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5"
                  :class="g.statusOf(i) === 'active' ? 'border-(--cl-accent-400)' : (g.statusOf(i) === 'queued' ? 'border-om-gray-200 opacity-55' : 'border-om-gray-200')">
                  <img :src="it.img" alt="" class="w-10 h-10 rounded-lg object-cover bg-om-gray-100 shrink-0" />
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-om-gray-800 truncate">{{ it.title }}</div>
                    <div class="text-xs text-om-gray-500 truncate">{{ g.statusOf(i) === 'done' ? it.snippet : g.statusOf(i) === 'active' ? 'Writing this page…' : 'Queued' }}</div>
                  </div>
                  <span v-if="g.statusOf(i) === 'done'" class="text-xs text-[#15803D] inline-flex items-center gap-1 shrink-0"><Check :size="13" />Done</span>
                  <Loader2 v-else-if="g.statusOf(i) === 'active' && g.status.value === 'generating'" :size="15" class="animate-spin text-(--cl-accent-600) shrink-0" />
                  <span v-else class="text-om-gray-300 shrink-0">•</span>
                </div>
              </div>
            </template>

            <!-- ── Done: review the generated images ── -->
            <template v-else>
              <!-- A/B test banner -->
              <button v-if="project.test" @click="viewTest"
                class="w-full mb-4 rounded-xl border border-(--cl-accent-200) bg-(--cl-accent-50) px-4 py-3 flex items-center gap-3 text-left cursor-pointer hover:bg-(--cl-accent-100) transition-colors">
                <div class="w-8 h-8 rounded-lg bg-(--cl-accent-500) text-white flex items-center justify-center shrink-0"><FlaskConical :size="16" /></div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-om-gray-800">A/B test {{ project.test.status.toLowerCase() }}</p>
                  <p class="text-xs text-om-gray-500">Measured against the original · {{ project.test.lift }} conversion lift</p>
                </div>
                <span class="text-xs font-medium text-[#0284C7] flex items-center gap-0.5 shrink-0">View test<ChevronRight :size="14" /></span>
              </button>

              <p class="text-sm text-om-gray-500 mb-4">This variable bundles every generated {{ unitNoun }} into one optimized version. Review each, then test the variable as a whole against the original.</p>

              <!-- Text projects: before → after headline rows -->
              <div v-if="isText" class="space-y-2">
                <button v-for="(g0, i) in g.items.slice(0, 8)" :key="g0.id" @click="openReview(i)"
                  class="w-full text-left rounded-xl border border-om-gray-200 bg-white px-4 py-3 flex items-start gap-3 hover:border-(--cl-accent-400) transition-colors cursor-pointer">
                  <div class="min-w-0 flex-1">
                    <p class="text-xs text-om-gray-400 truncate">{{ g0.title }}</p>
                    <p class="text-sm font-semibold text-om-gray-800 mt-0.5">{{ displaySnippet(g0) }}</p>
                  </div>
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0 mt-0.5"
                    :class="revStatus(g0) === 'approved' ? 'bg-[#1F9D6B] text-white' : 'bg-[#F59E0B] text-white'">
                    <component :is="revStatus(g0) === 'approved' ? Check : Clock" :size="10" />{{ revStatus(g0) === 'approved' ? 'Approved' : 'Pending' }}
                  </span>
                </button>
              </div>

              <!-- Image projects: same row list as text, with a thumbnail -->
              <div v-else class="space-y-2">
                <button v-for="(g0, i) in g.items.slice(0, 8)" :key="g0.id" @click="openReview(i)"
                  class="w-full text-left rounded-xl border border-om-gray-200 bg-white px-3 py-2.5 flex items-center gap-3 hover:border-(--cl-accent-400) transition-colors cursor-pointer">
                  <img :src="displayImg(g0)" alt="" class="w-12 h-12 rounded-lg object-cover bg-om-gray-100 shrink-0" />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-om-gray-800 truncate">{{ g0.title }}</p>
                    <p class="text-xs text-om-gray-500 truncate">{{ displaySnippet(g0) }}</p>
                  </div>
                  <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md shrink-0"
                    :class="revStatus(g0) === 'approved' ? 'bg-[#1F9D6B] text-white' : 'bg-[#F59E0B] text-white'">
                    <component :is="revStatus(g0) === 'approved' ? Check : Clock" :size="10" />{{ revStatus(g0) === 'approved' ? 'Approved' : 'Pending' }}
                  </span>
                </button>
              </div>
              <button class="w-full mt-3 h-10 rounded-xl border border-dashed border-om-gray-200 text-sm text-om-gray-500 hover:text-om-gray-700 hover:border-om-gray-300 cursor-pointer">
                Show all {{ g.total }} generated {{ unitLabel }}
              </button>
            </template>
          </template>

        </div>
      </div>
    </main>

    <!-- Review sub-page -->
    <main v-else-if="current" class="flex-1 min-w-0 flex flex-col bg-white">
          <div class="flex items-center gap-4 px-5 h-14 border-b border-om-gray-200 shrink-0">
            <div class="flex items-center gap-1.5 text-sm min-w-0">
              <button @click="reviewing = false" class="flex items-center gap-1 text-om-gray-500 hover:text-om-gray-700 cursor-pointer shrink-0"><ChevronLeft :size="16" />{{ project.name }}</button>
              <ChevronRight :size="14" class="text-om-gray-300 shrink-0" />
              <span class="font-medium text-om-gray-800 truncate">{{ current.title }}</span>
            </div>
            <div class="ml-auto flex items-center gap-3 shrink-0">
              <div class="inline-flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
                <button v-for="m in reviewModes" :key="m.key" @click="reviewMode = m.key"
                  class="px-2.5 h-7 rounded-md text-xs font-medium transition-colors cursor-pointer"
                  :class="reviewMode === m.key ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700'">{{ m.label }}</button>
              </div>
              <div class="inline-flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
                <button v-for="d in ['desktop', 'mobile']" :key="d" @click="reviewDevice = d" :title="d === 'desktop' ? 'Desktop' : 'Mobile'"
                  class="px-2.5 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer"
                  :class="reviewDevice === d ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700'">
                  <component :is="d === 'desktop' ? Monitor : Smartphone" :size="14" />
                </button>
              </div>
              <div class="flex items-center gap-2">
                <Button variant="secondary" size="sm" :disabled="reviewIndex === 0" @click="step(-1)"><template #icon><ChevronLeft :size="16" /></template>Previous</Button>
                <span class="text-xs text-om-gray-500 tabular-nums">{{ reviewIndex + 1 }} of {{ reviewable.length }}</span>
                <Button variant="secondary" size="sm" :disabled="reviewIndex === reviewable.length - 1" @click="step(1)">Next<ChevronRight :size="16" /></Button>
              </div>
              <span class="w-px h-6 bg-om-gray-200"></span>
              <div class="flex items-center gap-2">
                <Button variant="secondary" size="sm" @click="reject"><template #icon><X :size="14" /></template>Reject</Button>
                <Button variant="secondary" size="sm" title="Delete"><template #icon><Trash2 :size="14" /></template>Delete</Button>
                <Button variant="primary" size="sm" @click="approve"><template #icon><Check :size="14" /></template>Approve &amp; next</Button>
              </div>
            </div>
          </div>
          <div class="flex-1 min-h-0 flex">
            <!-- Left: refine just this page with a prompt, like at creation -->
            <aside class="w-80 shrink-0 border-r border-om-gray-200 flex flex-col">
              <div class="px-4 pt-3 pb-2 shrink-0 border-b border-om-gray-100 space-y-2">
                <div class="relative">
                  <button @click="histOpen = !histOpen"
                    class="w-full flex items-center gap-1.5 rounded-lg border border-om-gray-200 px-2.5 h-8 text-xs font-medium text-om-gray-600 hover:border-(--cl-accent-400) transition-colors cursor-pointer">
                    <History :size="14" />History <span class="text-om-gray-400">{{ versions(current).length }}</span><ChevronDown :size="13" class="ml-auto transition-transform" :class="histOpen ? 'rotate-180' : ''" />
                  </button>
                  <template v-if="histOpen">
                    <div class="fixed inset-0 z-[55]" @click="histOpen = false"></div>
                    <div class="absolute left-0 right-0 top-full mt-1.5 z-[56] bg-white rounded-xl border border-om-gray-200 shadow-[0_12px_28px_rgba(17,18,19,0.16)] p-1.5 max-h-80 overflow-y-auto space-y-1">
                      <button v-for="(v, i) in versions(current)" :key="i" @click="revertTo(current, i); histOpen = false"
                        class="w-full text-left rounded-lg border px-3 py-2 transition-colors cursor-pointer"
                        :class="i === activeIdx(current) ? 'border-(--cl-accent-400) bg-(--cl-accent-50)' : 'border-om-gray-200 hover:border-(--cl-accent-300)'">
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-xs font-medium text-om-gray-700 truncate">{{ v.label }}</span>
                          <span v-if="i === activeIdx(current)" class="text-[10px] font-semibold text-[#0284C7] shrink-0">Current</span>
                        </div>
                        <p class="text-xs text-om-gray-500 mt-0.5 line-clamp-2">{{ v.text }}</p>
                      </button>
                    </div>
                  </template>
                </div>
                <div class="flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
                  <button @click="railTab = 'refine'" class="flex-1 h-7 rounded-md text-xs font-medium transition-colors cursor-pointer" :class="railTab === 'refine' ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500'">Refine</button>
                  <button @click="railTab = 'settings'" class="flex-1 h-7 rounded-md text-xs font-medium transition-colors cursor-pointer" :class="railTab === 'settings' ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500'">Settings</button>
                </div>
              </div>

              <!-- Settings tab: the generation settings get the full rail height -->
              <div v-if="railTab === 'settings'" class="flex-1 min-h-0 overflow-y-auto p-4">
                <CLAdvancedSettings />
              </div>

              <!-- Refine tools (everything except layout A · Settings) -->
              <template v-else>
                <div class="flex-1"></div>
                <div class="px-4 pt-2 pb-3 border-t border-om-gray-100 shrink-0 space-y-2">
                  <div class="flex flex-wrap gap-1.5">
                    <button v-for="s in refineChips" :key="s" @click="refine(s)"
                      class="text-xs px-2.5 py-1 rounded-full border border-om-gray-200 text-om-gray-600 hover:border-(--cl-accent-400) hover:text-[#0284C7] transition-colors cursor-pointer">{{ s }}</button>
                  </div>
                  <div class="rounded-xl border border-om-gray-200 focus-within:border-(--cl-accent-400) px-2.5 pt-2 pb-1.5 transition-colors">
                    <textarea v-model="refineDraft" rows="2" @keydown.enter.exact.prevent="refine(refineDraft)" placeholder="Describe a change…" class="w-full resize-none bg-transparent text-sm focus:outline-none leading-snug"></textarea>
                    <div class="flex justify-end">
                      <Button size="sm" icon-only :disabled="!refineDraft.trim()" @click="refine(refineDraft)"><template #icon><ArrowUp :size="16" /></template></Button>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" class="w-full" @click="regenerate"><template #icon><RefreshCw :size="14" /></template>Regenerate</Button>
                </div>
              </template>
            </aside>

            <!-- Right: the generated content embedded on the product page, in context -->
            <div class="flex-1 min-w-0 overflow-y-auto p-5">
              <div class="rounded-xl bg-om-gray-100 border border-om-gray-200 p-3">
                <div :class="reviewDevice === 'mobile' ? 'w-[400px] max-w-full mx-auto' : ''">
                  <ClStorePage :product="currentProduct" :regions="reviewRegions" :focused-id="reviewMode === 'variant' ? current.id : null" :preview-mode="reviewMode" :device="reviewDevice" />
                </div>
              </div>
            </div>
          </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { ChevronRight, ChevronLeft, ChevronDown, Pencil, Trash2, Target, Users, Calendar, Sparkles, Check, Clock, X, CheckCheck, Loader2, Rocket, FlaskConical, ArrowUp, RefreshCw, History, Monitor, Smartphone } from 'lucide-vue-next'
import './conversionlift.css'
import ClSidebar from './components/ClSidebar.vue'
import ClStorePage from './components/ClStorePage.vue'
import CLAdvancedSettings from './components/CLAdvancedSettings.vue'
import Tag from '../components/shared/Tag.vue'
import Button from '../components/shared/Button.vue'
import { useGeneration } from './useGeneration.js'
import { getProject } from './data/projects.js'
import { getCatalog } from './data/catalog.js'
import { storeImages } from './data/storeImages.js'

defineEmits(['navigate'])

// ── Each project has its own route: #/cl-project/<id> ──
function readId() {
  const parts = window.location.hash.replace('#/', '').replace('#', '').split('/')
  return parts[0] === 'cl-project' ? (parts[1] || null) : null
}
const projectId = ref(readId())
const project = computed(() => getProject(projectId.value))
function onHash() { projectId.value = readId() }
// Start the A/B test setup flow for this project's variable.
function startTest() { window.location.hash = '/cl-abtest-setup/' + project.value.id }
// View the project's running/finished A/B test.
function viewTest() { window.location.hash = '/cl-abtest/' + (project.value.test?.id || project.value.id) }
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))

// Same generation engine as the flow's generate step.
const g = useGeneration(null)
const published = ref(false)

// Per-image review state.
const reviews = reactive({})
const revStatus = (item) => reviews[item.id] || 'pending'
// Per-item version history (each refine/regenerate adds a version; revert anytime).
const historyById = reactive({})    // id → [{ label, text, img }]
const activeIdxById = reactive({})  // id → active version index

// Drive the generation/review state from the selected project.
watch(project, (p) => {
  published.value = false
  Object.keys(reviews).forEach(k => delete reviews[k])
  Object.keys(historyById).forEach(k => delete historyById[k])
  Object.keys(activeIdxById).forEach(k => delete activeIdxById[k])
  if (p.status === 'Generating') {
    g.done.value = p.done ?? 0
  } else if (p.status === 'Draft') {
    g.cancel()
    g.done.value = 0
  } else {
    g.cancel()
    g.done.value = g.total
    // Already applied / under test → all images approved.
    if (p.status === 'Live' || p.status === 'Testing') g.items.forEach(it => { reviews[it.id] = 'approved' })
  }
}, { immediate: true })

const phase = computed(() => {
  const s = project.value.status
  if (s === 'Draft') return 'empty'
  if (s === 'Generating' && g.done.value < g.total) return 'generating'
  return 'review'
})
const isLive = computed(() => published.value || project.value.status === 'Live')
// Text projects (e.g. a headline rewrite) review the generated copy, not images.
const isText = computed(() => project.value.kind === 'text')
const unitLabel = computed(() => isText.value ? 'headlines' : 'images')
const unitNoun = computed(() => isText.value ? 'headline' : 'image')
const statusLabel = computed(() => {
  if (published.value) return 'Live'
  if (project.value.status === 'Generating' && g.done.value >= g.total) return 'Review'
  return project.value.status
})

const reviewable = computed(() => g.items.slice(0, g.done.value))
const pendingCount = computed(() => reviewable.value.filter(i => revStatus(i) === 'pending').length)

const reviewing = ref(false)
const reviewIndex = ref(0)
const current = computed(() => reviewable.value[reviewIndex.value])

// Review preview: show the current item's generated content embedded on the store page.
const catalog = getCatalog('peakgear.example')
const currentProduct = computed(() => catalog.find(p => p.title === current.value?.title) || catalog[0])
const reviewAnchor = computed(() => isText.value ? 'title' : 'hero')
// Toggle the embedded page between the original and the generated variable.
const reviewMode = ref('variant')
const reviewModes = [{ key: 'control', label: 'Original' }, { key: 'variant', label: 'Variable' }]
const reviewDevice = ref('desktop') // desktop | mobile preview of the store page

// Read-only views of the active version (no mutation during render).
function versions(item) {
  return item ? (historyById[item.id] || [{ label: 'Original generation', text: item.snippet, img: item.img }]) : []
}
function activeIdx(item) {
  const v = versions(item); const i = activeIdxById[item?.id]
  return i == null ? v.length - 1 : Math.min(i, v.length - 1)
}
const displaySnippet = (item) => versions(item)[activeIdx(item)]?.text ?? item.snippet
const displayImg = (item) => versions(item)[activeIdx(item)]?.img ?? item.img

const reviewRegions = computed(() => {
  if (!current.value) return {}
  const content = isText.value
    ? { text: displaySnippet(current.value) }
    : { image: displayImg(current.value), text: displaySnippet(current.value), badge: ['Field-tested', '4.6★', '2-yr warranty'] }
  return {
    [reviewAnchor.value]: [{ id: current.value.id, state: 'applied', content, location: isText.value ? 'Product title' : 'Image with badge' }],
  }
})

// Refine with a prompt, or regenerate — every change is saved to the history.
const refineDraft = ref('')
const histOpen = ref(false)
const refineChips = computed(() => isText.value
  ? ['Make it shorter', 'More benefit-driven', 'Add urgency', 'Make it bolder']
  : ['Another image', 'Brighter', 'Closer crop', 'Lifestyle angle'])
const imgPool = [...storeImages.gallery, ...storeImages.related.map(r => r.img)]

// Rail tabs: refine the page, or open the generation settings.
const railTab = ref('refine')

// Lazily seed the history for an item (called from event handlers / a watch, not render).
// Seed a few prior versions so the timeline reads as an iterated generation; the
// latest entry is the active one, so it matches what's shown on the page.
function ensureHistory(item) {
  if (!historyById[item.id]) {
    if (isText.value) {
      historyById[item.id] = [
        { label: 'Original generation', text: freshHeadline(item.title, 0), img: item.img },
        { label: 'Refined: more benefit-driven', text: freshHeadline(item.title, 1), img: item.img },
        { label: 'Regenerated', text: item.snippet, img: item.img },
      ]
    } else {
      const alt = imgPool.filter(i => i !== item.img)
      historyById[item.id] = [
        { label: 'Original generation', text: 'First lifestyle angle', img: alt[0] || item.img },
        { label: 'Refined: brighter scene', text: 'Brighter lifestyle shot', img: alt[1] || item.img },
        { label: 'Regenerated', text: 'Fresh lifestyle shot', img: item.img },
      ]
    }
    activeIdxById[item.id] = historyById[item.id].length - 1
  }
  return historyById[item.id]
}
function revertTo(item, i) { if (item) activeIdxById[item.id] = i }

function mockRefineText(text, p) {
  p = p.toLowerCase()
  const parts = text.split('—').map(s => s.trim())
  const lead = parts[0], core = parts[parts.length - 1]
  if (/short|concise|punch|tight/.test(p)) return lead
  if (/benefit|value/.test(p)) return 'Built to last, ready for the trail — ' + core
  if (/urgen|today|fast|limited|stock/.test(p)) return lead + ' — selling fast'
  if (/bold|strong|confident/.test(p)) return 'Unbeatable ' + core + ' — ' + lead.toLowerCase()
  if (/brand/.test(p)) return 'PeakGear — ' + lead
  return lead + ' — ' + core
}
function nextImg(item) {
  const cur = displayImg(item)
  return imgPool[(imgPool.indexOf(cur) + 1) % imgPool.length] || imgPool[0]
}
function pushVersion(item, entry) {
  const h = ensureHistory(item)
  h.push(entry)
  activeIdxById[item.id] = h.length - 1
}
function refine(prompt) {
  const text = (prompt || '').trim()
  const item = current.value
  if (!text || !item) return
  if (isText.value) {
    pushVersion(item, { label: text, text: mockRefineText(displaySnippet(item), text), img: item.img })
  } else {
    const p = text.toLowerCase()
    const caption = /bright|light/.test(p) ? 'Bright lifestyle shot' : /close|crop|detail/.test(p) ? 'Close-up detail' : 'Fresh lifestyle angle'
    pushVersion(item, { label: text, text: caption, img: nextImg(item) })
  }
  refineDraft.value = ''
}
function freshHeadline(title, n) {
  const opts = [
    `${title} — built for the long haul`,
    `Meet the ${title}: ready for anything`,
    `${title}: tough, light and trail-ready`,
    `The ${title}, reimagined for every adventure`,
  ]
  return opts[n % opts.length]
}
function regenerate() {
  const item = current.value
  if (!item) return
  const n = (historyById[item.id] || []).filter(v => v.label === 'Regenerated').length
  if (isText.value) pushVersion(item, { label: 'Regenerated', text: freshHeadline(item.title, n), img: item.img })
  else pushVersion(item, { label: 'Regenerated', text: 'Fresh lifestyle shot', img: nextImg(item) })
}
// Seed history + clear the draft when switching to a different page.
watch(() => current.value?.id, () => { refineDraft.value = ''; histOpen.value = false; if (current.value) ensureHistory(current.value) }, { immediate: true })

function openReview(i) {
  if (i != null) {
    const idx = reviewable.value.indexOf(g.items[i])
    reviewIndex.value = idx >= 0 ? idx : 0
  } else {
    const firstPending = reviewable.value.findIndex(it => revStatus(it) === 'pending')
    reviewIndex.value = firstPending >= 0 ? firstPending : 0
  }
  reviewing.value = true
}
function step(dir) {
  reviewIndex.value = Math.min(reviewable.value.length - 1, Math.max(0, reviewIndex.value + dir))
}
function approve() {
  if (current.value) reviews[current.value.id] = 'approved'
  if (reviewIndex.value < reviewable.value.length - 1) step(1)
  else reviewing.value = false
}
function reject() {
  if (current.value) reviews[current.value.id] = 'pending'
  step(1)
}

function statusTag(status) {
  return { Live: 'green', Testing: 'green', Review: 'orange', Paused: 'gray', Generating: 'orange', Draft: 'gray' }[status] || 'gray'
}
</script>
