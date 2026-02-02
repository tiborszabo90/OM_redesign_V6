<template>
  <div class="w-full h-full relative">
    <!-- Logo at top left corner - fixed positioning, hidden on recommendation pages -->
    <div v-if="!showRecommendation && !showRecommendationV2 && !showRecommendationV4" class="fixed top-8 left-8 z-50">
      <img
        src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
        alt="OptiMonk"
        class="h-8"
      />
    </div>

    <!-- Recommendation screen -->
    <transition v-if="showRecommendation" name="fade" appear>
      <div class="min-h-screen-safe bg-om-gray-50 overflow-y-auto">
        <!-- Full-width header with logo -->
        <div class="w-full px-4 sm:px-6 md:px-8 pt-8">
          <img
            src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
            alt="OptiMonk"
            class="h-8"
          />
        </div>
        <!-- Content container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 lg:pt-10 pb-8 lg:pb-12">
          <!-- Header -->
          <div class="text-center mb-10 lg:mb-14">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Our recommended campaigns</h2>
            <p class="text-om-gray-500">We've put together the ultimate popup lineup for your site.<br>Pick the ones you like, or launch them all to engage every customer segment.</p>
          </div>

          <!-- Use cases grid - 2 columns -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div
              v-for="useCase in useCases"
              :key="useCase.id"
              class="bg-white rounded-xl p-5 lg:p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
            >
              <!-- Two column layout: Left (header + desktop) | Right (mobile) -->
              <div class="flex gap-4">
                <!-- Left column: Header + Desktop popup -->
                <div class="flex-1 flex flex-col justify-between">
                  <!-- Use case header -->
                  <div class="mb-4 pr-10">
                    <p class="text-xs font-medium text-om-gray-500 uppercase tracking-wide mb-1">{{ useCase.title }}</p>
                    <h3 class="text-xl font-semibold text-om-gray-700">{{ useCase.description }}</h3>
                  </div>

                  <!-- Desktop Preview -->
                  <div class="max-w-sm">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-video flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <!-- Newsletter popup -->
                    <div v-if="useCase.id === 'newsletter'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="flex gap-1">
                          <div class="flex-1 h-5 bg-om-gray-100 rounded text-[8px] flex items-center px-1.5 text-om-gray-400" :class="cornerClasses[brandSettings.corners]">
                            {{ useCase.texts[brandSettings.language].input }}
                          </div>
                          <button
                            class="px-2 h-5 text-white text-[8px] font-medium"
                            :class="cornerClasses[brandSettings.corners]"
                            :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                          >
                            {{ useCase.texts[brandSettings.language].cta }}
                          </button>
                        </div>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=200&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Cart abandonment popup -->
                    <div v-else-if="useCase.id === 'cart-abandonment'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                        <h4 class="text-sm font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <p class="text-xs font-bold mb-2" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </p>
                        <button
                          class="w-full py-1.5 text-white text-[10px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Welcome discount popup -->
                    <div v-else-if="useCase.id === 'welcome-discount'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="w-8 h-8 rounded flex items-center justify-center text-white text-[8px] font-bold mb-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </div>
                        <button
                          class="px-2 py-1 text-white text-[10px] font-medium w-fit"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Feedback popup -->
                    <div v-else-if="useCase.id === 'feedback'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="flex justify-center gap-0.5 mb-1">
                          <span v-for="i in 5" :key="i" class="text-sm" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                        </div>
                        <button
                          class="px-2 py-1 text-white text-[10px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=200&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Free shipping bar -->
                    <div v-else-if="useCase.id === 'free-shipping'" class="flex flex-col w-full h-full">
                      <!-- Sticky bar at top -->
                      <div class="px-3 py-1.5 flex items-center justify-center gap-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <Truck :size="12" />
                        <span class="text-[10px] font-medium text-white" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].progress }}
                        </span>
                      </div>
                      <!-- Website skeleton -->
                      <div class="flex-1 bg-om-gray-50 p-2">
                        <!-- Header skeleton -->
                        <div class="flex items-center justify-between mb-3">
                          <div class="w-12 h-3 bg-om-gray-200 rounded"></div>
                          <div class="flex gap-2">
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                          </div>
                        </div>
                        <!-- Hero skeleton -->
                        <div class="w-full h-12 bg-om-gray-200 rounded mb-2"></div>
                        <!-- Content skeleton -->
                        <div class="flex gap-2">
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Spin wheel popup -->
                    <div v-else-if="useCase.id === 'spin-wheel'" class="flex w-full h-full">
                      <!-- Wheel on the left -->
                      <div class="w-2/5 shrink-0 flex items-center justify-center p-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <div class="w-14 h-14 rounded-full border-3 border-white relative bg-white/20">
                          <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <div v-for="(_prize, i) in 4" :key="i" class="absolute text-[5px] font-bold text-white" :style="{ top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%', bottom: i === 2 ? '4px' : 'auto', left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%', right: i === 1 ? '4px' : 'auto', transform: i === 0 || i === 2 ? 'translateX(-50%)' : 'translateY(-50%)' }">
                            {{ useCase.texts[brandSettings.language].prizes[i] }}
                          </div>
                        </div>
                      </div>
                      <!-- Content on the right -->
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-5 h-5 object-contain mb-1" />
                        <h4 class="text-xs font-bold mb-1" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[9px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <button
                          class="px-3 py-1 text-white text-[10px] font-medium w-fit"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                <!-- Right column: Mobile Preview (fixed aspect ratio) -->
                <div class="w-40 shrink-0">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-9/19 flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <!-- Newsletter popup mobile -->
                    <div v-if="useCase.id === 'newsletter'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=100&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5" />
                        <h4 class="text-[7px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="h-3 bg-om-gray-100 rounded text-[5px] flex items-center px-1 text-om-gray-400 mb-1" :class="cornerClasses[brandSettings.corners]">
                          Email
                        </div>
                        <button
                          class="w-full py-0.5 text-white text-[5px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Cart abandonment mobile -->
                    <div v-else-if="useCase.id === 'cart-abandonment'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=100&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[8px] font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-0.5" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <p class="text-[7px] font-bold mb-1" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </p>
                        <button
                          class="w-full py-0.5 text-white text-[5px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Welcome discount mobile -->
                    <div v-else-if="useCase.id === 'welcome-discount'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=100&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <div class="w-6 h-6 mx-auto rounded flex items-center justify-center text-white text-[5px] font-bold mb-0.5" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </div>
                        <h4 class="text-[7px] font-bold text-om-gray-800" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <button
                          class="mt-1 px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Feedback mobile -->
                    <div v-else-if="useCase.id === 'feedback'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=100&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[6px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].rating }}
                        </h4>
                        <div class="flex justify-center gap-0.5 mb-1">
                          <span v-for="i in 5" :key="i" class="text-[8px]" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                        </div>
                        <button
                          class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Free shipping mobile -->
                    <div v-else-if="useCase.id === 'free-shipping'" class="flex flex-col w-full h-full">
                      <!-- Sticky bar at top -->
                      <div class="px-2 py-1 flex items-center justify-center gap-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <Truck :size="8" />
                        <span class="text-[5px] font-medium text-white">Free shipping</span>
                      </div>
                      <!-- Website skeleton -->
                      <div class="flex-1 bg-om-gray-50 p-1.5">
                        <!-- Header skeleton -->
                        <div class="flex items-center justify-between mb-2">
                          <div class="w-6 h-1.5 bg-om-gray-200 rounded"></div>
                          <div class="flex gap-1">
                            <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                            <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                          </div>
                        </div>
                        <!-- Hero skeleton -->
                        <div class="w-full h-10 bg-om-gray-200 rounded mb-1.5"></div>
                        <!-- Content skeleton -->
                        <div class="flex gap-1">
                          <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Spin wheel mobile -->
                    <div v-else-if="useCase.id === 'spin-wheel'" class="flex flex-col w-full h-full">
                      <!-- Content on top -->
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[7px] font-bold mb-0.5" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-1">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <button
                          class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <!-- Wheel at bottom -->
                      <div class="h-1/3 shrink-0 flex items-center justify-center" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <div class="w-10 h-10 rounded-full border-2 border-white relative bg-white/20">
                          <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Recommendation screen V2 -->
    <transition v-else-if="showRecommendationV2" name="fade" appear>
      <div class="min-h-screen-safe bg-white overflow-y-auto">
        <!-- Full-width header with logo -->
        <div class="w-full px-4 sm:px-6 md:px-8 pt-4">
          <img
            src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
            alt="OptiMonk"
            class="h-8"
          />
        </div>
        <!-- Content container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-1 lg:pt-2 pb-8 lg:pb-12">
          <!-- Header -->
          <div class="text-center mb-10 lg:mb-14">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Our recommended campaigns</h2>
            <p class="text-om-gray-500">We've put together the ultimate popup lineup for your site.<br>Pick the ones you like, or launch them all to engage every customer segment.</p>
          </div>

          <!-- Use cases list - single column -->
          <div class="flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div
              v-for="useCase in useCases"
              :key="useCase.id"
              class="bg-om-gray-50 rounded-2xl p-5 lg:p-6"
            >
              <!-- Three column layout: Text | Desktop | Mobile -->
              <div class="flex gap-6 items-center">
                <!-- Left column: Text and button -->
                <div class="flex-1 flex flex-col justify-center">
                  <span class="inline-block text-xs font-normal text-om-gray-500 bg-om-gray-200 px-2 py-0.5 rounded mb-2 w-fit">{{ useCase.title }}</span>
                  <h3 class="text-lg font-semibold text-om-gray-700 mb-2">{{ useCase.description }}</h3>
                  <p class="text-base text-om-gray-500 mb-4">{{ useCase.shortDescription || 'Boost engagement and conversions with this proven campaign type.' }}</p>
                  <button
                    class="px-5 py-2.5 text-base font-medium text-white bg-om-orange-500 rounded-lg hover:bg-om-orange-400 transition-colors w-fit"
                  >
                    Show more
                  </button>
                </div>

                <!-- Previews container -->
                <div class="flex gap-3 shrink-0 items-center">
                  <!-- Desktop Preview -->
                  <div class="w-80 flex justify-center">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-video flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <!-- Newsletter popup -->
                    <div v-if="useCase.id === 'newsletter'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="flex gap-1">
                          <div class="flex-1 h-5 bg-om-gray-100 rounded text-[8px] flex items-center px-1.5 text-om-gray-400" :class="cornerClasses[brandSettings.corners]">
                            {{ useCase.texts[brandSettings.language].input }}
                          </div>
                          <button
                            class="px-2 h-5 text-white text-[8px] font-medium"
                            :class="cornerClasses[brandSettings.corners]"
                            :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                          >
                            {{ useCase.texts[brandSettings.language].cta }}
                          </button>
                        </div>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=200&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Cart abandonment popup -->
                    <div v-else-if="useCase.id === 'cart-abandonment'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                        <h4 class="text-sm font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <p class="text-xs font-bold mb-2" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </p>
                        <button
                          class="w-full py-1.5 text-white text-[10px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Welcome discount popup -->
                    <div v-else-if="useCase.id === 'welcome-discount'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="w-8 h-8 rounded flex items-center justify-center text-white text-[8px] font-bold mb-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </div>
                        <button
                          class="px-2 py-1 text-white text-[10px] font-medium w-fit"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Feedback popup -->
                    <div v-else-if="useCase.id === 'feedback'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="flex justify-center gap-0.5 mb-1">
                          <span v-for="i in 5" :key="i" class="text-sm" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                        </div>
                        <button
                          class="px-2 py-1 text-white text-[10px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=200&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Free shipping bar -->
                    <div v-else-if="useCase.id === 'free-shipping'" class="flex flex-col w-full h-full">
                      <!-- Sticky bar at top -->
                      <div class="px-3 py-1.5 flex items-center justify-center gap-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <Truck :size="12" />
                        <span class="text-[10px] font-medium text-white" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].progress }}
                        </span>
                      </div>
                      <!-- Website skeleton -->
                      <div class="flex-1 bg-om-gray-50 p-2">
                        <!-- Header skeleton -->
                        <div class="flex items-center justify-between mb-3">
                          <div class="w-12 h-3 bg-om-gray-200 rounded"></div>
                          <div class="flex gap-2">
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                          </div>
                        </div>
                        <!-- Hero skeleton -->
                        <div class="w-full h-12 bg-om-gray-200 rounded mb-2"></div>
                        <!-- Content skeleton -->
                        <div class="flex gap-2">
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Spin wheel popup -->
                    <div v-else-if="useCase.id === 'spin-wheel'" class="flex w-full h-full">
                      <!-- Wheel on the left -->
                      <div class="w-2/5 shrink-0 flex items-center justify-center p-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <div class="w-14 h-14 rounded-full border-3 border-white relative bg-white/20">
                          <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <div v-for="(_prize, i) in 4" :key="i" class="absolute text-[5px] font-bold text-white" :style="{ top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%', bottom: i === 2 ? '4px' : 'auto', left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%', right: i === 1 ? '4px' : 'auto', transform: i === 0 || i === 2 ? 'translateX(-50%)' : 'translateY(-50%)' }">
                            {{ useCase.texts[brandSettings.language].prizes[i] }}
                          </div>
                        </div>
                      </div>
                      <!-- Content on the right -->
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-5 h-5 object-contain mb-1" />
                        <h4 class="text-xs font-bold mb-1" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[9px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <button
                          class="px-3 py-1 text-white text-[10px] font-medium w-fit"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                  <!-- Mobile Preview -->
                  <div class="w-32">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-9/19 flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <!-- Newsletter popup mobile -->
                    <div v-if="useCase.id === 'newsletter'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=100&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5" />
                        <h4 class="text-[7px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="h-3 bg-om-gray-100 rounded text-[5px] flex items-center px-1 text-om-gray-400 mb-1" :class="cornerClasses[brandSettings.corners]">
                          Email
                        </div>
                        <button
                          class="w-full py-0.5 text-white text-[5px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Cart abandonment mobile -->
                    <div v-else-if="useCase.id === 'cart-abandonment'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=100&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[8px] font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-0.5" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <p class="text-[7px] font-bold mb-1" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </p>
                        <button
                          class="w-full py-0.5 text-white text-[5px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Welcome discount mobile -->
                    <div v-else-if="useCase.id === 'welcome-discount'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=100&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <div class="w-6 h-6 mx-auto rounded flex items-center justify-center text-white text-[5px] font-bold mb-0.5" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </div>
                        <h4 class="text-[7px] font-bold text-om-gray-800" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <button
                          class="mt-1 px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Feedback mobile -->
                    <div v-else-if="useCase.id === 'feedback'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=100&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[6px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].rating }}
                        </h4>
                        <div class="flex justify-center gap-0.5 mb-1">
                          <span v-for="i in 5" :key="i" class="text-[8px]" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                        </div>
                        <button
                          class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Free shipping mobile -->
                    <div v-else-if="useCase.id === 'free-shipping'" class="flex flex-col w-full h-full">
                      <!-- Sticky bar at top -->
                      <div class="px-2 py-1 flex items-center justify-center gap-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <Truck :size="8" />
                        <span class="text-[5px] font-medium text-white">Free shipping</span>
                      </div>
                      <!-- Website skeleton -->
                      <div class="flex-1 bg-om-gray-50 p-1.5">
                        <!-- Header skeleton -->
                        <div class="flex items-center justify-between mb-2">
                          <div class="w-6 h-1.5 bg-om-gray-200 rounded"></div>
                          <div class="flex gap-1">
                            <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                            <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                          </div>
                        </div>
                        <!-- Hero skeleton -->
                        <div class="w-full h-10 bg-om-gray-200 rounded mb-1.5"></div>
                        <!-- Content skeleton -->
                        <div class="flex gap-1">
                          <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Spin wheel mobile -->
                    <div v-else-if="useCase.id === 'spin-wheel'" class="flex flex-col w-full h-full">
                      <!-- Content on top -->
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[7px] font-bold mb-0.5" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-1">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <button
                          class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <!-- Wheel at bottom -->
                      <div class="h-1/3 shrink-0 flex items-center justify-center" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <div class="w-10 h-10 rounded-full border-2 border-white relative bg-white/20">
                          <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Recommendation screen V4 -->
    <transition v-else-if="showRecommendationV4" name="fade" appear>
      <div class="min-h-screen-safe bg-white overflow-y-auto">
        <!-- Full-width header with logo -->
        <div class="w-full px-4 sm:px-6 md:px-8 pt-4">
          <img
            src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
            alt="OptiMonk"
            class="h-8"
          />
        </div>
        <!-- Content container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-1 lg:pt-2 pb-8 lg:pb-12">
          <!-- Header -->
          <div class="text-center mb-10 lg:mb-14">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Our recommended campaigns</h2>
            <p class="text-om-gray-500">We've put together the ultimate popup lineup for your site.<br>Pick the ones you like, or launch them all to engage every customer segment.</p>
          </div>

          <!-- Use cases list - single column -->
          <div class="flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div
              v-for="useCase in useCases"
              :key="useCase.id"
              class="bg-om-gray-50 rounded-2xl p-5 lg:p-6"
            >
              <!-- Three column layout: Text | Desktop | Mobile -->
              <div class="flex gap-6 items-center">
                <!-- Left column: Text and button -->
                <div class="flex-1 flex flex-col justify-center">
                  <span class="inline-block text-xs font-normal text-om-gray-500 bg-om-gray-200 px-2 py-0.5 rounded mb-2 w-fit">{{ useCase.title }}</span>
                  <h3 class="text-lg font-semibold text-om-gray-700 mb-2">{{ useCase.description }}</h3>
                  <p class="text-base text-om-gray-500 mb-4">{{ useCase.shortDescription || 'Boost engagement and conversions with this proven campaign type.' }}</p>
                  <button
                    class="px-5 py-2.5 text-base font-medium text-white bg-om-orange-500 rounded-lg hover:bg-om-orange-400 transition-colors w-fit"
                  >
                    Show more
                  </button>
                </div>

                <!-- Previews container -->
                <div class="flex gap-3 shrink-0 items-center">
                  <!-- Desktop Preview -->
                  <div class="w-80 flex justify-center">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-video flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <!-- Newsletter popup -->
                    <div v-if="useCase.id === 'newsletter'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="flex gap-1">
                          <div class="flex-1 h-5 bg-om-gray-100 rounded text-[8px] flex items-center px-1.5 text-om-gray-400" :class="cornerClasses[brandSettings.corners]">
                            {{ useCase.texts[brandSettings.language].input }}
                          </div>
                          <button
                            class="px-2 h-5 text-white text-[8px] font-medium"
                            :class="cornerClasses[brandSettings.corners]"
                            :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                          >
                            {{ useCase.texts[brandSettings.language].cta }}
                          </button>
                        </div>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=200&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Cart abandonment popup -->
                    <div v-else-if="useCase.id === 'cart-abandonment'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                        <h4 class="text-sm font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <p class="text-xs font-bold mb-2" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </p>
                        <button
                          class="w-full py-1.5 text-white text-[10px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Welcome discount popup -->
                    <div v-else-if="useCase.id === 'welcome-discount'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="w-8 h-8 rounded flex items-center justify-center text-white text-[8px] font-bold mb-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </div>
                        <button
                          class="px-2 py-1 text-white text-[10px] font-medium w-fit"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Feedback popup -->
                    <div v-else-if="useCase.id === 'feedback'" class="flex w-full h-full">
                      <div class="flex-1 p-3 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                        <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="flex justify-center gap-0.5 mb-1">
                          <span v-for="i in 5" :key="i" class="text-sm" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                        </div>
                        <button
                          class="px-2 py-1 text-white text-[10px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <div class="w-2/5 shrink-0">
                        <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=200&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                      </div>
                    </div>

                    <!-- Free shipping bar -->
                    <div v-else-if="useCase.id === 'free-shipping'" class="flex flex-col w-full h-full">
                      <!-- Sticky bar at top -->
                      <div class="px-3 py-1.5 flex items-center justify-center gap-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <Truck :size="12" />
                        <span class="text-[10px] font-medium text-white" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].progress }}
                        </span>
                      </div>
                      <!-- Website skeleton -->
                      <div class="flex-1 bg-om-gray-50 p-2">
                        <!-- Header skeleton -->
                        <div class="flex items-center justify-between mb-3">
                          <div class="w-12 h-3 bg-om-gray-200 rounded"></div>
                          <div class="flex gap-2">
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                            <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                          </div>
                        </div>
                        <!-- Hero skeleton -->
                        <div class="w-full h-12 bg-om-gray-200 rounded mb-2"></div>
                        <!-- Content skeleton -->
                        <div class="flex gap-2">
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Spin wheel popup -->
                    <div v-else-if="useCase.id === 'spin-wheel'" class="flex w-full h-full">
                      <!-- Wheel on the left -->
                      <div class="w-2/5 shrink-0 flex items-center justify-center p-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <div class="w-14 h-14 rounded-full border-3 border-white relative bg-white/20">
                          <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <div v-for="(_prize, i) in 4" :key="i" class="absolute text-[5px] font-bold text-white" :style="{ top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%', bottom: i === 2 ? '4px' : 'auto', left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%', right: i === 1 ? '4px' : 'auto', transform: i === 0 || i === 2 ? 'translateX(-50%)' : 'translateY(-50%)' }">
                            {{ useCase.texts[brandSettings.language].prizes[i] }}
                          </div>
                        </div>
                      </div>
                      <!-- Content on the right -->
                      <div class="flex-1 p-3 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-5 h-5 object-contain mb-1" />
                        <h4 class="text-xs font-bold mb-1" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[9px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <button
                          class="px-3 py-1 text-white text-[10px] font-medium w-fit"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                  <!-- Mobile Preview -->
                  <div class="w-32">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-9/19 flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <!-- Newsletter popup mobile -->
                    <div v-if="useCase.id === 'newsletter'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=100&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5" />
                        <h4 class="text-[7px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <div class="h-3 bg-om-gray-100 rounded text-[5px] flex items-center px-1 text-om-gray-400 mb-1" :class="cornerClasses[brandSettings.corners]">
                          Email
                        </div>
                        <button
                          class="w-full py-0.5 text-white text-[5px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Cart abandonment mobile -->
                    <div v-else-if="useCase.id === 'cart-abandonment'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=100&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[8px] font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-0.5" :style="{ fontFamily: brandSettings.secondaryFont }">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <p class="text-[7px] font-bold mb-1" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </p>
                        <button
                          class="w-full py-0.5 text-white text-[5px] font-medium"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Welcome discount mobile -->
                    <div v-else-if="useCase.id === 'welcome-discount'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=100&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <div class="w-6 h-6 mx-auto rounded flex items-center justify-center text-white text-[5px] font-bold mb-0.5" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].discount }}
                        </div>
                        <h4 class="text-[7px] font-bold text-om-gray-800" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <button
                          class="mt-1 px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Feedback mobile -->
                    <div v-else-if="useCase.id === 'feedback'" class="flex flex-col w-full h-full">
                      <div class="h-1/3 shrink-0">
                        <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=100&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[6px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                          {{ useCase.texts[brandSettings.language].rating }}
                        </h4>
                        <div class="flex justify-center gap-0.5 mb-1">
                          <span v-for="i in 5" :key="i" class="text-[8px]" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                        </div>
                        <button
                          class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                    </div>

                    <!-- Free shipping mobile -->
                    <div v-else-if="useCase.id === 'free-shipping'" class="flex flex-col w-full h-full">
                      <!-- Sticky bar at top -->
                      <div class="px-2 py-1 flex items-center justify-center gap-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <Truck :size="8" />
                        <span class="text-[5px] font-medium text-white">Free shipping</span>
                      </div>
                      <!-- Website skeleton -->
                      <div class="flex-1 bg-om-gray-50 p-1.5">
                        <!-- Header skeleton -->
                        <div class="flex items-center justify-between mb-2">
                          <div class="w-6 h-1.5 bg-om-gray-200 rounded"></div>
                          <div class="flex gap-1">
                            <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                            <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                          </div>
                        </div>
                        <!-- Hero skeleton -->
                        <div class="w-full h-10 bg-om-gray-200 rounded mb-1.5"></div>
                        <!-- Content skeleton -->
                        <div class="flex gap-1">
                          <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                          <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Spin wheel mobile -->
                    <div v-else-if="useCase.id === 'spin-wheel'" class="flex flex-col w-full h-full">
                      <!-- Content on top -->
                      <div class="flex-1 p-2 flex flex-col justify-center text-center">
                        <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                        <h4 class="text-[7px] font-bold mb-0.5" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                          {{ useCase.texts[brandSettings.language].title }}
                        </h4>
                        <p class="text-[5px] text-om-gray-500 mb-1">
                          {{ useCase.texts[brandSettings.language].subtitle }}
                        </p>
                        <button
                          class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                          :class="cornerClasses[brandSettings.corners]"
                          :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                        >
                          {{ useCase.texts[brandSettings.language].cta }}
                        </button>
                      </div>
                      <!-- Wheel at bottom -->
                      <div class="h-1/3 shrink-0 flex items-center justify-center" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                        <div class="w-10 h-10 rounded-full border-2 border-white relative bg-white/20">
                          <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Recommendation screen V3 -->
    <transition v-else-if="showRecommendationV3" name="fade" appear>
      <div class="min-h-screen-safe bg-om-gray-100 overflow-hidden relative" @wheel.prevent="handleDeckScroll">
        <!-- Full-width header with logo -->
        <div class="w-full px-4 sm:px-6 md:px-8 pt-4">
          <img
            src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
            alt="OptiMonk"
            class="h-8"
          />
        </div>
        <!-- Content container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-1 lg:pt-2 pb-8 lg:pb-12">
          <!-- Header -->
          <div class="text-center mb-0 lg:mb-4">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Our recommended campaigns</h2>
            <p class="text-om-gray-500">We've put together the ultimate popup lineup for your site.<br>Pick the ones you like, or launch them all to engage every customer segment.</p>
          </div>

          <!-- Use cases deck with scrollbar -->
          <div class="flex items-start justify-center gap-8 max-w-5xl mx-auto">
            <!-- Use cases deck - stacked cards -->
            <div class="relative max-w-4xl flex-1 pb-24 pt-16">
            <!-- Deck shadow layers - PREVIOUS cards (visible above) -->
            <template v-for="i in Math.min(5, currentDeckCard)" :key="'shadow-top-' + i">
              <div
                class="absolute inset-x-0 top-16 bg-white rounded-2xl transition-all duration-300 border border-om-gray-100"
                :style="{
                  transform: `translateY(${-i * 14}px) scale(${1 - i * 0.015})`,
                  zIndex: currentDeckCard - i + 1,
                  opacity: 1 - (i * 0.12)
                }"
              >
                <!-- Placeholder height to match main card -->
                <div class="p-5 lg:p-6 invisible">
                  <div class="flex gap-6 items-center">
                    <div class="flex-1"><div class="h-32"></div></div>
                    <div class="flex gap-3 shrink-0"><div class="w-80 aspect-video"></div><div class="w-32 aspect-9/19"></div></div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Deck shadow layers - REMAINING cards (visible below) -->
            <template v-for="i in Math.min(5, useCases.length - currentDeckCard - 1)" :key="'shadow-bottom-' + i">
              <div
                class="absolute inset-x-0 top-16 bg-white rounded-2xl transition-all duration-300 border border-om-gray-100"
                :style="{
                  transform: `translateY(${i * 14}px) scale(${1 - i * 0.015})`,
                  zIndex: 5 - i,
                  opacity: 1 - (i * 0.1)
                }"
              >
                <!-- Placeholder height to match main card -->
                <div class="p-5 lg:p-6 invisible">
                  <div class="flex gap-6 items-center">
                    <div class="flex-1"><div class="h-32"></div></div>
                    <div class="flex gap-3 shrink-0"><div class="w-80 aspect-video"></div><div class="w-32 aspect-9/19"></div></div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Current card (the top card of the deck) -->
            <div class="relative min-h-[280px]">
              <transition :name="deckTransitionName" mode="out-in">
                <div :key="currentDeckCard" class="bg-white rounded-2xl p-5 lg:p-6 shadow-xl relative z-10 border border-om-gray-100">
                <!-- Three column layout: Text | Desktop | Mobile -->
                <div class="flex gap-6 items-center">
                  <!-- Left column: Text and button -->
                  <div class="flex-1 flex flex-col justify-center pr-6">
                    <span class="inline-block text-sm font-normal text-om-gray-500 bg-om-gray-200 px-2.5 py-1 rounded mb-3 w-fit">{{ useCases[currentDeckCard].title }}</span>
                    <h3 class="text-2xl font-semibold text-om-gray-700 mb-3">{{ useCases[currentDeckCard].description }}</h3>
                    <p class="text-lg text-om-gray-500 mb-5">{{ useCases[currentDeckCard].shortDescription || 'Boost engagement and conversions with this proven campaign type.' }}</p>
                    <button
                      class="px-5 py-2.5 text-base font-medium text-white bg-om-orange-500 rounded-lg hover:bg-om-orange-400 transition-colors w-fit"
                    >
                      Show more
                    </button>
                  </div>

                  <!-- Previews container -->
                  <div class="flex gap-3 shrink-0 items-center">
                    <!-- Desktop Preview -->
                    <div class="w-80 flex justify-center">
                      <div
                        class="bg-white border border-om-gray-200 overflow-hidden aspect-video flex items-center justify-center"
                        :class="popupCornerClasses[brandSettings.corners]"
                      >
                        <!-- Newsletter popup -->
                        <template v-if="useCases[currentDeckCard].id === 'newsletter'">
                          <div class="flex w-full h-full">
                            <div class="flex-1 p-3 flex flex-col justify-center">
                              <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                              <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[10px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <div class="flex gap-1">
                                <div class="flex-1 h-5 bg-om-gray-100 rounded text-[8px] flex items-center px-1.5 text-om-gray-400" :class="cornerClasses[brandSettings.corners]">
                                  {{ useCases[currentDeckCard].texts[brandSettings.language].input }}
                                </div>
                                <button
                                  class="px-2 h-5 text-white text-[8px] font-medium"
                                  :class="cornerClasses[brandSettings.corners]"
                                  :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                                >
                                  {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                                </button>
                              </div>
                            </div>
                            <div class="w-2/5 shrink-0">
                              <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=200&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                            </div>
                          </div>
                        </template>

                        <!-- Cart abandonment popup -->
                        <template v-else-if="useCases[currentDeckCard].id === 'cart-abandonment'">
                          <div class="flex w-full h-full">
                            <div class="flex-1 p-3 flex flex-col justify-center text-center">
                              <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                              <h4 class="text-sm font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <p class="text-xs font-bold mb-2" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].discount }}
                              </p>
                              <button
                                class="w-full py-1.5 text-white text-[10px] font-medium"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                            <div class="w-2/5 shrink-0">
                              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                            </div>
                          </div>
                        </template>

                        <!-- Welcome discount popup -->
                        <template v-else-if="useCases[currentDeckCard].id === 'welcome-discount'">
                          <div class="flex w-full h-full">
                            <div class="flex-1 p-3 flex flex-col justify-center">
                              <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1" />
                              <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <div class="w-8 h-8 rounded flex items-center justify-center text-white text-[8px] font-bold mb-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].discount }}
                              </div>
                              <button
                                class="px-2 py-1 text-white text-[10px] font-medium w-fit"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                            <div class="w-2/5 shrink-0">
                              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                            </div>
                          </div>
                        </template>

                        <!-- Feedback popup -->
                        <template v-else-if="useCases[currentDeckCard].id === 'feedback'">
                          <div class="flex w-full h-full">
                            <div class="flex-1 p-3 flex flex-col justify-center text-center">
                              <img src="/telekom.png" alt="Logo" class="w-6 h-6 object-contain mb-1 mx-auto" />
                              <h4 class="text-xs font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[10px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <div class="flex justify-center gap-0.5 mb-1">
                                <span v-for="i in 5" :key="i" class="text-sm" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                              </div>
                              <button
                                class="px-2 py-1 text-white text-[10px] font-medium mx-auto"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                            <div class="w-2/5 shrink-0">
                              <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=200&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                            </div>
                          </div>
                        </template>

                        <!-- Free shipping bar -->
                        <template v-else-if="useCases[currentDeckCard].id === 'free-shipping'">
                          <div class="flex flex-col w-full h-full">
                            <div class="px-3 py-1.5 flex items-center justify-center gap-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                              <Truck :size="12" />
                              <span class="text-[10px] font-medium text-white" :style="{ fontFamily: brandSettings.primaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].progress }}
                              </span>
                            </div>
                            <div class="flex-1 bg-om-gray-50 p-2">
                              <div class="flex items-center justify-between mb-3">
                                <div class="w-12 h-3 bg-om-gray-200 rounded"></div>
                                <div class="flex gap-2">
                                  <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                                  <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                                  <div class="w-8 h-2 bg-om-gray-200 rounded"></div>
                                </div>
                              </div>
                              <div class="w-full h-12 bg-om-gray-200 rounded mb-2"></div>
                              <div class="flex gap-2">
                                <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                                <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                                <div class="flex-1 h-8 bg-om-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </template>

                        <!-- Spin wheel popup -->
                        <template v-else-if="useCases[currentDeckCard].id === 'spin-wheel'">
                          <div class="flex w-full h-full">
                            <div class="w-2/5 shrink-0 flex items-center justify-center p-2" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                              <div class="w-14 h-14 rounded-full border-3 border-white relative bg-white/20">
                                <div class="absolute inset-0 flex items-center justify-center">
                                  <div class="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                                <div v-for="(_prize, i) in 4" :key="i" class="absolute text-[5px] font-bold text-white" :style="{ top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%', bottom: i === 2 ? '4px' : 'auto', left: i === 3 ? '4px' : i === 1 ? 'auto' : '50%', right: i === 1 ? '4px' : 'auto', transform: i === 0 || i === 2 ? 'translateX(-50%)' : 'translateY(-50%)' }">
                                  {{ useCases[currentDeckCard].texts[brandSettings.language].prizes[i] }}
                                </div>
                              </div>
                            </div>
                            <div class="flex-1 p-3 flex flex-col justify-center">
                              <img src="/telekom.png" alt="Logo" class="w-5 h-5 object-contain mb-1" />
                              <h4 class="text-xs font-bold mb-1" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[9px] text-om-gray-500 mb-2" :style="{ fontFamily: brandSettings.secondaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <button
                                class="px-3 py-1 text-white text-[10px] font-medium w-fit"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>

                    <!-- Mobile Preview -->
                    <div class="w-32">
                      <div
                        class="bg-white border border-om-gray-200 overflow-hidden aspect-9/19 flex items-center justify-center"
                        :class="popupCornerClasses[brandSettings.corners]"
                      >
                        <!-- Newsletter mobile -->
                        <template v-if="useCases[currentDeckCard].id === 'newsletter'">
                          <div class="flex flex-col w-full h-full">
                            <div class="h-1/3 shrink-0">
                              <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=100&fit=crop" alt="Newsletter" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 p-2 flex flex-col justify-center">
                              <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5" />
                              <h4 class="text-[7px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[5px] text-om-gray-500 mb-1" :style="{ fontFamily: brandSettings.secondaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <div class="h-3 bg-om-gray-100 rounded text-[5px] flex items-center px-1 text-om-gray-400 mb-1" :class="cornerClasses[brandSettings.corners]">
                                Email
                              </div>
                              <button
                                class="w-full py-0.5 text-white text-[5px] font-medium"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                          </div>
                        </template>

                        <!-- Cart abandonment mobile -->
                        <template v-else-if="useCases[currentDeckCard].id === 'cart-abandonment'">
                          <div class="flex flex-col w-full h-full">
                            <div class="h-1/3 shrink-0">
                              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=100&fit=crop" alt="Shopping cart" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 p-2 flex flex-col justify-center text-center">
                              <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                              <h4 class="text-[8px] font-bold mb-0.5" :style="{ fontFamily: brandSettings.primaryFont, color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[5px] text-om-gray-500 mb-0.5" :style="{ fontFamily: brandSettings.secondaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <p class="text-[7px] font-bold mb-1" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].discount }}
                              </p>
                              <button
                                class="w-full py-0.5 text-white text-[5px] font-medium"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                          </div>
                        </template>

                        <!-- Welcome discount mobile -->
                        <template v-else-if="useCases[currentDeckCard].id === 'welcome-discount'">
                          <div class="flex flex-col w-full h-full">
                            <div class="h-1/3 shrink-0">
                              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=100&fit=crop" alt="Gift" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 p-2 flex flex-col justify-center text-center">
                              <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                              <div class="w-6 h-6 mx-auto rounded flex items-center justify-center text-white text-[5px] font-bold mb-0.5" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].discount }}
                              </div>
                              <h4 class="text-[7px] font-bold text-om-gray-800" :style="{ fontFamily: brandSettings.primaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <button
                                class="mt-1 px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                          </div>
                        </template>

                        <!-- Feedback mobile -->
                        <template v-else-if="useCases[currentDeckCard].id === 'feedback'">
                          <div class="flex flex-col w-full h-full">
                            <div class="h-1/3 shrink-0">
                              <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=200&h=100&fit=crop" alt="Feedback" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 p-2 flex flex-col justify-center text-center">
                              <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                              <h4 class="text-[6px] font-bold text-om-gray-800 mb-0.5" :style="{ fontFamily: brandSettings.primaryFont }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].rating }}
                              </h4>
                              <div class="flex justify-center gap-0.5 mb-1">
                                <span v-for="i in 5" :key="i" class="text-[8px]" :style="{ color: i <= 4 ? brandSettings.colors[brandSettings.selectedColorIndex] : '#E3E5E8' }">★</span>
                              </div>
                              <button
                                class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                          </div>
                        </template>

                        <!-- Free shipping mobile -->
                        <template v-else-if="useCases[currentDeckCard].id === 'free-shipping'">
                          <div class="flex flex-col w-full h-full">
                            <div class="px-2 py-1 flex items-center justify-center gap-1" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                              <Truck :size="8" />
                              <span class="text-[5px] font-medium text-white">Free shipping</span>
                            </div>
                            <div class="flex-1 bg-om-gray-50 p-1.5">
                              <div class="flex items-center justify-between mb-2">
                                <div class="w-6 h-1.5 bg-om-gray-200 rounded"></div>
                                <div class="flex gap-1">
                                  <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                                  <div class="w-3 h-1 bg-om-gray-200 rounded"></div>
                                </div>
                              </div>
                              <div class="w-full h-10 bg-om-gray-200 rounded mb-1.5"></div>
                              <div class="flex gap-1">
                                <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                                <div class="flex-1 h-6 bg-om-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </template>

                        <!-- Spin wheel mobile -->
                        <template v-else-if="useCases[currentDeckCard].id === 'spin-wheel'">
                          <div class="flex flex-col w-full h-full">
                            <div class="flex-1 p-2 flex flex-col justify-center text-center">
                              <img src="/telekom.png" alt="Logo" class="w-4 h-4 object-contain mb-0.5 mx-auto" />
                              <h4 class="text-[7px] font-bold mb-0.5" :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex] }">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].title }}
                              </h4>
                              <p class="text-[5px] text-om-gray-500 mb-1">
                                {{ useCases[currentDeckCard].texts[brandSettings.language].subtitle }}
                              </p>
                              <button
                                class="px-2 py-0.5 text-white text-[5px] font-medium mx-auto"
                                :class="cornerClasses[brandSettings.corners]"
                                :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }"
                              >
                                {{ useCases[currentDeckCard].texts[brandSettings.language].cta }}
                              </button>
                            </div>
                            <div class="h-1/3 shrink-0 flex items-center justify-center" :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex] }">
                              <div class="w-10 h-10 rounded-full border-2 border-white relative bg-white/20">
                                <div class="absolute inset-0 flex items-center justify-center">
                                  <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </transition>
            </div>

            </div>

            <!-- Right side scrollbar/progress indicator -->
            <div class="flex flex-col items-center gap-4 pt-16">
              <button
                v-for="(useCase, index) in useCases"
                :key="useCase.id"
                @click="currentDeckCard = index"
              >
                <div
                  class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  :class="index === currentDeckCard ? 'bg-om-orange-500 scale-125' : 'bg-om-gray-300 hover:bg-om-gray-400'"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Quicktune screen -->
    <transition v-else-if="showQuicktune" name="fade" appear>
      <div class="min-h-screen-safe bg-white overflow-y-auto">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-10 lg:pt-14 pb-8 lg:pb-12">
          <!-- Header -->
          <div class="text-center mb-12 lg:mb-20">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Quick-tune your brand settings</h2>
            <p class="text-om-gray-500">Don't worry—all settings can be customized later in the editor.</p>
          </div>

          <!-- Two column layout -->
          <div class="flex flex-col lg:flex-row gap-6 lg:gap-6">
            <!-- Left side - Popup preview + Continue button -->
            <div class="flex-1 flex flex-col items-center lg:items-start -mt-10">
              <div
                class="overflow-hidden border-2 border-om-gray-200 w-full max-w-2xl bg-white transition-all duration-300"
                :class="popupCornerClasses[brandSettings.corners]"
              >
                <div class="flex">
                  <!-- Left content side -->
                  <div class="w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                    <img src="/telekom.png" alt="Telekom Logo" class="w-10 h-10 object-contain mb-3" />
                    <h3 class="text-3xl font-bold text-om-gray-800 leading-tight mb-2" :style="{ fontFamily: brandSettings.primaryFont }">
                      {{ popupTexts[brandSettings.language].title }} {{ popupTexts[brandSettings.language].discount }}
                    </h3>
                    <p class="text-sm text-om-gray-400 mb-6" :style="{ fontFamily: brandSettings.secondaryFont }">{{ popupTexts[brandSettings.language].subtitle }}</p>
                    <button
                      class="w-full py-3 text-white text-sm font-semibold uppercase tracking-wide mb-3"
                      :class="cornerClasses[brandSettings.corners]"
                      :style="{ backgroundColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                      disabled
                    >
                      {{ popupTexts[brandSettings.language].cta }}
                    </button>
                    <button
                      class="w-full py-3 bg-transparent text-sm font-medium uppercase tracking-wide border"
                      :class="cornerClasses[brandSettings.corners]"
                      :style="{ color: brandSettings.colors[brandSettings.selectedColorIndex], borderColor: brandSettings.colors[brandSettings.selectedColorIndex], fontFamily: brandSettings.primaryFont }"
                      disabled
                    >
                      {{ popupTexts[brandSettings.language].decline }}
                    </button>
                  </div>
                  <!-- Right image side -->
                  <div class="w-1/2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop"
                      alt="Popup image"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Right side - Settings -->
            <div class="w-full lg:w-80 shrink-0 space-y-4 lg:space-y-5">
              <!-- Template language + Logo row -->
              <div class="flex gap-3">
                <!-- Template language -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Language</label>
                  <div ref="languageDropdownRef" class="relative">
                    <button
                      type="button"
                      @click="isLanguageDropdownOpen = !isLanguageDropdownOpen"
                      class="dropdown-select w-full px-3 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors h-[38px]"
                      :class="isLanguageDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                    >
                      <span>{{ selectedLanguage().label }}</span>
                      <ChevronDown :size="16" class="text-om-gray-600 transition-transform" :class="isLanguageDropdownOpen ? 'rotate-180' : ''" />
                    </button>
                    <!-- Dropdown options -->
                    <transition name="dropdown">
                      <div
                        v-if="isLanguageDropdownOpen"
                        class="absolute z-10 w-full mt-2 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                      >
                        <button
                          v-for="option in languageOptions"
                          :key="option.value"
                          type="button"
                          @click="selectLanguage(option)"
                          class="w-full px-3 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                          :class="brandSettings.language === option.value ? 'bg-om-orange-50 text-om-orange-600' : ''"
                        >
                          {{ option.label }}
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>

                <!-- Logo -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Logo</label>
                  <div class="h-[38px] bg-[repeating-conic-gradient(#E3E5E8_0%_25%,transparent_0%_50%)_50%/12px_12px] rounded-lg flex items-center justify-center border border-om-gray-200">
                    <div class="w-7 h-7 rounded-sm overflow-hidden">
                      <img src="/telekom.png" alt="Telekom Logo" class="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Colors + Corners row -->
              <div class="flex gap-3">
                <!-- Colors -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Color</label>
                  <div class="flex gap-1.5">
                    <button
                      v-for="(color, index) in brandSettings.colors"
                      :key="index"
                      class="color-swatch w-8 h-8 rounded-md border-2 transition-all cursor-pointer hover:scale-110"
                      :class="brandSettings.selectedColorIndex === index ? 'border-om-gray-700 ring-2 ring-om-gray-300' : 'border-om-gray-200 hover:border-om-gray-400'"
                      :style="{ backgroundColor: color }"
                      @click="brandSettings.selectedColorIndex = index"
                    ></button>
                  </div>
                </div>

                <!-- Corners -->
                <div class="flex-1">
                  <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Corners</label>
                  <div ref="cornersDropdownRef" class="relative">
                    <button
                      type="button"
                      @click="isCornersDropdownOpen = !isCornersDropdownOpen"
                      class="dropdown-select w-full px-3 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                      :class="isCornersDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                    >
                      <span class="flex items-center gap-2">
                        <span class="w-4 h-4 border-2 border-om-gray-400" :class="selectedCorner().class"></span>
                        <span>{{ selectedCorner().label }}</span>
                      </span>
                      <ChevronDown :size="16" class="text-om-gray-600 transition-transform" :class="isCornersDropdownOpen ? 'rotate-180' : ''" />
                    </button>
                    <transition name="dropdown">
                      <div
                        v-if="isCornersDropdownOpen"
                        class="absolute z-10 w-full mt-1 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                      >
                        <button
                          v-for="corner in cornerOptions"
                          :key="corner.id"
                          type="button"
                          @click="selectCorner(corner)"
                          class="w-full px-3 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer flex items-center gap-2"
                          :class="brandSettings.corners === corner.id ? 'bg-om-orange-50 text-om-orange-600' : ''"
                        >
                          <span class="w-4 h-4 border-2 shrink-0" :class="[corner.class, brandSettings.corners === corner.id ? 'border-om-orange-500' : 'border-om-gray-400']"></span>
                          <span>{{ corner.label }}</span>
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>

              <!-- Fonts -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-om-gray-700">Font</label>
                <!-- Primary and Secondary fonts in a row -->
                <div class="flex gap-2">
                  <!-- Primary font -->
                  <div class="flex-1">
                    <label class="block text-xs text-om-gray-500 mb-1">Primary</label>
                    <div ref="primaryFontDropdownRef" class="relative">
                      <button
                        type="button"
                        @click="isPrimaryFontDropdownOpen = !isPrimaryFontDropdownOpen"
                        class="dropdown-select w-full px-2.5 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                        :class="isPrimaryFontDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                      >
                        <span class="truncate">{{ selectedPrimaryFont().label }}</span>
                        <ChevronDown :size="14" class="text-om-gray-600 transition-transform shrink-0 ml-1" :class="isPrimaryFontDropdownOpen ? 'rotate-180' : ''" />
                      </button>
                      <transition name="dropdown">
                        <div
                          v-if="isPrimaryFontDropdownOpen"
                          class="absolute z-10 w-full mt-1 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          <button
                            v-for="option in fontOptions"
                            :key="option.value"
                            type="button"
                            @click="selectPrimaryFont(option)"
                            class="w-full px-2.5 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                            :class="brandSettings.primaryFont === option.value ? 'bg-om-orange-50 text-om-orange-600' : ''"
                          >
                            {{ option.label }}
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                  <!-- Secondary font -->
                  <div class="flex-1">
                    <label class="block text-xs text-om-gray-500 mb-1">Secondary</label>
                    <div ref="secondaryFontDropdownRef" class="relative">
                      <button
                        type="button"
                        @click="isSecondaryFontDropdownOpen = !isSecondaryFontDropdownOpen"
                        class="dropdown-select w-full px-2.5 py-1.5 border border-om-gray-200 rounded-lg bg-white text-sm text-om-gray-700 text-left flex items-center justify-between cursor-pointer transition-colors"
                        :class="isSecondaryFontDropdownOpen ? 'border-om-orange-300 ring-2 ring-om-orange-100' : 'hover:border-om-gray-300 hover:bg-[#FAFAFA]'"
                      >
                        <span class="truncate">{{ selectedSecondaryFont().label }}</span>
                        <ChevronDown :size="14" class="text-om-gray-600 transition-transform shrink-0 ml-1" :class="isSecondaryFontDropdownOpen ? 'rotate-180' : ''" />
                      </button>
                      <transition name="dropdown">
                        <div
                          v-if="isSecondaryFontDropdownOpen"
                          class="absolute z-10 w-full mt-1 bg-white border border-om-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          <button
                            v-for="option in fontOptions"
                            :key="option.value"
                            type="button"
                            @click="selectSecondaryFont(option)"
                            class="w-full px-2.5 py-1.5 text-left text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                            :class="brandSettings.secondaryFont === option.value ? 'bg-om-orange-50 text-om-orange-600' : ''"
                          >
                            {{ option.label }}
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Continue button -->
              <button
                @click="confirmQuicktune"
                class="mt-4 px-6 py-2.5 bg-om-orange-500 text-white text-sm font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer"
              >
                Continue
              </button>

            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Style selection screen -->
    <transition v-else-if="showStyleSelection" name="fade" appear>
      <div class="min-h-screen-safe bg-om-gray-50 overflow-y-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-14 pb-12">
          <!-- Header -->
          <div class="text-center mb-[52px]">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Which style do you like the most?</h2>
            <p class="text-om-gray-500">You can customize colors, fonts, and other style settings in the next step.</p>
          </div>

          <!-- Popup grid - 3 columns on large screens -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <button
              v-for="(style, index) in popupStyles"
              :key="style.id"
              @click="selectStyleAndContinue(style.id)"
              class="style-card relative rounded-lg overflow-hidden border-2 border-om-gray-200 transition-transform duration-300 cursor-pointer hover:scale-105 focus:outline-none focus:ring-0"
            >
              <!-- Popup preview image -->
              <div class="aspect-video bg-om-gray-100 flex items-center justify-center relative overflow-hidden">
                <img :src="style.image" :alt="style.name" class="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success message screen -->
    <transition v-else-if="showSuccessMessage" name="fade" appear>
      <div class="h-screen-safe bg-white flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 bg-[#239E77] rounded-full flex items-center justify-center">
            <Check :size="32" />
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-[#23262A]">Analysis successful</h2>
        </div>
      </div>
    </transition>

    <!-- Analysis screen - two column layout (responsive) -->
    <transition v-else-if="submitted && showAnalysisContent" name="fade" appear>
      <div class="h-screen-safe bg-white flex items-center justify-center px-4 sm:px-6 md:px-8 xl:px-12">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-6xl w-full">
        <!-- Left side - Scanner animation -->
        <div class="shrink-0 -mt-10">
          <WebsiteScanAnimation />
        </div>

        <!-- Right side - Discovered items list -->
        <div class="flex-1 w-full md:w-auto md:min-w-72 lg:min-w-80 xl:max-w-72 2xl:max-w-80">
          <!-- Title -->
          <div class="mb-6 text-center md:text-left">
            <h2 class="text-xl sm:text-2xl font-semibold text-[#23262A]">Analyzing your website</h2>
          </div>

          <!-- Discovered items - vertical list -->
          <div class="space-y-3">
            <!-- Logo item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.logo" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Logo</p>
                </div>
                <div class="w-14 h-14 rounded-lg overflow-hidden bg-white border border-[#E3E5E8] flex items-center justify-center shrink-0">
                  <img src="/telekom.png" alt="Logo" class="w-full h-full object-cover" />
                </div>
              </div>
            </transition>

            <!-- Colors item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.colors" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Colors</p>
                </div>
                <div class="flex gap-1.5 shrink-0">
                  <div v-for="color in brandColors" :key="color"
                       class="w-6 h-6 rounded-full border border-white shadow-sm"
                       :style="{ backgroundColor: color }"></div>
                </div>
              </div>
            </transition>

            <!-- Fonts item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.fonts" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Fonts</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span
                    v-for="(font, index) in discoveredFonts"
                    :key="font.name"
                    class="text-base text-om-gray-600"
                    :style="{ fontFamily: font.fontFamily }"
                  >{{ font.name }}{{ index < discoveredFonts.length - 1 ? ',' : '' }}</span>
                </div>
              </div>
            </transition>

            <!-- Language item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.language" class="bg-[#F7F7F8] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#23262A]">Language</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-lg">🇬🇧</span>
                  <span class="text-sm text-om-gray-600">English</span>
                </div>
              </div>
            </transition>

            <!-- Currently analyzing message - shows below discovered items -->
            <transition name="fade-message">
              <div v-if="currentlyAnalyzing" class="flex items-center gap-2 py-2">
                <div class="w-4 h-4 border-2 border-om-gray-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
                <p class="text-sm text-om-gray-500">{{ analyzingMessages[currentlyAnalyzing] }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    </transition>

    <!-- Initial state - should not be visible as we auto-start -->
    <div v-else class="w-full h-full flex flex-col items-center justify-center">
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-semibold text-[#23262A]">Wizard analysis</h2>
        <p class="text-[#505763] mt-2">Starting analysis based on your use case...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Truck, Check } from 'lucide-vue-next'
import WebsiteScanAnimation from '../illustrations/WebsiteScanAnimation.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  initialMessage: {
    type: String,
    default: ''
  },
  startAtStyle: {
    type: Boolean,
    default: false
  },
  startAtQuicktune: {
    type: Boolean,
    default: false
  },
  startAtRecommendation: {
    type: Boolean,
    default: false
  },
  startAtRecommendationV2: {
    type: Boolean,
    default: false
  },
  startAtRecommendationV3: {
    type: Boolean,
    default: false
  },
  startAtRecommendationV4: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'task-created'])

