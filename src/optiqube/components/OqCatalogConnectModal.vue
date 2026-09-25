<script setup>
/**
 * `OqCatalogConnect` as a modal, for the places outside the run window that need a
 * catalog before they can go on: a campaign's Activate, its feeds, an ad's products.
 */
import { onBeforeUnmount, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { BRAND, FONT, MODAL_SHADOW } from '../tokens'
import OqCatalogConnect from './OqCatalogConnect.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  imageUrl: { type: String, default: '' },
  title: { type: String, default: '' },
  body: { type: String, default: '' },
})
const emit = defineEmits(['connected', 'close'])

function onKeydown(e) {
  if (props.open && e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background: rgb(16 24 40 / 0.45)"
    @click="emit('close')"
  >
    <div
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      class="relative flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl px-6 py-4"
      :style="{ background: BRAND.pageBg, boxShadow: MODAL_SHADOW, fontFamily: FONT }"
      @click.stop
    >
      <button
        type="button"
        class="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full"
        :style="{ background: BRAND.gray100, color: BRAND.gray600 }"
        aria-label="Close"
        @click="emit('close')"
      >
        <X class="size-4" />
      </button>
      <OqCatalogConnect
        :image-url="imageUrl"
        :title="title"
        :body="body"
        later-label="Not now"
        @connected="emit('connected')"
        @later="emit('close')"
      />
    </div>
  </div>
</template>
