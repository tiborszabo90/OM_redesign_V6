<template>
  <div class="min-h-screen-safe bg-om-gray-50 py-16 px-6">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-10">
        <div class="flex items-center gap-2 text-sm text-om-gray-500 mb-3">
          <Archive :size="14" />
          <span>Archive</span>
        </div>
        <h1 class="text-3xl font-semibold text-om-gray-700 mb-2">
          Home Insights — archive
        </h1>
        <p class="text-om-gray-500 max-w-2xl">
          Earlier explorations of the Home page. The current live version is
          <button
            class="text-om-orange-500 hover:text-om-orange-600 underline underline-offset-2 cursor-pointer"
            @click="$emit('navigate', 'home-old')"
          >Home</button>.
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="item in variants"
          :key="item.id"
          @click="$emit('navigate', item.id)"
          class="group text-left bg-white border border-om-gray-200 rounded-2xl p-5 transition-all cursor-pointer hover:border-om-orange-500 hover:shadow-sm"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-medium text-om-gray-500 uppercase tracking-wide">
              {{ item.version }}
            </span>
            <ArrowUpRight
              :size="16"
              class="text-om-gray-400 group-hover:text-om-orange-500 transition-colors"
            />
          </div>
          <h3 class="text-lg font-semibold text-om-gray-700 mb-1">
            {{ item.title }}
          </h3>
          <p class="text-sm text-om-gray-500">
            {{ item.subtitle }}
          </p>
        </button>
      </div>

      <!-- Back -->
      <div class="mt-10">
        <Button variant="secondary" size="sm" @click="$emit('navigate', 'dev-start')">
          <template #icon><ChevronLeft :size="14" /></template>
          Back to start
        </Button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Archive, ArrowUpRight, ChevronLeft } from 'lucide-vue-next'
import Button from '../components/shared/Button.vue'

defineEmits(['navigate'])

const variants = [
  { id: 'home-insights-v10', version: 'V10', title: 'Home Insights V10', subtitle: 'Latest exploration after V9.' },
  { id: 'home-insights-v9',  version: 'V9',  title: 'Home Insights V9',  subtitle: 'Original V9 design (still the live Home).' },
  { id: 'home-insights-v8',  version: 'V8',  title: 'Home Insights V8',  subtitle: 'Iteration before the V9 cut.' },
  { id: 'home-insights-v7',  version: 'V7',  title: 'Home Insights V7',  subtitle: 'Layout exploration.' },
  { id: 'home-insights-v6',  version: 'V6',  title: 'Home Insights V6',  subtitle: 'Layout exploration.' },
  { id: 'home-insights-v5',  version: 'V5',  title: 'Home Insights V5',  subtitle: 'Layout exploration.' },
  { id: 'home-insights-v4',  version: 'V4',  title: 'Home Insights V4',  subtitle: 'Early structure exploration.' },
  { id: 'home-insights-v3',  version: 'V3',  title: 'Home Insights V3',  subtitle: 'Early structure exploration.' },
  { id: 'home-insights-v2',  version: 'V2',  title: 'Home Insights V2',  subtitle: 'First insights-based concept.' },
]
</script>