const submitted = ref(false)
const submittedMessage = ref('')
const currentlyAnalyzing = ref(null) // 'logo', 'colors', 'fonts', 'language', or null
const showAnalysisContent = ref(true)
const showSuccessMessage = ref(false)
const showStyleSelection = ref(false)
const selectedStyle = ref(null)
const showQuicktune = ref(false)
const showRecommendation = ref(false)
const showRecommendationV2 = ref(false)
const showRecommendationV3 = ref(false)
const showRecommendationV4 = ref(false)

// V3 deck card navigation
const currentDeckCard = ref(0)
const isScrolling = ref(false)
const scrollDirection = ref('down') // 'up' or 'down'

const handleDeckScroll = (event) => {
  if (isScrolling.value) return

  const delta = event.deltaY
  const totalCards = useCases.length

  if (delta > 0 && currentDeckCard.value < totalCards - 1) {
    // Scroll down - next card
    scrollDirection.value = 'down'
    isScrolling.value = true
    currentDeckCard.value++
    setTimeout(() => { isScrolling.value = false }, 400)
    event.preventDefault()
  } else if (delta < 0 && currentDeckCard.value > 0) {
    // Scroll up - previous card
    scrollDirection.value = 'up'
    isScrolling.value = true
    currentDeckCard.value--
    setTimeout(() => { isScrolling.value = false }, 400)
    event.preventDefault()
  }
}

