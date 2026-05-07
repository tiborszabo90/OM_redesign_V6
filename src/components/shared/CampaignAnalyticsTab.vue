<template>
  <div class="space-y-5 pb-40">
    <!-- Filters bar -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Segments button -->
        <div class="relative">
          <button
            @click="toggleSegmentsDropdown"
            :class="['px-3 h-10 flex items-center gap-1.5 rounded-lg text-sm cursor-pointer transition-all duration-200 ease-out', showSegmentsDropdown ? 'bg-om-gray-200 text-om-gray-700' : 'bg-om-gray-100 text-om-gray-500 hover:bg-om-gray-200 hover:text-om-gray-700']"
          >
            <Users :size="16" />
            <span class="text-om-gray-700">{{ activeSegmentName }}</span>
            <ChevronDown :size="14" class="text-om-gray-400" />
          </button>
          <div v-if="showSegmentsDropdown" class="fixed inset-0 z-10" @click="closeSegmentsDropdown" />
          <div v-if="showSegmentsDropdown" class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-20 w-[300px]">
            <div class="py-1 max-h-[280px] overflow-y-auto">
              <div
                :class="['w-full px-3 py-2 hover:bg-om-gray-50 transition-colors flex items-center gap-2 cursor-pointer', activeSegmentName === 'All visitors' ? 'bg-om-gray-50' : '']"
                @click="loadAllVisitors"
              >
                <Users :size="14" class="text-om-gray-400 shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-om-gray-700 truncate">All visitors</div>
                  <div class="text-xs text-om-gray-400 truncate">No filters</div>
                </div>
              </div>
              <div
                v-for="seg in savedSegments"
                :key="seg.id"
                :class="['group w-full px-3 py-2 hover:bg-om-gray-50 transition-colors flex items-center gap-2 cursor-pointer', activeSegmentName === seg.name ? 'bg-om-gray-50' : '']"
                @click="loadSegment(seg)"
              >
                <Users :size="14" class="text-om-gray-400 shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-om-gray-700 truncate">{{ seg.name }}</div>
                  <div class="text-xs text-om-gray-400 truncate">{{ seg.filters.length }} filter{{ seg.filters.length > 1 ? 's' : '' }}</div>
                </div>
                <button
                  class="w-6 h-6 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-om-gray-200 text-om-gray-400 hover:text-om-gray-700 transition-all shrink-0"
                  @click.stop="deleteSegment(seg.id)"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Predefined filter chips -->
        <div
          v-for="(f, idx) in predefinedFilters"
          :key="f.value"
          class="group relative flex items-center"
        >
          <button
            @click="editFilter(f, idx)"
            class="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg bg-om-orange-100 text-om-orange-600 text-sm font-medium cursor-pointer hover:bg-om-orange-200 transition-colors"
          >
            {{ f.label }}
            <span class="inline-flex items-center overflow-hidden transition-all duration-200 ease-out w-0 group-hover:w-4 group-hover:ml-1">
              <X
                :size="14"
                class="shrink-0 text-om-orange-400 hover:text-om-orange-700"
                @click.stop="removePredefinedFilter(f.value)"
              />
            </span>
          </button>
          <div v-if="showAddFilterDropdown && editingFilterIndex === idx" class="fixed inset-0 z-10" @click="closeFilterDropdown" />
          <div v-if="showAddFilterDropdown && editingFilterIndex === idx" class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-20 w-[280px]">
            <div class="px-3 pt-3 pb-2">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-om-gray-400 uppercase tracking-wide">{{ selectedFilterCategory?.label }}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button
                  v-for="cond in filterConditions"
                  :key="cond.value"
                  @click="selectedFilterCondition = cond.value"
                  :class="['px-2.5 py-1 rounded-md text-xs cursor-pointer transition-all duration-150', selectedFilterCondition === cond.value ? 'bg-om-gray-200 text-om-gray-700 font-medium' : 'bg-om-gray-100 text-om-gray-500 hover:bg-om-gray-200']"
                >{{ cond.label }}</button>
              </div>
            </div>
            <div v-if="showValuesSearch" class="px-3 pb-2">
              <div class="relative">
                <Search :size="14" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-om-gray-400 pointer-events-none" />
                <input v-model="filterDropdownSearch" type="text" :placeholder="`Search ${selectedFilterCategory?.label.toLowerCase()}...`" class="w-full pl-8 pr-3 h-8 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300" />
              </div>
            </div>
            <div v-if="isFreeTextMode" class="px-3 pt-2 pb-1">
              <div class="flex gap-1.5">
                <input v-model="freeTextInput" type="text" placeholder="Type a value..." class="flex-1 px-2.5 h-8 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300" @keydown.enter="addFreeTextValue" />
                <button @click="addFreeTextValue" class="px-2.5 h-8 rounded-lg bg-om-gray-100 text-om-gray-500 text-sm hover:bg-om-gray-200 transition-colors">Add</button>
              </div>
              <div v-if="filterDropdownSelected.length > 0" class="flex flex-wrap gap-1.5 mt-2">
                <span v-for="val in filterDropdownSelected" :key="val" class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-om-orange-100 text-om-orange-600 text-xs font-medium">
                  {{ val }}
                  <X :size="12" class="cursor-pointer hover:text-om-orange-700" @click="toggleFilterValue(val)" />
                </span>
              </div>
            </div>
            <div class="py-1">
              <label v-for="val in filteredValues" :key="val" class="w-full px-3 py-2 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer">
                <Checkbox :model-value="filterDropdownSelected.includes(val)" size="sm" @update:model-value="toggleFilterValue(val)" />
                <span>{{ val }}</span>
              </label>
            </div>
            <div v-if="filterDropdownSelected.length > 0" class="px-3 py-2 border-t border-om-gray-100">
              <Button variant="primary" size="sm" class="w-full" @click="applyDropdownFilter">
                Apply {{ filterDropdownSelected.length }} filter{{ filterDropdownSelected.length > 1 ? 's' : '' }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Add filter button -->
        <div class="relative">
          <button
            @click="toggleFilterDropdown"
            :class="['px-3 h-10 flex items-center gap-1.5 rounded-lg text-sm cursor-pointer transition-all duration-200 ease-out', showAddFilterDropdown && editingFilterIndex === null ? 'bg-om-gray-200 text-om-gray-700' : 'bg-om-gray-100 text-om-gray-500 hover:bg-om-gray-200 hover:text-om-gray-700']"
          >
            <Plus :size="16" />
            <span class="text-om-gray-700">Filter</span>
          </button>
          <div v-if="showAddFilterDropdown && editingFilterIndex === null" class="fixed inset-0 z-10" @click="closeFilterDropdown" />
          <div v-if="showAddFilterDropdown && editingFilterIndex === null" class="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-20 w-[280px]">
            <div v-if="filterDropdownStep === 'values'" class="px-3 pt-3 pb-2">
              <div class="flex items-center gap-2 mb-2">
                <button @click="filterDropdownStep = 'categories'" class="w-6 h-6 flex items-center justify-center rounded hover:bg-om-gray-100 text-om-gray-400 transition-colors">
                  <ChevronLeft :size="16" />
                </button>
                <span class="text-xs font-medium text-om-gray-400 uppercase tracking-wide">{{ selectedFilterCategory?.label }}</span>
              </div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <button v-for="cond in filterConditions" :key="cond.value" @click="selectedFilterCondition = cond.value" :class="['px-2.5 py-1 rounded-md text-xs cursor-pointer transition-all duration-150', selectedFilterCondition === cond.value ? 'bg-om-gray-200 text-om-gray-700 font-medium' : 'bg-om-gray-100 text-om-gray-500 hover:bg-om-gray-200']">{{ cond.label }}</button>
              </div>
            </div>
            <div v-if="filterDropdownStep === 'categories' || showValuesSearch" class="px-3 pt-3 pb-2">
              <div class="relative">
                <Search :size="14" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-om-gray-400 pointer-events-none" />
                <input v-model="filterDropdownSearch" type="text" :placeholder="filterDropdownStep === 'categories' ? 'Search filters...' : `Search ${selectedFilterCategory?.label.toLowerCase()}...`" class="w-full pl-8 pr-3 h-8 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300" />
              </div>
            </div>
            <div v-if="filterDropdownStep === 'categories'" class="py-1">
              <button v-for="cat in filteredCategories" :key="cat.value" @click="selectFilterCategory(cat)" class="w-full px-3 py-2 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors flex items-center gap-2">
                <component :is="cat.icon" :size="16" class="text-om-gray-400 shrink-0" />
                {{ cat.label }}
              </button>
            </div>
            <div v-if="filterDropdownStep === 'values' && isFreeTextMode" class="px-3 py-2">
              <div class="flex gap-1.5">
                <input v-model="freeTextInput" type="text" placeholder="Type a value..." class="flex-1 px-2.5 h-8 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300" @keydown.enter="addFreeTextValue" />
                <button @click="addFreeTextValue" class="px-2.5 h-8 rounded-lg bg-om-gray-100 text-om-gray-500 text-sm hover:bg-om-gray-200 transition-colors">Add</button>
              </div>
              <div v-if="filterDropdownSelected.length > 0" class="flex flex-wrap gap-1.5 mt-2">
                <span v-for="val in filterDropdownSelected" :key="val" class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-om-orange-100 text-om-orange-600 text-xs font-medium">
                  {{ val }}
                  <X :size="12" class="cursor-pointer hover:text-om-orange-700" @click="toggleFilterValue(val)" />
                </span>
              </div>
            </div>
            <div v-if="filterDropdownStep === 'values' && !isFreeTextMode" class="py-1">
              <label v-for="val in filteredValues" :key="val" class="w-full px-3 py-2 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors flex items-center gap-2.5 cursor-pointer">
                <Checkbox :model-value="filterDropdownSelected.includes(val)" size="sm" @update:model-value="toggleFilterValue(val)" />
                <span>{{ val }}</span>
              </label>
            </div>
            <div v-if="filterDropdownStep === 'values' && filterDropdownSelected.length > 0" class="px-3 py-2 border-t border-om-gray-100">
              <Button variant="primary" size="sm" class="w-full" @click="applyDropdownFilter">
                Apply {{ filterDropdownSelected.length }} filter{{ filterDropdownSelected.length > 1 ? 's' : '' }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Save as segment button -->
        <div v-if="predefinedFilters.length > 0" class="relative">
          <button
            @click="toggleSaveSegmentPopover"
            :class="['px-3 h-10 flex items-center gap-1.5 rounded-lg text-sm cursor-pointer transition-all duration-200 ease-out', showSaveSegmentPopover ? 'bg-om-gray-200 text-om-gray-700' : 'bg-om-gray-100 text-om-gray-500 hover:bg-om-gray-200 hover:text-om-gray-700']"
          >
            <Save :size="16" />
            <span class="text-om-gray-700">Save as segment</span>
          </button>
          <div v-if="showSaveSegmentPopover" class="fixed inset-0 z-10" @click="closeSaveSegmentPopover" />
          <div v-if="showSaveSegmentPopover" class="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-20 w-[300px] p-3">
            <div class="text-xs font-medium text-om-gray-400 uppercase tracking-wide mb-2">Save current filters</div>
            <div class="flex gap-1.5">
              <input v-model="newSegmentName" type="text" placeholder="Segment name..." class="flex-1 px-2.5 h-8 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300" @keydown.enter="saveCurrentAsSegment" />
              <Button variant="primary" size="sm" :disabled="!newSegmentName.trim()" @click="saveCurrentAsSegment">Save</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Time period -->
      <div style="width: 208px">
        <Dropdown key="analytics-time-period" v-model="analyticsTimePeriod" :options="timePeriodOptions">
          <template #icon><Calendar :size="18" class="text-om-gray-400" /></template>
        </Dropdown>
      </div>
    </div>

    <!-- Trend Chart -->
    <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] px-5 pb-5">
      <div class="flex items-stretch border-b border-om-gray-200 mb-4">
        <button
          v-for="tab in analyticsTabs"
          :key="tab.id"
          class="flex-1 min-w-35 text-left px-3 py-5 border-b-[3px] transition-all duration-200 cursor-pointer"
          :class="analyticsMetric === tab.id ? 'border-om-orange-500' : 'border-transparent hover:bg-om-gray-50'"
          @click="analyticsMetric = tab.id"
        >
          <div class="text-xs font-medium text-om-gray-600/80 mb-2.5">{{ tab.title }}</div>
          <div class="flex items-baseline gap-2">
            <div class="text-base font-medium text-om-gray-600">{{ tab.value }}</div>
            <div class="text-[11px] font-normal text-[#239E77] flex items-center gap-1">
              <TrendingUp :size="12" /> {{ tab.change }}
            </div>
          </div>
        </button>
      </div>
      <VueApexCharts
        :key="analyticsMetric"
        type="area"
        height="280"
        :options="analyticsChartOptions"
        :series="analyticsChartSeries"
      />
    </div>

    <!-- Funnel breakdown -->
    <slot name="funnel">
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5">
        <div class="px-8 mb-1">
          <h2 class="text-xl font-semibold text-om-gray-700">Funnel breakdown</h2>
        </div>
        <div class="text-[13px] text-om-gray-500 mb-5 px-8">Impressions of each page in this popup, with drop-off between steps.</div>
        <div class="px-5 flex items-stretch gap-0">
          <template v-for="(step, idx) in funnelSteps" :key="step.id">
            <div class="flex-1 rounded-xl border border-om-gray-200 px-4 py-2.5 flex flex-col gap-1 min-w-0">
              <div class="text-[13px] font-medium text-om-gray-500 truncate">{{ step.name }}</div>
              <div class="text-base font-semibold text-om-gray-700 tabular-nums">{{ step.impressions.toLocaleString() }}</div>
              <div class="h-1.5 rounded-full bg-om-gray-100 overflow-hidden">
                <div class="h-full rounded-full bg-om-orange-500" :style="{ width: funnelShare(step) + '%' }"></div>
              </div>
            </div>
            <div
              v-if="idx < funnelSteps.length - 1"
              class="flex flex-col items-center justify-center px-3 shrink-0"
            >
              <ArrowRight :size="32" class="text-om-gray-300" />
              <div class="text-sm font-semibold text-om-gray-500 tabular-nums mt-1.5 whitespace-nowrap">-{{ funnelDropOff(idx + 1) }}%</div>
            </div>
          </template>
        </div>
      </div>
    </slot>

    <!-- Insights -->
    <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5">
      <div class="flex items-center justify-between pr-5 pl-8 mb-4">
        <h2 class="text-xl font-semibold text-om-gray-700">Insights</h2>
        <button class="text-sm font-medium text-om-gray-500 hover:text-om-gray-700 transition-colors cursor-pointer">View all</button>
      </div>
      <div class="flex flex-col px-5">
        <div
          v-for="opp in analyticsInsights"
          :key="opp.id"
          class="flex items-center justify-between gap-4 px-3 py-3 cursor-pointer hover:bg-om-gray-100 rounded-lg transition-colors relative"
        >
          <div class="flex-1 min-w-0 flex flex-col gap-1">
            <div class="flex items-center gap-2.5">
              <div class="text-sm font-medium text-om-gray-700">{{ opp.name }}</div>
              <div :class="['text-xs font-normal px-2 py-0.5 rounded-full whitespace-nowrap shrink-0', opp.level === 'high' ? 'bg-[#FFF0EB] text-[#C94B14]' : 'bg-[#FFF8E6] text-[#9A6400]']">{{ opp.value }}</div>
            </div>
            <div class="text-[0.8125rem] text-om-gray-500 leading-snug">{{ opp.description }}</div>
          </div>
          <ChevronRight :size="16" class="text-om-gray-300 shrink-0" />
        </div>
      </div>
    </div>

    <!-- Devices + New vs Returning Row -->
    <div class="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-6">
      <!-- Devices -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <h2 class="text-xl font-semibold text-om-gray-700 mb-5 px-8">Devices</h2>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Device type</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="d in analyticsDevices"
          :key="d.type"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ d.type }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ d.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ d.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ d.submitRate }}</div>
          </div>
        </div>
        <div class="px-5 pt-2">
          <VueApexCharts type="bar" height="120" :options="devicesChartOptions" :series="devicesChartSeries" />
        </div>
      </div>

      <!-- New vs Returning -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <h2 class="text-xl font-semibold text-om-gray-700 mb-5 px-8">New vs Returning Visitors</h2>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Visitor type</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="v in analyticsVisitorTypes"
          :key="v.type"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ v.type }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ v.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ v.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ v.submitRate }}</div>
          </div>
        </div>
        <div class="px-5 pt-2">
          <VueApexCharts type="bar" height="120" :options="visitorTypesChartOptions" :series="visitorTypesChartSeries" />
        </div>
      </div>
    </div>

    <!-- Countries + Landing Pages Row -->
    <div class="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-6">
      <!-- Countries -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">Countries</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Country</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="c in analyticsCountries"
          :key="c.name"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center gap-2 min-w-0">
              <img v-if="getFlagUrl(c.name)" :src="getFlagUrl(c.name)" :alt="c.name" class="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-om-gray-200" />
              <span class="text-[13px] text-om-gray-700 truncate">{{ c.name }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ c.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ c.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ c.submitRate }}</div>
          </div>
        </div>
      </div>

      <!-- Landing Pages -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">Landing Pages</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Landing page</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="lp in analyticsLandingPages"
          :key="lp.url"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ lp.url }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ lp.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ lp.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ lp.submitRate }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Traffic Sources + Referring Sites Row -->
    <div class="grid grid-cols-1 min-[1200px]:grid-cols-[55fr_45fr] gap-6">
      <!-- Traffic Sources -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">Traffic Sources</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center gap-6 min-w-0">
          <div class="flex-1 min-w-0 w-0">
            <div class="flex items-center h-10 border-b border-om-gray-200">
              <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
                <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Source</div>
              </div>
              <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
                <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
                <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
                <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
              </div>
            </div>
            <div
              v-for="(t, idx) in analyticsTrafficSources"
              :key="t.source"
              class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer transition-colors"
              :class="hoveredTrafficSource === t.source ? 'bg-[#F9FAFB]' : 'hover:bg-[#F9FAFB]'"
              @mouseenter="hoveredTrafficSource = t.source"
              @mouseleave="hoveredTrafficSource = null"
            >
              <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
                <div class="w-full px-8 flex items-center gap-1.5 min-w-0">
                  <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: trafficPieColors[idx] }"></span>
                  <span class="text-[13px] text-om-gray-700 truncate">{{ t.source }}</span>
                </div>
              </div>
              <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
                <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ t.impressions.toLocaleString() }}</div>
                <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ t.submits }}</div>
                <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ t.submitRate }}</div>
              </div>
            </div>
          </div>
          <div class="shrink-0 flex items-center justify-center" style="width: 240px; height: 240px; padding-right: 2rem;">
            <VueApexCharts
              type="donut"
              height="240"
              width="240"
              :options="trafficPieOptions"
              :series="trafficPieSeries"
            />
          </div>
        </div>
      </div>

      <!-- Referring Sites -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">Referring Sites</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Site</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="r in analyticsReferringSites"
          :key="r.site"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ r.site }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ r.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ r.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ r.submitRate }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Browser Languages + Operating Systems Row -->
    <div class="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-6">
      <!-- Browser Languages -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">Browser Languages</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Language</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="l in analyticsBrowserLanguages"
          :key="l.code"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ l.code }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ l.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ l.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ l.submitRate }}</div>
          </div>
        </div>
      </div>

      <!-- Operating Systems -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">Operating Systems</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">OS</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="o in analyticsOperatingSystems"
          :key="o.name"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ o.name }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ o.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ o.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ o.submitRate }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visited Pages (full width) -->
    <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden">
      <div class="flex items-center justify-between mb-5 px-8">
        <h2 class="text-xl font-semibold text-om-gray-700">Visited Pages</h2>
        <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
      </div>
      <div class="flex items-center h-10 border-b border-om-gray-200">
        <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
          <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Page</div>
        </div>
        <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
          <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
          <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
          <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
        </div>
      </div>
      <div
        v-for="p in analyticsPages"
        :key="p.url"
        class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
      >
        <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
          <div class="w-full px-8 flex items-center min-w-0">
            <span class="text-[13px] text-om-gray-700 truncate">{{ p.url }}</span>
          </div>
        </div>
        <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
          <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ p.impressions.toLocaleString() }}</div>
          <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ p.submits }}</div>
          <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ p.submitRate }}</div>
        </div>
      </div>
    </div>

    <!-- UTM Campaigns + UTM Sources Row -->
    <div class="grid grid-cols-1 min-[1200px]:grid-cols-2 gap-6">
      <!-- UTM Campaigns -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">UTM Campaigns</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Campaign</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="u in analyticsUtmCampaigns"
          :key="u.name"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ u.name }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ u.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ u.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ u.submitRate }}</div>
          </div>
        </div>
      </div>

      <!-- UTM Sources -->
      <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 overflow-hidden min-w-0">
        <div class="flex items-center justify-between mb-5 px-8">
          <h2 class="text-xl font-semibold text-om-gray-700">UTM Sources</h2>
          <button class="px-5 py-2 rounded-lg text-sm font-medium text-om-gray-600 hover:bg-om-gray-100 hover:text-om-gray-700 transition-all cursor-pointer">View All</button>
        </div>
        <div class="flex items-center h-10 border-b border-om-gray-200">
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full py-3 px-8 text-[13px] font-normal text-om-gray-500">Source</div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Impressions</div>
            <div class="flex-1 py-3 px-4 text-right text-[13px] font-normal text-om-gray-500">Submits</div>
            <div class="flex-1 py-3 px-4 pr-8 text-right text-[13px] font-normal text-om-gray-500">Submit rate</div>
          </div>
        </div>
        <div
          v-for="s in analyticsUtmSources"
          :key="s.name"
          class="flex items-center h-11 border-b border-[#F3F4F6] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
        >
          <div class="flex-[0_0_40%] min-w-0 max-w-[40%] flex items-center">
            <div class="w-full px-8 flex items-center min-w-0">
              <span class="text-[13px] text-om-gray-700 truncate">{{ s.name }}</span>
            </div>
          </div>
          <div class="flex-[0_0_60%] min-w-0 max-w-[60%] flex items-center">
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ s.impressions.toLocaleString() }}</div>
            <div class="flex-1 px-4 text-right text-[13px] text-om-gray-700 tabular-nums">{{ s.submits }}</div>
            <div class="flex-1 px-4 pr-8 text-right text-[13px] text-om-gray-700 tabular-nums">{{ s.submitRate }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight, TrendingUp, Calendar, Users, Smartphone, X, Globe, Plus, Search, Save, Trash2, MousePointerClick, Languages, Laptop, AppWindow } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import Button from './Button.vue'
