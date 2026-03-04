<template>
  <DashboardLayout
    active-menu-item="campaigns"
    :no-content-padding="true"
    @logo-click="handleLogoClick"
    @menu-click="$emit('menu-click', $event)"
  >
    <template #content>
      <div class="ml-5 mt-6 mr-6 mb-6">
        <div class="w-full max-w-[1400px] mx-auto">
        <!-- Header + Tabs -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6 mb-4">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Black Friday 2025</h1>
            <p class="text-xs text-om-gray-400">www.mydomain.com</p>
          </div>
          <div class="flex items-center gap-2.5">
            <button class="w-8 h-8 flex items-center justify-center text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600 rounded-lg transition-all cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="14" height="11" rx="2"/>
                <path d="M6 2v2M12 2v2M2 8h14"/>
              </svg>
            </button>
            <button :class="['px-3.5 py-1.5 rounded-lg flex items-center gap-2.5 text-sm font-medium cursor-pointer text-om-gray-700', isActive ? 'bg-[#D6F5EC]' : 'bg-om-gray-100']">
              <span>{{ isActive ? 'Active' : 'Inactive' }}</span>
              <ToggleSwitch v-model="isActive" @click.stop />
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
        <div class="flex gap-2">
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
        </div>

        <!-- Metrics Section -->
        <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-4 relative">
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
            <Dropdown v-model="selectedTimePeriod" :options="timePeriodOptions">
              <template #icon>
                <Calendar :size="18" class="text-om-gray-400" />
              </template>
            </Dropdown>

            <!-- Goal Dropdown -->
            <Dropdown v-model="selectedGoal" :options="goalOptions">
              <template #icon>
                <Target :size="18" class="text-om-gray-400" />
              </template>
            </Dropdown>
          </div>
        </div>
        </div>

        <!-- Variants Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-4 pt-5 pb-5 pl-5 pr-8">
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
                  <img src="/campaigns/cart-abandonment-stopper.png" alt="Cart Abandonment Stopper" class="w-full h-full object-cover" />
                  <!-- Tooltip -->
                  <transition name="fade">
                    <div v-if="hoveredImage === 'variant1'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                      <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                        <img src="/campaigns/cart-abandonment-stopper.png" alt="Cart Abandonment Stopper Large" class="w-96 h-auto rounded-lg" />
                      </div>
                    </div>
                  </transition>
                </div>
                <span class="text-sm font-medium text-om-gray-700">Klaviyo Popup</span>
              </div>
              <div class="col-span-1">
                <ToggleSwitch v-model="variant1Active" />
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
                  <img src="/campaigns/cart-abandonment-stopper.png" alt="Cart Abandonment Stopper" class="w-full h-full object-cover" />
                  <!-- Tooltip -->
                  <transition name="fade">
                    <div v-if="hoveredImage === 'variant2'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                      <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                        <img src="/campaigns/cart-abandonment-stopper.png" alt="Cart Abandonment Stopper Large" class="w-96 h-auto rounded-lg" />
                      </div>
                    </div>
                  </transition>
                </div>
                <span class="text-sm font-medium text-om-gray-700">AI Variant</span>
              </div>
              <div class="col-span-1">
                <ToggleSwitch v-model="variant2Active" />
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
        <div class="space-y-4">
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
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { TrendingUp, Calendar, Target, MoreVertical } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Dropdown from '../components/shared/Dropdown.vue'

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

// Dropdown data
const selectedTimePeriod = ref('Last 30 days')
const timePeriodOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']

const selectedGoal = ref('Submit')
const goalOptions = ['Submit', 'Click', 'View', 'Conversion']

const handleLogoClick = () => {
  // Navigate back to home
  window.location.reload()
}
</script>
