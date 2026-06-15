<template>
  <div
    class="relative transition-all"
    :class="[wrapClass, clickable ? 'cursor-pointer' : '']"
    @click="onClick"
  >
    <!-- Numbered pin (suggestion) -->
    <span
      v-if="state === 'pin'"
      class="absolute -top-3 -left-3 z-20 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md"
      :class="active ? 'bg-(--cl-accent-600) ring-2 ring-white' : 'bg-(--cl-accent-500)'"
    >{{ rs.index }}</span>

    <!-- Numbered pin on an applied recommendation (selectable) — number, or a check once picked -->
    <span
      v-if="state === 'applied' && pinSelect"
      class="absolute -top-3 -left-3 z-20 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shadow-md transition-colors"
      :class="active ? 'bg-(--cl-accent-600) text-white ring-2 ring-white' : 'bg-white text-(--cl-accent-600) ring-2 ring-(--cl-accent-400)'"
    >
      <Check v-if="active" :size="14" />
      <template v-else>{{ rs.pinNo }}</template>
    </span>

    <!-- Corner tag -->
    <span v-if="showSuggestTag" class="absolute -top-2.5 right-3 z-20"><Tag variant="green-light" size="sm">AI suggests</Tag></span>

    <!-- Inline toolbar for non-text (image) elements: position stepper (only when repositionable) + hide.
         Text elements are edited via the external popover in CLComposeStep. -->
    <div v-if="showHide && !styleable" class="absolute -top-3 right-3 z-30 flex items-center gap-0.5 bg-white rounded-lg shadow-md border border-om-gray-200 px-1 py-1">
      <template v-if="posCount > 1">
        <button @click.stop="step(-1)" :disabled="curIdx <= 0"
          class="w-5 h-5 rounded flex items-center justify-center text-om-gray-500 hover:bg-om-gray-100 disabled:opacity-30 disabled:cursor-default cursor-pointer"><ChevronLeft :size="14" /></button>
        <span class="text-[11px] font-semibold text-om-gray-700 px-1 whitespace-nowrap">Position {{ curIdx + 1 }}</span>
        <button @click.stop="step(1)" :disabled="curIdx >= posCount - 1"
          class="w-5 h-5 rounded flex items-center justify-center text-om-gray-500 hover:bg-om-gray-100 disabled:opacity-30 disabled:cursor-default cursor-pointer"><ChevronRight :size="14" /></button>
        <span class="w-px h-4 bg-om-gray-200 mx-0.5"></span>
      </template>
      <button @click.stop="$emit('hide')" title="Hide" class="w-6 h-5 rounded flex items-center justify-center text-om-gray-500 hover:bg-om-gray-100 cursor-pointer"><EyeOff :size="13" /></button>
    </div>
    <span v-if="state === 'zone' && !rs.content" class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-om-gray-400 bg-white/80 rounded-full px-2.5 py-1">
        <Plus :size="13" />{{ rs.label }}
      </span>
    </span>

    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Plus, EyeOff, ChevronLeft, ChevronRight, Check } from 'lucide-vue-next'
import Tag from '../../components/shared/Tag.vue'

const props = defineProps({
  rs: { type: Object, default: () => ({ state: 'none' }) },
  active: { type: Boolean, default: false },
  previewMode: { type: String, default: 'variant' },
  hideable: { type: Boolean, default: false }, // applied regions become selectable + show an inline Hide
  styleable: { type: Boolean, default: false }, // text regions are edited via the external popover (no corner toolbar)
  selectable: { type: Boolean, default: false }, // applied regions become clickable to select (no toolbar) — recommendation screen
  pinSelect: { type: Boolean, default: false }, // applied regions show a numbered pin (→ check when picked) — recommendation screen
  frameless: { type: Boolean, default: false }, // preview: render content inline, no ring/overlay, not interactive
})
const emit = defineEmits(['click', 'hide', 'position'])

// Stop propagation only when this region is interactive, so clicks on real
// elements select them while clicks on empty page area can deselect.
function onClick(e) {
  if (!clickable.value) return
  e.stopPropagation()
  emit('click')
}

const state = computed(() => {
  // In control preview, applied regions render as their original (no overlay).
  if (props.rs.state === 'applied' && props.previewMode === 'control') return 'none'
  return props.rs.state || 'none'
})
const clickable = computed(() =>
  !props.frameless && (state.value === 'pin' || state.value === 'zone' || (state.value === 'applied' && (props.hideable || props.selectable)))
)
const showHide = computed(() => state.value === 'applied' && props.hideable && props.active && !props.frameless)

// Position stepper
const posCount = computed(() => (props.rs.positions || []).length)
const curIdx = computed(() => {
  const i = (props.rs.positions || []).indexOf(props.rs.location)
  return i < 0 ? 0 : i
})
function step(d) {
  const next = (props.rs.positions || [])[curIdx.value + d]
  if (next) emit('position', next)
}
const showSuggestTag = computed(() => state.value === 'zone' && props.rs.suggested && !props.rs.content)

const wrapClass = computed(() => {
  switch (state.value) {
    case 'pin':
      return props.active
        ? 'rounded-xl ring-2 ring-(--cl-accent-500) bg-(--cl-accent-50)'
        : 'rounded-xl ring-2 ring-(--cl-accent-300) hover:ring-(--cl-accent-500)'
    case 'zone':
      return props.active
        ? 'rounded-xl border-2 border-dashed border-(--cl-accent-500) bg-(--cl-accent-50) min-h-[56px]'
        : 'rounded-xl border-2 border-dashed border-om-gray-300 hover:border-(--cl-accent-400) min-h-[56px]'
    case 'applied':
      if (props.frameless) return ''
      if (props.active) return 'rounded-xl ring-2 ring-(--cl-accent-500) bg-(--cl-accent-50)'
      // Pin-select (recommend screen): neutral ring so only the picked one stands out.
      if (props.pinSelect) return 'rounded-xl ring-1 ring-om-gray-200 hover:ring-(--cl-accent-300)'
      return 'rounded-xl ring-2 ring-[#2CC896]'
    default:
      return ''
  }
})
</script>
