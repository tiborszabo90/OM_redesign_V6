<template>
  <DashboardLayout active-menu-item="insights" @menu-click="$emit('menu-click', $event)" :right-panel-collapsed="!isChatOpen" background-color="white">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">

        <!-- Header -->
        <div class="flex items-start justify-between mb-6 gap-4">
          <div class="flex items-start gap-3 min-w-0">
            <button
              @click="$emit('go-back')"
              class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-om-gray-100 text-om-gray-500 hover:text-om-gray-700 transition-colors shrink-0 mt-1"
            >
              <ChevronLeft :size="20" />
            </button>
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <Tag variant="gray-muted">{{ insight.campaign }}</Tag>
                <div :class="['value-badge', `badge-${insight.level}`]">{{ insight.value }}</div>
              </div>
              <h1 class="text-2xl font-semibold text-om-gray-700 leading-tight">{{ insight.name }}</h1>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="detail-content">

          <div class="detail-section">
            <h2 class="detail-section-title">Observation</h2>
            <p class="detail-section-text">{{ insight.observation }}</p>
          </div>

          <div class="detail-section">
            <h2 class="detail-section-title">Supporting evidence</h2>
            <p class="detail-section-text">{{ insight.evidence }}</p>
          </div>

          <div class="detail-section">
            <h2 class="detail-section-title">Tentative recommendation</h2>
            <p class="detail-section-text">{{ insight.recommendation }}</p>
          </div>

          <div class="detail-section">
            <h2 class="detail-section-title">Validation needs</h2>
            <p class="detail-section-text">{{ insight.validationNeeds }}</p>
          </div>

          <div class="detail-section">
            <h2 class="detail-section-title">Validation plan</h2>
            <ul class="validation-plan">
              <li v-for="(step, idx) in insight.validationPlan" :key="idx" class="validation-step">
                <span class="validation-step-number">{{ idx + 1 }}</span>
                <span class="validation-step-text">{{ step }}</span>
              </li>
            </ul>
          </div>

          <div class="detail-section">
            <h2 class="detail-section-title">Expected user value</h2>
            <p class="detail-section-text">
              <strong class="font-semibold text-om-gray-700">{{ insight.value }}</strong> potential impact. {{ insight.impactNote }}
            </p>
          </div>

        </div>
      </div>
    </template>

    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import Tag from '../components/shared/Tag.vue'
import { croInsights } from '../data/croInsights.js'

const props = defineProps({
  opportunityId: {
    type: Number,
    default: 1
  }
})

defineEmits(['menu-click', 'go-back'])

const isChatOpen = ref(false)

const chatSuggestions = [
  'How should I validate this insight?',
  'What evidence would confirm or reject it?',
  'Which OptiMonk feature applies here?',
  'How long should validation take?',
]

const chatAiResponses = {
  'How should I validate this insight?': 'Walk through the validation plan in order, treating each step as a small inspection rather than a full test:\n\n1. Start with what is observable in OptiMonk and your analytics today.\n2. If the inspection confirms the observation, define a single hypothesis to test.\n3. Only then build a campaign change or A/B test.\n\nThe goal of validation is to either rule the insight out cheaply or sharpen it into a concrete experiment.',
  'What evidence would confirm or reject it?': 'Look for evidence in three places:\n\n- **OptiMonk reporting** — campaign-level and page-level impression and submit data.\n- **Site analytics (GA / theMarketer)** — landing page behavior, click paths, conversion by source.\n- **Live QA** — desktop and mobile screenshots of the actual rendered campaign.\n\nIf all three line up with the observation, the insight is worth acting on. If any of them disagree, refine the hypothesis before launching a test.',
  'Which OptiMonk feature applies here?': 'Most of these insights map to one of these features:\n\n- **Targeting rules** — URL include/exclude lists, visitor status, device.\n- **Triggers** — time on page, exit intent, inactivity, scroll depth.\n- **Goals & events** — to separate signal types like age confirmation from real submits.\n- **A/B testing** — when the validation plan ends in a "test new variant" step.\n\nThe Templates library and product recommender block also come up for several of the new-campaign ideas.',
  'How long should validation take?': 'Most validation steps are inspection-only and can be finished in under a day. Steps that require waiting for more data (e.g. "wait for larger sample") usually need 1–2 weeks of campaign traffic. Steps that include an A/B test should run until each variant has at least ~1,000 impressions before drawing conclusions.',
}

const insight = computed(() => croInsights.find(i => i.id === props.opportunityId) || croInsights[0])
</script>

<style scoped>
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}

.back-btn:hover {
  color: #23262A;
  background: #F1F2F4;
}

.value-badge {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
  flex-shrink: 0;
}

.badge-high {
  background: #FFF0EB;
  color: #C94B14;
}

.badge-medium {
  background: #FFF8E6;
  color: #9A6400;
}

.badge-low {
  background: #F1F2F4;
  color: #6B7280;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 760px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #23262A;
  margin: 0;
}

.detail-section-text {
  font-size: 0.9375rem;
  color: #4B5563;
  line-height: 1.7;
  margin: 0;
}

.validation-plan {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.validation-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.validation-step-number {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #F1F2F4;
  color: #6B7280;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.validation-step-text {
  font-size: 0.9375rem;
  color: #4B5563;
  line-height: 1.6;
}
</style>
