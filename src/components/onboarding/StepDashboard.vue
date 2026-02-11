<template>
  <div class="w-full overflow-hidden">
    <!-- Two-column layout after submit -->
    <div v-if="submitted" class="relative" :class="showPopup ? 'min-h-screen-safe' : 'h-screen-safe'">
      <!-- Top Navbar - show from the beginning -->
      <nav v-if="submitted" class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E3E5E8] z-30 flex items-center justify-between px-8">
        <!-- Left side - Steps -->
        <div class="flex items-center gap-1 bg-[#F9FAFB] rounded-lg p-1">
          <button
            :disabled="currentPhase === 'analysis'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded transition-colors',
              currentPhase === 'analysis'
                ? 'bg-white shadow-sm cursor-not-allowed opacity-50'
                : 'bg-white shadow-sm cursor-default'
            ]"
          >
            Design
          </button>
          <button
            :disabled="currentPhase === 'analysis'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded transition-colors',
              currentPhase === 'analysis'
                ? 'text-[#505763] cursor-not-allowed opacity-50'
                : 'text-[#505763] hover:bg-white/50 cursor-pointer'
            ]"
          >
            Targeting
          </button>
        </div>

        <!-- Right side - Device selector and Publish -->
        <div class="flex items-center gap-4">
          <!-- Device selector -->
          <div class="flex items-center gap-1 bg-[#F9FAFB] rounded-lg p-1">
            <button
              @click="selectedDevice = 'desktop'"
              :disabled="currentPhase === 'analysis'"
              :class="[
                'p-2 rounded transition-colors',
                currentPhase === 'analysis'
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer',
                selectedDevice === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              ]"
              title="Desktop"
            >
              <Monitor :size="20" class="text-[#505763]" />
            </button>
            <button
              @click="selectedDevice = 'mobile'"
              :disabled="currentPhase === 'analysis'"
              :class="[
                'p-2 rounded transition-colors',
                currentPhase === 'analysis'
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer',
                selectedDevice === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              ]"
              title="Mobile"
            >
              <Smartphone :size="20" class="text-[#505763]" />
            </button>
          </div>

          <!-- Save as draft and Publish buttons -->
          <button
            :disabled="currentPhase === 'analysis'"
            :class="[
              'px-6 py-2 border border-[#D5D8DD] text-sm font-medium rounded-lg transition-colors',
              currentPhase === 'analysis'
                ? 'text-[#505763] cursor-not-allowed opacity-50'
                : 'text-[#505763] cursor-pointer'
            ]"
          >
            Save as draft
          </button>
          <button
            :disabled="currentPhase === 'analysis'"
            :class="[
              'px-6 py-2 text-sm font-medium rounded-lg transition-colors',
              currentPhase === 'analysis'
                ? 'bg-[#E3E5E8] text-[#8F97A4] cursor-not-allowed'
                : 'bg-[#ED5A29] text-white cursor-pointer'
            ]"
          >
            Publish
          </button>
        </div>
      </nav>

      <!-- Main content area - takes full width minus chat -->
      <div
        class="mr-90 relative pt-16"
        :class="[
          showPopup ? 'h-full' : 'h-full flex items-center justify-center'
        ]"
      >
        <div
          class="relative flex items-center justify-center"
          :class="showPopup ? 'w-full h-full' : 'h-[500px]'"
        >
          <!-- Analysis phase: scanner animation -->
          <WebsiteScanAnimation v-if="!showPopup" />

          <!-- Popup editing phase: full page skeleton -->
          <div v-else class="w-full h-full bg-[#F9FAFB]">
            <div class="w-full h-full bg-white">
              <!-- Full page skeleton content -->
              <div class="p-8 space-y-6">
                <!-- Navigation -->
                <div class="flex items-center justify-between mb-8">
                  <div class="w-32 h-10 bg-[#E3E5E8] rounded"></div>
                  <div class="flex gap-6">
                    <div class="w-20 h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-20 h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-20 h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-20 h-6 bg-[#E3E5E8] rounded"></div>
                  </div>
                  <div class="w-24 h-10 bg-[#ED5A29] rounded-lg"></div>
                </div>

                <!-- Hero section -->
                <div class="space-y-4 mb-12">
                  <div class="w-3/4 h-12 bg-[#E3E5E8] rounded"></div>
                  <div class="w-2/3 h-12 bg-[#E3E5E8] rounded"></div>
                  <div class="w-full h-6 bg-[#F1F2F4] rounded mt-6"></div>
                  <div class="w-5/6 h-6 bg-[#F1F2F4] rounded"></div>
                  <div class="w-4/5 h-6 bg-[#F1F2F4] rounded"></div>
                </div>

                <!-- CTA buttons -->
                <div class="flex gap-4 mb-12">
                  <div class="w-40 h-12 bg-[#ED5A29] rounded-xl"></div>
                  <div class="w-40 h-12 bg-[#E3E5E8] rounded-xl"></div>
                </div>

                <!-- Features grid -->
                <div class="grid grid-cols-3 gap-8">
                  <div class="space-y-4">
                    <div class="w-full h-48 bg-[#F1F2F4] rounded-2xl"></div>
                    <div class="w-full h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-5/6 h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-full h-4 bg-[#F1F2F4] rounded"></div>
                    <div class="w-4/5 h-4 bg-[#F1F2F4] rounded"></div>
                  </div>
                  <div class="space-y-4">
                    <div class="w-full h-48 bg-[#F1F2F4] rounded-2xl"></div>
                    <div class="w-full h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-5/6 h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-full h-4 bg-[#F1F2F4] rounded"></div>
                    <div class="w-4/5 h-4 bg-[#F1F2F4] rounded"></div>
                  </div>
                  <div class="space-y-4">
                    <div class="w-full h-48 bg-[#F1F2F4] rounded-2xl"></div>
                    <div class="w-full h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-5/6 h-6 bg-[#E3E5E8] rounded"></div>
                    <div class="w-full h-4 bg-[#F1F2F4] rounded"></div>
                    <div class="w-4/5 h-4 bg-[#F1F2F4] rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Backdrop for popup in design phase -->
          <transition name="fade-popup">
            <div v-if="showPopup && currentPhase !== 'analysis'" class="fixed top-0 left-0 right-90 bottom-14-safe bg-black/50 z-15"></div>
          </transition>

          <!-- Popup overlay after analysis -->
          <transition name="fade-popup">
            <div v-if="showPopup" class="fixed inset-x-0 top-0 bottom-16-safe flex flex-col items-center justify-center z-20 mr-90">
              <!-- OptiMonk List Builder Popup -->
              <div :class="['rounded-2xl shadow-2xl max-w-2xl w-full mx-8 overflow-hidden relative', popupStyles.bgColor]">
                <!-- Close button -->
                <button @click="showPopup = false" :class="['absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-colors z-10 rounded-lg shadow-md', popupStyles.closeBg, popupStyles.closeText, popupStyles.closeHover]">
                  <X :size="20" />
                </button>

                <div class="flex">
                  <!-- Left side - Form -->
                  <div class="w-1/2 p-10 flex items-center">
                    <div class="space-y-5 w-full">
                      <h3 :class="['text-3xl font-bold', popupStyles.titleColor]">{{ currentPopupContent.title }}</h3>
                      <p :class="['text-sm', popupStyles.descColor]">{{ currentPopupContent.description }}</p>

                      <div class="space-y-3">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          :class="['w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors text-sm placeholder-opacity-50', popupStyles.inputBorder, popupStyles.inputFocus, popupStyles.inputText]"
                        />
                        <button :class="['w-full px-6 py-3 text-base font-medium rounded-xl transition-colors', popupStyles.buttonBg, popupStyles.buttonHover, popupStyles.buttonText]">
                          {{ currentPopupContent.buttonText }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Right side - Image or Lucky Wheel -->
                  <div :class="['w-1/2 flex items-center justify-center', popupStyles.rightBg]">
                    <!-- Lucky Wheel for lucky-wheel use case -->
                    <div v-if="selectedUseCase?.id === 'lucky-wheel'" class="relative w-64 h-64">
                      <svg viewBox="0 0 200 200" class="w-full h-full">
                        <!-- Wheel segments -->
                        <g>
                          <!-- 10% off segment -->
                          <path d="M 100 100 L 100 0 A 100 100 0 0 1 170.7 29.3 Z" fill="#E20074" />
                          <text x="115" y="35" fill="white" font-size="12" font-weight="bold" text-anchor="middle">10%</text>

                          <!-- 5% off segment -->
                          <path d="M 100 100 L 170.7 29.3 A 100 100 0 0 1 200 100 Z" fill="#ED5A29" />
                          <text x="160" y="75" fill="white" font-size="12" font-weight="bold" text-anchor="middle">5%</text>

                          <!-- 30% off segment -->
                          <path d="M 100 100 L 200 100 A 100 100 0 0 1 170.7 170.7 Z" fill="#18214D" />
                          <text x="160" y="125" fill="white" font-size="12" font-weight="bold" text-anchor="middle">30%</text>

                          <!-- Free shipping segment -->
                          <path d="M 100 100 L 170.7 170.7 A 100 100 0 0 1 100 200 Z" fill="#5D6482" />
                          <text x="125" y="165" fill="white" font-size="10" font-weight="bold" text-anchor="middle">Free Ship</text>

                          <!-- 20% off segment -->
                          <path d="M 100 100 L 100 200 A 100 100 0 0 1 29.3 170.7 Z" fill="#E20074" />
                          <text x="65" y="165" fill="white" font-size="12" font-weight="bold" text-anchor="middle">20%</text>

                          <!-- Try again segment -->
                          <path d="M 100 100 L 29.3 170.7 A 100 100 0 0 1 0 100 Z" fill="#ED5A29" />
                          <text x="40" y="125" fill="white" font-size="10" font-weight="bold" text-anchor="middle">Try Again</text>

                          <!-- 15% off segment -->
                          <path d="M 100 100 L 0 100 A 100 100 0 0 1 29.3 29.3 Z" fill="#18214D" />
                          <text x="40" y="75" fill="white" font-size="12" font-weight="bold" text-anchor="middle">15%</text>

                          <!-- Gift segment -->
                          <path d="M 100 100 L 29.3 29.3 A 100 100 0 0 1 100 0 Z" fill="#5D6482" />
                          <text x="65" y="35" fill="white" font-size="12" font-weight="bold" text-anchor="middle">Gift</text>
                        </g>

                        <!-- Center circle -->
                        <circle cx="100" cy="100" r="20" fill="white" stroke="#23262A" stroke-width="2" />
                        <text x="100" y="105" fill="#23262A" font-size="14" font-weight="bold" text-anchor="middle">SPIN</text>

                        <!-- Pointer at top -->
                        <path d="M 100 5 L 95 15 L 105 15 Z" fill="#ED5A29" stroke="#23262A" stroke-width="1" />
                      </svg>
                    </div>

                    <!-- Regular image for other use cases -->
                    <img v-else src="/telekom_img.png" alt="Offer" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

            </div>
          </transition>

        </div>
      </div>

      <!-- Page selector - fixed to bottom, above dev navbar -->
      <div v-if="showPopup" class="fixed bottom-14-safe left-0 right-90 h-16 bg-white border-t border-[#E3E5E8] z-30 flex items-center justify-center">
        <div class="flex items-center gap-0 bg-[#F9FAFB] rounded-lg p-1">
          <button
            v-for="page in popupPages"
            :key="page.id"
            @click="selectedPage = page.id"
            :class="[
              'px-6 py-2 text-sm font-medium transition-all cursor-pointer',
              selectedPage === page.id
                ? 'bg-white text-[#23262A] border-2 border-[#D5D8DD] rounded-lg'
                : 'text-[#505763] hover:text-[#23262A]'
            ]"
          >
            {{ page.name }}
          </button>
        </div>
      </div>

      <!-- Chat on the right - fixed to viewport edge -->
      <div class="w-90 flex flex-col fixed right-0 top-0 h-screen-safe bg-white border-l border-[#E3E5E8] p-4 pt-20 pb-16">
        <!-- Messages area -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto space-y-4 mb-4">
          <!-- User message -->
          <div class="flex justify-end">
            <div class="bg-[#FFEFE5] text-[#23262A] px-3 py-2 rounded-2xl rounded-br-md max-w-[90%] text-sm">
              {{ submittedMessage }}
            </div>
          </div>

          <!-- AI discovery messages -->
          <div v-for="(discovery, index) in aiMessages" :key="index" class="flex justify-start">
            <div v-if="discovery.message || discovery.type === 'logo' || discovery.type === 'colors' || discovery.type === 'fonts' || discovery.type === 'text' || discovery.type === 'language' || discovery.type === 'success'" class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
              <!-- Logo discovery -->
              <div v-if="discovery.type === 'logo'" class="flex flex-col items-center gap-2">
                <span>{{ discovery.message }}</span>
                <div class="w-12 h-12 rounded overflow-hidden bg-white border border-[#E3E5E8] flex items-center justify-center">
                  <img src="/telekom.png" alt="Logo" class="w-full h-full object-cover" />
                </div>
              </div>

              <!-- Colors discovery -->
              <div v-else-if="discovery.type === 'colors'" class="space-y-2">
                <div>{{ discovery.message }}</div>
                <div class="flex gap-2 mt-2">
                  <div v-for="color in discovery.colors" :key="color"
                       class="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                       :style="{ backgroundColor: color }"></div>
                </div>
              </div>

              <!-- Fonts discovery -->
              <div v-else-if="discovery.type === 'fonts'" class="space-y-2">
                <div>{{ discovery.message }}</div>
                <div class="mt-2 space-y-1">
                  <div v-for="font in discovery.fonts" :key="font.name"
                       class="text-base px-2 py-1 bg-white rounded"
                       :style="{ fontFamily: font.name }">
                    {{ font.name }}
                  </div>
                </div>
              </div>

              <!-- Language discovery -->
              <div v-else-if="discovery.type === 'language'" class="flex items-center gap-2">
                <span class="text-2xl">🇬🇧</span>
                <span>{{ discovery.message }}</span>
              </div>

              <!-- Success message -->
              <div v-else-if="discovery.type === 'success'" class="flex items-center gap-2">
                <div class="w-5 h-5 bg-[#239E77] rounded-full flex items-center justify-center">
                  <Check :size="12" class="text-white" />
                </div>
                <span class="font-medium">{{ discovery.message }}</span>
              </div>

              <!-- Default text message -->
              <div v-else>{{ discovery.message }}</div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="isDiscovering" class="flex justify-start">
            <div class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%]">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-[#ED5A29] rounded-full animate-pulse"></div>
                <span class="text-sm text-[#8F97A4]">{{ currentAnalyzingMessage }}</span>
              </div>
            </div>
          </div>

          <!-- Style popup previews - inside messages area -->
          <transition name="fade-popup">
            <div v-if="showDesignOptions" class="space-y-3">
              <!-- 2x2 Grid of popup previews -->
              <div class="grid grid-cols-2 gap-2">
                <!-- Popup 1: Pure - Pink accent -->
                <button
                  @click="selectDesign('pure')"
                  :class="[
                    'border-2 rounded-lg hover:border-[#E20074] transition-all cursor-pointer overflow-hidden bg-white',
                    selectedDesign === 'pure' ? 'border-[#E20074] ring-2 ring-[#E20074] ring-opacity-30' : 'border-[#E3E5E8]'
                  ]"
                >
                  <div class="p-2">
                    <div class="text-xs font-bold text-[#18214D] mb-1">10% off</div>
                    <div class="w-full h-1 bg-[#E20074] rounded mb-1"></div>
                    <div class="flex gap-1">
                      <div class="flex-1 h-3 bg-[#F1F2F4] rounded"></div>
                      <div class="flex-1 h-3 bg-[#F1F2F4] rounded"></div>
                    </div>
                  </div>
                </button>

                <!-- Popup 2: Inverse - Dark background -->
                <button
                  @click="selectDesign('inverse')"
                  :class="[
                    'border-2 rounded-lg hover:border-[#E20074] transition-all cursor-pointer overflow-hidden bg-[#18214D]',
                    selectedDesign === 'inverse' ? 'border-[#E20074] ring-2 ring-[#E20074] ring-opacity-30' : 'border-[#E3E5E8]'
                  ]"
                >
                  <div class="p-2">
                    <div class="text-xs font-bold text-white mb-1">10% off</div>
                    <div class="w-full h-1 bg-[#E20074] rounded mb-1"></div>
                    <div class="flex gap-1">
                      <div class="flex-1 h-3 bg-[#5D6482] rounded"></div>
                      <div class="flex-1 h-3 bg-[#5D6482] rounded"></div>
                    </div>
                  </div>
                </button>

                <!-- Popup 3: Essential - Minimal -->
                <button
                  @click="selectDesign('essential')"
                  :class="[
                    'border-2 rounded-lg hover:border-[#E20074] transition-all cursor-pointer overflow-hidden bg-white',
                    selectedDesign === 'essential' ? 'border-[#E20074] ring-2 ring-[#E20074] ring-opacity-30' : 'border-[#E3E5E8]'
                  ]"
                >
                  <div class="p-2">
                    <div class="text-xs font-bold text-[#5D6482] mb-1">10% off</div>
                    <div class="w-full h-1 bg-[#5D6482] rounded mb-1"></div>
                    <div class="flex gap-1">
                      <div class="flex-1 h-3 bg-[#F1F2F4] rounded"></div>
                      <div class="flex-1 h-3 bg-[#F1F2F4] rounded"></div>
                    </div>
                  </div>
                </button>

                <!-- Popup 4: Edge - Bold pink -->
                <button
                  @click="selectDesign('edge')"
                  :class="[
                    'border-2 rounded-lg hover:border-[#E20074] transition-all cursor-pointer overflow-hidden bg-[#E20074]',
                    selectedDesign === 'edge' ? 'border-[#E20074] ring-2 ring-[#E20074] ring-opacity-30' : 'border-[#E3E5E8]'
                  ]"
                >
                  <div class="p-2">
                    <div class="text-xs font-bold text-white mb-1">10% off</div>
                    <div class="w-full h-1 bg-white rounded mb-1"></div>
                    <div class="flex gap-1">
                      <div class="flex-1 h-3 bg-white/30 rounded"></div>
                      <div class="flex-1 h-3 bg-white/30 rounded"></div>
                    </div>
                  </div>
                </button>
              </div>

              <!-- Action buttons -->
              <div v-if="!designConfirmed" class="flex gap-2 pt-2">
                <button class="flex-1 px-4 py-2 border border-[#D5D8DD] rounded-xl text-xs text-[#23262A] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  More designs
                </button>
                <button @click="handleContinue" class="flex-1 px-4 py-2 bg-[#ED5A29] text-white text-xs rounded-xl transition-colors cursor-pointer">
                  Continue
                </button>
              </div>
            </div>
          </transition>

          <!-- Message before/with use cases -->
          <div v-if="designConfirmed" class="flex justify-start">
            <div class="bg-[#F1F2F4] text-[#23262A] px-3 py-2 rounded-2xl rounded-bl-md max-w-[90%] text-sm">
              Great choice! Now let's pick the perfect use case for your popup. What's your main goal?
            </div>
          </div>

          <!-- Use Cases selection - inside messages area -->
          <transition name="fade-popup">
            <div v-if="showUseCases" class="space-y-2">
              <!-- Use case options -->
              <button
                v-for="useCase in useCases"
                :key="useCase.id"
                @click="selectUseCase(useCase.id)"
                :class="[
                  'w-full px-4 py-3 border-2 rounded-xl text-left transition-all cursor-pointer',
                  selectedUseCase?.id === useCase.id
                    ? 'border-[#E20074] bg-[#FFF5F2]'
                    : 'border-[#E3E5E8] hover:border-[#E20074] bg-white'
                ]"
              >
                <div class="space-y-1">
                  <div class="font-semibold text-sm text-[#23262A]">{{ useCase.name }}</div>
                  <div class="text-xs text-[#505763]">{{ useCase.title }}</div>
                </div>
              </button>

              <!-- Action buttons for use cases -->
              <div v-if="!useCaseConfirmed" class="flex gap-2 pt-2">
                <button class="flex-1 px-4 py-2 border border-[#D5D8DD] rounded-xl text-xs text-[#23262A] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  More use cases
                </button>
                <button @click="handleUseCaseContinue" class="flex-1 px-4 py-2 bg-[#ED5A29] text-white text-xs rounded-xl transition-colors cursor-pointer">
                  Continue
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Chat input -->
        <div class="relative mt-4">
          <textarea
            ref="chatTextareaRef"
            v-model="chatMessage"
            rows="4"
            @keydown.enter.exact.prevent="handleChatSubmit"
            class="w-full px-4 py-3 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#8F97A4] focus:border-transparent transition-colors text-[#23262A] h-28 resize-none pr-12"
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
    </div>

    <!-- Form before submit -->
    <div
      v-if="!submitted"
      class="w-full transition-all duration-500 ease-in-out pb-25"
      :class="{ 'scroll-up-exit-active': isExiting }"
    >
      <!-- Domain selector -->
      <div class="mt-12 mb-12 flex justify-center">
        <div class="w-[240px]">
          <Dropdown
            v-model="selectedDomain"
            :options="domains"
            placeholder="Select domain"
          >
            <template #icon>
              <div class="w-6 h-6 rounded-full overflow-hidden">
                <img src="/telekom.png" alt="Telekom" class="w-full h-full object-cover" />
              </div>
            </template>
          </Dropdown>
        </div>
      </div>

      <div class="mb-8 text-center">
        <h2 class="text-3xl font-semibold text-[#23262A]">Hi Csaba, what should we do?</h2>
      </div>

      <!-- Input area -->
      <div class="relative max-w-180 mx-auto">
        <textarea
          ref="textareaRef"
          v-model="localData.message"
          rows="4"
          @keydown.enter.exact.prevent="handleSubmit"
          class="w-full px-4 py-3 border border-[#D5D8DD] rounded-xl focus:ring-2 focus:ring-[#8F97A4] focus:border-transparent transition-colors text-[#23262A] h-28 resize-none pr-12 bg-white"
          :placeholder="currentPlaceholder"
        ></textarea>
        <!-- Attach button (ghost) -->
        <button
          class="absolute bottom-3 left-2 w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-600 hover:bg-om-gray-100 rounded-lg transition-all cursor-pointer"
        >
          <Paperclip :size="20" />
        </button>
        <!-- Submit button -->
        <button
          @click="handleSubmit"
          :disabled="!localData.message?.trim()"
          :class="[
            'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            localData.message?.trim() ? 'bg-[#ED5A29] text-white cursor-pointer' : 'bg-[#E3E5E8] text-[#8F97A4] cursor-default'
          ]"
        >
          <!-- uil-arrow-up -->
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.71,11.29l-5-5a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-5,5a1,1,0,0,0,1.42,1.42L11,9.41V17a1,1,0,0,0,2,0V9.41l3.29,3.3a1,1,0,0,0,1.42,0A1,1,0,0,0,17.71,11.29Z"/>
          </svg>
        </button>
      </div>

      <!-- Example prompts (Pill Chips) -->
      <div class="mt-2 flex flex-wrap items-center justify-center gap-2">
        <span class="text-sm text-[#8F97A4]">Start with this:</span>
        <button
          v-for="example in examples"
          :key="example.label"
          @click="selectExample(example.prompt)"
          class="chip flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-om-gray-200 text-sm text-om-gray-700 transition-all duration-200 ease-out cursor-pointer hover:scale-[1.02]"
        >
          <component :is="example.iconComponent" :size="16" class="text-om-gray-500" />
          <span>{{ example.label }}</span>
        </button>
      </div>


      <!-- Use Cases -->
      <div class="mt-16">
        <h3 class="text-2xl font-semibold text-om-gray-700 mb-8 text-center">Recommended Use Cases</h3>
        <div class="grid grid-cols-6 gap-6">
          <!-- Smart Discount Popup -->
          <div class="flex flex-col cursor-pointer group">
            <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
              <div class="flex flex-col w-full h-full">
                <div class="h-1/3 shrink-0 bg-white flex items-end justify-center rounded-t-lg">
                  <img src="/SmartDiscountPopup_img.png" alt="Smart Discount" class="h-full object-contain" />
                </div>
                <div class="flex-1 px-4 pb-3 flex flex-col justify-center text-center">
                  <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-1 mx-auto" />
                  <h4 class="text-[13px] font-bold mb-2 leading-tight text-[#E20074]">
                    Tiéd a 10% KUPON
                  </h4>
                  <p class="text-[7px] text-om-gray-500 mb-2">
                    Csapj le rá, mielőtt eltűnik!
                  </p>
                  <button class="w-full py-2 text-white text-[7px] font-bold mb-1.5 rounded-lg bg-[#E20074]">
                    KÉREM A 10%-OT
                  </button>
                  <button class="w-full py-2 text-[7px] font-bold border rounded-lg text-[#E20074] border-[#E20074] bg-white">
                    NEM, KÖSZ!
                  </button>
                </div>
              </div>
            </div>
            <h4 class="text-sm font-medium text-om-gray-700">Smart Discount Popup</h4>
            <p class="text-xs text-om-gray-500 mt-1">The most effective list-building popup formula</p>
          </div>

          <!-- Cart Abandonment Stopper -->
          <div class="flex flex-col cursor-pointer group">
            <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
              <div class="relative w-full h-full flex items-center justify-center p-2" style="background-color: #6A8085">
                <div class="flex flex-col w-full h-[90%] bg-white rounded-lg overflow-hidden shadow-lg">
                  <div class="h-2/5 shrink-0">
                    <img src="/CartAbandonmentStopper_img.png" alt="Cart Abandonment" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 px-4 py-3 flex flex-col justify-center">
                    <p class="text-[7px] text-om-gray-500 mb-2 uppercase tracking-wide">
                      Várj
                    </p>
                    <h4 class="text-[12px] font-bold mb-3 leading-tight text-[#E20074]">
                      Szerezz egy<br>10%-os kuport!
                    </h4>
                    <div class="h-5 bg-white border border-om-gray-300 rounded text-[7px] flex items-center px-2 text-om-gray-400 mb-3">
                      Email cím
                    </div>
                    <button class="w-full py-2 text-white text-[7px] font-bold rounded bg-[#E20074]">
                      FOLYTATÁS
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <h4 class="text-sm font-medium text-om-gray-700">Cart Abandonment Stopper</h4>
            <p class="text-xs text-om-gray-500 mt-1">Offer a discount for cart abandoners</p>
          </div>

          <!-- Lucky Wheel -->
          <div class="flex flex-col cursor-pointer group">
            <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
              <div class="flex flex-col w-full h-full">
                <div class="flex-1 px-4 py-3 flex flex-col justify-center text-center">
                  <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-2 mx-auto" />
                  <h4 class="text-[12px] font-bold mb-2 leading-tight text-[#E20074]">
                    Pörgess, nyerj és<br>spórolj!
                  </h4>
                  <p class="text-[6px] text-om-gray-500 mb-2 leading-snug">
                    Úgy érzed, rád mosolyghat a szerencse?<br>Add meg az email címed, és pörgess!
                  </p>
                  <div class="h-5 bg-white border border-om-gray-300 rounded text-[7px] flex items-center px-2 text-om-gray-400 mb-2">
                    Email
                  </div>
                  <button class="w-full py-2 text-white text-[7px] font-bold mb-1 rounded bg-[#E20074]">
                    PÖRGETEK
                  </button>
                  <button class="text-[7px] font-medium underline text-[#E20074]">
                    NEM, KÖSZ!
                  </button>
                </div>
                <div class="h-1/3 shrink-0">
                  <img src="/LuckyWheel_img.png" alt="Lucky Wheel" class="w-full h-full object-cover rounded-b-lg" />
                </div>
              </div>
            </div>
            <h4 class="text-sm font-medium text-om-gray-700">Lucky Wheel</h4>
            <p class="text-xs text-om-gray-500 mt-1">Gamify popups to increase visitor engagement</p>
          </div>

          <!-- Feedback Survey -->
          <div class="flex flex-col cursor-pointer group">
            <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
              <div class="relative w-full h-full flex items-center justify-center p-2" style="background-color: #6A8085">
                <div class="flex flex-col w-full h-1/2 bg-white rounded-lg shadow-lg justify-center px-4 py-5 text-center">
                  <img src="/telekom_logo2.png" alt="Logo" class="w-8 h-8 object-contain mb-3 mx-auto" />
                  <h4 class="text-[11px] font-bold mb-2 leading-tight text-[#E20074]">
                    Van egy perced?<br>Mondd el a véleményed!
                  </h4>
                  <p class="text-[6px] text-om-gray-500 mb-3 leading-snug">
                    Hogyan értékelnéd az általános<br>tapasztalatsodat velünk?
                  </p>
                  <div class="flex justify-center gap-1 mb-2">
                    <div v-for="i in 5" :key="i" class="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold border-[#E20074] text-[#E20074]">
                      {{ i }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h4 class="text-sm font-medium text-om-gray-700">Feedback Survey</h4>
            <p class="text-xs text-om-gray-500 mt-1">Get real, measurable feedback on anything you want</p>
          </div>

          <!-- Product Value Spotlight -->
          <div class="flex flex-col cursor-pointer group">
            <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
              <img src="/SmartDiscountPopup_img.png" alt="Product Value Spotlight" class="w-full h-full object-cover" />
            </div>
            <h4 class="text-sm font-medium text-om-gray-700">Product Value Spotlight</h4>
            <p class="text-xs text-om-gray-500 mt-1">Highlight key product benefits and drive conversions</p>
          </div>

          <!-- Product Recommendation -->
          <div class="flex flex-col cursor-pointer group">
            <div class="bg-white border border-om-gray-200 rounded-lg h-96 aspect-9/19 flex items-center justify-center overflow-hidden mb-3 transition-all group-hover:border-om-primary group-hover:shadow-md">
              <img src="/CartAbandonmentStopper_img.png" alt="Product Recommendation" class="w-full h-full object-cover" />
            </div>
            <h4 class="text-sm font-medium text-om-gray-700">Product Recommendation</h4>
            <p class="text-xs text-om-gray-500 mt-1">Show personalized product suggestions to visitors</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, nextTick, onMounted, onUnmounted, computed, watch } from 'vue'
