<script setup>
/**
 * Session UI — version 5: the original's window over V2's thread.
 *
 * The original is right about one thing: a direction is worth looking at large, and
 * fine-tuning wants room. What it got wrong is that the window was where the run
 * lived — so it covered the conversation, and the session could only do one thing at
 * a time.
 *
 * Here the run lives in the thread as a V2 block, which is also how it starts life and
 * where it goes when the window is put down. The window is a lens: open it to see the
 * creatives big and work on them, put it down to start the next direction beside it.
 * Several runs render at once either way.
 *
 * And the window has no chat of its own — its right column is the session's own turns
 * about that run. One conversation, two places to read it.
 */
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import OqSessionHeader from '../components/OqSessionHeader.vue'
import OqSessionThread from '../components/OqSessionThread.vue'
import OqSessionComposer from '../components/OqSessionComposer.vue'
import OqRunOverlay from '../components/OqRunOverlay.vue'
</script>

<template>
  <div
    class="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
    <OqSessionHeader />
    <OqSessionThread inline-runs overlay-runs />
    <OqSessionComposer />
    <OqRunOverlay />
  </div>
</template>
