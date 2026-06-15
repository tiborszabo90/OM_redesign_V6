<template>
  <div class="h-screen flex bg-om-gray-50">
    <ClSidebar active="abtests" @navigate="$emit('navigate', $event)" />

    <main class="flex-1 min-w-0 flex flex-col">
      <!-- Top bar -->
      <div class="h-14 shrink-0 border-b border-om-gray-200 bg-white flex items-center justify-between px-6">
        <div class="flex items-center gap-1.5 text-sm">
          <button @click="$emit('navigate', 'cl-abtests')" class="text-om-gray-500 hover:text-om-gray-700 cursor-pointer">A/B tests</button>
          <ChevronRight :size="14" class="text-om-gray-300" />
          <span class="font-medium text-om-gray-800">{{ hasProject ? 'Start a test' : 'Choose what to test' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <template v-if="hasProject">
            <div class="flex items-center gap-1 rounded-lg bg-om-gray-100 p-0.5 mr-1">
              <button v-for="p in PRESENTATIONS" :key="p.id" @click="presentation = p.id"
                class="text-xs font-medium px-2.5 h-7 rounded-md transition-colors cursor-pointer"
                :class="presentation === p.id ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500'">{{ p.label }}</button>
            </div>
            <Button variant="secondary" size="sm" @click="cancel">Cancel</Button>
            <Button variant="primary" size="sm" @click="$emit('navigate', 'cl-abtest')"><template #icon><Rocket :size="15" /></template>Launch test</Button>
          </template>
          <Button v-else variant="secondary" size="sm" @click="cancel">Cancel</Button>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">

        <!-- ═══════════ Choose what to test (no variable yet) ═══════════ -->
        <div v-if="!hasProject" class="max-w-xl mx-auto px-8 py-8 space-y-5">
          <div class="text-center">
            <div class="w-12 h-12 rounded-2xl bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center mx-auto mb-3"><FlaskConical :size="24" /></div>
            <h1 class="text-xl font-bold text-om-gray-800">What do you want to test?</h1>
            <p class="text-sm text-om-gray-500 mt-1">Pick a variable to run against the original, or generate a new one.</p>
          </div>

          <button @click="$emit('navigate', 'cl-flow-6')" class="w-full rounded-2xl border border-dashed border-(--cl-accent-400) bg-(--cl-accent-50) p-4 flex items-center gap-3 text-left cursor-pointer hover:bg-(--cl-accent-100) transition-colors">
            <div class="w-9 h-9 rounded-lg bg-(--cl-accent-500) text-white flex items-center justify-center shrink-0"><Sparkles :size="18" /></div>
            <div class="min-w-0 flex-1"><p class="text-sm font-semibold text-om-gray-800">Generate a new variable</p><p class="text-xs text-om-gray-500 mt-0.5">Create optimized content, then test it.</p></div>
            <ArrowRight :size="16" class="text-(--cl-accent-600) shrink-0" />
          </button>

          <div>
            <p class="text-[11px] font-medium uppercase tracking-wide text-om-gray-400 mb-2">Or test an existing variable</p>
            <div class="space-y-2.5">
              <button v-for="p in testableProjects" :key="p.id" @click="chooseProject(p.id)" class="w-full rounded-xl border border-om-gray-200 bg-white p-3.5 flex items-center gap-3 text-left hover:border-(--cl-accent-400) transition-colors cursor-pointer">
                <div class="flex -space-x-2 shrink-0">
                  <img v-for="img in variantImages.slice(0, 3)" :key="img" :src="img" alt="" class="w-9 h-9 rounded-lg object-cover border-2 border-white" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-medium text-om-gray-800 truncate">{{ p.name }}</div>
                  <div class="text-xs text-om-gray-500">{{ p.element }} · {{ p.images }} images</div>
                </div>
                <Tag :variant="statusTag(p.status)">{{ p.status }}</Tag>
                <ChevronRight :size="16" class="text-om-gray-300 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        <template v-else>

        <!-- ═══════════ Version 1: Plan + Advanced ═══════════ -->
        <div v-if="presentation === 1" class="max-w-xl mx-auto px-8 py-8 space-y-5">
          <div class="text-center">
            <div class="w-12 h-12 rounded-2xl bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center mx-auto mb-3"><FlaskConical :size="24" /></div>
            <h1 class="text-xl font-bold text-om-gray-800">Test your variable</h1>
            <p class="text-sm text-om-gray-500 mt-1">We've set this up with proven defaults. Review the plan and launch, or fine-tune below.</p>
          </div>

          <!-- What we're testing -->
          <section class="rounded-2xl border border-om-gray-200 bg-white p-5">
            <h2 class="text-sm font-semibold text-om-gray-800 mb-3">What we're testing</h2>
            <div class="space-y-2.5">
              <div class="rounded-xl border border-om-gray-200 p-3.5">
                <span class="text-[11px] font-medium uppercase tracking-wide text-om-gray-400">Control</span>
                <span class="text-sm font-semibold text-om-gray-800 ml-2">Original</span>
                <p class="text-xs text-om-gray-500 mt-0.5">Current product pages, unchanged</p>
              </div>
              <div v-for="arm in variantArms" :key="arm.id" class="rounded-xl border border-(--cl-accent-300) bg-(--cl-accent-50) p-3.5">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <span class="text-[11px] font-medium uppercase tracking-wide text-[#0284C7]">Variable</span>
                    <span class="text-sm font-semibold text-om-gray-800 ml-2">{{ arm.name }}</span>
                    <p class="text-xs text-om-gray-500 mt-0.5">{{ arm.desc }}</p>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button class="text-xs font-medium text-[#0284C7] hover:underline cursor-pointer" @click="$emit('navigate', 'cl-project')">View</button>
                    <button v-if="variantCount > 1" @click="removeArm(arm.id)" class="w-7 h-7 rounded-lg flex items-center justify-center text-om-gray-400 hover:bg-white hover:text-om-gray-600 cursor-pointer"><X :size="15" /></button>
                  </div>
                </div>
                <div class="flex gap-1.5 mt-2.5">
                  <img v-for="img in variantImages" :key="img" :src="img" alt="" class="w-10 h-10 rounded-lg object-cover border border-white" />
                  <div class="w-10 h-10 rounded-lg bg-white/70 border border-white flex items-center justify-center text-[11px] font-medium text-om-gray-500">+{{ project.images - variantImages.length }}</div>
                </div>
              </div>

              <!-- add a variable -->
              <div class="relative">
                <button @click="addMenu = !addMenu" class="w-full h-10 rounded-xl border border-dashed border-om-gray-300 text-sm text-om-gray-500 hover:text-[#0284C7] hover:border-(--cl-accent-400) flex items-center justify-center gap-1.5 cursor-pointer"><Plus :size="15" />Add a variable</button>
                <div v-if="addMenu" class="absolute left-0 right-0 top-full mt-1.5 z-20 bg-white rounded-xl border border-om-gray-200 shadow-[0_12px_28px_rgba(17,18,19,0.16)] p-1.5">
                  <button @click="addGenerated" class="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-om-gray-50 cursor-pointer text-left">
                    <Sparkles :size="16" class="text-(--cl-accent-600) mt-0.5 shrink-0" />
                    <span><span class="block text-sm font-medium text-om-gray-800">Generate an alternative</span><span class="block text-xs text-om-gray-500">Let AI create another angle to test.</span></span>
                  </button>
                  <button @click="addExisting" class="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-om-gray-50 cursor-pointer text-left">
                    <Copy :size="16" class="text-om-gray-500 mt-0.5 shrink-0" />
                    <span><span class="block text-sm font-medium text-om-gray-800">Pick an existing variable</span><span class="block text-xs text-om-gray-500">Reuse a variable you generated elsewhere.</span></span>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="addMenu" class="fixed inset-0 z-10" @click="addMenu = false"></div>

            <div class="mt-4 flex items-center justify-between rounded-xl bg-om-gray-50 px-4 py-3">
              <div class="min-w-0 pr-4"><p class="text-sm font-medium text-om-gray-800">Measure each element's contribution</p><p class="text-xs text-om-gray-500 mt-0.5">Learn which change drives the lift.</p></div>
              <ToggleSwitch v-model="attribution" />
            </div>
          </section>

          <section class="rounded-2xl border border-om-gray-200 bg-white p-5">
            <ul class="space-y-3.5">
              <li v-for="(line, i) in planLines" :key="i" class="flex items-start gap-3">
                <div class="w-7 h-7 rounded-lg bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center shrink-0"><component :is="line.icon" :size="15" /></div>
                <p class="text-sm text-om-gray-700 leading-snug pt-1" v-html="line.text"></p>
              </li>
            </ul>
          </section>
          <Button variant="primary" class="w-full" @click="$emit('navigate', 'cl-abtest')"><template #icon><Rocket :size="16" /></template>Launch test</Button>
          <div class="pt-1">
            <button @click="showAdvanced = !showAdvanced" class="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-om-gray-500 hover:text-om-gray-700 cursor-pointer">
              <SlidersHorizontal :size="15" />Advanced settings<ChevronDown :size="15" class="transition-transform" :class="showAdvanced ? 'rotate-180' : ''" />
            </button>
            <div v-if="showAdvanced" class="mt-4 space-y-4 text-left">
              <section class="rounded-xl border border-om-gray-200 bg-white p-5">
                <h2 class="text-sm font-semibold text-om-gray-800 mb-2">Traffic allocation</h2>
                <div class="grid grid-cols-2 gap-2.5">
                  <button @click="allocation = 'fixed'" class="text-left rounded-xl border p-4 cursor-pointer" :class="allocation === 'fixed' ? 'border-(--cl-accent-500) bg-(--cl-accent-50)' : 'border-om-gray-200 hover:border-(--cl-accent-300)'"><div class="flex items-center gap-2 text-sm font-semibold text-om-gray-800"><SlidersHorizontal :size="15" />Fixed split</div></button>
                  <button @click="allocation = 'bandit'" class="text-left rounded-xl border p-4 cursor-pointer" :class="allocation === 'bandit' ? 'border-(--cl-accent-500) bg-(--cl-accent-50)' : 'border-om-gray-200 hover:border-(--cl-accent-300)'"><div class="flex items-center gap-2 text-sm font-semibold text-om-gray-800"><Zap :size="15" />Auto-optimize</div></button>
                </div>
              </section>
              <section class="rounded-xl border border-om-gray-200 bg-white p-5 space-y-4">
                <div><h2 class="text-sm font-semibold text-om-gray-800 mb-2">Primary goal</h2><Dropdown v-model="goal" :options="goalOptions" /></div>
                <div><h2 class="text-sm font-semibold text-om-gray-800 mb-2">Guardrail metrics</h2><MultiSelect v-model="guardrails" :options="guardrailOptions" placeholder="Select guardrails" /></div>
              </section>
              <section class="rounded-xl border border-om-gray-200 bg-white p-5 space-y-4">
                <div>
                  <h2 class="text-sm font-semibold text-om-gray-800 mb-2">Statistics</h2>
                  <div class="flex gap-2"><button v-for="s in statModes" :key="s" @click="statMode = s" class="flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium cursor-pointer" :class="statMode === s ? 'border-(--cl-accent-500) bg-(--cl-accent-50) text-[#0369A1]' : 'border-om-gray-200 text-om-gray-700 hover:border-(--cl-accent-300)'">{{ s }}</button></div>
                </div>
                <div>
                  <h2 class="text-sm font-semibold text-om-gray-800 mb-2">Stop the test</h2>
                  <div class="flex gap-2"><button v-for="r in stopRules" :key="r" @click="stopRule = r" class="flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium cursor-pointer" :class="stopRule === r ? 'border-(--cl-accent-500) bg-(--cl-accent-50) text-[#0369A1]' : 'border-om-gray-200 text-om-gray-700 hover:border-(--cl-accent-300)'">{{ r }}</button></div>
                  <div v-if="stopRule === 'After a fixed period'" class="mt-3 w-44"><Dropdown v-model="duration" :options="durationOptions" /></div>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-om-gray-50 px-4 py-3"><p class="text-sm font-medium text-om-gray-800">Automatically roll out the winner</p><ToggleSwitch v-model="autoWinner" /></div>
              </section>
              <section class="rounded-xl border border-om-gray-200 bg-white p-5"><h2 class="text-sm font-semibold text-om-gray-800 mb-2">Audience</h2><Dropdown v-model="audience" :options="audienceOptions" /></section>
            </div>
          </div>
        </div>

        <!-- ═══════════ Version 2: Conversational ═══════════ -->
        <div v-else-if="presentation === 2" class="max-w-xl mx-auto px-8 py-6 flex flex-col min-h-full">
          <div class="flex-1 space-y-4">
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-lg bg-(--cl-accent-500) text-white flex items-center justify-center shrink-0"><Sparkles :size="16" /></div>
              <div class="space-y-3 min-w-0">
                <p class="text-sm text-om-gray-700">I've drafted an A/B test for your <span class="font-medium">{{ project.name }}</span> variable. Here's the plan:</p>
                <div class="rounded-2xl border border-om-gray-200 bg-white p-4">
                  <ul class="space-y-3">
                    <li v-for="(line, i) in planLines" :key="i" class="flex items-start gap-2.5">
                      <component :is="line.icon" :size="15" class="text-(--cl-accent-600) mt-0.5 shrink-0" />
                      <p class="text-sm text-om-gray-700 leading-snug" v-html="line.text"></p>
                    </li>
                  </ul>
                </div>
                <p class="text-sm text-om-gray-700">Tell me what to change, or launch it as is.</p>
              </div>
            </div>
            <div v-for="(m, i) in messages" :key="i" class="flex gap-3" :class="m.role === 'user' ? 'flex-row-reverse' : ''">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="m.role === 'user' ? 'bg-om-gray-200 text-om-gray-600' : 'bg-(--cl-accent-500) text-white'">
                <component :is="m.role === 'user' ? User : Sparkles" :size="16" />
              </div>
              <div class="text-sm rounded-2xl px-3.5 py-2 max-w-[80%]" :class="m.role === 'user' ? 'bg-om-gray-100 text-om-gray-800' : 'text-om-gray-700'" v-html="m.text"></div>
            </div>
          </div>

          <div class="sticky bottom-0 pt-3 pb-1 bg-om-gray-50">
            <div class="flex flex-wrap gap-1.5 mb-2.5">
              <button v-for="c in chips" :key="c.label" @click="say(c)" class="text-xs px-3 h-8 rounded-full border border-om-gray-200 bg-white text-om-gray-700 hover:border-(--cl-accent-400) hover:text-[#0284C7] transition-colors cursor-pointer">{{ c.label }}</button>
            </div>
            <div class="rounded-2xl border border-om-gray-200 bg-white p-2.5 flex items-center gap-2">
              <input v-model="chatDraft" placeholder="Adjust the test…" class="flex-1 bg-transparent text-sm focus:outline-none px-1.5" @keyup.enter="sendFree" />
              <button @click="sendFree" class="w-8 h-8 rounded-lg bg-(--cl-accent-500) text-white flex items-center justify-center hover:bg-(--cl-accent-600) cursor-pointer"><ArrowUp :size="16" /></button>
            </div>
          </div>
        </div>

        <!-- ═══════════ Version 3: Editable sentence ═══════════ -->
        <div v-else class="max-w-2xl mx-auto px-8 py-10">
          <h1 class="text-xl font-bold text-om-gray-800 mb-1">Your test, in a sentence</h1>
          <p class="text-sm text-om-gray-500 mb-6">Tap any highlighted part to change it. Everything updates live.</p>

          <p class="text-lg text-om-gray-700 leading-loose">
            Test
            <span class="relative inline-block">
              <button @click="tk('arms')" class="tok">{{ variantCount }} variable{{ variantCount === 1 ? '' : 's' }}</button>
              <div v-if="openToken === 'arms'" class="pop w-60">
                <div v-for="arm in arms" :key="arm.id" class="flex items-center justify-between px-2.5 py-1.5 text-sm" :class="arm.kind === 'control' ? 'text-om-gray-500' : 'text-om-gray-700'">
                  {{ arm.name }}
                  <button v-if="arm.kind !== 'control' && arms.length > 2" @click="removeArm(arm.id)" class="text-om-gray-400 hover:text-om-gray-600 cursor-pointer"><X :size="14" /></button>
                </div>
                <button @click="addGenerated" class="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-[#0284C7] hover:bg-om-gray-50 cursor-pointer"><Plus :size="14" />Add a variable</button>
              </div>
            </span>
            against the original, splitting traffic
            <span class="relative inline-block">
              <button @click="tk('allocation')" class="tok">{{ allocation === 'bandit' ? 'automatically toward the winner' : 'evenly' }}</button>
              <div v-if="openToken === 'allocation'" class="pop w-56">
                <button @click="allocation = 'fixed'; openToken = null" class="poprow" :class="allocation === 'fixed' ? 'sel' : ''">Even split</button>
                <button @click="allocation = 'bandit'; openToken = null" class="poprow" :class="allocation === 'bandit' ? 'sel' : ''">Auto-optimize (bandit)</button>
              </div>
            </span>.
            Decide the winner by
            <span class="relative inline-block">
              <button @click="tk('goal')" class="tok">{{ goal.toLowerCase() }}</button>
              <div v-if="openToken === 'goal'" class="pop w-56">
                <button v-for="o in goalOptions" :key="o" @click="goal = o; openToken = null" class="poprow" :class="goal === o ? 'sel' : ''">{{ o }}</button>
              </div>
            </span>,
            while protecting
            <span class="relative inline-block">
              <button @click="tk('guardrails')" class="tok">{{ guardrailPhrase }}</button>
              <div v-if="openToken === 'guardrails'" class="pop w-60">
                <button v-for="o in guardrailOptions" :key="o" @click="toggleGuardrail(o)" class="poprow flex items-center gap-2">
                  <span class="w-4 h-4 rounded border flex items-center justify-center" :class="guardrails.includes(o) ? 'bg-(--cl-accent-500) border-(--cl-accent-500) text-white' : 'border-om-gray-300'"><Check v-if="guardrails.includes(o)" :size="11" /></span>{{ o }}
                </button>
              </div>
            </span>.
            Read the results using
            <span class="relative inline-block">
              <button @click="tk('stat')" class="tok">{{ statPhrase }}</button>
              <div v-if="openToken === 'stat'" class="pop w-60">
                <button v-for="o in statModes" :key="o" @click="statMode = o; openToken = null" class="poprow" :class="statMode === o ? 'sel' : ''">{{ o }}</button>
              </div>
            </span>,
            and run the test
            <span class="relative inline-block">
              <button @click="tk('stop')" class="tok">{{ stopPhrase }}</button>
              <div v-if="openToken === 'stop'" class="pop w-60">
                <button v-for="o in stopRules" :key="o" @click="stopRule = o" class="poprow" :class="stopRule === o ? 'sel' : ''">{{ o }}</button>
                <div v-if="stopRule === 'After a fixed period'" class="border-t border-om-gray-100 mt-1 pt-1">
                  <button v-for="d in durationOptions" :key="d" @click="duration = d; openToken = null" class="poprow" :class="duration === d ? 'sel' : ''">{{ d }}</button>
                </div>
              </div>
            </span>.
            <button @click="autoWinner = !autoWinner" class="tok">{{ autoWinner ? 'Automatically roll out' : 'Don\'t auto-roll-out' }}</button>
            the winner, and
            <button @click="attribution = !attribution" class="tok">{{ attribution ? 'measure' : 'don\'t measure' }}</button>
            each element's contribution. Show the test to
            <span class="relative inline-block">
              <button @click="tk('audience')" class="tok">{{ audience.toLowerCase() }}</button>
              <div v-if="openToken === 'audience'" class="pop w-56">
                <button v-for="o in audienceOptions" :key="o" @click="audience = o; openToken = null" class="poprow" :class="audience === o ? 'sel' : ''">{{ o }}</button>
              </div>
            </span>.
          </p>

          <Button variant="primary" class="mt-8" @click="$emit('navigate', 'cl-abtest')"><template #icon><Rocket :size="16" /></template>Launch test</Button>

          <div v-if="openToken" class="fixed inset-0 z-10" @click="openToken = null"></div>
        </div>

        </template>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronRight, ChevronDown, Rocket, Plus, X, SlidersHorizontal, Zap, Shield, FlaskConical, Trophy, Clock, Sparkles, ArrowUp, ArrowRight, User, Check, Copy } from 'lucide-vue-next'
import './conversionlift.css'
import ClSidebar from './components/ClSidebar.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import MultiSelect from '../components/shared/MultiSelect.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Tag from '../components/shared/Tag.vue'
import { getProject, projects } from './data/projects.js'
import { storeImages } from './data/storeImages.js'

defineEmits(['navigate'])

function readId() {
  const parts = window.location.hash.replace('#/', '').replace('#', '').split('/')
  return parts[0] === 'cl-abtest-setup' ? (parts[1] || null) : null
}
const projectId = ref(readId())
const hasProject = computed(() => !!projectId.value)
const project = computed(() => getProject(projectId.value))
function onHash() { projectId.value = readId() }
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))
function cancel() { window.location.hash = hasProject.value ? '/cl-project/' + project.value.id : '/cl-abtests' }