import { Monitor, Smartphone, X, Check, ArrowUp, Paperclip, Lightbulb, Plus, FlaskConical } from 'lucide-vue-next'
import WebsiteScanAnimation from '../illustrations/WebsiteScanAnimation.vue'
import Dropdown from '../shared/Dropdown.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  initialMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'auto-next', 'skip-to-dashboard', 'task-created'])

const textareaRef = ref(null)
const chatTextareaRef = ref(null)
const messagesContainer = ref(null)
const submitted = ref(false)
const isExiting = ref(false)
const submittedMessage = ref('')
const chatMessage = ref('')
const currentPlaceholderIndex = ref(0)
const displayedText = ref('')
const isTyping = ref(true)
let typingTimeout = null

const selectedDomain = ref('telekom.hu')
const domains = ['telekom.hu', 'myshop.com', 'example-store.com', 'demo-site.com', 'testsite.com']
const aiMessages = ref([])
const currentMessageIndex = ref(0)
const isDiscovering = ref(false)
const currentAnalyzingMessage = ref('Scanning your website...')
const showPopup = ref(false)

// Navbar state
const selectedDevice = ref('desktop') // 'desktop' or 'mobile'

// Popup pages
const selectedPage = ref('mainpage')
const popupPages = [
  { id: 'mainpage', name: 'Mainpage' },
  { id: 'thankyou', name: 'Thank you page' },
  { id: 'teaser', name: 'Teaser' }
]

