<template>
  <div class="h-screen flex bg-om-gray-50">
    <ClSidebar active="projects" @navigate="$emit('navigate', $event)" />

    <!-- Main -->
    <main class="flex-1 min-w-0 flex flex-col">
      <!-- Top bar -->
      <div class="h-14 shrink-0 border-b border-om-gray-200 bg-white flex items-center justify-between px-6">
        <h1 class="text-base font-semibold text-om-gray-800">Variables</h1>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div>
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-om-gray-500">{{ projects.length }} variables · one generated change per product-page set</p>
            <Button variant="primary" size="sm"><template #icon><Plus :size="15" /></template>New variable</Button>
          </div>
          <div class="rounded-xl border border-om-gray-200 bg-white overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-om-gray-100 text-left text-xs font-medium text-om-gray-400 uppercase tracking-wide">
                  <th class="px-4 py-3 font-medium">Variable</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="px-4 py-3 font-medium">A/B test</th>
                  <th class="px-4 py-3 font-medium text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in projects" :key="p.id" @click="open(p.id)" class="border-b border-om-gray-50 last:border-0 hover:bg-om-gray-50 cursor-pointer">
                  <td class="px-4 py-3">
                    <div class="font-medium text-om-gray-800">{{ p.name }}</div>
                    <div class="text-xs text-om-gray-500">{{ p.element }} · {{ p.images }} images</div>
                  </td>
                  <td class="px-4 py-3">
                    <Tag :variant="statusTag(p.status)">{{ p.status }}</Tag>
                    <div v-if="p.status === 'Generating'" class="mt-1.5 flex items-center gap-2">
                      <div class="w-24 h-1 rounded-full bg-om-gray-100 overflow-hidden">
                        <div class="h-full rounded-full bg-(--cl-accent-500)" :style="{ width: Math.round((p.done / p.images) * 100) + '%' }"></div>
                      </div>
                      <span class="text-xs text-om-gray-400">{{ p.done }}/{{ p.images }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span v-if="!p.test" class="text-xs text-om-gray-300">Not tested</span>
                    <span v-else class="text-xs font-medium text-[#0284C7] flex items-center gap-1">
                      <FlaskConical :size="12" />{{ testLabel(p.test) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right text-om-gray-400 text-xs">{{ p.updated }}</td>
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
import { FlaskConical, Plus } from 'lucide-vue-next'
import './conversionlift.css'
import ClSidebar from './components/ClSidebar.vue'
import Tag from '../components/shared/Tag.vue'
import Button from '../components/shared/Button.vue'
import { projects } from './data/projects.js'

defineEmits(['navigate'])

// Each project gets its own route: #/cl-project/<id>
function open(id) { window.location.hash = '/cl-project/' + id }

function testLabel(t) {
  return t.status === 'Running' ? 'Running' : `Won · ${t.lift} lift`
}
function statusTag(status) {
  return { Live: 'green', Testing: 'green', Generating: 'orange', Review: 'orange', Draft: 'gray' }[status] || 'gray'
}
</script>
