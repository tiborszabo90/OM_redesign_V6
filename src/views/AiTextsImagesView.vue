<template>
  <DashboardLayout active-menu-item="templates" :passthrough="embedded" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div @click="showGenMenu = false; showSaveMenu = false; showTextGenMenu = false; showTextSaveMenu = false">

      <!-- Preview Generation screen -->
      <div v-if="showPreview" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title + action -->
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-3">
            <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-presets')">
              <template #icon><ArrowLeft :size="16" /></template>
            </Button>
            <h1 class="text-2xl font-semibold text-om-gray-700">Preview Generation</h1>
          </div>
          <Button variant="primary" size="md" @click="emit('navigate', 'ai-texts-images-choose-products')">Choose Products</Button>
        </div>
        <p class="text-sm text-om-gray-500 mb-6 ml-11">Test your selected preset and adjust the prompt before applying to your catalogue.</p>

        <!-- Two columns -->
        <div class="grid grid-cols-[380px_1fr] gap-4 mb-4 items-stretch" style="height: 500px;">
          <!-- Left: Original Product -->
          <div class="flex flex-col min-h-0">
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Original Product</p>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col">
              <div class="aspect-square bg-om-gray-100 overflow-hidden">
                <img src="/product1.jpg" class="w-full h-full object-cover" />
              </div>
              <div class="p-4 border-t border-om-gray-100">
                <h3 class="text-sm font-semibold text-om-gray-700 mb-3">DJI Osmo Mobile 7 mobil gimbal</h3>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-om-gray-400">SKU: OM-7-SE</span>
                  <span class="text-sm font-semibold text-om-gray-700">$159.00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: AI Generated Preview -->
          <div class="flex flex-col min-h-0">
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <Wand2 :size="16" class="text-om-orange-400" />
              AI Generated Preview
            </p>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col items-center justify-center overflow-hidden flex-1 relative">
              <template v-if="!generating && !generated">
                <div class="w-14 h-14 rounded-full bg-om-orange-100 flex items-center justify-center mb-4">
                  <ImageIcon :size="22" class="text-om-orange-400" />
                </div>
                <h3 class="text-base font-semibold text-om-gray-700 mb-2">Ready to Generate</h3>
                <p class="text-sm text-om-gray-500 text-center mb-6 max-w-xs">Click generate to see how "lifestyle" looks applied to this product.</p>
                <Button variant="primary" size="md" @click="startGeneration">
                  <template #icon><Sparkles :size="14" /></template>
                  Generate Preview
                </Button>
                <div class="flex items-center gap-1.5 mt-3 text-xs text-om-gray-400">
                  <Coins :size="13" />
                  Costs 20 credits
                </div>
              </template>
              <template v-else-if="generating">
                <svg class="animate-spin w-10 h-10 text-om-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p class="text-sm text-om-gray-500">Generating preview...</p>
              </template>
              <template v-else>
                <img src="/product2.png" class="max-h-full w-auto object-contain transition-all duration-300" :class="previewPromptChanged ? 'blur-sm scale-105' : ''" />
                <Transition name="modal-fade">
                  <div v-if="previewPromptChanged" class="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button variant="primary" size="md" @click="startGeneration">
                      <template #icon><Sparkles :size="14" /></template>
                      Regenerate
                    </Button>
                  </div>
                </Transition>
              </template>
            </div>
          </div>
        </div>

        <!-- Prompt Editor -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-om-gray-700">Prompt Editor</h3>
            <div class="flex items-center gap-2">
              <Dropdown v-model="promptModel" :options="modelOptions" size="sm">
                <template #selected="{ label }"><span class="whitespace-nowrap">Model: {{ label }}</span></template>
              </Dropdown>
              <Dropdown v-model="promptRatio" :options="ratioOptions" size="sm">
                <template #selected="{ label }"><span class="whitespace-nowrap">Ratio: {{ label }}</span></template>
              </Dropdown>
            </div>
          </div>
          <textarea
            v-model="promptText"
            rows="3"
            class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
          />
          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-om-gray-400">Edit the prompt above to customize the generation. Changes will require regenerating the preview.</p>
            <Button variant="ghost" size="sm" class="shrink-0 ml-4" @click="showAdvanced = !showAdvanced">Advanced Settings</Button>
          </div>

          <!-- Advanced Settings panel -->
          <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-4">

            <!-- Page type -->
            <div class="flex items-center gap-6">
              <RadioButton v-model="pageType" value="product" label="Termékoldal" />
              <RadioButton v-model="pageType" value="popup" label="Popup/Beágyazott" />
            </div>

            <!-- Available data sources -->
            <div>
              <p class="text-xs text-om-gray-700 mb-2">Elérhető adatforrások</p>
              <div class="flex flex-wrap gap-2">
                <Tag v-for="src in dataSources" :key="src" variant="orange" class="cursor-pointer">{{ src }}</Tag>
              </div>
            </div>

            <!-- Recommender + toggles side by side -->
            <div class="grid grid-cols-4 gap-3">

              <!-- Ajánló -->
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700 shrink-0">Ajánló</span>
                <Dropdown v-model="recommender" :options="recommenderOptions" size="sm" />
              </div>

              <!-- Auto generate -->
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700">Prompt változók automatikus generálása hiányzó termékekhez</span>
                <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
              </div>

              <!-- Min description length -->
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700">Minimális leírás hossza (karakter)</span>
                <input
                  v-model="minDescLength"
                  type="number"
                  min="0"
                  class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white"
                />
              </div>

              <!-- Use product image -->
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700">Termékkép használata kontextusként</span>
                <ToggleSwitch v-model="useProductImage" class="shrink-0" />
              </div>

            </div>

          </div>
        </div>
      </div>

      <!-- Image Presets screen -->
      <div v-else-if="showImagePresets" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title -->
        <div class="flex items-center gap-3 mb-1">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-new')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <h1 class="text-2xl font-semibold text-om-gray-700">Choose a Preset</h1>
        </div>
        <p class="text-sm text-om-gray-500 mb-8 ml-11">Select a starting point for your AI generation.</p>

        <!-- Preset cards grid -->
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="preset in imagePresets"
            :key="preset.id"
            class="bg-white rounded-xl border-2 border-om-gray-200 p-5 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all duration-200 flex flex-col"
            @click="handlePresetClick(preset)"
          >
            <h2 class="text-base font-semibold text-om-gray-700 mb-2">{{ preset.name }}</h2>
            <p class="text-sm text-om-gray-500 flex-1 mb-6">{{ preset.description }}</p>
            <div class="flex items-center gap-2 flex-wrap">
              <Tag>
                <template #icon><Cpu :size="14" class="text-om-gray-400" /></template>
                {{ preset.model }}
              </Tag>
              <Tag>
                <template #icon><Maximize2 :size="14" class="text-om-gray-400" /></template>
                {{ preset.ratio }}
              </Tag>
              <Tag variant="orange" class="ml-auto">
                <template #icon><Coins :size="14" class="text-om-orange-400" /></template>
                {{ preset.credits }} credits
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Presets screen -->
      <div v-else-if="showTextPresets" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title -->
        <div class="flex items-center gap-3 mb-1">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-new')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <h1 class="text-2xl font-semibold text-om-gray-700">Choose a Text Type</h1>
        </div>
        <p class="text-sm text-om-gray-500 mb-8 ml-11">Select the type of text content you want to generate for your products.</p>

        <!-- Text type cards grid -->
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="preset in textPresets"
            :key="preset.id"
            class="bg-white rounded-xl border-2 border-om-gray-200 p-5 transition-all duration-200 flex flex-col"
            :class="preset.id === 'headline-subheadline' ? 'cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)]' : 'cursor-default'"
            @click="preset.id === 'headline-subheadline' && handleTextPresetClick(preset)"
          >
            <h2 class="text-base font-semibold text-om-gray-700 mb-2">{{ preset.name }}</h2>
            <p class="text-sm text-om-gray-500 flex-1 mb-6">{{ preset.description }}</p>
            <div class="flex items-center gap-2 flex-wrap">
              <Tag>
                <template #icon><Cpu :size="14" class="text-om-gray-400" /></template>
                {{ preset.model }}
              </Tag>
              <Tag v-if="preset.isPaired">
                <template #icon><Type :size="14" class="text-om-gray-400" /></template>
                Paired output
              </Tag>
              <Tag variant="orange" class="ml-auto">
                <template #icon><Coins :size="14" class="text-om-orange-400" /></template>
                {{ preset.credits }} credits
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New Variable screen -->
      <div v-else-if="showCreate" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title -->
        <div class="flex items-center gap-3 mb-1">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <h1 class="text-2xl font-semibold text-om-gray-700">Create New Variable</h1>
        </div>
        <p class="text-sm text-om-gray-500 mb-10 ml-11">What type of content do you want to generate?</p>

        <!-- Type cards -->
        <div class="flex gap-6 justify-center items-center min-h-[50vh]">
          <!-- AI Text -->
          <div class="group bg-white rounded-xl border-2 border-om-gray-200 p-6 w-80 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200 flex flex-col" @click="emit('navigate', 'ai-texts-images-text-presets')">
            <div class="w-10 h-10 rounded-full bg-om-orange-100 flex items-center justify-center mb-4">
              <Sparkles :size="18" class="text-om-orange-500" />
            </div>
            <h2 class="text-lg font-semibold text-om-gray-700 mb-2">AI Text</h2>
            <p class="text-sm text-om-gray-500 flex-1">Generate product descriptions, headlines, benefit lists, and other text content using AI prompts tailored to your catalogue.</p>
            <div class="flex justify-end mt-4">
              <ArrowRight :size="16" class="text-om-gray-400 group-hover:arrow-bounce" />
            </div>
          </div>

          <!-- AI Image -->
          <div
            class="group bg-white rounded-xl border-2 border-om-gray-200 p-6 w-80 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200 flex flex-col"
            @click="emit('navigate', 'ai-texts-images-presets')"
          >
            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <ImageIcon :size="18" class="text-blue-400" />
            </div>
            <h2 class="text-lg font-semibold text-om-gray-700 mb-2">AI Image</h2>
            <p class="text-sm text-om-gray-500 flex-1">Create lifestyle photos, banners, and visual content for your products using AI image generation models.</p>
            <div class="flex justify-end mt-4">
              <ArrowRight :size="16" class="text-om-gray-400 group-hover:arrow-bounce" />
            </div>
          </div>
        </div>
      </div>

      <!-- Generation screen -->
      <div v-else-if="showGeneration" class="w-full max-w-[1400px] mx-auto -mt-3">

        <!-- Success banner -->
        <Transition name="banner">
          <div v-if="showGenBanner" class="bg-white border border-om-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4 mb-5">
            <div class="w-9 h-9 rounded-full bg-[#2CC896]/15 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CC896" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p class="text-sm text-om-gray-700 whitespace-nowrap">
              <strong class="font-semibold">Your AI variable has been created.</strong>
              You can generate AI images using the <strong class="font-semibold">Generate</strong> button.
            </p>
          </div>
        </Transition>

        <!-- Title -->
        <h1 class="text-2xl font-bold text-om-gray-800 mb-4">AI lifestyle image 1</h1>

        <!-- Meta badges -->
        <div class="flex items-center gap-2 mb-5">
          <Tag>Image</Tag>
          <Tag>Gemini Nano Banana Pro</Tag>
          <Tag>16:9</Tag>
        </div>

        <!-- Tabs -->
        <div class="flex items-center border-b border-om-gray-200 mb-6">
          <button
            v-for="tab in genTabs"
            :key="tab.value"
            class="px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer"
            :class="genTab === tab.value ? 'text-om-orange-500' : 'text-om-gray-500 hover:text-om-gray-700'"
            @click="genTab = tab.value"
          >
            {{ tab.label }}
            <span v-if="genTab === tab.value" class="absolute bottom-0 left-0 right-0 h-0.5 bg-om-orange-500"></span>
          </button>
        </div>

        <!-- Selected tab content -->
        <div v-if="genTab === 'selected'">
          <!-- Sub-header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-om-gray-700">Selected Products</span>
              <span class="text-sm text-om-gray-400">{{ genProducts.length }} products selected</span>
            </div>
            <div class="flex items-center gap-2">
            <Button variant="outline" size="md" @click="emit('navigate', 'ai-texts-images-add-products')">Add more products</Button>
            <div class="relative">
              <Button variant="primary" size="md" @click.stop="showGenMenu = !showGenMenu">
                Generate
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Button>
              <div
                v-if="showGenMenu"
                class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[360px] overflow-hidden"
              >
                <button
                  v-for="opt in genMenuOptions"
                  :key="opt.count"
                  class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer"
                  :class="opt.count !== genMenuOptions[genMenuOptions.length - 1].count ? 'border-b border-om-gray-100' : ''"
                  @click="triggerGenerate"
                >
                  <span class="text-om-gray-700 text-left">Generate for {{ opt.count }} products</span>
                  <span class="flex items-center gap-1.5 text-om-gray-400 font-medium ml-8 tabular-nums whitespace-nowrap">
                    <Coins :size="13" class="text-om-gray-400" />
                    {{ opt.credits }}
                  </span>
                </button>
              </div>
            </div>
            </div>
          </div>

          <!-- Product cards -->
          <div class="flex flex-col gap-3">
            <div
              v-for="product in genProducts"
              :key="product.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
              @click="openProductModal(product)"
            >
              <!-- Left half: product thumbnail + info -->
              <div class="flex items-center gap-3 w-1/2 pr-4">
                <div class="aspect-square h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                  <img src="/product1.jpg" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-om-gray-700">{{ product.name }}</p>
                  <p class="text-xs text-om-gray-400 mt-0.5">{{ product.desc }}</p>
                </div>
              </div>

              <!-- Divider -->
              <div class="w-px bg-om-gray-100 shrink-0 self-stretch"></div>

              <!-- Right half: generated image + output info + status -->
              <div class="flex items-center gap-4 w-1/2 pl-4">
                <!-- 16:9 image preview -->
                <div
                  class="rounded-lg shrink-0 overflow-hidden"
                  style="aspect-ratio: 16/9; height: 96px;"
                  :class="product.status === 'generated' ? '' : 'border-2 border-dashed border-om-gray-200 flex items-center justify-center'"
                >
                  <img v-if="product.status === 'generated'" src="/product2.png" class="w-full h-full object-cover" />
                  <svg v-else class="w-5 h-5 text-om-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>

                <!-- Output info -->
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-0.5">Output</p>
                  <p v-if="product.status === 'generated'" class="text-sm text-om-gray-600">16:9 Image</p>
                  <p v-else class="text-sm text-om-gray-400">Pending generation</p>
                </div>

                <!-- Status badge -->
                <Tag v-if="product.status === 'generated'" variant="green" class="shrink-0">
                  <template #icon><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M8 12l3 3 5-5" /></svg></template>
                  Ready to use
                </Tag>
                <Tag v-else-if="product.status === 'generating'" variant="orange" class="shrink-0">
                  <template #icon><svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></template>
                  Generating
                </Tag>
                <Tag v-else variant="gray-muted" class="shrink-0">
                  <template #icon><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><path stroke-linecap="round" d="M12 6v6l4 2" /></svg></template>
                  Queued
                </Tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Generated tab content -->
        <div v-else-if="genTab === 'generated'">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-om-gray-700">Generated Products</span>
              <span class="text-sm text-om-gray-400">{{ genProducts.filter(p => p.status === 'generated').length }} products</span>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="product in genProducts.filter(p => p.status === 'generated')"
              :key="product.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
              @click="openProductModal(product)"
            >
              <!-- Left half: product thumbnail + info -->
              <div class="flex items-center gap-3 w-1/2 pr-4">
                <div class="aspect-square h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                  <img src="/product1.jpg" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-om-gray-700">{{ product.name }}</p>
                  <p class="text-xs text-om-gray-400 mt-0.5">{{ product.desc }}</p>
                </div>
              </div>

              <!-- Divider -->
              <div class="w-px bg-om-gray-100 shrink-0 self-stretch"></div>

              <!-- Right half: generated image + output info + status -->
              <div class="flex items-center gap-4 w-1/2 pl-4">
                <div class="rounded-lg shrink-0 overflow-hidden" style="aspect-ratio: 16/9; height: 96px;">
                  <img src="/product2.png" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-0.5">Output</p>
                  <p class="text-sm text-om-gray-600">16:9 Image</p>
                </div>
                <Tag variant="green" class="shrink-0">
                  <template #icon><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg></template>
                  Ready to use
                </Tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings tab content -->
        <div v-else-if="genTab === 'settings'">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold text-om-gray-700">Edit prompt</h2>
            <div class="relative">
              <Button variant="primary" size="md" @click.stop="showSaveMenu = !showSaveMenu">
                Save
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Button>
              <div
                v-if="showSaveMenu"
                class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[260px] overflow-hidden"
              >
                <button
                  class="w-full flex items-center px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer border-b border-om-gray-100"
                  @click="showSaveMenu = false"
                >Save as new</button>
                <button
                  class="w-full flex items-center px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  @click="showSaveMenu = false"
                >Save &amp; regenerate 1 product</button>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm text-om-gray-500 mr-[50px]">Edit the prompt to customize the generation output. Save it as a new variable, or overwrite the already generated images with the updated settings.</p>
              <div class="flex items-center gap-2 shrink-0">
                <Dropdown v-model="promptModel" :options="modelOptions" size="sm">
                  <template #selected="{ label }"><span class="whitespace-nowrap">Model: {{ label }}</span></template>
                </Dropdown>
                <Dropdown v-model="promptRatio" :options="ratioOptions" size="sm">
                  <template #selected="{ label }"><span class="whitespace-nowrap">Ratio: {{ label }}</span></template>
                </Dropdown>
              </div>
            </div>
            <textarea
              v-model="promptText"
              rows="3"
              class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
            />
            <div class="flex justify-end mt-2">
              <Button variant="ghost" size="sm" @click="showAdvanced = !showAdvanced">Advanced Settings</Button>
            </div>

            <!-- Advanced Settings panel -->
            <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-4">
              <!-- Page type -->
              <div class="flex items-center gap-6">
                <RadioButton v-model="pageType" value="product" label="Termékoldal" />
                <RadioButton v-model="pageType" value="popup" label="Popup/Beágyazott" />
              </div>

              <!-- Available data sources -->
              <div>
                <p class="text-xs text-om-gray-700 mb-2">Elérhető adatforrások</p>
                <div class="flex flex-wrap gap-2">
                  <Tag v-for="src in dataSources" :key="src" variant="orange" class="cursor-pointer">{{ src }}</Tag>
                </div>
              </div>

              <!-- Recommender + toggles side by side -->
              <div class="grid grid-cols-4 gap-3">
                <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <span class="text-xs text-om-gray-700 shrink-0">Ajánló</span>
                  <Dropdown v-model="recommender" :options="recommenderOptions" size="sm" />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <span class="text-xs text-om-gray-700">Prompt változók automatikus generálása hiányzó termékekhez</span>
                  <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <span class="text-xs text-om-gray-700">Minimális leírás hossza (karakter)</span>
                  <input
                    v-model="minDescLength"
                    type="number"
                    min="0"
                    class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white"
                  />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <span class="text-xs text-om-gray-700">Termékkép használata kontextusként</span>
                  <ToggleSwitch v-model="useProductImage" class="shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Product Generation Modal -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div
            v-if="showProductModal && selectedProduct"
            class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
            @click.self="showProductModal = false"
          >
            <div class="bg-om-gray-50 rounded-2xl w-full max-w-[1200px] max-h-[88vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
              <!-- Modal header -->
              <div class="flex items-center justify-between px-6 pt-6 pb-4">
                <div>
                  <h2 class="text-xl font-bold text-om-gray-800">{{ selectedProduct.name }}</h2>
                </div>
                <button
                  class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-om-gray-100 transition-colors text-om-gray-400 hover:text-om-gray-600"
                  @click="showProductModal = false"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="px-6 pb-6">
                <!-- Two columns -->
                <div class="grid grid-cols-[340px_1fr] gap-4 mb-4 items-stretch" style="height: 440px;">
                  <!-- Left: Original Product -->
                  <div class="flex flex-col min-h-0">
                    <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Original Product</p>
                    <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col">
                      <div class="aspect-square bg-om-gray-100 overflow-hidden">
                        <img src="/product1.jpg" class="w-full h-full object-cover" />
                      </div>
                      <div class="p-4 border-t border-om-gray-100">
                        <h3 class="text-sm font-semibold text-om-gray-700 mb-3">{{ selectedProduct.name }}</h3>
                        <div class="flex items-center justify-between">
                          <span class="text-xs text-om-gray-400">SKU: OM-7-SE</span>
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
                      <template v-if="selectedProduct.status === 'generated'">
                        <img src="/product2.png" class="w-full h-full object-contain transition-all duration-300" :class="promptChanged ? 'blur-sm scale-105' : ''" />
                        <Transition name="modal-fade">
                          <div v-if="promptChanged" class="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Button variant="primary" size="md" @click="regenerateProduct">
                              <template #icon><Sparkles :size="14" /></template>
                              Regenerate
                            </Button>
                          </div>
                        </Transition>
                      </template>
                      <template v-else-if="selectedProduct.status === 'generating'">
                        <div class="w-full h-full flex flex-col items-center justify-center gap-3">
                          <svg class="animate-spin w-10 h-10 text-om-orange-500" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <p class="text-sm text-om-gray-500">Generating...</p>
                        </div>
                      </template>
                      <template v-else>
                        <div class="w-full h-full flex flex-col items-center justify-center gap-2">
                          <svg class="w-8 h-8 text-om-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
                    <div class="flex items-center gap-2">
                      <Tag>Model: {{ promptModel }}</Tag>
                      <Tag>Ratio: {{ promptRatio }}</Tag>
                    </div>
                  </div>
                  <textarea
                    v-model="promptText"
                    rows="3"
                    class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
                  />
                  <!-- Advanced Settings panel -->
                  <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-4">
                    <div class="flex items-center gap-6">
                      <RadioButton v-model="pageType" value="product" label="Termékoldal" />
                      <RadioButton v-model="pageType" value="popup" label="Popup/Beágyazott" />
                    </div>
                    <div>
                      <p class="text-xs text-om-gray-700 mb-2">Elérhető adatforrások</p>
                      <div class="flex flex-wrap gap-2">
                        <Tag v-for="src in dataSources" :key="src" variant="orange" class="cursor-pointer">{{ src }}</Tag>
                      </div>
                    </div>
                    <div class="grid grid-cols-4 gap-3">
                      <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <span class="text-xs text-om-gray-700 shrink-0">Ajánló</span>
                        <Dropdown v-model="recommender" :options="recommenderOptions" size="sm" />
                      </div>
                      <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <span class="text-xs text-om-gray-700">Prompt változók automatikus generálása hiányzó termékekhez</span>
                        <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
                      </div>
                      <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <span class="text-xs text-om-gray-700">Minimális leírás hossza (karakter)</span>
                        <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white" />
                      </div>
                      <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                        <span class="text-xs text-om-gray-700">Termékkép használata kontextusként</span>
                        <ToggleSwitch v-model="useProductImage" class="shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-end mt-3">
                    <Button variant="ghost" size="sm" @click="showAdvanced = !showAdvanced">Advanced Settings</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      </div>

      <!-- Text Preview screen -->
      <div v-else-if="showTextPreview" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title + action -->
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-3">
            <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-text-presets')">
              <template #icon><ArrowLeft :size="16" /></template>
            </Button>
            <h1 class="text-2xl font-semibold text-om-gray-700">Preview Generation</h1>
          </div>
          <Button variant="primary" size="md" @click="() => { cpFromText = true; emit('navigate', 'ai-texts-images-choose-products') }">Choose Products</Button>
        </div>
        <p class="text-sm text-om-gray-500 mb-6 ml-11">Test your selected text type and adjust the prompt before applying to your catalogue.</p>

        <!-- Two columns -->
        <div class="grid grid-cols-[240px_1fr] gap-4 mb-4 items-stretch" style="height: 360px;">
          <!-- Left: Original Product -->
          <div class="flex flex-col h-full min-h-0">
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Product</p>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col min-h-0">
              <div class="flex-1 overflow-hidden min-h-0">
                <img src="/product1.jpg" class="w-full h-full object-cover" />
              </div>
              <div class="p-4 border-t border-om-gray-100">
                <h3 class="text-sm font-semibold text-om-gray-700 mb-3">DJI Osmo Mobile 7 mobil gimbal</h3>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-om-gray-400">SKU: OM-7-SE</span>
                  <span class="text-sm font-semibold text-om-gray-700">$159.00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: AI Generated Text Preview -->
          <div class="flex flex-col min-h-0">
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3 flex items-center gap-1.5">
              <Wand2 :size="16" class="text-om-orange-400" />
              AI Generated Preview
            </p>
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] flex flex-col overflow-hidden flex-1 relative">
              <!-- Not generated -->
              <template v-if="!textGenerating && !textGenerated">
                <div class="flex-1 flex flex-col items-center justify-center p-6">
                  <div class="w-14 h-14 rounded-full bg-om-orange-100 flex items-center justify-center mb-4">
                    <Sparkles :size="22" class="text-om-orange-400" />
                  </div>
                  <h3 class="text-base font-semibold text-om-gray-700 mb-2">Ready to Generate</h3>
                  <p class="text-sm text-om-gray-500 text-center mb-6 max-w-xs">Click generate to see how "{{ selectedTextPreset?.name }}" looks applied to this product.</p>
                  <Button variant="primary" size="md" @click="startTextGeneration">
                    <template #icon><Sparkles :size="14" /></template>
                    Generate Preview
                  </Button>
                  <div class="flex items-center gap-1.5 mt-3 text-xs text-om-gray-400">
                    <Coins :size="13" />
                    Costs {{ selectedTextPreset?.credits ?? 1 }} credits
                  </div>
                </div>
              </template>
              <!-- Generating -->
              <template v-else-if="textGenerating">
                <div class="flex-1 flex flex-col items-center justify-center gap-3">
                  <svg class="animate-spin w-10 h-10 text-om-orange-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p class="text-sm text-om-gray-500">Generating preview...</p>
                </div>
              </template>
              <!-- Generated -->
              <template v-else>
                <div class="flex-1 p-6 overflow-y-auto transition-all duration-300" :class="textPreviewPromptChanged ? 'blur-sm' : ''">
                  <!-- Headline + Subheadline paired -->
                  <template v-if="selectedTextPreset?.isPaired">
                    <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-2">Headline</p>
                    <p class="text-lg font-bold text-om-gray-800 mb-5">Crystal Clear Sound, Zero Distractions</p>
                    <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-2">Subheadline</p>
                    <p class="text-base text-om-gray-600">Industry-leading noise cancellation meets 30-hour playtime — for listeners who demand the best.</p>
                  </template>
                  <!-- Single text output -->
                  <template v-else-if="selectedTextPreset?.id === 'benefit-list'">
                    <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Generated Benefit List</p>
                    <ul class="space-y-2 text-sm text-om-gray-700">
                      <li class="flex items-start gap-2"><span class="text-om-orange-500 mt-0.5">•</span>30-hour battery life for all-day listening</li>
                      <li class="flex items-start gap-2"><span class="text-om-orange-500 mt-0.5">•</span>Active noise cancellation blocks out distractions</li>
                      <li class="flex items-start gap-2"><span class="text-om-orange-500 mt-0.5">•</span>Premium 40mm drivers deliver rich, detailed sound</li>
                      <li class="flex items-start gap-2"><span class="text-om-orange-500 mt-0.5">•</span>Foldable design for easy storage and travel</li>
                      <li class="flex items-start gap-2"><span class="text-om-orange-500 mt-0.5">•</span>Multi-device pairing for seamless connectivity</li>
                    </ul>
                  </template>
                  <template v-else-if="selectedTextPreset?.id === 'usp'">
                    <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Generated USP</p>
                    <p class="text-base text-om-gray-700 leading-relaxed">The only headphones that adapt to your listening environment in real time — combining 30-hour battery life with industry-leading active noise cancellation at a price that doesn't compromise on quality.</p>
                  </template>
                  <template v-else>
                    <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-3">Generated Text</p>
                    <p class="text-sm text-om-gray-700 leading-relaxed">Experience premium audio like never before. These wireless headphones deliver exceptional sound quality with deep bass and crystal-clear highs, while the advanced noise cancellation technology ensures you stay focused no matter where you are. With up to 30 hours of battery life and a comfortable, foldable design, they're the perfect companion for work, travel, and everything in between.</p>
                  </template>
                </div>
                <!-- Regenerate overlay -->
                <Transition name="modal-fade">
                  <div v-if="textPreviewPromptChanged" class="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button variant="primary" size="md" @click="startTextGeneration">
                      <template #icon><Sparkles :size="14" /></template>
                      Regenerate
                    </Button>
                  </div>
                </Transition>
              </template>
            </div>
          </div>
        </div>

        <!-- Prompt Editor -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-om-gray-700">Prompt Editor</h3>
            <div class="flex items-center gap-2">
              <Dropdown v-model="promptModel" :options="modelOptions" size="sm">
                <template #selected="{ label }"><span class="whitespace-nowrap">Model: {{ label }}</span></template>
              </Dropdown>
            </div>
          </div>
          <textarea
            v-model="textPromptText"
            rows="3"
            class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
          />
          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-om-gray-400">Edit the prompt above to customize the generation. Changes will require regenerating the preview.</p>
            <Button variant="ghost" size="sm" class="shrink-0 ml-4" @click="showAdvanced = !showAdvanced">Advanced Settings</Button>
          </div>
          <!-- Advanced Settings panel -->
          <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-4">
            <div class="flex items-center gap-6">
              <RadioButton v-model="pageType" value="product" label="Termékoldal" />
              <RadioButton v-model="pageType" value="popup" label="Popup/Beágyazott" />
            </div>
            <div>
              <p class="text-xs text-om-gray-700 mb-2">Elérhető adatforrások</p>
              <div class="flex flex-wrap gap-2">
                <Tag v-for="src in dataSources" :key="src" variant="orange" class="cursor-pointer">{{ src }}</Tag>
              </div>
            </div>
            <div class="grid grid-cols-4 gap-3">
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700 shrink-0">Ajánló</span>
                <Dropdown v-model="recommender" :options="recommenderOptions" size="sm" />
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700">Prompt változók automatikus generálása hiányzó termékekhez</span>
                <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700">Minimális leírás hossza (karakter)</span>
                <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white" />
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span class="text-xs text-om-gray-700">Termékkép használata kontextusként</span>
                <ToggleSwitch v-model="useProductImage" class="shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Generation screen -->
      <div v-else-if="showTextGeneration" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title -->
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center gap-3">
            <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-text-presets')">
              <template #icon><ArrowLeft :size="16" /></template>
            </Button>
            <h1 class="text-2xl font-semibold text-om-gray-700">{{ selectedTextPreset?.name ?? 'Text Generation' }}</h1>
          </div>
        </div>
        <p class="text-sm text-om-gray-500 mb-6 ml-11">Generate AI text for your selected products using the chosen template.</p>

        <!-- Tabs -->
        <div class="flex items-center border-b border-om-gray-200 mb-6">
          <button
            v-for="tab in textGenTabs"
            :key="tab.value"
            class="px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer"
            :class="textGenTab === tab.value ? 'text-om-orange-500' : 'text-om-gray-500 hover:text-om-gray-700'"
            @click="textGenTab = tab.value"
          >
            {{ tab.label }}
            <span v-if="textGenTab === tab.value" class="absolute bottom-0 left-0 right-0 h-0.5 bg-om-orange-500"></span>
          </button>
        </div>

        <!-- Selected tab -->
        <div v-if="textGenTab === 'selected'">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-om-gray-700">Selected Products</span>
              <span class="text-sm text-om-gray-400">{{ textGenProducts.length }} products selected</span>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="md">Add more products</Button>
              <div class="relative">
                <Button variant="primary" size="md" @click.stop="showTextGenMenu = !showTextGenMenu">
                  Generate
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </Button>
                <div v-if="showTextGenMenu" class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[360px] overflow-hidden">
                  <button
                    v-for="opt in textGenMenuOptions"
                    :key="opt.count"
                    class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer"
                    :class="opt.count !== textGenMenuOptions[textGenMenuOptions.length - 1].count ? 'border-b border-om-gray-100' : ''"
                    @click="triggerTextGenerate"
                  >
                    <span class="text-om-gray-700 text-left">Generate for {{ opt.count }} products</span>
                    <span class="flex items-center gap-1.5 text-om-gray-400 font-medium ml-8 tabular-nums whitespace-nowrap">
                      <Coins :size="13" class="text-om-gray-400" />
                      {{ opt.credits }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="product in textGenProducts"
              :key="product.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
              <!-- Left: product info -->
              <div class="flex items-center gap-3 w-1/2 pr-4">
                <div class="aspect-square h-16 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                  <img src="/product1.jpg" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-om-gray-700">{{ product.name }}</p>
                  <p class="text-xs text-om-gray-400 mt-0.5">{{ product.desc }}</p>
                </div>
              </div>

              <!-- Divider -->
              <div class="w-px bg-om-gray-100 shrink-0 self-stretch"></div>

              <!-- Right: generated text -->
              <div class="flex items-center gap-4 w-1/2 pl-4">
                <div class="flex-1 min-w-0">
                  <template v-if="product.status === 'generated' && product.text">
                    <template v-if="selectedTextPreset?.isPaired">
                      <p class="text-sm font-semibold text-om-gray-700 truncate">{{ product.text.headline }}</p>
                      <p class="text-xs text-om-gray-500 mt-0.5 truncate">{{ product.text.sub }}</p>
                    </template>
                    <template v-else>
                      <p class="text-xs text-om-gray-600 line-clamp-3 whitespace-pre-line">{{ product.text.body }}</p>
                    </template>
                  </template>
                  <p v-else class="text-sm text-om-gray-400">Pending generation</p>
                </div>
                <Tag v-if="product.status === 'generated'" variant="green" class="shrink-0">
                  <template #icon><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 12l3 3 5-5"/></svg></template>
                  Ready to use
                </Tag>
                <Tag v-else-if="product.status === 'generating'" variant="orange" class="shrink-0">
                  <template #icon><svg class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></template>
                  Generating
                </Tag>
                <Tag v-else variant="gray-muted" class="shrink-0">
                  <template #icon><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 6v6l4 2"/></svg></template>
                  Queued
                </Tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Generated tab -->
        <div v-else-if="textGenTab === 'generated'">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-om-gray-700">Generated Products</span>
              <span class="text-sm text-om-gray-400">{{ textGenProducts.filter(p => p.status === 'generated').length }} products</span>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <div
              v-for="product in textGenProducts.filter(p => p.status === 'generated')"
              :key="product.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0"
            >
              <div class="flex items-center gap-3 w-1/2 pr-4">
                <div class="aspect-square h-16 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
                  <img src="/product1.jpg" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-om-gray-700">{{ product.name }}</p>
                  <p class="text-xs text-om-gray-400 mt-0.5">{{ product.desc }}</p>
                </div>
              </div>
              <div class="w-px bg-om-gray-100 shrink-0 self-stretch"></div>
              <div class="flex items-center gap-4 w-1/2 pl-4">
                <div class="flex-1 min-w-0">
                  <template v-if="selectedTextPreset?.isPaired">
                    <p class="text-sm font-semibold text-om-gray-700 truncate">{{ product.text.headline }}</p>
                    <p class="text-xs text-om-gray-500 mt-0.5 truncate">{{ product.text.sub }}</p>
                  </template>
                  <template v-else>
                    <p class="text-xs text-om-gray-600 line-clamp-3 whitespace-pre-line">{{ product.text.body }}</p>
                  </template>
                </div>
                <Tag variant="green" class="shrink-0">
                  <template #icon><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></template>
                  Ready to use
                </Tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings tab -->
        <div v-else-if="textGenTab === 'settings'">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold text-om-gray-700">Edit prompt</h2>
            <div class="relative">
              <Button variant="primary" size="md" @click.stop="showTextSaveMenu = !showTextSaveMenu">
                Save
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Button>
              <div v-if="showTextSaveMenu" class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[260px] overflow-hidden">
                <button class="w-full flex items-center px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer border-b border-om-gray-100" @click="showTextSaveMenu = false">Save as new</button>
                <button class="w-full flex items-center px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="showTextSaveMenu = false">Save &amp; regenerate 1 product</button>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm text-om-gray-500">Edit the prompt to customize the text generation output. Save it as a new variable, or overwrite the already generated texts with the updated settings.</p>
              <div class="w-44 shrink-0">
                <Dropdown v-model="promptModel" :options="modelOptions" size="sm">
                  <template #selected="{ label }"><span class="whitespace-nowrap">Model: {{ label }}</span></template>
                </Dropdown>
              </div>
            </div>
            <textarea
              v-model="promptText"
              rows="4"
              class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
              placeholder="Write a benefit list for the following product: {product_name}. Focus on {product_description}."
            />
            <div class="flex justify-end mt-2">
              <Button variant="ghost" size="sm">Advanced Settings</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Choose Products screen -->
      <div v-else-if="showChooseProducts" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title + action -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', cpFromText ? 'ai-texts-images-text-preview' : 'ai-texts-images-preview')">
              <template #icon><ArrowLeft :size="16" /></template>
            </Button>
            <h1 class="text-2xl font-semibold text-om-gray-700">Choose Products</h1>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-om-gray-400">{{ cpSelected.length }} products selected</span>
            <Button variant="primary" size="md" @click="emit('navigate', cpFromText ? 'ai-texts-images-text-generation' : 'ai-texts-images-generation')">Generation Preview</Button>
          </div>
        </div>


        <!-- Filters -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-400" />
              <input v-model="cpSearch" type="text" placeholder="Search products..." class="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 w-44" />
            </div>
            <div class="relative">
              <Button variant="secondary" size="sm" @click="cpShowFilters = !cpShowFilters">
                <template #icon><SlidersHorizontal :size="15" /></template>
                Filters
                <span v-if="cpActiveFilterCount > 0" class="ml-0.5 bg-om-orange-500 text-white text-[10px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">{{ cpActiveFilterCount }}</span>
              </Button>
              <div v-if="cpShowFilters" class="absolute top-full left-0 mt-2 bg-white border border-om-gray-200 rounded-xl shadow-lg p-4 z-20 flex flex-col gap-4 w-80">
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-om-gray-500">Category is</span>
                  <Dropdown v-model="cpCategoryIs" :options="cpCategoryOptions" size="sm" />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-om-gray-500">Category is not</span>
                  <Dropdown v-model="cpCategoryIsNot" :options="cpCategoryOptions" size="sm" />
                </div>
                <div class="flex flex-col gap-5">
                  <Checkbox v-model="cpOnlyInStock" label="Only in stock" />
                  <Checkbox v-model="cpOnlyWithTraffic" label="Only products with traffic" />
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <template #icon><Upload :size="15" /></template>
              Import CSV
            </Button>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <template #icon><ArrowUpDown :size="15" /></template>
              Sort by name
            </Button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden">
          <!-- Table header -->
          <div class="grid grid-cols-[48px_1fr_160px_120px_160px_140px_40px] px-6 h-10 items-center border-b border-[#e3e5e8]">
            <div class="flex items-center">
              <Checkbox :model-value="cpAllSelected" @update:model-value="toggleAllCp" />
            </div>
            <span class="text-[13px] font-normal text-om-gray-500">Product</span>
            <span class="text-[13px] font-normal text-om-gray-500">SKU</span>
            <span class="text-[13px] font-normal text-om-gray-500">Price</span>
            <span class="text-[13px] font-normal text-om-gray-500">Popularity</span>
            <span class="text-[13px] font-normal text-om-gray-500">Last Updated</span>
            <span></span>
          </div>

          <!-- Rows -->
          <div
            v-for="(product, index) in cpProducts"
            :key="product.id"
            class="grid grid-cols-[48px_1fr_160px_120px_160px_140px_40px] px-6 py-2.5 items-center cursor-pointer hover:bg-om-gray-50 transition-colors"
            :class="index < cpProducts.length - 1 ? 'border-b border-om-gray-100' : ''"
            @click="cpSelected.includes(product.id) ? cpSelected.splice(cpSelected.indexOf(product.id), 1) : cpSelected.push(product.id)"
          >
            <div class="flex items-center" @click.stop>
              <Checkbox :model-value="cpSelected.includes(product.id)" @update:model-value="v => v ? cpSelected.push(product.id) : cpSelected.splice(cpSelected.indexOf(product.id), 1)" />
            </div>
            <div class="flex items-center gap-3 pr-4">
              <div class="w-10 h-10 rounded-lg bg-om-gray-100 shrink-0 overflow-hidden">
                <img src="/product1.jpg" class="w-full h-full object-cover" />
              </div>
              <span class="text-sm font-medium text-om-gray-700">{{ product.name }}</span>
            </div>
            <span class="text-sm text-om-gray-500">{{ product.sku }}</span>
            <span class="text-sm font-semibold text-om-gray-700">{{ product.price }}</span>
            <span class="text-sm text-om-gray-500">{{ product.popularity }}</span>
            <span class="text-sm text-om-gray-500">{{ product.lastUpdated }}</span>
            <button class="text-om-gray-500 hover:text-om-gray-700 transition-colors">
              <ExternalLink :size="15" />
            </button>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-6 py-4 border-t border-om-gray-100">
            <span class="text-sm text-om-gray-400">Showing 1 to 25 of 1,356 entries</span>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm">Previous</Button>
              <Button variant="ghost" size="sm" :active="true">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
              <span class="px-2 text-sm text-om-gray-400">...</span>
              <Button variant="ghost" size="sm">{{ cpTotalPages }}</Button>
              <Button variant="ghost" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Products screen (from generation page) -->
      <div v-else-if="showAddProducts" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + title + Done -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-generation')">
              <template #icon><ArrowLeft :size="16" /></template>
            </Button>
            <h1 class="text-2xl font-semibold text-om-gray-700">Add Products</h1>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-om-gray-400">{{ cpSelected.length }} products selected</span>
            <Button variant="primary" size="md" @click="emit('navigate', 'ai-texts-images-generation')">Select products</Button>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-400" />
              <input v-model="cpSearch" type="text" placeholder="Search products..." class="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 w-44" />
            </div>
            <div class="relative">
              <Button variant="secondary" size="sm" @click="cpShowFilters = !cpShowFilters">
                <template #icon><SlidersHorizontal :size="15" /></template>
                Filters
                <span v-if="cpActiveFilterCount > 0" class="ml-0.5 bg-om-orange-500 text-white text-[10px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">{{ cpActiveFilterCount }}</span>
              </Button>
              <div v-if="cpShowFilters" class="absolute top-full left-0 mt-2 bg-white border border-om-gray-200 rounded-xl shadow-lg p-4 z-20 flex flex-col gap-4 w-80">
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-om-gray-500">Category is</span>
                  <Dropdown v-model="cpCategoryIs" :options="cpCategoryOptions" size="sm" />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-om-gray-500">Category is not</span>
                  <Dropdown v-model="cpCategoryIsNot" :options="cpCategoryOptions" size="sm" />
                </div>
                <div class="flex flex-col gap-5">
                  <Checkbox v-model="cpOnlyInStock" label="Only in stock" />
                  <Checkbox v-model="cpOnlyWithTraffic" label="Only products with traffic" />
                </div>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <template #icon><Upload :size="15" /></template>
              Import CSV
            </Button>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <template #icon><ArrowUpDown :size="15" /></template>
              Sort by name
            </Button>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="grid grid-cols-[48px_1fr_160px_120px_160px_140px_40px] px-6 h-10 items-center border-b border-[#e3e5e8]">
            <div class="flex items-center">
              <Checkbox :model-value="cpAllSelected" @update:model-value="toggleAllCp" />
            </div>
            <span class="text-[13px] font-normal text-om-gray-500">Product</span>
            <span class="text-[13px] font-normal text-om-gray-500">SKU</span>
            <span class="text-[13px] font-normal text-om-gray-500">Price</span>
            <span class="text-[13px] font-normal text-om-gray-500">Popularity</span>
            <span class="text-[13px] font-normal text-om-gray-500">Last Updated</span>
            <span></span>
          </div>

          <div
            v-for="(product, index) in cpProducts"
            :key="product.id"
            class="grid grid-cols-[48px_1fr_160px_120px_160px_140px_40px] px-6 py-2.5 items-center cursor-pointer hover:bg-om-gray-50 transition-colors"
            :class="index < cpProducts.length - 1 ? 'border-b border-om-gray-100' : ''"
            @click="cpSelected.includes(product.id) ? cpSelected.splice(cpSelected.indexOf(product.id), 1) : cpSelected.push(product.id)"
          >
            <div class="flex items-center" @click.stop>
              <Checkbox :model-value="cpSelected.includes(product.id)" @update:model-value="v => v ? cpSelected.push(product.id) : cpSelected.splice(cpSelected.indexOf(product.id), 1)" />
            </div>
            <div class="flex items-center gap-3 pr-4">
              <div class="w-10 h-10 rounded-lg bg-om-gray-100 shrink-0 overflow-hidden">
                <img src="/product1.jpg" class="w-full h-full object-cover" />
              </div>
              <span class="text-sm font-medium text-om-gray-700">{{ product.name }}</span>
            </div>
            <span class="text-sm text-om-gray-500">{{ product.sku }}</span>
            <span class="text-sm font-semibold text-om-gray-700">{{ product.price }}</span>
            <span class="text-sm text-om-gray-500">{{ product.popularity }}</span>
            <span class="text-sm text-om-gray-500">{{ product.lastUpdated }}</span>
            <button class="text-om-gray-500 hover:text-om-gray-700 transition-colors">
              <ExternalLink :size="15" />
            </button>
          </div>

          <div class="flex items-center justify-between px-6 py-4 border-t border-om-gray-100">
            <span class="text-sm text-om-gray-400">Showing 1 to 25 of 1,356 entries</span>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm">Previous</Button>
              <Button variant="ghost" size="sm" :active="true">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
              <span class="px-2 text-sm text-om-gray-400">...</span>
              <Button variant="ghost" size="sm">{{ cpTotalPages }}</Button>
              <Button variant="ghost" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- List screen -->
      <div v-else class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-2xl font-semibold text-om-gray-700">AI Texts &amp; Images</h1>
          <Button variant="primary" size="md" @click="emit('navigate', 'ai-texts-images-new')">New Variable</Button>
        </div>

        <!-- Filters + Search -->
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <Dropdown v-model="selectedDomain" :options="domains" class="w-55">
              <template #icon>
                <div class="w-6 h-6 rounded-full overflow-hidden">
                  <img src="/demos/telekom/logo.png" alt="Domain" class="w-full h-full object-cover" />
                </div>
              </template>
            </Dropdown>
            <div class="flex items-center gap-2">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
                :class="activeTab === tab.value
                  ? 'bg-om-gray-200 text-om-gray-700'
                  : 'bg-transparent text-om-gray-500 hover:bg-om-gray-100'"
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="relative">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-400" />
            <input
              v-model="search"
              type="text"
              placeholder="Search variables..."
              class="pl-9 pr-4 py-2 text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 w-56"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] overflow-hidden">
          <div class="grid grid-cols-[1fr_140px_160px_180px_160px] px-6 h-10 items-center border-b border-[#e3e5e8]">
            <span class="text-[13px] font-normal text-om-gray-500">Variable</span>
            <span class="text-[13px] font-normal text-om-gray-500">Type</span>
            <span class="text-[13px] font-normal text-om-gray-500">Generated</span>
            <span class="text-[13px] font-normal text-om-gray-500">Status</span>
            <span class="text-[13px] font-normal text-om-gray-500">Last Updated</span>
          </div>

          <div
            v-for="(item, index) in filteredItems"
            :key="item.id"
            class="grid grid-cols-[1fr_140px_160px_180px_160px] px-6 py-4 items-center cursor-pointer hover:bg-om-gray-50 transition-colors duration-150"
            :class="index < filteredItems.length - 1 ? 'border-b border-om-gray-100' : ''"
            @click="item.id === 0 ? emit('navigate', 'ai-texts-images-generation') : item.id === 8 ? (selectedTextPreset = textPresets.find(p => p.id === 'headline-subheadline'), emit('navigate', 'ai-texts-images-text-generation')) : null"
          >
            <span class="text-sm font-medium text-om-orange-500 truncate pr-4">{{ item.name }}</span>
            <Tag variant="outlined">{{ item.type }}</Tag>
            <span class="text-sm font-semibold text-om-gray-700">{{ item.generated }}</span>
            <Tag :variant="statusVariant(item.status)">{{ item.status }}</Tag>
            <span class="text-sm text-om-gray-400">{{ item.lastUpdated }}</span>
          </div>

          <div v-if="filteredItems.length === 0" class="py-16 text-center text-sm text-om-gray-400">
            No variables found.
          </div>
        </div>
      </div>

      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, ArrowLeft, ArrowRight, Sparkles, Image as ImageIcon, Cpu, Maximize2, Coins, Wand2, ExternalLink, Type, ArrowUpDown, SlidersHorizontal, Upload } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import RadioButton from '../components/shared/RadioButton.vue'
