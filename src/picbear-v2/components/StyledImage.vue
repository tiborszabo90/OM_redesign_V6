<script setup>
import { Star } from 'lucide-vue-next'

defineProps({
  src: { type: String, required: true },
  overlay: { type: String, default: null }, // 'badge' | 'callouts'
  enhance: { type: Boolean, default: false },
  compact: { type: Boolean, default: false }, // tiny thumbs: icon-only overlays
  callouts: { type: Array, default: () => ['Single origin', 'Freshly roasted'] },
})
</script>

<template>
  <div class="relative w-full h-full overflow-hidden">
    <img
      :src="src"
      class="w-full h-full object-cover"
      :class="enhance ? 'saturate-[1.15] contrast-[1.05]' : ''"
    />

    <div
      v-if="overlay === 'badge'"
      class="absolute flex flex-col gap-1"
      :class="compact ? 'top-1.5 left-1.5' : 'top-3 left-3'"
    >
      <span
        class="inline-flex items-center gap-1.5 bg-white/95 rounded-full font-semibold text-[#1a1a1a] shadow"
        :class="compact ? 'p-1' : 'px-2.5 py-1 text-[12px]'"
      >
        <Star :size="compact ? 8 : 13" class="fill-[#eab308] text-[#eab308]" /><template v-if="!compact"> Best Seller</template>
      </span>
    </div>

    <template v-if="overlay === 'callouts'">
      <template v-if="compact">
        <span class="absolute left-1.5 top-[22%] w-2 h-2 rounded-full bg-white shadow ring-2 ring-[#5548e0]"></span>
        <span class="absolute right-1.5 bottom-[26%] w-2 h-2 rounded-full bg-white shadow ring-2 ring-[#5548e0]"></span>
      </template>
      <template v-else>
        <span class="absolute left-3 top-[22%] inline-flex items-center gap-1.5 bg-white/95 rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#1a1a1a] shadow">
          <span class="w-2 h-2 rounded-full bg-[#5548e0]"></span>{{ callouts[0] }}
        </span>
        <span class="absolute right-3 bottom-[26%] inline-flex items-center gap-1.5 bg-white/95 rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#1a1a1a] shadow">
          <span class="w-2 h-2 rounded-full bg-[#5548e0]"></span>{{ callouts[1] }}
        </span>
      </template>
    </template>
  </div>
</template>