const deckTransitionName = computed(() => scrollDirection.value === 'up' ? 'deck-card-up' : 'deck-card-down')

// Brand settings for quicktune
const brandSettings = reactive({
  language: 'en',
  colors: ['#E20074', '#18214D', '#5D6482'],
  selectedColorIndex: 0,
  primaryFont: 'Inter',
  secondaryFont: 'Arial',
  corners: 'none'
})

const cornerOptions = [
  { id: 'none', label: 'None', class: 'rounded-none' },
  { id: 'small', label: 'Small', class: 'rounded-sm' },
  { id: 'medium', label: 'Medium', class: 'rounded-md' },
  { id: 'large', label: 'Large', class: 'rounded-lg' }
]

const cornerClasses = {
  none: 'rounded-none',
  small: 'rounded-lg',
  medium: 'rounded-xl',
  large: 'rounded-full'
}

// Popup container corner classes (larger for the outer container)
const popupCornerClasses = {
  none: 'rounded-none',
  small: 'rounded-xl',
  medium: 'rounded-2xl',
  large: 'rounded-3xl'
}

// Popup text translations
const popupTexts = {
  en: {
    title: "You've got",
    discount: "10% OFF",
    subtitle: "Save it before it's gone.",
    cta: "Claim 10% Off",
    decline: "No, Thanks"
  },
  hu: {
    title: "Kaptál",
    discount: "10% KEDVEZMÉNYT",
    subtitle: "Mentsd el, mielőtt lejár.",
    cta: "Kupon igénylése",
    decline: "Nem, köszönöm"
  },
  de: {
    title: "Du hast",
    discount: "10% RABATT",
    subtitle: "Sichere es dir, bevor es weg ist.",
    cta: "10% sichern",
    decline: "Nein, danke"
  },
  fr: {
    title: "Vous avez",
    discount: "10% DE RÉDUCTION",
    subtitle: "Économisez avant qu'il ne soit trop tard.",
    cta: "Réclamer 10%",
    decline: "Non, merci"
  },
  es: {
    title: "Tienes",
    discount: "10% DE DESCUENTO",
    subtitle: "Guárdalo antes de que se acabe.",
    cta: "Reclamar 10%",
    decline: "No, gracias"
  }
}

