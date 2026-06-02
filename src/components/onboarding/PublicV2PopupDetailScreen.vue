<template>
  <div class="h-screen-safe flex flex-col bg-white">
    <!-- Top bar -->
    <div class="shrink-0 flex items-center justify-between h-14 border-b border-om-gray-200 px-4 bg-white">
      <div class="flex items-center gap-2">
        <button
          @click="$emit('back')"
          class="w-9 h-9 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <ChevronLeft :size="20" />
        </button>
        <span class="text-sm font-semibold text-om-gray-700">{{ useCase?.title || 'Popup' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="secondary" size="sm" @click="openRegistration">Save draft</Button>
        <Button variant="primary" size="sm" @click="openRegistration">Publish</Button>
      </div>
    </div>

    <!-- Main split: chat (left) + canvas (right) -->
    <div class="flex-1 flex min-h-0 bg-om-gray-50">
      <!-- Left: Chat panel as floating card -->
      <div class="shrink-0 p-4">
        <div class="w-92 h-full bg-white rounded-2xl border border-om-gray-200 shadow-md flex flex-col min-h-0 overflow-hidden">
        <!-- Selected element context banner -->
        <transition name="fade">
          <div v-if="selectedElement" class="shrink-0 mx-3 mt-3 flex items-center gap-2 px-3 py-2 bg-om-orange-50 border border-om-orange-200 rounded-lg">
            <div class="w-1.5 h-1.5 rounded-full bg-om-orange-500 shrink-0"></div>
            <span class="text-xs text-om-orange-700">
              <span class="font-semibold">Editing:</span> {{ selectedLabel }}
            </span>
            <button
              @click="selectedElement = null; selectedRect = null; openPopover = null"
              class="ml-auto w-5 h-5 flex items-center justify-center text-om-orange-500 hover:text-om-orange-700 hover:bg-om-orange-100 rounded transition-colors cursor-pointer"
            >
              <X :size="12" />
            </button>
          </div>
        </transition>
        <!-- Chat body -->
        <div ref="chatMessagesRef" class="flex-1 min-h-0 flex flex-col p-4 gap-3 overflow-y-auto">
          <template v-if="generationMessages.length">
            <div
              v-for="(m, i) in generationMessages"
              :key="i"
              class="flex"
              :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="px-3 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap"
                :class="m.role === 'user'
                  ? 'bg-om-peach-100 text-om-gray-700 rounded-br-md'
                  : 'bg-om-gray-100 text-om-gray-700 rounded-bl-md'"
              >{{ m.text }}</div>
            </div>
          </template>
          <p v-else class="text-xs text-om-gray-500 leading-relaxed">
            Ask the AI to change the headline, colors, layout, copy or anything else on the popup.
          </p>
        </div>

        <!-- Suggestions + Chat input -->
        <div class="shrink-0 p-4 flex flex-col gap-3">
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

          <!-- Input -->
          <div class="relative">
            <textarea
              v-model="chatMessage"
              rows="3"
              @keydown.enter.exact.prevent="handleChatSubmit"
              :placeholder="generationMessages.length ? 'Chat is busy with AI…' : 'Describe your change...'"
              :disabled="generationMessages.length > 0"
              :class="[
                'w-full px-4 py-3 border border-om-gray-300 rounded-xl focus:ring-2 focus:ring-om-gray-500 focus:border-transparent transition-colors text-om-gray-700 text-sm resize-none pr-12 bg-white',
                generationMessages.length ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            ></textarea>
            <button
              @click="handleChatSubmit"
              :disabled="!chatMessage?.trim() || generationMessages.length > 0"
              :class="[
                'absolute bottom-3 right-1.5 w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                (chatMessage?.trim() && !generationMessages.length) ? 'bg-om-orange-500 text-white cursor-pointer' : 'bg-om-gray-200 text-om-gray-500 cursor-default'
              ]"
            >
              <ArrowUp :size="16" />
            </button>
          </div>
        </div>
        </div>
      </div>

      <!-- Right: Whiteboard canvas (all steps side-by-side) -->
      <div class="flex-1 flex flex-col min-w-0 whiteboard-bg relative">
        <!-- Floating style toolbar -->
        <div
          v-if="selectedElement && selectedRect"
          class="fixed z-30 bg-white rounded-lg shadow-lg border border-om-gray-200 px-1.5 py-1 flex items-center gap-1.5"
          :style="{ top: Math.max(60, selectedRect.top - 52) + 'px', left: (selectedRect.left + selectedRect.width / 2) + 'px', transform: 'translateX(-50%)' }"
          @click.stop
          @mousedown.stop
        >
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
          <div class="flex items-center gap-3 min-w-max mx-auto h-full">
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
              <div class="flex items-center justify-between" style="width: 680px;">
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
            </div>
            <!-- Add step button after each step -->
            <button
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
    </div>

    <!-- Registration Modal -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showRegistrationModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="showRegistrationModal = false"
        >
          <div class="bg-white rounded-2xl overflow-hidden max-w-4xl w-full flex shadow-2xl h-155 relative">
            <!-- Close button -->
            <button
              @click="showRegistrationModal = false"
              class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer z-10"
              aria-label="Close"
            >
              <X :size="20" />
            </button>
            <!-- Left: Form -->
            <div class="w-1/2 py-10 px-10 flex flex-col relative">
              <img src="/OM-Logo-primary-basic.svg" alt="OptiMonk" class="h-7 shrink-0 self-start mb-6" />

              <transition name="modal-step-fade" mode="out-in">
                <div :key="modalStep" class="flex-1 flex flex-col justify-center">
                  <template v-if="modalStep === 'buttons'">
                    <h2 class="text-2xl font-bold text-om-gray-700 mb-1">Create your free account</h2>
                    <p class="text-om-gray-500 mb-8">Sign up to keep editing this popup</p>

                    <div class="flex flex-col gap-3">
                      <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="modalStep = 'email-form'">
                        <Mail :size="18" /> Continue with Email
                      </button>
                      <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="completeRegistration">
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                      </button>
                      <button class="w-full h-12 px-4 rounded-xl border border-om-gray-200 bg-white text-om-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="completeRegistration">
                        <img src="/icons/shopify-logo.svg" alt="Shopify" class="w-4.5 h-4.5 object-contain" />
                        Continue with Shopify
                      </button>
                    </div>

                    <p class="text-xs text-om-gray-400 text-center mt-6">
                      By submitting this form, you agree to the
                      <a href="#" class="text-om-orange-500 hover:underline">Terms of Service</a>
                      and
                      <a href="#" class="text-om-orange-500 hover:underline">Privacy Policy</a>.
                    </p>

                    <button
                      @click="showRegistrationModal = false"
                      class="mt-4 text-xs text-om-gray-400 hover:text-om-gray-600 underline cursor-pointer text-center w-full transition-colors"
                    >
                      I don't want to register
                    </button>
                  </template>

                  <template v-else-if="modalStep === 'email-form'">
                    <h2 class="text-2xl font-bold text-om-gray-700 mb-1">Create your free account</h2>
                    <p class="text-om-gray-500 mb-6">Sign up to keep editing this popup</p>

                    <form @submit.prevent="completeRegistration" class="space-y-3">
                      <div class="flex gap-3">
                        <div class="flex-1">
                          <label class="block text-sm font-medium text-om-gray-700 mb-1.5">First name</label>
                          <input v-model="emailFormData.firstName" type="text" placeholder="John" required
                            class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                        </div>
                        <div class="flex-1">
                          <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Last name</label>
                          <input v-model="emailFormData.lastName" type="text" placeholder="Doe" required
                            class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Business email</label>
                        <input v-model="emailFormData.email" type="email" placeholder="john@company.com" required
                          class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-om-gray-700 mb-1.5">Password (8+ characters)</label>
                        <input v-model="emailFormData.password" type="password" placeholder="Enter your password" minlength="8" required
                          class="w-full px-3 py-2.5 border border-om-gray-200 rounded-xl focus:ring-2 focus:ring-om-orange-400 focus:border-transparent transition-colors text-om-gray-700 text-sm" />
                      </div>
                      <button type="submit"
                        class="w-full py-3 bg-om-orange-500 text-white font-medium rounded-xl hover:bg-om-orange-600 transition-colors cursor-pointer text-sm">
                        Get Started
                      </button>
                    </form>
                  </template>
                </div>
              </transition>

              <button v-if="modalStep !== 'buttons'" @click="modalStep = 'buttons'"
                class="flex items-center gap-1.5 text-sm text-om-gray-500 hover:text-om-gray-700 cursor-pointer mt-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
            </div>

            <!-- Right: Why join us -->
            <div class="w-1/2 bg-om-peach-50 flex flex-col px-8 py-10 overflow-y-auto">
              <h2 class="text-om-gray-700 font-bold text-2xl mb-8">Why join us?</h2>
              <ul class="space-y-3 mb-8">
                <li v-for="item in whyJoinItems" :key="item" class="flex items-center gap-3">
                  <span class="shrink-0 w-6 h-6 rounded-full bg-om-orange-500 flex items-center justify-center">
                    <Check :size="14" class="text-white" stroke-width="3" />
                  </span>
                  <span class="text-om-gray-600 text-base">{{ item }}</span>
                </li>
              </ul>
              <div class="flex items-center gap-2">
                <div class="flex">
                  <svg v-for="i in 5" :key="i" width="22" height="22" viewBox="0 0 24 24" fill="#ED5A29" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span class="text-om-gray-600 text-base">Trusted by 30,000+ businesses</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import {
  ChevronLeft, ChevronDown, ChevronUp, Mail, Check, ArrowUp, X, Copy, Plus, Type,
  Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough,
  List as ListIcon, Link2, Highlighter, MoreVertical, Trash2,
  AlignLeft, AlignCenter, AlignRight,
} from 'lucide-vue-next'
import Button from '../shared/Button.vue'

const props = defineProps({
  useCase: { type: Object, default: () => ({}) },
  generationPrompt: { type: String, default: '' },
  selectLoading: { type: Boolean, default: false },
})

const brandColor = '#E20074'

defineEmits(['back'])

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

// Toolbar actions are gated behind registration
const guarded = (apply) => {
  if (!registered.value) {
    openRegistration()
    openPopover.value = null
    return false
  }
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
  if (props.generationPrompt) {
    startGeneration()
  } else if (props.selectLoading) {
    preparing.value = true
    const t = setTimeout(() => { preparing.value = false }, 1800)
    generationTimeouts.push(t)
  }
})

// ── Registration modal (gates any chat interaction) ──
const showRegistrationModal = ref(false)
const modalStep = ref('buttons')
const emailFormData = ref({ firstName: '', lastName: '', email: '', password: '' })

const whyJoinItems = [
  'Personalized optimization strategies',
  'AI-powered conversion insights',
  'Real-time performance tracking',
  '100+ optimization solutions',
]

const openRegistration = () => {
  modalStep.value = 'buttons'
  showRegistrationModal.value = true
}

const handleChatSubmit = () => {
  if (!chatMessage.value?.trim()) return
  openRegistration()
}

const selectSuggestion = (suggestion) => {
  chatMessage.value = suggestion
}

const registered = ref(false)
const completeRegistration = () => {
  showRegistrationModal.value = false
  registered.value = true
}

const onEscKey = (e) => {
  if (e.key === 'Escape' && showRegistrationModal.value) {
    showRegistrationModal.value = false
  }
}

watch(showRegistrationModal, (open) => {
  if (open) {
    window.addEventListener('keydown', onEscKey)
  } else {
    window.removeEventListener('keydown', onEscKey)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEscKey)
  window.removeEventListener('mousemove', onWindowMousemove)
  window.removeEventListener('mouseup', onWindowMouseup)
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
</style>
