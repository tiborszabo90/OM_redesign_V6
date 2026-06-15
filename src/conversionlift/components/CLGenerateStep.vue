<template>
  <div class="h-full flex flex-col bg-om-gray-50">
    <div class="max-w-3xl w-full mx-auto px-6 pt-6 pb-4 shrink-0">
      <!-- Hero CTA banner -->
      <div v-if="g.status.value !== 'done'" class="rounded-2xl bg-(--cl-accent-50) border border-(--cl-accent-200) p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-(--cl-accent-500) text-white flex items-center justify-center shrink-0"><Loader2 :size="22" class="animate-spin" /></div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-bold text-om-gray-800">We've started generating your variable</h2>
          <p class="text-sm text-om-gray-600 mt-0.5">{{ g.total }} pages, about 30s each. No need to wait — leave and come back to review when they're ready.</p>
        </div>
        <Button class="shrink-0" @click="$emit('leave')"><template #icon><Bell :size="16" /></template>Notify me &amp; leave</Button>
      </div>
      <div v-else class="rounded-2xl bg-[#E7F8F0] border border-[#A7E8CB] p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#15803D] text-white flex items-center justify-center shrink-0"><Check :size="24" /></div>
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-bold text-om-gray-800">Your variable is ready across all {{ g.total }} pages</h2>
          <p class="text-sm text-om-gray-600 mt-0.5">Every page got its own AI-written version of this variable. Review it before launching.</p>
        </div>
        <Button class="shrink-0" @click="$emit('next')">Review variable<template #icon><ArrowRight :size="16" /></template></Button>
      </div>

      <!-- Progress -->
      <div v-if="g.status.value !== 'done'" class="mt-4 flex items-center gap-4">
        <div class="flex-1">
          <div class="flex items-center justify-between text-sm mb-1.5"><span class="font-medium text-om-gray-700">{{ g.done.value }} / {{ g.total }} pages</span><span class="text-om-gray-500">{{ g.pct.value }}% · {{ g.etaLabel.value }}</span></div>
          <div class="h-2 rounded-full bg-om-gray-200 overflow-hidden"><div class="h-full bg-(--cl-accent-500) rounded-full transition-[width] duration-300" :style="{ width: g.pct.value + '%' }"></div></div>
        </div>
        <Button size="sm" variant="secondary" @click="g.togglePause()">{{ g.status.value === 'paused' ? 'Resume' : 'Pause' }}</Button>
        <Button size="sm" variant="secondary" @click="g.cancel()">Cancel</Button>
      </div>
    </div>

    <!-- All targeted products, with live per-page status -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="max-w-3xl w-full mx-auto px-6 pb-6 space-y-2">
        <div v-for="(it, i) in g.items" :key="it.id"
          class="flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5"
          :class="g.statusOf(i) === 'active' ? 'border-(--cl-accent-400)' : (g.statusOf(i) === 'queued' ? 'border-om-gray-200 opacity-55' : 'border-om-gray-200')">
          <img :src="it.img" alt="" class="w-10 h-10 rounded-lg object-cover bg-om-gray-100 shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-om-gray-800 truncate">{{ it.title }}</div>
            <div class="text-xs text-om-gray-500 truncate">{{ g.statusOf(i) === 'done' ? it.snippet : g.statusOf(i) === 'active' ? 'Writing this page…' : 'Queued' }}</div>
          </div>
          <span v-if="g.statusOf(i) === 'done'" class="text-xs text-[#15803D] inline-flex items-center gap-1 shrink-0"><Check :size="13" />Done</span>
          <Loader2 v-else-if="g.statusOf(i) === 'active' && g.status.value === 'generating'" :size="15" class="animate-spin text-(--cl-accent-600) shrink-0" />
          <span v-else class="text-om-gray-300 shrink-0">•</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loader2, Bell, Check, ArrowRight } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import { useGeneration } from '../useGeneration.js'

const props = defineProps({
  products: { type: Array, default: null }, // the scope-targeted products; falls back to the full catalog
})
defineEmits(['next', 'leave'])

const g = useGeneration(props.products)
</script>
