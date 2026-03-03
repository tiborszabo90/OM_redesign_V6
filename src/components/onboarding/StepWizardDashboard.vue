<template>
  <div class="w-full h-full relative">
    <!-- Logo at top left corner - only in no-chat version (chat version has sidebar with logo) -->
    <div v-if="!props.showChat && !showRecommendation && !showRecommendationV2 && !showRecommendationV4 && !showRecommendationV5" class="pt-8 pl-8 pb-3">
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
                    <img :src="useCase.image" :alt="useCase.title" class="w-full h-full object-cover" />
                  </div>
                  </div>
                </div>

                <!-- Right column: Mobile Preview (fixed aspect ratio) -->
                <div class="w-40 shrink-0">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-9/19 flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <img :src="useCase.image" :alt="useCase.title" class="w-full h-full object-cover" />
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
                <div class="flex-1 flex flex-col justify-center pl-10">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-om-gray-200 rounded flex items-center justify-center">
                      <component :is="iconMap[useCase.icon]" :size="14" class="text-om-gray-500" />
                    </div>
                    <span class="text-xs font-medium text-om-gray-500 uppercase">{{ useCase.title }}</span>
                  </div>
                  <h3 class="text-2xl font-semibold text-om-gray-700 mb-2">{{ useCase.description }}</h3>
                  <p class="text-sm text-om-gray-500 mb-4">{{ useCase.subheadline }}</p>
                  <button
                    class="px-5 py-2.5 text-base font-medium text-white bg-om-orange-500 rounded-lg hover:bg-om-orange-400 transition-colors w-fit"
                  >
                    Show more
                  </button>
                </div>

                <!-- Previews container -->
                <div class="flex gap-3 shrink-0 items-center">
                  <!-- Desktop Preview -->
                  <div class="flex justify-center">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden h-64 aspect-video flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <img :src="useCase.image" :alt="useCase.title" class="w-full h-full object-cover" />
                  </div>
                </div>

                  <!-- Mobile Preview -->
                  <div class="w-36">
                  <div
                    class="bg-white border border-om-gray-200 overflow-hidden aspect-9/19 flex items-center justify-center"
                    :class="popupCornerClasses[brandSettings.corners]"
                  >
                    <img :src="useCase.image" :alt="useCase.title" class="w-full h-full object-cover" />
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
      <div class="min-h-screen-safe bg-white" :class="{ 'mr-90': props.showChat }">
        <!-- Two-column intro section -->
        <div class="w-full flex gap-6 items-stretch p-6 h-screen-safe">
          <!-- Left column (60%) -->
          <div class="w-[60%] flex items-center">
            <div class="bg-[#F9FAFB] rounded-2xl px-15 py-12 w-full h-full relative flex items-center">
              <div class="w-full">
                <!-- URL Chip -->
                <div class="mb-5">
                  <span class="inline-block px-6 py-2 bg-[#FEF3EF] text-[#ED5A29] text-base rounded-full border border-[#FECAB5]">
                    telekom.hu
                  </span>
                </div>

                <!-- Main Heading -->
                <h1 class="text-6xl font-bold mb-8 leading-none text-[#23262A]">
                  Optimization Plan<br>
                  for Telekom
                </h1>

                <!-- Cards Container -->
                <div class="flex gap-6">
                  <!-- Objective Card -->
                  <div class="flex-1 bg-white rounded-2xl p-5">
                    <div class="flex items-center gap-3 mb-5">
                      <div class="w-10 h-10 bg-[#FEF3EF] rounded-lg flex items-center justify-center">
                        <Target :size="20" class="text-[#ED5A29]" />
                      </div>
                      <h2 class="text-xl font-bold text-[#23262A]">Objective</h2>
                    </div>
                    <p class="text-sm text-[#505763] leading-relaxed">
                      The primary goal is to identify effective conversion optimization strategies to boost revenue for Telekom.
                    </p>
                  </div>

                  <!-- Solutions Card -->
                  <div class="flex-1 bg-white rounded-2xl p-5">
                    <div class="flex items-center gap-3 mb-5">
                      <div class="w-10 h-10 bg-[#FEF3EF] rounded-lg flex items-center justify-center">
                        <Lightbulb :size="20" class="text-[#ED5A29]" />
                      </div>
                      <h2 class="text-xl font-bold text-[#23262A]">Solutions</h2>
                    </div>
                    <p class="text-sm text-[#505763] leading-relaxed">
                      Following a thorough website analysis, we've developed <span class="font-semibold text-[#ED5A29]">6 tailored popup strategies</span> and <span class="font-semibold text-[#ED5A29]">2 site optimization recommendations</span> aimed at enhancing user engagement and increasing conversions.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Floating Mouse Icon -->
              <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
                <Mouse :size="36" class="text-[#8F97A4]" />
              </div>
            </div>
          </div>

          <!-- Right column (40%) -->
          <div class="w-[40%] flex items-center">
            <div class="w-full h-full bg-[#F9FAFB] rounded-2xl overflow-hidden flex items-center justify-center">
              <!-- Placeholder image -->
              <img
                src="/telekom_img1.png"
                alt="Telekom"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Use cases section -->
        <div class="max-w-[1520px] mx-auto px-6 mt-6 pb-[100px]">
          <!-- Heading with divider -->
          <div class="flex items-center gap-6 mb-12">
            <h2 class="text-3xl font-semibold text-om-gray-700 whitespace-nowrap pl-15">
              Recommended Popup Campaigns
            </h2>
            <div class="flex-1 h-px bg-om-gray-300"></div>
            <div class="w-15"></div>
          </div>

          <!-- Use cases list - single column -->
          <div class="flex flex-col gap-12">
            <div
              v-for="(useCase, index) in useCases"
              :key="useCase.id"
              :ref="el => { if (el) useCaseRefs[index] = el }"
              class="bg-om-gray-50 rounded-2xl p-5 lg:p-6 use-case-item @container"
              :class="{ 'animate-fade-in-up-visible': visibleUseCases[index] }"
            >
              <OptimizationPlanCard
                :use-case="useCase"
                :brand-color="brandColor"
                :corner-class="cornerClass"
                :icon-component="iconMap[useCase.icon]"
                variant="v4"
              />
            </div>
          </div>

          <!-- Second heading with divider -->
          <div class="flex items-center gap-6 mb-12 mt-24">
            <h2 class="text-3xl font-semibold text-om-gray-700 whitespace-nowrap pl-15">
              Recommended Site Optimizations
            </h2>
            <div class="flex-1 h-px bg-om-gray-300"></div>
            <div class="w-15"></div>
          </div>

          <!-- Site Optimization use case -->
          <div class="bg-om-gray-50 rounded-2xl p-5 lg:p-6">
            <div class="flex gap-12 items-center">
              <!-- Left column: Text and button -->
              <div class="flex-1 flex flex-col justify-center pl-10 lg:pl-9">
                <div class="flex items-center gap-2 mt-4 mb-2">
                  <div class="w-6 h-6 bg-om-gray-200 rounded-md flex items-center justify-center">
                    <component :is="Sparkles" :size="14" class="text-om-gray-500" />
                  </div>
                  <span class="text-xs font-medium text-om-gray-500 uppercase">Product Value Spotlight</span>
                </div>
                <h3 class="text-xl font-semibold text-om-gray-700 mb-3">Showcase the value shoppers need to say yes</h3>
                <p class="text-sm text-om-gray-500 mb-4">Highlight what matters most, exactly where buying decisions happen.</p>
                <button
                  class="px-5 py-2.5 text-base font-medium text-white bg-om-orange-500 rounded-lg hover:bg-om-orange-400 transition-colors w-fit flex items-center gap-2"
                >
                  <span>Show more</span>
                  <ChevronRight :size="20" />
                </button>
              </div>

              <!-- Previews container -->
              <div class="flex gap-3 shrink-0 items-center">
                <!-- Desktop Preview -->
                <div class="w-[284px] lg:w-[370px] xl:w-[455px] 2xl:w-[512px] 3xl:w-[569px]">
                  <img src="/image-with-badge1.jpg" alt="Product Value Spotlight" class="w-full h-auto rounded-lg border border-om-gray-200" />
                </div>

                <!-- Mobile Preview -->
                <div class="w-[106px] lg:w-[136px] xl:w-[152px] 2xl:w-[182px] 3xl:w-[212px]">
                  <img src="/image-with-badge1m.jpg" alt="Product Value Spotlight Mobile" class="w-full h-auto rounded-lg border border-om-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>


    <!-- Recommendation screen V5 -->
    <transition v-else-if="showRecommendationV5" name="fade" appear>
      <div class="min-h-screen-safe bg-white overflow-y-auto">
        <!-- Two-column intro section -->
        <div class="w-full flex gap-6 items-stretch p-6 h-screen-safe">
          <!-- Left column (60%) -->
          <div class="w-[60%] flex items-center">
            <div class="bg-[#F9FAFB] rounded-2xl px-15 py-12 w-full h-full relative flex items-center">
              <div class="w-full">
                <!-- URL Chip -->
                <div class="mb-5">
                  <span class="inline-block px-6 py-2 bg-[#FEF3EF] text-[#ED5A29] text-base rounded-full border border-[#FECAB5]">
                    telekom.hu
                  </span>
                </div>

                <!-- Main Heading -->
                <h1 class="text-6xl font-bold mb-8 leading-none text-[#23262A]">
                  Optimization Plan<br>
                  for Telekom
                </h1>

                <!-- Cards Container -->
                <div class="flex gap-6">
                  <!-- Objective Card -->
                  <div class="flex-1 bg-white rounded-2xl p-5">
                    <div class="flex items-center gap-3 mb-5">
                      <div class="w-10 h-10 bg-[#FEF3EF] rounded-lg flex items-center justify-center">
                        <Target :size="20" class="text-[#ED5A29]" />
                      </div>
                      <h2 class="text-xl font-bold text-[#23262A]">Objective</h2>
                    </div>
                    <p class="text-sm text-[#505763] leading-relaxed">
                      The primary goal is to identify effective conversion optimization strategies to boost revenue for Telekom.
                    </p>
                  </div>

                  <!-- Solutions Card -->
                  <div class="flex-1 bg-white rounded-2xl p-5">
                    <div class="flex items-center gap-3 mb-5">
                      <div class="w-10 h-10 bg-[#FEF3EF] rounded-lg flex items-center justify-center">
                        <Lightbulb :size="20" class="text-[#ED5A29]" />
                      </div>
                      <h2 class="text-xl font-bold text-[#23262A]">Solutions</h2>
                    </div>
                    <p class="text-sm text-[#505763] leading-relaxed">
                      Following a thorough website analysis, we've developed <span class="font-semibold text-[#ED5A29]">6 tailored popup strategies</span> and <span class="font-semibold text-[#ED5A29]">2 site optimization recommendations</span> aimed at enhancing user engagement and increasing conversions.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Floating Mouse Icon -->
              <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
                <Mouse :size="36" class="text-[#8F97A4]" />
              </div>
            </div>
          </div>

          <!-- Right column (40%) -->
          <div class="w-[40%] flex items-center">
            <div class="w-full h-full bg-[#F9FAFB] rounded-2xl overflow-hidden flex items-center justify-center">
              <!-- Placeholder image -->
              <img
                src="/telekom_img1.png"
                alt="Telekom"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Use cases section -->
        <div class="bg-om-gray-50 py-12 mx-6 rounded-3xl">
          <div class="max-w-[1520px] mx-auto px-6">
            <div class="flex items-center gap-6 mb-10">
              <h2 class="text-base font-semibold uppercase text-[#23262A] whitespace-nowrap tracking-wide">Our recommended popup campaigns</h2>
              <div class="flex-1 h-px bg-om-gray-200"></div>
            </div>
            <!-- Use cases list - single column -->
            <div class="flex flex-col gap-12">
            <div
              v-for="useCase in useCases"
              :key="useCase.id"
              class="bg-white rounded-2xl p-5 lg:p-6 shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] @container"
            >
              <OptimizationPlanCard
                :use-case="useCase"
                :brand-color="brandColor"
                :corner-class="cornerClass"
                :icon-component="iconMap[useCase.icon]"
                variant="v5"
              />
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
                    <p class="text-lg text-om-gray-500 mb-5">{{ useCases[currentDeckCard].subheadline }}</p>
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
      <div class="min-h-screen-safe bg-white overflow-y-auto" :class="{ 'mr-90': props.showChat }">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-8 lg:pb-12">
          <!-- Header -->
          <div class="text-left mb-12 lg:mb-20">
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
                  <Dropdown v-model="languageModel" :options="languageOptions" size="sm" />
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
                  <Dropdown v-model="cornersModel" :options="cornerDropdownOptions" size="sm">
                    <template #selected="{ option }">
                      <span class="flex items-center gap-2">
                        <span class="w-4 h-4 border-2 border-om-gray-400" :class="option?.iconClass"></span>
                        <span>{{ option?.label || 'None' }}</span>
                      </span>
                    </template>
                    <template #option="{ option, selected }">
                      <span class="flex items-center gap-2">
                        <span class="w-4 h-4 border-2 shrink-0" :class="[option.iconClass, selected ? 'border-om-orange-500' : 'border-om-gray-400']"></span>
                        <span>{{ option.label }}</span>
                      </span>
                    </template>
                  </Dropdown>
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
                    <Dropdown v-model="primaryFontModel" :options="fontOptions" size="sm" />
                  </div>
                  <!-- Secondary font -->
                  <div class="flex-1">
                    <label class="block text-xs text-om-gray-500 mb-1">Secondary</label>
                    <Dropdown v-model="secondaryFontModel" :options="fontOptions" size="sm" />
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
      <div class="min-h-screen-safe bg-om-gray-50 overflow-y-auto" :class="{ 'mr-90': props.showChat }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-12 pb-12">
          <!-- Header -->
          <div class="mb-[52px]">
            <h2 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 mb-2">Which style do you like the most?</h2>
            <p class="text-om-gray-500">You can customize colors, fonts, and other style settings in the next step.</p>
          </div>

          <!-- Popup grid - 2 columns -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
      <div class="h-screen-safe bg-white flex items-center justify-center" :class="{ 'mr-90': props.showChat }">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 bg-[#239E77] rounded-full flex items-center justify-center">
            <Check :size="32" />
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-[#23262A]">Analysis successful</h2>
        </div>
      </div>
    </transition>

    <!-- Analysis screen - scanner only when chat is active, two-column when no chat -->
    <transition v-else-if="submitted && showAnalysisContent" name="fade" appear>
      <div class="h-screen-safe bg-white flex items-center justify-center px-4 sm:px-6 md:px-8 xl:px-12" :class="{ 'mr-90': props.showChat }">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-12 xl:gap-16 max-w-6xl w-full" :class="{ 'justify-center': props.showChat }">
        <!-- Scanner animation -->
        <div class="shrink-0 -mt-10">
          <WebsiteScanAnimation />
        </div>

        <!-- Right side - Discovered items list (only when chat is OFF) -->
        <div v-if="!props.showChat" class="flex-1 w-full md:w-auto md:min-w-72 lg:min-w-80 xl:max-w-72 2xl:max-w-80">
          <!-- Title -->
          <div class="mb-6 text-center md:text-left">
            <h2 class="text-xl sm:text-2xl font-semibold text-[#23262A]">Analyzing your website</h2>
          </div>

          <!-- Discovered items - vertical list -->
          <div class="space-y-3">
            <!-- Logo item - only show box when discovered -->
            <transition name="slide-in">
              <div v-if="discoveries.logo" class="bg-[#F9FAFB] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
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
              <div v-if="discoveries.colors" class="bg-[#F9FAFB] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
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
              <div v-if="discoveries.fonts" class="bg-[#F9FAFB] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
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
              <div v-if="discoveries.language" class="bg-[#F9FAFB] rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
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

    <!-- Chat panel - right side, visible during wizard phases (not recommendations) -->
    <transition name="fade">
      <div
        v-if="props.showChat && submitted && !showRecommendation && !showRecommendationV2 && !showRecommendationV3 && !showRecommendationV5"
        class="w-90 flex flex-col fixed right-0 top-0 h-screen-safe bg-white border-l border-[#E3E5E8] p-4 pt-6 pb-4 z-40"
      >
        <!-- Messages area -->
        <div ref="chatMessagesContainer" class="flex-1 overflow-y-auto space-y-3 mb-4 wizard-chat-scroll">
          <!-- User message -->
          <div v-if="submittedMessage" class="flex justify-end">
            <div class="bg-[#FFEFE5] text-[#23262A] px-3 py-2 rounded-2xl rounded-br-md max-w-[90%] text-sm">
              {{ submittedMessage }}
            </div>
          </div>

          <!-- AI / discovery messages -->
          <div v-for="(msg, index) in wizardChatMessages" :key="index" class="flex" :class="msg.type === 'user' ? 'justify-end' : 'justify-start'">
            <!-- User follow-up messages -->
            <div v-if="msg.type === 'user'" class="bg-[#FFEFE5] text-[#23262A] px-3 py-2 rounded-2xl rounded-br-md max-w-[90%] text-sm">
              {{ msg.message }}
            </div>

            <!-- AI success message -->
            <div v-else-if="msg.type === 'ai-success'" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 bg-[#239E77] rounded-full flex items-center justify-center">
                  <Check :size="12" class="text-white" />
                </div>
                <span class="font-medium">{{ msg.message }}</span>
              </div>
            </div>

            <!-- AI logo message -->
            <div v-else-if="msg.type === 'ai-logo'" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
              <div class="flex items-center gap-2">
                <span>{{ msg.message }}</span>
                <div class="w-8 h-8 rounded overflow-hidden bg-white border border-[#E3E5E8] flex items-center justify-center shrink-0">
                  <img src="/telekom.png" alt="Logo" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <!-- AI colors message -->
            <div v-else-if="msg.type === 'ai-colors'" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
              <div class="space-y-1.5">
                <div>{{ msg.message }}</div>
                <div class="flex gap-1.5">
                  <div v-for="color in msg.colors" :key="color"
                       class="w-6 h-6 rounded-full border border-white shadow-sm"
                       :style="{ backgroundColor: color }"></div>
                </div>
              </div>
            </div>

            <!-- AI text message -->
            <div v-else class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm leading-relaxed" v-html="formatChatMessage(msg.message)">
            </div>
          </div>

          <!-- Loading indicator during analysis -->
          <div v-if="currentlyAnalyzing" class="flex justify-start">
            <div class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-[#ED5A29] rounded-full animate-pulse"></div>
                <span class="text-sm text-[#8F97A4]">{{ analyzingMessages[currentlyAnalyzing] }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat input -->
        <div class="relative">
          <textarea
            ref="chatTextareaRef"
            v-model="chatMessage"
            rows="3"
            @keydown.enter.exact.prevent="handleChatSubmit"
            class="w-full px-4 py-3 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#8F97A4] focus:border-transparent transition-colors text-[#23262A] resize-none pr-12 text-sm"
            placeholder="Ask OptiMonk..."
          ></textarea>
          <button
            @click="handleChatSubmit"
            :disabled="!chatMessage?.trim()"
            :class="[
              'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
              chatMessage?.trim() ? 'bg-[#ED5A29] text-white cursor-pointer' : 'bg-[#E3E5E8] text-[#8F97A4] cursor-default'
            ]"
          >
            <ArrowUp :size="16" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronRight, Truck, Check, Target, Lightbulb, Mouse, Mail, ShoppingCart, Gift, Star, CircleDot, Compass, Sparkles, ArrowUp } from 'lucide-vue-next'
import WebsiteScanAnimation from '../illustrations/WebsiteScanAnimation.vue'
import Dropdown from '../shared/Dropdown.vue'
import OptimizationPlanCard from './OptimizationPlanCard.vue'

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
  },
  startAtRecommendationV5: {
    type: Boolean,
    default: false
  },
  showChat: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'task-created', 'navigate-to', 'phase-changed'])

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
const showRecommendationV5 = ref(false)

