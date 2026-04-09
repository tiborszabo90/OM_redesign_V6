<template>
  <!-- Toggle button when closed -->
  <button
    v-if="!isOpen"
    @click="toggleOpen(true)"
    class="fixed bottom-4 right-4 z-50 w-10 h-10 bg-[#23262A] text-white rounded-lg flex items-center justify-center hover:bg-[#505763] transition-colors cursor-pointer shadow-lg"
  >
    <ChevronUp :size="20" />
  </button>

  <!-- Full navbar when open -->
  <transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed bottom-0 left-0 right-0 bg-[#23262A] text-white py-2 px-4 z-50 flex items-center justify-center gap-2"
    >
      <!-- Flow type indicator -->
      <span v-if="flowSelected" class="text-xs text-[#8F97A4] capitalize">
        {{ registrationType }}:
      </span>

      <!-- Flow-specific breadcrumb steps -->
      <template v-if="flowSelected">
        <!-- Public Wizard flow -->
        <template v-if="registrationType === 'public-wizard'">
          <button v-for="step in publicWizardSteps" :key="step.id"
            @click="$emit('navigate', step.id)"
            :class="stepClass(publicWizardStep === step.id)"
          >{{ step.label }}</button>
          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Wizard flow -->
        <template v-else-if="registrationType === 'wizard'">
          <button v-for="step in wizardSteps" :key="step.id"
            @click="$emit('navigate', step.id)"
            :class="stepClass(wizardFlowStep === step.id)"
          >{{ step.label }}</button>
          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Image with Badge flow -->
        <template v-else-if="registrationType === 'image-with-badge'">
          <!-- Version selector dropdown -->
          <div class="relative">
            <button
              @click="sectionDropdownOpen = !sectionDropdownOpen"
              :class="[stepClass(true), 'flex items-center gap-1']"
            >
              Image with Badge
              <ChevronUp :size="12" :class="{ 'rotate-180': sectionDropdownOpen }" />
            </button>
            <transition name="fade">
              <div v-if="sectionDropdownOpen" class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-32">
                <button v-for="item in imageBadgeVersions" :key="item.view"
                  @click="selectSection(item.view)"
                  :class="dropdownItemClass(currentView === item.view)"
                >{{ item.label }}</button>
              </div>
            </transition>
          </div>
          <!-- Steps -->
          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Steps:</span>
            <button
              v-for="step in imageBadgeStepCount"
              :key="step"
              @click="$emit('go-to-image-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                currentImageStep === step ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >{{ step }}</button>
          </div>
          <span class="text-[#505763] mx-1">|</span>
        </template>

        <!-- Email/Shopify flow (only on registration/onboarding/task views) -->
        <template v-else-if="['registration', 'onboarding', 'task-creation'].includes(currentView)">
          <button
            v-if="registrationType === 'email'"
            @click="$emit('navigate', 'registration')"
            :class="stepClass(currentView === 'registration')"
          >Registration</button>
          <!-- Onboarding steps -->
          <div class="flex items-center gap-1 ml-2">
            <span class="text-xs text-[#8F97A4] mr-1">Onboarding:</span>
            <button
              v-for="step in 4"
              :key="step"
              @click="$emit('go-to-step', step)"
              :class="[
                'w-8 h-8 text-sm rounded transition-colors flex items-center justify-center cursor-pointer',
                currentView === 'onboarding' && currentStep === step ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
              ]"
            >{{ step }}</button>
          </div>
          <span class="text-[#505763] mx-1">|</span>

          <!-- Task phases -->
          <template v-if="createdTasks.length > 0">
            <div class="flex items-center gap-2">
              <span class="text-xs text-[#8F97A4] mr-1">{{ createdTasks[0].message }}:</span>
              <button
                v-for="(task, index) in createdTasks"
                :key="index"
                @click="$emit('go-to-task-phase', task.phase)"
                :class="[
                  'px-3 py-1 text-sm rounded transition-colors cursor-pointer capitalize',
                  currentView === 'task-creation' && currentTaskPhase === task.phase ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
                ]"
              >{{ task.phase }}</button>
            </div>
            <span class="text-[#505763] mx-1">|</span>
          </template>
        </template>
      </template>

      <!-- Context-aware section dropdown (only when current view has variants) -->
      <div v-if="activeSection && activeSection.length > 1" class="relative">
        <button
          @click="sectionDropdownOpen = !sectionDropdownOpen"
          :class="[stepClass(true), 'flex items-center gap-1']"
        >
          {{ activeSectionLabel }}
          <ChevronUp :size="12" :class="{ 'rotate-180': sectionDropdownOpen }" />
        </button>
        <transition name="fade">
          <div v-if="sectionDropdownOpen" class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-48">
            <button v-for="item in activeSection" :key="item.view"
              @click="selectSection(item.view)"
              :class="dropdownItemClass(currentView === item.view)"
            >{{ item.label }}</button>
          </div>
        </transition>
      </div>

      <!-- Archive Dropdown (only when on an archived view) -->
      <div v-if="archiveViews.includes(currentView)" class="relative">
        <button
          @click="archiveDropdownOpen = !archiveDropdownOpen"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1',
            archiveViews.includes(currentView) ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
          ]"
        >
          Archive
          <ChevronUp :size="12" :class="{ 'rotate-180': archiveDropdownOpen }" />
        </button>
        <transition name="fade">
          <div v-if="archiveDropdownOpen" class="absolute bottom-full left-0 mb-2 bg-[#23262A] border border-[#505763] rounded-lg shadow-lg overflow-hidden min-w-40 max-h-80 overflow-y-auto">
            <button v-for="item in archiveItems" :key="item.view"
              @click="selectArchive(item.view)"
              :class="dropdownItemClass(currentView === item.view)"
            >{{ item.label }}</button>
          </div>
        </transition>
      </div>

      <!-- Export to AI button -->
      <button
        @click="exportToAI"
        :class="[
          'px-3 py-1 text-sm rounded transition-colors cursor-pointer flex items-center gap-1.5',
          exportState === 'copied' ? 'bg-emerald-500 text-white' : 'bg-violet-500/80 hover:bg-violet-500 text-white'
        ]"
      >
        <Copy v-if="exportState === 'idle'" :size="13" />
        <Check v-else-if="exportState === 'copied'" :size="13" />
        <Loader2 v-else :size="13" class="animate-spin" />
        {{ exportState === 'copied' ? 'Copied!' : exportState === 'loading' ? 'Exporting...' : 'Export to AI' }}
      </button>

      <!-- Reset button -->
      <button
        @click="$emit('navigate', 'dev-start')"
        class="px-3 py-1 text-sm rounded transition-colors cursor-pointer bg-red-500/80 hover:bg-red-500 text-white"
      >
        Reset
      </button>

      <!-- Close button -->
      <button
        @click="toggleOpen(false)"
        class="px-2 py-1 text-sm rounded transition-colors cursor-pointer bg-[#505763] hover:bg-[#8F97A4]"
      >
        <X :size="16" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronUp, X, Copy, Check, Loader2 } from 'lucide-vue-next'
