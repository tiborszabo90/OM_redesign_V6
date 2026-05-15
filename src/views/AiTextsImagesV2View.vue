<template>
  <DashboardLayout active-menu-item="templates" :passthrough="embedded" @menu-click="$emit('menu-click', $event)">
    <template #content>
      <div @click="showGenMenu = false; showSaveMenu = false; showTextGenMenu = false; showTextSaveMenu = false">

      <!-- Preview Generation screen -->
      <div v-if="showPreview" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-presets')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
<span>New Variable</span>
            <span class="text-om-gray-300">›</span>
            <span>Preset</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Preview</span>
          </nav>
        </div>
        <!-- Title + action -->
        <div class="flex items-center justify-between mb-1">
          <h1 class="text-2xl font-semibold text-om-gray-700">Preview Generation</h1>
          <Button variant="primary" size="md" @click="triggerGenBanner(); emit('navigate', 'ai-texts-images-v2-generation')">Save Variable</Button>
        </div>
        <p class="text-sm text-om-gray-500 mb-6">Test your selected preset and adjust the prompt before applying to your catalogue.</p>

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
                <div class="flex items-center gap-1.5 mt-3 text-sm font-medium text-om-orange-500">
                  <Coins :size="16" />
                  Costs {{ selectedImagePreset?.credits ?? 15 }} credits
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
                  <div v-if="previewPromptChanged" class="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                    <Button variant="primary" size="md" @click="startGeneration">
                      <template #icon><Sparkles :size="14" /></template>
                      Regenerate
                    </Button>
                    <div class="flex items-center gap-1.5 mt-3 text-sm font-medium text-white">
                      <Coins :size="16" />
                      Costs {{ selectedImagePreset?.credits ?? 15 }} credits
                    </div>
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
          </div>
          <textarea
            v-model="promptText"
            rows="3"
            class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
          />
          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-om-gray-400">Edit the prompt above to customize the generation. Changes will require regenerating the preview.</p>
            <Button v-if="!showAdvanced" variant="ghost" size="sm" class="shrink-0 ml-4" @click="showAdvanced = true">Advanced Settings <ChevronDown :size="14" /></Button>
          </div>

          <!-- Advanced Settings panel -->
          <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">

            <!-- 2 columns -->
            <div class="grid grid-cols-2 gap-3 items-stretch">

              <!-- Col 1: Model + Ratio -->
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 min-w-0 flex items-end gap-3">
                <div class="flex flex-col gap-1 flex-1 min-w-0">
                  <p class="text-xs text-om-gray-500">Model</p>
                  <Dropdown v-model="promptModel" :options="modelOptions" size="sm" />
                </div>
                <div class="flex flex-col gap-1 flex-1 min-w-0">
                  <p class="text-xs text-om-gray-500">Ratio</p>
                  <Dropdown v-model="promptRatio" :options="ratioOptions" size="sm" />
                </div>
              </div>

              <!-- Col 2: Usage location -->
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <p class="text-xs text-om-gray-500">Usage location</p>
                <div class="grid grid-cols-2 mt-0.5">
                  <RadioButton v-model="pageType" value="product" label="Product page" />
                  <RadioButton v-model="pageType" value="popup" label="Popup/Embedded" />
                </div>
              </div>

            </div>

            <!-- Available data sources: full width -->
            <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
              <p class="text-xs text-om-gray-500">Available data sources</p>
              <div class="flex flex-wrap gap-1.5">
                <Tag v-for="src in dataSources" :key="src" variant="orange">{{ src }}</Tag>
              </div>
            </div>

            <!-- Data quality: full width below -->
            <div class="grid grid-cols-2 gap-3 items-stretch">
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                <input
                  v-model="minDescLength"
                  type="number"
                  min="0"
                  class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white shrink-0"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <Button variant="ghost" size="sm" @click="showAdvanced = false">Basic Settings <ChevronUp :size="14" /></Button>
            </div>

          </div>
        </div>
      </div>

      <!-- Image Presets screen -->
      <div v-else-if="showImagePresets" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-new')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
<span>New Variable</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Preset</span>
          </nav>
        </div>
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Choose a Preset</h1>
        <p class="text-sm text-om-gray-500 mb-8">Select a starting point for your AI generation.</p>

        <!-- Preset cards grid -->
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="preset in imagePresets"
            :key="preset.id"
            class="bg-white rounded-xl border-2 border-om-gray-200 p-5 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all duration-200 flex gap-4"
            @click="handlePresetClick(preset)"
          >
            <div class="w-44 h-44 shrink-0 rounded-lg bg-om-gray-100 border border-om-gray-200" />
            <div class="flex flex-col flex-1 min-w-0">
            <h2 class="text-base font-semibold text-om-gray-700 mb-2">{{ preset.name }}</h2>
            <p class="text-sm text-om-gray-500 flex-1 mb-3">{{ preset.description }}</p>
            <div class="flex flex-col gap-1.5 mt-auto">
              <Tag class="self-start">
                <template #icon><Cpu :size="14" class="text-om-gray-400" /></template>
                {{ preset.model }}
              </Tag>
              <Tag class="self-start">
                <template #icon><Maximize2 :size="14" class="text-om-gray-400" /></template>
                {{ preset.ratio }}
              </Tag>
              <Tag variant="orange" class="self-start">
                <template #icon><Coins :size="14" class="text-om-orange-400" /></template>
                {{ preset.credits }} credits/image
              </Tag>
            </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Workflow Presets screen -->
      <div v-else-if="showWorkflowPresets" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-new')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