import Tag from '../components/shared/Tag.vue'

const props = defineProps({
  screen: { type: String, default: 'list' },
  embedded: { type: Boolean, default: false },
})
const emit = defineEmits(['menu-click', 'navigate'])

const showCreate = ref(props.screen === 'new')
const showImagePresets = ref(props.screen === 'image-presets')
const showPreview = ref(props.screen === 'image-preview')
const showChooseProducts = ref(props.screen === 'choose-products')
const showGeneration = ref(props.screen === 'generation')
const showAddProducts = ref(props.screen === 'add-products')
const showTextPresets = ref(props.screen === 'text-presets')
const showTextPreview = ref(props.screen === 'text-preview')
const showTextGeneration = ref(props.screen === 'text-generation')

watch(() => props.screen, (s) => {
  showCreate.value = s === 'new'
  showImagePresets.value = s === 'image-presets'
  showPreview.value = s === 'image-preview'
  showChooseProducts.value = s === 'choose-products'
  showGeneration.value = s === 'generation'
  showAddProducts.value = s === 'add-products'
  showTextPresets.value = s === 'text-presets'
  showTextPreview.value = s === 'text-preview'
  showTextGeneration.value = s === 'text-generation'
  if (s === 'text-preview') {
    textGenerating.value = false
    textGenerated.value = false
  }
})

