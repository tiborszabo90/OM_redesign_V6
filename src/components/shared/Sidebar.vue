<template>
  <aside class="shrink-0 w-19 h-full bg-white border-r border-[#E5E7EB] flex flex-col items-center pt-6 pb-4 z-30">
    <!-- Logo -->
    <button @click="$emit('logo-click'); navigateTo('home')" class="w-7 h-7 mb-5 flex items-center justify-center cursor-pointer">
      <img src="/icons/optimonk-logo.svg" alt="OptiMonk" class="w-full h-full" />
    </button>

    <!-- Navigation -->
    <nav class="flex-1 flex flex-col w-full px-1 gap-1 overflow-y-auto">
      <button
        v-for="item in menuItems"
        :key="item.id"
        @click="$emit('menu-click', item.id)"
        :class="[
          'w-full py-2 flex flex-col items-center gap-0.5 transition-colors cursor-pointer rounded-xl',
          activeItem === item.id
            ? 'bg-om-orange-100 text-om-orange-500'
            : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'
        ]"
      >
        <component :is="item.iconComponent" :size="20" />
        <span class="text-[10px] font-medium whitespace-pre-line text-center leading-tight">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Bottom section -->
    <div class="flex flex-col items-center gap-3 mt-auto pb-4">
      <button
        v-if="showAiButton"
        @click="$emit('ai-click')"
        class="w-10 h-10 rounded-full flex items-center justify-center text-om-gray-500 hover:text-om-gray-600 hover:bg-[#F3F4F6] transition-colors cursor-pointer"
      >
        <svg width="24" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
          <rect x="5" y="4" width="16" height="16" rx="3.85714" stroke="currentColor" stroke-width="2"/>
          <circle cx="9.71484" cy="13" r="1" stroke="currentColor" stroke-width="2"/>
          <circle cx="16.2852" cy="13" r="1" stroke="currentColor" stroke-width="2"/>
          <path d="M4 10H2.14286C1.51167 10 1 10.5117 1 11.1429V13.8571C1 14.4883 1.51167 15 2.14286 15H4" stroke="currentColor" stroke-width="2"/>
          <path d="M22 15L23.8571 15C24.4883 15 25 14.4883 25 13.8571L25 11.1429C25 10.5117 24.4883 10 23.8571 10L22 10" stroke="currentColor" stroke-width="2"/>
          <line x1="2" y1="10.4297" x2="2" y2="3.00112" stroke="currentColor" stroke-width="2"/>
          <line x1="24" y1="10.4297" x2="24" y2="3.00112" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>

      <!-- Notifications -->
      <button class="w-10 h-10 rounded-full flex items-center justify-center text-om-gray-500 hover:text-om-gray-600 hover:bg-[#F3F4F6] transition-colors cursor-pointer">
        <Bell :size="24" />
      </button>

      <!-- Profile -->
      <button
        @click="showProfilePopover = !showProfilePopover"
        class="w-7 h-7 rounded-full bg-om-gray-500 flex items-center justify-center text-white text-xs font-medium overflow-hidden hover:ring-2 hover:ring-om-gray-500/30 transition-all cursor-pointer"
      >
        <span>TS</span>
      </button>
    </div>

    <!-- Click outside overlay -->
    <div v-if="showProfilePopover" class="fixed inset-0 z-40" @click="showProfilePopover = false"></div>

    <!-- Profile popover -->
    <Teleport to="body">
      <transition name="popover-fade">
        <div
          v-if="showProfilePopover"
          class="fixed bottom-8-safe left-20 w-md bg-white rounded-2xl shadow-xl border border-om-gray-100 overflow-hidden z-50"
        >
          <div class="px-4 py-4 border-b border-om-gray-100">
            <p class="text-sm font-semibold text-om-gray-700 truncate">Tibor Szabó</p>
            <p class="text-xs text-om-gray-400 truncate">tibor.szabo@optimonk.com</p>
          </div>
          <div class="flex">
            <div class="flex flex-col py-2 px-2 border-r border-om-gray-100 shrink-0 w-52">
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Subscription</button>
              <button @click="navigateTo('settings')" class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Settings</button>
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Invite your team</button>
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Ambassador program</button>
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Sign out</button>
            </div>
            <div class="flex-1 py-3 px-4 space-y-3">
              <div class="flex items-center justify-between gap-2 mb-5">
                <span class="text-xs text-om-gray-400 whitespace-nowrap">My plan</span>
                <span class="text-xs font-medium text-om-gray-700">Free</span>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-om-gray-400">Pageviews</span>
                  <span class="text-xs font-medium text-om-gray-700">0 / 10,000</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-om-orange-400 rounded-full" style="width: 0%"></div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-om-gray-400">Active sites</span>
                  <span class="text-xs font-medium text-om-gray-700">4 / 1</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-om-orange-400 rounded-full" style="width: 50%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { Home, LayoutGrid, Users, Lightbulb, TrendingUp, BookOpen, GitBranch, LayoutTemplate, Bell } from 'lucide-vue-next'

defineProps({
  activeItem: { type: String, default: null },
  showAiButton: { type: Boolean, default: true },
})

defineEmits(['menu-click', 'logo-click', 'ai-click'])

const showProfilePopover = ref(false)

const menuItems = [
  { id: 'home', label: 'Home', iconComponent: Home },
  { id: 'campaigns', label: 'Campaigns', iconComponent: LayoutGrid },
  { id: 'audience', label: 'Audience', iconComponent: Users },
  { id: 'insights', label: 'Insights', iconComponent: Lightbulb },
  { id: 'analytics', label: 'Analytics', iconComponent: TrendingUp },
  { id: 'library', label: 'Library', iconComponent: BookOpen },
  { id: 'settings', label: 'A/B Tests', iconComponent: GitBranch },
  { id: 'template-manager', label: 'Template\nmanager', iconComponent: LayoutTemplate },
]

const navigateTo = (view) => {
  showProfilePopover.value = false
  window.location.hash = '#/' + view
}
</script>
