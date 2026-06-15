<template>
  <div>
  <DashboardLayout active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-2">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <EditableTitle v-model="campaignName" />
            <p class="text-xs text-om-gray-400">www.mydomain.com</p>
          </div>
          <div class="flex items-center gap-2.5">
            <!-- Schedule Info Block (shown when schedule is saved) -->
            <div v-if="scheduleSaved" class="flex items-center gap-3 pl-4 pr-2 py-2 rounded-lg bg-[#D6F5EC]">
              <button @click="isScheduleModalOpen = true" class="text-om-gray-700 hover:text-om-gray-600 transition-colors cursor-pointer">
                <Calendar :size="18" />
              </button>
              <div class="flex items-center gap-3 text-sm text-om-gray-700">
                <span>Start date: <span class="font-semibold">{{ formattedStartDate }}</span></span>
                <span class="text-om-gray-400">|</span>
                <span>End date: <span class="font-semibold">{{ formattedEndDate }}</span></span>
                <span class="text-om-gray-400">|</span>
                <span>Currently active</span>
              </div>
              <ToggleSwitch v-model="isActive" disabled />
            </div>

            <!-- Original Buttons (shown when schedule is not saved) -->
            <template v-else>
              <Button variant="ghost" size="sm" icon-only @click="isScheduleModalOpen = true"><template #icon><Calendar :size="18" /></template></Button>
              <button :class="['pl-3.5 pr-2 pt-2 pb-1.5 rounded-lg flex items-center gap-2.5 text-sm font-medium cursor-pointer text-om-gray-700', isActive ? 'bg-[#D6F5EC]' : 'bg-om-gray-100']">
                <span>{{ isActive ? 'Active' : 'Inactive' }}</span>
                <ToggleSwitch v-model="isActive" @click.stop />
              </button>
            </template>

            <!-- Kebab Menu -->
            <div class="relative">
              <Button variant="ghost" size="sm" icon-only @click="isKebabMenuOpen = !isKebabMenuOpen"><template #icon><MoreVertical :size="18" /></template></Button>

              <!-- Dropdown Menu -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isKebabMenuOpen"
                  class="absolute right-0 mt-2 z-10 bg-white border border-om-gray-200 rounded-lg shadow-lg min-w-[180px]"
                >
                  <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="handleRename">Rename</button>
                  <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="handleDuplicate">Duplicate</button>
                  <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="handleEditSchedule">Edit schedule</button>
                  <!-- Set priority submenu -->
                  <div class="relative" @mouseenter="isPriorityOpen = true" @mouseleave="isPriorityOpen = false">
                    <button :class="['w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer flex items-center justify-between', isPriorityOpen ? 'bg-om-gray-100' : '']">
                      Set priority
                      <ChevronRight :size="14" class="text-om-gray-400" />
                    </button>
                    <div
                      v-if="isPriorityOpen"
                      class="absolute right-full top-0 -mr-px z-30 bg-white border border-om-gray-200 rounded-lg shadow-lg min-w-[150px]"
                    >
                      <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer flex items-center gap-2" @click="handleSetPriority('high')">
                        <ChevronsUp :size="14" class="text-om-orange-500" /> High
                      </button>
                      <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer flex items-center gap-2" @click="handleSetPriority('normal')">
                        <Minus :size="14" class="text-om-gray-400" /> Normal <Check :size="14" class="text-om-gray-500 ml-auto" />
                      </button>
                      <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer flex items-center gap-2" @click="handleSetPriority('low')">
                        <ChevronsDown :size="14" class="text-blue-500" /> Low
                      </button>
                    </div>
                  </div>
                  <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="handleShare">Share</button>
                  <div class="border-t border-om-gray-100 my-1"></div>
                  <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="handleArchive">Archive</button>
                  <button class="w-full text-left text-sm text-om-gray-700 px-4 py-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="handleDelete">Delete</button>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6">
          <button
            @click="activeTab = 'Overview'"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-normal transition-all cursor-pointer',
              activeTab === 'Overview'
                ? 'bg-om-orange-100 text-om-orange-500'
                : 'bg-transparent text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600'
            ]"
          >
            Overview
          </button>
          <button
            @click="activeTab = 'Settings'"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-normal transition-all cursor-pointer',
              activeTab === 'Settings'
                ? 'bg-om-orange-100 text-om-orange-500'
                : 'bg-transparent text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600'
            ]"
          >
            Settings
          </button>
          <button
            @click="activeTab = 'Submits'"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-normal transition-all cursor-pointer',
              activeTab === 'Submits'
                ? 'bg-om-orange-100 text-om-orange-500'
                : 'bg-transparent text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600'
            ]"
          >
            Submits
          </button>
          <button
            @click="activeTab = 'Analytics'"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-normal transition-all cursor-pointer',
              activeTab === 'Analytics'
                ? 'bg-om-orange-100 text-om-orange-500'
                : 'bg-transparent text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600'
            ]"
          >
            Analytics
          </button>
        </div>

        <!-- Overview Tab Content -->
        <div v-if="activeTab === 'Overview'">
        <!-- Metrics Section -->
        <div class="bg-om-gray-100 rounded-xl mb-6 relative">
          <div class="grid grid-cols-[minmax(0,8fr)_minmax(0,13fr)_minmax(0,3fr)] gap-4">
          <!-- Conversion Uplift -->
          <div class="pl-8 py-8">
            <div class="text-base text-om-gray-600 mb-3">Conversion uplift</div>
            <div class="flex items-end gap-2">
              <span class="text-[3rem] font-light text-om-gray-700 leading-none font-['Funnel_Sans']">+18.52%</span>
              <TrendingUp :size="24" class="text-[#2CC896]" />
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="py-8 relative pl-1 pr-24">
            <div class="w-px bg-om-gray-200 absolute inset-y-6 -left-5"></div>
            <div class="text-base text-om-gray-600 mb-4">Key metrics</div>
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">{{ currentKpis.label1 }}</div>
                <div class="text-xl font-semibold text-om-gray-700">{{ currentKpis.value1 }}</div>
              </div>
              <svg width="12" height="44" viewBox="0 0 12 44" fill="none" class="text-om-gray-300">
                <path d="M2 4L10 22L2 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">{{ currentKpis.label2 }}</div>
                <div class="text-xl font-semibold text-om-gray-700">{{ currentKpis.value2 }}</div>
              </div>
              <svg width="12" height="44" viewBox="0 0 12 44" fill="none" class="text-om-gray-300">
                <path d="M2 4L10 22L2 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">{{ currentKpis.label3 }}</div>
                <div class="text-xl font-semibold text-om-gray-700">{{ currentKpis.value3 }}</div>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex flex-col items-end justify-end gap-2.5 pr-8 py-8">
            <!-- Time Period Dropdown -->
            <div style="width: 208px">
              <Dropdown key="time-period" v-model="selectedTimePeriod" :options="timePeriodOptions">
                <template #icon>
                  <Calendar :size="18" class="text-om-gray-400" />
                </template>
              </Dropdown>
            </div>

            <!-- Goal Dropdown -->
            <div style="width: 208px">
              <Dropdown key="goal" v-model="selectedGoal" :options="goalOptions">
                <template #icon>
                  <Target :size="18" class="text-om-gray-400" />
                </template>
              </Dropdown>
            </div>
          </div>
        </div>
        </div>

        <!-- A/B Test Status Banner -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 px-8 py-4">
          <div class="flex items-center justify-between gap-6 flex-wrap">
            <!-- Left: status + winner -->
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-[#D6F5EC] flex items-center justify-center shrink-0">
                <FlaskConical :size="20" class="text-[#10B981]" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-om-gray-700">A/B test running</span>
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                  </span>
                </div>
                <div class="text-sm text-om-gray-500 mt-0.5">
                  <span class="font-medium text-om-gray-700">AI Variant</span>
                  is leading by <span class="font-semibold text-[#10B981]">+18.52%</span>
                  (77.6% chance to win)
                </div>
              </div>
            </div>

            <!-- Right: Declare winner button -->
            <Button variant="ghost" size="sm" @click="openSettingsAccordion('abTest')">
              <template #icon><Zap :size="14" /></template>
              Declare winner at {{ autoStopThreshold }}%
            </Button>
          </div>
        </div>

        <!-- Variants Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 pt-5 pb-5 pl-5 pr-8">
          <!-- Variants Table -->
          <div class="space-y-0">
            <!-- Header -->
            <div class="grid grid-cols-[56px_1fr_60px_80px_80px_80px_100px_100px_36px] gap-3 text-xs text-om-gray-500 font-medium pb-3 border-b border-om-gray-100">
              <div class="pl-3">Traffic</div>
              <div>Variants</div>
              <div>Active</div>
              <div class="text-right">{{ currentKpis.h1 }}</div>
              <div class="text-right">{{ currentKpis.h2 }}</div>
              <div class="text-right">{{ currentKpis.h3 }}</div>
              <div class="text-right">Uplift</div>
              <div class="text-right">Chance to win</div>
              <div></div>
            </div>

            <!-- Variant Row 1 -->
            <div class="grid grid-cols-[56px_1fr_60px_80px_80px_80px_100px_100px_36px] gap-3 items-center py-3 border-b border-om-gray-100 group cursor-pointer" @click="emit('navigate', 'editor')">
              <div @click.stop>
                <Button variant="ghost" size="sm" @click="openSettingsAccordion('abTest')">{{ variant1Traffic }}%</Button>
              </div>
              <div class="flex items-center gap-2.5">
                <div
                  class="w-36 h-24 bg-om-gray-100 rounded overflow-hidden shrink-0 border border-om-gray-200 relative"
                  @mouseenter="handleThumbEnter($event, 'variant1')"
                  @mouseleave="handleThumbLeave()"
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
              <div @click.stop>
                <ToggleSwitch v-model="variant1Active" />
              </div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ currentKpis.variant1.v1 }}</div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ currentKpis.variant1.v2 }}</div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ currentKpis.variant1.v3 }}</div>
              <div class="text-base font-semibold text-om-gray-400 text-right">-</div>
              <div class="text-base font-semibold text-om-gray-400 text-right">-</div>
              <!-- Kebab Menu -->
              <div class="flex items-center justify-end">
                <Button variant="ghost" size="sm" icon-only class="opacity-0 group-hover:opacity-100 transition-opacity"><template #icon><MoreVertical :size="20" /></template></Button>
              </div>
            </div>

            <!-- Variant Row 2 -->
            <div class="grid grid-cols-[56px_1fr_60px_80px_80px_80px_100px_100px_36px] gap-3 items-center py-3 group cursor-pointer" @click="emit('navigate', 'editor')">
              <div @click.stop>
                <Button variant="ghost" size="sm" @click="openSettingsAccordion('abTest')">{{ variant2Traffic }}%</Button>
              </div>
              <div class="flex items-center gap-2.5">
                <div
                  class="w-36 h-24 bg-om-gray-100 rounded overflow-hidden shrink-0 border border-om-gray-200 relative"
                  @mouseenter="handleThumbEnter($event, 'variant2')"
                  @mouseleave="handleThumbLeave()"
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
              <div @click.stop>
                <ToggleSwitch v-model="variant2Active" />
              </div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ currentKpis.variant2.v1 }}</div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ currentKpis.variant2.v2 }}</div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ currentKpis.variant2.v3 }}</div>
              <div class="text-base font-semibold text-[#10B981] flex items-center gap-1 justify-end">
                +18.52%
                <TrendingUp :size="16" class="text-[#2CC896]" />
              </div>
              <div class="text-base font-semibold text-om-gray-400 text-right">77.6%</div>
              <!-- Kebab Menu -->
              <div class="flex items-center justify-end">
                <Button variant="ghost" size="sm" icon-only class="opacity-0 group-hover:opacity-100 transition-opacity"><template #icon><MoreVertical :size="20" /></template></Button>
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

        <!-- Insights teaser (action-oriented top insight) -->
        <div
          v-for="opp in abTestInsights.slice(0, 1)"
          :key="`b-${opp.id}`"
          class="group bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] py-6 px-6 mb-6"
        >
          <div class="flex items-center justify-between gap-3 mb-5">
            <div class="text-[0.6875rem] font-semibold uppercase tracking-wider text-om-gray-500">Top insight for this campaign</div>
            <div class="inline-flex items-center gap-1.5 text-xs font-medium text-om-gray-600 bg-om-gray-100 px-2.5 py-1 rounded-full whitespace-nowrap">
              <Calendar :size="12" />
              Reporting period: May 1 – May 31, 2026
            </div>
          </div>
          <div class="flex items-start gap-8">
            <div class="flex-1 min-w-0 flex items-start gap-4">
              <div class="w-11 h-11 rounded-lg bg-[#FFF0EB] text-[#C94B14] flex items-center justify-center shrink-0">
                <component :is="insightIcons[opp.id] || Sparkles" :size="22" />
              </div>
              <div class="flex-1 min-w-0 flex flex-col gap-0.5">
                <div class="text-[1rem] font-semibold text-om-gray-700 leading-snug">{{ opp.name }}</div>
                <div class="text-[0.8125rem] text-om-gray-500 leading-snug">{{ opp.description }}</div>
              </div>
            </div>
            <div class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="md" @click="emit('navigate-to-opportunity', opp.id)">
                Show more
              </Button>
            </div>
          </div>
        </div>

        <!-- Campaign Settings Sections -->
        <div class="space-y-4">
          <!-- Settings summary heading -->
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-om-gray-700">Settings summary</h2>
            <Button variant="secondary" size="sm" @click="activeTab = 'Settings'">Edit settings</Button>
          </div>

          <!-- When will the popup show up -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5 cursor-pointer hover:shadow-[0_2px_8px_2px_rgb(0_0_0/0.07)] transition-shadow" @click="openSettingsAccordion('showUp')">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">When will the popup show up</h3>
            <div class="trigger-timeline summary-timeline">
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <LogOut :size="22" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">On exit-intent</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">When a visitor is about to leave your site</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Clock :size="22" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">After 20s inactivity</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">When a visitor is inactive for <span class="font-semibold text-om-gray-800">20 seconds</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- How often can it appear -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5 cursor-pointer hover:shadow-[0_2px_8px_2px_rgb(0_0_0/0.07)] transition-shadow" @click="openSettingsAccordion('howMany')">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">How often can it appear</h3>
            <div class="grid grid-cols-3 gap-10 w-3/4 items-center">
              <div class="trigger-timeline summary-timeline">
                <div class="trigger-timeline-item">
                  <div class="trigger-card">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                        <RefreshCw :size="22" class="text-white" />
                      </div>
                      <div class="flex-1">
                        <div class="text-sm font-semibold text-om-gray-700">How many times</div>
                        <div class="text-sm text-om-gray-500 mt-0.5">Maximum <span class="font-semibold text-om-gray-800">2 times</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="text-sm font-semibold text-om-gray-700">How frequently</div>
                <div class="text-sm text-om-gray-500 mt-0.5">Min <span class="font-semibold text-om-gray-800">1 hour(s)</span> between two impressions</div>
              </div>
              <div>
                <div class="text-sm font-semibold text-om-gray-700">Stop showing</div>
                <div class="text-sm text-om-gray-500 mt-0.5">After a visitor has converted in this campaign</div>
              </div>
            </div>
          </div>

          <!-- Who should see the popup -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5 cursor-pointer hover:shadow-[0_2px_8px_2px_rgb(0_0_0/0.07)] transition-shadow" @click="openSettingsAccordion('whoSee')">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">Who should see the popup</h3>
            <div class="trigger-timeline summary-timeline">
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Timer :size="22" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">Spent on pages</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">The popup will appear to visitors who spent a minimum of <span class="font-semibold text-om-gray-800">10 seconds</span> on the current subpage</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Globe :size="22" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">Current page / URL</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">URL or its subpaths contains <span class="font-semibold text-om-gray-800">cart</span>, <span class="font-semibold text-om-gray-800">shop_cart</span>, <span class="font-semibold text-om-gray-800">shop_reg</span>, or <span class="font-semibold text-om-gray-800">shop_category</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Integrations -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5 cursor-pointer hover:shadow-[0_2px_8px_2px_rgb(0_0_0/0.07)] transition-shadow" @click="openSettingsAccordion('sendData')">
            <h3 class="text-base font-semibold text-om-gray-700 mb-4">Integrations</h3>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#FFE01B] rounded-xl flex items-center justify-center shrink-0">
                <img src="/icons/mailchimp.svg" alt="Mailchimp" class="w-6 h-6" />
              </div>
              <span class="text-sm font-medium text-om-gray-700">Mailchimp</span>
            </div>
          </div>
        </div>
        </div>

        <!-- Submits Tab Content -->
        <div v-if="activeTab === 'Submits'">
          <!-- Filters and Controls -->
          <div class="flex items-center justify-between mb-4 gap-3">
            <div class="flex items-center gap-3">
              <!-- Search input -->
              <div class="relative">
                <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-400 pointer-events-none" />
                <input
                  v-model="submitsSearch"
                  type="text"
                  placeholder="Search submits..."
                  class="pl-9 pr-3 h-10 text-sm border border-om-gray-200 rounded-lg bg-white text-om-gray-700 placeholder-om-gray-400 focus:outline-none focus:border-om-gray-300 w-[240px]"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Sort -->
              <div class="relative">
                <Button variant="ghost" size="md" icon-only :class="submitsSortOpen ? '!bg-[#505763]/10' : ''" @click="submitsSortOpen = !submitsSortOpen">
                  <template #icon><ArrowUpDown :size="18" /></template>
                </Button>
                <div v-if="submitsSortOpen" class="fixed inset-0 z-10" @click="submitsSortOpen = false" />
                <div
                  v-if="submitsSortOpen"
                  class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[200px]"
                >
                  <button
                    v-for="opt in submitsSortOptions"
                    :key="opt.value"
                    @click="submitsSortBy = opt.value; submitsSortOpen = false"
                    class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                    :class="submitsSortBy === opt.value ? 'bg-[#F1F2F4] font-medium' : ''"
                  >
                    {{ opt.label }}
                    <Check v-if="submitsSortBy === opt.value" :size="16" class="text-om-gray-500 shrink-0" />
                  </button>
                </div>
              </div>

              <!-- Columns toggle -->
              <div class="relative">
                <Button variant="ghost" size="md" icon-only :class="submitsColumnsOpen ? '!bg-[#505763]/10' : ''" @click="submitsColumnsOpen = !submitsColumnsOpen">
                  <template #icon><Columns3 :size="18" /></template>
                </Button>
                <div v-if="submitsColumnsOpen" class="fixed inset-0 z-10" @click="submitsColumnsOpen = false" />
                <div
                  v-if="submitsColumnsOpen"
                  class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[200px] py-1"
                >
                  <button
                    v-for="col in submitsColumns"
                    :key="col.key"
                    @click="col.visible = !col.visible"
                    class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                  >
                    {{ col.label }}
                    <Check v-if="col.visible" :size="16" class="text-om-gray-500 shrink-0" />
                  </button>
                </div>
              </div>

              <!-- Date filter -->
              <Dropdown
                v-model="submitsTimeFilter"
                :options="submitsTimeFilterOptions"
                style="width: 200px; min-width: 200px"
              >
                <template #icon>
                  <Calendar :size="20" class="text-om-gray-600" />
                </template>
              </Dropdown>

              <!-- Export -->
              <Button variant="primary" size="md" @click="handleSubmitsExport">Export</Button>
            </div>
          </div>

          <!-- Submits Table -->
          <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 text-[13px] font-medium text-om-gray-500">
                    <th class="text-left px-5 py-3 whitespace-nowrap font-medium" style="width: 280px">Email</th>
                    <th v-if="isSubmitColumnVisible('name')" class="text-left px-4 py-3 whitespace-nowrap font-medium" style="width: 200px">Name</th>
                    <th v-if="isSubmitColumnVisible('status')" class="text-left px-4 py-3 whitespace-nowrap font-medium" style="width: 110px">Status</th>
                    <th v-if="isSubmitColumnVisible('date')" class="text-left px-4 py-3 whitespace-nowrap font-medium" style="width: 140px">Date</th>
                    <th v-if="isSubmitColumnVisible('phone')" class="text-left px-4 py-3 whitespace-nowrap font-medium" style="width: 160px">Phone</th>
                    <th v-if="isSubmitColumnVisible('country')" class="text-left px-4 py-3 whitespace-nowrap font-medium" style="width: 150px">Country</th>
                    <th v-if="isSubmitColumnVisible('source')" class="text-left px-4 py-3 whitespace-nowrap font-medium" style="width: 120px">Source</th>
                    <th v-if="isSubmitColumnVisible('couponCode')" class="text-left px-4 py-3 whitespace-nowrap font-medium" style="width: 160px">Coupon code</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="s in filteredSubmits"
                    :key="s.id"
                    class="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <td class="px-5 py-3">
                      <p class="text-sm text-om-gray-600 truncate">{{ s.email }}</p>
                    </td>
                    <td v-if="isSubmitColumnVisible('name')" class="px-4 py-3">
                      <p class="text-sm font-medium text-om-gray-700 truncate">{{ s.name }}</p>
                    </td>
                    <td v-if="isSubmitColumnVisible('status')" class="px-4 py-3">
                      <Tag :variant="s.status === 'Completed' ? 'green' : s.status === 'Failed' ? 'orange' : 'gray'">
                        {{ s.status }}
                      </Tag>
                    </td>
                    <td v-if="isSubmitColumnVisible('date')" class="px-4 py-3 whitespace-nowrap">
                      <p class="text-sm text-om-gray-600">{{ s.dateFormatted }}</p>
                      <p class="text-xs text-om-gray-400">{{ s.timeFormatted }}</p>
                    </td>
                    <td v-if="isSubmitColumnVisible('phone')" class="px-4 py-3">
                      <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ s.phone }}</p>
                    </td>
                    <td v-if="isSubmitColumnVisible('country')" class="px-4 py-3">
                      <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ s.country }}</p>
                    </td>
                    <td v-if="isSubmitColumnVisible('source')" class="px-4 py-3">
                      <p class="text-sm text-om-gray-600 whitespace-nowrap">{{ s.source }}</p>
                    </td>
                    <td v-if="isSubmitColumnVisible('couponCode')" class="px-4 py-3">
                      <p class="text-sm text-om-gray-600 whitespace-nowrap font-mono">{{ s.couponCode }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Analytics Tab Content -->
        <CampaignAnalyticsTab
          v-if="activeTab === 'Analytics'"
          :hide-insights="true"
          @navigate-to-opportunity="emit('navigate-to-opportunity', $event)"
          @navigate-to-opportunities="emit('navigate-to-opportunities')"
        >
          <template #funnel>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5">
              <div class="px-8 mb-1">
                <h2 class="text-xl font-semibold text-om-gray-700">Funnel breakdown</h2>
              </div>
              <div class="text-[13px] text-om-gray-500 mb-5 px-8">Impressions of each page in this popup, with drop-off between steps. Compared across A/B variants.</div>
              <div class="flex flex-col gap-6">
                <div v-for="variant in abFunnelVariants" :key="variant.id" class="flex flex-col gap-3">
                  <div class="px-8 flex items-center gap-2">
                    <span class="text-sm font-medium text-om-gray-700">{{ variant.name }}</span>
                    <span class="text-[12px] text-om-gray-500 tabular-nums">{{ variant.traffic }}% traffic</span>
                    <span
                      v-if="variant.uplift"
                      class="inline-flex items-center gap-1 text-[12px] font-semibold text-[#10B981] tabular-nums"
                    >
                      {{ variant.uplift }}
                      <TrendingUp :size="12" class="text-[#2CC896]" />
                    </span>
                  </div>
                  <div class="px-5 flex items-stretch gap-0">
                    <template v-for="(step, idx) in variant.steps" :key="step.id">
                      <div class="flex-1 rounded-xl border border-om-gray-200 px-4 py-2.5 flex flex-col gap-1 min-w-0">
                        <div class="text-[13px] font-medium text-om-gray-500 truncate">{{ step.name }}</div>
                        <div class="text-base font-semibold text-om-gray-700 tabular-nums">{{ step.impressions.toLocaleString() }}</div>
                        <div class="h-1.5 rounded-full bg-om-gray-100 overflow-hidden">
                          <div class="h-full rounded-full" :style="{ width: variantStepShare(variant, step) + '%', background: variant.color }"></div>
                        </div>
                      </div>
                      <div
                        v-if="idx < variant.steps.length - 1"
                        class="flex flex-col items-center justify-center px-3 shrink-0"
                      >
                        <ArrowRight :size="32" class="text-om-gray-300" />
                        <div class="text-sm font-semibold text-om-gray-500 tabular-nums mt-1.5 whitespace-nowrap">-{{ variantStepDropOff(variant, idx + 1) }}%</div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- A/B Test Results + Insights stacked -->
            <div class="flex flex-col gap-6">
              <!-- A/B Test Results — Version 1: comparison table -->
              <div v-if="props.abTestVersion === 'comparison'" class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 min-w-0">
                <div class="px-8 mb-5">
                  <h2 class="text-xl font-semibold text-om-gray-700">A/B Test Results</h2>
                </div>

                <!-- Comparison table -->
                <div class="px-8">
                  <div class="grid grid-cols-[1fr_220px_220px] gap-10 pb-4 border-b border-om-gray-200">
                    <div class="text-sm text-om-gray-700 leading-relaxed pr-36">
                      Estimated more than <strong class="font-semibold">{{ abTestProgressNeeded }} submits</strong> needed to reach statistically significant 95% win chance.
                      <span class="text-om-gray-500">&gt;45 days left (based on your current traffic)</span>
                    </div>
                    <div class="flex flex-col items-start gap-1.5">
                      <span class="text-[13px] font-semibold text-om-gray-600 whitespace-nowrap">Klaviyo Popup</span>
                      <div class="text-2xl font-semibold text-om-gray-400 tabular-nums">-</div>
                    </div>
                    <div class="flex flex-col items-start gap-1.5">
                      <span class="text-[13px] font-semibold text-om-gray-600 whitespace-nowrap">AI Variant</span>
                      <div class="flex items-baseline gap-1.5">
                        <span class="text-2xl font-semibold text-[#239E77] tabular-nums">{{ abTestProbB }}%</span>
                        <span class="text-[11px] text-om-gray-400 whitespace-nowrap">chance to win</span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-for="metric in abTestMetrics"
                    :key="metric.id"
                    class="grid grid-cols-[1fr_220px_220px] gap-10 items-center py-2.5 px-3 -mx-3 border-b border-[#F3F4F6] last:border-b-0 hover:bg-om-gray-50 rounded-lg transition-colors cursor-default"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-[13px] text-om-gray-500 truncate">{{ metric.label }}</span>
                      <span v-if="metric.isTestGoal" class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-om-gray-100 text-om-gray-600 shrink-0">Primary goal</span>
                    </div>
                    <div class="text-base font-semibold text-om-gray-700 tabular-nums text-left">{{ formatMetricValue(metric.valueA, metric.format) }}</div>
                    <div class="flex items-center justify-start gap-2">
                      <span class="text-base font-semibold text-om-gray-700 tabular-nums">{{ formatMetricValue(metric.valueB, metric.format) }}</span>
                      <span
                        v-if="metric.delta !== 0"
                        class="inline-flex items-center gap-0.5 text-[12px] font-medium tabular-nums whitespace-nowrap"
                        :class="metric.delta > 0 ? 'text-[#239E77]' : 'text-[#C94B14]'"
                      >
                        <component :is="metric.delta > 0 ? TrendingUp : TrendingDown" :size="12" />
                        {{ metric.delta > 0 ? '+' : '' }}{{ metric.delta }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- A/B Test Results — Version 2: pivoted (metrics as columns, variants as rows) -->
              <div v-if="props.abTestVersion === 'pivoted'" class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 min-w-0">
                <div class="px-8 mb-5">
                  <h2 class="text-xl font-semibold text-om-gray-700">A/B Test Results</h2>
                </div>

                <!-- Win conditions (compact chips) — when auto-declare is on -->
                <div v-if="autoStopEnabled" class="px-8 mb-5">
                  <div class="pb-4 border-b border-om-gray-200">
                    <p class="text-sm text-om-gray-700">
                      All <strong class="font-semibold">3 conditions</strong> must be met to auto-declare a winner.
                      <span class="text-om-gray-500">Estimated <strong class="font-semibold text-om-gray-700">~125 more submits</strong> needed to reach {{ autoStopThreshold }}% win chance — about <strong class="font-semibold text-om-gray-700">45 more days</strong> at current traffic.</span>
                    </p>
                  </div>
                </div>

                <!-- Significance summary — when auto-declare is off -->
                <div v-else class="px-8 mb-5">
                  <div class="pb-4 border-b border-om-gray-200">
                    <p class="text-sm text-om-gray-700">
                      Estimated more than <strong class="font-semibold">{{ abTestProgressNeeded }} submits</strong> needed to reach statistically significant 95% win chance.
                      <span class="text-om-gray-500">&gt;45 days left (based on your current traffic)</span>
                    </p>
                  </div>
                </div>

                <!-- Pivoted table -->
                <div class="px-8 overflow-x-auto">
                  <div class="min-w-[900px]">
                    <!-- Header: metric columns -->
                    <div class="grid grid-cols-[180px_repeat(6,_1fr)] gap-4 pb-3 border-b border-om-gray-200">
                      <div></div>
                      <div
                        v-for="metric in abTestMetrics"
                        :key="'h-' + metric.id"
                        class="flex items-center gap-2 flex-wrap"
                      >
                        <span class="text-[11px] font-medium text-om-gray-500 leading-tight">{{ metric.label }}</span>
                        <span v-if="metric.isTestGoal" class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-om-gray-100 text-om-gray-600 shrink-0">Primary goal</span>
                      </div>
                    </div>

                    <!-- Variant 1 (Klaviyo Popup) -->
                    <div class="grid grid-cols-[180px_repeat(6,_1fr)] gap-4 items-center py-4 px-3 -mx-3 border-b border-[#F3F4F6] hover:bg-om-gray-50 rounded-lg transition-colors cursor-default">
                      <div class="flex flex-col gap-0.5">
                        <span class="text-sm font-semibold text-om-gray-700">Klaviyo Popup</span>
                        <span class="text-[11px] text-om-gray-400 tabular-nums">-</span>
                      </div>
                      <div
                        v-for="metric in abTestMetrics"
                        :key="'v1-' + metric.id"
                        class="flex flex-col gap-1.5"
                      >
                        <span class="text-base font-semibold text-om-gray-700 tabular-nums">{{ formatMetricValue(metric.valueA, metric.format) }}</span>
                        <div class="h-2.5 rounded-full" :style="{ width: (pivotBarPct(metric, metric.valueA) * 0.6) + '%', background: '#FF9E89' }"></div>
                      </div>
                    </div>

                    <!-- Variant 2 (AI Variant) -->
                    <div class="grid grid-cols-[180px_repeat(6,_1fr)] gap-4 items-center py-4 px-3 -mx-3 hover:bg-om-gray-50 rounded-lg transition-colors cursor-default">
                      <div class="flex flex-col gap-0.5">
                        <span class="text-sm font-semibold text-om-gray-700">AI Variant</span>
                        <span class="text-[11px] text-om-gray-400"><span class="text-[#239E77] font-semibold tabular-nums">{{ abTestProbB }}%</span> chance to win</span>
                      </div>
                      <div
                        v-for="metric in abTestMetrics"
                        :key="'v2-' + metric.id"
                        class="flex flex-col gap-1.5"
                      >
                        <div class="flex items-baseline gap-1.5 flex-wrap">
                          <span class="text-base font-semibold text-om-gray-700 tabular-nums">{{ formatMetricValue(metric.valueB, metric.format) }}</span>
                          <span
                            v-if="metric.delta !== 0"
                            class="inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums"
                            :class="metric.delta > 0 ? 'text-[#239E77]' : 'text-[#C94B14]'"
                          >
                            <component :is="metric.delta > 0 ? TrendingUp : TrendingDown" :size="11" />
                            {{ metric.delta > 0 ? '+' : '' }}{{ metric.delta }}%
                          </span>
                        </div>
                        <div class="h-2.5 rounded-full" :style="{ width: (pivotBarPct(metric, metric.valueB) * 0.6) + '%', background: '#FF6A45' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- A/B Test Results — Version 3: bar chart cards -->
              <div v-if="props.abTestVersion === 'bar-chart'" class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] py-5 min-w-0">
                <div class="px-8 mb-5">
                  <h2 class="text-xl font-semibold text-om-gray-700">A/B Test Results</h2>
                </div>

                <!-- Significance summary -->
                <div class="px-8 mb-7">
                  <p class="text-sm text-om-gray-700">
                    Estimated more than <strong class="font-semibold">{{ abTestProgressNeeded }} submits</strong> needed to reach statistically significant 95% win chance.
                    <span class="text-om-gray-500">&gt;45 days left (based on your current traffic)</span>
                  </p>
                </div>

                <!-- Metric cards grid -->
                <div class="grid grid-cols-6 gap-3 px-8">
                  <div
                    v-for="metric in abTestBarMetrics"
                    :key="'bar-' + metric.id"
                    class="min-w-0 border border-om-gray-200 rounded-xl px-3 py-2.5"
                  >
                    <div class="flex items-start justify-between mb-3 gap-2">
                      <span class="text-[12px] text-om-gray-500">{{ metric.label }}</span>
                      <span v-if="metric.isTestGoal" class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-om-gray-100 text-om-gray-600 shrink-0">Primary goal</span>
                    </div>
                    <!-- Custom HTML bar chart -->
                    <div class="flex w-full">
                      <!-- Variant A column -->
                      <div class="flex-1 flex flex-col items-center" style="gap: 6px;">
                        <span class="text-[13px] font-semibold text-om-gray-700 tabular-nums" style="line-height: 16px;">{{ formatMetricValue(metric.valueA, metric.format) }}</span>
                        <span class="text-[11px]" style="visibility: hidden; line-height: 14px;">·</span>
                        <div style="height: 100px; display: flex; align-items: flex-end;">
                          <div
                            :style="{
                              height: barHeightPx(metric, metric.valueA) + 'px',
                              width: '36px',
                              minHeight: '4px',
                              backgroundColor: '#FF9E89',
                              borderTopLeftRadius: '6px',
                              borderTopRightRadius: '6px',
                            }"
                          ></div>
                        </div>
                        <span class="text-[11px] text-om-gray-400">Klaviyo Popup</span>
                      </div>
                      <!-- Variant B column -->
                      <div class="flex-1 flex flex-col items-center" style="gap: 6px;">
                        <span class="text-[13px] font-semibold text-om-gray-700 tabular-nums" style="line-height: 16px;">{{ formatMetricValue(metric.valueB, metric.format) }}</span>
                        <span
                          v-if="metric.delta !== 0"
                          class="inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums"
                          :class="metric.delta > 0 ? 'text-[#239E77]' : 'text-[#C94B14]'"
                          style="line-height: 14px;"
                        >
                          <component :is="metric.delta > 0 ? TrendingUp : TrendingDown" :size="11" />
                          {{ metric.delta > 0 ? '+' : '' }}{{ metric.delta }}%
                        </span>
                        <span v-else class="text-[11px]" style="visibility: hidden; line-height: 14px;">·</span>
                        <div style="height: 100px; display: flex; align-items: flex-end;">
                          <div
                            :style="{
                              height: barHeightPx(metric, metric.valueB) + 'px',
                              width: '36px',
                              minHeight: '4px',
                              backgroundColor: '#FF6A45',
                              borderTopLeftRadius: '6px',
                              borderTopRightRadius: '6px',
                            }"
                          ></div>
                        </div>
                        <span class="text-[11px] text-om-gray-400">AI Variant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </template>
        </CampaignAnalyticsTab>

        <!-- Settings Tab Content -->
        <div v-if="activeTab === 'Settings'" class="space-y-4 pb-40">
          <!-- When would you like this campaign to show up? -->
          <Accordion
            id="settings-showUp"
            title="Triggering"
            subtitle="When would you like this campaign to show up?"
            :open="openAccordion === 'showUp'"
            @toggle="toggleAccordion('showUp')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
              <template #icon><Zap :size="20" class="text-om-orange-400" /></template>
              <!-- Trigger Timeline -->
              <div class="trigger-timeline">
                <!-- First trigger: On exit-intent -->
                <div class="trigger-timeline-item">
                  <div class="trigger-card">
                    <div class="flex items-center gap-5">
                      <div class="w-20 h-14 shrink-0">
                        <img src="/settings/setting-1.png" alt="Exit intent" class="w-full h-full object-contain" />
                      </div>
                      <div class="flex-1">
                        <h5 class="text-base font-semibold text-om-gray-700 mb-1">On exit-intent</h5>
                        <p class="text-sm text-om-gray-400">When a visitor is about to leave your site</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- OR Badge on timeline -->
                <div class="trigger-timeline-or">
                  <span class="trigger-or-badge">OR</span>
                </div>

                <!-- Second trigger: After x seconds of inactivity -->
                <div class="trigger-timeline-item">
                  <div class="trigger-card">
                    <div class="flex items-center gap-5">
                      <div class="w-20 h-14 shrink-0">
                        <img src="/settings/setting-1.png" alt="After seconds" class="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h5 class="text-base font-semibold text-om-gray-700 mb-1">After x seconds of inactivity</h5>
                        <p class="text-sm text-om-gray-400">
                          When a visitor is inactive for <span class="font-semibold text-om-gray-700">20 seconds</span>
                        </p>
                      </div>
                      <div class="flex items-center gap-2 shrink-0">
                        <Monitor :size="20" class="text-om-gray-700" />
                        <Smartphone :size="20" class="text-om-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add new trigger on timeline -->
                <div class="trigger-timeline-add pl-6">
                  <Button variant="secondary" size="md">
                    <template #icon><Plus :size="18" /></template>
                    Add new trigger
                  </Button>
                </div>
              </div>
          </Accordion>

          <!-- How many times should this campaign appear? -->
          <Accordion
            id="settings-howMany"
            title="Frequency"
            subtitle="How many times should this campaign appear?"
            :open="openAccordion === 'howMany'"
            @toggle="toggleAccordion('howMany')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
              <template #icon><RefreshCw :size="20" class="text-om-orange-400" /></template>
              <!-- How many times can this campaign appear -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-om-gray-700 mb-3">
                  How many times <span class="font-normal text-om-gray-500">can this campaign appear to a visitor?</span>
                </h4>
                <div class="space-y-2.5">
                  <RadioButton v-model="frequencyType" value="unlimited" label="Unlimited Times" />
                  <RadioButton v-model="frequencyType" value="maximum">
                    <span class="text-sm text-om-gray-700">Maximum</span>
                    <input
                      type="number"
                      v-model="maxTimes"
                      :disabled="frequencyType !== 'maximum'"
                      class="w-16 px-2 py-1 border border-om-gray-200 rounded text-sm text-om-gray-700 focus:outline-none focus:border-om-gray-300 disabled:bg-om-gray-50 disabled:text-om-gray-400"
                    />
                    <span class="text-sm text-om-gray-700">times</span>
                  </RadioButton>
                </div>
              </div>

              <!-- How frequently -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-om-gray-700 mb-3">
                  How frequently <span class="font-normal text-om-gray-500">can this campaign appear again after a visitor has closed it?</span>
                </h4>
                <div class="space-y-2.5">
                  <RadioButton v-model="frequencyMode" value="asap" label="As soon as possible" />
                  <RadioButton v-model="frequencyMode" value="min">
                    <span class="text-sm text-om-gray-700">Minimum</span>
                    <input
                      type="number"
                      v-model="minValue"
                      :disabled="frequencyMode !== 'min'"
                      class="w-16 px-2 py-1 border border-om-gray-200 rounded text-sm text-om-gray-700 focus:outline-none focus:border-om-gray-300 disabled:bg-om-gray-50 disabled:text-om-gray-400"
                    />
                    <div class="relative">
                      <select
                        v-model="timeUnit"
                        :disabled="frequencyMode !== 'min'"
                        class="w-24 pl-2 pr-6 py-1 border border-om-gray-200 rounded-lg text-sm text-om-gray-700 focus:outline-none focus:border-om-gray-300 appearance-none cursor-pointer disabled:bg-om-gray-50 disabled:text-om-gray-400 disabled:cursor-not-allowed"
                      >
                        <option value="hour">hour(s)</option>
                        <option value="day">day(s)</option>
                        <option value="session">session(s)</option>
                      </select>
                      <ChevronDown :size="16" class="absolute right-1.5 top-1/2 -translate-y-1/2 text-om-gray-600 pointer-events-none" />
                    </div>
                    <span class="text-sm text-om-gray-700">between two impressions</span>
                  </RadioButton>
                </div>
              </div>

              <!-- When should stop showing -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-om-gray-700 mb-3">
                  When should <span class="font-normal text-om-gray-500">the campaign</span> stop showing <span class="font-normal text-om-gray-500">to the visitors?</span>
                </h4>
                <div class="flex flex-col gap-2.5">
                  <Checkbox v-model="stopAfterClose" label="After a visitor has closed the campaign" />
                  <Checkbox v-model="stopAfterConvert" label="After a visitor has converted in this campaign" />
                </div>
              </div>

          </Accordion>

          <!-- Who should see this campaign? -->
          <Accordion
            id="settings-whoSee"
            title="Targeting"
            subtitle="Who should see this campaign?"
            :open="openAccordion === 'whoSee'"
            @toggle="toggleAccordion('whoSee')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><Users :size="20" class="text-om-orange-400" /></template>
            <div class="trigger-timeline">
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Timer :size="28" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">Spent on pages</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">The popup will appear to visitors who spent a minimum of <span class="font-semibold text-om-gray-800">10 seconds</span> on the current subpage</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trigger-timeline-item">
                <div class="trigger-card">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-om-orange-400 rounded-xl flex items-center justify-center shrink-0">
                      <Globe :size="28" class="text-white" />
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-om-gray-700">Current page / URL</div>
                      <div class="text-sm text-om-gray-500 mt-0.5">URL or its subpaths contains <span class="font-semibold text-om-gray-800">cart</span>, <span class="font-semibold text-om-gray-800">shop_cart</span>, <span class="font-semibold text-om-gray-800">shop_reg</span>, or <span class="font-semibold text-om-gray-800">shop_category</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="trigger-timeline-add pl-6 flex items-center justify-between gap-3">
                <Button variant="secondary" size="md">
                  <template #icon><Plus :size="18" /></template>
                  Add new rule
                </Button>
                <Button variant="secondary" size="md">Save as segment</Button>
              </div>
            </div>
          </Accordion>

          <!-- Where you would like to send the subscribers and campaign data? -->
          <Accordion
            id="settings-sendData"
            title="Integrations"
            subtitle="Where you would like to send the subscribers and campaign data?"
            :open="openAccordion === 'sendData'"
            @toggle="toggleAccordion('sendData')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><Send :size="20" class="text-om-orange-400" /></template>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-[#FFE01B] rounded-xl flex items-center justify-center">
                <img src="/icons/mailchimp.svg" alt="Mailchimp" class="w-7 h-7" />
              </div>
              <span class="text-sm font-medium text-om-gray-700">Mailchimp</span>
            </div>
            <div class="mt-8">
              <Button variant="secondary" size="md">
                <template #icon><Plus :size="18" /></template>
                Add new integration
              </Button>
            </div>
          </Accordion>

          <!-- A/B test -->
          <Accordion
            id="settings-abTest"
            title="A/B test"
            subtitle="Split traffic between variants and pick a winner automatically"
            :open="openAccordion === 'abTest'"
            @toggle="toggleAccordion('abTest')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><FlaskConical :size="20" class="text-om-orange-400" /></template>
            <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-16 items-stretch">
              <!-- Left column: Auto-declare winner -->
              <section>
                <div class="flex items-center gap-3 mb-1">
                  <h4 class="text-base font-semibold text-om-gray-700">Auto-declare winner</h4>
                  <ToggleSwitch v-model="autoStopEnabled" />
                </div>
                <p class="text-sm text-om-gray-500 mb-3">Automatically end the test when a clear winner emerges.</p>

                <div v-if="autoStopEnabled" class="flex flex-col gap-2.5">
                  <div class="flex items-center gap-2 text-sm text-om-gray-600">
                    <span>Declare winner at</span>
                    <div class="relative">
                      <input
                        type="number"
                        v-model.number="autoStopThreshold"
                        min="50"
                        max="100"
                        step="1"
                        class="w-20 pl-3 pr-7 py-1.5 text-sm text-om-gray-700 bg-white border border-om-gray-200 rounded-lg focus:outline-none focus:border-om-orange-500 tabular-nums"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-om-gray-500 pointer-events-none">%</span>
                    </div>
                    <span>chance to win</span>
                  </div>

                  <div class="flex items-center gap-2 text-sm text-om-gray-600">
                    <span>Minimum conversion threshold:</span>
                    <div class="relative">
                      <input
                        type="number"
                        v-model.number="minConversionThreshold"
                        min="0"
                        step="1"
                        class="w-20 pl-3 pr-3 py-1.5 text-sm text-om-gray-700 bg-white border border-om-gray-200 rounded-lg focus:outline-none focus:border-om-orange-500 tabular-nums"
                      />
                    </div>
                    <span>conversions</span>
                  </div>

                  <div class="flex items-center gap-2 text-sm text-om-gray-600">
                    <span>Minimum days running:</span>
                    <div class="relative">
                      <input
                        type="number"
                        v-model.number="minDaysRunning"
                        min="0"
                        step="1"
                        class="w-20 pl-3 pr-3 py-1.5 text-sm text-om-gray-700 bg-white border border-om-gray-200 rounded-lg focus:outline-none focus:border-om-orange-500 tabular-nums"
                      />
                    </div>
                    <span>days</span>
                  </div>
                </div>
              </section>

              <!-- Vertical divider -->
              <div class="w-px bg-om-gray-100"></div>

              <!-- Right column: Traffic share -->
              <section>
                <h4 class="text-base font-semibold text-om-gray-700 mb-3">Traffic share</h4>

                <div class="mb-3 space-y-2">
                  <div class="flex items-center justify-between py-1">
                    <span class="text-sm font-medium text-om-gray-700">Klaviyo Popup</span>
                    <div class="relative">
                      <input
                        type="number"
                        :value="variant1Traffic"
                        @input="updateTrafficShare('v1', $event.target.value)"
                        :disabled="trafficEvenlySplit"
                        min="0"
                        max="100"
                        step="1"
                        class="w-24 pl-3 pr-8 py-1.5 text-sm text-om-gray-700 bg-white border border-om-gray-200 rounded-lg focus:outline-none focus:border-om-orange-500 tabular-nums text-left disabled:cursor-not-allowed disabled:bg-om-gray-50 disabled:text-om-gray-500"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-om-gray-500 pointer-events-none">%</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-1">
                    <span class="text-sm font-medium text-om-gray-700">AI Variant</span>
                    <div class="relative">
                      <input
                        type="number"
                        :value="variant2Traffic"
                        @input="updateTrafficShare('v2', $event.target.value)"
                        :disabled="trafficEvenlySplit"
                        min="0"
                        max="100"
                        step="1"
                        class="w-24 pl-3 pr-8 py-1.5 text-sm text-om-gray-700 bg-white border border-om-gray-200 rounded-lg focus:outline-none focus:border-om-orange-500 tabular-nums text-left disabled:cursor-not-allowed disabled:bg-om-gray-50 disabled:text-om-gray-500"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-om-gray-500 pointer-events-none">%</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between py-1">
                    <span class="text-sm font-medium text-om-gray-500">Total</span>
                    <span
                      class="text-sm font-semibold tabular-nums"
                      :class="trafficTotal === 100 ? 'text-om-gray-700' : 'text-red-500'"
                    >{{ trafficTotal }}%</span>
                  </div>
                </div>

                <div>
                  <Checkbox :model-value="trafficEvenlySplit" @update:model-value="toggleEvenlySplit" label="Evenly split" />
                  <p class="text-sm text-om-gray-500 mt-1">Equally distribute weight percentage across all groups</p>
                </div>
              </section>
            </div>
          </Accordion>

          <!-- Primary goal -->
          <Accordion
            id="settings-goal"
            title="Primary goal"
            subtitle="The main conversion event used to measure this campaign's success"
            :open="openAccordion === 'goal'"
            @toggle="toggleAccordion('goal')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><Target :size="20" class="text-om-orange-400" /></template>
            <p class="text-sm text-om-gray-500 mb-3">Reports and variant comparisons default to this metric.</p>
            <div class="w-64">
              <Dropdown v-model="primaryGoal" :options="goalValues" />
            </div>
          </Accordion>

          <!-- Email notification -->
          <Accordion
            id="settings-emailNotification"
            title="Email notification"
            subtitle="Get notified when someone submits this campaign"
            :open="openAccordion === 'emailNotification'"
            @toggle="toggleAccordion('emailNotification')"
            icon-rounded="rounded-xl"
            icon-bg="bg-om-orange-100"
          >
            <template #icon><Mail :size="20" class="text-om-orange-400" /></template>
            <div class="flex items-center gap-3">
              <h4 class="text-base font-semibold text-om-gray-700">Send email notifications</h4>
              <ToggleSwitch v-model="emailNotification" />
            </div>

            <div v-if="emailNotification" class="mt-5">
              <div v-if="notificationEmails.length" class="flex flex-wrap gap-2 mb-4">
                <Tag
                  v-for="entry in notificationEmails"
                  :key="entry.email"
                  variant="gray"
                  :class="entry.status === 'pending' ? 'text-om-gray-600!' : ''"
                >
                  <template v-if="entry.status === 'pending'" #icon>
                    <Hourglass :size="12" />
                  </template>
                  <span>{{ entry.email }}</span>
                  <button
                    type="button"
                    class="ml-1 -mr-1 inline-flex items-center justify-center cursor-pointer opacity-70 hover:opacity-100"
                    @click="removeNotificationEmail(entry.email)"
                  >
                    <X :size="12" />
                  </button>
                </Tag>
              </div>

              <div class="flex items-end gap-2">
                <div class="w-80">
                  <FormInput
                    v-model="newNotificationEmail"
                    label="Send notifications to"
                    type="email"
                    placeholder="Add email address"
                    @keydown.enter.prevent="addNotificationEmail"
                  />
                </div>
                <Button variant="primary" size="md" @click="addNotificationEmail">
                  <template #icon><Plus :size="16" /></template>
                  Add
                </Button>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </template>
    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
  </DashboardLayout>

  <!-- Schedule Modal -->
  <transition name="modal">
    <div v-if="isScheduleModalOpen" class="fixed inset-0 z-50 flex items-start justify-center px-6 pt-10 pb-20" style="background-color: rgba(49, 80, 85, 0.65);" @click.self="isScheduleModalOpen = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[calc(100vh-120px)] overflow-visible flex flex-col" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-om-gray-200 bg-white flex-shrink-0 rounded-t-xl">
          <h2 class="text-xl font-semibold text-om-gray-700">Set up campaign schedule</h2>
          <Button variant="ghost" size="sm" icon-only @click="isScheduleModalOpen = false"><template #icon><X :size="20" /></template></Button>
        </div>

        <!-- Scrollable content area -->
        <div class="overflow-y-auto flex-1" style="scrollbar-gutter: stable;">
        <!-- Modal Content -->
        <div class="pl-6 pr-3 py-6 space-y-8">
          <!-- Time zone -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0">Time zone</label>
            <div class="flex-1">
              <Dropdown v-model="selectedTimezone" :options="timezoneOptions" />
            </div>
          </div>

          <!-- Start date -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0">Start date</label>
            <div class="flex gap-3 flex-1">
              <div class="flex-1 om-datepicker">
                <VueDatePicker
                  v-model="startDate"
                  :enable-time-picker="false"
                  format="MM/dd/yyyy"
                  auto-apply
                  :clearable="false"
                  teleport="body"
                  :text-input="false"
                  :action-row="{ showNow: false, showPreview: false }"
                >
                  <template #input-icon>
                    <Calendar :size="16" />
                  </template>
                </VueDatePicker>
              </div>
              <div class="flex-1">
                <ScrollTimePicker v-model="startTime" />
              </div>
            </div>
          </div>

          <!-- End date -->
          <div class="flex items-start gap-4">
            <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0">End date</label>
            <div class="space-y-3 flex-1">
              <div class="grid grid-cols-[110px_1fr] gap-2">
                <RadioButton v-model="endDateType" value="never" label="Never" />
                <RadioButton v-model="endDateType" value="on" label="Set end date" />
              </div>
              <div v-if="endDateType === 'on'" class="flex gap-3">
                <div class="flex-1 om-datepicker">
                  <VueDatePicker
                    v-model="endDate"
                    :enable-time-picker="false"
                    format="MM/dd/yyyy"
                    auto-apply
                    :clearable="false"
                    placeholder="MM/DD/YYYY"
                    teleport="body"
                  >
                    <template #input-icon>
                      <Calendar :size="16" />
                    </template>
                  </VueDatePicker>
                </div>
                <div class="flex-1">
                  <ScrollTimePicker v-model="endTime" />
                </div>
              </div>
            </div>
          </div>

          <!-- Daily schedule -->
          <div class="mt-6">
            <!-- Daily schedule label with radio buttons -->
            <div class="flex items-center gap-4">
              <label class="text-sm font-medium text-om-gray-700 w-32 shrink-0">Daily schedule</label>
              <div class="grid grid-cols-[110px_1fr] gap-2 flex-1">
                <RadioButton v-model="scheduleType" value="everyday" label="Every day" />
                <RadioButton v-model="scheduleType" value="specific" label="Specific" />
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
                    <ScrollTimePicker v-model="dailyFromTime" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-om-gray-700 mb-2">To</label>
                    <ScrollTimePicker v-model="dailyToTime" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Action buttons - Sticky -->
        <div class="flex items-center justify-end gap-3 pl-6 pr-3 py-3 bg-white">
          <Button variant="ghost" size="sm" @click="scheduleSaved ? handleDeleteSchedule() : (isScheduleModalOpen = false)">{{ scheduleSaved ? 'Delete Schedule' : 'Cancel' }}</Button>
          <Button variant="primary" size="sm" @click="saveSchedule">Save</Button>
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDown, ChevronRight, ArrowRight, TrendingUp, TrendingDown, AlertTriangle, Calendar, Target, MoreVertical, GraduationCap, Clock, RefreshCw, Users, Send, Monitor, Smartphone, X, ChevronsUp, ChevronsDown, Minus, Check, Globe, Plus, FlaskConical, Mail, Search, ArrowUpDown, Columns3, LogOut, Timer, Zap, Ban, Hourglass, MessageCircle, MousePointerClick, Filter, RotateCw, Facebook, Route, Tag as TagIcon, Sparkles, LayoutGrid, Layers, Info, ClipboardList, ShieldAlert, Eye, Wand2, ArrowDown, BarChart3, ShieldCheck, Truck } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import { croInsights } from '../data/croInsights.js'
import Button from '../components/shared/Button.vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Accordion from '../components/shared/Accordion.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import RadioButton from '../components/shared/RadioButton.vue'
import FormInput from '../components/shared/FormInput.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import ScrollTimePicker from '../components/shared/ScrollTimePicker.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import EditableTitle from '../components/shared/EditableTitle.vue'
import Tag from '../components/shared/Tag.vue'
import CampaignAnalyticsTab from '../components/shared/CampaignAnalyticsTab.vue'

