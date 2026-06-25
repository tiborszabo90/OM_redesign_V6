<template>
  <Modal :model-value="modelValue" size="lg" @update:model-value="$emit('update:modelValue', $event)">
    <!-- ───────── List screen: pick a rule ───────── -->
    <div v-if="view === 'list'" class="pb-2">
      <h2 class="text-lg font-semibold text-om-gray-700 text-center mb-6">Who to Show</h2>

      <div class="space-y-8">
        <div v-for="group in ruleGroups" :key="group.label">
          <!-- Section header with trailing divider -->
          <div class="flex items-center gap-4 mb-3">
            <span class="text-base text-om-gray-500 shrink-0">{{ group.label }}</span>
            <div class="flex-1 h-px bg-om-gray-200"></div>
          </div>

          <!-- Rules -->
          <div
            v-for="rule in group.rules"
            :key="rule.title"
            class="flex items-center gap-4 py-2.5"
          >
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              :style="{ backgroundColor: group.color }"
            >
              <component :is="rule.icon" :size="26" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-base font-semibold text-om-gray-700">{{ rule.title }}</div>
              <div class="text-sm text-om-gray-500 mt-0.5">{{ rule.description }}</div>
            </div>
            <Button variant="secondary" size="md" class="shrink-0 w-24" @click="openRule(rule)">
              {{ rule.action }}
            </Button>
          </div>
        </div>
      </div>

      <div class="flex justify-center pt-8">
        <Button variant="secondary" size="md" @click="$emit('update:modelValue', false)">Cancel</Button>
      </div>
    </div>

    <!-- ───────── Detail screen: Country rule ───────── -->
    <div v-else-if="view === 'country'" class="pb-2">
      <h2 class="text-lg font-semibold text-om-gray-700 text-center">Country</h2>
      <p class="text-sm text-om-gray-500 text-center mt-1">You can select from which specific countries your users will see your message</p>
      <div class="h-px bg-om-gray-200 mt-4 mb-6"></div>

      <div class="space-y-4">
        <div
          v-for="block in countryBlocks"
          :key="block.key"
          class="border border-om-gray-200 rounded-xl p-5"
        >
          <div class="text-base font-semibold text-om-gray-700">{{ block.title }}</div>
          <div class="text-sm text-om-gray-500 mt-1">{{ block.desc }}</div>

          <!-- Selected locations -->
          <div v-if="selections[block.key].length" class="flex flex-wrap gap-2 mt-3">
            <Tag v-for="value in selections[block.key]" :key="value" variant="gray-muted">
              {{ labelFor(value) }}
              <button class="ml-0.5 hover:text-om-gray-700" @click="removeLocation(block.key, value)">
                <X :size="12" />
              </button>
            </Tag>
          </div>

          <!-- Location picker -->
          <div v-if="pickerOpen[block.key]" class="mt-3 max-w-xs">
            <MultiSelect
              :model-value="selections[block.key]"
              :options="locationOptions"
              placeholder="Search countries, states, cities"
              size="sm"
              @update:model-value="selections[block.key] = $event"
            />
          </div>
          <button
            v-else
            class="flex items-center gap-1.5 text-sm font-medium text-om-orange-500 hover:text-om-orange-600 mt-3"
            @click="pickerOpen[block.key] = true"
          >
            <PlusCircle :size="16" />
            Add locations
          </button>
        </div>
      </div>

      <div class="flex items-center justify-center gap-3 pt-8">
        <Button variant="ghost" size="md" @click="backToList">Cancel</Button>
        <Button variant="primary" size="md" :disabled="!hasCountrySelection" @click="saveCountry">Save</Button>
      </div>

      <!-- How it works -->
      <div class="bg-om-gray-50 rounded-lg p-3 mt-6 flex items-start justify-between gap-4">
        <div class="flex items-start gap-2">
          <GraduationCap :size="16" class="shrink-0 mt-0.5 text-om-gray-400" />
          <p class="text-xs text-om-gray-500 leading-relaxed">
            Use this rule when you want to display the campaign only to visitors from specific countries, states, or cities of your choice.
          </p>
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <a href="#" class="flex items-center gap-1.5 text-xs font-medium text-om-gray-600 hover:text-om-gray-700">
            <BookOpen :size="14" /> Read more
          </a>
          <a href="#" class="flex items-center gap-1.5 text-xs font-medium text-om-gray-600 hover:text-om-gray-700">
            <PlayCircle :size="14" /> Watch a video
          </a>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
  Clock, Timer, Megaphone,
  UserCheck, Home, Globe, Contact, Ban, ShieldAlert, Network,
  Link2, Search, FileX, Files, ShoppingCart, Cookie,
  X, PlusCircle, GraduationCap, BookOpen, PlayCircle,
} from 'lucide-vue-next'
import Modal from './Modal.vue'
import Button from './Button.vue'
import Tag from './Tag.vue'
import MultiSelect from './MultiSelect.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'select'])

