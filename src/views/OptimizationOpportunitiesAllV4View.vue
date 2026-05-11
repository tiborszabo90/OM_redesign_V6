<template>
  <DashboardLayout active-menu-item="insights" @menu-click="$emit('menu-click', $event)" background-color="#F5F6F8" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-350 mx-auto -mt-3" style="margin-bottom:-2rem;">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <button
              @click="$emit('go-back')"
              class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-om-gray-100 text-om-gray-500 hover:text-om-gray-700 transition-colors"
            >
              <ChevronLeft :size="20" />
            </button>
            <div>
              <h1 class="text-2xl font-semibold text-om-gray-700 leading-tight">All Optimization Opportunities</h1>
              <div class="flex items-center gap-1.5 mt-1 text-sm text-om-gray-500">
                <div class="w-4 h-4 rounded-full bg-[#7AAF8A] flex items-center justify-center shrink-0">
                  <Dice5 :size="10" class="text-white" />
                </div>
                <span>Insights for <span class="font-medium text-om-gray-700">{{ activeDomain }}</span></span>
              </div>
            </div>
          </div>
          <span class="text-sm text-om-gray-400">{{ croInsights.length }} insights · {{ groups.length }} campaigns</span>
        </div>

        <!-- 50/50 split card -->
        <div class="split-card">

          <!-- Left half: accordion list -->
          <div class="split-pane split-pane--left">
            <div class="flex flex-col gap-3">
              <Accordion
                v-for="group in groups"
                :key="group.campaign"
                :title="group.campaign"
                :open="!!openGroups[group.campaign]"
                @toggle="toggleGroup(group.campaign)"
              >
                <div class="insight-list">
                  <button
                    v-for="insight in group.insights"
                    :key="insight.id"
                    @click="selectedInsightId = insight.id"
                    :class="['insight-row', selectedInsightId === insight.id && 'insight-row--active']"
                  >
                    <div class="insight-row-icon">
                      <component :is="insightIcons[insight.id]" :size="20" />
                    </div>
                    <div class="insight-row-content">
                      <div class="insight-row-header">
                        <div class="insight-row-name">{{ insight.name }}</div>
                        <div :class="['insight-row-badge', `badge-${insight.level}`]">{{ insight.value }} impact</div>
                      </div>
                      <div class="insight-row-desc">{{ insight.description }}</div>
                    </div>
                  </button>
                </div>
              </Accordion>
            </div>
          </div>

          <!-- Right half: detail of selected insight -->
          <div class="split-pane split-pane--right">
            <div v-if="selectedInsight" :class="['sticky-bar', { 'sticky-bar--visible': isScrolled }]">
              <h3 class="sticky-bar-title">{{ selectedInsight.name }}</h3>
              <button v-if="selectedInsight.campaign === 'New campaign idea'" class="hero-action-btn hero-action-btn--primary">
                <Plus :size="14" /> Create campaign
              </button>
              <button v-else class="hero-action-btn hero-action-btn--primary">
                <ArrowUpRight :size="14" /> View campaign
              </button>
            </div>
            <div ref="detailScrollRef" v-if="selectedInsight" class="detail-scroll" @scroll="onDetailScroll">
              <div class="detail-wrapper">

                <!-- Hero -->
                <div class="detail-hero">
                  <div class="detail-hero-content">
                    <div :class="['detail-hero-impact', `impact-${selectedInsight.level}`]">
                      <Zap :size="13" /> {{ selectedInsight.value }} impact
                    </div>
                    <h2 class="detail-hero-title">{{ selectedInsight.name }}</h2>
                    <div class="detail-hero-cta">
                      <button v-if="selectedInsight.campaign === 'New campaign idea'" class="hero-action-btn hero-action-btn--primary">
                        <Plus :size="14" /> Create campaign
                      </button>
                      <button v-else class="hero-action-btn hero-action-btn--primary">
                        <ArrowUpRight :size="14" /> View campaign
                      </button>
                    </div>
                  </div>
                  <div v-if="hasThumbnail" class="campaign-thumb-img" />
                </div>

                <div class="detail-content">
                  <div class="detail-section">
                    <h3 class="detail-section-title">
                      <Eye :size="16" class="detail-section-icon" />
                      Observation
                    </h3>
                    <p class="detail-section-text">{{ selectedInsight.observation }}</p>
                  </div>

                <div class="detail-section">
                  <h3 class="detail-section-title">
                    <BarChart3 :size="16" class="detail-section-icon" />
                    Supporting evidence
                  </h3>
                  <p class="detail-section-text">{{ selectedInsight.evidence }}</p>
                </div>

                <div class="detail-section">
                  <h3 class="detail-section-title">
                    <Lightbulb :size="16" class="detail-section-icon" />
                    Tentative recommendation
                  </h3>
                  <p class="detail-section-text">{{ selectedInsight.recommendation }}</p>
                </div>

                <div class="detail-section">
                  <h3 class="detail-section-title">
                    <ClipboardList :size="16" class="detail-section-icon" />
                    Validation needs
                  </h3>
                  <p class="detail-section-text">{{ selectedInsight.validationNeeds }}</p>
                </div>

                <div class="detail-section">
                  <h3 class="detail-section-title">
                    <ListChecks :size="16" class="detail-section-icon" />
                    Validation plan
                  </h3>
                  <ol class="stepper">
                    <li
                      v-for="(step, idx) in selectedInsight.validationPlan"
                      :key="idx"
                      class="stepper-step"
                    >
                      <div class="stepper-marker">
                        <span class="stepper-circle">{{ idx + 1 }}</span>
                      </div>
                      <span class="stepper-text">{{ step }}</span>
                    </li>
                  </ol>
                </div>

                <div class="detail-section">
                  <h3 class="detail-section-title">
                    <TrendingUp :size="16" class="detail-section-icon" />
                    Expected user value
                  </h3>
                  <p class="detail-section-text">
                    <strong class="font-semibold text-om-gray-700">{{ selectedInsight.value }}</strong> potential impact. {{ selectedInsight.impactNote }}
                  </p>
                </div>
              </div>
            </div>
            </div>
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
import { ref, computed, reactive, watch, nextTick } from 'vue'
import {
  ChevronLeft, Dice5,
  MessageCircle, MousePointerClick, Filter, FlaskConical, Monitor, Clock, RotateCw,
  Facebook, Target, Search, Route, Tag as TagIcon, Sparkles, LayoutGrid, Layers,
  Info, ClipboardList, ShieldAlert, Smartphone, Eye, Wand2, ArrowDown,
  BarChart3, ShieldCheck, Globe, Truck,
  Zap, Lightbulb, ListChecks, TrendingUp, ArrowUpRight, Plus,
} from 'lucide-vue-next'

