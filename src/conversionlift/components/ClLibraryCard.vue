<template>
  <button
    @click="$emit('select')"
    class="text-left rounded-xl border-2 overflow-hidden bg-white transition-all cursor-pointer w-full"
    :class="selected ? 'border-(--cl-accent-500) shadow-[0_4px_14px_rgba(14,165,233,0.18)]' : 'border-om-gray-200 hover:border-(--cl-accent-300)'"
  >
    <!-- Illustrated preview -->
    <div class="aspect-4/3 relative overflow-hidden border-b border-om-gray-100">
      <span v-if="selected" class="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-(--cl-accent-500) text-white flex items-center justify-center shadow"><Check :size="14" /></span>

      <!-- photo enhancements -->
      <img v-if="version.content.image" :src="version.content.image" alt="" class="w-full h-full object-cover" />

      <!-- headline mock -->
      <div v-else-if="enh.key === 'headline'" class="w-full h-full p-4 flex flex-col justify-center bg-white">
        <div class="h-2 w-10 rounded bg-om-gray-200 mb-2"></div>
        <span class="text-[15px] font-bold text-om-gray-800 leading-tight">{{ version.content.text }}</span>
        <div class="mt-2 h-6 w-20 rounded bg-om-gray-800/90"></div>
      </div>

      <!-- trust mock -->
      <div v-else-if="enh.key === 'trust'" class="w-full h-full p-3 flex flex-col justify-center gap-1.5 bg-white">
        <span v-for="b in version.content.text.split(' · ')" :key="b" class="inline-flex items-center gap-1 text-[11px] text-om-gray-600">
          <ShieldCheck :size="12" class="text-[#15803D]" />{{ b }}
        </span>
      </div>

      <!-- bullets mock -->
      <ul v-else class="w-full h-full p-3 flex flex-col justify-center gap-1.5 bg-white">
        <li v-for="(b, i) in version.content.text.split('\n')" :key="i" class="flex items-center gap-1.5 text-[11px] text-om-gray-600">
          <Check :size="12" class="text-[#15803D] shrink-0" />{{ b }}
        </li>
      </ul>
    </div>
    <div class="px-3 py-2 text-sm font-medium text-om-gray-700">{{ version.label }}</div>
  </button>
</template>

<script setup>
import { Check, ShieldCheck } from 'lucide-vue-next'

defineProps({
  enh: { type: Object, required: true },
  version: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>
