<template>
  <DashboardLayout active-menu-item="insights" @menu-click="$emit('menu-click', $event)" background-color="white" :right-panel-collapsed="!isChatOpen">
    <template #content>
      <div class="w-full max-w-[1400px] mx-auto -mt-3">

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
          <span class="text-sm text-om-gray-400">{{ croInsights.length }} insights</span>
        </div>

        <!-- Filters & Sort -->
        <div class="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-xs text-om-gray-500">Campaign</span>
            <div class="w-[320px]">
              <Dropdown v-model="activeCampaignFilter" :options="campaignFilters" size="sm" />
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="text-xs text-om-gray-500">Sort by</span>
            <div class="w-55">
              <Dropdown v-model="activeSort" :options="sortOptions" size="sm" />
            </div>
          </div>
        </div>

        <!-- Insights list -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-2 pb-2">
          <div class="opportunities-list">
            <div
              v-for="insight in visibleInsights"
              :key="insight.id"
              class="opportunity-item"
              @click="$emit('navigate-to-opportunity', insight.id)"
            >
              <div class="opportunity-number">{{ insight.id }}</div>
              <div class="opportunity-info">
                <div class="opportunity-header">
                  <div class="opportunity-name">{{ insight.name }}</div>
                  <div :class="['opportunity-badge', `badge-${insight.level}`]">{{ insight.value }}</div>
                </div>
                <div class="opportunity-meta">
                  <Tag variant="gray-muted">{{ insight.campaign }}</Tag>
                  <span class="opportunity-desc">{{ insight.description }}</span>
                </div>
              </div>
              <ChevronRight :size="16" class="opportunity-chevron" />
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
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, Dice5 } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'
import Tag from '../components/shared/Tag.vue'
import Dropdown from '../components/shared/Dropdown.vue'
import { croInsights } from '../data/croInsights.js'

defineEmits(['menu-click', 'go-back', 'navigate-to-opportunity'])

const isChatOpen = ref(false)
const activeDomain = ref('reflexshop.hu')
const activeCampaignFilter = ref('all')

const sortOptions = [
  { value: 'id-asc', label: 'Order from agent' },
  { value: 'impact-desc', label: 'Impact (high to low)' },
  { value: 'impact-asc', label: 'Impact (low to high)' },
  { value: 'campaign-asc', label: 'Campaign (A–Z)' },
  { value: 'name-asc', label: 'Name (A–Z)' },
]
const activeSort = ref('id-asc')

const impactPriority = { Large: 5, 'Medium to large': 4, Medium: 3, 'Small to medium': 2, Small: 1 }

const campaignFilters = computed(() => {
  const counts = croInsights.reduce((acc, insight) => {
    acc[insight.campaign] = (acc[insight.campaign] || 0) + 1
    return acc
  }, {})
  const campaignEntries = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([campaign, count]) => ({ value: campaign, label: `${campaign} (${count})` }))
  return [{ value: 'all', label: `All campaigns (${croInsights.length})` }, ...campaignEntries]
})

const visibleInsights = computed(() => {
  const filtered = activeCampaignFilter.value === 'all'
    ? [...croInsights]
    : croInsights.filter(insight => insight.campaign === activeCampaignFilter.value)

  const sortKey = activeSort.value
  const sorted = [...filtered]
  switch (sortKey) {
    case 'impact-asc':
      sorted.sort((a, b) => (impactPriority[a.value] ?? 0) - (impactPriority[b.value] ?? 0) || a.id - b.id)
      break
    case 'id-asc':
      sorted.sort((a, b) => a.id - b.id)
      break
    case 'campaign-asc':
      sorted.sort((a, b) => a.campaign.localeCompare(b.campaign) || a.id - b.id)
      break
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'impact-desc':
    default:
      sorted.sort((a, b) => (impactPriority[b.value] ?? 0) - (impactPriority[a.value] ?? 0) || a.id - b.id)
  }
  return sorted
})

const chatSuggestions = [
  'Which insights have the highest expected impact?',
  'Which insights affect PX_01?',
  'Which ones are quickest to validate?',
  'Which insights propose entirely new campaigns?',
]

const chatAiResponses = {
  'Which insights have the highest expected impact?': 'Six insights are flagged as **Large** or **Medium to large** impact:\n\n- **#8 — Facebook-specific onsite experience** (Large)\n- **#18 — Fix abandonment stopper checkout exclusions** (Large)\n- **#19 — Mobile abandonment stopper** (Large)\n- **#2 — Shopping CTA on PX_01 thank-you page** (Medium to large)\n- **#13 — Scale "mi az új?" recommender** (Medium to large)\n- **#24 — Price-comparison visitor reassurance** (Medium to large)\n\nThese touch your largest traffic sources and your strongest existing campaign mechanic.',
  'Which insights affect PX_01?': 'Seven insights focus on **PX_01 — Feliratkozó popup ajándék**:\n\n- **#1** — Clarify gift/coupon/puzzle messaging\n- **#2** — Add a shopping CTA to the thank-you page\n- **#3** — Tighten exclusions on jobs and login pages\n- **#4** — Refresh the A/B test after recent edits\n- **#5** — Build a desktop-specific variant\n- **#6** — Test a secondary trigger or teaser\n- **#7** — Resolve the returning-visitor anomaly\n\nPlus **#15** flags a sequencing overlap between PX_01 and the "mi az új?" recommender.',
  'Which ones are quickest to validate?': 'Insights with mostly inspection-only validation steps (no new test required):\n\n- **#3** — Pull PX_01 page-level impressions and check current exclusions\n- **#7** — Verify visitor-status logic in OptiMonk\n- **#18** — Map cart and checkout URLs against current exclusion rules\n- **#20** — Reproduce the abandonment popup with a real cart and screenshot\n- **#26** — Confirm Wolt offer status and live copy\n\nEach should take well under a day to validate before any campaign change.',
  'Which insights propose entirely new campaigns?': 'Seven insights are new-campaign ideas rather than tweaks:\n\n- **#8** — Facebook-specific experience\n- **#9** — UTM-targeted rescue messages\n- **#10** — Guided discovery on `/shop_search.php`\n- **#11** — Routing message on `/shop_artforum.php`\n- **#12** — Sale-page guidance on `/akcios-termekek`\n- **#24** — Price-comparison visitor reassurance\n- **#25** — Geo-targeted reassurance for Austria/Germany\n\nThe other 19 are tweaks to existing campaigns.',
}
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

.opportunities-list {
  display: flex;
  flex-direction: column;
  padding: 0 8px;
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
  left: 52px;
  right: 12px;
  height: 1px;
  background: #F1F2F4;
}

.opportunity-item:hover {
  background: #F1F2F4;
}

.opportunity-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #F1F2F4;
  color: #6B7280;
  font-size: 0.8125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.opportunity-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.opportunity-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
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
