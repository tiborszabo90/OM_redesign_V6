<template>
  <div>
  <!-- Variables / Placement view (full screen, no dashboard layout) -->
  <div v-if="isPreviewOpen" class="h-screen flex flex-col">
        <!-- Header bar -->
        <div class="flex items-center border-b border-om-gray-200 shrink-0">
          <div class="w-[320px] shrink-0 flex items-center gap-3 px-5 py-3 border-r border-om-gray-200">
            <button @click="closePreview" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
              <ArrowLeft :size="18" />
            </button>
            <div class="h-5 w-px bg-om-gray-200" />
            <div class="flex flex-col"><span class="font-semibold text-om-gray-700 text-sm">Variables</span><span class="text-xs text-om-gray-400">PPO - Product image and benefit list</span></div>
          </div>
          <div class="flex-1 flex items-center justify-between px-6 py-3 gap-8 min-w-0">
            <Dropdown v-model="selectedProductPage" :options="productPageOptions" size="sm" class="min-w-0" />
            <Button variant="primary" size="sm" class="shrink-0" @click="closePreview">Save</Button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-1 min-h-0">
          <!-- Left sidebar: variable list -->
          <div class="w-[320px] bg-white flex flex-col shrink-0 border-r border-om-gray-200">
            <div class="flex-1 overflow-y-auto px-3 pt-3">
              <div class="flex flex-col gap-2">
              <div
                v-for="variable in previewVariant?.variables"
                :key="variable.id"
                class="rounded-xl border-2 bg-white transition-all cursor-pointer group"
                :class="selectedVariableId === variable.id ? 'border-om-orange-300 bg-om-orange-50' : 'border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)]'"
                @click="selectVariable(previewVariant, variable)"
                @mouseenter="hoveredVariableId = variable.id"
                @mouseleave="hoveredVariableId = null"
              >
                <div class="flex items-center gap-3 px-4 py-3">
                  <div class="w-9 h-9 rounded-lg bg-om-orange-50 flex items-center justify-center text-om-orange-500 shrink-0">
                    <ImageIcon v-if="variable.type === 'Image'" :size="18" />
                    <Type v-else :size="18" />
                  </div>
                  <div class="flex-1 min-w-0 flex flex-col">
                    <span class="text-sm font-medium text-om-gray-700 truncate">{{ variable.name }}</span>
                    <span class="text-[11px] text-om-gray-400">{{ variable.generated.split(' / ')[0] }} of {{ variable.generated.split(' / ')[1] }} products</span>
                  </div>
                  <button class="text-om-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer" @click.stop="removeVariable(previewVariant, variable.id)">
                    <Trash2 :size="14" />
                  </button>
                </div>
                <!-- Selected state content (inside card) -->
                <div v-if="selectedVariableId === variable.id" class="px-4 pb-3 flex flex-col gap-2">
                  <Button variant="outline" size="sm" class="w-full" @click.stop="openVariableModal(variable)">
                    <template #icon><Pencil :size="13" /></template>
                    Edit variable
                  </Button>
                  <!-- Position on page (benefit list only) -->
                  <div v-if="variable.name === 'Benefit list'" class="pt-2">
                    <div class="text-sm font-semibold text-om-gray-700 mb-2">Position on page</div>
                    <div class="flex flex-col gap-2">
                      <button
                        v-for="pos in benefitPositions"
                        :key="pos.id"
                        class="w-full px-3 py-1.5 rounded-lg text-sm text-om-gray-700 cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02] text-left"
                        :class="benefitPosition === pos.id ? 'bg-om-orange-50 border-2 border-om-orange-500' : 'bg-white border border-om-gray-200'"
                        @click.stop="benefitPosition = pos.id"
                      >
                        {{ pos.label }}
                      </button>
                    </div>
                    <Button variant="outline" size="sm" class="w-full mt-3" @click.stop>
                      <template #icon><SquareDashedMousePointer :size="14" /></template>
                      Select position
                    </Button>
                  </div>
                </div>
              </div>
              </div>

              <!-- Add variable -->
              <div class="px-4 py-3">
                <div v-if="showAddVariableList" class="mb-2">
                  <div
                    v-for="av in filteredAvailableVariables"
                    :key="av.id"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-om-gray-50 cursor-pointer transition-colors"
                    @click="addVariable(previewVariant, av)"
                  >
                    <Plus :size="14" class="text-om-orange-500 shrink-0" />
                    <span class="text-sm text-om-gray-700">{{ av.name }}</span>
                    <Tag variant="outlined" size="sm">{{ av.type }}</Tag>
                  </div>
                  <div v-if="!filteredAvailableVariables.length" class="text-xs text-om-gray-400 px-3 py-2">No more variables available</div>
                </div>
                <button class="flex items-center gap-2 text-sm text-om-orange-500 font-medium hover:text-om-orange-600 cursor-pointer" @click="showAddVariableList = !showAddVariableList">
                  <Plus :size="16" />
                  Add variable
                </button>
              </div>
            </div>
            <!-- Coverage summary -->
            <div v-if="previewVariant?.variables.length" class="px-4 py-3 border-t border-om-gray-200 bg-om-gray-50 shrink-0">
              <div class="text-xs text-om-gray-400">Coverage</div>
              <div class="text-sm font-semibold text-om-gray-700">{{ variantCoverage }} of {{ variantTotal }} products</div>
            </div>
          </div>

          <!-- Right: Product page preview -->
          <div class="flex-1 overflow-y-auto p-6 bg-om-gray-200">
            <ProductPagePreview
              v-if="previewVariant"
              :placements="previewVariant.placements"
              :variables="previewVariant.variables"
              :active-variable-id="selectedVariableId"
              :active-variable-type="selectedVariableType"
              :benefit-position="benefitPosition"
              :hovered-variable-id="hoveredVariableId"
              :url="selectedProductPage"
              @assign="(areaId) => assignVariable(previewVariant, areaId)"
            />
          </div>
        </div>
      </div>

  <!-- Campaign detail view -->
  <DashboardLayout v-else active-menu-item="campaigns" @logo-click="handleLogoClick" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-2">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">PPO - Product image and benefit list</h1>
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
                  class="absolute right-0 mt-2 w-56 bg-white border border-om-gray-200 rounded-xl shadow-lg overflow-hidden z-10"
                >
                  <button
                    @click="handleDuplicate"
                    class="w-full px-4 py-2.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  >
                    Duplicate
                  </button>
                  <button
                    @click="handlePrioritySettings"
                    class="w-full px-4 py-2.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  >
                    Priority settings
                  </button>
                  <button
                    @click="handleChangeLog"
                    class="w-full px-4 py-2.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  >
                    Change log
                  </button>
                  <button
                    @click="handleArchive"
                    class="w-full px-4 py-2.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  >
                    Archive
                  </button>
                  <button
                    @click="handleEditSchedule"
                    class="w-full px-4 py-2.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  >
                    {{ scheduleSaved ? 'Edit schedule' : 'Add schedule' }}
                  </button>
                  <button
                    v-if="scheduleSaved"
                    @click="handleDeleteSchedule"
                    class="w-full px-4 py-2.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  >
                    Delete schedule
                  </button>
                  <div class="border-t border-om-gray-200"></div>
                  <button
                    @click="handleDelete"
                    class="w-full px-4 py-2.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
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
            @click="activeTab = 'Add to cart'"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-normal transition-all cursor-pointer',
              activeTab === 'Add to cart'
                ? 'bg-om-orange-100 text-om-orange-500'
                : 'bg-transparent text-om-gray-700 hover:bg-om-gray-100 hover:text-om-gray-600'
            ]"
          >
            Add to cart
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
          <div class="grid grid-cols-12 gap-4">
          <!-- Conversion Uplift -->
          <div class="col-span-3 pl-8 py-8">
            <div class="text-base text-om-gray-600 mb-3">Conversion uplift</div>
            <div class="flex items-end gap-2">
              <span class="text-[3rem] font-light text-om-gray-700 leading-none font-['Funnel_Sans']">62.50%</span>
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
                <div class="text-xs text-om-gray-400 mb-0.5">Visitors</div>
                <div class="text-xl font-semibold text-om-gray-700">3,812</div>
              </div>
              <svg width="12" height="44" viewBox="0 0 12 44" fill="none" class="text-om-gray-300">
                <path d="M2 4L10 22L2 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">Add to cart</div>
                <div class="text-xl font-semibold text-om-gray-700">294</div>
              </div>
              <svg width="12" height="44" viewBox="0 0 12 44" fill="none" class="text-om-gray-300">
                <path d="M2 4L10 22L2 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="flex-1">
                <div class="text-xs text-om-gray-400 mb-0.5">Add to cart rate</div>
                <div class="text-xl font-semibold text-om-gray-700">7.71%</div>
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

        <!-- Variants + Variables Section -->
        <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-5 pt-5 pb-5 pl-5 pr-8">
          <!-- Header -->
          <div class="grid grid-cols-[1fr_60px_80px_80px_80px_80px_100px_200px_36px] gap-3 text-xs text-om-gray-500 font-medium pb-3 border-b border-om-gray-100">
            <div>Variants</div>
            <div>Active</div>
            <div class="text-right">Visitors</div>
            <div class="text-right">ATC</div>
            <div class="text-right">ATC rate</div>
            <div class="text-right">Uplift</div>
            <div class="text-right">Chance to win</div>
            <div></div>
            <div></div>
          </div>

          <!-- Variant rows -->
          <div
            v-for="(variant, vi) in variants"
            :key="variant.id"
          >
            <!-- Variant row -->
            <div
              class="grid grid-cols-[1fr_60px_80px_80px_80px_80px_100px_200px_36px] gap-3 items-center py-3 group cursor-pointer"
              :class="vi < variants.length - 1 ? 'border-b border-om-gray-100' : ''"
              @click="openPreview(variant)"
            >
              <div class="flex items-center gap-2.5">
                <div class="min-w-0">
                  <span class="text-sm font-medium text-om-gray-700">{{ variant.name }}</span>
                  <div v-if="variant.variables.length" class="flex items-center gap-1.5 mt-1">
                    <Tag v-for="variable in variant.variables" :key="variable.id" variant="outlined" size="sm">{{ variable.type }}: {{ variable.name }}</Tag>
                  </div>
                </div>
              </div>
              <div @click.stop>
                <ToggleSwitch v-model="variant.active" />
              </div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ variant.visitors }}</div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ variant.addToCart }}</div>
              <div class="text-base font-semibold text-om-gray-700 text-right">{{ variant.atcRate }}</div>
              <div class="text-base font-semibold flex items-center gap-1 justify-end" :class="variant.uplift.startsWith('+') ? 'text-[#10B981]' : 'text-om-gray-400'">
                {{ variant.uplift }}
                <TrendingUp v-if="variant.uplift.startsWith('+')" :size="16" class="text-[#2CC896]" />
              </div>
              <div class="text-base font-semibold text-om-gray-400 text-right">{{ variant.chanceToWin }}</div>
              <div class="flex items-center justify-end whitespace-nowrap" @click.stop>
                <Tag v-if="variant.variables.length" variant="green">Ready for {{ readyCount(variant) }} products</Tag>
              </div>
              <div class="flex items-center justify-end" @click.stop>
                <Button variant="ghost" size="sm" icon-only class="opacity-0 group-hover:opacity-100 transition-opacity"><template #icon><MoreVertical :size="20" /></template></Button>
              </div>
            </div>

          </div>

          <!-- Add Variant Button -->
          <div class="mt-4">
            <button class="flex items-center gap-2 text-sm text-om-orange-500 font-medium hover:text-om-orange-600 cursor-pointer">
              <Plus :size="16" />
              Add A/B test variant
            </button>
          </div>
        </div>

        <!-- Campaign Settings Sections -->
        <div class="space-y-5">


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

        <!-- Settings Tab Content -->
        <div v-if="activeTab === 'Settings'" class="space-y-4">
          <!-- When would you like this campaign to show up? -->
          <Accordion
            title="When would you like this campaign to show up?"
            :open="openAccordion === 'showUp'"
            @toggle="toggleAccordion('showUp')"
          >
            <template #icon>
              <Clock :size="20" class="text-om-gray-600" />
            </template>
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
                <div class="trigger-timeline-add">
                  <button class="trigger-add-button">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="shrink-0">
                      <circle cx="11" cy="11" r="10" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M11 7v8M7 11h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Add new trigger
                  </button>
                </div>
              </div>

              <!-- Next button -->
              <div class="flex justify-end mt-6">
                <Button variant="primary" size="sm">Next to Frequency</Button>
              </div>
          </Accordion>

          <!-- How many times should this campaign appear? -->
          <Accordion
            title="How many times should this campaign appear?"
            :open="openAccordion === 'howMany'"
            @toggle="toggleAccordion('howMany')"
          >
            <template #icon>
              <RefreshCw :size="20" class="text-om-gray-600" />
            </template>
              <!-- How many times can this campaign appear -->
              <div class="mb-6">
                <h4 class="text-sm font-semibold text-om-gray-700 mb-3">
                  How many times <span class="font-normal text-om-gray-500">can this campaign appear to a visitor?</span>
                </h4>
                <div class="space-y-2.5">
                  <RadioButton v-model="frequencyType" value="unlimited" label="Unlimited Times" />
                  <RadioButton v-model="frequencyType" value="maximum">
                    Maximum
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
                    Min.
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
                <div class="space-y-2.5">
                  <Checkbox v-model="stopAfterClose" label="After a visitor has closed the campaign" />
                  <Checkbox v-model="stopAfterConvert" label="After a visitor has converted in this campaign" />
                </div>
              </div>

              <!-- Next button -->
              <div class="flex justify-end">
                <Button variant="primary" size="sm">Next to Targeting</Button>
              </div>
          </Accordion>

          <!-- Who should see this campaign? -->
          <Accordion
            title="Who should see this campaign?"
            :open="openAccordion === 'whoSee'"
            @toggle="toggleAccordion('whoSee')"
          >
            <template #icon>
              <Users :size="20" class="text-om-gray-600" />
            </template>
            <p class="text-sm text-om-gray-500">Settings for targeting...</p>
          </Accordion>

          <!-- Where you would like to send the subscribers and campaign data? -->
          <Accordion
            title="Where you would like to send the subscribers and campaign data?"
            :open="openAccordion === 'sendData'"
            @toggle="toggleAccordion('sendData')"
          >
            <template #icon>
              <Send :size="20" class="text-om-gray-600" />
            </template>
            <p class="text-sm text-om-gray-500">Settings for integrations and data sending...</p>
          </Accordion>

          <!-- Email Notification Toggle -->
          <div class="bg-om-gray-100 rounded-lg px-5 py-3">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-base font-semibold text-om-gray-700">Email notification</h4>
                <p class="text-sm text-om-gray-500 mt-1">Get notified when someone submits this campaign</p>
              </div>
              <ToggleSwitch v-model="emailNotification" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
  </DashboardLayout>

  <!-- Variable Generation Modal -->
  <transition name="modal">
    <div v-if="showVariableModal" class="fixed inset-0 z-50 flex items-start justify-center px-6 pt-8 pb-8" style="background-color: rgba(49, 80, 85, 0.65);" @click.self="showVariableModal = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-[1100px] max-h-[calc(100vh-64px)] flex flex-col" @click.stop>
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-om-gray-200 shrink-0">
          <div class="flex items-center gap-3">
            <Button v-if="modalSelectedProduct" variant="ghost" size="sm" icon-only @click="modalSelectedProduct = null">
              <template #icon><ArrowLeft :size="16" /></template>
            </Button>
            <h2 class="text-xl font-semibold text-om-gray-700">{{ modalSelectedProduct ? modalSelectedProduct.name : activeModalVariable?.name }}</h2>
          </div>
          <Button variant="ghost" size="sm" icon-only @click="showVariableModal = false"><template #icon><X :size="20" /></template></Button>
        </div>

        <!-- Product detail view -->
        <div v-if="modalSelectedProduct" class="flex-1 overflow-y-auto px-6 py-5">
          <!-- Two columns -->
          <div class="grid grid-cols-[300px_1fr] gap-4 mb-4 items-stretch" style="height: 400px;">
            <!-- Left: Original Product -->
            <div class="flex flex-col min-h-0">
              <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Original Product</p>
              <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col">
                <div class="aspect-square bg-om-gray-100 overflow-hidden">
                  <img src="/product1.jpg" class="w-full h-full object-cover" />
                </div>
                <div class="p-4 border-t border-om-gray-100">
                  <h3 class="text-sm font-semibold text-om-gray-700 mb-3">{{ modalSelectedProduct.name }}</h3>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-om-gray-400">{{ modalSelectedProduct.sku }}</span>
                    <span class="text-sm font-semibold text-om-gray-700">$159.00</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: AI Generated -->
            <div class="flex flex-col min-h-0">
              <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3 flex items-center gap-1.5">
                <Wand2 :size="16" class="text-om-orange-400" />
                AI Generated Image
              </p>
              <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden flex-1 relative">
                <template v-if="modalSelectedProduct.status === 'generated'">
                  <img src="/product2.png" class="w-full h-full object-contain" />
                </template>
                <template v-else>
                  <div class="w-full h-full flex flex-col items-center justify-center gap-2">
                    <ImageIcon :size="32" class="text-om-gray-300" />
                    <p class="text-sm text-om-gray-400">Pending generation</p>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Prompt Editor -->
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-semibold text-om-gray-700">Edit the prompt to customize the generation for this product.</h3>
              <Button variant="primary" size="sm">
                <template #icon><Sparkles :size="13" /></template>
                Regenerate
              </Button>
            </div>
            <textarea
              v-model="modalPromptText"
              rows="3"
              class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
            />
            <div class="flex justify-end mt-2">
              <Button v-if="!modalProductShowAdvanced" variant="ghost" size="sm" @click="modalProductShowAdvanced = true">
                Advanced Settings <ChevronDown :size="14" />
              </Button>
            </div>

            <!-- Advanced Settings -->
            <div v-if="modalProductShowAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">
              <div class="grid grid-cols-2 gap-3 items-stretch">
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <Tag>Model: {{ modalModel }}</Tag>
                    <Tag>Ratio: {{ modalRatio }}</Tag>
                  </div>
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <p class="text-xs text-om-gray-500">Usage location</p>
                  <div class="grid grid-cols-2 mt-0.5">
                    <RadioButton v-model="modalPageType" value="product" label="Product page" />
                    <RadioButton v-model="modalPageType" value="popup" label="Popup/Embedded" />
                  </div>
                </div>
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <p class="text-xs text-om-gray-500">Available data sources</p>
                <div class="flex flex-wrap gap-1.5">
                  <Tag v-for="src in ['title', 'description', 'image_url', 'price', 'category']" :key="src" variant="orange">{{ src }}</Tag>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 items-stretch">
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                  <ToggleSwitch v-model="modalAutoGenerate" />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                  <input v-model="modalMinDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white shrink-0" />
                </div>
              </div>
              <!-- Source images -->
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <p class="text-xs text-om-gray-500">Source images</p>
                <div class="flex gap-2 flex-wrap">
                  <div
                    v-for="img in sourceImages"
                    :key="img.id"
                    class="relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-150 shrink-0"
                    :class="img.selected ? 'border-om-orange-500 shadow-[0_0_0_2px_#FBD9CE]' : 'border-om-gray-200 hover:border-om-gray-300'"
                    @click="img.selected = !img.selected"
                  >
                    <img :src="img.src" class="w-full h-full object-cover" />
                    <div v-if="img.selected" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-om-orange-500 flex items-center justify-center">
                      <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <Button variant="ghost" size="sm" @click="modalProductShowAdvanced = false">
                  Basic Settings <ChevronUp :size="14" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- List view -->
        <template v-else>
        <!-- Tabs -->
        <div class="flex items-center border-b border-om-gray-200 px-6 shrink-0">
          <button
            v-for="tab in modalTabs"
            :key="tab"
            class="px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer"
            :class="modalTab === tab ? 'text-om-orange-500' : 'text-om-gray-500 hover:text-om-gray-700'"
            @click="modalTab = tab"
          >
            {{ tab }}
            <span v-if="modalTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-om-orange-500"></span>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-5">

          <!-- Settings tab -->
          <div v-if="modalTab === 'Settings'">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold text-om-gray-700">Edit prompt</h2>
              <div class="relative">
                <Button variant="primary" size="sm" @click.stop="showModalSaveMenu = !showModalSaveMenu">
                  Save
                  <ChevronDown :size="14" />
                </Button>
                <div v-if="showModalSaveMenu" class="fixed inset-0 z-40" @click="showModalSaveMenu = false" />
                <div
                  v-if="showModalSaveMenu"
                  class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[380px] overflow-hidden"
                >
                  <button
                    class="w-full flex items-center px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer border-b border-om-gray-100"
                    @click="showModalSaveMenu = false"
                  >Save as new</button>
                  <button
                    class="w-full flex items-center justify-between px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                    @click="showModalSaveMenu = false"
                  >
                    <span class="text-left whitespace-nowrap">Save &amp; regenerate {{ modalGeneratedCount }} products</span>
                    <span class="flex items-center gap-1.5 text-om-orange-500 font-medium tabular-nums whitespace-nowrap">{{ modalGeneratedCount * 20 }} credits</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
              <p class="text-sm text-om-gray-500 mb-4">Edit the prompt to customize the generation output. Save it as a new variable, or overwrite the already generated images with the updated settings.</p>
              <textarea
                v-model="modalPromptText"
                rows="4"
                class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
              />
              <div class="flex justify-end mt-2">
                <Button v-if="!modalShowAdvanced" variant="ghost" size="sm" @click="modalShowAdvanced = true">
                  Advanced Settings <ChevronDown :size="14" />
                </Button>
              </div>

              <!-- Advanced Settings (collapsed by default) -->
              <div v-if="modalShowAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">
                <div class="grid grid-cols-2 gap-3 items-stretch">
                  <div class="bg-om-gray-50 rounded-xl px-4 py-3 min-w-0 flex items-end gap-3">
                    <div class="flex flex-col gap-1 flex-1 min-w-0">
                      <p class="text-xs text-om-gray-500">Model</p>
                      <Dropdown v-model="modalModel" :options="['Nano Banana Pro', 'Flux Pro', 'DALL-E 3']" size="sm" />
                    </div>
                    <div class="flex flex-col gap-1 flex-1 min-w-0">
                      <p class="text-xs text-om-gray-500">Ratio</p>
                      <Dropdown v-model="modalRatio" :options="['16:9', '1:1', '9:16', '4:3']" size="sm" />
                    </div>
                  </div>
                  <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                    <p class="text-xs text-om-gray-500">Usage location</p>
                    <div class="grid grid-cols-2 mt-0.5">
                      <RadioButton v-model="modalPageType" value="product" label="Product page" />
                      <RadioButton v-model="modalPageType" value="popup" label="Popup/Embedded" />
                    </div>
                  </div>
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <p class="text-xs text-om-gray-500">Available data sources</p>
                  <div class="flex flex-wrap gap-1.5">
                    <Tag v-for="src in ['title', 'description', 'image_url', 'price', 'category']" :key="src" variant="orange">{{ src }}</Tag>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                    <ToggleSwitch v-model="modalAutoGenerate" />
                  </div>
                  <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                    <input v-model="modalMinDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white shrink-0" />
                  </div>
                  </div>
                <!-- Source images -->
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <p class="text-xs text-om-gray-500">Source images</p>
                  <div class="flex gap-2 flex-wrap">
                    <div
                      v-for="img in sourceImages"
                      :key="img.id"
                      class="relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-150 shrink-0"
                      :class="img.selected ? 'border-om-orange-500 shadow-[0_0_0_2px_#FBD9CE]' : 'border-om-gray-200 hover:border-om-gray-300'"
                      @click="img.selected = !img.selected"
                    >
                      <img :src="img.src" class="w-full h-full object-cover" />
                      <div v-if="img.selected" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-om-orange-500 flex items-center justify-center">
                        <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end">
                  <Button variant="ghost" size="sm" @click="modalShowAdvanced = false">
                    Basic Settings <ChevronUp :size="14" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected / Generated tabs -->
          <template v-else>
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-4">
            <div v-if="modalTab === 'Selected'" class="flex items-center gap-2">
              <div class="relative">
                <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-700" />
                <input
                  v-model="modalSearch"
                  type="text"
                  placeholder="Search products..."
                  class="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 w-44"
                />
              </div>
              <Button variant="secondary" size="sm">
                <template #icon><SlidersHorizontal :size="15" /></template>
                Filters
              </Button>
              <Button variant="secondary" size="sm">
                <template #icon><Upload :size="15" /></template>
                Import CSV
              </Button>
              <Button variant="secondary" size="sm">
                Popularity
              </Button>
            </div>
            <p v-else class="text-sm text-om-gray-400">Showing 1 to {{ Math.min(20, modalTotalCount) }} of {{ modalTotalCount }} entries ({{ modalGeneratedCount }} generated)</p>
            <div v-if="modalTab === 'Selected'" class="relative">
              <Button variant="primary" size="sm" @click.stop="showModalGenMenu = !showModalGenMenu">
                Generate
                <ChevronDown :size="14" />
              </Button>
              <div v-if="showModalGenMenu" class="fixed inset-0 z-40" @click="showModalGenMenu = false" />
              <div
                v-if="showModalGenMenu"
                class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[400px] overflow-hidden"
              >
                <button
                  class="w-full flex items-center justify-between px-4 py-3 text-sm border-b border-om-gray-100 transition-colors"
                  :class="modalSelected.length > 0 ? 'hover:bg-om-gray-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                  @click="modalSelected.length > 0 && (showModalGenMenu = false)"
                >
                  <span class="text-om-gray-700 text-left">Generate for selected ({{ modalSelected.length }})</span>
                  <span class="flex items-center gap-1.5 text-om-orange-500 font-medium tabular-nums whitespace-nowrap">{{ modalSelected.length * 20 }} credits</span>
                </button>
                <button
                  v-for="count in [1, 10, 25, 100]"
                  :key="count"
                  class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer border-b border-om-gray-100"
                  @click="showModalGenMenu = false"
                >
                  <span class="text-om-gray-700 text-left">Generate for {{ count }} products</span>
                  <span class="flex items-center gap-1.5 text-om-orange-500 font-medium tabular-nums whitespace-nowrap">{{ count * 20 }} credits</span>
                </button>
                <button
                  class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer"
                  @click="showModalGenMenu = false"
                >
                  <span class="text-om-gray-700 text-left">Generate for pending only ({{ modalTotalCount - modalGeneratedCount }})</span>
                  <span class="flex items-center gap-1.5 text-om-orange-500 font-medium tabular-nums whitespace-nowrap">{{ (modalTotalCount - modalGeneratedCount) * 20 }} credits</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="product in modalProductsPaged"
              :key="product.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
              @click="modalSelectedProduct = product"
            >
              <!-- Checkbox -->
              <div class="flex items-center pr-3 shrink-0" @click.stop>
                <Checkbox :model-value="modalSelected.includes(product.id)" @update:model-value="v => v ? modalSelected.push(product.id) : modalSelected.splice(modalSelected.indexOf(product.id), 1)" />
              </div>
              <!-- Left: product -->
              <div class="flex items-center gap-3 w-1/2 pr-4">
                <div class="aspect-square h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                  <img src="/product1.jpg" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-om-gray-700">{{ product.name }}</p>
                  <p class="text-xs text-om-gray-400 mt-0.5">{{ product.sku }}</p>
                </div>
              </div>

              <!-- Divider -->
              <div class="w-px bg-om-gray-100 shrink-0 self-stretch"></div>

              <!-- Right: output -->
              <div class="flex items-center gap-4 w-1/2 pl-4">
                <div
                  class="rounded-lg shrink-0 overflow-hidden"
                  style="aspect-ratio: 16/9; height: 96px;"
                  :class="product.status === 'generated' ? '' : 'border-2 border-dashed border-om-gray-200 flex items-center justify-center'"
                >
                  <img v-if="product.status === 'generated'" src="/product2.png" class="w-full h-full object-cover" />
                  <ImageIcon v-else :size="20" class="text-om-gray-300" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-0.5">Output</p>
                  <p v-if="product.status === 'generated'" class="text-sm text-om-gray-600">16:9 Image</p>
                  <p v-else class="text-sm text-om-gray-400">Pending generation</p>
                </div>
                <Tag v-if="product.status === 'generated'" variant="green" class="shrink-0">Ready to use</Tag>
                <Tag v-else variant="gray-muted" class="shrink-0">Queued</Tag>
              </div>
            </div>
          </div>
          </template>
        </div>

        <!-- Sticky Pagination -->
        <div v-if="!modalSelectedProduct && modalTab !== 'Settings'" class="flex items-center justify-between px-6 py-3 border-t border-om-gray-200 bg-white shrink-0 rounded-b-xl">
          <span class="text-sm text-om-gray-400">Showing {{ (modalPage - 1) * 20 + 1 }} to {{ Math.min(modalPage * 20, modalTotalCount) }} of {{ modalTotalCount }} entries</span>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm" :disabled="modalPage === 1" @click="modalPage--">Previous</Button>
            <template v-for="p in modalTotalPages" :key="p">
              <Button v-if="p <= 3 || p === modalTotalPages" variant="ghost" size="sm" :active="p === modalPage" @click="modalPage = p">{{ p }}</Button>
              <span v-else-if="p === 4 && modalTotalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
            </template>
            <Button variant="ghost" size="sm" :disabled="modalPage === modalTotalPages" @click="modalPage++">Next</Button>
          </div>
        </div>
        </template>
      </div>
    </div>
  </transition>

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
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { ChevronDown, ChevronUp, ChevronRight, TrendingUp, Calendar, Target, MoreVertical, GraduationCap, Clock, RefreshCw, Users, Send, Monitor, Smartphone, X, Plus, ImageIcon, Search, SlidersHorizontal, Upload, ArrowLeft, Wand2, Sparkles, Eye, SquareDashedMousePointer, Trash2, Type, Pencil } from 'lucide-vue-next'
import Tag from '../components/shared/Tag.vue'
import ProductPagePreview from '../components/ppo/ProductPagePreview.vue'
import Button from '../components/shared/Button.vue'
import Chip from '../components/shared/Chip.vue'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Accordion from '../components/shared/Accordion.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import RadioButton from '../components/shared/RadioButton.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import ScrollTimePicker from '../components/shared/ScrollTimePicker.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'