// Generation page state
const genTab = ref('selected')
const genTabs = [
  { value: 'selected', label: 'Selected' },
  { value: 'generated', label: 'Generated' },
  { value: 'settings', label: 'Settings' },
]
const showGenMenu = ref(false)
const showSaveMenu = ref(false)
const showGenBanner = ref(false)
watch(showGeneration, (val) => {
  if (val) {
    showGenBanner.value = true
    setTimeout(() => { showGenBanner.value = false }, 5000)
  }
})
const genMenuOptions = [
  { count: 10, credits: '200 credits' },
  { count: 25, credits: '500 credits' },
  { count: 100, credits: '2,000 credits' },
  { count: 1, credits: '20 credits' },
]

const genProducts = ref([
  { id: 1, name: 'Premium Wireless Headphones', desc: 'Noise-cancelling over-ear headphones with 30-hour battery life.', status: 'generated' },
  { id: 2, name: 'Minimalist Ceramic Mug', desc: 'Handcrafted 12oz ceramic mug with matte finish.', status: 'queued' },
  { id: 3, name: 'Ergonomic Office Chair', desc: 'Adjustable lumbar support and breathable mesh back.', status: 'queued' },
  { id: 4, name: 'Smart Fitness Watch', desc: 'Heart rate monitor, GPS, and water-resistant design.', status: 'queued' },
  { id: 5, name: 'Organic Cotton T-Shirt', desc: '100% organic cotton, ethically sourced and manufactured.', status: 'queued' },
  { id: 6, name: 'Noise-Cancelling Earbuds', desc: 'True wireless earbuds with active noise cancellation.', status: 'queued' },
])

