<template>
  <!-- Step 6 - Dashboard Layout with Sidebar -->
  <div v-if="showProductList || showCampaignPage" class="h-screen bg-[#F9FAFB] flex overflow-hidden relative">
    <!-- Left Sidebar -->
    <aside class="fixed left-0 top-0 h-screen w-19 bg-white flex flex-col items-center pt-6 pb-4 z-30 border-r border-[#E5E7EB]">
      <!-- Logo -->
      <div class="w-7 h-7 mb-5 flex items-center justify-center">
        <img src="/optimonk_logo.svg" alt="OptiMonk" class="w-full h-full" />
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 flex flex-col w-full px-1 gap-1">
        <button
          v-for="item in sidebarMenuItems"
          :key="item.id"
          :class="[
            'w-full py-2 flex flex-col items-center gap-0.5 transition-colors cursor-pointer rounded-xl',
            item.id === 'campaigns'
              ? 'bg-om-orange-100 text-om-orange-500'
              : 'text-om-gray-500 hover:bg-om-gray-100 hover:text-om-gray-600'
          ]"
        >
          <component :is="item.icon" :size="20" />
          <span class="text-[10px] font-medium">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Bottom section -->
      <div class="flex flex-col items-center gap-3 mt-auto pb-4">
        <button class="w-10 h-10 rounded-full flex items-center justify-center text-[#8F97A4] hover:text-[#505763] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
          <Bell :size="24" />
        </button>
        <button class="w-7 h-7 rounded-full bg-[#8F97A4] flex items-center justify-center text-white text-xs font-medium overflow-hidden hover:ring-2 hover:ring-[#8F97A4]/30 transition-all cursor-pointer">
          <span>TS</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="w-full ml-19 overflow-y-auto">
      <!-- Step 6 - Product List -->
      <div v-if="showProductList" class="w-full px-12 py-8">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-2xl font-semibold text-om-gray-700 mb-2">
              Generated images for the Product Value Spotlight campaign
            </h1>
            <p class="text-om-gray-500 text-sm">
              300 products
            </p>
          </div>
          <Button variant="primary" size="md" @click="handleDone">
            Done
          </Button>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="bg-white rounded-xl border border-om-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="cursor-pointer" @click="selectedProduct = product">
              <img
                :src="product.desktop"
                :alt="`${product.name} Desktop`"
                class="w-full h-auto"
              />
            </div>
            <div class="px-3 py-3 flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-lg bg-om-gray-200 shrink-0"></div>
              <span class="text-sm text-om-gray-700 font-medium truncate">{{ product.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 7 - Campaign Page -->
      <div v-if="showCampaignPage" class="ml-5 mt-6 mr-6 mb-6">
        <div class="w-full max-w-[1400px] mx-auto">
          <!-- Header + Tabs -->
          <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-6 mb-4">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Product Value Spotlight</h1>
                <p class="text-xs text-om-gray-400">www.whiskynet.hu</p>
              </div>
              <div class="flex items-center gap-2.5">
                <Button variant="ghost" size="sm" icon-only>
                  <template #icon><Calendar :size="18" /></template>
                </Button>
                <button :class="['px-3.5 py-1.5 rounded-lg flex items-center gap-2.5 text-sm font-medium cursor-pointer text-om-gray-700', isActive ? 'bg-[#D6F5EC]' : 'bg-om-gray-100']">
                  <span>{{ isActive ? 'Active' : 'Inactive' }}</span>
                  <ToggleSwitch v-model="isActive" @click.stop />
                </button>
                <Button variant="ghost" size="sm" icon-only>
                  <template #icon><MoreVertical :size="18" /></template>
                </Button>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="px-4 py-2 bg-om-orange-100 text-om-orange-500 rounded-xl text-sm font-normal transition-all cursor-pointer">Overview</button>
              <button class="px-4 py-2 bg-transparent text-om-gray-700 rounded-xl text-sm font-normal hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">Settings</button>
              <button class="px-4 py-2 bg-transparent text-om-gray-700 rounded-xl text-sm font-normal hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">Submits</button>
              <button class="px-4 py-2 bg-transparent text-om-gray-700 rounded-xl text-sm font-normal hover:bg-om-gray-100 hover:text-om-gray-600 transition-all cursor-pointer">Analytics</button>
            </div>
          </div>

          <!-- Metrics Section -->
          <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] mb-4 relative">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3 pl-8 py-8">
                <div class="text-base text-om-gray-600 mb-3">Conversion uplift</div>
                <div class="flex items-end gap-2">
                  <span class="text-[3rem] font-light text-om-gray-700 leading-none font-['Funnel_Sans']">84.23%</span>
                  <TrendingUp :size="24" class="text-[#2CC896]" />
                </div>
              </div>
              <div class="col-span-1 flex justify-center relative">
                <div class="w-px bg-om-gray-200 absolute inset-y-0"></div>
              </div>
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
              <div class="col-span-3 flex flex-col justify-end gap-2.5 pr-8 py-8">
                <Dropdown v-model="selectedTimePeriod" :options="timePeriodOptions">
                  <template #icon>
                    <Calendar :size="18" class="text-om-gray-400" />
                  </template>
                </Dropdown>
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
            <div class="space-y-0">
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
                  <div class="w-36 h-24 bg-om-gray-100 rounded overflow-hidden shrink-0 border border-om-gray-200">
                    <img src="/image-with-badge1.jpg" alt="Variant A" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm font-medium text-om-gray-700">Original</span>
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
                <div class="col-span-1 flex items-center justify-end w-fit justify-self-end">
                  <Button variant="ghost" size="sm" icon-only class="opacity-0 group-hover:opacity-100 transition-opacity">
                    <template #icon><MoreVertical :size="20" /></template>
                  </Button>
                </div>
              </div>
              <!-- Variant Row 2 -->
              <div class="grid grid-cols-12 gap-1 items-center py-3 group">
                <div class="col-span-5 flex items-center gap-2.5">
                  <div class="w-36 h-24 bg-om-gray-100 rounded overflow-hidden shrink-0 border border-om-gray-200">
                    <img src="/image-with-badge2.jpg" alt="Variant B" class="w-full h-full object-cover" />
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
                <div class="col-span-1 flex items-center justify-end w-fit justify-self-end">
                  <Button variant="ghost" size="sm" icon-only class="opacity-0 group-hover:opacity-100 transition-opacity">
                    <template #icon><MoreVertical :size="20" /></template>
                  </Button>
                </div>
              </div>
            </div>
            <button class="mt-4 flex items-center gap-2 text-sm text-om-orange-500 font-medium hover:text-om-orange-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="8" cy="8" r="7"/>
                <path d="M8 5v6M5 8h6"/>
              </svg>
              Add A/B test variant
            </button>
          </div>

          <!-- Campaign Settings -->
          <div class="space-y-4">
            <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
              <h3 class="text-base font-semibold text-om-gray-700 mb-4">When will the popup show up</h3>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="10" height="10" rx="2"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-om-gray-700">On exit-intent</div>
                    <div class="text-xs text-om-gray-500 mt-0.5">When a visitor is about to leave your site</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="10" height="10" rx="2"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-om-gray-700">After x seconds of inactivity</div>
                    <div class="text-xs text-om-gray-500 mt-0.5">When a visitor is inactive for <span class="font-medium text-om-gray-700">20 seconds</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
              <h3 class="text-base font-semibold text-om-gray-700 mb-4">How often can it appear</h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 bg-om-orange-50 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#ED5A29" stroke-width="1.5"><circle cx="7" cy="7" r="5"/><path d="M7 4v3l2 2"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-om-gray-700">How many times</div>
                    <div class="text-xs text-om-gray-500 mt-0.5">Maximum 3 times</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 2v10M10 5l-3-3-3 3"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-om-gray-700">How frequently</div>
                    <div class="text-xs text-om-gray-500 mt-0.5">Max 1 session(s) between two impressions</div>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 bg-om-gray-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="10" height="10" rx="2"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-om-gray-700">Stop showing</div>
                    <div class="text-xs text-om-gray-500 mt-0.5">After a visitor has converted in this campaign</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-5">
              <h3 class="text-base font-semibold text-om-gray-700 mb-4">Integrations</h3>
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-[#FFE01B] rounded flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#000"><path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm4.1 13.8l-2.8-1.7v-5h1.3v4.3l2.4 1.4-.9.9z"/></svg>
                </div>
                <span class="text-sm font-medium text-om-gray-700">Mailchimp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Product Preview Modal -->
    <div v-if="selectedProduct" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="selectedProduct = null">
      <div class="relative">
        <div class="flex gap-3 rounded-2xl border border-om-gray-200 bg-om-gray-50 p-3">
          <img
            :src="selectedProduct.desktop"
            :alt="`${selectedProduct.name} Desktop`"
            class="rounded-xl shrink-0"
            style="height: 400px; width: auto;"
          />
          <img
            :src="selectedProduct.mobile"
            :alt="`${selectedProduct.name} Mobile`"
            class="rounded-xl shrink-0"
            style="height: 400px; width: auto;"
          />
        </div>
        <p class="text-center text-sm text-om-gray-600 mt-3">{{ selectedProduct.name }}</p>
      </div>
    </div>
  </div>

  <!-- Steps 1-5 Layout -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center relative">
    <!-- Optimonk Logo + Back -->
    <div class="absolute top-6 left-6 flex items-center gap-1.5">
      <img
        src="/optimonk_logo.svg"
        alt="OptiMonk"
        class="h-10"
      />
      <button
        @click="handleBack"
        class="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-om-gray-700 hover:text-om-gray-900 rounded-lg hover:bg-om-gray-50 transition-colors cursor-pointer"
      >
        <ChevronLeft :size="16" />
        Back
      </button>
    </div>

    <div :class="['w-full px-8', !showImage && !showPreview && !showStep3 && !showPhotoSelection ? 'max-w-2xl' : '']">
      <!-- Badge Style Selection Section (Step 1) -->
      <div v-if="!showPhotoSelection && !showStep3 && !showPreview && !showSuccessModal" class="-mt-24">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6 text-center">
          Choose badge style
        </h1>
        <div class="flex gap-6 justify-center">
          <!-- Uniform Store Brand -->
          <div class="flex flex-col items-center">
            <button
              @click="handleBadgeSelect('uniform')"
              class="image-card group relative rounded-xl overflow-hidden border-2 border-om-gray-200 transition-all cursor-pointer hover:shadow-lg hover:scale-105 outline-none focus:outline-none focus-visible:ring-0 focus-visible:border-om-gray-200 hover:border-om-gray-200"
              style="width: 280px;"
            >
              <img
                src="/nikka_4.jpg"
                alt="Uniform Store Brand"
                class="w-full h-auto"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
            </button>
            <p class="text-base font-medium text-om-gray-700 mt-3 text-center">Uniform Store Brand</p>
          </div>

          <!-- Dynamic Product Brand -->
          <div class="flex flex-col items-center">
            <button
              @click="handleBadgeSelect('dynamic')"
              class="image-card group relative rounded-xl overflow-hidden border-2 border-om-gray-200 transition-all cursor-pointer hover:shadow-lg hover:scale-105 outline-none focus:outline-none focus-visible:ring-0 focus-visible:border-om-gray-200 hover:border-om-gray-200"
              style="width: 280px;"
            >
              <img
                src="/nikka_2.jpg"
                alt="Dynamic Product Brand"
                class="w-full h-auto"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
            </button>
            <p class="text-base font-medium text-om-gray-700 mt-3 text-center">Dynamic Product Brand</p>
          </div>
        </div>
      </div>

      <!-- Photo Style Selection Section (Step 2) -->
      <div v-if="showPhotoSelection && !showStep3 && !showPreview" class="-mt-24">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6 text-center">
          Choose photo style
        </h1>
        <div class="flex gap-4 justify-center">
          <!-- Style 1 -->
          <button
            @click="handleStyleSelect(1)"
            class="image-card group relative rounded-xl overflow-hidden border-2 border-om-gray-200 transition-all cursor-pointer hover:shadow-lg hover:scale-105 outline-none focus:outline-none focus-visible:ring-0 focus-visible:border-om-gray-200 hover:border-om-gray-200"
            style="width: 280px;"
          >
            <img
              src="/nikka_1.jpg"
              alt="Style 1"
              class="w-full h-auto"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
          </button>

          <!-- Style 2 -->
          <button
            @click="handleStyleSelect(2)"
            class="image-card group relative rounded-xl overflow-hidden border-2 border-om-gray-200 transition-all cursor-pointer hover:shadow-lg hover:scale-105 outline-none focus:outline-none focus-visible:ring-0 focus-visible:border-om-gray-200 hover:border-om-gray-200"
            style="width: 280px;"
          >
            <img
              src="/nikka_2.jpg"
              alt="Style 2"
              class="w-full h-auto"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
          </button>

          <!-- Style 3 -->
          <button
            @click="handleStyleSelect(3)"
            class="image-card group relative rounded-xl overflow-hidden border-2 border-om-gray-200 transition-all cursor-pointer hover:shadow-lg hover:scale-105 outline-none focus:outline-none focus-visible:ring-0 focus-visible:border-om-gray-200 hover:border-om-gray-200"
            style="width: 280px;"
          >
            <img
              src="/nikka_3.jpg"
              alt="Style 3"
              class="w-full h-auto"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
          </button>
        </div>
      </div>

      <!-- Step 3 - Image Pair Carousel -->
      <div v-if="showStep3 && !showPreview" class="flex flex-col items-center -mt-25">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-10 text-center">
          Preview images generated for 5 products
        </h1>

        <!-- Carousel with side arrows -->
        <div class="relative w-full" style="height: 440px;">
          <!-- Slides -->
          <div class="overflow-hidden w-full h-full">
            <div
              class="flex h-full"
              :class="noTransition ? '' : 'transition-transform duration-500 ease-out'"
              :style="{
                transform: `translateX(calc(50% - ${internalPos * 820 + 410}px))`
              }"
            >
              <div
                v-for="(slideIdx, pos) in extendedSlides"
                :key="pos"
                class="shrink-0 flex justify-center items-start cursor-pointer"
                :class="[
                  noTransition ? '' : 'transition-all duration-500',
                  pos === internalPos ? 'opacity-100 z-10 scale-100' : 'opacity-40 scale-[0.85]'
                ]"
                style="width: 1220px; margin: 0 -200px;"
                @click="goToSlide(slideIdx)"
              >
                <div class="flex gap-3 rounded-2xl border border-om-gray-200 bg-om-gray-50 p-3">
                  <img
                    :src="`/image-with-badge${slideIdx + 1}.jpg`"
                    :alt="`Product ${slideIdx + 1} Desktop`"
                    class="rounded-xl shrink-0"
                    style="height: 400px; width: auto;"
                  />
                  <img
                    :src="`/image-with-badge${slideIdx + 1}m.jpg`"
                    :alt="`Product ${slideIdx + 1} Mobile`"
                    class="rounded-xl shrink-0"
                    style="height: 400px; width: auto;"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Arrows aligned to image pair -->
          <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none flex items-center pt-4" style="width: 1244px;">
            <button
              @click="prevSlide"
              class="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer bg-white text-om-gray-600 hover:bg-om-gray-50 shadow-md"
            >
              <ChevronLeft :size="20" />
            </button>
            <div class="flex-1"></div>
            <button
              @click="nextSlide"
              class="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer bg-white text-om-gray-600 hover:bg-om-gray-50 shadow-md"
            >
              <ChevronRight :size="20" />
            </button>
          </div>
        </div>

        <!-- Next to placement button -->
        <div class="mt-4">
          <Button
            variant="primary"
            size="md"
            @click="handleNextToPlacement"
          >
            <span class="inline-flex items-center gap-1.5">Approve previews <ArrowRight :size="16" /></span>
          </Button>
        </div>
      </div>

      <!-- Step 5 - Confirmation Screen -->
      <div v-if="showSuccessModal" class="flex flex-col items-center justify-center -mt-24">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CircleCheckBig :size="32" class="text-green-500" />
          </div>
        </div>
        <h2 class="text-xl font-semibold text-om-gray-700 text-center mb-4">
          You're all set! Here's what happens next
        </h2>
        <p class="text-om-gray-600 text-center mb-0">
          We will generate images for the <span class="font-semibold text-om-gray-700">most popular 300 products</span> on <span class="font-semibold text-om-gray-700">whiskynet.hu</span>
        </p>
        <p class="text-om-gray-600 text-center mb-3">
          Once ready, we'll send a link to you for your approval.
        </p>
        <input
          v-model="notificationEmail"
          type="email"
          class="w-72 px-3 py-2 border border-om-gray-200 rounded-lg text-center text-om-gray-700 outline-none focus:border-om-orange-500 mb-4"
        />
        <p class="text-om-gray-600 text-center mb-6">
          Total Cost: <span class="font-semibold text-om-gray-700">500 credits</span>
        </p>
        <Button variant="primary" size="md" @click="handleStartGenerating">
          Start generating
        </Button>
      </div>

      <!-- Preview Section -->
      <div v-if="showPreview" class="w-fit mx-auto" style="margin-top: -60px;">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-6 text-center">
          Choose where to place the campaign on your page
        </h1>
        <div class="flex gap-4">
          <!-- Desktop Preview -->
          <div class="rounded-xl border border-om-gray-200" style="width: 720px; height: 400px;">
            <div v-if="previewLoading" class="w-full h-full bg-om-gray-200 animate-pulse rounded-xl"></div>
            <div v-else ref="previewContainer" class="overflow-auto w-full h-full rounded-xl">
              <img
                src="/iwb_preview_1.png"
                alt="Preview"
                class="w-full h-auto"
                @load="onImageLoad"
              />
            </div>
          </div>
          <!-- Mobile Preview -->
          <div class="rounded-xl border border-om-gray-200" style="width: 220px; height: 400px;">
            <div v-if="previewLoading" class="w-full h-full bg-om-gray-200 animate-pulse rounded-xl"></div>
            <div v-else ref="mobilePreviewContainer" class="overflow-auto w-full h-full rounded-xl">
              <img
                src="/iwb_preview_1m.png"
                alt="Mobile Preview"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <!-- Position Buttons -->
        <div class="mt-4 flex gap-2 justify-center">
          <button
            @click="selectedPosition = 1"
            :class="[
              'chip px-3 py-1.5 rounded-xl text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
              selectedPosition === 1
                ? 'bg-om-orange-50 border-2 border-om-orange-500'
                : 'bg-white border border-om-gray-200'
            ]"
          >
            Position 1
          </button>
          <button
            @click="selectedPosition = 2"
            :class="[
              'chip px-3 py-1.5 rounded-xl text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
              selectedPosition === 2
                ? 'bg-om-orange-50 border-2 border-om-orange-500'
                : 'bg-white border border-om-gray-200'
            ]"
          >
            Position 2
          </button>
          <button
            @click="selectedPosition = 3"
            :class="[
              'chip px-3 py-1.5 rounded-xl text-om-gray-700 text-sm cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02]',
              selectedPosition === 3
                ? 'bg-om-orange-50 border-2 border-om-orange-500'
                : 'bg-white border border-om-gray-200'
            ]"
          >
            Position 3
          </button>
        </div>

        <!-- Activate Campaign Button -->
        <div class="mt-6 flex justify-center">
          <Button
            variant="primary"
            size="md"
            @click="handleActivateCampaign"
          >
            <span class="inline-flex items-center gap-1.5">Approve position <ArrowRight :size="16" /></span>
          </Button>
        </div>
      </div>



    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { CircleCheckBig, ChevronLeft, ChevronRight, ArrowRight, Bell, Home, LayoutGrid, Users, TrendingUp, BookOpen, GitBranch, Calendar, Target, MoreVertical } from 'lucide-vue-next'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import Button from '../components/shared/Button.vue'

