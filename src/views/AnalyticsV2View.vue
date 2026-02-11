<template>
  <DashboardLayout
    active-menu-item="insights"
    @menu-click="$emit('menu-click', $event)"
  >
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-2xl font-semibold text-om-gray-700">Analytics</h1>
          <div class="status-badge">
            <RefreshCw :size="16" class="status-badge-icon" />
            <p class="status-text">Freshly loaded data</p>
          </div>
        </div>

        <!-- Filters Section -->
        <div class="filters-section">
          <!-- Domain Selector -->
          <Dropdown
            v-model="selectedDomain"
            :options="domains"
            placeholder="Select domain"
          >
            <template #icon>
              <div class="w-5 h-5 rounded-full overflow-hidden">
                <img src="/telekom.png" alt="Domain" class="w-full h-full object-cover" />
              </div>
            </template>
          </Dropdown>

          <!-- Right-aligned filters -->
          <div class="filters-right">
            <!-- Devices Dropdown -->
            <Dropdown
              v-model="selectedDevice"
              :options="devices"
              placeholder="Select device"
            >
              <template #icon>
                <Monitor :size="20" class="text-om-gray-400" />
              </template>
            </Dropdown>

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
            <!-- Dynamic Chart based on active tab -->
            <VueApexCharts
              :key="activeTab"
              type="area"
              height="280"
              :options="chartOptions"
              :series="chartSeries"
            />
          </div>
        </div>

        <!-- Campaign Performance Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 pt-5 pb-5 pl-5 pr-5">
          <h2 class="section-title">Campaign Performance</h2>
          <div class="campaign-performance-layout">
            <!-- Left Column: Campaign List -->
            <div class="campaign-list-column">
              <div class="campaign-table-header">
                <div class="header-cell">Campaign</div>
              </div>
              <div class="campaign-table-body">
                <template v-for="campaign in campaignData" :key="campaign.id">
                  <div
                    class="campaign-row"
                    @mouseenter="setHoveredCampaign(campaign.id)"
                    @mouseleave="clearHoveredCampaign()"
                    :class="{ 'is-hovered': hoveredCampaignId === campaign.id }"
                  >
                    <div class="campaign-name-wrapper">
                      <div class="campaign-name-with-icon" @click="campaign.variants && toggleCampaign(campaign.id)">
                        <div class="campaign-name">{{ campaign.name }}</div>
                        <ExternalLink
                          :size="14"
                          class="campaign-link-icon"
                          @click.stop="navigateToCampaignPage(campaign.id)"
                        />
                      </div>
                      <ChevronDown
                        v-if="campaign.variants"
                        :size="16"
                        :class="['campaign-chevron', { 'campaign-chevron-expanded': expandedCampaigns.has(campaign.id) }]"
                        @click.stop="toggleCampaign(campaign.id)"
                      />
                    </div>
                  </div>
                  <template v-if="campaign.variants && expandedCampaigns.has(campaign.id)">
                    <div
                      v-for="(variant, index) in campaign.variants"
                      :key="`${campaign.id}-variant-${index}`"
                      class="campaign-variant-row"
                    >
                      <div class="campaign-variant-name">{{ variant.name }}</div>
                    </div>
                  </template>
                </template>
              </div>
            </div>

            <!-- Right Column: Metrics -->
            <div class="campaign-metrics-column">
              <div class="campaign-table-header">
                <div class="header-cell numeric">Unique Visitors</div>
                <div class="header-cell numeric">Impressions</div>
                <div class="header-cell numeric">Conversions</div>
                <div class="header-cell numeric">Conversion Rate</div>
              </div>
              <div class="campaign-table-body">
                <template v-for="campaign in campaignData" :key="campaign.id">
                  <div
                    class="campaign-metrics-row"
                    @mouseenter="setHoveredCampaign(campaign.id)"
                    @mouseleave="clearHoveredCampaign()"
                    :class="{ 'is-hovered': hoveredCampaignId === campaign.id }"
                  >
                    <div class="metric-cell">{{ campaign.visitors.toLocaleString() }}</div>
                    <div class="metric-cell">{{ campaign.impressions.toLocaleString() }}</div>
                    <div class="metric-cell">{{ campaign.conversions }}</div>
                    <div class="metric-cell">{{ campaign.conversionRate }}%</div>
                  </div>
                  <template v-if="campaign.variants && expandedCampaigns.has(campaign.id)">
                    <div
                      v-for="(variant, index) in campaign.variants"
                      :key="`${campaign.id}-variant-${index}`"
                      class="campaign-variant-metrics-row"
                    >
                      <div class="metric-cell">{{ variant.visitors.toLocaleString() }}</div>
                      <div class="metric-cell">{{ variant.impressions.toLocaleString() }}</div>
                      <div class="metric-cell">{{ variant.conversions }}</div>
                      <div class="metric-cell">{{ variant.conversionRate }}%</div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Visited Pages Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 pt-5 pb-5 pl-5 pr-5">
          <div class="section-header">
            <h2 class="section-title">Visited Pages</h2>
            <button class="view-all-btn" @click="showModal('visited-pages')">View All</button>
          </div>
          <div class="breakdown-table">
            <div class="breakdown-header">
              <div class="breakdown-header-cell" style="flex: 2">Page URL</div>
              <div class="breakdown-header-cell numeric">Page Views</div>
              <div class="breakdown-header-cell numeric">Unique Visitors</div>
              <div class="breakdown-header-cell numeric">Conversions</div>
              <div class="breakdown-header-cell numeric">Conversion Rate</div>
            </div>
            <div class="breakdown-body">
              <div
                v-for="page in visitedPagesDisplay"
                :key="page.url"
                class="breakdown-row"
              >
                <div class="breakdown-cell url-cell" style="flex: 2">
                  <a :href="page.url" target="_blank" class="url-link">
                    {{ page.url }}
                    <ExternalLink :size="14" class="external-icon" />
                  </a>
                </div>
                <div class="breakdown-cell numeric">{{ page.pageViews.toLocaleString() }}</div>
                <div class="breakdown-cell numeric">{{ page.visitors.toLocaleString() }}</div>
                <div class="breakdown-cell numeric">{{ page.conversions }}</div>
                <div class="breakdown-cell numeric">{{ page.conversionRate }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Breakdown Modules Row -->
        <div class="breakdown-modules-row">
          <!-- Landing Pages -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] pt-5 pb-5 pl-5 pr-5">
            <div class="section-header">
              <h2 class="section-title">Landing Pages</h2>
              <button class="view-all-btn" @click="showModal('landing-pages')">View All</button>
            </div>
            <div class="breakdown-table">
              <div class="breakdown-header">
                <div class="breakdown-header-cell" style="flex: 2">Landing Page</div>
                <div class="breakdown-header-cell numeric">Unique Visitors</div>
                <div class="breakdown-header-cell numeric">Conversions</div>
                <div class="breakdown-header-cell numeric">Conversion Rate</div>
              </div>
              <div class="breakdown-body">
                <div
                  v-for="page in landingPagesDisplay"
                  :key="page.url"
                  class="breakdown-row"
                >
                  <div class="breakdown-cell url-cell" style="flex: 2">
                    <a :href="page.url" target="_blank" class="url-link">
                      {{ page.url }}
                      <ExternalLink :size="14" class="external-icon" />
                    </a>
                  </div>
                  <div class="breakdown-cell numeric">{{ page.visitors.toLocaleString() }}</div>
                  <div class="breakdown-cell numeric">{{ page.conversions }}</div>
                  <div class="breakdown-cell numeric">{{ page.conversionRate }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Browser Languages -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] pt-5 pb-5 pl-5 pr-5">
            <div class="section-header">
              <h2 class="section-title">Browser Languages</h2>
              <button class="view-all-btn" @click="showModal('browser-languages')">View All</button>
            </div>
            <div class="breakdown-table">
              <div class="breakdown-header">
                <div class="breakdown-header-cell" style="flex: 2">Language</div>
                <div class="breakdown-header-cell numeric">Unique Visitors</div>
                <div class="breakdown-header-cell numeric">Conversions</div>
                <div class="breakdown-header-cell numeric">Conversion Rate</div>
              </div>
              <div class="breakdown-body">
                <div
                  v-for="lang in browserLanguagesDisplay"
                  :key="lang.code"
                  class="breakdown-row"
                >
                  <div class="breakdown-cell" style="flex: 2">{{ lang.code }}</div>
                  <div class="breakdown-cell numeric">{{ lang.visitors.toLocaleString() }}</div>
                  <div class="breakdown-cell numeric">{{ lang.conversions }}</div>
                  <div class="breakdown-cell numeric">{{ lang.conversionRate }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- UTM Modules Row -->
        <div class="breakdown-modules-row">
          <!-- UTM Campaigns -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] pt-5 pb-5 pl-5 pr-5">
            <div class="section-header">
              <h2 class="section-title">UTM Campaigns</h2>
              <button class="view-all-btn" @click="showModal('utm-campaigns')">View All</button>
            </div>
            <div class="breakdown-table">
              <div class="breakdown-header">
                <div class="breakdown-header-cell" style="flex: 2">Campaign</div>
                <div class="breakdown-header-cell numeric">Unique Visitors</div>
                <div class="breakdown-header-cell numeric">Conversions</div>
                <div class="breakdown-header-cell numeric">Conversion Rate</div>
              </div>
              <div class="breakdown-body">
                <div
                  v-for="campaign in utmCampaignsDisplay"
                  :key="campaign.name"
                  class="breakdown-row"
                >
                  <div class="breakdown-cell" style="flex: 2">{{ campaign.name }}</div>
                  <div class="breakdown-cell numeric">{{ campaign.visitors.toLocaleString() }}</div>
                  <div class="breakdown-cell numeric">{{ campaign.conversions }}</div>
                  <div class="breakdown-cell numeric">{{ campaign.conversionRate }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- UTM Sources -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] pt-5 pb-5 pl-5 pr-5">
            <div class="section-header">
              <h2 class="section-title">UTM Sources</h2>
              <button class="view-all-btn" @click="showModal('utm-sources')">View All</button>
            </div>
            <div class="breakdown-table">
              <div class="breakdown-header">
                <div class="breakdown-header-cell" style="flex: 2">Source</div>
                <div class="breakdown-header-cell numeric">Unique Visitors</div>
                <div class="breakdown-header-cell numeric">Conversions</div>
                <div class="breakdown-header-cell numeric">Conversion Rate</div>
              </div>
              <div class="breakdown-body">
                <div
                  v-for="source in utmSourcesDisplay"
                  :key="source.name"
                  class="breakdown-row"
                >
                  <div class="breakdown-cell" style="flex: 2">{{ source.name }}</div>
                  <div class="breakdown-cell numeric">{{ source.visitors.toLocaleString() }}</div>
                  <div class="breakdown-cell numeric">{{ source.conversions }}</div>
                  <div class="breakdown-cell numeric">{{ source.conversionRate }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <transition name="modal-fade">
        <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">{{ modalTitle }}</h2>
              <button class="modal-close-btn" @click="closeModal">
                <X :size="20" />
              </button>
            </div>
            <div class="modal-body">
              <!-- Visited Pages -->
              <div v-if="modalType === 'visited-pages'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Page URL</div>
                  <div class="breakdown-header-cell numeric">Page Views</div>
                  <div class="breakdown-header-cell numeric">Unique Visitors</div>
                  <div class="breakdown-header-cell numeric">Conversions</div>
                  <div class="breakdown-header-cell numeric">Conversion Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="page in visitedPages"
                    :key="page.url"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell url-cell" style="flex: 2">
                      <a :href="page.url" target="_blank" class="url-link">
                        {{ page.url }}
                        <ExternalLink :size="14" class="external-icon" />
                      </a>
                    </div>
                    <div class="breakdown-cell numeric">{{ page.pageViews.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ page.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ page.conversions }}</div>
                    <div class="breakdown-cell numeric">{{ page.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- Landing Pages -->
              <div v-if="modalType === 'landing-pages'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Landing Page</div>
                  <div class="breakdown-header-cell numeric">Unique Visitors</div>
                  <div class="breakdown-header-cell numeric">Conversions</div>
                  <div class="breakdown-header-cell numeric">Conversion Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="page in landingPages"
                    :key="page.url"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell url-cell" style="flex: 2">
                      <a :href="page.url" target="_blank" class="url-link">
                        {{ page.url }}
                        <ExternalLink :size="14" class="external-icon" />
                      </a>
                    </div>
                    <div class="breakdown-cell numeric">{{ page.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ page.conversions }}</div>
                    <div class="breakdown-cell numeric">{{ page.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- Browser Languages -->
              <div v-if="modalType === 'browser-languages'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Language</div>
                  <div class="breakdown-header-cell numeric">Unique Visitors</div>
                  <div class="breakdown-header-cell numeric">Conversions</div>
                  <div class="breakdown-header-cell numeric">Conversion Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="lang in browserLanguages"
                    :key="lang.code"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell" style="flex: 2">{{ lang.code }}</div>
                    <div class="breakdown-cell numeric">{{ lang.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ lang.conversions }}</div>
                    <div class="breakdown-cell numeric">{{ lang.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- UTM Campaigns -->
              <div v-if="modalType === 'utm-campaigns'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Campaign</div>
                  <div class="breakdown-header-cell numeric">Unique Visitors</div>
                  <div class="breakdown-header-cell numeric">Conversions</div>
                  <div class="breakdown-header-cell numeric">Conversion Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="campaign in utmCampaigns"
                    :key="campaign.name"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell" style="flex: 2">{{ campaign.name }}</div>
                    <div class="breakdown-cell numeric">{{ campaign.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ campaign.conversions }}</div>
                    <div class="breakdown-cell numeric">{{ campaign.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- UTM Sources -->
              <div v-if="modalType === 'utm-sources'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Source</div>
                  <div class="breakdown-header-cell numeric">Unique Visitors</div>
                  <div class="breakdown-header-cell numeric">Conversions</div>
                  <div class="breakdown-header-cell numeric">Conversion Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="source in utmSources"
                    :key="source.name"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell" style="flex: 2">{{ source.name }}</div>
                    <div class="breakdown-cell numeric">{{ source.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ source.conversions }}</div>
                    <div class="breakdown-cell numeric">{{ source.conversionRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ExternalLink, ChevronDown, Monitor, Target, Calendar, RefreshCw, TrendingUp, TrendingDown, X } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import VueApexCharts from 'vue3-apexcharts'

const emit = defineEmits(['menu-click'])

const activeTab = ref('conversion-rate')

// Domain selector
const selectedDomain = ref('reflexshop.hu')
const domains = ref([
  'reflexshop.hu',
  'telekom.hu',
  'shop.telekom.hu',
  'demo.optimonk.com'
])

// Devices dropdown
const selectedDevice = ref('PC and Mobile')
const devices = ref([
  'PC and Mobile',
  'PC only',
  'Mobile only'
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

// Chart data - 30 days of conversion rate (0.4% to 0.8%)
// Chart data for each metric
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

// Full dates array for tooltip
const chartDates = [
  'Jan 6', 'Jan 7', 'Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14', 'Jan 15',
  'Jan 16', 'Jan 17', 'Jan 18', 'Jan 19', 'Jan 20', 'Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25',
  'Jan 26', 'Jan 27', 'Jan 28', 'Jan 29', 'Jan 30', 'Jan 31', 'Feb 1', 'Feb 2', 'Feb 3', 'Feb 4'
]

// Get chart config based on active tab
const getChartConfig = () => {
  // Helper function to calculate dynamic min/max with padding and nice rounding
  const calculateRange = (data, paddingPercent = 15) => {
    const dataMin = Math.min(...data)
    const dataMax = Math.max(...data)
    const range = dataMax - dataMin
    const padding = range * (paddingPercent / 100)

    // Calculate raw min/max with padding
    const rawMin = dataMin - padding
    const rawMax = dataMax + padding
    const rawRange = rawMax - rawMin

    // Calculate a "nice" step size for 4 intervals (5 grid lines)
    const roughStep = rawRange / 4
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
    const normalized = roughStep / magnitude

    // Choose nice step from [1, 2, 5, 10]
    let niceStep
    if (normalized < 1.5) niceStep = 1
    else if (normalized < 3) niceStep = 2
    else if (normalized < 7) niceStep = 5
    else niceStep = 10

    niceStep *= magnitude

    // Round min down to nice step boundary
    const yMin = Math.floor(rawMin / niceStep) * niceStep

    // Calculate how many steps needed to cover all data
    const stepsNeeded = Math.ceil((rawMax - yMin) / niceStep)

    // Use at least 4 steps, or more if needed to cover all data
    const steps = Math.max(4, stepsNeeded)

    // Calculate max as exactly 'steps' steps from min to ensure even distribution
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

// ApexCharts configuration - computed based on active tab
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
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
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
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
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
        style: {
          colors: '#9ba2ad',
          fontSize: '11px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      min: config.yMin,
      max: config.yMax,
      tickAmount: config.tickAmount,
      labels: {
        formatter: config.formatter,
        style: {
          colors: '#9ba2ad',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
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
      hover: {
        size: 5
      }
    }
  }
})

const getActiveTabTitle = () => {
  const tab = trendTabs.value.find(t => t.id === activeTab.value)
  return tab ? tab.title : ''
}

const trendTabs = ref([
  { id: 'conversion-rate', title: 'Conversion Rate', value: '0.57%', change: '+14.0%', isPositive: true },
  { id: 'conversions', title: 'Conversions', value: '2.2K', change: '+8.3%', isPositive: true },
  { id: 'impressions', title: 'Impressions', value: '384.4K', change: '+12.5%', isPositive: true },
  { id: 'unique-visitors', title: 'Unique Visitors', value: '168.2K', change: '+6.7%', isPositive: true },
  { id: 'supported-orders', title: 'Supported Orders', value: '286', change: '-4.2%', isPositive: false },
  { id: 'supported-revenue', title: 'Supported Revenue', value: 'HUF 8,494,963', change: '+15.8%', isPositive: true }
])

const expandedCampaigns = ref(new Set())
const hoveredCampaignId = ref(null)

const toggleCampaign = (campaignId) => {
  if (expandedCampaigns.value.has(campaignId)) {
    expandedCampaigns.value.delete(campaignId)
  } else {
    expandedCampaigns.value.add(campaignId)
  }
}

const setHoveredCampaign = (campaignId) => {
  hoveredCampaignId.value = campaignId
}

const clearHoveredCampaign = () => {
  hoveredCampaignId.value = null
}

const navigateToCampaignPage = (campaignId) => {
  // Navigate to campaign page - you can pass campaign ID if needed
  emit('menu-click', 'campaign-page')
}

// Modal state
const modalVisible = ref(false)
const modalType = ref('')
const modalTitle = ref('')

const showModal = (type) => {
  modalType.value = type
  modalVisible.value = true

  // Set modal title based on type
  const titles = {
    'visited-pages': 'Visited Pages',
    'landing-pages': 'Landing Pages',
    'browser-languages': 'Browser Languages',
    'utm-campaigns': 'UTM Campaigns',
    'utm-sources': 'UTM Sources'
  }
  modalTitle.value = titles[type]
}

const closeModal = () => {
  modalVisible.value = false
  modalType.value = ''
}

const campaignData = ref([
  {
    id: 1,
    name: 'Campaign #1108',
    visitors: 72543,
    impressions: 124567,
    conversions: 456,
    conversionRate: 0.63,
    variants: [
      { name: 'Control Variant', visitors: 36000, impressions: 62000, conversions: 228, conversionRate: 0.63 },
      { name: 'Variant A', visitors: 36543, impressions: 62567, conversions: 228, conversionRate: 0.62 }
    ]
  },
  {
    id: 2,
    name: 'Limited package shipping from January 5',
    visitors: 45678,
    impressions: 98234,
    conversions: 234,
    conversionRate: 0.51,
    variants: [
      { name: 'Control Variant', visitors: 22839, impressions: 49117, conversions: 117, conversionRate: 0.51 },
      { name: 'Variant A', visitors: 22839, impressions: 49117, conversions: 117, conversionRate: 0.51 }
    ]
  },
  { id: 3, name: 'Order confidently copy', visitors: 38902, impressions: 87456, conversions: 189, conversionRate: 0.49 },
  { id: 4, name: 'PX_01_Subscriber popup_gift_Reflexshop', visitors: 32145, impressions: 76543, conversions: 167, conversionRate: 0.52 },
  { id: 5, name: 'Service AI - Smart Product Page Optimizer v4 🎉 Winner', visitors: 28567, impressions: 65432, conversions: 145, conversionRate: 0.51 },
  { id: 6, name: 'Jungo traffic redirector', visitors: 24890, impressions: 54321, conversions: 128, conversionRate: 0.51 },
  { id: 7, name: 'PC Service Smart Abandonment Stopper - Winner', visitors: 21456, impressions: 48765, conversions: 112, conversionRate: 0.52 },
  { id: 8, name: 'Dynamic Content Visitor/Impression Ratio Test', visitors: 18234, impressions: 42345, conversions: 98, conversionRate: 0.54 },
  { id: 9, name: 'Funko upsell', visitors: 15678, impressions: 38765, conversions: 87, conversionRate: 0.55 },
  { id: 10, name: '18+ verification', visitors: 12345, impressions: 32456, conversions: 72, conversionRate: 0.58 }
])

const visitedPages = ref([
  { url: 'https://reflexshop.hu/shop_search.php', pageViews: 45678, visitors: 32145, conversions: 234, conversionRate: 0.73 },
  { url: 'https://reflexshop.hu', pageViews: 38902, visitors: 28567, conversions: 189, conversionRate: 0.66 },
  { url: 'https://reflexshop.hu/shop_cart.php', pageViews: 32145, visitors: 24890, conversions: 167, conversionRate: 0.67 },
  { url: 'https://reflexshop.hu/Tarsasjatekok', pageViews: 28567, visitors: 21456, conversions: 145, conversionRate: 0.68 },
  { url: 'https://reflexshop.hu/shop_artspec.php', pageViews: 24890, visitors: 18234, conversions: 128, conversionRate: 0.70 },
  { url: 'https://reflexshop.hu/shop_login.php', pageViews: 21456, visitors: 15678, conversions: 112, conversionRate: 0.71 },
  { url: 'https://reflexshop.hu/akcios-termekek', pageViews: 18234, visitors: 12345, conversions: 98, conversionRate: 0.79 },
  { url: 'https://reflexshop.hu/Funko/Funko-POP-figurak', pageViews: 15678, visitors: 10234, conversions: 87, conversionRate: 0.85 },
  { url: 'https://reflexshop.hu/shop_reg.php', pageViews: 12345, visitors: 8765, conversions: 72, conversionRate: 0.82 },
  { url: 'https://reflexshop.hu/Funko', pageViews: 10234, visitors: 7456, conversions: 65, conversionRate: 0.87 },
  { url: 'https://reflexshop.hu/LEGO', pageViews: 9876, visitors: 6834, conversions: 58, conversionRate: 0.85 },
  { url: 'https://reflexshop.hu/shop_wishlist.php', pageViews: 8765, visitors: 5923, conversions: 52, conversionRate: 0.88 },
  { url: 'https://reflexshop.hu/Konyv', pageViews: 8234, visitors: 5467, conversions: 48, conversionRate: 0.88 },
  { url: 'https://reflexshop.hu/Puzzle', pageViews: 7654, visitors: 4989, conversions: 43, conversionRate: 0.86 },
  { url: 'https://reflexshop.hu/Filmek-sorozatok', pageViews: 7123, visitors: 4567, conversions: 39, conversionRate: 0.85 },
  { url: 'https://reflexshop.hu/shop_about.php', pageViews: 6789, visitors: 4234, conversions: 36, conversionRate: 0.85 },
  { url: 'https://reflexshop.hu/Kulfold', pageViews: 6234, visitors: 3876, conversions: 32, conversionRate: 0.83 },
  { url: 'https://reflexshop.hu/Magic-the-Gathering', pageViews: 5876, visitors: 3567, conversions: 29, conversionRate: 0.81 },
  { url: 'https://reflexshop.hu/Pokemon', pageViews: 5432, visitors: 3234, conversions: 26, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/shop_contact.php', pageViews: 5123, visitors: 2987, conversions: 24, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Gyerekjatekok', pageViews: 4876, visitors: 2765, conversions: 22, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Yu-Gi-Oh', pageViews: 4567, visitors: 2543, conversions: 20, conversionRate: 0.79 },
  { url: 'https://reflexshop.hu/Warhammer', pageViews: 4234, visitors: 2345, conversions: 18, conversionRate: 0.77 },
  { url: 'https://reflexshop.hu/Strategiai-jatekok', pageViews: 3987, visitors: 2156, conversions: 17, conversionRate: 0.79 },
  { url: 'https://reflexshop.hu/Keszlet-jatekok', pageViews: 3765, visitors: 1987, conversions: 15, conversionRate: 0.76 },
  { url: 'https://reflexshop.hu/shop_faq.php', pageViews: 3543, visitors: 1834, conversions: 14, conversionRate: 0.76 },
  { url: 'https://reflexshop.hu/Kaland-jatekok', pageViews: 3321, visitors: 1687, conversions: 13, conversionRate: 0.77 },
  { url: 'https://reflexshop.hu/Party-jatekok', pageViews: 3123, visitors: 1543, conversions: 12, conversionRate: 0.78 },
  { url: 'https://reflexshop.hu/Csaladi-jatekok', pageViews: 2987, visitors: 1432, conversions: 11, conversionRate: 0.77 },
  { url: 'https://reflexshop.hu/shop_privacy.php', pageViews: 2765, visitors: 1321, conversions: 10, conversionRate: 0.76 }
])

const landingPages = ref([
  { url: 'https://reflexshop.hu', visitors: 120143, conversions: 812, conversionRate: 0.68 },
  { url: 'https://reflexshop.hu/Tarsasjatekok', visitors: 45678, conversions: 345, conversionRate: 0.76 },
  { url: 'https://reflexshop.hu/shop_search.php', visitors: 38902, conversions: 289, conversionRate: 0.74 },
  { url: 'https://reflexshop.hu/akcios-termekek', visitors: 32145, conversions: 256, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Funko/Funko-POP-figurak', visitors: 28567, conversions: 234, conversionRate: 0.82 },
  { url: 'https://reflexshop.hu/shop_artspec.php', visitors: 24890, conversions: 198, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Funko', visitors: 21456, conversions: 178, conversionRate: 0.83 },
  { url: 'https://reflexshop.hu/shop_cart.php', visitors: 18234, conversions: 145, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/shop_login.php', visitors: 15678, conversions: 123, conversionRate: 0.78 },
  { url: 'https://reflexshop.hu/shop_reg.php', visitors: 12345, conversions: 98, conversionRate: 0.79 },
  { url: 'https://reflexshop.hu/LEGO', visitors: 11234, conversions: 89, conversionRate: 0.79 },
  { url: 'https://reflexshop.hu/Konyv', visitors: 10876, conversions: 85, conversionRate: 0.78 },
  { url: 'https://reflexshop.hu/Puzzle', visitors: 9765, conversions: 78, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Filmek-sorozatok', visitors: 8943, conversions: 72, conversionRate: 0.81 },
  { url: 'https://reflexshop.hu/Kulfold', visitors: 8234, conversions: 67, conversionRate: 0.81 },
  { url: 'https://reflexshop.hu/Magic-the-Gathering', visitors: 7654, conversions: 61, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Pokemon', visitors: 7123, conversions: 58, conversionRate: 0.81 },
  { url: 'https://reflexshop.hu/Gyerekjatekok', visitors: 6789, conversions: 54, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Yu-Gi-Oh', visitors: 6321, conversions: 51, conversionRate: 0.81 },
  { url: 'https://reflexshop.hu/Warhammer', visitors: 5987, conversions: 48, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Strategiai-jatekok', visitors: 5543, conversions: 45, conversionRate: 0.81 },
  { url: 'https://reflexshop.hu/Keszlet-jatekok', visitors: 5234, conversions: 42, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Kaland-jatekok', visitors: 4876, conversions: 39, conversionRate: 0.80 },
  { url: 'https://reflexshop.hu/Party-jatekok', visitors: 4543, conversions: 37, conversionRate: 0.81 },
  { url: 'https://reflexshop.hu/Csaladi-jatekok', visitors: 4234, conversions: 34, conversionRate: 0.80 }
])

const browserLanguages = ref([
  { code: 'hu-HU', visitors: 120143, conversions: 812, conversionRate: 0.68 },
  { code: 'en-US', visitors: 21480, conversions: 156, conversionRate: 0.73 },
  { code: 'en-GB', visitors: 9748, conversions: 72, conversionRate: 0.74 },
  { code: 'hu', visitors: 8612, conversions: 65, conversionRate: 0.75 },
  { code: 'en', visitors: 4734, conversions: 38, conversionRate: 0.80 },
  { code: 'zh-CN', visitors: 913, conversions: 8, conversionRate: 0.88 },
  { code: 'de-DE', visitors: 393, conversions: 3, conversionRate: 0.76 },
  { code: 'en-HU', visitors: 300, conversions: 2, conversionRate: 0.67 },
  { code: 'ru-RU', visitors: 148, conversions: 1, conversionRate: 0.68 },
  { code: 'es-ES', visitors: 117, conversions: 1, conversionRate: 0.85 },
  { code: 'fr-FR', visitors: 234, conversions: 2, conversionRate: 0.85 },
  { code: 'it-IT', visitors: 198, conversions: 2, conversionRate: 1.01 },
  { code: 'pl-PL', visitors: 176, conversions: 1, conversionRate: 0.57 },
  { code: 'pt-PT', visitors: 143, conversions: 1, conversionRate: 0.70 },
  { code: 'nl-NL', visitors: 128, conversions: 1, conversionRate: 0.78 },
  { code: 'ro-RO', visitors: 112, conversions: 1, conversionRate: 0.89 },
  { code: 'cs-CZ', visitors: 98, conversions: 1, conversionRate: 1.02 },
  { code: 'sk-SK', visitors: 87, conversions: 1, conversionRate: 1.15 },
  { code: 'bg-BG', visitors: 76, conversions: 0, conversionRate: 0.00 },
  { code: 'hr-HR', visitors: 65, conversions: 1, conversionRate: 1.54 },
  { code: 'sr-RS', visitors: 54, conversions: 0, conversionRate: 0.00 },
  { code: 'sl-SI', visitors: 43, conversions: 0, conversionRate: 0.00 },
  { code: 'uk-UA', visitors: 38, conversions: 0, conversionRate: 0.00 },
  { code: 'sv-SE', visitors: 32, conversions: 0, conversionRate: 0.00 },
  { code: 'da-DK', visitors: 27, conversions: 0, conversionRate: 0.00 }
])

const utmCampaigns = ref([
  { name: 'olcsobbat_shopping_reflexshop', visitors: 45678, conversions: 345, conversionRate: 0.76 },
  { name: 'surfaces_across_google', visitors: 38902, conversions: 289, conversionRate: 0.74 },
  { name: 'KA-Konv-Kiemelt játékok', visitors: 32145, conversions: 256, conversionRate: 0.80 },
  { name: 'reflexshop_google_shopping', visitors: 28567, conversions: 234, conversionRate: 0.82 },
  { name: 'facebook_retargeting_q4', visitors: 24890, conversions: 198, conversionRate: 0.80 },
  { name: 'email_newsletter_december', visitors: 21456, conversions: 178, conversionRate: 0.83 },
  { name: 'instagram_stories_campaign', visitors: 18234, conversions: 145, conversionRate: 0.80 },
  { name: 'youtube_video_ads', visitors: 15678, conversions: 123, conversionRate: 0.78 },
  { name: 'google_search_brand', visitors: 12345, conversions: 98, conversionRate: 0.79 },
  { name: 'tiktok_influencer_collab', visitors: 10234, conversions: 87, conversionRate: 0.85 },
  { name: 'spring_sale_2026', visitors: 9876, conversions: 82, conversionRate: 0.83 },
  { name: 'black_friday_early_access', visitors: 8765, conversions: 73, conversionRate: 0.83 },
  { name: 'christmas_gift_guide', visitors: 7654, conversions: 64, conversionRate: 0.84 },
  { name: 'new_year_promotion', visitors: 6789, conversions: 57, conversionRate: 0.84 },
  { name: 'valentine_special', visitors: 5987, conversions: 51, conversionRate: 0.85 },
  { name: 'summer_clearance', visitors: 5432, conversions: 46, conversionRate: 0.85 },
  { name: 'back_to_school', visitors: 4876, conversions: 42, conversionRate: 0.86 },
  { name: 'halloween_treats', visitors: 4321, conversions: 37, conversionRate: 0.86 },
  { name: 'cyber_monday_deals', visitors: 3987, conversions: 34, conversionRate: 0.85 },
  { name: 'easter_egg_hunt', visitors: 3654, conversions: 31, conversionRate: 0.85 },
  { name: 'winter_wonderland', visitors: 3321, conversions: 28, conversionRate: 0.84 },
  { name: 'spring_cleaning_sale', visitors: 2987, conversions: 26, conversionRate: 0.87 },
  { name: 'mothers_day_gifts', visitors: 2765, conversions: 24, conversionRate: 0.87 },
  { name: 'fathers_day_deals', visitors: 2543, conversions: 22, conversionRate: 0.87 },
  { name: 'loyalty_program_bonus', visitors: 2321, conversions: 20, conversionRate: 0.86 }
])

const utmSources = ref([
  { name: 'facebook', visitors: 45678, conversions: 345, conversionRate: 0.76 },
  { name: 'olcsobbat', visitors: 38902, conversions: 289, conversionRate: 0.74 },
  { name: 'google', visitors: 32145, conversions: 256, conversionRate: 0.80 },
  { name: 'CJ', visitors: 28567, conversions: 234, conversionRate: 0.82 },
  { name: 'tarsasjatekok.com', visitors: 24890, conversions: 198, conversionRate: 0.80 },
  { name: 'TheMarketer', visitors: 21456, conversions: 178, conversionRate: 0.83 },
  { name: 'fb', visitors: 18234, conversions: 145, conversionRate: 0.80 },
  { name: 'ActiveCampaign', visitors: 15678, conversions: 123, conversionRate: 0.78 },
  { name: 'google_shopping', visitors: 12345, conversions: 98, conversionRate: 0.79 },
  { name: 'chatgpt.com', visitors: 10234, conversions: 87, conversionRate: 0.85 },
  { name: 'instagram', visitors: 9876, conversions: 82, conversionRate: 0.83 },
  { name: 'youtube', visitors: 8765, conversions: 73, conversionRate: 0.83 },
  { name: 'tiktok', visitors: 7654, conversions: 64, conversionRate: 0.84 },
  { name: 'pinterest', visitors: 6789, conversions: 57, conversionRate: 0.84 },
  { name: 'twitter', visitors: 5987, conversions: 51, conversionRate: 0.85 },
  { name: 'linkedin', visitors: 5432, conversions: 46, conversionRate: 0.85 },
  { name: 'reddit', visitors: 4876, conversions: 42, conversionRate: 0.86 },
  { name: 'newsletter', visitors: 4321, conversions: 37, conversionRate: 0.86 },
  { name: 'partner_site', visitors: 3987, conversions: 34, conversionRate: 0.85 },
  { name: 'affiliate_network', visitors: 3654, conversions: 31, conversionRate: 0.85 },
  { name: 'review_site', visitors: 3321, conversions: 28, conversionRate: 0.84 },
  { name: 'blog_post', visitors: 2987, conversions: 26, conversionRate: 0.87 },
  { name: 'podcast_sponsor', visitors: 2765, conversions: 24, conversionRate: 0.87 },
  { name: 'forum_post', visitors: 2543, conversions: 22, conversionRate: 0.87 },
  { name: 'mobile_app', visitors: 2321, conversions: 20, conversionRate: 0.86 }
])

// Computed properties for display (only first 5 rows)
const visitedPagesDisplay = computed(() => visitedPages.value.slice(0, 5))
const landingPagesDisplay = computed(() => landingPages.value.slice(0, 5))
const browserLanguagesDisplay = computed(() => browserLanguages.value.slice(0, 5))
const utmCampaignsDisplay = computed(() => utmCampaigns.value.slice(0, 5))
const utmSourcesDisplay = computed(() => utmSources.value.slice(0, 5))
</script>

<style scoped>
.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgb(227, 229, 232);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}

.status-badge-icon {
  color: rgb(143, 151, 164);
}

.status-text {
  font-size: 0.875rem;
  color: rgb(80, 87, 99);
}

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

/* Trend Chart Tabs */
.trend-chart-tabs {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
  overflow-x: auto;
}

.trend-chart-tab {
  padding: 1rem 0.5rem;
  flex: 1;
  min-width: 140px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.trend-chart-tab:hover {
  background: rgb(247, 247, 248);
}

.trend-chart-tab.active {
  border-bottom-color: #ed5a29;
}

.trend-chart-tab-title {
  font-size: 0.875rem;
  color: rgb(80, 87, 99);
  opacity: 0.7;
  margin-bottom: 0.5rem;
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

.line-chart {
  width: 100%;
  height: auto;
}

.chart-point {
  cursor: pointer;
  transition: r 0.2s;
}

.chart-point:hover {
  r: 5;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(247, 247, 248);
  border-radius: 0.5rem;
  border: 2px dashed rgb(227, 229, 232);
}

/* Section Titles and Layout */
.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgb(35, 38, 42);
  margin-bottom: 1rem;
}

.campaign-performance-layout {
  display: flex;
  gap: 0;
  overflow-x: auto;
}

.campaign-list-column {
  flex: 0 0 480px;
}

.campaign-metrics-column {
  flex: 1;
  min-width: 500px;
}

.campaign-table-header {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
}

.header-cell {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #8F97A4;
  flex: 1;
}

.campaign-list-column .header-cell {
  flex: initial;
  width: 100%;
}

.header-cell.numeric {
  text-align: right;
}

.campaign-table-body {
  display: flex;
  flex-direction: column;
}

.campaign-row {
  height: 56px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  border-bottom: 1px solid rgb(243, 244, 246);
}

.campaign-row.is-hovered {
  background: rgb(247, 247, 248);
}

.campaign-name-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.campaign-name-with-icon {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  min-width: 0;
}

.campaign-name {
  font-size: 0.875rem;
  color: #23262A;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  max-height: 2.275rem;
  min-width: 0;
}

.campaign-link-icon {
  color: #8F97A4;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  flex-shrink: 0;
}

.campaign-row:hover .campaign-link-icon {
  opacity: 1;
}

.campaign-link-icon:hover {
  color: #ed5a29;
}

.campaign-chevron {
  flex-shrink: 0;
  color: #8F97A4;
  transition: transform 0.2s;
  cursor: pointer;
}

.campaign-chevron-expanded {
  transform: rotate(180deg);
}

.campaign-variant-row {
  height: 56px;
  padding: 0 1rem 0 2.5rem;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  border-bottom: 1px solid rgb(243, 244, 246);
}

.campaign-variant-row:hover {
  background: rgb(247, 247, 248);
}

.campaign-variant-name {
  font-size: 0.875rem;
  color: #8F97A4;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.campaign-variant-metrics-row {
  display: flex;
  transition: background 0.2s;
  background: rgb(249, 250, 251);
  border-bottom: 1px solid rgb(243, 244, 246);
}

.campaign-variant-metrics-row:hover {
  background: rgb(247, 247, 248);
}

.campaign-variant-metrics-row .metric-cell {
  font-size: 0.875rem;
  color: #8F97A4;
  font-weight: 400;
}

.campaign-metrics-row {
  height: 56px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  border-bottom: 1px solid rgb(243, 244, 246);
}

.campaign-metrics-row.is-hovered {
  background: rgb(247, 247, 248);
}

.metric-cell {
  padding: 0 1rem;
  font-size: 0.875rem;
  color: #23262A;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Breakdown Tables */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.view-all-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: rgb(80, 87, 99);
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: rgb(243, 244, 246);
  color: rgb(35, 38, 42);
}

.breakdown-table {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
}

.breakdown-header {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
}

.breakdown-header-cell {
  padding: 0.75rem 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #8F97A4;
  flex: 1;
}

.breakdown-header-cell.numeric {
  text-align: right;
}

.breakdown-body {
  display: flex;
  flex-direction: column;
}

.breakdown-row {
  display: flex;
  border-bottom: 1px solid rgb(243, 244, 246);
  transition: background 0.2s;
  cursor: pointer;
}

.breakdown-row:hover {
  background: rgb(247, 247, 248);
}

.breakdown-cell {
  padding: 0.875rem 0.25rem;
  font-size: 0.875rem;
  color: #23262A;
  flex: 1;
}

.breakdown-cell.numeric {
  text-align: right;
}

.url-cell {
  overflow: hidden;
}

.url-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #23262A;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.url-link:hover {
  color: #ed5a29;
}

.external-icon {
  flex-shrink: 0;
  color: rgb(185, 190, 198);
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
}

.breakdown-row:hover .external-icon {
  opacity: 1;
}

.url-link:hover .external-icon {
  color: #ed5a29;
}

/* Breakdown Modules Row */
.breakdown-modules-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 1439px) {
  .breakdown-modules-row {
    grid-template-columns: 1fr;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 1200px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgb(227, 229, 232);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(35, 38, 42);
}

.modal-close-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: rgb(143, 151, 164);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: rgb(243, 244, 246);
  color: rgb(35, 38, 42);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-body .breakdown-table {
  overflow-x: visible;
}

.modal-body .breakdown-header,
.modal-body .breakdown-row {
  min-width: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
