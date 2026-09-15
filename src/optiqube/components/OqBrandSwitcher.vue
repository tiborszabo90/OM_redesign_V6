<script setup>
import { ref } from 'vue'
import { ChevronsUpDown, Check, Plus } from 'lucide-vue-next'
import { BRAND, POPOVER_SHADOW } from '../tokens'
import { brands, activeBrand, state } from '../store'

const open = ref(false)

function pick(id) {
  state.activeBrandId = id
  open.value = false
}
</script>

<template>
  <div class="relative mt-3">
    <button
      type="button"
      @click="open = !open"
      class="flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors hover:bg-[var(--oq-blue-soft)]"
      :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
    >
      <div
        class="flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
        :style="{ background: BRAND.blueSolid }"
      >
        {{ activeBrand().name.slice(0, 1).toUpperCase() }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold" :style="{ color: BRAND.ink }">{{ activeBrand().name }}</p>
        <p class="truncate text-[11px]" :style="{ color: BRAND.gray500 }">{{ activeBrand().domain }}</p>
      </div>
      <ChevronsUpDown class="size-4 shrink-0" :style="{ color: BRAND.gray400 }" />
    </button>

    <div
      v-if="open"
      class="absolute left-0 right-0 top-[calc(100%+4px)] z-40 overflow-hidden rounded-lg border py-1"
      :style="{ borderColor: BRAND.gray200, background: BRAND.surfaceRaised, boxShadow: POPOVER_SHADOW }"
    >
      <div class="max-h-[308px] overflow-y-auto">
        <button
          v-for="b in brands"
          :key="b.id"
          type="button"
          @click="pick(b.id)"
          class="flex w-full items-center gap-2 px-2.5 py-2 text-left text-sm hover:bg-[var(--oq-blue-soft)]"
        >
          <div
            class="flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
            :style="{ background: b.id === state.activeBrandId ? BRAND.blueSolid : BRAND.gray400 }"
          >
            {{ b.name.slice(0, 1).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium" :style="{ color: BRAND.ink }">{{ b.name }}</p>
            <p class="truncate text-[11px]" :style="{ color: BRAND.gray500 }">{{ b.domain }}</p>
          </div>
          <Check v-if="b.id === state.activeBrandId" class="size-4" :style="{ color: BRAND.blue }" />
        </button>
      </div>
      <div class="mt-1 border-t px-1 pt-1" :style="{ borderColor: BRAND.gray200 }">
        <button
          type="button"
          @click="open = false"
          class="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium transition-colors hover:bg-[var(--oq-blue-soft)]"
          :style="{ color: BRAND.blue }"
        >
          <Plus class="size-4 shrink-0" />
          Add domain
        </button>
      </div>
    </div>
  </div>
</template>
