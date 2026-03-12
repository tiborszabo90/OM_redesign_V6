<template>
  <DashboardLayout active-menu-item="campaigns" background-color="white" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex items-center justify-center h-full -mt-16">
        <div class="flex items-center gap-16 px-8">
          <div class="relative shrink-0">
            <img src="/review_img.png" alt="" class="h-96" />
            <!-- Kata - legbalra -->
            <div class="absolute -left-6 top-3/5 bg-om-gray-800 shadow-md px-3.5 py-1.5">
              <span class="text-xs font-medium text-white relative -top-px">Kata</span>
            </div>
            <!-- Emil - jobb-közép -->
            <div class="absolute right-20 bottom-28 bg-om-gray-800 shadow-md px-3.5 py-1.5">
              <span class="text-xs font-medium text-white relative -top-px">Emil</span>
            </div>
            <!-- Chris - bal-közép -->
            <div class="absolute left-20 top-[70%] bg-om-gray-800 shadow-md px-3.5 py-1.5">
              <span class="text-xs font-medium text-white relative -top-px">Chris</span>
            </div>
            <!-- Réka - legjobbra -->
            <div class="absolute -right-6 top-2/3 bg-om-gray-800 shadow-md px-3.5 py-1.5">
              <span class="text-xs font-medium text-white relative -top-px">Réka</span>
            </div>
          </div>
          <div class="translate-y-8">
          <h2 class="text-xl font-bold text-om-gray-700 mb-4">Share your feedback ❤️</h2>
          <p class="text-sm text-om-gray-500 leading-relaxed mb-6">Happy to hear you had a great experience!<br>As a small team we really value your opinion.<br>Please take a minute to leave us a review.</p>
          <div class="flex items-center gap-2 mb-4" @mouseleave="hoveredStar = 0">
            <svg
              v-for="i in 5"
              :key="i"
              width="36" height="36" viewBox="0 0 24 24"
              :fill="i <= (hoveredStar || selectedStar) ? 'var(--color-om-yellow-400)' : 'none'"
              stroke="var(--color-om-yellow-400)"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
              class="cursor-pointer transition-all duration-100"
              @mouseenter="hoveredStar = i"
              @click="selectedStar = i"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span class="text-sm text-om-gray-400 cursor-pointer hover:text-om-gray-600 transition-colors" @click="$emit('go-back')">Maybe later</span>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'

defineEmits(['menu-click', 'go-back'])

const hoveredStar = ref(0)
const selectedStar = ref(0)
</script>
