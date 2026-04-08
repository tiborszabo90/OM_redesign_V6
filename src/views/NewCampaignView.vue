<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="relative h-full">
        <button
          class="absolute top-0 left-0 z-10 flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 transition-colors cursor-pointer"
          @click="$emit('back')"
        >
          <ChevronLeft :size="18" />
          Back
        </button>

      <div class="flex flex-col items-center justify-center h-full py-16 -translate-y-[5%]">
        <h1 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-10">What would you like to do?</h1>

        <div class="flex gap-6">
          <button
            v-for="card in cards"
            :key="card.title"
            class="flex flex-col items-center gap-5 bg-white border-2 border-om-gray-200 rounded-xl p-8 w-72 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200 text-left"
            @click="card.type === 'popup' ? $emit('navigate', 'templates-v2') : card.type === 'optimize' ? $emit('navigate', 'optimize-website') : card.type === 'ppo' ? $emit('navigate', 'ppo-campaign-flow-v3') : $emit('select', card.type)"
          >
            <img v-if="card.image" :src="card.image" :alt="card.title" class="w-36 h-36 object-contain shrink-0" />
            <div v-else class="w-36 h-36 rounded-lg bg-om-gray-100 shrink-0" />
            <div class="text-center">
              <div class="text-lg font-semibold text-om-gray-700 mb-1">{{ card.title }}</div>
              <div class="text-base text-om-gray-400 leading-relaxed whitespace-pre-line">{{ card.description }}</div>
            </div>
          </button>
        </div>
      </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import { ChevronLeft } from 'lucide-vue-next'

defineEmits(['menu-click', 'select', 'back', 'navigate'])

const cards = [
  {
    type: 'popup',
    title: 'Create a Popup',
    description: 'Popup, sticky bar, sidemessage, etc.',
    image: '/popup.a6a147d0.svg',
  },
  {
    type: 'optimize',
    title: 'Optimize a Website',
    description: 'Run A/B tests, personalize, etc.',
    image: '/optimize.c2ec5c73.svg',
  },
  {
    type: 'ppo',
    title: 'Smart Product Page',
    description: 'Optimize your product pages\nwith AI-powered content.',
    image: null,
  },
]
</script>