<span>New Variable</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Preset</span>
          </nav>
        </div>
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Choose a Preset</h1>
        <p class="text-sm text-om-gray-500 mb-8">Select a starting point for your AI workflow.</p>

        <!-- Preset cards grid -->
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="preset in workflowPresets"
            :key="preset.id"
            class="bg-white rounded-xl border-2 border-om-gray-200 p-5 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] transition-all duration-200 flex gap-4"
            @click="handleWorkflowPresetClick(preset)"
          >
            <div class="w-44 h-44 shrink-0 rounded-lg bg-om-gray-100 border border-om-gray-200" />
            <div class="flex flex-col flex-1 min-w-0">
            <h2 class="text-base font-semibold text-om-gray-700 mb-2">{{ preset.name }}</h2>
            <p class="text-sm text-om-gray-500 flex-1 mb-3">{{ preset.description }}</p>
            <div class="flex flex-col gap-1.5 mt-auto">
              <Tag class="self-start">
                <template #icon><Workflow :size="14" class="text-om-gray-400" /></template>
                {{ preset.steps }} steps
              </Tag>
              <Tag class="self-start">
                <template #icon><Cpu :size="14" class="text-om-gray-400" /></template>
                {{ preset.model }}
              </Tag>
              <Tag variant="orange" class="self-start">
                <template #icon><Coins :size="14" class="text-om-orange-400" /></template>
                {{ preset.credits }} credits/run
              </Tag>
            </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Workflow Editor screen -->
      <div v-else-if="showWorkflowEditor" class="w-full max-w-[1100px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-workflow-presets')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
            <span>New Variable</span>
            <span class="text-om-gray-300">›</span>
            <span>Preset</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">{{ workflowEditorTitle }}</span>
          </nav>
        </div>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-om-gray-800 mb-1">{{ workflowEditorTitle }}</h1>
            <p class="text-sm text-om-gray-500">Chain multiple AI steps. Each step can use the original image, references, or outputs from earlier steps.</p>
          </div>
          <Button variant="primary" size="sm" @click="createWorkflow">
            <template #icon><Check :size="14" /></template>
            Create workflow
          </Button>
        </div>

        <!-- Product preview -->
        <div class="bg-white rounded-xl border border-om-gray-200 p-4 mb-4 flex items-center gap-4">
          <div class="w-20 h-20 bg-om-gray-100 rounded-lg overflow-hidden border border-om-gray-200 shrink-0">
            <img :src="workflowProduct.image" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs text-om-gray-400 mb-0.5">Editing for</p>
            <h3 class="text-sm font-semibold text-om-gray-700 truncate">{{ workflowProduct.name }}</h3>
            <p class="text-xs text-om-gray-500">{{ workflowProduct.category }}</p>
          </div>
        </div>

        <!-- Steps -->
        <div v-for="(step, i) in workflowSteps" :key="step.id" class="bg-white rounded-xl border border-om-gray-200 p-4 mb-3">
          <!-- Header: step title + model dropdown + remove -->
          <div class="flex items-center gap-3 mb-3">
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <span class="w-6 h-6 rounded-full bg-om-orange-100 text-om-orange-500 text-xs font-bold flex items-center justify-center shrink-0">{{ i + 1 }}</span>
              <h3 class="text-sm font-semibold text-om-gray-700">Step {{ i + 1 }}</h3>
              <Button variant="ghost" size="sm" @click="openTemplateModal(i)">
                <template #icon><Sparkles :size="13" /></template>
                Load AI template
              </Button>
            </div>
            <div class="w-48 shrink-0">
              <Dropdown v-model="step.model" :options="modelOptions" size="sm" :disabled="isStepInherited(step, i)" />
            </div>
            <Button v-if="workflowSteps.length > 1" variant="ghost" size="sm" :icon-only="true" @click="removeWorkflowStep(step.id)">
              <template #icon><X :size="14" /></template>
            </Button>
          </div>

          <!-- Inputs: add-input dropdown + parsed-from-prompt chips -->
          <div class="mb-3">
            <p class="text-xs font-medium text-om-gray-500 mb-2">Inputs</p>
            <div class="flex items-center gap-3 p-3 bg-om-gray-50 rounded-lg">
              <div class="w-44 shrink-0">
                <Dropdown
                  v-model="addInputDropdowns[step.id]"
                  :options="inputDropdownOptions(i)"
                  placeholder="+ Add input"
                  size="sm"
                  @update:model-value="(opt) => onAddInput(step, opt)"
                />
              </div>
              <div class="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                <Tag v-for="u in usedInputs(step, i)" :key="u.variable" :variant="inputTagVariant(u.source)">{{ u.placeholder }}</Tag>
                <span v-if="usedInputs(step, i).length === 0" class="text-xs text-om-gray-400">No inputs used yet</span>
              </div>
            </div>
          </div>

          <!-- Prompt with checkbox in top-right -->
          <div class="mb-3">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-medium text-om-gray-500">Prompt</p>
              <Checkbox
                v-model="step.continuePreviousPrompt"
                label="Continue prompt of the previous step"
                size="sm"
                :disabled="i === 0"
              />
            </div>
            <textarea
              v-model="step.prompt"
              :ref="setPromptRef(step.id)"
              @blur="trackCursor(step, $event)"
              @keyup="trackCursor(step, $event)"
              @click="trackCursor(step, $event)"
              rows="3"
              placeholder="Describe what this step should produce..."
              class="w-full text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 px-3 py-2 resize-none"
            />
          </div>

          <!-- Per-model settings (compact) + Variables (outputs) -->
          <div class="flex items-stretch gap-3 mb-3">
            <div class="flex items-center gap-2 px-3 py-2 bg-om-gray-50 rounded-lg w-1/2 min-w-0">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <ToggleSwitch v-if="isImageModel(step.model)" v-model="step.useMultipleImages" />
                <ToggleSwitch v-else v-model="step.useProductImageContext" />
                <span class="text-xs text-om-gray-600 truncate">{{ isImageModel(step.model) ? 'Use multiple product images' : 'Use product image as context' }}</span>
              </div>
              <div class="w-px h-5 bg-om-gray-200"></div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-om-gray-600">Min. description length</span>
                <input
                  v-model.number="step.minDescriptionLength"
                  type="number"
                  min="0"
                  class="w-16 text-sm text-center rounded-md border border-om-gray-200 bg-white text-om-gray-700 outline-none focus:border-om-gray-400 px-2 py-1"
                />
              </div>
            </div>
            <div class="px-3 py-2 bg-om-gray-50 rounded-lg flex flex-col justify-center w-1/2 min-w-0">
              <p class="text-[11px] text-om-gray-400 leading-none mb-1.5">Output variables</p>
              <div class="flex flex-wrap gap-1.5">
                <Tag variant="green">{{ stepOutputName(step, i) }}</Tag>
              </div>
            </div>
          </div>

          <!-- Bottom: References (left) + Ratio + Run + Output (right) -->
          <div class="flex items-end gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-om-gray-500 mb-1">Reference images</p>
              <div class="flex flex-wrap gap-2">
                <div v-for="ref in step.referenceImages" :key="ref.id" class="relative w-14 h-14">
                  <div class="w-14 h-14 rounded-lg border border-om-gray-200 overflow-hidden bg-om-gray-100">
                    <img :src="ref.url" class="w-full h-full object-cover" />
                  </div>
                  <button @click="removeStepReference(step, ref.id)" class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white border border-om-gray-300 flex items-center justify-center hover:bg-om-gray-100">
                    <X :size="9" class="text-om-gray-600" />
                  </button>
                </div>
                <label class="w-14 h-14 border-2 border-dashed border-om-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-om-orange-400 hover:bg-om-orange-50 transition-colors text-om-gray-400 hover:text-om-orange-500">
                  <input type="file" hidden accept="image/*" @change="(e) => addStepReference(step, e)" />
                  <Upload :size="14" />
                </label>
              </div>
            </div>
            <div v-if="isImageModel(step.model)" class="w-24 shrink-0">
              <p class="text-xs font-medium text-om-gray-500 mb-1">Ratio</p>
              <Dropdown v-model="step.ratio" :options="['1:1', '16:9', '9:16', '4:5', '4:3']" size="sm" />
            </div>
            <Button variant="secondary" size="sm" :disabled="step.generating || step.waiting" @click="runWorkflowStep(step)">
              <template #icon>
                <Loader2 v-if="step.generating" :size="14" class="animate-spin" />
                <Clock v-else-if="step.waiting" :size="14" />
                <Play v-else :size="14" />
              </template>
              {{ step.generating ? 'Running...' : step.waiting ? 'Waiting...' : 'Run step' }}
            </Button>
            <div
              v-if="isImageModel(step.model)"
              class="w-20 h-20 bg-om-gray-100 rounded-lg border border-om-gray-200 overflow-hidden shrink-0"
              :class="step.output ? 'cursor-pointer hover:border-om-gray-400' : ''"
              @click="step.output && (workflowLightbox = step.output)"
            >
              <img v-if="step.output" :src="step.output" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-om-gray-400 text-center px-1">No output yet</div>
            </div>
            <textarea
              v-else
              :value="step.output || ''"
              readonly
              rows="3"
              :placeholder="step.output ? '' : 'No output yet'"
              class="w-[28rem] h-20 text-xs rounded-lg border border-om-gray-200 bg-om-gray-50 text-om-gray-700 placeholder-om-gray-400 outline-none px-2 py-1.5 resize-none shrink-0"
            />
          </div>
        </div>

        <!-- Add step -->
        <div class="flex items-center justify-between mt-4 mb-12">
          <Button variant="outline" size="sm" @click="addWorkflowStep">
            <template #icon><Plus :size="14" /></template>
            Add step
          </Button>
          <Button variant="primary" size="sm" @click="runWorkflowAll">
            <template #icon><Wand2 :size="14" /></template>
            Run workflow
          </Button>
        </div>

        <!-- Output lightbox -->
        <div v-if="workflowLightbox" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8" @click="workflowLightbox = null">
          <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" @click.stop="workflowLightbox = null">
            <X :size="20" />
          </button>
          <img :src="workflowLightbox" class="max-w-full max-h-full rounded-xl shadow-2xl" @click.stop />
        </div>
      </div>

      <!-- Workflow Generation screen (3 tabs) -->
      <div v-else-if="showWorkflowGeneration" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Title -->
        <h1 v-if="!wfDetailProduct" class="text-2xl font-bold text-om-gray-800 mb-4">{{ selectedWorkflowPreset?.name || 'Workflow' }}</h1>

        <!-- Tabs -->
        <div v-if="!wfDetailProduct" class="flex items-center border-b border-om-gray-200 mb-6">
          <button
            v-for="tab in wfTabs"
            :key="tab.value"
            class="px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer"
            :class="wfTab === tab.value ? 'text-om-orange-500' : 'text-om-gray-500 hover:text-om-gray-700'"
            @click="wfTab = tab.value"
          >
            {{ tab.label }}
            <span v-if="wfTab === tab.value" class="absolute bottom-0 left-0 right-0 h-0.5 bg-om-orange-500"></span>
          </button>
        </div>

        <!-- Choose products tab -->
        <div v-if="wfTab === 'selected'">
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="relative">
                <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-700" />
                <input v-model="wfSearch" type="text" placeholder="Search products..." class="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 w-44" />
              </div>
              <div class="relative">
                <Button variant="secondary" size="sm" @click="cpShowFilters = !cpShowFilters">
                  <template #icon><SlidersHorizontal :size="15" /></template>
                  Filters
                </Button>
                <div v-if="cpShowFilters" class="absolute top-full left-0 mt-2 bg-white border border-om-gray-200 rounded-xl shadow-lg p-4 z-20 flex flex-col gap-4 w-80">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-om-gray-500">Category is</span>
                    <MultiSelect v-model="cpCategoryIs" :options="cpCategoryOptions" placeholder="All categories" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-om-gray-500">Category is not</span>
                    <MultiSelect v-model="cpCategoryIsNot" :options="cpCategoryOptions" placeholder="All categories" />
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
              <div class="relative">
                <Button variant="secondary" size="sm" @click="cpSortOpen = !cpSortOpen">
                  {{ cpSortOptions.find(o => o.value === cpSortBy)?.label }}
                </Button>
                <div v-if="cpSortOpen" class="fixed inset-0 z-10" @click="cpSortOpen = false" />
                <div
                  v-if="cpSortOpen"
                  class="absolute left-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[180px]"
                >
                  <button
                    v-for="opt in cpSortOptions"
                    :key="opt.value"
                    @click="cpSortBy = opt.value; cpSortOpen = false"
                    class="w-full text-left text-sm text-[#23262A] px-3 py-1.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                    :class="cpSortBy === opt.value ? 'bg-[#F1F2F4] font-medium' : ''"
                  >
                    {{ opt.label }}
                    <Check v-if="cpSortBy === opt.value" :size="16" class="text-om-gray-500 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
            <div class="relative">
              <Button variant="primary" size="md" @click.stop="showWfGenMenu = !showWfGenMenu">
                Generate
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Button>
              <div
                v-if="showWfGenMenu"
                class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[360px] overflow-hidden"
              >
                <button
                  class="w-full flex items-center justify-between px-4 py-3 text-sm border-b border-om-gray-100 transition-colors"
                  :class="wfSelected.length > 0 ? 'hover:bg-om-gray-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                  :disabled="wfSelected.length === 0"
                  @click="wfSelected.length > 0 && triggerWfGenerate('selected')"
                >
                  <span class="text-om-gray-700 text-left">Generate for selected ({{ wfSelected.length }})</span>
                  <span class="flex items-center gap-1.5 font-medium ml-8 tabular-nums whitespace-nowrap" :class="wfSelected.length > 0 ? 'text-om-orange-500' : 'text-om-gray-400'">
                    <Coins :size="13" />
                    {{ wfSelectedCredits }}
                  </span>
                </button>
                <button
                  v-for="opt in wfMenuOptions"
                  :key="opt.count"
                  class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer"
                  :class="opt.count !== wfMenuOptions[wfMenuOptions.length - 1].count ? 'border-b border-om-gray-100' : ''"
                  @click="triggerWfGenerate(opt.count)"
                >
                  <span class="text-om-gray-700 text-left">Generate for {{ opt.count }} products</span>
                  <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-8 tabular-nums whitespace-nowrap">
                    <Coins :size="13" />
                    {{ opt.credits }}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <!-- Entry count -->
          <p class="text-sm text-om-gray-400 mb-3">Showing 1 to {{ wfFilteredProducts.length }} of {{ genProducts.length }} entries</p>
          <div class="flex flex-col gap-2">
            <label
              v-for="p in wfFilteredProducts"
              :key="p.id"
              class="flex items-center gap-4 p-3 bg-white rounded-xl border border-om-gray-200 cursor-pointer hover:border-om-gray-300"
            >
              <Checkbox
                :model-value="wfSelected.includes(p.id)"
                @update:model-value="wfSelected.includes(p.id) ? wfSelected = wfSelected.filter(id => id !== p.id) : wfSelected.push(p.id)"
                size="sm"
              />
              <div class="w-14 h-14 bg-om-gray-100 rounded-md border border-om-gray-200 shrink-0" />
              <div class="min-w-0 w-72 shrink-0">
                <p class="text-sm font-medium text-om-gray-700 truncate">{{ p.name }}</p>
                <p class="text-xs text-om-gray-500 truncate">{{ p.desc }}</p>
              </div>
              <div class="w-px h-12 bg-om-gray-200 shrink-0"></div>
              <div class="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                <Tag
                  v-for="(s, i) in workflowSteps"
                  :key="s.id"
                  :variant="productStepDone(p, i) ? 'green' : (productStepRunning(p, i) ? 'orange' : 'gray-muted')"
                >
                  <template #icon>
                    <Check v-if="productStepDone(p, i)" :size="11" />
                    <Loader2 v-else-if="productStepRunning(p, i)" :size="11" class="animate-spin" />
                    <Clock v-else :size="11" />
                  </template>
                  Step {{ i + 1 }}
                </Tag>
              </div>
              <div class="w-px h-12 bg-om-gray-200 shrink-0"></div>
              <div class="shrink-0">
                <Tag :variant="productOverallStatus(p).variant">
                  <template #icon>
                    <Check v-if="productOverallStatus(p).icon === 'check'" :size="12" />
                    <Loader2 v-else-if="productOverallStatus(p).icon === 'loader'" :size="12" class="animate-spin" />
                    <Clock v-else :size="12" />
                  </template>
                  {{ productOverallStatus(p).label }}
                </Tag>
              </div>
            </label>
          </div>
        </div>

        <!-- Review tab -->
        <div v-else-if="wfTab === 'generated' && !wfDetailProduct">
          <p class="text-sm text-om-gray-400 mb-3">Showing 1 to {{ wfProductsWithResults.length }} of {{ wfProductsWithResults.length }} entries</p>
          <div v-if="wfProductsWithResults.length" class="flex flex-col gap-2">
            <div
              v-for="p in wfProductsWithResults"
              :key="p.id"
              class="flex items-center gap-4 p-3 bg-white rounded-xl border border-om-gray-200 cursor-pointer hover:border-om-gray-300 hover:shadow-sm transition-all"
              @click="openWfDetail(p)"
            >
              <div class="w-14 h-14 bg-om-gray-100 rounded-md border border-om-gray-200 shrink-0" />
              <div class="min-w-0 w-72 shrink-0">
                <p class="text-sm font-medium text-om-gray-700 truncate">{{ p.name }}</p>
                <p class="text-xs text-om-gray-500 truncate">{{ p.desc }}</p>
              </div>
              <div class="w-px h-12 bg-om-gray-200 shrink-0"></div>
              <div class="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                <Tag
                  v-for="(s, i) in workflowSteps"
                  :key="s.id"
                  :variant="productStepDone(p, i) ? 'green' : (productStepRunning(p, i) ? 'orange' : 'gray-muted')"
                >
                  <template #icon>
                    <Check v-if="productStepDone(p, i)" :size="11" />
                    <Loader2 v-else-if="productStepRunning(p, i)" :size="11" class="animate-spin" />
                    <Clock v-else :size="11" />
                  </template>
                  Step {{ i + 1 }}
                </Tag>
              </div>
              <div class="w-px h-12 bg-om-gray-200 shrink-0"></div>
              <div class="shrink-0">
                <Tag :variant="productOverallStatus(p).variant">
                  <template #icon>
                    <Check v-if="productOverallStatus(p).icon === 'check'" :size="12" />
                    <Loader2 v-else-if="productOverallStatus(p).icon === 'loader'" :size="12" class="animate-spin" />
                    <Clock v-else :size="12" />
                  </template>
                  {{ productOverallStatus(p).label }}
                </Tag>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-sm text-om-gray-400 py-12">
            No workflow runs yet. Pick products in the <button class="text-om-orange-500 underline" @click="wfTab = 'selected'">Choose products</button> tab and run the workflow.
          </p>
        </div>

        <!-- Settings tab — same UI as Preview page -->
        <div v-else-if="wfTab === 'settings'" class="max-w-[1100px]">
          <!-- Product preview -->
          <div class="bg-white rounded-xl border border-om-gray-200 p-4 mb-4 flex items-center gap-4">
            <div class="w-20 h-20 bg-om-gray-100 rounded-lg overflow-hidden border border-om-gray-200 shrink-0">
              <img :src="workflowProduct.image" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-om-gray-400 mb-0.5">Sample product</p>
              <h3 class="text-sm font-semibold text-om-gray-700 truncate">{{ workflowProduct.name }}</h3>
              <p class="text-xs text-om-gray-500">{{ workflowProduct.category }}</p>
            </div>
          </div>

          <!-- Steps -->
          <div v-for="(step, i) in workflowSteps" :key="step.id" class="bg-white rounded-xl border border-om-gray-200 p-4 mb-3">
            <div class="flex items-center gap-3 mb-3">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="w-6 h-6 rounded-full bg-om-orange-100 text-om-orange-500 text-xs font-bold flex items-center justify-center shrink-0">{{ i + 1 }}</span>
                <h3 class="text-sm font-semibold text-om-gray-700">Step {{ i + 1 }}</h3>
                <Button variant="ghost" size="sm" @click="openTemplateModal(i)">
                  <template #icon><Sparkles :size="13" /></template>
                  Load AI template
                </Button>
              </div>
              <div class="w-48 shrink-0">
                <Dropdown v-model="step.model" :options="modelOptions" size="sm" :disabled="isStepInherited(step, i)" />
              </div>
              <Button v-if="workflowSteps.length > 1" variant="ghost" size="sm" :icon-only="true" @click="removeWorkflowStep(step.id)">
                <template #icon><X :size="14" /></template>
              </Button>
            </div>
            <div class="mb-3">
              <p class="text-xs font-medium text-om-gray-500 mb-2">Inputs</p>
              <div class="flex items-center gap-3 p-3 bg-om-gray-50 rounded-lg">
                <div class="w-44 shrink-0">
                  <Dropdown
                    v-model="addInputDropdowns[step.id]"
                    :options="inputDropdownOptions(i)"
                    placeholder="+ Add input"
                    size="sm"
                    @update:model-value="(opt) => onAddInput(step, opt)"
                  />
                </div>
                <div class="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                  <Tag v-for="u in usedInputs(step, i)" :key="u.variable" :variant="inputTagVariant(u.source)">{{ u.placeholder }}</Tag>
                  <span v-if="usedInputs(step, i).length === 0" class="text-xs text-om-gray-400">No inputs used yet</span>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <div class="flex items-center justify-between mb-2">
                <p class="text-xs font-medium text-om-gray-500">Prompt</p>
                <Checkbox
                  v-model="step.continuePreviousPrompt"
                  label="Continue prompt of the previous step"
                  size="sm"
                  :disabled="i === 0"
                />
              </div>
              <textarea
                v-model="step.prompt"
                :ref="setPromptRef(step.id)"
                @blur="trackCursor(step, $event)"
                @keyup="trackCursor(step, $event)"
                @click="trackCursor(step, $event)"
                rows="3"
                placeholder="Describe what this step should produce..."
                class="w-full text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 px-3 py-2 resize-none"
              />
            </div>
            <div class="flex items-stretch gap-3 mb-3">
              <div class="flex items-center gap-2 px-3 py-2 bg-om-gray-50 rounded-lg w-1/2 min-w-0">
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <ToggleSwitch v-if="isImageModel(step.model)" v-model="step.useMultipleImages" />
                  <ToggleSwitch v-else v-model="step.useProductImageContext" />
                  <span class="text-xs text-om-gray-600 truncate">{{ isImageModel(step.model) ? 'Use multiple product images' : 'Use product image as context' }}</span>
                </div>
                <div class="w-px h-5 bg-om-gray-200"></div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-om-gray-600">Min. description length</span>
                  <input
                    v-model.number="step.minDescriptionLength"
                    type="number"
                    min="0"
                    class="w-16 text-sm text-center rounded-md border border-om-gray-200 bg-white text-om-gray-700 outline-none focus:border-om-gray-400 px-2 py-1"
                  />
                </div>
              </div>
              <div class="px-3 py-2 bg-om-gray-50 rounded-lg flex flex-col justify-center w-1/2 min-w-0">
                <p class="text-[11px] text-om-gray-400 leading-none mb-1.5">Output variables</p>
                <div class="flex flex-wrap gap-1.5">
                  <Tag variant="green">{{ stepOutputName(step, i) }}</Tag>
                </div>
              </div>
            </div>
            <div class="flex items-end gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-om-gray-500 mb-1">Reference images</p>
                <div class="flex flex-wrap gap-2">
                  <div v-for="ref in step.referenceImages" :key="ref.id" class="relative w-14 h-14">
                    <div class="w-14 h-14 rounded-lg border border-om-gray-200 overflow-hidden bg-om-gray-100">
                      <img :src="ref.url" class="w-full h-full object-cover" />
                    </div>
                    <button @click="removeStepReference(step, ref.id)" class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white border border-om-gray-300 flex items-center justify-center hover:bg-om-gray-100">
                      <X :size="9" class="text-om-gray-600" />
                    </button>
                  </div>
                  <label class="w-14 h-14 border-2 border-dashed border-om-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-om-orange-400 hover:bg-om-orange-50 transition-colors text-om-gray-400 hover:text-om-orange-500">
                    <input type="file" hidden accept="image/*" @change="(e) => addStepReference(step, e)" />
                    <Upload :size="14" />
                  </label>
                </div>
              </div>
              <div v-if="isImageModel(step.model)" class="w-24 shrink-0">
                <p class="text-xs font-medium text-om-gray-500 mb-1">Ratio</p>
                <Dropdown v-model="step.ratio" :options="['1:1', '16:9', '9:16', '4:5', '4:3']" size="sm" />
              </div>
              <Button variant="secondary" size="sm" :disabled="step.generating || step.waiting" @click="runWorkflowStep(step)">
                <template #icon>
                  <Loader2 v-if="step.generating" :size="14" class="animate-spin" />
                  <Clock v-else-if="step.waiting" :size="14" />
                  <Play v-else :size="14" />
                </template>
                {{ step.generating ? 'Running...' : step.waiting ? 'Waiting...' : 'Run step' }}
              </Button>
              <div v-if="isImageModel(step.model)" class="w-20 h-20 bg-om-gray-100 rounded-lg border border-om-gray-200 overflow-hidden shrink-0" :class="step.output ? 'cursor-pointer hover:border-om-gray-400' : ''" @click="step.output && (workflowLightbox = step.output)">
                <img v-if="step.output" :src="step.output" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-om-gray-400 text-center px-1">No output yet</div>
              </div>
              <textarea
                v-else
                :value="step.output || ''"
                readonly
                rows="3"
                :placeholder="step.output ? '' : 'No output yet'"
                class="w-[28rem] h-20 text-xs rounded-lg border border-om-gray-200 bg-om-gray-50 text-om-gray-700 placeholder-om-gray-400 outline-none px-2 py-1.5 resize-none shrink-0"
              />
            </div>
          </div>
          <div class="flex items-center justify-between mt-4 mb-12">
            <Button variant="outline" size="sm" @click="addWorkflowStep">
              <template #icon><Plus :size="14" /></template>
              Add step
            </Button>
            <Button variant="primary" size="sm" @click="runWorkflowAll">
              <template #icon><Wand2 :size="14" /></template>
              Run workflow
            </Button>
          </div>
        </div>

        <!-- Output lightbox -->
        <div v-if="workflowLightbox" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-8" @click="workflowLightbox = null">
          <button class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center" @click.stop="workflowLightbox = null">
            <X :size="20" />
          </button>
          <img :src="workflowLightbox" class="max-w-full max-h-full rounded-xl shadow-2xl" @click.stop />
        </div>

        <!-- Workflow product detail view (per-step preview + regenerate) -->
        <div v-if="wfDetailProduct">
          <!-- Header: back + product name on left, ignore + position + prev/next on right -->
          <div class="flex items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-2 min-w-0">
              <Button variant="ghost" size="sm" :icon-only="true" @click="closeWfDetail">
                <template #icon><ArrowLeft :size="16" /></template>
              </Button>
              <h1 class="text-2xl font-semibold text-om-gray-700 truncate">{{ wfDetailProduct.name }}</h1>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <Button variant="secondary" size="sm" @click="wfToggleIgnore(wfDetailProduct)">
                <template #icon>
                  <Eye v-if="wfIsIgnored(wfDetailProduct.id)" :size="14" />
                  <EyeOff v-else :size="14" />
                </template>
                {{ wfIsIgnored(wfDetailProduct.id) ? 'Restore' : 'Ignore' }}
              </Button>
              <span v-if="wfDetailIndex >= 0" class="text-sm text-om-gray-400 tabular-nums ml-2">{{ wfDetailIndex + 1 }} / {{ wfProductsWithResults.length }}</span>
              <Button variant="secondary" size="sm" :disabled="!wfHasPrev" @click="wfGoPrev">
                <template #icon><ChevronLeft :size="14" /></template>
                Previous
              </Button>
              <Button variant="secondary" size="sm" :disabled="!wfHasNext" @click="wfGoNext">
                Next
                <ChevronRight :size="14" />
              </Button>
            </div>
          </div>

          <!-- Original product card (shown once at the top) -->
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5 mb-6 flex items-center gap-4">
            <div class="w-24 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200">
              <img src="/product1.jpg" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase mb-1">Original Product</p>
              <h3 class="text-sm font-semibold text-om-gray-700 truncate">{{ wfDetailProduct.name }}</h3>
              <div class="flex items-center gap-4 mt-1">
                <span class="text-xs text-om-gray-400">SKU: OM-7-SE</span>
                <span class="text-sm font-semibold text-om-gray-700">$159.00</span>
              </div>
            </div>
          </div>

          <!-- Per-step blocks: generated content on top, prompt editor below -->
          <div v-for="(step, i) in workflowSteps" :key="step.id" class="mb-8">
            <!-- Step label -->
            <p class="text-xs font-semibold tracking-widest text-om-gray-400 uppercase flex items-center gap-1.5 mb-3">
              <Wand2 :size="16" class="text-om-orange-400" />
              Step {{ i + 1 }} · {{ stepOutputName(step, i) }}
            </p>

            <!-- Generated output (image: 500px, text: auto with min-height) -->
            <div
              class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden relative mb-3"
              :style="isImageModel(step.model) ? 'height: 500px;' : 'min-height: 120px;'"
            >
              <!-- Regenerating overlay -->
              <template v-if="wfStepIsRegenerating(wfDetailProduct.id, i)">
                <div class="w-full h-full flex flex-col items-center justify-center gap-3 py-12">
                  <Loader2 :size="40" class="animate-spin text-om-orange-500" />
                  <p class="text-sm text-om-gray-500">Regenerating Step {{ i + 1 }}...</p>
                </div>
              </template>
              <!-- Image step output -->
              <template v-else-if="wfStepHasOutputs(wfDetailProduct.id, i) && isImageModel(step.model)">
                <div
                  class="w-full h-full p-4 grid gap-4"
                  :class="wfStepGetOutputs(wfDetailProduct.id, i).length > 1 ? 'grid-cols-2' : 'grid-cols-1'"
                >
                  <div
                    v-for="(out, idx) in wfStepGetOutputs(wfDetailProduct.id, i)"
                    :key="idx"
                    class="bg-om-gray-50 rounded-xl overflow-hidden flex items-center justify-center"
                  >
                    <img :src="out.src" class="max-w-full max-h-full object-contain" :class="wfIsIgnored(wfDetailProduct.id) ? 'blur-[2px] grayscale' : ''" />
                  </div>
                </div>
                <div v-if="wfIsIgnored(wfDetailProduct.id)" class="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                  <EyeOff :size="40" class="text-white" />
                </div>
              </template>
              <!-- Text step output -->
              <template v-else-if="wfStepHasOutputs(wfDetailProduct.id, i) && !isImageModel(step.model)">
                <div class="w-full p-5 flex flex-col gap-3">
                  <div
                    v-for="(out, idx) in wfStepGetOutputs(wfDetailProduct.id, i)"
                    :key="idx"
                    class="bg-om-gray-50 rounded-xl p-4 text-sm text-om-gray-700 whitespace-pre-line"
                  >{{ out.value }}</div>
                </div>
              </template>
              <!-- Pending -->
              <template v-else>
                <div class="w-full flex flex-col items-center justify-center gap-2 py-12">
                  <Clock :size="28" class="text-om-gray-300" />
                  <p class="text-sm text-om-gray-400">Pending generation</p>
                </div>
              </template>
            </div>

            <!-- Prompt editor + Regenerate -->
            <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-4">
              <div class="flex items-start justify-between mb-2 gap-3">
                <div class="min-w-0">
                  <h3 class="text-sm font-semibold text-om-gray-700">Instructions</h3>
                  <p class="text-xs text-om-gray-400 mt-0.5">Edit the prompt above to customize the generation. Changes will require regenerating the preview.</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  :disabled="wfStepIsRegenerating(wfDetailProduct.id, i)"
                  @click="regenerateWfStep(wfDetailProduct.id, i)"
                >
                  <template #icon>
                    <Loader2 v-if="wfStepIsRegenerating(wfDetailProduct.id, i)" :size="13" class="animate-spin" />
                    <Sparkles v-else :size="13" />
                  </template>
                  {{ wfStepIsRegenerating(wfDetailProduct.id, i) ? 'Regenerating…' : 'Regenerate' }}
                </Button>
              </div>
              <textarea
                :value="wfStepGetPrompt(wfDetailProduct.id, i)"
                @input="wfStepSetPrompt(wfDetailProduct.id, i, $event.target.value)"
                rows="3"
                class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Text Presets screen -->
      <div v-else-if="showTextPresets" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-new')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
