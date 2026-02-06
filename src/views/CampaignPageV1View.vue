<template>
  <DashboardLayout active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-2">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Black Friday 2025</h1>
            <p class="text-xs text-om-gray-400">www.mydomain.com</p>
          </div>
          <div class="flex items-center gap-2.5">
            <button
              @click="isScheduleModalOpen = true"
              class="w-8 h-8 flex items-center justify-center text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600 rounded-lg transition-all cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="14" height="11" rx="2"/>
                <path d="M6 2v2M12 2v2M2 8h14"/>
              </svg>
            </button>
            <button :class="['px-3.5 py-1.5 rounded-lg flex items-center gap-2.5 text-sm font-medium cursor-pointer text-om-gray-700', isActive ? 'bg-[#D6F5EC]' : 'bg-om-gray-100']">
              <span>{{ isActive ? 'Active' : 'Inactive' }}</span>
              <button
                @click.stop="isActive = !isActive"
                :class="['w-11 h-6 rounded-full relative cursor-pointer transition-colors', isActive ? 'bg-[#2CC896]' : 'bg-om-gray-300']"
              >
                <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', isActive ? 'right-1' : 'left-1']"></div>
              </button>
            </button>
            <button class="w-8 h-8 flex items-center justify-center text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600 rounded-lg transition-all cursor-pointer">
              <svg width="4" height="18" viewBox="0 0 4 18" fill="currentColor">
                <circle cx="2" cy="2" r="2"/>
                <circle cx="2" cy="9" r="2"/>
                <circle cx="2" cy="16" r="2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6">
          <button class="px-4 py-2 bg-om-orange-100 text-om-orange-500 rounded-xl text-sm font-normal transition-all cursor-pointer">
            Overview
          </button>
          <button class="px-4 py-2 bg-transparent text-om-gray-700 rounded-xl text-sm font-normal hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">
            Settings
          </button>
          <button class="px-4 py-2 bg-transparent text-om-gray-700 rounded-xl text-sm font-normal hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">
            Submits
          </button>
          <button class="px-4 py-2 bg-transparent text-om-gray-700 rounded-xl text-sm font-normal hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">
            Analytics
          </button>
        </div>

        <!-- Metrics Section -->
        <div class="bg-om-gray-100 rounded-xl mb-6 relative">
          <div class="grid grid-cols-12 gap-4">
          <!-- Conversion Uplift -->
          <div class="col-span-3 pl-8 py-8">
            <div class="text-base text-om-gray-600 mb-3">Conversion uplift</div>
            <div class="flex items-end gap-2">
              <span class="text-[3rem] font-light text-om-gray-700 leading-none font-['Funnel_Sans']">84.23%</span>
              <TrendingUp :size="24" class="text-[#2CC896]" />
            </div>
          </div>

          <!-- Divider -->
          <div class="col-span-1 flex justify-center relative">
            <div class="w-px bg-om-gray-200 absolute inset-y-0"></div>
          </div>

          <!-- Key Metrics -->
          <div class="col-span-5 py-8">
            <div class="text-base text-om-gray-600 mb-4">Key metrics</div>
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">Impressions</div>
                <div class="text-xl font-semibold text-om-gray-700">1,456</div>
              </div>
              <svg width="12" height="44" viewBox="0 0 12 44" fill="none" class="text-om-gray-300">
                <path d="M2 4L10 22L2 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">Submits</div>
                <div class="text-xl font-semibold text-om-gray-700">125</div>
              </div>
              <svg width="12" height="44" viewBox="0 0 12 44" fill="none" class="text-om-gray-300">
                <path d="M2 4L10 22L2 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">Submit rate</div>
                <div class="text-xl font-semibold text-om-gray-700">8.37%</div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="col-span-3 flex flex-col justify-end gap-2.5 pr-8 py-8">
            <!-- Time Period Dropdown -->
            <div class="relative">
              <button
                @click="isTimePeriodOpen = !isTimePeriodOpen"
                class="w-full pl-9 pr-8 py-2 border border-[#D5D8DD] rounded-lg text-sm text-[#23262A] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none focus:border-[#E3E5E8] active:border-[#E3E5E8] cursor-pointer bg-white text-left hover:border-[#E3E5E8] hover:bg-[#FAFAFA] transition-colors"
                :class="{ 'border-[#E3E5E8] bg-[#FAFAFA]': isTimePeriodOpen }"
                style="box-shadow: none !important; outline: none !important;"
              >
                {{ selectedTimePeriod }}
              </button>
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-om-gray-400">
                <Calendar :size="18" />
              </div>
              <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown
                  :size="20"
                  class="text-om-gray-600 transition-transform"
                  :class="{ 'rotate-180': isTimePeriodOpen }"
                />
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isTimePeriodOpen"
                  class="absolute z-10 w-full mt-3 bg-white border border-[#D5D8DD] rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    v-for="option in timePeriodOptions"
                    :key="option"
                    @click="selectTimePeriod(option)"
                    class="w-full px-4 py-2 text-left text-sm text-[#23262A] hover:bg-[#F9FAFB] transition-colors cursor-pointer focus:outline-none focus:ring-0 focus:shadow-none active:bg-[#F9FAFB]"
                    :class="{ 'bg-[#F1F2F4] font-medium': selectedTimePeriod === option }"
                    style="box-shadow: none !important; outline: none !important;"
                  >
                    {{ option }}
                  </button>
                </div>
              </transition>
            </div>

            <!-- Goal Dropdown -->
            <div class="relative">
              <button
                @click="isGoalOpen = !isGoalOpen"
                class="w-full pl-9 pr-8 py-2 border border-[#D5D8DD] rounded-lg text-sm text-[#23262A] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none focus:border-[#E3E5E8] active:border-[#E3E5E8] cursor-pointer bg-white text-left hover:border-[#E3E5E8] hover:bg-[#FAFAFA] transition-colors"
                :class="{ 'border-[#E3E5E8] bg-[#FAFAFA]': isGoalOpen }"
                style="box-shadow: none !important; outline: none !important;"
              >
                {{ selectedGoal }}
              </button>
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-om-gray-400">
                <Target :size="18" />
              </div>
              <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown
                  :size="20"
                  class="text-om-gray-600 transition-transform"
                  :class="{ 'rotate-180': isGoalOpen }"
                />
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isGoalOpen"
                  class="absolute z-10 w-full mt-3 bg-white border border-[#D5D8DD] rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    v-for="option in goalOptions"
                    :key="option"
                    @click="selectGoal(option)"
                    class="w-full px-4 py-2 text-left text-sm text-[#23262A] hover:bg-[#F9FAFB] transition-colors cursor-pointer focus:outline-none focus:ring-0 focus:shadow-none active:bg-[#F9FAFB]"
                    :class="{ 'bg-[#F1F2F4] font-medium': selectedGoal === option }"
                    style="box-shadow: none !important; outline: none !important;"
                  >
                    {{ option }}
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        </div>

        <!-- Variants Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 pt-5 pb-5 pl-5 pr-8">
          <!-- Variants Table -->
          <div class="space-y-0">
            <!-- Header -->
            <div class="grid grid-cols-12 gap-1 text-xs text-om-gray-500 font-medium pb-3 border-b border-om-gray-100">
              <div class="col-span-5">Variants</div>
              <div class="col-span-1">Active</div>
              <div class="col-span-1 text-right">Impression</div>
              <div class="col-span-1 text-right">Submits</div>
              <div class="col-span-1 text-right">Submit rate</div>
              <div class="col-span-1 text-right">Uplift</div>
              <div class="col-span-1 text-right">Chance to win</div>
              <div class="col-span-1"></div>
            </div>

            <!-- Variant Row 1 -->
            <div class="grid grid-cols-12 gap-1 items-center py-3 border-b border-om-gray-100 group">
              <div class="col-span-5 flex items-center gap-2.5">
                <div
                  class="w-36 h-24 bg-om-gray-100 rounded overflow-hidden shrink-0 border border-om-gray-200 relative"
                  @mouseenter="hoveredImage = 'variant1'"
                  @mouseleave="hoveredImage = null"
                >
                  <img src="/CartAbandonmentStopper.png" alt="Cart Abandonment Stopper" class="w-full h-full object-cover" />
                  <!-- Tooltip -->
                  <transition name="fade">
                    <div v-if="hoveredImage === 'variant1'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                      <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                        <img src="/CartAbandonmentStopper.png" alt="Cart Abandonment Stopper Large" class="w-96 h-auto rounded-lg" />
                      </div>
                    </div>
                  </transition>
                </div>
                <span class="text-sm font-medium text-om-gray-700">Klaviyo Popup</span>
              </div>
              <div class="col-span-1">
                <button
                  @click="variant1Active = !variant1Active"
                  :class="['w-11 h-6 rounded-full relative cursor-pointer transition-colors', variant1Active ? 'bg-[#2CC896]' : 'bg-om-gray-300']"
                >
                  <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', variant1Active ? 'right-1' : 'left-1']"></div>
                </button>
              </div>
              <div class="col-span-1 text-base font-semibold text-om-gray-700 text-right">12,593</div>
              <div class="col-span-1 text-base font-semibold text-om-gray-700 text-right">650</div>
              <div class="col-span-1 text-base font-semibold text-om-gray-700 text-right">7.25%</div>
              <div class="col-span-1 text-base font-semibold text-[#10B981] flex items-center gap-1 justify-end">
                0.77%
                <TrendingUp :size="16" class="text-[#2CC896]" />
              </div>
              <div class="col-span-1 text-base font-semibold text-om-gray-400 text-right">-</div>
              <!-- Kebab Menu -->
              <div class="col-span-1 flex items-center justify-end w-fit justify-self-end">
                <button class="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center text-om-gray-600 hover:bg-om-gray-100 rounded cursor-pointer">
                  <MoreVertical :size="20" />
                </button>
              </div>
            </div>

            <!-- Variant Row 2 -->
            <div class="grid grid-cols-12 gap-1 items-center py-3 group">
              <div class="col-span-5 flex items-center gap-2.5">
                <div
                  class="w-36 h-24 bg-om-gray-100 rounded overflow-hidden shrink-0 border border-om-gray-200 relative"
                  @mouseenter="hoveredImage = 'variant2'"
                  @mouseleave="hoveredImage = null"
                >
                  <img src="/CartAbandonmentStopper.png" alt="Cart Abandonment Stopper" class="w-full h-full object-cover" />
                  <!-- Tooltip -->
                  <transition name="fade">
                    <div v-if="hoveredImage === 'variant2'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                      <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                        <img src="/CartAbandonmentStopper.png" alt="Cart Abandonment Stopper Large" class="w-96 h-auto rounded-lg" />
                      </div>
                    </div>
                  </transition>
                </div>
                <span class="text-sm font-medium text-om-gray-700">AI Variant</span>
              </div>
              <div class="col-span-1">
                <button
                  @click="variant2Active = !variant2Active"
                  :class="['w-11 h-6 rounded-full relative cursor-pointer transition-colors', variant2Active ? 'bg-[#2CC896]' : 'bg-om-gray-300']"
                >
                  <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', variant2Active ? 'right-1' : 'left-1']"></div>
                </button>
              </div>
              <div class="col-span-1 text-base font-semibold text-om-gray-700 text-right">12,593</div>
              <div class="col-span-1 text-base font-semibold text-om-gray-700 text-right">650</div>
              <div class="col-span-1 text-base font-semibold text-om-gray-700 text-right">7.25%</div>
              <div class="col-span-1 text-base font-semibold text-[#10B981] flex items-center gap-1 justify-end">
                +86%
                <TrendingUp :size="16" class="text-[#2CC896]" />
              </div>
              <div class="col-span-1 text-base font-semibold text-om-gray-400 text-right">9.23%</div>
              <!-- Kebab Menu -->
              <div class="col-span-1 flex items-center justify-end w-fit justify-self-end">
                <button class="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center text-om-gray-600 hover:bg-om-gray-100 rounded cursor-pointer">
                  <MoreVertical :size="20" />
                </button>
              </div>
            </div>
          </div>

          <!-- Add Variant Button -->
          <button class="mt-4 flex items-center gap-2 text-sm text-om-orange-500 font-medium hover:text-om-orange-600">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8" cy="8" r="7"/>
              <path d="M8 5v6M5 8h6"/>
            </svg>
            Add A/B test variant
          </button>
        </div>

        <!-- Campaign Settings Sections -->
        <div class="space-y-5">
          <!-- When will the popup show up -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">When will the popup show up</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="2" width="10" height="10" rx="2"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-om-gray-700">On exit-intent</div>
                  <div class="text-xs text-om-gray-500 mt-0.5">When a visitor is about to leave your site</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="2" width="10" height="10" rx="2"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-om-gray-700">After x seconds of inactivity</div>
                  <div class="text-xs text-om-gray-500 mt-0.5">When a visitor is inactive for <span class="font-medium text-om-gray-700">20 seconds</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- How often can it appear -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">How often can it appear</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-om-orange-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ED5A29" stroke-width="1.5">
                    <circle cx="7" cy="7" r="5"/>
                    <path d="M7 4v3l2 2"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-om-gray-700">How many times</div>
                  <div class="text-xs text-om-gray-500 mt-0.5">Maximum 3 times</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M7 2v10M10 5l-3-3-3 3"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-om-gray-700">How frequently</div>
                  <div class="text-xs text-om-gray-500 mt-0.5">Max 1 session(s) between two impressions</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="2" width="10" height="10" rx="2"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-om-gray-700">Stop showing</div>
                  <div class="text-xs text-om-gray-500 mt-0.5">After a visitor has converted in this campaign</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Who should see the popup -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">Who should see the popup</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-om-orange-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ED5A29" stroke-width="1.5">
                    <rect x="2" y="3" width="10" height="8" rx="1"/>
                    <path d="M4 3V2M10 3V2"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-om-gray-700">Spent on pages</div>
                  <div class="text-xs text-om-gray-500 mt-0.5">The popup will appear to visitors who spent a minimum of <span class="font-medium text-om-gray-700">10 seconds</span> on the current subpage</div>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-7 h-7 bg-om-orange-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ED5A29" stroke-width="1.5">
                    <rect x="2" y="3" width="10" height="8" rx="1"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-om-gray-700">Aktuális oldal / URL</div>
                  <div class="text-xs text-om-gray-500 mt-0.5 space-y-0.5">
                    <div>A kampány egy aktuális oldal URL-jén és az altalanaihoz <span class="font-medium text-om-gray-700">cart</span></div>
                    <div>vagy az aktuális oldal URL-jén vagy altalanaihoz <span class="font-medium text-om-gray-700">shop_cart</span></div>
                    <div>vagy az aktuális oldal URL-jén vagy altalanaihoz <span class="font-medium text-om-gray-700">shop_reg</span></div>
                    <div>vagy az aktuális oldal URL-jén vagy altalanaihoz <span class="font-medium text-om-gray-700">shop_category</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Integrations -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">Integrations</h3>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-[#FFE01B] rounded flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#000">
                  <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm4.1 13.8l-2.8-1.7v-5h1.3v4.3l2.4 1.4-.9.9z"/>
                </svg>
              </div>
              <span class="text-sm font-medium text-om-gray-700">Mailchimp</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>

  <!-- Schedule Modal -->
  <transition name="modal">
    <div v-if="isScheduleModalOpen" class="fixed inset-0 z-50 flex items-start justify-center px-6 pt-10 pb-20" style="background-color: rgba(49, 80, 85, 0.65);" @click.self="isScheduleModalOpen = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-om-gray-200 bg-white flex-shrink-0">
          <h2 class="text-xl font-semibold text-om-gray-700">Set up your schedule</h2>
          <button @click="isScheduleModalOpen = false" class="text-om-gray-400 hover:text-om-gray-600 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable content area -->
        <div class="overflow-y-auto flex-1" style="scrollbar-gutter: stable;">
        <!-- Modal Content -->
        <div class="pl-6 pr-3 py-6 space-y-8">
          <!-- Time zone -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0">Time zone</label>
            <div class="relative flex-1">
              <button
                @click="isTimezoneOpen = !isTimezoneOpen"
                class="w-full px-3 pr-8 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white text-left hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                :class="{ 'border-om-gray-300 bg-[#FAFAFA]': isTimezoneOpen }"
                style="box-shadow: none !important; outline: none !important;"
              >
                {{ selectedTimezone }}
              </button>
              <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown
                  :size="20"
                  class="text-om-gray-600 transition-transform"
                  :class="{ 'rotate-180': isTimezoneOpen }"
                />
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isTimezoneOpen"
                  class="absolute z-10 w-full mt-2 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
                >
                  <button
                    v-for="option in timezoneOptions"
                    :key="option"
                    @click="selectTimezone(option)"
                    class="w-full px-3 py-2 text-left text-sm text-om-gray-700 hover:bg-[#F9FAFB] transition-colors cursor-pointer focus:outline-none focus:ring-0 focus:shadow-none active:bg-[#F9FAFB]"
                    :class="{ 'bg-[#F1F2F4] font-medium': selectedTimezone === option }"
                    style="box-shadow: none !important; outline: none !important;"
                  >
                    {{ option }}
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Start date -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0">Start date</label>
            <div class="flex gap-3 flex-1">
              <div class="relative flex-1">
                <input
                  type="date"
                  v-model="startDate"
                  class="w-full pl-9 pr-3 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                  style="box-shadow: none !important; outline: none !important;"
                />
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Calendar :size="16" class="text-om-gray-600" />
                </div>
              </div>
              <div class="relative w-32">
                <input
                  type="time"
                  v-model="startTime"
                  class="w-full pl-9 pr-3 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                  style="box-shadow: none !important; outline: none !important;"
                />
                <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Clock :size="16" class="text-om-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- End date -->
          <div class="flex items-start gap-4">
            <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0 pt-1">End date</label>
            <div class="space-y-3 flex-1">
              <div class="grid grid-cols-[110px_1fr] gap-2">
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="never"
                    value="never"
                    v-model="endDateType"
                    class="custom-radio cursor-pointer"
                  />
                  <label for="never" class="text-sm text-om-gray-700 cursor-pointer">Never</label>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="on"
                    value="on"
                    v-model="endDateType"
                    class="custom-radio cursor-pointer"
                  />
                  <label for="on" class="text-sm text-om-gray-700 cursor-pointer">Set end date</label>
                </div>
              </div>
              <div v-if="endDateType === 'on'" class="flex gap-3">
                <div class="relative flex-1">
                  <input
                    type="date"
                    v-model="endDate"
                    placeholder="MM/DD/YYYY"
                    class="w-full pl-9 pr-3 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                    style="box-shadow: none !important; outline: none !important;"
                  />
                  <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Calendar :size="16" class="text-om-gray-600" />
                  </div>
                </div>
                <div class="relative w-32">
                  <input
                    type="time"
                    v-model="endTime"
                    class="w-full pl-9 pr-3 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                    style="box-shadow: none !important; outline: none !important;"
                  />
                  <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Clock :size="16" class="text-om-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Daily schedule -->
          <div>
            <!-- Daily schedule label with radio buttons -->
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0">Daily schedule</label>
              <div class="grid grid-cols-[110px_1fr] gap-2 flex-1">
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="everyday"
                    value="everyday"
                    v-model="scheduleType"
                    class="custom-radio cursor-pointer"
                  />
                  <label for="everyday" class="text-sm text-om-gray-700 cursor-pointer">Every day</label>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    id="specific"
                    value="specific"
                    v-model="scheduleType"
                    class="custom-radio cursor-pointer"
                  />
                  <label for="specific" class="text-sm text-om-gray-700 cursor-pointer">Specific</label>
                </div>
              </div>
            </div>

            <!-- Daily schedule content - only shown when Specific is selected -->
            <div v-if="scheduleType === 'specific'" class="mt-4 space-y-4">
              <!-- Days of week -->
              <div class="flex items-start gap-4">
                <div class="w-32 shrink-0"></div>
                <div class="flex gap-2 flex-1">
                  <button
                    v-for="day in daysOfWeek"
                    :key="day.value"
                    @click="toggleDay(day.value)"
                    :class="[
                      'flex-1 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                      selectedDays.includes(day.value)
                        ? 'bg-om-orange-500 text-white'
                        : 'bg-om-gray-100 text-om-gray-600 hover:bg-om-gray-200'
                    ]"
                  >
                    {{ day.label }}
                  </button>
                </div>
              </div>

              <!-- Time range -->
              <div class="flex items-start gap-4">
                <div class="w-32 shrink-0"></div>
                <div class="grid grid-cols-[110px_1fr] gap-2 flex-1">
                  <div>
                    <label class="block text-sm font-medium text-om-gray-700 mb-2">From</label>
                    <div class="relative">
                      <input
                        type="time"
                        v-model="dailyFromTime"
                        class="w-full pl-9 pr-3 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                        style="box-shadow: none !important; outline: none !important;"
                      />
                      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Clock :size="16" class="text-om-gray-600" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-om-gray-700 mb-2">To</label>
                    <div class="relative">
                      <input
                        type="time"
                        v-model="dailyToTime"
                        class="w-full pl-9 pr-3 py-2 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors"
                        style="box-shadow: none !important; outline: none !important;"
                      />
                      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Clock :size="16" class="text-om-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Action buttons - Sticky -->
        <div class="flex items-center justify-end gap-3 pl-6 pr-3 py-3 bg-white">
          <button
            @click="isScheduleModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="saveSchedule"
            class="px-4 py-2 bg-om-orange-500 text-white text-sm font-medium rounded-lg hover:bg-om-orange-600 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>

        <!-- How it works - Sticky at bottom -->
        <div class="pl-6 pr-3 pb-6 bg-white">
          <div class="bg-om-gray-50 rounded-lg p-3">
            <div class="flex items-start gap-2">
              <GraduationCap :size="16" class="shrink-0 mt-0.5 text-om-gray-400" />
              <div>
                <p class="text-xs text-om-gray-500 leading-relaxed">
                  Use the campaign schedule to specify in advance how long your campaign can run, and to specify the specific days and times your campaign can run. Depending on the timing, the campaign will start and stop automatically.
                  <a href="#" class="text-om-orange-500 hover:text-om-orange-600 font-medium ml-1">Read more</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, TrendingUp, ChevronRight, Calendar, Clock, Target, MoreVertical, GraduationCap } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'

