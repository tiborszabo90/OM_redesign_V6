<template>
  <DashboardLayout active-menu-item="insights" @menu-click="$emit('menu-click', $event)" background-color="white" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-350 mx-auto -mt-3">

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
        </div>

        <!-- Grouped accordions -->
        <div class="flex flex-col gap-3">
          <Accordion
            v-for="group in groups"
            :key="group.campaign"
            :title="group.campaign"
            :subtitle="openGroups[group.campaign] ? '' : group.subtitle"
            :open="!!openGroups[group.campaign]"
            @toggle="toggleGroup(group.campaign)"
          >
            <template #meta>
              <div v-if="!openGroups[group.campaign]" class="flex items-center gap-1.5">
                <div
                  v-for="dist in group.impactDistribution"
                  :key="dist.level"
                  :class="['impact-pip', `impact-pip--${dist.level}`]"
                  :title="`${dist.count} ${dist.label}`"
                >
                  {{ dist.count }} {{ dist.label }}
                </div>
              </div>
            </template>

            <div class="opportunities-list">
              <div
                v-for="insight in group.insights"
                :key="insight.id"
                class="opportunity-item"
                @click="$emit('navigate-to-opportunity', insight.id)"
              >
                <div class="opportunity-icon">
                  <component :is="insightIcons[insight.id]" :size="16" />
                </div>
                <div class="opportunity-info">
                  <div class="opportunity-header">
                    <div class="opportunity-name">{{ insight.name }}</div>
                    <div :class="['opportunity-badge', `badge-${insight.level}`]">{{ insight.value }}</div>
                  </div>
                  <div class="opportunity-desc">{{ insight.description }}</div>
                </div>
                <ChevronRight :size="16" class="opportunity-chevron" />
              </div>
            </div>
          </Accordion>
        </div>

      </div>
    </template>

    <template #right-panel>
      <ChatPanel v-model="isChatOpen" :fab="true" :suggestions="chatSuggestions" :ai-responses="chatAiResponses" />
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import {
  ChevronLeft, ChevronRight, Dice5,
  MessageCircle, MousePointerClick, Filter, FlaskConical, Monitor, Clock, RotateCw,
  Facebook, Target, Search, Route, Tag as TagIcon, Sparkles, LayoutGrid, Layers,
  Info, ClipboardList, ShieldAlert, Smartphone, Eye, Wand2, ArrowDown,
  BarChart3, ShieldCheck, Globe, Truck,
} from 'lucide-vue-next'

const insightIcons = {
  1: MessageCircle,
  2: MousePointerClick,
  3: Filter,
  4: FlaskConical,
  5: Monitor,
  6: Clock,
  7: RotateCw,
  8: Facebook,
  9: Target,
  10: Search,
  11: Route,
  12: TagIcon,
  13: Sparkles,
  14: LayoutGrid,
  15: Layers,
  16: Info,
  17: ClipboardList,
  18: ShieldAlert,
  19: Smartphone,
  20: Eye,
  21: Wand2,
  22: ArrowDown,
  23: BarChart3,
  24: ShieldCheck,
  25: Globe,
  26: Truck,
}
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import Accordion from '../components/shared/Accordion.vue'
import { croInsights } from '../data/croInsights.js'

defineEmits(['menu-click', 'go-back', 'navigate-to-opportunity'])

const isChatOpen = ref(false)
const activeDomain = ref('reflexshop.hu')

const impactPriority = { Large: 5, 'Medium to large': 4, Medium: 3, 'Small to medium': 2, Small: 1 }

