<template>
  <div class="h-screen bg-white flex overflow-hidden">
    <!-- Left Sidebar -->
    <aside class="w-16 bg-[#ED5A29] flex flex-col items-center py-4">
      <!-- Logo -->
      <button @click="$emit('logo-click')" class="w-8 h-8 mb-3 flex items-center justify-center hover:opacity-80 transition-opacity">
        <img src="/omlogo.svg" alt="OptiMonk" class="w-full h-full" />
      </button>

      <!-- Navigation Menu -->
      <nav class="flex-1 flex flex-col w-full">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="activeItem = item.id"
          :class="[
            'w-full py-3 flex flex-col items-center gap-1 transition-colors cursor-pointer',
            activeItem === item.id
              ? 'bg-[#D14212]'
              : 'hover:bg-white/10'
          ]"
        >
          <span v-html="item.icon" class="w-5 h-5 text-white"></span>
          <span class="text-[10px] text-white font-medium">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Bottom section -->
      <div class="flex flex-col items-center gap-3 mt-auto pb-14">
        <!-- Notifications - uil-bell -->
        <button class="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18,13.18V10a6,6,0,0,0-5-5.91V3a1,1,0,0,0-2,0V4.09A6,6,0,0,0,6,10v3.18A3,3,0,0,0,4,16v2a1,1,0,0,0,1,1H8.14a4,4,0,0,0,7.72,0H19a1,1,0,0,0,1-1V16A3,3,0,0,0,18,13.18ZM8,10a4,4,0,0,1,8,0v3H8Zm4,10a2,2,0,0,1-1.72-1h3.44A2,2,0,0,1,12,20Zm6-3H6V16a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z"/>
          </svg>
        </button>

        <!-- Profile Avatar -->
        <button class="w-10 h-10 rounded-full bg-[#8F97A4] flex items-center justify-center text-white text-sm font-medium overflow-hidden hover:ring-2 hover:ring-white/30 transition-all cursor-pointer">
          <!-- Placeholder for profile image -->
          <span>TS</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex items-center justify-center overflow-hidden">
      <div class="w-full max-w-5xl px-8 -mt-25">
        <slot name="content"></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['logo-click'])

const activeItem = ref('new-task')

const menuItems = [
  {
    id: 'new-task',
    label: 'New task',
    // uil-plus-circle
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"/></svg>'
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
    id: 'analytics',
    label: 'Analytics',
    // uil-chart-line
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21,21H3a1,1,0,0,1-1-1V3A1,1,0,0,1,4,3V20H21a1,1,0,0,1,0,2Z"/><path d="M7,15a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l4-4a1,1,0,0,1,1.42,0L14,11.59l4.29-4.3a1,1,0,0,1,1.42,1.42l-5,5a1,1,0,0,1-1.42,0L11,11.41l-3.29,3.3A1,1,0,0,1,7,15Z"/></svg>'
  },
  {
    id: 'library',
    label: 'Library',
    // uil-window-grid
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21,2H3A1,1,0,0,0,2,3V21a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V3A1,1,0,0,0,21,2ZM11,20H4V11h7Zm0-11H4V4h7Zm9,11H13V11h7Zm0-11H13V4h7Z"/></svg>'
  }
]
</script>
