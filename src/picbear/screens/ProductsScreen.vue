<script setup>
import { computed } from 'vue'
import { state, products } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import { Check, Star, ArrowRight, Gift } from 'lucide-vue-next'

const FREE_LIMIT = 10
const count = computed(() => state.selected.length)
const atLimit = computed(() => count.value >= FREE_LIMIT)

function toggle(id) {
  const i = state.selected.indexOf(id)
  if (i >= 0) state.selected.splice(i, 1)
  else if (!atLimit.value) state.selected.push(id)
}

function keepTop10() {
  state.selected = products.slice(0, FREE_LIMIT).map(p => p.id)
  next()
}

function clearAll() {
  state.selected = []
}

function next() {
  if (!count.value) return
  state.steps.products = true
  state.genPhase = 'idle'
  state.screen = 'generate'
}

const ranked = computed(() => [...products].sort((a, b) => b.sales - a.sales))
function rank(p) {
  return ranked.value.indexOf(p) + 1
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <WizardHeader
      :step="3"
      title="Pick the products to upgrade"
      subtitle="We preselected your 10 best sellers. Swap any of them, or just keep the list."
      back-to="placement"
      skip-label="Keep top 10"
      @skip="keepTop10"
    />

    <!-- Credits framing -->
    <div class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-[#f6f5ff] border border-[#dedbf7] flex items-center justify-center shrink-0">
        <Gift :size="15" class="text-[#5548e0]" />
      </span>
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">10 free image upgrades included</p>
        <p class="text-[12px] text-[#616161]">Every selected product uses one upgrade. You can add more products later on a paid plan.</p>
      </div>
      <span
        class="text-[12px] font-semibold rounded-full px-2.5 py-1"
        :class="atLimit ? 'text-[#0c6b45] bg-[#d7f2e4]' : 'text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7]'"
      >
        {{ count }} of {{ FREE_LIMIT }} used
      </span>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-3 px-1">
      <p class="text-[12px] text-[#616161]">{{ products.length }} products in your store</p>
      <button class="pb-btn-ghost" @click="clearAll">Clear selection</button>
    </div>

    <!-- Product grid -->
    <div class="grid grid-cols-4 gap-3 mb-5">
      <div
        v-for="p in products" :key="p.id"
        class="pb-card overflow-hidden cursor-pointer relative"
        :class="state.selected.includes(p.id) ? 'ring-2 ring-[#5548e0] border-transparent!' : (atLimit ? 'opacity-60' : 'hover:shadow-md')"
        @click="toggle(p.id)"
      >
        <div class="aspect-square relative">
          <img :src="p.img" class="w-full h-full object-cover" />
          <span
            class="absolute top-2 left-2 w-5 h-5 rounded-md flex items-center justify-center"
            :class="state.selected.includes(p.id) ? 'bg-[#5548e0]' : 'bg-white/95 border border-[#c9c9c9]'"
          >
            <Check v-if="state.selected.includes(p.id)" :size="12" class="text-white" />
          </span>
          <span
            v-if="p.bestseller"
            class="absolute top-2 right-2 inline-flex items-center gap-1 bg-white/95 rounded-full px-1.5 py-0.5 text-[10px] font-semibold shadow"
          >
            <Star :size="9" class="fill-[#eab308] text-[#eab308]" /> #1
          </span>
        </div>
        <div class="p-2.5">
          <p class="font-medium text-[#1a1a1a] truncate">{{ p.name }}</p>
          <p class="text-[12px] text-[#616161]">{{ p.price }} · {{ p.sales }} sold, rank #{{ rank(p) }}</p>
        </div>
      </div>
    </div>

    <p v-if="atLimit" class="text-[12px] text-[#616161] mb-3 text-right">
      Free limit reached. Unselect a product to swap in another one.
    </p>

    <div class="flex justify-end">
      <button class="pb-btn-primary" :disabled="!count" @click="next">
        Continue with {{ count }} products <ArrowRight :size="13" />
      </button>
    </div>
  </div>
</template>
