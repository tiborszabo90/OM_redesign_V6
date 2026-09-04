<script setup>
import { ref, computed, watch } from 'vue'

// How many of the products that still need an image to generate right now.
// Used on the generate step and again on a variation's fine-tune page when
// products are still waiting for their first image.
const props = defineProps({
  remaining: { type: Number, required: true },   // products without an image yet
  modelValue: { type: Number, default: 0 },      // resolved batch size
})
const emit = defineEmits(['update:modelValue'])

const scope = ref(25)
const customAmount = ref(50)

// The presets are always the same four; a preset larger than what is left just
// resolves to everything that is left.
const presets = [5, 10, 25, 100]

const limit = computed(() => {
  if (scope.value === 'all') return props.remaining
  if (scope.value === 'custom') {
    const n = Math.floor(Number(customAmount.value) || 0)
    return Math.min(Math.max(n, 1), props.remaining)
  }
  return Math.min(scope.value, props.remaining)
})

watch(limit, v => emit('update:modelValue', v), { immediate: true })
</script>

<template>
  <div>
    <p class="font-semibold text-[#1a1a1a] mb-1">How many products to generate?</p>
    <p class="text-[12px] text-[#616161] mb-3">
      Generate images for the next products that don't have one yet. You can top up the rest later.
    </p>

    <div class="flex items-center gap-2 flex-wrap">
      <button
        v-for="n in presets" :key="n"
        class="rounded-lg border px-3 py-1.5 text-[13px] cursor-pointer transition-colors"
        :class="scope === n ? 'border-[#b2592e] bg-[#fdf4ef] text-[#6b3319] font-semibold' : 'border-[#d4d4d4] text-[#303030] hover:border-[#a0a0a0]'"
        @click="scope = n"
      >Next {{ n }}</button>
      <button
        class="rounded-lg border px-3 py-1.5 text-[13px] cursor-pointer transition-colors"
        :class="scope === 'all' ? 'border-[#b2592e] bg-[#fdf4ef] text-[#6b3319] font-semibold' : 'border-[#d4d4d4] text-[#303030] hover:border-[#a0a0a0]'"
        @click="scope = 'all'"
      >All {{ remaining }}</button>
      <button
        class="rounded-lg border px-3 py-1.5 text-[13px] cursor-pointer transition-colors"
        :class="scope === 'custom' ? 'border-[#b2592e] bg-[#fdf4ef] text-[#6b3319] font-semibold' : 'border-[#d4d4d4] text-[#303030] hover:border-[#a0a0a0]'"
        @click="scope = 'custom'"
      >Custom</button>
    </div>

    <div v-if="scope === 'custom'" class="flex items-center gap-2 mt-3">
      <input
        v-model.number="customAmount"
        type="number" min="1" :max="remaining"
        class="w-28 rounded-lg border border-[#d4d4d4] px-3 py-1.5 text-[13px] outline-none focus:border-[#b2592e]"
      />
      <span class="text-[13px] text-[#616161]">products (max {{ remaining }})</span>
    </div>

    <p class="text-[12px] text-[#616161] mt-3">
      Generating the next <span class="font-semibold text-[#1a1a1a]">{{ limit }}</span> of {{ remaining }} products that still need an image.
    </p>
  </div>
</template>