const props = defineProps({
  abTestVersion: { type: String, default: 'comparison' }, // 'comparison' | 'pivoted' | 'bar-chart'
})
const emit = defineEmits(['menu-click', 'navigate', 'navigate-to-opportunity', 'navigate-to-opportunities'])

const isChatOpen = ref(false)
const campaignName = ref('Campaign #1')

const chatSuggestions = [
  'How is this campaign performing?',
  'How can I improve this campaign\'s conversion rate?',
  'Suggest A/B test ideas for this campaign',
  'What\'s the best time to run this campaign?',
  'How does this compare to my other campaigns?',
]

const chatAiResponses = {
  'How is this campaign performing?': 'Your **Black Friday 2025** campaign is performing well overall:\n\n- **Impressions:** 24,310\n- **Conversion rate:** 5.2% (above your 3.2% average)\n- **Supported revenue:** 1,240,000 HUF\n\nThe campaign is running on schedule and hitting its targets. The biggest opportunity is on mobile — desktop converts at **6.8%** vs **3.1%** on mobile.',
  'How can I improve this campaign\'s conversion rate?': {
    message: 'Here are the top opportunities for **Black Friday 2025**:\n\n**1. Mobile optimization** — Your mobile conversion rate (3.1%) is less than half of desktop. Consider a dedicated mobile variant.\n\n**2. Exit intent trigger** — Adding an exit intent trigger could recover an estimated 12–15% of abandoning visitors.\n\n**3. Stronger headline** — A/B test a more urgent headline like "Today only: 30% off everything".',
    followUp: 'Which of these would you like to tackle first? I can walk you through the setup.\n\nFor a deeper look at your traffic and conversion patterns, check the **Insights** block on the **Analytics** page.',
  },
  'Suggest A/B test ideas for this campaign': 'Here are 3 high-impact A/B test ideas for this campaign:\n\n**1. Headline** — "Black Friday Deal" vs "Limited time: 30% off"\n\n**2. CTA button** — "Get the deal" vs "Claim your discount"\n\n**3. Trigger timing** — Show after 5 seconds vs on exit intent\n\nI\'d start with the headline test — it typically has the biggest impact on conversion rate.',
  'What\'s the best time to run this campaign?': 'Based on your historical data, peak engagement for discount campaigns is:\n\n- **Thursday–Friday** between 18:00–22:00\n- **Saturday morning** 09:00–12:00\n\nYour current schedule runs from Nov 27–30, which aligns well with Black Friday traffic. I\'d recommend enabling the campaign at least 2 hours before the sale starts to capture early visitors.',
  'How does this compare to my other campaigns?': 'Compared to your other active campaigns, **Black Friday 2025** ranks:\n\n- **#2** in conversion rate (5.2% vs Smart Discount\'s 8.37%)\n- **#1** in total impressions\n- **#1** in supported revenue\n\nIt\'s your highest-volume campaign. Even a 1% improvement in conversion rate would add ~240,000 HUF in supported revenue.',
}