const props = defineProps({
  showPlacement: { type: Boolean, default: false },
})

const emit = defineEmits(['menu-click', 'navigate'])

const isChatOpen = ref(false)

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
const isActive = ref(true)

// Settings tab - Accordion state
const openAccordion = ref(null)
const emailNotification = ref(false)

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

// Variants with inline variables
const variants = reactive([
  {
    id: 'v1',
    name: 'Image & Benefit list',
    active: true,
    expanded: true,
    visitors: '12,593',
    addToCart: '650',
    atcRate: '7.25%',
    uplift: '+0.77%',
    chanceToWin: '91.2%',
    variables: [
      { id: 0, name: 'AI lifestyle image 1', type: 'Image', generated: '128 / 467', status: 'Ready to use', lastUpdated: 'Mar 13, 2026' },
      { id: 8, name: 'Benefit list', type: 'Text', generated: '100 / 467', status: 'Ready to use', lastUpdated: 'Mar 16, 2026' },
    ],
    placements: {
      'product-image': 0,
      'benefit-list': 8,
    },
  },
  {
    id: 'v2',
    name: 'Control',
    active: true,
    expanded: false,
    placements: {},
    visitors: '12,593',
    addToCart: '412',
    atcRate: '3.27%',
    uplift: '-',
    chanceToWin: '-',
    variables: [],
  },
])

