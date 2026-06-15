<template>
  <!-- image + badge pills -->
  <div v-if="entry.content.image && entry.content.badge" class="relative rounded-xl overflow-hidden">
    <img :src="entry.content.image" alt="" class="w-full h-44 object-cover" />
    <div class="absolute top-3 left-3 flex flex-col items-start gap-1.5">
      <span v-for="b in entry.content.badge" :key="b" class="inline-flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-full pl-1.5 pr-2 py-0.5 text-[11px] font-semibold text-om-gray-800 shadow-sm">
        <Check :size="11" class="text-[#15803D]" />{{ b }}
      </span>
    </div>
  </div>

  <!-- benefit list paired with an image -->
  <div v-else-if="entry.content.image && entry.content.text" class="flex gap-4 items-center rounded-xl border border-om-gray-200 bg-white p-3">
    <img :src="entry.content.image" alt="" class="w-32 h-24 object-cover rounded-lg shrink-0" />
    <ul class="space-y-1.5 flex-1" :style="css">
      <li v-for="(b, i) in textItems" :key="i" class="flex items-start gap-2 text-sm">
        <Check :size="15" class="text-[#15803D] mt-0.5 shrink-0" />{{ b }}
      </li>
    </ul>
  </div>

  <!-- plain image -->
  <div v-else-if="entry.content.image" class="rounded-xl overflow-hidden">
    <img :src="entry.content.image" alt="" class="w-full h-44 object-cover" />
  </div>

  <!-- text rendered as a trust badge-row (' · '-joined) -->
  <div v-else-if="isBadgeRow" class="flex flex-wrap gap-x-4 gap-y-1.5 p-2" :style="css">
    <span v-for="b in textItems" :key="b" class="inline-flex items-center gap-1 text-xs">
      <ShieldCheck :size="14" class="text-[#15803D]" />{{ b }}
    </span>
  </div>

  <!-- text rendered as a bullet list -->
  <ul v-else class="space-y-2 p-1" :style="css">
    <li v-for="(b, i) in textItems" :key="i" class="flex items-start gap-2">
      <Check :size="15" class="text-[#15803D] mt-0.5 shrink-0" />{{ b }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'
import { Check, ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  entry: { type: Object, required: true }, // { content, location, positions, style }
})

const isBadgeRow = computed(() => (props.entry.content.text || '').includes(' · '))
const textItems = computed(() => (props.entry.content.text || '').split(/\s·\s|\n/).filter(Boolean))
const css = computed(() => {
  const s = props.entry.style
  if (!s) return {}
  return {
    fontFamily: s.font,
    fontSize: s.size ? s.size + 'px' : undefined,
    fontWeight: s.bold ? '700' : '400',
    textAlign: s.align,
    color: s.color || undefined,
  }
})
</script>
