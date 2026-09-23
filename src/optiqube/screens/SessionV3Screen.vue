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
 *
 * A concept click opens V5's window on the new run, so a direction can be looked at
 * large and fine-tuned there; what is typed in it lands in the same session. Put it
 * down and the run is a block with "Open large" to bring the window back — but only once
 * it has been worked on: a note that redrew it, or a round on its products. Before that
 * it is a draft nothing shows. The window's X only ever closes it. Clicking the card
 * again reopens it.
 *
 * A single run is drawn in the thread, large. The column opens with the second, and
 * from then on the thread keeps a small strip of each round. That move happens while
 * the eye is usually on the window, so the thread says where the run went.
 */
import { computed, nextTick, ref, watch } from 'vue'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { session, runs, runIsDraft } from '../store'
import OqSessionHeader from '../components/OqSessionHeader.vue'
import OqSessionThread from '../components/OqSessionThread.vue'
import OqSessionComposer from '../components/OqSessionComposer.vue'
import OqRunDetail from '../components/OqRunDetail.vue'
import OqRunOverlay from '../components/OqRunOverlay.vue'

const columnRef = ref(null)

/** A run counts once it has been worked on, not when it is opened. */
const shownRuns = computed(() => runs.filter((r) => !runIsDraft(r)))

/**
 * One direction is drawn where it was started, large, as V5 draws it. The column is for
 * comparing, so it opens with the second — and the thread keeps a small strip of each.
 */
const columnOn = computed(() => shownRuns.value.length >= 2)

/**
 * The first run leaves the thread for the column the moment the second one lands. Said
 * in the thread, so it is there to read whenever the window is put down.
 */
watch(columnOn, (on) => {
  if (!on) return
  const names = shownRuns.value.map((r) => `**${r.label}**`)
  session.blocks.push({
    kind: 'assistant',
    text: `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} are side by side now — in Directions, on the right.`,
  })
})

/** A run starts at the bottom of the column, so the column goes there with it. */
watch(
  () => shownRuns.value.length,
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
      <OqSessionThread
        overlay-runs
        hide-drafts
        :inline-runs="!columnOn"
        :run-strips="columnOn"
      />
      <OqSessionComposer />
    </div>

    <aside
      v-if="columnOn"
      class="flex w-[min(420px,42%)] shrink-0 flex-col border-l"
      :style="{ borderColor: BRAND.gray200, background: BRAND.pageBg }"
    >
      <div
        class="flex shrink-0 items-baseline gap-2 border-b px-3.5 py-2.5"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">Directions</p>
        <p class="text-xs" :style="{ color: BRAND.gray500 }">
          {{ shownRuns.length }} started · click one to talk about it
        </p>
      </div>

      <!-- Block layout, not flex: a flex child shrinks to fit before the column
           scrolls, which squashed every run to make the next one fit. -->
      <div ref="columnRef" class="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <OqRunDetail v-for="r in shownRuns" :key="r.id" :run="r" dense openable no-discard />
      </div>
    </aside>

    <OqRunOverlay close-only switcher />
  </div>
</template>