const minGenerated = (variant) => {
  if (!variant.variables.length) return ''
  const counts = variant.variables.map(v => {
    const parts = v.generated.split(' / ')
    return parseInt(parts[0]) || 0
  })
  const totals = variant.variables.map(v => {
    const parts = v.generated.split(' / ')
    return parseInt(parts[1]) || 0
  })
  return `${Math.min(...counts)} / ${totals[0]}`
}

const readyCount = (variant) => {
  if (!variant.variables.length) return 0
  const counts = variant.variables.map(v => parseInt(v.generated.split(' / ')[0]) || 0)
  return Math.min(...counts)
}

const totalProducts = (variant) => {
  if (!variant.variables.length) return 0
  return parseInt(variant.variables[0].generated.split(' / ')[1]) || 0
}

const generatedPercent = (variant) => {
  if (!variant.variables.length) return 0
  const counts = variant.variables.map(v => parseInt(v.generated.split(' / ')[0]) || 0)
  const totals = variant.variables.map(v => parseInt(v.generated.split(' / ')[1]) || 0)
  const min = Math.min(...counts)
  const total = totals[0]
  return total > 0 ? Math.round((min / total) * 100) : 0
}

// Area type definitions
const AREA_TYPES = {
  'product-image': 'Image',
  'headline': 'Text',
  'subheadline': 'Text',
  'product-sentence': 'Text',
  'summary': 'Text',
  'benefit-list': 'Text',
  'product-summary': 'Mixed',
}