import Checkbox from './Checkbox.vue'
import Dropdown from './Dropdown.vue'

const timePeriodOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']

// Filters & segments
const predefinedFilters = reactive([])
const activePredefinedFilter = ref(null)
const showAddFilterDropdown = ref(false)
const filterDropdownStep = ref('categories')
const filterDropdownSearch = ref('')
const selectedFilterCategory = ref(null)
const filterDropdownSelected = ref([])
const editingFilterIndex = ref(null)
const freeTextInput = ref('')
const selectedFilterCondition = ref('is')

const allFilterOptions = [
  { value: 'device', label: 'Device', icon: Smartphone, values: ['Mobile', 'Desktop', 'Tablet'] },
  { value: 'traffic-source', label: 'Traffic source', icon: Globe, values: ['Google', 'Facebook', 'Instagram', 'Direct', 'Email', 'TikTok', 'Twitter/X', 'LinkedIn'] },
  { value: 'country', label: 'Country', icon: Globe, values: ['Hungary', 'United States', 'Germany', 'United Kingdom', 'France', 'Austria', 'Romania', 'Slovakia'] },
  { value: 'visitor-type', label: 'Visitor type', icon: MousePointerClick, values: ['New visitors', 'Returning visitors'] },
  { value: 'landing-page', label: 'Landing page', icon: Search, freeText: true, values: ['/home', '/products', '/cart', '/checkout', '/collections/new', '/about', '/contact'] },
  { value: 'browser-language', label: 'Browser language', icon: Languages, values: ['en', 'hu', 'de', 'fr', 'es', 'ro', 'sk', 'pl'] },
  { value: 'operating-system', label: 'Operating system', icon: Laptop, values: ['Windows', 'macOS', 'iOS', 'Android', 'Linux'] },
  { value: 'browser', label: 'Browser', icon: AppWindow, values: ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera', 'Samsung Internet'] },
]

const allFilterConditions = [
  { value: 'is', label: 'Is' },
  { value: 'is-not', label: 'Is not' },
  { value: 'contains', label: 'Contains' },
  { value: 'not-contains', label: 'Does not contain' },
]

const filteredCategories = computed(() => {
  const q = filterDropdownSearch.value.toLowerCase()
  if (!q) return allFilterOptions
  return allFilterOptions.filter(c => c.label.toLowerCase().includes(q))
})
const filteredValues = computed(() => {
  if (!selectedFilterCategory.value) return []
  const q = filterDropdownSearch.value.toLowerCase()
  const vals = selectedFilterCategory.value.values
  if (!q) return vals
  return vals.filter(v => v.toLowerCase().includes(q))
})
const filterConditions = computed(() => {
  const cat = selectedFilterCategory.value
  if (cat?.freeText) return allFilterConditions
  return allFilterConditions.filter(c => c.value === 'is' || c.value === 'is-not')
})
const isFreeTextMode = computed(() => !!selectedFilterCategory.value?.freeText)
const showValuesSearch = computed(() => {
  const cat = selectedFilterCategory.value
  return !isFreeTextMode.value && cat && cat.values.length >= 10
})

const toggleFilterDropdown = () => {
  showAddFilterDropdown.value = !showAddFilterDropdown.value
  if (showAddFilterDropdown.value) {
    filterDropdownStep.value = 'categories'
    filterDropdownSearch.value = ''
    selectedFilterCategory.value = null
    filterDropdownSelected.value = []
    editingFilterIndex.value = null
  }
}
const closeFilterDropdown = () => { showAddFilterDropdown.value = false }
const addFreeTextValue = () => {
  const val = freeTextInput.value.trim()
  if (val && !filterDropdownSelected.value.includes(val)) filterDropdownSelected.value.push(val)
  freeTextInput.value = ''
}
const selectFilterCategory = (cat) => {
  selectedFilterCategory.value = cat
  filterDropdownStep.value = 'values'
  filterDropdownSearch.value = ''
  filterDropdownSelected.value = []
  selectedFilterCondition.value = 'is'
}
const toggleFilterValue = (val) => {
  const idx = filterDropdownSelected.value.indexOf(val)
  if (idx >= 0) filterDropdownSelected.value.splice(idx, 1)
  else filterDropdownSelected.value.push(val)
}
const buildFilterLabel = (catLabel, condLabel, values) => {
  const valStr = values.length <= 2 ? values.join(', ') : `${values.length} selected`
  return `${catLabel} ${condLabel.toLowerCase()} ${valStr}`
}
const applyDropdownFilter = () => {
  const cat = selectedFilterCategory.value
  const cond = allFilterConditions.find(c => c.value === selectedFilterCondition.value)
  const vals = [...filterDropdownSelected.value]
  const label = buildFilterLabel(cat.label, cond.label, vals)
  if (editingFilterIndex.value !== null) {
    const f = predefinedFilters[editingFilterIndex.value]
    f.category = cat.value
    f.condition = selectedFilterCondition.value
    f.selectedValues = vals
    f.label = label
    f.value = `${cat.value}-${selectedFilterCondition.value}-${vals.join(',')}`
    editingFilterIndex.value = null
  } else {
    predefinedFilters.push({
      value: `${cat.value}-${selectedFilterCondition.value}-${vals.join(',')}`,
      label,
      category: cat.value,
      condition: selectedFilterCondition.value,
      selectedValues: vals,
    })
  }
  showAddFilterDropdown.value = false
}
const editFilter = (f, idx) => {
  editingFilterIndex.value = idx
  const cat = allFilterOptions.find(o => o.value === f.category)
  selectedFilterCategory.value = cat
  selectedFilterCondition.value = f.condition
  filterDropdownSelected.value = [...f.selectedValues]
  filterDropdownStep.value = 'values'
  filterDropdownSearch.value = ''
  showAddFilterDropdown.value = true
}
const removePredefinedFilter = (value) => {
  predefinedFilters.splice(predefinedFilters.findIndex(f => f.value === value), 1)
  if (activePredefinedFilter.value === value) activePredefinedFilter.value = null
  if (predefinedFilters.length === 0) activeSegmentName.value = 'All visitors'
}

// Saved segments
const savedSegments = ref([
  {
    id: 'seg-mobile-hu',
    name: 'Mobile visitors – Hungary',
    filters: [
      { value: 'device-is-Mobile', label: 'Device is Mobile', category: 'device', condition: 'is', selectedValues: ['Mobile'] },
      { value: 'country-is-Hungary', label: 'Country is Hungary', category: 'country', condition: 'is', selectedValues: ['Hungary'] },
    ],
  },
  {
    id: 'seg-returning-desktop',
    name: 'Returning desktop buyers',
    filters: [
      { value: 'device-is-Desktop', label: 'Device is Desktop', category: 'device', condition: 'is', selectedValues: ['Desktop'] },
      { value: 'visitor-type-is-Returning visitors', label: 'Visitor type is Returning visitors', category: 'visitor-type', condition: 'is', selectedValues: ['Returning visitors'] },
    ],
  },
])
const showSegmentsDropdown = ref(false)
const showSaveSegmentPopover = ref(false)
const newSegmentName = ref('')
const activeSegmentName = ref('All visitors')

const toggleSegmentsDropdown = () => {
  showSegmentsDropdown.value = !showSegmentsDropdown.value
  if (showSegmentsDropdown.value) {
    showAddFilterDropdown.value = false
    showSaveSegmentPopover.value = false
  }
}
const closeSegmentsDropdown = () => { showSegmentsDropdown.value = false }
const toggleSaveSegmentPopover = () => {
  showSaveSegmentPopover.value = !showSaveSegmentPopover.value
  if (showSaveSegmentPopover.value) {
    newSegmentName.value = ''
    showAddFilterDropdown.value = false
    showSegmentsDropdown.value = false
  }
}
const closeSaveSegmentPopover = () => {
  showSaveSegmentPopover.value = false
  newSegmentName.value = ''
}
const saveCurrentAsSegment = () => {
  const name = newSegmentName.value.trim()
  if (!name || predefinedFilters.length === 0) return
  savedSegments.value.push({
    id: `seg-${Date.now()}`,
    name,
    filters: predefinedFilters.map(f => ({ ...f, selectedValues: [...f.selectedValues] })),
  })
  activeSegmentName.value = name
  newSegmentName.value = ''
  showSaveSegmentPopover.value = false
}
const loadSegment = (seg) => {
  predefinedFilters.splice(0, predefinedFilters.length,
    ...seg.filters.map(f => ({ ...f, selectedValues: [...f.selectedValues] }))
  )
  activePredefinedFilter.value = null
  activeSegmentName.value = seg.name
  showSegmentsDropdown.value = false
}
const loadAllVisitors = () => {
  predefinedFilters.splice(0, predefinedFilters.length)
  activePredefinedFilter.value = null
  activeSegmentName.value = 'All visitors'
  showSegmentsDropdown.value = false
}
const deleteSegment = (id) => {
  const seg = savedSegments.value.find(s => s.id === id)
  const idx = savedSegments.value.findIndex(s => s.id === id)
  if (idx >= 0) savedSegments.value.splice(idx, 1)
  if (seg && activeSegmentName.value === seg.name) {
    activeSegmentName.value = 'All visitors'
    predefinedFilters.splice(0, predefinedFilters.length)
  }
}

// Trend chart
const analyticsTimePeriod = ref('Last 30 days')
const analyticsMetric = ref('impressions')
const analyticsTabs = [
  { id: 'impressions', title: 'Impressions', value: '1,456', change: '+12.4%', isPositive: true },
  { id: 'submits', title: 'Submits', value: '125', change: '+8.7%', isPositive: true },
  { id: 'submitRate', title: 'Submit rate', value: '8.37%', change: '+2.1%', isPositive: true },
]
const analyticsChartData = {
  impressions: [42, 58, 65, 51, 72, 88, 76, 82, 95, 71, 68, 84, 90, 102, 88, 95, 110, 98, 112, 105, 118, 94, 101, 115, 122, 108, 125, 132, 119, 128],
  submits: [3, 5, 4, 6, 5, 7, 6, 5, 8, 6, 5, 7, 8, 9, 7, 8, 10, 9, 11, 8, 10, 7, 9, 11, 12, 10, 13, 14, 11, 13],
  submitRate: [7.1, 8.6, 6.2, 11.8, 6.9, 8.0, 7.9, 6.1, 8.4, 8.5, 7.4, 8.3, 8.9, 8.8, 8.0, 8.4, 9.1, 9.2, 9.8, 7.6, 8.5, 7.4, 8.9, 9.6, 9.8, 9.3, 10.4, 10.6, 9.2, 10.2],
}
const analyticsChartDates = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 2, 25 - (29 - i))
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})
const analyticsChartSeries = computed(() => {
  const tab = analyticsTabs.find(t => t.id === analyticsMetric.value)
  return [{ name: tab.title, data: analyticsChartData[analyticsMetric.value] }]
})
const analyticsChartOptions = computed(() => ({
  chart: { type: 'area', height: 280, toolbar: { show: false }, zoom: { enabled: false } },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2, colors: ['#ed5a29'] },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] }, colors: ['#ed5a29'] },
  grid: { borderColor: '#f1f2f4', strokeDashArray: 0, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
  xaxis: {
    type: 'category',
    categories: analyticsChartDates.map((d, i) => i % 3 === 0 ? d : ''),
    labels: { show: true, rotate: -45, rotateAlways: false, hideOverlappingLabels: true, style: { colors: '#9ba2ad', fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: {
    labels: {
      formatter: (v) => analyticsMetric.value === 'submitRate' ? v.toFixed(1) + '%' : Math.round(v).toLocaleString(),
      style: { colors: '#9ba2ad', fontSize: '12px' },
    },
  },
  tooltip: {
    enabled: true,
    custom: function ({ series, seriesIndex, dataPointIndex }) {
      const value = series[seriesIndex][dataPointIndex]
      const date = analyticsChartDates[dataPointIndex]
      const tab = analyticsTabs.find(t => t.id === analyticsMetric.value)
      const fmt = analyticsMetric.value === 'submitRate' ? value.toFixed(2) + '%' : Math.round(value).toLocaleString()
      return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="color: #9ba2ad; font-weight: 400; font-size: 11px; margin-bottom: 4px;">${date}, 2026</div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #ed5a29; border-radius: 50%; display: inline-block;"></span>
          <span style="color: #505763; font-weight: 500;">${tab.title}: ${fmt}</span>
        </div>
      </div>`
    },
  },
  markers: { size: 0, hover: { size: 5 } },
}))

// Funnel
const funnelSteps = [
  { id: 'mainpage', name: 'Mainpage', impressions: 1456 },
  { id: 'email', name: 'Email', impressions: 612 },
  { id: 'phone', name: 'Phone', impressions: 248 },
  { id: 'thank-you', name: 'Thank You page', impressions: 125 },
]
const funnelShare = (step) => {
  const max = funnelSteps[0].impressions || 1
  return ((step.impressions / max) * 100).toFixed(1)
}
const funnelDropOff = (idx) => {
  const prev = funnelSteps[idx - 1]?.impressions
  const curr = funnelSteps[idx]?.impressions
  if (!prev) return '0.0'
  return (((prev - curr) / prev) * 100).toFixed(1)
}

// Insights
const analyticsInsights = [
  { id: 1, name: 'Mobile drop-off at checkout', description: 'Mobile submit rate (7.44%) lags desktop by 19.6% — recovering the gap could add ~10 submits / month.', value: '+$1,200/month', level: 'high' },
  { id: 2, name: 'Returning visitors over-index', description: 'Returning visitors convert 33% better than new ones — consider a dedicated segment for retargeting.', value: '+$820/month', level: 'medium' },
  { id: 3, name: 'Campaign missing on /products', description: '/products drives 134 impressions but sees a 4.48% submit rate — tune the trigger or re-test placement.', value: '+$540/month', level: 'medium' },
]

// Devices
const analyticsDevices = [
  { type: 'Desktop', impressions: 842, submits: 78, submitRate: '9.26%', share: 62.0 },
  { type: 'Mobile', impressions: 524, submits: 39, submitRate: '7.44%', share: 38.0 },
]
const devicesChartSeries = [{ name: 'Submits', data: analyticsDevices.map(d => d.submits) }]
const devicesChartOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: { bar: { borderRadius: 6, barHeight: '60%', distributed: true, horizontal: true } },
  colors: ['#FF6A45', '#FF9E89', '#FFD2C4'],
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: analyticsDevices.map(d => d.type),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#9CA3AF', fontSize: '12px' }, formatter: (val) => val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val },
  },
  yaxis: { labels: { show: true, style: { colors: '#6B7280', fontSize: '13px' } } },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4, yaxis: { lines: { show: false } } },
  tooltip: {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const value = series[seriesIndex][dataPointIndex]
      const label = w.globals.labels[dataPointIndex]
      return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #ed5a29; border-radius: 50%; display: inline-block;"></span>
          <span style="color: #505763; font-weight: 500;">${label}: ${value.toLocaleString()}</span>
        </div>
      </div>`
    },
  },
}

// Visitor types
const analyticsVisitorTypes = [
  { type: 'New visitors', impressions: 1012, submits: 79, submitRate: '7.81%', share: 69.5 },
  { type: 'Returning visitors', impressions: 444, submits: 46, submitRate: '10.36%', share: 30.5 },
]
const visitorTypesChartSeries = [{ name: 'Submits', data: analyticsVisitorTypes.map(v => v.submits) }]
const visitorTypesChartOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  plotOptions: { bar: { borderRadius: 6, barHeight: '60%', distributed: true, horizontal: true } },
  colors: ['#FF6A45', '#FF9E89'],
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: ['New', 'Returning'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#9CA3AF', fontSize: '12px' }, formatter: (val) => val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val },
  },
  yaxis: { labels: { show: true, style: { colors: '#6B7280', fontSize: '13px' } } },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4, yaxis: { lines: { show: false } } },
  tooltip: {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const value = series[seriesIndex][dataPointIndex]
      const label = w.globals.labels[dataPointIndex]
      return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: #ed5a29; border-radius: 50%; display: inline-block;"></span>
          <span style="color: #505763; font-weight: 500;">${label}: ${value.toLocaleString()}</span>
        </div>
      </div>`
    },
  },
}

// Countries
const analyticsCountries = [
  { name: 'United States', impressions: 624, submits: 58, submitRate: '9.29%', share: 42.9 },
  { name: 'United Kingdom', impressions: 285, submits: 24, submitRate: '8.42%', share: 19.6 },
  { name: 'Germany', impressions: 198, submits: 16, submitRate: '8.08%', share: 13.6 },
  { name: 'Canada', impressions: 142, submits: 12, submitRate: '8.45%', share: 9.8 },
  { name: 'Australia', impressions: 98, submits: 8, submitRate: '8.16%', share: 6.7 },
]
const countryCodeMap = {
  'United States': 'US', 'United Kingdom': 'GB', 'Germany': 'DE', 'Canada': 'CA', 'Australia': 'AU',
  'Hungary': 'HU', 'France': 'FR', 'Austria': 'AT', 'Romania': 'RO', 'Slovakia': 'SK',
  'Netherlands': 'NL', 'Sweden': 'SE',
}
const getFlagUrl = (country) => {
  const code = countryCodeMap[country]
  return code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : null
}

// Visited pages
const analyticsPages = [
  { url: '/cart', impressions: 586, submits: 61, submitRate: '10.41%', share: 40.2 },
  { url: '/checkout', impressions: 412, submits: 38, submitRate: '9.22%', share: 28.3 },
  { url: '/products/bestsellers', impressions: 248, submits: 17, submitRate: '6.85%', share: 17.0 },
  { url: '/products', impressions: 134, submits: 6, submitRate: '4.48%', share: 9.2 },
  { url: '/collections/new', impressions: 76, submits: 3, submitRate: '3.95%', share: 5.2 },
]

// Landing pages
const analyticsLandingPages = [
  { url: '/', impressions: 489, submits: 51, submitRate: '10.43%' },
  { url: '/products/sale', impressions: 387, submits: 36, submitRate: '9.30%' },
  { url: '/summer-collection', impressions: 218, submits: 16, submitRate: '7.34%' },
  { url: '/blog/new-arrivals', impressions: 142, submits: 11, submitRate: '7.75%' },
  { url: '/products/bestsellers', impressions: 89, submits: 6, submitRate: '6.74%' },
]

// Traffic sources + donut
const analyticsTrafficSources = [
  { source: 'Organic Search', impressions: 487, submits: 41, submitRate: '8.42%' },
  { source: 'Direct', impressions: 412, submits: 38, submitRate: '9.22%' },
  { source: 'Paid Search', impressions: 286, submits: 24, submitRate: '8.39%' },
  { source: 'Social', impressions: 198, submits: 14, submitRate: '7.07%' },
  { source: 'Email', impressions: 73, submits: 8, submitRate: '10.96%' },
]
const trafficPieColors = ['#FF6A45', '#FF8A6A', '#FFA48E', '#FFBFB2', '#FFD9D4']
const trafficPieLabels = analyticsTrafficSources.map(t => t.source)
const trafficPieSeries = analyticsTrafficSources.map(t => t.submits)
const trafficSourceColorIndex = Object.fromEntries(analyticsTrafficSources.map((t, i) => [t.source, i]))
const hoveredTrafficSource = ref(null)
const hoveredTrafficChartIndex = computed(() =>
  hoveredTrafficSource.value !== null ? (trafficSourceColorIndex[hoveredTrafficSource.value] ?? null) : null
)
const trafficPieOptions = computed(() => ({
  chart: { type: 'donut', toolbar: { show: false }, fontFamily: 'inherit', animations: { dynamicAnimation: { enabled: false } } },
  labels: trafficPieLabels,
  colors: hoveredTrafficChartIndex.value !== null
    ? trafficPieColors.map((c, i) => i === hoveredTrafficChartIndex.value ? c : c + '30')
    : trafficPieColors,
  dataLabels: { enabled: false },
  legend: { show: false },
  stroke: { width: 2, colors: ['#fff'] },
  tooltip: {
    custom: ({ series, seriesIndex, w }) => {
      const value = series[seriesIndex]
      const label = w.globals.labels[seriesIndex]
      return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: ${w.globals.colors[seriesIndex]}; border-radius: 50%; display: inline-block;"></span>
          <span style="color: #505763; font-weight: 500;">${label}: ${value.toLocaleString()}</span>
        </div>
      </div>`
    },
  },
}))

