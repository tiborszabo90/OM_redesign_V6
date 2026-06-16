<template>
  <div class="min-h-screen-safe bg-white flex items-center justify-center">
    <div class="text-center">

      <!-- Main buttons -->
      <div v-if="!showArchive" class="flex flex-col gap-6 items-stretch">
        <div class="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="sm" @click="$emit('select', 'email')">Email Registration</Button>
          <Button variant="secondary" size="sm" @click="$emit('select', 'email-hu')">Email Registration (HU)</Button>
          <Button variant="secondary" size="sm" @click="$emit('select', 'shopify')">Shopify Registration</Button>
          <Button variant="secondary" size="sm" @click="$emit('select', 'mobile')">Onboarding Mobile</Button>
          <Button variant="secondary" size="sm" @click="$emit('select', 'mobile-hu')">Onboarding Mobile (HU)</Button>
          <Button variant="secondary" size="sm" @click="$emit('navigate', 'login')">Login</Button>
          <Button variant="secondary" size="sm" @click="$emit('select', 'wizard')">Wizard</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-public-wizard')">Public Wizard</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-home-onboarding')">Home Onboarding</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-home')">Home</Button>
          <Button variant="secondary" size="sm" @click="$emit('navigate', 'home-conversion-lift')">Conversion Lift</Button>
          <Button variant="secondary" size="sm" @click="$emit('navigate', 'new-campaign')">New Campaign MVP</Button>
          <Button variant="secondary" size="sm" @click="$emit('navigate', 'campaign-page-v1')">Campaign Page (A/B)</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-design-guide')">Design Guide</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-image-with-badge')">Image with Badge</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-chat-versions')">Chat Versions</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-editor')">Editor</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-ai-texts-images')">AI Texts &amp; Images V1</Button>
          <Button variant="secondary" size="sm" @click="$emit('go-ai-texts-images-v2')">AI Texts &amp; Images V2</Button>
          <Button variant="secondary" size="sm" @click="$emit('navigate', 'cro-email-template')">CRO Email Template</Button>
          <Button variant="secondary" size="sm" @click="openArchive">Archive</Button>
        </div>
      </div>

      <!-- Archive sub-page -->
      <div v-else class="flex flex-col gap-4 items-center">
        <Button variant="secondary" size="sm" @click="archiveCategory ? archiveCategory = null : closeArchive()">← Back</Button>

        <!-- Category list -->
        <div v-if="!archiveCategory" class="grid grid-cols-2 gap-3">
          <Button
            v-for="group in archiveGroups"
            :key="group.label"
            variant="secondary"
            size="sm"
            @click="archiveCategory = group.label"
          >
            {{ group.label }} ({{ group.items.length }})
          </Button>
        </div>

        <!-- Items inside a category -->
        <div v-else class="flex flex-col gap-2 items-center">
          <h3 class="text-sm font-semibold text-om-gray-500 uppercase tracking-wide">{{ archiveCategory }}</h3>
          <div class="grid grid-cols-2 gap-3">
            <Button
              v-for="item in activeCategoryItems"
              :key="item.view"
              variant="secondary"
              size="sm"
              @click="$emit('navigate', item.view)"
            >
              {{ item.label }}
            </Button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from '../components/shared/Button.vue'
import { getArchivedViews } from '../registry'

const props = defineProps({
  initialShowArchive: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'go-home', 'go-home-onboarding', 'go-public-wizard', 'go-public-wizard-v3', 'go-optimonk-agentic', 'go-optimonk-agentic-v2', 'go-design-guide', 'go-image-with-badge', 'go-chat-versions', 'go-editor', 'go-ai-texts-images', 'go-ai-texts-images-v2', 'navigate', 'show-archive'])

const showArchive = ref(props.initialShowArchive)
const archiveCategory = ref(null)

const openArchive = () => {
  showArchive.value = true
  emit('show-archive', true)
}

const closeArchive = () => {
  showArchive.value = false
  archiveCategory.value = null
  emit('show-archive', false)
}

// Category order (controls display order). Anything not matched lands in "Other".
const categoryOrder = [
  'Home',
  'Onboarding',
  'Registration',
  'Wizard',
  'Campaign Page',
  'Campaigns',
  'Recommendation',
  'Templates',
  'Analytics',
  'PPO',
  'Chat',
  'AI Content',
  'Other',
]

function getCategory(label) {
  const l = label.toLowerCase()
  if (l.startsWith('home onboarding') || l.startsWith('onboarding')) return 'Onboarding'
  if (l.startsWith('home')) return 'Home'
  if (l.startsWith('registration')) return 'Registration'
  if (l.startsWith('campaign page') || l.startsWith('campaign detail')) return 'Campaign Page'
  if (l.startsWith('campaign')) return 'Campaigns'
  if (l.startsWith('chat')) return 'Chat'
  if (l.startsWith('analytics')) return 'Analytics'
  if (l.startsWith('ppo')) return 'PPO'
  if (l.startsWith('templates')) return 'Templates'
  if (l.startsWith('wizard')) return 'Wizard'
  if (l.startsWith('recommendation')) return 'Recommendation'
  if (l.startsWith('ai ')) return 'AI Content'
  return 'Other'
}

const archiveGroups = computed(() => {
  const bucket = new Map()
  for (const v of getArchivedViews()) {
    const cat = getCategory(v.label)
    if (!bucket.has(cat)) bucket.set(cat, [])
    bucket.get(cat).push({ view: v.id, label: v.label })
  }
  return categoryOrder
    .filter(cat => bucket.has(cat))
    .map(cat => ({ label: cat, items: bucket.get(cat).sort((a, b) => a.label.localeCompare(b.label)) }))
})

const activeCategoryItems = computed(() =>
  archiveGroups.value.find(g => g.label === archiveCategory.value)?.items ?? []
)
</script>
