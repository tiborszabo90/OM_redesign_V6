<script setup>
/**
 * Session UI — version 3: the runs in a panel beside the chat.
 *
 * Same parallel runs as V2, arranged the other way round. The conversation keeps the
 * left column and never has anything drawn over it; every direction that has been
 * started is a tab on the right, and switching tabs is also what puts that run in the
 * composer's scope — the tab strip is the scope selector, so the pill has nothing left
 * to say and is left out.
 *
 * What this buys over V2 is comparison: the panel is always at the same place on
 * screen, so two directions are two clicks apart instead of two scroll positions.
 * What it costs is width — both columns are narrower than one.
 */
import { computed, watch } from 'vue'
import { Loader2, Check } from 'lucide-vue-next'
import { BRAND, CARD_SHADOW, FONT } from '../tokens'
import { runs, runScope, runById, focusRun } from '../store'
import OqSessionHeader from '../components/OqSessionHeader.vue'
import OqSessionThread from '../components/OqSessionThread.vue'
import OqSessionComposer from '../components/OqSessionComposer.vue'
import OqRunDetail from '../components/OqRunDetail.vue'

/** The tab on screen: the one in scope, falling back to the newest run. */
const activeRun = computed(() => runById(runScope.runId) ?? runs[runs.length - 1] ?? null)

// A dismissed run takes the scope with it; the panel then shows the newest instead.
watch(
  () => runs.length,
  () => {
    if (runScope.runId && !runById(runScope.runId)) {
      runScope.runId = runs[runs.length - 1]?.id ?? null
    }
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
      <OqSessionComposer :show-scope="false" />
    </div>

    <aside
      v-if="runs.length"
      class="flex w-[min(420px,42%)] shrink-0 flex-col border-l"
      :style="{ borderColor: BRAND.gray200, background: BRAND.pageBg }"
    >
      <div
        class="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b px-3 py-2"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <!-- A tab is not only a view: picking one is how the composer below is told
             which run the next note is about. -->
        <button
          v-for="r in runs"
          :key="r.id"
          type="button"
          class="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
          :style="{
            borderColor: r.id === activeRun?.id ? BRAND.blue : BRAND.gray200,
            background: r.id === activeRun?.id ? BRAND.blueSoft : BRAND.surface,
            color: BRAND.ink,
          }"
          @click="focusRun(r.id)"
        >
          <Loader2
            v-if="r.status === 'running'"
            class="size-3 animate-spin"
            :style="{ color: BRAND.blue }"
          />
          <Check v-else class="size-3" :stroke-width="3" :style="{ color: BRAND.emerald }" />
          {{ r.label }}
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-3">
        <OqRunDetail v-if="activeRun" :key="activeRun.id" :run="activeRun" dense :focusable="false" />
      </div>

      <p class="shrink-0 border-t px-3 py-2 text-[11.5px]" :style="{ borderColor: BRAND.gray200, color: BRAND.gray500 }">
        Notes you type go to the <span class="font-semibold" :style="{ color: BRAND.ink }">{{ activeRun?.label }}</span> run.
      </p>
    </aside>
  </div>
</template>