// Other tables
const analyticsReferringSites = [
  { site: 'google.com', impressions: 387, submits: 41, submitRate: '10.59%' },
  { site: 'facebook.com', impressions: 198, submits: 14, submitRate: '7.07%' },
  { site: 'newsletter.example.com', impressions: 86, submits: 8, submitRate: '9.30%' },
  { site: 't.co', impressions: 42, submits: 3, submitRate: '7.14%' },
  { site: 'bing.com', impressions: 28, submits: 2, submitRate: '7.14%' },
]
const analyticsBrowserLanguages = [
  { code: 'en-US', impressions: 612, submits: 56, submitRate: '9.15%' },
  { code: 'en-GB', impressions: 234, submits: 21, submitRate: '8.97%' },
  { code: 'de-DE', impressions: 187, submits: 15, submitRate: '8.02%' },
  { code: 'fr-FR', impressions: 142, submits: 11, submitRate: '7.75%' },
  { code: 'es-ES', impressions: 89, submits: 7, submitRate: '7.87%' },
]
const analyticsOperatingSystems = [
  { name: 'Windows', impressions: 524, submits: 48, submitRate: '9.16%' },
  { name: 'macOS', impressions: 318, submits: 31, submitRate: '9.75%' },
  { name: 'iOS', impressions: 287, submits: 26, submitRate: '9.06%' },
  { name: 'Android', impressions: 247, submits: 14, submitRate: '5.67%' },
  { name: 'Linux', impressions: 38, submits: 3, submitRate: '7.89%' },
]
const analyticsUtmCampaigns = [
  { name: 'spring_sale_2026', impressions: 287, submits: 28, submitRate: '9.76%' },
  { name: 'email_welcome_series', impressions: 198, submits: 21, submitRate: '10.61%' },
  { name: 'facebook_retargeting', impressions: 142, submits: 11, submitRate: '7.75%' },
  { name: 'google_brand', impressions: 124, submits: 12, submitRate: '9.68%' },
  { name: 'newsletter_jan', impressions: 89, submits: 9, submitRate: '10.11%' },
]
const analyticsUtmSources = [
  { name: 'google', impressions: 412, submits: 41, submitRate: '9.95%' },
  { name: 'facebook', impressions: 198, submits: 14, submitRate: '7.07%' },
  { name: 'newsletter', impressions: 142, submits: 14, submitRate: '9.86%' },
  { name: 'email', impressions: 86, submits: 8, submitRate: '9.30%' },
  { name: 'direct', impressions: 76, submits: 6, submitRate: '7.89%' },
]
</script>