defineEmits(['menu-click'])

const isActive = ref(true)

// Variant active states
const variant1Active = ref(true)
const variant2Active = ref(true)

// Hover states for image preview
const hoveredImage = ref(null)

// Tooltip positioning
const tooltipStyle = computed(() => ({
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)'
}))

// Dropdown states
const isTimePeriodOpen = ref(false)
const selectedTimePeriod = ref('Last 30 days')
const timePeriodOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']

const isGoalOpen = ref(false)
const selectedGoal = ref('Submit')
const goalOptions = ['Submit', 'Click', 'View', 'Conversion']

const selectTimePeriod = (option) => {
  selectedTimePeriod.value = option
  isTimePeriodOpen.value = false
}

const selectGoal = (option) => {
  selectedGoal.value = option
  isGoalOpen.value = false
}

const handleLogoClick = () => {
  // Navigate back to home
  window.location.reload()
}

// Schedule Modal states
const isScheduleModalOpen = ref(false)
const isTimezoneOpen = ref(false)
const selectedTimezone = ref('GMT+01:00 Europe/Budapest')
const timezoneOptions = [
  'GMT-12:00 International Date Line West',
  'GMT-11:00 Midway Island',
  'GMT-10:00 Hawaii',
  'GMT-09:00 Alaska',
  'GMT-08:00 Pacific Time (US & Canada)',
  'GMT-07:00 Mountain Time (US & Canada)',
  'GMT-06:00 Central Time (US & Canada)',
  'GMT-05:00 Eastern Time (US & Canada)',
  'GMT-04:00 Atlantic Time (Canada)',
  'GMT-03:00 Buenos Aires',
  'GMT-02:00 Mid-Atlantic',
  'GMT-01:00 Azores',
  'GMT+00:00 London',
  'GMT+01:00 Europe/Budapest',
  'GMT+02:00 Athens',
  'GMT+03:00 Moscow',
  'GMT+04:00 Dubai',
  'GMT+05:00 Islamabad',
  'GMT+06:00 Dhaka',
  'GMT+07:00 Bangkok',
  'GMT+08:00 Singapore',
  'GMT+09:00 Tokyo',
  'GMT+10:00 Sydney',
  'GMT+11:00 Solomon Islands',
  'GMT+12:00 Auckland'
]