// Task phases
const currentPhase = ref('analysis') // 'analysis', 'design', or 'usecase'

// Analysis phase messages
const analysisSteps = [
  {
    delay: 2000,
    type: 'logo',
    message: 'Found your website logo'
  },
  {
    delay: 3000,
    type: 'colors',
    message: 'Detected brand colors',
    colors: ['#E20074', '#18214D', '#5D6482']
  },
  {
    delay: 2500,
    type: 'fonts',
    message: 'Identified primary fonts',
    fonts: [
      { name: 'Inter' },
      { name: 'Open Sans' }
    ]
  },
  {
    delay: 2000,
    type: 'language',
    message: 'Website language: English'
  },
  {
    delay: 500,
    type: 'success',
    message: 'Analysis complete!'
  }
]

// Design phase messages
const designSteps = [
  {
    delay: 1500,
    type: 'text',
    message: 'Here are some design suggestions for your popup:'
  }
]

// Use case phase messages
const useCaseSteps = []

const showDesignOptions = ref(false)
const showUseCases = ref(false)
const designConfirmed = ref(false) // Track if design is confirmed
const useCaseConfirmed = ref(false) // Track if use case is confirmed
const selectedDesign = ref('pure') // Default design

// Use cases data
const useCases = [
  {
    id: 'list-building',
    name: 'List Building',
    title: 'Get 10% off your first order',
    description: 'Subscribe to get special offers, free giveaways, and updates.',
    buttonText: 'Subscribe'
  },
  {
    id: 'cart-abandonment',
    name: 'Cart Abandonment',
    title: 'Wait! Don\'t leave empty-handed',
    description: 'Complete your order now and get free shipping on orders over €50.',
    buttonText: 'Continue Shopping'
  },
  {
    id: 'exit-intent',
    name: 'Exit-Intent Offer',
    title: 'Before you go... Take 15% off!',
    description: 'Use code EXIT15 at checkout. Limited time offer, don\'t miss out!',
    buttonText: 'Claim Discount'
  },
  {
    id: 'promotion',
    name: 'Special Promotion',
    title: 'Flash Sale: 20% off all plans',
    description: 'Upgrade your mobile plan today and save big. Offer ends soon!',
    buttonText: 'View Plans'
  },
  {
    id: 'lucky-wheel',
    name: 'Lucky Wheel',
    title: 'Spin to Win!',
    description: 'Try your luck and win exclusive discounts up to 30% off!',
    buttonText: 'Spin Now'
  }
]