const selectedProduct = ref(null)
const showProductModal = ref(false)

const modalOriginalPrompt = ref('')

const openProductModal = (product) => {
  if (product.status !== 'generated') return
  selectedProduct.value = product
  modalOriginalPrompt.value = promptText.value
  showProductModal.value = true
}

const promptChanged = computed(() => promptText.value !== modalOriginalPrompt.value)

const regenerateProduct = () => {
  if (!selectedProduct.value) return
  const id = selectedProduct.value.id
  showProductModal.value = false
  genProducts.value = genProducts.value.map(p => p.id === id ? { ...p, status: 'generating' } : p)
  setTimeout(() => {
    genProducts.value = genProducts.value.map(p => p.id === id ? { ...p, status: 'generated' } : p)
  }, 2000)
}

const triggerGenerate = () => {
  showGenMenu.value = false
  const queued = genProducts.value.filter(p => p.status === 'queued').map(p => p.id)
  genProducts.value = genProducts.value.map(p => p.status === 'queued' ? { ...p, status: 'generating' } : p)
  queued.forEach((id, i) => {
    setTimeout(() => {
      genProducts.value = genProducts.value.map(p => p.id === id ? { ...p, status: 'generated' } : p)
    }, (i + 1) * 2000)
  })
}

// Choose Products state
const cpSearch = ref('')
const cpCategoryIs = ref('All categories')
const cpCategoryIsNot = ref('All categories')
const cpOnlyInStock = ref(false)
const cpOnlyWithTraffic = ref(false)
const cpShowFilters = ref(false)
const cpActiveFilterCount = computed(() => {
  let count = 0
  if (cpCategoryIs.value !== 'All categories') count++
  if (cpCategoryIsNot.value !== 'All categories') count++
  if (cpOnlyInStock.value) count++
  if (cpOnlyWithTraffic.value) count++
  return count
})
const cpFromText = ref(false)
const cpSelected = ref([])
const cpTotalPages = 55
const cpCategoryOptions = ['All categories', 'Electronics', 'Home & Kitchen', 'Clothing', 'Sports']

