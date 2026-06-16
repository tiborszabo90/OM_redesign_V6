<template>
  <slot v-if="passthrough" name="content"></slot>
  <div v-else class="h-screen-safe flex overflow-hidden relative" :style="{ backgroundColor: backgroundColor }">
    <!-- Left Sidebar - Always visible -->
    <aside v-show="!hideSidebar" :class="[
      'sidebar-enter fixed left-0 top-0 h-screen-safe bg-white flex flex-col z-30',
      wideSidebar ? 'w-60 items-stretch px-3 pt-4 pb-2' : 'w-19 items-center pt-6 pb-4',
      { 'border-r border-[#E5E7EB]': !hideSidebarBorder }
    ]">
      <!-- Logo -->
      <button @click="$emit('logo-click'); navigateTo(wideSidebar ? 'agentic/home' : 'optimonk/home-old')" :class="['flex items-center', wideSidebar ? 'mb-2 h-8 pl-4' : 'mb-5 w-7 h-7 justify-center']">
        <img v-if="wideSidebar" src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-6 w-auto shrink-0" />
        <img v-else :src="logoSrc || '/icons/optimonk-logo.svg'" alt="OptiMonk" class="w-7 h-7 shrink-0" />
      </button>

      <!-- Optional sidebar-top content (e.g. a domain/workspace switcher) -->
      <slot name="sidebar-top" />

      <!-- Navigation + recents share one scroll area when a recents slot is present -->
      <div :class="['w-full min-h-0 flex-1 flex flex-col sidebar-scroll', $slots['sidebar-recents'] ? 'overflow-y-auto' : 'overflow-hidden']">
      <nav ref="navRef" :class="['flex flex-col w-full px-1 gap-1', $slots['sidebar-recents'] ? 'shrink-0' : 'flex-1 overflow-hidden']">
        <template v-for="item in visibleMenuItems" :key="item.id">
        <button
          data-nav-item
          @click="handleMenuClick(item.id, $event)"
          :class="[
            'w-full transition-colors cursor-pointer',
            wideSidebar ? 'rounded-lg flex items-center gap-2.5 px-3 py-2' : 'rounded-xl py-2 flex flex-col items-center gap-0.5',
            (activeItem === item.id || submenuOpenId === item.id)
              ? (wideSidebar ? 'bg-om-gray-100 text-om-gray-700' : 'bg-om-orange-100 text-om-orange-500')
              : (wideSidebar ? 'text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700' : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600')
          ]"
        >
          <component :is="item.iconComponent" :size="wideSidebar ? 18 : 20" class="shrink-0" />
          <span :class="wideSidebar ? 'text-sm font-normal' : 'text-[10px] font-medium whitespace-pre-line text-center leading-tight'">{{ item.label }}</span>
        </button>

        <!-- Inline (accordion) children -->
        <template v-if="submenuDisplay === 'inline' && item.children && submenuOpenId === item.id">
          <button
            v-for="child in item.children"
            :key="child.id"
            @click="handleSubmenuChildClick(item.id, child)"
            :class="[
              'w-full text-left text-sm rounded-lg transition-colors cursor-pointer',
              wideSidebar ? 'pl-10 pr-3 py-1.5' : 'px-1 py-1 text-[10px] text-center leading-tight',
              activeItem === child.id ? 'text-om-orange-500 font-medium' : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-700'
            ]"
          >{{ child.label.replace('\n', ' ') }}</button>
        </template>
        </template>

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

      <!-- Recent conversations scroll together with the nav -->
      <div v-if="$slots['sidebar-recents']" class="px-1 mt-3">
        <slot name="sidebar-recents" />
      </div>
      </div>

      <!-- Bottom section -->
      <!-- Wide sidebar: full-width profile button (matches the rest); the bell is a trailing icon over it -->
      <div v-if="wideSidebar" class="mt-auto px-1 pb-1 relative">
        <button
          @click="showProfilePopover = !showProfilePopover"
          class="w-full flex items-center gap-2 px-3 py-2 pr-11 rounded-lg hover:bg-om-gray-100 transition-colors cursor-pointer"
        >
          <span class="w-7 h-7 rounded-full bg-om-gray-500 flex items-center justify-center text-white text-xs font-medium shrink-0 overflow-hidden">
            <img v-if="userAvatar" :src="userAvatar" alt="" class="w-full h-full object-cover" />
            <template v-else>{{ userInitials }}</template>
          </span>
          <span class="flex-1 min-w-0 text-sm font-normal text-om-gray-700 truncate text-left">{{ userName || 'Account' }}</span>
        </button>
        <button
          @click.stop
          class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-om-gray-400 hover:text-om-gray-600 hover:bg-om-gray-200 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell :size="18" />
        </button>
      </div>

      <!-- Narrow sidebar: stacked icon buttons -->
      <div v-else class="flex flex-col items-center gap-3 mt-auto pt-12 pb-4">
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
          <img v-if="userAvatar" :src="userAvatar" alt="" class="w-full h-full object-cover" />
          <span v-else>{{ userInitials }}</span>
        </button>
      </div>
    </aside>

    <!-- Click outside overlay -->
    <div
      v-if="showProfilePopover || showMorePopover || submenuOpenId"
      class="fixed inset-0 z-40"
      @click="showProfilePopover = false; showMorePopover = false; submenuOpenId = null"
    ></div>

    <!-- Submenu flyout popover (teleported outside aside stacking context) -->
    <Teleport to="body">
      <transition name="popover-fade">
        <div
          v-if="submenuParent && submenuDisplay !== 'inline'"
          class="fixed left-20 w-56 bg-white rounded-xl shadow-xl border border-om-gray-100 overflow-hidden z-50"
          :style="{ top: submenuTop + 'px' }"
        >
          <div class="flex flex-col py-1 px-2">
            <button
              v-for="child in submenuParent.children"
              :key="child.id"
              @click="handleSubmenuChildClick(submenuParent.id, child)"
              :class="[
                'px-2 py-2 text-sm font-medium text-left cursor-pointer transition-colors rounded-lg',
                activeItem === child.id ? 'bg-om-orange-100 text-om-orange-500' : 'text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200'
              ]"
            >{{ child.label.replace('\n', ' ') }}</button>
          </div>
        </div>
      </transition>
    </Teleport>

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
              <button @click="navigateTo('subscription')" class="px-2 py-1.5 text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 active:bg-om-gray-200 text-left cursor-pointer transition-colors whitespace-nowrap rounded-lg">Subscription</button>
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
    <main class="w-full flex overflow-hidden" :class="{ 'ml-60': !hideSidebar && wideSidebar, 'ml-19': !hideSidebar && !wideSidebar }">
      <slot name="left-panel"></slot>
      <div ref="contentDivRef" :class="[contentHidden ? 'w-0 overflow-hidden opacity-0' : 'flex-1 overflow-y-auto min-w-0 max-960:text-sm', 'transition-all duration-300', !contentHidden && !noContentPadding ? ['py-8 max-960:py-4', leftPanelOpen ? 'pl-6 max-960:pl-4' : 'pl-12 max-960:pl-6', rightPanelCollapsed ? 'pr-10 max-960:pr-4' : 'pr-12 max-960:pr-4'] : '']">
        <slot name="content"></slot>
      </div>
      <slot name="right-panel"></slot>
    </main>
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Home, LayoutGrid, Users, TrendingUp, BookOpen, GitBranch, Bell, LayoutTemplate, MoreHorizontal, Lightbulb } from 'lucide-vue-next'

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
  },
  contentHidden: {
    type: Boolean,
    default: false
  },
  menuItemIds: {
    type: Array,
    default: null
  },
  // Traditional wide sidebar (icon + label rows) instead of the narrow icon rail
  wideSidebar: {
    type: Boolean,
    default: false
  },
  // Custom menu list override: [{ id, label, iconComponent, children? }]
  // A nav item may carry `children: [{ id, label }]` to expose a submenu.
  navItems: {
    type: Array,
    default: null
  },
  // How a nav item's `children` are revealed: 'flyout' (popover next to the
  // rail) or 'inline' (accordion rows expanded under the item). Default off-path
  // for items without children, so existing callers are unaffected.
  submenuDisplay: {
    type: String,
    default: 'flyout'
  },
  // Override the narrow-sidebar logo (defaults to the OptiMonk mark).
  logoSrc: {
    type: String,
    default: ''
  },
  // Profile shown at the bottom of a wide sidebar
  userName: {
    type: String,
    default: ''
  },
  userInitials: {
    type: String,
    default: 'TS'
  },
  // Optional avatar image URL (e.g. a DiceBear avatar); falls back to initials
  userAvatar: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['logo-click', 'menu-click', 'ai-click'])

