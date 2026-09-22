<script setup>
/**
 * Session UI — version 3: the runs in a column beside the chat.
 *
 * Same parallel runs as V2, arranged the other way round. The conversation keeps the
 * left column and never has anything drawn over it; every direction that has been
 * started stacks in the right one, in the order it was started, and all of them are on
 * screen at once.
 *
 * It was a tab strip first, which was wrong in the way tabs usually are: the thing the
 * panel exists for is comparison, and a tab shows one direction by hiding the others.
 * Stacked, two directions are a glance apart rather than a click, and the column reads
 * as what the session has going.
 *
 * Clicking a block is what puts it in the composer's scope — the same gesture as V2's
 * thread, and clicking it again lets go — so the pill above the box comes back, because
 * with nothing selected the next note is about the session.
 *
 * What this buys over V2 is a conversation that stays a conversation: the thread is only
 * ever turns, and the pictures never push it off the screen. What it costs is width —
 * both columns are narrower than one.
 */
import { nextTick, ref, watch } from 'vue'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { runs } from '../store'
import OqSessionHeader from '../components/OqSessionHeader.vue'
import OqSessionThread from '../components/OqSessionThread.vue'
import OqSessionComposer from '../components/OqSessionComposer.vue'
import OqRunDetail from '../components/OqRunDetail.vue'

const columnRef = ref(null)

/** A run starts at the bottom of the column, so the column goes there with it. */
watch(
  () => runs.length,
  async () => {
    await nextTick()
    const el = columnRef.value
    if (el) el.scrollTop = el.scrollHeight
  },
)
</script>

<template>
  <div
    class="relative flex min-h-0 w-full flex-1 overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
    <div class="flex min-w-0 flex-1 flex-col">
      <OqSessionHeader />
      <OqSessionThread />
      <OqSessionComposer />
    </div>

    <aside
      v-if="runs.length"
      class="flex w-[min(420px,42%)] shrink-0 flex-col border-l"
      :style="{ borderColor: BRAND.gray200, background: BRAND.pageBg }"
    >
      <div
        class="flex shrink-0 items-baseline gap-2 border-b px-3.5 py-2.5"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">Directions</p>
        <p class="text-xs" :style="{ color: BRAND.gray500 }">
          {{ runs.length }} started · click one to talk about it
        </p>
      </div>

      <!-- Block layout, not flex: a flex child shrinks to fit before the column
           scrolls, which squashed every run to make the next one fit. -->
      <div ref="columnRef" class="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <OqRunDetail v-for="r in runs" :key="r.id" :run="r" dense preview />
      </div>
    </aside>
  </div>
</template>
