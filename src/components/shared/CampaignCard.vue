<template>
  <div class="relative">
    <!-- Checkbox (shows on hover) -->
    <transition name="fade">
      <button
        v-if="isHovered"
        @click.stop="$emit('update:selected', !selected)"
        :class="[
          'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute -left-8 top-1/2 -translate-y-1/2 z-20',
          selected ? 'bg-om-orange-500 border-om-orange-500' : 'bg-white border-om-gray-300 hover:border-om-orange-500'
        ]"
      >
        <Check v-if="selected" :size="14" class="text-white" stroke-width="3" />
      </button>
    </transition>

    <!-- LIST VARIANT -->
    <div
      v-if="variant === 'list'"
      @click="$emit('click')"
      class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-4 flex items-center gap-4 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
    >
      <!-- Hover zone for checkbox trigger -->
      <div
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        class="absolute left-0 top-0 w-32 h-full z-10"
      ></div>

      <!-- Thumbnail -->
      <div
        class="w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
        @mouseenter="isImageHovered = true"
        @mouseleave="isImageHovered = false"
      >
        <img :src="image" :alt="name" class="w-full h-full object-cover" />
        <transition name="fade">
          <div v-if="isImageHovered" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
            <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
              <img :src="image" :alt="name" class="w-96 h-auto rounded-lg" />
            </div>
          </div>
        </transition>
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-semibold text-om-gray-700 mb-1">{{ name }}</h3>
        <p class="text-xs text-om-gray-400">{{ domain }}</p>
      </div>

      <!-- Metrics (4 fixed-width slots) -->
      <div class="flex items-center gap-5 shrink-0">
        <div v-for="(slot, i) in metricSlots" :key="i" :class="listSlotWidths[i]">
          <template v-if="slot">
            <p class="text-xs text-om-gray-400 mb-1">{{ slot.label }}</p>
            <p class="text-base font-semibold text-om-gray-700 flex items-center gap-1">
              {{ slot.value }}
              <TrendingUp v-if="slot.trend" :size="16" class="text-[#2CC896]" />
            </p>
          </template>
        </div>
      </div>

      <!-- Toggle + Last updated -->
      <div class="flex items-center gap-4 shrink-0">
        <ToggleSwitch :model-value="active" @update:model-value="$emit('update:active', $event)" @click.stop />
        <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>{{ lastUpdated }}</p>
      </div>
    </div>

    <!-- GRID VARIANT -->
    <div
      v-else
      @click="$emit('click')"
      class="bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-4 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
    >
      <!-- Hover zone -->
      <div
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        class="absolute left-0 top-0 w-32 h-full z-10"
      ></div>

      <!-- Thumbnail -->
      <div
        class="w-full h-48 bg-om-gray-100 rounded-lg overflow-hidden border border-om-gray-200 mb-4 relative"
        @mouseenter="isImageHovered = true"
        @mouseleave="isImageHovered = false"
      >
        <img :src="image" :alt="name" class="w-full h-full object-cover" />
        <transition name="fade">
          <div v-if="isImageHovered" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
            <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
              <img :src="image" :alt="name" class="w-96 h-auto rounded-lg" />
            </div>
          </div>
        </transition>
      </div>

      <!-- Name + Toggle -->
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="text-base font-semibold text-om-gray-700 mb-1">{{ name }}</h3>
          <p class="text-xs text-om-gray-400">{{ domain }}</p>
        </div>
        <ToggleSwitch :model-value="active" @update:model-value="$emit('update:active', $event)" @click.stop />
      </div>

      <!-- Metrics 2x2 grid -->
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div v-for="(slot, i) in metricSlots" :key="i">
          <template v-if="slot">
            <p class="text-xs text-om-gray-400 mb-1">{{ slot.label }}</p>
            <p class="text-sm font-semibold text-om-gray-700 flex items-center gap-1">
              {{ slot.value }}
              <TrendingUp v-if="slot.trend" :size="14" class="text-[#2CC896]" />
            </p>
          </template>
        </div>
      </div>

      <!-- Last updated -->
      <p class="text-xs text-om-gray-400">Last updated {{ lastUpdated }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Check, TrendingUp } from 'lucide-vue-next'
import ToggleSwitch from './ToggleSwitch.vue'

const props = defineProps({
  name: { type: String, required: true },
  domain: { type: String, default: '' },
  image: { type: String, required: true },
  active: { type: Boolean, default: true },
  selected: { type: Boolean, default: false },
  metrics: { type: Array, default: () => [] },
  lastUpdated: { type: String, default: '' },
  variant: { type: String, default: 'list' } // 'list' | 'grid'
})

defineEmits(['update:active', 'update:selected', 'click'])

const listSlotWidths = ['w-20', 'w-16', 'w-20', 'w-28']

const metricSlots = computed(() => {
  const slots = [...props.metrics]
  while (slots.length < 4) slots.push(null)
  return slots.slice(0, 4)
})

const isHovered = ref(false)
const isImageHovered = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)

const tooltipStyle = computed(() => ({
  left: `${mouseX.value + 20}px`,
  top: `${mouseY.value - 50}px`
}))

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

onMounted(() => document.addEventListener('mousemove', handleMouseMove))
onUnmounted(() => document.removeEventListener('mousemove', handleMouseMove))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
