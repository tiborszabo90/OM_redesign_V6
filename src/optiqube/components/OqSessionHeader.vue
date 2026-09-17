<script setup>
/** The session's title bar: rename in place, and what the session is doing. */
import { computed, ref } from 'vue'
import { Pencil, Sparkles } from 'lucide-vue-next'
import { BRAND } from '../tokens'
import { session, activeBrand, runs } from '../store'

const renaming = ref(false)
const draft = ref('')

const subtitle = computed(() => {
  const running = runs.filter((r) => r.status === 'running').length
  if (running) return `${activeBrand().domain} · ${running} ${running === 1 ? 'run' : 'runs'} working…`
  return `${activeBrand().domain} · ${session.busy ? 'working…' : 'ready'}`
})

function commit() {
  const next = draft.value.trim()
  if (next) session.title = next
  renaming.value = false
}
</script>

<template>
  <header
    class="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-3.5"
    :style="{ borderColor: BRAND.gray200 }"
  >
    <div class="min-w-0">
      <div v-if="renaming" class="flex items-center gap-2">
        <Sparkles class="size-4 shrink-0" :style="{ color: BRAND.blue }" />
        <input
          v-model="draft"
          class="min-w-0 rounded-md border px-1.5 py-0.5 text-sm font-semibold outline-none"
          style="width: min(320px, 60vw)"
          :style="{ borderColor: BRAND.gray200, background: BRAND.surface, color: BRAND.ink }"
          autofocus
          @keydown.enter.prevent="commit"
          @keydown.esc="renaming = false"
          @blur="commit"
        />
      </div>
      <button
        v-else
        type="button"
        class="group -ml-1.5 flex max-w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left transition-colors hover:bg-[var(--oq-surface-subtle)]"
        title="Rename session"
        @click="draft = session.title; renaming = true"
      >
        <Sparkles class="size-4 shrink-0" :style="{ color: BRAND.blue }" />
        <span class="truncate text-sm font-semibold" :style="{ color: BRAND.ink }">
          {{ session.title }}
        </span>
        <Pencil
          class="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          :style="{ color: BRAND.gray500 }"
        />
      </button>
      <p class="mt-0.5 text-xs" :style="{ color: BRAND.gray500 }">{{ subtitle }}</p>
    </div>
    <slot name="actions" />
  </header>
</template>
