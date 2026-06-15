<template>
  <div class="h-screen flex bg-om-gray-50">
    <ClSidebar active="abtests" @navigate="$emit('navigate', $event)" />

    <!-- Main -->
    <main class="flex-1 min-w-0 flex flex-col">
      <div class="h-14 shrink-0 border-b border-om-gray-200 bg-white flex items-center px-6">
        <div class="flex items-center gap-1.5 text-sm">
          <button @click="$emit('navigate', 'cl-abtests')" class="text-om-gray-500 hover:text-om-gray-700 cursor-pointer">A/B tests</button>
          <ChevronRight :size="14" class="text-om-gray-300" />
          <span class="font-medium text-om-gray-800">{{ test.name }}</span>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-5xl mx-auto px-8 py-6">

          <!-- Title block -->
          <div class="flex items-start justify-between gap-4 mb-1">
            <div class="min-w-0">
              <div class="flex items-center gap-2.5">
                <h1 class="text-xl font-bold text-om-gray-800">{{ test.name }}</h1>
                <Tag :variant="test.status === 'Completed' ? 'gray-muted' : 'green'">{{ test.status }}</Tag>
              </div>
              <p class="text-sm text-om-gray-500 mt-1">{{ test.sequence ? `Sequential A/B tests across ${test.element}.` : `Original vs. variable on ${test.element}.` }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <Button variant="secondary" size="sm"><template #icon><Pause :size="14" /></template>Pause</Button>
              <Button variant="primary" size="sm"><template #icon><Trophy :size="14" /></template>Declare winner</Button>
            </div>
          </div>
          <div class="flex items-center gap-4 text-xs text-om-gray-500 mt-3 mb-6">
            <span class="flex items-center gap-1"><Users :size="13" />{{ test.audience }}</span>
            <span class="flex items-center gap-1"><Calendar :size="13" />Started {{ test.started }}</span>
          </div>

          <!-- Sequential testing notice + round stepper -->
          <div v-if="test.sequence" class="rounded-xl border border-(--cl-accent-300) bg-(--cl-accent-50) p-4 mb-5">
            <div class="flex items-start gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-white border border-(--cl-accent-300) text-[#0284C7] flex items-center justify-center shrink-0"><ListOrdered :size="16" /></div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-om-gray-800">Sequential A/B tests</p>
                <p class="text-sm text-om-gray-600 mt-0.5">Each heading variable runs against the original in its own round. Currently testing <span class="font-semibold text-om-gray-800">Original vs {{ test.sequence.current }}</span>.</p>
              </div>
            </div>
          </div>

          <!-- Test rounds: each round, who ran against whom, who won -->
          <div v-if="test.sequence" class="rounded-xl border border-om-gray-200 bg-white overflow-hidden mb-5">
            <div class="px-4 py-3 border-b border-om-gray-100"><h2 class="text-sm font-semibold text-om-gray-800">Test rounds</h2></div>
            <div class="divide-y divide-om-gray-100">
              <div v-for="r in test.sequence.rounds" :key="r.name" class="p-4" :class="r.status === 'Running' ? 'bg-(--cl-accent-50)/40' : ''">
                <!-- Round header -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-sm font-semibold text-om-gray-800">{{ r.name }}</span>
                  <Tag :variant="r.status === 'Completed' ? 'gray-muted' : (r.status === 'Running' ? 'green' : 'outlined')">
                    <template v-if="r.status === 'Completed'" #icon><Check :size="11" /></template>
                    <template v-else-if="r.status === 'Running'" #icon><Loader2 :size="11" /></template>
                    {{ r.status }}
                  </Tag>
                  <span class="text-xs text-om-gray-400 ml-auto">{{ r.dates }}</span>
                </div>
                <!-- Matchup: control vs variant -->
                <div class="flex items-stretch gap-3">
                  <div class="flex-1 rounded-lg border p-3" :class="r.winner === 'control' ? 'border-(--cl-accent-400) ring-1 ring-(--cl-accent-400)' : 'border-om-gray-200'">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-semibold text-om-gray-700">{{ r.control.label }}</span>
                      <Tag v-if="r.winner === 'control'" variant="green"><template #icon><Trophy :size="10" /></template>Winner</Tag>
                    </div>
                    <p class="text-sm text-om-gray-800 mt-1 truncate">“{{ r.control.text }}”</p>
                    <p v-if="r.control.cvr" class="text-xs text-om-gray-400 mt-1">CVR {{ r.control.cvr }}</p>
                  </div>
                  <div class="flex items-center text-xs font-semibold text-om-gray-400">vs</div>
                  <div class="flex-1 rounded-lg border p-3" :class="r.winner === 'variant' ? 'border-(--cl-accent-400) ring-1 ring-(--cl-accent-400)' : 'border-om-gray-200'">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-xs font-semibold" :class="linkFor(r.variant.label) ? 'text-[#0284C7] hover:underline cursor-pointer' : 'text-om-gray-700'" @click="goVar(r.variant.label)">{{ r.variant.label }}</span>
                      <Tag v-if="r.winner === 'variant'" variant="green"><template #icon><Trophy :size="10" /></template>Winner</Tag>
                      <Tag v-else-if="r.status === 'Running'" variant="orange">Leading +{{ r.lift.replace('+','') }}</Tag>
                    </div>
                    <p class="text-sm text-om-gray-800 mt-1 truncate">“{{ r.variant.text }}”</p>
                    <p v-if="r.variant.cvr" class="text-xs text-om-gray-400 mt-1">CVR {{ r.variant.cvr }}</p>
                  </div>
                </div>
                <!-- Result line -->
                <div v-if="r.status !== 'Planned'" class="flex items-center gap-4 mt-3 text-xs">
                  <span class="text-om-gray-500">Lift <span class="font-semibold text-[#1F9D6B]">{{ r.lift }}</span></span>
                  <span class="text-om-gray-500">Significance <span class="font-semibold text-om-gray-700">{{ r.sig }}</span></span>
                  <span v-if="r.status === 'Completed'" class="text-om-gray-500">{{ r.variant.label }} beat the original</span>
                  <span v-else class="text-om-gray-500">In progress — no winner declared yet</span>
                </div>
                <div v-else class="mt-3 text-xs text-om-gray-400">Queued — starts after the current round.</div>
              </div>
            </div>
          </div>

          <!-- Metrics -->
          <div class="grid grid-cols-4 gap-3 mb-5">
            <div v-for="m in metrics" :key="m.label" class="rounded-xl border border-om-gray-200 bg-white p-4">
              <p class="text-xs text-om-gray-500">{{ m.label }}</p>
              <p class="text-2xl font-bold mt-1" :class="m.tone === 'pos' ? 'text-[#1F9D6B]' : 'text-om-gray-800'">{{ m.value }}</p>
              <p v-if="m.sub" class="text-xs text-om-gray-400 mt-0.5">{{ m.sub }}</p>
            </div>
          </div>

          <!-- Lift over time -->
          <div class="rounded-xl border border-om-gray-200 bg-white p-5 mb-5">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-om-gray-800">Conversion lift over time</h2>
              <Tag variant="green"><template #icon><TrendingUp :size="12" /></template>{{ test.sig }} significant</Tag>
            </div>
            <svg viewBox="0 0 600 140" class="w-full h-36" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cl-abtest-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0EA5E9" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,120 L75,108 L150,112 L225,86 L300,78 L375,64 L450,52 L525,34 L600,22 L600,140 L0,140 Z" fill="url(#cl-abtest-area)" />
              <polyline points="0,120 75,108 150,112 225,86 300,78 375,64 450,52 525,34 600,22" fill="none" stroke="#0EA5E9" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
            </svg>
            <div class="flex justify-between text-xs text-om-gray-400 mt-2">
              <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
            </div>
          </div>

          <!-- Variation comparison (control vs variable) -->
          <div class="rounded-xl border border-om-gray-200 bg-white overflow-hidden">
            <div class="px-4 py-3 border-b border-om-gray-100"><h2 class="text-sm font-semibold text-om-gray-800">Variations</h2></div>
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-om-gray-100 text-left text-xs font-medium text-om-gray-400 uppercase tracking-wide">
                  <th class="px-4 py-2.5 font-medium">Variation</th>
                  <th class="px-4 py-2.5 font-medium text-right">Sessions</th>
                  <th class="px-4 py-2.5 font-medium text-right">CVR</th>
                  <th class="px-4 py-2.5 font-medium text-right">Lift</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in variations" :key="v.label" class="border-b border-om-gray-50 last:border-0" :class="v.winner ? 'bg-(--cl-accent-50)' : ''">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2 flex-wrap">
                      <!-- Bundle arm: each component variable is its own link -->
                      <span v-if="v.parts" class="flex items-center gap-1.5">
                        <template v-for="(p, j) in v.parts" :key="p.projectId + p.name">
                          <span v-if="j > 0" class="text-xs text-om-gray-400">+</span>
                          <span class="font-medium text-[#0284C7] hover:underline cursor-pointer" @click="goToVariable(p.projectId)">{{ p.name }}</span>
                        </template>
                      </span>
                      <span v-else class="font-medium" :class="linkFor(v.label) ? 'text-[#0284C7] hover:underline cursor-pointer' : 'text-om-gray-800'" @click="goVar(v.label)">{{ v.label }}</span>
                      <Tag v-if="v.winner" variant="green"><template #icon><Trophy :size="11" /></template>Leading</Tag>
                    </div>
                    <div class="text-xs text-om-gray-500 mt-0.5 truncate max-w-md">{{ v.text }}</div>
                  </td>
                  <td class="px-4 py-3 text-right text-om-gray-600">{{ v.sessions }}</td>
                  <td class="px-4 py-3 text-right text-om-gray-600">{{ v.cvr }}</td>
                  <td class="px-4 py-3 text-right font-semibold" :class="v.lift === '—' ? 'text-om-gray-400' : 'text-[#1F9D6B]'">{{ v.lift }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ChevronRight, Pause, Trophy, Users, Calendar, TrendingUp, ListOrdered, Check, Loader2 } from 'lucide-vue-next'
import './conversionlift.css'
import ClSidebar from './components/ClSidebar.vue'
import Tag from '../components/shared/Tag.vue'
import Button from '../components/shared/Button.vue'
import { getTest, matchupLink } from './data/abtests.js'

const emit = defineEmits(['navigate'])

// Each test has its own route: #/cl-abtest/<id>
function readId() {
  const parts = window.location.hash.replace('#/', '').replace('#', '').split('/')
  return parts[0] === 'cl-abtest' ? (parts[1] || null) : null
}
const testId = ref(readId())
const test = computed(() => getTest(testId.value))
const metrics = computed(() => test.value.metrics)
const variations = computed(() => test.value.variations)
function onHash() { testId.value = readId() }
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))

// Variable names shown in the test are clickable and jump to the variable detail.
const linkFor = (label) => matchupLink(test.value, label)
function goToVariable(projectId) { if (projectId) window.location.hash = '/cl-project/' + projectId }
function goVar(label) { goToVariable(matchupLink(test.value, label)) }
</script>
