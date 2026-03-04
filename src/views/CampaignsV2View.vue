<template>
  <DashboardLayout
    active-menu-item="campaigns"
    :hide-sidebar-border="true"
    :no-content-padding="true"
    background-color="#FFFFFF"
    @logo-click="handleLogoClick"
    @menu-click="$emit('menu-click', $event)"
  >
    <template #content>
      <div class="ml-5 mt-6 mr-6 mb-6 bg-om-gray-50 rounded-2xl p-6">
        <div class="w-full max-w-[1400px] mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-om-gray-700">Campaigns (32)</h1>
          <Button variant="primary" size="sm">New Campaign</Button>
        </div>

        <!-- Filters and Controls -->
        <div class="flex items-center justify-between mb-6">
          <!-- Left: Domain dropdown and Tab filters -->
          <div class="flex items-center gap-3">
            <!-- Domain dropdown -->
            <Dropdown
              v-model="selectedDomain"
              :options="domains"
              class="w-[240px]"
            >
              <template #icon>
                <div class="w-6 h-6 rounded-full overflow-hidden">
                  <img src="/demos/telekom/logo.png" alt="Telekom" class="w-full h-full object-cover" />
                </div>
              </template>
            </Dropdown>

            <!-- Tab filters -->
            <div class="flex items-center gap-2">
              <button class="chip px-3 py-2 rounded-lg bg-white border border-om-gray-200 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                Active
              </button>
              <button class="chip px-3 py-2 rounded-lg bg-white border border-om-gray-200 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                Archive
              </button>
              <button class="chip px-3 py-2 rounded-lg bg-white border border-om-gray-200 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                Service
              </button>
              <button class="chip w-9 h-9 flex items-center justify-center bg-white border border-om-gray-200 text-om-gray-700 rounded-lg cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                <Plus :size="16" />
              </button>
            </div>
          </div>

          <!-- Right: View controls and dropdown -->
          <div class="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon-only
              :active="viewMode === 'grid'"
              @click="viewMode = viewMode === 'list' ? 'grid' : 'list'"
            >
              <template #icon><LayoutGrid :size="18" /></template>
            </Button>
            <Button variant="ghost" size="sm" icon-only>
              <template #icon><Search :size="18" /></template>
            </Button>
            <Button variant="ghost" size="sm" icon-only>
              <template #icon><ArrowUpDown :size="18" /></template>
            </Button>
            <Dropdown
              v-model="selectedTimeFilter"
              :options="timeFilterOptions"
              class="w-[240px]"
            >
              <template #icon>
                <Calendar :size="20" class="text-om-gray-600" />
              </template>
            </Dropdown>
          </div>
        </div>

        <!-- Campaign Cards List View -->
        <div v-if="viewMode === 'list'" class="space-y-4">
          <!-- Campaign Card 1 -->
          <div class="relative">
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign1'"
                @click.stop="campaign1Selected = !campaign1Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign1Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign1Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card with integrated hover zone -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
            <!-- Left hover zone overlay -->
            <div
              @mouseenter="hoveredCard = 'campaign1'"
              @mouseleave="hoveredCard = null"
              class="absolute left-0 top-0 w-32 h-full z-10"
            ></div>
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign1'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/campaigns/smart-discount-popup.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign1'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/campaigns/smart-discount-popup.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                  </div>
                </div>
              </transition>
            </div>

            <!-- Campaign Info -->
            <div class="flex-1 min-w-50">
              <h3 class="text-base font-semibold text-om-gray-700 mb-1">Smart Discount Popup</h3>
              <p class="text-xs text-om-gray-400">domain.com</p>
            </div>

            <!-- Metrics -->
            <div class="flex items-center gap-8">
              <div class="w-20">
                <p class="text-xs text-om-gray-400 mb-1">Impressions</p>
                <p class="text-base font-semibold text-om-gray-700">1,456</p>
              </div>
              <div class="w-16">
                <p class="text-xs text-om-gray-400 mb-1">Submits</p>
                <p class="text-base font-semibold text-om-gray-700">125</p>
              </div>
              <div class="w-20">
                <p class="text-xs text-om-gray-400 mb-1">Submit rate</p>
                <p class="text-base font-semibold text-om-gray-700">8.37%</p>
              </div>
              <div class="w-28">
                <p class="text-xs text-om-gray-400 mb-1">Conversion uplift</p>
                <p class="text-base font-semibold text-om-gray-700 flex items-center gap-1">
                  84.23%
                  <TrendingUp :size="16" class="text-[#2CC896]" />
                </p>
              </div>
            </div>

            <!-- Toggle and Last Updated -->
            <div class="flex items-center gap-4 ml-6">
              <ToggleSwitch v-model="campaign1Active" @click.stop />
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
            </div>
            </div>
          </div>

          <!-- Campaign Card 2 -->
          <div class="relative">
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign2'"
                @click.stop="campaign2Selected = !campaign2Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign2Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign2Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card with integrated hover zone -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
            <!-- Left hover zone overlay -->
            <div
              @mouseenter="hoveredCard = 'campaign2'"
              @mouseleave="hoveredCard = null"
              class="absolute left-0 top-0 w-32 h-full z-10"
            ></div>
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign2'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/campaigns/lucky-wheel.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign2'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/campaigns/lucky-wheel.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                  </div>
                </div>
              </transition>
            </div>

            <!-- Campaign Info -->
            <div class="flex-1 min-w-50">
              <h3 class="text-base font-semibold text-om-gray-700 mb-1">Lucky Wheel</h3>
              <p class="text-xs text-om-gray-400">domain.com</p>
            </div>

            <!-- Metrics -->
            <div class="flex items-center gap-8">
              <div class="w-20">
                <p class="text-xs text-om-gray-400 mb-1">Impressions</p>
                <p class="text-base font-semibold text-om-gray-700">1,456</p>
              </div>
              <div class="w-16">
                <p class="text-xs text-om-gray-400 mb-1">Submits</p>
                <p class="text-base font-semibold text-om-gray-700">125</p>
              </div>
              <div class="w-20">
                <p class="text-xs text-om-gray-400 mb-1">Submit rate</p>
                <p class="text-base font-semibold text-om-gray-700">8.37%</p>
              </div>
              <div class="w-28"></div>
            </div>

            <!-- Toggle and Last Updated -->
            <div class="flex items-center gap-4 ml-6">
              <ToggleSwitch v-model="campaign2Active" @click.stop />
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
            </div>
            </div>
          </div>

          <!-- Campaign Card 3 -->
          <div class="relative">
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign3'"
                @click.stop="campaign3Selected = !campaign3Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign3Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign3Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card with integrated hover zone -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
            <!-- Left hover zone overlay -->
            <div
              @mouseenter="hoveredCard = 'campaign3'"
              @mouseleave="hoveredCard = null"
              class="absolute left-0 top-0 w-32 h-full z-10"
            ></div>
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign3'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/campaigns/cart-abandonment-stopper.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign3'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/campaigns/cart-abandonment-stopper.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                  </div>
                </div>
              </transition>
            </div>

            <!-- Campaign Info -->
            <div class="flex-1 min-w-50">
              <h3 class="text-base font-semibold text-om-gray-700 mb-1">Cart Abandonment Stopper</h3>
              <p class="text-xs text-om-gray-400">domain.com</p>
            </div>

            <!-- Metrics -->
            <div class="flex items-center gap-8">
              <div class="w-20">
                <p class="text-xs text-om-gray-400 mb-1">Visitors</p>
                <p class="text-base font-semibold text-om-gray-700">1,456</p>
              </div>
              <div class="w-16">
                <p class="text-xs text-om-gray-400 mb-1">Submits</p>
                <p class="text-base font-semibold text-om-gray-700">125</p>
              </div>
              <div class="w-20">
                <p class="text-xs text-om-gray-400 mb-1">Submit rate</p>
                <p class="text-base font-semibold text-om-gray-700">8.37%</p>
              </div>
              <div class="w-28"></div>
            </div>

            <!-- Toggle and Last Updated -->
            <div class="flex items-center gap-4 ml-6">
              <ToggleSwitch v-model="campaign3Active" @click.stop />
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
            </div>
            </div>
          </div>

          <!-- Campaign Card 4 -->
          <div class="relative">
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign4'"
                @click.stop="campaign4Selected = !campaign4Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign4Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign4Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card with integrated hover zone -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
            <!-- Left hover zone overlay -->
            <div
              @mouseenter="hoveredCard = 'campaign4'"
              @mouseleave="hoveredCard = null"
              class="absolute left-0 top-0 w-32 h-full z-10"
            ></div>
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign4'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/campaigns/feedback-survey.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign4'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/campaigns/feedback-survey.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                  </div>
                </div>
              </transition>
            </div>

            <!-- Campaign Info -->
            <div class="flex-1 min-w-50">
              <h3 class="text-base font-semibold text-om-gray-700 mb-1">Feedback Survey</h3>
              <p class="text-xs text-om-gray-400">domain.com</p>
            </div>

            <!-- Metrics -->
            <div class="flex items-center gap-8">
              <div class="w-20">
                <p class="text-xs text-om-gray-400 mb-1">Visitors</p>
                <p class="text-base font-semibold text-om-gray-700">1,456</p>
              </div>
              <div class="w-16"></div>
              <div class="w-20"></div>
              <div class="w-28"></div>
            </div>

            <!-- Toggle and Last Updated -->
            <div class="flex items-center gap-4 ml-6">
              <ToggleSwitch v-model="campaign4Active" @click.stop />
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
            </div>
            </div>
          </div>
        </div>

        <!-- Campaign Cards Grid View -->
        <div v-else class="grid grid-cols-3 gap-4">
          <!-- Campaign Card 1 Grid -->
          <div class="relative">
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign1'"
                @click.stop="campaign1Selected = !campaign1Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign1Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign1Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
              <!-- Left hover zone overlay -->
              <div
                @mouseenter="hoveredCard = 'campaign1'"
                @mouseleave="hoveredCard = null"
                class="absolute left-0 top-0 w-32 h-full z-10"
              ></div>

              <!-- Thumbnail -->
              <div
                class="w-full h-48 bg-om-gray-100 rounded-lg overflow-hidden border border-om-gray-200 mb-4 relative"
                @mouseenter="hoveredImage = 'campaign1'"
                @mouseleave="hoveredImage = null"
              >
                <img src="/campaigns/smart-discount-popup.png" alt="Campaign preview" class="w-full h-full object-cover" />
                <!-- Tooltip -->
                <transition name="fade">
                  <div v-if="hoveredImage === 'campaign1'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                    <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                      <img src="/campaigns/smart-discount-popup.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Campaign Info -->
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-base font-semibold text-om-gray-700 mb-1">Smart Discount Popup</h3>
                  <p class="text-xs text-om-gray-400">domain.com</p>
                </div>
                <ToggleSwitch v-model="campaign1Active" @click.stop />
              </div>

              <!-- Metrics -->
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Impressions</p>
                  <p class="text-sm font-semibold text-om-gray-700">1,456</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Submits</p>
                  <p class="text-sm font-semibold text-om-gray-700">125</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Submit rate</p>
                  <p class="text-sm font-semibold text-om-gray-700">8.37%</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Conversion uplift</p>
                  <p class="text-sm font-semibold text-om-gray-700 flex items-center gap-1">
                    84.23%
                    <TrendingUp :size="14" class="text-[#2CC896]" />
                  </p>
                </div>
              </div>

              <!-- Last Updated -->
              <p class="text-xs text-om-gray-400">Last updated 14 days ago</p>
            </div>
          </div>

          <!-- Campaign Card 2 Grid -->
          <div class="relative">
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign2'"
                @click.stop="campaign2Selected = !campaign2Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign2Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign2Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
              <div
                @mouseenter="hoveredCard = 'campaign2'"
                @mouseleave="hoveredCard = null"
                class="absolute left-0 top-0 w-32 h-full z-10"
              ></div>

              <div
                class="w-full h-48 bg-om-gray-100 rounded-lg overflow-hidden border border-om-gray-200 mb-4 relative"
                @mouseenter="hoveredImage = 'campaign2'"
                @mouseleave="hoveredImage = null"
              >
                <img src="/campaigns/lucky-wheel.png" alt="Campaign preview" class="w-full h-full object-cover" />
                <transition name="fade">
                  <div v-if="hoveredImage === 'campaign2'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                    <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                      <img src="/campaigns/lucky-wheel.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                    </div>
                  </div>
                </transition>
              </div>

              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-base font-semibold text-om-gray-700 mb-1">Lucky Wheel</h3>
                  <p class="text-xs text-om-gray-400">domain.com</p>
                </div>
                <ToggleSwitch v-model="campaign2Active" @click.stop />
              </div>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Impressions</p>
                  <p class="text-sm font-semibold text-om-gray-700">2,341</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Submits</p>
                  <p class="text-sm font-semibold text-om-gray-700">187</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Submit rate</p>
                  <p class="text-sm font-semibold text-om-gray-700">7.99%</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Conversion uplift</p>
                  <p class="text-sm font-semibold text-om-gray-700 flex items-center gap-1">
                    92.15%
                    <TrendingUp :size="14" class="text-[#2CC896]" />
                  </p>
                </div>
              </div>

              <p class="text-xs text-om-gray-400">Last updated 14 days ago</p>
            </div>
          </div>

          <!-- Campaign Card 3 Grid -->
          <div class="relative">
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign3'"
                @click.stop="campaign3Selected = !campaign3Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign3Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign3Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
              <div
                @mouseenter="hoveredCard = 'campaign3'"
                @mouseleave="hoveredCard = null"
                class="absolute left-0 top-0 w-32 h-full z-10"
              ></div>

              <div
                class="w-full h-48 bg-om-gray-100 rounded-lg overflow-hidden border border-om-gray-200 mb-4 relative"
                @mouseenter="hoveredImage = 'campaign3'"
                @mouseleave="hoveredImage = null"
              >
                <img src="/campaigns/cart-abandonment-stopper.png" alt="Campaign preview" class="w-full h-full object-cover" />
                <transition name="fade">
                  <div v-if="hoveredImage === 'campaign3'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                    <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                      <img src="/campaigns/cart-abandonment-stopper.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                    </div>
                  </div>
                </transition>
              </div>

              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-base font-semibold text-om-gray-700 mb-1">Cart Abandonment Stopper</h3>
                  <p class="text-xs text-om-gray-400">domain.com</p>
                </div>
                <ToggleSwitch v-model="campaign3Active" @click.stop />
              </div>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Impressions</p>
                  <p class="text-sm font-semibold text-om-gray-700">987</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Submits</p>
                  <p class="text-sm font-semibold text-om-gray-700">74</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Submit rate</p>
                  <p class="text-sm font-semibold text-om-gray-700">7.50%</p>
                </div>
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Conversion uplift</p>
                  <p class="text-sm font-semibold text-om-gray-700 flex items-center gap-1">
                    78.90%
                    <TrendingUp :size="14" class="text-[#2CC896]" />
                  </p>
                </div>
              </div>

              <p class="text-xs text-om-gray-400">Last updated 14 days ago</p>
            </div>
          </div>

          <!-- Campaign Card 4 Grid -->
          <div class="relative">
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign4'"
                @click.stop="campaign4Selected = !campaign4Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
                  campaign4Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign4Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
            >
              <div
                @mouseenter="hoveredCard = 'campaign4'"
                @mouseleave="hoveredCard = null"
                class="absolute left-0 top-0 w-32 h-full z-10"
              ></div>

              <div
                class="w-full h-48 bg-om-gray-100 rounded-lg overflow-hidden border border-om-gray-200 mb-4 relative"
                @mouseenter="hoveredImage = 'campaign4'"
                @mouseleave="hoveredImage = null"
              >
                <img src="/campaigns/feedback-survey.png" alt="Campaign preview" class="w-full h-full object-cover" />
                <transition name="fade">
                  <div v-if="hoveredImage === 'campaign4'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                    <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                      <img src="/campaigns/feedback-survey.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
                    </div>
                  </div>
                </transition>
              </div>

              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-base font-semibold text-om-gray-700 mb-1">Feedback Survey</h3>
                  <p class="text-xs text-om-gray-400">domain.com</p>
                </div>
                <ToggleSwitch v-model="campaign4Active" @click.stop />
              </div>

              <div class="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p class="text-xs text-om-gray-400 mb-1">Visitors</p>
                  <p class="text-sm font-semibold text-om-gray-700">1,456</p>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>

              <p class="text-xs text-om-gray-400">Last updated 14 days ago</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import { Plus, LayoutGrid, Search, TrendingUp, Check, Calendar, ArrowUpDown } from 'lucide-vue-next'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Button from '../components/shared/Button.vue'

