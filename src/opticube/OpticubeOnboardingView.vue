<template>
  <div class="oc-font min-h-screen-safe bg-[var(--oc-bg-subtle)] flex flex-col">
    <!-- Top: brand + progress -->
    <div class="w-full px-8 pt-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 rounded-[8px] oc-gradient-bg flex items-center justify-center text-white">
            <Box :size="18" />
          </div>
          <span class="text-lg font-bold text-[var(--oc-text)]">OptiCube</span>
        </div>
        <div class="h-1.5 w-full rounded-full bg-[var(--oc-neutral-200)] overflow-hidden">
          <div class="h-full oc-gradient-bg transition-all duration-500" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Step content -->
    <div class="flex-1 flex items-center justify-center px-8 py-10">
      <transition name="oc-step" mode="out-in">
        <div :key="currentIndex" class="w-full max-w-2xl">
          <button
            v-if="currentIndex > 0"
            class="flex items-center gap-1.5 text-sm text-[var(--oc-text-muted)] hover:text-[var(--oc-neutral-700)] mb-6 cursor-pointer transition-colors"
            @click="handleBack"
          >
            <ArrowLeft :size="15" />
            Back
          </button>

          <h2 class="text-2xl font-bold text-[var(--oc-text)] mb-2">{{ step.title }}</h2>
          <p v-if="step.subtitle" class="text-sm text-[var(--oc-text-muted)] mb-8">{{ step.subtitle }}</p>
          <div v-else class="mb-8"></div>

          <!-- Card options (e.g. catalog connection) -->
          <div v-if="step.type === 'cards'">
            <div class="grid sm:grid-cols-2 gap-3">
              <button
                v-for="option in step.options"
                :key="option.value"
                :class="[
                  'flex items-start gap-3 p-4 rounded-[14px] text-left transition-all cursor-pointer hover:scale-[1.01] focus:outline-none',
                  answers[step.key] === option.value
                    ? 'bg-[var(--oc-primary-50)] border-2 border-[var(--oc-primary-500)]'
                    : 'bg-white border border-[var(--oc-border)] hover:border-[var(--oc-primary-400)]'
                ]"
                @click="handleSelect(option.value)"
              >
                <span class="shrink-0 w-9 h-9 rounded-[10px] bg-[var(--oc-primary-100)] text-[var(--oc-primary-600)] flex items-center justify-center">
                  <component :is="option.icon" :size="18" />
                </span>
                <span>
                  <span class="block text-sm font-semibold text-[var(--oc-text)]">{{ option.label }}</span>
                  <span class="block text-xs text-[var(--oc-text-muted)] mt-0.5">{{ option.description }}</span>
                </span>
              </button>
            </div>

            <!-- Product feed connect panel -->
            <transition name="oc-step">
              <div v-if="showFeedConnect" class="mt-4 p-5 rounded-[14px] bg-white border border-[var(--oc-border)]">
                <FormInput
                  v-model="feedUrl"
                  label="Product feed URL"
                  type="url"
                  placeholder="https://example.com/feed.xml"
                  hint="Paste a CSV, XML or Google Shopping feed URL."
                />
                <div class="flex justify-end mt-4">
                  <Button variant="primary" :disabled="!feedUrl.trim()" @click="handleConnectFeed">
                    Connect feed
                  </Button>
                </div>
              </div>
            </transition>

            <button
              v-if="step.skip"
              class="mt-6 text-sm text-[var(--oc-text-muted)] hover:text-[var(--oc-primary-600)] underline underline-offset-2 cursor-pointer transition-colors"
              @click="handleSelect(step.skip.value)"
            >
              {{ step.skip.label }}
            </button>
          </div>

          <!-- Chip options -->
          <div v-else class="flex flex-wrap gap-3">
            <button
              v-for="option in step.options"
              :key="option"
              :class="[
                'px-4 py-2.5 rounded-[12px] text-sm transition-all cursor-pointer hover:scale-[1.02] focus:outline-none',
                answers[step.key] === option
                  ? 'bg-[var(--oc-primary-50)] border-2 border-[var(--oc-primary-500)] text-[var(--oc-primary-700)]'
                  : 'bg-white border border-[var(--oc-border)] text-[var(--oc-neutral-700)] hover:border-[var(--oc-primary-400)]'
              ]"
              @click="handleSelect(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Box, ArrowLeft, Link, FileCode2, Facebook } from 'lucide-vue-next'
