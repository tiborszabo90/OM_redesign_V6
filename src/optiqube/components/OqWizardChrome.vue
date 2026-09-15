<script setup>
import { BRAND, FONT } from '../tokens'
import { navigate } from '../store'

defineProps({
  brandLine: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  steps: { type: Array, default: () => [] },
  activeStep: { type: Number, default: 0 },
  backPath: { type: String, default: '/settings' },
  backLabel: { type: String, default: '← Settings' },
})
</script>

<template>
  <div class="w-full px-6 py-8" :style="{ fontFamily: FONT }">
    <button type="button" class="text-sm font-medium" :style="{ color: BRAND.blue }" @click="navigate(backPath)">
      {{ backLabel }}
    </button>

    <p v-if="brandLine" class="mt-4 text-xs font-medium" :style="{ color: BRAND.gray500 }">
      {{ brandLine }}
    </p>
    <h1 class="mt-1 text-3xl font-semibold tracking-tight" :style="{ color: BRAND.ink }">{{ title }}</h1>
    <p v-if="description" class="mt-2 max-w-xl text-[15px] leading-relaxed" :style="{ color: BRAND.gray500 }">
      {{ description }}
    </p>

    <div v-if="steps.length" class="mt-5 flex flex-wrap gap-2">
      <span
        v-for="(label, i) in steps"
        :key="label"
        class="rounded-full border px-2.5 py-1 text-[11px] font-medium"
        :style="
          i === activeStep
            ? { borderColor: BRAND.blue, background: BRAND.blueSoft, color: BRAND.blue }
            : i < activeStep
              ? { borderColor: BRAND.successLine, background: BRAND.successSoft, color: BRAND.emeraldText }
              : { borderColor: BRAND.gray200, color: BRAND.gray500 }
        "
      >
        {{ i + 1 }}. {{ label }}
      </span>
    </div>

    <div class="mt-8 max-w-lg">
      <slot />
    </div>
  </div>
</template>
