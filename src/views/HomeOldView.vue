<template>
  <DashboardLayout @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-5">Hi Csaba</h1>

        <!-- Filters Section -->
        <div class="filters-section">
          <!-- Domain Selector -->
          <Dropdown
            v-model="selectedDomain"
            :options="domains"
            placeholder="Select domain"
          >
            <template #icon>
              <img src="/telekom.png" alt="Domain" class="w-5 h-5 rounded-full object-cover" />
            </template>
          </Dropdown>

          <!-- Right-aligned filters -->
          <div class="filters-right">
            <!-- Goal Dropdown -->
            <Dropdown
              v-model="selectedGoal"
              :options="goals"
              placeholder="Select goal"
            >
              <template #icon>
                <Target :size="20" class="text-om-gray-400" />
              </template>
            </Dropdown>

            <!-- Period Dropdown -->
            <Dropdown
              v-model="selectedPeriod"
              :options="periods"
              placeholder="Select period"
            >
              <template #icon>
                <Calendar :size="20" class="text-om-gray-400" />
              </template>
            </Dropdown>
          </div>
        </div>

        <!-- Trend Chart Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 px-5">
          <div class="trend-chart-tabs">
            <div
              v-for="tab in trendTabs"
              :key="tab.id"
              :class="['trend-chart-tab', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <div class="trend-chart-tab-title">{{ tab.title }}</div>
              <div class="trend-chart-stat">
                <div class="trend-chart-value">{{ tab.value }}</div>
                <div :class="['trend-chart-change', tab.isPositive ? 'positive' : 'negative']">
                  <TrendingUp v-if="tab.isPositive" :size="14" />
                  <TrendingDown v-else :size="14" />
                  {{ tab.change }}
                </div>
              </div>
            </div>
          </div>
          <div class="chart-canvas">
            <VueApexCharts
              :key="activeTab"
              type="area"
              height="280"
              :options="chartOptions"
              :series="chartSeries"
            />
          </div>
        </div>

        <!-- Top Campaigns Section -->
        <div class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-om-gray-700">Top campaigns</h2>
            <Button variant="ghost" size="sm">All campaigns</Button>
          </div>

          <div class="space-y-4">
            <!-- Campaign Card 1 -->
            <div
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
              <!-- Thumbnail -->
              <div class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                <img src="/SmartDiscountPopup.png" alt="Campaign preview" class="w-full h-full object-cover" />
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

            <!-- Campaign Card 2 -->
            <div
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
              <!-- Thumbnail -->
              <div class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                <img src="/LuckyWheel.png" alt="Campaign preview" class="w-full h-full object-cover" />
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

            <!-- Campaign Card 3 -->
            <div
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
              <!-- Thumbnail -->
              <div class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                <img src="/CartAbandonmentStopper.png" alt="Campaign preview" class="w-full h-full object-cover" />
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

            <!-- Campaign Card 4 -->
            <div
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-6 flex items-center gap-6 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
              <!-- Thumbnail -->
              <div class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                <img src="/FeedbackSurvey.png" alt="Campaign preview" class="w-full h-full object-cover" />
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
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'

defineProps({
  registrationData: {
    type: Object,
    default: null
  }
})

defineEmits(['task-created', 'menu-click'])

const handleLogoClick = () => {
  // No-op for now
}

// Domain selector
const selectedDomain = ref('reflexshop.hu')
const domains = ref([
  'reflexshop.hu',
  'telekom.hu',
  'shop.telekom.hu',
  'demo.optimonk.com'
])

// Goal dropdown
const selectedGoal = ref('Conversions (default)')
const goals = ref([
  'Conversions (default)',
  'browserTabReturn',
  'Buyers with cart under 100k HUF',
  'Add to cart',
  'Purchase'
])

// Period dropdown
const selectedPeriod = ref('Last 30 days')
const periods = ref([
  'Yesterday',
  'Last 7 days',
  'Last 30 days',
  'Last month',
  'Last year',
  'Custom period'
])

// Campaign toggle states
const campaign1Active = ref(true)
const campaign2Active = ref(true)
const campaign3Active = ref(true)
const campaign4Active = ref(true)

const activeTab = ref('conversion-rate')

