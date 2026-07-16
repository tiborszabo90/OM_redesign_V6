<script setup>
import { computed } from 'vue'
import { state, stepsDone, bestseller, styleOptions } from '../store'
import StyledImage from '../components/StyledImage.vue'
import {
  PawPrint, MoreHorizontal, Check, Sparkles, ChevronRight, Clock, FlaskConical,
} from 'lucide-vue-next'

const done = computed(() => stepsDone())

const guideSteps = computed(() => [
  {
    key: 'style',
    title: 'See your product in 4 new looks',
    done: state.steps.style,
  },
  {
    key: 'placement',
    title: 'Choose where the image appears',
    done: state.steps.placement,
  },
  {
    key: 'products',
    title: 'Pick products, top 10 preselected',
    done: state.steps.products,
  },
  {
    key: 'generate',
    title: 'Generate and review your images',
    done: state.steps.generate,
  },
  {
    key: 'live',
    title: 'Turn on Picbear in your theme and go live',
    done: state.steps.live,
  },
])

function startSetup() {
  state.screen = 'style'
}

function resumeAt(key) {
  const target = { style: 'style', placement: 'placement', products: 'products', generate: 'generate', live: 'enable' }[key]
  state.screen = target
}

const nextStepKey = computed(() => guideSteps.value.find(s => !s.done)?.key)
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
        <h1 class="text-lg font-bold text-[#1a1a1a]">Welcome to Picbear!</h1>
      </div>
      <MoreHorizontal :size="16" class="text-[#616161]" />
    </div>

    <!-- Setup complete banner -->
    <div v-if="state.published" class="pb-card p-4 mb-4 flex items-center gap-3 border-[#b7e2cb]! bg-[#f2fbf6]!">
      <span class="w-8 h-8 rounded-full bg-[#36c98e] flex items-center justify-center shrink-0">
        <Check :size="16" class="text-white" />
      </span>
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">Setup complete. 10 AI images are live on your store.</p>
        <p class="text-[12px] text-[#616161]">We started tracking clicks and orders right away.</p>
      </div>
      <button class="pb-btn-secondary" @click="state.appTab = 'abtests'">
        <FlaskConical :size="13" /> Start an A/B test
      </button>
    </div>

    <!-- Setup guide -->
    <div v-else class="pb-card mb-4">
      <div class="px-4 pt-4 pb-3 flex items-center justify-between">
        <div>
          <p class="font-semibold text-[#1a1a1a]">Quick setup guide</p>
          <p class="text-[12px] text-[#616161] flex items-center gap-1 mt-0.5">
            <Clock :size="11" /> Takes about 3 minutes · {{ done }} of 5 completed
          </p>
        </div>
        <div class="w-32 h-1.5 bg-[#ececec] rounded-full overflow-hidden">
          <div class="h-full bg-[#1a1a1a] rounded-full transition-all" :style="{ width: (done / 5) * 100 + '%' }"></div>
        </div>
      </div>

      <div class="border-t border-[#ececec]">
        <div
          v-for="(s, i) in guideSteps" :key="s.key"
          class="px-4 border-b border-[#ececec] last:border-0"
        >
          <div
            class="flex items-center gap-3 py-3 cursor-pointer"
            @click="resumeAt(s.key)"
          >
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold"
              :class="s.done ? 'bg-[#36c98e] text-white' : 'border border-dashed border-[#8a8a8a] text-[#616161]'"
            >
              <Check v-if="s.done" :size="11" />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <span class="font-medium text-[#1a1a1a] flex-1">{{ s.title }}</span>
            <ChevronRight v-if="!s.done" :size="14" class="text-[#8a8a8a]" />
          </div>

          <!-- Expanded first pending step: the hook -->
          <div v-if="s.key === 'style' && nextStepKey === 'style'" class="pb-4 pl-8">
            <div class="rounded-xl bg-[#f6f5ff] border border-[#dedbf7] p-3.5">
              <p class="text-[13px] text-[#3a3468] font-medium flex items-center gap-1.5 mb-2.5">
                <Sparkles :size="13" class="text-[#5548e0]" />
                While you were reading this, we generated 4 preview versions of your bestseller, {{ bestseller.name }}.
              </p>
              <div class="flex items-center gap-3">
                <div class="flex -space-x-3">
                  <div
                    v-for="opt in styleOptions" :key="opt.id"
                    class="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow"
                  >
                    <StyledImage :src="opt.img" :overlay="opt.overlay" compact />
                  </div>
                </div>
                <button class="pb-btn-primary" @click="startSetup">
                  <Sparkles :size="13" /> See your previews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance (only after onboarding is complete) -->
    <div v-if="state.published" class="pb-card p-4">
      <div class="flex items-center justify-between mb-3">
        <p class="font-semibold text-[#1a1a1a]">Performance</p>
        <span class="text-[11px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-2 py-0.5">Tracking started today</span>
      </div>

      <div class="grid grid-cols-4 gap-3">
        <div class="rounded-xl border border-[#ececec] p-3.5">
          <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Upgraded products</p>
          <p class="text-xl font-bold text-[#1a1a1a]">10</p>
        </div>
        <div class="rounded-xl border border-[#ececec] p-3.5">
          <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Visitors</p>
          <p class="text-xl font-bold text-[#1a1a1a]">128</p>
        </div>
        <div class="rounded-xl border border-[#ececec] p-3.5">
          <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Assisted orders</p>
          <p class="text-xl font-bold text-[#1a1a1a]">3</p>
        </div>
        <div class="rounded-xl border border-[#ececec] p-3.5">
          <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">Assisted revenue</p>
          <p class="text-xl font-bold text-[#1a1a1a]">€74</p>
        </div>
      </div>
    </div>
  </div>
</template>