const selectedUseCase = ref(useCases[0]) // Selected use case - default to first option

// Function to select a design
const selectDesign = (designId) => {
  selectedDesign.value = designId
}

// Function to handle "Tovább" button click
const handleContinue = () => {
  designConfirmed.value = true

  // Transition to use case phase
  setTimeout(() => {
    emit('task-created', { message: submittedMessage.value, phase: 'usecase' })
    currentPhase.value = 'usecase'
    startDiscoverySequence()
  }, 300)
}

// Function to select a use case
const selectUseCase = (useCaseId) => {
  selectedUseCase.value = useCases.find(uc => uc.id === useCaseId)
}

// Function to handle use case "Continue" button click
const handleUseCaseContinue = () => {
  useCaseConfirmed.value = true

  // Add encouraging message to chat
  setTimeout(() => {
    aiMessages.value.push({
      type: 'text',
      message: 'Perfect! Your popup is ready. Now feel free to ask me anything - I can help you customize the design, adjust the text, change colors, or even create a completely different popup. What would you like to do?'
    })
    scrollToBottom()
  }, 300)
}

// Computed property for current popup content
const currentPopupContent = computed(() => {
  if (selectedUseCase.value) {
    return selectedUseCase.value
  }
  // Default to list-building use case
  return useCases[0]
})

