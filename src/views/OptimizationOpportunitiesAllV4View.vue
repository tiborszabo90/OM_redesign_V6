<template>
  <DashboardLayout active-menu-item="insights" @menu-click="$emit('menu-click', $event)" background-color="#F5F6F8" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-350 mx-auto -mt-3 pb-25" style="margin-bottom:-2rem;">

        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl max-960:text-xl font-semibold text-om-gray-700">Insights ({{ sortedInsights.length }})</h1>
          <div class="flex flex-wrap items-center gap-3 mt-4 text-sm text-om-gray-500">
            <div class="w-56">
              <Dropdown
                v-model="activeDomain"
                :options="domains"
                placeholder="Select domain"
              >
                <template #icon>
                  <img src="/demos/telekom/logo.png" alt="Domain" class="w-5 h-5 rounded-full object-cover" />
                </template>
              </Dropdown>
            </div>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-om-gray-700 bg-om-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap">
              <Calendar :size="12" />
              Reporting period: May 1 – May 31, 2026
            </span>
          </div>
        </div>

        <!-- 50/50 split card -->
        <div class="split-card">

          <!-- Left half: flat insight list -->
          <div class="split-pane split-pane--left">
            <div ref="leftPaneRef" class="split-pane-scroll" :style="leftMaskStyle" @scroll="onLeftScroll">
              <div class="insight-list insight-list--flat">
              <button
                v-for="insight in visibleInsights"
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
                  </div>
                  <div v-if="insight.campaign" class="insight-row-campaign">{{ insight.campaign }}</div>
                </div>
              </button>
              <div v-if="sortedInsights.length > visibleCount" ref="showMoreRef" class="flex justify-center mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  @click="visibleCount = sortedInsights.length"
                >
                  <template #icon><ChevronDown :size="16" /></template>
                  Show {{ sortedInsights.length - visibleCount }} more
                </Button>
              </div>
              </div>
            </div>
          </div>

          <!-- Right half: detail of selected insight -->
          <div class="split-pane split-pane--right">
            <div v-if="selectedInsight && doItForMeView === 'idle'" :class="['sticky-bar', { 'sticky-bar--visible': isScrolled }]">
              <h3 class="sticky-bar-title">{{ selectedInsight.name }}</h3>
              <div class="sticky-bar-actions">
                <button class="hero-action-btn hero-action-btn--primary" @click="doItForMeView = 'pitch'">
                  <Wand2 :size="14" /> Do it for me
                </button>
                <Button v-if="selectedInsight.campaign !== 'New campaign idea'" variant="secondary" size="sm">
                  <template #icon><ArrowUpRight :size="14" /></template>
                  View campaign
                </Button>
              </div>
            </div>

            <!-- Do it for me pitch sub-page -->
            <div v-if="selectedInsight && doItForMeView === 'pitch'" class="do-it-pane">
              <div class="do-it-card">
                <img src="/monk-work.svg" alt="Monk at work" class="do-it-image" />
                <div class="flex items-center gap-2 justify-center flex-wrap">
                  <h2 class="do-it-title">Done-for-you setup</h2>
                  <span class="inline-flex items-center rounded-full font-medium px-3 py-1 text-xs text-white" style="background-color: #8444E1;">Beta</span>
                </div>
                <p class="do-it-text">
                  Our fully automatic AI Agent is in beta, we review each case manually. It is still 100% free for you, but that's why it takes <strong>24 hours</strong>. Shall we proceed?
                </p>
                <div class="do-it-actions">
                  <button class="hero-action-btn hero-action-btn--primary" @click="doItForMeView = 'accepted'">
                    <Check :size="14" /> Yes, go ahead
                  </button>
                  <button class="hero-action-btn hero-action-btn--secondary" @click="doItForMeView = 'idle'">
                    <ArrowUpRight :size="14" /> I'll do it myself
                  </button>
                </div>
              </div>
            </div>

            <!-- Accepted confirmation -->
            <div v-if="selectedInsight && doItForMeView === 'accepted'" class="do-it-pane">
              <div class="do-it-card">
                <img src="/monk-happy-white2.svg" alt="Happy monk" class="do-it-image" />
                <h2 class="do-it-title">Brilliant choice, we're on it.</h2>
                <p class="do-it-text">
                  We'll get cracking on <strong>"{{ selectedInsight.name }}"</strong> and email you the moment the variant is ready. In the meantime, go brew yourself a victory coffee. You've earned it.
                </p>
                <div class="do-it-actions">
                  <button class="hero-action-btn hero-action-btn--secondary" @click="doItForMeView = 'idle'">
                    <ChevronLeft :size="14" /> Back to insight
                  </button>
                </div>
              </div>
            </div>

            <div ref="detailScrollRef" v-if="selectedInsight && doItForMeView === 'idle'" :class="['detail-scroll', { 'scroll-fade': !isDetailAtBottom }]" @scroll="onDetailScroll">
              <div class="detail-wrapper">

                <!-- Hero -->
                <div class="detail-hero">
                  <div class="detail-hero-content">
                    <div :class="['detail-hero-impact', `impact-${selectedInsight.level}`]">
                      <Zap :size="13" /> {{ selectedInsight.value }} impact
                    </div>
                    <h2 class="detail-hero-title">{{ selectedInsight.name }}</h2>
                    <div class="detail-hero-cta">
                      <button class="hero-action-btn hero-action-btn--primary" @click="doItForMeView = 'pitch'">
                        <Wand2 :size="14" /> Do it for me
                      </button>
                      <Button v-if="selectedInsight.campaign !== 'New campaign idea'" variant="secondary" size="sm">
                        <template #icon><ArrowUpRight :size="14" /></template>
                        View campaign
                      </Button>
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

        <!-- CRO consultation block -->
        <div class="cro-help-block">
          <div class="relative shrink-0 h-64 overflow-hidden">
            <img src="/review_img.png" alt="Customer Success team" class="w-auto block" style="height: calc(100% + 40px); margin-top: -40px;" />
            <div class="absolute right-0 top-0 bottom-0 w-6 pointer-events-none" style="background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))"></div>
            <div class="absolute -left-4 top-[60%] bg-om-gray-800 shadow-md px-3 py-1">
              <span class="text-xs font-medium text-white relative -top-px">Kata</span>
            </div>
            <div class="absolute right-14 bottom-20 bg-om-gray-800 shadow-md px-3 py-1">
              <span class="text-xs font-medium text-white relative -top-px">Emil</span>
            </div>
            <div class="absolute left-14 top-[70%] bg-om-gray-800 shadow-md px-3 py-1">
              <span class="text-xs font-medium text-white relative -top-px">Chris</span>
            </div>
            <div class="absolute -right-4 top-2/3 bg-om-gray-800 shadow-md px-3 py-1">
              <span class="text-xs font-medium text-white relative -top-px">Réka</span>
            </div>
          </div>
          <div class="cro-help-text">
            <h2 class="cro-help-title">Need a hand making sense of all this?</h2>
            <p class="cro-help-desc">
              Book a 30-minute call with one of our Customer Success Heros. They'll walk you through your insights, help you prioritize what to tackle first, and answer any questions you have. Free of charge.
            </p>
          </div>
          <div class="cro-help-cta-wrap">
            <Button variant="secondary" size="md">
              <template #icon><Calendar :size="16" /></template>
              Book a meeting
            </Button>
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
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import {
  ChevronLeft, Dice5,
  MessageCircle, MousePointerClick, Filter, FlaskConical, Monitor, Clock, RotateCw,
  Facebook, Target, Search, Route, Tag as TagIcon, Sparkles, LayoutGrid, Layers,
  Info, ClipboardList, ShieldAlert, Smartphone, Eye, Wand2, ArrowDown,
  BarChart3, ShieldCheck, Globe, Truck,
  Zap, Lightbulb, ListChecks, TrendingUp, ArrowUpRight, Plus, Check, ChevronDown, Calendar,
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
import Button from '../components/shared/Button.vue'
import TagBadge from '../components/shared/Tag.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import { croInsights } from '../data/croInsights.js'

const props = defineProps({
  initialInsightId: { type: Number, default: null },
})

defineEmits(['menu-click', 'go-back'])

const isChatOpen = ref(false)
const activeDomain = ref('reflexshop.hu')
const domains = ref([
  'reflexshop.hu',
  'telekom.hu',
  'shop.telekom.hu',
  'demo.optimonk.com',
  '+ Add new domain'
])
watch(activeDomain, (val) => {
  if (val === '+ Add new domain') {
    activeDomain.value = domains.value[0]
  }
})
const detailScrollRef = ref(null)
const leftPaneRef = ref(null)
const isScrolled = ref(false)
const isDetailAtBottom = ref(false)
const isLeftAtBottom = ref(false)
const isLeftAtTop = ref(true)
const doItForMeView = ref('idle')

const leftMaskStyle = computed(() => {
  const fadeTop = !isLeftAtTop.value
  const fadeBottom = !isLeftAtBottom.value
  if (!fadeTop && !fadeBottom) return {}
  const start = fadeTop ? 'transparent 0%, black 5%' : 'black 0%'
  const end = fadeBottom ? 'black 95%, transparent 100%' : 'black 100%'
  const gradient = `linear-gradient(to bottom, ${start}, ${end})`
  return { maskImage: gradient, WebkitMaskImage: gradient }
})

const noThumbnailCampaigns = new Set([
  'New campaign idea',
  'PX_01 + "mi az új?" overlap',
])

function isAtBottom(el) {
  return el.scrollHeight - el.scrollTop - el.clientHeight < 4
}

function onDetailScroll(e) {
  isScrolled.value = e.target.scrollTop > 80
  isDetailAtBottom.value = isAtBottom(e.target)
}

function onLeftScroll(e) {
  isLeftAtBottom.value = isAtBottom(e.target)
  isLeftAtTop.value = e.target.scrollTop < 4
}

const impactPriority = { Large: 5, 'Medium to large': 4, Medium: 3, 'Small to medium': 2, Small: 1 }

const sortedInsights = computed(() =>
  [...croInsights]
    .sort((a, b) => (impactPriority[b.value] ?? 0) - (impactPriority[a.value] ?? 0) || a.id - b.id)
    .slice(0, 10)
)

const visibleCount = ref(5)
const visibleInsights = computed(() => sortedInsights.value.slice(0, visibleCount.value))

const campaignCount = computed(() => new Set(croInsights.map(i => i.campaign)).size)

const initialId = props.initialInsightId && croInsights.some(i => i.id === props.initialInsightId)
  ? props.initialInsightId
  : sortedInsights.value[0]?.id ?? null

const selectedInsightId = ref(initialId)

const selectedInsight = computed(() => croInsights.find(i => i.id === selectedInsightId.value) ?? null)

const hasThumbnail = computed(() =>
  !!selectedInsight.value?.campaign && !noThumbnailCampaigns.has(selectedInsight.value.campaign)
)

watch(selectedInsightId, (newId) => {
  if (newId == null) return
  const idx = sortedInsights.value.findIndex(i => i.id === newId)
  if (idx >= 0 && idx + 1 > visibleCount.value) {
    visibleCount.value = Math.min(sortedInsights.value.length, idx + 1)
  }
  isScrolled.value = false
  doItForMeView.value = 'idle'
  nextTick(() => {
    if (detailScrollRef.value) {
      detailScrollRef.value.scrollTo({ top: 0, behavior: 'smooth' })
      isDetailAtBottom.value = isAtBottom(detailScrollRef.value)
    }
  })
})

watch(visibleCount, () => {
  nextTick(() => {
    if (leftPaneRef.value) {
      isLeftAtBottom.value = isAtBottom(leftPaneRef.value)
      isLeftAtTop.value = leftPaneRef.value.scrollTop < 4
    }
  })
})

const showMoreRef = ref(null)

function fitVisibleToContainer() {
  if (!leftPaneRef.value) return
  const cards = leftPaneRef.value.querySelectorAll('.insight-row')
  if (!cards.length) return
  const containerHeight = leftPaneRef.value.clientHeight
  const cardHeight = cards[0].offsetHeight
  const gap = 12
  // Reserve space for the "Show more" button (button height ~32 + mt-4 margin 16 = ~48)
  const buttonReserve = 48
  const available = containerHeight - buttonReserve
  const fit = Math.max(1, Math.floor((available + gap) / (cardHeight + gap)))
  const total = sortedInsights.value.length
  if (total - fit <= 3) {
    visibleCount.value = total
  } else {
    visibleCount.value = fit
  }
}

onMounted(() => {
  nextTick(() => {
    fitVisibleToContainer()
    if (leftPaneRef.value) {
      isLeftAtBottom.value = isAtBottom(leftPaneRef.value)
      isLeftAtTop.value = leftPaneRef.value.scrollTop < 4
    }
    if (detailScrollRef.value) isDetailAtBottom.value = isAtBottom(detailScrollRef.value)
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
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02);
  height: calc(100vh - 200px);
  overflow: hidden;
}

.split-pane-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
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

.sticky-bar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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

.scroll-fade {
  mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
}

.detail-hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

.do-it-pane {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  min-height: 480px;
}

.do-it-card {
  max-width: 520px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.do-it-emoji {
  font-size: 56px;
  line-height: 1;
  margin-bottom: 4px;
}

.do-it-image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 4px;
}

.do-it-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #23262A;
  line-height: 1.3;
  margin: 0;
  max-width: 340px;
}

.do-it-text {
  font-size: 0.9375rem;
  color: #4B5563;
  line-height: 1.6;
  margin: 0;
}

.do-it-text strong {
  color: #23262A;
  font-weight: 600;
}

.do-it-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
}

.cro-help-block {
  margin-top: 24px;
  margin-bottom: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02);
  padding: 6px 28px 6px 48px;
  display: flex;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
}

.cro-help-image {
  width: 84px;
  height: 84px;
  object-fit: contain;
  flex-shrink: 0;
}

.cro-help-text {
  flex: 1;
  min-width: 240px;
}

.cro-help-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #23262A;
  margin: 0 0 6px;
  line-height: 1.3;
}

.cro-help-desc {
  font-size: 0.875rem;
  color: #4B5563;
  line-height: 1.5;
  margin: 0;
}

.cro-help-cta-wrap {
  flex-shrink: 0;
  margin-left: 80px;
}

.cro-help-cta:hover {
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