// Language dropdown
const languageDropdownRef = ref(null)
const isLanguageDropdownOpen = ref(false)
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' }
]

const selectedLanguage = () => {
  return languageOptions.find(opt => opt.value === brandSettings.language) || languageOptions[0]
}

const selectLanguage = (option) => {
  brandSettings.language = option.value
  isLanguageDropdownOpen.value = false
}

// Primary font dropdown
const primaryFontDropdownRef = ref(null)
const isPrimaryFontDropdownOpen = ref(false)
const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' }
]

const selectedPrimaryFont = () => {
  return fontOptions.find(opt => opt.value === brandSettings.primaryFont) || fontOptions[0]
}

const selectPrimaryFont = (option) => {
  brandSettings.primaryFont = option.value
  isPrimaryFontDropdownOpen.value = false
}

// Secondary font dropdown
const secondaryFontDropdownRef = ref(null)
const isSecondaryFontDropdownOpen = ref(false)

const selectedSecondaryFont = () => {
  return fontOptions.find(opt => opt.value === brandSettings.secondaryFont) || fontOptions[1]
}

const selectSecondaryFont = (option) => {
  brandSettings.secondaryFont = option.value
  isSecondaryFontDropdownOpen.value = false
}

// Corners dropdown
const cornersDropdownRef = ref(null)
const isCornersDropdownOpen = ref(false)

