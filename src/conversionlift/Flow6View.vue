<template>
  <ClFlowShell
    title=""
    :steps="[]"
    :current="step"
    :back="step >= 2"
    @exit="$emit('navigate', 'conversionlift')"
    @back="goBack"
  >
    <!-- Flow progress in the top bar (up to the start of generation) -->
    <template #progress>
      <div v-if="step <= 6" class="w-full max-w-2xl flex items-center">
        <template v-for="(s, i) in PROGRESS" :key="s">
          <button type="button" @click="goToMilestone(i)" :disabled="i > progressIdx"
            class="flex items-center gap-2 shrink-0 transition-opacity"
            :class="i <= progressIdx ? 'cursor-pointer hover:opacity-70' : 'cursor-default'">
            <span class="w-6 h-6 rounded-full text-[11px] font-semibold flex items-center justify-center transition-colors"
              :class="i < progressIdx ? 'bg-(--cl-accent-500) text-white' : i === progressIdx ? 'bg-(--cl-accent-100) text-[#0284C7] ring-2 ring-(--cl-accent-400)' : 'bg-om-gray-100 text-om-gray-400'">
              <Check v-if="i < progressIdx" :size="13" /><template v-else>{{ i + 1 }}</template>
            </span>
            <span class="text-xs font-medium hidden md:block" :class="i <= progressIdx ? 'text-om-gray-700' : 'text-om-gray-400'">{{ s }}</span>
          </button>
          <div v-if="i < PROGRESS.length - 1" class="flex-1 h-0.5 mx-2 rounded-full" :class="i < progressIdx ? 'bg-(--cl-accent-500)' : 'bg-om-gray-200'"></div>
        </template>
      </div>
    </template>

    <CLAddDomainStep v-if="step === 0" :key="'site'" cta-label="Analyze" @done="startAnalyze" />

    <!-- Analyzing the store before showing recommendations -->
    <div v-else-if="step === 1" class="h-full flex flex-col items-center justify-center text-center gap-5 px-6">
      <div class="w-14 h-14 rounded-2xl bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center">
        <Loader2 :size="26" class="animate-spin" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-om-gray-800">Analyzing your store</h2>
        <p class="text-sm text-om-gray-500 mt-1 max-w-sm">We're scanning your product page to craft tailored recommendations.</p>
      </div>
      <div class="space-y-1.5 text-sm text-om-gray-500">
        <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-(--cl-accent-500) animate-pulse"></span>Reading your product page</div>
        <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-(--cl-accent-500) animate-pulse"></span>Spotting conversion opportunities</div>
        <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-(--cl-accent-500) animate-pulse"></span>Drafting your recommendations</div>
      </div>
    </div>

    <!-- Review + pick which recommendation to set up -->
    <CLRecommendStep v-else-if="step === 2" :key="'recommend'" @next="onRecommend" />

    <!-- Compose, limited to the picked recommendation(s) -->
    <CLComposeStep v-else-if="step === 3" :key="'compose'" :include="picks.length ? picks : null" @next="step = 4" />

    <!-- Scope: which product pages the optimization runs on -->
    <CLScopeStep v-else-if="step === 4" :key="'scope'" @next="onScope" />

    <!-- Audience: which visitors are entered into the experiment -->
    <CLAudienceStep v-else-if="step === 5" :key="'audience'" @next="onAudience" />

    <!-- Bulk generation progress -->
    <CLGenerateStep v-else-if="step === 6" :key="'generate'" :products="scopeProducts" @next="step = 7" @leave="$emit('navigate', 'cl-home-b')" />

    <!-- Placeholder for the step after generation (Review → Experiment → Connect → Launch, TBD) -->
    <div v-else class="h-full flex flex-col items-center justify-center text-center gap-4 px-6">
      <div class="w-14 h-14 rounded-2xl bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center"><Rocket :size="26" /></div>
      <div>
        <h2 class="text-xl font-bold text-om-gray-800">Next step coming soon</h2>
        <p class="text-sm text-om-gray-500 mt-1 max-w-sm">Review → experiment setup → connect → launch is not designed yet.</p>
      </div>
      <Button variant="secondary" @click="step = 6">Back to generation</Button>
    </div>
  </ClFlowShell>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Rocket, Loader2, Check } from 'lucide-vue-next'
import ClFlowShell from './components/ClFlowShell.vue'
import CLAddDomainStep from './components/CLAddDomainStep.vue'
import CLRecommendStep from './components/CLRecommendStep.vue'
import CLComposeStep from './components/CLComposeStep.vue'
import CLScopeStep from './components/CLScopeStep.vue'
import CLAudienceStep from './components/CLAudienceStep.vue'
import CLGenerateStep from './components/CLGenerateStep.vue'
import Button from '../components/shared/Button.vue'

defineEmits(['navigate'])

const step = ref(0)
const picks = ref([])
const scopeProducts = ref([])
const audience = ref(null)

// Top progress bar: the flow milestones up to the start of generation.
const PROGRESS = ['Site', 'What to optimize', 'Customize', 'Which pages', 'Audience', 'Generate']
// Map each step (0-6) to its milestone; the analyzing screen (1) sits under Recommend.
const STEP_TO_MILESTONE = [0, 1, 1, 2, 3, 4, 5]
const progressIdx = computed(() => STEP_TO_MILESTONE[step.value] ?? PROGRESS.length - 1)
// Clicking a completed milestone (or the current one) jumps back to its step.
const MILESTONE_TO_STEP = [0, 2, 3, 4, 5, 6]
function goToMilestone(i) { if (i <= progressIdx.value) step.value = MILESTONE_TO_STEP[i] }

function onRecommend(ids) { picks.value = ids; step.value = 3 }
function onScope(products) { scopeProducts.value = products; step.value = 5 }
function onAudience(a) { audience.value = a; step.value = 6 }
function startAnalyze() { step.value = 1 }
// Back skips the transient loading screen (recommendations -> site).
function goBack() {
  step.value = step.value === 2 ? 0 : step.value - 1
}

// ── Each step gets its own hash route (#/cl-flow-6/<slug>) ──
const STEP_SLUGS = ['', 'analyzing', 'recommendations', 'compose', 'scope', 'audience', 'generate', 'done']
function syncHash() {
  const sub = STEP_SLUGS[step.value] || ''
  const target = '#/cl-flow-6' + (sub ? '/' + sub : '')
  if (window.location.hash !== target) window.location.hash = target
}
function readHash() {
  const parts = window.location.hash.replace('#/', '').replace('#', '').split('/')
  if (parts[0] !== 'cl-flow-6') return
  const i = STEP_SLUGS.indexOf(parts[1] || '')
  const next = i >= 0 ? i : 0
  if (next !== step.value) step.value = next
}

watch(step, (s) => {
  syncHash()
  // Entering the analyzing screen (directly or via the URL) auto-advances to recommendations.
  if (s === 1) setTimeout(() => { if (step.value === 1) step.value = 2 }, 3800)
})

onMounted(() => {
  readHash()
  syncHash()
  window.addEventListener('hashchange', readHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', readHash))
</script>
