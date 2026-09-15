<script setup>
import { computed } from 'vue'
import { Image as ImageIcon } from 'lucide-vue-next'
import { BRAND, POPOVER_SHADOW } from '../tokens'
import { presetMockup } from '../store'

const props = defineProps({
  previewUrl: { type: String, default: null },
  /** Null on a campaign with no recorded style — the placeholder goes neutral. */
  presetId: { type: String, default: null },
})

const mock = computed(() => presetMockup(props.presetId))
</script>

<template>
  <img
    v-if="props.previewUrl"
    :src="props.previewUrl"
    alt=""
    class="size-[72px] rounded-xl border object-cover"
    :style="{ borderColor: BRAND.gray200 }"
  />
  <div
    v-else
    class="relative flex size-[72px] items-center justify-center overflow-hidden rounded-xl border"
    :style="{
      borderColor: BRAND.gray200,
      background: `linear-gradient(145deg, ${mock.from}, ${mock.to})`,
    }"
  >
    <div
      class="flex h-[54px] w-[46px] flex-col overflow-hidden rounded-md"
      :style="{ background: BRAND.surface, boxShadow: POPOVER_SHADOW }"
    >
      <div class="h-2.5" :style="{ background: mock.from }" />
      <div class="flex flex-1 flex-col gap-1 p-1">
        <div class="h-1 rounded-sm" :style="{ background: BRAND.gray200 }" />
        <div class="h-1 w-[70%] rounded-sm" :style="{ background: BRAND.gray200 }" />
        <div class="mt-auto flex items-center justify-center">
          <ImageIcon class="size-3" :style="{ color: BRAND.gray400 }" />
        </div>
      </div>
    </div>
  </div>
</template>
