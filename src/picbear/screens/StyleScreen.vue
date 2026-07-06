<script setup>
import { reactive, onMounted } from 'vue'
import { state, bestseller, styleOptions } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { Check, RefreshCw, Sparkles } from 'lucide-vue-next'

const ready = reactive({})

function reveal(stagger = true) {
  styleOptions.forEach((opt, i) => {
    ready[opt.id] = false
    setTimeout(() => { ready[opt.id] = true }, stagger ? 500 + i * 450 : 0)
  })
}

onMounted(() => {
  if (state.previewsSeen) {
    styleOptions.forEach(o => { ready[o.id] = true })
  } else {
    reveal()
    state.previewsSeen = true
  }
})

function regenerate() {
  reveal()
}

function pick(id) {
  if (!ready[id]) return
  state.style = id
  setTimeout(next, 260)
}

function next() {
  if (!state.style) return
  state.steps.style = true
  state.screen = 'placement'
}
</script>

<template>
  <div class="max-w-[960px] mx-auto px-6 py-5">
    <WizardHeader
      :step="1"
      title="Pick your favorite look"
      subtitle="No mockups here. This is your own bestseller, already rendered in 4 styles."
      back-to="home"
    />

    <!-- Your product context -->
    <div class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
      <img :src="bestseller.img" class="w-10 h-10 rounded-lg object-cover" />
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">{{ bestseller.name }}</p>
        <p class="text-[12px] text-[#616161]">Your bestseller, 412 sold in the last 30 days. This is the current photo.</p>
      </div>
      <span class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5 inline-flex items-center gap-1">
        <Sparkles :size="10" /> 4 AI previews ready
      </span>
    </div>

    <!-- Style cards -->
    <div class="grid grid-cols-2 gap-4 mb-5">
      <div
        v-for="opt in styleOptions" :key="opt.id"
        class="pb-card overflow-hidden cursor-pointer transition-shadow"
        :class="state.style === opt.id ? 'ring-2 ring-[#5548e0] border-transparent!' : 'hover:shadow-md'"
        @click="pick(opt.id)"
      >
        <div class="aspect-[16/9] relative">
          <div v-if="!ready[opt.id]" class="absolute inset-0 pb-skeleton flex items-center justify-center">
            <span class="text-[11px] font-medium text-[#8a8a8a] bg-white/80 rounded-full px-2 py-0.5">Generating preview...</span>
          </div>
          <div v-else class="absolute inset-0 pb-fade-in">
            <StyledImage :src="opt.img" :overlay="opt.overlay" ai-tag enhance />
          </div>
        </div>
        <div class="p-3.5 flex items-start gap-2">
          <div class="flex-1">
            <p class="font-semibold text-[#1a1a1a]">{{ opt.name }}</p>
            <p class="text-[12px] text-[#616161] mt-0.5">{{ opt.desc }}</p>
          </div>
          <span
            class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            :class="state.style === opt.id ? 'bg-[#5548e0]' : 'border border-[#c9c9c9]'"
          >
            <Check v-if="state.style === opt.id" :size="11" class="text-white" />
          </span>
        </div>
      </div>
    </div>

    <!-- Footer actions -->
    <div class="flex items-center justify-between">
      <button class="pb-btn-ghost" @click="regenerate">
        <RefreshCw :size="13" /> Regenerate previews
      </button>
      <p class="text-[12px] text-[#8a8a8a]">Pick a look to continue</p>
    </div>
  </div>
</template>
