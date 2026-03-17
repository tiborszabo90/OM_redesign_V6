<template>
  <DashboardLayout
    active-menu-item="insights"
    @menu-click="$emit('menu-click', $event)"
    :right-panel-collapsed="!isChatOpen"
  >
    <template #content>
      <div class="analytics-outer w-full max-w-[1400px] mx-auto -mt-3" :class="{ 'chat-open': isChatOpen }">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-5 max-960:flex-col max-960:items-start max-960:gap-3">
          <h1 class="text-2xl max-960:text-xl font-semibold text-om-gray-700">Analytics</h1>
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
              <div class="w-5 h-5 rounded-full bg-[#7AAF8A] flex items-center justify-center shrink-0">
                <Dice5 :size="12" class="text-white" />
              </div>
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

        <!-- Top Optimization Opportunities -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] mb-6 pt-5 pb-5">
          <div class="opportunities-title-row">
            <h2 class="section-title">Top Optimization Opportunities</h2>
            <button class="view-all-btn" @click="emit('navigate-to-opportunities')">View all</button>
          </div>
          <div class="opportunities-list">
            <div
              v-for="opp in optimizationOpportunities"
              :key="opp.id"
              class="opportunity-item"
              @click="emit('navigate-to-opportunity', opp.id)"
            >
              <div class="opportunity-info">
                <div class="opportunity-header">
                  <div class="opportunity-name">{{ opp.name }}</div>
                  <div :class="['opportunity-badge', `badge-${opp.level}`]">{{ opp.value }}</div>
                </div>
                <div class="opportunity-desc">{{ opp.description }}</div>
              </div>
              <ChevronRight :size="16" class="opportunity-chevron" />

            </div>
          </div>
        </div>

        <!-- Campaign Performance Section -->
        <div :class="['bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] mb-6 pt-5 pb-5', { 'has-selection': hasSelection }]">
          <h2 class="section-title">Campaign Performance</h2>

          <!-- Filter Bar - Full Width -->
          <div v-if="hasSelection" class="campaign-filter-bar">
            <Checkbox
              :model-value="allSelected"
              :indeterminate="isIndeterminate"
              size="sm"
              class="custom-checkbox"
              @update:model-value="toggleSelectAll"
            />
            <span class="selection-count">{{ selectedCount }} selected</span>
            <button class="filter-btn">
              Filter
            </button>
          </div>

          <!-- Table Headers -->
          <div v-if="!hasSelection" class="campaign-headers-row">
            <div class="campaign-list-header">
              <div class="header-cell">Campaign</div>
            </div>
            <div class="campaign-metrics-header">
              <div class="header-cell numeric">Visitors</div>
              <div class="header-cell numeric">Impressions</div>
              <div class="header-cell numeric">Submits</div>
              <div class="header-cell numeric">Submit Rate</div>
            </div>
          </div>

          <div class="campaign-performance-layout">
            <!-- Left Column: Campaign List -->
            <div class="campaign-list-column">
              <div class="campaign-table-body">
                <template v-for="campaign in campaignData" :key="campaign.id">
                  <div
                    class="campaign-row"
                    @mouseenter="setHoveredCampaign(campaign.id)"
                    @mouseleave="clearHoveredCampaign()"
                    :class="{ 'is-hovered': hoveredCampaignId === campaign.id }"
                    @click="toggleSelection(campaign.id)"
                  >
                    <Checkbox
                      :model-value="isSelected(campaign.id)"
                      size="sm"
                      class="custom-checkbox"
                      @click.stop
                      @update:model-value="toggleSelection(campaign.id)"
                    />
                    <div class="campaign-name-wrapper">
                      <div class="campaign-name-with-icon" @click.stop="campaign.variants && toggleCampaign(campaign.id)">
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
                      @click="toggleSelection(`${campaign.id}-variant-${index}`)"
                    >
                      <Checkbox
                        :model-value="isSelected(`${campaign.id}-variant-${index}`)"
                        size="sm"
                        class="custom-checkbox"
                        @click.stop
                        @update:model-value="toggleSelection(`${campaign.id}-variant-${index}`)"
                      />
                      <div class="campaign-variant-name">{{ variant.name }}</div>
                    </div>
                  </template>
                </template>
              </div>
            </div>

            <!-- Right Column: Metrics -->
            <div class="campaign-metrics-column">
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
                    <div class="metric-cell">{{ campaign.submits }}</div>
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
                      <div class="metric-cell">{{ variant.submits }}</div>
                      <div class="metric-cell">{{ variant.conversionRate }}%</div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Devices + Traffic Source Row -->
        <div class="devices-traffic-row">
          <!-- Devices Section -->
          <div class="devices-card bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-5 pb-5 pr-8 min-w-0 overflow-hidden">
            <h2 class="section-title">Devices</h2>
            <div class="devices-content">
              <!-- Devices Table -->
              <div class="devices-table-wrap">
                <div class="campaign-headers-row">
                  <div class="campaign-list-header">
                    <div class="header-cell">Device Type</div>
                  </div>
                  <div class="campaign-metrics-header">
                    <div class="header-cell numeric">Visitors</div>
                    <div class="header-cell numeric">Submits</div>
                    <div class="header-cell numeric"><span class="sr-full">Submit Rate</span><span class="sr-short">Sub. R.</span></div>
                  </div>
                </div>
                <div class="campaign-performance-layout">
                  <div class="campaign-list-column">
                    <div class="campaign-table-body">
                      <div
                        v-for="row in devicesTableData"
                        :key="row.type"
                        class="campaign-row"
                        :class="{ 'is-hovered': hoveredDevicesRow === row.type }"
                        @mouseenter="hoveredDevicesRow = row.type"
                        @mouseleave="hoveredDevicesRow = null"
                        @click="toggleDevicesRow(row.type)"
                      >
                        <Checkbox
                          :model-value="isDevicesRowSelected(row.type)"
                          size="sm"
                          class="custom-checkbox"
                          @click.stop
                          @update:model-value="toggleDevicesRow(row.type)"
                        />
                        <div class="campaign-name-wrapper">
                          <div class="campaign-name">{{ row.type }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="campaign-metrics-column">
                    <div class="campaign-table-body">
                      <div
                        v-for="row in devicesTableData"
                        :key="row.type"
                        class="campaign-metrics-row"
                        :class="{ 'is-hovered': hoveredDevicesRow === row.type }"
                        @mouseenter="hoveredDevicesRow = row.type"
                        @mouseleave="hoveredDevicesRow = null"
                      >
                        <div class="metric-cell">{{ row.visitors.toLocaleString() }}</div>
                        <div class="metric-cell">{{ row.submits.toLocaleString() }}</div>
                        <div class="metric-cell">{{ row.submitRate }}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Devices Chart -->
              <div class="devices-chart-wrap">
                <VueApexCharts
                  type="bar"
                  height="200"
                  :options="devicesChartOptions"
                  :series="devicesChartSeries"
                />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-5 pb-5 min-w-0 overflow-hidden">
          <div class="section-header" style="padding-left: 32px; padding-right: 32px; margin-bottom: 1.25rem;">
            <h2 class="section-title" style="padding: 0; margin-bottom: 0;">Traffic Sources</h2>
            <button class="view-all-btn" @click="showModal('traffic-sources')">View All</button>
          </div>
          <div class="traffic-plain-layout">
            <div class="traffic-plain-table">
              <div class="campaign-headers-row">
                <div class="campaign-list-header">
                  <div class="header-cell">Referrer</div>
                </div>
                <div class="campaign-metrics-header">
                  <div class="header-cell numeric">Visitors</div>
                  <div class="header-cell numeric">Submits</div>
                  <div class="header-cell numeric"><span class="sr-full">Submit Rate</span><span class="sr-short">Sub. R.</span></div>
                </div>
              </div>
              <div class="campaign-performance-layout">
                <div class="campaign-list-column">
                  <div class="campaign-table-body">
                    <div
                      v-for="row in trafficSourceData"
                      :key="row.referrer"
                      class="campaign-row"
                      :class="{ 'is-hovered': hoveredTrafficRow2 === row.referrer }"
                      @mouseenter="hoveredTrafficRow2 = row.referrer"
                      @mouseleave="hoveredTrafficRow2 = null"
                      @click="toggleTrafficRow2(row.referrer)"
                    >
                      <Checkbox
                        :model-value="isTrafficRow2Selected(row.referrer)"
                        size="sm"
                        class="custom-checkbox"
                        @click.stop
                        @update:model-value="toggleTrafficRow2(row.referrer)"
                      />
                      <div class="campaign-name-wrapper">
                        <div class="campaign-name" style="display:flex;align-items:center;gap:6px;">
                          <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;display:inline-block;" :style="{ background: trafficPieColors[trafficPieReferrerIndex[row.referrer] ?? 5] }" />
                          {{ row.referrer }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="campaign-metrics-column">
                  <div class="campaign-table-body">
                    <div
                      v-for="row in trafficSourceData"
                      :key="row.referrer"
                      class="campaign-metrics-row"
                      :class="{ 'is-hovered': hoveredTrafficRow2 === row.referrer }"
                      @mouseenter="hoveredTrafficRow2 = row.referrer"
                      @mouseleave="hoveredTrafficRow2 = null"
                    >
                      <div class="metric-cell">{{ row.visitors.toLocaleString() }}</div>
                      <div class="metric-cell">{{ row.submits !== null ? row.submits.toLocaleString() : '–' }}</div>
                      <div class="metric-cell">{{ row.submitRate !== null ? row.submitRate + '%' : '–' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="traffic-pie-chart">
              <VueApexCharts
                type="donut"
                height="240"
                width="240"
                :options="trafficSubmitsPieOptions"
                :series="trafficSubmitsPieSeries"
              />
            </div>
          </div>
          </div>
        </div>
        <!-- /Devices + Traffic Source Row -->

        <!-- Countries Section -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] mb-6 pt-5 pb-5">
          <div class="section-header" style="padding-left: 32px; padding-right: 32px; margin-bottom: 1.25rem;">
            <h2 class="section-title" style="padding: 0; margin-bottom: 0;">Countries</h2>
            <button class="view-all-btn" @click="showModal('countries')">View All</button>
          </div>

          <div class="countries-content">
            <div class="countries-table-side">
              <div class="campaign-headers-row">
                <div class="campaign-list-header">
                  <div class="header-cell">Country</div>
                </div>
                <div class="campaign-metrics-header">
                  <div class="header-cell numeric">Visitors</div>
                  <div class="header-cell numeric">Submits</div>
                  <div class="header-cell numeric">Submit Rate</div>
                </div>
              </div>

              <div class="campaign-performance-layout">
                <div class="campaign-list-column">
                  <div class="campaign-table-body">
                    <div
                      v-for="row in countriesData"
                      :key="row.country"
                      class="campaign-row"
                      :class="{ 'is-hovered': hoveredCountriesRow === row.country }"
                      @mouseenter="hoveredCountriesRow = row.country"
                      @mouseleave="hoveredCountriesRow = null"
                      @click="toggleCountriesRow(row.country)"
                    >
                      <Checkbox
                        :model-value="isCountriesRowSelected(row.country)"
                        size="sm"
                        class="custom-checkbox"
                        @click.stop
                        @update:model-value="toggleCountriesRow(row.country)"
                      />
                      <div class="campaign-name-wrapper">
                        <div class="campaign-name">{{ row.country }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="campaign-metrics-column">
                  <div class="campaign-table-body">
                    <div
                      v-for="row in countriesData"
                      :key="row.country"
                      class="campaign-metrics-row"
                      :class="{ 'is-hovered': hoveredCountriesRow === row.country }"
                      @mouseenter="hoveredCountriesRow = row.country"
                      @mouseleave="hoveredCountriesRow = null"
                    >
                      <div class="metric-cell">{{ row.visitors.toLocaleString() }}</div>
                      <div class="metric-cell">{{ row.submits !== null ? row.submits.toLocaleString() : '–' }}</div>
                      <div class="metric-cell">{{ row.submitRate !== null ? row.submitRate + '%' : '–' }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="countries-chart-side">
              <div class="countries-bar-header"></div>
              <div class="countries-bar-body">
                <div
                  v-for="row in countriesData"
                  :key="row.country"
                  class="countries-bar-row"
                  :class="{ 'is-hovered': hoveredCountriesRow === row.country }"
                  @mouseenter="hoveredCountriesRow = row.country"
                  @mouseleave="hoveredCountriesRow = null"
                >
                  <div class="countries-bar-track">
                    <div
                      class="countries-bar-fill"
                      :style="{ width: ((row.submits ?? 0) / maxCountrySubmits * 100) + '%' }"
                    ></div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visited Pages Section -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] mb-6 pt-5 pb-5">
          <div class="section-header">
            <h2 class="section-title">Visited Pages</h2>
            <button class="view-all-btn" @click="showModal('visited-pages')">View All</button>
          </div>

          <!-- Filter Bar - Full Width -->
          <div v-if="hasVisitedPagesSelection" class="campaign-filter-bar">
            <Checkbox
              :model-value="allVisitedPagesSelected"
              :indeterminate="isVisitedPagesIndeterminate"
              size="sm"
              class="custom-checkbox"
              @update:model-value="toggleSelectAllVisitedPages"
            />
            <span class="selection-count">{{ selectedVisitedPagesCount }} selected</span>
            <button class="filter-btn">
              Filter
            </button>
          </div>

          <!-- Table Headers -->
          <div v-if="!hasVisitedPagesSelection" class="campaign-headers-row">
            <div class="campaign-list-header">
              <div class="header-cell">Page URL</div>
            </div>
            <div class="campaign-metrics-header">
              <div class="header-cell numeric">Page Views</div>
              <div class="header-cell numeric">Visitors</div>
              <div class="header-cell numeric">Submits</div>
              <div class="header-cell numeric">Submit Rate</div>
            </div>
          </div>

          <div class="campaign-performance-layout">
            <!-- Left Column: Page URLs -->
            <div class="campaign-list-column">
              <div class="campaign-table-body">
                <div
                  v-for="page in visitedPagesDisplay"
                  :key="page.url"
                  class="campaign-row"
                  @mouseenter="setHoveredVisitedPage(page.url)"
                  @mouseleave="clearHoveredVisitedPage()"
                  :class="{ 'is-hovered': hoveredVisitedPageUrl === page.url }"
                  @click="toggleVisitedPageSelection(page.url)"
                >
                  <Checkbox
                    :model-value="isVisitedPageSelected(page.url)"
                    size="sm"
                    class="custom-checkbox"
                    @click.stop
                    @update:model-value="toggleVisitedPageSelection(page.url)"
                  />
                  <div class="campaign-name-wrapper">
                    <a :href="page.url" target="_blank" class="campaign-name-with-icon" @click.stop>
                      <div class="campaign-name">{{ page.url }}</div>
                      <ExternalLink
                        :size="14"
                        class="campaign-link-icon"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Metrics -->
            <div class="campaign-metrics-column">
              <div class="campaign-table-body">
                <div
                  v-for="page in visitedPagesDisplay"
                  :key="page.url"
                  class="campaign-metrics-row"
                  @mouseenter="setHoveredVisitedPage(page.url)"
                  @mouseleave="clearHoveredVisitedPage()"
                  :class="{ 'is-hovered': hoveredVisitedPageUrl === page.url }"
                >
                  <div class="metric-cell">{{ page.pageViews.toLocaleString() }}</div>
                  <div class="metric-cell">{{ page.visitors.toLocaleString() }}</div>
                  <div class="metric-cell">{{ page.submits }}</div>
                  <div class="metric-cell">{{ page.conversionRate }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Breakdown Modules Row -->
        <div class="breakdown-modules-row">
          <!-- Landing Pages -->
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-5 pb-5">
            <div class="section-header">
              <h2 class="section-title">Landing Pages</h2>
              <button class="view-all-btn" @click="showModal('landing-pages')">View All</button>
            </div>

            <!-- Filter Bar - Full Width -->
            <div v-if="hasLandingPagesSelection" class="campaign-filter-bar">
              <Checkbox
                :model-value="allLandingPagesSelected"
                :indeterminate="isLandingPagesIndeterminate"
                size="sm"
                class="custom-checkbox"
                @update:model-value="toggleSelectAllLandingPages"
              />
              <span class="selection-count">{{ selectedLandingPagesCount }} selected</span>
              <button class="filter-btn">
                Filter
              </button>
            </div>

            <!-- Table Headers -->
            <div v-if="!hasLandingPagesSelection" class="campaign-headers-row">
              <div class="breakdown-module-list-header">
                <div class="header-cell">Landing Page</div>
              </div>
              <div class="breakdown-module-metrics-header">
                <div class="header-cell numeric">Visitors</div>
                <div class="header-cell numeric">Submits</div>
                <div class="header-cell numeric">Submit Rate</div>
              </div>
            </div>

            <div class="campaign-performance-layout">
              <!-- Left Column: Landing Page URLs -->
              <div class="breakdown-module-list-column">
                <div class="campaign-table-body">
                  <div
                    v-for="page in landingPagesDisplay"
                    :key="page.url"
                    class="campaign-row"
                    @mouseenter="setHoveredLandingPage(page.url)"
                    @mouseleave="clearHoveredLandingPage()"
                    :class="{ 'is-hovered': hoveredLandingPageUrl === page.url }"
                    @click="toggleLandingPageSelection(page.url)"
                  >
                    <Checkbox
                      :model-value="isLandingPageSelected(page.url)"
                      size="sm"
                      class="custom-checkbox"
                      @click.stop
                      @update:model-value="toggleLandingPageSelection(page.url)"
                    />
                    <div class="campaign-name-wrapper">
                      <a :href="page.url" target="_blank" class="campaign-name-with-icon" @click.stop>
                        <div class="campaign-name">{{ page.url }}</div>
                        <ExternalLink
                          :size="14"
                          class="campaign-link-icon"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Metrics -->
              <div class="breakdown-module-metrics-column">
                <div class="campaign-table-body">
                  <div
                    v-for="page in landingPagesDisplay"
                    :key="page.url"
                    class="campaign-metrics-row"
                    @mouseenter="setHoveredLandingPage(page.url)"
                    @mouseleave="clearHoveredLandingPage()"
                    :class="{ 'is-hovered': hoveredLandingPageUrl === page.url }"
                  >
                    <div class="metric-cell">{{ page.visitors.toLocaleString() }}</div>
                    <div class="metric-cell">{{ page.submits }}</div>
                    <div class="metric-cell">{{ page.conversionRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Browser Languages -->
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-5 pb-5">
            <div class="section-header">
              <h2 class="section-title">Browser Languages</h2>
              <button class="view-all-btn" @click="showModal('browser-languages')">View All</button>
            </div>

            <!-- Filter Bar - Full Width -->
            <div v-if="hasBrowserLanguagesSelection" class="campaign-filter-bar">
              <Checkbox
                :model-value="allBrowserLanguagesSelected"
                :indeterminate="isBrowserLanguagesIndeterminate"
                size="sm"
                class="custom-checkbox"
                @update:model-value="toggleSelectAllBrowserLanguages"
              />
              <span class="selection-count">{{ selectedBrowserLanguagesCount }} selected</span>
              <button class="filter-btn">
                Filter
              </button>
            </div>

            <!-- Table Headers -->
            <div v-if="!hasBrowserLanguagesSelection" class="campaign-headers-row">
              <div class="breakdown-module-list-header">
                <div class="header-cell">Language</div>
              </div>
              <div class="breakdown-module-metrics-header">
                <div class="header-cell numeric">Visitors</div>
                <div class="header-cell numeric">Submits</div>
                <div class="header-cell numeric">Submit Rate</div>
              </div>
            </div>

            <div class="campaign-performance-layout">
              <!-- Left Column: Languages -->
              <div class="breakdown-module-list-column">
                <div class="campaign-table-body">
                  <div
                    v-for="lang in browserLanguagesDisplay"
                    :key="lang.code"
                    class="campaign-row"
                    @mouseenter="setHoveredBrowserLanguage(lang.code)"
                    @mouseleave="clearHoveredBrowserLanguage()"
                    :class="{ 'is-hovered': hoveredBrowserLanguageCode === lang.code }"
                    @click="toggleBrowserLanguageSelection(lang.code)"
                  >
                    <Checkbox
                      :model-value="isBrowserLanguageSelected(lang.code)"
                      size="sm"
                      class="custom-checkbox"
                      @click.stop
                      @update:model-value="toggleBrowserLanguageSelection(lang.code)"
                    />
                    <div class="campaign-name-wrapper">
                      <div class="campaign-name">{{ lang.code }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Metrics -->
              <div class="breakdown-module-metrics-column">
                <div class="campaign-table-body">
                  <div
                    v-for="lang in browserLanguagesDisplay"
                    :key="lang.code"
                    class="campaign-metrics-row"
                    @mouseenter="setHoveredBrowserLanguage(lang.code)"
                    @mouseleave="clearHoveredBrowserLanguage()"
                    :class="{ 'is-hovered': hoveredBrowserLanguageCode === lang.code }"
                  >
                    <div class="metric-cell">{{ lang.visitors.toLocaleString() }}</div>
                    <div class="metric-cell">{{ lang.submits }}</div>
                    <div class="metric-cell">{{ lang.conversionRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- UTM Modules Row -->
        <div class="breakdown-modules-row">
          <!-- UTM Campaigns -->
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-5 pb-5">
            <div class="section-header">
              <h2 class="section-title">UTM Campaigns</h2>
              <button class="view-all-btn" @click="showModal('utm-campaigns')">View All</button>
            </div>

            <!-- Filter Bar - Full Width -->
            <div v-if="hasUtmCampaignsSelection" class="campaign-filter-bar">
              <Checkbox
                :model-value="allUtmCampaignsSelected"
                :indeterminate="isUtmCampaignsIndeterminate"
                size="sm"
                class="custom-checkbox"
                @update:model-value="toggleSelectAllUtmCampaigns"
              />
              <span class="selection-count">{{ selectedUtmCampaignsCount }} selected</span>
              <button class="filter-btn">
                Filter
              </button>
            </div>

            <!-- Table Headers -->
            <div v-if="!hasUtmCampaignsSelection" class="campaign-headers-row">
              <div class="breakdown-module-list-header">
                <div class="header-cell">Campaign</div>
              </div>
              <div class="breakdown-module-metrics-header">
                <div class="header-cell numeric">Visitors</div>
                <div class="header-cell numeric">Submits</div>
                <div class="header-cell numeric">Submit Rate</div>
              </div>
            </div>

            <div class="campaign-performance-layout">
              <!-- Left Column: Campaign Names -->
              <div class="breakdown-module-list-column">
                <div class="campaign-table-body">
                  <div
                    v-for="campaign in utmCampaignsDisplay"
                    :key="campaign.name"
                    class="campaign-row"
                    @mouseenter="setHoveredUtmCampaign(campaign.name)"
                    @mouseleave="clearHoveredUtmCampaign()"
                    :class="{ 'is-hovered': hoveredUtmCampaignName === campaign.name }"
                    @click="toggleUtmCampaignSelection(campaign.name)"
                  >
                    <Checkbox
                      :model-value="isUtmCampaignSelected(campaign.name)"
                      size="sm"
                      class="custom-checkbox"
                      @click.stop
                      @update:model-value="toggleUtmCampaignSelection(campaign.name)"
                    />
                    <div class="campaign-name-wrapper">
                      <div class="campaign-name">{{ campaign.name }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Metrics -->
              <div class="breakdown-module-metrics-column">
                <div class="campaign-table-body">
                  <div
                    v-for="campaign in utmCampaignsDisplay"
                    :key="campaign.name"
                    class="campaign-metrics-row"
                    @mouseenter="setHoveredUtmCampaign(campaign.name)"
                    @mouseleave="clearHoveredUtmCampaign()"
                    :class="{ 'is-hovered': hoveredUtmCampaignName === campaign.name }"
                  >
                    <div class="metric-cell">{{ campaign.visitors.toLocaleString() }}</div>
                    <div class="metric-cell">{{ campaign.submits }}</div>
                    <div class="metric-cell">{{ campaign.conversionRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- UTM Sources -->
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-5 pb-5">
            <div class="section-header">
              <h2 class="section-title">UTM Sources</h2>
              <button class="view-all-btn" @click="showModal('utm-sources')">View All</button>
            </div>

            <!-- Filter Bar - Full Width -->
            <div v-if="hasUtmSourcesSelection" class="campaign-filter-bar">
              <Checkbox
                :model-value="allUtmSourcesSelected"
                :indeterminate="isUtmSourcesIndeterminate"
                size="sm"
                class="custom-checkbox"
                @update:model-value="toggleSelectAllUtmSources"
              />
              <span class="selection-count">{{ selectedUtmSourcesCount }} selected</span>
              <button class="filter-btn">
                Filter
              </button>
            </div>

            <!-- Table Headers -->
            <div v-if="!hasUtmSourcesSelection" class="campaign-headers-row">
              <div class="breakdown-module-list-header">
                <div class="header-cell">Source</div>
              </div>
              <div class="breakdown-module-metrics-header">
                <div class="header-cell numeric">Visitors</div>
                <div class="header-cell numeric">Submits</div>
                <div class="header-cell numeric">Submit Rate</div>
              </div>
            </div>

            <div class="campaign-performance-layout">
              <!-- Left Column: Source Names -->
              <div class="breakdown-module-list-column">
                <div class="campaign-table-body">
                  <div
                    v-for="source in utmSourcesDisplay"
                    :key="source.name"
                    class="campaign-row"
                    @mouseenter="setHoveredUtmSource(source.name)"
                    @mouseleave="clearHoveredUtmSource()"
                    :class="{ 'is-hovered': hoveredUtmSourceName === source.name }"
                    @click="toggleUtmSourceSelection(source.name)"
                  >
                    <Checkbox
                      :model-value="isUtmSourceSelected(source.name)"
                      size="sm"
                      class="custom-checkbox"
                      @click.stop
                      @update:model-value="toggleUtmSourceSelection(source.name)"
                    />
                    <div class="campaign-name-wrapper">
                      <div class="campaign-name">{{ source.name }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Metrics -->
              <div class="breakdown-module-metrics-column">
                <div class="campaign-table-body">
                  <div
                    v-for="source in utmSourcesDisplay"
                    :key="source.name"
                    class="campaign-metrics-row"
                    @mouseenter="setHoveredUtmSource(source.name)"
                    @mouseleave="clearHoveredUtmSource()"
                    :class="{ 'is-hovered': hoveredUtmSourceName === source.name }"
                  >
                    <div class="metric-cell">{{ source.visitors.toLocaleString() }}</div>
                    <div class="metric-cell">{{ source.submits }}</div>
                    <div class="metric-cell">{{ source.conversionRate }}%</div>
                  </div>
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
                  <div class="breakdown-header-cell numeric">Visitors</div>
                  <div class="breakdown-header-cell numeric">Submits</div>
                  <div class="breakdown-header-cell numeric">Submit Rate</div>
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
                    <div class="breakdown-cell numeric">{{ page.submits }}</div>
                    <div class="breakdown-cell numeric">{{ page.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- Landing Pages -->
              <div v-if="modalType === 'landing-pages'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Landing Page</div>
                  <div class="breakdown-header-cell numeric">Visitors</div>
                  <div class="breakdown-header-cell numeric">Submits</div>
                  <div class="breakdown-header-cell numeric">Submit Rate</div>
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
                    <div class="breakdown-cell numeric">{{ page.submits }}</div>
                    <div class="breakdown-cell numeric">{{ page.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- Browser Languages -->
              <div v-if="modalType === 'browser-languages'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Language</div>
                  <div class="breakdown-header-cell numeric">Visitors</div>
                  <div class="breakdown-header-cell numeric">Submits</div>
                  <div class="breakdown-header-cell numeric">Submit Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="lang in browserLanguages"
                    :key="lang.code"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell" style="flex: 2">{{ lang.code }}</div>
                    <div class="breakdown-cell numeric">{{ lang.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ lang.submits }}</div>
                    <div class="breakdown-cell numeric">{{ lang.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- UTM Campaigns -->
              <div v-if="modalType === 'utm-campaigns'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Campaign</div>
                  <div class="breakdown-header-cell numeric">Visitors</div>
                  <div class="breakdown-header-cell numeric">Submits</div>
                  <div class="breakdown-header-cell numeric">Submit Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="campaign in utmCampaigns"
                    :key="campaign.name"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell" style="flex: 2">{{ campaign.name }}</div>
                    <div class="breakdown-cell numeric">{{ campaign.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ campaign.submits }}</div>
                    <div class="breakdown-cell numeric">{{ campaign.conversionRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- UTM Sources -->
              <div v-if="modalType === 'utm-sources'" class="breakdown-table">
                <div class="breakdown-header">
                  <div class="breakdown-header-cell" style="flex: 2">Source</div>
                  <div class="breakdown-header-cell numeric">Visitors</div>
                  <div class="breakdown-header-cell numeric">Submits</div>
                  <div class="breakdown-header-cell numeric">Submit Rate</div>
                </div>
                <div class="breakdown-body">
                  <div
                    v-for="source in utmSources"
                    :key="source.name"
                    class="breakdown-row"
                  >
                    <div class="breakdown-cell" style="flex: 2">{{ source.name }}</div>
                    <div class="breakdown-cell numeric">{{ source.visitors.toLocaleString() }}</div>
                    <div class="breakdown-cell numeric">{{ source.submits }}</div>
                    <div class="breakdown-cell numeric">{{ source.conversionRate }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </template>
    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
    <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ExternalLink, ChevronDown, ChevronRight, Target, Calendar, RefreshCw, TrendingUp, TrendingDown, X, Dice5 } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import VueApexCharts from 'vue3-apexcharts'
import ChatPanel from '../components/shared/ChatPanel.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'

const emit = defineEmits(['menu-click', 'navigate-to-opportunity', 'navigate-to-opportunities'])

const isChatOpen = ref(false)

const chatSuggestions = [
  'What drove the conversion rate change this week?',
  'Which page has the highest drop-off rate?',
  'How can I improve my supported revenue?',
  'What are my top performing campaigns?',
  'Show me trends for the last 30 days',
]

const chatAiResponses = {
  'What drove the conversion rate change this week?': 'Your conversion rate increased by **+0.12%** this week, driven mainly by two factors:\n\n**1. Smart Discount Popup** — updated CTA copy boosted its submit rate from 7.1% to 8.4%\n\n**2. Mobile traffic share** — down 8% this week, which raises the overall rate since desktop converts significantly better.\n\nWould you like a breakdown by device or campaign?',
  'Which page has the highest drop-off rate?': 'Based on your visited pages data, **/checkout** has the highest drop-off rate at **78%** — meaning only 22% of visitors who land there complete a purchase.\n\nThe second highest is **/cart** at **64%**. I\'d recommend deploying a cart abandonment popup on both pages to recover some of these visitors.',
  'How can I improve my supported revenue?': 'Your current supported revenue is **$23,274**, up 15.8% month-over-month. To accelerate growth:\n\n**1. Upsell campaigns** — Add a post-purchase upsell popup to your thank-you page.\n**2. Expand to email captures** — Visitors who opt in convert at 3× the rate of anonymous traffic.\n**3. Increase campaign frequency** — Your current campaigns reach only 34% of your visitors.',
  'What are my top performing campaigns?': 'Your top 3 campaigns by conversion rate this period:\n\n**1. Smart Discount Popup** — 8.37% conversion rate, +84% uplift\n**2. Black Friday 2025** — 5.2% conversion rate, +56% uplift\n**3. Exit Intent Offer** — 4.8% conversion rate, +41% uplift\n\nAll three are active and performing above your account average of 3.2%.',
  'Show me trends for the last 30 days': 'Over the last 30 days:\n\n- **Impressions:** +12% (↑ trending)\n- **Conversion rate:** +0.57% (↑ trending)\n- **Submits:** +18% (↑ trending)\n- **Supported revenue:** +15.8% (↑ trending)\n\nAll key metrics are trending positively. The biggest growth driver is your Black Friday campaign which launched 2 weeks ago.',
}

const optimizationOpportunities = ref([
  {
    id: 1,
    name: 'Deploy Smart Abandonment Stopper on Mobile',
    description: 'Top-performing campaign (7.67% purchase rate) runs on desktop only — 130K mobile visitors are completely untouched.',
    value: '+$6,800/month',
    level: 'high',
  },
  {
    id: 2,
    name: 'Fix the Facebook Traffic Conversion Gap',
    description: 'Facebook is the #1 traffic source (34,811 visitors) but converts at just 0.72%, far below the 2.17% site average.',
    value: '+$10,100/month',
    level: 'high',
  },
  {
    id: 3,
    name: 'Scale the Winning Other Subscription Variant',
    description: 'A/B test winner outperforms loser by 70.7% — yet the losing variant still receives 50% of traffic.',
    value: '+$2,590/month',
    level: 'medium',
  },
  {
    id: 4,
    name: 'Replace Zero-Converting Dynamic Content Campaign',
    description: '57K visitors, 261K impressions, zero purchases — the most-shown campaign generates no measurable value.',
    value: '+$6,300/month',
    level: 'high',
  },
  {
    id: 5,
    name: 'Build a Mobile-First Cart Abandonment Flow',
    description: '61% of cart visitors leave without buying, with no recovery mechanism for mobile users (76% of all traffic).',
    value: '+$8,200/month',
    level: 'high',
  }
])

const activeTab = ref('conversion-rate')

// Domain selector
const selectedDomain = ref('tabletopshop.com')
const domains = ref([
  'tabletopshop.com',
  'telekom.hu',
  'shop.telekom.hu',
  'demo.optimonk.com',
  '+ Add new domain'
])
const showAddDomainModal = ref(false)
watch(selectedDomain, (val) => {
  if (val === '+ Add new domain') {
    selectedDomain.value = domains.value[0]
    showAddDomainModal.value = true
  }
})
const handleNewDomain = (newDomain) => {
  const insertIdx = domains.value.indexOf('+ Add new domain')
  domains.value.splice(insertIdx, 0, newDomain)
  selectedDomain.value = newDomain
}

// Goal dropdown
const selectedGoal = ref('Submits (default)')
const goals = ref([
  'Submits (default)',
  'browserTabReturn',
  'Buyers with cart under $280',
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

const submitsData = [
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
  642, 612, 703, 599, 734, 657, 591, 681, 794, 763,
  727, 767, 819, 856, 825, 886, 947, 880, 819, 916,
  977, 904, 849, 931, 1008, 947, 886, 962, 928, 880
]

// Devices chart
const devicesTableData = [
  { type: 'Mobile',  visitors: 104367, submits: 1707, submitRate: 1.64 },
  { type: 'Desktop', visitors: 32733,  submits: 797,  submitRate: 2.43 },
]

const devicesChartSeries = [
  {
    name: 'Submits',
    data: [797, 1707],
  }
]

const devicesChartOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '40%',
      distributed: true,
    },
  },
  colors: ['#FF6A45', '#FF9E89'],
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: ['Desktop', 'Mobile'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#6B7280', fontSize: '13px' },
    },
  },
  yaxis: {
    labels: {
      style: { colors: '#9CA3AF', fontSize: '12px' },
      formatter: (val) => val.toLocaleString(),
    },
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
  },
  tooltip: {
    y: { formatter: (val) => val.toLocaleString() },
  },
}

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
      name: 'Submit Rate',
      ...calculateRange(conversionRateData, 15),
      formatter: (value) => `${value.toFixed(1)}%`,
      tooltipFormatter: (value) => `${value.toFixed(2)}%`
    },
    'submits': {
      data: submitsData,
      name: 'Submits',
      ...calculateRange(submitsData, 15),
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
      name: 'Visitors',
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
      formatter: (value) => `$${value.toFixed(0)}`,
      tooltipFormatter: (value) => `$${value.toLocaleString()}`
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
  { id: 'conversion-rate', title: 'Submit Rate', value: '0.57%', change: '+14.0%', isPositive: true },
  { id: 'submits', title: 'Submits', value: '2.2K', change: '+8.3%', isPositive: true },
  { id: 'impressions', title: 'Impressions', value: '384.4K', change: '+12.5%', isPositive: true },
  { id: 'unique-visitors', title: 'Visitors', value: '168.2K', change: '+6.7%', isPositive: true },
  { id: 'supported-orders', title: 'Supported Orders', value: '286', change: '-4.2%', isPositive: false },
  { id: 'supported-revenue', title: 'Supported Rev. (USD)', value: '$23,274', change: '+15.8%', isPositive: true }
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

// Hover state for Visited Pages
const hoveredVisitedPageUrl = ref(null)
const setHoveredVisitedPage = (url) => {
  hoveredVisitedPageUrl.value = url
}
const clearHoveredVisitedPage = () => {
  hoveredVisitedPageUrl.value = null
}

// Hover state for Landing Pages
const hoveredLandingPageUrl = ref(null)
const setHoveredLandingPage = (url) => {
  hoveredLandingPageUrl.value = url
}
const clearHoveredLandingPage = () => {
  hoveredLandingPageUrl.value = null
}

// Hover state for Browser Languages
const hoveredBrowserLanguageCode = ref(null)
const setHoveredBrowserLanguage = (code) => {
  hoveredBrowserLanguageCode.value = code
}
const clearHoveredBrowserLanguage = () => {
  hoveredBrowserLanguageCode.value = null
}

// Hover state for UTM Campaigns
const hoveredUtmCampaignName = ref(null)
const setHoveredUtmCampaign = (name) => {
  hoveredUtmCampaignName.value = name
}
const clearHoveredUtmCampaign = () => {
  hoveredUtmCampaignName.value = null
}

// Hover state for UTM Sources
const hoveredUtmSourceName = ref(null)
const setHoveredUtmSource = (name) => {
  hoveredUtmSourceName.value = name
}
const clearHoveredUtmSource = () => {
  hoveredUtmSourceName.value = null
}

const navigateToCampaignPage = (campaignId) => {
  // Navigate to campaign page - you can pass campaign ID if needed
  emit('menu-click', 'campaign-page')
}

// Checkbox selections
const selectedCampaigns = ref(new Set())
const selectionTrigger = ref(0)

const isSelected = (id) => {
  selectionTrigger.value // Access trigger to create reactivity
  return selectedCampaigns.value.has(id)
}

const toggleSelection = (id) => {
  const newSet = new Set(selectedCampaigns.value)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  selectedCampaigns.value = newSet
  selectionTrigger.value++ // Trigger reactivity
}

const selectedCount = computed(() => {
  selectionTrigger.value
  return selectedCampaigns.value.size
})

const hasSelection = computed(() => selectedCount.value > 0)

const allSelected = computed(() => {
  selectionTrigger.value
  return campaignData.value.length > 0 && campaignData.value.every(campaign => selectedCampaigns.value.has(campaign.id))
})

const isIndeterminate = computed(() => {
  selectionTrigger.value
  return selectedCount.value > 0 && !allSelected.value
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    // Deselect all
    selectedCampaigns.value = new Set()
  } else {
    // Select all campaigns
    const allIds = campaignData.value.map(campaign => campaign.id)
    selectedCampaigns.value = new Set(allIds)
  }
  selectionTrigger.value++
}

const clearAllSelections = () => {
  selectedCampaigns.value = new Set()
  selectionTrigger.value++
}

// ============================================
// Visited Pages Selection State
// ============================================
const selectedVisitedPages = ref(new Set())
const visitedPagesSelectionTrigger = ref(0)

const isVisitedPageSelected = (url) => {
  visitedPagesSelectionTrigger.value // Track reactivity
  return selectedVisitedPages.value.has(url)
}

const toggleVisitedPageSelection = (url) => {
  const newSet = new Set(selectedVisitedPages.value)
  if (newSet.has(url)) {
    newSet.delete(url)
  } else {
    newSet.add(url)
  }
  selectedVisitedPages.value = newSet
  visitedPagesSelectionTrigger.value++
}

const selectedVisitedPagesCount = computed(() => {
  visitedPagesSelectionTrigger.value
  return selectedVisitedPages.value.size
})

const hasVisitedPagesSelection = computed(() => selectedVisitedPagesCount.value > 0)

const allVisitedPagesSelected = computed(() => {
  visitedPagesSelectionTrigger.value
  return visitedPages.value.length > 0 && visitedPages.value.every(page => selectedVisitedPages.value.has(page.url))
})

const isVisitedPagesIndeterminate = computed(() => {
  return selectedVisitedPagesCount.value > 0 && !allVisitedPagesSelected.value
})

const toggleSelectAllVisitedPages = () => {
  if (allVisitedPagesSelected.value) {
    selectedVisitedPages.value = new Set()
  } else {
    const allUrls = visitedPages.value.map(page => page.url)
    selectedVisitedPages.value = new Set(allUrls)
  }
  visitedPagesSelectionTrigger.value++
}

const clearVisitedPagesSelections = () => {
  selectedVisitedPages.value = new Set()
  visitedPagesSelectionTrigger.value++
}

// ============================================
// Landing Pages Selection State
// ============================================
const selectedLandingPages = ref(new Set())
const landingPagesSelectionTrigger = ref(0)

const isLandingPageSelected = (url) => {
  landingPagesSelectionTrigger.value
  return selectedLandingPages.value.has(url)
}

const toggleLandingPageSelection = (url) => {
  const newSet = new Set(selectedLandingPages.value)
  if (newSet.has(url)) {
    newSet.delete(url)
  } else {
    newSet.add(url)
  }
  selectedLandingPages.value = newSet
  landingPagesSelectionTrigger.value++
}

const selectedLandingPagesCount = computed(() => {
  landingPagesSelectionTrigger.value
  return selectedLandingPages.value.size
})

const hasLandingPagesSelection = computed(() => selectedLandingPagesCount.value > 0)

const allLandingPagesSelected = computed(() => {
  landingPagesSelectionTrigger.value
  return landingPages.value.length > 0 && landingPages.value.every(page => selectedLandingPages.value.has(page.url))
})

const isLandingPagesIndeterminate = computed(() => {
  return selectedLandingPagesCount.value > 0 && !allLandingPagesSelected.value
})

const toggleSelectAllLandingPages = () => {
  if (allLandingPagesSelected.value) {
    selectedLandingPages.value = new Set()
  } else {
    const allUrls = landingPages.value.map(page => page.url)
    selectedLandingPages.value = new Set(allUrls)
  }
  landingPagesSelectionTrigger.value++
}

const clearLandingPagesSelections = () => {
  selectedLandingPages.value = new Set()
  landingPagesSelectionTrigger.value++
}

// ============================================
// Browser Languages Selection State
// ============================================
const selectedBrowserLanguages = ref(new Set())
const browserLanguagesSelectionTrigger = ref(0)

const isBrowserLanguageSelected = (code) => {
  browserLanguagesSelectionTrigger.value
  return selectedBrowserLanguages.value.has(code)
}

const toggleBrowserLanguageSelection = (code) => {
  const newSet = new Set(selectedBrowserLanguages.value)
  if (newSet.has(code)) {
    newSet.delete(code)
  } else {
    newSet.add(code)
  }
  selectedBrowserLanguages.value = newSet
  browserLanguagesSelectionTrigger.value++
}

const selectedBrowserLanguagesCount = computed(() => {
  browserLanguagesSelectionTrigger.value
  return selectedBrowserLanguages.value.size
})

const hasBrowserLanguagesSelection = computed(() => selectedBrowserLanguagesCount.value > 0)

const allBrowserLanguagesSelected = computed(() => {
  browserLanguagesSelectionTrigger.value
  return browserLanguages.value.length > 0 && browserLanguages.value.every(lang => selectedBrowserLanguages.value.has(lang.code))
})

const isBrowserLanguagesIndeterminate = computed(() => {
  return selectedBrowserLanguagesCount.value > 0 && !allBrowserLanguagesSelected.value
})

const toggleSelectAllBrowserLanguages = () => {
  if (allBrowserLanguagesSelected.value) {
    selectedBrowserLanguages.value = new Set()
  } else {
    const allCodes = browserLanguages.value.map(lang => lang.code)
    selectedBrowserLanguages.value = new Set(allCodes)
  }
  browserLanguagesSelectionTrigger.value++
}

const clearBrowserLanguagesSelections = () => {
  selectedBrowserLanguages.value = new Set()
  browserLanguagesSelectionTrigger.value++
}

// ============================================
// UTM Campaigns Selection State
// ============================================
const selectedUtmCampaigns = ref(new Set())
const utmCampaignsSelectionTrigger = ref(0)

const isUtmCampaignSelected = (name) => {
  utmCampaignsSelectionTrigger.value
  return selectedUtmCampaigns.value.has(name)
}

const toggleUtmCampaignSelection = (name) => {
  const newSet = new Set(selectedUtmCampaigns.value)
  if (newSet.has(name)) {
    newSet.delete(name)
  } else {
    newSet.add(name)
  }
  selectedUtmCampaigns.value = newSet
  utmCampaignsSelectionTrigger.value++
}

const selectedUtmCampaignsCount = computed(() => {
  utmCampaignsSelectionTrigger.value
  return selectedUtmCampaigns.value.size
})

const hasUtmCampaignsSelection = computed(() => selectedUtmCampaignsCount.value > 0)

const allUtmCampaignsSelected = computed(() => {
  utmCampaignsSelectionTrigger.value
  return utmCampaigns.value.length > 0 && utmCampaigns.value.every(campaign => selectedUtmCampaigns.value.has(campaign.name))
})

const isUtmCampaignsIndeterminate = computed(() => {
  return selectedUtmCampaignsCount.value > 0 && !allUtmCampaignsSelected.value
})

const toggleSelectAllUtmCampaigns = () => {
  if (allUtmCampaignsSelected.value) {
    selectedUtmCampaigns.value = new Set()
  } else {
    const allNames = utmCampaigns.value.map(campaign => campaign.name)
    selectedUtmCampaigns.value = new Set(allNames)
  }
  utmCampaignsSelectionTrigger.value++
}

const clearUtmCampaignsSelections = () => {
  selectedUtmCampaigns.value = new Set()
  utmCampaignsSelectionTrigger.value++
}

// ============================================
// UTM Sources Selection State
// ============================================
const selectedUtmSources = ref(new Set())
const utmSourcesSelectionTrigger = ref(0)

const isUtmSourceSelected = (name) => {
  utmSourcesSelectionTrigger.value
  return selectedUtmSources.value.has(name)
}

const toggleUtmSourceSelection = (name) => {
  const newSet = new Set(selectedUtmSources.value)
  if (newSet.has(name)) {
    newSet.delete(name)
  } else {
    newSet.add(name)
  }
  selectedUtmSources.value = newSet
  utmSourcesSelectionTrigger.value++
}

const selectedUtmSourcesCount = computed(() => {
  utmSourcesSelectionTrigger.value
  return selectedUtmSources.value.size
})

const hasUtmSourcesSelection = computed(() => selectedUtmSourcesCount.value > 0)

const allUtmSourcesSelected = computed(() => {
  utmSourcesSelectionTrigger.value
  return utmSources.value.length > 0 && utmSources.value.every(source => selectedUtmSources.value.has(source.name))
})

const isUtmSourcesIndeterminate = computed(() => {
  return selectedUtmSourcesCount.value > 0 && !allUtmSourcesSelected.value
})

const toggleSelectAllUtmSources = () => {
  if (allUtmSourcesSelected.value) {
    selectedUtmSources.value = new Set()
  } else {
    const allNames = utmSources.value.map(source => source.name)
    selectedUtmSources.value = new Set(allNames)
  }
  utmSourcesSelectionTrigger.value++
}

const clearUtmSourcesSelections = () => {
  selectedUtmSources.value = new Set()
  utmSourcesSelectionTrigger.value++
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
    submits: 456,
    conversionRate: 0.63,
    variants: [
      { name: 'Control Variant', visitors: 36000, impressions: 62000, submits: 228, conversionRate: 0.63 },
      { name: 'Variant A', visitors: 36543, impressions: 62567, submits: 228, conversionRate: 0.62 }
    ]
  },
  {
    id: 2,
    name: 'Limited package shipping from January 5',
    visitors: 45678,
    impressions: 98234,
    submits: 234,
    conversionRate: 0.51,
    variants: [
      { name: 'Control Variant', visitors: 22839, impressions: 49117, submits: 117, conversionRate: 0.51 },
      { name: 'Variant A', visitors: 22839, impressions: 49117, submits: 117, conversionRate: 0.51 }
    ]
  },
  { id: 3, name: 'Order confidently copy', visitors: 38902, impressions: 87456, submits: 189, conversionRate: 0.49 },
  { id: 4, name: 'PX_01_Subscriber popup_gift_Reflexshop', visitors: 32145, impressions: 76543, submits: 167, conversionRate: 0.52 },
  { id: 5, name: 'Service AI - Smart Product Page Optimizer v4 🎉 Winner', visitors: 28567, impressions: 65432, submits: 145, conversionRate: 0.51 },
  { id: 6, name: 'Jungo traffic redirector', visitors: 24890, impressions: 54321, submits: 128, conversionRate: 0.51 },
  { id: 7, name: 'PC Service Smart Abandonment Stopper - Winner', visitors: 21456, impressions: 48765, submits: 112, conversionRate: 0.52 },
  { id: 8, name: 'Dynamic Content Visitor/Impression Ratio Test', visitors: 18234, impressions: 42345, submits: 98, conversionRate: 0.54 },
  { id: 9, name: 'Funko upsell', visitors: 15678, impressions: 38765, submits: 87, conversionRate: 0.55 },
  { id: 10, name: '18+ verification', visitors: 12345, impressions: 32456, submits: 72, conversionRate: 0.58 }
])

const visitedPages = ref([
  { url: 'https://tabletopshop.com/shop_search.php', pageViews: 45678, visitors: 32145, submits: 234, conversionRate: 0.73 },
  { url: 'https://tabletopshop.com', pageViews: 38902, visitors: 28567, submits: 189, conversionRate: 0.66 },
  { url: 'https://tabletopshop.com/shop_cart.php', pageViews: 32145, visitors: 24890, submits: 167, conversionRate: 0.67 },
  { url: 'https://tabletopshop.com/Tarsasjatekok', pageViews: 28567, visitors: 21456, submits: 145, conversionRate: 0.68 },
  { url: 'https://tabletopshop.com/shop_artspec.php', pageViews: 24890, visitors: 18234, submits: 128, conversionRate: 0.70 },
  { url: 'https://tabletopshop.com/shop_login.php', pageViews: 21456, visitors: 15678, submits: 112, conversionRate: 0.71 },
  { url: 'https://tabletopshop.com/akcios-termekek', pageViews: 18234, visitors: 12345, submits: 98, conversionRate: 0.79 },
  { url: 'https://tabletopshop.com/Funko/Funko-POP-figurak', pageViews: 15678, visitors: 10234, submits: 87, conversionRate: 0.85 },
  { url: 'https://tabletopshop.com/shop_reg.php', pageViews: 12345, visitors: 8765, submits: 72, conversionRate: 0.82 },
  { url: 'https://tabletopshop.com/Funko', pageViews: 10234, visitors: 7456, submits: 65, conversionRate: 0.87 },
  { url: 'https://tabletopshop.com/LEGO', pageViews: 9876, visitors: 6834, submits: 58, conversionRate: 0.85 },
  { url: 'https://tabletopshop.com/shop_wishlist.php', pageViews: 8765, visitors: 5923, submits: 52, conversionRate: 0.88 },
  { url: 'https://tabletopshop.com/Konyv', pageViews: 8234, visitors: 5467, submits: 48, conversionRate: 0.88 },
  { url: 'https://tabletopshop.com/Puzzle', pageViews: 7654, visitors: 4989, submits: 43, conversionRate: 0.86 },
  { url: 'https://tabletopshop.com/Filmek-sorozatok', pageViews: 7123, visitors: 4567, submits: 39, conversionRate: 0.85 },
  { url: 'https://tabletopshop.com/shop_about.php', pageViews: 6789, visitors: 4234, submits: 36, conversionRate: 0.85 },
  { url: 'https://tabletopshop.com/Kulfold', pageViews: 6234, visitors: 3876, submits: 32, conversionRate: 0.83 },
  { url: 'https://tabletopshop.com/Magic-the-Gathering', pageViews: 5876, visitors: 3567, submits: 29, conversionRate: 0.81 },
  { url: 'https://tabletopshop.com/Pokemon', pageViews: 5432, visitors: 3234, submits: 26, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/shop_contact.php', pageViews: 5123, visitors: 2987, submits: 24, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Gyerekjatekok', pageViews: 4876, visitors: 2765, submits: 22, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Yu-Gi-Oh', pageViews: 4567, visitors: 2543, submits: 20, conversionRate: 0.79 },
  { url: 'https://tabletopshop.com/Warhammer', pageViews: 4234, visitors: 2345, submits: 18, conversionRate: 0.77 },
  { url: 'https://tabletopshop.com/Strategiai-jatekok', pageViews: 3987, visitors: 2156, submits: 17, conversionRate: 0.79 },
  { url: 'https://tabletopshop.com/Keszlet-jatekok', pageViews: 3765, visitors: 1987, submits: 15, conversionRate: 0.76 },
  { url: 'https://tabletopshop.com/shop_faq.php', pageViews: 3543, visitors: 1834, submits: 14, conversionRate: 0.76 },
  { url: 'https://tabletopshop.com/Kaland-jatekok', pageViews: 3321, visitors: 1687, submits: 13, conversionRate: 0.77 },
  { url: 'https://tabletopshop.com/Party-jatekok', pageViews: 3123, visitors: 1543, submits: 12, conversionRate: 0.78 },
  { url: 'https://tabletopshop.com/Csaladi-jatekok', pageViews: 2987, visitors: 1432, submits: 11, conversionRate: 0.77 },
  { url: 'https://tabletopshop.com/shop_privacy.php', pageViews: 2765, visitors: 1321, submits: 10, conversionRate: 0.76 }
])

const landingPages = ref([
  { url: 'https://tabletopshop.com', visitors: 120143, submits: 812, conversionRate: 0.68 },
  { url: 'https://tabletopshop.com/Tarsasjatekok', visitors: 45678, submits: 345, conversionRate: 0.76 },
  { url: 'https://tabletopshop.com/shop_search.php', visitors: 38902, submits: 289, conversionRate: 0.74 },
  { url: 'https://tabletopshop.com/akcios-termekek', visitors: 32145, submits: 256, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Funko/Funko-POP-figurak', visitors: 28567, submits: 234, conversionRate: 0.82 },
  { url: 'https://tabletopshop.com/shop_artspec.php', visitors: 24890, submits: 198, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Funko', visitors: 21456, submits: 178, conversionRate: 0.83 },
  { url: 'https://tabletopshop.com/shop_cart.php', visitors: 18234, submits: 145, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/shop_login.php', visitors: 15678, submits: 123, conversionRate: 0.78 },
  { url: 'https://tabletopshop.com/shop_reg.php', visitors: 12345, submits: 98, conversionRate: 0.79 },
  { url: 'https://tabletopshop.com/LEGO', visitors: 11234, submits: 89, conversionRate: 0.79 },
  { url: 'https://tabletopshop.com/Konyv', visitors: 10876, submits: 85, conversionRate: 0.78 },
  { url: 'https://tabletopshop.com/Puzzle', visitors: 9765, submits: 78, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Filmek-sorozatok', visitors: 8943, submits: 72, conversionRate: 0.81 },
  { url: 'https://tabletopshop.com/Kulfold', visitors: 8234, submits: 67, conversionRate: 0.81 },
  { url: 'https://tabletopshop.com/Magic-the-Gathering', visitors: 7654, submits: 61, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Pokemon', visitors: 7123, submits: 58, conversionRate: 0.81 },
  { url: 'https://tabletopshop.com/Gyerekjatekok', visitors: 6789, submits: 54, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Yu-Gi-Oh', visitors: 6321, submits: 51, conversionRate: 0.81 },
  { url: 'https://tabletopshop.com/Warhammer', visitors: 5987, submits: 48, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Strategiai-jatekok', visitors: 5543, submits: 45, conversionRate: 0.81 },
  { url: 'https://tabletopshop.com/Keszlet-jatekok', visitors: 5234, submits: 42, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Kaland-jatekok', visitors: 4876, submits: 39, conversionRate: 0.80 },
  { url: 'https://tabletopshop.com/Party-jatekok', visitors: 4543, submits: 37, conversionRate: 0.81 },
  { url: 'https://tabletopshop.com/Csaladi-jatekok', visitors: 4234, submits: 34, conversionRate: 0.80 }
])

const browserLanguages = ref([
  { code: 'hu-HU', visitors: 120143, submits: 812, conversionRate: 0.68 },
  { code: 'en-US', visitors: 21480, submits: 156, conversionRate: 0.73 },
  { code: 'en-GB', visitors: 9748, submits: 72, conversionRate: 0.74 },
  { code: 'hu', visitors: 8612, submits: 65, conversionRate: 0.75 },
  { code: 'en', visitors: 4734, submits: 38, conversionRate: 0.80 },
  { code: 'zh-CN', visitors: 913, submits: 8, conversionRate: 0.88 },
  { code: 'de-DE', visitors: 393, submits: 3, conversionRate: 0.76 },
  { code: 'en-HU', visitors: 300, submits: 2, conversionRate: 0.67 },
  { code: 'ru-RU', visitors: 148, submits: 1, conversionRate: 0.68 },
  { code: 'es-ES', visitors: 117, submits: 1, conversionRate: 0.85 },
  { code: 'fr-FR', visitors: 234, submits: 2, conversionRate: 0.85 },
  { code: 'it-IT', visitors: 198, submits: 2, conversionRate: 1.01 },
  { code: 'pl-PL', visitors: 176, submits: 1, conversionRate: 0.57 },
  { code: 'pt-PT', visitors: 143, submits: 1, conversionRate: 0.70 },
  { code: 'nl-NL', visitors: 128, submits: 1, conversionRate: 0.78 },
  { code: 'ro-RO', visitors: 112, submits: 1, conversionRate: 0.89 },
  { code: 'cs-CZ', visitors: 98, submits: 1, conversionRate: 1.02 },
  { code: 'sk-SK', visitors: 87, submits: 1, conversionRate: 1.15 },
  { code: 'bg-BG', visitors: 76, submits: 0, conversionRate: 0.00 },
  { code: 'hr-HR', visitors: 65, submits: 1, conversionRate: 1.54 },
  { code: 'sr-RS', visitors: 54, submits: 0, conversionRate: 0.00 },
  { code: 'sl-SI', visitors: 43, submits: 0, conversionRate: 0.00 },
  { code: 'uk-UA', visitors: 38, submits: 0, conversionRate: 0.00 },
  { code: 'sv-SE', visitors: 32, submits: 0, conversionRate: 0.00 },
  { code: 'da-DK', visitors: 27, submits: 0, conversionRate: 0.00 }
])

const utmCampaigns = ref([
  { name: 'olcsobbat_shopping_reflexshop', visitors: 45678, submits: 345, conversionRate: 0.76 },
  { name: 'surfaces_across_google', visitors: 38902, submits: 289, conversionRate: 0.74 },
  { name: 'KA-Konv-Kiemelt játékok', visitors: 32145, submits: 256, conversionRate: 0.80 },
  { name: 'reflexshop_google_shopping', visitors: 28567, submits: 234, conversionRate: 0.82 },
  { name: 'facebook_retargeting_q4', visitors: 24890, submits: 198, conversionRate: 0.80 },
  { name: 'email_newsletter_december', visitors: 21456, submits: 178, conversionRate: 0.83 },
  { name: 'instagram_stories_campaign', visitors: 18234, submits: 145, conversionRate: 0.80 },
  { name: 'youtube_video_ads', visitors: 15678, submits: 123, conversionRate: 0.78 },
  { name: 'google_search_brand', visitors: 12345, submits: 98, conversionRate: 0.79 },
  { name: 'tiktok_influencer_collab', visitors: 10234, submits: 87, conversionRate: 0.85 },
  { name: 'spring_sale_2026', visitors: 9876, submits: 82, conversionRate: 0.83 },
  { name: 'black_friday_early_access', visitors: 8765, submits: 73, conversionRate: 0.83 },
  { name: 'christmas_gift_guide', visitors: 7654, submits: 64, conversionRate: 0.84 },
  { name: 'new_year_promotion', visitors: 6789, submits: 57, conversionRate: 0.84 },
  { name: 'valentine_special', visitors: 5987, submits: 51, conversionRate: 0.85 },
  { name: 'summer_clearance', visitors: 5432, submits: 46, conversionRate: 0.85 },
  { name: 'back_to_school', visitors: 4876, submits: 42, conversionRate: 0.86 },
  { name: 'halloween_treats', visitors: 4321, submits: 37, conversionRate: 0.86 },
  { name: 'cyber_monday_deals', visitors: 3987, submits: 34, conversionRate: 0.85 },
  { name: 'easter_egg_hunt', visitors: 3654, submits: 31, conversionRate: 0.85 },
  { name: 'winter_wonderland', visitors: 3321, submits: 28, conversionRate: 0.84 },
  { name: 'spring_cleaning_sale', visitors: 2987, submits: 26, conversionRate: 0.87 },
  { name: 'mothers_day_gifts', visitors: 2765, submits: 24, conversionRate: 0.87 },
  { name: 'fathers_day_deals', visitors: 2543, submits: 22, conversionRate: 0.87 },
  { name: 'loyalty_program_bonus', visitors: 2321, submits: 20, conversionRate: 0.86 }
])

const utmSources = ref([
  { name: 'facebook', visitors: 45678, submits: 345, conversionRate: 0.76 },
  { name: 'olcsobbat', visitors: 38902, submits: 289, conversionRate: 0.74 },
  { name: 'google', visitors: 32145, submits: 256, conversionRate: 0.80 },
  { name: 'CJ', visitors: 28567, submits: 234, conversionRate: 0.82 },
  { name: 'tarsasjatekok.com', visitors: 24890, submits: 198, conversionRate: 0.80 },
  { name: 'TheMarketer', visitors: 21456, submits: 178, conversionRate: 0.83 },
  { name: 'fb', visitors: 18234, submits: 145, conversionRate: 0.80 },
  { name: 'ActiveCampaign', visitors: 15678, submits: 123, conversionRate: 0.78 },
  { name: 'google_shopping', visitors: 12345, submits: 98, conversionRate: 0.79 },
  { name: 'chatgpt.com', visitors: 10234, submits: 87, conversionRate: 0.85 },
  { name: 'instagram', visitors: 9876, submits: 82, conversionRate: 0.83 },
  { name: 'youtube', visitors: 8765, submits: 73, conversionRate: 0.83 },
  { name: 'tiktok', visitors: 7654, submits: 64, conversionRate: 0.84 },
  { name: 'pinterest', visitors: 6789, submits: 57, conversionRate: 0.84 },
  { name: 'twitter', visitors: 5987, submits: 51, conversionRate: 0.85 },
  { name: 'linkedin', visitors: 5432, submits: 46, conversionRate: 0.85 },
  { name: 'reddit', visitors: 4876, submits: 42, conversionRate: 0.86 },
  { name: 'newsletter', visitors: 4321, submits: 37, conversionRate: 0.86 },
  { name: 'partner_site', visitors: 3987, submits: 34, conversionRate: 0.85 },
  { name: 'affiliate_network', visitors: 3654, submits: 31, conversionRate: 0.85 },
  { name: 'review_site', visitors: 3321, submits: 28, conversionRate: 0.84 },
  { name: 'blog_post', visitors: 2987, submits: 26, conversionRate: 0.87 },
  { name: 'podcast_sponsor', visitors: 2765, submits: 24, conversionRate: 0.87 },
  { name: 'forum_post', visitors: 2543, submits: 22, conversionRate: 0.87 },
  { name: 'mobile_app', visitors: 2321, submits: 20, conversionRate: 0.86 }
])

// Computed properties for display (only first 5 rows)
const visitedPagesDisplay = computed(() => visitedPages.value.slice(0, 5))
const landingPagesDisplay = computed(() => landingPages.value.slice(0, 5))
const browserLanguagesDisplay = computed(() => browserLanguages.value.slice(0, 5))
const utmCampaignsDisplay = computed(() => utmCampaigns.value.slice(0, 5))
const utmSourcesDisplay = computed(() => utmSources.value.slice(0, 5))

// Devices table selection
const hoveredDevicesRow = ref(null)
const selectedDevicesRows = ref(new Set())
const toggleDevicesRow = (type) => {
  const s = new Set(selectedDevicesRows.value)
  s.has(type) ? s.delete(type) : s.add(type)
  selectedDevicesRows.value = s
}
const isDevicesRowSelected = (type) => selectedDevicesRows.value.has(type)

// Traffic source table selection
const hoveredTrafficRow2 = ref(null)
const selectedTrafficRows2 = ref(new Set())
const toggleTrafficRow2 = (referrer) => {
  const s = new Set(selectedTrafficRows2.value)
  s.has(referrer) ? s.delete(referrer) : s.add(referrer)
  selectedTrafficRows2.value = s
}
const isTrafficRow2Selected = (referrer) => selectedTrafficRows2.value.has(referrer)

// Countries table
const countriesData = [
  { country: 'Hungary',        visitors: 12427,  submits: 148,  submitRate: 1.19 },
  { country: 'United States',  visitors: 6086,   submits: 3,    submitRate: 0.05 },
  { country: 'Austria',        visitors: 1161,   submits: 42,   submitRate: 3.62 },
  { country: 'Germany',        visitors: 858,    submits: 14,   submitRate: 1.63 },
  { country: 'Singapore',      visitors: 768,    submits: null, submitRate: null },
  { country: 'United Kingdom', visitors: 560,    submits: 8,    submitRate: 1.43 },
  { country: 'Romania',        visitors: 496,    submits: 15,   submitRate: 3.02 },
  { country: 'Slovakia',       visitors: 336,    submits: 15,   submitRate: 4.46 },
  { country: 'Netherlands',    visitors: 262,    submits: 3,    submitRate: 1.15 },
  { country: 'Sweden',         visitors: 253,    submits: 1,    submitRate: 0.40 },
]
const hoveredCountriesRow = ref(null)
const selectedCountriesRows = ref(new Set())
const toggleCountriesRow = (country) => {
  const s = new Set(selectedCountriesRows.value)
  s.has(country) ? s.delete(country) : s.add(country)
  selectedCountriesRows.value = s
}
const isCountriesRowSelected = (country) => selectedCountriesRows.value.has(country)

// Pie chart — only sources with submits
// Top 5 by submits: Organic Search (1634), Facebook (378), Direct (272), Árukeresó (51), tarsasjatekok.com (32)
// Other: Paid Search (13) + Instagram (9) + YouTube (5) + telex.hu (4) = 31
// Series matches table row order (top 5) + Other
// Organic Search, Direct, Facebook, Árukeresó, TikTok(0), Other(32+9+5+13+4=63)
const trafficSubmitsPieSeries = [883, 673, 402, 164, 43, 0, 39]
const trafficPieLabels = ['Paid Search', 'Organic Search', 'Facebook', 'Direct', 'Árukereső', 'TikTok', 'Other']
const trafficPieColors = ['#FF6A45', '#FF8A6A', '#FFA48E', '#FFBFB2', '#FFD9D4', '#E5E7EB', '#D1D5DB']

const trafficPieReferrerIndex = {
  'Paid Search': 0, 'Organic Search': 1, 'Facebook': 2, 'Direct': 3,
  'Árukereső': 4, 'TikTok': 5, 'Other': 6,
}

const hoveredChartIndex = computed(() =>
  hoveredTrafficRow2.value !== null ? (trafficPieReferrerIndex[hoveredTrafficRow2.value] ?? null) : null
)

const maxCountrySubmits = Math.max(...countriesData.map(r => r.submits ?? 0))

const trafficSubmitsPieOptions = computed(() => ({
  chart: { type: 'donut', toolbar: { show: false }, fontFamily: 'inherit', animations: { dynamicAnimation: { enabled: false } } },
  labels: trafficPieLabels,
  colors: hoveredChartIndex.value !== null
    ? trafficPieColors.map((c, i) => i === hoveredChartIndex.value ? c : c + '30')
    : trafficPieColors,
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 2, colors: ['#fff'] },
  tooltip: { y: { formatter: (val) => val.toLocaleString() } },
}))
const trafficSourceData = [
  { referrer: 'Paid Search',    visitors: 40552, submits: 883,  submitRate: 2.18 },
  { referrer: 'Organic Search', visitors: 32037, submits: 673,  submitRate: 2.10 },
  { referrer: 'Facebook',       visitors: 26453, submits: 402,  submitRate: 1.52 },
  { referrer: 'Direct',         visitors: 23473, submits: 164,  submitRate: 0.70 },
  { referrer: 'Árukereső',      visitors: 1617,  submits: 43,   submitRate: 2.66 },
  { referrer: 'TikTok',         visitors: 1336,  submits: null, submitRate: null },
  { referrer: 'Other',          visitors: 878,   submits: 39,   submitRate: 4.44 },
]
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

@media (max-width: 960px) {
  .filters-section {
    flex-direction: column;
    align-items: flex-start;
  }
  .filters-right {
    flex-wrap: wrap;
    margin-left: 0;
  }
  .filters-right > .relative {
    width: auto;
    flex: 1;
    min-width: 160px;
  }
  .trend-chart-tabs {
    flex-wrap: wrap;
  }
  .trend-chart-tab {
    min-width: calc(50% - 0.25rem);
  }
}

.filters-right {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.filters-section > .relative {
  width: 240px;
}

.filters-right > .relative {
  width: 210px;
}

@media (max-width: 1439px) {
  .chat-open .filters-section {
    justify-content: flex-start;
  }

  .chat-open .filters-section > .relative {
    flex: 1;
    width: auto;
  }

  .chat-open .filters-right {
    flex: 3;
    margin-left: 0;
  }

  .chat-open .filters-right > .relative {
    flex: 1;
    width: auto;
  }
}

/* Trend Chart Tabs */
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
  font-size: 0.75rem;
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
  font-size: 1rem;
  font-weight: 500;
  color: rgb(80, 87, 99);
}

.trend-chart-change {
  font-size: 0.6875rem;
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
  font-weight: 600;
  color: rgb(35, 38, 42);
  margin-bottom: 1.25rem;
  padding-left: 32px;
  padding-right: 32px;
}

.section-header .section-title {
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 0;
}

.countries-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.countries-table-side {
  flex: 1;
  min-width: 0;
}

.countries-chart-side {
  width: 260px;
  flex-shrink: 0;
}

.countries-bar-header {
  height: 40px;
}

.countries-bar-row {
  height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 40px 0 8px;
  transition: background 0.2s ease;
}


.countries-bar-track {
  flex: 1;
  height: 10px;
  background: rgb(243, 244, 246);
  border-radius: 5px;
  overflow: hidden;
}

.countries-bar-fill {
  height: 100%;
  background: var(--color-om-orange-500);
  border-radius: 0 5px 5px 0;
  transition: width 0.3s ease;
}

.countries-bar-value {
  font-size: 0.75rem;
  font-weight: 500;
  color: #505763;
  min-width: 28px;
  text-align: right;
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

/* Smaller columns for breakdown module tables */
.breakdown-module-list-column {
  flex: 0 0 40%;
  min-width: 0;
}

.breakdown-module-metrics-column {
  flex: 0 0 60%;
  min-width: 0;
}

.breakdown-module-list-header {
  flex: 0 0 40%;
  min-width: 0;
  display: flex;
  align-items: center;
}

.breakdown-module-metrics-header {
  flex: 0 0 60%;
  min-width: 0;
  display: flex;
  align-items: center;
}

.breakdown-module-metrics-header .header-cell:nth-child(2) {
  flex: 1.5;
}

.breakdown-module-metrics-header .header-cell:last-child {
  padding-right: 32px;
}

.breakdown-module-list-header .header-cell {
  padding: 0.75rem calc(1rem + 16px);
  flex: initial;
  width: 100%;
}

.breakdown-module-metrics-header .header-cell {
  flex: 1;
  padding: 0.75rem 1rem;
}

.breakdown-module-metrics-header .header-cell:last-child {
  padding-right: 32px;
}

.campaign-table-header {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
}

.header-cell {
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 400;
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
  height: 44px;
  padding: 0 calc(1rem + 20px) 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgb(243, 244, 246);
  cursor: pointer;
}

.campaign-row.is-hovered {
  background: rgb(249, 250, 251);
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
  font-size: 0.8125rem;
  color: #23262A;
  font-weight: 400;
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
  transition: opacity 0.2s ease, color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}

.campaign-row:hover .campaign-link-icon {
  opacity: 1;
}

.campaign-link-icon:hover {
  color: #ed5a29;
  transform: scale(1.1);
}

.campaign-chevron {
  flex-shrink: 0;
  color: #8F97A4;
  transition: transform 0.25s ease, color 0.2s ease;
  cursor: pointer;
}

.campaign-chevron:hover {
  color: #23262A;
}

.campaign-chevron-expanded {
  transform: rotate(180deg);
}

.campaign-variant-row {
  height: 44px;
  padding: 0 1rem 0 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgb(250, 251, 252);
  border-bottom: 1px solid rgb(243, 244, 246);
  cursor: default;
}

.campaign-variant-name {
  font-size: 0.8125rem;
  color: #8F97A4;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.campaign-variant-metrics-row {
  height: 44px;
  display: flex;
  align-items: center;
  background: rgb(250, 251, 252);
  border-bottom: 1px solid rgb(243, 244, 246);
}

.campaign-variant-metrics-row .metric-cell {
  font-size: 0.8125rem;
  color: #8F97A4;
  font-weight: 400;
}

.campaign-variant-metrics-row .metric-cell:nth-child(2) {
  flex: 1.5;
}

.campaign-metrics-row {
  height: 44px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgb(243, 244, 246);
}

.campaign-metrics-row.is-hovered {
  background: rgb(249, 250, 251);
}

.metric-cell {
  padding: 0 1rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #23262A;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.metric-cell:last-child {
  padding-right: 32px;
}

/* Make Visitors column wider in breakdown tables */
.campaign-metrics-row .metric-cell:nth-child(2) {
  flex: 1.5;
}

.campaign-metrics-header .header-cell:nth-child(2) {
  flex: 1.5;
}

/* Breakdown Tables */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-left: 32px;
  padding-right: 32px;
}

.view-all-btn {
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(80, 87, 99);
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: rgb(243, 244, 246);
  color: rgb(35, 38, 42);
  transform: translateY(-1px);
}

.breakdown-filter-bar {
  display: flex;
  align-items: center;
  padding: 0;
  gap: 0.5rem;
  background: #F7F7F8;
  border-bottom: 1px solid rgb(227, 229, 232);
  height: 40px;
  box-sizing: border-box;
}

.breakdown-filter-bar .custom-checkbox {
  opacity: 1 !important;
}

.breakdown-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(227, 229, 232);
  padding: 0;
  gap: 0.5rem;
}

.breakdown-checkbox-header {
  flex-shrink: 0;
  opacity: 0;
}

.breakdown-header-cell {
  padding: 0.75rem 1rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #8F97A4;
  flex: 1;
}

.breakdown-header-cell:first-child {
  padding-left: 32px;
}

.breakdown-header-cell:last-child {
  padding-right: 32px;
}

.breakdown-header-cell.numeric {
  text-align: right;
}

.breakdown-body {
  display: flex;
  flex-direction: column;
}

.breakdown-row {
  height: 44px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(243, 244, 246);
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 0;
  gap: 0.5rem;
}

.breakdown-row:hover {
  background: rgb(249, 250, 251);
}

.breakdown-row .custom-checkbox {
  opacity: 0;
  flex-shrink: 0;
}

.breakdown-row:hover .custom-checkbox {
  opacity: 1;
}

.breakdown-cell {
  padding: 0 1rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #23262A;
  flex: 1;
  display: flex;
  align-items: center;
}

.breakdown-cell:first-child {
  padding-left: 1rem;
}

.breakdown-cell:last-child {
  padding-right: 32px;
}

.breakdown-cell.numeric {
  text-align: right;
  justify-content: flex-end;
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
  transition: color 0.2s ease;
}

.url-link:hover {
  color: #ed5a29;
}

.external-icon {
  flex-shrink: 0;
  color: rgb(185, 190, 198);
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.breakdown-row:hover .external-icon {
  opacity: 1;
}

.url-link:hover .external-icon {
  color: #ed5a29;
  transform: translate(2px, -2px);
}

/* Breakdown Modules Row */
.breakdown-modules-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 1199px) {
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
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 12px 20px -8px rgba(0, 0, 0, 0.08);
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
  border-radius: 8px;
  cursor: pointer;
  color: rgb(143, 151, 164);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: rgb(243, 244, 246);
  color: rgb(35, 38, 42);
  transform: scale(1.05);
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

/* Custom Checkboxes */
.custom-checkbox {
  flex-shrink: 0;
  transition: opacity 0.2s ease;
  opacity: 0;
}

/* Show checkboxes on row hover or when any selection exists */
.campaign-row.is-hovered .custom-checkbox,
.campaign-variant-row:hover .custom-checkbox,
.has-selection .custom-checkbox {
  opacity: 1;
}

/* Filter Bar - Full Width */
.campaign-filter-bar {
  display: flex;
  align-items: center;
  padding: 0 1rem 0 0.5rem;
  gap: 0.5rem;
  background: #F7F7F8;
  border-bottom: 1px solid rgb(227, 229, 232);
  height: 40px;
  box-sizing: border-box;
}

.campaign-filter-bar .custom-checkbox {
  opacity: 1 !important;
}

/* Campaign Headers Row - Full Width */
.campaign-headers-row {
  display: flex;
  border-bottom: 1px solid rgb(227, 229, 232);
  height: 40px;
}

.campaign-list-header {
  flex: 0 0 480px;
  display: flex;
  align-items: center;
}

.campaign-list-header .header-cell {
  padding: 0.75rem calc(1rem + 16px);
}

.campaign-metrics-header {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 500px;
}

.campaign-metrics-header .header-cell {
  flex: 1;
  padding: 0.75rem 1rem;
}

.campaign-metrics-header .header-cell:last-child {
  padding-right: 32px;
}

.selection-count {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgb(35, 38, 42);
}

.filter-btn {
  padding: 0.375rem 0.75rem;
  margin-left: 1rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: rgb(80, 87, 99);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 400;
}

.filter-btn:hover {
  background: rgb(229, 231, 235);
  color: rgb(35, 38, 42);
}

.clear-selection-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid rgb(213, 216, 221);
  border-radius: 8px;
  font-size: 0.875rem;
  color: rgb(80, 87, 99);
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-selection-btn:hover {
  background: rgb(243, 244, 246);
  border-color: rgb(185, 190, 198);
  color: rgb(35, 38, 42);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.chat-open .campaign-list-column {
  flex: 0 0 320px;
}

.chat-open .campaign-list-header {
  flex: 0 0 320px;
}

/* Optimization Opportunities */
.opportunities-list {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.opportunity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 13px 12px;
  gap: 16px;
  background: white;
  position: relative;
  transition: background 0.15s;
}

.opportunity-item + .opportunity-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 12px;
  right: 12px;
  height: 1px;
  background: #F1F2F4;
}

.opportunity-item:hover {
  background: #F1F2F4;
  border-radius: 8px;
}

.opportunity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.opportunity-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.opportunity-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #23262A;
}

.opportunity-desc {
  font-size: 0.8125rem;
  color: #6B7280;
  line-height: 1.4;
}

.opportunity-badge {
  font-size: 0.75rem;
  font-weight: 400;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.badge-high {
  background: #FFF0EB;
  color: #C94B14;
}

.badge-medium {
  background: #FFF8E6;
  color: #9A6400;
}

.opportunity-chevron {
  color: #D1D5DB;
  flex-shrink: 0;
  transition: color 0.15s;
}

.opportunity-item:hover .opportunity-chevron {
  color: #9CA3AF;
}

.opportunities-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
}

.view-all-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6B7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.view-all-btn:hover {
  color: #23262A;
  background: #F1F2F4;
}

/* Devices + Traffic Source Row */
.analytics-outer {
  container-type: inline-size;
  container-name: analytics-outer;
}

.devices-card {
  container-type: inline-size;
}

.devices-traffic-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: start;
}

@container (min-width: 1200px) {
  .devices-traffic-row {
    grid-template-columns: 2fr 3fr;
    align-items: stretch;
  }
}

/* Traffic Source Table */
.traffic-table {
  padding: 0 20px;
}

.traffic-header {
  display: flex;
  align-items: center;
  padding: 0 0 8px 0;
  border-bottom: 1px solid #F3F4F6;
}

.traffic-header-cell {
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.traffic-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #F9FAFB;
}

.traffic-row:last-child {
  border-bottom: none;
}

.traffic-cell {
  font-size: 13px;
  color: #374151;
}

.traffic-referrer-col {
  flex: 2;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
}

.traffic-visitors-col {
  flex: 3;
  padding-right: 16px;
}

.traffic-visitors-inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.traffic-visitors-value {
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  width: 56px;
  text-align: right;
  flex-shrink: 0;
}

.traffic-num-col {
  flex: 1;
  text-align: right;
  color: #6B7280;
}

.traffic-progress-track {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #F3F4F6;
  overflow: hidden;
}

.traffic-progress-bar {
  height: 100%;
  border-radius: 2px;
  background: #FF6A45;
}

.traffic-plain-layout {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
  overflow: hidden;
}

.devices-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.devices-chart-wrap {
  padding: 0 20px;
}

@container (min-width: 600px) {
  .devices-content {
    flex-direction: row;
    align-items: center;
    gap: 24px;
    overflow: hidden;
  }
  .devices-table-wrap {
    flex: 1 1 0;
    min-width: 0;
    width: 0;
  }
  .devices-chart-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 280px;
    padding: 0;
  }
}


.devices-table-wrap {
  min-width: 0;
}

.devices-table-wrap .campaign-performance-layout {
  overflow-x: hidden;
}

.devices-table-wrap .campaign-list-header,
.devices-table-wrap .campaign-list-column {
  flex: 0 0 40%;
  min-width: 0;
  max-width: 40%;
}

.devices-table-wrap .campaign-metrics-header,
.devices-table-wrap .campaign-metrics-column {
  flex: 0 0 60%;
  min-width: 0;
  max-width: 60%;
}

.devices-table-wrap .campaign-metrics-header .header-cell:last-child {
  padding-right: 32px;
}

.devices-table-wrap .campaign-metrics-header,
.traffic-plain-table .campaign-metrics-header {
  container-type: inline-size;
}

.sr-short { display: none; }

@container (max-width: 400px) {
  .sr-full { display: none; }
  .sr-short { display: inline; }
}

.traffic-plain-layout .traffic-table,
.traffic-plain-table {
  flex: 1 1 0;
  min-width: 0;
  width: 0;
  padding: 0;
}

.traffic-plain-table .campaign-performance-layout {
  overflow-x: hidden;
}

.traffic-plain-table .campaign-list-column {
  flex: 0 0 40%;
  min-width: 0;
  max-width: 40%;
}

.traffic-plain-table .campaign-list-header {
  flex: 0 0 40%;
  min-width: 0;
  max-width: 40%;
}

.traffic-plain-table .campaign-metrics-column {
  flex: 0 0 60%;
  min-width: 0;
  max-width: 60%;
}

.traffic-plain-table .campaign-metrics-header {
  flex: 0 0 60%;
  min-width: 0;
  max-width: 60%;
}

.traffic-plain-table .campaign-metrics-header .header-cell:nth-child(2) {
  flex: 1.5;
}

.traffic-plain-table .campaign-metrics-header .header-cell:last-child {
  padding-right: 32px;
}

.traffic-pie-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 240px;
  height: 240px;
  padding-right: 2rem;
}

.traffic-pie-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.traffic-pie-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.traffic-pie-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.traffic-pie-legend-label {
  font-size: 12px;
  color: #6B7280;
}
</style>
