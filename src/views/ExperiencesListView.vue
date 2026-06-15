<template>
  <AgenticShell active-item="experiences" :full-bleed="!!selectedExperience">
    <!-- DETAIL: reopen the experience in the editor (continue the task) -->
    <PublicV3PopupDetailScreen
      v-if="selectedExperience"
      :key="selectedExperience.id"
      :use-case="{ id: selectedExperience.useCaseId, title: selectedExperience.name }"
      :generation-prompt="selectedExperience.name"
      :initial-chat-messages="reopenMessages"
      embedded
      :hide-back="true"
      @back="closeDetail"
      @published="closeDetail"
    />

    <!-- LIST -->
    <div v-else class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 class="text-2xl font-semibold text-om-gray-800 tracking-tight">Experiences</h1>
          <p class="text-sm text-om-gray-500 mt-1">Everything running on {{ domain }}, with its variants and results.</p>
        </div>
        <Button variant="primary" size="sm" @click="newExperience">
          <template #icon><Plus :size="14" /></template>
          New experience
        </Button>
      </div>

      <!-- Filter tabs -->
      <div class="flex items-center gap-5 mb-5 border-b border-om-gray-200">
        <button
          v-for="t in tabs"
          :key="t.id"
          @click="activeTab = t.id"
          :class="['relative -mb-px pb-2.5 text-sm transition-colors cursor-pointer flex items-center gap-1.5', activeTab === t.id ? 'text-om-gray-800 font-medium' : 'text-om-gray-500 hover:text-om-gray-700']"
        >
          {{ t.label }}
          <span :class="['text-xs px-1.5 py-0.5 rounded-full', activeTab === t.id ? 'bg-om-orange-100 text-om-orange-600' : 'bg-om-gray-100 text-om-gray-500']">{{ countFor(t.id) }}</span>
          <span v-if="activeTab === t.id" class="absolute left-0 right-0 -bottom-px h-0.5 bg-om-orange-500 rounded-full"></span>
        </button>
      </div>

      <!-- Experience cards (same look as the campaigns-v3 list cards) -->
      <div class="space-y-4">
        <ExperienceCard
          v-for="e in filtered"
          :key="e.id"
          :name="e.name"
          :domain="e.domain"
          :image="e.image"
          :active="e.active"
          @update:active="e.active = $event"
          :selected="e.selected"
          @update:selected="e.selected = $event"
          :metrics="e.metrics"
          :last-updated="e.lastUpdated"
          :test-badge="e.test"
          variant="list"
          @click="openExperience(e)"
        />
        <p v-if="!filtered.length" class="text-center text-sm text-om-gray-400 py-10">No experiences here yet.</p>
      </div>
    </div>
  </AgenticShell>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import AgenticShell from '../components/AgenticShell.vue'
import Button from '../components/shared/Button.vue'
import ExperienceCard from '../components/ExperienceCard.vue'
import PublicV3PopupDetailScreen from '../components/onboarding/PublicV3PopupDetailScreen.vue'

const domain = 'reflexshop.hu'

// useCaseId maps each experience to the editor's popup template.
// `test` is a mode of an experience, not a separate entity:
//   { state: 'running' | 'won', label, variant }
const experiences = ref([
  { id: 'e1', name: 'Welcome Discount Popup', useCaseId: 'newsletter', domain: 'reflexshop.hu', image: '/campaigns/smart-discount-popup.png', active: true, selected: false, lastUpdated: '2 months ago', test: { state: 'running', label: 'A/B test running', variant: 'orange', dot: true }, metrics: [{ label: 'Impressions', value: '1,240' }, { label: 'Submits', value: '40' }, { label: 'Submit rate', value: '3.2%' }, { label: 'Conv. uplift', value: '62.10%', trend: true }] },
  { id: 'e2', name: 'Cart Abandonment Saver', useCaseId: 'cart-abandonment', domain: 'reflexshop.hu', image: '/campaigns/cart-abandonment-stopper.png', active: true, selected: false, lastUpdated: '6 days ago', test: { state: 'won', label: 'Variant B won · +12%', variant: 'green-light' }, metrics: [{ label: 'Impressions', value: '3,180' }, { label: 'Submits', value: '130' }, { label: 'Submit rate', value: '4.1%' }, { label: 'Conv. uplift', value: '48.00%', trend: true }] },
  { id: 'e3', name: 'Free Shipping Bar', useCaseId: 'newsletter', domain: 'reflexshop.hu', image: '/campaigns/smart-discount-popup-desktop.png', active: true, selected: false, lastUpdated: '1 year ago', metrics: [{ label: 'Impressions', value: '18,400' }, { label: 'Clicks', value: '1,656' }, { label: 'CTR', value: '9.0%' }, { label: 'Conv. uplift', value: '9.00%', trend: true }] },
  { id: 'e4', name: 'Spin-to-Win', useCaseId: 'spin-wheel', domain: 'reflexshop.hu', image: '/campaigns/lucky-wheel.png', active: true, selected: false, lastUpdated: '4 months ago', test: { state: 'running', label: 'A/B test running', variant: 'orange', dot: true }, metrics: [{ label: 'Impressions', value: '5,600' }, { label: 'Submits', value: '437' }, { label: 'Submit rate', value: '7.8%' }, { label: 'Conv. uplift', value: '54.00%', trend: true }] },
  { id: 'e5', name: 'Newsletter Signup', useCaseId: 'newsletter', domain: 'reflexshop.hu', image: '/campaigns/smart-discount-popup.png', active: false, selected: false, lastUpdated: '3 weeks ago', metrics: [{ label: 'Impressions', value: '920' }, { label: 'Submits', value: '22' }, { label: 'Submit rate', value: '2.4%' }, { label: 'Conv. uplift', value: '31.00%', trend: true }] },
  { id: 'e6', name: 'Feedback Survey', useCaseId: 'feedback', domain: 'reflexshop.hu', image: '/campaigns/feedback-survey.png', active: false, selected: false, lastUpdated: '1 day ago', metrics: [{ label: 'Impressions', value: '410' }, { label: 'Responses', value: '58' }, { label: 'Response rate', value: '14.1%' }, { label: 'Conv. uplift', value: '—' }] },
])

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'testing', label: 'Testing' },
  { id: 'paused', label: 'Paused' },
]
const activeTab = ref('all')
const isTesting = (e) => e.test?.state === 'running'
const countFor = (id) => {
  if (id === 'all') return experiences.value.length
  if (id === 'active') return experiences.value.filter((e) => e.active).length
  if (id === 'testing') return experiences.value.filter(isTesting).length
  return experiences.value.filter((e) => !e.active).length
}
const filtered = computed(() => {
  if (activeTab.value === 'all') return experiences.value
  if (activeTab.value === 'active') return experiences.value.filter((e) => e.active)
  if (activeTab.value === 'testing') return experiences.value.filter(isTesting)
  return experiences.value.filter((e) => !e.active)
})

