<template>
  <div class="h-screen bg-om-gray-50 flex flex-col">
    <!-- Top bar -->
    <header class="shrink-0 h-14 bg-white border-b border-om-gray-200 flex items-center gap-4 px-5">
      <button @click="$emit('exit')" class="flex items-center gap-2 cursor-pointer group">
        <Zap :size="18" class="text-[#0EA5E9]" />
        <span class="text-sm font-semibold text-om-gray-700 group-hover:text-om-gray-900 hidden sm:block">ConversionLift</span>
      </button>
      <button v-if="back" @click="$emit('back')"
        class="w-8 h-8 rounded-lg flex items-center justify-center text-om-gray-500 hover:bg-om-gray-100 cursor-pointer">
        <ArrowLeft :size="16" />
      </button>
      <template v-if="title">
        <div class="w-px h-6 bg-om-gray-200"></div>
        <span class="text-sm font-medium text-om-gray-500">{{ title }}</span>
      </template>

      <!-- Centered flow progress (optional) -->
      <div class="flex-1 min-w-0 flex justify-center"><slot name="progress" /></div>

      <div class="flex items-center gap-4">
        <!-- Step indicator -->
        <nav class="flex items-center gap-1.5">
          <template v-for="(s, i) in steps" :key="s">
            <div class="flex items-center gap-1.5">
              <span
                class="w-5 h-5 rounded-full text-[11px] font-semibold flex items-center justify-center transition-colors"
                :class="i < current ? 'bg-(--cl-accent-500) text-white'
                  : i === current ? 'bg-(--cl-accent-100) text-[#0284C7] ring-2 ring-(--cl-accent-400)'
                  : 'bg-om-gray-100 text-om-gray-400'"
              >
                <Check v-if="i < current" :size="12" />
                <template v-else>{{ i + 1 }}</template>
              </span>
              <span class="text-xs font-medium hidden md:block" :class="i === current ? 'text-om-gray-700' : 'text-om-gray-400'">{{ s }}</span>
            </div>
            <span v-if="i < steps.length - 1" class="w-5 h-px bg-om-gray-200"></span>
          </template>
        </nav>
        <!-- Teleport target: flow-specific top-bar controls -->
        <div id="cl-topbar-end" class="flex items-center gap-3"></div>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 min-h-0 overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { Zap, Check, ArrowLeft } from 'lucide-vue-next'
import '../conversionlift.css'

defineProps({
  title: { type: String, default: 'Flow' },
  steps: { type: Array, default: () => [] },
  current: { type: Number, default: 0 },
  back: { type: Boolean, default: false },
})
defineEmits(['exit', 'back'])
</script>
