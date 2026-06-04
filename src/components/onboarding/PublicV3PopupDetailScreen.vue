<template>
  <div class="h-screen-safe flex min-h-0 bg-om-gray-50">
      <!-- Non-embedded: full app sidebar -->
      <Sidebar v-if="!embedded" :show-ai-button="false" />
      <!-- Embedded (agentic flow): no menu, just the OM logo in the top-left corner -->
      <button
        v-else
        @click="emit('back')"
        class="fixed top-4 left-4 z-20 w-8 h-8 flex items-center justify-center cursor-pointer"
        title="Back to Today's plan"
      >
        <img src="/icons/optimonk-logo.svg" alt="OptiMonk" class="w-full h-full" />
      </button>

      <!-- Left: Chat panel as floating card -->
      <div
        :class="chatExpanded ? 'flex-1 flex justify-center p-4' : 'shrink-0 py-4 pl-4'"
        :style="chatExpanded ? {} : { width: chatWidth + 'px' }"
      >
        <div :class="[
          'h-full flex flex-col min-h-0 overflow-hidden',
          !chatResizing && 'chat-panel-tr',
          chatExpanded
            ? 'w-3xl max-w-full bg-transparent border-0 shadow-none'
            : 'w-full bg-white rounded-2xl border border-om-gray-200 shadow-md'
        ]">
        <!-- Chat header: expand / collapse the chat panel any time -->
        <div class="shrink-0 flex items-center justify-between px-1 pb-2">
          <span v-if="chatExpanded && publishMode" class="text-sm font-semibold text-om-gray-700">Ready to publish</span>
          <span v-else></span>
          <!-- Reveal the visual editor canvas. Labeled in the flow so it's discoverable. -->
          <button
            v-if="embedded && chatExpanded"
            @click="collapseChat()"
            class="flex items-center gap-1.5 px-2.5 h-8 text-sm font-medium text-om-gray-600 hover:text-om-gray-800 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Open the visual editor"
          >
            <LayoutTemplate :size="16" /> Edit popup
          </button>
          <button
            v-else
            @click="chatExpanded ? collapseChat() : expandChat()"
            class="w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
            :title="chatExpanded ? 'Minimize chat' : 'Expand chat'"
          >
            <Minimize2 v-if="chatExpanded" :size="18" />
            <Maximize2 v-else :size="18" />
          </button>
        </div>
        <!-- Chat body -->
        <div ref="chatMessagesRef" class="flex-1 min-h-0 flex flex-col p-4 gap-3 overflow-y-auto">
          <template v-if="generationMessages.length">
            <template v-for="(m, i) in generationMessages" :key="i">
              <!-- Final popup preview (shown in publish flow) -->
              <div v-if="m.role === 'popup-preview'" class="w-full flex justify-center pop-in">
                <div class="bg-[#4E686D] rounded-lg shadow-xl flex items-center justify-center p-5" style="width: 100%; max-width: 720px;">
                  <div class="bg-white rounded-md shadow-2xl overflow-hidden" style="width: 100%; aspect-ratio: 620/360;">
                    <template v-if="useCase?.id === 'newsletter'">
                      <div class="flex w-full h-full">
                        <div class="w-[25%] shrink-0 bg-white flex items-end justify-center">
                          <img src="/campaigns/smart-discount-popup-img.png" alt="" class="h-3/4 object-contain" />
                        </div>
                        <div class="flex-1 px-6 py-5 flex flex-col justify-center text-center">
                          <img src="/demos/telekom/logo2.png" alt="" class="w-12 h-12 object-contain mb-2 mx-auto" />
                          <h4 class="text-xl font-bold mb-1.5 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                          <p class="text-xs text-om-gray-500 mb-3" :style="getElementStyle('subtext')">{{ popupContent.subtext }}</p>
                          <button class="w-full py-2 text-white text-xs font-bold mb-1.5 rounded-md" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                          <button class="w-full py-2 text-xs font-bold border-2 rounded-md bg-white" :style="[{ color: brandColor, borderColor: brandColor }, getElementStyle('secondary-cta')]">{{ popupContent['secondary-cta'] }}</button>
                        </div>
                        <div class="w-[25%] shrink-0 bg-white flex items-end justify-center">
                          <img src="/campaigns/smart-discount-popup-img.png" alt="" class="h-3/4 object-contain" />
                        </div>
                      </div>
                    </template>
                    <template v-else-if="useCase?.id === 'cart-abandonment'">
                      <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templates/template-bg.svg')">
                        <div class="absolute inset-0 flex items-center justify-center p-4">
                          <div class="bg-white rounded-lg shadow-lg flex w-[88%] h-[88%]">
                            <div class="flex-1 px-5 py-3 flex flex-col justify-center">
                              <p class="text-[9px] mb-1 uppercase tracking-wide font-bold" :style="[{ color: brandColor }, getElementStyle('badge')]">{{ popupContent.badge }}</p>
                              <h4 class="text-lg font-bold mb-3 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                              <div class="h-8 bg-white border border-om-gray-300 rounded text-[10px] flex items-center px-2 text-om-gray-400 mb-2">{{ popupContent['email-input'] }}</div>
                              <button class="w-full py-2 text-white text-[10px] font-bold rounded" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                            </div>
                            <div class="w-[50%] shrink-0 bg-white flex items-center justify-center overflow-hidden">
                              <img src="/campaigns/cart-abandonment-stopper-img.png" alt="" class="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="useCase?.id === 'spin-wheel'">
                      <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templates/template-bg.svg')">
                        <div class="absolute inset-0 flex items-center justify-start">
                          <div class="bg-white shadow-lg flex w-[72%] h-full">
                            <div class="w-[50%] shrink-0 bg-white flex items-center justify-center overflow-hidden pr-1 py-3">
                              <img src="/campaigns/lucky-wheel-img2.png" alt="" class="w-full h-auto object-contain" />
                            </div>
                            <div class="flex-1 px-5 py-3 flex flex-col justify-center">
                              <img src="/demos/telekom/logo2.png" alt="" class="w-7 h-7 object-contain mb-1.5" />
                              <h4 class="text-base font-bold mb-1 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                              <p class="text-[10px] text-om-gray-500 mb-2 leading-relaxed" :style="getElementStyle('subtext')">{{ popupContent.subtext }}</p>
                              <div class="h-8 bg-white border border-om-gray-300 rounded text-[10px] flex items-center px-2 text-om-gray-400 mb-2">{{ popupContent['email-input'] }}</div>
                              <button class="w-full py-2 text-white text-[10px] font-bold rounded" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="useCase?.id === 'feedback'">
                      <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templates/template-bg.svg')">
                        <div class="absolute inset-0 flex items-center justify-center p-4">
                          <div class="bg-white shadow-lg rounded-lg w-[65%] h-[80%] flex flex-col justify-center px-8 py-6 text-center">
                            <img src="/demos/telekom/logo2.png" alt="" class="w-7 h-7 object-contain mb-2 mx-auto" />
                            <h4 class="text-base font-bold mb-1 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                            <p class="text-[10px] text-om-gray-500 mb-3 leading-relaxed" :style="getElementStyle('subtext')">{{ popupContent.subtext }}</p>
                            <div class="flex justify-center gap-2">
                              <div v-for="i in 5" :key="i" class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold" :style="{ borderColor: brandColor, color: brandColor }">{{ i }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <!-- Design variations card -->
              <div v-else-if="m.role === 'popup-versions'" class="w-full">
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="v in m.versions"
                    :key="v.id"
                    :class="[
                      'bg-white rounded-lg border overflow-hidden',
                      m.selectedId === v.id ? 'border-om-orange-500 ring-2 ring-om-orange-200' : 'border-om-gray-200'
                    ]"
                  >
                    <div class="aspect-video bg-om-gray-100 overflow-hidden">
                      <img :src="v.image" :alt="v.label" class="w-full h-full object-cover object-top" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Campaign settings (embedded flow, after Done) — mirrors the settings page -->
              <div v-else-if="m.role === 'targeting'" class="w-full">
                <div class="bg-om-gray-50 rounded-2xl p-3 space-y-2">
                  <div v-for="sec in m.sections" :key="sec.title" class="bg-white rounded-xl border border-om-gray-200 px-4 py-3">
                    <p class="text-sm font-semibold text-om-gray-800">{{ sec.title }}</p>
                    <p class="text-xs text-om-gray-500 mt-0.5">{{ sec.description }}</p>
                    <ul v-if="sec.details?.length" class="mt-2.5 space-y-1.5 border-t border-om-gray-100 pt-2.5">
                      <li v-for="d in sec.details" :key="d" class="flex items-start gap-2 text-sm text-om-gray-700">
                        <span class="w-1 h-1 rounded-full bg-om-orange-400 shrink-0 mt-2"></span>
                        <span>{{ d }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- User / AI text bubble -->
              <div
                v-else
                class="group flex flex-col"
                :class="m.role === 'user' ? 'items-end' : 'items-start'"
              >
                <div
                  class="px-3 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap"
                  :class="m.role === 'user'
                    ? 'bg-om-peach-100 text-om-gray-700 rounded-br-md'
                    : [embedded ? 'bg-om-gray-50' : 'bg-om-gray-100', 'text-om-gray-700 rounded-bl-md']"
                ><span v-if="m.element" class="block text-[11px] font-semibold text-om-orange-600 mb-0.5">{{ m.element }}</span>{{ m.text }}</div>
                <!-- Hover meta: submission time + redo -->
                <div
                  v-if="m.role === 'user'"
                  class="flex items-center gap-2 mt-1 px-1 text-[11px] text-om-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span v-if="m.time">{{ m.time }}</span>
                  <button
                    v-if="m.fromEditor"
                    @click="redoMessage(m)"
                    class="flex items-center hover:text-om-gray-600 cursor-pointer transition-colors"
                    title="Redo this change"
                  >
                    <Redo2 :size="12" />
                  </button>
                </div>
              </div>
            </template>
          </template>
          <p v-else class="text-xs text-om-gray-500 leading-relaxed">
            Ask the AI to change the headline, colors, layout, copy or anything else on the popup.
          </p>
        </div>

        <!-- Suggestions + Chat input -->
        <div class="shrink-0 p-4 flex flex-col gap-1.5">
          <!-- Suggestions (hidden during AI generation flow) -->
          <div v-if="!generationMessages.length" class="flex flex-col gap-2">
            <button
              v-for="s in chatSuggestions"
              :key="s"
              @click="selectSuggestion(s)"
              class="text-left px-3 py-2 text-xs rounded-lg border border-om-gray-200 bg-white text-om-gray-700 hover:border-om-orange-300 hover:bg-om-orange-50 transition-colors cursor-pointer"
            >
              {{ s }}
            </button>
          </div>

          <!-- Publish decision question docked above the input -->
          <transition name="pop-in-card">
            <div v-if="publishQuestion" class="bg-white rounded-2xl border border-om-gray-200 shadow-sm overflow-hidden">
              <div class="px-3 py-2 border-b border-om-gray-200">
                <p class="text-xs font-semibold text-om-gray-700">{{ publishQuestion.text }}</p>
              </div>
              <div class="px-1.5 py-1 flex flex-col gap-0.5">
                <button
                  v-for="opt in publishQuestion.options"
                  :key="opt.id"
                  @click="publishQuestion.selectedId = opt.id"
                  class="flex items-start gap-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer"
                  :class="publishQuestion.selectedId === opt.id ? 'bg-om-orange-50' : 'hover:bg-om-gray-50'"
                >
                  <span
                    class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="publishQuestion.selectedId === opt.id ? 'border-om-orange-500' : 'border-om-gray-300'"
                  >
                    <span v-if="publishQuestion.selectedId === opt.id" class="w-1.5 h-1.5 rounded-full bg-om-orange-500"></span>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-xs font-semibold text-om-gray-700">{{ opt.label }}</span>
                    <span v-if="opt.description" class="block text-[11px] text-om-gray-500 leading-snug">{{ opt.description }}</span>
                  </span>
                </button>
              </div>
              <!-- Inline new-coupon input, shown when "Change it" is picked -->
              <div v-if="publishQuestion.selectedId === 'change'" class="px-3 pb-2">
                <input
                  v-model="publishCouponInput"
                  type="text"
                  placeholder="Enter new coupon code"
                  autofocus
                  @keydown.enter.prevent="onPublishQuestionContinue"
                  class="w-full px-3 py-2 border border-om-gray-200 rounded-lg focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-xs uppercase placeholder:normal-case placeholder:text-om-gray-400"
                />
              </div>
              <div class="border-t border-om-gray-200 px-2 py-1.5 flex items-center justify-end">
                <button
                  @click="onPublishQuestionContinue"
                  :disabled="publishContinueDisabled"
                  :class="[
                    'px-3 py-1 rounded text-xs font-semibold transition-colors',
                    !publishContinueDisabled ? 'bg-om-orange-500 text-white hover:bg-om-orange-600 cursor-pointer' : 'bg-om-gray-200 text-om-gray-400 cursor-not-allowed'
                  ]"
                >Continue</button>
              </div>
            </div>
          </transition>

          <!-- Integration question docked above the input (embedded flow, asked separately) -->
          <transition name="pop-in-card">
            <div v-if="integrationQuestion" class="bg-white rounded-2xl border border-om-gray-200 shadow-sm overflow-hidden">
              <div class="px-3 py-2 border-b border-om-gray-200">
                <p class="text-xs font-semibold text-om-gray-700">{{ integrationQuestion.text }}</p>
              </div>
              <div class="px-1.5 py-1 flex flex-col gap-0.5">
                <button
                  v-for="opt in integrationQuestion.options"
                  :key="opt.id"
                  @click="integrationQuestion.selectedId = opt.id"
                  class="flex items-start gap-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer"
                  :class="integrationQuestion.selectedId === opt.id ? 'bg-om-orange-50' : 'hover:bg-om-gray-50'"
                >
                  <span
                    class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="integrationQuestion.selectedId === opt.id ? 'border-om-orange-500' : 'border-om-gray-300'"
                  >
                    <span v-if="integrationQuestion.selectedId === opt.id" class="w-1.5 h-1.5 rounded-full bg-om-orange-500"></span>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-xs font-semibold text-om-gray-700">{{ opt.label }}</span>
                    <span v-if="opt.description" class="block text-[11px] text-om-gray-500 leading-snug">{{ opt.description }}</span>
                  </span>
                </button>
              </div>
              <div class="border-t border-om-gray-200 px-2 py-1.5 flex items-center justify-end">
                <button
                  @click="onIntegrationContinue"
                  :disabled="!integrationQuestion.selectedId"
                  :class="[
                    'px-3 py-1 rounded text-xs font-semibold transition-colors',
                    integrationQuestion.selectedId ? 'bg-om-orange-500 text-white hover:bg-om-orange-600 cursor-pointer' : 'bg-om-gray-200 text-om-gray-400 cursor-not-allowed'
                  ]"
                >Continue</button>
              </div>
            </div>
          </transition>

          <!-- Email-notification question docked above the input (embedded flow, asked separately) -->
          <transition name="pop-in-card">
            <div v-if="emailQuestion" class="bg-white rounded-2xl border border-om-gray-200 shadow-sm overflow-hidden">
              <div class="px-3 py-2 border-b border-om-gray-200">
                <p class="text-xs font-semibold text-om-gray-700">{{ emailQuestion.text }}</p>
              </div>
              <div class="px-1.5 py-1 flex flex-col gap-0.5">
                <button
                  v-for="opt in emailQuestion.options"
                  :key="opt.id"
                  @click="emailQuestion.selectedId = opt.id"
                  class="flex items-start gap-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer"
                  :class="emailQuestion.selectedId === opt.id ? 'bg-om-orange-50' : 'hover:bg-om-gray-50'"
                >
                  <span
                    class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="emailQuestion.selectedId === opt.id ? 'border-om-orange-500' : 'border-om-gray-300'"
                  >
                    <span v-if="emailQuestion.selectedId === opt.id" class="w-1.5 h-1.5 rounded-full bg-om-orange-500"></span>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-xs font-semibold text-om-gray-700">{{ opt.label }}</span>
                    <span v-if="opt.description" class="block text-[11px] text-om-gray-500 leading-snug">{{ opt.description }}</span>
                  </span>
                </button>
              </div>
              <div class="border-t border-om-gray-200 px-2 py-1.5 flex items-center justify-end">
                <button
                  @click="onEmailContinue"
                  :disabled="!emailQuestion.selectedId"
                  :class="[
                    'px-3 py-1 rounded text-xs font-semibold transition-colors',
                    emailQuestion.selectedId ? 'bg-om-orange-500 text-white hover:bg-om-orange-600 cursor-pointer' : 'bg-om-gray-200 text-om-gray-400 cursor-not-allowed'
                  ]"
                >Continue</button>
              </div>
            </div>
          </transition>

          <!-- Targeting review question docked above the input (embedded flow) -->
          <transition name="pop-in-card">
            <div v-if="targetingQuestion" class="bg-white rounded-2xl border border-om-gray-200 shadow-sm overflow-hidden">
              <div class="px-3 py-2 border-b border-om-gray-200">
                <p class="text-xs font-semibold text-om-gray-700">{{ targetingQuestion.text }}</p>
              </div>
              <div class="px-1.5 py-1 flex flex-col gap-0.5">
                <button
                  v-for="opt in targetingQuestion.options"
                  :key="opt.id"
                  @click="targetingQuestion.selectedId = opt.id"
                  class="flex items-start gap-2 px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer"
                  :class="targetingQuestion.selectedId === opt.id ? 'bg-om-orange-50' : 'hover:bg-om-gray-50'"
                >
                  <span
                    class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                    :class="targetingQuestion.selectedId === opt.id ? 'border-om-orange-500' : 'border-om-gray-300'"
                  >
                    <span v-if="targetingQuestion.selectedId === opt.id" class="w-1.5 h-1.5 rounded-full bg-om-orange-500"></span>
                  </span>
                  <span class="flex-1 min-w-0">
                    <span class="block text-xs font-semibold text-om-gray-700">{{ opt.label }}</span>
                    <span v-if="opt.description" class="block text-[11px] text-om-gray-500 leading-snug">{{ opt.description }}</span>
                  </span>
                </button>
              </div>
              <div class="border-t border-om-gray-200 px-2 py-1.5 flex items-center justify-end">
                <button
                  @click="onTargetingContinue"
                  :disabled="!targetingQuestion.selectedId"
                  :class="[
                    'px-3 py-1 rounded text-xs font-semibold transition-colors',
                    targetingQuestion.selectedId ? 'bg-om-orange-500 text-white hover:bg-om-orange-600 cursor-pointer' : 'bg-om-gray-200 text-om-gray-400 cursor-not-allowed'
                  ]"
                >Continue</button>
              </div>
            </div>
          </transition>

          <!-- Selected element context banner: sits directly above the chat input -->
          <transition name="fade">
            <div v-if="selectedElement" class="flex items-center gap-2 px-3 py-2 bg-om-orange-50 border border-om-orange-200 rounded-lg">
              <div class="w-1.5 h-1.5 rounded-full bg-om-orange-500 shrink-0"></div>
              <span class="text-xs text-om-orange-700 min-w-0 truncate">
                <span class="font-semibold">Editing:</span> {{ selectedLabel }}
              </span>
              <button
                @click="selectedElement = null; selectedRect = null; openPopover = null"
                class="ml-auto w-5 h-5 flex items-center justify-center text-om-orange-500 hover:text-om-orange-700 hover:bg-om-orange-100 rounded transition-colors cursor-pointer shrink-0"
              >
                <X :size="12" />
              </button>
            </div>
          </transition>

          <!-- Input -->
          <div class="relative">
            <textarea
              v-model="chatMessage"
              rows="3"
              @keydown.enter.exact.prevent="handleChatSubmit"
              :placeholder="generating ? 'Chat is busy with AI…' : targetingAdjust ? 'Describe the targeting change…' : publishMode ? 'Type a new coupon code or just say keep…' : 'Describe your change...'"
              :disabled="generating"
              :class="[
                'w-full px-4 py-3 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 text-sm resize-none pr-12 bg-white',
                generating ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            ></textarea>
            <button
              @click="handleChatSubmit"
              :disabled="!chatMessage?.trim() || generating"
              :class="[
                'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                (chatMessage?.trim() && !generating) ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
              ]"
            >
              <ArrowUp :size="16" />
            </button>
          </div>
        </div>
        </div>
      </div>

      <!-- Drag divider: resize the chat / editor split (full bar turns orange on hover) -->
      <div
        v-if="!chatExpanded"
        @mousedown.prevent="startChatResize"
        class="shrink-0 self-stretch w-1 mx-2 my-4 rounded-full cursor-col-resize transition-colors"
        :class="chatResizing ? 'bg-om-orange-400' : 'bg-transparent hover:bg-om-orange-400'"
      ></div>

      <!-- Editor block (right): its own header + canvas, visually separate from the chat -->
      <transition name="editor-reveal">
      <div v-if="!chatExpanded" class="flex-1 flex flex-col min-w-0 my-4 mr-4 bg-white rounded-2xl border border-om-gray-200 shadow-md overflow-hidden">
        <!-- Top bar -->
        <div class="shrink-0 flex items-center justify-between h-14 border-b border-om-gray-200 px-4 bg-white">
          <!-- Left: title -->
          <div class="flex items-center gap-2 flex-1">
            <span class="text-sm font-semibold text-om-gray-700">{{ useCase?.title || 'Popup' }}</span>
          </div>

          <!-- Center: Design / Settings tabs -->
          <div class="flex items-center gap-1 bg-om-gray-100 rounded-xl p-1">
            <button
              @click="editorTab = 'design'"
              :class="['px-5 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer', editorTab === 'design' ? 'bg-white text-om-orange-600 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700']"
            >Design</button>
            <button
              @click="editorTab = 'settings'"
              :class="['px-5 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer', editorTab === 'settings' ? 'bg-white text-om-orange-600 shadow-sm' : 'text-om-gray-500 hover:text-om-gray-700']"
            >Settings</button>
          </div>

          <!-- Right: primary actions (persist across both tabs) -->
          <div class="flex items-center gap-1 flex-1 justify-end">
            <Button v-if="!embedded" variant="secondary" size="sm" class="w-24 flex items-center justify-center">Save draft</Button>
            <Button variant="primary" size="sm" class="w-24 flex items-center justify-center" @click="onPrimaryAction">{{ primaryActionLabel }}</Button>
          </div>
        </div>

        <!-- Contextual canvas toolbar — only under the Design tab -->
        <div v-if="editorTab === 'design'" class="shrink-0 flex items-center gap-1 h-11 border-b border-om-gray-200 px-4 bg-white">
          <button
            class="w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Undo"
          >
            <Undo2 :size="16" />
          </button>
          <button
            class="w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Redo"
          >
            <Redo2 :size="16" />
          </button>

          <div class="w-px h-5 bg-om-gray-200 mx-2" />

          <!-- Screen size dropdown -->
          <div class="relative">
            <button
              @click="screenMenuOpen = !screenMenuOpen; zoomMenuOpen = false"
              class="h-8 px-2.5 flex items-center gap-1 text-sm text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Screen size"
            >
              {{ screenSize.w }}×{{ screenSize.h }}
              <ChevronDown :size="14" />
            </button>
            <div v-if="screenMenuOpen" class="absolute top-full left-0 mt-1.5 bg-white rounded-lg shadow-lg border border-om-gray-200 py-1 z-20 min-w-48">
              <button
                v-for="s in screenSizes"
                :key="s.w + 'x' + s.h"
                @click="screenSize = s; screenMenuOpen = false"
                :class="[
                  'w-full text-left px-3 py-1.5 text-sm cursor-pointer transition-colors flex items-center justify-between gap-3',
                  screenSize.w === s.w && screenSize.h === s.h ? 'bg-om-orange-50 text-om-orange-600 font-semibold' : 'text-om-gray-700 hover:bg-om-gray-50'
                ]"
              >
                <span>{{ s.w }} × {{ s.h }} px</span>
                <span v-if="s.label" class="text-[11px] text-om-gray-400">{{ s.label }}</span>
              </button>
            </div>
          </div>

          <!-- Zoom dropdown -->
          <div class="relative">
            <button
              @click="zoomMenuOpen = !zoomMenuOpen; screenMenuOpen = false"
              class="h-8 px-2.5 flex items-center gap-1 text-sm text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
              title="Zoom"
            >
              {{ zoom }}%
              <ChevronDown :size="14" />
            </button>
            <div v-if="zoomMenuOpen" class="absolute top-full left-0 mt-1.5 bg-white rounded-lg shadow-lg border border-om-gray-200 py-1 z-20 min-w-24">
              <button
                v-for="z in zoomOptions"
                :key="z"
                @click="zoom = z; zoomMenuOpen = false"
                :class="[
                  'w-full text-left px-3 py-1.5 text-sm cursor-pointer transition-colors',
                  zoom === z ? 'bg-om-orange-50 text-om-orange-600 font-semibold' : 'text-om-gray-700 hover:bg-om-gray-50'
                ]"
              >{{ z }}%</button>
            </div>
          </div>

          <div class="w-px h-5 bg-om-gray-200 mx-2" />

          <Button variant="secondary" size="sm" class="flex items-center justify-center">
            <template #icon><Eye :size="15" /></template>
            Preview
          </Button>
        </div>
        <!-- Whiteboard canvas -->
        <div v-if="editorTab === 'design'" class="flex-1 flex flex-col min-w-0 whiteboard-bg relative overflow-hidden">
        <!-- Floating style toolbar -->
        <div
          v-if="selectedElement && selectedRect"
          class="fixed z-30 bg-white rounded-lg shadow-lg border border-om-gray-200 px-1.5 py-1.5 flex flex-col gap-1.5"
          :style="{ top: Math.max(60, selectedRect.top - 96) + 'px', left: (selectedRect.left + selectedRect.width / 2) + 'px', transform: 'translateX(-50%)' }"
          @click.stop
          @mousedown.stop
        >
          <!-- Chat input — describe a change (text is still edited inline on the element) -->
          <div class="relative">
            <input
              v-model="toolbarChatInput"
              type="text"
              placeholder="Describe your change..."
              @keydown.enter.prevent="handleToolbarSubmit"
              class="w-full h-11 pl-4 pr-12 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 text-sm bg-white"
            />
            <button
              @click="handleToolbarSubmit"
              :disabled="!toolbarChatInput?.trim()"
              :class="[
                'absolute top-1/2 -translate-y-1/2 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                toolbarChatInput?.trim() ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
              ]"
            >
              <ArrowUp :size="16" />
            </button>
          </div>

          <!-- Controls row -->
          <div class="flex items-center gap-1.5">
          <!-- Type indicator -->
          <div class="w-7 h-8 flex items-center justify-center text-om-gray-700">
            <Type :size="16" />
          </div>
          <div class="w-px h-5 bg-om-gray-200" />

          <!-- Font family popover -->
          <div class="relative">
            <button
              @click="togglePopover('font')"
              class="h-8 px-2 rounded flex items-center gap-1.5 cursor-pointer hover:bg-om-gray-100 transition-colors text-sm text-om-gray-700 min-w-24"
              title="Font"
            >
              <span :style="{ fontFamily: toolbarFonts.find(f => f.id === activeStyle.font)?.family || fontFamilyMap.sans }">{{ currentFontLabel }}</span>
              <ChevronDown :size="12" class="ml-auto" />
            </button>
            <div v-if="openPopover === 'font'" class="absolute top-full left-0 mt-1.5 bg-white rounded-lg shadow-lg border border-om-gray-200 py-1 min-w-36 z-10">
              <button
                v-for="f in toolbarFonts"
                :key="f.id"
                @click="setFont(f.id); openPopover = null"
                :class="[
                  'w-full text-left px-3 py-1.5 text-sm cursor-pointer transition-colors',
                  (activeStyle.font || 'sans') === f.id ? 'bg-om-orange-50 text-om-orange-600 font-semibold' : 'text-om-gray-700 hover:bg-om-gray-50'
                ]"
                :style="{ fontFamily: f.family }"
              >{{ f.label }}</button>
            </div>
          </div>

          <!-- Font size stepper (no border) -->
          <div class="flex items-center h-8 px-1">
            <input
              type="number"
              :value="fontSizePx"
              @input="setFontSizePx(Number($event.target.value))"
              min="8"
              max="96"
              class="w-9 text-center text-sm text-om-gray-700 bg-transparent outline-none"
            />
            <div class="flex flex-col -ml-1">
              <button @click="setFontSizePx(fontSizePx + 1)" class="text-om-gray-400 hover:text-om-gray-700 cursor-pointer leading-none -mb-1">
                <ChevronUp :size="12" />
              </button>
              <button @click="setFontSizePx(fontSizePx - 1)" class="text-om-gray-400 hover:text-om-gray-700 cursor-pointer leading-none">
                <ChevronDown :size="12" />
              </button>
            </div>
          </div>

          <div class="w-px h-5 bg-om-gray-200" />

          <!-- Text style dropdown (B + popover with Bold/Italic/Strike/Underline) -->
          <div class="flex items-center gap-0.5">
            <div class="relative">
              <button
                @click="togglePopover('textStyle')"
                :class="[
                  'h-8 px-2 rounded flex items-center gap-1 cursor-pointer transition-colors',
                  (activeStyle.bold || activeStyle.italic || activeStyle.underline || activeStyle.strikethrough) ? 'bg-om-orange-100 text-om-orange-600' : 'text-om-gray-700 hover:bg-om-gray-100'
                ]"
                title="Text style"
              >
                <span class="text-sm font-bold underline underline-offset-2 leading-none">B</span>
                <ChevronDown :size="12" />
              </button>
              <div v-if="openPopover === 'textStyle'" class="absolute top-full left-0 mt-1.5 bg-white rounded-lg shadow-lg border border-om-gray-200 p-1 flex items-center gap-0.5 z-10">
                <button
                  @click="toggleBold"
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors',
                    activeStyle.bold ? 'bg-om-orange-100 text-om-orange-600' : 'text-om-gray-700 hover:bg-om-gray-100'
                  ]"
                  title="Bold"
                ><BoldIcon :size="15" /></button>
                <button
                  @click="toggleItalic"
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors',
                    activeStyle.italic ? 'bg-om-orange-100 text-om-orange-600' : 'text-om-gray-700 hover:bg-om-gray-100'
                  ]"
                  title="Italic"
                ><ItalicIcon :size="15" /></button>
                <button
                  @click="toggleStrike"
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors',
                    activeStyle.strikethrough ? 'bg-om-orange-100 text-om-orange-600' : 'text-om-gray-700 hover:bg-om-gray-100'
                  ]"
                  title="Strikethrough"
                ><Strikethrough :size="15" /></button>
                <button
                  @click="toggleUnderline"
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors',
                    activeStyle.underline ? 'bg-om-orange-100 text-om-orange-600' : 'text-om-gray-700 hover:bg-om-gray-100'
                  ]"
                  title="Underline"
                ><UnderlineIcon :size="15" /></button>
              </div>
            </div>
            <!-- Alignment popover -->
            <div class="relative">
              <button
                @click="togglePopover('align')"
                :class="[
                  'w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors',
                  activeStyle.align ? 'bg-om-orange-100 text-om-orange-600' : 'text-om-gray-700 hover:bg-om-gray-100'
                ]"
                title="Alignment"
              >
                <component :is="currentAlignIcon" :size="15" />
              </button>
              <div v-if="openPopover === 'align'" class="absolute top-full left-0 mt-1.5 bg-white rounded-lg shadow-lg border border-om-gray-200 p-1 flex items-center gap-0.5 z-10">
                <button
                  v-for="a in alignOptions"
                  :key="a.id"
                  @click="setAlign(a.id); openPopover = null"
                  :class="[
                    'w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors',
                    (activeStyle.align || 'left') === a.id ? 'bg-om-orange-100 text-om-orange-600' : 'text-om-gray-700 hover:bg-om-gray-100'
                  ]"
                >
                  <component :is="a.icon" :size="15" />
                </button>
              </div>
            </div>
            <button
              class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors text-om-gray-700 hover:bg-om-gray-100"
              title="List"
            >
              <ListIcon :size="15" />
            </button>
            <button
              class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors text-om-gray-700 hover:bg-om-gray-100"
              title="Link"
            >
              <Link2 :size="15" />
            </button>
          </div>

          <div class="w-px h-5 bg-om-gray-200" />

          <!-- Color + Highlight + Opacity -->
          <div class="flex items-center gap-0.5">
            <!-- Text color (A with underline) -->
            <div class="relative">
              <button
                @click="togglePopover('color')"
                class="w-8 h-8 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-om-gray-100 transition-colors"
                title="Color"
              >
                <span class="text-sm font-semibold text-om-gray-700 leading-none">A</span>
                <span class="w-4 h-0.5 mt-0.5 rounded" :style="{ backgroundColor: activeStyle.color || brandColor }"></span>
              </button>
              <div v-if="openPopover === 'color'" class="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 bg-white rounded-lg shadow-lg border border-om-gray-200 p-2 flex items-center gap-1.5 z-10">
                <button
                  v-for="c in toolbarColors"
                  :key="c"
                  @click="setColor(c); openPopover = null"
                  :class="[
                    'w-5 h-5 rounded-full border transition-transform cursor-pointer',
                    activeStyle.color === c ? 'ring-2 ring-om-orange-500 ring-offset-1' : 'border-om-gray-300 hover:scale-110'
                  ]"
                  :style="{ backgroundColor: c }"
                ></button>
              </div>
            </div>
            <button
              class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors text-om-gray-700 hover:bg-om-gray-100"
              title="Highlight"
            >
              <Highlighter :size="15" />
            </button>
            <button
              class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors text-om-gray-700 hover:bg-om-gray-100"
              title="Opacity"
            >
              <span class="w-4 h-4 rounded checker-bg border border-om-gray-300"></span>
            </button>
          </div>

          <div class="w-px h-5 bg-om-gray-200" />

          <!-- More -->
          <button
            class="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-colors text-om-gray-700 hover:bg-om-gray-100"
            title="More"
          >
            <MoreVertical :size="15" />
          </button>
          </div>
        </div>
        <!-- Loader (generation or selection prep) -->
        <div v-if="showCanvasLoader" class="flex-1 flex flex-col items-center justify-center gap-4 min-h-0">
          <div class="w-16 h-16 border-4 border-om-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-om-gray-500">{{ canvasLoaderText }}</p>
        </div>
        <div
          v-else
          ref="whiteboardRef"
          class="flex-1 overflow-auto min-h-0 p-10"
          :class="{ 'cursor-grabbing select-none': isPanning }"
          @click="onCanvasClick"
          @mousedown="onWhiteboardMousedown"
        >
          <div class="flex items-start gap-3 min-w-max mx-auto min-h-full">
            <!-- Add step button before the first step -->
            <button
              @click.stop="addStepAt(0)"
              class="shrink-0 w-9 h-9 rounded-full bg-white border border-om-gray-300 text-om-gray-500 flex items-center justify-center shadow-sm hover:border-om-orange-400 hover:text-om-orange-500 transition-colors cursor-pointer"
              title="Add step"
            >
              <Plus :size="16" />
            </button>
            <template v-for="(s, idx) in steps" :key="s.id">
            <div
              :data-step-id="s.id"
              class="flex flex-col items-start gap-3 group"
            >
              <div class="flex items-center justify-between h-9" style="width: 680px;">
                <span class="text-xs font-semibold uppercase tracking-wider text-om-gray-500">{{ s.label }}</span>
                <button
                  v-if="steps.length > 1"
                  @click.stop="removeStep(idx)"
                  class="w-7 h-7 flex items-center justify-center rounded text-om-gray-400 hover:text-red-500 hover:bg-om-gray-100 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Remove step"
                >
                  <Trash2 :size="15" />
                </button>
              </div>
              <!-- Teaser: website mock background, no dark overlay -->
              <div v-if="s.id === 'teaser'" class="relative rounded-lg shadow-xl bg-cover bg-center" style="width: 680px; height: 420px; background-image: url('/templates/template-bg.svg');">
                <div class="absolute bottom-4 right-4">
                  <div v-bind="elEditAttrs('teaser-badge')" :class="elClass('teaser-badge')" @click.stop="select('teaser-badge', $event)" class="px-4 py-2.5 rounded-md text-white text-xs font-bold shadow-lg" :style="[{ backgroundColor: brandColor }, getElementStyle('teaser-badge')]">
                    {{ popupContent['teaser-badge'] || '🎁 10% KUPON' }}
                  </div>
                </div>
              </div>
              <!-- Mobile preview for teaser -->
              <div v-if="s.id === 'teaser'" class="relative rounded-xl shadow-xl bg-cover bg-center overflow-hidden mt-10" style="width: 240px; height: 500px; background-image: url('/templates/template-bg.svg');">
                <div class="absolute bottom-3 right-3">
                  <div class="px-2.5 py-1.5 rounded text-white text-[9px] font-bold shadow-lg" :style="[{ backgroundColor: brandColor }, getElementStyle('teaser-badge')]">
                    {{ popupContent['teaser-badge'] || '🎁 10% KUPON' }}
                  </div>
                </div>
              </div>
              <!-- Offer / Thank you: dark frame + white popup card -->
              <div v-else class="relative bg-[#4E686D] rounded-lg shadow-xl flex items-center justify-center p-6" style="width: 680px; height: 420px;">
                <div class="bg-white rounded-md shadow-2xl overflow-hidden" style="width: 620px; height: 360px;" @click.stop>
                  <!-- Offer step content -->
                  <template v-if="s.id === 'main'">
                    <!-- Newsletter / Smart Discount -->
                    <template v-if="useCase?.id === 'newsletter'">
                      <div class="flex w-full h-full">
                        <div :class="elClass('image-left')" @click.stop="select('image-left', $event)" class="w-[25%] shrink-0 bg-white flex items-end justify-center">
                          <img src="/campaigns/smart-discount-popup-img.png" alt="" class="h-3/4 object-contain" />
                        </div>
                        <div class="flex-1 px-8 py-6 flex flex-col justify-center text-center">
                          <img :class="elClass('logo')" @click.stop="select('logo', $event)" src="/demos/telekom/logo2.png" alt="" class="w-14 h-14 object-contain mb-3 mx-auto" />
                          <h4 v-bind="elEditAttrs('headline')" :class="elClass('headline')" @click.stop="select('headline', $event)" class="text-2xl font-bold mb-2 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                          <p v-bind="elEditAttrs('subtext')" :class="elClass('subtext')" @click.stop="select('subtext', $event)" class="text-sm text-om-gray-500 mb-4">{{ popupContent.subtext }}</p>
                          <button v-bind="elEditAttrs('primary-cta')" :class="elClass('primary-cta')" @click.stop="select('primary-cta', $event)" class="w-full py-3 text-white text-sm font-bold mb-2 rounded-md" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                          <button v-bind="elEditAttrs('secondary-cta')" :class="elClass('secondary-cta')" @click.stop="select('secondary-cta', $event)" class="w-full py-3 text-sm font-bold border-2 rounded-md bg-white" :style="[{ color: brandColor, borderColor: brandColor }, getElementStyle('secondary-cta')]">{{ popupContent['secondary-cta'] }}</button>
                        </div>
                        <div :class="elClass('image-right')" @click.stop="select('image-right', $event)" class="w-[25%] shrink-0 bg-white flex items-end justify-center">
                          <img src="/campaigns/smart-discount-popup-img.png" alt="" class="h-3/4 object-contain" />
                        </div>
                      </div>
                    </template>

                    <!-- Cart Abandonment -->
                    <template v-else-if="useCase?.id === 'cart-abandonment'">
                      <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templates/template-bg.svg')">
                        <div class="absolute inset-0 flex items-center justify-center p-6">
                          <div class="bg-white rounded-lg shadow-lg flex w-[85%] h-[90%]">
                            <div class="flex-1 px-8 py-5 flex flex-col justify-center">
                              <p v-bind="elEditAttrs('badge')" :class="elClass('badge')" @click.stop="select('badge', $event)" class="text-[10px] mb-2 uppercase tracking-wide font-bold" :style="[{ color: brandColor }, getElementStyle('badge')]">{{ popupContent.badge }}</p>
                              <h4 v-bind="elEditAttrs('headline')" :class="elClass('headline')" @click.stop="select('headline', $event)" class="text-xl font-bold mb-4 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                              <div v-bind="elEditAttrs('email-input')" :class="elClass('email-input')" @click.stop="select('email-input', $event)" class="h-10 bg-white border border-om-gray-300 rounded-md text-xs flex items-center px-3 text-om-gray-400 mb-3">{{ popupContent['email-input'] }}</div>
                              <button v-bind="elEditAttrs('primary-cta')" :class="elClass('primary-cta')" @click.stop="select('primary-cta', $event)" class="w-full py-2.5 text-white text-xs font-bold rounded-md" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                            </div>
                            <div :class="elClass('image')" @click.stop="select('image', $event)" class="w-[50%] shrink-0 bg-white flex items-center justify-center rounded-r-lg overflow-hidden">
                              <img src="/campaigns/cart-abandonment-stopper-img.png" alt="" class="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Lucky Wheel -->
                    <template v-else-if="useCase?.id === 'spin-wheel'">
                      <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templates/template-bg.svg')">
                        <div class="absolute inset-0 flex items-center justify-start">
                          <div class="bg-white shadow-lg flex w-[70%] h-full">
                            <div :class="elClass('wheel')" @click.stop="select('wheel', $event)" class="w-[50%] shrink-0 bg-white flex items-center justify-center overflow-hidden pr-2 py-4">
                              <img src="/campaigns/lucky-wheel-img2.png" alt="" class="w-full h-auto object-contain" />
                            </div>
                            <div class="flex-1 px-8 py-5 flex flex-col justify-center">
                              <img :class="elClass('logo')" @click.stop="select('logo', $event)" src="/demos/telekom/logo2.png" alt="" class="w-8 h-8 object-contain mb-2" />
                              <h4 v-bind="elEditAttrs('headline')" :class="elClass('headline')" @click.stop="select('headline', $event)" class="text-lg font-bold mb-2 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                              <p v-bind="elEditAttrs('subtext')" :class="elClass('subtext')" @click.stop="select('subtext', $event)" class="text-[11px] text-om-gray-500 mb-3 leading-relaxed">{{ popupContent.subtext }}</p>
                              <div v-bind="elEditAttrs('email-input')" :class="elClass('email-input')" @click.stop="select('email-input', $event)" class="h-10 bg-white border border-om-gray-300 rounded-md text-xs flex items-center px-3 text-om-gray-400 mb-3">{{ popupContent['email-input'] }}</div>
                              <button v-bind="elEditAttrs('primary-cta')" :class="elClass('primary-cta')" @click.stop="select('primary-cta', $event)" class="w-full py-2.5 text-white text-xs font-bold mb-2 rounded-md" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                              <button v-bind="elEditAttrs('secondary-cta')" :class="elClass('secondary-cta')" @click.stop="select('secondary-cta', $event)" class="text-xs font-medium underline" :style="[{ color: brandColor }, getElementStyle('secondary-cta')]">{{ popupContent['secondary-cta'] }}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Feedback Survey -->
                    <template v-else-if="useCase?.id === 'feedback'">
                      <div class="relative w-full h-full bg-cover bg-center" style="background-image: url('/templates/template-bg.svg')">
                        <div class="absolute inset-0 flex items-center justify-center p-6">
                          <div class="bg-white shadow-lg rounded-lg w-[60%] h-[80%] flex flex-col justify-center px-12 py-8 text-center">
                            <img :class="elClass('logo')" @click.stop="select('logo', $event)" src="/demos/telekom/logo2.png" alt="" class="w-8 h-8 object-contain mb-3 mx-auto" />
                            <h4 v-bind="elEditAttrs('headline')" :class="elClass('headline')" @click.stop="select('headline', $event)" class="text-xl font-bold mb-2 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                            <p v-bind="elEditAttrs('subtext')" :class="elClass('subtext')" @click.stop="select('subtext', $event)" class="text-xs text-om-gray-500 mb-5 leading-relaxed">{{ popupContent.subtext }}</p>
                            <div :class="elClass('rating')" @click.stop="select('rating', $event)" class="flex justify-center gap-4 mb-4">
                              <div v-for="i in 5" :key="i" class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-base font-bold" :style="{ borderColor: brandColor, color: brandColor }">{{ i }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Fallback -->
                    <template v-else>
                      <div class="w-full h-full flex items-center justify-center text-om-gray-400 text-sm">
                        Offer preview
                      </div>
                    </template>
                  </template>

                  <!-- Thank you -->
                  <template v-else-if="s.id === 'thank-you'">
                    <div class="w-full h-full flex flex-col items-center justify-center text-center px-8 bg-white">
                      <div :class="elClass('thank-icon')" @click.stop="select('thank-icon', $event)" class="w-16 h-16 rounded-full flex items-center justify-center mb-4" :style="[{ backgroundColor: brandColor }, getElementStyle('thank-icon')]">
                        <Check :size="32" class="text-white" stroke-width="3" />
                      </div>
                      <h4 v-bind="elEditAttrs('thank-headline')" :class="elClass('thank-headline')" @click.stop="select('thank-headline', $event)" class="text-2xl font-bold mb-2" :style="[{ color: brandColor }, getElementStyle('thank-headline')]">{{ popupContent['thank-headline'] }}</h4>
                      <p v-bind="elEditAttrs('thank-subtext')" :class="elClass('thank-subtext')" @click.stop="select('thank-subtext', $event)" class="text-sm text-om-gray-500 mb-3">{{ popupContent['thank-subtext'] }}</p>
                      <div :class="elClass('thank-coupon')" @click.stop="select('thank-coupon', $event)" class="flex items-center gap-2 px-5 py-3 mb-6 rounded-md border-2 border-dashed bg-white" :style="[{ borderColor: brandColor }, getElementStyle('thank-coupon')]">
                        <span v-bind="elEditAttrs('thank-coupon')" class="font-mono text-xl font-bold tracking-widest outline-none" :style="{ color: brandColor }">{{ popupContent['thank-coupon'] }}</span>
                        <Copy :size="16" :style="{ color: brandColor }" class="opacity-70" />
                      </div>
                      <button v-bind="elEditAttrs('thank-cta')" :class="elClass('thank-cta')" @click.stop="select('thank-cta', $event)" class="px-6 py-3 text-white text-sm font-bold rounded-md" :style="[{ backgroundColor: brandColor }, getElementStyle('thank-cta')]">{{ popupContent['thank-cta'] }}</button>
                    </div>
                  </template>

                </div>
              </div>

              <!-- Mobile frame for offer/thank-you -->
              <div v-if="s.id !== 'teaser'" class="relative bg-[#4E686D] rounded-xl shadow-xl flex items-center justify-center p-3 mt-10" style="width: 240px; height: 500px;">
                <div class="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col" style="width: 220px; height: 460px;">
                  <!-- Offer step mobile -->
                  <template v-if="s.id === 'main'">
                    <template v-if="useCase?.id === 'newsletter'">
                      <div class="w-full h-32 shrink-0 bg-white flex items-end justify-center overflow-hidden">
                        <img src="/campaigns/smart-discount-popup-img.png" alt="" class="h-full object-contain" />
                      </div>
                      <div class="flex-1 px-4 py-4 flex flex-col justify-center text-center gap-1.5">
                        <img src="/demos/telekom/logo2.png" alt="" class="w-9 h-9 object-contain mx-auto" />
                        <h4 class="text-base font-bold leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                        <p class="text-[10px] text-om-gray-500" :style="getElementStyle('subtext')">{{ popupContent.subtext }}</p>
                        <button class="w-full py-2 text-white text-[10px] font-bold rounded-md mt-1" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                        <button class="w-full py-2 text-[10px] font-bold border-2 rounded-md bg-white" :style="[{ color: brandColor, borderColor: brandColor }, getElementStyle('secondary-cta')]">{{ popupContent['secondary-cta'] }}</button>
                      </div>
                    </template>
                    <template v-else-if="useCase?.id === 'cart-abandonment'">
                      <div class="flex-1 px-4 py-4 flex flex-col justify-center">
                        <p class="text-[9px] mb-1 uppercase tracking-wide font-bold" :style="[{ color: brandColor }, getElementStyle('badge')]">{{ popupContent.badge }}</p>
                        <h4 class="text-base font-bold mb-3 leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                        <div class="w-full h-32 bg-om-gray-50 mb-3 overflow-hidden flex items-center justify-center rounded">
                          <img src="/campaigns/cart-abandonment-stopper-img.png" alt="" class="h-full object-cover" />
                        </div>
                        <div class="h-8 bg-white border border-om-gray-300 rounded text-[10px] flex items-center px-2 text-om-gray-400 mb-2">{{ popupContent['email-input'] }}</div>
                        <button class="w-full py-2 text-white text-[10px] font-bold rounded" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                      </div>
                    </template>
                    <template v-else-if="useCase?.id === 'spin-wheel'">
                      <div class="w-full h-32 shrink-0 bg-white flex items-center justify-center overflow-hidden">
                        <img src="/campaigns/lucky-wheel-img2.png" alt="" class="h-full object-contain" />
                      </div>
                      <div class="flex-1 px-4 py-3 flex flex-col justify-center gap-1.5">
                        <img src="/demos/telekom/logo2.png" alt="" class="w-7 h-7 object-contain" />
                        <h4 class="text-sm font-bold leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                        <p class="text-[10px] text-om-gray-500 leading-snug" :style="getElementStyle('subtext')">{{ popupContent.subtext }}</p>
                        <div class="h-8 bg-white border border-om-gray-300 rounded text-[10px] flex items-center px-2 text-om-gray-400">{{ popupContent['email-input'] }}</div>
                        <button class="w-full py-2 text-white text-[10px] font-bold rounded mt-1" :style="[{ backgroundColor: brandColor }, getElementStyle('primary-cta')]">{{ popupContent['primary-cta'] }}</button>
                      </div>
                    </template>
                    <template v-else-if="useCase?.id === 'feedback'">
                      <div class="flex-1 px-4 py-6 flex flex-col items-center justify-center text-center gap-2">
                        <img src="/demos/telekom/logo2.png" alt="" class="w-9 h-9 object-contain" />
                        <h4 class="text-base font-bold leading-tight" :style="[{ color: brandColor }, getElementStyle('headline')]">{{ popupContent.headline }}</h4>
                        <p class="text-[10px] text-om-gray-500 leading-relaxed mb-2" :style="getElementStyle('subtext')">{{ popupContent.subtext }}</p>
                        <div class="flex justify-center gap-2">
                          <div v-for="i in 5" :key="i" class="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold" :style="{ borderColor: brandColor, color: brandColor }">{{ i }}</div>
                        </div>
                      </div>
                    </template>
                  </template>
                  <!-- Thank you mobile -->
                  <template v-else-if="s.id === 'thank-you'">
                    <div class="w-full h-full flex flex-col items-center justify-center text-center px-4 gap-2">
                      <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="[{ backgroundColor: brandColor }, getElementStyle('thank-icon')]">
                        <Check :size="22" class="text-white" stroke-width="3" />
                      </div>
                      <h4 class="text-base font-bold leading-tight" :style="[{ color: brandColor }, getElementStyle('thank-headline')]">{{ popupContent['thank-headline'] }}</h4>
                      <p class="text-[10px] text-om-gray-500" :style="getElementStyle('thank-subtext')">{{ popupContent['thank-subtext'] }}</p>
                      <div class="flex items-center gap-1.5 px-3 py-2 rounded border-2 border-dashed bg-white" :style="[{ borderColor: brandColor }, getElementStyle('thank-coupon')]">
                        <span class="font-mono text-sm font-bold tracking-widest" :style="{ color: brandColor }">{{ popupContent['thank-coupon'] }}</span>
                        <Copy :size="12" :style="{ color: brandColor }" class="opacity-70" />
                      </div>
                      <button class="px-4 py-2 text-white text-[10px] font-bold rounded mt-1" :style="[{ backgroundColor: brandColor }, getElementStyle('thank-cta')]">{{ popupContent['thank-cta'] }}</button>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- Add step button between steps (not after teaser) -->
            <button
              v-if="s.id !== 'teaser'"
              @click.stop="addStepAt(idx + 1)"
              class="shrink-0 w-9 h-9 rounded-full bg-white border border-om-gray-300 text-om-gray-500 flex items-center justify-center shadow-sm hover:border-om-orange-400 hover:text-om-orange-500 transition-colors cursor-pointer"
              title="Add step"
            >
              <Plus :size="16" />
            </button>
            </template>
          </div>
        </div>
        </div>
        <!-- Settings panel (Settings tab): rows are click-to-select, edited via chat (like design elements) -->
        <div v-else class="flex-1 min-h-0 overflow-y-auto whiteboard-bg p-6" @click="onCanvasClick">
          <div class="max-w-2xl mx-auto space-y-2">
            <div v-for="sec in settingsSections" :key="sec.title" class="bg-white rounded-xl border border-om-gray-200 px-4 py-3">
              <p class="text-sm font-semibold text-om-gray-800">{{ sec.title }}</p>
              <p class="text-xs text-om-gray-500 mt-0.5">{{ sec.description }}</p>
              <ul v-if="sec.details?.length" class="mt-2.5 space-y-1 border-t border-om-gray-100 pt-2">
                <li
                  v-for="d in sec.details"
                  :key="d"
                  @click.stop="select(d, $event)"
                  :class="[
                    'flex items-start gap-2 text-sm rounded-md px-2 py-1.5 -mx-1 cursor-pointer transition-colors',
                    selectedElement === d ? 'bg-om-orange-50 ring-1 ring-om-orange-200 text-om-gray-800' : 'text-om-gray-700 hover:bg-om-gray-50'
                  ]"
                >
                  <span class="w-1 h-1 rounded-full bg-om-orange-400 shrink-0 mt-2"></span>
                  <span>{{ d }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import {
  ChevronDown, ChevronUp, ChevronLeft, Check, ArrowUp, X, Copy, Plus, Type, LayoutTemplate,
  Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough,
  List as ListIcon, Link2, Highlighter, MoreVertical, Trash2,
  AlignLeft, AlignCenter, AlignRight,
  Undo2, Redo2, Monitor, Smartphone, Eye, Minimize2, Maximize2,
} from 'lucide-vue-next'
import Button from '../shared/Button.vue'
import Sidebar from '../shared/Sidebar.vue'

const props = defineProps({
  useCase: { type: Object, default: () => ({}) },
  generationPrompt: { type: String, default: '' },
  selectLoading: { type: Boolean, default: false },
  initialChatMessages: { type: Array, default: () => [] },
  couponCode: { type: String, default: '' },
  // Embedded in the Today's plan flow: open as a centered frameless chat (so the
  // conversation appears to stay in place), drop the editor's own draft chrome.
  embedded: { type: Boolean, default: false },
  // Targeting parameters reviewed in-chat after "Done" (embedded flow only):
  // array of { label, items: [] }.
  targeting: { type: Array, default: () => [] },
})

const brandColor = '#E20074'

// Editor block tabs: Design (canvas) vs Settings (campaign settings)
const editorTab = ref('design')

// Settings tab = the campaign settings + the chosen integration & email notification (updated by the chat questions)
const chosenIntegration = ref('No integration connected yet')
const emailNotificationDetail = ref('Off')
// Fallback settings when no `targeting` prop is passed (e.g. the public wizard editor)
const DEFAULT_CAMPAIGN_SETTINGS = [
  { title: 'Triggering', description: 'When would you like this campaign to show up?', details: ['On exit-intent — when a visitor is about to leave your site', 'Or after 20 seconds of inactivity (desktop and mobile)'] },
  { title: 'Frequency', description: 'How many times should this campaign appear?', details: ['Appears a maximum of 2 times per visitor', 'At least 1 hour between two impressions', 'Stops showing after a visitor has converted'] },
  { title: 'Targeting', description: 'Who should see this campaign?', details: ['Spent on pages — at least 10 seconds on the current subpage', 'Current page / URL — contains cart, shop_cart, shop_reg, or shop_category'] },
]
const settingsSections = computed(() => {
  const base = props.targeting.length ? props.targeting : DEFAULT_CAMPAIGN_SETTINGS
  return [
    ...base,
    { title: 'Integrations', description: 'Where you would like to send the subscribers and campaign data?', details: [chosenIntegration.value] },
    { title: 'Email notification', description: 'Get notified when someone submits this campaign', details: [emailNotificationDetail.value] },
  ]
})

// Primary top-bar action: on the embedded Design tab it advances to Settings ("Next");
// on Settings it finishes ("Done"); non-embedded keeps "Publish".
const primaryActionLabel = computed(() => {
  if (!props.embedded) return 'Publish'
  return editorTab.value === 'design' ? 'Next' : 'Done'
})
const onPrimaryAction = () => {
  if (!props.embedded) { startPublishFlow(); return }
  if (editorTab.value === 'design') {
    editorTab.value = 'settings'
    return
  }
  // Settings tab "Done" → finish and go straight to the success screen
  emit('published')
}

// ── Editor top-bar controls ──
const device = ref('desktop') // 'desktop' | 'mobile'
const previewOpen = ref(false)
const chatExpanded = ref(false) // wide centered chat layout — toggleable any time
const publishMode = ref(false)  // publish sub-flow (preview + coupon question)

// ── Resizable chat / editor split (drag the divider) ──
const chatWidth = ref(400) // px, includes the p-4 padding around the chat card
const chatResizing = ref(false)
let resizeStartX = 0
let resizeStartW = 0
const onChatResizeMove = (e) => {
  const max = window.innerWidth * 0.5 // chat can grow up to half the window
  chatWidth.value = Math.min(max, Math.max(320, resizeStartW + (e.clientX - resizeStartX)))
}
const stopChatResize = () => {
  chatResizing.value = false
  document.body.style.userSelect = ''
  window.removeEventListener('mousemove', onChatResizeMove)
  window.removeEventListener('mouseup', stopChatResize)
}
const startChatResize = (e) => {
  chatResizing.value = true
  resizeStartX = e.clientX
  resizeStartW = chatWidth.value
  document.body.style.userSelect = 'none'
  window.addEventListener('mousemove', onChatResizeMove)
  window.addEventListener('mouseup', stopChatResize)
}
let publishStage = 0

const publishQuestion = ref(null)
const publishCouponInput = ref('')
// Embedded targeting review (after "Done"): the docked question + adjust mode
const targetingQuestion = ref(null)
const targetingAdjust = ref(false)
// Separate integration question asked before the final settings confirm
const integrationQuestion = ref(null)
const availableIntegrations = ['Klaviyo', 'HubSpot', 'ActiveCampaign', 'Brevo', 'Salesforce', 'Zapier']
// Separate email-notification question, asked after the integration one
const emailQuestion = ref(null)

const publishContinueDisabled = computed(() => {
  const q = publishQuestion.value
  if (!q?.selectedId) return true
  if (q.selectedId === 'change' && !publishCouponInput.value.trim()) return true
  return false
})

// Expand / collapse the chat panel at any time (independent of the publish flow)
const expandChat = () => {
  chatExpanded.value = true
  scrollChatToBottom()
}
const collapseChat = () => {
  chatExpanded.value = false
  scrollChatToBottom()
}

const startPublishFlow = async () => {
  // Drop any element selection so the "Editing: …" banner clears on Done
  selectedElement.value = null
  selectedRect.value = null
  openPopover.value = null
  chatExpanded.value = true
  // Embedded (Today's plan): keep the chat, expand it back to full, and review the
  // targeting parameters in-chat before going live — instead of publishing directly.
  if (props.embedded) {
    scrollChatToBottom()
    await wait(400)
    await streamAi("That's the design locked in. Here are the campaign settings:")
    generationMessages.value.push({ role: 'targeting', sections: props.targeting })
    scrollChatToBottom()
    await wait(300)
    await streamAi("One more thing — do you want to send new subscribers to an integration? I'd recommend Mailchimp, but it's up to you.")
    showIntegrationQuestion()
    return
  }
  publishMode.value = true
  publishStage = 0
  // Show final popup design immediately (avoid stacking duplicates on re-publish)
  if (generationMessages.value[generationMessages.value.length - 1]?.role !== 'popup-preview') {
    generationMessages.value.push({ role: 'popup-preview' })
  }
  scrollChatToBottom()
  await wait(450)
  // If the coupon was already chosen earlier, publish without asking again
  if (props.couponCode) {
    await streamAi(`Publishing with "${popupContent['thank-coupon']}". You'll get a confirmation when it's live.`)
    publishStage = 1
    await wait(1000)
    emit('published')
    return
  }
  // Otherwise ask whether to keep the default coupon
  publishQuestion.value = {
    text: `Coupon code is "${popupContent['thank-coupon']}". Want to keep this default?`,
    selectedId: null,
    options: [
      { id: 'keep', label: `Keep "${popupContent['thank-coupon']}"`, description: 'Publish the campaign with the current coupon code.' },
      { id: 'change', label: 'Change it', description: 'I want to use a different coupon code.' },
    ],
  }
}

const scrollChatToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  })
}

