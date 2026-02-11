<template>
  <div class="h-screen-safe flex overflow-hidden relative" :style="{ backgroundColor: backgroundColor }">
    <!-- Left Sidebar - Always visible -->
    <aside :class="[
      'fixed left-0 top-0 h-screen-safe w-19 bg-white flex flex-col items-center pt-6 pb-4 z-30',
      { 'border-r border-[#E5E7EB]': !hideSidebarBorder }
    ]">
      <!-- Logo -->
      <button @click="$emit('logo-click')" class="w-7 h-7 mb-5 flex items-center justify-center">
        <img src="/optimonk_logo.svg" alt="OptiMonk" class="w-full h-full" />
      </button>

      <!-- Navigation Menu -->
      <nav class="flex-1 flex flex-col w-full px-1 gap-1">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="handleMenuClick(item.id)"
          :class="[
            'w-full py-2 flex flex-col items-center gap-0.5 transition-colors cursor-pointer rounded-xl',
            activeItem === item.id
              ? 'bg-om-orange-100 text-om-orange-500'
              : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'
          ]"
        >
          <component :is="item.iconComponent" :size="20" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Bottom section -->
      <div class="flex flex-col items-center gap-3 mt-auto pb-4">
        <!-- Notifications -->
        <button class="w-10 h-10 rounded-full flex items-center justify-center text-[#8F97A4] hover:text-[#505763] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
          <Bell :size="24" />
        </button>

        <!-- Profile Avatar -->
        <button class="w-7 h-7 rounded-full bg-[#8F97A4] flex items-center justify-center text-white text-xs font-medium overflow-hidden hover:ring-2 hover:ring-[#8F97A4]/30 transition-all cursor-pointer">
          <!-- Placeholder for profile image -->
          <span>TS</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="w-full ml-19 overflow-y-auto">
      <div :class="noContentPadding ? 'w-full' : 'w-full px-12 py-8'">
        <slot name="content"></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Home, LayoutGrid, Users, TrendingUp, BookOpen, GitBranch, Bell } from 'lucide-vue-next'

const props = defineProps({
  activeMenuItem: {
    type: String,
    default: 'home'
  },
  hideSidebarBorder: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: '#F9FAFB'
  },
  noContentPadding: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['logo-click', 'menu-click'])

const activeItem = ref(props.activeMenuItem)

// Watch for prop changes to update activeItem
watch(() => props.activeMenuItem, (newValue) => {
  activeItem.value = newValue
})

const handleMenuClick = (itemId) => {
  activeItem.value = itemId
  emit('menu-click', itemId)
}

const menuItems = [
  {
    id: 'home',
    label: 'Home',
    iconComponent: Home
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    iconComponent: LayoutGrid
  },
  {
    id: 'audience',
    label: 'Audience',
    iconComponent: Users
  },
  {
    id: 'insights',
    label: 'Analytics',
    iconComponent: TrendingUp
  },
  {
    id: 'library',
    label: 'Library',
    iconComponent: BookOpen
  },
  {
    id: 'settings',
    label: 'A/B Tests',
    iconComponent: GitBranch
  }
]
</script>

<style scoped>
</style>