const activeItem = ref(props.activeMenuItem)

watch(() => props.activeMenuItem, (newValue) => {
  activeItem.value = newValue
})

// Submenu (children) state — used by flyout/inline submenu items.
const submenuOpenId = ref(null)
const submenuTop = ref(0)
const submenuParent = computed(() => menuItems.value.find((m) => m.id === submenuOpenId.value) || null)

const handleMenuClick = (itemId, event) => {
  const item = menuItems.value.find((m) => m.id === itemId)
  // Items with children reveal a submenu instead of navigating directly.
  if (item && item.children && item.children.length) {
    if (submenuOpenId.value === itemId) {
      submenuOpenId.value = null
    } else {
      submenuOpenId.value = itemId
      if (event && event.currentTarget) submenuTop.value = event.currentTarget.getBoundingClientRect().top
    }
    return
  }
  activeItem.value = itemId
  submenuOpenId.value = null
  // Nav items may declare their destination via `to` (a hash slug); navigate directly.
  if (item && item.to) window.location.hash = '#/' + item.to
  emit('menu-click', itemId)
}

const handleSubmenuChildClick = (parentId, child) => {
  activeItem.value = parentId
  submenuOpenId.value = null
  if (child.to) window.location.hash = '#/' + child.to
  emit('menu-click', child.id)
}