const productUrl = ref('https://www.whiskynet.hu/shankys-whip-black-irish-whiskey-likor-07l-33')
const isLoading = ref(false)
const showImage = ref(false)
const showPreview = ref(false)
const showPhotoSelection = ref(false)
const showStep3 = ref(false)
const showSuccessModal = ref(false)
const showProductList = ref(false)
const selectedProduct = ref(null)
const showCampaignPage = ref(false)
const isActive = ref(true)
const variant1Active = ref(true)
const variant2Active = ref(true)
const previewLoading = ref(false)
const includePeople = ref(false)
const selectedLanguage = ref('hu')
const notificationEmail = ref('info@whiskynet.hu')
const selectedPosition = ref(1)
const previewContainer = ref(null)
const mobilePreviewContainer = ref(null)
const currentSlide = ref(0)
const internalPos = ref(1)
const noTransition = ref(false)

// Extended slides: [clone of last, 0, 1, 2, 3, 4, clone of first]
const extendedSlides = [4, 0, 1, 2, 3, 4, 0]

const prevSlide = () => {
  noTransition.value = false
  internalPos.value--
  currentSlide.value = extendedSlides[internalPos.value]

  if (internalPos.value === 0) {
    setTimeout(() => {
      noTransition.value = true
      internalPos.value = 5
      setTimeout(() => { noTransition.value = false }, 50)
    }, 500)
  }
}

