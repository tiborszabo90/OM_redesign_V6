<template>
  <div class="rounded-xl border border-om-gray-200 overflow-hidden">
    <!-- Estimate row -->
    <div class="flex items-center gap-4 p-4" :class="hasEstimate ? 'bg-om-orange-50' : 'bg-om-gray-50'">
      <!-- Donut chart (when we have a number) -->
      <div v-if="hasEstimate" class="relative w-14 h-14 shrink-0">
        <svg viewBox="0 0 36 36" class="w-14 h-14">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--color-om-gray-200)" stroke-width="3.6" />
          <circle
            cx="18" cy="18" r="15.9155" fill="none"
            stroke="var(--color-om-orange-400)" stroke-width="3.6" stroke-linecap="round"
            :stroke-dasharray="`${percent} 100`" transform="rotate(-90 18 18)"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-om-gray-700">
          {{ percent }}%
        </div>
      </div>
      <!-- Neutral icon when there's nothing to chart -->
      <div v-else class="w-14 h-14 rounded-xl bg-om-gray-100 flex items-center justify-center shrink-0">
        <BarChart3 :size="22" class="text-om-gray-400" />
      </div>

      <div class="flex-1 min-w-0">
        <!-- No rules: shows to everyone -->
        <template v-if="totalCount === 0">
          <div class="text-base font-semibold text-om-gray-700">Shows to all visitors</div>
          <div class="text-sm text-om-gray-500 mt-0.5">
            No targeting rules yet — 100% of your traffic (~{{ formattedTotal }} visitors over the last 7 days).
          </div>
        </template>

        <!-- Has an estimate -->
        <template v-else-if="hasEstimate">
          <div class="text-base font-semibold text-om-gray-700">
            <span v-if="isUpperBound">Up to </span>≈ {{ percent }}% of your traffic
          </div>
          <div class="text-sm text-om-gray-500 mt-0.5">
            <template v-if="isUpperBound">
              Estimated from {{ estimableCount }} of {{ totalCount }} rules over the last 7 days
              (~{{ formattedVisitors }} of {{ formattedTotal }} visitors).
            </template>
            <template v-else>
              Based on the last 7 days, this campaign would show to about
              {{ formattedVisitors }} of your {{ formattedTotal }} visitors.
            </template>
          </div>
        </template>

        <!-- Only un-estimable rules: no number -->
        <template v-else>
          <div class="text-base font-semibold text-om-gray-700">Reach can't be estimated</div>
          <div class="text-sm text-om-gray-500 mt-0.5">
            The current rules depend on live visitor behavior we don't log, so we can't predict reach in advance.
          </div>
        </template>
      </div>
    </div>

    <!-- Note strip: some rules can't be accounted for -->
    <div
      v-if="hasEstimate && isUpperBound && unestimableRules.length"
      class="flex items-start gap-2.5 px-4 py-3 bg-om-gray-50 border-t border-om-gray-200"
    >
      <Info :size="16" class="text-om-gray-400 shrink-0 mt-0.5" />
      <p class="text-xs text-om-gray-600 leading-relaxed">
        This estimate only accounts for rules we can measure. Rules like
        <span class="font-semibold text-om-gray-700">{{ unestimableList }}</span>
        depend on live visitor behavior we don't log, so the actual reach will be lower.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BarChart3, Info } from 'lucide-vue-next'

const props = defineProps({
  // estimated reach percentage (0–100)
  percent: { type: Number, default: 0 },
  // estimated absolute visitors matching the estimable rules
  visitors: { type: Number, default: 0 },
  // last-7-day traffic base
  totalVisitors: { type: Number, default: 0 },
  // true when un-estimable rules are present, so percent is an upper bound
  isUpperBound: { type: Boolean, default: false },
  // names of rules we can't estimate
  unestimableRules: { type: Array, default: () => [] },
  // how many active rules are estimable
  estimableCount: { type: Number, default: 0 },
  // total active rules
  totalCount: { type: Number, default: 0 },
})

// We can show a number whenever at least one rule is estimable, or there are no rules at all.
const hasEstimate = computed(() => props.totalCount === 0 || props.estimableCount > 0)

const formattedTotal = computed(() => props.totalVisitors.toLocaleString('en-US'))
const formattedVisitors = computed(() => props.visitors.toLocaleString('en-US'))

const unestimableList = computed(() => {
  const names = props.unestimableRules
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
})
</script>