const navigateTo = (view) => {
  showProfilePopover.value = false
  window.location.hash = '#/' + view
}

const allMenuItems = [
  { id: 'home', label: 'Home', iconComponent: Home },
  { id: 'campaigns', label: 'Campaigns', iconComponent: LayoutGrid },
  { id: 'audience', label: 'Audience', iconComponent: Users },
  { id: 'insights', label: 'Insights', iconComponent: Lightbulb },
  { id: 'analytics', label: 'Analytics', iconComponent: TrendingUp },
  { id: 'library', label: 'Library', iconComponent: BookOpen },
  { id: 'settings', label: 'A/B Tests', iconComponent: GitBranch },
  { id: 'template-manager', label: 'Template\nmanager', iconComponent: LayoutTemplate }
]

const menuItems = computed(() =>
  props.navItems
    ? props.navItems
    : props.menuItemIds
      ? allMenuItems.filter((item) => props.menuItemIds.includes(item.id))
      : allMenuItems
)

// How many menu items fit in the available nav height
const visibleCount = computed(() => {
  // Wide sidebar always shows every item: there's room, and the stacked "More"
  // button is a narrow-mode affordance that looks wrong here.
  if (props.wideSidebar) return menuItems.value.length
  if (!itemHeights.value.length || !navAvailableHeight.value) return menuItems.value.length

  const available = navAvailableHeight.value
  const heights = itemHeights.value
  const n = menuItems.value.length
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

const visibleMenuItems = computed(() => menuItems.value.slice(0, visibleCount.value))
const overflowMenuItems = computed(() => menuItems.value.slice(visibleCount.value))

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
/* Hide the sidebar scroll bar so nav + recents use the full width (hover rects match the rest) */
.sidebar-scroll {
  scrollbar-width: none;
}
.sidebar-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
