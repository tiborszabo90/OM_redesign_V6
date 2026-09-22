<script setup>
/**
 * The one question worth interrupting for: something is about to be lost.
 *
 * Small on purpose. It carries what goes and what stays, because the useful thing to
 * know before discarding a direction is not that it is permanent but what "it" covers —
 * the creatives go, the conversation about them does not.
 */
import { onBeforeUnmount, watch } from 'vue'
import { BRAND, MODAL_SHADOW } from '../tokens'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Discard' },
})
const emit = defineEmits(['confirm', 'close'])

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
  { immediate: true },
)
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[85] flex items-center justify-center bg-black/40 p-4"
    @click="emit('close')"
  >
    <div
      class="w-full max-w-sm overflow-hidden rounded-2xl p-5"
      :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW }"
      role="alertdialog"
      @click.stop
    >
      <h2 class="text-sm font-semibold" :style="{ color: BRAND.ink }">{{ title }}</h2>
      <p class="mt-1.5 text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">{{ body }}</p>

      <div class="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded-xl border px-4 py-2 text-sm font-semibold"
          :style="{ borderColor: BRAND.gray200, color: BRAND.ink }"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-semibold"
          :style="{ background: BRAND.redSolid, color: BRAND.onAccent }"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