const activeTab = ref('Overview')

// A/B funnel breakdown
const abFunnelVariants = computed(() => [
  {
    id: 'variant1',
    label: 'Variant 1',
    name: 'Klaviyo Popup',
    image: '/campaigns/cart-abandonment-stopper.png',
    traffic: variant1Traffic.value,
    active: variant1Active.value,
    uplift: null,
    color: '#FF6A45',
    steps: [
      { id: 'mainpage', name: 'Mainpage', impressions: 728 },
      { id: 'email', name: 'Email', impressions: 312 },
      { id: 'phone', name: 'Phone', impressions: 128 },
      { id: 'thank-you', name: 'Thank You page', impressions: 57 },
    ],
  },
  {
    id: 'variant2',
    label: 'Variant 2',
    name: 'AI Variant',
    image: '/campaigns/cart-abandonment-stopper.png',
    traffic: variant2Traffic.value,
    active: variant2Active.value,
    uplift: '+18.52%',
    color: '#FF6A45',
    steps: [
      { id: 'mainpage', name: 'Mainpage', impressions: 728 },
      { id: 'discount', name: 'Discount reveal', impressions: 474 },
      { id: 'email', name: 'Email', impressions: 312 },
      { id: 'thank-you', name: 'Thank You page', impressions: 68 },
    ],
  },
])
const variantStepShare = (variant, step) => {
  const max = variant.steps[0]?.impressions || 1
  return ((step.impressions / max) * 100).toFixed(1)
}
const variantStepDropOff = (variant, idx) => {
  const prev = variant.steps[idx - 1]?.impressions
  const curr = variant.steps[idx]?.impressions
  if (!prev) return '0.0'
  return (((prev - curr) / prev) * 100).toFixed(1)
}

