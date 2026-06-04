<template>
  <div class="oc-font min-h-screen-safe bg-[var(--oc-bg-subtle)] p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Back -->
      <button
        @click="$emit('navigate', 'apps')"
        class="flex items-center gap-1.5 text-sm font-medium text-[var(--oc-text-muted)] hover:text-[var(--oc-neutral-700)] mb-6 cursor-pointer transition-colors"
      >
        <ArrowLeft :size="15" />
        Back to apps
      </button>

      <!-- Hero -->
      <div class="oc-gradient-bg rounded-[20px] p-10 mb-12 text-white shadow-[var(--oc-shadow-glow)]">
        <div class="flex items-center gap-2 mb-3">
          <Box :size="22" />
          <span class="text-sm font-medium uppercase tracking-wide opacity-90">OptiCube</span>
        </div>
        <h1 class="text-4xl font-bold mb-2">Design System</h1>
        <p class="text-base opacity-90 max-w-xl">
          The foundational tokens and components for building OptiCube product pages.
        </p>
      </div>

      <!-- Colors -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Colors</h2>

        <h3 class="text-base font-medium text-[var(--oc-text-muted)] mb-4">Primary · Indigo</h3>
        <div class="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
          <div v-for="c in primaryScale" :key="c.step" class="space-y-2">
            <div class="h-16 w-full rounded-[10px] border border-[var(--oc-border)]" :style="{ backgroundColor: c.hex }"></div>
            <p class="text-xs text-[var(--oc-text-muted)]" :class="c.brand ? 'font-semibold' : ''">{{ c.step }}</p>
            <p class="text-xs text-[var(--oc-neutral-400)] font-mono">{{ c.hex }}</p>
          </div>
        </div>

        <h3 class="text-base font-medium text-[var(--oc-text-muted)] mb-4">Neutral · Slate</h3>
        <div class="grid grid-cols-5 md:grid-cols-10 gap-2 mb-8">
          <div v-for="c in neutralScale" :key="c.step" class="space-y-2">
            <div class="h-16 w-full rounded-[10px] border border-[var(--oc-border)]" :style="{ backgroundColor: c.hex }"></div>
            <p class="text-xs text-[var(--oc-text-muted)]">{{ c.step }}</p>
            <p class="text-xs text-[var(--oc-neutral-400)] font-mono">{{ c.hex }}</p>
          </div>
        </div>

        <h3 class="text-base font-medium text-[var(--oc-text-muted)] mb-4">Semantic</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="c in semanticColors" :key="c.name" class="space-y-2">
            <div class="h-16 w-full rounded-[10px]" :style="{ backgroundColor: c.hex }"></div>
            <p class="text-sm font-medium text-[var(--oc-text)]">{{ c.name }}</p>
            <p class="text-xs text-[var(--oc-neutral-400)] font-mono">{{ c.hex }}</p>
          </div>
        </div>
      </section>

      <!-- Typography -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Typography</h2>
        <div class="bg-white rounded-[14px] border border-[var(--oc-border)] divide-y divide-[var(--oc-border)]">
          <div v-for="t in typeScale" :key="t.name" class="flex items-baseline justify-between gap-6 px-6 py-4">
            <span :class="[t.cls, 'text-[var(--oc-text)]']">{{ t.sample }}</span>
            <span class="shrink-0 text-right">
              <span class="block text-sm font-medium text-[var(--oc-text)]">{{ t.name }}</span>
              <span class="block text-xs text-[var(--oc-neutral-400)] font-mono">{{ t.spec }}</span>
            </span>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Buttons</h2>
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <OcButton variant="primary">Primary</OcButton>
          <OcButton variant="secondary">Secondary</OcButton>
          <OcButton variant="outline">Outline</OcButton>
          <OcButton variant="ghost">Ghost</OcButton>
          <OcButton variant="primary" disabled>Disabled</OcButton>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <OcButton size="sm">Small</OcButton>
          <OcButton size="md">Medium</OcButton>
          <OcButton size="lg">Large</OcButton>
          <OcButton icon-only aria-label="Add"><template #icon><Plus :size="18" /></template></OcButton>
        </div>
      </section>

      <!-- Inputs -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Inputs</h2>
        <div class="grid md:grid-cols-2 gap-6 max-w-2xl">
          <OcInput v-model="demoInput" label="Email" type="email" placeholder="you@company.com" hint="We'll never share it." />
          <OcInput v-model="demoInput" label="Workspace" placeholder="Required field" required />
          <OcInput label="With error" placeholder="Invalid value" error="This field is required." />
          <OcInput label="Disabled" placeholder="Unavailable" disabled />
        </div>
      </section>

      <!-- Badges -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Badges</h2>
        <div class="flex flex-wrap items-center gap-3">
          <OcBadge variant="primary">Primary</OcBadge>
          <OcBadge variant="neutral">Neutral</OcBadge>
          <OcBadge variant="success"><template #icon><Check :size="12" /></template>Success</OcBadge>
          <OcBadge variant="warning">Warning</OcBadge>
          <OcBadge variant="danger">Danger</OcBadge>
          <OcBadge variant="info">Info</OcBadge>
        </div>
      </section>

      <!-- Toggle -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Toggle</h2>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <OcToggle v-model="demoToggleA" />
            <span class="text-sm text-[var(--oc-text-muted)]">On</span>
          </div>
          <div class="flex items-center gap-3">
            <OcToggle v-model="demoToggleB" />
            <span class="text-sm text-[var(--oc-text-muted)]">Off</span>
          </div>
          <div class="flex items-center gap-3">
            <OcToggle :model-value="true" disabled />
            <span class="text-sm text-[var(--oc-text-muted)]">Disabled</span>
          </div>
        </div>
      </section>

      <!-- Cards -->
      <section class="mb-14">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Cards</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <OcCard shadow="sm">
            <template #header>
              <h3 class="text-base font-semibold text-[var(--oc-text)]">Basic card</h3>
            </template>
            <p class="text-sm text-[var(--oc-text-muted)]">A simple surface with a small shadow and bordered edges.</p>
          </OcCard>
          <OcCard shadow="md" interactive>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-[var(--oc-text)]">Interactive</h3>
                <OcBadge variant="success">Active</OcBadge>
              </div>
            </template>
            <p class="text-sm text-[var(--oc-text-muted)]">Hover to lift. Useful for clickable items and grids.</p>
            <template #footer>
              <OcButton size="sm" variant="secondary">Open</OcButton>
            </template>
          </OcCard>
          <OcCard shadow="lg">
            <template #header>
              <h3 class="text-base font-semibold text-[var(--oc-text)]">Elevated</h3>
            </template>
            <p class="text-sm text-[var(--oc-text-muted)]">A larger shadow for prominent panels and modals.</p>
          </OcCard>
        </div>
      </section>

      <!-- Radius & Shadows -->
      <section class="mb-6">
        <h2 class="text-2xl font-semibold text-[var(--oc-text)] mb-6">Radius &amp; Shadows</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div v-for="r in radii" :key="r.name" class="space-y-2">
            <div :class="['h-16 w-full bg-[var(--oc-primary-100)] border border-[var(--oc-primary-200)]', r.cls]"></div>
            <p class="text-sm font-medium text-[var(--oc-text)]">{{ r.name }}</p>
            <p class="text-xs text-[var(--oc-neutral-400)] font-mono">{{ r.value }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="s in shadows" :key="s.name" class="space-y-2">
            <div :class="['h-16 w-full bg-white rounded-[14px]', s.cls]"></div>
            <p class="text-sm font-medium text-[var(--oc-text)]">{{ s.name }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Box, Plus, Check } from 'lucide-vue-next'
import './opticube.css'
import { primaryScale, neutralScale, semanticColors, typeScale, radii, shadows } from './tokens.js'
import OcButton from './components/OcButton.vue'
import OcCard from './components/OcCard.vue'
import OcInput from './components/OcInput.vue'
import OcBadge from './components/OcBadge.vue'
import OcToggle from './components/OcToggle.vue'

defineEmits(['navigate'])

const demoInput = ref('')
const demoToggleA = ref(true)
const demoToggleB = ref(false)
</script>
