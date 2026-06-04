<template>
  <div class="min-h-screen-safe bg-om-gray-50 flex flex-col items-center justify-center px-6 py-12">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-semibold text-om-gray-900">Choose an app</h1>
      <p class="text-om-gray-500 mt-2">Select a product to get started</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl">
      <button
        v-for="app in apps"
        :key="app.id"
        @click="$emit('navigate', app.target)"
        class="group relative flex flex-col items-start text-left bg-white rounded-2xl border border-om-gray-200 p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      >
        <div class="flex items-center justify-between w-full mb-4">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :style="{ backgroundColor: app.accent + '1A', color: app.accent }"
          >
            <img v-if="app.logo" :src="app.logo" :alt="app.label" class="h-7 w-7" />
            <component v-else :is="app.icon" :size="24" />
          </div>
          <Tag :variant="app.available ? 'green-light' : 'gray'" size="sm">
            <template #icon>
              <Check v-if="app.available" :size="12" />
              <Clock v-else :size="12" />
            </template>
            {{ app.available ? 'Available' : 'Coming soon' }}
          </Tag>
        </div>

        <h2 class="text-lg font-semibold text-om-gray-900">{{ app.label }}</h2>
        <p class="text-sm text-om-gray-500 mt-1">{{ app.tagline }}</p>

        <div
          class="flex items-center gap-1 text-sm font-medium mt-4 transition-colors"
          :style="{ color: app.accent }"
        >
          {{ app.available ? 'Open' : 'Preview' }}
          <ArrowRight :size="15" class="transition-transform group-hover:translate-x-0.5" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Box, Image, TrendingUp, ArrowRight, Check, Clock } from 'lucide-vue-next'
import Tag from '../components/shared/Tag.vue'

defineEmits(['navigate'])

const apps = [
  {
    id: 'optimonk',
    label: 'OptiMonk',
    tagline: 'Conversion optimization, popups & personalization',
    target: 'dev-start',
    accent: '#F06431',
    available: true,
    logo: '/icons/optimonk-logo.svg',
  },
  {
    id: 'opticube',
    label: 'OptiCube',
    tagline: 'A new product in the OptiMonk family',
    target: 'opticube',
    accent: '#6366F1',
    available: false,
    icon: Box,
  },
  {
    id: 'picbear',
    label: 'Picbear',
    tagline: 'A new product in the OptiMonk family',
    target: 'picbear',
    accent: '#10B981',
    available: false,
    icon: Image,
  },
  {
    id: 'conversionlift',
    label: 'ConversionLift',
    tagline: 'A new product in the OptiMonk family',
    target: 'conversionlift',
    accent: '#0EA5E9',
    available: false,
    icon: TrendingUp,
  },
]
</script>
