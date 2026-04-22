<template>
  <div class="relative">
    <!-- LIST VARIANT -->
    <div
      v-if="variant === 'list'"
      @click="$emit('click')"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      class="list-card bg-white rounded-xl shadow-[0_1px_2px_1px_rgb(0_0_0/0.03)] p-3 pr-4 flex items-center gap-3 cursor-pointer hover:shadow-[0_2px_4px_2px_rgb(0_0_0/0.05)] transition-shadow relative"
    >
      <!-- Thumbnail -->
      <div
        class="list-thumb w-36 h-24 bg-om-gray-100 rounded-lg shrink-0 overflow-hidden border border-om-gray-200 relative"
        @mouseenter="handleThumbEnter($event)"
        @mouseleave="handleThumbLeave()"
      >
        <!-- Checkbox zone (shows on hover, top-left of thumbnail) -->
        <div
          v-if="isHovered || selected"
          class="absolute left-0 top-0 w-8 h-8 z-20"
          @mouseenter="isCheckboxHovered = true"
          @mouseleave="isCheckboxHovered = false"
        >
          <transition name="fade">
            <button
              @click.stop="$emit('update:selected', !selected)"
              :class="[
                'w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all absolute left-1 top-1',
                selected ? 'bg-om-orange-500 border-om-orange-500' : 'bg-white border-om-gray-300 hover:border-om-orange-500'
              ]"
            >
              <Check v-if="selected" :size="14" class="text-white" stroke-width="3" />
            </button>
          </transition>
        </div>
        <slot name="thumbnail">
          <img :src="image" :alt="name" class="w-full h-full object-cover" :style="{ objectPosition: imagePosition }" />
        </slot>
        <transition name="fade">
          <div v-if="isImageHovered && !isCheckboxHovered" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
            <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
              <slot name="thumbnail-hover">
                <img :src="image" :alt="name" class="w-96 h-auto rounded-lg" />
              </slot>
            </div>
          </div>
        </transition>
      </div>

      <!-- Right column (info + metrics) -->
      <div class="list-right flex-1 flex items-center gap-3 min-w-0">
        <!-- Info -->
        <div class="list-info flex-1 min-w-0">
          <h3 class="list-name text-base font-semibold text-om-gray-700 mb-1">{{ name }}</h3>
          <p class="text-xs text-om-gray-400">{{ domain }}</p>
        </div>

        <!-- Metrics (4 fixed-width slots) -->
        <div class="list-metrics flex items-center gap-3 shrink-0">
          <div v-for="(slot, i) in metricSlots" :key="i" :class="['list-metric-slot', listSlotWidths[i]]">
            <template v-if="slot">
              <p class="text-xs text-om-gray-400 mb-1">{{ slot.label }}</p>
              <p class="list-metric-value text-base font-semibold text-om-gray-700 flex items-center gap-1">
                {{ slot.value }}
                <TrendingUp v-if="slot.trend" :size="16" class="text-[#2CC896]" />
              </p>
            </template>
          </div>
        </div>
      </div>

      <!-- Toggle + Last updated (always right column) -->
      <div class="list-footer flex flex-col items-end gap-1.5 shrink-0">
        <ToggleSwitch :model-value="active" @update:model-value="$emit('update:active', $event)" @click.stop />
        <p class="text-xs text-om-gray-400 whitespace-nowrap text-right">Last updated<br/>{{ lastUpdated }}</p>
      </div>

      <!-- Kebab menu -->
      <div class="relative shrink-0 w-8">
        <Button v-if="isHovered || isKebabOpen" variant="ghost" size="sm" icon-only :active="isKebabOpen" @click.stop="isKebabOpen = !isKebabOpen">
          <template #icon><MoreVertical :size="16" /></template>
        </Button>
        <div v-if="isKebabOpen" class="fixed inset-0 z-10" @click.stop="isKebabOpen = false" />
        <div
          v-if="isKebabOpen"
          class="absolute right-0 top-full mt-1 z-20 bg-white border border-[#D5D8DD] rounded-lg shadow-lg min-w-[180px]"
        >
          <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer" @click.stop="$emit('rename'); isKebabOpen = false">Rename</button>
          <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer" @click.stop="$emit('duplicate'); isKebabOpen = false">Duplicate</button>
          <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer" @click.stop="$emit('edit'); isKebabOpen = false">Edit campaign</button>
          <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer" @click.stop="$emit('edit-schedule'); isKebabOpen = false">Edit schedule</button>
          <!-- Set priority submenu -->
          <div class="relative" @mouseenter="isPriorityOpen = true" @mouseleave="isPriorityOpen = false">
            <button :class="['w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center justify-between', isPriorityOpen ? 'bg-[#F1F2F4]' : '']" @click.stop>
              Set priority
              <ChevronRight :size="14" class="text-om-gray-400" />
            </button>
            <div
              v-if="isPriorityOpen"
              class="absolute right-full top-0 -mr-px z-30 bg-white border border-[#D5D8DD] rounded-lg shadow-lg min-w-[150px]"
            >
              <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center gap-2" @click.stop="$emit('set-priority', 'high'); isKebabOpen = false; isPriorityOpen = false">
                <ChevronsUp :size="14" class="text-om-orange-500" /> High
              </button>
              <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center gap-2" @click.stop="$emit('set-priority', 'normal'); isKebabOpen = false; isPriorityOpen = false">
                <Minus :size="14" class="text-om-gray-400" /> Normal <Check v-if="true" :size="14" class="text-om-gray-500 ml-auto" />
              </button>
              <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer flex items-center gap-2" @click.stop="$emit('set-priority', 'low'); isKebabOpen = false; isPriorityOpen = false">
                <ChevronsDown :size="14" class="text-blue-500" /> Low
              </button>
            </div>
          </div>
          <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer" @click.stop="$emit('share'); isKebabOpen = false">Share</button>
          <div class="border-t border-om-gray-100 my-1"></div>
          <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer" @click.stop="$emit('archive'); isKebabOpen = false">Archive</button>
          <button class="w-full text-left text-sm text-[#23262A] px-4 py-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer" @click.stop="$emit('delete'); isKebabOpen = false">Delete</button>
        </div>
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
        @mouseenter="handleThumbEnter($event)"
        @mouseleave="handleThumbLeave()"
      >
        <slot name="thumbnail">
          <img :src="image" :alt="name" class="w-full h-full object-cover" :style="{ objectPosition: imagePosition }" />
        </slot>
        <transition name="fade">
          <div v-if="isImageHovered && !isCheckboxHovered" class="fixed z-50 pointer-events-none" :style="tooltipStyle">
            <div class="bg-white rounded-xl shadow-2xl border border-om-gray-200 p-3">
              <slot name="thumbnail-hover">
                <img :src="image" :alt="name" class="w-96 h-auto rounded-lg" />
              </slot>
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
import { ref, computed } from 'vue'
import { Check, TrendingUp, MoreVertical, ChevronRight, AlertTriangle, Monitor, ChevronsUp, Minus, ChevronsDown } from 'lucide-vue-next'
import Button from './Button.vue'
import ToggleSwitch from './ToggleSwitch.vue'