// Choose-what-to-test (standalone entry)
const testableProjects = computed(() => projects.filter(p => p.status !== 'Draft'))
function chooseProject(id) { window.location.hash = '/cl-abtest-setup/' + id }
const variantImages = [...storeImages.related.map(r => r.img), ...storeImages.gallery].slice(0, 5)

const PRESENTATIONS = [{ id: 1, label: 'Plan' }, { id: 2, label: 'Chat' }, { id: 3, label: 'Sentence' }]
const presentation = ref(1)
const showAdvanced = ref(false)

// ── Shared config state ──
let armSeq = 0
const arms = ref([
  { id: 'control', kind: 'control', name: 'Original', desc: 'Current product pages, unchanged' },
  { id: 'a', kind: 'variant', name: 'Variable A', desc: 'The AI-generated content for this test' },
])
const variantArms = computed(() => arms.value.filter(a => a.kind === 'variant'))
const variantCount = computed(() => variantArms.value.length)
function addGenerated() { const l = String.fromCharCode(66 + armSeq++); arms.value.push({ id: 'v' + l, kind: 'variant', name: 'Variable ' + l, desc: 'AI-generated alternative' }); addMenu.value = false }
function addExisting() { const l = String.fromCharCode(66 + armSeq++); arms.value.push({ id: 'v' + l, kind: 'variant', name: 'Variable ' + l, desc: 'Reused from another variable' }); addMenu.value = false }
function removeArm(id) { if (arms.value.length > 2) arms.value = arms.value.filter(a => a.id !== id) }
const addMenu = ref(false)