// Placement selection state
const selectedVariableId = ref(null)
const selectedVariableType = ref(null)
const selectedVariantId = ref(null)
const hoveredVariableId = ref(null)

// Product page selector
const productPageOptions = [
  { value: 'https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33', label: "Shanky's Whip Black Ír whiskeylikőr" },
  { value: 'https://www.whiskynet.hu/jameson-ír-whiskey-07l-40', label: 'Jameson Ír Whiskey' },
  { value: 'https://www.whiskynet.hu/jack-daniels-tennessee-whiskey-07l-40', label: "Jack Daniel's Tennessee Whiskey" },
]
const selectedProductPage = ref(productPageOptions[0].value)

// Benefit list position
const benefitPosition = ref('benefit-list-1')
const benefitPositions = [
  { id: 'benefit-list-1', label: 'Below product title' },
  { id: 'benefit-list-2', label: 'Below product details' },
  { id: 'benefit-list-3', label: 'Below description' },
]

// Available variables library (not yet assigned to variant)
const availableVariables = [
  { id: 10, name: 'AI lifestyle image 2', type: 'Image', generated: '0 / 467', status: 'Not started', lastUpdated: '-' },
  { id: 11, name: 'Headline v2', type: 'Text', generated: '0 / 467', status: 'Not started', lastUpdated: '-' },
  { id: 12, name: 'Product description', type: 'Text', generated: '0 / 467', status: 'Not started', lastUpdated: '-' },
  { id: 13, name: 'Seasonal banner', type: 'Image', generated: '0 / 467', status: 'Not started', lastUpdated: '-' },
]
const showAddVariableList = ref(false)