// Intersection Observer for use cases
const useCaseRefs = ref([])
const visibleUseCases = ref({})
let observer = null

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

const cornerClasses = {
  none: 'rounded-none',
  small: 'rounded-lg',
  medium: 'rounded-xl',
  large: 'rounded-full'
}

const brandColor = computed(() => brandSettings.colors[brandSettings.selectedColorIndex])
const cornerClass = computed(() => cornerClasses[brandSettings.corners])

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
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' }
]

const languageModel = computed({
  get: () => languageOptions.find(opt => opt.value === brandSettings.language) || languageOptions[0],
  set: (val) => { brandSettings.language = val.value }
})

// Font dropdowns
const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' }
]

const primaryFontModel = computed({
  get: () => fontOptions.find(opt => opt.value === brandSettings.primaryFont) || fontOptions[0],
  set: (val) => { brandSettings.primaryFont = val.value }
})

const secondaryFontModel = computed({
  get: () => fontOptions.find(opt => opt.value === brandSettings.secondaryFont) || fontOptions[1],
  set: (val) => { brandSettings.secondaryFont = val.value }
})

// Corners dropdown
const cornerDropdownOptions = [
  { value: 'none', label: 'None', iconClass: 'rounded-none' },
  { value: 'small', label: 'Small', iconClass: 'rounded-sm' },
  { value: 'medium', label: 'Medium', iconClass: 'rounded-md' },
  { value: 'large', label: 'Large', iconClass: 'rounded-lg' }
]