const onPublishQuestionContinue = async () => {
  const q = publishQuestion.value
  if (!q?.selectedId) return
  if (q.selectedId === 'keep') {
    publishQuestion.value = null
    await wait(300)
    await streamAi(`Great — publishing with "${popupContent['thank-coupon']}". You'll get a confirmation when it's live.`)
    publishStage = 1
  } else {
    const newCode = publishCouponInput.value.trim().split(/\s+/).pop().toUpperCase()
    if (!newCode) return
    popupContent['thank-coupon'] = newCode
    publishQuestion.value = null
    publishCouponInput.value = ''
    publishStage = 1
    await wait(300)
    await streamAi(`Got it. Coupon updated to "${newCode}". Publishing now — you'll get a confirmation shortly.`)
  }
  // Campaign is live — hand off to the detailed summary
  await wait(1000)
  emit('published')
}

// Separate integration question — confirm where subscribers/data are sent
const showIntegrationQuestion = () => {
  integrationQuestion.value = {
    step: 'choose',
    text: 'Do you want to send new subscribers to an integration?',
    selectedId: null, // nothing connected by default — the user decides
    options: [
      { id: 'mailchimp', label: 'Use Mailchimp (recommended)', description: 'Send new subscribers straight to your Mailchimp account.' },
      { id: 'other', label: 'Use a different integration', description: 'Pick from the available integrations.' },
      { id: 'none', label: 'Not now', description: "Don't connect one yet — you can add it later." },
    ],
  }
  scrollChatToBottom()
}
// Resolve a chosen integration: echo it, show the Integrations block, then ask about email
const resolveIntegration = async (userText, detail) => {
  integrationQuestion.value = null
  chosenIntegration.value = detail
  generationMessages.value.push({ role: 'user', text: userText, time: formatTime(new Date()), fromEditor: true })
  scrollChatToBottom()
  await wait(300)
  generationMessages.value.push({ role: 'targeting', sections: [
    { title: 'Integrations', description: 'Where you would like to send the subscribers and campaign data?', details: [detail] },
  ] })
  scrollChatToBottom()
  await wait(300)
  await streamAi("And do you want email notifications when someone submits this campaign?")
  showEmailQuestion()
}
const onIntegrationContinue = async () => {
  const q = integrationQuestion.value
  if (!q?.selectedId) return
  // Step 2: a specific tool was picked from the available list
  if (q.step === 'list') {
    await resolveIntegration(`Use ${q.selectedId}`, q.selectedId)
    return
  }
  // Step 1: Mailchimp / a different one / none
  if (q.selectedId === 'other') {
    integrationQuestion.value = null
    generationMessages.value.push({ role: 'user', text: 'Use a different integration', time: formatTime(new Date()), fromEditor: true })
    scrollChatToBottom()
    await wait(300)
    await streamAi('Sure — here are the integrations you can connect:')
    integrationQuestion.value = {
      step: 'list',
      text: 'Available integrations',
      selectedId: null,
      options: availableIntegrations.map((name) => ({ id: name, label: name })),
    }
    scrollChatToBottom()
    return
  }
  if (q.selectedId === 'none') {
    await resolveIntegration("Don't connect an integration for now", 'No integration connected')
    return
  }
  await resolveIntegration('Use Mailchimp', 'Mailchimp')
}

