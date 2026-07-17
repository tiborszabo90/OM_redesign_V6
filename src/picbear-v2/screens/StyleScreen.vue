<script setup>
import { reactive, onMounted } from 'vue'
import { state, bestseller, styleOptions } from '../store'
import WizardHeader from '../components/WizardHeader.vue'
import StyledImage from '../components/StyledImage.vue'
import { RefreshCw, Sparkles, Loader2 } from 'lucide-vue-next'

const ready = reactive({})

function reveal(stagger = true) {
  styleOptions.forEach((opt, i) => {
    ready[opt.id] = false
    setTimeout(() => { ready[opt.id] = true }, stagger ? 1800 + i * 1600 : 0)
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
      back-to="welcome"
    />

    <!-- Your product context -->
    <div class="pb-card px-4 py-3 mb-4 flex items-center gap-3">
      <img :src="bestseller.img" class="w-10 h-10 rounded-lg object-cover" />
      <div class="flex-1">
        <p class="font-semibold text-[#1a1a1a]">{{ bestseller.name }}</p>
        <p class="text-[12px] text-[#616161]">Your bestseller, 412 sold in the last 30 days.</p>
      </div>
      <span class="text-[11px] font-semibold text-[#3a3468] bg-[#f6f5ff] border border-[#dedbf7] rounded-full px-2 py-0.5 inline-flex items-center gap-1">
        <Sparkles :size="10" /> 4 AI previews ready
      </span>
    </div>

    <!-- Style cards -->
    <div class="grid grid-cols-2 gap-4 mb-5">
      <div
        v-for="opt in styleOptions" :key="opt.id"
        class="pb-card overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        :class="state.style === opt.id ? 'ring-2 ring-[#5548e0] border-transparent!' : 'hover:shadow-lg hover:border-[#c3bdf5]'"
        @click="pick(opt.id)"
      >
        <div class="aspect-[16/9] relative">
          <div v-if="!ready[opt.id]" class="absolute inset-0 pb-skeleton flex items-center justify-center">
            <span class="text-[11px] font-medium text-[#8a8a8a] bg-white/80 rounded-full pl-1.5 pr-2.5 py-0.5 inline-flex items-center gap-1.5">
              <Loader2 :size="12" class="animate-spin text-[#5548e0]" /> Generating preview...
            </span>
          </div>
          <div v-else class="absolute inset-0 pb-fade-in">
            <StyledImage :src="opt.img" :overlay="opt.overlay" enhance />
          </div>
        </div>
        <div class="p-3.5">
          <p class="font-semibold text-[#1a1a1a]">{{ opt.name }}</p>
          <p class="text-[12px] text-[#616161] mt-0.5">{{ opt.desc }}</p>
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
