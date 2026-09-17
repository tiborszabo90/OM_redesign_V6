<script setup>
/**
 * Session UI — version 2: runs inline in the thread.
 *
 * The overlay v1 opens on a concept card covers the conversation and holds the session
 * for the minute its round takes, so the other three directions have to wait. Here a
 * click on a card starts a run in place: it lands in the thread as its own block and
 * ticks on its own clock, so clicking a second card starts a second one beside it.
 *
 * The composer stays the session's single input, with a pill saying which run the next
 * note is about — one conversation with a label on each turn, rather than a chat box
 * per window.
 */
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import OqSessionHeader from '../components/OqSessionHeader.vue'
import OqSessionThread from '../components/OqSessionThread.vue'
import OqSessionComposer from '../components/OqSessionComposer.vue'
</script>

<template>
  <div
    class="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl"
    :style="{ fontFamily: FONT, background: BRAND.surface, boxShadow: CARD_SHADOW }"
  >
    <OqSessionHeader />
    <OqSessionThread inline-runs />
    <OqSessionComposer />
  </div>
</template>
