<template>
  <DashboardLayout
    :passthrough="passthrough"
    wide-sidebar
    :active-menu-item="activeItem"
    :nav-items="sidebarMenu"
    user-name="Csaba"
    user-initials="CS"
    :user-avatar="userAvatar"
    right-panel-collapsed
    :no-content-padding="fullBleed"
    :background-color="fullBleed ? '#ffffff' : '#F9FAFB'"
    @menu-click="onSidebarMenu"
  >
    <!-- Domain switcher + New task -->
    <template #sidebar-top>
      <div class="relative px-1 mb-1">
        <button
          @click="domainMenuOpen = !domainMenuOpen"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-om-gray-100 transition-colors cursor-pointer"
          title="Switch domain"
        >
          <img src="/demos/telekom/logo.png" alt="Domain" class="w-5 h-5 rounded-full object-cover shrink-0" />
          <span class="flex-1 min-w-0 text-sm text-om-gray-700 truncate text-left">{{ selectedDomain }}</span>
          <ChevronDown :size="14" class="text-om-gray-400 shrink-0" />
        </button>
        <template v-if="domainMenuOpen">
          <div class="fixed inset-0 z-30" @click="domainMenuOpen = false"></div>
          <div class="absolute top-full left-1 right-1 mt-1 bg-white rounded-lg shadow-lg border border-om-gray-200 py-1 z-40">
            <button
              v-for="d in domains"
              :key="d"
              @click="selectedDomain = d; domainMenuOpen = false"
              :class="['w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2', selectedDomain === d ? 'bg-om-orange-50 text-om-orange-600 font-semibold' : 'text-om-gray-700 hover:bg-om-gray-50']"
            >
              <img v-if="!d.startsWith('+')" src="/demos/telekom/logo.png" class="w-4 h-4 rounded-full object-cover shrink-0" />
              <Plus v-else :size="14" class="text-om-gray-400 shrink-0" />
              <span class="truncate">{{ d.replace(/^\+\s*/, '') }}</span>
            </button>
          </div>
        </template>
      </div>
      <div class="px-1 mb-1">
        <button
          @click="goHome"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-normal text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-colors cursor-pointer"
        >
          <Plus :size="18" class="shrink-0" />
          New task
        </button>
      </div>
    </template>

    <template #sidebar-recents>
      <RecentsList />
    </template>

    <template #content>
      <slot />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import { ChevronDown, Plus, LayoutGrid, Users, TrendingUp } from 'lucide-vue-next'
import DashboardLayout from './layouts/DashboardLayout.vue'
import RecentsList from './RecentsList.vue'

// passthrough: render only the content slot (no shell) — keeps public/logged-out flows full-screen.
// fullBleed: no content padding + white bg (for the chat/editor); off → padded gray canvas (list pages).
// activeItem: which nav item is highlighted.
defineProps({
  passthrough: { type: Boolean, default: false },
  fullBleed: { type: Boolean, default: false },
  activeItem: { type: String, default: '' },
})

// No "Home" item: "New task" above the menu is the home / new-conversation entry.
const sidebarMenu = [
  { id: 'experiences', label: 'Experiences', iconComponent: markRaw(LayoutGrid), to: 'agentic/experiences' },
  { id: 'analytics', label: 'Insights', iconComponent: markRaw(TrendingUp), to: 'agentic/insights' },
  { id: 'audience', label: 'Audience', iconComponent: markRaw(Users) },
]
const onSidebarMenu = (id) => {
  if (id === 'experiences') window.location.hash = '#/agentic/experiences'
}
const goHome = () => { window.location.hash = '#/agentic/home' }
const selectedDomain = ref('reflexshop.hu')
const domains = ref(['reflexshop.hu', 'telekom.hu', '+ Add new domain'])
const domainMenuOpen = ref(false)
const userAvatar = 'https://api.dicebear.com/9.x/thumbs/svg?seed=Csaba&backgroundColor=ffe0cc'
</script>