const view = ref('list') // 'list' | 'country'

// Reset to the list whenever the modal is reopened
watch(() => props.modelValue, (open) => {
  if (open) view.value = 'list'
})

const openRule = (rule) => {
  if (rule.title === 'Country') {
    view.value = 'country'
    return
  }
  // All other rules add immediately and close the modal
  emit('select', { icon: rule.icon, title: rule.title, description: rule.description })
  emit('update:modelValue', false)
}

const backToList = () => {
  view.value = 'list'
}

// ── Country detail state ──
const countryBlocks = [
  { key: 'include', title: 'Include', desc: 'Show this campaign only to visitors from these locations.' },
  { key: 'exclude', title: 'Exclude', desc: "Don't show this campaign to visitors from these locations." },
]

const selections = reactive({ include: [], exclude: [] })
const pickerOpen = reactive({ include: false, exclude: false })

const locationOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'hu', label: 'Hungary' },
  { value: 'au', label: 'Australia' },
  { value: 'state-ca', label: 'California (State)' },
  { value: 'state-tx', label: 'Texas (State)' },
  { value: 'state-ny', label: 'New York (State)' },
  { value: 'city-nyc', label: 'New York City (City)' },
  { value: 'city-london', label: 'London (City)' },
  { value: 'city-budapest', label: 'Budapest (City)' },
  { value: 'city-berlin', label: 'Berlin (City)' },
]

const labelFor = (value) => locationOptions.find((o) => o.value === value)?.label ?? value

const removeLocation = (key, value) => {
  selections[key] = selections[key].filter((v) => v !== value)
}

const hasCountrySelection = computed(() => selections.include.length > 0 || selections.exclude.length > 0)

const saveCountry = () => {
  const parts = []
  if (selections.include.length) parts.push(`Include: ${selections.include.map(labelFor).join(', ')}`)
  if (selections.exclude.length) parts.push(`Exclude: ${selections.exclude.map(labelFor).join(', ')}`)
  emit('select', { icon: Globe, title: 'Country', description: parts.join(' · ') })
  selections.include = []
  selections.exclude = []
  pickerOpen.include = false
  pickerOpen.exclude = false
  view.value = 'list'
  emit('update:modelValue', false)
}

const ruleGroups = [
  {
    label: 'Time & Context',
    color: '#E0954A',
    rules: [
      { icon: Clock, title: 'Spent on pages', action: 'Add', description: "Visitors who have spent at least 'X' seconds on the current subpage will see your message" },
      { icon: Timer, title: 'Spent on site', action: 'Add', description: "Visitors who have spent at least 'X' seconds on the entire website will see your message" },
      { icon: Megaphone, title: 'Engaged with OptiMonk campaigns', action: 'Add', description: 'Visitors who have seen or filled in specific OptiMonk campaigns will see your message' },
    ],
  },
  {
    label: 'Visitors',
    color: '#C77B7B',
    rules: [
      { icon: UserCheck, title: 'Returning / New', action: 'Edit', description: 'Only new or only returning visitors will see your message' },
      { icon: Home, title: 'Source', action: 'Add', description: 'Visitors coming from a specific traffic source will see your message' },
      { icon: Globe, title: 'Country', action: 'Add', description: 'You can select from which specific countries your users will see your message' },
      { icon: Contact, title: 'Subscribers / Non-subscribers', action: 'Add', description: 'Include or exclude visitors who have already subscribed through OptiMonk' },
      { icon: Ban, title: 'Block IP addresses', action: 'Add', description: 'Visitors with the following IP addresses will not see your message' },
      { icon: ShieldAlert, title: 'AdBlock detection', action: 'Add', description: 'Visitors who use AdBlock will see your message' },
      { icon: Network, title: 'Other visitor attributes', action: 'Add', description: 'Target visitors based on attributes like OS type, timezone, browser language, or other first-party attributes.' },
    ],
  },
  {
    label: 'Pages & Custom Rules',
    color: '#6FAC8C',
    rules: [
      { icon: Link2, title: 'Current page / URL', action: 'Add', description: 'Visitors who are (or not) currently browsing a specific page will see your message' },
      { icon: Search, title: 'Visited URL', action: 'Add', description: 'Visitors who have visited any specific pages of your site will see your message' },
      { icon: FileX, title: 'Exclude page visitors', action: 'Add', description: 'Exclude visitors who already visited a specific page' },
      { icon: Files, title: 'Number of visited pages', action: 'Add', description: "Visitors who opened 'X' number of pages will see your message" },
      { icon: ShoppingCart, title: 'Cart rules', action: 'Add', description: 'Visitors with specific cart content will see your message' },
      { icon: Cookie, title: 'Cookie segmentation', action: 'Add', description: 'Segment your audience based on any cookie you want' },
    ],
  },
]
</script>
