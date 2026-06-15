<template>
  <div class="h-full overflow-y-auto bg-om-gray-50">
    <div class="max-w-2xl mx-auto px-6 py-10">
      <h2 class="text-2xl font-bold text-om-gray-800">Who should see this experiment?</h2>
      <p class="text-sm text-om-gray-500 mt-1.5">Combine conditions inside a group, then combine groups with AND / OR. No conditions = everyone is entered.</p>

      <div class="mt-6">
        <template v-for="(group, gi) in groups" :key="group.id">
          <!-- Connector between groups -->
          <div v-if="gi > 0" class="flex items-center gap-2 my-2 pl-1">
            <button @click="outerMatch = outerMatch === 'all' ? 'any' : 'all'"
              class="px-3 h-7 rounded-full border border-(--cl-accent-300) bg-(--cl-accent-50) text-xs font-bold text-[#0369A1] cursor-pointer">
              {{ outerMatch === 'all' ? 'AND' : 'OR' }}
            </button>
            <span class="text-xs text-om-gray-400">{{ outerMatch === 'all' ? 'must also match the next group' : 'or matches the next group instead' }}</span>
          </div>

          <!-- Group card -->
          <div class="rounded-2xl border border-om-gray-200 bg-white p-4">
            <div class="flex items-center gap-2 mb-3 text-sm text-om-gray-600">
              Match
              <div class="inline-flex rounded-lg border border-om-gray-200 bg-om-gray-100 p-0.5">
                <button v-for="m in ['all', 'any']" :key="m" @click="group.match = m"
                  class="px-2.5 h-7 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  :class="group.match === m ? 'bg-white text-om-gray-800 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700'">{{ m === 'all' ? 'ALL' : 'ANY' }}</button>
              </div>
              of these conditions
              <button v-if="groups.length > 1" class="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-om-gray-400 hover:bg-om-gray-100 hover:text-om-gray-600 cursor-pointer" @click="removeGroup(group.id)"><Trash2 :size="15" /></button>
            </div>

            <div class="space-y-2">
              <div v-for="row in group.rows" :key="row.id" class="flex items-center gap-2">
                <div class="w-40 shrink-0"><Dropdown :model-value="row.attrLabel" :options="attrLabels" size="sm" @update:model-value="v => setAttr(row, v)" /></div>
                <div class="w-36 shrink-0"><Dropdown :model-value="row.op" :options="opsFor(row)" size="sm" @update:model-value="v => row.op = v" /></div>
                <div v-if="kind(row) === 'enum'" class="flex-1 min-w-0"><Dropdown :model-value="row.value" :options="valuesFor(row)" placeholder="Select…" size="sm" @update:model-value="v => row.value = v" /></div>
                <input v-else v-model="row.value" :type="kind(row) === 'number' ? 'number' : 'text'" :placeholder="kind(row) === 'number' ? '0' : 'value'" class="cl-inp flex-1 min-w-0" />
                <button class="w-7 h-7 rounded-lg flex items-center justify-center text-om-gray-400 hover:bg-om-gray-100 hover:text-om-gray-600 cursor-pointer shrink-0" @click="removeRow(group, row.id)"><X :size="15" /></button>
              </div>
            </div>

            <button class="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-(--cl-accent-600) hover:text-(--cl-accent-700) cursor-pointer" @click="addRow(group)">
              <Plus :size="15" />Add condition
            </button>
          </div>
        </template>

        <button class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-(--cl-accent-600) hover:text-(--cl-accent-700) cursor-pointer" @click="addGroup">
          <Plus :size="16" />Add group
        </button>
      </div>

      <div class="mt-5 rounded-xl bg-white border border-om-gray-200 px-4 py-3.5 flex items-center gap-2.5">
        <Users :size="18" class="text-(--cl-accent-600) shrink-0" />
        <span class="text-sm text-om-gray-600">
          <template v-if="reachPct >= 100">All visitors are entered into the experiment.</template>
          <template v-else>Reaches an estimated <b class="text-om-gray-800">{{ reachPct }}%</b> of your visitors.</template>
        </span>
      </div>
    </div>

    <Teleport defer to="#cl-topbar-end">
      <Button size="sm" variant="primary" @click="$emit('next', payload)">Next</Button>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Users, Plus, X, Trash2 } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import Dropdown from '../../components/shared/Dropdown.vue'