const selectedCorner = () => {
  return cornerOptions.find(opt => opt.id === brandSettings.corners) || cornerOptions[0]
}

const selectCorner = (corner) => {
  brandSettings.corners = corner.id
  isCornersDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  if (languageDropdownRef.value && !languageDropdownRef.value.contains(event.target)) {
    isLanguageDropdownOpen.value = false
  }
  if (primaryFontDropdownRef.value && !primaryFontDropdownRef.value.contains(event.target)) {
    isPrimaryFontDropdownOpen.value = false
  }
  if (secondaryFontDropdownRef.value && !secondaryFontDropdownRef.value.contains(event.target)) {
    isSecondaryFontDropdownOpen.value = false
  }
  if (cornersDropdownRef.value && !cornersDropdownRef.value.contains(event.target)) {
    isCornersDropdownOpen.value = false
  }
}

// Track which discoveries have been made
const discoveries = reactive({
  logo: false,
  colors: false,
  fonts: false,
  language: false
})

const brandColors = ['#E20074', '#18214D', '#5D6482']
const discoveredFonts = [
  { name: 'Inter', fontFamily: '"Inter", sans-serif' },
  { name: 'Arial', fontFamily: 'Arial, sans-serif' }
]

const popupStyles = [
  { id: 'modern', name: 'Modern', image: '/om_popup_1.png' },
  { id: 'classic', name: 'Classic', image: '/om_popup_2.png' },
  { id: 'minimal', name: 'Minimal', image: '/om_popup_3.png' },
  { id: 'bold', name: 'Bold', image: '/om_popup_4.png' },
  { id: 'elegant', name: 'Elegant', image: '/om_popup_5.png' },
  { id: 'playful', name: 'Playful', image: '/om_popup_6.png' }
]