const attribution = ref(true)
const allocation = ref('fixed')

const goalOptions = ['Conversion rate', 'Add-to-cart rate', 'Revenue per visitor', 'Checkout completion']
const goal = ref('Conversion rate')
const guardrailOptions = ['Revenue per visitor', 'Average order value', 'Checkout completion', 'Return rate', 'Page load time']
const guardrails = ref(['Revenue per visitor'])
function toggleGuardrail(o) { guardrails.value = guardrails.value.includes(o) ? guardrails.value.filter(x => x !== o) : [...guardrails.value, o] }

const statModes = ['Significance', 'Probability (Bayesian)', 'Both']
const statMode = ref('Both')
const stopRules = ['When statistically significant', 'After a fixed period']
const stopRule = ref('When statistically significant')
const durationOptions = ['7 days', '14 days', '30 days']
const duration = ref('14 days')
const autoWinner = ref(false)

const audienceOptions = ['All visitors', 'New visitors', 'Returning visitors', 'Mobile visitors']
const audience = ref('All visitors')

function statusTag(status) {
  return { Live: 'green', Testing: 'green', Generating: 'orange', Review: 'orange', Draft: 'gray' }[status] || 'gray'
}

// ── Phrasing ──
const statPhrase = computed(() => ({ 'Significance': 'significance', 'Probability (Bayesian)': 'probability to be best', 'Both': 'both methods' }[statMode.value]))
const stopPhrase = computed(() => stopRule.value === 'After a fixed period' ? `for ${duration.value}` : 'until it is statistically significant')
const guardrailPhrase = computed(() => guardrails.value.length ? guardrails.value.join(', ').toLowerCase() : 'nothing extra')

