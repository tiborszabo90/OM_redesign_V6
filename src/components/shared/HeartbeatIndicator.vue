<template>
  <div class="flex items-center gap-2 cursor-pointer select-none" @click="$emit('toggle')">
    <!-- Pulsing dot -->
    <span class="relative flex h-2.5 w-2.5">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
    </span>
    <!-- Visitor count with slot-machine effect -->
    <span class="text-sm font-medium text-om-gray-600 whitespace-nowrap inline-flex items-baseline gap-1">
      <span class="count-roller inline-block overflow-hidden" :style="{ height: '1.25em', width: countWidth }">
        <transition :name="countDirection" mode="out-in">
          <span
            :key="visitorCount"
            class="inline-block"
            :class="{ 'count-bump': bumping }"
          >{{ visitorCount }}</span>
        </transition>
      </span>
      <span>{{ visitorCount === 1 ? 'visitor' : 'visitors' }}</span>
    </span>
    <!-- Chevron -->
    <ChevronDown
      :size="14"
      :class="['text-om-gray-400 transition-transform duration-200', expanded ? 'rotate-180' : '']"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  visitorCount: {
    type: Number,
    default: 0
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const prevCount = ref(props.visitorCount)
const countDirection = ref('roll-up')
const bumping = ref(false)

const countWidth = computed(() => {
  const digits = String(props.visitorCount).length
  return `${digits * 0.6 + 0.1}em`
})

watch(() => props.visitorCount, (newVal, oldVal) => {
  countDirection.value = newVal > oldVal ? 'roll-up' : 'roll-down'
  prevCount.value = newVal
  // Trigger bump scale animation
  bumping.value = true
  setTimeout(() => { bumping.value = false }, 350)
})
</script>

<style scoped>
.count-roller {
  transition: width 0.3s ease;
  line-height: 1.25em;
  vertical-align: baseline;
}

/* Roll up: old goes up, new comes from below */
.roll-up-enter-active,
.roll-up-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.roll-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.roll-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Roll down: old goes down, new comes from above */
.roll-down-enter-active,
.roll-down-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.roll-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.roll-down-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* Bump / pop scale on change */
.count-bump {
  animation: bump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes bump {
  0% { transform: scale(1); }
  40% { transform: scale(1.25); }
  100% { transform: scale(1); }
}
</style>