defineEmits(['next'])

const OPS = {
  enum: ['is', 'is not'],
  text: ['contains', 'does not contain', 'starts with'],
  number: ['is more than', 'is less than', 'equals'],
}
const ATTRS = [
  { label: 'Visitor type', kind: 'enum', values: ['New', 'Returning'], factor: 0.55 },
  { label: 'Device', kind: 'enum', values: ['Mobile', 'Desktop', 'Tablet'], factor: 0.5 },
  { label: 'Country', kind: 'enum', values: ['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia'], factor: 0.28 },
  { label: 'Traffic source', kind: 'enum', values: ['Paid', 'Organic', 'Direct', 'Social', 'Email'], factor: 0.32 },
  { label: 'Browser', kind: 'enum', values: ['Chrome', 'Safari', 'Firefox', 'Edge'], factor: 0.55 },
  { label: 'Landing page URL', kind: 'text', factor: 0.4 },
  { label: 'Cart value ($)', kind: 'number', factor: 0.45 },
  { label: 'Past sessions', kind: 'number', factor: 0.5 },
  { label: 'Days since last visit', kind: 'number', factor: 0.5 },
]
const attrLabels = ATTRS.map(a => a.label)
const attrDef = (row) => ATTRS.find(a => a.label === row.attrLabel) || ATTRS[0]
const kind = (row) => attrDef(row).kind
const opsFor = (row) => OPS[kind(row)]
const valuesFor = (row) => attrDef(row).values

let rid = 0
const makeRow = () => ({ id: rid++, attrLabel: 'Visitor type', op: 'is', value: '' })
let gid = 0
const makeGroup = () => ({ id: gid++, match: 'all', rows: [makeRow()] })

const outerMatch = ref('any') // how groups combine: any (OR) / all (AND)
const groups = ref([makeGroup()])

function addGroup() { groups.value = [...groups.value, makeGroup()] }
function removeGroup(id) { groups.value = groups.value.filter(g => g.id !== id) }
function addRow(group) { group.rows = [...group.rows, makeRow()] }
function removeRow(group, id) { group.rows = group.rows.filter(r => r.id !== id) }
function setAttr(row, label) {
  row.attrLabel = label
  row.op = OPS[attrDef(row).kind][0]
  row.value = ''
}

const activeRows = (group) => group.rows.filter(r => String(r.value).trim() !== '')
function groupReach(group) {
  const active = activeRows(group)
  if (!active.length) return 1
  const f = active.map(r => attrDef(r).factor)
  return group.match === 'all' ? f.reduce((a, x) => a * x, 1) : 1 - f.reduce((a, x) => a * (1 - x), 1)
}
const reach = computed(() => {
  const live = groups.value.filter(g => activeRows(g).length)
  if (!live.length) return 1
  const gr = live.map(groupReach)
  return outerMatch.value === 'all' ? gr.reduce((a, x) => a * x, 1) : 1 - gr.reduce((a, x) => a * (1 - x), 1)
})
const reachPct = computed(() => Math.min(100, Math.max(1, Math.round(reach.value * 100))))
const payload = computed(() => ({
  combine: outerMatch.value,
  groups: groups.value
    .filter(g => activeRows(g).length)
    .map(g => ({ match: g.match, conditions: activeRows(g).map(r => ({ attribute: r.attrLabel, op: r.op, value: r.value })) })),
  reachPct: reachPct.value,
}))
</script>

<style scoped>
.cl-inp { height: 2rem; border: 1px solid #e4e4e7; border-radius: 0.5rem; padding: 0 0.6rem; font-size: 0.875rem; color: #3f3f46; background: #fff; }
.cl-inp:focus { outline: none; border-color: var(--cl-accent-400); }
</style>