const filteredAvailableVariables = computed(() => {
  if (!previewVariant.value) return availableVariables
  const usedIds = new Set(previewVariant.value.variables.map(v => v.id))
  return availableVariables.filter(v => !usedIds.has(v.id))
})

const addVariable = (variant, av) => {
  variant.variables.push({ ...av })
  showAddVariableList.value = false
}

const variantCoverage = computed(() => {
  if (!previewVariant.value?.variables.length) return 0
  return Math.min(...previewVariant.value.variables.map(v => parseInt(v.generated.split(' / ')[0]) || 0))
})
const variantTotal = computed(() => {
  if (!previewVariant.value?.variables.length) return 0
  return parseInt(previewVariant.value.variables[0].generated.split(' / ')[1]) || 0
})

const removeVariable = (variant, variableId) => {
  variant.variables = variant.variables.filter(v => v.id !== variableId)
  // Remove placements for this variable
  for (const [areaId, varId] of Object.entries(variant.placements)) {
    if (varId === variableId) delete variant.placements[areaId]
  }
  if (selectedVariableId.value === variableId) {
    selectedVariableId.value = null
    selectedVariableType.value = null
  }
}

const isPreviewOpen = ref(props.showPlacement)
const previewVariant = ref(props.showPlacement ? variants[0] : null)