const nextSlide = () => {
  noTransition.value = false
  internalPos.value++
  currentSlide.value = extendedSlides[internalPos.value]

  if (internalPos.value === 6) {
    setTimeout(() => {
      noTransition.value = true
      internalPos.value = 1
      setTimeout(() => { noTransition.value = false }, 50)
    }, 500)
  }
}

const goToSlide = (slideIndex) => {
  noTransition.value = false
  currentSlide.value = slideIndex
  internalPos.value = slideIndex + 1
}

// Computed property to track current step
const currentStep = computed(() => {
  if (showCampaignPage.value) return 7
  if (showProductList.value) return 6
  if (showSuccessModal.value) return 5
  if (showPreview.value) return 4
  if (showStep3.value) return 3
  if (showPhotoSelection.value) return 2
  return 1
})

const languageOptions = [
  { value: 'hu', label: 'Magyar' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' }
]

const handleBadgeSelect = (badgeType) => {
  console.log('Selected badge:', badgeType)
  showPhotoSelection.value = true
}

const handleStyleSelect = (styleId) => {
  console.log('Selected style:', styleId)
  showPhotoSelection.value = false
  showStep3.value = true
}

const handleNextToPlacement = () => {
  showStep3.value = false
  showPreview.value = true
  previewLoading.value = true

  setTimeout(() => {
    previewLoading.value = false
  }, 3000)
}

const handleSubmit = () => {
  console.log('Product URL:', productUrl.value)
  isLoading.value = true
  showImage.value = false

  setTimeout(() => {
    isLoading.value = false
    showImage.value = true
  }, 3000)
}

const handleRegenerate = () => {
  console.log('Regenerate with:', {
    url: productUrl.value,
    includePeople: includePeople.value,
    language: selectedLanguage.value
  })
  // TODO: Regenerate images with new settings
  isLoading.value = true
  showImage.value = false

  setTimeout(() => {
    isLoading.value = false
    showImage.value = true
  }, 3000)
}

const handleContinue = () => {
  console.log('Continue with selected images')
  setTimeout(() => {
    showPreview.value = true
    previewLoading.value = true

    setTimeout(() => {
      previewLoading.value = false
    }, 3000)
  }, 10)
}

const sidebarMenuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'campaigns', label: 'Campaigns', icon: LayoutGrid },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'insights', label: 'Analytics', icon: TrendingUp },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'settings', label: 'A/B Tests', icon: GitBranch },
]