// A/B Test Results
const abTestCriteria = computed(() => [
  { id: 'conversions', label: 'Minimum conversions', current: 125, target: minConversionThreshold.value, format: 'number', unit: 'conversions' },
  { id: 'days', label: 'Minimum days running', current: 12, target: minDaysRunning.value, format: 'number', unit: 'days' },
  { id: 'chance', label: 'Win chance', current: 77.6, target: autoStopThreshold.value, format: 'percent' },
])
const isCriterionMet = (c) => c.current >= c.target
const formatCriterionValue = (c, val) => c.format === 'percent' ? val + '%' : val + (c.unit ? ' ' + c.unit : '')

const abTestProgressNeeded = 250
const abTestProgressCurrent = 125
const abTestProgressPct = Math.min(100, (abTestProgressCurrent / abTestProgressNeeded) * 100)
const insightIcons = {
  1: MessageCircle, 2: MousePointerClick, 3: Filter, 4: FlaskConical, 5: Monitor,
  6: Clock, 7: RotateCw, 8: Facebook, 9: Target, 10: Search,
  11: Route, 12: TagIcon, 13: Sparkles, 14: LayoutGrid, 15: Layers,
  16: Info, 17: ClipboardList, 18: ShieldAlert, 19: Smartphone, 20: Eye,
  21: Wand2, 22: ArrowDown, 23: BarChart3, 24: ShieldCheck, 25: Globe, 26: Truck,
}
const abTestImpactPriority = { 'High': 4, 'Large': 4, 'Medium to large': 3, 'Medium': 2, 'Low': 1 }
const abTestInsights = computed(() =>
  [...croInsights]
    .sort((a, b) => (abTestImpactPriority[b.value] ?? 0) - (abTestImpactPriority[a.value] ?? 0) || a.id - b.id)
    .slice(0, 4)
)
const abTestProbA = 22.4
const abTestProbB = 77.6
const abTestMetrics = [
  { id: 'submit-rate', label: 'Submit rate', delta: 19.3, isTestGoal: true, valueA: 7.83, valueB: 9.34, format: 'percent' },
  { id: 'email-captures', label: 'Email captures', delta: 22.0, isTestGoal: false, valueA: 50, valueB: 61, format: 'number' },
  { id: 'phone-captures', label: 'Phone captures', delta: -9.1, isTestGoal: false, valueA: 22, valueB: 20, format: 'number' },
  { id: 'coupon-redeem', label: 'Coupon redemptions', delta: 28.1, isTestGoal: false, valueA: 32, valueB: 41, format: 'number' },
  { id: 'revenue', label: 'Revenue', delta: 25.8, isTestGoal: false, valueA: 1420, valueB: 1786, format: 'currency' },
  { id: 'rev-per-visitor', label: 'Revenue per visitor', delta: 25.6, isTestGoal: false, valueA: 1.95, valueB: 2.45, format: 'currency2' },
]
const formatMetricValue = (val, format) => {
  if (format === 'percent') return val.toFixed(2) + '%'
  if (format === 'currency') return '$' + val.toLocaleString()
  if (format === 'currency2') return '$' + val.toFixed(2)
  return val.toLocaleString()
}
const abTestBarMetricIds = ['submit-rate', 'phone-captures', 'email-captures', 'coupon-redeem', 'revenue', 'rev-per-visitor']
const abTestBarMetrics = abTestMetrics.filter(m => abTestBarMetricIds.includes(m.id))
const barHeightPx = (metric, value) => {
  const max = Math.max(metric.valueA, metric.valueB)
  if (!max) return 0
  return Math.round((value / max) * 100)
}
const pivotBarPct = (metric, value) => {
  const max = Math.max(metric.valueA, metric.valueB)
  if (!max) return 0
  return ((value / max) * 100).toFixed(1)
}
const abTestVariantColors = ['#FF9E89', '#FF6A45']
const buildAbBarOptions = (metric) => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit', parentHeightOffset: 0, offsetX: 0, offsetY: 0 },
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 3,
      columnWidth: '45%',
      dataLabels: { position: 'top' },
    },
  },
  colors: abTestVariantColors,
  dataLabels: {
    enabled: true,
    offsetY: -20,
    formatter: (val) => formatMetricValue(val, metric.format),
    style: { fontSize: '12px', fontWeight: '600', colors: ['#505763'] },
    background: { enabled: false },
  },
  legend: { show: false },
  states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
  xaxis: {
    categories: ['Klaviyo Popup', 'AI Variant'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: { show: false },
    tooltip: { enabled: false },
    labels: { rotate: 0, offsetY: -4, style: { colors: '#9CA3AF', fontSize: '11px' } },
  },
  yaxis: { show: false },
  grid: { show: false, padding: { top: 24, right: 0, bottom: 0, left: 0 } },
  tooltip: {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const value = series[seriesIndex][dataPointIndex]
      const label = dataPointIndex === 0 ? 'A · Klaviyo Popup' : 'B · AI Variant'
      const fmt = formatMetricValue(value, metric.format)
      return `<div style="padding: 8px 12px; background: white; border: 1px solid #e3e5e8; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; background: ${w.globals.colors[dataPointIndex]}; border-radius: 50%; display: inline-block;"></span>
          <span style="color: #505763; font-weight: 500;">${label}: ${fmt}</span>
        </div>
      </div>`
    },
  },
})
const isActive = ref(true)

