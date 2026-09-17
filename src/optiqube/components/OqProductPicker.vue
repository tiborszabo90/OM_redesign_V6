<script setup>
/**
 * Which catalog products a direction is generated on.
 *
 * Three slots, and every one of them is the merchant's — including the product the
 * concept was drawn from, which leads the list because it is the obvious one to keep,
 * not because it is fixed. Full means full: a fourth click is refused rather than
 * quietly dropping something that was deliberately chosen, so what comes out is what
 * was picked.
 *
 * `lockedId` is the exception the original overlay needs, where the seed is the step
 * the whole flow is about and cannot be swapped.
 */
import { computed, ref, watch } from 'vue'
import { Check, Lock, X } from 'lucide-vue-next'
import { BRAND, MODAL_SHADOW } from '../tokens'
import { products } from '../store'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** Product ids already chosen. */
  selected: { type: Array, default: () => [] },
  /** The product the direction was designed on — listed first. */
  seedId: { type: String, default: '' },
  /** A product that cannot be taken out. Empty leaves every slot free. */
  lockedId: { type: String, default: '' },
  /** How many products the round covers. */
  max: { type: Number, default: 3 },
})
const emit = defineEmits(['confirm', 'close'])

const picked = ref([])
watch(
  () => props.open,
  (open) => {
    if (open) picked.value = [...new Set([props.lockedId, ...props.selected].filter(Boolean))]
  },
  { immediate: true },
)

/** The seed leads, because it is the one already decided on. */
const rows = computed(() => {
  const seed = products.find((p) => p.id === props.seedId)
  const rest = products.filter((p) => p.imageUrl && p.id !== props.seedId).slice(0, 11)
  return seed ? [seed, ...rest] : rest
})

const full = computed(() => picked.value.length >= props.max)

function toggle(id) {
  if (id === props.lockedId) return
  if (picked.value.includes(id)) {
    picked.value = picked.value.filter((x) => x !== id)
    return
  }
  if (full.value) return
  picked.value = [...picked.value, id]
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
    @click="emit('close')"
  >
    <div
      class="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl"
      :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW }"
      @click.stop
    >
      <div
        class="flex items-center justify-between gap-3 border-b px-5 py-3.5"
        :style="{ borderColor: BRAND.gray200 }"
      >
        <div>
          <h2 class="text-sm font-semibold" :style="{ color: BRAND.ink }">Generate on</h2>
          <p class="text-xs" :style="{ color: BRAND.gray500 }">
            Pick up to {{ max }} products.
            <span v-if="full">Deselect one to choose another.</span>
          </p>
        </div>
        <button type="button" aria-label="Close" class="rounded-md p-1" @click="emit('close')">
          <X class="size-4" :style="{ color: BRAND.gray500 }" />
        </button>
      </div>

      <div class="grid min-h-0 flex-1 grid-cols-3 gap-2 overflow-y-auto p-4 sm:grid-cols-4">
        <button
          v-for="p in rows"
          :key="p.id"
          type="button"
          class="overflow-hidden rounded-xl border text-left transition-opacity"
          :class="[
            p.id === lockedId ? 'cursor-default' : '',
            full && !picked.includes(p.id) ? 'opacity-45' : '',
          ]"
          :style="{
            borderColor: picked.includes(p.id) ? BRAND.blue : BRAND.gray200,
            background: BRAND.surface,
          }"
          :title="full && !picked.includes(p.id) ? 'Deselect one first' : p.name"
          @click="toggle(p.id)"
        >
          <span class="relative block aspect-square" :style="{ background: BRAND.gray50 }">
            <img :src="p.imageUrl" alt="" class="size-full object-cover" />
            <span
              v-if="picked.includes(p.id)"
              class="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full text-white"
              :style="{ background: p.id === lockedId ? BRAND.gray400 : BRAND.blueSolid }"
            >
              <Lock v-if="p.id === lockedId" class="size-2.5" />
              <Check v-else class="size-3" :stroke-width="3" />
            </span>
          </span>
          <span class="block truncate px-2 py-1.5 text-[11px] font-medium" :style="{ color: BRAND.ink }">
            {{ p.name }}
          </span>
        </button>
      </div>

      <div
        class="flex items-center justify-between gap-3 border-t px-5 py-3"
        :style="{ borderColor: BRAND.gray200 }"
      >
        <p class="text-xs" :style="{ color: BRAND.gray500 }">
          {{ picked.length }} of {{ max }} selected
        </p>
        <div class="flex items-center gap-2">
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
            :disabled="!picked.length"
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-45"
            :style="{ background: BRAND.blue }"
            @click="emit('confirm', picked)"
          >
            Use these
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