// Use cases for recommendation page
const useCases = [
  {
    id: 'newsletter',
    title: 'Newsletter Signup',
    description: 'Build your email list with an engaging signup popup',
    icon: 'mail',
    texts: {
      en: { title: 'Join our newsletter', subtitle: 'Get exclusive offers and updates', cta: 'Subscribe', input: 'Enter your email' },
      hu: { title: 'Iratkozz fel hírlevelünkre', subtitle: 'Kapj exkluzív ajánlatokat', cta: 'Feliratkozás', input: 'Add meg az email címed' },
      de: { title: 'Newsletter abonnieren', subtitle: 'Exklusive Angebote erhalten', cta: 'Abonnieren', input: 'E-Mail eingeben' },
      fr: { title: 'Inscrivez-vous', subtitle: 'Offres exclusives et actualités', cta: "S'inscrire", input: 'Votre email' },
      es: { title: 'Suscríbete', subtitle: 'Ofertas exclusivas y novedades', cta: 'Suscribirse', input: 'Tu email' }
    }
  },
  {
    id: 'cart-abandonment',
    title: 'Cart Abandonment',
    description: 'Recover lost sales with exit-intent offers',
    icon: 'cart',
    texts: {
      en: { title: 'Wait!', subtitle: "Don't leave your cart behind", cta: 'Get 15% Off', discount: '15% OFF' },
      hu: { title: 'Várj!', subtitle: 'Ne hagyd itt a kosarad', cta: '15% kedvezmény', discount: '15% KEDVEZMÉNY' },
      de: { title: 'Warte!', subtitle: 'Vergiss deinen Warenkorb nicht', cta: '15% Rabatt sichern', discount: '15% RABATT' },
      fr: { title: 'Attendez!', subtitle: "N'oubliez pas votre panier", cta: 'Obtenir 15%', discount: '15% DE RÉDUCTION' },
      es: { title: '¡Espera!', subtitle: 'No dejes tu carrito', cta: 'Obtener 15%', discount: '15% DESCUENTO' }
    }
  },
  {
    id: 'welcome-discount',
    title: 'Welcome Discount',
    description: 'Convert first-time visitors with a special offer',
    icon: 'gift',
    texts: {
      en: { title: 'Welcome!', subtitle: 'Get your first order discount', cta: 'Claim Offer', discount: '10% OFF' },
      hu: { title: 'Üdvözlünk!', subtitle: 'Kapd meg az első rendelés kedvezményt', cta: 'Kupon igénylése', discount: '10% KEDVEZMÉNY' },
      de: { title: 'Willkommen!', subtitle: 'Erstbestellungsrabatt sichern', cta: 'Angebot sichern', discount: '10% RABATT' },
      fr: { title: 'Bienvenue!', subtitle: 'Remise première commande', cta: 'Réclamer', discount: '10% DE RÉDUCTION' },
      es: { title: '¡Bienvenido!', subtitle: 'Descuento en tu primer pedido', cta: 'Reclamar', discount: '10% DESCUENTO' }
    }
  },
  {
    id: 'feedback',
    title: 'Feedback Survey',
    description: 'Collect valuable customer insights',
    icon: 'star',
    texts: {
      en: { title: 'How was your experience?', subtitle: 'Help us improve', cta: 'Share Feedback', rating: 'Rate us' },
      hu: { title: 'Milyen volt a tapasztalatod?', subtitle: 'Segíts nekünk fejlődni', cta: 'Visszajelzés', rating: 'Értékelj minket' },
      de: { title: 'Wie war Ihre Erfahrung?', subtitle: 'Helfen Sie uns', cta: 'Feedback geben', rating: 'Bewerten Sie uns' },
      fr: { title: 'Comment était votre expérience?', subtitle: 'Aidez-nous à améliorer', cta: 'Donner un avis', rating: 'Notez-nous' },
      es: { title: '¿Cómo fue tu experiencia?', subtitle: 'Ayúdanos a mejorar', cta: 'Dar opinión', rating: 'Califícanos' }
    }
  },
  {
    id: 'free-shipping',
    title: 'Free Shipping Bar',
    description: 'Increase average order value',
    icon: 'truck',
    texts: {
      en: { title: 'Free shipping', subtitle: 'on orders over $50', progress: 'Add $25 more for free shipping!' },
      hu: { title: 'Ingyenes szállítás', subtitle: '15.000 Ft feletti rendelésnél', progress: 'Még 5.000 Ft az ingyenes szállításhoz!' },
      de: { title: 'Kostenloser Versand', subtitle: 'ab 50€ Bestellwert', progress: 'Noch 25€ für kostenlosen Versand!' },
      fr: { title: 'Livraison gratuite', subtitle: 'dès 50€ d\'achat', progress: 'Plus que 25€ pour la livraison gratuite!' },
      es: { title: 'Envío gratis', subtitle: 'en pedidos de más de 50€', progress: '¡Añade 25€ más para envío gratis!' }
    }
  },
  {
    id: 'spin-wheel',
    title: 'Spin to Win',
    description: 'Gamify the shopping experience',
    icon: 'wheel',
    texts: {
      en: { title: 'Spin to Win!', subtitle: 'Try your luck for exclusive prizes', cta: 'Spin Now', prizes: ['10% OFF', '15% OFF', 'Free Gift', '20% OFF'] },
      hu: { title: 'Pörgesd meg!', subtitle: 'Nyerj exkluzív ajándékokat', cta: 'Pörgetés', prizes: ['10% KEDV.', '15% KEDV.', 'Ajándék', '20% KEDV.'] },
      de: { title: 'Dreh und Gewinn!', subtitle: 'Gewinne tolle Preise', cta: 'Jetzt drehen', prizes: ['10% RABATT', '15% RABATT', 'Geschenk', '20% RABATT'] },
      fr: { title: 'Tournez et gagnez!', subtitle: 'Tentez votre chance', cta: 'Tourner', prizes: ['10% OFF', '15% OFF', 'Cadeau', '20% OFF'] },
      es: { title: '¡Gira y gana!', subtitle: 'Prueba tu suerte', cta: 'Girar', prizes: ['10% DESC.', '15% DESC.', 'Regalo', '20% DESC.'] }
    }
  }
]