const cpProducts = [
  { id: 1, name: 'Premium Wireless Headphones', sku: 'WH-1000XM5', price: '$349.99', popularity: '1,245 views', lastUpdated: '2 hours ago' },
  { id: 2, name: 'Minimalist Ceramic Mug', sku: 'MUG-CER-01', price: '$24.00', popularity: '982 views', lastUpdated: '5 hours ago' },
  { id: 3, name: 'Ergonomic Office Chair', sku: 'CHR-ERG-99', price: '$450.00', popularity: '856 views', lastUpdated: '1 day ago' },
  { id: 4, name: 'Smart Fitness Watch', sku: 'WTCH-SMT-02', price: '$199.50', popularity: '734 views', lastUpdated: '2 days ago' },
  { id: 5, name: 'Organic Cotton T-Shirt', sku: 'TSH-ORG-WHT', price: '$35.00', popularity: '621 views', lastUpdated: '3 days ago' },
  { id: 6, name: 'Noise-Cancelling Earbuds', sku: 'EAR-NC-01', price: '$149.99', popularity: '512 views', lastUpdated: '4 days ago' },
  { id: 7, name: 'Bamboo Cutting Board Set', sku: 'KIT-BBD-03', price: '$42.00', popularity: '478 views', lastUpdated: '5 days ago' },
  { id: 8, name: 'Leather Laptop Bag', sku: 'BAG-LPT-15', price: '$129.00', popularity: '441 views', lastUpdated: '5 days ago' },
  { id: 9, name: 'Stainless Steel Water Bottle', sku: 'BTL-SS-32', price: '$28.00', popularity: '403 views', lastUpdated: '6 days ago' },
  { id: 10, name: 'Portable Bluetooth Speaker', sku: 'SPK-BT-X2', price: '$89.99', popularity: '387 views', lastUpdated: '6 days ago' },
  { id: 11, name: 'Yoga Mat Premium', sku: 'YGA-MAT-P1', price: '$65.00', popularity: '356 views', lastUpdated: '1 week ago' },
  { id: 12, name: 'Mechanical Keyboard TKL', sku: 'KBD-MCH-TK', price: '$179.00', popularity: '334 views', lastUpdated: '1 week ago' },
  { id: 13, name: 'Scented Soy Candle Set', sku: 'CND-SOY-06', price: '$38.00', popularity: '312 views', lastUpdated: '1 week ago' },
  { id: 14, name: 'Running Shoes Pro', sku: 'SHO-RUN-P8', price: '$140.00', popularity: '298 views', lastUpdated: '8 days ago' },
  { id: 15, name: 'Electric Coffee Grinder', sku: 'COF-GRD-E1', price: '$55.00', popularity: '276 views', lastUpdated: '9 days ago' },
  { id: 16, name: 'Linen Throw Blanket', sku: 'BLK-LIN-NB', price: '$72.00', popularity: '254 views', lastUpdated: '10 days ago' },
  { id: 17, name: 'Wireless Charging Pad', sku: 'CHG-WLS-15', price: '$29.99', popularity: '231 views', lastUpdated: '11 days ago' },
  { id: 18, name: 'Ceramic Plant Pot Set', sku: 'POT-CRM-S3', price: '$44.00', popularity: '218 views', lastUpdated: '12 days ago' },
  { id: 19, name: 'Sunglasses Polarized', sku: 'SGL-POL-UV', price: '$95.00', popularity: '204 views', lastUpdated: '2 weeks ago' },
  { id: 20, name: 'Hardcover Notebook A5', sku: 'NTB-HC-A5B', price: '$18.00', popularity: '189 views', lastUpdated: '2 weeks ago' },
]