const startDate = ref('2026-02-06')
const startTime = ref('10:46')
const endDateType = ref('never')
const endDate = ref('')
const endTime = ref('10:46')
const isDailyScheduleOpen = ref(false)

// Daily schedule states
const isDailyTimezoneOpen = ref(false)
const selectedDailyTimezone = ref('GMT+01:00 Europe/Budapest')
const scheduleType = ref('everyday')
const selectedDays = ref(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])
const daysOfWeek = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' }
]
const dailyFromTime = ref('10:47')
const dailyToTime = ref('10:47')

const selectTimezone = (option) => {
  selectedTimezone.value = option
  isTimezoneOpen.value = false
}

const selectDailyTimezone = (option) => {
  selectedDailyTimezone.value = option
  isDailyTimezoneOpen.value = false
}

const toggleDay = (day) => {
  const index = selectedDays.value.indexOf(day)
  if (index > -1) {
    selectedDays.value.splice(index, 1)
  } else {
    selectedDays.value.push(day)
  }
}

const saveSchedule = () => {
  // Handle save logic here
  console.log('Schedule saved:', {
    timezone: selectedTimezone.value,
    startDate: startDate.value,
    startTime: startTime.value,
    endDateType: endDateType.value,
    endDate: endDate.value,
    endTime: endTime.value
  })
  isScheduleModalOpen.value = false
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}

/* Custom Radio Button */
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #D5D8DD;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  position: relative;
  background-color: white;
  transition: all 0.2s ease;
}

.custom-radio:checked {
  border-color: #ED5A29;
  background-color: white;
}

.custom-radio:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ED5A29;
}

.custom-radio:hover {
  border-color: #C44D24;
}

.custom-radio:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(237, 90, 41, 0.1);
}
</style>
