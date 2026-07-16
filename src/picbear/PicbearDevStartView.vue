<template>
  <div class="min-h-screen-safe bg-om-gray-50 flex flex-col items-center justify-center px-6 py-12">
    <div class="flex items-center gap-2 mb-3">
      <span class="w-9 h-9 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
        <PawPrint :size="20" />
      </span>
      <span class="text-lg font-semibold text-om-gray-900">Picbear</span>
    </div>
    <div class="text-center mb-10">
      <h1 class="text-3xl font-semibold text-om-gray-900">Choose a version</h1>
      <p class="text-om-gray-500 mt-2">Pick which Picbear prototype to open</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl">
      <button
        v-for="v in versions"
        :key="v.id"
        @click="$emit('navigate', v.target)"
        class="group relative flex flex-col items-start text-left bg-white rounded-2xl border border-om-gray-200 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      >
        <div class="flex items-center justify-between w-full mb-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-[#10B981]/10 text-[#10B981]">
            <Image :size="24" />
          </div>
          <Tag :variant="v.badgeVariant" size="sm">{{ v.badge }}</Tag>
        </div>

        <h2 class="text-lg font-semibold text-om-gray-900">{{ v.label }}</h2>
        <p class="text-sm text-om-gray-500 mt-1">{{ v.tagline }}</p>

        <div class="flex items-center gap-1 text-sm font-medium mt-4 text-[#10B981]">
          Open
          <ArrowRight :size="15" class="transition-transform group-hover:translate-x-0.5" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Image, ArrowRight, PawPrint } from 'lucide-vue-next'
import Tag from '../components/shared/Tag.vue'

defineEmits(['navigate'])

const versions = [
  {
    id: 'v1',
    label: 'Version 1',
    tagline: 'The current Picbear onboarding prototype.',
    target: 'picbear',
    badge: 'Current',
    badgeVariant: 'gray',
  },
  {
    id: 'v2',
    label: 'Version 2',
    tagline: 'The new iteration. Copied from V1 as a starting point.',
    target: 'picbear-v2',
    badge: 'New',
    badgeVariant: 'green-light',
  },
]
</script>
