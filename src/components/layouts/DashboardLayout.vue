<template>
  <slot v-if="passthrough" name="content"></slot>
  <div v-else class="h-screen-safe flex overflow-hidden relative" :style="{ backgroundColor: backgroundColor }">
    <!-- Left Sidebar - Always visible -->
    <aside v-show="!hideSidebar" :class="[
      'sidebar-enter fixed left-0 top-0 h-screen-safe w-19 bg-white flex flex-col items-center pt-6 pb-4 z-30',
      { 'border-r border-[#E5E7EB]': !hideSidebarBorder }
    ]">
      <!-- Logo -->
      <button @click="$emit('logo-click'); navigateTo('home')" class="w-7 h-7 mb-5 flex items-center justify-center">
        <img src="/icons/optimonk-logo.svg" alt="OptiMonk" class="w-full h-full" />
      </button>

      <!-- Navigation Menu -->
      <nav ref="navRef" class="flex-1 flex flex-col w-full px-1 gap-1 overflow-hidden">
        <button
          v-for="item in visibleMenuItems"
          :key="item.id"
          data-nav-item
          @click="handleMenuClick(item.id)"
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

        <!-- More button (shown when items overflow) -->
        <button
          v-if="overflowMenuItems.length > 0"
          ref="moreButtonRef"
          @click="toggleMorePopover"
          :class="[
            'w-full py-2 flex flex-col items-center gap-0.5 transition-colors cursor-pointer rounded-xl',
            showMorePopover
              ? 'bg-om-orange-100 text-om-orange-500'
              : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'
          ]"
        >
          <MoreHorizontal :size="20" />
          <span class="text-[10px] font-medium text-center leading-tight">More</span>
        </button>
      </nav>

      <!-- Bottom section -->
      <div class="flex flex-col items-center gap-3 mt-auto pb-4">
        <!-- AI Chat button (optional) -->
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

        <!-- Profile Avatar -->
          <button
            @click="showProfilePopover = !showProfilePopover"
            class="w-7 h-7 rounded-full bg-om-gray-500 flex items-center justify-center text-white text-xs font-medium overflow-hidden hover:ring-2 hover:ring-om-gray-500/30 transition-all cursor-pointer"
          >
            <span>TS</span>
          </button>
      </div>
    </aside>

    <!-- Click outside overlay -->
    <div
      v-if="showProfilePopover || showMorePopover"
      class="fixed inset-0 z-40"
      @click="showProfilePopover = false; showMorePopover = false"
    ></div>

    <!-- Profile Popover (teleported outside aside stacking context) -->
    <Teleport to="body">
      <transition name="popover-fade">
        <div
          v-if="showProfilePopover"
          class="fixed bottom-8-safe left-20 w-md bg-white rounded-2xl shadow-xl border border-om-gray-100 overflow-hidden z-50"
        >
          <!-- User info header -->
          <div class="px-4 py-4 border-b border-om-gray-100">
            <p class="text-sm font-semibold text-om-gray-700 truncate">Tibor Szabó</p>
            <p class="text-xs text-om-gray-400 truncate">tibor.szabo+62@optimonk.com</p>
          </div>

          <!-- Two column section -->
          <div class="flex">
            <!-- Left: nav links -->
            <div class="flex flex-col py-2 px-2 border-r border-om-gray-100 shrink-0 w-52">
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Subscription</button>
              <button @click="navigateTo('settings')" class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Settings</button>
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Invite your team</button>
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Ambassador program</button>
              <button class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Sign out</button>
            </div>

            <!-- Right: subscription info -->
            <div class="flex-1 py-3 px-4 space-y-3">
              <!-- Plan -->
              <div class="flex items-center justify-between gap-2 mb-5">
                <span class="text-xs text-om-gray-400 whitespace-nowrap">My plan</span>
                <span class="text-xs font-medium text-om-gray-700">Free</span>
              </div>

              <!-- Pageviews -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-om-gray-400">Pageviews</span>
                  <span class="text-xs font-medium text-om-gray-700">0 / 10,000</span>
                </div>
                <div class="h-1.5 bg-om-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-om-orange-400 rounded-full" style="width: 0%"></div>
                </div>
              </div>

              <!-- Active sites -->
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

    <!-- More items popover (teleported outside aside stacking context) -->
    <Teleport to="body">
      <transition name="popover-fade">
        <div
          v-if="showMorePopover"
          class="fixed left-20 w-44 bg-white rounded-xl shadow-xl border border-om-gray-100 overflow-hidden z-50"
          :style="{ top: morePopoverTop + 'px' }"
        >
          <div class="flex flex-col py-2 px-2">
            <button
              v-for="item in overflowMenuItems"
              :key="item.id"
              @click="handleMenuClick(item.id); showMorePopover = false"
              :class="[
                'px-2 py-2.5 text-sm font-medium text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg flex items-center gap-2',
                activeItem === item.id
                  ? 'bg-om-orange-100 text-om-orange-500'
                  : 'text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200'
              ]"
            >
              <component :is="item.iconComponent" :size="16" class="shrink-0" />
              <span>{{ item.label.replace('\n', ' ') }}</span>
            </button>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Main Content Area -->
    <main class="w-full flex overflow-hidden" :class="{ 'ml-19': !hideSidebar }">
      <slot name="left-panel"></slot>
      <div ref="contentDivRef" class="flex-1 overflow-y-auto min-w-0 transition-all duration-300 max-960:text-sm" :class="noContentPadding ? '' : ['py-8 max-960:py-4', leftPanelOpen ? 'pl-6 max-960:pl-4' : 'pl-12 max-960:pl-6', rightPanelCollapsed ? 'pr-10 max-960:pr-4' : 'pr-12 max-960:pr-4']">
        <slot name="content"></slot>
      </div>
      <slot name="right-panel"></slot>
    </main>
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Home, LayoutGrid, Users, TrendingUp, BookOpen, GitBranch, Bell, LayoutTemplate, MoreHorizontal } from 'lucide-vue-next'