const cpAllSelected = computed(() => cpSelected.value.length === cpProducts.length)
const toggleAllCp = () => {
  cpSelected.value = cpAllSelected.value ? [] : cpProducts.map(p => p.id)
}

const selectedDomain = ref('telekom.hu')
const domains = ['telekom.hu', 'myshop.com', 'example-store.com', 'demo-site.com', 'testsite.com']

const activeTab = ref('all')
const search = ref('')

const generating = ref(false)
const generated = ref(false)

const promptModel = ref('FLUX 1.1 Pro')
const promptRatio = ref('16:9')
const promptText = ref('A high-quality, professional product photo of premium wireless headphones on a clean, minimalist background with soft, natural lighting.')
const modelOptions = ['FLUX 1.1 Pro', 'FLUX 1.0', 'DALL-E 3']
const ratioOptions = ['16:9', '1:1', '4:3', '9:16']

const showAdvanced = ref(false)
const pageType = ref('product')
const dataSources = ['Terméknév', 'Termékleírás', 'Ajánlott termék neve', 'Ajánlott termék leírása']
const recommender = ref('Alapértelmezett')
const recommenderOptions = ['Alapértelmezett', 'Egyéni']
const autoGenerate = ref(true)
const minDescLength = ref(0)
const useProductImage = ref(false)

