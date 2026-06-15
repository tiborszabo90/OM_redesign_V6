<template>
  <div class="h-full overflow-y-auto bg-om-gray-50">
    <div class="max-w-4xl mx-auto px-6 py-6 pb-28">
      <Button variant="ghost" size="sm" @click="$emit('back')">
        <template #icon><ArrowLeft :size="15" /></template>Back
      </Button>
      <h2 class="text-xl font-semibold text-om-gray-800 mt-2">{{ multi ? 'Pick enhancements to add' : 'Pick an enhancement to add' }}</h2>
      <p class="text-sm text-om-gray-500 mt-0.5">{{ multi ? 'Choose one or more, with a style version for each. The AI fills them with your product\'s details.' : 'Choose one, then a style version. The AI fills it with your product\'s details.' }}</p>

      <!-- Single-version enhancements: one row, clearly separated by dividers -->
      <div class="mt-7 flex divide-x divide-om-gray-200">
        <div v-for="enh in singles" :key="enh.key" class="flex-1 px-5 first:pl-0 last:pr-0">
          <div class="flex items-center gap-2 mb-2.5">
            <h3 class="text-sm font-semibold text-om-gray-800">{{ enh.name }}</h3>
            <Tag variant="outlined" size="sm">{{ enh.content_type }}</Tag>
          </div>
          <ClLibraryCard :enh="enh" :version="enh.versions[0]" :selected="isSel(enh, enh.versions[0])" @select="pick(enh, enh.versions[0])" />
        </div>
      </div>

      <!-- Multi-version enhancements: own section with a grid of style versions -->
      <section v-for="enh in multis" :key="enh.key" class="mt-8">
        <div class="flex items-center gap-2 mb-2.5">
          <h3 class="text-sm font-semibold text-om-gray-800">{{ enh.name }}</h3>
          <Tag variant="outlined" size="sm">{{ enh.content_type }}</Tag>
          <span class="text-xs text-om-gray-400">· {{ enh.description }}</span>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <ClLibraryCard v-for="v in enh.versions" :key="v.id" :enh="enh" :version="v" :selected="isSel(enh, v)" @select="pick(enh, v)" />
        </div>
      </section>
    </div>

    <!-- Sticky footer -->
    <div class="sticky bottom-0 inset-x-0 bg-white/90 backdrop-blur border-t border-om-gray-200 px-6 py-3">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <span class="text-sm text-om-gray-500">
          <template v-if="multi">{{ selectedCount ? `${selectedCount} selected` : 'Select one or more enhancements to continue' }}</template>
          <template v-else-if="selectedVersion"><b class="text-om-gray-700">{{ selectedEnh.name }}</b> · {{ selectedVersion.label }}</template>
          <template v-else>Select an enhancement to continue</template>
        </span>
        <Button :disabled="multi ? selectedCount === 0 : !selectedVersion" @click="proceed">
          Continue<template #icon><ArrowRight :size="15" /></template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import Tag from '../../components/shared/Tag.vue'
import ClLibraryCard from './ClLibraryCard.vue'
import { blockLibrary as enhancements } from '../data/blockLibrary.js'

const props = defineProps({
  multi: { type: Boolean, default: false }, // Flow E: pick several enhancements (one version each)
})
const emit = defineEmits(['select', 'back'])

// Single-version enhancements share one row; multi-version ones get their own section.
const singles = computed(() => enhancements.filter(e => e.versions.length === 1))
const multis = computed(() => enhancements.filter(e => e.versions.length > 1))

// single-select state (Flow B)
const selectedId = ref(null)
const selectedEnh = ref(null)
const selectedVersion = ref(null)
// multi-select state (Flow E): enhancement key -> { enh, v }
const picks = ref({})
const selectedCount = computed(() => Object.keys(picks.value).length)

function isSel(enh, v) {
  return props.multi ? picks.value[enh.key]?.v.id === v.id : selectedId.value === v.id
}

function pick(enh, v) {
  if (props.multi) {
    const next = { ...picks.value }
    if (next[enh.key]?.v.id === v.id) delete next[enh.key] // toggle off
    else next[enh.key] = { enh, v }                        // one version per enhancement
    picks.value = next
    return
  }
  selectedEnh.value = enh
  selectedVersion.value = v
  selectedId.value = v.id
}

function payload(enh, v) {
  return { location: enh.location, content_type: enh.content_type, content: v.content }
}
function proceed() {
  if (props.multi) {
    emit('select', Object.values(picks.value).map(({ enh, v }) => payload(enh, v)))
    return
  }
  emit('select', payload(selectedEnh.value, selectedVersion.value))
}
</script>
