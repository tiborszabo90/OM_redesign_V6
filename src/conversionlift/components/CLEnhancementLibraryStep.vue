<template>
  <div class="h-full overflow-y-auto bg-om-gray-50">
    <div class="max-w-3xl mx-auto px-6 py-6">
      <Button variant="ghost" size="sm" @click="$emit('back')">
        <template #icon><ArrowLeft :size="15" /></template>Back
      </Button>
      <h2 class="text-xl font-semibold text-om-gray-800 mt-2">Pick an enhancement to generate</h2>
      <p class="text-sm text-om-gray-500 mt-0.5">Choose what to create — the AI generates a few options you can place.</p>

      <div class="grid grid-cols-3 gap-3 mt-5">
        <button
          v-for="enh in enhancements"
          :key="enh.key"
          @click="select(enh)"
          class="text-left rounded-xl border-2 border-om-gray-200 hover:border-(--cl-accent-400) overflow-hidden bg-white transition-all cursor-pointer hover:shadow-[0_4px_14px_rgba(14,165,233,0.15)]"
        >
          <div class="aspect-4/3 relative overflow-hidden border-b border-om-gray-100">
            <img v-if="enh.versions[0].content.image" :src="enh.versions[0].content.image" alt="" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-(--cl-accent-50)">
              <component :is="icons[enh.key]" :size="32" class="text-(--cl-accent-500)" />
            </div>
          </div>
          <div class="px-3 py-2.5">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-semibold text-om-gray-800">{{ enh.name }}</span>
              <Tag variant="outlined" size="sm">{{ enh.content_type }}</Tag>
            </div>
            <p class="text-xs text-om-gray-500 mt-1 leading-snug">{{ enh.description }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Type, Image, ShieldCheck, List } from 'lucide-vue-next'
import Button from '../../components/shared/Button.vue'
import Tag from '../../components/shared/Tag.vue'
import { blockLibrary as enhancements } from '../data/blockLibrary.js'

const emit = defineEmits(['select', 'back'])

const icons = { headline: Type, hero: Image, trust: ShieldCheck, bullets: List, gallery: Image }

// Selecting a card advances immediately — no extra confirm button.
// Carries the enhancement's representative content straight to placement.
function select(enh) {
  emit('select', {
    content_type: enh.content_type,
    location: enh.location,
    content: enh.versions[0].content,
    key: enh.key,
  })
}
</script>
