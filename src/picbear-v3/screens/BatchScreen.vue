<script setup>
import { ref, computed } from 'vue'
import { state, products, startVariationBatch } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import GenerateLimit from '../components/GenerateLimit.vue'
import { Sparkles } from 'lucide-vue-next'

const selectedProducts = computed(() => products.filter(p => state.selected.includes(p.id)))

// How many of the selected products to generate now; the rest stay queued.
const batchLimit = ref(selectedProducts.value.length)

// Starting the batch hands off to the new variation's page, where it renders.
function start() {
  startVariationBatch(batchLimit.value)
}
</script>

<template>
  <div class="min-h-full flex flex-col">
    <div class="flex-1 py-5">
      <div class="max-w-[960px] mx-auto px-6">
        <WizardHeader
          :step="5"
          title="Generate your images"
          subtitle="Your look is set. Pick the size of the first batch and start it."
          back-to="generate"
        />

        <div class="pb-card p-5">
          <GenerateLimit :remaining="selectedProducts.length" v-model="batchLimit" />
        </div>
      </div>
    </div>

    <!-- Sticky action bar -->
    <div class="sticky bottom-[var(--dev-nav-height,0px)] mt-5 px-6 py-3 bg-white border-t border-[#e3e3e3]">
      <div class="max-w-[960px] mx-auto flex items-center justify-between gap-4">
        <p class="text-[12px] text-[#616161]">
          The batch starts on the variation page. You can top up the rest any time.
        </p>

        <button class="pb-btn-primary shrink-0" @click="start">
          <Sparkles :size="13" /> Start generation
        </button>
      </div>
    </div>
  </div>
</template>
