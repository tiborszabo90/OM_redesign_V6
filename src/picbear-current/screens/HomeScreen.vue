<script setup>
import { ref } from 'vue'
import {
  PawPrint, MoreHorizontal, ChevronRight, ChevronDown, Check,
  Mail, MessageSquare, BookOpen,
} from 'lucide-vue-next'

// picbear-current mirrors the currently-live product home page:
// a static reproduction of app._index.tsx (Quick setup guide, KPI dashboard,
// Need help). Demo state matches the live "4 / 5 completed" snapshot.
const totalSteps = 5

const steps = [
  { done: true, title: 'Choose your image upgrade style', description: 'Pick from 3 AI-powered styles: Lifestyle, Badge, or Value Props.' },
  { done: true, title: 'Select products to upgrade', description: 'Choose which products get AI-enhanced images.' },
  { done: true, title: 'Preview your first upgrade', description: 'See a before/after comparison before generating all images.' },
  { done: true, title: 'Generate all images', description: 'AI creates upgraded images for all selected products.' },
  { done: false, title: 'Go live — confirm on your storefront', description: 'Activate the app embed and publish your upgraded images.' },
]

const completedSteps = steps.filter(s => s.done).length

// Real app opens the first incomplete step; the reference screenshot shows the
// first step expanded, so default to it. One step open at a time.
const openStep = ref(0)
function toggle(i) {
  openStep.value = openStep.value === i ? null : i
}

const kpis = [
  { label: 'Upgraded products', value: '13' },
  { label: 'Visitors', value: '0', info: true },
  { label: 'Assisted orders', value: '0' },
  { label: 'Assisted revenue', value: '$0' },
]

const helpLinks = [
  { icon: Mail, text: 'support@optimonk.com', href: 'mailto:support@optimonk.com' },
  { icon: MessageSquare, text: 'Live chat (coming soon)', muted: true },
  { icon: BookOpen, text: 'AI Product Page Optimizer help docs', href: '#' },
]
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <!-- Page header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-lg bg-[#5548e0] flex items-center justify-center">
          <PawPrint :size="15" class="text-white" />
        </span>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">Welcome to AI Product Page Optimizer!</h1>
      </div>
      <MoreHorizontal :size="16" class="text-[#616161]" />
    </div>

    <!-- Quick setup guide -->
    <div class="rounded-xl border border-[#e3e3e3] bg-[#f6f6f7] p-4 mb-5">
      <div class="flex items-center gap-2 mb-3">
        <span class="font-semibold text-[#1a1a1a]">Quick setup guide</span>
        <span class="text-[13px] text-[#6d7175]">{{ completedSteps }} / {{ totalSteps }} completed</span>
      </div>

      <div class="flex flex-col gap-2">
        <div
          v-for="(s, i) in steps" :key="i"
          class="rounded-lg border border-[#e3e3e3]"
          :class="s.done ? 'bg-[#f1f1f1]' : 'bg-white'"
        >
          <button
            type="button"
            @click="toggle(i)"
            class="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
          >
            <span
              class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[12px] font-semibold"
              :class="s.done ? 'bg-[#008060] text-white' : 'bg-[#e4e5e7] text-[#1a1a1a]'"
            >
              <Check v-if="s.done" :size="14" :stroke-width="2.5" />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <span class="flex-1 font-semibold text-[14px] text-[#1a1a1a]">{{ s.title }}</span>
            <ChevronDown
              :size="16" class="text-[#6d7175] shrink-0 transition-transform"
              :class="{ 'rotate-180': openStep === i }"
            />
          </button>

          <div v-if="openStep === i" class="flex items-start justify-between gap-4 px-4 pb-4 pl-[56px]">
            <p class="flex-1 text-[13px] text-[#4a4a4a]">{{ s.description }}</p>
            <div class="w-[120px] h-[72px] min-w-[120px] rounded-md bg-[#e4e5e7]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance / KPI dashboard -->
    <div class="mb-5">
      <p class="font-semibold text-[#1a1a1a] mb-3">Performance</p>

      <div class="grid grid-cols-4 gap-3 mb-3">
        <div
          v-for="kpi in kpis" :key="kpi.label"
          class="rounded-lg border border-[#e3e3e3] bg-white p-4"
        >
          <p class="text-[11px] font-normal text-[#6d7175] uppercase tracking-[0.5px] mb-1">
            {{ kpi.label }}<span v-if="kpi.info" class="ml-1 cursor-help">(i)</span>
          </p>
          <p class="text-[28px] font-bold leading-none text-[#1a1a1a]">{{ kpi.value }}</p>
        </div>
      </div>

      <!-- Greyed-out dummy chart -->
      <div class="relative rounded-lg border border-[#e3e3e3] bg-[#fafafa] pt-8 px-6 pb-6 overflow-hidden">
        <svg viewBox="0 0 600 160" width="100%" height="160" preserveAspectRatio="none" class="block">
          <line v-for="y in [0, 40, 80, 120, 160]" :key="'h' + y" x1="0" :y1="y" x2="600" :y2="y" stroke="#e4e5e7" stroke-width="1" />
          <line v-for="x in [0, 100, 200, 300, 400, 500, 600]" :key="'v' + x" :x1="x" y1="0" :x2="x" y2="160" stroke="#e4e5e7" stroke-width="1" />
          <path d="M0,140 C50,130 100,120 150,110 C200,100 250,95 300,90 C350,85 400,70 450,65 C500,60 550,50 600,45 L600,160 L0,160 Z" fill="#e4e5e7" opacity="0.4" />
          <path d="M0,140 C50,130 100,120 150,110 C200,100 250,95 300,90 C350,85 400,70 450,65 C500,60 550,50 600,45" fill="none" stroke="#c9cccf" stroke-width="2" />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center text-[14px] font-medium text-[#8c9196]">
          Chart coming soon
        </div>
      </div>
    </div>

    <!-- Need help -->
    <div class="rounded-xl border border-[#e3e3e3] bg-[#f6f6f7] p-4">
      <p class="font-semibold text-[#1a1a1a] mb-3">Need help?</p>
      <div class="flex flex-col gap-3">
        <div v-for="link in helpLinks" :key="link.text" class="flex items-center gap-3">
          <component :is="link.icon" :size="16" class="text-[#4a4a4a] shrink-0" />
          <span v-if="link.muted" class="text-[13px] text-[#6d7175]">{{ link.text }}</span>
          <a v-else :href="link.href" class="text-[13px] text-[#1a1a1a] underline">{{ link.text }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