<span>New Variable</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Preset</span>
          </nav>
        </div>
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Choose a Preset</h1>
        <p class="text-sm text-om-gray-500 mb-8">Select the type of text content you want to generate for your products.</p>

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
            <p class="text-sm text-om-gray-500 flex-1 mb-3">{{ preset.description }}</p>
            <div class="flex flex-col gap-1.5 mt-auto items-start">
              <Tag>
                <template #icon><Cpu :size="14" class="text-om-gray-400" /></template>
                {{ preset.model }}
              </Tag>
              <Tag variant="orange">
                <template #icon><Coins :size="14" class="text-om-orange-400" /></template>
                {{ preset.credits }} credits/image
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New Variable screen -->
      <div v-else-if="showCreate" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
<span class="text-om-gray-600 font-medium">New Variable</span>
          </nav>
        </div>
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-1">Create New Variable</h1>
        <p class="text-sm text-om-gray-500 mb-10">What type of content do you want to generate?</p>

        <!-- Type cards -->
        <div class="flex justify-center items-center min-h-[50vh]">
        <div class="flex gap-6 items-stretch">
          <!-- AI Text -->
          <div class="group bg-white rounded-xl border-2 border-om-gray-200 p-6 w-96 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200 flex flex-col" @click="emit('navigate', 'ai-texts-images-v2-text-presets')">
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
            class="group bg-white rounded-xl border-2 border-om-gray-200 p-6 w-96 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200 flex flex-col"
            @click="emit('navigate', 'ai-texts-images-v2-presets')"
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

          <!-- AI Workflow -->
          <div
            class="group bg-white rounded-xl border-2 border-om-gray-200 p-6 w-96 cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200 flex flex-col"
            @click="emit('navigate', 'ai-texts-images-v2-workflow-presets')"
          >
            <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <Workflow :size="18" class="text-purple-500" />
            </div>
            <h2 class="text-lg font-semibold text-om-gray-700 mb-2">AI Workflow</h2>
            <p class="text-sm text-om-gray-500 flex-1">Chain multiple steps where each uses the previous output as input — e.g. generate mobile and desktop variants of the same image.</p>
            <div class="flex justify-end mt-4">
              <ArrowRight :size="16" class="text-om-gray-400 group-hover:arrow-bounce" />
            </div>
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
          <!-- Toolbar -->
          <div class="flex items-center justify-between mb-4">
            <!-- Left: search + filters -->
            <div class="flex items-center gap-2">
              <div class="relative">
                <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-700" />
                <input v-model="genSearch" type="text" placeholder="Search products..." class="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-om-gray-200 bg-white text-om-gray-700 placeholder-om-gray-400 outline-none focus:border-om-gray-400 w-44" />
              </div>
              <div class="relative">
                <Button variant="secondary" size="sm" @click="cpShowFilters = !cpShowFilters">
                  <template #icon><SlidersHorizontal :size="15" /></template>
                  Filters
                </Button>
                <div v-if="cpShowFilters" class="absolute top-full left-0 mt-2 bg-white border border-om-gray-200 rounded-xl shadow-lg p-4 z-20 flex flex-col gap-4 w-80">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-om-gray-500">Category is</span>
                    <MultiSelect v-model="cpCategoryIs" :options="cpCategoryOptions" placeholder="All categories" />
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-om-gray-500">Category is not</span>
                    <MultiSelect v-model="cpCategoryIsNot" :options="cpCategoryOptions" placeholder="All categories" />
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
              <div class="relative">
                <Button variant="secondary" size="sm" @click="cpSortOpen = !cpSortOpen">
                  {{ cpSortOptions.find(o => o.value === cpSortBy)?.label }}
                </Button>
                <div v-if="cpSortOpen" class="fixed inset-0 z-10" @click="cpSortOpen = false" />
                <div
                  v-if="cpSortOpen"
                  class="absolute left-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[180px]"
                >
                  <button
                    v-for="opt in cpSortOptions"
                    :key="opt.value"
                    @click="cpSortBy = opt.value; cpSortOpen = false"
                    class="w-full text-left text-sm text-[#23262A] px-3 py-1.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                    :class="cpSortBy === opt.value ? 'bg-[#F1F2F4] font-medium' : ''"
                  >
                    {{ opt.label }}
                    <Check v-if="cpSortBy === opt.value" :size="16" class="text-om-gray-500 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
            <!-- Right: generate -->
            <div class="flex items-center gap-2">
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
                    class="w-full flex items-center justify-between px-4 py-3 text-sm border-b border-om-gray-100 transition-colors"
                    :class="genSelected.length > 0 ? 'hover:bg-om-gray-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                    :disabled="genSelected.length === 0"
                    @click="genSelected.length > 0 && triggerGenerate([...genSelected])"
                  >
                    <span class="text-om-gray-700 text-left">Generate for selected ({{ genSelected.length }})</span>
                    <span class="flex items-center gap-1.5 font-medium ml-8 tabular-nums whitespace-nowrap" :class="genSelected.length > 0 ? 'text-om-orange-500' : 'text-om-gray-400'">
                      <Coins :size="13" />
                      {{ genSelectedCredits }}
                    </span>
                  </button>
                  <button
                    v-for="opt in genMenuOptions"
                    :key="opt.count"
                    class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer"
                    :class="opt.count !== genMenuOptions[genMenuOptions.length - 1].count ? 'border-b border-om-gray-100' : ''"
                    @click="triggerGenerate"
                  >
                    <span class="text-om-gray-700 text-left">Generate for {{ opt.count }} products</span>
                    <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-8 tabular-nums whitespace-nowrap">
                      <Coins :size="13" />
                      {{ opt.credits }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Entry count -->
          <p class="text-sm text-om-gray-400 mb-3">Showing {{ (genPage - 1) * genPerPage + 1 }} to {{ Math.min(genPage * genPerPage, genProducts.length) }} of {{ genProducts.length }} entries</p>

          <!-- Product cards -->
          <div class="flex flex-col gap-3">
            <div
              v-for="product in genProductsPaged"
              :key="product.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
              @click="openProductModal(product)"
            >
              <!-- Checkbox -->
              <div class="flex items-center pr-3 shrink-0" @click.stop>
                <Checkbox :model-value="genSelected.includes(product.id)" @update:model-value="v => v ? genSelected.push(product.id) : genSelected.splice(genSelected.indexOf(product.id), 1)" />
              </div>
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
          <!-- Pagination -->
          <div class="flex items-center justify-between px-1 py-4 mt-2 border-t border-om-gray-100">
            <span class="text-sm text-om-gray-400">Showing {{ (genPage - 1) * genPerPage + 1 }} to {{ Math.min(genPage * genPerPage, genProducts.length) }} of {{ genProducts.length }} entries</span>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" :disabled="genPage === 1" @click="genPage--">Previous</Button>
              <template v-for="p in genTotalPages" :key="p">
                <Button v-if="p <= 3 || p === genTotalPages" variant="ghost" size="sm" :active="p === genPage" @click="genPage = p">{{ p }}</Button>
                <span v-else-if="p === 4 && genTotalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
              </template>
              <Button variant="ghost" size="sm" :disabled="genPage === genTotalPages" @click="genPage++">Next</Button>
            </div>
          </div>
        </div>

        <!-- Generated tab content -->
        <div v-else-if="genTab === 'generated'">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-om-gray-700">Generated image available for: {{ genProducts.filter(p => p.status === 'generated').length }} products</span>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="product in genProductsGeneratedPaged"
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
          <!-- Pagination -->
          <div v-if="genGeneratedTotalPages > 1" class="flex items-center justify-between px-1 py-4 mt-2 border-t border-om-gray-100">
            <span class="text-sm text-om-gray-400">Showing {{ (genGeneratedPage - 1) * genPerPage + 1 }} to {{ Math.min(genGeneratedPage * genPerPage, genProductsGenerated.length) }} of {{ genProductsGenerated.length }} entries</span>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" :disabled="genGeneratedPage === 1" @click="genGeneratedPage--">Previous</Button>
              <template v-for="p in genGeneratedTotalPages" :key="p">
                <Button v-if="p <= 3 || p === genGeneratedTotalPages" variant="ghost" size="sm" :active="p === genGeneratedPage" @click="genGeneratedPage = p">{{ p }}</Button>
                <span v-else-if="p === 4 && genGeneratedTotalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
              </template>
              <Button variant="ghost" size="sm" :disabled="genGeneratedPage === genGeneratedTotalPages" @click="genGeneratedPage++">Next</Button>
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
                  class="w-full flex items-center justify-between px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer"
                  @click="showSaveMenu = false"
                >
                  <span class="whitespace-nowrap">Save &amp; regenerate 1 product</span>
                  <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-4 tabular-nums whitespace-nowrap">
                    <Coins :size="13" />
                    20 credits
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm text-om-gray-500">Edit the prompt to customize the generation output. Save it as a new variable, or overwrite the already generated images with the updated settings.</p>
            </div>
            <textarea
              v-model="promptText"
              rows="3"
              class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
            />
            <div class="flex justify-end mt-2">
              <Button v-if="!showAdvanced" variant="ghost" size="sm" @click="showAdvanced = true">
                Advanced Settings <ChevronDown :size="14" />
              </Button>
            </div>

            <!-- Advanced Settings panel -->
            <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">
              <div class="grid grid-cols-2 gap-3 items-stretch">
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 min-w-0 flex items-end gap-3">
                  <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <p class="text-xs text-om-gray-500">Model</p>
                    <Dropdown v-model="promptModel" :options="modelOptions" size="sm" />
                  </div>
                  <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <p class="text-xs text-om-gray-500">Ratio</p>
                    <Dropdown v-model="promptRatio" :options="ratioOptions" size="sm" />
                  </div>
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <p class="text-xs text-om-gray-500">Usage location</p>
                  <div class="grid grid-cols-2 mt-0.5">
                    <RadioButton v-model="pageType" value="product" label="Product page" />
                    <RadioButton v-model="pageType" value="popup" label="Popup/Embedded" />
                  </div>
                </div>
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <p class="text-xs text-om-gray-500">Available data sources</p>
                <div class="flex flex-wrap gap-1.5">
                  <Tag v-for="src in dataSources" :key="src" variant="orange">{{ src }}</Tag>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 items-stretch">
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                  <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                  <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white shrink-0" />
                </div>
              </div>
              <div class="flex justify-end">
                <Button variant="ghost" size="sm" @click="showAdvanced = false">Basic Settings <ChevronUp :size="14" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generation Product screen -->
      <div v-else-if="showGenerationProduct && selectedProduct" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-generation')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
        </div>
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-4">{{ selectedProduct.name }}</h1>
        <div>
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
                          <div v-if="promptChanged" class="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                            <Button variant="primary" size="md" @click="regenerateProduct">
                              <template #icon><Sparkles :size="14" /></template>
                              Regenerate
                            </Button>
                            <div class="flex items-center gap-1.5 mt-3 text-sm font-medium text-white">
                              <Coins :size="16" />
                              Costs {{ selectedImagePreset?.credits ?? 15 }} credits
                            </div>
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
                    <Button variant="primary" size="sm" @click="regenerateProduct">
                      <template #icon><Sparkles :size="13" /></template>
                      Regenerate
                    </Button>
                  </div>
                  <textarea
                    v-model="promptText"
                    rows="3"
                    class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
                  />
                  <!-- {{ showAdvanced ? 'Basic Settings' : 'Advanced Settings' }} panel -->
                  <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">
                    <div class="grid grid-cols-2 gap-3 items-stretch">
                      <!-- Col 1: Model + Ratio tags -->
                      <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                          <Tag>Model: {{ promptModel }}</Tag>
                          <Tag>Ratio: {{ promptRatio }}</Tag>
                        </div>
                      </div>
                      <!-- Col 2: Usage location -->
                      <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                        <p class="text-xs text-om-gray-500">Usage location</p>
                        <div class="grid grid-cols-2 mt-0.5">
                          <RadioButton v-model="pageType" value="product" label="Product page" />
                          <RadioButton v-model="pageType" value="popup" label="Popup/Embedded" />
                        </div>
                      </div>
                    </div>
                    <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                      <p class="text-xs text-om-gray-500">Available data sources</p>
                      <div class="flex flex-wrap gap-1.5">
                        <Tag v-for="src in dataSources" :key="src" variant="orange">{{ src }}</Tag>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 items-stretch">
                      <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                        <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                        <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
                      </div>
                      <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                        <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                        <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white shrink-0" />
                      </div>
                    </div>
                    <!-- Source images: separate block at bottom -->
                    <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                      <p class="text-xs text-om-gray-500">Source images</p>
                      <div class="flex gap-2 flex-wrap">
                        <div
                          v-for="img in availableSourceImages"
                          :key="img.id"
                          class="relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-150 shrink-0"
                          :class="sourceImageSelected(img.id) ? 'border-om-orange-500 shadow-[0_0_0_2px_#FBD9CE]' : 'border-om-gray-200 hover:border-om-gray-300'"
                          @click="toggleSourceImage(img)"
                        >
                          <img :src="img.src" class="w-full h-full object-cover" />
                          <div v-if="sourceImageSelected(img.id)" class="absolute top-1 right-1 w-4 h-4 rounded-full bg-om-orange-500 flex items-center justify-center">
                            <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-end mt-3">
                    <Button variant="ghost" size="sm" @click="showAdvanced = !showAdvanced">{{ showAdvanced ? 'Basic Settings' : 'Advanced Settings' }} <component :is="showAdvanced ? ChevronUp : ChevronDown" :size="14" /></Button>
                  </div>
                </div>
        </div>

      </div>

      <!-- Text Preview screen -->
      <div v-else-if="showTextPreview" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-text-presets')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
<span>New Variable</span>
            <span class="text-om-gray-300">›</span>
            <span>Preset</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Preview</span>
          </nav>
        </div>
        <!-- Title + action -->
        <div class="flex items-center justify-between mb-1">
          <h1 class="text-2xl font-semibold text-om-gray-700">Preview Generation</h1>
          <Button variant="primary" size="md" @click="triggerGenBanner(); emit('navigate', 'ai-texts-images-v2-text-generation')">Next</Button>
        </div>
        <p class="text-sm text-om-gray-500 mb-6">Test your selected text type and adjust the prompt before applying to your catalogue.</p>

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
                  <div class="flex items-center gap-1.5 mt-3 text-sm font-medium text-om-orange-500">
                    <Coins :size="16" />
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
          </div>
          <textarea
            v-model="textPromptText"
            rows="3"
            class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
          />
          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-om-gray-400">Edit the prompt above to customize the generation. Changes will require regenerating the preview.</p>
            <Button v-if="!showAdvanced" variant="ghost" size="sm" class="shrink-0 ml-4" @click="showAdvanced = true">Advanced Settings <ChevronDown :size="14" /></Button>
          </div>
          <!-- Advanced Settings panel -->
          <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">
            <div class="grid grid-cols-2 gap-3 items-stretch">
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 min-w-0">
                <div class="flex flex-col gap-1">
                  <p class="text-xs text-om-gray-500">Model</p>
                  <Dropdown v-model="promptModel" :options="modelOptions" size="sm" />
                </div>
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <p class="text-xs text-om-gray-500">Usage location</p>
                <div class="grid grid-cols-2 mt-0.5">
                  <RadioButton v-model="pageType" value="product" label="Product page" />
                  <RadioButton v-model="pageType" value="popup" label="Popup/Embedded" />
                </div>
              </div>
            </div>
            <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
              <p class="text-xs text-om-gray-500">Available data sources</p>
              <div class="flex flex-wrap gap-1.5">
                <Tag v-for="src in dataSources" :key="src" variant="orange">{{ src }}</Tag>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white shrink-0" />
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <span class="text-xs text-om-gray-500">Use product image as context</span>
                <ToggleSwitch v-model="useProductImage" class="shrink-0" />
              </div>
            </div>
            <div class="flex justify-end">
              <Button variant="ghost" size="sm" @click="showAdvanced = false">Basic Settings <ChevronUp :size="14" /></Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Generation screen -->
      <div v-else-if="showTextGeneration" class="w-full max-w-[1400px] mx-auto -mt-3">
        <h1 class="text-2xl font-semibold text-om-gray-700 mb-4">{{ selectedTextPreset?.name ?? 'Text Generation' }}</h1>

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
              <span class="text-sm font-semibold text-om-gray-700">{{ textGenProducts.length }} products</span>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="md" @click="emit('navigate', 'ai-texts-images-v2-add-products')">Add more products</Button>
              <div class="relative">
                <Button variant="primary" size="md" @click.stop="showTextGenMenu = !showTextGenMenu">
                  Generate
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </Button>
                <div v-if="showTextGenMenu" class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-om-gray-100 z-50 min-w-[360px] overflow-hidden">
                  <!-- Generate for selected -->
                  <button
                    class="w-full flex items-center justify-between px-4 py-3 text-sm border-b border-om-gray-100 transition-colors"
                    :class="textGenSelected.length > 0 ? 'hover:bg-om-gray-50 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
                    :disabled="textGenSelected.length === 0"
                    @click="textGenSelected.length > 0 && triggerTextGenerate()"
                  >
                    <span class="text-om-gray-700 text-left">Generate for selected ({{ textGenSelected.length }})</span>
                    <span class="flex items-center gap-1.5 font-medium ml-8 tabular-nums whitespace-nowrap" :class="textGenSelected.length > 0 ? 'text-om-orange-500' : 'text-om-gray-400'">
                      <Coins :size="13" />
                      {{ textGenSelectedCredits }}
                    </span>
                  </button>
                  <button
                    v-for="opt in textGenMenuOptions"
                    :key="opt.count"
                    class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-om-gray-50 transition-colors cursor-pointer"
                    :class="opt.count !== textGenMenuOptions[textGenMenuOptions.length - 1].count ? 'border-b border-om-gray-100' : ''"
                    @click="triggerTextGenerate"
                  >
                    <span class="text-om-gray-700 text-left">Generate for {{ opt.count }} products</span>
                    <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-8 tabular-nums whitespace-nowrap">
                      <Coins :size="13" />
                      {{ opt.credits }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="product in textGenProductsPaged"
              :key="product.id"
              class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 flex items-stretch gap-0 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow"
            >
              <!-- Checkbox -->
              <div class="flex items-center pr-3 shrink-0" @click.stop>
                <Checkbox :model-value="textGenSelected.includes(product.id)" @update:model-value="v => v ? textGenSelected.push(product.id) : textGenSelected.splice(textGenSelected.indexOf(product.id), 1)" />
              </div>
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
          <!-- Pagination -->
          <div class="flex items-center justify-between px-1 py-4 mt-2 border-t border-om-gray-100">
            <span class="text-sm text-om-gray-400">Showing {{ (textGenPage - 1) * textGenPerPage + 1 }} to {{ Math.min(textGenPage * textGenPerPage, textGenProducts.length) }} of {{ textGenProducts.length }} entries</span>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" :disabled="textGenPage === 1" @click="textGenPage--">Previous</Button>
              <template v-for="p in textGenTotalPages" :key="p">
                <Button v-if="p <= 3 || p === textGenTotalPages" variant="ghost" size="sm" :active="p === textGenPage" @click="textGenPage = p">{{ p }}</Button>
                <span v-else-if="p === 4 && textGenTotalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
              </template>
              <Button variant="ghost" size="sm" :disabled="textGenPage === textGenTotalPages" @click="textGenPage++">Next</Button>
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
              v-for="product in textGenProductsGeneratedPaged"
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
          <!-- Pagination -->
          <div v-if="textGenGeneratedTotalPages > 1" class="flex items-center justify-between px-1 py-4 mt-2 border-t border-om-gray-100">
            <span class="text-sm text-om-gray-400">Showing {{ (textGenGeneratedPage - 1) * textGenPerPage + 1 }} to {{ Math.min(textGenGeneratedPage * textGenPerPage, textGenProductsGenerated.length) }} of {{ textGenProductsGenerated.length }} entries</span>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" :disabled="textGenGeneratedPage === 1" @click="textGenGeneratedPage--">Previous</Button>
              <template v-for="p in textGenGeneratedTotalPages" :key="p">
                <Button v-if="p <= 3 || p === textGenGeneratedTotalPages" variant="ghost" size="sm" :active="p === textGenGeneratedPage" @click="textGenGeneratedPage = p">{{ p }}</Button>
                <span v-else-if="p === 4 && textGenGeneratedTotalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
              </template>
              <Button variant="ghost" size="sm" :disabled="textGenGeneratedPage === textGenGeneratedTotalPages" @click="textGenGeneratedPage++">Next</Button>
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
                <button class="w-full flex items-center justify-between px-4 py-3 text-sm text-om-gray-700 hover:bg-om-gray-50 transition-colors cursor-pointer" @click="showTextSaveMenu = false">
                  <span class="whitespace-nowrap">Save &amp; regenerate 1 product</span>
                  <span class="flex items-center gap-1.5 text-om-orange-500 font-medium ml-4 tabular-nums whitespace-nowrap">
                    <Coins :size="13" />
                    2 credits
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm text-om-gray-500">Edit the prompt to customize the text generation output. Save it as a new variable, or overwrite the already generated texts with the updated settings.</p>
            </div>
            <textarea
              v-model="promptText"
              rows="4"
              class="w-full text-sm text-om-gray-700 border border-om-gray-200 rounded-lg p-3 resize-none outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all"
              placeholder="Write a benefit list for the following product: {product_name}. Focus on {product_description}."
            />
            <div class="flex justify-end mt-2">
              <Button v-if="!showAdvanced" variant="ghost" size="sm" @click="showAdvanced = true">
                Advanced Settings <ChevronDown :size="14" />
              </Button>
            </div>
            <!-- Advanced Settings panel -->
            <div v-if="showAdvanced" class="mt-4 pt-4 border-t border-om-gray-100 flex flex-col gap-3">
              <div class="grid grid-cols-2 gap-3 items-stretch">
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 min-w-0">
                  <div class="flex flex-col gap-1">
                    <p class="text-xs text-om-gray-500">Model</p>
                    <Dropdown v-model="promptModel" :options="modelOptions" size="sm" />
                  </div>
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                  <p class="text-xs text-om-gray-500">Usage location</p>
                  <div class="grid grid-cols-2 mt-0.5">
                    <RadioButton v-model="pageType" value="product" label="Product page" />
                    <RadioButton v-model="pageType" value="popup" label="Popup/Embedded" />
                  </div>
                </div>
              </div>
              <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2">
                <p class="text-xs text-om-gray-500">Available data sources</p>
                <div class="flex flex-wrap gap-1.5">
                  <Tag v-for="src in dataSources" :key="src" variant="orange">{{ src }}</Tag>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Auto-generate prompt variables for products with missing data</span>
                  <ToggleSwitch v-model="autoGenerate" class="shrink-0" />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Minimum description length (character)</span>
                  <input v-model="minDescLength" type="number" min="0" class="w-16 text-sm text-om-gray-700 border border-om-gray-200 rounded-lg px-2 py-1 outline-none focus:border-om-orange-300 focus:shadow-[0_0_0_2px_#FBD9CE] transition-all text-right bg-white shrink-0" />
                </div>
                <div class="bg-om-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span class="text-xs text-om-gray-500">Use product image as context</span>
                  <ToggleSwitch v-model="useProductImage" class="shrink-0" />
                </div>
              </div>
              <div class="flex justify-end">
                <Button variant="ghost" size="sm" @click="showAdvanced = false">Basic Settings <ChevronUp :size="14" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Choose Products screen -->
      <div v-else-if="showChooseProducts" class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', cpFromText ? 'ai-texts-images-v2-text-preview' : 'ai-texts-images-v2-preview')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
            <span>New Variable</span>
            <span class="text-om-gray-300">›</span>
            <span>Preset</span>
            <span class="text-om-gray-300">›</span>
            <span>Preview</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Choose Products</span>
          </nav>
        </div>
        <!-- Title + action -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-om-gray-700">Choose Products</h1>
          <div class="flex items-center gap-3">
            <span class="text-sm text-om-gray-400">{{ cpSortedProducts.length }} products selected</span>
            <Button variant="primary" size="md" @click="triggerGenBanner(); emit('navigate', cpFromText ? 'ai-texts-images-v2-text-generation' : 'ai-texts-images-v2-generation')">Save Variable</Button>
          </div>
        </div>


        <!-- Filters -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-700" />
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
                  <MultiSelect v-model="cpCategoryIs" :options="cpCategoryOptions" placeholder="All categories" />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-om-gray-500">Category is not</span>
                  <MultiSelect v-model="cpCategoryIsNot" :options="cpCategoryOptions" placeholder="All categories" />
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
          <div class="relative flex items-center gap-2">
            <Button variant="ghost" size="sm" icon-only :class="cpSortOpen ? '!bg-[#505763]/10' : ''" @click="cpSortOpen = !cpSortOpen">
              <template #icon><ArrowUpDown :size="15" /></template>
            </Button>
            <div v-if="cpSortOpen" class="fixed inset-0 z-10" @click="cpSortOpen = false" />
            <div
              v-if="cpSortOpen"
              class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[180px]"
            >
              <button
                v-for="opt in cpSortOptions"
                :key="opt.value"
                @click="cpSortBy = opt.value; cpSortOpen = false"
                class="w-full text-left text-sm text-[#23262A] px-3 py-1.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                :class="cpSortBy === opt.value ? 'bg-[#F1F2F4] font-medium' : ''"
              >
                {{ opt.label }}
                <Check v-if="cpSortBy === opt.value" :size="16" class="text-om-gray-500 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden">
          <!-- Table header -->
          <div class="grid grid-cols-[1fr_160px_120px_160px_140px_40px] px-6 h-10 items-center border-b border-[#e3e5e8]">
            <span class="text-[13px] font-normal text-om-gray-500">Product</span>
            <span class="text-[13px] font-normal text-om-gray-500">SKU</span>
            <span class="text-[13px] font-normal text-om-gray-500">Price</span>
            <span class="text-[13px] font-normal text-om-gray-500">Popularity</span>
            <span class="text-[13px] font-normal text-om-gray-500">Last Updated</span>
            <span></span>
          </div>

          <!-- Rows -->
          <div
            v-for="(product, index) in cpSortedProducts"
            :key="product.id"
            class="grid grid-cols-[1fr_160px_120px_160px_140px_40px] px-6 py-2.5 items-center hover:bg-om-gray-50 transition-colors"
            :class="index < cpSortedProducts.length - 1 ? 'border-b border-om-gray-100' : ''"
          >
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
            <span class="text-sm text-om-gray-400">Showing 1 to {{ cpSortedProducts.length }} of {{ cpSortedProducts.length }} entries</span>
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
        <!-- Back + pathway -->
        <div class="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" :icon-only="true" @click="emit('navigate', 'ai-texts-images-v2-generation')">
            <template #icon><ArrowLeft :size="16" /></template>
          </Button>
          <nav class="flex items-center gap-1.5 text-sm text-om-gray-400">
<span>Generation</span>
            <span class="text-om-gray-300">›</span>
            <span class="text-om-gray-600 font-medium">Add Products</span>
          </nav>
        </div>
        <!-- Title + Done -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold text-om-gray-700">Add Products</h1>
          <div class="flex items-center gap-3">
            <span class="text-sm text-om-gray-400">{{ cpSortedProducts.length }} products selected</span>
            <Button variant="primary" size="md" @click="emit('navigate', 'ai-texts-images-v2-generation')">Select products</Button>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="relative">
              <Search :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-700" />
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
                  <MultiSelect v-model="cpCategoryIs" :options="cpCategoryOptions" placeholder="All categories" />
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-xs text-om-gray-500">Category is not</span>
                  <MultiSelect v-model="cpCategoryIsNot" :options="cpCategoryOptions" placeholder="All categories" />
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
          <div class="relative flex items-center gap-2">
            <Button variant="ghost" size="sm" icon-only :class="cpSortOpen ? '!bg-[#505763]/10' : ''" @click="cpSortOpen = !cpSortOpen">
              <template #icon><ArrowUpDown :size="15" /></template>
            </Button>
            <div v-if="cpSortOpen" class="fixed inset-0 z-10" @click="cpSortOpen = false" />
            <div
              v-if="cpSortOpen"
              class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg overflow-hidden min-w-[180px]"
            >
              <button
                v-for="opt in cpSortOptions"
                :key="opt.value"
                @click="cpSortBy = opt.value; cpSortOpen = false"
                class="w-full text-left text-sm text-[#23262A] px-3 py-1.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between"
                :class="cpSortBy === opt.value ? 'bg-[#F1F2F4] font-medium' : ''"
              >
                {{ opt.label }}
                <Check v-if="cpSortBy === opt.value" :size="16" class="text-om-gray-500 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="grid grid-cols-[1fr_160px_120px_160px_140px_40px] px-6 h-10 items-center border-b border-[#e3e5e8]">
            <span class="text-[13px] font-normal text-om-gray-500">Product</span>
            <span class="text-[13px] font-normal text-om-gray-500">SKU</span>
            <span class="text-[13px] font-normal text-om-gray-500">Price</span>
            <span class="text-[13px] font-normal text-om-gray-500">Popularity</span>
            <span class="text-[13px] font-normal text-om-gray-500">Last Updated</span>
            <span></span>
          </div>

          <div
            v-for="(product, index) in cpSortedProductsPaged"
            :key="product.id"
            class="grid grid-cols-[1fr_160px_120px_160px_140px_40px] px-6 py-2.5 items-center hover:bg-om-gray-50 transition-colors"
            :class="index < cpSortedProductsPaged.length - 1 ? 'border-b border-om-gray-100' : ''"
          >
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
            <span class="text-sm text-om-gray-400">Showing {{ (cpPage - 1) * cpPerPage + 1 }} to {{ Math.min(cpPage * cpPerPage, cpSortedProducts.length) }} of {{ cpSortedProducts.length }} entries</span>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" :disabled="cpPage === 1" @click="cpPage--">Previous</Button>
              <template v-for="p in cpTotalPages" :key="p">
                <Button v-if="p <= 3 || p === cpTotalPages" variant="ghost" size="sm" :active="p === cpPage" @click="cpPage = p">{{ p }}</Button>
                <span v-else-if="p === 4 && cpTotalPages > 4" class="px-2 text-sm text-om-gray-400">...</span>
              </template>
              <Button variant="ghost" size="sm" :disabled="cpPage === cpTotalPages" @click="cpPage++">Next</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- List screen -->
      <div v-else class="w-full max-w-[1400px] mx-auto -mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-2xl font-semibold text-om-gray-700">AI Texts &amp; Images</h1>
          <Button variant="primary" size="md" @click="emit('navigate', 'ai-texts-images-v2-new')">New Variable</Button>
        </div>

        <!-- Filters + Search -->
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <Dropdown v-model="selectedDomain" :options="domains" style="width: 230px">
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
                class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out cursor-pointer"
                :class="activeTab === tab.value
                  ? 'bg-om-gray-200 text-om-gray-700'
                  : 'bg-om-gray-100 text-om-gray-700 hover:bg-om-gray-200'"
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <div class="relative">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-om-gray-700" />
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
            @click="item.id === 0 ? emit('navigate', 'ai-texts-images-v2-generation') : item.id === 8 ? (selectedTextPreset = textPresets.find(p => p.id === 'headline-subheadline'), emit('navigate', 'ai-texts-images-v2-text-generation')) : null"
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
      <AddDomainModal v-model="showAddDomainModal" @add="handleNewDomain" />

      <Modal v-model="templateModalOpen" title="Load AI template" size="md" :overflow-visible="true">
        <div class="space-y-3">
          <p class="text-sm text-om-gray-500">Select a template to load its prompt and settings into Step {{ templateModalStepIndex + 1 }}.</p>
          <Dropdown
            v-model="templateModalSelected"
            :options="aiTemplates.map(t => ({ value: t, label: t.name }))"
            placeholder="Select a template..."
          />
          <div v-if="selectedTemplate" class="rounded-lg border border-om-gray-200 bg-om-gray-50 p-3 space-y-2">
            <span class="text-xs font-medium text-om-gray-500">{{ selectedTemplate.model }}<span v-if="selectedTemplate.type === 'Image'"> · {{ selectedTemplate.ratio }}</span></span>
            <p class="text-xs text-om-gray-600 whitespace-pre-line">{{ selectedTemplate.prompt }}</p>
          </div>
        </div>
        <template #footer="{ close }">
          <Button variant="outline" @click="close">Cancel</Button>
          <Button variant="primary" :disabled="!selectedTemplate" @click="applyTemplate">Load template</Button>
        </template>
      </Modal>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { Search, ArrowLeft, ArrowRight, Sparkles, Image as ImageIcon, Cpu, Maximize2, Coins, Wand2, ExternalLink, Type, ArrowUpDown, SlidersHorizontal, Upload, X, Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Workflow, Plus, Play, Loader2, Clock, Eye, EyeOff } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import Button from '../components/shared/Button.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import MultiSelect from '../components/shared/MultiSelect.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import RadioButton from '../components/shared/RadioButton.vue'
import Tag from '../components/shared/Tag.vue'
import AddDomainModal from '../components/shared/AddDomainModal.vue'
import Modal from '../components/shared/Modal.vue'
import { workflowSteps, workflowReferences, newStep } from '../composables/useWorkflowState.js'

const props = defineProps({
  screen: { type: String, default: 'list' },
  embedded: { type: Boolean, default: false },
})
const emit = defineEmits(['menu-click', 'navigate'])

const showCreate = computed(() => props.screen === 'new')
const showImagePresets = computed(() => props.screen === 'image-presets')
const showWorkflowPresets = computed(() => props.screen === 'workflow-presets')
const showWorkflowEditor = computed(() => props.screen === 'workflow-editor')
const showWorkflowGeneration = computed(() => props.screen === 'workflow-generation')
const showPreview = computed(() => props.screen === 'image-preview')
const showChooseProducts = computed(() => props.screen === 'choose-products')
const showGeneration = computed(() => props.screen === 'generation')
const showGenerationProduct = computed(() => props.screen === 'generation-product')
const showAddProducts = computed(() => props.screen === 'add-products')
const showTextPresets = computed(() => props.screen === 'text-presets')
const showTextPreview = computed(() => props.screen === 'text-preview')
const showTextGeneration = computed(() => props.screen === 'text-generation')

watch(() => props.screen, (s) => {
  if (s === 'text-preview') {
    textGenerating.value = false
    textGenerated.value = false
  }
  if (s === 'generation-product') {
    useProductImage.value = true
  }
})

// Generation page state
const genTab = ref('selected')
const genTabs = [
  { value: 'selected', label: 'Choose products' },
  { value: 'generated', label: 'Review' },
  { value: 'settings', label: 'Settings' },
]
const showGenMenu = ref(false)
const showSaveMenu = ref(false)
const showGenBanner = ref(false)
const triggerGenBanner = () => {
  showGenBanner.value = true
  setTimeout(() => { showGenBanner.value = false }, 5000)
}
const genMenuOptions = [
  { count: 1, credits: '20 credits' },
  { count: 10, credits: '200 credits' },
  { count: 25, credits: '500 credits' },
  { count: 100, credits: '2,000 credits' },
]

const genSelected = ref([])
const genSelectedCredits = computed(() => (genSelected.value.length * 20).toLocaleString() + ' credits')

const genProducts = ref([
  { id: 1, name: 'Premium Wireless Headphones', desc: 'Noise-cancelling over-ear headphones with 30-hour battery life.', status: 'generated' },
  { id: 2, name: 'Minimalist Ceramic Mug', desc: 'Handcrafted 12oz ceramic mug with matte finish.', status: 'queued' },
  { id: 3, name: 'Ergonomic Office Chair', desc: 'Adjustable lumbar support and breathable mesh back.', status: 'queued' },
  { id: 4, name: 'Smart Fitness Watch', desc: 'Heart rate monitor, GPS, and water-resistant design.', status: 'queued' },
  { id: 5, name: 'Organic Cotton T-Shirt', desc: '100% organic cotton, ethically sourced and manufactured.', status: 'queued' },
  { id: 6, name: 'Noise-Cancelling Earbuds', desc: 'True wireless earbuds with active noise cancellation.', status: 'queued' },
  { id: 7, name: 'Bamboo Cutting Board', desc: 'Eco-friendly bamboo cutting board with juice groove.', status: 'queued' },
  { id: 8, name: 'Stainless Steel Water Bottle', desc: 'Double-walled insulated bottle, keeps drinks cold 24h.', status: 'queued' },
  { id: 9, name: 'Leather Wallet', desc: 'Slim bifold wallet crafted from genuine full-grain leather.', status: 'queued' },
  { id: 10, name: 'Portable Bluetooth Speaker', desc: 'Waterproof speaker with 360° sound and 12-hour battery.', status: 'queued' },
  { id: 11, name: 'Yoga Mat Pro', desc: 'Non-slip 6mm thick mat with alignment lines.', status: 'queued' },
  { id: 12, name: 'Scented Soy Candle Set', desc: 'Set of 3 hand-poured soy candles, 40-hour burn time each.', status: 'queued' },
  { id: 13, name: 'Mechanical Keyboard', desc: 'Compact TKL layout with Cherry MX switches.', status: 'queued' },
  { id: 14, name: 'Ceramic Plant Pot', desc: 'Handmade ceramic pot with drainage hole, 15cm diameter.', status: 'queued' },
  { id: 15, name: 'Merino Wool Beanie', desc: 'Super-soft 100% merino wool, one size fits all.', status: 'queued' },
  { id: 16, name: 'Wooden Desk Organizer', desc: 'Modular bamboo organizer with removable dividers.', status: 'queued' },
  { id: 17, name: 'Glass Food Storage Set', desc: 'Set of 5 borosilicate glass containers with locking lids.', status: 'queued' },
  { id: 18, name: 'Running Shoes', desc: 'Lightweight mesh upper with responsive foam midsole.', status: 'queued' },
  { id: 19, name: 'Aromatherapy Diffuser', desc: 'Ultrasonic diffuser with 7-color LED and timer.', status: 'queued' },
  { id: 20, name: 'Cast Iron Skillet', desc: '10-inch pre-seasoned cast iron pan for stovetop and oven.', status: 'queued' },
  { id: 21, name: 'Foldable Laptop Stand', desc: 'Adjustable aluminium stand, compatible with all laptops.', status: 'queued' },
  { id: 22, name: 'Reusable Beeswax Wraps', desc: 'Set of 3 natural beeswax food wraps in assorted sizes.', status: 'queued' },
  { id: 23, name: 'Weighted Blanket', desc: '7kg weighted blanket with removable washable cover.', status: 'queued' },
  { id: 24, name: 'Copper Tongue Scraper', desc: 'Ayurvedic pure copper tongue cleaner, pack of 2.', status: 'queued' },
  { id: 25, name: 'Resistance Band Set', desc: '5 levels of resistance bands with door anchor and handles.', status: 'queued' },
  { id: 26, name: 'Linen Throw Pillow', desc: 'Stonewashed linen cover with feather insert, 50×50cm.', status: 'queued' },
  { id: 27, name: 'Pour-Over Coffee Maker', desc: 'Borosilicate glass dripper with wooden collar and lid.', status: 'queued' },
  { id: 28, name: 'Electric Toothbrush', desc: 'Sonic vibration, 3 modes, 30-day battery life.', status: 'queued' },
  { id: 29, name: 'Silk Sleep Mask', desc: '100% mulberry silk mask with adjustable strap.', status: 'queued' },
  { id: 30, name: 'Wooden Chess Set', desc: 'Hand-carved wooden pieces with folding board and storage.', status: 'queued' },
  { id: 31, name: 'Stainless Meal Prep Containers', desc: 'Set of 5 leak-proof containers with locking lids.', status: 'queued' },
  { id: 32, name: 'Foam Roller', desc: 'High-density EVA foam roller, 45cm for muscle recovery.', status: 'queued' },
  { id: 33, name: 'Seed Germination Kit', desc: 'Complete indoor herb garden starter kit with 10 seed varieties.', status: 'queued' },
  { id: 34, name: 'Bamboo Toothbrush Set', desc: 'Pack of 4 biodegradable toothbrushes with charcoal bristles.', status: 'queued' },
  { id: 35, name: 'Smart Plug', desc: 'Wi-Fi enabled outlet with energy monitoring and voice control.', status: 'queued' },
  { id: 36, name: 'Travel Compression Bags', desc: 'Set of 6 roll-up vacuum storage bags for luggage.', status: 'queued' },
  { id: 37, name: 'Marble Phone Stand', desc: 'Natural marble base desktop stand for all smartphones.', status: 'queued' },
  { id: 38, name: 'Cork Yoga Blocks', desc: 'Set of 2 natural cork blocks for alignment and support.', status: 'queued' },
  { id: 39, name: 'Cold Brew Coffee Maker', desc: '1L glass pitcher with mesh filter for smooth cold brew.', status: 'queued' },
  { id: 40, name: 'Blackout Curtains', desc: 'Thermal insulated blackout panels, 140×260cm per panel.', status: 'queued' },
  { id: 41, name: 'Wooden Serving Board', desc: 'Acacia wood charcuterie board with handle, 40×25cm.', status: 'queued' },
  { id: 42, name: 'Portable Charger 20000mAh', desc: 'Slim power bank with USB-C PD fast charging.', status: 'queued' },
  { id: 43, name: 'Linen Apron', desc: 'Natural stonewashed linen apron with adjustable straps.', status: 'queued' },
  { id: 44, name: 'Macramé Wall Hanging', desc: 'Handmade cotton rope wall décor, 60cm wide.', status: 'queued' },
  { id: 45, name: 'Silicone Baking Mat Set', desc: 'Set of 2 non-stick reusable baking sheets.', status: 'queued' },
  { id: 46, name: 'Essential Oil Set', desc: '10 pure essential oils in a bamboo gift box.', status: 'queued' },
  { id: 47, name: 'Adjustable Dumbbell', desc: 'Quick-select 5–25kg adjustable dumbbell, single unit.', status: 'queued' },
  { id: 48, name: 'Ceramic Spice Jars', desc: 'Set of 12 stackable ceramic jars with bamboo lids.', status: 'queued' },
  { id: 49, name: 'Portable Espresso Maker', desc: 'Manual hand-pump espresso for travel, no electricity needed.', status: 'queued' },
  { id: 50, name: 'Knitted Storage Basket', desc: 'Large chunky-knit cotton basket for blankets and toys.', status: 'queued' },
  { id: 51, name: 'UV Sanitiser Box', desc: 'Phone and small item UV-C steriliser with wireless charging.', status: 'queued' },
  { id: 52, name: 'Beeswax Polish', desc: 'Natural beeswax furniture polish with lavender scent.', status: 'queued' },
  { id: 53, name: 'Foldable Tote Bag', desc: 'Ripstop nylon packable tote, 20L capacity.', status: 'queued' },
  { id: 54, name: 'Wooden Laptop Desk', desc: 'Lap desk with cushion and phone slot for sofa use.', status: 'queued' },
])

const genSearch = ref('')
const genPerPage = 10
const genPage = ref(1)
const genGeneratedPage = ref(1)
const genProductsPaged = computed(() => genProducts.value.slice((genPage.value - 1) * genPerPage, genPage.value * genPerPage))
const genProductsGenerated = computed(() => genProducts.value.filter(p => p.status === 'generated'))
const genProductsGeneratedPaged = computed(() => genProductsGenerated.value.slice((genGeneratedPage.value - 1) * genPerPage, genGeneratedPage.value * genPerPage))
const genTotalPages = computed(() => Math.ceil(genProducts.value.length / genPerPage))
const genGeneratedTotalPages = computed(() => Math.ceil(genProductsGenerated.value.length / genPerPage))
watch(genTab, () => { genPage.value = 1; genGeneratedPage.value = 1 })

const selectedProduct = ref(null)

// Source images
const availableSourceImages = [
  { id: 1, src: '/product1.jpg', label: 'Front view' },
  { id: 2, src: '/product2.png', label: 'Side view' },
  { id: 3, src: '/product1.jpg', label: 'Back view' },
  { id: 4, src: '/product2.png', label: 'Detail shot' },
  { id: 5, src: '/product1.jpg', label: 'Lifestyle 1' },
  { id: 6, src: '/product2.png', label: 'Lifestyle 2' },
  { id: 7, src: '/product1.jpg', label: 'Packaging' },
  { id: 8, src: '/product2.png', label: 'In use' },
]
const selectedSourceImages = ref([availableSourceImages[0]])

const sourceImageSelected = (id) => selectedSourceImages.value.some(img => img.id === id)
const toggleSourceImage = (img) => {
  const idx = selectedSourceImages.value.findIndex(i => i.id === img.id)
  if (idx >= 0) selectedSourceImages.value.splice(idx, 1)
  else selectedSourceImages.value.push(img)
}

const modalOriginalPrompt = ref('')
const modalOriginalSettings = ref(null)

const openProductModal = (product) => {
  if (product.status !== 'generated') return
  selectedProduct.value = product
  modalOriginalPrompt.value = promptText.value
  modalOriginalSettings.value = {
    promptModel: promptModel.value,
    promptRatio: promptRatio.value,
    pageType: pageType.value,
    autoGenerate: autoGenerate.value,
    minDescLength: minDescLength.value,
    useProductImage: useProductImage.value,
  }
  emit('navigate', 'ai-texts-images-v2-generation-product')
}

const promptChanged = computed(() => {
  if (promptText.value !== modalOriginalPrompt.value) return true
  if (!modalOriginalSettings.value) return false
  const s = modalOriginalSettings.value
  return (
    promptModel.value !== s.promptModel ||
    promptRatio.value !== s.promptRatio ||
    pageType.value !== s.pageType ||
    autoGenerate.value !== s.autoGenerate ||
    minDescLength.value !== s.minDescLength ||
    useProductImage.value !== s.useProductImage
  )
})

const regenerateProduct = () => {
  if (!selectedProduct.value) return
  const id = selectedProduct.value.id
  modalOriginalPrompt.value = promptText.value
  modalOriginalSettings.value = {
    promptModel: promptModel.value,
    promptRatio: promptRatio.value,
    pageType: pageType.value,
    autoGenerate: autoGenerate.value,
    minDescLength: minDescLength.value,
    useProductImage: useProductImage.value,
  }
  genProducts.value = genProducts.value.map(p => p.id === id ? { ...p, status: 'generating' } : p)
  selectedProduct.value = { ...selectedProduct.value, status: 'generating' }
  setTimeout(() => {
    genProducts.value = genProducts.value.map(p => p.id === id ? { ...p, status: 'generated' } : p)
    selectedProduct.value = { ...selectedProduct.value, status: 'generated' }
  }, 2000)
}

const triggerGenerate = (ids) => {
  showGenMenu.value = false
  const toGenerate = Array.isArray(ids)
    ? genProducts.value.filter(p => ids.includes(p.id)).map(p => p.id)
    : genProducts.value.filter(p => p.status === 'queued').map(p => p.id)
  genProducts.value = genProducts.value.map(p => toGenerate.includes(p.id) ? { ...p, status: 'generating' } : p)
  toGenerate.forEach((id, i) => {
    setTimeout(() => {
      genProducts.value = genProducts.value.map(p => p.id === id ? { ...p, status: 'generated' } : p)
    }, (i + 1) * 2000)
  })
}

// Choose Products state
const cpSortBy = ref('popularity-desc')
const cpSortOpen = ref(false)
const cpSortOptions = [
  { value: 'popularity-desc', label: '↓ Popularity' },
  { value: 'popularity-asc',  label: '↑ Popularity' },
  { value: 'name-asc',        label: '↓ Name A–Z' },
  { value: 'name-desc',       label: '↑ Name Z–A' },
  { value: 'price-asc',       label: '↑ Price' },
  { value: 'price-desc',      label: '↓ Price' },
  { value: 'updated-desc',    label: '↓ Last Updated' },
  { value: 'updated-asc',     label: '↑ Last Updated' },
]
const cpSearch = ref('')
const cpCategoryIs = ref([])
const cpCategoryIsNot = ref([])
const cpOnlyInStock = ref(false)
const cpOnlyWithTraffic = ref(false)
const cpShowFilters = ref(false)
const cpActiveFilterCount = computed(() => {
  let count = 0
  if (cpCategoryIs.value.length > 0) count++
  if (cpCategoryIsNot.value.length > 0) count++
  if (cpOnlyInStock.value) count++
  if (cpOnlyWithTraffic.value) count++
  return count
})
const cpFromText = ref(false)
const cpSelected = ref([])
const cpCategoryOptions = ['All categories', 'Electronics', 'Home & Kitchen', 'Clothing', 'Sports']
const cpPage = ref(1)
const cpPerPage = 20

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
  { id: 21, name: 'Aromatherapy Diffuser', sku: 'DIF-ARO-U7', price: '$39.99', popularity: '175 views', lastUpdated: '2 weeks ago' },
  { id: 22, name: 'Cast Iron Skillet', sku: 'SKL-CST-10', price: '$45.00', popularity: '163 views', lastUpdated: '2 weeks ago' },
  { id: 23, name: 'Foldable Laptop Stand', sku: 'STD-LPT-AL', price: '$34.00', popularity: '152 views', lastUpdated: '3 weeks ago' },
  { id: 24, name: 'Reusable Beeswax Wraps', sku: 'WRP-BWX-S3', price: '$16.00', popularity: '141 views', lastUpdated: '3 weeks ago' },
  { id: 25, name: 'Weighted Blanket 7kg', sku: 'BLK-WGT-7K', price: '$89.00', popularity: '138 views', lastUpdated: '3 weeks ago' },
  { id: 26, name: 'Copper Tongue Scraper', sku: 'SCR-CPR-P2', price: '$12.00', popularity: '127 views', lastUpdated: '3 weeks ago' },
  { id: 27, name: 'Resistance Band Set', sku: 'BND-RES-5L', price: '$28.00', popularity: '119 views', lastUpdated: '3 weeks ago' },
  { id: 28, name: 'Linen Throw Pillow', sku: 'PIL-LIN-50', price: '$55.00', popularity: '114 views', lastUpdated: '4 weeks ago' },
  { id: 29, name: 'Pour-Over Coffee Maker', sku: 'COF-PVO-GL', price: '$42.00', popularity: '108 views', lastUpdated: '4 weeks ago' },
  { id: 30, name: 'Electric Toothbrush', sku: 'TBR-ELC-S3', price: '$59.99', popularity: '103 views', lastUpdated: '4 weeks ago' },
  { id: 31, name: 'Silk Sleep Mask', sku: 'MSK-SLK-BL', price: '$22.00', popularity: '98 views', lastUpdated: '1 month ago' },
  { id: 32, name: 'Wooden Chess Set', sku: 'CHE-WOD-FC', price: '$75.00', popularity: '94 views', lastUpdated: '1 month ago' },
  { id: 33, name: 'Stainless Meal Prep Containers', sku: 'CNT-SS-5PK', price: '$48.00', popularity: '91 views', lastUpdated: '1 month ago' },
  { id: 34, name: 'Foam Roller 45cm', sku: 'FOM-RLR-45', price: '$25.00', popularity: '88 views', lastUpdated: '1 month ago' },
  { id: 35, name: 'Seed Germination Kit', sku: 'GRD-SED-10', price: '$32.00', popularity: '85 views', lastUpdated: '1 month ago' },
  { id: 36, name: 'Bamboo Toothbrush Set', sku: 'TBR-BMB-4P', price: '$14.00', popularity: '82 views', lastUpdated: '1 month ago' },
  { id: 37, name: 'Smart Plug Wi-Fi', sku: 'PLG-SMT-W1', price: '$19.99', popularity: '79 views', lastUpdated: '1 month ago' },
  { id: 38, name: 'Travel Compression Bags', sku: 'BAG-CMP-6P', price: '$21.00', popularity: '76 views', lastUpdated: '1 month ago' },
  { id: 39, name: 'Marble Phone Stand', sku: 'STD-MRB-PH', price: '$29.00', popularity: '73 views', lastUpdated: '5 weeks ago' },
  { id: 40, name: 'Cork Yoga Blocks', sku: 'YGA-BLK-CK', price: '$24.00', popularity: '70 views', lastUpdated: '5 weeks ago' },
  { id: 41, name: 'Cold Brew Coffee Maker', sku: 'COF-CBR-1L', price: '$36.00', popularity: '68 views', lastUpdated: '5 weeks ago' },
  { id: 42, name: 'Blackout Curtains', sku: 'CRT-BLK-14', price: '$64.00', popularity: '65 views', lastUpdated: '5 weeks ago' },
  { id: 43, name: 'Wooden Serving Board', sku: 'BRD-ACA-40', price: '$38.00', popularity: '62 views', lastUpdated: '6 weeks ago' },
  { id: 44, name: 'Portable Charger 20000mAh', sku: 'CHG-PRT-20', price: '$45.00', popularity: '59 views', lastUpdated: '6 weeks ago' },
  { id: 45, name: 'Linen Apron', sku: 'APR-LIN-NB', price: '$33.00', popularity: '57 views', lastUpdated: '6 weeks ago' },
  { id: 46, name: 'Macramé Wall Hanging', sku: 'DCR-MAC-60', price: '$41.00', popularity: '54 views', lastUpdated: '6 weeks ago' },
  { id: 47, name: 'Silicone Baking Mat Set', sku: 'BAK-SLC-2P', price: '$18.00', popularity: '52 views', lastUpdated: '7 weeks ago' },
  { id: 48, name: 'Essential Oil Set', sku: 'OIL-ESS-10', price: '$37.00', popularity: '49 views', lastUpdated: '7 weeks ago' },
  { id: 49, name: 'Adjustable Dumbbell', sku: 'DUM-ADJ-25', price: '$189.00', popularity: '47 views', lastUpdated: '7 weeks ago' },
  { id: 50, name: 'Ceramic Spice Jars', sku: 'JAR-CRM-12', price: '$44.00', popularity: '45 views', lastUpdated: '7 weeks ago' },
  { id: 51, name: 'Portable Espresso Maker', sku: 'ESP-PRT-MN', price: '$29.99', popularity: '43 views', lastUpdated: '8 weeks ago' },
  { id: 52, name: 'Knitted Storage Basket', sku: 'BSK-KNT-LG', price: '$52.00', popularity: '41 views', lastUpdated: '8 weeks ago' },
  { id: 53, name: 'UV Sanitiser Box', sku: 'SAN-UV-WC', price: '$49.00', popularity: '39 views', lastUpdated: '8 weeks ago' },
  { id: 54, name: 'Wooden Laptop Desk', sku: 'DSK-WOD-LP', price: '$57.00', popularity: '37 views', lastUpdated: '8 weeks ago' },
]

const cpSortedProducts = computed(() => {
  const list = [...cpProducts]
  const parts = cpSortBy.value.split('-')
  const field = parts[0]
  const dir = parts[1]
  const asc = dir === 'asc'

  return list.sort((a, b) => {
    if (field === 'name') {
      const valA = a.name.toLowerCase()
      const valB = b.name.toLowerCase()
      return asc ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    if (field === 'updated') {
      return asc ? a.lastUpdated.localeCompare(b.lastUpdated) : b.lastUpdated.localeCompare(a.lastUpdated)
    }
    let valA, valB
    if (field === 'price') {
      valA = parseFloat(a.price.replace(/[^0-9.]/g, ''))
      valB = parseFloat(b.price.replace(/[^0-9.]/g, ''))
    } else if (field === 'popularity') {
      valA = parseInt(a.popularity.replace(/[^0-9]/g, ''))
      valB = parseInt(b.popularity.replace(/[^0-9]/g, ''))
    }
    return asc ? valA - valB : valB - valA
  })
})

const cpTotalPages = computed(() => Math.ceil(cpSortedProducts.value.length / cpPerPage))
const cpSortedProductsPaged = computed(() => cpSortedProducts.value.slice((cpPage.value - 1) * cpPerPage, cpPage.value * cpPerPage))
const cpAllSelected = computed(() => cpSelected.value.length === cpProducts.length)
const toggleAllCp = () => {
  cpSelected.value = cpAllSelected.value ? [] : cpProducts.map(p => p.id)
}

const selectedDomain = ref('telekom.hu')
const domains = ref(['telekom.hu', 'myshop.com', 'example-store.com', 'demo-site.com', 'testsite.com', 'my-very-long-domain-name-webshop.example.com', '+ Add new domain'])
const showAddDomainModal = ref(false)
watch(selectedDomain, (val) => {
  if (val === '+ Add new domain') {
    selectedDomain.value = domains.value[0]
    showAddDomainModal.value = true
  }
})
const handleNewDomain = (newDomain) => {
  const insertIdx = domains.value.indexOf('+ Add new domain')
  domains.value.splice(insertIdx, 0, newDomain)
  selectedDomain.value = newDomain
}

const activeTab = ref('all')
const search = ref('')

const generating = ref(false)
const generated = ref(false)

const promptModel = ref('Nano Banana Pro')
const promptRatio = ref('16:9')
const promptText = ref('A high-quality, professional product photo of premium wireless headphones on a clean, minimalist background with soft, natural lighting.')
const modelOptions = ['Nano Banana Pro', 'Gemini 3']
const ratioOptions = ['16:9', '1:1', '4:3', '9:16']

const showAdvanced = ref(false)
const pageType = ref('product')
const dataSources = ['Product name', 'Product description', 'Recommended product name', 'Recommended product description']
const recommender = ref('Alapértelmezett')
const recommenderOptions = ['Alapértelmezett', 'Egyéni']
const autoGenerate = ref(true)
const minDescLength = ref(0)
const useProductImage = ref(false)

const previewGeneratedPrompt = ref('')
const previewGeneratedSettings = ref(null)

const previewPromptChanged = computed(() => {
  if (!generated.value) return false
  if (promptText.value !== previewGeneratedPrompt.value) return true
  if (!previewGeneratedSettings.value) return false
  const s = previewGeneratedSettings.value
  return (
    promptModel.value !== s.promptModel ||
    promptRatio.value !== s.promptRatio ||
    pageType.value !== s.pageType ||
    autoGenerate.value !== s.autoGenerate ||
    minDescLength.value !== s.minDescLength ||
    useProductImage.value !== s.useProductImage
  )
})

const startGeneration = () => {
  generating.value = true
  previewGeneratedPrompt.value = promptText.value
  previewGeneratedSettings.value = {
    promptModel: promptModel.value,
    promptRatio: promptRatio.value,
    pageType: pageType.value,
    autoGenerate: autoGenerate.value,
    minDescLength: minDescLength.value,
    useProductImage: useProductImage.value,
  }
  setTimeout(() => {
    generating.value = false
    generated.value = true
  }, 2000)
}

const selectedImagePreset = ref(null)
const handlePresetClick = (preset) => {
  selectedImagePreset.value = preset
  promptModel.value = preset.model
  promptRatio.value = preset.ratio
  emit('navigate', 'ai-texts-images-v2-preview')
}

const workflowPresets = [
  { id: 'badge-mobile-desktop', name: 'Badge for Mobile/Desktop', description: 'Generate a product image with a promotional badge in both mobile (9:16) and desktop (16:9) variants in one run.', steps: 2, model: 'Nano Banana Pro', credits: 40 },
  { id: 'sppo-3', name: 'SPPO 3', description: 'Three-step Self-Play Preference Optimization: generate, refine against feedback, and finalize for production-ready output.', steps: 3, model: 'Nano Banana Pro', credits: 60 },
  { id: 'custom', name: 'Custom', description: 'Build your own workflow from scratch. Define each step, choose models, and chain outputs into the next step\u2019s input.', steps: '—', model: 'Choose per step', credits: 'Variable' },
]
const selectedWorkflowPreset = ref(null)
const workflowEditorTitle = computed(() => {
  const p = selectedWorkflowPreset.value
  if (!p || p.id === 'custom') return 'Workflow'
  return p.name
})

// Workflow editor state (workflowSteps + workflowReferences imported from useWorkflowState
// so they persist between the editor and generation screens)
const workflowProduct = ref({ id: 1, name: 'Stock GreenWell beverage', category: 'Beverages', image: '/product1.jpg' })
let refIdCounter = 1
const workflowVariables = [
  { id: 'headline', label: '{{headline}}', type: 'text' },
  { id: 'subheadline', label: '{{subheadline}}', type: 'text' },
  { id: 'product_image_v1', label: '{{product_image_v1}}', type: 'image' },
  { id: 'badge_image_v1', label: '{{badge_image_v1}}', type: 'image' },
]
const workflowLightbox = ref(null)

let stepRefIdCounter = 1
const addStepReference = (step, event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  step.referenceImages.push({ id: stepRefIdCounter++, name: file.name, url })
  event.target.value = ''
}
const removeStepReference = (step, id) => {
  step.referenceImages = step.referenceImages.filter(r => r.id !== id)
}

const imageModels = ['Nano Banana Pro']
const isImageModel = (model) => imageModels.includes(model)
const stepOutputName = (step, i) => `${isImageModel(step.model) ? 'Image' : 'Text'}Step${i + 1}`

const builtInInputs = [
  { variable: 'product_name', label: 'Product name', source: 'builtin' },
  { variable: 'product_description', label: 'Product description', source: 'builtin' },
  { variable: 'recommended_product_name', label: 'Recommended product name', source: 'builtin' },
  { variable: 'recommended_product_description', label: 'Recommended product description', source: 'builtin' },
]

const availableInputs = (i) => {
  const opts = builtInInputs.map(b => ({ ...b, placeholder: `{{${b.variable}}}` }))
  for (let j = 0; j < i; j++) {
    const prev = workflowSteps.value[j]
    const variable = stepOutputName(prev, j)
    opts.push({ variable, label: `Step ${j + 1} output - ${variable}`, source: 'step', placeholder: `{{${variable}}}` })
  }
  aiTemplates.forEach(t => {
    opts.push({ variable: t.variable, label: `${t.name} - ${t.variable}`, source: 'template', placeholder: `{{${t.variable}}}` })
  })
  return opts
}

const inputDropdownOptions = (i) => availableInputs(i).map(o => ({ value: o.variable, label: o.label, source: o.source, placeholder: o.placeholder }))

const usedInputs = (step, i) => {
  const text = step.prompt || ''
  const matches = [...text.matchAll(/\{\{([a-z0-9_]+)\}\}/gi)]
  const seen = new Set()
  const known = availableInputs(i)
  const result = []
  matches.forEach(m => {
    const v = m[1]
    if (seen.has(v)) return
    seen.add(v)
    const found = known.find(o => o.variable === v)
    result.push(found || { variable: v, label: v, source: 'unknown', placeholder: `{{${v}}}` })
  })
  return result
}

const inputTagVariant = (source) => {
  if (source === 'step') return 'green'
  if (source === 'template') return 'orange'
  return 'gray-muted'
}

const promptRefs = {}
const setPromptRef = (id) => (el) => {
  if (el) promptRefs[id] = el
  else delete promptRefs[id]
}
const stepCursors = {}
const trackCursor = (step, ev) => {
  stepCursors[step.id] = ev.target.selectionStart
}

const insertInputAtCursor = (step, placeholder) => {
  const ta = promptRefs[step.id]
  const text = step.prompt || ''
  const pos = stepCursors[step.id] != null ? stepCursors[step.id] : text.length
  const safePos = Math.max(0, Math.min(pos, text.length))
  step.prompt = text.slice(0, safePos) + placeholder + text.slice(safePos)
  const newPos = safePos + placeholder.length
  stepCursors[step.id] = newPos
  nextTick(() => {
    if (ta) {
      ta.focus()
      try { ta.setSelectionRange(newPos, newPos) } catch (e) {}
    }
  })
}

const addInputDropdowns = ref({})
const onAddInput = (step, opt) => {
  if (!opt) return
  insertInputAtCursor(step, opt.placeholder)
  nextTick(() => { addInputDropdowns.value[step.id] = null })
}

const isStepInherited = (step, i) => i > 0 && !!step.continuePreviousPrompt

// AI templates available to load into a step (combines text + image presets with prompts)
const aiTemplates = [
  { id: 'tpl-badge-desktop', name: 'Image with badge desktop', type: 'Image', model: 'Nano Banana Pro', ratio: '16:9', useMultipleImages: false, minDescriptionLength: 0, variable: 'badge_desktop', prompt: 'Add a promotional badge to the product image. Optimize composition for desktop (16:9) layouts.' },
  { id: 'tpl-badge-mobile', name: 'Image with badge mobile', type: 'Image', model: 'Nano Banana Pro', ratio: '9:16', useMultipleImages: false, minDescriptionLength: 0, variable: 'badge_mobile', prompt: 'Add a promotional badge to the product image. Optimize composition for mobile (9:16) layouts.' },
  { id: 'tpl-badge-people-desktop', name: 'Image with badge with people desktop', type: 'Image', model: 'Nano Banana Pro', ratio: '16:9', useMultipleImages: false, minDescriptionLength: 0, variable: 'badge_people_desktop', prompt: 'Generate a lifestyle product image featuring people and a promotional badge, framed for desktop (16:9).' },
  { id: 'tpl-badge-people-mobile', name: 'Image with badge with people mobile', type: 'Image', model: 'Nano Banana Pro', ratio: '9:16', useMultipleImages: false, minDescriptionLength: 0, variable: 'badge_people_mobile', prompt: 'Generate a lifestyle product image featuring people and a promotional badge, framed for mobile (9:16).' },
  { id: 'tpl-people-beverage', name: 'People Beverage', type: 'Image', model: 'Nano Banana Pro', ratio: '1:1', useMultipleImages: false, minDescriptionLength: 0, variable: 'people_beverage', prompt: 'Generate a lifestyle scene of people enjoying a beverage with the product naturally integrated.' },
  { id: 'tpl-people-consume', name: 'People Consume', type: 'Image', model: 'Nano Banana Pro', ratio: '1:1', useMultipleImages: false, minDescriptionLength: 0, variable: 'people_consume', prompt: 'Generate a lifestyle scene of people consuming or experiencing the product.' },
  { id: 'tpl-people-use', name: 'People Use', type: 'Image', model: 'Nano Banana Pro', ratio: '1:1', useMultipleImages: false, minDescriptionLength: 0, variable: 'people_use', prompt: 'Generate a lifestyle scene of people actively using the product.' },
  { id: 'tpl-people-wear', name: 'People Wear', type: 'Image', model: 'Nano Banana Pro', ratio: '1:1', useMultipleImages: false, minDescriptionLength: 0, variable: 'people_wear', prompt: 'Generate a lifestyle scene of people wearing or modeling the product.' },
  { id: 'tpl-pets', name: 'Pets', type: 'Image', model: 'Nano Banana Pro', ratio: '1:1', useMultipleImages: false, minDescriptionLength: 0, variable: 'pets', prompt: 'Generate a lifestyle scene featuring pets alongside the product.' },
  { id: 'tpl-product-only', name: 'Product Only', type: 'Image', model: 'Nano Banana Pro', ratio: '1:1', useMultipleImages: false, minDescriptionLength: 0, variable: 'product_only', prompt: 'Generate a clean, focused product shot with no people or distractions.' },
  { id: 'tpl-sdp-product-sentence-hu', name: 'SDP - Product Sentence (HU)', type: 'Text', model: 'Gemini 3', ratio: '1:1', useProductImageContext: false, minDescriptionLength: 80, variable: 'product_sentence', prompt: 'Írj egy tömör, vásárlót ösztönző mondatot a termékről magyar nyelven a katalógus adatai alapján.' },
  { id: 'tpl-spo-reco-headline-en', name: 'SPo - Reco Headline (EN)', type: 'Text', model: 'Gemini 3', ratio: '1:1', useProductImageContext: false, minDescriptionLength: 60, variable: 'reco_headline', prompt: 'Write a recommendation-focused headline in English that drives product discovery for the given item.' },
  { id: 'tpl-sppo-benefit-list-en', name: 'SPPO - Benefit List (EN)', type: 'Text', model: 'Gemini 3', ratio: '1:1', useProductImageContext: false, minDescriptionLength: 100, variable: 'benefit_list', prompt: 'Generate a bullet-point list of the key product benefits in English tailored to the catalogue item.' },
  { id: 'tpl-sppo-benefit-list-bold-hu', name: 'SPPO - Benefit list w/ bold intro (HU)', type: 'Text', model: 'Gemini 3', ratio: '1:1', useProductImageContext: false, minDescriptionLength: 100, variable: 'benefit_list_bold', prompt: 'Generálj termékelőnyöket felsoroló listát magyarul, félkövér bevezető mondattal a termék összefoglalására.' },
  { id: 'tpl-headline-subheadline-en', name: 'SPPO - Headline + Subheadline (EN)', type: 'Text', model: 'Gemini 3', ratio: '1:1', useProductImageContext: false, minDescriptionLength: 80, variable: 'headline_subheadline', prompt: 'Generate a paired headline and subheadline in English suitable for banners, popups, and embedded content.' },
]

const templateModalOpen = ref(false)
const templateModalStepIndex = ref(0)
const templateModalSelected = ref(null)

const selectedTemplate = computed(() => {
  const sel = templateModalSelected.value
  if (!sel) return null
  return sel.value || sel
})

const openTemplateModal = (stepIndex) => {
  templateModalStepIndex.value = stepIndex
  templateModalSelected.value = null
  templateModalOpen.value = true
}

const applyTemplate = () => {
  const tpl = selectedTemplate.value
  if (!tpl) return
  const step = workflowSteps.value[templateModalStepIndex.value]
  if (!step) return
  step.prompt = tpl.prompt
  step.model = tpl.model
  step.ratio = tpl.ratio
  step.minDescriptionLength = tpl.minDescriptionLength ?? 0
  if (isImageModel(tpl.model)) {
    step.useMultipleImages = !!tpl.useMultipleImages
  } else {
    step.useProductImageContext = !!tpl.useProductImageContext
  }
  templateModalOpen.value = false
}

// Sync inheriting steps: when a step has continuePreviousPrompt = true,
// mirror only the model from the previous step.
watch(workflowSteps, (steps) => {
  for (let i = 1; i < steps.length; i++) {
    const cur = steps[i]
    if (cur.continuePreviousPrompt && cur.model !== steps[i - 1].model) {
      cur.model = steps[i - 1].model
    }
  }
}, { deep: true })

const seedStepsForPreset = (presetId) => {
  if (presetId === 'badge-mobile-desktop') {
    workflowSteps.value = [
      newStep({ prompt: 'Add a promotional "20% OFF" badge to the product image. Optimize composition for desktop (16:9).', ratio: '16:9' }),
      newStep({ prompt: 'Re-frame the same scene in 9:16 portrait for mobile while keeping the badge readable.', ratio: '9:16', inputs: { original: false, references: [], previousSteps: [1], variables: [] } }),
    ]
  } else if (presetId === 'sppo-3') {
    workflowSteps.value = [
      newStep({ prompt: 'Generate an initial product lifestyle image based on the original.', ratio: '1:1' }),
      newStep({ prompt: 'Refine the previous output: improve lighting, sharpen subject, fix any artifacts.', ratio: '1:1', inputs: { original: false, references: [], previousSteps: [1], variables: [] } }),
      newStep({ prompt: 'Final pass: production-ready output with brand-consistent color grading.', ratio: '1:1', inputs: { original: false, references: [], previousSteps: [2], variables: [] } }),
    ]
  } else {
    workflowSteps.value = [newStep()]
  }
}

const handleWorkflowPresetClick = (preset) => {
  selectedWorkflowPreset.value = preset
  seedStepsForPreset(preset.id)
  workflowReferences.value = []
  emit('navigate', 'ai-texts-images-v2-workflow-editor')
}

const addWorkflowStep = () => {
  workflowSteps.value.push(newStep())
}
const removeWorkflowStep = (id) => {
  workflowSteps.value = workflowSteps.value.filter(s => s.id !== id)
  workflowSteps.value.forEach(s => {
    s.inputs.previousSteps = s.inputs.previousSteps.filter(pid => pid !== id)
  })
}
const toggleStepArrayInput = (step, key, id) => {
  const arr = step.inputs[key]
  const idx = arr.indexOf(id)
  if (idx === -1) arr.push(id)
  else arr.splice(idx, 1)
}
const addWorkflowReference = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  workflowReferences.value.push({ id: refIdCounter++, name: file.name, url })
  event.target.value = ''
}
const removeWorkflowReference = (id) => {
  workflowReferences.value = workflowReferences.value.filter(r => r.id !== id)
  workflowSteps.value.forEach(s => {
    s.inputs.references = s.inputs.references.filter(rid => rid !== id)
  })
}
const sampleTextOutputs = [
  'Refresh your day with GreenWell — naturally crafted for clean energy and a calmer mind.',
  '• Cold-pressed botanicals\n• Zero added sugar\n• 100% recyclable bottle',
  'Discover the taste that fits your routine — light, balanced, and quietly bold.',
]
const runSingleStep = (step) => new Promise((resolve) => {
  step.waiting = false
  step.generating = true
  setTimeout(() => {
    if (isImageModel(step.model)) {
      step.output = '/product1.jpg'
    } else {
      step.output = sampleTextOutputs[Math.floor(Math.random() * sampleTextOutputs.length)]
    }
    step.generating = false
    resolve()
  }, 1500)
})
const runWorkflowStep = async (step) => {
  const idx = workflowSteps.value.indexOf(step)
  if (idx === -1) return
  for (let i = 0; i <= idx; i++) {
    workflowSteps.value[i].waiting = true
  }
  for (let i = 0; i <= idx; i++) {
    await runSingleStep(workflowSteps.value[i])
  }
}
const runWorkflowAll = async () => {
  workflowSteps.value.forEach(s => { s.waiting = true })
  for (const s of workflowSteps.value) {
    await runSingleStep(s)
  }
}

// Workflow editor tabs (Choose products / Review / Settings)
const wfTab = ref('selected')
const wfTabs = [
  { value: 'selected', label: 'Choose products' },
  { value: 'generated', label: 'Review' },
  { value: 'settings', label: 'Settings' },
]
const wfSelected = ref([])
const wfSelectedCredits = computed(() => {
  const perRun = workflowSteps.value.reduce((sum, s) => sum + (s.model === 'Nano Banana Pro' ? 20 : 15), 0)
  return (wfSelected.value.length * perRun).toLocaleString() + ' credits'
})
const wfSearch = ref('')
const wfFilteredProducts = computed(() => {
  const q = wfSearch.value.trim().toLowerCase()
  if (!q) return genProducts.value
  return genProducts.value.filter(p => p.name.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q))
})
const showWfGenMenu = ref(false)
const wfPerProductCredits = computed(() => workflowSteps.value.reduce((sum, s) => sum + (s.model === 'Nano Banana Pro' ? 20 : 15), 0))
const wfMenuOptions = computed(() => [1, 10, 25, 100].map(count => ({
  count,
  credits: (count * wfPerProductCredits.value).toLocaleString() + ' credits',
})))
// Per-product workflow progress: id -> number of completed steps.
// Plus id -> currently running step index (null when idle/done).
const wfProductProgress = ref({})
const wfProductRunning = ref({})
const productWorkflowStatus = (p) => {
  const progress = wfProductProgress.value[p.id] || 0
  if (progress >= workflowSteps.value.length) return 'done'
  if (progress > 0 || wfProductRunning.value[p.id] != null) return 'partial'
  return 'pending'
}
const productStepDone = (p, stepIndex) => (wfProductProgress.value[p.id] || 0) > stepIndex
const productStepRunning = (p, stepIndex) => wfProductRunning.value[p.id] === stepIndex
const productOverallStatus = (p) => {
  const ws = productWorkflowStatus(p)
  if (ws === 'done') return { label: 'Ready to use', variant: 'green', icon: 'check' }
  if (ws === 'partial') return { label: 'In progress', variant: 'orange', icon: 'loader' }
  return { label: 'Not generated', variant: 'gray-muted', icon: 'clock' }
}
// Mock output pools used to populate per-step results
const wfImagePool = ['/product1.jpg', '/product2.png', '/prod2.jpg', '/Prod1.png', '/review_img.png', '/whisky.png']
const wfTextPool = [
  'Refresh your day with GreenWell — naturally crafted for clean energy and a calmer mind.',
  '• Cold-pressed botanicals\n• Zero added sugar\n• 100% recyclable bottle',
  'Discover the taste that fits your routine — light, balanced, and quietly bold.',
  'Premium quality you can taste in every sip — sustainably sourced and rigorously tested.',
]
const mockStepOutputs = (step) => {
  if (isImageModel(step.model)) {
    const count = Math.random() < 0.4 ? 2 : 1
    const out = []
    for (let i = 0; i < count; i++) out.push({ type: 'image', src: wfImagePool[Math.floor(Math.random() * wfImagePool.length)] })
    return out
  }
  return [{ type: 'text', value: wfTextPool[Math.floor(Math.random() * wfTextPool.length)] }]
}
// Per-product, per-step generated outputs and prompts (keyed by productId).
const wfStepOutputs = ref({})
const wfStepPrompts = ref({})
const wfStepRegenerating = ref({})
const ensureWfPrompts = (productId) => {
  if (!wfStepPrompts.value[productId]) {
    wfStepPrompts.value = { ...wfStepPrompts.value, [productId]: workflowSteps.value.map(s => s.prompt || '') }
  }
}
const setStepOutputs = (productId, stepIndex, outputs) => {
  const current = wfStepOutputs.value[productId] ? [...wfStepOutputs.value[productId]] : []
  current[stepIndex] = outputs
  wfStepOutputs.value = { ...wfStepOutputs.value, [productId]: current }
}
const runWorkflowForProduct = async (productId) => {
  ensureWfPrompts(productId)
  wfProductProgress.value = { ...wfProductProgress.value, [productId]: 0 }
  for (let i = 0; i < workflowSteps.value.length; i++) {
    wfProductRunning.value = { ...wfProductRunning.value, [productId]: i }
    await new Promise(r => setTimeout(r, 800))
    setStepOutputs(productId, i, mockStepOutputs(workflowSteps.value[i]))
    wfProductProgress.value = { ...wfProductProgress.value, [productId]: i + 1 }
  }
  wfProductRunning.value = { ...wfProductRunning.value, [productId]: null }
}
// Products that have any generated result (progress > 0 or currently running) — used in the Review tab.
const wfProductsWithResults = computed(() => genProducts.value.filter(p =>
  (wfProductProgress.value[p.id] || 0) > 0 || wfProductRunning.value[p.id] != null
))

// Workflow per-product detail view (opened from the Review tab)
const wfDetailProduct = ref(null)
const wfIgnoredIds = ref(new Set())
const wfIsIgnored = (id) => wfIgnoredIds.value.has(id)
const wfToggleIgnore = (product) => {
  const set = new Set(wfIgnoredIds.value)
  if (set.has(product.id)) set.delete(product.id)
  else set.add(product.id)
  wfIgnoredIds.value = set
}
const wfDetailIndex = computed(() => {
  if (!wfDetailProduct.value) return -1
  return wfProductsWithResults.value.findIndex(p => p.id === wfDetailProduct.value.id)
})
const wfHasPrev = computed(() => wfDetailIndex.value > 0)
const wfHasNext = computed(() => wfDetailIndex.value >= 0 && wfDetailIndex.value < wfProductsWithResults.value.length - 1)
const openWfDetail = (product) => {
  ensureWfPrompts(product.id)
  wfDetailProduct.value = product
}
const closeWfDetail = () => { wfDetailProduct.value = null }
const wfGoPrev = () => { if (wfHasPrev.value) wfDetailProduct.value = wfProductsWithResults.value[wfDetailIndex.value - 1] }
const wfGoNext = () => { if (wfHasNext.value) wfDetailProduct.value = wfProductsWithResults.value[wfDetailIndex.value + 1] }
const wfStepIsRegenerating = (productId, stepIndex) => !!(wfStepRegenerating.value[productId] && wfStepRegenerating.value[productId][stepIndex])
const wfStepHasOutputs = (productId, stepIndex) => !!(wfStepOutputs.value[productId] && wfStepOutputs.value[productId][stepIndex])
const wfStepGetOutputs = (productId, stepIndex) => (wfStepOutputs.value[productId] && wfStepOutputs.value[productId][stepIndex]) || []
const wfStepGetPrompt = (productId, stepIndex) => (wfStepPrompts.value[productId] && wfStepPrompts.value[productId][stepIndex]) || ''
const wfStepSetPrompt = (productId, stepIndex, value) => {
  ensureWfPrompts(productId)
  const arr = [...(wfStepPrompts.value[productId] || [])]
  arr[stepIndex] = value
  wfStepPrompts.value = { ...wfStepPrompts.value, [productId]: arr }
}
const regenerateWfStep = async (productId, stepIndex) => {
  const reg = { ...(wfStepRegenerating.value[productId] || {}), [stepIndex]: true }
  wfStepRegenerating.value = { ...wfStepRegenerating.value, [productId]: reg }
  await new Promise(r => setTimeout(r, 1500))
  setStepOutputs(productId, stepIndex, mockStepOutputs(workflowSteps.value[stepIndex]))
  const reg2 = { ...(wfStepRegenerating.value[productId] || {}), [stepIndex]: false }
  wfStepRegenerating.value = { ...wfStepRegenerating.value, [productId]: reg2 }
}
const triggerWfGenerate = (mode) => {
  showWfGenMenu.value = false
  let ids
  if (mode === 'selected') {
    ids = [...wfSelected.value]
  } else {
    ids = wfFilteredProducts.value.slice(0, mode).map(p => p.id)
  }
  ids.forEach(id => runWorkflowForProduct(id))
}
const createWorkflow = () => {
  wfTab.value = 'selected'
  emit('navigate', 'ai-texts-images-v2-workflow-generation')
}

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'text', label: 'Texts' },
  { value: 'image', label: 'Images' },
]

