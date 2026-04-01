<template>
  <div class="min-h-screen-safe bg-white flex items-center justify-center">
    <div class="text-center">

      <!-- Main buttons -->
      <div v-if="!showArchive" class="grid grid-cols-2 gap-3">
        <Button variant="outline" size="sm" @click="$emit('select', 'email')">Email Registration</Button>
        <Button variant="outline" size="sm" @click="$emit('select', 'shopify')">Shopify Registration</Button>
        <Button variant="outline" size="sm" @click="$emit('select', 'wizard')">Wizard</Button>
        <Button variant="outline" size="sm" @click="$emit('go-public-wizard')">Public Wizard</Button>
        <Button variant="outline" size="sm" @click="$emit('go-home-onboarding')">Home Onboarding</Button>
        <Button variant="outline" size="sm" @click="$emit('go-home')">Home</Button>
        <Button variant="outline" size="sm" @click="$emit('go-design-guide')">Design Guide</Button>
        <Button variant="outline" size="sm" @click="$emit('go-image-with-badge')">Image with Badge</Button>
        <Button variant="outline" size="sm" @click="$emit('go-chat-versions')">Chat Versions</Button>
        <Button variant="outline" size="sm" @click="$emit('go-editor')">Editor</Button>
        <Button variant="outline" size="sm" @click="$emit('go-ai-texts-images')">AI Texts &amp; Images V1</Button>
        <Button variant="outline" size="sm" @click="$emit('go-ai-texts-images-v2')">AI Texts &amp; Images V2</Button>
        <Button variant="outline" size="sm" @click="showArchive = true">Archive</Button>
      </div>

      <!-- Archive sub-page -->
      <div v-else class="flex flex-col gap-4 items-center">
        <Button variant="outline" size="sm" @click="showArchive = false">← Back</Button>
        <div class="grid grid-cols-2 gap-3">
          <Button
            v-for="item in archiveItems"
            :key="item.view"
            variant="outline"
            size="sm"
            @click="$emit('navigate', item.view)"
          >
            {{ item.label }}
          </Button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '../components/shared/Button.vue'

defineEmits(['select', 'go-home', 'go-home-onboarding', 'go-public-wizard', 'go-design-guide', 'go-image-with-badge', 'go-chat-versions', 'go-editor', 'go-ai-texts-images', 'go-ai-texts-images-v2', 'navigate'])

const showArchive = ref(false)

const archiveItems = [
  { view: 'home-old-v2', label: 'Home Old' },
  { view: 'home-chat-versions', label: 'Chat Versions' },
  { view: 'home-chat-left', label: 'Chat Left' },
  { view: 'task-creation', label: 'Home Agentic' },
  { view: 'analytics-v1', label: 'Analytics V1' },
  { view: 'analytics-v2', label: 'Analytics V2' },
  { view: 'analytics-v3', label: 'Analytics V3' },
  { view: 'templates-v1', label: 'Templates V1' },
  { view: 'templates-v3', label: 'Templates V3' },
  { view: 'wizard-recommendation', label: 'Recommendation V1' },
  { view: 'wizard-recommendation-v2', label: 'Recommendation V2' },
  { view: 'wizard-recommendation-v3', label: 'Recommendation V3' },
  { view: 'wizard-recommendation-v5', label: 'Recommendation V5' },
  { view: 'wizard-analysis', label: 'Wizard Flow' },
  { view: 'wizard-analysis-no-chat', label: 'Wizard Flow (no chat)' },
  { view: 'settings-ai-texts-images-v1', label: 'AI Texts & Images V1' },
  { view: 'registration-v1', label: 'Registration V1' },
  { view: 'ppo-v1-campaign-flow', label: 'PPO V1' },
  { view: 'ppo-campaign-flow-v2', label: 'PPO Campaign Flow (tiles)' },
]
</script>
