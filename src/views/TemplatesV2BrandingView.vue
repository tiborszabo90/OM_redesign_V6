<template>
  <div class="h-screen-safe bg-om-gray-50 flex flex-col">
    <!-- Wizard header: logo top-left -->
    <div class="fixed top-6 left-8 z-50">
      <img
        src="https://www.optimonk.com/wp-content/uploads/optimonk-logo-2024.svg"
        alt="OptiMonk"
        class="h-8"
      />
    </div>

    <!-- Centered content -->
    <div class="flex-1 flex flex-col items-center justify-center px-8">
      <!-- Heading -->
      <h1 class="text-2xl sm:text-3xl font-semibold text-om-gray-700 text-center mb-8">
        Should we auto-personalize the branding?
      </h1>

      <!-- Color swatches -->
      <div class="flex items-center gap-2 mb-10">
        <Chip
          v-for="swatch in swatches"
          :key="swatch.hex"
          :active="selectedSwatch === swatch.hex"
          @click="selectedSwatch = swatch.hex"
        >
          <template #icon>
            <span class="w-5 h-5 rounded-sm inline-block shrink-0" :style="{ background: swatch.hex }" />
          </template>
          {{ swatch.hex }}
        </Chip>
      </div>

      <!-- Two cards with arrow above -->
      <div class="relative flex items-start gap-8">
        <!-- Arrow above, centered between cards -->
        <div class="absolute left-1/2 -translate-x-1/2 -top-9 z-10">
          <img src="/miniwizard_arrow.svg" alt="" class="w-32" />
        </div>

        <!-- Original card -->
        <div class="w-110 rounded-xl border-2 border-om-gray-200 overflow-hidden cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200" @click="emit('navigate', 'templates-v2-essential-theme')">
          <!-- Browser chrome dots with label -->
          <div class="relative flex items-center gap-1 px-3 py-2 bg-white border-b border-om-gray-200">
            <span class="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span class="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span class="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span class="absolute left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest text-om-gray-400 uppercase">Original</span>
          </div>
          <!-- Preview area: 16:9, gray -->
          <div class="w-full aspect-video bg-gray-200" />
          <!-- Footer label -->
          <div class="bg-white px-4 py-3 border-t border-om-gray-100">
            <p class="text-sm text-om-gray-500 text-center">No, keep original style</p>
          </div>
        </div>

        <!-- Branded card -->
        <div class="w-110 rounded-xl border-2 border-om-gray-200 overflow-hidden cursor-pointer hover:border-om-orange-500 hover:shadow-[0_4px_14px_rgba(237,90,41,0.4)] hover:scale-[1.03] transition-all duration-200" @click="emit('navigate', 'wizard-quicktune')">
          <!-- Browser chrome dots with label -->
          <div class="relative flex items-center gap-1 px-3 py-2 bg-white border-b border-om-gray-200">
            <span class="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span class="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span class="w-2 h-2 rounded-full bg-gray-300 inline-block" />
            <span class="absolute left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest text-om-gray-400 uppercase">Branded</span>
          </div>
          <!-- Preview area: 16:9, gray -->
          <div class="w-full aspect-video bg-gray-200" />
          <!-- Footer label -->
          <div class="bg-white px-4 py-3 border-t border-om-gray-100">
            <p class="text-sm text-om-gray-500 text-center">Yes, use branded version</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Chip from '../components/shared/Chip.vue'

const emit = defineEmits(['navigate'])

const swatches = [
  { hex: '#FF1800' },
  { hex: '#000000' },
  { hex: '#414549' },
]

const selectedSwatch = ref('#FF1800')
</script>
