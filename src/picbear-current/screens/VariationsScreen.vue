<script setup>
import { computed } from 'vue'
import { state, variationList as variations } from '../store'
import { PawPrint, ChevronRight, MoreHorizontal, Info } from 'lucide-vue-next'

// picbear-current mirrors the currently-live Variations list
// (app.variations._index.tsx): info banner, Active/Other sections, and
// per-variation activate / deactivate / delete. Localized to the coffee demo.
const activeVariations = computed(() => variations.filter(v => v.status === 'active'))
const otherVariations = computed(() => variations.filter(v => v.status !== 'active'))
const hasActiveVariation = computed(() => variations.some(v => v.status === 'active'))

function activate(v) {
  variations.forEach(x => { x.status = 'inactive' })
  v.status = 'active'
}
function deactivate(v) {
  v.status = 'inactive'
}
function del(v) {
  if (!confirm('Delete this variation and its upgraded products?')) return
  const i = variations.indexOf(v)
  if (i !== -1) variations.splice(i, 1)
}

function createNew() {
  state.appTab = 'home'
  state.screen = 'style'
}

function view(v) {
  state.variationDetailId = v.id
}

function goHome() {
  state.appTab = 'home'
  state.screen = 'home'
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
        <button class="text-[#616161] hover:text-[#1a1a1a] cursor-pointer" @click="goHome">Home</button>
        <ChevronRight :size="14" class="text-[#8a8a8a]" />
        <h1 class="text-lg font-bold text-[#1a1a1a]">Variations</h1>
      </div>
      <div class="flex items-center gap-2">
        <button class="pb-btn-primary" @click="createNew">Create New Variation</button>
        <MoreHorizontal :size="16" class="text-[#616161]" />
      </div>
    </div>

    <!-- Info banner -->
    <div class="rounded-xl bg-[#ebf3fb] p-4 mb-5 flex gap-3">
      <Info :size="18" class="text-[#3a6ea5] shrink-0 mt-0.5" />
      <div class="text-[13px] text-[#1a1a1a]">
        <p class="font-semibold mb-0.5">What are Variations?</p>
        <p class="text-[#3f4b57]">
          Each variation is a set of AI-generated product images with a specific style and position.
          Create multiple variations to test different approaches, then A/B test them to find the best performer.
        </p>
      </div>
    </div>

    <!-- Active Variation -->
    <template v-if="activeVariations.length">
      <h2 class="text-[22px] font-bold text-[#1a1a1a] mb-3">Active Variation</h2>
      <div class="flex flex-col gap-3 mb-6">
        <div v-for="v in activeVariations" :key="v.id" class="pb-card p-4">
          <div class="flex items-center gap-4 flex-wrap">
            <img :src="v.img" alt="" class="w-16 h-16 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-[200px]">
              <p class="font-semibold text-[#1a1a1a] mb-1.5">{{ v.name }}</p>
              <div class="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span class="text-[12px] rounded bg-[#f1f2f4] text-[#1a1a1a] px-2 py-0.5">Mode: {{ v.mode }}</span>
                <span class="text-[12px] rounded bg-[#f1f2f4] text-[#1a1a1a] px-2 py-0.5">Position: {{ v.position }}</span>
                <span class="text-[12px] font-semibold rounded bg-[#d4edda] text-[#155724] px-2 py-0.5">Active</span>
              </div>
              <p class="text-[13px] text-[#6d7175]">{{ v.count }} / 10 products</p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <button class="pb-btn-ghost" @click="view(v)">View</button>
              <button class="pb-btn-secondary" @click="deactivate(v)">Deactivate</button>
              <button class="text-[13px] font-semibold text-[#d72c0d] hover:underline cursor-pointer" @click="del(v)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Other Variations -->
    <template v-if="otherVariations.length">
      <h2 class="text-[22px] font-bold text-[#1a1a1a] mb-3">Other Variations</h2>
      <div class="flex flex-col gap-3">
        <div v-for="v in otherVariations" :key="v.id" class="pb-card p-4">
          <div class="flex items-center gap-4 flex-wrap">
            <img :src="v.img" alt="" class="w-16 h-16 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-[200px]">
              <p class="font-semibold text-[#1a1a1a] mb-1.5">{{ v.name }}</p>
              <div class="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span class="text-[12px] rounded bg-[#f1f2f4] text-[#1a1a1a] px-2 py-0.5">Mode: {{ v.mode }}</span>
                <span class="text-[12px] rounded bg-[#f1f2f4] text-[#1a1a1a] px-2 py-0.5">Position: {{ v.position }}</span>
                <span class="text-[12px] font-semibold rounded bg-[#e4e5e7] text-[#5c5f62] px-2 py-0.5">Inactive</span>
              </div>
              <p class="text-[13px] text-[#6d7175]">{{ v.count }} / 10 products</p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <button class="pb-btn-ghost" @click="view(v)">View</button>
              <span :title="hasActiveVariation ? `It can't be activated until there's another active variation.` : undefined">
                <button class="pb-btn-secondary disabled:opacity-45 disabled:cursor-default" :disabled="hasActiveVariation" @click="activate(v)">Activate</button>
              </span>
              <button class="text-[13px] font-semibold text-[#d72c0d] hover:underline cursor-pointer" @click="del(v)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty state -->
    <div v-if="!variations.length" class="pb-card p-8 text-center">
      <p class="text-[13px] text-[#616161] mb-4">
        No variations yet. Create one to start upgrading product images with different styles and positions.
      </p>
      <button class="pb-btn-primary" @click="createNew">Create your first variation</button>
    </div>
  </div>
</template>