const cornersModel = computed({
  get: () => cornerDropdownOptions.find(opt => opt.value === brandSettings.corners) || cornerDropdownOptions[0],
  set: (val) => { brandSettings.corners = val.value }
})

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
    title: 'Smart Discount Popup',
    description: 'The most effective list-building popup formula',
    subheadline: 'Grow your list with a two-step popup formula with every tweak for max conversions',
    icon: 'mail',
    image: '/SmartDiscountPopup.png',
    mobileImage: '/SmartDiscountPopup_mobile.png'
  },
  {
    id: 'cart-abandonment',
    title: 'Cart Abandonment Stopper',
    description: 'Offer a discount for cart abandoners',
    subheadline: 'Decrease cart abandonment rate with a strong discount offer',
    icon: 'cart',
    image: '/CartAbandonmentStopper.png',
    mobileImage: '/CartAbandonmentStopper_mobile.png'
  },
  {
    id: 'spin-wheel',
    title: 'Lucky Wheel',
    description: 'Gamify popups to increase visitor engagement',
    subheadline: 'Capture new visitor attention and increase conversions with spin-to-win lucky wheels',
    icon: 'wheel',
    image: '/LuckyWheel.png',
    mobileImage: '/LuckyWheel_mobile.png'
  },
  {
    id: 'feedback',
    title: 'Feedback Survey',
    description: 'Get real, measurable feedback on anything you want',
    subheadline: 'Find out how much your customers love you easily with a feedback survey',
    icon: 'star',
    image: '/FeedbackSurvey.png',
    mobileImage: '/FeedbackSurvey_mobile.png'
  }
]

