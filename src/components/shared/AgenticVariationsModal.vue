<template>
  <Modal :model-value="modelValue" size="2xl" hide-close @update:model-value="$emit('update:modelValue', $event)">
    <div class="relative px-2 pt-2 pb-1">
      <Button variant="ghost" size="sm" icon-only class="absolute -top-1 -right-1 z-10" @click="$emit('update:modelValue', false)">
        <template #icon><X :size="16" /></template>
      </Button>

      <!-- Level 1: concept gallery -->
      <template v-if="!selected">
        <div class="flex flex-col items-center text-center mb-7">
          <h2 class="text-2xl font-semibold text-om-gray-700 mb-2">Your best campaign, reimagined</h2>
          <p class="text-base text-om-gray-500 leading-relaxed whitespace-nowrap">
            Try the new Agentic OptiMonk. We designed 2 fresh popup concepts from your brand.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="v in variations"
            :key="v.label"
            class="image-card group flex flex-col w-full rounded-xl overflow-hidden border border-om-gray-200 cursor-pointer hover:border-om-gray-300 hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-200 text-left"
            @click="selected = v"
          >
            <div class="relative w-full h-[320px] flex items-center justify-center bg-om-gray-200 p-3 overflow-hidden">
              <img
                :src="v.image"
                :alt="v.label"
                class="max-h-full max-w-full object-contain rounded-md shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
              />
              <span class="absolute top-2 right-2 w-7 h-7 rounded-full bg-om-gray-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn :size="14" />
              </span>
            </div>
          </button>
        </div>
      </template>

      <!-- Level 2: one concept, full size -->
      <template v-else>
        <div class="flex flex-col items-center text-center mb-3">
          <h2 class="text-2xl font-semibold text-om-gray-700 mb-2">{{ selected.label }}</h2>
          <p class="text-base text-om-gray-500 leading-relaxed max-w-md">
            Concept {{ variations.indexOf(selected) + 1 }} of {{ variations.length }}, designed from your brand.
          </p>
        </div>

        <div class="flex items-center justify-center bg-om-gray-200 rounded-xl p-4">
          <img
            :src="selected.image"
            :alt="selected.label"
            class="max-w-full max-h-[58vh] object-contain rounded-md shadow-sm"
          />
        </div>
      </template>
    </div>

    <template #footer="{ close }">
      <div v-if="!selected" class="flex items-center gap-2 pr-2">
        <Button variant="ghost" @click="close">Maybe later</Button>
        <Button variant="primary" @click="$emit('confirm')">Open in Agentic OptiMonk</Button>
      </div>
      <div v-else class="flex items-center gap-2 pr-2">
        <Button variant="ghost" @click="selected = null">
          <template #icon><ChevronLeft :size="16" /></template>
          Back
        </Button>
        <Button variant="primary" @click="$emit('select', selected.label)">Make this one</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { shallowRef, watch } from 'vue'
import { X, ChevronLeft, ZoomIn } from 'lucide-vue-next'
import Modal from './Modal.vue'
import Button from './Button.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'confirm', 'select'])

// Two AI-designed popup concepts for the brand.
const variations = [
  { label: 'Lifestyle hero', image: '/agentic-popups/lf-elevate.png' },
  { label: 'Editorial', image: '/agentic-popups/lf-gold-standard.png' },
]

// Second level of the modal: the concept being previewed full size.
// shallowRef keeps the raw object identity so indexOf() below still matches.
const selected = shallowRef(null)
watch(() => props.modelValue, (open) => { if (!open) selected.value = null })
</script>
