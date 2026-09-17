<script setup>
/**
 * Session UI — version 4: a rail of runs above the composer.
 *
 * Same parallel runs again, with the emphasis moved once more. Every started direction
 * is a compact card in a strip that sits between the thread and the input, so how many
 * are in flight and how far along they are is readable without scrolling and without
 * giving up the thread's width. Opening a card unfolds the full run under it, one at a
 * time — the strip is a summary first and a workspace second.
 *
 * The cost is a region of its own to learn; the gain is that the parallelism is the
 * thing you see, which is what the whole idea is about.
 */
import { computed, ref, watch } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { runs, runById, focusRun, clearRunScope } from '../store'
import OqSessionHeader from '../components/OqSessionHeader.vue'
import OqSessionThread from '../components/OqSessionThread.vue'
import OqSessionComposer from '../components/OqSessionComposer.vue'
import OqRunCard from '../components/OqRunCard.vue'
import OqRunDetail from '../components/OqRunDetail.vue'

const openId = ref(null)
const openRun = computed(() => runById(openId.value))
const runningCount = computed(() => runs.filter((r) => r.status === 'running').length)

/** Picking a card opens it and points the composer at it; picking it again lets go. */
function pick(id) {
  const folding = openId.value === id
  openId.value = folding ? null : id
  if (folding) clearRunScope()
  else focusRun(id)
}

// The newest run opens itself: starting one is a request to look at it.
watch(
  () => runs.length,
  (now, before) => {
    if (now > before) openId.value = runs[runs.length - 1]?.id ?? null
    else if (!runById(openId.value)) openId.value = null
  },
)
</script>

<template>
  <div
    class="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
    <OqSessionHeader />
    <OqSessionThread />

    <div
      v-if="runs.length"
      class="shrink-0 border-t px-4 pb-1 pt-2.5 sm:px-8"
      :style="{ borderColor: BRAND.gray200, background: BRAND.pageBg }"
    >
      <div class="mx-auto max-w-[820px]">
        <p class="mb-1.5 text-[11px] font-bold uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
          Runs ({{ runs.length }}<span v-if="runningCount"> · {{ runningCount }} working</span>)
        </p>

        <div class="grid gap-2 sm:grid-cols-2">
          <div v-for="r in runs" :key="r.id" class="relative">
            <OqRunCard :run="r" :active="r.id === openId" @select="pick" />
            <span
              class="pointer-events-none absolute right-2 top-2"
              :style="{ color: BRAND.gray500 }"
            >
              <ChevronUp v-if="r.id === openId" class="size-3.5" />
              <ChevronDown v-else class="size-3.5" />
            </span>
          </div>
        </div>

        <!-- One at a time: the strip is a summary first, and two opened cards would
             push the thread off the screen. -->
        <div v-if="openRun" class="mt-2 max-h-[46vh] overflow-y-auto">
          <OqRunDetail :key="openRun.id" :run="openRun" />
        </div>
      </div>
    </div>

    <OqSessionComposer />
  </div>
</template>