// Computed property for dynamic popup styling
const popupStyles = computed(() => {
  const styles = {
    pure: {
      border: 'border-[#E20074]',
      bgColor: 'bg-white',
      titleColor: 'text-[#18214D]',
      descColor: 'text-[#5D6482]',
      inputBorder: 'border-[#D5D8DD]',
      inputFocus: 'focus:ring-[#E20074]',
      inputText: 'text-[#18214D]',
      buttonBg: 'bg-[#E20074]',
      buttonHover: 'hover:bg-[#C1005E]',
      buttonText: 'text-white',
      closeBg: 'bg-white',
      closeText: 'text-[#5D6482]',
      closeHover: 'hover:text-[#18214D]',
      rightBg: 'bg-[#F9FAFB]'
    },
    inverse: {
      border: 'border-[#18214D]',
      bgColor: 'bg-[#18214D]',
      titleColor: 'text-white',
      descColor: 'text-[#8F97A4]',
      inputBorder: 'border-[#5D6482]',
      inputFocus: 'focus:ring-[#E20074]',
      inputText: 'text-white',
      buttonBg: 'bg-[#E20074]',
      buttonHover: 'hover:bg-[#C1005E]',
      buttonText: 'text-white',
      closeBg: 'bg-[#5D6482]',
      closeText: 'text-white',
      closeHover: 'hover:text-[#E20074]',
      rightBg: 'bg-[#5D6482]'
    },
    essential: {
      border: 'border-[#5D6482]',
      bgColor: 'bg-white',
      titleColor: 'text-[#5D6482]',
      descColor: 'text-[#8F97A4]',
      inputBorder: 'border-[#E3E5E8]',
      inputFocus: 'focus:ring-[#5D6482]',
      inputText: 'text-[#5D6482]',
      buttonBg: 'bg-[#5D6482]',
      buttonHover: 'hover:bg-[#18214D]',
      buttonText: 'text-white',
      closeBg: 'bg-white',
      closeText: 'text-[#5D6482]',
      closeHover: 'hover:text-[#18214D]',
      rightBg: 'bg-[#F9FAFB]'
    },
    edge: {
      border: 'border-[#E20074]',
      bgColor: 'bg-[#E20074]',
      titleColor: 'text-white',
      descColor: 'text-white/90',
      inputBorder: 'border-white/30',
      inputFocus: 'focus:ring-white',
      inputText: 'text-white',
      buttonBg: 'bg-white',
      buttonHover: 'hover:bg-[#F1F2F4]',
      buttonText: 'text-[#E20074]',
      closeBg: 'bg-white',
      closeText: 'text-[#E20074]',
      closeHover: 'hover:text-[#C1005E]',
      rightBg: 'bg-[#C1005E]'
    }
  }
  return styles[selectedDesign.value]
})