const previewGeneratedPrompt = ref('')

const previewPromptChanged = computed(() => generated.value && promptText.value !== previewGeneratedPrompt.value)

const startGeneration = () => {
  generating.value = true
  previewGeneratedPrompt.value = promptText.value
  setTimeout(() => {
    generating.value = false
    generated.value = true
  }, 2000)
}

const handlePresetClick = (preset) => {
  promptModel.value = preset.model
  promptRatio.value = preset.ratio
  emit('navigate', 'ai-texts-images-preview')
}

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'text', label: 'Texts' },
  { value: 'image', label: 'Images' },
]

const textPresets = [
  { id: 'benefit-list', name: 'Benefit List', description: 'Generate a bullet-point list of key product benefits tailored to each item in your catalogue.', model: 'GPT-4o', credits: 1, isPaired: false },
  { id: 'usp', name: 'USP', description: 'Create a unique selling proposition statement that highlights what makes each product stand out.', model: 'GPT-4o', credits: 1, isPaired: false },
  { id: 'headline-subheadline', name: 'Headline + Subheadline', description: 'Generate paired headline and subheadline copy for banners, popups, and embedded content.', model: 'GPT-4o', credits: 2, isPaired: true },
  { id: 'product-description', name: 'Product Description', description: 'Write compelling product descriptions optimized for conversions and SEO.', model: 'GPT-4o Mini', credits: 1, isPaired: false },
  { id: 'embedded-headline-benefit', name: 'Embedded headline + benefit', description: 'Combine a punchy headline with a supporting benefit statement for embedded placements.', model: 'GPT-4o', credits: 2, isPaired: false },
]