const textPresets = [
  { id: 'sdp-product-sentence-hu', name: 'SDP - Product Sentence (HU)', description: 'Generate a concise product sentence in Hungarian tailored to each product in your catalogue.', model: 'Gemini 3 Flash', credits: 1, isPaired: false },
  { id: 'spo-reco-headline-en', name: 'SPo - Reco Headline (EN)', description: 'Generate a recommendation-focused headline in English to drive product discovery.', model: 'Gemini 3 Flash', credits: 1, isPaired: false },
  { id: 'sppo-benefit-list-en', name: 'SPPO - Benefit List (EN)', description: 'Generate a bullet-point list of key product benefits in English tailored to each item in your catalogue.', model: 'Gemini 3 Flash', credits: 1, isPaired: false },
  { id: 'sppo-benefit-list-bold-hu', name: 'SPPO - Benefit list w/ bold intro (HU)', description: 'Generate a benefit list in Hungarian with a bold introductory statement for each product.', model: 'Gemini 3 Flash', credits: 1, isPaired: false },
  { id: 'headline-subheadline', name: 'SPPO - Headline + Subheadline (EN)', description: 'Generate paired headline and subheadline copy in English for banners, popups, and embedded content.', model: 'Gemini 3 Flash', credits: 2, isPaired: true },
  { id: 'sppo-summary-en', name: 'SPPO - Summary (EN)', description: 'Generate a short product summary in English that captures the key value proposition.', model: 'Gemini 3 Flash', credits: 1, isPaired: false },
  { id: 'sppo2-headline-benefit-list', name: 'SPPO2 - Headline + Benefit List', description: 'Generate a headline paired with a structured benefit list for maximum impact in embedded placements.', model: 'Gemini 3 Flash', credits: 2, isPaired: false },
  { id: 'sppo3-title-description-photo', name: 'SPPO3 - Title, description, photo (HU)', description: 'Generate a full product tile in Hungarian including title, description, and photo prompt.', model: 'Gemini 3 Flash', credits: 3, isPaired: false },
]

