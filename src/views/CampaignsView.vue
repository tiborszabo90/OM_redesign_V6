<template>
  <DashboardLayout active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1100px] mx-auto">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-semibold text-om-gray-700 mb-1">Black Friday 2025</h1>
            <p class="text-xs text-om-gray-400">www.mydomain.com</p>
          </div>
          <div class="flex items-center gap-2.5">
            <button class="w-8 h-8 flex items-center justify-center text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600 rounded-lg transition-all cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="14" height="11" rx="2"/>
                <path d="M6 2v2M12 2v2M2 8h14"/>
              </svg>
            </button>
            <button class="px-3.5 py-1.5 bg-[#D6F5EC] text-om-gray-700 rounded-lg flex items-center gap-2.5 text-sm font-medium">
              <span>Active</span>
              <div class="w-11 h-6 bg-[#2CC896] rounded-full relative">
                <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
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
        <div class="flex gap-4 mb-6">
          <button class="px-6 py-2.5 bg-om-orange-100 text-om-orange-500 rounded-xl text-sm font-medium transition-all cursor-pointer">
            Overview
          </button>
          <button class="px-6 py-2.5 bg-transparent text-om-gray-700 rounded-xl text-sm font-medium hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">
            Settings
          </button>
          <button class="px-6 py-2.5 bg-transparent text-om-gray-700 rounded-xl text-sm font-medium hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">
            Submits
          </button>
          <button class="px-6 py-2.5 bg-transparent text-om-gray-700 rounded-xl text-sm font-medium hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">
            Analytics
          </button>
        </div>

        <!-- Metrics Section -->
        <div class="grid grid-cols-12 gap-4 mb-6">
          <!-- Conversion Uplift -->
          <div class="col-span-3 bg-white rounded-xl p-5 border border-om-gray-200">
            <div class="text-sm text-om-gray-400 mb-3">Conversion uplift</div>
            <div class="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-[#10B981]">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-3xl font-semibold text-om-gray-700">84.23%</span>
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="col-span-6 bg-[#F9FAFB] rounded-xl p-5">
            <div class="text-sm text-om-gray-400 mb-4">Key metrics</div>
            <div class="grid grid-cols-3 divide-x divide-om-gray-200">
              <div class="pr-4">
                <div class="text-xs text-om-gray-400 mb-2">Impressions</div>
                <div class="text-xl font-semibold text-om-gray-700">1,456</div>
              </div>
              <div class="px-4">
                <div class="text-xs text-om-gray-400 mb-2">Submits</div>
                <div class="text-xl font-semibold text-om-gray-700">125</div>
              </div>
              <div class="pl-4">
                <div class="text-xs text-om-gray-400 mb-2">Submit rate</div>
                <div class="text-xl font-semibold text-om-gray-700">8.37%</div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="col-span-3 flex flex-col justify-end gap-2.5">
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-om-gray-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="3" width="10" height="8" rx="1.5"/>
                  <path d="M4 1v2M10 1v2M2 6h10"/>
                </svg>
              </div>
              <select class="w-full pl-9 pr-8 py-2.5 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 bg-white appearance-none cursor-pointer hover:border-om-gray-300 transition-colors">
                <option>Last 30 days</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-om-gray-400">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 4l3 3 3-3"/>
                </svg>
              </div>
            </div>
            <div class="relative">
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-om-gray-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="7" cy="7" r="5"/>
                </svg>
              </div>
              <select class="w-full pl-9 pr-8 py-2.5 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 bg-white appearance-none cursor-pointer hover:border-om-gray-300 transition-colors">
                <option>Submit</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-om-gray-400">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 4l3 3 3-3"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Variants Section -->
        <div class="bg-white rounded-lg border border-om-gray-200 mb-5 p-5">
          <h2 class="text-base font-semibold text-om-gray-700 mb-4">Variants</h2>

          <!-- Variants Table -->
          <div class="space-y-0">
            <!-- Header -->
            <div class="grid grid-cols-12 gap-3 text-xs text-om-gray-500 font-medium pb-3 border-b border-om-gray-200">
              <div class="col-span-3">Variants</div>
              <div class="col-span-1">Active</div>
              <div class="col-span-2">Impression</div>
              <div class="col-span-1">Submits</div>
              <div class="col-span-2">Submit rate</div>
              <div class="col-span-2">Uplift</div>
              <div class="col-span-1">Chance to win</div>
            </div>

            <!-- Variant Row 1 -->
            <div class="grid grid-cols-12 gap-3 items-center py-3 border-b border-om-gray-100">
              <div class="col-span-3 flex items-center gap-2.5">
                <div class="w-14 h-10 bg-om-gray-100 rounded overflow-hidden shrink-0">
                  <div class="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200"></div>
                </div>
                <span class="text-sm font-medium text-om-gray-700">Klaviyo Popup</span>
              </div>
              <div class="col-span-1">
                <div class="w-9 h-5 bg-[#10B981] rounded-full relative">
                  <div class="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div class="col-span-2 text-sm text-om-gray-700">12,593</div>
              <div class="col-span-1 text-sm text-om-gray-700">650</div>
              <div class="col-span-2 text-sm text-om-gray-700">7.25%</div>
              <div class="col-span-2 text-sm text-[#10B981]">0.77%</div>
              <div class="col-span-1 text-sm text-om-gray-400">-</div>
            </div>

            <!-- Variant Row 2 -->
            <div class="grid grid-cols-12 gap-3 items-center py-3">
              <div class="col-span-3 flex items-center gap-2.5">
                <div class="w-14 h-10 bg-om-gray-100 rounded overflow-hidden shrink-0">
                  <div class="w-full h-full bg-gradient-to-br from-orange-200 to-pink-200"></div>
                </div>
                <span class="text-sm font-medium text-om-gray-700">AI Variant</span>
              </div>
              <div class="col-span-1">
                <div class="w-9 h-5 bg-[#10B981] rounded-full relative">
                  <div class="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div class="col-span-2 text-sm text-om-gray-700">12,593</div>
              <div class="col-span-1 text-sm text-om-gray-700">650</div>
              <div class="col-span-2 text-sm text-om-gray-700">7.25%</div>
              <div class="col-span-2 text-sm text-[#10B981]">+86%</div>
              <div class="col-span-1 text-sm text-om-gray-400">9.23%</div>
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
          <div class="bg-white rounded-lg border border-om-gray-200 p-5">
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
          <div class="bg-white rounded-lg border border-om-gray-200 p-5">
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
          <div class="bg-white rounded-lg border border-om-gray-200 p-5">
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
          <div class="bg-white rounded-lg border border-om-gray-200 p-5">
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
</template>

<script setup>
import DashboardLayout from '../components/layouts/DashboardLayout.vue'

defineEmits(['menu-click'])

const handleLogoClick = () => {
  // Navigate back to home
  window.location.reload()
}
</script>