import Button from '../components/shared/Button.vue'
import FormInput from '../components/shared/FormInput.vue'
import './opticube.css'

const emit = defineEmits(['complete', 'back', 'step-change'])

const steps = [
  {
    key: 'referralSource',
    title: 'How did you hear about us?',
    options: [
      'Partner/agency', 'Google search', 'Instagram/Facebook', 'Friend/colleague',
      'ChatGPT', 'YouTube', 'LinkedIn', 'Already used before',
    ],
  },
  {
    key: 'role',
    title: 'What best describes you?',
    subtitle: 'This helps us tailor your setup.',
    options: [
      'Brand / advertiser', 'Performance marketer', 'Creative strategist',
      'Agency / freelancer', 'Media buyer', 'Other',
    ],
  },
  {
    key: 'goal',
    title: "What's your main goal with OptiCube?",
    subtitle: 'Pick the one that matters most right now.',
    options: [
      'Improve return on ad spend', 'Scale creative production', 'Test more ad variations',
      'Generate product videos', 'Sync my product catalog',
    ],
  },
  {
    key: 'catalog',
    title: 'Connect your catalog',
    subtitle: 'Bring in your products so we can start generating ad creative.',
    type: 'cards',
    options: [
      { value: 'integration', label: 'Use an integration', description: 'Sync from Shopify, WooCommerce, and more.', icon: Link },
      { value: 'file', label: 'Connect product feed', description: 'Link a CSV, XML or Google Shopping feed URL.', icon: FileCode2 },
      { value: 'meta', label: 'Get it from Meta', description: 'Import your existing Meta product catalog.', icon: Facebook },
    ],
    skip: { value: 'sample', label: 'Skip for now — use sample data' },
  },
]

const currentIndex = ref(0)
const answers = ref({})
const feedUrl = ref('')

const step = computed(() => steps[currentIndex.value])
const progress = computed(() => Math.round(((currentIndex.value + 1) / steps.length) * 100))
const showFeedConnect = computed(() => step.value.key === 'catalog' && answers.value.catalog === 'file')

// Keep the DevNavBar step indicator in sync as the user moves through the flow.
watch(currentIndex, (i) => emit('step-change', i + 1), { immediate: true })

const handleSelect = (option) => {
  answers.value = { ...answers.value, [step.value.key]: option }
  // The product feed card reveals a URL input instead of advancing immediately.
  if (step.value.key === 'catalog' && option === 'file') return
  setTimeout(() => {
    if (currentIndex.value < steps.length - 1) {
      currentIndex.value++
    } else {
      emit('complete', { ...answers.value })
    }
  }, 180)
}

const handleConnectFeed = () => {
  emit('complete', { ...answers.value, catalog: 'file', feedUrl: feedUrl.value.trim() })
}

const handleBack = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    emit('back')
  }
}

// --- Dev navbar step navigation ---
const displayStepForNav = computed(() => currentIndex.value + 1)
const totalStepsCount = steps.length
const devGoToStep = (stepNumber) => {
  const index = stepNumber - 1
  if (index >= 0 && index < steps.length) currentIndex.value = index
}

defineExpose({ displayStepForNav, totalStepsCount, devGoToStep })
</script>

<style scoped>
.oc-step-enter-active,
.oc-step-leave-active {
  transition: all 0.3s ease;
}
.oc-step-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.oc-step-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
