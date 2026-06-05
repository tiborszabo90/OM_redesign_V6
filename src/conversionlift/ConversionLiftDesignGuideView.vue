<template>
  <div class="min-h-screen bg-om-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Back -->
      <button
        @click="$emit('navigate', 'apps')"
        class="flex items-center gap-1.5 text-sm font-medium text-om-gray-500 hover:text-om-gray-700 mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft :size="15" />
        Back to apps
      </button>

      <!-- Hero -->
      <div
        class="rounded-2xl p-10 mb-12 text-white shadow-[0_8px_24px_rgba(14,165,233,0.30)]"
        style="background: linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)"
      >
        <div class="flex items-center gap-2 mb-3">
          <Zap :size="22" />
          <span class="text-sm font-medium uppercase tracking-wide opacity-90">ConversionLift</span>
        </div>
        <h1 class="text-4xl font-bold mb-2">Design Guide</h1>
        <p class="text-base opacity-90 max-w-xl">
          ConversionLift builds on the OptiMonk palette and shared component library, with a sky
          accent for product context. Use these tokens, components, and domain badges when building
          ConversionLift views.
        </p>
      </div>

      <!-- Colors -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">Colors</h2>

        <h3 class="text-base font-medium text-om-gray-500 mb-4">Brand · Sky (primary)</h3>
        <div class="grid grid-cols-4 md:grid-cols-7 gap-2 mb-8">
          <div v-for="c in brandScale" :key="c.step" class="space-y-2">
            <div class="h-16 w-full rounded-[10px] border border-om-gray-200" :style="{ backgroundColor: c.hex }"></div>
            <p class="text-xs text-om-gray-500" :class="c.brand ? 'font-semibold' : ''">{{ c.step }}</p>
            <p class="text-xs text-om-gray-400 font-mono">{{ c.hex }}</p>
          </div>
        </div>

        <h3 class="text-base font-medium text-om-gray-500 mb-4">Neutral · Gray</h3>
        <div class="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
          <div v-for="c in neutralScale" :key="c.step" class="space-y-2">
            <div class="h-16 w-full rounded-[10px] border border-om-gray-200" :style="{ backgroundColor: c.hex }"></div>
            <p class="text-xs text-om-gray-500">{{ c.step }}</p>
            <p class="text-xs text-om-gray-400 font-mono">{{ c.hex }}</p>
          </div>
        </div>

        <h3 class="text-base font-medium text-om-gray-500 mb-4">Semantic</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="c in semanticColors" :key="c.name" class="space-y-2">
            <div class="h-16 w-full rounded-[10px]" :style="{ backgroundColor: c.hex }"></div>
            <p class="text-sm font-medium text-om-gray-700">{{ c.name }}</p>
            <p class="text-xs text-om-gray-400 font-mono">{{ c.hex }}</p>
          </div>
        </div>
      </section>

      <!-- Typography -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">Typography</h2>
        <div class="bg-white rounded-[14px] border border-om-gray-200 divide-y divide-om-gray-100">
          <div v-for="t in typeScale" :key="t.name" class="flex items-baseline justify-between gap-6 px-6 py-4">
            <span :class="[t.cls, 'text-om-gray-700']">{{ t.sample }}</span>
            <span class="shrink-0 text-right">
              <span class="block text-sm font-medium text-om-gray-700">{{ t.name }}</span>
              <span class="block text-xs text-om-gray-400 font-mono">{{ t.spec }}</span>
            </span>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">Buttons <span class="text-sm font-normal text-om-gray-400">· shared/Button.vue</span></h2>
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button icon-only aria-label="Add"><template #icon><Plus :size="18" /></template></Button>
          <Button variant="primary"><template #icon><Sparkles :size="16" /></template>Generate</Button>
        </div>
      </section>

      <!-- Inputs -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">Inputs <span class="text-sm font-normal text-om-gray-400">· shared/FormInput.vue</span></h2>
        <div class="grid md:grid-cols-2 gap-6 max-w-2xl">
          <FormInput v-model="demoInput" label="Store URL" placeholder="example.com" hint="We'll sync the catalog." />
          <FormInput v-model="demoInput" label="Domain name" placeholder="Required field" :required="true" />
          <FormInput label="With error" placeholder="Invalid value" error="This field is required." />
          <FormInput label="Disabled" placeholder="Unavailable" :disabled="true" />
        </div>
      </section>

      <!-- Selects & toggles -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">Selects &amp; controls</h2>
        <div class="grid md:grid-cols-2 gap-8 max-w-2xl">
          <div>
            <p class="text-sm font-medium text-om-gray-600 mb-2">Dropdown <span class="text-om-gray-400">· shared/Dropdown.vue</span></p>
            <Dropdown v-model="demoScope" :options="scopeOptions" placeholder="Select scope" />
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <ToggleSwitch v-model="demoToggle" />
              <span class="text-sm text-om-gray-600">Auto-winner <span class="text-om-gray-400">· shared/ToggleSwitch.vue</span></span>
            </div>
            <Checkbox v-model="demoCheck" label="Approve before launch · shared/Checkbox.vue" />
          </div>
        </div>
      </section>

      <!-- Domain badges (ConversionLift-specific) -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-1">ConversionLift badges <span class="text-sm font-normal text-om-gray-400">· shared/Tag.vue</span></h2>
        <p class="text-sm text-om-gray-500 mb-6">Domain-specific patterns built from the shared Tag component.</p>

        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-sm font-medium text-om-gray-600 mb-3">Optimization type</h3>
            <div class="flex flex-wrap gap-2">
              <div v-for="t in optimizationTypes" :key="t.key" class="flex items-center gap-2">
                <Tag :variant="t.variant">{{ t.label }}</Tag>
                <span class="text-xs text-om-gray-400">{{ t.desc }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-om-gray-600 mb-3">Content type</h3>
            <div class="flex flex-wrap gap-2">
              <Tag v-for="c in contentTypes" :key="c.key" :variant="c.variant">
                <template #icon><component :is="contentIcon[c.icon]" :size="12" /></template>
                {{ c.label }}
              </Tag>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-om-gray-600 mb-3">Generated item status</h3>
            <div class="flex flex-wrap gap-2">
              <Tag v-for="s in itemStatuses" :key="s.key" :variant="s.variant">{{ s.label }}</Tag>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-om-gray-600 mb-3">Experiment status</h3>
            <div class="flex flex-wrap gap-2">
              <Tag v-for="s in experimentStatuses" :key="s.key" :variant="s.variant">{{ s.label }}</Tag>
            </div>
          </div>
        </div>
      </section>

      <!-- Composed examples -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">Composed patterns</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Optimization card -->
          <div class="bg-white rounded-2xl border border-om-gray-200 p-5 shadow-[0_4px_12px_rgba(17,18,19,0.08)]">
            <div class="flex items-center gap-2 mb-3">
              <Tag variant="orange">Replace</Tag>
              <Tag variant="gray"><template #icon><Type :size="12" /></template>Text</Tag>
            </div>
            <h3 class="text-base font-semibold text-om-gray-700 mb-1">Product title</h3>
            <p class="text-sm text-om-gray-500 mb-4">
              Titles are feature-first. A benefit-led headline that names the outcome lifts add-to-cart intent.
            </p>
            <div class="flex items-center gap-2">
              <Button size="sm" variant="primary">Accept</Button>
              <Button size="sm" variant="ghost">Edit</Button>
              <Button size="sm" variant="ghost">Dismiss</Button>
            </div>
          </div>

          <!-- Lift / significance -->
          <div class="bg-white rounded-2xl border border-om-gray-200 p-5 shadow-[0_4px_12px_rgba(17,18,19,0.08)]">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-om-gray-600">Conversion lift</span>
              <Tag variant="green-light"><template #icon><Check :size="12" /></template>Significant · 95%</Tag>
            </div>
            <div class="flex items-end gap-2 mb-1">
              <span class="text-4xl font-bold text-[#2CC896]">+28%</span>
              <TrendingUp :size="24" class="text-[#2CC896] mb-1.5" />
            </div>
            <p class="text-sm text-om-gray-500">Control 2.1% → Treatment 2.7% · 36 products in scope</p>
          </div>
        </div>
      </section>

      <!-- Radius & Shadows -->
      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-6">Radius &amp; Shadows</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div v-for="r in radii" :key="r.name" class="space-y-2">
            <div :class="['h-16 w-full bg-(--cl-accent-100) border border-(--cl-accent-200)', r.cls]"></div>
            <p class="text-sm font-medium text-om-gray-700">{{ r.name }}</p>
            <p class="text-xs text-om-gray-400 font-mono">{{ r.value }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="s in shadows" :key="s.name" class="space-y-2">
            <div :class="['h-16 w-full bg-white rounded-[14px]', s.cls]"></div>
            <p class="text-sm font-medium text-om-gray-700">{{ s.name }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Zap, Plus, Check, Sparkles, Type, Image, LayoutTemplate, TrendingUp } from 'lucide-vue-next'
import './conversionlift.css'
import {
  brandScale, neutralScale, semanticColors, typeScale, radii, shadows,
  optimizationTypes, contentTypes, itemStatuses, experimentStatuses,
} from './tokens.js'
import Button from '../components/shared/Button.vue'
import FormInput from '../components/shared/FormInput.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import ToggleSwitch from '../components/shared/ToggleSwitch.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Tag from '../components/shared/Tag.vue'

defineEmits(['navigate'])

// Icon lookup for content-type badges
const contentIcon = { Type, Image, LayoutTemplate }

const demoInput = ref('')
const demoToggle = ref(true)
const demoCheck = ref(false)
const demoScope = ref(null)
const scopeOptions = ['All products', 'Collection', 'Filter by category', 'Manual selection']
</script>