const insightIcons = {
  1: MessageCircle, 2: MousePointerClick, 3: Filter, 4: FlaskConical,
  5: Monitor, 6: Clock, 7: RotateCw, 8: Facebook, 9: Target, 10: Search,
  11: Route, 12: TagIcon, 13: Sparkles, 14: LayoutGrid, 15: Layers,
  16: Info, 17: ClipboardList, 18: ShieldAlert, 19: Smartphone, 20: Eye,
  21: Wand2, 22: ArrowDown, 23: BarChart3, 24: ShieldCheck, 25: Globe, 26: Truck,
}

import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import Accordion from '../components/shared/Accordion.vue'
import { croInsights } from '../data/croInsights.js'

const props = defineProps({
  initialInsightId: { type: Number, default: null },
})

defineEmits(['menu-click', 'go-back'])

const isChatOpen = ref(false)
const activeDomain = ref('reflexshop.hu')
const detailScrollRef = ref(null)
const isScrolled = ref(false)

const noThumbnailCampaigns = new Set([
  'New campaign idea',
  'PX_01 + "mi az új?" overlap',
])

function onDetailScroll(e) {
  isScrolled.value = e.target.scrollTop > 80
}

const impactPriority = { Large: 5, 'Medium to large': 4, Medium: 3, 'Small to medium': 2, Small: 1 }
const labelToLevel = { Large: 'high', 'Medium to large': 'high', Medium: 'medium', 'Small to medium': 'low', Small: 'low' }

