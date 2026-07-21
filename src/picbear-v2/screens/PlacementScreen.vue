<script setup>
import { computed } from 'vue'
import { state, styleById } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import PlacementEditor from '../components/PlacementEditor.vue'
import { ArrowRight } from 'lucide-vue-next'

const chosenStyle = computed(() => styleById(state.style) || styleById('lifestyle'))

function next() {
  state.steps.placement = true
  state.screen = 'products'
}

function skip() {
  state.placement = 'below-hero'
  next()
}
</script>

<template>
  <div class="min-h-full flex flex-col">
    <div class="flex-1 py-5 px-6">
      <div class="max-w-[960px] mx-auto">
      <WizardHeader
        :step="2"
        title="Choose where the image appears"
        subtitle="The preview on the right shows your product page as customers will see it."
        back-to="style"
        skip-label="Use recommended"
        @skip="skip"
      />

      <PlacementEditor
        v-model="state.placement"
        v-model:gallery-pos="state.galleryPos"
        v-model:custom-selector="state.customSelector"
        v-model:custom-mode="state.customMode"
        :style-obj="chosenStyle"
      />
      </div>
    </div>

    <!-- Sticky action bar -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] px-6 py-2.5 bg-[#f1f1f1]/90 backdrop-blur border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">You can change the placement anytime after setup.</p>
        <button class="pb-btn-primary" @click="next">Continue <ArrowRight :size="13" /></button>
      </div>
    </div>
  </div>
</template>