const openPreview = (variant) => {
  previewVariant.value = variant
  isPreviewOpen.value = true
  window.location.hash = '/ppo-placement'
}

const closePreview = () => {
  isPreviewOpen.value = false
  window.location.hash = '/ppo-campaign-detail'
}

const selectVariable = (variant, variable) => {
  if (selectedVariableId.value === variable.id && selectedVariantId.value === variant.id) {
    selectedVariableId.value = null
    selectedVariableType.value = null
    selectedVariantId.value = null
  } else {
    selectedVariableId.value = variable.id
    selectedVariableType.value = variable.type
    selectedVariantId.value = variant.id
  }
}

const assignVariable = (variant, areaId) => {
  if (selectedVariableId.value === null || selectedVariantId.value !== variant.id) return
  const areaType = AREA_TYPES[areaId]
  if (areaType !== 'Mixed' && areaType !== selectedVariableType.value) return
  if (variant.placements[areaId] === selectedVariableId.value) {
    delete variant.placements[areaId]
  } else {
    variant.placements[areaId] = selectedVariableId.value
  }
}

const hasPlacement = (variant, variableId) => {
  return Object.values(variant.placements).includes(variableId)
}

const placementCount = (variant) => {
  return Object.keys(variant.placements).length
}

// Variable generation modal
const showVariableModal = ref(false)
const activeModalVariable = ref(null)
const modalTab = ref('Selected')
const modalTabs = ['Selected', 'Generated', 'Settings']
const modalSelected = ref([])

