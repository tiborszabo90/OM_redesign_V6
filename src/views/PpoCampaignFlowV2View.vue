<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Header bar -->
    <div class="flex items-center justify-between border-b border-om-gray-200 shrink-0 px-8 py-4">
      <div class="flex items-center gap-3">
        <button @click="$emit('back')" class="text-om-gray-600 hover:text-om-gray-800 cursor-pointer">
          <ArrowLeft :size="18" />
        </button>
        <div class="h-5 w-px bg-om-gray-200" />
        <span class="font-semibold text-om-gray-700 text-lg">Product Page Optimizer</span>
      </div>
    </div>

    <!-- Content: card grid -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-5xl mx-auto px-8 py-10">
        <h2 class="text-xl font-semibold text-om-gray-700 mb-2">Choose your optimization strategy</h2>
        <p class="text-sm text-om-gray-500 mb-8">Select how you'd like to optimize your product pages. Each strategy includes different AI-generated elements.</p>

        <div class="grid grid-cols-3 gap-5">
          <!-- Strategy cards -->
          <div
            v-for="card in strategyCards"
            :key="card.id"
            @click="$emit('next', [card.id])"
            class="rounded-xl border-2 p-1 cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col"
            :class="false ? 'border-om-orange-500 shadow-md' : 'border-om-gray-200 hover:border-om-gray-300'"
          >
            <!-- Card illustration: mini product page wireframe -->
            <div class="rounded-lg bg-om-gray-50 p-4 mb-3" :class="false ? 'bg-om-orange-50/30' : ''">
              <!-- Mini navbar -->
              <div class="flex items-center gap-2 mb-3">
                <div class="w-10 h-2 rounded-full bg-om-gray-300" />
                <div class="w-6 h-1.5 rounded-full bg-om-gray-200" />
                <div class="w-6 h-1.5 rounded-full bg-om-gray-200" />
              </div>
              <!-- Product area -->
              <div class="flex gap-3">
                <!-- Left: product image -->
                <div class="w-[45%] shrink-0">
                  <div class="aspect-square rounded-md flex items-center justify-center"
                    :class="card.highlight === 'image'
                      ? (false ? 'border-2 border-om-orange-400 bg-om-orange-50' : 'border-2 border-om-orange-300 bg-om-orange-50/50')
                      : 'bg-om-gray-200'"
                  >
                    <ImageIcon :size="16" :class="card.highlight === 'image' ? 'text-om-orange-400' : 'text-om-gray-300'" />
                  </div>
                </div>
                <!-- Right: product info -->
                <div class="flex-1 flex flex-col gap-1.5 pt-0.5">
                  <!-- Title lines -->
                  <div class="h-2 rounded-full w-4/5 bg-om-gray-300" />
                  <div class="h-2 rounded-full w-3/5 bg-om-gray-200" />
                  <!-- Price -->
                  <div class="h-2.5 rounded-full w-1/3 bg-om-gray-200 mt-1" />
                  <!-- Product sentence highlight -->
                  <div v-if="card.highlight === 'sentence'" class="rounded-md p-1.5 mt-1"
                    :class="false ? 'border border-om-orange-400 bg-om-orange-50' : 'border border-om-orange-300 bg-om-orange-50/50'"
                  >
                    <div class="h-1.5 rounded-full w-full bg-om-orange-300 mb-1" />
                    <div class="h-1.5 rounded-full w-4/5 bg-om-orange-200" />
                  </div>
                  <!-- Benefit list highlight -->
                  <div v-if="card.highlight === 'benefits'" class="rounded-md p-1.5 mt-1"
                    :class="false ? 'border border-om-orange-400 bg-om-orange-50' : 'border border-om-orange-300 bg-om-orange-50/50'"
                  >
                    <div v-for="i in 3" :key="i" class="flex items-center gap-1 mb-0.5 last:mb-0">
                      <div class="w-1 h-1 rounded-full bg-om-orange-400 shrink-0" />
                      <div class="h-1.5 rounded-full flex-1 bg-om-orange-200" />
                    </div>
                  </div>
                  <!-- Description lines -->
                  <div class="flex flex-col gap-1 mt-1">
                    <div class="h-1.5 rounded-full w-full bg-om-gray-100" />
                    <div class="h-1.5 rounded-full w-4/5 bg-om-gray-100" />
                  </div>
                  <!-- CTA -->
                  <div class="h-3 rounded w-2/3 mt-1" :class="false ? 'bg-om-orange-400' : 'bg-om-gray-300'" />
                </div>
              </div>
              <!-- Below-fold badge highlight -->
              <div v-if="card.highlight === 'badge'" class="mt-3 rounded-md flex items-center justify-center h-10 border border-dashed"
                :class="false ? 'border-om-orange-400 bg-om-orange-50' : 'border-om-orange-300 bg-om-orange-50/50'"
              >
                <ImageIcon :size="14" class="text-om-orange-400" />
              </div>
            </div>

            <!-- Card text -->
            <div class="px-3 pb-4">
              <h3 class="text-sm font-bold mb-1" :class="false ? 'text-om-orange-500' : 'text-om-gray-700'">{{ card.label }}</h3>
              <p class="text-xs text-om-gray-500 leading-relaxed">{{ card.description }}</p>
            </div>
          </div>

          <!-- Custom Build card -->
          <div
            @click="$emit('next', ['custom'])"
            class="rounded-xl border-2 border-dashed p-1 cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center text-center min-h-[220px]"
            :class="false ? 'border-om-orange-500 shadow-md bg-om-orange-50/30' : 'border-om-gray-300 hover:border-om-gray-400'"
          >
            <div class="w-14 h-14 rounded-2xl bg-om-gray-100 flex items-center justify-center mb-3 relative" :class="false ? 'bg-om-orange-100' : ''">
              <Settings2 :size="24" :class="false ? 'text-om-orange-500' : 'text-om-gray-400'" />
              <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" :class="false ? 'bg-om-orange-500' : 'bg-om-gray-400'">
                <Plus :size="12" class="text-white" />
              </div>
            </div>
            <h3 class="text-sm font-bold mb-1" :class="false ? 'text-om-orange-500' : 'text-om-gray-700'">Custom Build</h3>
            <p class="text-xs text-om-gray-500 leading-relaxed max-w-[200px]">Start from scratch. Choose exactly which elements to add and where to place them on your product page.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, ImageIcon, Settings2, Plus } from 'lucide-vue-next'

defineEmits(['back', 'next', 'menu-click'])

const strategyCards = [
  {
    id: 'product-image',
    label: 'Termékkép',
    description: 'AI-generált termékkép lifestyle háttérrel.',
    highlight: 'image',
  },
  {
    id: 'product-sentence',
    label: 'Product sentence',
    description: 'Egyetlen összefoglaló mondat a termékről.',
    highlight: 'sentence',
  },
  {
    id: 'benefit-list',
    label: 'Benefit list',
    description: 'Felsorolás a termék legfontosabb előnyeiről.',
    highlight: 'benefits',
  },
  {
    id: 'image-badge',
    label: 'Kép badge-el',
    description: 'Termékkép akciós vagy egyéb badge-dzsel.',
    highlight: 'badge',
  },
]
</script>