// Separate email-notification question
const showEmailQuestion = () => {
  emailQuestion.value = {
    text: 'Email notification',
    selectedId: null,
    options: [
      { id: 'on', label: 'Yes, notify me', description: 'Email you each time someone submits.' },
      { id: 'off', label: 'No notifications', description: "Don't send submission emails." },
    ],
  }
  scrollChatToBottom()
}
const onEmailContinue = async () => {
  const q = emailQuestion.value
  if (!q?.selectedId) return
  const on = q.selectedId === 'on'
  emailQuestion.value = null
  emailNotificationDetail.value = on ? 'On' : 'Off'
  generationMessages.value.push({ role: 'user', text: on ? 'Email me on each submission' : "Don't send submission emails", time: formatTime(new Date()), fromEditor: true })
  scrollChatToBottom()
  await wait(300)
  // Now that it's answered, the Email notification block appears
  generationMessages.value.push({ role: 'targeting', sections: [
    { title: 'Email notification', description: 'Get notified when someone submits this campaign', details: [on ? 'On' : 'Off'] },
  ] })
  scrollChatToBottom()
  await wait(300)
  await streamAi("That's everything set.")
  showTargetingQuestion()
}

// Embedded targeting review: ask whether the targeting looks right or needs tweaks
const showTargetingQuestion = () => {
  targetingQuestion.value = {
    text: 'Do these settings look right?',
    selectedId: null,
    options: [
      { id: 'good', label: 'Yes, these look right', description: 'Launch the campaign with these settings.' },
      { id: 'adjust', label: "I'd like to adjust", description: 'Change the targeting, display, frequency or anything else.' },
    ],
  }
  scrollChatToBottom()
}
const onTargetingContinue = async () => {
  const q = targetingQuestion.value
  if (!q?.selectedId) return
  if (q.selectedId === 'good') {
    targetingQuestion.value = null
    targetingAdjust.value = false
    await wait(300)
    await streamAi("Perfect — your campaign is ready to launch.")
    await wait(900)
    emit('published')
  } else {
    targetingQuestion.value = null
    targetingAdjust.value = true
    await wait(300)
    await streamAi("Sure — tell me which setting to change and what to, and I'll update it.")
  }
}
const zoom = ref(30)
const zoomOptions = [25, 30, 50, 75, 100, 125, 150]
const zoomMenuOpen = ref(false)
const screenMenuOpen = ref(false)