const selectedTextPreset = ref(null)

const handleTextPresetClick = (preset) => {
  selectedTextPreset.value = preset
  emit('navigate', 'ai-texts-images-text-preview')
}

const textGenerating = ref(false)
const textGenerated = ref(false)
const textPromptText = ref('Generate a {type} for the following product: {product_name}. Description: {product_description}.')
const textPreviewGeneratedPrompt = ref('')
const textPreviewPromptChanged = computed(() => textGenerated.value && textPromptText.value !== textPreviewGeneratedPrompt.value)

const startTextGeneration = () => {
  textGenerating.value = true
  textPreviewGeneratedPrompt.value = textPromptText.value
  setTimeout(() => {
    textGenerating.value = false
    textGenerated.value = true
  }, 2000)
}

const textGenTab = ref('selected')
const textGenTabs = [
  { value: 'selected', label: 'Selected' },
  { value: 'generated', label: 'Generated' },
  { value: 'settings', label: 'Settings' },
]

const textGenProducts = ref([
  { id: 1, name: 'Premium Wireless Headphones', desc: 'Noise-cancelling over-ear headphones with 30-hour battery life.', status: 'generated',
    text: { headline: 'Crystal Clear Sound, Zero Distractions', sub: 'Industry-leading noise cancellation meets 30-hour playtime.', body: '• 30-hour battery life\n• Active noise cancellation\n• Premium sound quality\n• Foldable design for travel' } },
  { id: 2, name: 'Minimalist Ceramic Mug', desc: 'Handcrafted 12oz ceramic mug with matte finish.', status: 'queued', text: null },
  { id: 3, name: 'Ergonomic Office Chair', desc: 'Adjustable lumbar support and breathable mesh back.', status: 'queued', text: null },
  { id: 4, name: 'Smart Fitness Watch', desc: 'Heart rate monitor, GPS, and water-resistant design.', status: 'queued', text: null },
  { id: 5, name: 'Organic Cotton T-Shirt', desc: '100% organic cotton, ethically sourced and manufactured.', status: 'queued', text: null },
  { id: 6, name: 'Noise-Cancelling Earbuds', desc: 'True wireless earbuds with active noise cancellation.', status: 'queued', text: null },
])

const textGenMenuOptions = [
  { count: 10, credits: '20 credits' },
  { count: 25, credits: '50 credits' },
  { count: 100, credits: '200 credits' },
  { count: 1, credits: '2 credits' },
]

const showTextGenMenu = ref(false)
const showTextSaveMenu = ref(false)

const triggerTextGenerate = () => {
  showTextGenMenu.value = false
  const queued = textGenProducts.value.filter(p => p.status === 'queued').map(p => p.id)
  textGenProducts.value = textGenProducts.value.map(p => p.status === 'queued' ? { ...p, status: 'generating' } : p)
  queued.forEach((id, i) => {
    setTimeout(() => {
      textGenProducts.value = textGenProducts.value.map(p => p.id === id ? { ...p, status: 'generated', text: { headline: 'Compelling Headline Here', sub: 'Supporting subheadline that reinforces the value.', body: '• Key benefit one\n• Key benefit two\n• Key benefit three' } } : p)
    }, (i + 1) * 2000)
  })
}

const imagePresets = [
  { id: 1, name: 'Lifestyle Image', description: 'Place your product in a realistic, high-quality lifestyle setting.', model: 'FLUX 1.1 Pro', ratio: '16:9', credits: 20 },
  { id: 2, name: 'White Background', description: 'Clean, professional product cutout on a pure white background.', model: 'FLUX 1.1 Pro', ratio: '1:1', credits: 15 },
  { id: 3, name: 'Social Media Banner', description: 'Eye-catching, vibrant composition optimized for social feeds.', model: 'FLUX 1.1 Pro', ratio: '16:9', credits: 20 },
  { id: 4, name: 'Seasonal Theme', description: 'Style your product with holiday or seasonal props and lighting.', model: 'FLUX 1.1 Pro', ratio: '4:3', credits: 25 },
  { id: 5, name: 'Infographic Style', description: 'Product presentation with space for feature callouts and text.', model: 'FLUX 1.1 Pro', ratio: '9:16', credits: 20 },
  { id: 6, name: 'A/B Test Variant', description: 'Generate an alternative angle or lighting setup for testing.', model: 'FLUX 1.1 Pro', ratio: '1:1', credits: 15 },
]

const items = [
  { id: 0, name: 'AI lifestyle image 1', type: 'Image', generated: '1 / 6', status: 'Ready to use', lastUpdated: 'Mar 13, 2026' },
  { id: 1, name: 'SPPO - Benefit List', type: 'Text', generated: '33 / 4185', status: 'Ready to use', lastUpdated: 'Oct 24, 2023' },
  { id: 2, name: 'Image - Badges w/ People (Desktop)', type: 'Image', generated: '12 / 500', status: 'Draft', lastUpdated: 'Oct 23, 2023' },
  { id: 3, name: 'SPP02 | People image drinks', type: 'Image', generated: '45 / 45', status: 'Ready to use', lastUpdated: 'Oct 20, 2023' },
  { id: 4, name: 'SPPO3 - USP', type: 'Text', generated: '100 / 100', status: 'Pending changes', lastUpdated: 'Oct 19, 2023' },
  { id: 5, name: 'SPPO 2 - embedded headline + benefit', type: 'Text', generated: '0 / 200', status: 'Draft', lastUpdated: 'Oct 18, 2023' },
  { id: 6, name: 'Product Description Generator', type: 'Text', generated: '500 / 500', status: 'Ready to use', lastUpdated: 'Oct 15, 2023' },
  { id: 7, name: 'Hero Banner - Seasonal', type: 'Image', generated: '5 / 10', status: 'Pending changes', lastUpdated: 'Oct 10, 2023' },
  { id: 8, name: 'Headline + Subheadline', type: 'Text', generated: '0 / 0', status: 'Draft', lastUpdated: 'Mar 16, 2026' },
]

const filteredItems = computed(() => {
  return items.filter(item => {
    const tabMatch =
      activeTab.value === 'all' ||
      (activeTab.value === 'text' && item.type === 'Text') ||
      (activeTab.value === 'image' && item.type === 'Image')
    const searchMatch = !search.value || item.name.toLowerCase().includes(search.value.toLowerCase())
    return tabMatch && searchMatch
  })
})

const statusVariant = (status) => {
  if (status === 'Ready to use') return 'green'
  if (status === 'Pending changes') return 'orange'
  return 'gray-muted'
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.97) translateY(8px);
}

.banner-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease, max-height 0.5s ease, margin-bottom 0.5s ease, padding 0.5s ease;
  overflow: hidden;
}
.banner-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.banner-leave-from {
  max-height: 100px;
}

@keyframes arrowBounce {
  0%   { transform: translateX(0); }
  40%  { transform: translateX(5px); }
  70%  { transform: translateX(0); }
  100% { transform: translateX(0); }
}

.group:hover .group-hover\:arrow-bounce {
  animation: arrowBounce 0.4s ease forwards;
}
</style>