import { getArchivedViews, getSectionItems, getSectionForView, sectionLabels, flowDefinitions } from '../../registry'

const props = defineProps({
  currentView: { type: String, required: true },
  currentStep: { type: Number, default: 1 },
  totalSteps: { type: Number, default: 4 },
  currentImageStep: { type: Number, default: 1 },
  createdTasks: { type: Array, default: () => [] },
  currentTaskPhase: { type: String, default: 'analysis' },
  flowSelected: { type: Boolean, default: false },
  registrationType: { type: String, default: 'email' },
  publicWizardStep: { type: String, default: 'url' },
  wizardFlowStep: { type: String, default: 'url' },
})

const emit = defineEmits(['navigate', 'go-to-step', 'go-to-image-step', 'go-to-task-phase', 'select-flow', 'update:isOpen'])

// --- State ---
const isOpen = ref(true)
const sectionDropdownOpen = ref(false)
const archiveDropdownOpen = ref(false)

onMounted(() => { emit('update:isOpen', isOpen.value) })

const toggleOpen = (value) => {
  isOpen.value = value
  emit('update:isOpen', value)
}

// --- Flow step data (from registry) ---
const publicWizardSteps = flowDefinitions['public-wizard'].steps
const wizardSteps = flowDefinitions['wizard'].steps

const imageBadgeFlow = flowDefinitions['image-with-badge']
const imageBadgeVersions = imageBadgeFlow.versions.map(v => ({ view: v.view, label: v.label }))

const imageBadgeStepCount = computed(() => {
  const version = imageBadgeFlow.versions.find(v => v.view === props.currentView)
  return version?.stepCount || 3
})

// --- Section groups (from registry) ---
const activeSection = computed(() => {
  const view = props.currentView
  if (!view) return null

  // Check exact section match
  const sectionKey = getSectionForView(view)
  if (sectionKey) {
    const items = getSectionItems(sectionKey)
    return items.length > 1 ? items.map(v => ({ view: v.id, label: v.label })) : null
  }

  // AI Content: prefix matching for ai-texts-images and settings-ai-texts-images
  if (view.startsWith('ai-texts-images') || view.startsWith('settings-ai-texts-images')) {
    const items = getSectionItems('aiContent')
    return items.length > 0 ? items.map(v => ({ view: v.id, label: v.label })) : null
  }

  return null
})

const activeSectionLabel = computed(() => {
  const view = props.currentView
  if (!view) return ''

  const sectionKey = getSectionForView(view)
  if (sectionKey) return sectionLabels[sectionKey] || ''

  if (view.startsWith('ai-texts-images') || view.startsWith('settings-ai-texts-images')) {
    return sectionLabels['aiContent'] || ''
  }

  return ''
})

// --- Archive (from registry) ---
const archiveItems = computed(() =>
  getArchivedViews().map(v => ({ view: v.id, label: v.label }))
)

const archiveViews = computed(() => archiveItems.value.map(item => item.view))