// Settings tab - Accordion state
const openAccordion = ref(null)
const emailNotification = ref(false)
const notificationEmails = ref([
  { email: 'product@optimonk.com', status: 'accepted' },
])
const newNotificationEmail = ref('')

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const addNotificationEmail = () => {
  const email = newNotificationEmail.value.trim()
  if (email && isValidEmail(email) && !notificationEmails.value.some(e => e.email === email)) {
    notificationEmails.value.push({ email, status: 'pending' })
  }
  newNotificationEmail.value = ''
}

const removeNotificationEmail = (email) => {
  notificationEmails.value = notificationEmails.value.filter(e => e.email !== email)
}

// How many times accordion state
const frequencyType = ref('maximum')
const maxTimes = ref(2)
const frequencyMode = ref('min')
const minValue = ref(1)
const timeUnit = ref('hour')
const stopAfterClose = ref(false)
const stopAfterConvert = ref(true)

const toggleAccordion = (section) => {
  openAccordion.value = openAccordion.value === section ? null : section
}

const openSettingsAccordion = (section) => {
  activeTab.value = 'Settings'
  openAccordion.value = section
  nextTick(() => {
    document.getElementById(`settings-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Tab routing — each tab gets its own URL
const VIEW_SLUG = (() => {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  const parts = hash.split('/')
  if (parts.length > 1 && ['settings', 'submits', 'analytics'].includes(parts[parts.length - 1])) parts.pop()
  return parts.join('/') || 'campaign-detail'
})()
const TAB_SLUGS = { Overview: '', Settings: 'settings', Submits: 'submits', Analytics: 'analytics' }
const SLUG_TO_TAB = { '': 'Overview', settings: 'Settings', submits: 'Submits', analytics: 'Analytics' }

const getTabFromHash = () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '')
  if (hash !== VIEW_SLUG && !hash.startsWith(VIEW_SLUG + '/')) return 'Overview'
  const tabSlug = hash.slice(VIEW_SLUG.length).replace(/^\//, '')
  return SLUG_TO_TAB[tabSlug] || 'Overview'
}

const updateHashForTab = (tab) => {
  const tabSlug = TAB_SLUGS[tab] || ''
  const newHash = '/' + VIEW_SLUG + (tabSlug ? '/' + tabSlug : '')
  if (window.location.hash !== '#' + newHash) {
    window.location.hash = newHash
  }
}

const handleTabHashChange = () => {
  const newTab = getTabFromHash()
  if (newTab !== activeTab.value) activeTab.value = newTab
}

watch(activeTab, (newTab) => { updateHashForTab(newTab) })

onMounted(() => {
  activeTab.value = getTabFromHash()
  window.addEventListener('hashchange', handleTabHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', handleTabHashChange)
})

// Variant active states
const variant1Active = ref(true)
const variant2Active = ref(true)
const variant1Traffic = ref(50)
const variant2Traffic = ref(50)
const trafficEvenlySplit = ref(true)

const updateTrafficShare = (key, value) => {
  const v = Math.max(0, Math.min(100, Number(value) || 0))
  if (key === 'v1') {
    variant1Traffic.value = v
  } else {
    variant2Traffic.value = v
  }
}

const trafficTotal = computed(() => Number(variant1Traffic.value || 0) + Number(variant2Traffic.value || 0))

const toggleEvenlySplit = () => {
  trafficEvenlySplit.value = !trafficEvenlySplit.value
  if (trafficEvenlySplit.value) {
    variant1Traffic.value = 50
    variant2Traffic.value = 50
  }
}

// Hover states for image preview
const hoveredImage = ref(null)
const hoveredRect = ref(null)

const handleThumbEnter = (event, key) => {
  hoveredImage.value = key
  hoveredRect.value = event.currentTarget.getBoundingClientRect()
}

const handleThumbLeave = () => {
  hoveredImage.value = null
  hoveredRect.value = null
}

// Tooltip positioning — to the right of the hovered thumbnail
const tooltipStyle = computed(() => {
  if (!hoveredRect.value) return {}
  return {
    left: (hoveredRect.value.right + 12) + 'px',
    top: hoveredRect.value.top + 'px',
  }
})

// Dropdown data
const selectedTimePeriod = ref('Last 30 days')
const timePeriodOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']

// Submits tab state
const submitsSearch = ref('')
const submitsTimeFilter = ref('Last 30 days')
const submitsTimeFilterOptions = ['Yesterday', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year', 'All time']
const submitsSortOpen = ref(false)
const submitsSortBy = ref('newest')
const submitsSortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name A–Z' },
]
const submitsColumnsOpen = ref(false)
const submitsColumns = ref([
  { key: 'name', label: 'Name', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'date', label: 'Date', visible: true },
  { key: 'phone', label: 'Phone', visible: true },
  { key: 'country', label: 'Country', visible: true },
  { key: 'source', label: 'Source', visible: false },
  { key: 'couponCode', label: 'Coupon code', visible: true },
])
const isSubmitColumnVisible = (key) => submitsColumns.value.find(c => c.key === key)?.visible ?? true

const submitsFirstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'James', 'Sophia', 'Lucas', 'Isabella', 'Mason', 'Mia', 'Ethan', 'Charlotte', 'Alexander']
const submitsLastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor']
const submitsStatuses = ['Completed', 'Completed', 'Completed', 'Pending', 'Failed']
const submitsCountries = ['United States', 'Germany', 'Hungary', 'United Kingdom', 'France', 'Austria', 'Netherlands', 'Spain']
const submitsSources = ['Google', 'Direct', 'Facebook', 'Instagram', 'Email']
const submitsCoupons = ['BLACKFRIDAY25', 'BLACKFRIDAY25', 'BF2025', 'SAVE30', 'FLASH25']

const generateSubmit = (id) => {
  const first = submitsFirstNames[Math.floor(Math.random() * submitsFirstNames.length)]
  const last = submitsLastNames[Math.floor(Math.random() * submitsLastNames.length)]
  const hasName = Math.random() > 0.25
  const emailUser = hasName ? `${first.toLowerCase()}.${last.toLowerCase()}` : `user${id}`
  const emailDomain = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.io'][Math.floor(Math.random() * 4)]
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(Date.now() - daysAgo * 86400000 - Math.floor(Math.random() * 86400000))
  return {
    id,
    name: hasName ? `${first} ${last}` : '',
    email: `${emailUser}@${emailDomain}`,
    status: submitsStatuses[Math.floor(Math.random() * submitsStatuses.length)],
    date,
    phone: Math.random() > 0.5 ? `+${Math.floor(10000000000 + Math.random() * 89999999999)}` : '',
    country: submitsCountries[Math.floor(Math.random() * submitsCountries.length)],
    source: submitsSources[Math.floor(Math.random() * submitsSources.length)],
    couponCode: Math.random() > 0.3 ? submitsCoupons[Math.floor(Math.random() * submitsCoupons.length)] : '',
  }
}

const submits = ref(Array.from({ length: 18 }, (_, i) => generateSubmit(i + 1)))

const filteredSubmits = computed(() => {
  let list = [...submits.value]
  if (submitsSearch.value) {
    const q = submitsSearch.value.toLowerCase()
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
  }
  if (submitsSortBy.value === 'newest') list.sort((a, b) => b.date - a.date)
  else if (submitsSortBy.value === 'oldest') list.sort((a, b) => a.date - b.date)
  else if (submitsSortBy.value === 'name') list.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email))
  return list.map(s => ({
    ...s,
    dateFormatted: s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeFormatted: s.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
  }))
})

const handleSubmitsExport = () => {}

const primaryGoal = ref('Submit')
const autoStopEnabled = ref(true)
const autoStopThreshold = ref(95)
const minConversionThreshold = ref(200)
const minDaysRunning = ref(3)
const goalValues = ['Submit', 'Order', 'Add to cart', 'Email capture', 'Phone capture']
const selectedGoal = ref('Submit')
const goalOptions = computed(() =>
  goalValues.map(v => ({
    value: v,
    label: v === primaryGoal.value ? `${v} (primary)` : v
  }))
)

const kpiByGoal = {
  'Submit': {
    label1: 'Impressions', value1: '1,456', label2: 'Submits',         value2: '125', label3: 'Submit rate', value3: '8.37%',
    h1: 'Impression', h2: 'Submits', h3: 'Submit rate',
    variant1: { v1: '728', v2: '57', v3: '7.83%' },
    variant2: { v1: '728', v2: '68', v3: '9.34%' },
  },
  'Order': {
    label1: 'Visitors', value1: '3,812', label2: 'Orders',             value2: '128', label3: 'Order rate', value3: '3.36%',
    h1: 'Visitors', h2: 'Orders', h3: 'Order rate',
    variant1: { v1: '5,245', v2: '142', v3: '2.71%' },
    variant2: { v1: '5,180', v2: '191', v3: '3.69%' },
  },
  'Add to cart': {
    label1: 'Visitors', value1: '3,812', label2: 'Adds to cart',       value2: '412', label3: 'ATC rate', value3: '10.81%',
    h1: 'Visitors', h2: 'ATC', h3: 'ATC rate',
    variant1: { v1: '5,245', v2: '478', v3: '9.11%' },
    variant2: { v1: '5,180', v2: '612', v3: '11.81%' },
  },
  'Email capture': {
    label1: 'Impressions', value1: '1,456', label2: 'Emails captured', value2: '88',  label3: 'Capture rate', value3: '6.04%',
    h1: 'Impression', h2: 'Emails', h3: 'Capture rate',
    variant1: { v1: '12,593', v2: '380', v3: '3.02%' },
    variant2: { v1: '12,593', v2: '491', v3: '3.90%' },
  },
  'Phone capture': {
    label1: 'Impressions', value1: '1,456', label2: 'Phones captured', value2: '52',  label3: 'Capture rate', value3: '3.57%',
    h1: 'Impression', h2: 'Phones', h3: 'Capture rate',
    variant1: { v1: '12,593', v2: '220', v3: '1.75%' },
    variant2: { v1: '12,593', v2: '287', v3: '2.28%' },
  },
}
const currentKpis = computed(() => {
  const key = typeof selectedGoal.value === 'object' ? selectedGoal.value?.value : selectedGoal.value
  return kpiByGoal[key] || kpiByGoal['Submit']
})

const handleLogoClick = () => {
  // Navigate back to home
  window.location.reload()
}

// Kebab menu state
const isKebabMenuOpen = ref(false)
const isPriorityOpen = ref(false)

// Schedule Modal states
const isScheduleModalOpen = ref(false)
const scheduleSaved = ref(false)
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

const startDate = ref(new Date('2026-02-06'))
const startTime = ref('10:46')
const endDateType = ref('never')
const endDate = ref(null)
const endTime = ref('10:46')
const isDailyScheduleOpen = ref(false)

// Daily schedule states
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


const toggleDay = (day) => {
  const index = selectedDays.value.indexOf(day)
  if (index > -1) {
    selectedDays.value.splice(index, 1)
  } else {
    selectedDays.value.push(day)
  }
}

// Format dates for display
const formattedStartDate = computed(() => {
  if (!startDate.value) return ''
  const date = new Date(startDate.value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const formattedEndDate = computed(() => {
  if (endDateType.value === 'never' || !endDate.value) {
    return 'Never'
  }
  const date = new Date(endDate.value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

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
  scheduleSaved.value = true
  isScheduleModalOpen.value = false
}

// Kebab menu handlers
const handleRename = () => {
  console.log('Rename campaign')
  isKebabMenuOpen.value = false
}

const handleDuplicate = () => {
  console.log('Duplicate campaign')
  isKebabMenuOpen.value = false
}

const handleSetPriority = (level) => {
  console.log('Set priority:', level)
  isKebabMenuOpen.value = false
  isPriorityOpen.value = false
}

const handleShare = () => {
  console.log('Share campaign')
  isKebabMenuOpen.value = false
}

const handleArchive = () => {
  console.log('Archive campaign')
  isKebabMenuOpen.value = false
}

const handleEditSchedule = () => {
  isScheduleModalOpen.value = true
  isKebabMenuOpen.value = false
}

const handleDeleteSchedule = () => {
  scheduleSaved.value = false
  isKebabMenuOpen.value = false
  isScheduleModalOpen.value = false
  console.log('Schedule deleted')
}

const handleDelete = () => {
  console.log('Delete campaign')
  isKebabMenuOpen.value = false
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

/* Hide default date and time picker icons */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-clear-button,
input[type="time"]::-webkit-inner-spin-button,
input[type="time"]::-webkit-clear-button {
  display: none;
}

/* Trigger Timeline */
.trigger-timeline {
  position: relative;
  margin-left: 10px;
  padding-left: 28px;
}

/* Timeline items with horizontal branch */
.trigger-timeline-item,
.trigger-timeline-or,
.trigger-timeline-add {
  position: relative;
}

.trigger-timeline-item::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 44px;
  width: 24px;
  height: 3px;
  background: #D5D8DD;
}

.trigger-timeline.summary-timeline .trigger-timeline-item::before {
  top: 40px;
}

/* Trunk segments — each direct child draws its own slice, so margins between
   them are bridged and no parent-level overhang can appear. */
.trigger-timeline-item::after,
.trigger-timeline-or::after {
  content: '';
  position: absolute;
  left: -28px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #D5D8DD;
}

/* Add button trunk: fills its own margin-top gap and stops at its branch */
.trigger-timeline-add::after {
  content: '';
  position: absolute;
  left: -28px;
  top: -1.5rem;
  bottom: 50%;
  width: 3px;
  background: #D5D8DD;
}

/* When no add button follows, last item caps trunk at its branch */
.trigger-timeline:not(:has(.trigger-timeline-add)) .trigger-timeline-item:last-child::after {
  bottom: 50%;
}

/* Rounded caps at the very ends of the trunk */
.trigger-timeline > *:first-child::after {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.trigger-timeline > *:last-child::after {
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}

.trigger-card {
  padding: 1.25rem 1.5rem;
  background: white;
  cursor: pointer;
}

/* OR section */
.trigger-timeline-or {
  position: relative;
  display: flex;
  align-items: center;
  height: 2.75rem;
}

.trigger-or-badge {
  position: absolute;
  left: -28px;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 4px 10px;
  background: #D5D8DD;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 6px;
  z-index: 1;
}

/* Add trigger */
.trigger-timeline-add {
  position: relative;
  margin-top: 1.5rem;
}

.trigger-timeline-add::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 50%;
  width: 24px;
  height: 3px;
  background: #D5D8DD;
}

.trigger-add-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  background: white;
  color: #ED5A29;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.trigger-add-button:hover {
  border-color: #ED5A29;
  background: #FEF7F3;
}
</style>