const newExperience = () => { window.location.hash = '#/agentic/home' }

// ── Open an experience: reopen the task in the editor (hash-driven) ──
const selectedId = ref(null)
const selectedExperience = computed(() => experiences.value.find((e) => e.id === selectedId.value) || null)

// The full conversation that created the popup, replayed in the editor chat.
const popupStyles = [
  { id: 'v1', label: 'Bold discount', image: '/templates/popup-style-1.png' },
  { id: 'v2', label: 'Minimal capture', image: '/templates/popup-style-2.png' },
  { id: 'v3', label: 'Classic offer', image: '/templates/popup-style-3.png' },
  { id: 'v4', label: 'Playful gift', image: '/templates/popup-style-4.png' },
]
const intentByUseCase = {
  'newsletter': { prompt: 'Create a discount popup to capture more leads.', lead: 'Email only · New visitors', offer: '10% off', code: 'WELCOME10' },
  'cart-abandonment': { prompt: 'Help me recover cart abandoners with a popup.', lead: 'Email only · Cart abandoners', offer: 'Free shipping', code: '' },
  'spin-wheel': { prompt: 'Create a spin-to-win popup to boost engagement.', lead: 'Email only · Everyone', offer: 'Up to 20% off', code: '' },
  'feedback': { prompt: 'Create a feedback survey popup.', lead: 'Survey · Everyone', offer: '', code: '' },
}
const buildConversation = (e) => {
  const intent = intentByUseCase[e.useCaseId] || intentByUseCase['newsletter']
  const msgs = [
    { role: 'user', text: intent.prompt },
    { role: 'ai', text: 'Nice idea! A few quick questions to tailor this for you.' },
    { role: 'user', text: intent.lead },
    { role: 'ai', text: `Got it. Analyzing ${e.domain} now…` },
    { role: 'ai', text: 'Found your brand colors, fonts and traffic patterns. Picking the right popup type…' },
  ]
  if (intent.offer) {
    msgs.push({ role: 'ai', text: 'What offer should it use?' })
    msgs.push({ role: 'user', text: intent.code ? `${intent.offer} · Code: ${intent.code}` : intent.offer })
  }
  msgs.push(
    { role: 'ai', text: 'Generated 4 popup versions tailored to your goal. Pick one to keep editing.' },
    { role: 'popup-versions', versions: popupStyles, selectedId: 'v1' },
    { role: 'user', text: 'This one looks great.' },
    { role: 'ai', text: 'Perfect. Opening the editor so you can fine-tune the design and settings.' },
  )
  return msgs
}
const reopenMessages = computed(() => (selectedExperience.value ? buildConversation(selectedExperience.value) : []))

const openExperience = (e) => { window.location.hash = '#/agentic/experiences/' + e.id }
const closeDetail = () => { window.location.hash = '#/agentic/experiences' }

const applyHash = () => {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/') // ['agentic','experiences','<id>']
  if (parts[0] !== 'agentic' || parts[1] !== 'experiences') return
  selectedId.value = parts[2] || null
}
onMounted(() => { applyHash(); window.addEventListener('hashchange', applyHash) })
onUnmounted(() => { window.removeEventListener('hashchange', applyHash) })
</script>