const products = [
  { name: "Nikka From The Barrel 0.5L 51.4%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge1.jpg", mobile: "/image-with-badge1m.jpg" },
  { name: "Shanky's Whip Black Irish Whiskey Likőr 0.7L 33%", thumbnail: "/nikka_2.jpg", desktop: "/image-with-badge2.jpg", mobile: "/image-with-badge2m.jpg" },
  { name: "Nikka Coffey Grain Whisky 0.7L 45%", thumbnail: "/nikka_3.jpg", desktop: "/image-with-badge3.jpg", mobile: "/image-with-badge3m.jpg" },
  { name: "Nikka Taketsuru Pure Malt 0.7L 43%", thumbnail: "/nikka_4.jpg", desktop: "/image-with-badge4.jpg", mobile: "/image-with-badge4m.jpg" },
  { name: "Nikka Miyagikyo Single Malt 0.7L 45%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge5.jpg", mobile: "/image-with-badge5m.jpg" },
  { name: "Jameson Irish Whiskey 0.7L 40%", thumbnail: "/nikka_2.jpg", desktop: "/image-with-badge1.jpg", mobile: "/image-with-badge1m.jpg" },
  { name: "Tullamore Dew Irish Whiskey 0.7L 40%", thumbnail: "/nikka_3.jpg", desktop: "/image-with-badge2.jpg", mobile: "/image-with-badge2m.jpg" },
  { name: "Bushmills Original 0.7L 40%", thumbnail: "/nikka_4.jpg", desktop: "/image-with-badge3.jpg", mobile: "/image-with-badge3m.jpg" },
  { name: "Redbreast 12 Year Old 0.7L 40%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge4.jpg", mobile: "/image-with-badge4m.jpg" },
  { name: "Green Spot Single Pot Still 0.7L 40%", thumbnail: "/nikka_2.jpg", desktop: "/image-with-badge5.jpg", mobile: "/image-with-badge5m.jpg" },
  { name: "Maker's Mark Bourbon 0.7L 45%", thumbnail: "/nikka_3.jpg", desktop: "/image-with-badge1.jpg", mobile: "/image-with-badge1m.jpg" },
  { name: "Glenfiddich 12 Year Old 0.7L 40%", thumbnail: "/nikka_4.jpg", desktop: "/image-with-badge2.jpg", mobile: "/image-with-badge2m.jpg" },
  { name: "Lagavulin 16 Year Old 0.7L 43%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge3.jpg", mobile: "/image-with-badge3m.jpg" },
  { name: "Talisker 10 Year Old 0.7L 45.8%", thumbnail: "/nikka_2.jpg", desktop: "/image-with-badge4.jpg", mobile: "/image-with-badge4m.jpg" },
  { name: "Monkey Shoulder Blended Malt 0.7L 40%", thumbnail: "/nikka_3.jpg", desktop: "/image-with-badge5.jpg", mobile: "/image-with-badge5m.jpg" },
  { name: "Hibiki Japanese Harmony 0.7L 43%", thumbnail: "/nikka_4.jpg", desktop: "/image-with-badge1.jpg", mobile: "/image-with-badge1m.jpg" },
  { name: "Woodford Reserve Bourbon 0.7L 43.2%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge2.jpg", mobile: "/image-with-badge2m.jpg" },
  { name: "Laphroaig 10 Year Old 0.7L 40%", thumbnail: "/nikka_2.jpg", desktop: "/image-with-badge3.jpg", mobile: "/image-with-badge3m.jpg" },
  { name: "Bulleit Bourbon 0.7L 45%", thumbnail: "/nikka_3.jpg", desktop: "/image-with-badge4.jpg", mobile: "/image-with-badge4m.jpg" },
  { name: "Ardbeg 10 Year Old 0.7L 46%", thumbnail: "/nikka_4.jpg", desktop: "/image-with-badge5.jpg", mobile: "/image-with-badge5m.jpg" },
  { name: "Highland Park 12 Year Old 0.7L 40%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge1.jpg", mobile: "/image-with-badge1m.jpg" },
  { name: "Balvenie DoubleWood 12 Year Old 0.7L 40%", thumbnail: "/nikka_2.jpg", desktop: "/image-with-badge2.jpg", mobile: "/image-with-badge2m.jpg" },
  { name: "Oban 14 Year Old 0.7L 43%", thumbnail: "/nikka_3.jpg", desktop: "/image-with-badge3.jpg", mobile: "/image-with-badge3m.jpg" },
  { name: "Dalmore 12 Year Old 0.7L 40%", thumbnail: "/nikka_4.jpg", desktop: "/image-with-badge4.jpg", mobile: "/image-with-badge4m.jpg" },
  { name: "Aberlour 12 Year Old 0.7L 40%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge5.jpg", mobile: "/image-with-badge5m.jpg" },
  { name: "Bruichladdich Classic Laddie 0.7L 50%", thumbnail: "/nikka_2.jpg", desktop: "/image-with-badge1.jpg", mobile: "/image-with-badge1m.jpg" },
  { name: "Glenmorangie Original 0.7L 40%", thumbnail: "/nikka_3.jpg", desktop: "/image-with-badge2.jpg", mobile: "/image-with-badge2m.jpg" },
  { name: "Cardhu 12 Year Old 0.7L 40%", thumbnail: "/nikka_4.jpg", desktop: "/image-with-badge3.jpg", mobile: "/image-with-badge3m.jpg" },
  { name: "Singleton 12 Year Old 0.7L 40%", thumbnail: "/nikka_1.jpg", desktop: "/image-with-badge4.jpg", mobile: "/image-with-badge4m.jpg" },
]

