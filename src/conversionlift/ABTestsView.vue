<template>
  <div class="h-screen flex bg-om-gray-50">
    <ClSidebar active="abtests" @navigate="$emit('navigate', $event)" />

    <!-- Main -->
    <main class="flex-1 min-w-0 flex flex-col">
      <div class="h-14 shrink-0 border-b border-om-gray-200 bg-white flex items-center justify-between px-6">
        <h1 class="text-base font-semibold text-om-gray-800">A/B tests</h1>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div>
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-om-gray-500">{{ tests.length }} tests · which variables run against each other</p>
            <Button variant="primary" size="sm" @click="$emit('navigate', 'cl-abtest-setup')"><template #icon><Plus :size="15" /></template>New A/B test</Button>
          </div>
          <div class="rounded-xl border border-om-gray-200 bg-white overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-om-gray-100 text-left text-xs font-medium text-om-gray-400 uppercase tracking-wide">
                  <th class="px-4 py-3 font-medium">Test</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="px-4 py-3 font-medium text-right">Conv. lift</th>
                  <th class="px-4 py-3 font-medium text-right">Significance</th>
                  <th class="px-4 py-3 font-medium text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in tests" :key="t.id" @click="open(t.id)" class="border-b border-om-gray-50 last:border-0 hover:bg-om-gray-50 cursor-pointer">
                  <td class="px-4 py-3">
                    <div class="font-medium text-om-gray-800">{{ t.name }}</div>
                    <!-- Variable names are clickable and jump to the variable detail -->
                    <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                      <!-- Grouped matchup: each side is a bundle of variables (Heading + Benefit list) -->
                      <template v-if="t.sides">
                        <template v-for="(s, i) in t.sides" :key="i">
                          <span v-if="i > 0" class="text-[10px] font-semibold text-om-gray-400">vs</span>
                          <span class="inline-flex items-center gap-1 rounded-md border border-om-gray-200 bg-om-gray-50 px-1.5 py-0.5">
                            <template v-for="(vv, j) in s" :key="vv">
                              <span v-if="j > 0" class="text-[10px] text-om-gray-400">+</span>
                              <span class="text-[11px] font-medium" :class="linkFor(t, vv) ? 'text-[#0284C7] hover:underline cursor-pointer' : 'text-om-gray-700'" @click.stop="goVar(t, vv)">{{ vv }}</span>
                            </template>
                          </span>
                        </template>
                      </template>
                      <!-- Flat matchup: control vs one or more variables -->
                      <template v-else v-for="(v, i) in t.matchup" :key="v">
                        <span v-if="i > 0" class="text-[10px] text-om-gray-400">vs</span>
                        <span class="text-[11px] px-1.5 py-0.5 rounded-md" :class="linkFor(t, v) ? 'bg-(--cl-accent-50) text-[#0284C7] hover:underline cursor-pointer' : 'bg-om-gray-100 text-om-gray-600'" @click.stop="goVar(t, v)">{{ v }}</span>
                      </template>
                    </div>
                  </td>
                  <td class="px-4 py-3"><Tag :variant="t.status === 'Running' ? 'green' : 'gray-muted'">{{ t.status }}</Tag></td>
                  <td class="px-4 py-3 text-right font-semibold text-[#1F9D6B]">{{ t.lift }}</td>
                  <td class="px-4 py-3 text-right text-om-gray-600">{{ t.sig }}</td>
                  <td class="px-4 py-3 text-right text-om-gray-400 text-xs">{{ t.updated }}</td>
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
import { Plus } from 'lucide-vue-next'
import './conversionlift.css'
import ClSidebar from './components/ClSidebar.vue'
import Tag from '../components/shared/Tag.vue'
import Button from '../components/shared/Button.vue'
import { abtests } from './data/abtests.js'
import { matchupLink } from './data/abtests.js'

defineEmits(['navigate'])

const updatedMap = { 'titles': '2h ago', 'bestsellers': '6h ago', 'new-arrivals': '1w ago' }
const tests = abtests.map(t => ({ id: t.id, name: t.name, variables: t.variables || [{ name: t.name, projectId: t.projectId }], matchup: t.matchup, sides: t.sides, status: t.status, lift: t.lift, sig: t.sig, updated: updatedMap[t.id] || 'recently' }))
function open(id) { window.location.hash = '/cl-abtest/' + id }
function viewVariable(projectId) { window.location.hash = '/cl-project/' + projectId }
const linkFor = (t, label) => matchupLink(t, label)
function goVar(t, label) { const id = matchupLink(t, label); if (id) viewVariable(id) }
</script>