const showProfilePopover = ref(false)

const contentDivRef = ref(null)

// Nav overflow refs
const navRef = ref(null)
const moreButtonRef = ref(null)
const navAvailableHeight = ref(0)
const itemHeights = ref([])
const showMorePopover = ref(false)
const morePopoverTop = ref(0)

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
  },
  rightPanelCollapsed: {
    type: Boolean,
    default: false
  },
  hideSidebar: {
    type: Boolean,
    default: false
  },
  showAiButton: {
    type: Boolean,
    default: false
  },
  leftPanelOpen: {
    type: Boolean,
    default: false
  },
  passthrough: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['logo-click', 'menu-click', 'ai-click'])

const activeItem = ref(props.activeMenuItem)

watch(() => props.activeMenuItem, (newValue) => {
  activeItem.value = newValue
})

const handleMenuClick = (itemId) => {
  activeItem.value = itemId
  emit('menu-click', itemId)
}

const navigateTo = (view) => {
  showProfilePopover.value = false
  window.location.hash = '#/' + view
}

const menuItems = [
  { id: 'home', label: 'Home', iconComponent: Home },
  { id: 'campaigns', label: 'Campaigns', iconComponent: LayoutGrid },
  { id: 'audience', label: 'Audience', iconComponent: Users },
  { id: 'insights', label: 'Analytics', iconComponent: TrendingUp },
  { id: 'library', label: 'Library', iconComponent: BookOpen },
  { id: 'settings', label: 'A/B Tests', iconComponent: GitBranch },
  { id: 'template-manager', label: 'Template\nmanager', iconComponent: LayoutTemplate }
]

// How many menu items fit in the available nav height
const visibleCount = computed(() => {
  if (!itemHeights.value.length || !navAvailableHeight.value) return menuItems.length

  const available = navAvailableHeight.value
  const heights = itemHeights.value
  const n = menuItems.length
  const gap = 4 // gap-1 = 4px

  // Check if all items fit without a More button
  const totalAll = heights.slice(0, n).reduce((sum, h, i) => sum + h + (i > 0 ? gap : 0), 0)
  if (totalAll <= available) return n

  // Find how many items fit alongside the More button
  // Layout: item[0] [gap item[1]] ... [gap item[count-1]] gap More
  const moreH = heights[0] || 60
  let used = 0
  let count = 0

  for (let i = 0; i < n; i++) {
    const h = heights[i] || 60
    const thisItem = (i > 0 ? gap : 0) + h
    const moreAfter = gap + moreH

    if (used + thisItem + moreAfter <= available) {
      used += thisItem
      count++
    } else {
      break
    }
  }

  return Math.max(0, count)
})

const visibleMenuItems = computed(() => menuItems.slice(0, visibleCount.value))
const overflowMenuItems = computed(() => menuItems.slice(visibleCount.value))

const toggleMorePopover = () => {
  showMorePopover.value = !showMorePopover.value
  if (showMorePopover.value && moreButtonRef.value) {
    const rect = moreButtonRef.value.getBoundingClientRect()
    morePopoverTop.value = rect.top
  }
}

let resizeObserver = null
onMounted(async () => {
  await nextTick()
  if (navRef.value) {
    // Measure all item heights while they're all rendered
    const buttons = navRef.value.querySelectorAll('[data-nav-item]')
    itemHeights.value = Array.from(buttons).map(b => b.offsetHeight)
    navAvailableHeight.value = navRef.value.clientHeight

    resizeObserver = new ResizeObserver(() => {
      if (navRef.value) navAvailableHeight.value = navRef.value.clientHeight
    })
    resizeObserver.observe(navRef.value)
  }

})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<style scoped>
.popover-fade-enter-active,
.popover-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
