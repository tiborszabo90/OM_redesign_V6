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
            <h1 class="text-2xl font-semibold text-om-gray-700">All Optimization Opportunities</h1>
          </div>
          <span class="text-sm text-om-gray-400">{{ allOpportunities.length }} opportunities</span>
        </div>

        <!-- Opportunities list -->
        <div class="bg-white rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.04),0_1px_2px_0_rgba(0,0,0,0.02)] pt-2 pb-2">
          <div class="opportunities-list">
            <div
              v-for="opp in allOpportunities"
              :key="opp.id"
              class="opportunity-item"
              @click="$emit('navigate-to-opportunity', opp.id)"
            >
              <div class="opportunity-number">{{ opp.id }}</div>
              <div class="opportunity-info">
                <div class="opportunity-header">
                  <div class="opportunity-name">{{ opp.name }}</div>
                  <div :class="['opportunity-badge', `badge-${opp.level}`]">{{ opp.value }}</div>
                </div>
                <div class="opportunity-desc">{{ opp.description }}</div>
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
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import DashboardLayout from '../components/layouts/DashboardLayout.vue'
import ChatPanel from '../components/shared/ChatPanel.vue'

defineEmits(['menu-click', 'go-back', 'navigate-to-opportunity'])

const isChatOpen = ref(false)

const chatSuggestions = [
  'Which opportunity has the highest revenue impact?',
  'Where should I start first?',
  'Which ones are quickest to implement?',
  'How much total revenue am I leaving on the table?',
]

const chatAiResponses = {
  'Which opportunity has the highest revenue impact?': 'The single highest-impact opportunity is **#9 — "Vásárlói Klub" Conversion Popup** at +4.6M Ft/month, driven by the 170K monthly visitors who aren\'t yet club members.\n\nClose behind are **#2 — Fix the Facebook Traffic Conversion Gap** (+3.7M Ft/month) and **#7 — Search-to-Purchase Optimization** (+3.7M Ft/month).\n\nThese three alone represent over 12M Ft/month in recoverable revenue.',
  'Where should I start first?': 'I\'d prioritize by impact-to-effort ratio:\n\n**Start immediately (low effort, high impact):**\n- **#3 — Scale the A/B test winner** — just stop the losing variant, no new campaign needed\n- **#2 — Facebook welcome campaign** — one new targeted popup\n\n**Next (medium effort, very high impact):**\n- **#1 — Mobile Abandonment Stopper** — adapt your existing best campaign to mobile\n- **#9 — Vásárlói Klub popup** — new campaign with proven multi-step format\n\nThese four alone can deliver 11M+ Ft/month in additional revenue.',
  'Which ones are quickest to implement?': '**Fastest wins (can be live in 1–2 days):**\n- **#3** — Stop the losing A/B variant. One click in your campaign settings.\n- **#2** — Create a UTM-targeted welcome bar for Facebook visitors using an existing template.\n- **#4** — Deactivate the zero-converting dynamic content campaign.\n\n**Medium speed (3–5 days):**\n- **#1** — Mobile variant of your Smart Abandonment Stopper\n- **#9** — "Join the Club" multi-step popup\n\nAll others require more planning around content, targeting rules, or seasonal timing.',
  'How much total revenue am I leaving on the table?': 'Across all 10 opportunities, the estimated recoverable revenue is:\n\n**High-confidence estimates:** ~21.4M Ft/month\n- #1: +2.5M, #2: +3.7M, #3: +945K, #4: +2.3M, #5: +3.0M\n- #7: +3.7M, #9: +4.6M, #10: +2.9M\n\n**Additional upside:** +435K Ft/month (#6) + 2-4M Ft/year (#8)\n\nEven capturing 30–40% of this conservatively represents **6–8M Ft additional monthly revenue**.',
}

const allOpportunities = [
  {
    id: 1,
    name: 'Deploy Smart Abandonment Stopper on Mobile',
    description: 'Top-performing campaign (7.67% purchase rate) runs on desktop only — 130K mobile visitors are completely untouched.',
    value: '+2.5M Ft/month',
    level: 'high',
  },
  {
    id: 2,
    name: 'Fix the Facebook Traffic Conversion Gap',
    description: 'Facebook is the #1 traffic source (34,811 visitors) but converts at just 0.72%, far below the 2.17% site average.',
    value: '+3.7M Ft/month',
    level: 'high',
  },
  {
    id: 3,
    name: 'Scale the Winning Email Subscription Variant',
    description: 'A/B test winner outperforms loser by 70.7% — yet the losing variant still receives 50% of traffic.',
    value: '+945K Ft/month',
    level: 'medium',
  },
  {
    id: 4,
    name: 'Replace Zero-Converting Dynamic Content Campaign',
    description: '57K visitors, 261K impressions, zero purchases — the most-shown campaign generates no measurable value.',
    value: '+2.3M Ft/month',
    level: 'high',
  },
  {
    id: 5,
    name: 'Build a Mobile-First Cart Abandonment Flow',
    description: '61% of cart visitors leave without buying, with no recovery mechanism for mobile users (76% of all traffic).',
    value: '+3.0M Ft/month',
    level: 'high',
  },
  {
    id: 6,
    name: 'Enhance the Funko Upsell/Cross-sell Campaign',
    description: 'Funko upsell has 0.14% purchase rate while the category sits at 4.55% — well below the board game category at 7.10%.',
    value: '+435K Ft/month',
    level: 'medium',
  },
  {
    id: 7,
    name: 'Implement Search-to-Purchase Optimization',
    description: 'Search is the most visited page (81,574 pageviews, 6.94% purchase rate) but 93% of searchers still leave without buying.',
    value: '+3.7M Ft/month',
    level: 'high',
  },
  {
    id: 8,
    name: 'Create a Seasonal/Valentine\'s Day Urgency Campaign',
    description: 'Valentine\'s Day page drew 2,161 visitors but converted at only 0.28% — no urgency, no gift guidance, no special incentive.',
    value: '2-4M Ft/year',
    level: 'medium',
  },
  {
    id: 9,
    name: 'Launch a "Vásárlói Klub" Conversion Popup',
    description: 'No dedicated campaign converts visitors into club members despite the prominent 7% discount benefit on every page.',
    value: '+4.6M Ft/month',
    level: 'high',
  },
  {
    id: 10,
    name: 'Improve the olcsobbat/Price Comparison Visitor Experience',
    description: 'Olcsobbat drives 26,671 visitors at 3.19% conversion — the highest among large sources — yet has no dedicated welcome campaign.',
    value: '+2.9M Ft/month',
    level: 'high',
  },
]
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

.opportunity-chevron {
  color: #D1D5DB;
  flex-shrink: 0;
  transition: color 0.15s;
}

.opportunity-item:hover .opportunity-chevron {
  color: #9CA3AF;
}
</style>
