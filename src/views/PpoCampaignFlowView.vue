<template>
  <div class="h-screen flex flex-col bg-om-gray-50">
    <!-- Header bar -->
    <div class="flex items-center justify-between border-b border-om-gray-200 shrink-0 px-8 py-4 bg-white">
      <div class="flex items-center gap-3">
        <button @click="$emit('back')" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
          <ArrowLeft :size="18" />
        </button>
        <div class="h-5 w-px bg-om-gray-200" />
        <span class="font-semibold text-om-gray-700 text-lg">Product Page Optimizer</span>
      </div>
      <Button variant="primary" size="sm" :disabled="selectedTypes.length === 0" @click="$emit('next', selectedTypes)">
        Next
      </Button>
    </div>

    <!-- Content: two columns side by side -->
    <div class="flex-1 flex min-h-0">
      <div class="max-w-6xl mx-auto px-8 py-8 flex gap-8 items-start flex-1 min-h-0">

        <!-- Left: element picker (fixed) -->
        <div class="w-[340px] shrink-0 sticky top-8 self-start">
          <h2 class="text-lg font-semibold text-om-gray-700 mb-1">Choose elements</h2>
          <p class="text-sm text-om-gray-500 mb-5">Select which AI-generated elements to add to your product pages.</p>

          <div class="flex flex-col gap-2.5">
            <div
              v-for="type in contentTypes"
              :key="type.id"
              class="flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer bg-white"
              :class="[
                selectedTypes.includes(type.id)
                  ? 'border-om-orange-500 bg-om-orange-50 shadow-sm'
                  : type.comingSoon
                    ? 'border-om-gray-100 bg-om-gray-50 opacity-60 cursor-default'
                    : 'border-om-gray-200 hover:border-om-gray-300'
              ]"
              @click="!type.comingSoon && toggleType(type.id)"
            >
              <Checkbox
                :model-value="selectedTypes.includes(type.id)"
                :disabled="type.comingSoon"
                @click.stop
                @update:model-value="toggleType(type.id)"
              />
              <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :class="type.isImage || type.isMixed ? 'bg-purple-50' : 'bg-blue-50'">
                <ImageIcon v-if="type.isImage || type.isMixed" :size="16" class="text-purple-500" />
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

          <p class="text-xs text-om-gray-400 mt-4">{{ selectedTypes.length }} element{{ selectedTypes.length !== 1 ? 's' : '' }} selected</p>
        </div>

        <!-- Right: dummy product page preview (scrollable) -->
        <div class="flex-1 min-w-0 overflow-y-auto max-h-full">
          <div class="bg-white rounded-xl shadow-sm p-8">
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
                <div class="w-20 h-4 bg-om-gray-100 rounded mb-2" />
                <div class="w-full h-6 bg-om-gray-200 rounded mb-1" />
                <div class="w-3/4 h-6 bg-om-gray-200 rounded mb-4" />
                <div class="w-24 h-8 bg-om-gray-200 rounded mb-5" />

                <!-- Product sentence slot -->
                <transition name="fade-slot">
                  <div v-if="selectedTypes.includes('product-sentence')" class="rounded-lg border-2 border-dashed border-om-orange-400 bg-om-orange-50 p-3 mb-4">
                    <div class="text-[10px] font-semibold text-om-orange-500 uppercase tracking-wider mb-1.5">Product sentence</div>
                    <div class="h-2 rounded-full w-full bg-om-orange-200 mb-1" />
                    <div class="h-2 rounded-full w-4/5 bg-om-orange-200" />
                  </div>
                </transition>

                <!-- Benefit list slot -->
                <transition name="fade-slot">
                  <div v-if="selectedTypes.includes('benefit-list')" class="rounded-lg border-2 border-dashed border-om-orange-400 bg-om-orange-50 p-3 mb-4">
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
              <div v-if="selectedTypes.includes('image-badge')" class="mt-8 rounded-lg border-2 border-dashed border-om-orange-400 bg-om-orange-50 p-4 h-36 flex items-center justify-center">
                <div class="text-[10px] font-semibold text-om-orange-500 uppercase tracking-wider mr-3">Image with badge</div>
                <ImageIcon :size="18" class="text-om-orange-400" />
              </div>
            </transition>

            <!-- Product summary slot -->
            <transition name="fade-slot">
              <div v-if="selectedTypes.includes('product-summary')" class="mt-8 rounded-lg border-2 border-dashed border-om-orange-400 bg-om-orange-50 p-4 h-36 flex items-center justify-center">
                <div class="text-[10px] font-semibold text-om-orange-500 uppercase tracking-wider mr-3">Product summary</div>
                <ImageIcon :size="18" class="text-om-orange-400" />
              </div>
            </transition>

            <!-- Full-width banner -->
            <div class="w-full h-28 bg-om-gray-100 rounded-lg flex items-center justify-center mt-8">
              <div class="text-xs text-om-gray-300 uppercase tracking-wider">Banner</div>
            </div>

            <!-- Related products -->
            <div class="mt-8">
              <div class="w-40 h-5 bg-om-gray-200 rounded mb-4" />
              <div class="grid grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="flex flex-col gap-2">
                  <div class="aspect-square bg-om-gray-100 rounded-lg" />
                  <div class="w-full h-3 bg-om-gray-100 rounded" />
                  <div class="w-2/3 h-3 bg-om-gray-100 rounded" />
                  <div class="w-1/3 h-4 bg-om-gray-200 rounded" />
                </div>
              </div>
            </div>

            <!-- Description block -->
            <div class="mt-8">
              <div class="w-48 h-5 bg-om-gray-200 rounded mb-4" />
              <div class="space-y-2">
                <div class="w-full h-3 bg-om-gray-100 rounded" />
                <div class="w-full h-3 bg-om-gray-100 rounded" />
                <div class="w-full h-3 bg-om-gray-100 rounded" />
                <div class="w-3/4 h-3 bg-om-gray-100 rounded" />
              </div>
              <div class="w-full h-40 bg-om-gray-100 rounded-lg mt-4" />
              <div class="space-y-2 mt-4">
                <div class="w-full h-3 bg-om-gray-100 rounded" />
                <div class="w-full h-3 bg-om-gray-100 rounded" />
                <div class="w-5/6 h-3 bg-om-gray-100 rounded" />
              </div>
            </div>
          </div>
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

defineEmits(['back', 'next', 'menu-click'])

const selectedTypes = ref([])

const contentTypes = [
  { id: 'product-image',    label: 'Product image',          description: 'AI-generált termékkép lifestyle háttérrel.',           isImage: true,  comingSoon: false },
  { id: 'image-badge',      label: 'Image with badge',       description: 'Termékkép akciós vagy egyéb badge-dzsel.',             isImage: true,  comingSoon: false },
  { id: 'product-summary',  label: 'Product summary',     description: 'Image and text combined — full product block.',        isMixed: true,  comingSoon: false },
  { id: 'product-sentence', label: 'Product sentence',  description: 'Egyetlen összefoglaló mondat a termékről.',            isImage: false, comingSoon: false },
  { id: 'benefit-list',     label: 'Benefit list',       description: 'Felsorolás a termék legfontosabb előnyeiről.',         isImage: false, comingSoon: false },
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