const emit = defineEmits(['menu-click', 'navigate-to-campaign'])

// View mode state
const viewMode = ref('list') // 'list' or 'grid'

// Campaign switch states
const campaign1Active = ref(true)
const campaign2Active = ref(true)
const campaign3Active = ref(true)
const campaign4Active = ref(true)

// Campaign selection states
const campaign1Selected = ref(false)
const campaign2Selected = ref(false)
const campaign3Selected = ref(false)
const campaign4Selected = ref(false)

// Hover state for cards
const hoveredCard = ref(null)

// Tooltip state
const hoveredImage = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const tooltipStyle = computed(() => {
  return {
    left: `${mouseX.value + 20}px`,
    top: `${mouseY.value - 50}px`
  }
})

const handleMouseMove = (event) => {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

// Domain dropdown
const selectedDomain = ref('telekom.hu')
const domains = ['telekom.hu', 'myshop.com', 'example-store.com', 'demo-site.com', 'testsite.com']

// Time filter dropdown
const timeFilterOptions = [
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: '3months', label: 'Last 3 months' }
]
const selectedTimeFilter = ref(timeFilterOptions[0])

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})

const handleLogoClick = () => {
  window.location.reload()
}

const handleCampaignClick = () => {
  emit('navigate-to-campaign')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