// --- Helpers ---
const stepClass = (isActive) => [
  'px-3 py-1 text-sm rounded transition-colors cursor-pointer',
  isActive ? 'bg-[#ED5A29] text-white' : 'bg-[#505763] hover:bg-[#8F97A4]'
]

const dropdownItemClass = (isActive) => [
  'w-full px-4 py-2 text-sm text-left transition-colors cursor-pointer',
  isActive ? 'bg-[#ED5A29] text-white' : 'hover:bg-[#505763]'
]

const selectSection = (view) => {
  emit('navigate', view)
  sectionDropdownOpen.value = false
}

const selectArchive = (view) => {
  emit('navigate', view)
  archiveDropdownOpen.value = false
}

// ── Export to AI ──
const allViewSources = import.meta.glob('/src/views/*.vue', { query: '?raw', import: 'default', eager: true })
const allComponentSources = import.meta.glob('/src/components/**/*.vue', { query: '?raw', import: 'default', eager: true })
const cssSource = import.meta.glob('/src/style.css', { query: '?raw', import: 'default', eager: true })

const exportState = ref('idle') // idle | loading | copied

function kebabToPascal(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

function findViewFile(viewId) {
  const pascal = kebabToPascal(viewId)
  for (const [path, source] of Object.entries(allViewSources)) {
    const fileName = path.split('/').pop().replace('.vue', '')
    if (fileName.includes(pascal)) return { path, source }
  }
  return null
}

function extractVueImports(source) {
  const imports = []
  const regex = /import\s+\w+\s+from\s+['"]([^'"]+\.vue)['"]/g
  let match
  while ((match = regex.exec(source)) !== null) {
    imports.push(match[1])
  }
  return imports
}

function resolveImportPath(importPath, fromPath) {
  if (importPath.startsWith('@/')) {
    return '/src/' + importPath.slice(2)
  }
  if (importPath.startsWith('../') || importPath.startsWith('./')) {
    const fromDir = fromPath.substring(0, fromPath.lastIndexOf('/'))
    const parts = fromDir.split('/')
    for (const part of importPath.split('/')) {
      if (part === '..') parts.pop()
      else if (part !== '.') parts.push(part)
    }
    return parts.join('/')
  }
  return importPath
}

function collectDependencies(path, source, allSources, collected, depth = 0) {
  if (depth > 4 || collected.has(path)) return
  collected.set(path, source)
  const imports = extractVueImports(source)
  for (const imp of imports) {
    const resolved = resolveImportPath(imp, path)
    const depSource = allSources[resolved]
    if (depSource && !collected.has(resolved)) {
      collectDependencies(resolved, depSource, allSources, collected, depth + 1)
    }
  }
}

async function exportToAI() {
  exportState.value = 'loading'
  try {
    const viewInfo = findViewFile(props.currentView)
    if (!viewInfo) {
      exportState.value = 'idle'
      alert('Could not find source for view: ' + props.currentView)
      return
    }

    const allSources = { ...allViewSources, ...allComponentSources }
    const collected = new Map()
    collectDependencies(viewInfo.path, viewInfo.source, allSources, collected)

    const sections = []
    sections.push(`# OptiMonk Prototype — Page Export: "${props.currentView}"`)
    sections.push('')
    sections.push('This is an OptiMonk dashboard prototype built with **Vue 3** (Composition API, `<script setup>`), **Tailwind CSS v4**, and **Lucide Vue Next** icons.')
    sections.push('')
    sections.push('## Tech Stack')
    sections.push('- Vue 3.5+ with `<script setup>` (Composition API)')
    sections.push('- Tailwind CSS v4 (using `@theme` in CSS, no tailwind.config.js)')
    sections.push('- Lucide Vue Next for icons')
    sections.push('- Font: Funnel Sans')
    sections.push('')

    // File list
    const filePaths = Array.from(collected.keys())
    sections.push('## Files (' + filePaths.length + ')')
    for (const p of filePaths) {
      const isMain = p === viewInfo.path
      sections.push(`- \`${p}\`${isMain ? ' ← main view' : ''}`)
    }
    sections.push('')

    // Main view first
    sections.push(`## Main View: \`${viewInfo.path}\``)
    sections.push('```vue')
    sections.push(viewInfo.source.trim())
    sections.push('```')
    sections.push('')

    // Then all dependencies
    for (const [path, source] of collected) {
      if (path === viewInfo.path) continue
      sections.push(`## Component: \`${path}\``)
      sections.push('```vue')
      sections.push(source.trim())
      sections.push('```')
      sections.push('')
    }

    // Global CSS
    const cssContent = Object.values(cssSource)[0]
    if (cssContent) {
      sections.push('## Global Styles: `src/style.css`')
      sections.push('```css')
      sections.push(cssContent.trim())
      sections.push('```')
      sections.push('')
    }

    const output = sections.join('\n')
    await navigator.clipboard.writeText(output)
    exportState.value = 'copied'
    setTimeout(() => { exportState.value = 'idle' }, 2500)
  } catch (e) {
    console.error('Export failed:', e)
    exportState.value = 'idle'
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