const allProductNames = [
  { name: 'Premium Wireless Headphones', sku: 'SKU: WH-1000XM5' },
  { name: 'Ergonomic Office Chair', sku: 'SKU: EOC-PRO-2' },
  { name: 'Organic Cotton T-Shirt', sku: 'SKU: OCT-BLK-M' },
  { name: 'DJI Osmo Mobile 7', sku: 'SKU: OM-7-SE' },
  { name: 'Vintage Leather Backpack', sku: 'SKU: VLB-BRN' },
  { name: 'Smart Home Hub Pro', sku: 'SKU: SHH-PRO-3' },
  { name: 'Bluetooth Speaker Mini', sku: 'SKU: BSM-100' },
  { name: 'Running Shoes Pro', sku: 'SKU: RSP-42' },
]

const modalProducts = computed(() => {
  if (!activeModalVariable.value) return []
  const parts = activeModalVariable.value.generated.split(' / ')
  const generated = parseInt(parts[0]) || 0
  const total = parseInt(parts[1]) || 0
  return Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    name: allProductNames[i % allProductNames.length].name,
    sku: allProductNames[i % allProductNames.length].sku,
    status: i < generated ? 'generated' : 'pending',
  }))
})

const modalPage = ref(1)
const modalTotalPages = computed(() => Math.ceil(modalTotalCount.value / 20))
const modalProductsPaged = computed(() => {
  const start = (modalPage.value - 1) * 20
  return modalProducts.value.slice(start, start + 20)
})
const modalGeneratedCount = computed(() => modalProducts.value.filter(p => p.status === 'generated').length)
const modalTotalCount = computed(() => modalProducts.value.length)

