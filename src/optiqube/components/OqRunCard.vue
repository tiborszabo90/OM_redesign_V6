<script setup>
/**
 * A run at a glance: three thumbnails, how far along it is, and whether it wants you.
 *
 * What a rail or a tab list is made of. Small enough that four of them side by side
 * still say which one landed and which one is still drawing.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Check, Loader2 } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { runPending } from '../store'

const props = defineProps({
  run: { type: Object, required: true },
  active: { type: Boolean, default: false },
})
defineEmits(['select'])

const now = ref(Date.now())
let ticker = null
watch(
  () => props.run.startedAt,
  (startedAt) => {
    clearInterval(ticker)
    if (!startedAt) return
    now.value = Date.now()
    ticker = setInterval(() => { now.value = Date.now() }, 150)
  },
  { immediate: true },
)
onBeforeUnmount(() => clearInterval(ticker))

const elapsedMs = computed(() => (props.run.startedAt ? now.value - props.run.startedAt : 0))
const percent = computed(() => Math.min(96, Math.round((elapsedMs.value / 6000) * 100)))
const elapsedLabel = computed(() => {
  const total = Math.floor(elapsedMs.value / 1000)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
})
</script>

<template>
  <button
    type="button"
    class="w-full overflow-hidden rounded-xl border text-left transition-colors"
    :style="{
      borderColor: active ? BRAND.blue : run.status === 'ready' ? BRAND.successLine : BRAND.gray200,
      background: active ? BRAND.blueSoft : BRAND.surface,
    }"
    @click="$emit('select', run.id)"
  >
    <div class="flex items-center gap-2.5 px-2.5 py-2">
      <div class="flex shrink-0 gap-1" aria-hidden="true">
        <span
          v-for="c in run.cells"
          :key="c.productId"
          class="relative size-8 shrink-0 overflow-hidden rounded-md border"
          :style="{ borderColor: BRAND.gray200, background: BRAND.mediaMat }"
        >
          <img v-if="c.imageUrl" :src="c.imageUrl" alt="" class="size-full object-cover" />
          <span v-if="c.status === 'pending'" class="oq-shimmer-sweep absolute inset-0" />
        </span>
      </div>

      <div class="min-w-0 flex-1">
        <p class="truncate text-[13px] font-semibold" :style="{ color: BRAND.ink }">{{ run.label }}</p>
        <p
          v-if="run.status === 'running'"
          class="flex items-center gap-1.5 truncate text-[11.5px]"
          :style="{ color: BRAND.gray500 }"
        >
          <Loader2 class="size-3 shrink-0 animate-spin" :style="{ color: BRAND.blue }" />
          <span class="font-semibold tabular-nums" :style="{ color: BRAND.ink }">{{ percent }}%</span>
          <span class="tabular-nums">{{ elapsedLabel }}</span>
          <span class="truncate">· {{ runPending(run) }} of {{ run.cells.length }}</span>
        </p>
        <p
          v-else
          class="flex items-center gap-1.5 truncate text-[11.5px] font-semibold"
          :style="{ color: BRAND.emeraldText }"
        >
          <Check class="size-3 shrink-0" :stroke-width="2.5" />
          Ready — {{ run.cells.length }} creatives
        </p>
      </div>
    </div>

    <div class="h-[3px] w-full" :style="{ background: BRAND.gray100 }">
      <div
        class="h-full transition-[width] duration-300"
        :style="{
          width: run.status === 'running' ? `${percent}%` : '100%',
          background: run.status === 'running' ? BRAND.blue : BRAND.emerald,
        }"
      />
    </div>
  </button>
</template>