// Icon mapping for use cases
const iconMap = {
  mail: Mail,
  cart: ShoppingCart,
  gift: Gift,
  star: Star,
  truck: Truck,
  wheel: CircleDot,
  compass: Compass
}

const analyzingMessages = {
  logo: 'Looking for logo...',
  colors: 'Analyzing brand colors...',
  fonts: 'Identifying fonts...',
  language: 'Detecting language...'
}

// Chat panel state
const chatMessage = ref('')
const wizardChatMessages = ref([])
const chatMessagesContainer = ref(null)
const chatTextareaRef = ref(null)

// Format message text (convert **bold** to <strong>, \n to <br>)
const formatChatMessage = (text) => {
  if (!text) return ''
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const scrollChatToBottom = () => {
  if (chatMessagesContainer.value) {
    nextTick(() => {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    })
  }
}

const handleChatSubmit = () => {
  if (chatMessage.value?.trim()) {
    // Add user message to chat
    wizardChatMessages.value.push({
      type: 'user',
      message: chatMessage.value.trim()
    })
    scrollChatToBottom()
    chatMessage.value = ''
  }
}

const localData = reactive({
  message: props.modelValue.message || ''
})

// Analysis steps with timing
const runAnalysis = () => {
  // Initial chat message
  setTimeout(() => {
    wizardChatMessages.value.push({
      type: 'ai',
      message: 'I\'m scanning your website to understand your brand identity...'
    })
    scrollChatToBottom()
  }, 300)

  // Step 1: Start analyzing logo
  setTimeout(() => {
    currentlyAnalyzing.value = 'logo'
  }, 500)

  // Logo found
  setTimeout(() => {
    discoveries.logo = true
    currentlyAnalyzing.value = 'colors'
    wizardChatMessages.value.push({
      type: 'ai-logo',
      message: 'Found your website logo'
    })
    scrollChatToBottom()
  }, 3000)

  // Step 2: Colors found
  setTimeout(() => {
    discoveries.colors = true
    currentlyAnalyzing.value = 'fonts'
    wizardChatMessages.value.push({
      type: 'ai-colors',
      message: 'Detected your brand colors',
      colors: ['#E20074', '#18214D', '#5D6482']
    })
    scrollChatToBottom()
  }, 6000)

  // Step 3: Fonts found
  setTimeout(() => {
    discoveries.fonts = true
    currentlyAnalyzing.value = 'language'
    wizardChatMessages.value.push({
      type: 'ai',
      message: 'Identified primary fonts: Inter, Arial'
    })
    scrollChatToBottom()
  }, 9000)

  // Step 4: Language found
  setTimeout(() => {
    discoveries.language = true
    currentlyAnalyzing.value = null
    wizardChatMessages.value.push({
      type: 'ai',
      message: 'Website language: English 🇬🇧'
    })
    scrollChatToBottom()
  }, 11500)

  if (props.showChat) {
    // With chat: skip success screen, go directly to style selection
    setTimeout(() => {
      showAnalysisContent.value = false
      showStyleSelection.value = true
      emit('phase-changed', 'wizard-style')
      wizardChatMessages.value.push({
        type: 'ai-success',
        message: 'Analysis complete!'
      })
      scrollChatToBottom()
      // Add style prompt after a short delay
      setTimeout(() => {
        wizardChatMessages.value.push({
          type: 'ai',
          message: 'Great! Your brand is all set! 🎉\nNow pick a style that feels right for your site. You\'ll be able to fine-tune everything in the next step.'
        })
        scrollChatToBottom()
      }, 500)
    }, 12000)
  } else {
    // Without chat: show success message screen first
    setTimeout(() => {
      showAnalysisContent.value = false
      showSuccessMessage.value = true
    }, 12000)

    setTimeout(() => {
      showSuccessMessage.value = false
      showStyleSelection.value = true
      emit('phase-changed', 'wizard-style')
    }, 14000)
  }
}

const selectStyle = (styleId) => {
  selectedStyle.value = styleId
}

const selectStyleAndContinue = (styleId) => {
  selectedStyle.value = styleId
  showStyleSelection.value = false
  showQuicktune.value = true
  emit('phase-changed', 'wizard-quicktune')
  wizardChatMessages.value.push({
    type: 'ai',
    message: 'Great choice! **Quick-tune your brand settings** — colors, fonts, language, and corner radius.\nDon\'t worry, all settings can be customized later in the editor.'
  })
  scrollChatToBottom()
}

const confirmStyleSelection = () => {
  showStyleSelection.value = false
  showQuicktune.value = true
  emit('phase-changed', 'wizard-quicktune')
}

const confirmQuicktune = () => {
  if (props.showChat) {
    // Stay inside the component to preserve chat state
    showQuicktune.value = false
    showRecommendationV4.value = true
    emit('phase-changed', 'wizard-recommendation-v4')
    // Add chat message for recommendation
    wizardChatMessages.value.push({
      type: 'ai',
      message: 'Here\'s your personalized optimization plan! 🚀\nPick the campaigns you\'d like to launch, or go with all of them for maximum impact.'
    })
    scrollChatToBottom()
    // Set up Intersection Observer for use cases
    setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = useCaseRefs.value.indexOf(entry.target)
              if (index !== -1) {
                visibleUseCases.value[index] = true
              }
            }
          })
        },
        { threshold: 0.2 }
      )
      useCaseRefs.value.forEach((el) => {
        if (el) observer.observe(el)
      })
    }, 100)
  } else {
    emit('navigate-to', 'wizard-recommendation-v4')
  }
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
  chatMessage.value = ''
  wizardChatMessages.value = []
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

    // Set up Intersection Observer for use cases
    setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = useCaseRefs.value.indexOf(entry.target)
              if (index !== -1) {
                visibleUseCases.value[index] = true
              }
            }
          })
        },
        { threshold: 0.2 }
      )

      useCaseRefs.value.forEach((el) => {
        if (el) observer.observe(el)
      })
    }, 100)
  } else if (props.startAtRecommendationV5) {
    // Start directly at recommendation v5
    submitted.value = true
    showAnalysisContent.value = false
    showRecommendationV5.value = true
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
    submittedMessage.value = props.initialMessage.trim()
    // Delay analysis start for fade-in animation
    setTimeout(() => {
      runAnalysis()
    }, 100)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const navigateToPhase = (phase) => {
  // Reset all phase flags
  showAnalysisContent.value = false
  showSuccessMessage.value = false
  showStyleSelection.value = false
  showQuicktune.value = false
  showRecommendation.value = false
  showRecommendationV2.value = false
  showRecommendationV3.value = false
  showRecommendationV4.value = false
  showRecommendationV5.value = false

  if (phase === 'wizard-analysis') {
    showAnalysisContent.value = true
  } else if (phase === 'wizard-style') {
    showStyleSelection.value = true
  } else if (phase === 'wizard-quicktune') {
    showQuicktune.value = true
  } else if (phase === 'wizard-recommendation-v4') {
    showRecommendationV4.value = true
  }
}

defineExpose({
  resetToInitial,
  startWithMessage,
  navigateToPhase
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

/* Fade in up animation for use cases */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.use-case-item {
  opacity: 0;
  transform: translateY(30px);
}

.animate-fade-in-up-visible {
  animation: fadeInUp 0.6s ease-out forwards;
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

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Wizard chat scrollbar - reserve space, only show thumb on hover */
.wizard-chat-scroll {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
.wizard-chat-scroll:hover {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}
.wizard-chat-scroll::-webkit-scrollbar {
  width: 6px;
}
.wizard-chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.wizard-chat-scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 3px;
}
.wizard-chat-scroll:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
</style>