const selectedTimePeriod = ref('Last 30 days')
const timePeriodOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months']
const selectedGoal = ref('Submit')
const goalOptions = ['Submit', 'Click', 'View', 'Conversion']

const handleDone = () => {
  showProductList.value = false
  showCampaignPage.value = true
  selectedProduct.value = null
}

const handleStartGenerating = () => {
  showSuccessModal.value = false
  showProductList.value = true
}

const handleBack = () => {
  if (showCampaignPage.value) {
    showCampaignPage.value = false
    showProductList.value = true
  } else if (showProductList.value) {
    showProductList.value = false
    showSuccessModal.value = true
  } else if (showSuccessModal.value) {
    showSuccessModal.value = false
    showPreview.value = true
  } else if (showPreview.value) {
    showPreview.value = false
    showStep3.value = true
  } else if (showStep3.value) {
    showStep3.value = false
    showPhotoSelection.value = true
  } else if (showPhotoSelection.value) {
    showPhotoSelection.value = false
  }
}

const handleActivateCampaign = () => {
  console.log('Activate campaign with position:', selectedPosition.value)
  showPreview.value = false
  showSuccessModal.value = true
}

// Scroll after image loads
const onImageLoad = () => {
  // Desktop preview scroll
  if (previewContainer.value) {
    setTimeout(() => {
      const start = previewContainer.value.scrollTop
      const target = 360
   const duration = 2000
      const startTime = performance.now()

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        previewContainer.value.scrollTop = start + (target - start) * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }, 500)
  }

  // Mobile preview scroll
  if (mobilePreviewContainer.value) {
    setTimeout(() => {
      const start = mobilePreviewContainer.value.scrollTop
      const target = 630
      const duration = 2000
      const startTime = performance.now()

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeInOutCubic = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

        mobilePreviewContainer.value.scrollTop = start + (target - start) * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }, 500)
  }
}

