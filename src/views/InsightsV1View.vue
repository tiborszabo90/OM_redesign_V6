<template>
  <AgenticShell active-item="analytics" :full-bleed="!!activeInsight">
    <!-- ===== Insights list ===== -->
    <div v-if="!activeInsight" class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-om-gray-800 tracking-tight">Insights</h1>
          <p class="text-sm text-om-gray-500 mt-1">Based on {{ domain }}'s last 30 days, here's where I'd focus.</p>
        </div>
        <button
          @click="viewAnalytics"
          class="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-om-gray-600 hover:text-om-gray-700 transition-colors cursor-pointer"
        >
          <BarChart3 :size="15" /> View detailed analytics
        </button>
      </div>

      <!-- Performance metrics -->
      <div class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] px-6 py-5 mb-4">
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-x-6 gap-y-5">
          <button
            v-for="m in metrics"
            :key="m.label"
            @click="viewAnalytics"
            class="group text-left cursor-pointer"
          >
            <p class="text-xs font-medium text-om-gray-500 group-hover:text-om-gray-600 transition-colors">{{ m.label }}</p>
            <div class="flex items-baseline gap-1.5 mt-2">
              <span class="text-lg font-semibold text-om-gray-800 group-hover:text-om-orange-600 transition-colors">{{ m.value }}</span>
              <span :class="['inline-flex items-center text-xs font-medium whitespace-nowrap', m.up ? 'text-[#2CC896]' : 'text-om-orange-600']">
                <component :is="m.up ? TrendingUp : TrendingDown" :size="13" class="mr-0.5" />{{ m.up ? '+' : '' }}{{ m.delta }}%
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Opportunities = the insights (ranked) -->
      <div class="flex flex-col gap-3">
        <div
          v-for="(r, i) in opportunities"
          :key="r.id"
          @click="openInsight(r)"
          class="relative bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow cursor-pointer"
        >
          <Tag :variant="confidenceVariant(r.confidence)" size="sm" class="absolute top-4 right-4">{{ confidenceLabel(r.confidence) }}</Tag>
          <div class="flex items-start gap-3">
            <div class="shrink-0 w-7 h-7 rounded-full bg-om-peach-100 text-om-orange-500 flex items-center justify-center text-sm font-semibold">{{ i + 1 }}</div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-om-gray-700 leading-snug pr-28">{{ r.what }}</h3>
              <p class="text-sm text-om-gray-500 leading-snug mt-1">{{ r.why }}</p>
              <div class="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-2.5">
                <span class="text-sm font-medium text-om-gray-700">Est. {{ r.impact }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Insight detail chat ===== -->
    <div v-else class="h-full flex flex-col">
      <!-- Top bar -->
      <div class="shrink-0 flex items-center gap-3 px-6 h-14 border-b border-om-gray-100">
        <button
          @click="closeInsight"
          class="w-8 h-8 flex items-center justify-center text-om-gray-500 hover:text-om-gray-700 hover:bg-om-gray-100 rounded-lg transition-colors cursor-pointer"
          title="Back to insights"
        >
          <ArrowLeft :size="18" />
        </button>
        <span class="text-sm font-medium text-om-gray-700 truncate">{{ activeInsight.short }}</span>
      </div>

      <!-- Conversation -->
      <div ref="chatScrollRef" class="flex-1 overflow-y-auto">
        <div class="max-w-2xl mx-auto px-6 py-6 space-y-4">
          <template v-for="(m, i) in chatMessages" :key="i">
            <!-- User -->
            <div v-if="m.role === 'user'" class="flex justify-end">
              <div class="px-3.5 py-2.5 rounded-2xl rounded-br-md bg-om-peach-100 text-om-gray-700 max-w-[85%] text-sm leading-relaxed">{{ m.text }}</div>
            </div>
            <!-- Stats card -->
            <div v-else-if="m.role === 'stats'" class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4">
              <p v-if="m.title" class="text-xs font-medium text-om-gray-500 mb-3">{{ m.title }}</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                <div v-for="s in m.rows" :key="s.label" class="flex flex-col">
                  <span class="text-xs text-om-gray-500">{{ s.label }}</span>
                  <span :class="['text-base font-semibold mt-0.5', s.highlight ? 'text-om-orange-600' : 'text-om-gray-800']">{{ s.value }}</span>
                </div>
              </div>
            </div>
            <!-- AI -->
            <div v-else class="flex justify-start">
              <div class="text-sm leading-relaxed text-om-gray-700 max-w-[92%]" v-html="fmt(m.text)"></div>
            </div>
          </template>

          <!-- Thinking loader: the 2x3 dot motif (small, bare) + a label -->
          <div v-if="aiTyping" class="flex items-center gap-2.5 px-1 py-2">
            <div class="grid grid-cols-2 gap-1 think-dots">
              <span
                v-for="n in 6"
                :key="n"
                class="w-1 h-1 rounded-full bg-om-orange-500"
                :style="{ animationDelay: ((n - 1) * 0.12) + 's' }"
              ></span>
            </div>
            <span class="text-sm text-om-gray-500">Thinking…</span>
          </div>
        </div>
      </div>

      <!-- Action footer -->
      <div v-if="showActions" class="shrink-0 border-t border-om-gray-100">
        <div class="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Button variant="primary" size="md" @click="act">{{ activeInsight.cta }}</Button>
          <Button variant="secondary" size="md" @click="closeInsight">Maybe later</Button>
        </div>
      </div>
    </div>
  </AgenticShell>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { TrendingUp, TrendingDown, ArrowLeft, BarChart3 } from 'lucide-vue-next'
import AgenticShell from '../components/AgenticShell.vue'
import Tag from '../components/shared/Tag.vue'
import Button from '../components/shared/Button.vue'

const domain = 'reflexshop.hu'

const metrics = [
  { label: 'Submit Rate', value: '0.57%', delta: 14.0, up: true },
  { label: 'Submits', value: '2.2K', delta: 8.3, up: true },
  { label: 'Impressions', value: '384.4K', delta: 12.5, up: true },
  { label: 'Visitors', value: '168.2K', delta: 6.7, up: true },
  { label: 'Assisted Orders', value: '286', delta: 4.2, up: false },
  { label: 'Assisted Rev. (USD)', value: '$23,274', delta: 15.8, up: true },
]

const opportunities = [
  {
    id: 'cart',
    what: 'Add an exit-intent popup on cart and checkout that offers free shipping.',
    why: '68% of your carts are abandoned, with nothing in place to win them back.',
    impact: 'HUF 1.4M to 2.1M / mo',
    confidence: 'high',
    short: 'Recover abandoned carts',
    cta: 'Build this popup',
    question: 'Tell me more about adding an exit-intent popup on cart and checkout.',
    chat: [
      { role: 'ai', text: "Cart abandonment is your single biggest revenue leak right now. Here's what the last 30 days look like:" },
      { role: 'stats', title: 'Cart & checkout, last 30 days', rows: [
        { label: 'Carts created', value: '1,420' },
        { label: 'Carts abandoned', value: '966 (68%)', highlight: true },
        { label: 'Avg. cart value', value: 'HUF 18,400' },
        { label: 'Recoverable revenue', value: 'HUF 1.4M to 2.1M', highlight: true },
      ] },
      { role: 'ai', think: true, text: "**68% abandonment** sits well above the ~60% ecommerce benchmark, and right now nothing fires when a visitor moves to leave the cart or checkout." },
      { role: 'ai', think: true, text: "An exit-intent popup offering free shipping typically wins back **8 to 12%** of those carts. At your volume that's roughly **77 to 116 recovered orders a month**, worth an estimated **HUF 1.4M to 2.1M**." },
      { role: 'ai', think: true, text: "Want me to build it? I'd target the cart and checkout pages, fire on exit intent, and offer free shipping above a HUF threshold so margins stay healthy." },
    ],
  },
  {
    id: 'email-capture',
    what: 'Add a welcome popup that asks new visitors for their email for 10% off.',
    why: "You're barely collecting emails from new visitors. Sign-up rate is just 0.9% today.",
    impact: '+120 to 180 sign-ups / mo',
    confidence: 'medium',
    short: 'Capture more emails',
    cta: 'Build this popup',
    question: 'Why should I add a welcome popup for email capture?',
    chat: [
      { role: 'ai', text: "You're getting healthy new-visitor traffic, but almost none of it turns into a contact you can re-market to:" },
      { role: 'stats', title: 'New-visitor email capture, last 30 days', rows: [
        { label: 'New visitors', value: '9,400' },
        { label: 'Signing up today', value: '0.9% (85)', highlight: true },
        { label: 'Benchmark', value: '4 to 6%' },
        { label: 'Projected with popup', value: '+120 to 180 / mo', highlight: true },
      ] },
      { role: 'ai', think: true, text: "At **0.9%** you're capturing a fraction of what similar stores collect. The gap is almost entirely from new visitors who never see an offer to subscribe." },
      { role: 'ai', think: true, text: "A welcome popup with a **10% off** incentive usually lifts new-visitor sign-up to **1.5 to 2.0%**. For you that's an extra **120 to 180 emails a month** feeding your flows and Black Friday list." },
      { role: 'ai', think: true, text: "I can set it up to show once per new visitor, after a few seconds on site, and suppress it for anyone already subscribed." },
    ],
  },
  {
    id: 'ab-test',
    what: 'A/B test a benefit-led headline on your Welcome Discount Popup.',
    why: 'It converts at 3.2%, below the 4.5 to 6% benchmark for this popup type.',
    impact: '+6 to 13 sign-ups / 1,240 views',
    confidence: 'low',
    short: 'A/B test the welcome popup',
    cta: 'Start the A/B test',
    question: 'How would an A/B test on the welcome popup headline help?',
    chat: [
      { role: 'ai', text: "Your Welcome Discount Popup is live and getting decent traffic, but the conversion rate is lagging the benchmark:" },
      { role: 'stats', title: 'Welcome Discount Popup, last 30 days', rows: [
        { label: 'Views', value: '1,240' },
        { label: 'Conversion rate', value: '3.2%', highlight: true },
        { label: 'Benchmark', value: '4.5 to 6%' },
        { label: 'Projected lift', value: '+6 to 13 / 1,240 views', highlight: true },
      ] },
      { role: 'ai', think: true, text: "The current headline leads with the discount mechanic rather than the benefit. Popups that lead with the **benefit** (\"Get 10% off your first order\") tend to convert noticeably higher." },
      { role: 'ai', think: true, text: "I'd run a clean 50/50 A/B test: control vs. a benefit-led headline. Based on the benchmark gap, the variant should add **6 to 13 extra sign-ups per 1,240 views**, and we'll let it run to statistical significance before calling it." },
      { role: 'ai', think: true, text: "Want me to spin up the test with a benefit-led variant?" },
    ],
  },
]

const confidenceLabel = (c) => ({ high: 'High confidence', medium: 'Medium confidence', low: 'Worth testing' }[c] || 'Worth testing')
const confidenceVariant = (c) => ({ high: 'green-light', medium: 'yellow', low: 'gray-muted' }[c] || 'gray-muted')

// ===== Insight detail chat =====
const activeInsight = ref(null)
const chatMessages = ref([])
const aiTyping = ref(false)
const showActions = ref(false)
const chatScrollRef = ref(null)

const fmt = (t) => (t || '').replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-om-gray-800">$1</strong>')

const scrollToBottom = async () => {
  await nextTick()
  const el = chatScrollRef.value
  if (el) el.scrollTop = el.scrollHeight
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const openInsight = async (r) => {
  activeInsight.value = r
  // The data is already known — show the question, intro and stats instantly.
  chatMessages.value = [{ role: 'user', text: r.question }]
  showActions.value = false
  for (const msg of r.chat) {
    if (msg.think) {
      // Reasoning / recommendation: let the agent "think" first.
      aiTyping.value = true
      await scrollToBottom()
      await wait(1400)
      aiTyping.value = false
    }
    chatMessages.value.push(msg)
    await scrollToBottom()
    await wait(msg.think ? 250 : 150)
  }
  showActions.value = true
  await scrollToBottom()
}

const closeInsight = () => {
  activeInsight.value = null
  chatMessages.value = []
  aiTyping.value = false
  showActions.value = false
}

const act = () => { window.location.hash = '#/agentic/home' }
const viewAnalytics = () => { window.location.hash = '#/agentic/analytics' }
</script>

<style scoped>
/* Thinking loader: the 2x3 dot motif gently bounces while the AI "thinks" (staggered per dot) */
@keyframes thinkBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1.5px); }
}
.think-dots span {
  animation: thinkBounce 1.4s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .think-dots span { animation: none; }
}
</style>
