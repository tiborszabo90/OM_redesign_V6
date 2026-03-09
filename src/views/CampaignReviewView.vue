<template>
  <DashboardLayout active-menu-item="campaigns" background-color="white" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="flex items-center justify-center h-full">
        <div class="text-center max-w-sm px-8">
          <img src="/review_img.png" alt="" class="mx-auto mb-0 h-72" />
          <h2 class="text-xl font-bold text-om-gray-700 mb-4">Share your feedback</h2>
          <p class="text-sm text-om-gray-500 leading-relaxed mb-6">Happy to hear you had a great experience!<br>As a small team we really value your opinion.<br>Please take a minute to leave us a review.</p>
          <div class="flex items-center justify-center gap-2 mb-4" @mouseleave="hoveredStar = 0">
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
          <Button variant="ghost" size="sm" class="text-om-gray-400" @click="$emit('go-back')">Maybe later</Button>
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
