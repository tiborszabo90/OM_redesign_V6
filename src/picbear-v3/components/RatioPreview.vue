<script setup>
import { ref, computed, watch } from 'vue'
import { ratioCss, state } from '../store'
import AiLabel from './AiLabel.vue'
import { Monitor, Smartphone, Loader2 } from 'lucide-vue-next'

// The generated image, shown as it goes out. The stage is always square; the
// image sits inside it at whatever ratio is picked. Mobile is a crop of the
// desktop image, never of the original and never a different creative.
const props = defineProps({
  src: { type: String, required: true },
  desktopRatio: { type: String, required: true },
  mobileRatio: { type: String, required: true },
  same: { type: Boolean, default: true },   // one ratio for both, so no switch
  loading: { type: Boolean, default: false },
})

const view = ref('desktop')
watch(() => props.same, v => { if (v) view.value = 'desktop' })

const ratio = computed(() => (view.value === 'mobile' ? props.mobileRatio : props.desktopRatio))

function num(r) {
  const [w, h] = r.split(':').map(Number)
  return w / h
}

// The frame is the image itself; landscape fills the square's width, portrait
// its height, so it always fits.
const frameStyle = computed(() => {
  const r = num(ratio.value)
  return {
    aspectRatio: ratioCss(ratio.value),
    ...(r >= 1 ? { width: '100%' } : { height: '100%' }),
  }
})

// On mobile the desktop crop is laid inside the mobile frame, scaled up until
// it covers it: what gets cut is cut from the desktop image.
const layerStyle = computed(() => {
  if (view.value === 'desktop') return { width: '100%', height: '100%' }
  const d = num(props.desktopRatio)
  const m = num(props.mobileRatio)
  return {
    aspectRatio: ratioCss(props.desktopRatio),
    ...(d > m
      ? { height: '100%', width: (d / m) * 100 + '%' }
      : { width: '100%', height: (m / d) * 100 + '%' }),
  }
})
</script>

<template>
  <div class="pb-card overflow-hidden relative">
    <!-- Only worth switching when the two ratios differ -->
    <div v-if="!same" class="absolute top-3 right-3 z-10 flex gap-0.5 bg-white/95 rounded-lg p-0.5 shadow-[0_1px_4px_rgba(0,0,0,0.16)]">
      <button
        v-for="v in [{ id: 'desktop', icon: Monitor, r: desktopRatio }, { id: 'mobile', icon: Smartphone, r: mobileRatio }]"
        :key="v.id"
        class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-semibold cursor-pointer"
        :class="view === v.id ? 'bg-[#1a1a1a] text-white' : 'text-[#4a4a4a] hover:bg-[#f1f1f1]'"
        @click="view = v.id"
      >
        <component :is="v.icon" :size="13" /> {{ v.r }}
      </button>
    </div>

    <!-- Fixed square stage, so switching ratios never resizes the card -->
    <div class="w-full aspect-square bg-[#f7f7f7] flex items-center justify-center">
      <div v-if="loading" class="pb-skeleton w-full h-full flex items-center justify-center">
        <Loader2 :size="22" class="animate-spin text-[#c9c9c9]" />
      </div>
      <div v-else :key="ratio" class="relative overflow-hidden pb-fade-in" :style="frameStyle">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" :style="layerStyle">
          <img :src="src" class="w-full h-full object-cover block" />
        </div>

        <!-- The AI label is burned into the delivered image, so it sits inside the crop. -->
        <AiLabel v-if="state.disclosure.enabled" class="absolute bottom-2 left-2" />
      </div>
    </div>
  </div>
</template>
