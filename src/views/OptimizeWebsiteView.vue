<template>
  <DashboardLayout active-menu-item="campaigns" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="relative h-full">

        <!-- Back -->
        <button
          class="absolute top-0 left-0 flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 transition-colors"
          @click="$emit('back')"
        >
          <ChevronLeft :size="18" />
          Back
        </button>

      <div class="max-w-2xl mx-auto py-10 px-4">

        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-10 text-center">
          How would you like to optimize your website?
        </h1>

        <!-- Optimize section -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-om-gray-700 mb-3">Optimize</h2>
          <div class="flex flex-col gap-3">
            <div
              v-for="item in optimizeItems"
              :key="item.title"
              class="flex items-center gap-4 px-6 py-4 bg-white border-2 border-om-gray-200 rounded-xl cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all duration-200"
              @click="item.type === 'product-page-optimizer' ? $emit('navigate', 'ppo-campaign-flow') : $emit('select', item.type)"
            >
              <div class="w-12 h-12 rounded-full bg-om-peach-50 flex items-center justify-center shrink-0">
                <component :is="item.icon" :size="22" class="text-om-orange-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-base font-semibold text-om-gray-700">{{ item.title }}</span>
                </div>
                <p class="text-sm text-om-gray-400">{{ item.description }}</p>
              </div>
              <ChevronRight :size="18" class="text-om-gray-300 shrink-0" />
            </div>
          </div>
        </div>

        <!-- Personalize section -->
        <div>
          <h2 class="text-lg font-semibold text-om-gray-700 mb-3">Personalize</h2>
          <div class="flex flex-col gap-3">
            <div
              v-for="item in personalizeItems"
              :key="item.title"
              class="flex items-center gap-4 px-6 py-4 bg-white border-2 border-om-gray-200 rounded-xl cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all duration-200"
              @click="$emit('select', item.type)"
            >
              <div class="w-12 h-12 rounded-full bg-om-peach-50 flex items-center justify-center shrink-0">
                <component :is="item.icon" :size="22" class="text-om-orange-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-base font-semibold text-om-gray-700">{{ item.title }}</span>
                  <span v-if="item.badge === 'upgrade'" class="text-xs font-semibold bg-[#7C3AED] text-white px-2 py-0.5 rounded-md">Upgrade</span>
                </div>
                <p class="text-sm text-om-gray-400">{{ item.description }}</p>
              </div>
              <ChevronRight :size="18" class="text-om-gray-300 shrink-0" />
            </div>
          </div>
        </div>

      </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import { ChevronLeft, ChevronRight, Columns2, GitBranch, ShoppingBag, LayoutGrid, UserRound, Megaphone } from 'lucide-vue-next'

defineEmits(['menu-click', 'back', 'select', 'navigate'])

const optimizeItems = [
  {
    type: 'ab-test',
    title: 'A/B test',
    description: 'A/B test two or more versions of a page against each other.',
    icon: Columns2,
    badge: null,
  },
  {
    type: 'split-url',
    title: 'Split URL test',
    description: 'Test two different versions of your landing page.',
    icon: GitBranch,
    badge: null,
  },
  {
    type: 'product-page-optimizer',
    title: 'Product Page Optimizer',
    description: 'Optimize your product pages with AI-powered copy.',
    icon: ShoppingBag,
    badge: 'upgrade',
  },
  {
    type: 'multi-campaign-ab',
    title: 'Multi-campaign A/B test',
    description: 'Test campaign combinations against each other.',
    icon: LayoutGrid,
    badge: null,
  },
]

const personalizeItems = [
  {
    type: 'personalization',
    title: 'Personalization',
    description: 'Create a personalized version of a page for specific segments.',
    icon: UserRound,
    badge: null,
  },
  {
    type: 'auto-personalization',
    title: 'Auto Personalization',
    description: 'Automatically personalize your landing pages for your ads.',
    icon: Megaphone,
    badge: 'upgrade',
  },
]
</script>
