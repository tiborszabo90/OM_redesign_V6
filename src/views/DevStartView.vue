<template>
  <div class="min-h-screen-safe bg-white flex items-center justify-center">
    <div class="text-center">

      <!-- Main buttons -->
      <div v-if="!showArchive" class="grid grid-cols-2 gap-3">
        <Button variant="outline" size="sm" @click="$emit('select', 'email')">Email Registration</Button>
        <Button variant="outline" size="sm" @click="$emit('select', 'shopify')">Shopify Registration</Button>
        <Button variant="outline" size="sm" @click="$emit('navigate', 'login')">Login</Button>
        <Button variant="outline" size="sm" @click="$emit('select', 'wizard')">Wizard</Button>
        <Button variant="outline" size="sm" @click="$emit('go-public-wizard')">Public Wizard</Button>
        <Button variant="outline" size="sm" @click="$emit('go-home-onboarding')">Home Onboarding</Button>
        <Button variant="outline" size="sm" @click="$emit('go-home')">Home</Button>
        <Button variant="outline" size="sm" @click="$emit('navigate', 'new-campaign')">New Campaign MVP</Button>
        <Button variant="outline" size="sm" @click="$emit('go-design-guide')">Design Guide</Button>
        <Button variant="outline" size="sm" @click="$emit('go-image-with-badge')">Image with Badge</Button>
        <Button variant="outline" size="sm" @click="$emit('go-chat-versions')">Chat Versions</Button>
        <Button variant="outline" size="sm" @click="$emit('go-editor')">Editor</Button>
        <Button variant="outline" size="sm" @click="$emit('go-ai-texts-images')">AI Texts &amp; Images V1</Button>
        <Button variant="outline" size="sm" @click="$emit('go-ai-texts-images-v2')">AI Texts &amp; Images V2</Button>
        <Button variant="outline" size="sm" @click="openArchive">Archive</Button>
      </div>

      <!-- Archive sub-page -->
      <div v-else class="flex flex-col gap-4 items-center">
        <Button variant="outline" size="sm" @click="closeArchive">← Back</Button>
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
import { getArchivedViews } from '../registry'

const props = defineProps({
  initialShowArchive: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'go-home', 'go-home-onboarding', 'go-public-wizard', 'go-design-guide', 'go-image-with-badge', 'go-chat-versions', 'go-editor', 'go-ai-texts-images', 'go-ai-texts-images-v2', 'navigate', 'show-archive'])

const showArchive = ref(props.initialShowArchive)

const openArchive = () => {
  showArchive.value = true
  emit('show-archive', true)
}

const closeArchive = () => {
  showArchive.value = false
  emit('show-archive', false)
}

const archiveItems = getArchivedViews().map(v => ({ view: v.id, label: v.label }))
</script>