const planLines = computed(() => {
  const lines = [
    { icon: FlaskConical, text: variantCount.value === 1 ? 'Test your <b>variable</b> against the <b>original</b>.' : `Test <b>${variantCount.value} variables</b> against the <b>original</b>.` },
    { icon: allocation.value === 'bandit' ? Zap : Trophy, text: allocation.value === 'bandit' ? `Send more traffic to the best performer and decide by <b>${goal.value.toLowerCase()}</b>.` : `Split traffic evenly and pick the winner by <b>${goal.value.toLowerCase()}</b>.` },
  ]
  if (guardrails.value.length) lines.push({ icon: Shield, text: `Protect <b>${guardrailPhrase.value}</b> so a win never hurts it.` })
  lines.push({ icon: Clock, text: stopRule.value === 'After a fixed period' ? `Run for <b>${duration.value}</b>, then call the result.` : 'Run <b>until the result is statistically significant</b>.' })
  if (autoWinner.value) lines.push({ icon: Trophy, text: 'Automatically <b>roll out the winner</b> when it wins.' })
  return lines
})

// ── Version 2: conversational ──
const messages = ref([])
const chatDraft = ref('')
const chips = [
  { label: 'Add a variable', fn: addGenerated, reply: () => `Added — now testing <b>${variantCount.value} variables</b>.` },
  { label: 'Auto-optimize traffic', fn: () => { allocation.value = allocation.value === 'bandit' ? 'fixed' : 'bandit' }, reply: () => allocation.value === 'bandit' ? 'Traffic will shift automatically toward the best performer.' : 'Back to an even split.' },
  { label: 'Optimize for revenue', fn: () => { goal.value = 'Revenue per visitor' }, reply: () => 'Goal set to <b>revenue per visitor</b>.' },
  { label: 'Add a guardrail', fn: () => { const n = guardrailOptions.find(o => !guardrails.value.includes(o)); if (n) guardrails.value = [...guardrails.value, n] }, reply: () => `Guardrails: <b>${guardrailPhrase.value}</b>.` },
  { label: 'Run for 14 days', fn: () => { stopRule.value = 'After a fixed period'; duration.value = '14 days' }, reply: () => 'It will run for <b>14 days</b>, then call the result.' },
  { label: 'Auto-roll-out winner', fn: () => { autoWinner.value = !autoWinner.value }, reply: () => autoWinner.value ? 'I\'ll roll out the winner automatically once guardrails hold.' : 'Winner roll-out is back to manual.' },
  { label: 'New visitors only', fn: () => { audience.value = 'New visitors' }, reply: () => 'Audience set to <b>new visitors</b>.' },
]
function say(c) {
  c.fn()
  messages.value.push({ role: 'user', text: c.label })
  messages.value.push({ role: 'assistant', text: c.reply() })
}
function sendFree() {
  const t = chatDraft.value.trim()
  if (!t) return
  messages.value.push({ role: 'user', text: t })
  messages.value.push({ role: 'assistant', text: 'Updated the plan above to match.' })
  chatDraft.value = ''
}

// ── Version 3: token popovers ──
const openToken = ref(null)
function tk(n) { openToken.value = openToken.value === n ? null : n }
</script>

<style scoped>
.tok {
  display: inline;
  padding: 0 0.375rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #0369A1;
  background: var(--cl-accent-50);
  border-bottom: 1px dashed var(--cl-accent-300);
  cursor: pointer;
}
.tok:hover { background: var(--cl-accent-100); }
.pop {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 0.375rem;
  z-index: 20;
  background: #fff;
  border: 1px solid #E6E7E8;
  border-radius: 0.75rem;
  box-shadow: 0 12px 28px rgba(17, 18, 19, 0.16);
  padding: 0.375rem;
}
.poprow {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #3f4040;
  cursor: pointer;
}
.poprow:hover { background: #F7F7F8; }
.poprow.sel { background: var(--cl-accent-50); color: #0369A1; font-weight: 500; }
</style>