// Scroll chat to bottom
const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    })
  }
}

// Watch for message changes and scroll to bottom
watch(aiMessages, () => {
  scrollToBottom()
}, { deep: true })

// Also watch isDiscovering to scroll when loading indicator appears/disappears
watch(isDiscovering, () => {
  scrollToBottom()
})

// Watch for style options to appear and scroll to bottom
watch(showDesignOptions, () => {
  if (showDesignOptions.value) {
    scrollToBottom()
  }
})

// Watch for use cases to appear and scroll to bottom
watch(showUseCases, () => {
  if (showUseCases.value) {
    scrollToBottom()
  }
})

const startDiscoverySequence = () => {
  isDiscovering.value = true

  if (currentPhase.value === 'analysis') {
    // Start analysis phase
    startPhase(analysisSteps, () => {
      isDiscovering.value = false
      currentAnalyzingMessage.value = 'Scanning your website...'
      // After analysis completes, create design task
      setTimeout(() => {
        emit('task-created', { message: submittedMessage.value, phase: 'design' })
        currentPhase.value = 'design'
        startDiscoverySequence()
      }, 500)
    })
  } else if (currentPhase.value === 'design') {
    // Show popup immediately when design phase starts
    showPopup.value = true
    // Start design phase
    startPhase(designSteps, () => {
      isDiscovering.value = false
      currentAnalyzingMessage.value = 'Scanning your website...'
      // Show design option buttons after chat message
      setTimeout(() => {
        showDesignOptions.value = true
      }, 300)
    })
  } else if (currentPhase.value === 'usecase') {
    // Start use case phase
    startPhase(useCaseSteps, () => {
      isDiscovering.value = false
      currentAnalyzingMessage.value = 'Scanning your website...'
      // Show use case buttons after chat message
      setTimeout(() => {
        showUseCases.value = true
      }, 300)
    })
  }
}

