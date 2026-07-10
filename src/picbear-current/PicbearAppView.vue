<script setup>
import { computed } from 'vue'
import { state } from './store'
import './picbear.css'
import {
  Home, Package, Tag, Users, TrendingUp, Percent, FileText, Globe,
  Landmark, BarChart3, Store, Bot, Settings, Search, Bell, Inbox,
  ChevronRight, PawPrint, CornerDownRight,
} from 'lucide-vue-next'
import HomeScreen from './screens/HomeScreen.vue'
import StyleScreen from './screens/StyleScreen.vue'
import PlacementScreen from './screens/PlacementScreen.vue'
import ProductsScreen from './screens/ProductsScreen.vue'
import GenerateScreen from './screens/GenerateScreen.vue'
import ReviewScreen from './screens/ReviewScreen.vue'
import FineTuneScreen from './screens/FineTuneScreen.vue'
import EnableScreen from './screens/EnableScreen.vue'
import DoneScreen from './screens/DoneScreen.vue'
import VariationsScreen from './screens/VariationsScreen.vue'
import VariationDetailScreen from './screens/VariationDetailScreen.vue'
import ABTestsScreen from './screens/ABTestsScreen.vue'

// Passed by the host App.vue for product views; not used internally.
defineProps({ product: { type: String, default: 'picbear' } })
defineEmits(['navigate'])

const mainNav = [
  { label: 'Home', icon: Home },
  { label: 'Orders', icon: Package },
  { label: 'Products', icon: Tag },
  { label: 'Customers', icon: Users },
  { label: 'Growth', icon: TrendingUp },
  { label: 'Discounts', icon: Percent },
  { label: 'Content', icon: FileText },
  { label: 'Markets', icon: Globe },
  { label: 'Finance', icon: Landmark },
  { label: 'Analytics', icon: BarChart3 },
]
const channels = [
  { label: 'Online Store', icon: Store },
  { label: 'Agentic', icon: Bot },
]
const appTabs = [
  { id: 'home', label: 'Home' },
  { id: 'variations', label: 'Variations' },
  { id: 'abtests', label: 'A/B Tests' },
]

const wizardScreens = {
  home: HomeScreen,
  style: StyleScreen,
  placement: PlacementScreen,
  products: ProductsScreen,
  generate: GenerateScreen,
  review: ReviewScreen,
  finetune: FineTuneScreen,
  enable: EnableScreen,
  done: DoneScreen,
}

const screenComponent = computed(() => {
  if (state.appTab === 'variations') {
    return state.variationDetailId ? VariationDetailScreen : VariationsScreen
  }
  if (state.appTab === 'abtests') return ABTestsScreen
  return wizardScreens[state.screen] || HomeScreen
})

function goTab(id) {
  if (id === 'variations') state.variationDetailId = null
  state.appTab = id
}
</script>

