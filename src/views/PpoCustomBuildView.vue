<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header bar -->
    <div class="flex items-center justify-between border-b border-om-gray-200 shrink-0 px-8 py-4">
      <div class="flex items-center gap-3">
        <button @click="$emit('back')" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
          <ArrowLeft :size="18" />
        </button>
        <div class="h-5 w-px bg-om-gray-200" />
        <span class="font-semibold text-om-gray-700 text-lg">Custom Build</span>
      </div>
      <Button variant="primary" size="sm" :disabled="selectedTypes.length === 0" @click="$emit('next', selectedTypes)">
        Next
      </Button>
    </div>

    <!-- Content: sidebar + dummy preview -->
    <div class="flex flex-1 min-h-0">
      <!-- Left: element picker -->
      <div class="w-[360px] bg-white flex flex-col shrink-0 border-r border-om-gray-200">
        <div class="px-4 pt-5 pb-2">
          <h2 class="text-base font-semibold text-om-gray-700 mb-1">Choose elements</h2>
          <p class="text-xs text-om-gray-500">Select which AI-generated elements to add.</p>
        </div>
        <div class="flex-1 overflow-y-auto px-3 pb-3">
          <div class="flex flex-col gap-2">
            <div
              v-for="type in contentTypes"
              :key="type.id"
              class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 cursor-pointer"
              :class="[
                selectedTypes.includes(type.id)
                  ? 'border-om-orange-500 bg-om-orange-50'
                  : type.comingSoon
                    ? 'border-om-gray-100 bg-om-gray-50 opacity-60 cursor-default'
                    : 'border-om-gray-200 bg-white hover:border-om-gray-300'
              ]"
              @click="!type.comingSoon && toggleType(type.id)"
            >
              <Checkbox
                :model-value="selectedTypes.includes(type.id)"
                :disabled="type.comingSoon"
                @click.stop
                @update:model-value="toggleType(type.id)"
              />
              <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="type.isImage ? 'bg-purple-50' : 'bg-blue-50'">
                <ImageIcon v-if="type.isImage" :size="16" class="text-purple-500" />
                <Type v-else :size="16" class="text-blue-500" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-om-gray-700">{{ type.label }}</span>
                  <Tag v-if="type.comingSoon" variant="gray-muted">Coming soon</Tag>
                </div>
                <p class="text-xs text-om-gray-400 mt-0.5">{{ type.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 border-t border-om-gray-200 bg-om-gray-50 shrink-0">
          <p class="text-xs text-om-gray-400">{{ selectedTypes.length }} element{{ selectedTypes.length !== 1 ? 's' : '' }} selected</p>
        </div>
      </div>

      <!-- Right: dummy product page preview -->
      <div class="flex-1 min-h-0 min-w-0 p-6 bg-om-gray-100 flex justify-center overflow-y-auto">
        <div class="w-full max-w-3xl bg-white rounded-xl shadow-sm p-8">
          <!-- Dummy nav -->
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-om-gray-200">
            <div class="flex items-center gap-6">
              <div class="w-24 h-6 bg-om-gray-200 rounded" />
              <div class="w-16 h-4 bg-om-gray-100 rounded" />
              <div class="w-16 h-4 bg-om-gray-100 rounded" />
              <div class="w-16 h-4 bg-om-gray-100 rounded" />
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-om-gray-100 rounded-full" />
              <div class="w-8 h-8 bg-om-gray-100 rounded-full" />
            </div>
          </div>
          <!-- Product area -->
          <div class="flex gap-8">
            <!-- Left: product image -->
            <div class="w-1/2 shrink-0">
              <div
                class="aspect-square rounded-xl flex items-center justify-center transition-all duration-200"
                :class="selectedTypes.includes('product-image') ? 'bg-om-orange-50 border-2 border-dashed border-om-orange-400' : 'bg-om-gray-100'"
              >
                <ImageIcon :size="24" :class="selectedTypes.includes('product-image') ? 'text-om-orange-400' : 'text-om-gray-300'" />
              </div>
              <div class="flex gap-2 mt-3">
                <div class="w-16 h-16 bg-om-gray-100 rounded-lg" />
                <div class="w-16 h-16 bg-om-gray-100 rounded-lg" />
                <div class="w-16 h-16 bg-om-gray-100 rounded-lg" />
              </div>
            </div>
            <!-- Right: product info -->
            <div class="flex-1">
              <!-- Brand -->
              <div class="w-20 h-4 bg-om-gray-100 rounded mb-2" />
              <!-- Title -->
              <div class="w-full h-6 bg-om-gray-200 rounded mb-1" />
              <div class="w-3/4 h-6 bg-om-gray-200 rounded mb-4" />
              <!-- Price -->
              <div class="w-24 h-8 bg-om-gray-200 rounded mb-5" />

              <!-- Product sentence slot -->
              <transition name="fade-slot">
                <div v-if="selectedTypes.includes('product-sentence')" class="rounded-lg border-2 border-dashed border-om-orange-400 bg-om-orange-50 p-3 mb-4 transition-all duration-200">
                  <div class="text-[10px] font-semibold text-om-orange-500 uppercase tracking-wider mb-1.5">Product sentence</div>
                  <div class="h-2 rounded-full w-full bg-om-orange-200 mb-1" />
                  <div class="h-2 rounded-full w-4/5 bg-om-orange-200" />
                </div>
              </transition>

              <!-- Benefit list slot -->
              <transition name="fade-slot">
                <div v-if="selectedTypes.includes('benefit-list')" class="rounded-lg border-2 border-dashed border-om-orange-400 bg-om-orange-50 p-3 mb-4 transition-all duration-200">
                  <div class="text-[10px] font-semibold text-om-orange-500 uppercase tracking-wider mb-1.5">Benefit list</div>
                  <div v-for="i in 3" :key="i" class="flex items-center gap-1.5 mb-1 last:mb-0">
                    <div class="w-1.5 h-1.5 rounded-full bg-om-orange-400 shrink-0" />
                    <div class="h-2 rounded-full flex-1 bg-om-orange-200" />
                  </div>
                </div>
              </transition>

              <!-- Description lines -->
              <div class="space-y-2 mb-5">
                <div class="w-full h-3 bg-om-gray-100 rounded" />
                <div class="w-full h-3 bg-om-gray-100 rounded" />
                <div class="w-4/5 h-3 bg-om-gray-100 rounded" />
              </div>
              <!-- CTA -->
              <div class="flex gap-3">
                <div class="w-32 h-10 bg-om-orange-500 rounded-lg" />
                <div class="w-32 h-10 bg-om-gray-200 rounded-lg" />
              </div>
            </div>
          </div>

          <!-- Image badge slot (below fold) -->
          <transition name="fade-slot">
            <div v-if="selectedTypes.includes('image-badge')" class="mt-8 rounded-lg border-2 border-dashed border-om-orange-400 bg-om-orange-50 p-4 flex items-center justify-center transition-all duration-200">
              <div class="text-[10px] font-semibold text-om-orange-500 uppercase tracking-wider mr-3">Kép badge-el</div>
              <ImageIcon :size="18" class="text-om-orange-400" />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '../components/shared/Button.vue'
import Checkbox from '../components/shared/Checkbox.vue'
import Tag from '../components/shared/Tag.vue'
import { ArrowLeft, ImageIcon, Type } from 'lucide-vue-next'

defineEmits(['back', 'next'])

const selectedTypes = ref([])

const contentTypes = [
  { id: 'product-image',    label: 'Product image',          description: 'AI-generált termékkép lifestyle háttérrel.',           isImage: true,  comingSoon: false },
  { id: 'product-sentence', label: 'Product sentence',  description: 'Egyetlen összefoglaló mondat a termékről.',            isImage: false, comingSoon: false },
  { id: 'benefit-list',     label: 'Benefit list',       description: 'Felsorolás a termék legfontosabb előnyeiről.',         isImage: false, comingSoon: false },
  { id: 'image-badge',      label: 'Kép badge-el',       description: 'Termékkép akciós vagy egyéb badge-dzsel.',             isImage: true,  comingSoon: false },
  { id: 'product-summary',  label: 'Termékösszefoglaló', description: 'Kép és szöveg együtt — teljes termékblokk.',           isImage: false, comingSoon: true  },
]

const toggleType = (id) => {
  const idx = selectedTypes.value.indexOf(id)
  if (idx === -1) selectedTypes.value.push(id)
  else selectedTypes.value.splice(idx, 1)
}
</script>

<style scoped>
.fade-slot-enter-active,
.fade-slot-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slot-enter-from,
.fade-slot-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