const analyzingMessages = {
  logo: 'Looking for logo...',
  colors: 'Analyzing brand colors...',
  fonts: 'Identifying fonts...',
  language: 'Detecting language...'
}

const localData = reactive({
  message: props.modelValue.message || ''
})

// Analysis steps with timing
const runAnalysis = () => {
  // Step 1: Start analyzing logo
  setTimeout(() => {
    currentlyAnalyzing.value = 'logo'
  }, 500)

  // Logo found
  setTimeout(() => {
    discoveries.logo = true
    currentlyAnalyzing.value = 'colors'
  }, 3000)

  // Step 2: Colors found
  setTimeout(() => {
    discoveries.colors = true
    currentlyAnalyzing.value = 'fonts'
  }, 6000)

  // Step 3: Fonts found
  setTimeout(() => {
    discoveries.fonts = true
    currentlyAnalyzing.value = 'language'
  }, 9000)

  // Step 4: Language found
  setTimeout(() => {
    discoveries.language = true
    currentlyAnalyzing.value = null
  }, 11500)

  // Step 5: Fade out analysis content and show success message simultaneously
  setTimeout(() => {
    showAnalysisContent.value = false
    showSuccessMessage.value = true
  }, 12000)

  // Step 6: Fade out success message and show style selection
  setTimeout(() => {
    showSuccessMessage.value = false
    showStyleSelection.value = true
  }, 14000)
}