<template>
  <div
    class="h-screen flex flex-col overflow-hidden bg-[#f1f1f1] text-[13px] text-[#303030] antialiased"
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif"
  >
    <!-- Top bar -->
    <header class="h-14 shrink-0 bg-[#1a1a1a] flex items-center px-4 gap-4">
      <div class="flex items-center gap-2 w-56 shrink-0">
        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="#95BF47"><path d="M19.2 5.6c0-.1-.1-.2-.2-.2s-1.6-.1-1.6-.1-1.2-1.2-1.4-1.3c-.1-.1-.4-.1-.5 0l-.7.2c-.4-1.2-1.2-2.3-2.5-2.3h-.1c-.4-.5-.8-.7-1.2-.7C8.3 1.2 7 4.6 6.6 6.3l-2 .6c-.6.2-.6.2-.7.8L2.3 19.9 14 22l6.3-1.4S19.2 5.7 19.2 5.6zM12.2 4.5l-1 .3v-.2c0-.7-.1-1.2-.2-1.6C11.6 3.1 12 3.7 12.2 4.5zM10.4 3.1c.2.4.3 1 .3 1.8v.1l-2.1.6C9 4.1 9.8 3.3 10.4 3.1zM9.6 2.3c.1 0 .2 0 .4.1-.8.4-1.6 1.3-2 3.2l-1.6.5C6.8 4.6 7.9 2.3 9.6 2.3z"/></svg>
        <span class="text-white font-bold text-[15px] tracking-tight">shopify</span>
        <span class="text-[11px] text-[#b5b5b5] border border-[#4a4a4a] rounded-full px-2 py-0.5">Spring '26</span>
      </div>
      <div class="flex-1 max-w-2xl mx-auto">
        <div class="flex items-center gap-2 bg-[#303030] text-[#b5b5b5] rounded-lg px-3 py-1.5">
          <Search :size="14" />
          <span class="flex-1 text-[13px]">Search</span>
          <span class="text-[11px] border border-[#4a4a4a] rounded px-1">⌘</span>
          <span class="text-[11px] border border-[#4a4a4a] rounded px-1">K</span>
        </div>
      </div>
      <div class="flex items-center gap-3 w-56 shrink-0 justify-end">
        <Inbox :size="16" class="text-[#b5b5b5]" />
        <Bell :size="16" class="text-[#b5b5b5]" />
        <div class="flex items-center gap-2 bg-[#303030] rounded-lg pl-1 pr-2 py-1">
          <span class="w-6 h-6 rounded-md bg-[#36c98e] text-[#0c3a26] text-[10px] font-bold flex items-center justify-center">RC</span>
          <span class="text-white text-[12px] font-medium">roast-and-co</span>
        </div>
      </div>
    </header>

    <div class="flex-1 flex min-h-0">
      <!-- Sidebar -->
      <aside class="w-60 shrink-0 bg-[#ebebeb] flex flex-col text-[13px]">
        <nav class="flex-1 overflow-y-auto px-3 py-2">
          <div
            v-for="item in mainNav" :key="item.label"
            class="flex items-center gap-2 px-2 py-1 rounded-lg text-[#303030] font-medium hover:bg-[#e0e0e0] cursor-pointer"
          >
            <component :is="item.icon" :size="15" class="text-[#5c5c5c]" />
            {{ item.label }}
          </div>

          <div class="flex items-center justify-between px-2 pt-3 pb-0.5 text-[12px] font-semibold text-[#616161]">
            Sales channels <ChevronRight :size="12" />
          </div>
          <div
            v-for="item in channels" :key="item.label"
            class="flex items-center gap-2 px-2 py-1 rounded-lg text-[#303030] font-medium hover:bg-[#e0e0e0] cursor-pointer"
          >
            <component :is="item.icon" :size="15" class="text-[#5c5c5c]" />
            {{ item.label }}
          </div>

          <div class="flex items-center justify-between px-2 pt-3 pb-0.5 text-[12px] font-semibold text-[#616161]">
            Apps <ChevronRight :size="12" />
          </div>
          <div class="flex items-center gap-2 px-2 py-1 rounded-lg font-medium text-[#303030]">
            <span class="w-5 h-5 rounded-md bg-[#5548e0] flex items-center justify-center">
              <PawPrint :size="12" class="text-white" />
            </span>
            Picbear
          </div>
          <div
            v-for="tab in appTabs" :key="tab.id"
            @click="goTab(tab.id)"
            class="flex items-center gap-2 pl-4 pr-2 py-1 rounded-lg font-medium cursor-pointer"
            :class="state.appTab === tab.id ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#4a4a4a] hover:bg-[#e0e0e0]'"
          >
            <CornerDownRight v-if="tab.id === 'home'" :size="12" class="text-[#8a8a8a]" />
            <span v-else class="w-3"></span>
            {{ tab.label }}
          </div>
        </nav>

        <div class="px-3 pb-2">
          <div class="flex items-center gap-2 px-2 py-[5px] rounded-lg text-[#303030] font-medium hover:bg-[#e0e0e0] cursor-pointer">
            <Settings :size="15" class="text-[#5c5c5c]" />
            Settings
          </div>
        </div>

        <!-- Trial pb-card -->
        <div class="p-3 pt-1">
          <div class="bg-[#1a1a1a] rounded-xl p-3 text-white">
            <template v-if="!state.published">
              <p class="text-[12px] text-[#b5b5b5]">Trial ends in 3 days</p>
              <p class="text-[13px] font-semibold mb-2">Explore Picbear freely</p>
              <button class="w-full bg-white text-[#1a1a1a] rounded-lg py-1.5 text-[12px] font-semibold cursor-pointer hover:bg-[#f1f1f1]">Select a plan</button>
            </template>
            <template v-else>
              <p class="text-[12px] text-[#b5b5b5]">10 AI images live</p>
              <p class="text-[13px] font-semibold mb-2">Keep them running</p>
              <button class="w-full bg-[#36c98e] text-[#0c3a26] rounded-lg py-1.5 text-[12px] font-semibold cursor-pointer hover:brightness-105">Subscribe for €1</button>
            </template>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0 overflow-y-auto bg-[#f1f1f1]">
        <component :is="screenComponent" />
      </main>
    </div>
  </div>
</template>