const screenSize = ref({ w: 1920, h: 1080 })
const screenSizes = [
  { w: 1920, h: 1080, label: 'Full HD' },
  { w: 1440, h: 900, label: 'MacBook' },
  { w: 1366, h: 768, label: 'Laptop' },
  { w: 1280, h: 800 },
  { w: 1024, h: 768 },
  { w: 768, h: 1024, label: 'Tablet' },
  { w: 414, h: 896, label: 'iPhone' },
  { w: 375, h: 667, label: 'iPhone SE' },
]

const emit = defineEmits(['back', 'published'])

// Sidebar "Home" (embedded flow): close the editor and go to the Today's plan list
const goHome = () => {
  if (!props.embedded) return
  emit('back')
  window.location.hash = '#/agentic/home'
}

const steps = ref([
  { id: 'main', label: 'Offer' },
  { id: 'thank-you', label: 'Thank you' },
  { id: 'teaser', label: 'Teaser' },
])

let newStepCounter = 1
const addStepAt = (index) => {
  const id = `empty-${newStepCounter++}`
  steps.value.splice(index, 0, { id, label: 'New step', empty: true })
  nextTick(() => {
    const el = whiteboardRef.value?.querySelector(`[data-step-id="${id}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  })
}

const removeStep = (index) => {
  if (steps.value.length <= 1) return
  steps.value.splice(index, 1)
}

// ── Selectable elements ──
const selectedElement = ref(null)
const selectedRect = ref(null)

const elementStyles = reactive({})
const ensureStyle = (id) => {
  if (!elementStyles[id]) elementStyles[id] = { bold: false, italic: false, underline: false, strikethrough: false, color: null, sizePx: null, font: null, align: null }
  return elementStyles[id]
}

const fontFamilyMap = {
  sans: '"Inter", system-ui, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'Menlo, Monaco, monospace',
  display: '"Helvetica Neue", Helvetica, Arial, sans-serif',
}

const getElementStyle = (id) => {
  const s = elementStyles[id]
  if (!s) return {}
  const style = {}
  if (s.bold) style.fontWeight = '800'
  if (s.italic) style.fontStyle = 'italic'
  if (s.color) style.color = s.color
  if (s.sizePx) style.fontSize = `${s.sizePx}px`
  if (s.font && fontFamilyMap[s.font]) style.fontFamily = fontFamilyMap[s.font]
  if (s.align) style.textAlign = s.align
  const decorations = []
  if (s.underline) decorations.push('underline')
  if (s.strikethrough) decorations.push('line-through')
  if (decorations.length) style.textDecoration = decorations.join(' ')
  return style
}

const select = (id, e) => {
  selectedElement.value = id
  if (e?.currentTarget) {
    selectedRect.value = e.currentTarget.getBoundingClientRect()
    if (e.currentTarget.isContentEditable) {
      nextTick(() => {
        e.currentTarget.focus()
        const range = document.createRange()
        range.selectNodeContents(e.currentTarget)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      })
    }
  }
}

const onCanvasClick = () => {
  selectedElement.value = null
  selectedRect.value = null
  openPopover.value = null
}

watch(selectedElement, () => { openPopover.value = null })

const toolbarColors = ['#E20074', '#23262A', '#FFFFFF', '#239E77', '#ED5A29']
const toolbarFonts = [
  { id: 'sans', label: 'Inter', family: fontFamilyMap.sans },
  { id: 'serif', label: 'Georgia', family: fontFamilyMap.serif },
  { id: 'display', label: 'Helvetica', family: fontFamilyMap.display },
  { id: 'mono', label: 'Menlo', family: fontFamilyMap.mono },
]
const alignOptions = [
  { id: 'left', icon: AlignLeft },
  { id: 'center', icon: AlignCenter },
  { id: 'right', icon: AlignRight },
]

const openPopover = ref(null) // 'color' | 'font' | 'align' | 'textStyle' | null
const togglePopover = (name) => { openPopover.value = openPopover.value === name ? null : name }

// User is already registered in the editor — actions apply directly
const guarded = (apply) => {
  apply()
  return true
}

const toggleBold = () => guarded(() => { if (selectedElement.value) ensureStyle(selectedElement.value).bold = !ensureStyle(selectedElement.value).bold })
const toggleItalic = () => guarded(() => { if (selectedElement.value) ensureStyle(selectedElement.value).italic = !ensureStyle(selectedElement.value).italic })
const toggleUnderline = () => guarded(() => { if (selectedElement.value) ensureStyle(selectedElement.value).underline = !ensureStyle(selectedElement.value).underline })
const toggleStrike = () => guarded(() => { if (selectedElement.value) ensureStyle(selectedElement.value).strikethrough = !ensureStyle(selectedElement.value).strikethrough })
const setColor = (c) => guarded(() => { if (selectedElement.value) ensureStyle(selectedElement.value).color = c })
const setFont = (f) => guarded(() => { if (selectedElement.value) ensureStyle(selectedElement.value).font = f })
const setAlign = (a) => guarded(() => { if (selectedElement.value) ensureStyle(selectedElement.value).align = a })
const setFontSizePx = (px) => guarded(() => {
  if (!selectedElement.value) return
  const clamped = Math.max(8, Math.min(96, px || 14))
  ensureStyle(selectedElement.value).sizePx = clamped
})
const activeStyle = computed(() => selectedElement.value ? (elementStyles[selectedElement.value] || {}) : {})
const fontSizePx = computed(() => activeStyle.value.sizePx || 14)
const currentFontLabel = computed(() => toolbarFonts.find((f) => f.id === activeStyle.value.font)?.label || 'Inter')
const currentAlignIcon = computed(() => {
  const a = activeStyle.value.align
  if (a === 'center') return AlignCenter
  if (a === 'right') return AlignRight
  return AlignLeft
})

// ── Whiteboard panning (middle mouse button) ──
const whiteboardRef = ref(null)
const isPanning = ref(false)
let panStart = null

const onWhiteboardMousedown = (e) => {
  if (e.button !== 1) return // middle mouse only
  e.preventDefault()
  if (!whiteboardRef.value) return
  isPanning.value = true
  panStart = {
    x: e.clientX,
    y: e.clientY,
    scrollLeft: whiteboardRef.value.scrollLeft,
    scrollTop: whiteboardRef.value.scrollTop,
  }
  window.addEventListener('mousemove', onWindowMousemove)
  window.addEventListener('mouseup', onWindowMouseup)
}

const onWindowMousemove = (e) => {
  if (!isPanning.value || !panStart || !whiteboardRef.value) return
  e.preventDefault()
  whiteboardRef.value.scrollLeft = panStart.scrollLeft - (e.clientX - panStart.x)
  whiteboardRef.value.scrollTop = panStart.scrollTop - (e.clientY - panStart.y)
}

const onWindowMouseup = () => {
  isPanning.value = false
  panStart = null
  window.removeEventListener('mousemove', onWindowMousemove)
  window.removeEventListener('mouseup', onWindowMouseup)
}

const elClass = (id) => [
  'cursor-pointer transition-all ring-2 ring-inset outline-none',
  selectedElement.value === id ? 'ring-om-orange-500' : 'ring-transparent hover:ring-om-orange-300',
]

// Inline contenteditable bindings for text elements — always editable in place
const elEditAttrs = (id) => {
  const isText = popupContent[id] !== undefined
  if (!isText) return {}
  return {
    contenteditable: 'plaintext-only',
    spellcheck: 'false',
    onBlur: (e) => {
      popupContent[id] = e.target.innerText
    },
    onKeydown: (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        e.target.blur()
      } else if (e.key === 'Escape') {
        e.target.blur()
      }
    },
  }
}

// ── Editable element content ──
const popupContent = reactive({})

const defaultsByUseCase = {
  newsletter: {
    headline: 'Tiéd a 10% KUPON',
    subtext: 'Csapj le rá, mielőtt eltűnik!',
    'primary-cta': 'KÉREM A 10%-OT',
    'secondary-cta': 'NEM, KÖSZ!',
  },
  'cart-abandonment': {
    badge: 'VÁRJ',
    headline: 'Szerezz egy 10%-os kuport!',
    'email-input': 'Email cím',
    'primary-cta': 'FOLYTATÁS',
  },
  'spin-wheel': {
    headline: 'Pörgess, nyerj és spórolj!',
    subtext: 'Úgy érzed, rád mosolyoghat a szerencse? Add meg az email címed, és pörgess!',
    'email-input': 'Email',
    'primary-cta': 'PÖRGETEK',
    'secondary-cta': 'NEM, KÖSZ!',
  },
  feedback: {
    headline: 'Van egy perced? Mondd el a véleményed!',
    subtext: 'Hogyan értékelnéd az általános tapasztalatodat velünk?',
  },
}

const elementLabels = {
  logo: 'Logo',
  headline: 'Headline',
  subtext: 'Subtext',
  badge: 'Badge',
  'primary-cta': 'Primary button',
  'secondary-cta': 'Secondary button',
  'email-input': 'Email input',
  'image-left': 'Left image',
  'image-right': 'Right image',
  image: 'Image',
  wheel: 'Wheel image',
  rating: 'Rating scale',
  'teaser-badge': 'Teaser badge',
  'thank-headline': 'Thank-you headline',
  'thank-subtext': 'Thank-you subtext',
  'thank-coupon': 'Coupon code',
  'thank-cta': 'Thank-you button',
  'thank-icon': 'Success icon',
}

const selectedLabel = computed(() => elementLabels[selectedElement.value] || selectedElement.value)
const isTextElement = computed(() => {
  const id = selectedElement.value
  return id && popupContent[id] !== undefined
})
const isImageElement = computed(() => {
  return ['logo', 'image', 'image-left', 'image-right', 'wheel'].includes(selectedElement.value)
})

const sharedDefaults = {
  'thank-headline': 'Köszönjük!',
  'thank-subtext': 'Használd ezt a kódot a pénztárnál:',
  'thank-coupon': 'WELCOME10',
  'thank-cta': 'VÁSÁROLOK MOST',
  'teaser-badge': '🎁 10% KUPON',
}

watch(() => props.useCase?.id, (id) => {
  Object.keys(popupContent).forEach((k) => delete popupContent[k])
  if (id && defaultsByUseCase[id]) {
    Object.assign(popupContent, defaultsByUseCase[id])
  }
  Object.assign(popupContent, sharedDefaults)
  // If a coupon code was already chosen earlier (e.g. in the chat), use it
  if (props.couponCode) popupContent['thank-coupon'] = props.couponCode
}, { immediate: true })

const defaultChatSuggestions = [
  'Change the headline to be more engaging',
  'Make the CTA button stand out more',
  'Suggest a better color scheme',
  'Add urgency to the copy',
]

const suggestionsByElement = {
  headline: ['Rewrite the headline to be punchier', 'Make it shorter', 'Add urgency', 'Try a question format'],
  subtext: ['Rewrite the supporting text', 'Make it more persuasive', 'Reduce length', 'Add a value prop'],
  badge: ['Update the badge wording', 'Try a stronger urgency word'],
  'primary-cta': ['Make the button text more action-oriented', 'Test a verb-first variant', 'Reword to be shorter'],
  'secondary-cta': ['Soften the rejection wording', 'Reframe as opt-out'],
  'email-input': ['Change the placeholder text', 'Add a help hint'],
  logo: ['Replace the logo', 'Try a smaller logo size'],
  image: ['Replace the image', 'Try a different visual style'],
  'image-left': ['Replace the left image', 'Try a different visual'],
  'image-right': ['Replace the right image', 'Try a different visual'],
  wheel: ['Change wheel colors', 'Try a different wheel design'],
  rating: ['Use stars instead of numbers', 'Switch to 1–10 scale'],
  'teaser-badge': ['Make the teaser more eye-catching', 'Try a different emoji', 'Test an urgency variant'],
  'thank-headline': ['Rewrite the thank-you headline', 'Add a celebratory tone'],
  'thank-subtext': ['Rewrite the supporting line', 'Add next-step guidance'],
  'thank-coupon': ['Generate a new coupon code', 'Make the code more memorable'],
  'thank-cta': ['Change the CTA text', 'Make it more inviting', 'Add a sense of urgency'],
  'thank-icon': ['Use a different success icon'],
}

const chatSuggestions = computed(() => {
  const id = selectedElement.value
  return (id && suggestionsByElement[id]) || defaultChatSuggestions
})

const chatMessage = ref('')
const toolbarChatInput = ref('') // editor toolbar chat — independent from the sidebar input

// ── AI generation flow (from prompt) ──
const generating = ref(false)
const preparing = ref(false)
const generationMessages = ref([])
const chatMessagesRef = ref(null)
const generationTimeouts = []

const showCanvasLoader = computed(() => generating.value || preparing.value)
const canvasLoaderText = computed(() => generating.value ? 'Generating your popup…' : 'Preparing your popup…')

watch(generationMessages, () => {
  nextTick(() => {
    if (chatMessagesRef.value) chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  })
}, { deep: true })

const wait = (ms) => new Promise((resolve) => {
  const t = setTimeout(resolve, ms)
  generationTimeouts.push(t)
})

const streamAi = async (text, charDelay = 18) => {
  generationMessages.value.push({ role: 'ai', text: '' })
  const idx = generationMessages.value.length - 1
  for (let i = 0; i <= text.length; i++) {
    await wait(charDelay)
    generationMessages.value[idx].text = text.slice(0, i)
  }
}

const startGeneration = async () => {
  generating.value = true
  generationMessages.value = [{ role: 'user', text: props.generationPrompt }]
  await wait(700)
  await streamAi('Got it. Analyzing your goal…')
  await wait(500)
  await streamAi('Choosing the right popup type and layout…')
  await wait(500)
  await streamAi('Applying your brand colors and writing copy…')
  await wait(500)
  await streamAi("All set! Here's your first popup. Click any element to tweak it.")
  generating.value = false
}

onMounted(() => {
  // In the Today's plan flow, open as the wide centered chat so the conversation
  // visually continues from the flow, then reveal the editor canvas after a beat
  // (the "opening the editor" message lands, then the popup canvas animates in).
  const devStep = props.embedded ? new URLSearchParams(window.location.search).get('step') : null
  if (props.embedded && devStep !== 'targeting') {
    chatExpanded.value = true
    const t = setTimeout(() => collapseChat(), 850)
    generationTimeouts.push(t)
  }
  // Seed chat history from the wizard chat flow (text bubbles + popup version cards)
  const hasHistory = props.initialChatMessages && props.initialChatMessages.length > 0
  if (hasHistory) {
    generationMessages.value = props.initialChatMessages
      .filter((m) => m.role === 'user' || m.role === 'ai' || m.role === 'popup-versions')
      .map((m) => {
        if (m.role === 'popup-versions') {
          return { role: 'popup-versions', versions: m.versions, selectedId: m.selectedId || null }
        }
        return { role: m.role, text: m.text }
      })
  }
  // Only run AI streaming if there's no history (i.e., direct entry without wizard chat)
  if (props.generationPrompt && !hasHistory) {
    startGeneration()
  } else if (props.selectLoading) {
    preparing.value = true
    const t = setTimeout(() => { preparing.value = false }, 1800)
    generationTimeouts.push(t)
  }
  // Dev affordance: ?step=targeting jumps straight to the in-chat targeting review
  if (devStep === 'targeting') nextTick(() => startPublishFlow())
})

// The editor is only reachable after registration, so chat edits apply directly
const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const sendChat = async (text, element = null) => {
  if (!text || generating.value) return
  generationMessages.value.push({ role: 'user', text, element, time: formatTime(new Date()), fromEditor: true })
  scrollChatToBottom()
  await wait(400)
  // While reviewing targeting, the chat tweaks the targeting, not the design
  if (targetingAdjust.value) {
    await streamAi("Got it — I've updated the targeting. Anything else, or shall we go live?")
    showTargetingQuestion()
    return
  }
  await streamAi('Done! I applied that to your popup.')
}

const redoMessage = (m) => {
  sendChat(m.text, m.element)
}

const handleChatSubmit = async () => {
  const text = chatMessage.value?.trim()
  if (!text) return
  chatMessage.value = ''
  // If a setting/element row is selected, attach it so the edit targets that row
  await sendChat(text, selectedElement.value ? selectedLabel.value : null)
}

const handleToolbarSubmit = async () => {
  const text = toolbarChatInput.value?.trim()
  if (!text) return
  toolbarChatInput.value = ''
  await sendChat(text, selectedElement.value ? selectedLabel.value : null)
}

const selectSuggestion = (suggestion) => {
  chatMessage.value = suggestion
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onWindowMousemove)
  window.removeEventListener('mouseup', onWindowMouseup)
  window.removeEventListener('mousemove', onChatResizeMove)
  window.removeEventListener('mouseup', stopChatResize)
  generationTimeouts.forEach((t) => clearTimeout(t))
})
</script>

<style scoped>
.whiteboard-bg {
  background-color: #F9FAFB;
  background-image:
    radial-gradient(circle, #D5D8DD 1px, transparent 1px);
  background-size: 24px 24px;
}

.checker-bg {
  background-image:
    linear-gradient(45deg, #D5D8DD 25%, transparent 25%),
    linear-gradient(-45deg, #D5D8DD 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #D5D8DD 75%),
    linear-gradient(-45deg, transparent 75%, #D5D8DD 75%);
  background-size: 6px 6px;
  background-position: 0 0, 0 3px, 3px -3px, -3px 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-step-fade-enter-active,
.modal-step-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-step-fade-enter-from,
.modal-step-fade-leave-to {
  opacity: 0;
}

@keyframes pop-in {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.pop-in {
  animation: pop-in 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.pop-in-card-enter-active,
.pop-in-card-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.pop-in-card-enter-from,
.pop-in-card-leave-to {
  transform: translateY(12px);
  opacity: 0;
}

/* Publish flow: the chat block unfolds wider / collapses back, both directions animated */
.chat-panel-tr {
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Editor canvas reveal: slides in from the right as the chat docks to the side */
.editor-reveal-enter-active {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.editor-reveal-enter-from {
  transform: translateX(24px);
  opacity: 0;
}
</style>