const resetToPhase = (phase) => {
  currentPhase.value = phase
  showPopup.value = false
  showDesignOptions.value = false
  showUseCases.value = false
  designConfirmed.value = false
  aiMessages.value = []
  currentMessageIndex.value = 0

  if (phase === 'design') {
    // Load previous analysis messages first (without animation)
    analysisSteps.forEach(step => {
      aiMessages.value.push(step)
    })
  } else if (phase === 'usecase') {
    // Load previous analysis and design messages first (without animation)
    analysisSteps.forEach(step => {
      aiMessages.value.push(step)
    })
    designSteps.forEach(step => {
      aiMessages.value.push(step)
    })
    // Show popup and mark style as confirmed
    showPopup.value = true
    designConfirmed.value = true
  }

  startDiscoverySequence()
}

const startPhase = (steps, onComplete) => {
  const showNextMessage = (index) => {
    if (index >= steps.length) {
      if (onComplete) onComplete()
      return
    }

    // Update the analyzing message based on the step type
    const updateAnalyzingMessage = () => {
      const step = steps[index]
      if (step.type === 'logo') {
        currentAnalyzingMessage.value = 'Looking for logo...'
      } else if (step.type === 'colors') {
        currentAnalyzingMessage.value = 'Analyzing brand colors...'
      } else if (step.type === 'fonts') {
        currentAnalyzingMessage.value = 'Identifying fonts...'
      } else if (step.type === 'language') {
        currentAnalyzingMessage.value = 'Detecting language...'
      } else {
        currentAnalyzingMessage.value = 'Scanning your website...'
      }
    }

    // Update message immediately before the delay
    updateAnalyzingMessage()

    setTimeout(() => {
      aiMessages.value.push(steps[index])
      currentMessageIndex.value = index + 1
      showNextMessage(index + 1)
    }, steps[index].delay)
  }

  showNextMessage(0)
}

