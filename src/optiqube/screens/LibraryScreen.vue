<script setup>
import { computed, ref } from 'vue'
import { Image as ImageIcon, X } from 'lucide-vue-next'
import { BRAND, FONT, MODAL_SHADOW } from '../tokens'
import { inspirationCatalog, activeBrand, navigate } from '../store'

const filter = ref('all')
const preview = ref(null)

const styles = computed(() => ['all', ...new Set(inspirationCatalog.map((i) => i.styleLabel))])

const filtered = computed(() =>
  filter.value === 'all'
    ? inspirationCatalog
    : inspirationCatalog.filter((i) => i.styleLabel === filter.value),
)

function useInspiration() {
  preview.value = null
  navigate('/session')
}
</script>

<template>
  <div class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">
          Inspiration library
        </h1>
        <p class="mt-2 max-w-2xl text-sm" :style="{ color: BRAND.gray500 }">
          Catalog creatives from the OptiQube gallery. Pick one as a starting point for
          <span class="font-medium" :style="{ color: BRAND.ink }">{{ activeBrand().domain }}</span>.
        </p>
      </div>
      <button
        type="button"
        class="text-sm font-medium"
        :style="{ color: BRAND.blue }"
        @click="navigate('/session')"
      >
        Back to New task
      </button>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="s in styles"
        :key="s"
        type="button"
        @click="filter = s"
        class="rounded-full border px-3 py-1 text-xs font-medium capitalize"
        :style="{
          borderColor: filter === s ? BRAND.blue : BRAND.gray200,
          background: filter === s ? BRAND.blueSoft : BRAND.surface,
          color: filter === s ? BRAND.blue : BRAND.ink,
        }"
      >
        {{ s === 'all' ? 'All' : s }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <button
        v-for="card in filtered"
        :key="card.id"
        type="button"
        @click="preview = card"
        class="overflow-hidden rounded-xl border p-2 text-left transition-shadow hover:shadow-[var(--oq-shadow-lift)]"
        :style="{ borderColor: BRAND.gray200, background: BRAND.surface }"
      >
        <img
          v-if="card.imageUrl"
          :src="card.imageUrl"
          :alt="card.title"
          loading="lazy"
          class="aspect-square w-full rounded-lg object-cover"
          :style="{ background: BRAND.mediaMat }"
        />
        <div
          v-else
          class="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg"
          :style="{ background: BRAND.blueSoft, color: BRAND.blue }"
        >
          <ImageIcon class="size-6 opacity-70" />
          <span class="text-[10px] font-medium">{{ card.styleLabel }}</span>
        </div>
        <p class="mt-2 truncate text-xs font-medium" :style="{ color: BRAND.ink }">{{ card.title }}</p>
        <p class="truncate text-[11px]" :style="{ color: BRAND.gray500 }">
          {{ card.brandName }} · {{ card.styleLabel }}
        </p>
      </button>
    </div>

    <div
      class="mt-10 rounded-xl border p-4"
      :style="{ borderColor: BRAND.gray200, background: BRAND.surfaceBlur }"
    >
      <p class="text-sm font-semibold" :style="{ color: BRAND.ink }">Your designs</p>
      <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">
        Concepts you generate will show up here later.
      </p>
    </div>

    <div
      v-if="preview"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click="preview = null"
    >
      <div
        class="grid w-full max-w-[57.6rem] overflow-hidden rounded-2xl sm:grid-cols-[1fr_336px]"
        :style="{ background: BRAND.surface, boxShadow: MODAL_SHADOW }"
        @click.stop
      >
        <div class="p-6" :style="{ background: BRAND.blueSoft }">
          <img
            v-if="preview.imageUrl"
            :src="preview.imageUrl"
            :alt="preview.title"
            class="aspect-square w-full rounded-lg object-cover"
            :style="{ background: BRAND.mediaMat }"
          />
        </div>
        <div class="flex flex-col p-5">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide" :style="{ color: BRAND.gray500 }">
                Inspiration
              </p>
              <h2 class="mt-1 text-lg font-semibold" :style="{ color: BRAND.ink }">{{ preview.title }}</h2>
              <p class="mt-1 text-sm" :style="{ color: BRAND.gray500 }">
                {{ preview.brandName }} · {{ preview.styleLabel }}
              </p>
            </div>
            <button type="button" @click="preview = null" class="rounded-md p-1" aria-label="Close">
              <X class="size-4" :style="{ color: BRAND.gray500 }" />
            </button>
          </div>
          <p class="mt-4 flex-1 text-sm leading-relaxed" :style="{ color: BRAND.gray600 }">
            Start a new task for
            <strong :style="{ color: BRAND.ink }">{{ activeBrand().domain }}</strong>
            using this creative as a visual reference.
          </p>
          <button
            type="button"
            @click="useInspiration"
            class="mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            :style="{ background: BRAND.blueSolid }"
          >
            Use this as Inspiration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
