<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <div v-if="text" :class="['tooltip-bubble', { visible: show }]">{{ text }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  text: { type: String, default: '' }
})

const show = ref(false)
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
}

.tooltip-bubble {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-om-gray-600, #505763);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 1.4;
  padding: 8px 12px;
  border-radius: 8px;
  width: 220px;
  z-index: 50;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.tooltip-bubble.visible {
  opacity: 1;
}

.tooltip-bubble::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: var(--color-om-gray-600, #505763);
}
</style>