const selectedTextPreset = ref(null)

const handleTextPresetClick = (preset) => {
  selectedTextPreset.value = preset
  emit('navigate', 'ai-texts-images-v2-text-preview')
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

const textGenSelected = ref([])
const textGenSelectedCredits = computed(() => (textGenSelected.value.length * 2).toLocaleString() + ' credits')

const textGenProducts = ref([
  { id: 1, name: 'Premium Wireless Headphones', desc: 'Noise-cancelling over-ear headphones with 30-hour battery life.', status: 'generated',
    text: { headline: 'Crystal Clear Sound, Zero Distractions', sub: 'Industry-leading noise cancellation meets 30-hour playtime.', body: '• 30-hour battery life\n• Active noise cancellation\n• Premium sound quality\n• Foldable design for travel' } },
  { id: 2, name: 'Minimalist Ceramic Mug', desc: 'Handcrafted 12oz ceramic mug with matte finish.', status: 'queued', text: null },
  { id: 3, name: 'Ergonomic Office Chair', desc: 'Adjustable lumbar support and breathable mesh back.', status: 'queued', text: null },
  { id: 4, name: 'Smart Fitness Watch', desc: 'Heart rate monitor, GPS, and water-resistant design.', status: 'queued', text: null },
  { id: 5, name: 'Organic Cotton T-Shirt', desc: '100% organic cotton, ethically sourced and manufactured.', status: 'queued', text: null },
  { id: 6, name: 'Noise-Cancelling Earbuds', desc: 'True wireless earbuds with active noise cancellation.', status: 'queued', text: null },
  { id: 7, name: 'Bamboo Cutting Board', desc: 'Eco-friendly bamboo cutting board with juice groove.', status: 'queued', text: null },
  { id: 8, name: 'Stainless Steel Water Bottle', desc: 'Double-walled insulated bottle, keeps drinks cold 24h.', status: 'queued', text: null },
  { id: 9, name: 'Leather Wallet', desc: 'Slim bifold wallet crafted from genuine full-grain leather.', status: 'queued', text: null },
  { id: 10, name: 'Portable Bluetooth Speaker', desc: 'Waterproof speaker with 360° sound and 12-hour battery.', status: 'queued', text: null },
  { id: 11, name: 'Yoga Mat Pro', desc: 'Non-slip 6mm thick mat with alignment lines.', status: 'queued', text: null },
  { id: 12, name: 'Scented Soy Candle Set', desc: 'Set of 3 hand-poured soy candles, 40-hour burn time each.', status: 'queued', text: null },
  { id: 13, name: 'Mechanical Keyboard', desc: 'Compact TKL layout with Cherry MX switches.', status: 'queued', text: null },
  { id: 14, name: 'Ceramic Plant Pot', desc: 'Handmade ceramic pot with drainage hole, 15cm diameter.', status: 'queued', text: null },
  { id: 15, name: 'Merino Wool Beanie', desc: 'Super-soft 100% merino wool, one size fits all.', status: 'queued', text: null },
  { id: 16, name: 'Wooden Desk Organizer', desc: 'Modular bamboo organizer with removable dividers.', status: 'queued', text: null },
  { id: 17, name: 'Glass Food Storage Set', desc: 'Set of 5 borosilicate glass containers with locking lids.', status: 'queued', text: null },
  { id: 18, name: 'Running Shoes', desc: 'Lightweight mesh upper with responsive foam midsole.', status: 'queued', text: null },
  { id: 19, name: 'Aromatherapy Diffuser', desc: 'Ultrasonic diffuser with 7-color LED and timer.', status: 'queued', text: null },
  { id: 20, name: 'Cast Iron Skillet', desc: '10-inch pre-seasoned cast iron pan for stovetop and oven.', status: 'queued', text: null },
  { id: 21, name: 'Foldable Laptop Stand', desc: 'Adjustable aluminium stand, compatible with all laptops.', status: 'queued', text: null },
  { id: 22, name: 'Reusable Beeswax Wraps', desc: 'Set of 3 natural beeswax food wraps in assorted sizes.', status: 'queued', text: null },
  { id: 23, name: 'Weighted Blanket', desc: '7kg weighted blanket with removable washable cover.', status: 'queued', text: null },
  { id: 24, name: 'Copper Tongue Scraper', desc: 'Ayurvedic pure copper tongue cleaner, pack of 2.', status: 'queued', text: null },
  { id: 25, name: 'Resistance Band Set', desc: '5 levels of resistance bands with door anchor and handles.', status: 'queued', text: null },
  { id: 26, name: 'Linen Throw Pillow', desc: 'Stonewashed linen cover with feather insert, 50×50cm.', status: 'queued', text: null },
  { id: 27, name: 'Pour-Over Coffee Maker', desc: 'Borosilicate glass dripper with wooden collar and lid.', status: 'queued', text: null },
  { id: 28, name: 'Electric Toothbrush', desc: 'Sonic vibration, 3 modes, 30-day battery life.', status: 'queued', text: null },
  { id: 29, name: 'Silk Sleep Mask', desc: '100% mulberry silk mask with adjustable strap.', status: 'queued', text: null },
  { id: 30, name: 'Wooden Chess Set', desc: 'Hand-carved wooden pieces with folding board and storage.', status: 'queued', text: null },
  { id: 31, name: 'Stainless Meal Prep Containers', desc: 'Set of 5 leak-proof containers with locking lids.', status: 'queued', text: null },
  { id: 32, name: 'Foam Roller', desc: 'High-density EVA foam roller, 45cm for muscle recovery.', status: 'queued', text: null },
  { id: 33, name: 'Seed Germination Kit', desc: 'Complete indoor herb garden starter kit with 10 seed varieties.', status: 'queued', text: null },
  { id: 34, name: 'Bamboo Toothbrush Set', desc: 'Pack of 4 biodegradable toothbrushes with charcoal bristles.', status: 'queued', text: null },
  { id: 35, name: 'Smart Plug', desc: 'Wi-Fi enabled outlet with energy monitoring and voice control.', status: 'queued', text: null },
  { id: 36, name: 'Travel Compression Bags', desc: 'Set of 6 roll-up vacuum storage bags for luggage.', status: 'queued', text: null },
  { id: 37, name: 'Marble Phone Stand', desc: 'Natural marble base desktop stand for all smartphones.', status: 'queued', text: null },
  { id: 38, name: 'Cork Yoga Blocks', desc: 'Set of 2 natural cork blocks for alignment and support.', status: 'queued', text: null },
  { id: 39, name: 'Cold Brew Coffee Maker', desc: '1L glass pitcher with mesh filter for smooth cold brew.', status: 'queued', text: null },
  { id: 40, name: 'Blackout Curtains', desc: 'Thermal insulated blackout panels, 140×260cm per panel.', status: 'queued', text: null },
  { id: 41, name: 'Wooden Serving Board', desc: 'Acacia wood charcuterie board with handle, 40×25cm.', status: 'queued', text: null },
  { id: 42, name: 'Portable Charger 20000mAh', desc: 'Slim power bank with USB-C PD fast charging.', status: 'queued', text: null },
  { id: 43, name: 'Linen Apron', desc: 'Natural stonewashed linen apron with adjustable straps.', status: 'queued', text: null },
  { id: 44, name: 'Macramé Wall Hanging', desc: 'Handmade cotton rope wall décor, 60cm wide.', status: 'queued', text: null },
  { id: 45, name: 'Silicone Baking Mat Set', desc: 'Set of 2 non-stick reusable baking sheets.', status: 'queued', text: null },
  { id: 46, name: 'Essential Oil Set', desc: '10 pure essential oils in a bamboo gift box.', status: 'queued', text: null },
  { id: 47, name: 'Adjustable Dumbbell', desc: 'Quick-select 5–25kg adjustable dumbbell, single unit.', status: 'queued', text: null },
  { id: 48, name: 'Ceramic Spice Jars', desc: 'Set of 12 stackable ceramic jars with bamboo lids.', status: 'queued', text: null },
  { id: 49, name: 'Portable Espresso Maker', desc: 'Manual hand-pump espresso for travel, no electricity needed.', status: 'queued', text: null },
  { id: 50, name: 'Knitted Storage Basket', desc: 'Large chunky-knit cotton basket for blankets and toys.', status: 'queued', text: null },
  { id: 51, name: 'UV Sanitiser Box', desc: 'Phone and small item UV-C steriliser with wireless charging.', status: 'queued', text: null },
  { id: 52, name: 'Beeswax Polish', desc: 'Natural beeswax furniture polish with lavender scent.', status: 'queued', text: null },
  { id: 53, name: 'Foldable Tote Bag', desc: 'Ripstop nylon packable tote, 20L capacity.', status: 'queued', text: null },
  { id: 54, name: 'Wooden Laptop Desk', desc: 'Lap desk with cushion and phone slot for sofa use.', status: 'queued', text: null },
])

const textGenPerPage = 10
const textGenPage = ref(1)
const textGenGeneratedPage = ref(1)
const textGenProductsPaged = computed(() => textGenProducts.value.slice((textGenPage.value - 1) * textGenPerPage, textGenPage.value * textGenPerPage))
const textGenProductsGenerated = computed(() => textGenProducts.value.filter(p => p.status === 'generated'))
const textGenProductsGeneratedPaged = computed(() => textGenProductsGenerated.value.slice((textGenGeneratedPage.value - 1) * textGenPerPage, textGenGeneratedPage.value * textGenPerPage))
const textGenTotalPages = computed(() => Math.ceil(textGenProducts.value.length / textGenPerPage))
const textGenGeneratedTotalPages = computed(() => Math.ceil(textGenProductsGenerated.value.length / textGenPerPage))
watch(textGenTab, () => { textGenPage.value = 1; textGenGeneratedPage.value = 1 })

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
  { id: 1, name: 'Image with badge desktop', description: 'Product image with a promotional badge, optimized for desktop layouts.', model: 'Nano Banana Pro', ratio: '16:9', credits: 20 },
  { id: 2, name: 'Image with badge mobile', description: 'Product image with a promotional badge, optimized for mobile layouts.', model: 'Nano Banana Pro', ratio: '9:16', credits: 20 },
  { id: 3, name: 'Image with badge with people desktop', description: 'Product image featuring people and a badge, optimized for desktop layouts.', model: 'Nano Banana Pro', ratio: '16:9', credits: 20 },
  { id: 4, name: 'Image with badge with people mobile', description: 'Product image featuring people and a badge, optimized for mobile layouts.', model: 'Nano Banana Pro', ratio: '9:16', credits: 20 },
  { id: 5, name: 'People Beverage', description: 'Lifestyle scene showing people enjoying a beverage with your product.', model: 'Nano Banana Pro', ratio: '1:1', credits: 15 },
  { id: 6, name: 'People Consume', description: 'Lifestyle scene showing people consuming or experiencing your product.', model: 'Nano Banana Pro', ratio: '1:1', credits: 15 },
  { id: 7, name: 'People Use', description: 'Lifestyle scene showing people actively using your product.', model: 'Nano Banana Pro', ratio: '1:1', credits: 15 },
  { id: 8, name: 'People Wear', description: 'Lifestyle scene showing people wearing or modeling your product.', model: 'Nano Banana Pro', ratio: '1:1', credits: 15 },
  { id: 9, name: 'Pets', description: 'Lifestyle scene featuring pets alongside your product.', model: 'Nano Banana Pro', ratio: '1:1', credits: 15 },
  { id: 10, name: 'Product Only', description: 'Clean, focused product shot with no people or distractions.', model: 'Nano Banana Pro', ratio: '1:1', credits: 15 },
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