const groups = computed(() => {
  const byCampaign = new Map()
  for (const insight of croInsights) {
    if (!byCampaign.has(insight.campaign)) byCampaign.set(insight.campaign, [])
    byCampaign.get(insight.campaign).push(insight)
  }

  const result = []
  for (const [campaign, insights] of byCampaign.entries()) {
    insights.sort((a, b) => a.id - b.id)

    const distCounts = insights.reduce((acc, i) => {
      acc[i.value] = (acc[i.value] || 0) + 1
      return acc
    }, {})
    const impactDistribution = Object.entries(distCounts)
      .sort(([a], [b]) => (impactPriority[b] ?? 0) - (impactPriority[a] ?? 0))
      .map(([label, count]) => ({ label, count, level: labelToLevel[label] ?? 'medium' }))

    const topImpact = impactDistribution[0]?.label ?? '—'
    const subtitle = `${insights.length} ${insights.length === 1 ? 'insight' : 'insights'} · top impact: ${topImpact}`

    result.push({
      campaign,
      insights,
      subtitle,
      impactDistribution,
      firstId: insights[0].id,
    })
  }

  return result.sort((a, b) => a.firstId - b.firstId)
})

const openGroups = reactive({})

const initialId = props.initialInsightId && croInsights.some(i => i.id === props.initialInsightId)
  ? props.initialInsightId
  : groups.value[0]?.insights[0]?.id ?? null

const initialCampaign = croInsights.find(i => i.id === initialId)?.campaign ?? groups.value[0]?.campaign
if (initialCampaign) openGroups[initialCampaign] = true

const selectedInsightId = ref(initialId)

const selectedInsight = computed(() => croInsights.find(i => i.id === selectedInsightId.value) ?? null)

const hasThumbnail = computed(() =>
  !!selectedInsight.value?.campaign && !noThumbnailCampaigns.has(selectedInsight.value.campaign)
)

function toggleGroup(campaign) {
  openGroups[campaign] = !openGroups[campaign]
}

watch(selectedInsightId, (newId) => {
  if (newId == null) return
  const parent = groups.value.find(g => g.insights.some(i => i.id === newId))
  if (parent && !openGroups[parent.campaign]) {
    openGroups[parent.campaign] = true
  }
  isScrolled.value = false
  nextTick(() => {
    if (detailScrollRef.value) detailScrollRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  })
})

const chatSuggestions = [
  'Where should I start first?',
  'Which insights have the highest impact?',
  'Which insights are quickest to validate?',
  'How should I read the insight detail?',
]

const chatAiResponses = {
  'Where should I start first?': 'A reasonable order:\n\n1. **PC Service Abandonment Stopper** — your strongest existing campaign, with 2 Large insights to expand and protect it.\n2. **PX_01** — biggest active acquisition popup with 7 angles to improve.\n3. **New campaign idea — Facebook (#8)** — your largest underperforming traffic source.',
  'Which insights have the highest impact?': 'Three insights are flagged as **Large**:\n\n- **#8** — Build a Facebook-specific onsite experience\n- **#18** — Fix abandonment stopper checkout exclusions\n- **#19** — Create a mobile version of the abandonment stopper\n\nAnother eight are Medium-to-large.',
  'Which insights are quickest to validate?': 'Inspection-only insights (no test required):\n\n- **#3** — pull PX_01 page-level impressions\n- **#7** — verify visitor-status logic\n- **#18** — map cart/checkout URLs against current exclusions\n- **#20** — reproduce abandonment popup with a real cart\n- **#26** — confirm Wolt offer status\n\nEach should take well under a day.',
  'How should I read the insight detail?': 'Each insight has six sections:\n\n- **Observation** — what the agent noticed.\n- **Supporting evidence** — the numbers/facts that triggered it.\n- **Tentative recommendation** — what to consider doing, conditional on validation.\n- **Validation needs** — what data or QA is required.\n- **Validation plan** — concrete steps in order.\n- **Expected user value** — qualitative impact with rationale.',
}
</script>

<style scoped>
.split-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: 16px;
}

.split-pane {
  min-width: 0;
}

.split-pane--left {
  padding: 0;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.split-pane--right {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 200px);
}