const trendTabs = ref([
  { id: 'conversion-rate', title: 'Conversion Rate', value: '0.57%', change: '+14.0%', isPositive: true },
  { id: 'conversions', title: 'Conversions', value: '2.2K', change: '+8.3%', isPositive: true },
  { id: 'impressions', title: 'Impressions', value: '384.4K', change: '+12.5%', isPositive: true },
  { id: 'unique-visitors', title: 'Unique Visitors', value: '168.2K', change: '+6.7%', isPositive: true },
  { id: 'supported-orders', title: 'Supported Orders', value: '286', change: '-4.2%', isPositive: false },
  { id: 'supported-revenue', title: 'Supported Revenue', value: 'HUF 8,494,963', change: '+15.8%', isPositive: true }
])

// Chart data
const conversionRateData = [
  0.52, 0.48, 0.51, 0.49, 0.53, 0.50, 0.47, 0.52, 0.55, 0.54,
  0.51, 0.53, 0.56, 0.58, 0.57, 0.59, 0.61, 0.58, 0.56, 0.60,
  0.62, 0.59, 0.57, 0.61, 0.63, 0.60, 0.58, 0.61, 0.59, 0.57
]

const conversionsData = [
  62, 58, 65, 59, 68, 61, 57, 64, 71, 69,
  65, 68, 74, 79, 76, 81, 85, 80, 77, 84,
  88, 82, 79, 86, 91, 85, 81, 87, 83, 80
]

const impressionsData = [
  11234, 10987, 11456, 10876, 11789, 11123, 10765, 11345, 12123, 11876,
  11567, 11987, 12456, 12876, 12567, 13123, 13567, 12987, 12456, 13234,
  13678, 13123, 12876, 13456, 13987, 13456, 12987, 13567, 13234, 12876
]

const uniqueVisitorsData = [
  4876, 4654, 4987, 4723, 5123, 4865, 4587, 4923, 5287, 5134,
  5023, 5234, 5456, 5687, 5523, 5876, 6123, 5876, 5543, 5987,
  6234, 5943, 5687, 6087, 6345, 6123, 5876, 6187, 5987, 5723
]

const supportedOrdersData = [
  8, 7, 9, 7, 10, 8, 7, 9, 11, 10,
  9, 10, 11, 12, 11, 13, 14, 12, 11, 13,
  14, 12, 11, 13, 15, 13, 12, 14, 13, 12
]

const supportedRevenueData = [
  234567, 223456, 256789, 218765, 267890, 239876, 215678, 248765, 289765, 278654,
  265432, 279876, 298765, 312345, 301234, 323456, 345678, 321234, 298765, 334567,
  356789, 329876, 309876, 339876, 367890, 345678, 323456, 351234, 338765, 321234
]

const chartDates = [
  'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15',
  'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25',
  'Jan 26', 'Jan 27', 'Jan 28', 'Jan 29', 'Jan 30', 'Jan 31', 'Feb 1', 'Feb 2', 'Feb 3', 'Feb 4'
]

