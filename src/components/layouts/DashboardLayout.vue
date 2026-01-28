<template>
  <div class="h-screen-safe bg-om-gray-50 flex overflow-hidden relative">
    <!-- Left Sidebar - Always visible -->
    <aside class="fixed left-0 top-0 h-screen-safe w-19 bg-white border-r border-[#E5E7EB] flex flex-col items-center py-4 z-30">
      <!-- Logo -->
      <button @click="$emit('logo-click')" class="w-7 h-7 mb-3 flex items-center justify-center hover:opacity-80 transition-opacity">
        <img src="/optimonk_logo.svg" alt="OptiMonk" class="w-full h-full" />
      </button>

      <!-- Navigation Menu -->
      <nav class="flex-1 flex flex-col w-full px-1 gap-1">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="activeItem = item.id"
          :class="[
            'w-full py-1.5 flex flex-col items-center gap-0.5 transition-colors cursor-pointer rounded-xl',
            activeItem === item.id
              ? 'bg-om-orange-100 text-om-orange-500'
              : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'
          ]"
        >
          <span v-html="item.icon" class="w-5 h-5"></span>
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Bottom section -->
      <div class="flex flex-col items-center gap-3 mt-auto pb-4">
        <!-- Notifications - uil-bell -->
        <button class="w-10 h-10 rounded-full flex items-center justify-center text-[#8F97A4] hover:text-[#505763] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18,13.18V10a6,6,0,0,0-5-5.91V3a1,1,0,0,0-2,0V4.09A6,6,0,0,0,6,10v3.18A3,3,0,0,0,4,16v2a1,1,0,0,0,1,1H8.14a4,4,0,0,0,7.72,0H19a1,1,0,0,0,1-1V16A3,3,0,0,0,18,13.18ZM8,10a4,4,0,0,1,8,0v3H8Zm4,10a2,2,0,0,1-1.72-1h3.44A2,2,0,0,1,12,20Zm6-3H6V16a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z"/>
          </svg>
        </button>

        <!-- Profile Avatar -->
        <button class="w-7 h-7 rounded-full bg-[#8F97A4] flex items-center justify-center text-white text-xs font-medium overflow-hidden hover:ring-2 hover:ring-[#8F97A4]/30 transition-all cursor-pointer">
          <!-- Placeholder for profile image -->
          <span>TS</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="w-full ml-19 flex items-center justify-center overflow-hidden">
      <div class="w-full px-12 -mt-25">
        <slot name="content"></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['logo-click'])

const activeItem = ref('home')

const menuItems = [
  {
    id: 'home',
    label: 'Home',
    // uil-estate
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20,8h0L14,2.74a3,3,0,0,0-4,0L4,8a3,3,0,0,0-1,2.26V19a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V10.25A3,3,0,0,0,20,8ZM14,20H10V15a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Zm5-1a1,1,0,0,1-1,1H16V15a3,3,0,0,0-3-3H11a3,3,0,0,0-3,3v5H6a1,1,0,0,1-1-1V10.25a1,1,0,0,1,.34-.75l6-5.25a1,1,0,0,1,1.32,0l6,5.25a1,1,0,0,1,.34.75Z"/></svg>'
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    // uil-apps
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10,3H4A1,1,0,0,0,3,4v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,10,3ZM9,9H5V5H9ZM20,3H14a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,20,3Zm-1,6H15V5h4Zm-9,4H4a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,19H5V15H9Zm11-6H14a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14A1,1,0,0,0,20,13Zm-1,6H15V15h4Z"/></svg>'
  },
  {
    id: 'audience',
    label: 'Audience',
    // uil-users-alt
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.3,12.22A4.92,4.92,0,0,0,14,8.5a5,5,0,0,0-10,0,4.92,4.92,0,0,0,1.7,3.72A8,8,0,0,0,1,19.5a1,1,0,0,0,2,0,6,6,0,0,1,12,0,1,1,0,0,0,2,0A8,8,0,0,0,12.3,12.22ZM9,11.5a3,3,0,1,1,3-3A3,3,0,0,1,9,11.5Zm9.74.32A5,5,0,0,0,15,3.5a1,1,0,0,0,0,2,3,3,0,0,1,3,3,3,3,0,0,1-1.5,2.59,1,1,0,0,0-.5.84,1,1,0,0,0,.45.86l.39.26.13.07a7,7,0,0,1,4,6.38,1,1,0,0,0,2,0A9,9,0,0,0,18.74,11.82Z"/></svg>'
  },
  {
    id: 'insights',
    label: 'Insights',
    // uil-chart-line
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21,21H3a1,1,0,0,1-1-1V3A1,1,0,0,1,4,3V20H21a1,1,0,0,1,0,2Z"/><path d="M7,15a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l4-4a1,1,0,0,1,1.42,0L14,11.59l4.29-4.3a1,1,0,0,1,1.42,1.42l-5,5a1,1,0,0,1-1.42,0L11,11.41l-3.29,3.3A1,1,0,0,1,7,15Z"/></svg>'
  },
  {
    id: 'library',
    label: 'Library',
    // uil-book-alt
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18,2H8A4,4,0,0,0,4,6V18a4,4,0,0,0,4,4H18a2,2,0,0,0,2-2V4A2,2,0,0,0,18,2ZM6,6A2,2,0,0,1,8,4H18V14H8a3.91,3.91,0,0,0-2,.56ZM8,20a2,2,0,0,1,0-4H18v4ZM10,8h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2Z"/></svg>'
  },
  {
    id: 'settings',
    label: 'Settings',
    // uil-setting
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.9,12.66a1,1,0,0,1,0-1.32L21.18,9.9a1,1,0,0,0,.12-1.17l-2-3.46a1,1,0,0,0-1.07-.48l-1.88.38a1,1,0,0,1-1.15-.66l-.61-1.83A1,1,0,0,0,13.64,2h-4a1,1,0,0,0-1,.68L8.08,4.51a1,1,0,0,1-1.15.66L5,4.79A1,1,0,0,0,4,5.27L2,8.73A1,1,0,0,0,2.1,9.9l1.27,1.44a1,1,0,0,1,0,1.32L2.1,14.1A1,1,0,0,0,2,15.27l2,3.46a1,1,0,0,0,1.07.48l1.88-.38a1,1,0,0,1,1.15.66l.61,1.83a1,1,0,0,0,1,.68h4a1,1,0,0,0,.95-.68l.61-1.83a1,1,0,0,1,1.15-.66l1.88.38a1,1,0,0,0,1.07-.48l2-3.46a1,1,0,0,0-.12-1.17ZM18.41,14l.8.9-1.28,2.22-1.18-.24a3,3,0,0,0-3.45,2L12.92,20H10.36L10,18.86a3,3,0,0,0-3.45-2l-1.18.24L4.07,14.89l.8-.9a3,3,0,0,0,0-4l-.8-.9L5.35,6.89l1.18.24a3,3,0,0,0,3.45-2L10.36,4h2.56l.38,1.14a3,3,0,0,0,3.45,2l1.18-.24,1.28,2.22-.8.9A3,3,0,0,0,18.41,14ZM11.64,8a4,4,0,1,0,4,4A4,4,0,0,0,11.64,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,11.64,14Z"/></svg>'
  }
]
</script>

<style scoped>
</style>
