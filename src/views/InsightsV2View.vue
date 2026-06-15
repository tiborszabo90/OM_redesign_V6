<template>
  <AgenticShell active-item="analytics">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-om-gray-800 tracking-tight">Insights</h1>
          <p class="text-sm text-om-gray-500 mt-1">Last 30 days on {{ domain }}</p>
        </div>
        <InsightsVersionTabs current="v2" />
      </div>

      <!-- Agent summary -->
      <div class="flex items-start gap-2.5 mb-5">
        <div class="shrink-0 w-7 h-7 rounded-full bg-om-orange-100 text-om-orange-500 flex items-center justify-center mt-0.5">
          <Sparkles :size="15" />
        </div>
        <div class="bg-om-gray-50 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-om-gray-600 leading-relaxed">
          Over the last 30 days your experiences influenced <span class="font-semibold text-om-gray-700">HUF 2.1M</span> (+18% vs the prior period). Three things stand out, and I'd act on the first two this week.
        </div>
      </div>

      <!-- Insight cards -->
      <div class="space-y-3">
        <div v-for="(it, i) in insights" :key="i" class="bg-white rounded-xl border border-om-gray-200 p-4">
          <div class="flex items-start gap-3">
            <div :class="['shrink-0 w-9 h-9 rounded-lg flex items-center justify-center', it.tone === 'good' ? 'bg-[#D6F5EC] text-[#0F6E56]' : it.tone === 'warn' ? 'bg-om-orange-100 text-om-orange-600' : 'bg-om-gray-100 text-om-gray-500']">
              <component :is="it.icon" :size="18" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-om-gray-700 leading-snug">{{ it.title }}</h3>
              <p class="text-sm text-om-gray-500 leading-snug mt-1">{{ it.detail }}</p>
              <div class="mt-3">
                <Button variant="secondary" size="sm" @click="act(it)">{{ it.action }}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AgenticShell>
</template>

<script setup>
import { Sparkles, TrendingUp, AlertTriangle, Smartphone } from 'lucide-vue-next'
import AgenticShell from '../components/AgenticShell.vue'
import InsightsVersionTabs from '../components/InsightsVersionTabs.vue'
import Button from '../components/shared/Button.vue'

const domain = 'reflexshop.hu'

const insights = [
  { tone: 'good', icon: TrendingUp, title: 'Cart Abandonment Saver drives 57% of your popup revenue.', detail: 'It recovered about HUF 1.2M this month at a 48% conversion uplift. It is your single strongest experience.', action: 'See breakdown' },
  { tone: 'warn', icon: AlertTriangle, title: 'Welcome Discount Popup converts at 3.2%, below benchmark.', detail: 'The 4.5 to 6% benchmark suggests room to grow. Most drop-off is in the first 2 seconds, which points to the headline.', action: 'A/B test the headline' },
  { tone: 'warn', icon: Smartphone, title: 'Mobile converts 38% worse than desktop.', detail: 'Mobile is 61% of your traffic but a smaller share of submits. A mobile-tuned layout could lift overall results.', action: 'Optimize for mobile' },
]

const act = () => { window.location.hash = '#/agentic/home' }
</script>
