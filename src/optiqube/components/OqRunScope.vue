<script setup>
/**
 * The run a note is about, as a chip on the composer.
 *
 * The composer belongs to the session, and that is the default: with no chip, a note
 * is about the whole thing. A chip appears when the note names a run, when a run is
 * clicked, or when one was just worked on in the window — and taking it off is how
 * you go back to talking to the session. That is a picker's job done by the three
 * things somebody was going to do anyway, instead of a dropdown they have to find.
 */
import { computed } from 'vue'
import { Crosshair, X } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { runScope, runById, clearRunScope } from '../store'

const run = computed(() => runById(runScope.runId))
</script>

<template>
  <div v-if="run" class="mb-2 flex flex-wrap items-center gap-2">
    <span
      class="inline-flex items-center gap-1.5 rounded-full border py-1 pl-2.5 pr-1.5 text-xs font-semibold"
      :style="{ borderColor: BRAND.blue, background: BRAND.blueSoft, color: BRAND.blue }"
    >
      <Crosshair class="size-3.5" />
      {{ run.label }} run
      <button
        type="button"
        class="flex size-4 items-center justify-center rounded-full transition-colors hover:bg-[var(--oq-surface)]"
        title="Talk to the whole session instead"
        aria-label="Talk to the whole session instead"
        @click="clearRunScope"
      >
        <X class="size-3" />
      </button>
    </span>
    <span class="text-[11px]" :style="{ color: BRAND.gray500 }">
      This note is about that run — remove the chip to talk to the session.
    </span>
  </div>
</template>
