<template>
  <ClFlowShell
    title=""
    :steps="[]"
    :current="step"
    :back="step > 0"
    @exit="$emit('navigate', 'conversionlift')"
    @back="step--"
  >
    <CLAddDomainStep v-if="step === 0" :key="'site'" cta-label="Continue" @done="step = 1" />
    <CLBlockLibraryStep v-else-if="step === 1" :key="'lib'" multi @select="onLibrary" @back="step = 0" />
    <CLComposeStep v-else-if="step === 2" :key="'compose'" :seeds="seeds" @next="step = 3" />
    <div v-else class="h-full flex flex-col items-center justify-center text-center gap-4 px-6">
      <div class="w-14 h-14 rounded-2xl bg-(--cl-accent-50) text-(--cl-accent-600) flex items-center justify-center"><Rocket :size="26" /></div>
      <div>
        <h2 class="text-xl font-bold text-om-gray-800">Ready to launch</h2>
        <p class="text-sm text-om-gray-500 mt-1 max-w-sm">Your variable is set up. Launch the experiment to start measuring conversion lift.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="secondary" @click="step = 2">Back to editor</Button>
        <Button variant="primary" @click="$emit('navigate', 'conversionlift')">Launch experiment</Button>
      </div>
    </div>
  </ClFlowShell>
</template>

<script setup>
import { ref } from 'vue'
import { Rocket } from 'lucide-vue-next'
import ClFlowShell from './components/ClFlowShell.vue'
import CLAddDomainStep from './components/CLAddDomainStep.vue'
import CLBlockLibraryStep from './components/CLBlockLibraryStep.vue'
import CLComposeStep from './components/CLComposeStep.vue'
import Button from '../components/shared/Button.vue'

defineEmits(['navigate'])

const step = ref(0)
const seeds = ref([])

function onLibrary(list) { seeds.value = list; step.value = 2 }
</script>