const selectStyle = (styleId) => {
  selectedStyle.value = styleId
}

const selectStyleAndContinue = (styleId) => {
  selectedStyle.value = styleId
  showStyleSelection.value = false
  showQuicktune.value = true
}

const confirmStyleSelection = () => {
  showStyleSelection.value = false
  showQuicktune.value = true
}

const confirmQuicktune = () => {
  showQuicktune.value = false
  showRecommendation.value = true
}

const handleSubmit = () => {
  if (localData.message?.trim()) {
    submittedMessage.value = localData.message.trim()
    emit('update:modelValue', { message: submittedMessage.value })
    emit('task-created', { message: submittedMessage.value, phase: 'analysis' })
    submitted.value = true
    runAnalysis()
  }
}

const resetToInitial = () => {
  submitted.value = false
  submittedMessage.value = ''
  localData.message = ''
  currentlyAnalyzing.value = null
  showAnalysisContent.value = true
  showSuccessMessage.value = false
  showStyleSelection.value = false
  selectedStyle.value = null
  showQuicktune.value = false
  showRecommendation.value = false
  showRecommendationV2.value = false
  discoveries.logo = false
  discoveries.colors = false
  discoveries.fonts = false
  discoveries.language = false
}

// Start analysis with a pre-filled message (used when coming from wizard)
const startWithMessage = (message) => {
  if (message?.trim()) {
    localData.message = message.trim()
    handleSubmit()
  }
}

// Auto-start if initialMessage is provided or start at style selection, quicktune, or recommendation
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  if (props.startAtRecommendation) {
    // Start directly at recommendation v1
    submitted.value = true
    showAnalysisContent.value = false
    showRecommendation.value = true
  } else if (props.startAtRecommendationV2) {
    // Start directly at recommendation v2
    submitted.value = true
    showAnalysisContent.value = false
    showRecommendationV2.value = true
  } else if (props.startAtRecommendationV3) {
    // Start directly at recommendation v3
    submitted.value = true
    showAnalysisContent.value = false
    showRecommendationV3.value = true
  } else if (props.startAtRecommendationV4) {
    // Start directly at recommendation v4
    submitted.value = true
    showAnalysisContent.value = false
    showRecommendationV4.value = true
  } else if (props.startAtQuicktune) {
    // Start directly at quicktune
    submitted.value = true
    showAnalysisContent.value = false
    showQuicktune.value = true
  } else if (props.startAtStyle) {
    // Start directly at style selection
    submitted.value = true
    showAnalysisContent.value = false
    showStyleSelection.value = true
  } else if (props.initialMessage) {
    // Immediately set submitted to true to avoid flash of initial state
    submitted.value = true
    localData.message = props.initialMessage.trim()
    // Delay analysis start for fade-in animation
    setTimeout(() => {
      runAnalysis()
    }, 100)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  resetToInitial,
  startWithMessage
})
</script>

<style scoped>
.slide-in-enter-active {
  transition: all 0.4s ease-out;
}

.slide-in-leave-active {
  transition: all 0.3s ease-in;
}

.slide-in-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-in-leave-to {
  opacity: 0;
}

.fade-message-enter-active {
  transition: all 0.3s ease-out;
}

.fade-message-leave-active {
  transition: all 0.2s ease-in;
}

.fade-message-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}

.fade-message-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 1s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Style cards - prevent orange border on hover */
.style-card {
  box-shadow: none !important;
}

.style-card:hover {
  border-color: #E3E5E8 !important;
  box-shadow: none !important;
}

.style-card:focus {
  border-color: #E3E5E8 !important;
  box-shadow: none !important;
  outline: none !important;
}

/* Dropdown transition */
.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Color swatch - prevent any orange focus/hover effects */
.color-swatch:focus {
  outline: none !important;
  box-shadow: none !important;
}

.color-swatch:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

/* Deck card transition - scrolling DOWN (next card) */
.deck-card-down-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.deck-card-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
}

.deck-card-down-enter-from {
  opacity: 0;
  transform: translateY(60px) scale(0.96);
}

.deck-card-down-leave-to {
  opacity: 0;
  transform: translateY(-60px) rotate(-2deg) scale(0.98);
}

/* Deck card transition - scrolling UP (previous card) */
.deck-card-up-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.deck-card-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
}

.deck-card-up-enter-from {
  opacity: 0;
  transform: translateY(-60px) scale(0.96);
}

.deck-card-up-leave-to {
  opacity: 0;
  transform: translateY(60px) rotate(2deg) scale(0.98);
}
</style>