const groups = computed(() => {
  const byCampaign = new Map()
  for (const insight of croInsights) {
    if (!byCampaign.has(insight.campaign)) byCampaign.set(insight.campaign, [])
    byCampaign.get(insight.campaign).push(insight)
  }

  const result = []
  for (const [campaign, insights] of byCampaign.entries()) {
    insights.sort((a, b) => a.id - b.id)

    const counts = insights.reduce((acc, i) => {
      acc[i.value] = (acc[i.value] || 0) + 1
      return acc
    }, {})
    const impactDistribution = Object.entries(counts)
      .sort(([a], [b]) => (impactPriority[b] ?? 0) - (impactPriority[a] ?? 0))
      .map(([label, count]) => ({
        label,
        count,
        level: insights.find(i => i.value === label)?.level ?? 'medium',
      }))

    const topImpact = impactDistribution[0]?.label ?? '—'
    const subtitle = `${insights.length} ${insights.length === 1 ? 'insight' : 'insights'} · top impact: ${topImpact}`

    const maxScore = Math.max(...insights.map(i => impactPriority[i.value] ?? 0))

    result.push({
      campaign,
      insights,
      subtitle,
      impactDistribution,
      maxScore,
      firstId: insights[0].id,
    })
  }

  return result.sort((a, b) => a.firstId - b.firstId)
})

const openGroups = reactive({})

if (groups.value.length > 0) {
  openGroups[groups.value[0].campaign] = true
}

function toggleGroup(campaign) {
  openGroups[campaign] = !openGroups[campaign]
}

const chatSuggestions = [
  'Which campaign has the most insights?',
  'Which campaigns have a Large impact insight?',
  'Where should I start first?',
  'Which insights are quickest to validate?',
]

const chatAiResponses = {
  'Which campaign has the most insights?': '**PX_01 — Feliratkozó popup ajándék** has the most insights (7), covering messaging clarity, thank-you CTA, exclusions, A/B test refresh, desktop variant, secondary trigger, and returning-visitor targeting. **New campaign idea** also has 7, but those are independent ideas across different traffic sources.',
  'Which campaigns have a Large impact insight?': 'Three campaigns have at least one **Large** impact insight:\n\n- **PC Service Smart Abandonment Stopper** — both #18 (cart/checkout exclusions) and #19 (mobile version)\n- **New campaign idea** — #8 Facebook-specific onsite experience\n\nThese are the highest-leverage areas to start with.',
  'Where should I start first?': 'A reasonable order:\n\n1. **PC Service Abandonment Stopper** — your strongest existing campaign, with 2 Large insights to expand and protect it.\n2. **PX_01** — biggest active acquisition popup with 7 angles to improve.\n3. **New campaign idea — Facebook (#8)** — your largest underperforming traffic source.\n\nStart with inspections that don\'t need new campaigns built.',
  'Which insights are quickest to validate?': 'Inspection-only insights (no test required):\n\n- **#3** — pull PX_01 page-level impressions\n- **#7** — verify visitor-status logic in OptiMonk\n- **#18** — map cart/checkout URLs against current exclusion rules\n- **#20** — reproduce abandonment popup with a real cart\n- **#26** — confirm Wolt offer status and live copy\n\nEach should take well under a day.',
}
</script>

<style scoped>
.impact-pip {
  font-size: 0.75rem;
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

.opportunities-list {
  display: flex;
  flex-direction: column;
}

.opportunity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 14px 12px;
  gap: 16px;
  background: white;
  position: relative;
  transition: background 0.15s;
  border-radius: 8px;
}

.opportunity-item + .opportunity-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 60px;
  right: 12px;
  height: 1px;
  background: #F1F2F4;
}

.opportunity-item:hover {
  background: #F1F2F4;
}

.opportunity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #FFF0EB;
  color: #C94B14;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.opportunity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.opportunity-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.opportunity-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #23262A;
}

.opportunity-desc {
  font-size: 0.8125rem;
  color: #6B7280;
  line-height: 1.4;
}

.opportunity-badge {
  font-size: 0.75rem;
  font-weight: 400;
  padding: 2px 8px;
  border-radius: 20px;
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

.opportunity-chevron {
  color: #D1D5DB;
  flex-shrink: 0;
  transition: color 0.15s;
}

.opportunity-item:hover .opportunity-chevron {
  color: #9CA3AF;
}
</style>
