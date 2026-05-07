<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
      >
        <div class="fixed inset-0 bg-black/30" @click="handleBackdrop" />
        <div
          :class="['relative bg-white rounded-2xl shadow-xl z-10 flex flex-col max-h-[90vh] w-full', sizeClass]"
        >
          <div
            v-if="$slots.header || title || !hideClose"
            class="flex items-center justify-between px-6 pt-6"
            :class="{ 'pb-4 border-b border-om-gray-200': hasHeaderDivider }"
          >
            <slot name="header">
              <h2 v-if="title" :id="titleId" class="text-lg font-semibold text-om-gray-700">
                {{ title }}
              </h2>
              <span v-else />
            </slot>
            <Button v-if="!hideClose" variant="ghost" size="sm" icon-only @click="close">
              <template #icon><X :size="16" /></template>
            </Button>
          </div>

          <div :class="['px-6 overflow-y-auto', bodyPaddingClass]">
            <slot />
          </div>

          <div
            v-if="$slots.footer"
            class="flex items-center justify-end gap-2 px-6 pb-6 pt-4"
            :class="{ 'border-t border-om-gray-200': hasFooterDivider }"
          >
            <slot name="footer" :close="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'
import Button from './Button.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
  },
  closeOnBackdrop: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true },
  hideClose: { type: Boolean, default: false },
  dividers: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'close'])

const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`

const sizeClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}[props.size]))

const hasHeaderDivider = computed(() => props.dividers)
const hasFooterDivider = computed(() => props.dividers)
const bodyPaddingClass = computed(() => props.dividers ? 'py-4' : 'py-4')

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdrop = () => {
  if (props.closeOnBackdrop) close()
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.closeOnEsc && props.modelValue) close()
}

watch(() => props.modelValue, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleKeydown)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.15s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
