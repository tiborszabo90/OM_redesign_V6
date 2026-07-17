<script setup>
import { computed } from 'vue'
import { state, products, styleById, subscriptionPlans, variationBatches, abTests } from '../store'
import StyledImage from '../components/StyledImage.vue'
import {
  PawPrint, MoreHorizontal, ChevronRight, Sparkles, FlaskConical,
  TrendingUp, Images, ArrowUpRight,
} from 'lucide-vue-next'

const liveProducts = computed(() => products.filter(p => state.selected.includes(p.id)))
const liveVariations = computed(() => variationBatches.filter(b => b.status === 'live'))
const plan = computed(() => subscriptionPlans.find(p => p.id === state.plan))

function previewImgs() {
  return liveProducts.value.slice(0, 3).map(p => p.img)
}

function openVariation(id) {
  state.appTab = 'variations'
  state.openVariation = id
}
const quota = computed(() => plan.value ? plan.value.images : 10)

const kpis = computed(() => [
  { label: 'Live AI images', value: String(liveProducts.value.length), delta: null },
  { label: 'Image CTR', value: '4.8%', delta: '+0.6%' },
  { label: 'Assisted orders', value: '23', delta: '+9' },
  { label: 'Assisted revenue', value: '€412', delta: '+€118' },
])

function generateMore() {
  state.screen = state.plan === 'trial' ? 'plans' : 'products'
}

function goVariations() {
  state.appTab = 'variations'
}

const runningTest = computed(() => abTests.find(t => t.status === 'running') || null)

function goAbTests() {
  state.appTab = 'abtests'
  state.openAbTest = runningTest.value ? runningTest.value.id : null
}
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
        <h1 class="text-lg font-bold text-[#1a1a1a]">Home</h1>
      </div>
      <MoreHorizontal :size="16" class="text-[#616161]" />
    </div>

    <!-- KPIs -->
    <div class="pb-card p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <p class="font-semibold text-[#1a1a1a]">Performance</p>
        <span class="text-[11px] font-semibold text-[#616161] bg-[#f1f1f1] rounded-full px-2 py-0.5">Last 7 days</span>
      </div>
      <div class="grid grid-cols-4 gap-3">
        <div v-for="k in kpis" :key="k.label" class="rounded-xl border border-[#ececec] p-3.5">
          <p class="text-[11px] font-semibold text-[#616161] uppercase tracking-wide mb-1">{{ k.label }}</p>
          <p class="text-xl font-bold text-[#1a1a1a]">{{ k.value }}</p>
          <p v-if="k.delta" class="text-[11px] font-semibold text-[#0c6b45] flex items-center gap-0.5 mt-0.5">
            <TrendingUp :size="11" /> {{ k.delta }}
          </p>
        </div>
      </div>
    </div>

    <!-- Live variations -->
    <div class="pb-card p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <p class="font-semibold text-[#1a1a1a]">Your live variations</p>
          <p class="text-[12px] text-[#616161]">{{ liveVariations.length }} variations live on your storefront.</p>
        </div>
        <button class="pb-btn-ghost" @click="goVariations">
          <Images :size="13" /> Manage
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <div
          v-for="b in liveVariations" :key="b.id"
          class="rounded-xl border border-[#ececec] px-3 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-[#fafafa]"
          @click="openVariation(b.id)"
        >
          <div class="flex -space-x-2.5 shrink-0">
            <div v-for="(img, i) in previewImgs()" :key="i" class="w-9 h-9 rounded-lg overflow-hidden ring-2 ring-white">
              <StyledImage :src="img" :overlay="styleById(b.styleId).overlay" enhance compact />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[#1a1a1a] text-[13px] truncate">{{ b.name }}</p>
            <p class="text-[12px] text-[#616161]">{{ styleById(b.styleId).name }} · {{ b.count }} products</p>
          </div>
          <span v-if="b.ctr" class="text-[12px] text-[#616161] shrink-0">CTR {{ b.ctr }}</span>
          <span class="text-[11px] font-semibold text-[#0c6b45] bg-[#d7f2e4] rounded-full px-2 py-0.5 shrink-0">Live</span>
          <ChevronRight :size="15" class="text-[#8a8a8a] shrink-0" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <!-- Usage / plan -->
      <div class="pb-card p-5 flex flex-col">
        <div class="flex items-center justify-between mb-1">
          <p class="font-semibold text-[#1a1a1a]">
            <template v-if="plan">{{ plan.name }} plan</template>
            <template v-else>Free trial</template>
          </p>
          <span class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5">
            {{ liveProducts.length }} of {{ quota >= 999 ? 'unlimited' : quota }} used
          </span>
        </div>
        <div class="h-1.5 bg-[#ececec] rounded-full overflow-hidden mb-2">
          <div class="h-full bg-[#5548e0] rounded-full" :style="{ width: Math.min(liveProducts.length / Math.min(quota, 36) * 100, 100) + '%' }"></div>
        </div>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">
          {{ products.length - liveProducts.length }} products are still on their original photos.
          <template v-if="!plan"> Your free upgrades are used, pick a plan to keep generating.</template>
        </p>
        <button class="pb-btn-primary self-start" @click="generateMore">
          <Sparkles :size="13" /> Generate more images
        </button>
      </div>

      <!-- A/B test -->
      <div class="pb-card p-5 flex flex-col">
        <div class="flex items-center justify-between mb-1">
          <p class="font-semibold text-[#1a1a1a]">A/B testing</p>
          <span
            class="text-[11px] font-semibold rounded-full px-2 py-0.5"
            :class="runningTest ? 'text-[#0c6b45] bg-[#d7f2e4]' : 'text-[#616161] bg-[#f1f1f1]'"
          >
            {{ runningTest ? 'Running' : 'Not running' }}
          </span>
        </div>
        <p class="text-[12px] text-[#616161] mb-3 flex-1">
          <template v-if="runningTest">
            {{ runningTest.name }}, day {{ runningTest.day }} of {{ runningTest.days }}.
            <template v-if="runningTest.uplift"> AI variant leads with {{ runningTest.uplift }} add-to-cart.</template>
          </template>
          <template v-else>Run original vs AI images side by side and let the numbers decide.</template>
        </p>
        <button class="pb-btn-secondary self-start" @click="goAbTests">
          <FlaskConical :size="13" /> {{ runningTest ? 'View test' : 'Start an A/B test' }}
          <ArrowUpRight :size="12" />
        </button>
      </div>
    </div>
  </div>
</template>
