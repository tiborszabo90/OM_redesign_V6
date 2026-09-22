<script setup>
/**
 * A run's creatives at the size they will actually be judged at.
 *
 * The block in the thread draws them three across a conversation column, which is a
 * good enough glance to tell directions apart and far too small to decide anything. The
 * decision — whether this is the ad — needs the picture big, and needs the other two
 * one keystroke away, because that judgement is a comparison.
 *
 * It is a look, not a place to work: nothing here changes the run, so closing it can
 * never lose anything.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { BRAND } from '../tokens'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** The round's cells, as the block draws them. */
  cells: { type: Array, default: () => [] },
  /** The direction these belong to, for the caption. */
  label: { type: String, default: '' },
})
const emit = defineEmits(['close'])

const at = ref(0)

const current = computed(() => props.cells[at.value] ?? null)

function step(by) {
  const n = props.cells.length
  if (!n) return
  at.value = (at.value + by + n) % n
}

function onKey(e) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') step(-1)
  else if (e.key === 'ArrowRight') step(1)
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      at.value = 0
      window.addEventListener('keydown', onKey)
    } else {
      window.removeEventListener('keydown', onKey)
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[90] flex flex-col bg-black/80 p-4 sm:p-8"
    @click="emit('close')"
  >
    <div class="flex shrink-0 items-center gap-3 pb-3 text-white">
      <span class="text-sm font-semibold">{{ label }}</span>
      <span class="min-w-0 flex-1 truncate text-sm opacity-70">{{ current?.name }}</span>
      <span class="shrink-0 text-xs tabular-nums opacity-70">{{ at + 1 }} / {{ cells.length }}</span>
      <button
        type="button"
        class="shrink-0 rounded-md p-1 transition-colors hover:bg-white/15"
        aria-label="Close"
        @click.stop="emit('close')"
      >
        <X class="size-5" />
      </button>
    </div>

    <div class="flex min-h-0 flex-1 items-center gap-3">
      <button
        v-if="cells.length > 1"
        type="button"
        class="shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/15"
        aria-label="Previous creative"
        @click.stop="step(-1)"
      >
        <ChevronLeft class="size-6" />
      </button>

      <!-- The picture keeps its own aspect: a creative letterboxed to fit the window is
           not the creative anyone is about to publish. -->
      <div class="flex min-h-0 min-w-0 flex-1 items-center justify-center" @click.stop>
        <img
          v-if="current?.imageUrl"
          :src="current.imageUrl"
          :alt="current.name"
          class="max-h-full max-w-full rounded-xl object-contain"
        />
        <div
          v-else
          class="oq-shimmer-sweep aspect-square w-full max-w-[min(70vh,100%)] rounded-xl"
          :style="{ background: BRAND.gray100 }"
        />
      </div>

      <button
        v-if="cells.length > 1"
        type="button"
        class="shrink-0 rounded-full p-2 text-white transition-colors hover:bg-white/15"
        aria-label="Next creative"
        @click.stop="step(1)"
      >
        <ChevronRight class="size-6" />
      </button>
    </div>

    <div v-if="cells.length > 1" class="flex shrink-0 justify-center gap-2 pt-3" @click.stop>
      <button
        v-for="(c, i) in cells"
        :key="c.productId"
        type="button"
        class="size-14 overflow-hidden rounded-lg border-2 transition-opacity"
        :class="i === at ? '' : 'opacity-50 hover:opacity-80'"
        :style="{ borderColor: i === at ? BRAND.blueSolid : 'transparent' }"
        :title="c.name"
        @click="at = i"
      >
        <img v-if="c.imageUrl" :src="c.imageUrl" :alt="c.name" class="size-full object-cover" />
        <span v-else class="block size-full" style="background: rgb(255 255 255 / 0.2)" />
      </button>
    </div>
  </div>
</template>