.sticky-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 40px;
  background: white;
  border-bottom: 1px solid #ECEEF1;
  border-radius: 16px 16px 0 0;
  transform: translateY(-100%);
  transition: transform 0.2s ease;
  pointer-events: none;
}

.sticky-bar--visible {
  transform: translateY(0);
  pointer-events: auto;
}

.sticky-bar-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #23262A;
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 36px 40px;
}

.detail-hero-cta {
  margin-top: 4px;
}

.impact-pip {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}

.impact-pip--high {
  background: #FFF0EB;
  color: #C94B14;
}

.impact-pip--medium {
  background: #FFF8E6;
  color: #9A6400;
}

.impact-pip--low {
  background: #F1F2F4;
  color: #6B7280;
}

/* Align Accordion title with body cards' left edge */
.split-pane--left :deep(.relative > button) {
  padding-left: 1.75rem !important;
}

.insight-list {
  display: flex;
  flex-direction: column;
}

.insight-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  background: white;
  border: 2px solid #E5E7EB;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.insight-row + .insight-row {
  margin-top: 12px;
}

.insight-row:hover {
  border-color: #ED5A29;
  box-shadow: 0 4px 14px rgba(237, 90, 41, 0.4);
}

.insight-row--active {
  border-color: #ED5A29;
  box-shadow: 0 4px 14px rgba(237, 90, 41, 0.4);
}

.insight-row-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #FFF0EB;
  color: #C94B14;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.insight-row-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.insight-row-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.insight-row-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #23262A;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
}

.insight-row-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 999px;
  white-space: nowrap;
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

.insight-row-campaign {
  font-size: 0.8125rem;
  color: #3F4248;
  line-height: 1.6;
  margin: 0;
}

.insight-row-campaign strong {
  color: #23262A;
  font-weight: 600;
}

.insight-row-desc {
  font-size: 0.8125rem;
  color: #6B7280;
  line-height: 1.5;
}

.value-badge {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
}

.detail-wrapper {
  max-width: 640px;
}

/* Hero */
.detail-hero {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 24px;
  margin-bottom: 28px;
  border-bottom: 1px solid #ECEEF1;
}

.detail-hero-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.hero-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
  white-space: nowrap;
}

.hero-action-btn--secondary {
  background: white;
  border-color: #ECEEF1;
  color: #4B5563;
}

.hero-action-btn--secondary:hover {
  border-color: #D1D5DB;
  color: #23262A;
}

.hero-action-btn--primary {
  background: #ED5A29;
  color: white;
}

.hero-action-btn--primary:hover {
  background: #C94B14;
  box-shadow: 0 2px 8px rgba(237, 90, 41, 0.3);
}

.detail-hero-impact {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  align-self: flex-start;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.impact-high {
  background: #FFF0EB;
  color: #C94B14;
}

.impact-medium {
  background: #FFF8E6;
  color: #9A6400;
}

.impact-low {
  background: #F1F2F4;
  color: #6B7280;
}

.detail-hero-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #23262A;
  line-height: 1.4;
  margin: 0;
}

.campaign-thumb-img {
  width: 240px;
  height: 170px;
  border-radius: 12px;
  background: #ECEEF1;
  flex-shrink: 0;
}

/* Sections */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #23262A;
  margin: 0;
}

.detail-section-icon {
  color: #ED5A29;
  flex-shrink: 0;
}

.detail-section-text {
  font-size: 0.9375rem;
  color: #4B5563;
  line-height: 1.7;
  margin: 0;
}

/* Validation plan — stepper */
.stepper {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.stepper-step {
  display: flex;
  gap: 14px;
  position: relative;
  padding-bottom: 20px;
}

.stepper-step:last-child {
  padding-bottom: 0;
}

.stepper-marker {
  position: relative;
  flex-shrink: 0;
}

.stepper-step:not(:last-child) .stepper-marker::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 28px;
  bottom: -20px;
  width: 2px;
  margin-left: -1px;
  background: #ECEEF1;
}

.stepper-circle {
  position: relative;
  z-index: 1;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 2px solid #ECEEF1;
  color: #6B7280;
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stepper-text {
  font-size: 0.9375rem;
  color: #3F4248;
  line-height: 1.5;
  padding-top: 4px;
}
</style>