// Dev navigation method
const devGoToStep = (step) => {
  if (step === 1) {
    showPhotoSelection.value = false
    showStep3.value = false
    showPreview.value = false
    showProductList.value = false
    showCampaignPage.value = false
    previewLoading.value = false
  } else if (step === 2) {
    showPhotoSelection.value = true
    showStep3.value = false
    showPreview.value = false
    showProductList.value = false
    showCampaignPage.value = false
    previewLoading.value = false
  } else if (step === 3) {
    showPhotoSelection.value = false
    showStep3.value = true
    showPreview.value = false
    showProductList.value = false
    showCampaignPage.value = false
    previewLoading.value = false
  } else if (step === 4) {
    showPhotoSelection.value = false
    showStep3.value = false
    showPreview.value = true
    showSuccessModal.value = false
    showProductList.value = false
    showCampaignPage.value = false
    previewLoading.value = false
  } else if (step === 5) {
    showPhotoSelection.value = false
    showStep3.value = false
    showPreview.value = false
    showSuccessModal.value = true
    showProductList.value = false
    showCampaignPage.value = false
    previewLoading.value = false
  } else if (step === 6) {
    showPhotoSelection.value = false
    showStep3.value = false
    showPreview.value = false
    showSuccessModal.value = false
    showProductList.value = true
    showCampaignPage.value = false
    previewLoading.value = false
  } else if (step === 7) {
    showPhotoSelection.value = false
    showStep3.value = false
    showPreview.value = false
    showSuccessModal.value = false
    showProductList.value = false
    showCampaignPage.value = true
    previewLoading.value = false
  }
}

// Expose for parent component
defineExpose({
  currentStep,
  devGoToStep
})
</script>
