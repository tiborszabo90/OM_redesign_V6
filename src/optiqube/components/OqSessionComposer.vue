<script setup>
/**
 * The session's one input.
 *
 * It talks to the session by default. The question with several runs on screen —
 * which of these am I talking about — is answered by a chip rather than a second box,
 * and the chip gets there by itself: the sentence names a run, or a run was clicked,
 * or one was just worked on in the window.
 */
import { computed, watch } from 'vue'
import { ArrowUp, ImagePlus } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { session, runScope, runById, refineRun, sendRefine, runs } from '../store'
import OqRunScope from './OqRunScope.vue'

const scopedRun = computed(() => (runScope.runId ? runById(runScope.runId) : null))

/** Letters only, so "Call-Out", "call out" and "callout" are one word. */
const letters = (text) => text.toLowerCase().replace(/[^a-z]/g, '')

/**
 * Read the run out of the sentence.
 *
 * A note that says which direction it is about has already answered the question the
 * chip asks, so the chip follows the words rather than waiting to be set.
 */
watch(
  () => session.input,
  (text) => {
    // An empty box is a fresh start: whatever was said about the last one is over.
    if (!text.trim()) {
      runScope.cleared = false
      return
    }
    if (runScope.cleared) return
    const typed = letters(text)
    const named = runs.find((r) => typed.includes(letters(r.label)))
    if (named) runScope.runId = named.id
  },
)

/** The one send. Where it goes is what the pill above the box says. */
function send() {
  const text = session.input.trim()
  if (!text) return
  runScope.cleared = false
  if (!runScope.runId) {
    sendRefine()
    return
  }
  session.input = ''
  refineRun(runScope.runId, text)
}
</script>

<template>
  <div class="shrink-0 border-t px-4 py-3 sm:px-8" :style="{ borderColor: BRAND.gray200 }">
    <div class="mx-auto max-w-[820px]">
      <OqRunScope />

      <div
        class="rounded-2xl border px-3 py-2 transition-colors"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <div class="flex items-end gap-2">
          <textarea
            v-model="session.input"
            rows="2"
            :placeholder="
              scopedRun
                ? `Say what to change about the ${scopedRun.label} creatives`
                : session.phase === 'ask_type'
                  ? 'Or just describe what you want'
                  : 'Say what to change — “warmer light, drop the price tag”'
            "
            class="min-h-[44px] flex-1 resize-none bg-transparent py-1.5 text-sm outline-none"
            :style="{ color: BRAND.ink }"
            @keydown.enter.exact.prevent="send"
          />
          <button
            type="button"
            class="mb-0.5 flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--oq-blue-soft)]"
            :style="{ color: BRAND.blue }"
            aria-label="Attach image"
            title="Attach image (or paste / drop)"
          >
            <ImagePlus class="size-4" />
          </button>
          <button
            type="button"
            :disabled="!session.input.trim()"
            class="mb-0.5 flex size-9 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
            :style="{ background: BRAND.blueSolid }"
            aria-label="Send"
            @click="send"
          >
            <ArrowUp class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
