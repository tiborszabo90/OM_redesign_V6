<template>
  <div class="h-screen flex flex-col bg-om-gray-50">
    <!-- Header bar -->
    <div class="flex items-center justify-between border-b border-om-gray-200 shrink-0 px-8 py-4 bg-white">
      <div class="flex items-center gap-3">
        <button @click="$emit('back')" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
          <ArrowLeft :size="18" />
        </button>
        <div class="h-5 w-px bg-om-gray-200" />
        <span class="font-semibold text-om-gray-700 text-lg">Smart Product Page</span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-5xl mx-auto px-8 py-10">
        <h2 class="text-2xl font-semibold text-om-gray-700 mb-2 text-center">Which content blocks would you like to add to your product pages?</h2>
        <p class="text-sm text-om-gray-500 mb-8 text-center">Choose one or more — AI will generate them for each of your products.</p>

        <!-- Cards grid -->
        <div class="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div
            v-for="type in contentTypes"
            :key="type.id"
            class="bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 cursor-pointer"
            :class="[
              selectedTypes.includes(type.id)
                ? 'border-om-orange-500 shadow-[0_4px_14px_rgba(237,90,41,0.4)] scale-[1.03]'
                : type.comingSoon
                  ? 'border-om-gray-100 opacity-60 cursor-default'
                  : 'border-om-gray-200 hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03]'
            ]"
            @click="!type.comingSoon && $emit('next', [type.id])"
          >
            <!-- Image placeholder -->
            <div class="w-full bg-om-gray-100 flex items-center justify-center relative overflow-hidden" :class="type.id === 'image-badge' || type.id === 'product-summary' ? 'aspect-4/3' : 'aspect-16/10'">
              <!-- Product image: two squares with arrow -->
              <div v-if="type.id === 'product-image'" class="flex items-center bg-white w-full h-full justify-center">
                <div class="w-32 h-32 rounded-xl border-2 border-om-gray-200 bg-white flex items-center justify-center p-3">
                  <img src="/Prod1.png" class="max-w-full max-h-full object-contain" />
                </div>
                <ArrowRight :size="18" class="text-om-gray-400 mx-1 shrink-0 relative z-10" />
                <img src="/prod2.jpg" class="w-32 h-32 object-cover rounded-xl border-2 border-om-gray-200" />
              </div>
              <!-- Image with badge / Product summary: mini dummy page -->
              <div v-else-if="type.id === 'image-badge' || type.id === 'product-summary'" class="w-full h-full bg-white overflow-hidden flex flex-col px-3 py-2 gap-2">
                <!-- Skeleton content above -->
                <div class="flex gap-2 shrink-0">
                  <div class="w-16 h-16 bg-om-gray-100 rounded shrink-0" />
                  <div class="flex-1 pt-0.5">
                    <div class="w-full h-1.5 bg-om-gray-200 rounded mb-1" />
                    <div class="w-2/3 h-1.5 bg-om-gray-200 rounded mb-1.5" />
                    <div class="w-6 h-2 bg-om-gray-100 rounded" />
                  </div>
                </div>
                <!-- Image -->
                <div class="shrink-0 overflow-hidden rounded">
                  <img :src="type.id === 'image-badge' ? '/badge.png' : '/summary.png'" class="w-full h-auto block" />
                </div>
                <!-- Skeleton content below -->
                <div class="shrink-0 space-y-1.5">
                  <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                  <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                  <div class="w-3/4 h-1.5 bg-om-gray-100 rounded" />
                </div>
              </div>
              <!-- Product sentence -->
              <div v-else-if="type.id === 'product-sentence'" class="w-full h-full bg-white overflow-hidden flex gap-2.5 px-3 py-2">
                <!-- Left: product image -->
                <div class="w-[40%] shrink-0">
                  <div class="aspect-square bg-om-gray-100 rounded" />
                </div>
                <!-- Right: info + highlighted sentence -->
                <div class="flex-1 flex flex-col gap-1.5 pt-0.5">
                  <div class="w-full h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-2/3 h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-8 h-2 bg-om-gray-100 rounded" />
                  <!-- Highlighted sentence -->
                  <div class="rounded-md bg-om-orange-50 border border-om-orange-200 px-2 py-1.5 mt-0.5">
                    <div class="w-full h-1.5 bg-om-orange-200 rounded mb-1" />
                    <div class="w-4/5 h-1.5 bg-om-orange-200 rounded" />
                  </div>
                  <!-- Skeleton below -->
                  <div class="space-y-1 mt-0.5">
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-3/4 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-5/6 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-2/3 h-1.5 bg-om-gray-100 rounded" />
                  </div>
                  <div class="flex gap-1.5 mt-0.5">
                    <div class="w-12 h-3 bg-om-gray-200 rounded" />
                    <div class="w-12 h-3 bg-om-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <!-- Benefit list -->
              <div v-else-if="type.id === 'benefit-list'" class="w-full h-full bg-white overflow-hidden flex gap-2.5 px-3 py-2">
                <!-- Left: product image -->
                <div class="w-[40%] shrink-0">
                  <div class="aspect-square bg-om-gray-100 rounded" />
                </div>
                <!-- Right: info + highlighted benefit list -->
                <div class="flex-1 flex flex-col gap-1.5 pt-0.5">
                  <div class="w-full h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-2/3 h-1.5 bg-om-gray-200 rounded" />
                  <div class="w-8 h-2 bg-om-gray-100 rounded" />
                  <!-- Highlighted benefit list -->
                  <div class="rounded-md bg-om-orange-50 border border-om-orange-200 px-2 py-1.5 mt-0.5 space-y-1.5">
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-om-orange-400 shrink-0" />
                      <div class="h-1.5 bg-om-orange-200 rounded flex-1" />
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-om-orange-400 shrink-0" />
                      <div class="h-1.5 bg-om-orange-200 rounded w-4/5" />
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="w-1.5 h-1.5 rounded-full bg-om-orange-400 shrink-0" />
                      <div class="h-1.5 bg-om-orange-200 rounded w-3/5" />
                    </div>
                  </div>
                  <!-- Skeleton below -->
                  <div class="space-y-1 mt-0.5">
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-3/4 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-5/6 h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-full h-1.5 bg-om-gray-100 rounded" />
                    <div class="w-2/3 h-1.5 bg-om-gray-100 rounded" />
                  </div>
                  <div class="flex gap-1.5 mt-0.5">
                    <div class="w-12 h-3 bg-om-gray-200 rounded" />
                    <div class="w-12 h-3 bg-om-gray-100 rounded" />
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center gap-2">
                <ImageIcon v-if="type.isImage || type.isMixed" :size="28" class="text-om-gray-300" />
                <Type v-else :size="28" class="text-om-gray-300" />
              </div>
              <!-- Selected checkmark -->
              <div
                v-if="selectedTypes.includes(type.id)"
                class="absolute top-3 right-3 w-6 h-6 rounded-full bg-om-orange-500 flex items-center justify-center"
              >
                <Check :size="14" class="text-white" stroke-width="3" />
              </div>
            </div>
            <!-- Card body -->
            <div class="p-4">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold text-om-gray-700">{{ type.label }}</span>
                <Tag v-if="type.comingSoon" variant="gray-muted">Coming soon</Tag>
              </div>
              <p class="text-xs text-om-gray-400 leading-relaxed">{{ type.description }}</p>
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
import Tag from '../components/shared/Tag.vue'
import { ArrowLeft, ArrowRight, ImageIcon, Type, Check } from 'lucide-vue-next'

defineEmits(['back', 'next'])

const selectedTypes = ref([])

const contentTypes = [
  { id: 'image-badge',      label: 'Image with badge',   description: 'Product image with promotional or feature badge.',       isImage: true,  comingSoon: false },
  { id: 'product-summary',  label: 'Product summary',    description: 'Image and text combined — full product block.',          isMixed: true,  comingSoon: false },
]

const toggleType = (id) => {
  const idx = selectedTypes.value.indexOf(id)
  if (idx === -1) selectedTypes.value.push(id)
  else selectedTypes.value.splice(idx, 1)
}
</script>