const showModalGenMenu = ref(false)
const showModalSaveMenu = ref(false)
const modalShowAdvanced = ref(false)
const modalSearch = ref('')
const modalSelectedProduct = ref(null)
const modalProductShowAdvanced = ref(false)
const modalUseProductImage = ref(true)
const sourceImages = reactive([
  { id: 1, src: '/product1.jpg', selected: true },
  { id: 2, src: '/product2.png', selected: false },
  { id: 3, src: '/product1.jpg', selected: false },
])
const modalPromptText = ref('Create a lifestyle product image featuring {{title}} in a natural setting. The image should be high-quality, well-lit, and show the product in use.')
const modalModel = ref('Nano Banana Pro')
const modalRatio = ref('16:9')
const modalPageType = ref('product')
const modalAutoGenerate = ref(true)
const modalMinDescLength = ref(100)
const modalNegativePrompt = ref(false)

const updateHash = () => {
  if (showVariableModal.value && modalSelectedProduct.value) {
    window.location.hash = `#/ppo-campaign-detail/variable/${activeModalVariable.value.id}/product/${modalSelectedProduct.value.id}`
  } else if (showVariableModal.value && activeModalVariable.value) {
    window.location.hash = `#/ppo-campaign-detail/variable/${activeModalVariable.value.id}`
  } else {
    window.location.hash = '#/ppo-campaign-detail'
  }
}

const openVariableModal = (variable) => {
  activeModalVariable.value = variable
  modalTab.value = 'Selected'
  modalSelected.value = []
  modalSelectedProduct.value = null
  modalPage.value = 1
  showVariableModal.value = true
  updateHash()
}

watch(modalSelectedProduct, () => updateHash())

watch(showVariableModal, (val) => {
  if (!val) {
    window.location.hash = '#/ppo-campaign-detail'
  }
})

const handleHashChange = () => {
  const hash = window.location.hash
  if (hash === '#/ppo-campaign-detail' || hash === '#/ppo-campaign-detail/') {
    showVariableModal.value = false
    modalSelectedProduct.value = null
  }
}

onMounted(() => {
  window.addEventListener('popstate', handleHashChange)
  // Check if URL already has a variable/product path
  const hash = window.location.hash
  const varMatch = hash.match(/\/variable\/(\d+)/)
  if (varMatch) {
    const varId = parseInt(varMatch[1])
    const allVars = variants.flatMap(v => v.variables)
    const variable = allVars.find(v => v.id === varId)
    if (variable) {
      openVariableModal(variable)
      const prodMatch = hash.match(/\/product\/(\d+)/)
      if (prodMatch) {
        const prodId = parseInt(prodMatch[1])
        const product = modalProducts.value.find(p => p.id === prodId)
        if (product) modalSelectedProduct.value = product
      }
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('popstate', handleHashChange)
})

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

const selectedGoal = ref('Add to cart')
const goalOptions = ['Submit', 'Order', 'Add to cart', 'Email capture', 'Phone capture']

const handleLogoClick = () => {
  // Navigate back to home
  window.location.reload()
}

// Kebab menu state
const isKebabMenuOpen = ref(false)

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
const handleDuplicate = () => {
  console.log('Duplicate campaign')
  isKebabMenuOpen.value = false
}

const handlePrioritySettings = () => {
  console.log('Open priority settings')
  isKebabMenuOpen.value = false
}

const handleChangeLog = () => {
  console.log('Open change log')
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

/* Continuous vertical line (trunk) */
.trigger-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 21px;
  width: 3px;
  background: #D5D8DD;
  border-radius: 2px;
}

/* Timeline items with horizontal branch */
.trigger-timeline-item {
  position: relative;
}

.trigger-timeline-item::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 50%;
  width: 24px;
  height: 3px;
  background: #D5D8DD;
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