const placeholderSuggestions = [
  'how to collect more emails',
  'to create a welcome popup',
  'for cart abandonment tips',
  'to boost conversions',
  'about exit-intent popups'
]

const currentPlaceholder = computed(() => {
  return `Ask OptiMonk ${displayedText.value}`
})

const typeText = (text, index = 0) => {
  if (index <= text.length) {
    displayedText.value = text.slice(0, index)
    typingTimeout = setTimeout(() => typeText(text, index + 1), 50)
  } else {
    // Wait before erasing
    typingTimeout = setTimeout(() => eraseText(text, text.length), 2000)
  }
}

const eraseText = (text, index) => {
  if (index >= 0) {
    displayedText.value = text.slice(0, index)
    typingTimeout = setTimeout(() => eraseText(text, index - 1), 30)
  } else {
    // Move to next suggestion
    currentPlaceholderIndex.value = (currentPlaceholderIndex.value + 1) % placeholderSuggestions.length
    typingTimeout = setTimeout(() => {
      typeText(placeholderSuggestions[currentPlaceholderIndex.value] + '...')
    }, 300)
  }
}

onUnmounted(() => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})

const localData = reactive({
  message: props.modelValue.message || ''
})

const examples = [
  {
    label: 'Suggest ideas',
    prompt: 'Suggest campaign ideas for my website',
    iconComponent: Lightbulb
  },
  {
    label: 'Create a popup',
    prompt: 'I want to create a popup',
    iconComponent: Plus
  },
  {
    label: 'Run A/B test',
    prompt: 'Help me run an A/B test',
    iconComponent: FlaskConical
  }
]

const selectExample = (prompt) => {
  localData.message = prompt
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus()
    }
  })
}

const handleSubmit = () => {
  if (localData.message?.trim()) {
    submittedMessage.value = localData.message.trim()
    emit('update:modelValue', { message: submittedMessage.value })
    // Initialize with analysis phase
    currentPhase.value = 'analysis'
    aiMessages.value = []
    currentMessageIndex.value = 0

    // Trigger exit animation first
    isExiting.value = true

    // After animation completes, show wizard view
    setTimeout(() => {
      // Add initial greeting message
      setTimeout(() => {
        aiMessages.value.push({
          type: 'text',
          message: 'Great! I\'ll analyze your website and suggest some options for you. Let me start by scanning your site...'
        })
        scrollToBottom()
      }, 500)

      // Emit task creation with phase information
      emit('task-created', { message: submittedMessage.value, phase: 'analysis' })
      submitted.value = true
      isExiting.value = false
      startDiscoverySequence()
    }, 500) // Match animation duration
  }
}

const handleChatSubmit = () => {
  if (chatMessage.value?.trim()) {
    // For now, just log the message - can be extended later
    console.log('Chat message:', chatMessage.value.trim())
    chatMessage.value = ''
  }
}

const resetToInitial = () => {
  submitted.value = false
  isExiting.value = false
  submittedMessage.value = ''
  localData.message = ''
  chatMessage.value = ''
  aiMessages.value = []
  currentMessageIndex.value = 0
  isDiscovering.value = false
  currentAnalyzingMessage.value = 'Scanning your website...'
  showPopup.value = false
  showDesignOptions.value = false
  showUseCases.value = false
  designConfirmed.value = false
  useCaseConfirmed.value = false
  selectedUseCase.value = useCases[0]
  currentPhase.value = 'analysis'
}

// Start analysis with a pre-filled message (used when coming from wizard)
const startWithMessage = (message) => {
  if (message?.trim()) {
    localData.message = message.trim()
    handleSubmit()
  }
}

// Auto-start if initialMessage is provided
onMounted(() => {
  typeText(placeholderSuggestions[0] + '...')

  // If initial message is provided, start the analysis
  if (props.initialMessage) {
    // Small delay to ensure component is fully mounted
    setTimeout(() => {
      startWithMessage(props.initialMessage)
    }, 100)
  }
})

defineExpose({
  resetToInitial,
  resetToPhase,
  currentPhase,
  startWithMessage
})
</script>

<style scoped>
.fade-popup-enter-active,
.fade-popup-leave-active {
  transition: opacity 0.3s ease;
}

.fade-popup-enter-from,
.fade-popup-leave-to {
  opacity: 0;
}

/* Scroll up exit animation */
.scroll-up-exit-active {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