const getChartConfig = () => {
  const calculateRange = (data, paddingPercent = 15) => {
    const dataMin = Math.min(...data)
    const dataMax = Math.max(...data)
    const range = dataMax - dataMin
    const padding = range * (paddingPercent / 100)
    const rawMin = dataMin - padding
    const rawMax = dataMax + padding
    const rawRange = rawMax - rawMin
    const roughStep = rawRange / 4
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
    const normalized = roughStep / magnitude
    let niceStep
    if (normalized < 1.5) niceStep = 1
    else if (normalized < 3) niceStep = 2
    else if (normalized < 7) niceStep = 5
    else niceStep = 10
    niceStep *= magnitude
    const yMin = Math.floor(rawMin / niceStep) * niceStep
    const stepsNeeded = Math.ceil((rawMax - yMin) / niceStep)
    const steps = Math.max(4, stepsNeeded)
    const yMax = yMin + (niceStep * steps)
    return { yMin, yMax, tickAmount: steps }
  }

  const configs = {
    'conversion-rate': {
      data: conversionRateData,
      name: 'Conversion Rate',
      ...calculateRange(conversionRateData, 15),
      formatter: (value) => `${value.toFixed(1)}%`,
      tooltipFormatter: (value) => `${value.toFixed(2)}%`
    },
    'conversions': {
      data: conversionsData,
      name: 'Conversions',
      ...calculateRange(conversionsData, 15),
      formatter: (value) => Math.round(value),
      tooltipFormatter: (value) => Math.round(value)
    },
    'impressions': {
      data: impressionsData,
      name: 'Impressions',
      ...calculateRange(impressionsData, 15),
      formatter: (value) => `${(value / 1000).toFixed(1)}K`,
      tooltipFormatter: (value) => value.toLocaleString()
    },
    'unique-visitors': {
      data: uniqueVisitorsData,
      name: 'Unique Visitors',
      ...calculateRange(uniqueVisitorsData, 15),
      formatter: (value) => `${(value / 1000).toFixed(1)}K`,
      tooltipFormatter: (value) => value.toLocaleString()
    },
    'supported-orders': {
      data: supportedOrdersData,
      name: 'Supported Orders',
      ...calculateRange(supportedOrdersData, 15),
      formatter: (value) => Math.round(value),
      tooltipFormatter: (value) => Math.round(value)
    },
    'supported-revenue': {
      data: supportedRevenueData,
      name: 'Supported Revenue',
      ...calculateRange(supportedRevenueData, 15),
      formatter: (value) => `HUF ${(value / 1000).toFixed(0)}K`,
      tooltipFormatter: (value) => `HUF ${value.toLocaleString()}`
    }
  }
  return configs[activeTab.value] || configs['conversion-rate']
}

const chartSeries = computed(() => {
  const config = getChartConfig()
  return [{
    name: config.name,
    data: config.data
  }]
})

const chartOptions = computed(() => {
  const config = getChartConfig()
  return {
    chart: {
      type: 'area',
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#ed5a29']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      },
      colors: ['#ed5a29']
    },
    grid: {
      borderColor: '#f1f2f4',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      type: 'category',
      categories: [
        'Jan 6', '', '', 'Jan 9', '', '', 'Jan 12', '', '', 'Jan 15',
        '', '', 'Jan 18', '', '', 'Jan 21', '', '', 'Jan 24', '',
        '', 'Jan 27', '', '', 'Jan 30', '', '', 'Feb 2', '', 'Feb 4'
      ],
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        style: { colors: '#9ba2ad', fontSize: '11px' }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      min: config.yMin,
      max: config.yMax,
      tickAmount: config.tickAmount,
      labels: {
        formatter: config.formatter,
        style: { colors: '#9ba2ad', fontSize: '12px' }
      }
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex }) {
        const value = series[seriesIndex][dataPointIndex]
        const date = chartDates[dataPointIndex]
        return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="color: #9ba2ad; font-weight: 400; font-size: 11px; margin-bottom: 4px;">${date}, 2026</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 8px; height: 8px; background: #ed5a29; border-radius: 50%; display: inline-block;"></span>
            <span style="color: #505763; font-weight: 500;">${config.name}: ${config.tooltipFormatter(value)}</span>
          </div>
        </div>`
      }
    },
    markers: {
      size: 0,
      hover: { size: 5 }
    }
  }
})
</script>

<style scoped>
/* Filters Section */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filters-right {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.trend-chart-tabs {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
  overflow-x: auto;
}

.trend-chart-tab {
  padding: 1.25rem 0.75rem;
  flex: 1;
  min-width: 140px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.25s ease;
  position: relative;
}

.trend-chart-tab:hover {
  background: rgb(249, 250, 251);
}

.trend-chart-tab.active {
  border-bottom-color: #ed5a29;
}

.trend-chart-tab-title {
  font-size: 0.875rem;
  color: rgb(80, 87, 99);
  opacity: 0.8;
  margin-bottom: 0.625rem;
  font-weight: 500;
}

.trend-chart-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.trend-chart-value {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgb(80, 87, 99);
}

.trend-chart-change {
  font-size: 0.75rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-chart-change.positive {
  color: rgb(35, 158, 119);
}

.trend-chart-change.negative {
  color: rgb(228, 37, 45);
}

.chart-canvas {
  padding: 0;
}

</style>