const props = defineProps({
  name: { type: String, required: true },
  domain: { type: String, default: '' },
  image: { type: String, required: true },
  imagePosition: { type: String, default: 'center' },
  active: { type: Boolean, default: true },
  selected: { type: Boolean, default: false },
  metrics: { type: Array, default: () => [] },
  lastUpdated: { type: String, default: '' },
  variant: { type: String, default: 'list' } // 'list' | 'grid'
})

defineEmits(['update:active', 'update:selected', 'click', 'rename', 'edit', 'edit-schedule', 'duplicate', 'archive', 'delete', 'share', 'set-priority'])

const isKebabOpen = ref(false)
const isPriorityOpen = ref(false)

const listSlotWidths = ['w-20', 'w-16', 'w-20', 'w-28']

const metricSlots = computed(() => {
  const slots = [...props.metrics]
  while (slots.length < 4) slots.push(null)
  return slots.slice(0, 4)
})

const isHovered = ref(false)
const isCheckboxHovered = ref(false)
const isImageHovered = ref(false)
const hoveredRect = ref(null)

const handleThumbEnter = (event) => {
  isImageHovered.value = true
  hoveredRect.value = event.currentTarget.getBoundingClientRect()
}

const handleThumbLeave = () => {
  isImageHovered.value = false
  hoveredRect.value = null
}

const tooltipStyle = computed(() => {
  if (!hoveredRect.value) return {}
  return {
    left: `${hoveredRect.value.right + 12}px`,
    top: `${hoveredRect.value.top}px`,
  }
})
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

.list-card {
  container-type: inline-size;
}


@container (max-width: 880px) {
  .list-right {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  .list-metrics {
    align-items: flex-start;
  }
  .list-name {
    font-size: 0.875rem;
  }
  .list-metric-value {
    font-size: 0.875rem;
  }
}
</style>
