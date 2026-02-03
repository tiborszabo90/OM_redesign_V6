<template>
  <DashboardLayout active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-om-gray-700">Campaigns (32)</h1>
          <button class="px-5 py-2.5 bg-om-orange-500 text-white rounded-lg hover:bg-om-orange-400 transition-colors text-sm font-medium">
            New campaigns
          </button>
        </div>

        <!-- Filters and Controls -->
        <div class="flex items-center justify-between mb-6">
          <!-- Left: Domain dropdown and Tab filters -->
          <div class="flex items-center gap-3">
            <!-- Domain dropdown -->
            <div class="relative w-[240px]" ref="domainDropdownRef">
              <button
                @click="isDomainDropdownOpen = !isDomainDropdownOpen"
                class="w-full pl-9 pr-8 py-2 border border-[#D5D8DD] rounded-lg text-sm text-[#23262A] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none focus:border-[#E3E5E8] active:border-[#E3E5E8] cursor-pointer bg-white text-left hover:border-[#E3E5E8] hover:bg-[#FAFAFA] transition-colors"
                :class="{ 'border-[#E3E5E8] bg-[#FAFAFA]': isDomainDropdownOpen }"
                style="box-shadow: none !important; outline: none !important;"
              >
                {{ selectedDomain }}
              </button>
              <div class="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden pointer-events-none">
                <img src="/telekom.png" alt="Telekom" class="w-full h-full object-cover" />
              </div>
              <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown
                  :size="20"
                  class="text-om-gray-600 transition-transform"
                  :class="{ 'rotate-180': isDomainDropdownOpen }"
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
                  v-if="isDomainDropdownOpen"
                  class="absolute z-10 w-full mt-3 bg-white border border-[#D5D8DD] rounded-xl shadow-lg overflow-hidden"
                >
                  <button
                    v-for="domain in domains"
                    :key="domain"
                    @click="selectDomain(domain)"
                    class="w-full px-4 py-2 text-left text-sm text-[#23262A] hover:bg-[#F7F7F8] transition-colors cursor-pointer focus:outline-none focus:ring-0 focus:shadow-none active:bg-[#F7F7F8]"
                    :class="{ 'bg-[#F1F2F4] font-medium': selectedDomain === domain }"
                    style="box-shadow: none !important; outline: none !important;"
                  >
                    {{ domain }}
                  </button>
                </div>
              </transition>
            </div>

            <!-- Tab filters -->
            <div class="flex items-center gap-2">
              <button class="chip px-3 py-1.5 rounded-lg bg-om-orange-50 border-2 border-om-orange-500 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                Active
              </button>
              <button class="chip px-3 py-1.5 rounded-lg bg-white border border-om-gray-200 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                Archive
              </button>
              <button class="chip px-3 py-1.5 rounded-lg bg-white border border-om-gray-200 text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                Service
              </button>
              <button class="chip w-8 h-8 flex items-center justify-center bg-white border border-om-gray-200 text-om-gray-700 rounded-lg cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]">
                <Plus :size="16" />
              </button>
            </div>
          </div>

          <!-- Right: View controls and dropdown -->
          <div class="flex items-center gap-3">
            <button class="w-8 h-8 flex items-center justify-center text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600 rounded-lg transition-all cursor-pointer">
              <LayoutGrid :size="18" />
            </button>
            <button class="w-8 h-8 flex items-center justify-center text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600 rounded-lg transition-all cursor-pointer">
              <Search :size="18" />
            </button>
            <div class="relative" ref="timeFilterRef">
              <button
                @click="isTimeFilterOpen = !isTimeFilterOpen"
                class="dropdown-select px-3 pr-8 py-1.5 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:shadow-none active:shadow-none cursor-pointer bg-white text-left hover:border-om-gray-300 hover:bg-[#FAFAFA] transition-colors relative min-w-35"
                :class="{ 'border-om-orange-300': isTimeFilterOpen }"
              >
                {{ selectedTimeFilter.label }}
                <ChevronDown :size="16" class="absolute right-2 top-1/2 -translate-y-1/2 text-om-gray-500" :class="{ 'rotate-180': isTimeFilterOpen }" />
              </button>
              <transition name="fade">
                <div
                  v-if="isTimeFilterOpen"
                  class="absolute right-0 top-full mt-2 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden min-w-35 z-50"
                >
                  <button
                    v-for="option in timeFilterOptions"
                    :key="option.value"
                    @click="selectTimeFilter(option)"
                    class="w-full px-3 py-2 text-sm text-left hover:bg-om-gray-100 transition-colors cursor-pointer text-om-gray-700"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Campaign Cards List -->
        <div class="space-y-4">
          <!-- Campaign Card 1 -->
          <div
            @mouseenter="hoveredCard = 'campaign1'"
            @mouseleave="hoveredCard = null"
            class="relative"
          >
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign1'"
                @click.stop="campaign1Selected = !campaign1Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2',
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
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign1'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/SmartDiscountPopup.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign1'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/SmartDiscountPopup.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
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
                <p class="text-base font-semibold text-[#2CC896] flex items-center gap-1">
                  84.23%
                  <TrendingUp :size="16" />
                </p>
              </div>
            </div>

            <!-- Toggle and Last Updated -->
            <div class="flex items-center gap-4 ml-6">
              <button
                @click.stop="campaign1Active = !campaign1Active"
                :class="['w-11 h-6 rounded-full relative cursor-pointer transition-colors', campaign1Active ? 'bg-[#2CC896]' : 'bg-om-gray-300']"
              >
                <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', campaign1Active ? 'right-1' : 'left-1']"></div>
              </button>
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
            </div>
            </div>
          </div>

          <!-- Campaign Card 2 -->
          <div
            @mouseenter="hoveredCard = 'campaign2'"
            @mouseleave="hoveredCard = null"
            class="relative"
          >
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign2'"
                @click.stop="campaign2Selected = !campaign2Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2',
                  campaign2Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign2Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign2'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/LuckyWheel.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign2'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/LuckyWheel.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
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
              <button
                @click.stop="campaign2Active = !campaign2Active"
                :class="['w-11 h-6 rounded-full relative cursor-pointer transition-colors', campaign2Active ? 'bg-[#2CC896]' : 'bg-om-gray-300']"
              >
                <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', campaign2Active ? 'right-1' : 'left-1']"></div>
              </button>
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
            </div>
            </div>
          </div>

          <!-- Campaign Card 3 -->
          <div
            @mouseenter="hoveredCard = 'campaign3'"
            @mouseleave="hoveredCard = null"
            class="relative"
          >
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign3'"
                @click.stop="campaign3Selected = !campaign3Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2',
                  campaign3Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign3Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign3'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/CartAbandonmentStopper.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign3'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/CartAbandonmentStopper.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
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
              <button
                @click.stop="campaign3Active = !campaign3Active"
                :class="['w-11 h-6 rounded-full relative cursor-pointer transition-colors', campaign3Active ? 'bg-[#2CC896]' : 'bg-om-gray-300']"
              >
                <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', campaign3Active ? 'right-1' : 'left-1']"></div>
              </button>
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
            </div>
            </div>
          </div>

          <!-- Campaign Card 4 -->
          <div
            @mouseenter="hoveredCard = 'campaign4'"
            @mouseleave="hoveredCard = null"
            class="relative"
          >
            <!-- Checkbox -->
            <transition name="fade">
              <button
                v-if="hoveredCard === 'campaign4'"
                @click.stop="campaign4Selected = !campaign4Selected"
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2',
                  campaign4Selected
                    ? 'bg-om-orange-500 border-om-orange-500'
                    : 'bg-white border-om-gray-300 hover:border-om-orange-500'
                ]"
              >
                <Check v-if="campaign4Selected" :size="14" class="text-white" stroke-width="3" />
              </button>
            </transition>

            <!-- Card -->
            <div
              @click="handleCampaignClick"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
            <!-- Thumbnail -->
            <div
              class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
              @mouseenter="hoveredImage = 'campaign4'"
              @mouseleave="hoveredImage = null"
            >
              <img src="/FeedbackSurvey.png" alt="Campaign preview" class="w-full h-full object-cover" />
              <!-- Tooltip -->
              <transition name="fade">
                <div v-if="hoveredImage === 'campaign4'" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
                  <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
                    <img src="/FeedbackSurvey.png" alt="Campaign preview large" class="w-96 h-auto rounded-lg" />
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
              <button
                @click.stop="campaign4Active = !campaign4Active"
                :class="['w-11 h-6 rounded-full relative cursor-pointer transition-colors', campaign4Active ? 'bg-[#2CC896]' : 'bg-om-gray-300']"
              >
                <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', campaign4Active ? 'right-1' : 'left-1']"></div>
              </button>
              <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>14 days ago</p>
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
import { Plus, LayoutGrid, Search, TrendingUp, ChevronDown, Check } from 'lucide-vue-next'

const emit = defineEmits(['menu-click', 'navigate-to-campaign'])

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
const domainDropdownRef = ref(null)
const isDomainDropdownOpen = ref(false)
const selectedDomain = ref('telekom.hu')
const domains = ['telekom.hu', 'myshop.com', 'example-store.com', 'demo-site.com', 'testsite.com']

const selectDomain = (domain) => {
  selectedDomain.value = domain
  isDomainDropdownOpen.value = false
}

// Time filter dropdown
const timeFilterRef = ref(null)
const isTimeFilterOpen = ref(false)
const timeFilterOptions = [
  { value: 'week', label: 'Last week' },
  { value: 'month', label: 'Last month' },
  { value: '3months', label: 'Last 3 months' }
]
const selectedTimeFilter = ref(timeFilterOptions[0])

const selectTimeFilter = (option) => {
  selectedTimeFilter.value = option
  isTimeFilterOpen.value = false
}

const handleClickOutside = (event) => {
  if (domainDropdownRef.value && !domainDropdownRef.value.contains(event.target)) {
    isDomainDropdownOpen.value = false
  }
  if (timeFilterRef.value && !timeFilterRef.value.contains(event.target)) {
    isTimeFilterOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
