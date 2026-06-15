<template>
  <div :class="['bg-white rounded-2xl shadow-[0_16px_40px_rgba(17,18,19,0.22)] border border-om-gray-200 p-2', device === 'mobile' ? 'w-full overflow-x-auto' : (isText ? 'w-max' : 'w-fit')]" @click.stop>
    <!-- single-row toolbar, sized to its content so a control never orphans onto a second row -->
    <div class="flex flex-nowrap items-center gap-x-0.5 px-0.5">
      <!-- text-only formatting controls -->
      <template v-if="isText">
        <!-- font family -->
        <div class="w-28 shrink-0">
          <Dropdown :model-value="value.font" :options="fonts" size="sm" @update:model-value="v => emit('update', { font: v })" />
        </div>

        <!-- size -->
        <div class="flex items-center gap-1 pl-1">
          <span class="text-sm font-medium tabular-nums w-5 text-center text-om-gray-700">{{ value.size }}</span>
          <div class="flex flex-col -my-0.5">
            <button class="tb-step" @click="emit('update', { size: value.size + 1 })"><ChevronUp :size="12" /></button>
            <button class="tb-step" @click="emit('update', { size: Math.max(8, value.size - 1) })"><ChevronDown :size="12" /></button>
          </div>
        </div>
        <span class="tb-div"></span>

        <!-- bold -->
        <button class="tb-btn" :class="value.bold ? 'tb-on' : ''" @click="emit('update', { bold: !value.bold })"><Bold :size="15" /></button>

        <!-- align -->
        <button class="tb-btn" :class="value.align === 'left' ? 'tb-on' : ''" @click="emit('update', { align: 'left' })"><AlignLeft :size="15" /></button>
        <button class="tb-btn" :class="value.align === 'center' ? 'tb-on' : ''" @click="emit('update', { align: 'center' })"><AlignCenter :size="15" /></button>
        <button class="tb-btn" :class="value.align === 'right' ? 'tb-on' : ''" @click="emit('update', { align: 'right' })"><AlignRight :size="15" /></button>

        <!-- list -->
        <button class="tb-btn"><List :size="15" /></button>
        <!-- link -->
        <button class="tb-btn"><Link :size="15" /></button>

        <!-- text colour -->
        <div class="relative">
          <button class="tb-btn flex-col gap-0! leading-none" @click="colorOpen = !colorOpen">
            <span class="text-[13px] font-semibold text-om-gray-700">A</span>
            <span class="block w-3.5 h-0.75 rounded-full" :style="{ background: value.color || '#E11D48' }"></span>
          </button>
          <div v-if="colorOpen" class="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-lg border border-om-gray-200 p-1.5 grid grid-cols-5 gap-1">
            <button v-for="c in palette" :key="c" class="w-4 h-4 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform"
              :style="{ background: c }" @click="emit('update', { color: c }); colorOpen = false"></button>
          </div>
        </div>

        <!-- highlight -->
        <button class="tb-btn"><Highlighter :size="15" /></button>
        <!-- background / transparency -->
        <button class="tb-btn"><span class="w-3.5 h-3.5 rounded-sm border border-om-gray-300 tb-checker"></span></button>

        <span class="tb-div"></span>
      </template>

      <!-- position stepper (only when repositionable) — kept together so the arrows never wrap off the label -->
      <div v-if="posCount > 1" class="inline-flex items-center gap-0.5 shrink-0">
        <button class="tb-btn" :disabled="curIdx <= 0" @click="emit('step', -1)"><ChevronLeft :size="15" /></button>
        <span class="text-[11px] font-semibold text-om-gray-700 px-0.5 whitespace-nowrap">Position {{ curIdx + 1 }}/{{ posCount }}</span>
        <button class="tb-btn" :disabled="curIdx >= posCount - 1" @click="emit('step', 1)"><ChevronRight :size="15" /></button>
      </div>

      <!-- hide -->
      <button v-if="canHide" class="tb-btn" title="Hide" @click="emit('hide')"><EyeOff :size="15" /></button>
      <button class="tb-btn"><MoreVertical :size="15" /></button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChevronUp, ChevronDown, Bold, AlignLeft, AlignCenter, AlignRight,
  List, Link, Highlighter, MoreVertical, EyeOff, ChevronLeft, ChevronRight,
} from 'lucide-vue-next'
import Dropdown from '../../components/shared/Dropdown.vue'

defineProps({
  value: { type: Object, default: () => ({ font: 'Inter', size: 14, bold: false, align: 'left', color: '' }) },
  posCount: { type: Number, default: 1 },
  curIdx: { type: Number, default: 0 },
  isText: { type: Boolean, default: true }, // image elements hide the text-formatting controls
  canHide: { type: Boolean, default: true }, // single-element mode hides the Hide button
  device: { type: String, default: 'desktop' }, // mobile: cap width + scroll so it fits the phone frame
})
const emit = defineEmits(['update', 'hide', 'step'])

const fonts = ['Inter', 'Roboto', 'Georgia', 'Arial', 'Poppins']
const palette = ['#1c1c1c', '#E11D48', '#0EA5E9', '#15803D', '#F59E0B', '#7C3AED', '#DB2777', '#0F766E', '#B45309', '#475569']
const colorOpen = ref(false)
</script>

<style scoped>
.tb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.125rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  color: #52525b;
  cursor: pointer;
}
.tb-btn:hover { background: #f4f4f5; }
.tb-btn:disabled { opacity: 0.3; cursor: default; }
.tb-btn:disabled:hover { background: transparent; }
.tb-on { background: #E0F2FE; color: #0284C7; }
.tb-div { width: 1px; height: 1.1rem; background: #e4e4e7; margin: 0 0.15rem; flex: none; }
.tb-step {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.7rem;
  color: #a1a1aa;
  cursor: pointer;
}
.tb-step:hover { color: #3f3f46; }
.tb-checker {
  background-image:
    linear-gradient(45deg, #d4d4d8 25%, transparent 25%),
    linear-gradient(-45deg, #d4d4d8 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d4d4d8 75%),
    linear-gradient(-45deg, transparent 75%, #d4d4d8 75%);
  background-size: 6px 6px;
  background-position: 0 0, 0 3px, 3px -3px, -3px 0;
}
</style>
